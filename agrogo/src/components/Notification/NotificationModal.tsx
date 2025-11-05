import { Offcanvas } from "react-bootstrap";
import "./NotificationModal.css";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
};

type Props = {
  show: boolean;
  onHide: () => void;
  items?: NotificationItem[];
};

export default function NotificationModal({ show, onHide, items = [] }: Props) {
  return (
    <Offcanvas
      placement="end"
      show={show}
      onHide={onHide}
      scroll
      backdrop
      className="agro-notifs-modal"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="agro-notifs-title">
          Notifications
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        {items.length === 0 ? (
          <div className="agro-notifs-empty">
            <p>No notifications yet.</p>
            <p className="muted">
              You’ll see plant tips, alerts, and system updates here.
            </p>
          </div>
        ) : (
          <ul className="agro-notifs-list">
            {items.map((n) => (
              <li className="agro-notif" key={n.id}>
                <div className="agro-notif-dot" />
                <div className="agro-notif-content">
                  <div className="agro-notif-title">{n.title}</div>
                  <div className="agro-notif-body">{n.body}</div>
                  <div className="agro-notif-time">{n.time}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
