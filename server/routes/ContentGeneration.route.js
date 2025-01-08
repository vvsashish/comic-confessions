import express from "express";
import {
  generateImageContent,
  generateTextContent,
} from "../controllers/ContentGeneration.controller";

const contentGenerationRouter = express.Router();

contentGenerationRouter.post("/content", generateTextContent);

contentGenerationRouter.post("/image", generateImageContent);

export default contentGenerationRouter;
