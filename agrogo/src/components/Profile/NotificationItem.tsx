import "../../stylesheets/NotificationItem.css";

type NotificationItemProps = {
  id: string;
  severity: string;
  message: string;
}

function NotificationItem({ id, severity, message}: NotificationItemProps) {
  const severityMap = {
    "blue": "info",
    "green": "jobs",
    "red": "alert"
  };

  // Convert the severity to an end-user friendly format
  const displaySeverity = severityMap[severity] ?? severity;
  
  return (
    <div key={id} className={`notification-item ${severity}-notif`}>
      <div className="notif-header">
        <span className={`notif-severity ${severity}`}>{displaySeverity.toUpperCase()}</span>
      </div>
      <p className="notif-message">{message}</p>
    </div>
  );
}

export default NotificationItem;