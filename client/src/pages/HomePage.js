import React, { useEffect } from "react";
import { Container, Col, Card, Button } from "react-bootstrap";
import useUser from "../hooks/useUser";
import { useDispatch, useSelector } from "react-redux";
import { checkSubscriptionStatus, subscribe } from "../redux/actions";
import "../App.css";
const HomePage = () => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const isSubscribed = useSelector((state) => state.subscription.isSubscribed);
  const loading = useSelector((state) => state.subscription.loading);
  useEffect(() => {
    if (user) {
      dispatch(checkSubscriptionStatus(user.email));
    }
  }, [user, dispatch]);

  const handleSubscribe = () => {
    if (!user) {
      alert("Please log in to subscribe");
      return;
    }
    dispatch(subscribe(user.email));
  };
  if (loading) {
    return (
      <Button variant="primary" disabled>
        Loading...
      </Button>
    );
  }
  return (
    <Container className="card-container">
      <Col md={6} className="card-content">
        <Card className="text-center shadow-lg home-cards">
          <Card.Body>
            <Card.Title>
              <h1 className="gradient-text">Welcome to My Blog Site</h1>
            </Card.Title>
            <Card.Text>
              Discover a world of insightful articles and creative content
              generated with the help of generative AI technology. This blog
              site offers a unique experience where you can explore a variety of
              topics and enjoy well-crafted posts and much more.
            </Card.Text>
            <Button variant="warning" href="/blog">
              Explore Blogs
            </Button>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6} className="card-content">
        <Card className="text-center shadow-lg mt-2 home-cards">
          <Card.Body>
            <Card.Title>
              <h2 className="gradient-text">My Vision</h2>
            </Card.Title>
            <Card.Text>
              Simplify your daily life with the help of this interactive site.
              Connect with people and learn about the top world news at one go.
              Analyze your daily expenditure and much more. This site will be
              your goto assistant which will enhance your life.
            </Card.Text>
            <Button variant="primary" href="/about">
              Read More
            </Button>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} className="card-content">
        <Card className="text-center shadow-lg mt-2 home-cards">
          <Card.Body>
            <Card.Title>
              <h2 className="gradient-text">Getting Creative</h2>
            </Card.Title>
            <Card.Text>
              AGI all around us. Play with the new Gen AI interface to create
              blog posts and share it with your friends and loved ones. Maybe
              you folks connect on a video call or atleast chat.
            </Card.Text>
            <Button variant="primary" href="/new-blog-post">
              Try it
            </Button>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} className="card-content">
        <Card className="text-center shadow-lg mt-2 home-cards">
          <Card.Body>
            <Card.Title>
              <h2 className="gradient-text">Subscribe to newsletters</h2>
            </Card.Title>
            <Card.Text>
              Stay updated with the latest blog posts. Dive into a variety of
              topics and enjoy fresh content regularly. The subscription is
              free. But the catch here is, I won't let you unsubscribe because
              <b> You're Important</b> &#40;atleast to me&#41; &#129395;.
            </Card.Text>
            <Button
              variant="primary"
              onClick={handleSubscribe}
              disabled={isSubscribed || !user}
            >
              {user
                ? isSubscribed
                  ? "Already Subscribed"
                  : "Subscribe"
                : "Login to Subscribe"}
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
};

export default HomePage;
