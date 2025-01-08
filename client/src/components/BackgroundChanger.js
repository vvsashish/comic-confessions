import React, { useEffect, useState } from "react";
import { NavDropdown } from "react-bootstrap";

function BackgroundChanger() {
  const [defaultBackground, setDefaultBackground] = useState("");

  useEffect(() => {
    const rootElement = document.getElementById("root");
    const currentBackground = getComputedStyle(rootElement).background;
    const savedBackground =
      localStorage.getItem("background") || currentBackground;
    rootElement.style.background = savedBackground;
    setDefaultBackground(currentBackground);
  }, []);

  const handleSelect = (background) => {
    document.getElementById("root").style.background = background;
    localStorage.setItem("background", background);
  };

  return (
    <NavDropdown
      title="Change Background"
      id="basic-nav-dropdown"
      onSelect={handleSelect}
    >
      <NavDropdown.Item eventKey={defaultBackground}>Rainbow</NavDropdown.Item>
      <NavDropdown.Item eventKey="linear-gradient(to right, purple, pink)">
        Pruple pink
      </NavDropdown.Item>
      <NavDropdown.Item eventKey="none">none</NavDropdown.Item>
    </NavDropdown>
  );
}

export default BackgroundChanger;
