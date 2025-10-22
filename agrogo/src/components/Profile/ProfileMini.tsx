import Dropdown from 'react-bootstrap/Dropdown';
import "../../stylesheets/ProfileMini.css"
import ConnectivityStatus from '../ConnectivityStatus';
import Temp from '../Temp';
import Humidity from '../Humidity';

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
                   <Dropdown.Item><Humidity /></Dropdown.Item>
                   <Dropdown.Item><Temp /></Dropdown.Item>
                   <Dropdown.Item><ConnectivityStatus /></Dropdown.Item>
               </Dropdown.Menu>
               </Dropdown>
            </div>
        </div>
    )
}

export default ProfileMini;