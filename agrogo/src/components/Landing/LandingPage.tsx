import "../../stylesheets/LandingPage.css";
import AuthenticationPopup from "../Auth/AuthenticationPopup";

function LandingPage() {

    return (
        <div>
            <h1>Welcome to AgroGo</h1>
            <h2>Please sign in, or create an account</h2>
            <AuthenticationPopup />
        </div>
    )
}

export default LandingPage;