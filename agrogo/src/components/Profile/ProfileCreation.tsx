import "../../stylesheets/ProfileCreation.css"
import SmallTitle from "../SmallTitle";

function ProfileCreation() {

    return(
        <div className="profile-creation-container">
            <SmallTitle title="Create your profile"/>
            <div className="profile-form-container">
             <form className="flex-form">
                <div className="field"><label htmlFor="first-name">First name:</label>
                <input type="text" id="first-name" name="first-name"></input></div>
                <div className="field"><label htmlFor="last-name">Last name:</label>
                <input type="text" id="last-name" name="last-name"></input></div>
                <div className="field"><label htmlFor="location">Location:</label>
                <input type="text" id="location" name="location"></input></div>
                <div className="field"><label id="image-label" htmlFor="profile-image">Upload a profile picture:</label>
                <input type="file" id="profile-image" name="profile-image"></input></div>
            </form>
            </div> 
        </div>
        )
}

export default ProfileCreation;