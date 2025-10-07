// src/components/ConnectivityStatus.tsx
import { useEffect, useState } from "react";
import "../stylesheets/ConnectivityStatus.css";

type Props = {
  endpoint?: string;
  intervalMs?: number;
  freshnessMinutes?: number;
};

type DeviceRow = {
  id: string;
  device_id: string;
  received_at: string; // ISO timestamp
};

export default function ConnectivityStatus({
  endpoint = "https://backend.agrogodev.workers.dev/api/data/Raspi001",
  intervalMs = 30_000,
  freshnessMinutes = 5,
}: Props) {
  const [online, setOnline] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function check() {
    try {
      setError(null);
      const res = await fetch(endpoint, { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as unknown;

      const rows = Array.isArray(data) ? (data as DeviceRow[]) : [];
      const latest = rows?.[0]?.received_at;

      let isFresh = false;
      if (latest) {
        const dt = new Date(latest);
        const now = new Date();
        const diffMinutes = (now.getTime() - dt.getTime()) / 1000 / 60;
        isFresh = diffMinutes <= freshnessMinutes;
      }

      setOnline(rows.length > 0 && isFresh);
    } catch (e: unknown) {
      setOnline(false);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLastCheck(new Date());
    }
  }

  useEffect(() => {
    check(); // initial
    const id = setInterval(check, intervalMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, intervalMs, freshnessMinutes]);

  const title =
    online === null ? "Checking Pi status…" : online ? "Pi Online" : "Pi Offline";

  return (
    <div className="connection-status" title={title} aria-label={title} role="status">
      <span
        className={`status-dot ${
          online ? "online" : online === false ? "offline" : "checking"
        }`}
      />
      <span className="status-text">
        {online === null ? "Checking…" : online ? "Online" : "Offline"}
      </span>
      {lastCheck && (
        <span className="status-checked">• checked {lastCheck.toLocaleTimeString()}</span>
      )}
      {error && <span className="status-error" aria-live="polite"> (err: {error})</span>}
    </div>
  );
}
