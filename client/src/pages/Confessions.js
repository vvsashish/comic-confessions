import React, { useState } from "react";
import { Container } from "react-bootstrap";
import ConfessionsNavBar from "../components/ConfessionsNavBar";
import ChatRoom from "./ChatRoom";
import VideoInterface from "./VideoInterface";
import useUser from "../hooks/useUser";

function Confessions() {
  const [selectedComponent, setSelectedComponent] = useState("chatRoom");
  const { user, userName } = useUser();

  const handleSelect = (eventKey) => {
    setSelectedComponent(eventKey);
  };
  const renderComponent = () => {
    switch (selectedComponent) {
      case "chatRoom":
        return <ChatRoom userName={userName} />;
      case "videoRoom":
        return <VideoInterface userName={userName} />;
      default:
        return <ChatRoom userName={userName} />;
    }
  };
  return (
    <Container>
      <ConfessionsNavBar userName={userName} onSelect={handleSelect} />
      {user ? (
        <div>{renderComponent()}</div>
      ) : (
        <div className="text-center">
          <b>Please login.</b>
        </div>
      )}
    </Container>
  );
}
export default Confessions;
