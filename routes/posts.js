const express = require("express");
const {
  getPost,
  getPosts,
  createPost,
  deletePost,
  updatePost,
} = require("../controllers/posts");
const router = express.Router();

router.route("/").get(getPosts).post(createPost);

router.route("/:id").get(getPost).delete(deletePost).put(updatePost);

module.exports = router;
