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
          <Nav.Link href="./listassets" className="text-dark text-decoration-none">List All Devices</Nav.Link>
          <Nav.Link href="/" className="text-dark text-decoration-none">List All Assets</Nav.Link>
          <Nav.Link href="./devices" className="text-dark text-decoration-none">Register Device</Nav.Link>
          <Nav.Link href="./persons" className="text-dark text-decoration-none">Register Person</Nav.Link>
          <Nav.Link href="./excelupload" className="text-dark text-decoration-none">Excel Upload</Nav.Link>
          <Nav.Link href="./registermovement" className="text-dark text-decoration-none">New Booking</Nav.Link>
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