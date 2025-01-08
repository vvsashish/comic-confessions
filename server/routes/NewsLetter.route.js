import express from "express";
import {
  checkNewsLetterSubscription,
  subscribeNewsLetter,
} from "../controllers/NewsLetter.controller";

const newsLetterRouter = express.Router();

newsLetterRouter.get("/isSubscribed", checkNewsLetterSubscription);

newsLetterRouter.post("/subscribe", subscribeNewsLetter);
export default newsLetterRouter;
