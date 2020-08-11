const express = require("express");
const {
  getPost,
  getPosts,
  createPost,
  deletePost,
  updatePost,
  uploadPhotoPost,
  getPostsCurrentUser,
  uploadPhotoCover,
} = require("../controllers/posts");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router
  .route("/me")
  .get(protect, authorize("user", "admin"), getPostsCurrentUser);

router
  .route("/:id/photo/post")
  .put(protect, authorize("user", "admin"), uploadPhotoPost);

router
  .route("/:id/photo/cover")
  .put(protect, authorize("user", "admin"), uploadPhotoCover);

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
