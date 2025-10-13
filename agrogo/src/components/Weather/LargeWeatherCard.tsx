import '../../stylesheets/LargeWeatherCard.css';

interface LargeWeatherCardProps {
  /* The day of the week, the date, the weather, and the image file */
  /* The string for image file must be in this form: "../src/assets/weather-images/sun.png" where "weather" can be replaced by "sun", "partial-clouds", or "rain"*/
  day: string;
  date: string;
  weather: string;
  image: string;
}


function LargeWeatherCard({ day, date, weather, image }: LargeWeatherCardProps) {

    return(
        <div>
        <div className="large-weather-card-container">
        <img className="large-weather-card-image" src={ image }></img>
        <div className="large-card-flex-container">
            <div className="large-day-caption">{ day }</div>
            <div className="large-weather-card-title">{ date }</div>
            <div className="large-weather-card-subtitle">{ weather }</div>
        </div>
        </div>
        </div>
    )
}

export default LargeWeatherCard;