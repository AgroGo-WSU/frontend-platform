import '../stylesheets/WeatherCard.css';


function WeatherCard() {
  return (
    <div className="weather-card-container">
      <div className="card-flex-container">
        <img className="weather-card-image" src="../assets/weather.jpg"></img>
        <div className="day-caption">Today</div>
        <div className="weather-card-title">Sept. 21</div>
        <div className="weather-card-subtitle">Looks like it's gonna be sunny or smth</div>
      </div>
    </div>
  );
}

export default WeatherCard;