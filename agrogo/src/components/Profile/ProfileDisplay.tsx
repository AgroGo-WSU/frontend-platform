import "../../stylesheets/ProfileDisplay.css"
import ProfileImage from "./ProfileImage"


function ProfileDisplay() {

    return (
        <div className="profile-display-container">
            <ProfileImage />
            <div className="name">Madeline</div>
            <div className="Location">Detroit, MI</div>
        </div>
    )
}

export default ProfileDisplay;