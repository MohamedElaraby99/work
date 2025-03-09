const mongoose = require("mongoose");
const { validate } = require("./User");

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
      enum: ["جغرافيا", "تاريخ"],
      required: true,
    },
    unit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
