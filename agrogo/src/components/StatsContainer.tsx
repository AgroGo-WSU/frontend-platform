import '../stylesheets/StatsContainer.css';
import AnalogStats from './Stats/AnalogStats';

// StatsContainer now renders the large analog-style humidity + temperature display
// that matches the AgroGo dashboard aesthetic.

function StatsContainer() {
  // In the future, you can replace these values with live sensor data.
  const humidity = 50.0;
  const temperature = 73.0;

  return (
    <div className="stats-container-top">
      <AnalogStats humidity={humidity} temperature={temperature} />
    </div>
  );
}

export default StatsContainer;
