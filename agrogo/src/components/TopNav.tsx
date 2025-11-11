import "../stylesheets/TopNav.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import InventoryPopUp from "./Inventory/InventoryPopUp.tsx";
import { useAuth } from "../hooks/UseAuth.tsx";
import { FirebaseError } from "firebase/app";
import { doSignOut } from "./firebase/auth";
import React, { useState } from "react";

function TopNav() {
  const { userLoggedIn } = useAuth();
  const [error, setError] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const onSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!userLoggedIn) {
      setError("Error: user already signed out...");
      console.error(error);
      return;
    }
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      await doSignOut();
    } catch (err) {
      if (err instanceof FirebaseError) setError(err.message);
      console.error(error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Navbar
      data-bs-theme="light"
      collapseOnSelect
      expand="lg"
      className="bg-body-tertiary agro-navbar d-flex justify-content-between align-items-center"
    >
      {/* LEFT SIDE: logo + nav content in the centered container */}
      <Container className="main-nav-container">
        <Navbar.Brand id="nav-bar-title">AgroGo</Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>
              <InventoryPopUp />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* RIGHT SIDE: Sign Out flush to the right edge */}
      <button
        className="signout-button nav-signout"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => onSignOut(e)}
        disabled={isSigningOut}
      >
        {isSigningOut ? "Signing Out..." : "Sign Out"}
      </button>
    </Navbar>
  );
}

export default TopNav;
