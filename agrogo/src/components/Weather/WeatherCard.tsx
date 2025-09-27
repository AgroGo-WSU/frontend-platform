import '../../stylesheets/WeatherCard.css';


interface WeatherCardProps {
  /* These are the props that must be passed when this card is rendered on the parent component - go to App.tsx to see how these props are being passed to this component */
  /* Later, these will be passed programmatically via mapping or other function, but for now, they are hard-coded in the parent component */
  /* The day of the week, the date, the weather, and the image file */
  /* The string for image file must be in this form: "../src/assets/weather-images/sun.png" where "weather" can be replaced by "sun", "partial-clouds", or "rain"*/
  day: string;
  date: string;
  weather: string;
  image: string;
}


function WeatherCard({ day, date, weather, image }: WeatherCardProps) {
  return (
    <div className="weather-card-container">
      <img className="weather-card-image" src={ image }></img>
      <div className="card-flex-container">
        <div className="day-caption">{ day }</div>
        <div className="weather-card-title">{ date }</div>
        <div className="weather-card-subtitle">{ weather }</div>
      </div>
    </div>
  );
}

export default WeatherCard;