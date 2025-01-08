import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import useUser from "../hooks/useUser";

const ConfessionsNavBar = ({ onSelect, userName }) => {
  const { user } = useUser();

  return (
    <Container>
      <Navbar expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className="mr-auto"
            variant="tabs"
            onSelect={onSelect}
            defaultActiveKey="chatRoom"
          >
            <Nav.Link eventKey="chatRoom">Chat Room</Nav.Link>
            <Nav.Link eventKey="videoRoom">Video Room</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {user && (
        <div>
          <p>
            <b>Logged in as:</b> {userName}
          </p>
        </div>
      )}
    </Container>
  );
};

export default ConfessionsNavBar;
