import express from "express";
import CheckUserExists from "../middlewares/CheckUser.js";
import {
  addCommentsToArticle,
  getAllArticles,
  getArticleById,
  saveArticle,
  upvoteArticle,
} from "../controllers/Articles.controller.js";

const articlesRouter = express.Router();

articlesRouter.get("/", getAllArticles);

articlesRouter.get("/:id", getArticleById);

articlesRouter.post("/", saveArticle);

articlesRouter.use(CheckUserExists);

articlesRouter.put("/:id/upvote", upvoteArticle);

articlesRouter.post("/:id/comments", addCommentsToArticle);

export default articlesRouter;
