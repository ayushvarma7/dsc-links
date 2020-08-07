const express = require("express");
const {
  getPost,
  getPosts,
  createPost,
  deletePost,
  updatePost,
  uploadPhoto,
  getPostsCurrentUser,
} = require("../controllers/posts");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router
  .route("/me")
  .get(protect, authorize("user", "admin"), getPostsCurrentUser);

router
  .route("/:id/photo")
  .put(protect, authorize("user", "admin"), uploadPhoto);

router
  .route("/:id")
  .get(getPost)
  .delete(protect, authorize("user", "admin"), deletePost)
  .put(protect, authorize("user", "admin"), updatePost);

router
  .route("/")
  .get(getPosts)
  .post(protect, authorize("user", "admin"), createPost);

module.exports = router;
