import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './stylesheets/App.css'
import MainTitle from './components/MainTitle'
import LeftMenu from './components/LeftMenu'
import TopNav from './components/TopNav'
import ZoneCard from './components/ZoneCard';
import WeatherCard from './components/WeatherCard';
import SmallTitle from './components/SmallTitle';

function App() {

  return (
    <div className="dashboard">
      <div className="bottom-blank"></div>
      <div className="left-menu"><LeftMenu /></div>
      <div className="right-blank"></div>
      <div className="top-nav"><TopNav /></div>
      <div className="welcome-title"><MainTitle name="AgroGo"/></div>
      <div className="zones"><div className="small-title-fixer"><SmallTitle title="Zones"/></div>
        <div className="zone-flex-container">
          <ZoneCard plants="Carrots and cucumbers"        image="../src/assets/zone-images/vegetable.png"/>
          <ZoneCard plants="Cosmos and petunias"          image="../src/assets/zone-images/flower.png"/>
          <ZoneCard plants="Peppers, lavender, kale"      image="../src/assets/zone-images/plant.png"/>
          </div>
        </div>
      <div className="weather"><div className="small-title-fixer"><SmallTitle title="Weather"/></div>
        <div className="weather-flex-container">
          <WeatherCard day="Today"      date="Sept. 22"   weather="Sunny with a high of 78"             image="../src/assets/weather-images/sun.png"/>
          <WeatherCard day="Tomorrow"   date="Sept. 23"   weather="Partially cloudy with a high of 71"  image="../src/assets/weather-images/partial-clouds.png"/>
          <WeatherCard day="Wednesday"  date="Sept. 24"   weather="Rainy with a high of 67"             image="../src/assets/weather-images/rain.png"/>
          <WeatherCard day="Thursday"   date="Sept. 25"   weather="Rainy with a high of 71"             image="../src/assets/weather-images/rain.png"/>
          <WeatherCard day="Friday"     date="Sept. 26"   weather="Sunny with a high of 75"             image="../src/assets/weather-images/sun.png"/>
          <WeatherCard day="Saturday"   date="Sept. 27"   weather="Sunny with a high of 77"             image="../src/assets/weather-images/sun.png"/>
          <WeatherCard day="Sunday"     date="Sept. 28"   weather="Partially cloudy with a high of 72"  image="../src/assets/weather-images/partial-clouds.png"/>
        </div>
      </div>
      <div className="footer">copyright AgroGo 2025</div>
    </div>
  )
}

export default App
