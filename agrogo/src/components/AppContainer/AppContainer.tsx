import "../../stylesheets/AppContainer.css";
import Dashboard from "../Dashboard/Dashboard";
import AuthenticationPopup from "../Auth/AuthenticationPopup";
import { useAuth } from "../contexts/authContext/authentication";

function AppContainer() {
    const { userLoggedIn } = useAuth();

    if(userLoggedIn) {
        return(
            <div>
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