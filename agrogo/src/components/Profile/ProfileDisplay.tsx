import "../../stylesheets/ProfileDisplay.css";
import "../../stylesheets/SidebarColumn.css"; // NEW
import ProfileImage from "./ProfileImage";
import PlanBubble from "../Plan/PlanBubble";
import NotificationsPanel from "../Notification/NotificationsPanel";
import { useNotifications } from "../../hooks/UseNotifications";
import ProfileMini from "./ProfileMini";
import Humidity from '../../components/Humidity';
import Temp from '../../components/Temp';
import { useContext } from 'react';
import { AuthContext } from '../../hooks/UseAuth';
import ConnectivityStatus from "../ConnectivityStatus";

function ProfileDisplay() {
    const { items, clear } = useNotifications();

    // grabbing our current user from the Authentication context we created
    const { currentUser } = useContext(AuthContext);
  
    let userName = "friend";
    if(currentUser) {
      userName = currentUser.displayName!;
    }

  return (
    <div className="profile-display-all">
      <aside className="sidebar-column">
      {/* Profile Card */}
      <div className="profile-display-container d-none d-xl-block">
        <ProfileImage />

      <div className="name">{userName}</div>

      {/* Today’s Plan */}
      <PlanBubble />

      {/* connection, humidity, temp */}
      <div className="d-none d-xl-block"><ConnectivityStatus /></div>
      <div className="d-none d-xl-block"><Humidity /></div>
      <div className="d-none d-xl-block"><Temp /></div>

      {/* Today’s Plan bubble
      <div className="d-none d-xl-block">
      <PlanBubble />
      </div> */}

      <div className="profile-mini d-xl-none">
			  <ProfileMini />
		  </div>
        
           {/* Notifications */}
      <NotificationsPanel items={items} onClearAll={clear} />
        {/* Example placeholders of the info that will go here */}
    
      </div>
      </aside>
    </div>
    
  );
}

export default ProfileDisplay;
