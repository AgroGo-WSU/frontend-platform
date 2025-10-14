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
  let dayOfTheWeek = daytime;
  const splitDate = daytime.split(" ");
  const displayDate = splitDate[1] + ". " + splitDate[2];

  if(id == 1) {
    dayOfTheWeek = "Tomorrow";
  } else {
    dayOfTheWeek = daytime.slice(0, 3);
  }
  
  return (
    <div className="weather-card-container">
      <img className="weather-card-image" src={ "./src/assets/weather-images/sun.png" }></img>
      <div className="card-flex-container">
        <div className="day-caption">{ dayOfTheWeek }</div>
        <div className="weather-card-title">{ displayDate }</div>
        <div className="weather-card-subtitle">High of { Math.round(max) }, low of { Math.round(min) }</div>
      </div>
    </div>
  );
}

export default WeatherCard;