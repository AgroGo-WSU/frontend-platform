import "../../stylesheets/ProfileDisplay.css"
import ProfileImage from "./ProfileImage"


function ProfileDisplay() {

    return (
        <div className="profile-display-container">
            <ProfileImage />
            {/* Example placeholders of the info that will go here */}
            <div className="name">Madeline</div>
            <div className="location">Detroit, MI</div>
            <div className="next-water">Next water: Monday, 5pm</div>
            <div className="next-fan">Next fan: Monday, 5:15pm</div>
            <div className="growing-since">Growing since 2025</div>
        </div>
    )
}

export default ProfileDisplay;