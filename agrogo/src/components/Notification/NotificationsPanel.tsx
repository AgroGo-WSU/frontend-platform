import React from "react";
import "../../stylesheets/Notifications.css";
import type { Notification } from "./types";

function Dot({ kind }: { kind: Notification["kind"] }) {
  return <span className={`notif-dot notif-${kind}`} aria-hidden="true" />;
}

function timeAgo(iso: string) {
  const d = new Date(iso);
  const ms = Date.now() - d.getTime();
  const m = Math.max(1, Math.floor(ms / 60000));
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

export interface NotificationsPanelProps {
  title?: string;
  items: Notification[];
  onClearAll?: () => void;
  className?: string;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  title = "Notifications",
  items,
  onClearAll,
  className,
}) => {
  return (
    <section
      className={`notifications-bubble ${className ?? ""}`}
      aria-label={title}
    >
      <header className="notifications-title">
        <span className="notifications-title-text">{title}</span>
        <button
          className="notifications-clear"
          onClick={onClearAll}
          disabled={!items.length}
          aria-disabled={!items.length}
        >
          Clear
        </button>
      </header>

      <div className="notifications-list" role="list">
        {items.length === 0 ? (
          <div className="notifications-empty" role="status">
            No notifications yet.
          </div>
        ) : (
          items.map((n) => (
            <article key={n.id} role="listitem" className="notifications-row">
              <Dot kind={n.kind} />
              <div className="notification-body">
                <div className="notification-title">{n.title}</div>
                {n.message && (
                  <div className="notification-message">{n.message}</div>
                )}
              </div>
              <time className="notification-time" dateTime={n.createdAt}>
                {timeAgo(n.createdAt)}
              </time>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default NotificationsPanel;
