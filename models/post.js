const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  writer: String,
  content: String,
  date: String,
  title: String,
});

PostSchema.virtual("postId").get(function () {
  return this._id.toHexString();
});
PostSchema.set("toJSON", {
  viturals: true,
});

module.exports = mongoose.model("Post", PostSchema);
