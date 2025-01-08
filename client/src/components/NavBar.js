import { getAuth, signOut } from "firebase/auth";
import useUser from "../hooks/useUser";
import { Button, Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../logo.svg";
import { ReactComponent as LogoDark } from "../logo_dark.svg";
import noUserImage from "../noUser.jpg";
import { useEffect, useState } from "react";
import BackgroundChanger from "./BackgroundChanger";

const NavBar = () => {
  const { user, userName } = useUser();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <Navbar bg={theme} variant={theme} expand="lg" fixed="top">
      <Container className="mx-2">
        <Navbar.Brand href="/">
          {theme === "light" ? (
            <LogoDark className="animated-logo" />
          ) : (
            <Logo className="animated-logo" />
          )}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Container className="d-flex justify-content-between">
            <Nav className="ml-auto">
              <Nav.Link as={NavLink} to="/" end>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about">
                About
              </Nav.Link>
              <Nav.Link as={NavLink} to="/blog">
                Blog
              </Nav.Link>
              <Nav.Link as={NavLink} to="/new-blog-post">
                Create a blog post
              </Nav.Link>
              <Nav.Link as={NavLink} to="/confessions">
                Confessions
              </Nav.Link>
              <Nav.Link as={NavLink} to="/stocksNews">
                Stock News
              </Nav.Link>
              <Nav.Link as={NavLink} to="/pdfparse">
                Pdf Parser
              </Nav.Link>
              <BackgroundChanger />
            </Nav>
            <Nav className="ml-auto">
              <Button
                variant={theme === "light" ? "dark" : "light"}
                onClick={toggleTheme}
                className="ml-2"
              >
                {" "}
                {theme === "light" ? (
                  <i className="bi bi-moon"></i>
                ) : (
                  <i className="bi bi-sun"></i>
                )}{" "}
              </Button>
              {!user && (
                <>
                  <Nav.Link as={NavLink} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/signup">
                    Signup
                  </Nav.Link>
                </>
              )}
              {user && (
                <Container className="ml-2">
                  <Dropdown>
                    <Dropdown.Toggle
                      as="div"
                      id="dropdown-basic"
                      className="p-0 border-0 bg-transparent"
                    >
                      <img
                        src={user.photoURL ? user.photoURL : noUserImage}
                        alt={userName}
                        className="rounded-circle"
                        style={{
                          width: "40px",
                          height: "40px",
                          marginRight: "10px",
                        }}
                      />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item as={NavLink} to="/user-profile">
                        Your Profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          signOut(getAuth());
                          navigate("/");
                        }}
                      >
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Container>
              )}
            </Nav>
          </Container>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
