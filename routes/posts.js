const express = require("express");
const {
  getPost,
  getPosts,
  createPost,
  deletePost,
  updatePost,
  uploadPhoto,
} = require("../controllers/posts");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router
  .route("/:id/photo")
  .put(protect, authorize("user", "admin"), uploadPhoto);

router
  .route("/")
  .get(getPosts)
  .post(protect, authorize("user", "admin"), createPost);

router
  .route("/:id")
  .get(getPost)
  .delete(protect, authorize("user", "admin"), deletePost)
  .put(protect, authorize("user", "admin"), updatePost);

//TODO Add route to get all posts of the logged in user

module.exports = router;
