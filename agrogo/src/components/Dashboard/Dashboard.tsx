import '../../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../stylesheets/App.css'
import MainTitle from '../../components/MainTitle'
import ProfileDisplay from '../../components/Profile/ProfileDisplay'
import TopNav from '../../components/TopNav'
import ZoneContainer from '../../components/Zones/ZoneContainer';
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
      <div className="zones mx-auto p-4"><div className="small-title-fixer"><SmallTitle title="Zones"/></div>
        <ZoneContainer />
      </div>
      <div className="weather mx-auto p-4"><SmallTitle title="Weather"/><WeatherContainer />
      </div>
      <div className="footer">copyright AgroGo 2025</div>
    </div>
    </>
  )
}

export default Dashboard;
