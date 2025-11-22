import '../stylesheets/StatsContainer.css';
import AnalogStats from './Stats/AnalogStats';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { GetBearerToken } from '../utils/GetBearerToken';

function StatsContainer() {
  const [temperature, setTemperature] = useState<number>();
  const [humidity, setHumidity] = useState<number>();

  async function retrieveLastReadingsFromBackend() {
    try {
      const token = await GetBearerToken();

      const res = await axios.get(
        "https://backend.agrogodev.workers.dev/api/data/tempAndHumidity",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data.data; // Array of readings
      console.log("response:", data);

      if (!Array.isArray(data) || data.length === 0) return;

      // Filter for temp and humidity readings
      const temps = data.filter(d => d.type === "temperature");
      const hums = data.filter(d => d.type === "humidity");

      // Helper to get the most recent by receivedAt
      const getLatest = arr => {
        return arr.reduce((latest, curr) => {
          return new Date(curr.receivedAt) > new Date(latest.receivedAt)
            ? curr
            : latest;
        });
      };

      const latestTemp = temps.length ? getLatest(temps) : null;
      const latestHum = hums.length ? getLatest(hums) : null;

      // Clean value strings and set state
      if (latestTemp) setTemperature(parseFloat(latestTemp.value));
      if (latestHum) setHumidity(parseFloat(latestHum.value));

    } catch (err) {
      console.error("Error retrieving last reading from backend:", err);
    }
  }

  useEffect(() => {
    retrieveLastReadingsFromBackend();
  }, []);

  return (
    <div className="stats-container-top">
      <AnalogStats
        humidity={humidity ?? 0}
        temperature={(temperature! * (9/5) + 32)}
      />
    </div>
  );
}

export default StatsContainer;
