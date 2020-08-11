const Club = require("../models/Club");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");

// @desc    Get all Clubs
// @route   GET /api/v1/clubs
// @access  Public
exports.getClubs = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ["select", "sort", "limit", "page"];

  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Club.find(JSON.parse(queryStr));

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
  const total = await Club.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const club = await query;

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
    count: club.length,
    pagination: pagination,
    data: club,
  });
});

// @desc    Get single Club
// @route   GET /api/v1/club/:id
// @access  Public
exports.getClub = asyncHandler(async (req, res, next) => {
  const club = await Club.findById(req.params.id);

  if (!club) {
    return next(
      new ErrorResponse(`Club not found with id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({ succes: true, data: club });
});

// @desc    Get all clubs by current user
// @route   GET /api/v1/clubs/me/curr
// @access  Private
exports.getClubsCurrentUser = asyncHandler(async (req, res, next) => {
  const club = await Club.find({ user: req.user.id });

  if (!club) {
    return next(
      new ErrorResponse(`Club not found with id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({ succes: true, data: club });
});

// @desc    Create a Club
// @route   POST /api/v1/club/
// @access  Private
exports.createClub = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const club = await Club.create(req.body);

  res.status(201).json({
    success: true,
    data: club,
  });
});

// @desc    Update a Club
// @route   PUT /api/v1/clubs/:id
// @access  Private
exports.updateClub = asyncHandler(async (req, res, next) => {
  let club = await Club.findById(req.params.id);

  if (!club) {
    return next(
      new ErrorResponse(`Club not found with id of ${req.params.id}`),
      404
    );
  }

  //Correct User
  if (club.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse("You are not authorized for updating this club"),
      401
    );
  }

  club = await Club.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: club });
});

// @desc    Delete a club
// @route   DELETE /api/v1/clubs/:id
// @access  Private
exports.deleteClub = asyncHandler(async (req, res, next) => {
  const club = await Club.findById(req.params.id);

  if (!club) {
    return next(
      new ErrorResponse(`Club not found with id of ${req.params.id}`),
      404
    );
  }

  //Correct User
  if (club.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse("You are not authorized for delete this club"),
      401
    );
  }

  club.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Upload Club Photo
// @route   PUT /api/v1/clubs/:id/photo_club
// @access  Private
exports.uploadPhotoClub = asyncHandler(async (req, res, next) => {
  const club = await Club.findById(req.params.id);

  if (!club) {
    return next(
      new ErrorResponse(`Club not found with id of ${req.params.id}`),
      404
    );
  }

  //Correct User
  if (club.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse("You are not authorized for updating this club."),
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

  file.name = `photo_club_${club._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("File not uploaded", 500));
    }

    await Club.findByIdAndUpdate(req.params.id, { club_image: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

// @desc    Upload Club Photo Lead
// @route   PUT /api/v1/clubs/:id/photo_club/lead
// @access  Private
exports.uploadPhotoLeadClub = asyncHandler(async (req, res, next) => {
  const club = await Club.findById(req.params.id);

  if (!club) {
    return next(
      new ErrorResponse(`Club not found with id of ${req.params.id}`),
      404
    );
  }

  //Correct User
  if (club.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse("You are not authorized for updating this club."),
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

  file.name = `photo_lead_club_${club._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("File not uploaded", 500));
    }

    await Club.findByIdAndUpdate(req.params.id, { club_lead_image: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
