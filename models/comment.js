const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: { type: String, required: true },
  content: { type: String, required: true },
  date_post: { type: Date, default: Date.now },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
});

module.exports = mongoose.model("Comment", CommentSchema);
