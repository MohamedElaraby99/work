const mongoose = require("mongoose");

const StudentResultSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      selectedAnswer: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    },
  ],
  totalScore: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("StudentResult", StudentResultSchema);
