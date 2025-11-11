import '../../stylesheets/AnalogStats.css';

interface AnalogStatsProps {
  humidity: number;
  temperature: number;
}

function AnalogStats({ humidity, temperature }: AnalogStatsProps) {
  return (
    <div className="analog-display">
      <h2>Last Readings</h2>
      <div className="analog-line">
        <span className="analog-temp">{temperature.toFixed(1)}°F</span>
      </div>
      <div className="analog-divider" />
      <div className="analog-line">
        <span className="analog-humidity">{humidity.toFixed(1)}%</span>
      </div>
    </div>
  );
}

export default AnalogStats;
