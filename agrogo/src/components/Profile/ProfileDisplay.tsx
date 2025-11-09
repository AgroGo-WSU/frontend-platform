import "../../stylesheets/ProfileDisplay.css";
import "../../stylesheets/SidebarColumn.css"; // NEW
import ProfileImage from "./ProfileImage";
import ProfileMini from "./ProfileMini";
import { useContext } from 'react';
import { AuthContext } from '../../hooks/UseAuth';
import ConnectivityStatus from "../ConnectivityStatus";

function ProfileDisplay() {
    // const { items, clear } = useNotifications();

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



      {/* connection, humidity, temp */}
      <div className="d-none d-xl-block"><ConnectivityStatus /></div>



      <div className="profile-mini d-xl-none">
			  <ProfileMini />
		  </div>
        

    
      </div>
      </aside>
    </div>
    
  );
}

export default ProfileDisplay;
