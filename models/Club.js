const mongoose = require("mongoose");

const ClubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name for your club"],
  },
  lead_name: {
    type: String,
    required: [true, "Please add the name for your club lead."],
  },
  description: {
    type: String,
    required: [true, "Please add a description for your post."],
  },
  instagram_url: {
    type: String,
    required: [false, "Please add social link"],
  },
  facebook_url: {
    type: String,
    required: [false, "Please add social link"],
  },
  linkedin_url: {
    type: String,
    required: [false, "Please add social link"],
  },
  youtube_url: {
    type: String,
    required: [false, "Please add social link"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  club_image: {
    type: String,
    default: "none.jpg",
  },
  club_lead_image: {
    type: String,
    default: "none.jpg",
  },
});

module.exports = mongoose.model("Club", ClubSchema);
