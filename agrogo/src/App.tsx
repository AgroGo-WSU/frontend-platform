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
      <div className="bottom-blank">I'm bottom blank</div>
      <div className="left-menu"><LeftMenu /></div>
      <div className="right-blank">I'm right blank - I'm only here bc madeline hates managing margins in the css</div>
      <div className="top-nav"><TopNav /></div>
      <div className="welcome-title"><MainTitle name="AgroGo"/></div>
      <div className="weather">I'm the weather cards - this will also be a flex box with title and cards<SmallTitle title="Weather"/><div className="weather-flex-container"><WeatherCard /><WeatherCard /><WeatherCard /><WeatherCard /><WeatherCard /><WeatherCard /><WeatherCard /></div></div>
      <div className="zones">I'm the zones - this will be a flex box with a title card and the zone bubbles underneath<SmallTitle title="Zones"/><div className="zone-flex-container"><ZoneCard /><ZoneCard /><ZoneCard /></div></div>
      <div className="footer">I'm the footer</div>
    </div>
  )
}

export default App
