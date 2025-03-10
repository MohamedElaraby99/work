const mongoose = require("mongoose");
const subjects = require("../utils/subjects");
const stages = require("../utils/stages");

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
    // stage: {
    //   type: new mongoose.Schema({
    //     stage_one: {
    //       type: Boolean,
    //       required: true,
    //     },
    //     stage_two: {
    //       type: Boolean,
    //       required: true,
    //     },
    //     stage_three: {
    //       type: Boolean,
    //       required: true,
    //     },
    //   }),
    //   required: true,
    // },
    stage: {
      type: [String],
      enum: stages,
      required: true,
    },
    subject: {
      type: [String],
      enum: subjects,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
