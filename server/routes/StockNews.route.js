import express from "express";
import { getStockNews } from "../controllers/StockNews.controller";

const stockNewsRouter = express.Router();

stockNewsRouter.get("/", getStockNews);
export default stockNewsRouter;
