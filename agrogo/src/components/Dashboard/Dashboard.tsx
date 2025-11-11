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
import { useEffect, useState } from 'react';
import StatsContainer from '../StatsContainer';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

function Dashboard() {
  // grabbing our current user from the Authentication context we created
  const { currentUser } = useContext(AuthContext);
  const [hasPi, setHasPi] = useState(false);

  useEffect(() => {
    const getConnection = async () => {

      try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('User not authenticated!');
      }

      const token = await user.getIdToken();
      // console.log(token);
    
      const response = await axios.get("https://backend.agrogodev.workers.dev/api/user/user", {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              }
          });

        console.log("SETTING DATA: ", response.data.data);

        if(response.data.data[0].raspiMac) {
          setHasPi(true)
        }
        } catch(error){
          console.error('Error fetching data:', error);
        }
  };

  getConnection();

  },[hasPi]);

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

                  {hasPi === true ? (<StatsContainer />) : <></>}
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
