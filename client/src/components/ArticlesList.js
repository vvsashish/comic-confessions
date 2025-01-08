import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Image } from "react-bootstrap";
import useThrottle from "../hooks/useThrottle";
import ArticleSearch from "./ArticleSearch";

const ArticlesList = ({ articles }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState(articles);

  const handleScroll = useThrottle(() => {
    setScrollPosition(window.scrollY);
  }, 200);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    setFilteredArticles(articles);
  }, [articles]);

  useEffect(() => {
    const filtered = articles.filter((article) => {
      const contentString = article.content.join(" ").toLowerCase();
      return (
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contentString.includes(searchTerm.toLowerCase())
      );
    });
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  const handleSearch = useCallback((searchTerm) => {
    setSearchTerm(searchTerm);
  }, []);

  return (
    <>
      <ArticleSearch onSearch={handleSearch} />
      {filteredArticles.length ? (
        filteredArticles?.map((article) => (
          <Row className="my-4" key={article._id}>
            <Col>
              <Image src={article?.image?.url || article?.imageUrl} thumbnail />
            </Col>
            <Col className="mb-4" key={article?.id}>
              <Card className="h-100 shadow-sm mt-2 home-cards">
                <Card.Body>
                  <Card.Title className="gradient-text">
                    {article?.title}
                  </Card.Title>
                  <Card.Text>
                    {article?.content[0] || article?.generatedContent}
                  </Card.Text>
                  <Link to={`/blog/${article?.id}`} className="btn btn-primary">
                    Read More
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))
      ) : (
        <div className="text-center">
          <b>No articles found.</b>
        </div>
      )}
    </>
  );
};

export default ArticlesList;
