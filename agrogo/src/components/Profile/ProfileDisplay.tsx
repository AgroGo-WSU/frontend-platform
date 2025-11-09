import "../../stylesheets/ProfileDisplay.css";
import "../../stylesheets/SidebarColumn.css"; // NEW
import ProfileImage from "./ProfileImage";
import ProfileMini from "./ProfileMini";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../hooks/UseAuth';
import axios from "axios";
import { getAuth } from "firebase/auth";

function ProfileDisplay() {
  // grabbing our current user from the Authentication context we created
  const { currentUser } = useContext(AuthContext);

  // Little confusing, but this is the user's data in D1, the currentUser
  // field is the data from Firebase
  const [user, setUser] = useState({});

  let userName = "friend";
  if(currentUser) {
    userName = currentUser.displayName!;
  }

  async function getUserDetails() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if(!user) {
        throw new Error("No authenticated user found");
      }

      const token = await user.getIdToken();

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
      console.log("user data:", userRes.data.data[0]);
      return userRes.data.data[0];
    } catch(err) {
      console.log("Error fetching user data from the backend:", err);
    }
  }

  useEffect(() => {
    async function fetchUser() {
      const data = await setUser(getUserDetails());
      if(data) setUser(data);
    }
    fetchUser();
  }, [])

  return (
    <div className="profile-display-all">
      <aside className="sidebar-column">
      {/* Profile Card */}
      <div className="profile-display-container d-none d-xl-block">
        <ProfileImage />
        <button onClick={getUserDetails}>Get user details</button>

      <div className="name">{user.firstName} {user.lastName}</div>
      <div className="start-date">Member since {user.createdAt}</div>

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
