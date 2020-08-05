const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: [true, "Please add a heading for your post."],
  },
  club: {
    type: String,
    required: [true, "Please add a club name for your post."],
  },
  description: {
    type: String,
    required: [true, "Please add a description for your post."],
  },
  content: {
    type: String,
    required: [true, "Please add content for your post."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: String,
});

module.exports = mongoose.model("Post", PostSchema);
