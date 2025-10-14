import '../../stylesheets/LargeWeatherCard.css';

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


function LargeWeatherCard({ id, time, max, min, uvIndex, clouds, showers, rain, wind }: weatherInfoType) {
    
  const daytime = time.toString();
  const splitDate = daytime.split(" ");
  const displayDate = splitDate[1] + ". " + splitDate[2];


    return(
        <div>
        <div className="large-weather-card-container">
        <img className="large-weather-card-image" src={ "./src/assets/weather-images/sun.png" }></img>
        <div className="large-card-flex-container">
            <div className="large-day-caption">Today</div>
            <div className="large-weather-card-title">{ displayDate }</div>
            <div className="large-weather-card-subtitle">High of { Math.round(max) }, low of { Math.round(min) }</div>
        </div>
        </div>
        </div>
    )
}

export default LargeWeatherCard;