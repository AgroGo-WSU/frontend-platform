import "../../stylesheets/ProfileDisplay.css";
import "../../stylesheets/SidebarColumn.css"; // NEW
import ProfileImage from "./ProfileImage";
import ProfileMini from "./ProfileMini";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../hooks/UseAuth';
import axios from "axios";
import { getAuth } from "firebase/auth";
import { Collapse } from "react-bootstrap";

function ProfileDisplay() {
  // grabbing our current user from the Authentication context we created
  const { currentUser } = useContext(AuthContext);

  // Little confusing, but this is the user's data in D1, the currentUser
  // field is the data from Firebase
  const [user, setUser] = useState({
    firstName: "", 
    lastName: "",
    createdAt: "",
    notificationsForBlueAlerts: "",
    notificationsForGreenAlerts: "",
    notificationsForRedAlerts: ""
  });
  // Holds all the updated user info before submission
  const [editingUser, setEditingUser] = useState({
    firstName: "", 
    lastName: "",
    createdAt: "",
    notificationsForBlueAlerts: "",
    notificationsForGreenAlerts: "",
    notificationsForRedAlerts: ""
  })
  const [isEditing, setIsEditing] = useState(false);
  const [userPlantCount, setUserPlantCount] = useState(0);
  const [userFanCount, setUserFanCount] = useState(0);
  const [userWaterCount, setUserWaterCount] = useState(0);

  let userName = "friend";
  if(currentUser) {
    userName = currentUser.displayName!;
  }

  async function getBearerToken() {
    const auth = getAuth();
    const user = auth.currentUser;

    if(!user) {
      throw new Error("No authenticated user found");
    }

    return await user.getIdToken();
  }

  async function syncUserDataToBackend() {
    try {
      const token = await getBearerToken();

      const payload = {
        id: currentUser?.uid,
        firstName: user.firstName,
        lastName: user.lastName,
        notificationsForGreenAlerts: user.notificationsForGreenAlerts,
        notificationsForBlueAlerts: user.notificationsForBlueAlerts,
        notificationsForRedAlerts: user.notificationsForRedAlerts
      }

      await axios.patch(
        "https://backend.agrogodev.workers.dev/api/data/user",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
    } catch(err) {
      console.log("Error syncing user data to the backend:", err);
    }
  }

  async function getSupplementalUserData() {
    try {
      const token = await getBearerToken();

      const userWaterRes = await axios.get(
        "https://backend.agrogodev.workers.dev/api/user/waterSchedule",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setUserWaterCount(userWaterRes.data.data.length);

      const userFanRes = await axios.get(
        "https://backend.agrogodev.workers.dev/api/user/fanSchedule",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setUserFanCount(userFanRes.data.data.length);


      const userPlantRes = await axios.get(
        "https://backend.agrogodev.workers.dev/api/user/plantInventory",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setUserPlantCount(userPlantRes.data.data.length);

      console.log("user water schedules:", userWaterRes.data.data);
    } catch(err) {
      console.log("Error fetching supplemental user data from the backend:", err);
    }
  }

  async function getUserProfileData() {
    try {
      const token = await getBearerToken();

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
  }

  useEffect(() => {
    async function fetchUser() {
      const data = await getUserProfileData();
      if(data) {
        setUser(data);
        setEditingUser(data);
        await getSupplementalUserData();
      }
    }
    fetchUser();
  }, [])

  return (
    <div className="profile-display-all">
      <aside className="sidebar-column">
      {/* Profile Card */}
      <div className="profile-display-container d-none d-xl-block">
        <ProfileImage />

      <h4 className="name">{user.firstName} {user.lastName}</h4>
      <p className="start-date">Member since {user.createdAt}</p>

      {!isEditing && (<button onClick={() => setIsEditing(true)}>Edit Profile Settings</button>)}
      <div className="profile-settings">
        <Collapse in={isEditing}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setUser(editingUser);
              syncUserDataToBackend();
              setIsEditing(false);
            }}
          >
            <hr />
            <h5>Profile Data</h5>
            <button>Change Profile Image</button>

            <label htmlFor="firstName">First Name</label>
            <input 
              type="text"
              id="firstName"
              value={editingUser.firstName || ""}
              onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value})}
            />

            <label htmlFor="lastName">Last Name</label>
            <input 
              type="text"
              id="lastName"
              value={editingUser.lastName || ""}
              onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value})}
            />

            <div className="alert-preferences">
              <label>
                <input
                  type="checkbox"
                  checked={editingUser.notificationsForBlueAlerts === "Y"}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      notificationsForBlueAlerts: e.target.checked ? "Y" : "N",
                    })
                  }
                />
                Blue Alerts
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={editingUser.notificationsForGreenAlerts === "Y"}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      notificationsForGreenAlerts: e.target.checked ? "Y" : "N",
                    })
                  }
                />
                Green Alerts
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={editingUser.notificationsForRedAlerts === "Y"}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      notificationsForRedAlerts: e.target.checked ? "Y" : "N",
                    })
                  }
                />
                Red Alerts
              </label>
            </div>

            <button type="submit">Submit</button>
            <button onClick={() => {
              setEditingUser(user);
              setIsEditing(false);
            }}>Cancel</button>
          </form>
        </Collapse>
      </div>
      <hr />

      <div>
        <p>Plants: {userPlantCount}</p>
        <p>Daily Watering: {userWaterCount}</p>
        <p>Daily Fan Cycles: {userFanCount}</p>
      </div>

      <div className="profile-mini d-xl-none">
			  <ProfileMini />
		  </div>
        
        {/* Notifications */}
        {/* <NotificationsPanel items={items} onClearAll={clear} /> */}
    
      </div>
      </aside>
    </div>
    
  );
}

export default ProfileDisplay;
