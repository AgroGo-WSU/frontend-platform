import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

// this is a React Bootstrap component - you can find docs for this at https://react-bootstrap.netlify.app/docs/components/navbar
// this is the "CollapsibleExample" navbar, the first under "Responsive behaviors section"
// the CSS file is in the App.tsx folder, and to make changes to it, you have to go to this path: \frontend-platform\agrogo\node_modules\bootstrap\dist\css\bootstrap.css
// I changed the css file to be the regular, not the .min css to make it easier for us to change, but it can be switched back to .min later to svae space

function TopNav() {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        {/* TODO: change these href routes to new pages/state so the links actually go somewhere */}
        <Navbar.Brand href="#home">AgroGo</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">I'm a Bootstrap component that you can edit in TopNav
          <Nav className="me-auto">
            <Nav.Link href="#features">Weather</Nav.Link>
            <Nav.Link href="#pricing">Inventory</Nav.Link>
            <NavDropdown title="Actions" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Set watering</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Set fan</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">View greenhouse stats</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Manage zones
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="#notifications">notifications icon</Nav.Link>
            <Nav.Link eventKey={2} href="#profile">profile icon</Nav.Link>
            <Nav.Link eventKey={2} href="#settings">settings icon</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNav;