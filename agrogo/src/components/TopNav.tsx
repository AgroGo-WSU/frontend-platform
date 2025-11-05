import { useMemo, useState } from "react";
import { Nav, Navbar, Container, NavDropdown, Offcanvas } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../stylesheets/TopNav.css";
import { doSignOut } from "./firebase/auth";

// Icons
import bellIcon from "../assets/icons/notifications-icon-173D23.svg";
import userIcon from "../assets/icons/profile-icon-173D23.svg";
import gearIcon from "../assets/icons/settings-icon-173D23.svg";



export default function TopNav() {
  const navigate = useNavigate();

  // open/close notifications panel
  const [showNotifs, setShowNotifs] = useState(false);


  const demoItems = useMemo(
    () => [
      { id: "1", title: "Greenhouse tip", body: "Try raising fan speed during midday heat.", time: "1m ago" },
    ],
    []
  );

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate("/"); 
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <>
      <Navbar expand="lg" className="agro-navbar" fixed="top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" id="nav-bar-title">
            AgroGo
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="agro-navbar-nav" />
          <Navbar.Collapse id="agro-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/weather">Weather</Nav.Link>
              <Nav.Link as={Link} to="/inventory">Inventory</Nav.Link>
              <NavDropdown title="Actions" id="actions-dropdown">
                <NavDropdown.Item as={Link} to="/automation">Automations</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
              </NavDropdown>
            </Nav>

            <Nav className="green-icons align-items-center">
              <Nav.Link
                as={Link}
                to="/notifications"
                aria-label="Notifications"
                onClick={(e) => { e.preventDefault(); setShowNotifs(true); }}
              >
                <img className="icon-img" src={bellIcon} alt="Notifications" />
              </Nav.Link>

              <Nav.Link as={Link} to="/profile" aria-label="Profile">
                <img className="icon-img" src={userIcon} alt="User Profile" />
              </Nav.Link>
              <Nav.Link as={Link} to="/settings" aria-label="Settings">
                <img className="icon-img" src={gearIcon} alt="Settings" />
              </Nav.Link>

              <button type="button" className="signout-btn ms-2" onClick={handleSignOut}>
                Sign Out
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Right-side sliding modal */}
      <Offcanvas
        placement="end"
        show={showNotifs}
        onHide={() => setShowNotifs(false)}
        scroll
        backdrop
        className="agro-notifs-modal"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="agro-notifs-title">Notifications</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {demoItems.length === 0 ? (
            <div>
              <p>No notifications yet.</p>
              <p className="muted">You’ll see plant tips, alerts, and updates here.</p>
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
              {demoItems.map((n) => (
                <li
                  key={n.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 10,
                    padding: "10px 8px",
                    border: "1px solid #e3d6cf",
                    borderRadius: 12,
                    background: "#fff",
                  }}
                >
                  <div style={{ width: 10, height: 10, marginTop: 6, borderRadius: "50%", background: "#1c7ed6" }} />
                  <div>
                    <div style={{ color: "#173D23", fontWeight: 700 }}>{n.title}</div>
                    <div style={{ color: "#173D23" }}>{n.body}</div>
                    <div style={{ color: "#6b7a70", fontSize: "0.8rem", marginTop: 2 }}>{n.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
