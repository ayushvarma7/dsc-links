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
  photo: {
    type: String,
    default: "none.jpg",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Post", PostSchema);
