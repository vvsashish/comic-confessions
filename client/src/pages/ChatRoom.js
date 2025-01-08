import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import io from "socket.io-client";

const socket = io(`${process.env.REACT_APP_BASE_URL}`);

function ChatRoom({ userName }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("messages")) || {
      messages: [],
      timestamp: 0,
    };
    const currentTime = new Date().getTime();
    // 4 hours in milliseconds
    const expiryTime = 4 * 60 * 60 * 1000;
    if (
      savedData.messages?.length > 0 &&
      currentTime - savedData.timestamp < expiryTime
    ) {
      setMessages(savedData.messages);
    } else {
      localStorage.removeItem("messages");
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/messages`)
        .then((response) => {
          setMessages(response.data);
          localStorage.setItem(
            "messages",
            JSON.stringify({ messages: response.data, timestamp: currentTime })
          );
        })
        .catch((error) => console.error("Error fetching messages:", error));
    }
    socket.on("message", (message) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, message];
        localStorage.setItem(
          "messages",
          JSON.stringify({ messages: updatedMessages, timestamp: currentTime })
        );
        return updatedMessages;
      });
    });
    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { text: message, user: userName });
      setMessage("");
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setMessage(value);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setMessage(value);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="8">
          <h2 className="gradient-text">Chat</h2>
          <div className="chat-dialog">
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <Form onSubmit={handleSend}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={handleChange}
              />
            </Form.Group>
            <Button
              className="mt-4 mb-2"
              variant="primary"
              onClick={sendMessage}
            >
              Send
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ChatRoom;
