import "../../stylesheets/AppContainer.css";
import Dashboard from "../Dashboard/Dashboard";
import AuthenticationPopup from "../Auth/AuthenticationPopup";
import { useAuth } from "../../hooks/UseAuth.tsx";
// import ProfileCreation from "../Profile/ProfileCreation.tsx";

function AppContainer() {
    const { userLoggedIn } = useAuth();

    if(userLoggedIn) {
        return(
            <div>
                {/* <ProfileCreation /> */}
                <Dashboard />
            </div>
        )
    } else if(!userLoggedIn) {
        return(
            <div>
                <AuthenticationPopup />
            </div>
        )
    }
}

export default AppContainer;