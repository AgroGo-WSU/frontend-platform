import "../../stylesheets/AppContainer.css";
import Dashboard from "../Dashboard/Dashboard";
import AuthenticationPopup from "../Auth/AuthenticationPopup";
import { useAuth } from "../../hooks/UseAuth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from "../Pages/ProfilePage";
import AutomationPage from "../Pages/AutomationPage";

function AppContainer() {
    const { userLoggedIn } = useAuth();
  
    return (
      <Router>
        {userLoggedIn ? (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* page routes */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/automation" element={<AutomationPage />} />
            {/* Fallback so unknown paths don’t brick site*/}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        ) : (
          <AuthenticationPopup />
        )}
      </Router>
    );
  }
  
  export default AppContainer;