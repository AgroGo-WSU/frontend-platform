import "../../stylesheets/AppContainer.css";
import Dashboard from "../Dashboard/Dashboard.tsx";
import AuthenticationPopup from "../Auth/AuthenticationPopup";
import { useAuth } from "../../hooks/UseAuth.tsx";
import ProfileCreation from "../Profile/ProfileCreation.tsx";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";

function AppContainer() {
    const { userLoggedIn } = useAuth();
    const [isNewUser, setIsNewUser] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkUserProfile() {
            const auth = getAuth();
            const user = auth.currentUser;
            if(!user) return;

            // Call the backend
            try {
                // Get the firebase ID token (used for Bearer authentication)
                const token = await user!.getIdToken();

                // Use the ID token to check if the user is 
                const res = await axios.get(
                    "https://backend.agrogodev.workers.dev/api/user/user",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // If the user matching the ID token doesn't have data
                // in D1, then they are a new user.
                setIsNewUser(res.data.count === 0);
                console.log("response:", res.data);
            } catch(err) {
                console.error("Error checking user existence:", err);
                setIsNewUser(true);
            }
        }  

        console.log("isNewUser:", isNewUser);
        console.log("userLoggedIn:", userLoggedIn);

        // Only check for user's status in D1 if they are logged in.
        // Prevents a logic error that brings the user to the 
        // dashboard on load
        if(userLoggedIn) {
            setIsNewUser(null); // Reset loading state each time user logs in
            checkUserProfile();
        } else {
            setIsNewUser(null); // Clear when logged out
        }
    }, [userLoggedIn]);

    // If auth is still initializing or we haven't determined login state
    if(userLoggedIn === undefined || userLoggedIn === null) {
        return <div>Loading auth...</div>;
    }

    if(!userLoggedIn) {
        return <AuthenticationPopup />;
    }

    // Don't render the main page if the user's status is still undetermined
    // Prevents an error that renders the dashboard for a second before the profile page
    if(isNewUser === null) return <div>Loading profile...</div>

    return (
        <div>
            {/* 
            Only display the ProfileCreation page if the user
            doesn't have data in our D1 database
            */}
            { isNewUser ? (
                <ProfileCreation onProfileCreated={() => setIsNewUser(false)} /> 
            ): (
                <Dashboard />)
            }
        </div>
    );
}

export default AppContainer;