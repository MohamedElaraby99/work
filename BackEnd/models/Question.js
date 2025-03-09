const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true, // الإجابة الصحيحة من بين الخيارات
  },
}, { timestamps: true });

module.exports = mongoose.model("Question", QuestionSchema);
