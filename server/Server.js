import path from "path";
import admin from "firebase-admin";
import express from "express";
import "dotenv/config";
import { connectToDb } from "./connections/db.js";
import cors from "cors";
import { createServer } from "http";
import newsLetterRouter from "./routes/NewsLetter.route.js";
import stockNewsRouter from "./routes/StockNews.route.js";
import pdfParseRouter from "./routes/PdfParser.route.js";
import contentGenerationRouter from "./routes/ContentGeneration.route.js";
import articlesRouter from "./routes/Articles.route.js";
import CheckUserAuthentication from "./middlewares/CheckUserAuthentication.js";
import connectToMongoDB from "./connections/MongooseConnection.js";
import SetupSocket from "./connections/SocketIOConnection.js";
import chatMessagesRouter from "./routes/Messages.route.js";

const credentials = JSON.parse(process.env.REACT_APP_FIREBASE_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();

app.use(
  cors({
    origin: process.env.REACT_APP_CORS_URL,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization", "authtoken"],
    credentials: true,
  })
);

const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../build")));

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

//mongo db connection
connectToMongoDB(
  `mongodb+srv://${process.env.REACT_APP_MONGO_USERNAME}:${process.env.REACT_APP_MONGO_PASSWORD}@organichomeappcluster.r2ywg.mongodb.net/organic-home-app-db?retryWrites=true&w=majority&appName=OrganicHomeAppCluster`
);

//socket io connection
SetupSocket(httpServer);

// Fetch chat messages from MongoDB
app.get("/api/messages", chatMessagesRouter);

app.use(CheckUserAuthentication);

//Newsletter subscription
app.use("/api/newsletter", newsLetterRouter);

//stock news
app.use("/api/trending-articles", stockNewsRouter);

//pdf parsing
app.use("/api/parse-pdf", pdfParseRouter);

// Hugging face AI content genaration
app.use("/api/generate", contentGenerationRouter);

//blog articles
app.use("/api/articles", articlesRouter);

const PORT = process.env.PORT || 8000;

connectToDb(() => {
  console.log("Successfully connected to database!");
  httpServer.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
  });
});
