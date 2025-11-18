import "../../stylesheets/ProfileDisplay.css";
import "../../stylesheets/SidebarColumn.css"; // NEW
import ProfileImage from "./ProfileImage";
import ProfileMini from "./ProfileMini";
import { useEffect, useState } from 'react';
import axios from "axios";
import ConnectivityStatus from "../ConnectivityStatus";
import ProfileEdit from "./ProfileEdit";
import { GetBearerToken } from "../../utils/GetBearerToken";
import { type AgroGoUserProfile } from "../../types/UserProfile";
import StatItem from "./StatItem";

function ProfileDisplay() {
  // Little confusing, but this is the user's data in D1, the currentUser
  // field is the data from Firebase
  const [user, setUser] = useState<AgroGoUserProfile>({
    firstName: "", 
    lastName: "",
    createdAt: "",
    profileImage: "",
    notificationsForBlueAlerts: "",
    notificationsForGreenAlerts: "",
    notificationsForRedAlerts: ""
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [userPlantCount, setUserPlantCount] = useState(0);
  const [userFanCount, setUserFanCount] = useState(0);
  const [userWaterCount, setUserWaterCount] = useState(0);
  const [userRecentNotifications, setUserRecentNotifications] = useState([]);

  async function getSupplementalUserData() {
    try {
      const token = await GetBearerToken();

      const userWaterRes = await axios.get(
        "https://backend.agrogodev.workers.dev/api/user/waterSchedule",
        { headers: { Authorization: `Bearer ${token}`, } }
      );
      setUserWaterCount(userWaterRes.data.data.length);

      const userFanRes = await axios.get(
        "https://backend.agrogodev.workers.dev/api/user/fanSchedule",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserFanCount(userFanRes.data.data.length);

      const userPlantRes = await axios.get(
        "https://backend.agrogodev.workers.dev/api/user/plantInventory",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserPlantCount(userPlantRes.data.data.length);

      console.log("user water schedules:", userWaterRes.data.data);
    } catch(err) {
      console.log("Error fetching supplemental user data from the backend:", err);
    }
  }

  async function getUserProfileData() {
    try {
      const token = await GetBearerToken();

      // Call the backend API route that finds the user's info from D1
      const userRes = await axios.get(
        "https://backend.agrogodev.workers.dev/api/user/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      return userRes.data.data[0];
    } catch(err) {
      console.log("Error fetching user data from the backend:", err);
    }
  };

  async function fetchRecentUserNotifications() {
    try {
      const token = await GetBearerToken();

      const notifRes = await axios.get(
        "https://backend.agrogodev.workers.dev/api/user/alert",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const responses = notifRes.data.data;

      // Get the 3 most recent notifications
      const mostRecentResponses = responses
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

      return mostRecentResponses;
    } catch(err) {
      console.log("Error fetching user notifications from the backend:", err);
      return null;
    }
  }

  useEffect(() => {
    async function fetchUser() {
      const data = await getUserProfileData();
      if(data) {
        setUser(data);
        await getSupplementalUserData();
      }
      
      const notifications = await fetchRecentUserNotifications();
      if(notifications) {
        setUserRecentNotifications(notifications);
      }
    }
    fetchUser();
  }, [])

  return (
    <div className="profile-display-all">
      <aside className="sidebar-column">
      {/* Profile Card */}
      <div className="profile-display-container d-none d-xl-block">
      
      {!isEditing &&
      <div>
        <ProfileImage profileImage={user.profileImage}/>
        <div className="user-info">
          <h4 className="display-name">{user.firstName} {user.lastName}</h4>
          <p className="start-date">Member since {user.createdAt}</p>
        </div>
        <div className="d-none d-xl-block"><ConnectivityStatus /></div>
        <div className="action-buttons">
          <button className="change-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
        <hr />
      </div>
      }
      
      <div className="profile-settings">
        <ProfileEdit 
          user={user} 
          setUser={setUser} 
          isEditing={isEditing}
          setIsEditing={setIsEditing} 
        />
      </div>

      <h4>Quick Stats</h4>
      <div className="stats">
        <StatItem 
          icon="../src/assets/profile-images/potted-plant.png" 
          label="Plants" 
          qty={userPlantCount} 
        />
        <StatItem
          icon="../src/assets/profile-images/water-tap.png"
          label="Daily Water"
          qty={userWaterCount}
        />
        <StatItem
          icon="../src/assets/profile-images/fan.png"
          label="Daily Fan"
          qty={userFanCount}
        /> 
      </div>

      <h4 className="mt-2">Recent Notifications</h4>
      <div className="recent-notifications">
        {userRecentNotifications.length > 0 ? (
          userRecentNotifications.map((notif, index) => (
            <div key={notif.id || index} className="notification-item">
              <div className="notif-header">
                <span className={`notif-severity ${notif.severity}`}>{notif.severity.toUpperCase()}</span>
              </div>
              <p className="notif-message">{notif.message}</p>
            </div>
          ))
        ) : (
          <p>No recent notifications</p>
        )}    
      </div>
      {/* connection, humidity, temp */}
      <div className="profile-mini d-xl-none">
        <ProfileMini />
      </div>
      </div>
      </aside>
    </div>
    
  );
}

export default ProfileDisplay;

