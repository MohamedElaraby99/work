const e = require("express");
const mongoose = require("mongoose");

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
      enum: ["ثالثة ثانوي", "ثانية ثانوي", "أولى ثانوي", "ثالثة اعدادي"], // Example values
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
      type: String,
      enum: ["فرنسي","انجليزي", "تاريخ" , "رياضيات"],
    },
    submath: {
      type: String,
      enum: ["هندسه", "جبر" , "مثلثات" , "احصاء" , "تفاضل"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
