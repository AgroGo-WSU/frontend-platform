import '../../stylesheets/WeatherContainer.css';
import { fetchWeatherApi } from 'openmeteo';
import WeatherCard from './WeatherCard';
import LargeWeatherCard from './LargeWeatherCard';

function WeatherContainer() {

    return(
        <div>
        <div className="weather-container">
        <div className="main-weather-card"><LargeWeatherCard day="Today" date="Sept. 22" weather="Sunny with a high of 78" image="../src/assets/weather-images/sun.png"/></div>
        <div className="weather-flex-container">
          <WeatherCard day="Tomorrow"   date="Sept. 23"   weather="Cloudy with a high of 71"  image="../src/assets/weather-images/partial-clouds.png"/>
          <WeatherCard day="Wednesday"  date="Sept. 24"   weather="Rainy with a high of 67"             image="../src/assets/weather-images/rain.png"/>
          <WeatherCard day="Thursday"   date="Sept. 25"   weather="Rainy with a high of 71"             image="../src/assets/weather-images/rain.png"/>
          <WeatherCard day="Friday"     date="Sept. 26"   weather="Sunny with a high of 75"             image="../src/assets/weather-images/sun.png"/>
          <WeatherCard day="Saturday"   date="Sept. 27"   weather="Sunny with a high of 77"             image="../src/assets/weather-images/sun.png"/>
          <WeatherCard day="Sunday"     date="Sept. 28"   weather="Cloudy with a high of 72"  image="../src/assets/weather-images/partial-clouds.png"/>
        </div>
        </div>
        </div>
    )
}

export default WeatherContainer;