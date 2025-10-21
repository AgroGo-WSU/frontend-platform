import Dropdown from 'react-bootstrap/Dropdown';
import "../../stylesheets/ProfileMini.css"

function ProfileMini() {

    return(
        <div className="mini-container">
            <img className="profile-mini-image-display" src="../../src/assets/icons/profile-icon-549227.svg"></img>
            <div className="plan-bubble-mini">
            <Dropdown>
               <Dropdown.Toggle variant="success" id="dropdown-basic">
                   <div className="button-label-mini">Today</div>
               </Dropdown.Toggle>

               <Dropdown.Menu>
                   <Dropdown.Item>Watering: not set</Dropdown.Item>
                   <Dropdown.Item>Fan: not set</Dropdown.Item>
               </Dropdown.Menu>
               </Dropdown>
            </div>
        </div>
    )
}

export default ProfileMini;