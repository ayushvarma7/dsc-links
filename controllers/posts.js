const Post = require("../models/Post");

// @desc    Get all Posts
// @route   GET /api/v1/posts
// @access  Public
exports.getPosts = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all posts" });
};

// @desc    Get single Post
// @route   GET /api/v1/posts/:id
// @access  Public
exports.getPost = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show single post" });
};

// @desc    Create a post
// @route   POST /api/v1/posts/
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    const post = await Post.create(req.body);

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Update a post
// @route   PUT /api/v1/posts/:id
// @access  Private
exports.updatePost = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Updating a post" });
};

// @desc    Delete a post
// @route   DELETE /api/v1/posts/:id
// @access  Private
exports.deletePost = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Deleting a post" });
};
