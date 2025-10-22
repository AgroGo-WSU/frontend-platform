import "../../stylesheets/ProfileDisplay.css";
import "../../stylesheets/SidebarColumn.css"; // NEW
import ProfileImage from "./ProfileImage";
import PlanBubble from "../Plan/PlanBubble";
import NotificationsPanel from "../Notification/NotificationsPanel";
import { useNotifications } from "../../hooks/UseNotifications";

function ProfileDisplay() {
  const { items, clear } = useNotifications();

  return (
    <aside className="sidebar-column">
      {/* Profile Card */}
      <div className="profile-display-container">
        <ProfileImage />
        {/* placeholders */}
        <div className="name">Madeline</div>
        <div className="location">Detroit, MI</div>
        <div className="next-water">Next water: Monday, 5pm</div>
        <div className="next-fan">Next fan: Monday, 5:15pm</div>
        <div className="growing-since">Growing since 2025</div>
      </div>

      {/* Today’s Plan */}
      <PlanBubble />

      {/* Notifications */}
      <NotificationsPanel items={items} onClearAll={clear} />
    </aside>
  );
}

export default ProfileDisplay;
