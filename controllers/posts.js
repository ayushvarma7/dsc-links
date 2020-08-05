const Post = require("../models/Post");

// @desc    Get all Posts
// @route   GET /api/v1/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    const post = await Post.find();
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Get single Post
// @route   GET /api/v1/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ succes: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false });
  }
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
exports.updatePost = async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({ success: true, data: post });
};

// @desc    Delete a post
// @route   DELETE /api/v1/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  res.status(200).json({ success: true, msg: "Deleting a post" });
};
