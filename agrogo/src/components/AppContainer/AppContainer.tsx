import "../../stylesheets/AppContainer.css";
import Dashboard from "../Dashboard/Dashboard";
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

                const res = await axios.get(
                    "https://backend.agrogodev.workers.dev/api/user/user",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                // If the user matching the ID token doesn't have data
                // in D1, then they are a new user.
                if(res.data.count === 0) {
                    setIsNewUser(true);
                } else {
                    setIsNewUser(false);
                }
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
        if(userLoggedIn && isNewUser === null) checkUserProfile();
    }, [userLoggedIn, isNewUser]);

    // If auth is still initializing or we haven't determined login state
    if(userLoggedIn === undefined || userLoggedIn === null) {
        return <div>Loading auth...</div>;
    }

    if(!userLoggedIn) {
        return <AuthenticationPopup />;
    }

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