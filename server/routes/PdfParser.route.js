import express from "express";
import multer from "multer";
import { parseBankStatement } from "../controllers/PdfParser.controller";
import getStorage from "../utils/FileStorage";

const pdfParseRouter = express.Router();
const upload = multer({ storage: getStorage("statements") });

pdfParseRouter.post("/", upload.single("bankStatement"), parseBankStatement);

export default pdfParseRouter;
