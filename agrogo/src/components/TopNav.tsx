import "../stylesheets/TopNav.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ConnectivityStatus from "./ConnectivityStatus";
import { useAuth } from "../hooks/UseAuth.tsx";
import { FirebaseError } from 'firebase/app';
import { doSignOut } from "./firebase/auth";
import React, { useState } from "react";

function TopNav() {
  const { userLoggedIn } = useAuth();
  const [error, setError] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const onSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(!userLoggedIn) { setError("Error: user already signed out..."); console.error(error); return; }
    if(isSigningOut) return;
    setIsSigningOut(true);
    try { await doSignOut(); } 
    catch (err) { if(err instanceof FirebaseError) setError(err.message); console.error(error); } 
    finally { setIsSigningOut(false); }
  }

  return (
    <Navbar data-bs-theme="light" collapseOnSelect expand="lg" className="bg-body-tertiary agro-navbar">
      <Container>
        <Navbar.Brand href="#home" id="nav-bar-title">AgroGo</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#weather">Weather</Nav.Link>
            <Nav.Link href="#inventory">Inventory</Nav.Link>
            <NavDropdown title="Actions" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#watering">Set watering</NavDropdown.Item>
              <NavDropdown.Item href="#fan">Set fan</NavDropdown.Item>
              <NavDropdown.Item href="#greenhouse-stats">View greenhouse stats</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#manage-zones">Manage zones</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="align-items-center" style={{ gap: 12 }}>
            <ConnectivityStatus />
            <Nav.Link href="#notifications"><img className="icon-img" src="../src/assets/icons/notifications-icon-173D23.svg" width="10px" /></Nav.Link>
            <Nav.Link eventKey={2} href="#profile"><img className="icon-img" src="../src/assets/icons/profile-icon-173D23.svg" /></Nav.Link>
            <Nav.Link eventKey={2} href="#settings"><img className="icon-img" src="../src/assets/icons/settings-icon-173D23.svg" /></Nav.Link>
            <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => onSignOut(e)}>Sign Out</button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNav;
