import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NotFoundPage from "./NotFoundPage";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";
import { Button, Card, Container, Image } from "react-bootstrap";

const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState({
    upvotes: 0,
    comments: [],
    canUpvote: false,
  });
  const { canUpvote } = articleInfo;
  const { articleId } = useParams();

  const { user, isLoading } = useUser();

  useEffect(() => {
    const loadArticleInfo = async () => {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/articles/${articleId}`,
        {
          headers,
        }
      );
      const newArticleInfo = response.data;
      setArticleInfo(newArticleInfo);
    };

    if (!isLoading) {
      loadArticleInfo();
    }
  }, [isLoading, user]);

  const addUpvote = async () => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const response = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/articles/${articleId}/upvote`,
      null,
      { headers }
    );
    const updatedArticle = response.data;
    setArticleInfo(updatedArticle);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!articleInfo) {
    return <NotFoundPage />;
  }

  return (
    <Container>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>
            <h2 className="gradient-text">{articleInfo?.title}</h2>
          </Card.Title>
          <Card.Text>
            {articleInfo?.date ? formatDate(articleInfo?.date) : null}
          </Card.Text>
          <div className="upvotes-section mb-3">
            {user ? (
              <Button
                variant="danger"
                onClick={addUpvote}
                disabled={!canUpvote}
              >
                {canUpvote ? (
                  <>
                    <i className="bi bi-balloon-heart"></i>Upvote
                  </>
                ) : (
                  <>
                    <i className="bi bi-balloon-heart-fill">Upvoted</i>
                  </>
                )}
              </Button>
            ) : (
              <Button variant="secondary" disabled>
                Log in to upvote
              </Button>
            )}
            <p className="mt-2">
              This article has {articleInfo?.upvotes} upvote(s)
            </p>
          </div>
          <Image
            src={articleInfo?.image?.url || articleInfo?.imageUrl}
            thumbnail
            fluid
            className="mb-2"
          />
          {articleInfo?.content?.map((paragraph, i) => (
            <Card.Text key={i}>{paragraph}</Card.Text>
          ))}
          {user ? (
            <AddCommentForm
              articleName={articleId}
              onArticleUpdated={(updatedArticle) =>
                setArticleInfo(updatedArticle)
              }
            />
          ) : (
            <Button variant="secondary" disabled>
              Log in to add a comment
            </Button>
          )}
          <CommentsList comments={articleInfo.comments} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ArticlePage;
