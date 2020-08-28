const Post = require("../models/Post");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");
const Club = require("../models/Club");
const multer = require("multer");
const he = require("he");

// //STORAGE MULTER CONFIG
// let storage = multer.diskStorage({
//   destination: (req, res, cb) => {
//     cb(null, `${process.env.FILE_UPLOAD_PATH}/`);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     if (ext !== ".jpg" && ext !== ".png" && ext !== ".mp4") {
//       return cb(res.status(400).end("only jpg, png, mp4 is allowed"), false);
//     }
//     cb(null, true);
//   },
// });

// const upload = multer({ storage: storage }).single("file");

exports.uploadFile = asyncHandler(async (req, res, next) => {

  if (!req.files) {
    return next(new ErrorResponse(`Please actually upload a file`, 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`That was not an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload a smaller size`, 400));
  }

  file.name = `${Date.now()}_photo_post_image_${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("File not uploaded", 500));
    }

    // await Post.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      fileName: file.name,
      url: `uploads/${file.name}`
    });
  });
});

/*

upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    console.log(req.files.file);
    console.log("thisiisisisis");
    console.log(res.req.files.file);
    return res.json({
      success: true,
      url: "should be the url",
      fileName: "should the filename"
    });
  });


*/

// @desc    Get all Posts
// @route   GET /api/v1/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ["select", "sort", "limit", "page"];

  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Post.find(JSON.parse(queryStr));

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 15;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const post = await query;

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: post.length,
    pagination: pagination,
    data: post,
  });
});

// @desc    Get single Post
// @route   GET /api/v1/posts/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({ succes: true, data: post });
});

// @desc    Get all posts by current user
// @route   GET /api/v1/posts/me/curr
// @access  Private
exports.getPostsCurrentUser = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ["select", "sort", "limit", "page"];

  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Post.find(JSON.parse(queryStr));

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 15;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const post = await query;

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: post.length,
    pagination: pagination,
    data: post,
  });
});

// @desc    Create a post
// @route   POST /api/v1/posts/
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.author_name = req.user.name;
  req.body.author_email = req.user.email;
  req.body.content = he.decode(req.body.content);

  let club_by_name = "";
  const getClubId = async () => {
    club_by_name = await Club.find({ name: req.body.club });
    console.log("This is the  info of the club");
    console.log(club_by_name[0]);
  };

  const createPost = async () => {
    console.log(club_by_name[0].id);
    req.body.club_id = club_by_name[0].id;

    const post = await Post.create(req.body);
    res.status(201).json({
      success: true,
      data: post,
    });
  };

  const list = [getClubId, createPost];

  for (const fn of list) {
    await fn();
  }
});

// @desc    Update a post
// @route   PUT /api/v1/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  req.body.content = he.decode(req.body.content);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`),
      404
    );
  }

  //Correct User
  if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse("You are not authorized for updating this post"),
      401
    );
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: post });
});

// @desc    Delete a post
// @route   DELETE /api/v1/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`),
      404
    );
  }

  //Correct User
  if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse("You are not authorized for delete this post"),
      401
    );
  }

  post.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Upload Photo for the Post
// @route   PUT /api/v1/posts/:id/photo/post
// @access  Private
exports.uploadPhotoPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`),
      404
    );
  }

  //Correct User
  if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse("You are not authorized for update this post"),
      401
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please actually upload a file`, 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`That was not an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload a smaller size`, 400));
  }

  file.name = `photo_post_${post._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("File not uploaded", 500));
    }

    await Post.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

// @desc    Upload Photo for the Post (Cover)
// @route   PUT /api/v1/posts/:id/photo/cover
// @access  Private
exports.uploadPhotoCover = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`),
      404
    );
  }

  //Correct User
  if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse("You are not authorized for update this post"),
      401
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please actually upload a file`, 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`That was not an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload a smaller size`, 400));
  }

  file.name = `photo_post_cover_${post._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("File not uploaded", 500));
    }

    await Post.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
