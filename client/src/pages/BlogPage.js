import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import ArticlesList from "../components/ArticlesList";
import axios from "axios";

const Blog = () => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const loadArticles = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/articles`
      );
      const articlesWithId = response.data.map((article) => ({
        ...article,
        id: article._id,
      }));
      setArticles(articlesWithId);
    };
    loadArticles();
  }, []);
  return (
    <Container>
      <h1 className="text-center gradient-text">Top Articles</h1>
      <Button variant="warning" type="button" href="/new-blog-post">
        <i className="bi bi-file-earmark-plus"></i> Create a new Blog Post
      </Button>
      <ArticlesList articles={articles} />
    </Container>
  );
};

export default Blog;
