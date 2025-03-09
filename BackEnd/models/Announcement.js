const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stage: {
      type: new mongoose.Schema({
        stage_one: {
          type: Boolean,
          required: true,
        },
        stage_two: {
          type: Boolean,
          required: true,
        },
        stage_three: {
          type: Boolean,
          required: true,
        },
      }),
      required: true,
    },
    subject: {
      type: String,
      enum: ["تاريخ وجغرافيا", "جغرافيا", "تاريخ"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
