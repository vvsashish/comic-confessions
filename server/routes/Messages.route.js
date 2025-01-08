import express from "express";
import { getChatMessages } from "../controllers/Messages.controller";

const chatMessagesRouter = express.Router();

chatMessagesRouter.get("/", getChatMessages);

export default chatMessagesRouter;
