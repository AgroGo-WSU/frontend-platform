import "../../stylesheets/AppContainer.css";
import Dashboard from "../Dashboard/Dashboard";
import AuthenticationPopup from "../Auth/AuthenticationPopup";

function AppContainer() {

    // this is for testing purposes - eventually this will come from the authentication context/state
    const isUserLoggedIn = false;

    if(isUserLoggedIn == true) {
        return(
            <div>
                <Dashboard />
            </div>
        )
    } else if(isUserLoggedIn == false) {
        return(
            <div>
                <AuthenticationPopup />
            </div>
        )
    }
}

export default AppContainer;