import '../../stylesheets/ZoneContainer.css';
import ZoneCard from './ZoneCard';
import ZoneEdit from './ZoneEdit';
import axios from "axios";
import { AuthContext } from '../../hooks/UseAuth';
import { getAuth } from "firebase/auth";
import { useState, useEffect, useContext } from "react";
import StatsContainer from '../StatsContainer';

// ZoneContainer handles:
// - Fetching user's zones
// - Showing ZoneCard list
// - Opening ZoneEdit modal
// - Showing temp/humidity (StatsContainer) under the Edit button

function ZoneContainer() {
  // access the current user's info from Firebase (kept for future use)
  const { currentUser } = useContext(AuthContext);

  const [modalShow, setModalShow] = useState(false);
  const [zoneData, setZoneData] = useState<any[]>([]);

  useEffect(() => {
    const getZoneData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('User not authenticated!');
        }

        const token = await user.getIdToken();

        const response = await axios.get(
          "https://backend.agrogodev.workers.dev/api/user/zone",
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        console.log("Setting zone data in ZoneContainer: ", response.data.data);
        setZoneData(response.data.data);
      } catch (error) {
        console.error('Error fetching zone data:', error);
      } finally {
        console.log("Finished fetching zone data");
      }
    };

    getZoneData();
  }, [modalShow]);

  function editZone() {
    setModalShow(true);
    console.log("**************************modal should be showing");
  }

  return (
    <div className="zone-container-top">
      {modalShow === true && (
        <div className="edit-modal">
          <ZoneEdit
            show={modalShow}
            onHide={() => setModalShow(false)}
            data={zoneData}
          />
        </div>
      )}

      <div className="zone-flex-container d-flex flex-column flex-xl-row justify-content-between">
        {zoneData != null && zoneData.length > 0 &&
          zoneData.map((item, index) => (
            <ZoneCard
              key={index}
              plants={item.description}
              image={item.zoneType}
            />
          ))
        }
      </div>

      {/* Edit button + temp/humidity stacked under it */}
      <div className="zone-actions">
        <div className="add-zone-button">
          <button className="edit-zones-button" onClick={editZone}>
            Edit zones
          </button>
        </div>

        <div className="zone-stats-inline">
          <StatsContainer />
        </div>
      </div>
    </div>
  );
}

export default ZoneContainer;
