import "../../stylesheets/ProfileDisplay.css";
import ProfileImage from "./ProfileImage";
import PlanBubble from "../Plan/PlanBubble";
import { useContext } from 'react';
import { AuthContext } from '../../hooks/UseAuth';

function ProfileDisplay() {

    // grabbing our current user from the Authentication context we created
    const { currentUser } = useContext(AuthContext);
  
    let userName = "friend";
    if(currentUser) {
      userName = currentUser.displayName;
    }

  return (
    <div className="profile-display-all">
      {/* Profile Card */}
      <div className="profile-display-container">
        <ProfileImage />
        {/* Example placeholders of the info that will go here */}
        <div className="name">{userName}</div>
      </div>

      {/* Today’s Plan bubble */}
      <PlanBubble />
    </div>
  );
}

export default ProfileDisplay;
