import React, { useState, useEffect } from "react";
import { Card, Carousel, Col, Container, Row } from "react-bootstrap";
import axios from "axios";

const StocksNewsPage = () => {
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios(
          `${process.env.REACT_APP_BASE_URL}/api/trending-articles`
        );
        setArticles(response.data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchArticles();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = axios(
          `${process.env.REACT_APP_BASE_URL}/api/trending-articles`
        );
        setArticles(response.data);
        const expiryTime = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 hours from now
        localStorage.setItem(
          "trendingArticles",
          JSON.stringify({ articles, expiryTime })
        );
      } catch (error) {
        setError(error.message);
      }
    };
    const storedData = localStorage.getItem("trendingArticles");
    if (storedData) {
      const { data, expiryTime } = JSON.parse(storedData);
      if (new Date().getTime() < expiryTime) {
        setArticles(data);
      } else {
        localStorage.removeItem("trendingArticles");
        fetchData();
      }
    } else {
      fetchData();
    }
  }, []);
  if (error) return <div>Error: {error}</div>;
  if (!articles?.data.length)
    return <div>Loading the top news articles...</div>;
  return (
    <Container>
      <h2 className="mb-3 gradient-text">Trending Articles</h2>
      <Carousel interval={5000} fade className="mb-4">
        {articles?.data.slice(0, 5).map((item) => (
          <Carousel.Item key={item.id}>
            <img
              className="d-block w-100"
              src={item.links.uriImage}
              alt={item.attributes.title}
            />
            <Carousel.Caption>
              <h3>{item.attributes.title}</h3>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      <Container>
        <Row>
          {articles?.data.map((article) => (
            <Col key={article.id} sm={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={article.links.uriImage} />
                <Card.Body>
                  <Card.Title>{article.attributes.title}</Card.Title>
                  <Card.Text>
                    <a
                      href={
                        process.env.REACT_APP_SEEKING_ALPHA_BASE_URL +
                        article.links.self
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read more
                    </a>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default StocksNewsPage;
