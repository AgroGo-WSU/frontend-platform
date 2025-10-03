import "../../stylesheets/AppContainer.css";
import Dashboard from "../Dashboard/Dashboard";
import AuthenticationPopup from "../Auth/AuthenticationPopup";

function AppContainer() {

    // this is for testing purposes - eventually this will come from the authentication context/state
    const isUserLoggedIn: boolean = false;

    if(isUserLoggedIn) {
        return(
            <div>
                <Dashboard />
            </div>
        )
    } else if(!isUserLoggedIn) {
        return(
            <div>
                <AuthenticationPopup />
            </div>
        )
    }
}

export default AppContainer;