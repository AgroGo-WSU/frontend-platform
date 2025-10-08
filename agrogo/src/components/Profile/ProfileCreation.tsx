import "../../stylesheets/ProfileCreation.css"
import SmallTitle from "../SmallTitle";

function ProfileCreation() {

    return(
        <div className="profile-creation-container">
            <SmallTitle title="Create your profile"/>
            <div className="profile-form-container">
             <form>
                <label htmlFor="first-name">First name:</label>
                <input type="text" id="first-name" name="first-name"></input>
                <label htmlFor="last-name">Last name:</label>
                <input type="text" id="last-name" name="last-name"></input>
                <label htmlFor="location">Location:</label>
                <input type="text" id="location" name="location"></input>
            </form>
            </div> 
        </div>
        )
}

export default ProfileCreation;