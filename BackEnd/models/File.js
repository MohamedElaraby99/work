const mongoose = require("mongoose");


const fileMetadataSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      required: true,
      enum: ["ثالثة ثانوي", "ثانية ثانوي", "أولى ثانوي"], // Example values
    },
    file: {
      type: String,
      required: true,
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

module.exports = mongoose.model("File", fileMetadataSchema);
