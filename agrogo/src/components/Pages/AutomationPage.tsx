import { useMemo, useState, useEffect } from "react";
import TopNav from "../TopNav";
import "../../stylesheets/AutomationPage.css";

/* ---------- Helpers ---------- */
type FanItem = { on: string; off: string };            // "HH:MM"
type ZoneItem = { name: string; times: string[] };     // times as "HH:MM"

const LS_FAN = "agro.auto.fan";
const LS_ZONES = "agro.auto.zones";

function fmt12h(t: string) {
  // "08:30" -> "8:30 AM"
  const [hStr, mStr] = t.split(":");
  const h = Number(hStr);
  const am = h < 12;
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${mStr} ${am ? "AM" : "PM"}`;
}

function loadFan(): FanItem[] {
  try {
    const raw = localStorage.getItem(LS_FAN);
    if (raw) return JSON.parse(raw) as FanItem[];
  } catch (err) {
    console.warn("Failed to load fan schedule from localStorage:", err);
  }
  return [];
}
function saveFan(v: FanItem[]) {
  try {
    localStorage.setItem(LS_FAN, JSON.stringify(v));
  } catch (err) {
    console.warn("Failed to save fan schedule:", err);
  }
}

function loadZones(): ZoneItem[] {
  try {
    const raw = localStorage.getItem(LS_ZONES);
    if (raw) return JSON.parse(raw) as ZoneItem[];
  } catch (err) {
    console.warn("Failed to load zones from localStorage:", err);
  }
  return [
    { name: "Watering Zone 1", times: [] }
  ];
}
function saveZones(v: ZoneItem[]) {
  try {
    localStorage.setItem(LS_ZONES, JSON.stringify(v));
  } catch (err) {
    console.warn("Failed to save zones:", err);
  }
}

/* ---------- Inline modal  ---------- */
function InlineModal(props: {
  open: boolean;
  title: string;
  onClose: () => void;
  onPrimary?: () => void;
  onSecondary?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  children?: React.ReactNode;
}) {
  const {
    open,
    title,
    onClose,
    onPrimary,
    onSecondary,
    primaryLabel = "Save",
    secondaryLabel = "Cancel",
    children,
  } = props;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="agro-modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="agro-modal" onClick={(e) => e.stopPropagation()}>
        <div className="agro-modal-header">
          <h3>{title}</h3>
          <button className="agro-modal-close" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="agro-modal-body">{children}</div>

        <div className="agro-modal-actions">
          <button className="agro-btn outline" type="button" onClick={onSecondary ?? onClose}>
            {secondaryLabel}
          </button>
          <button className="agro-btn solid" type="button" onClick={onPrimary ?? onClose}>
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
type Domain = "Fan" | "Watering" | "Zone";
type ActionKind = "Add" | "Edit" | "Delete";

export default function AutomationPage() {
  // data 
  const [fan, setFan] = useState<FanItem[]>(loadFan);
  const [zones, setZones] = useState<ZoneItem[]>(loadZones);

  
  useEffect(() => saveFan(fan), [fan]);
  useEffect(() => saveZones(zones), [zones]);

  // modal state
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState<Domain>("Watering");
  const [kind, setKind] = useState<ActionKind>("Add");

  // form fields shared by modals
  const [zoneIdx, setZoneIdx] = useState(0);
  const [time, setTime] = useState("08:30");
  const [timeIdx, setTimeIdx] = useState(0);
  const [fanIdx, setFanIdx] = useState(0);
  const [onTime, setOnTime] = useState("09:00");
  const [offTime, setOffTime] = useState("13:00");
  const [zoneName, setZoneName] = useState("");

  useEffect(() => {
    if (zoneIdx < 0 || zoneIdx >= zones.length) setZoneIdx(0);
  }, [zones.length, zoneIdx]);

  const title = useMemo(() => `${kind} ${domain}`, [kind, domain]);

  const openModal = (d: Domain, k: ActionKind) => {
    setDomain(d);
    setKind(k);
    setZoneIdx(0);
    setTime("08:30");
    setTimeIdx(0);
    setFanIdx(0);
    setOnTime("09:00");
    setOffTime("13:00");
    setZoneName(zones[0]?.name ?? "");
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  /* ---------- Actions ---------- */
  const doPrimary = () => {
    if (domain === "Watering") {
      const z = [...zones];
      if (!z.length) return closeModal();

      if (kind === "Add") {
        z[zoneIdx].times = [...z[zoneIdx].times, time].sort();
        setZones(z);
      } else if (kind === "Edit") {
        if (z[zoneIdx].times[timeIdx] == null) return closeModal();
        z[zoneIdx].times[timeIdx] = time;
        z[zoneIdx].times.sort();
        setZones(z);
      } else if (kind === "Delete") {
        if (z[zoneIdx].times[timeIdx] == null) return closeModal();
        z[zoneIdx].times.splice(timeIdx, 1);
        setZones(z);
      }
    }

    if (domain === "Fan") {
      const f = [...fan];
      if (kind === "Add") {
        f.push({ on: onTime, off: offTime });
        f.sort((a, b) => a.on.localeCompare(b.on));
        setFan(f);
      } else if (kind === "Edit") {
        if (f[fanIdx] == null) return closeModal();
        f[fanIdx] = { on: onTime, off: offTime };
        f.sort((a, b) => a.on.localeCompare(b.on));
        setFan(f);
      } else if (kind === "Delete") {
        if (f[fanIdx] == null) return closeModal();
        f.splice(fanIdx, 1);
        setFan(f);
      }
    }

    if (domain === "Zone") {
      const z = [...zones];
      if (kind === "Add") {
        const nextName = zoneName.trim() || `Watering Zone ${z.length + 1}`;
        z.push({ name: nextName, times: [] });
        setZones(z);
      } else if (kind === "Edit") {
        if (z[zoneIdx] == null) return closeModal();
        z[zoneIdx].name = zoneName.trim() || z[zoneIdx].name;
        setZones(z);
      } else if (kind === "Delete") {
        if (z[zoneIdx] == null) return closeModal();
        z.splice(zoneIdx, 1);
        setZones(z);
      }
    }

    closeModal();
  };

  /* ---------- Render ---------- */
  return (
    <>
      <TopNav />
      <main className="auto-page">
        <div className="auto-container">
          {/* ======= Dynamic top row: Fan + zones  ======= */}
          <section
            className="auto-grid top-row"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
          >
            {/* Fan Schedule */}
            <div className="auto-card fan-schedule">
              <h2 className="card-title">Fan Schedule</h2>
              <ol className="numbered-list">
                {fan.length === 0 ? (
                  <li>
                    <span className="val" style={{ fontWeight: 600, opacity: 0.8 }}>
                      No entries yet
                    </span>
                  </li>
                ) : (
                  fan.map((it, i) => (
                    <li key={i}>
                      <span className="num">{i + 1}</span>
                      <span className="val">
                        {fmt12h(it.on)} <span style={{ fontWeight: 700 }}>ON</span> |{" "}
                        {fmt12h(it.off)} <span style={{ fontWeight: 700 }}>OFF</span>
                      </span>
                    </li>
                  ))
                )}
              </ol>
            </div>

            {/* Zones */}
            {zones.map((z, zi) => (
              <div className="auto-card zone-card" key={zi}>
                <h2 className="card-title center">{z.name}</h2>
                <ol className="numbered-list">
                  {z.times.length === 0 ? (
                    <li>
                      <span className="val" style={{ fontWeight: 600, opacity: 0.8 }}>
                        No times
                      </span>
                    </li>
                  ) : (
                    z.times.map((t, ti) => (
                      <li key={ti}>
                        <span className="num">{ti + 1}</span>
                        <span className="val">{fmt12h(t)}</span>
                      </li>
                    ))
                  )}
                </ol>
              </div>
            ))}
          </section>

          {/* ======= Settings row ======= */}
          <section className="auto-grid bottom-row">
            {/* Fan Settings */}
            <div className="auto-card settings-card">
              <h3 className="card-title center">Fan Settings</h3>
              <ul className="action-list center-actions">
                <li>
                  <button className="linky" type="button" onClick={() => openModal("Fan", "Add")}>
                    Add Fanning
                  </button>
                </li>
                <li>
                  <button className="linky" type="button" onClick={() => openModal("Fan", "Delete")}>
                    Delete Fanning
                  </button>
                </li>
                <li>
                  <button className="linky" type="button" onClick={() => openModal("Fan", "Edit")}>
                    Edit Fanning
                  </button>
                </li>
              </ul>
            </div>

            {/* Watering Settings */}
            <div className="auto-card settings-card">
              <h3 className="card-title center">Watering Settings</h3>
              <ul className="action-list center-actions">
                <li>
                  <button className="linky" type="button" onClick={() => openModal("Watering", "Add")}>
                    Add Watering
                  </button>
                </li>
                <li>
                  <button className="linky" type="button" onClick={() => openModal("Watering", "Delete")}>
                    Delete Watering
                  </button>
                </li>
                <li>
                  <button className="linky" type="button" onClick={() => openModal("Watering", "Edit")}>
                    Edit Watering
                  </button>
                </li>
              </ul>
            </div>

            {/* Zone Settings */}
            <div className="auto-card settings-card">
              <h3 className="card-title center">Zone Settings</h3>
              <ul className="action-list center-actions">
                <li>
                  <button className="linky" type="button" onClick={() => openModal("Zone", "Add")}>
                    Add Zone
                  </button>
                </li>
                <li>
                  <button className="linky" type="button" onClick={() => openModal("Zone", "Delete")}>
                    Delete Zone
                  </button>
                </li>
                <li>
                  <button className="linky" type="button" onClick={() => openModal("Zone", "Edit")}>
                    Edit Zone
                  </button>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      {/* ===== Modal ===== */}
      <InlineModal
        open={open}
        title={title}
        onClose={closeModal}
        onPrimary={doPrimary}
        primaryLabel={kind === "Delete" ? "Confirm" : "Save"}
        secondaryLabel="Cancel"
      >
        <form
          className="agro-form"
          onSubmit={(e) => {
            e.preventDefault();
            doPrimary();
          }}
        >
          {domain === "Watering" && (
            <>
              <label className="agro-label">
                Zone
                <select
                  className="agro-input"
                  value={zoneIdx}
                  onChange={(e) => setZoneIdx(Number(e.target.value))}
                >
                  {zones.map((z, i) => (
                    <option value={i} key={i}>
                      {z.name || `Zone ${i + 1}`}
                    </option>
                  ))}
                </select>
              </label>

              {(kind === "Edit" || kind === "Delete") && (
                <label className="agro-label">
                  Existing time
                  <select
                    className="agro-input"
                    value={timeIdx}
                    onChange={(e) => setTimeIdx(Number(e.target.value))}
                  >
                    {zones[zoneIdx]?.times.map((t, i) => (
                      <option value={i} key={i}>
                        {fmt12h(t)}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {(kind === "Add" || kind === "Edit") && (
                <label className="agro-label">
                  Time
                  <input
                    className="agro-input"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </label>
              )}
            </>
          )}

          {domain === "Fan" && (
            <>
              {(kind === "Edit" || kind === "Delete") && (
                <label className="agro-label">
                  Existing entry
                  <select
                    className="agro-input"
                    value={fanIdx}
                    onChange={(e) => setFanIdx(Number(e.target.value))}
                  >
                    {fan.map((f, i) => (
                      <option value={i} key={i}>
                        {fmt12h(f.on)} ON | {fmt12h(f.off)} OFF
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {(kind === "Add" || kind === "Edit") && (
                <div style={{ display: "grid", gap: "10px" }}>
                  <label className="agro-label">
                    ON time
                    <input
                      className="agro-input"
                      type="time"
                      value={onTime}
                      onChange={(e) => setOnTime(e.target.value)}
                    />
                  </label>
                  <label className="agro-label">
                    OFF time
                    <input
                      className="agro-input"
                      type="time"
                      value={offTime}
                      onChange={(e) => setOffTime(e.target.value)}
                    />
                  </label>
                </div>
              )}
            </>
          )}

          {domain === "Zone" && (
            <>
              {(kind === "Edit" || kind === "Delete") && (
                <label className="agro-label">
                  Select zone
                  <select
                    className="agro-input"
                    value={zoneIdx}
                    onChange={(e) => {
                      const i = Number(e.target.value);
                      setZoneIdx(i);
                      setZoneName(zones[i]?.name ?? "");
                    }}
                  >
                    {zones.map((z, i) => (
                      <option value={i} key={i}>
                        {z.name || `Zone ${i + 1}`}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {(kind === "Add" || kind === "Edit") && (
                <label className="agro-label">
                  Zone name
                  <input
                    className="agro-input"
                    type="text"
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                    placeholder="e.g., Watering Zone 4"
                  />
                </label>
              )}
            </>
          )}
        </form>
      </InlineModal>
    </>
  );
}
