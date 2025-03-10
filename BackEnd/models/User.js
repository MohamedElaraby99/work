const e = require("express");
const mongoose = require("mongoose");
const { default: stages } = require("../utils/stages");
const { default: subjects } = require("../utils/subjects");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      enum: stages, // Example values
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      required: true,
    },
    subject: {
      type: [String],
      enum: subjects,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
