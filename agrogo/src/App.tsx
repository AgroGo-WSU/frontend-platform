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
      <div className="weather"><SmallTitle title="Weather"/><div className="weather-flex-container"><WeatherCard /><WeatherCard /><WeatherCard /><WeatherCard /><WeatherCard /><WeatherCard /><WeatherCard /></div></div>
      <div className="zones"><SmallTitle title="Zones"/><div className="zone-flex-container"><ZoneCard /><ZoneCard /><ZoneCard /></div></div>
      <div className="footer">copyright AgroGo 2025</div>
    </div>
  )
}

export default App
