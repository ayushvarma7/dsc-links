const express = require("express");
const {
  getClub,
  getClubs,
  getClubsCurrentUser,
  updateClub,
  uploadPhotoClub,
  uploadPhotoLeadClub,
  deleteClub,
  createClub,
  postsByClub,
} = require("../controllers/clubs");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router
  .route("/me")
  .get(protect, authorize("user", "admin"), getClubsCurrentUser);

router.route("/allposts/:id").get(postsByClub);

router
  .route("/:id/photo_club/lead")
  .put(protect, authorize("user", "admin"), uploadPhotoLeadClub);

router
  .route("/:id/photo_club")
  .put(protect, authorize("user", "admin"), uploadPhotoClub);

router
  .route("/:id")
  .get(getClub)
  .delete(protect, authorize("user", "admin"), deleteClub)
  .put(protect, authorize("user", "admin"), updateClub);

router
  .route("/")
  .get(getClubs)
  .post(protect, authorize("user", "admin"), createClub);

module.exports = router;
