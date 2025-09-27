import "../stylesheets/TopNav.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Login from "./Login";
import { useState } from "react";
import Signup from "./SignUp";

// this is a React Bootstrap component - you can find docs for this at https://react-bootstrap.netlify.app/docs/components/navbar
// this is the "CollapsibleExample" navbar, the first under "Responsive behaviors section"
// the CSS file is in the App.tsx folder, and to make changes to it, you have to go to this path: \frontend-platform\agrogo\node_modules\bootstrap\dist\css\bootstrap.css
// I changed the css file to be the regular, not the .min css to make it easier for us to change, but it can be switched back to .min later to svae space

function TopNav() {
  const [userAuthed, setUserAuthed] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        {/* TODO: change these href routes to new pages/state so the links actually go somewhere */}
        <Navbar.Brand className="hover-effect p-2" href="#home" id="nav-bar-title">AgroGo</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            { userAuthed && (
              <>
                <Nav.Link className="hover-effect" href="#weather">Weather</Nav.Link>
                <Nav.Link className="hover-effect" href="#inventory">Inventory</Nav.Link>
                <NavDropdown className="hover-effect" title="Actions" id="collapsible-nav-dropdown">
                  <NavDropdown.Item className="hover-effect" href="#watering">Set watering</NavDropdown.Item>
                  <NavDropdown.Item className="hover-effect" href="#fan">Set fan</NavDropdown.Item>
                  <NavDropdown.Item className="hover-effect" href="#greenhouse-stats">View greenhouse stats</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item className="hover-effect" href="#manage-zones">
                    Manage zones
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
          <Nav>
            { !userAuthed ?
                <>
                  {/* If user is not signed in, display login options */}
                  <Nav.Link className="hover-effect" eventKey={2} href="#profile" onClick={() => setShowLogin(true)}>Login</Nav.Link>
                  <Nav.Link className="hover-effect" eventKey={2} href="#profile" onClick={() => setShowSignup(true)}>Sign Up</Nav.Link>
                  <Login show={showLogin} onClose={() => setShowLogin(false)} setUserAuthed={setUserAuthed} />
                  <Signup show={showSignup} onClose={() => setShowSignup(false)} setUserAuthed={setUserAuthed} />
                </>
              :
                <>
                  {/* Once user signs in, display account options */}
                  <Nav.Link className="hover-effect" href="#notifications"><img className="icon-img" src="../src/assets/icons/notifications-icon-173D23.svg" width="10px"></img></Nav.Link>
                  <Nav.Link className="hover-effect" eventKey={2} href="#profile"><img className="icon-img" src="../src/assets/icons/profile-icon-173D23.svg"></img></Nav.Link>
                  <Nav.Link className="hover-effect" eventKey={2} href="#settings"><img className="icon-img" src="../src/assets/icons/settings-icon-173D23.svg"></img></Nav.Link>
                </>
            }
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNav;