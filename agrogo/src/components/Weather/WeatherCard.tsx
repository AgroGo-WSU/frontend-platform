import '../../stylesheets/WeatherCard.css';


interface weatherInfoType {
  id: number
	time: Date;
	max: number;
	min: number;
	uvIndex: number;
	clouds: number;
	showers: number;
	rain: number;
	wind: number;
}


function WeatherCard({ id, time, max, min, uvIndex, clouds, showers, rain, wind }: weatherInfoType) {

  const daytime = time.toString();
  
  return (
    <div className="weather-card-container">
      <img className="weather-card-image" src={ "./src/assets/weather-images/sun.png" }></img>
      <div className="card-flex-container">
        <div className="day-caption">{ daytime }</div>
        <div className="weather-card-title">{ daytime }</div>
        <div className="weather-card-subtitle">{ max }</div>
      </div>
    </div>
  );
}

export default WeatherCard;