import "../../stylesheets/NotificationItem.css";

type NotificationItemProps = {
  key: string;
  severity: string;
  message: string;
}

function NotificationItem({ key, severity, message}: NotificationItemProps) {
  return (
    <div key={key} className="notification-item">
      <div className="notif-header">
        <span className={`notif-severity ${severity}`}>{severity.toUpperCase()}</span>
      </div>
      <p className="notif-message">{message}</p>
    </div>
  )
}

export default NotificationItem;