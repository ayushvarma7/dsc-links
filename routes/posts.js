const express = require("express");
const {
  getPost,
  getPosts,
  createPost,
  deletePost,
  updatePost,
  uploadPhoto,
} = require("../controllers/posts");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(getPosts).post(protect, createPost);

router
  .route("/:id")
  .get(getPost)
  .delete(protect, deletePost)
  .put(protect, updatePost);

router.route("/:id/photo").put(protect, uploadPhoto);

//TODO Add route to get all posts of the logged in user


module.exports = router;
