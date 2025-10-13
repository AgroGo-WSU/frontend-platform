import '../../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../stylesheets/App.css'
import MainTitle from '../../components/MainTitle'
import ProfileDisplay from '../../components/Profile/ProfileDisplay'
import TopNav from '../../components/TopNav'
import ZoneCard from '../../components/Zones/ZoneCard';
import WeatherContainer from '../../components/Weather/WeatherContainer';
import SmallTitle from '../../components/SmallTitle';



function Dashboard() {

  
  return (
    <>
    <div className="dashboard">
      <div className="bottom-blank"></div>
      <div className="profile-display"><ProfileDisplay /></div>
      <div className="right-blank"></div>
      <div className="top-nav"><TopNav /></div>
      <div className="welcome-title"><MainTitle name="AgroGo"/></div>
      <div className="zones"><div className="small-title-fixer"><SmallTitle title="Zones"/></div>
        <div className="zone-flex-container mx-auto p-2 d-flex flex-column flex-md-row">
          <ZoneCard plants="Carrots and cucumbers"        image="../src/assets/zone-images/vegetable.png"/>
          <ZoneCard plants="Cosmos and petunias"          image="../src/assets/zone-images/flower.png"/>
          <ZoneCard plants="Peppers, lavender, kale"      image="../src/assets/zone-images/plant.png"/>
          <div className="last-connect"></div>
        </div>
      </div>
      <div className="weather"><div className="small-title-fixer"><SmallTitle title="Weather"/><WeatherContainer /></div>
      </div>
      <div className="footer">copyright AgroGo 2025</div>
    </div>
    </>
  )
}

export default Dashboard;
