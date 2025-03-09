const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exam_id: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  answers: [
    {
      question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam.questions",
      },
      selectedAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);
