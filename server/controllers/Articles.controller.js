import Articles from "../models/Articles.model.js";
import { ObjectId } from "mongodb";
import { db } from "../connections/db.js";

export async function getAllArticles(req, res) {
  try {
    const articles = await Articles.find().sort({ createdAt: 1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getArticleById(req, res) {
  const { id } = req.params;
  const { uid } = req.user;
  const article = await db
    .collection("articles")
    .findOne({ _id: new ObjectId(id) });
  if (article) {
    const upvoteIds = article.upvoteIds || [];
    article.canUpvote = uid && !upvoteIds.includes(uid);
    res.json(article);
  } else {
    res.sendStatus(404);
  }
}
export async function saveArticle(req, res) {
  const { title, content, generatedContent, imageUrl, isGenerated, date } =
    req.body;

  try {
    const article = {
      title,
      content: [content || generatedContent],
      imageUrl,
      isGenerated,
      date: new Date(date),
      upvoteIds: [],
      upvotes: 0,
      comments: [],
    };
    const result = await db.collection("articles").insertOne(article);
    const insertedArticle = await db
      .collection("articles")
      .findOne({ _id: result.insertedId });
    res.status(201).json(insertedArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function upvoteArticle(req, res) {
  const { id } = req.params;
  const { uid } = req.user;

  const article = await db
    .collection("articles")
    .findOne({ _id: new ObjectId(id) });
  if (article) {
    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);

    if (canUpvote) {
      await db.collection("articles").updateOne(
        { _id: new ObjectId(id) },
        {
          $inc: { upvotes: 1 },
          $push: { upvoteIds: uid },
        }
      );
    }

    const updatedArticle = await db
      .collection("articles")
      .findOne({ _id: new ObjectId(id) });
    res.json(updatedArticle);
  } else {
    res.send("That article doesn't exist");
  }
}
export async function addCommentsToArticle(req, res) {
  const { id } = req.params;
  const { text } = req.body;
  const { email } = req.user;

  await db.collection("articles").updateOne(
    { _id: new ObjectId(id) },
    {
      $push: { comments: { postedBy: email, text } },
    }
  );
  const article = await db
    .collection("articles")
    .findOne({ _id: new ObjectId(id) });

  if (article) {
    res.json(article);
  } else {
    res.send("That article doesn't exist!");
  }
}
