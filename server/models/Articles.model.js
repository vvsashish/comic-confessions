import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  postedBy: { type: String, required: true },
  text: { type: String, required: true },
});
const articlesSchema = new Schema(
  {
    name: { type: String, required: true },
    upvotes: { type: Number, required: true },
    image: {
      url: { type: String, required: false },
    },
    comments: [commentSchema],
    upvoteIds: [{ type: String }],
    content: [{ type: String, required: false }],
  },
  {
    timestamps: true,
  }
);

const Articles = mongoose.model("Articles", articlesSchema);

module.exports = Articles;
