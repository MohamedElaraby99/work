const mongoose = require("mongoose");
const subjects = require("../utils/subjects");
const stages = require("../utils/stages");

const fileMetadataSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      required: true,
      enum: stages, // Example values
    },
    file: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      enum: subjects,
      required: true,
    },
    unit: {
      type: Number,
      required: true,
    },
    lesson_number: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileMetadataSchema);
