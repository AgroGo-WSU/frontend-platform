import '../../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../stylesheets/App.css';
import MainTitle from '../MainTitle';
import ProfileDisplay from '../Profile/ProfileDisplay';
import ZoneContainer from '../Zones/ZoneContainer';
import WeatherContainer from '../Weather/WeatherContainer';
import SmallTitle from '../SmallTitle';
import TopNav from '../TopNav';
import { useContext } from 'react';
import { AuthContext } from '../../hooks/UseAuth';

function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const userName = currentUser?.displayName?.split(" ")[0] ?? "friend";

  return (
    <>
      <TopNav />
      <div className="dashboard">
        <div className="bottom-blank"></div>
        <div className="profile-display"><ProfileDisplay /></div>
        <div className="right-blank"></div>
        <div className="welcome-title"><MainTitle name={userName}/></div>

        <div className="zones mx-auto p-4">
          <div className="small-title-fixer"><SmallTitle title="Zones"/></div>
          <ZoneContainer />
        </div>

        <div className="weather mx-auto p-4">
          <SmallTitle title="Weather"/>
          <WeatherContainer />
        </div>

        <div className="footer">copyright AgroGo 2025</div>
      </div>
    </>
  );
}

export default Dashboard;
