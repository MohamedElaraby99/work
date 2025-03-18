const mongoose = require("mongoose");
const subjects = require("../utils/subjects");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    lesson_link: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    notes: {
      type: String,
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

module.exports = mongoose.model("Lesson", lessonSchema);
