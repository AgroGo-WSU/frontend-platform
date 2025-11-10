import '../../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../stylesheets/App.css';
import MainTitle from '../MainTitle';
import ProfileDisplay from '../Profile/ProfileDisplay';
import TopNav from '../TopNav';
import ZoneContainer from '../Zones/ZoneContainer';
import WeatherContainer from '../Weather/WeatherContainer';
import SmallTitle from '../SmallTitle';
import { useContext } from 'react';
import { AuthContext } from '../../hooks/UseAuth';

function Dashboard() {
  // grabbing our current user from the Authentication context we created
  const { currentUser } = useContext(AuthContext);

  let userName = 'friend';
  if (currentUser) {
    userName = (currentUser.displayName)?.split(' ')[0];
  }

  return (
    <>
      <div className="main-container">
        <div className="top-nav">
          <TopNav />
        </div>

        <div className="dashboard-container">
          <div className="profile-display">
            <ProfileDisplay />
          </div>

          <div className="dashboard">
            <div className="weather-zone-title-container">
              <div className="welcome-title">
                <MainTitle name={userName} />
              </div>

              <div className="weather-zone-container">
                <div className="zones mx-auto p-4">
                  <SmallTitle title="Zones" />
                  <ZoneContainer />
                </div>

                <div className="weather mx-auto p-4">
                  <SmallTitle title="Weather" />
                  <WeatherContainer />
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="what">copyright AgroGo 2025</div>
        </footer>
      </div>
    </>
  );
}

export default Dashboard;
