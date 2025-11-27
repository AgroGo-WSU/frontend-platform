import '../../stylesheets/ZoneContainer.css';
import ZoneCard from './ZoneCard';
import ZoneEdit from './ZoneEdit';
import axios from "axios";
import { AuthContext } from '../../hooks/UseAuth';
import { getAuth } from "firebase/auth";
import { useState, useEffect, useContext } from "react";

// dynamically render zone images using state to hold the image name suffix
// use the map function to render the zone images on screen along with the descriptions


function ZoneContainer() {
  // this will be how we access the current user's info from Firebase
  const { currentUser } = useContext(AuthContext);
  const [numberOfZones, setNumberOfZones] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [zoneData, setZoneData] = useState([]);

    useEffect(() => {
      const getZoneData = async () => {

        try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('User not authenticated!');
        }

        const token = await user.getIdToken();
      
        const response = await axios.get("https://backend.agrogodev.workers.dev/api/user/zone", {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });

          console.log("Setting zone data in ZoneContainer: ", response.data.data);
          setZoneData(response.data.data);
          } catch(error){
            console.error('Error fetching zone data:', error);
          } finally {
            console.log("Final data for zone: ", zoneData);
      }
    };

    getZoneData();

    },[modalShow]);

  function editZone() {
    setModalShow(true);
    console.log("**************************modal should be showing");
  }


    return (
        <div className="zone-container-top">
        {modalShow === true ? <div className="edit-modal"><ZoneEdit show={modalShow} onHide={() => setModalShow(false)} data={zoneData}/></div> : <></>}
        <div className="zone-flex-container d-flex flex-column flex-xl-row justify-content-between">
          {zoneData != null ? zoneData.map(item =>(
            <ZoneCard plants={item.description} image={item.zoneType} />
          )) : <></>
          }
        </div>
        <div className="add-zone-button">{<button className="eit-zones" onClick={editZone}>Edit zones</button>}</div>
        </div>
    )
}

export default ZoneContainer;