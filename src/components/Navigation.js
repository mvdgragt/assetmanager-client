import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar'; 
import { Button } from "react-bootstrap";

const Navigation = ({ logoutUser }) => {
  return (
    <Navbar bg="light" variant="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">ISH Assetmanager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="./listassets">List All Devices</Nav.Link>
            <Nav.Link href="/">List All Assets</Nav.Link>
            <Nav.Link href="./devices">Register Device</Nav.Link>
            <Nav.Link href="./persons">Register Person</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Button variant="success" onClick={logoutUser}>Logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;