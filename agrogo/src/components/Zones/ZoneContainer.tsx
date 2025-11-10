import '../../stylesheets/ZoneContainer.css';
import ZoneCard from './ZoneCard';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

function ZoneContainer() {
  const [zones, setZones] = useState([]);

  const zoneImageMap = {
    vegetable: "../src/assets/zone-images/vegetable.png",
    flower: "../src/assets/zone-images/flower.png",
    plant: "../src/assets/zone-images/plant.png",
  };

  async function retrieveUserZonesFromBackend() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if(!user) throw new Error("No authenticated user found");

      const token = await user.getIdToken();

      const zoneRes = await axios.get(
        "https://backend.agrogodev.workers.dev/api/user/zone",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const zoneArr = zoneRes.data.data;
      return zoneArr;
    } catch(err) {
      console.log("Error fetching user zones from the backend:", err);
    }
  }

  useEffect(() => {
    async function fetchZones() {
      const data = await retrieveUserZonesFromBackend();
      if(data) {
        setZones(data);
      }
    }

    fetchZones();
    console.log("Zones:", zones);
  }, [zones]);

  return (
    <div className="zone-flex-container d-flex flex-column flex-xl-row justify-content-between">
      {zones.length > 0 ? (
        zones.map((z, i) => {
          const zoneName = z.zoneName?.toLowerCase?.() || "";
          const imagePath = zoneImageMap[zoneName] || "../src/assets/zone-images/plant.png"; 
          return (
            <ZoneCard 
              key={i} 
              plants={z.description} 
              image={imagePath} 
            />
          )
        })
      ) : (
        <p>Loading zones...</p>
      )}
    </div>
  );
}

export default ZoneContainer;