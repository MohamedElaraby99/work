const Question = require("../models/Question");
const StudentResult = require("../models/StudentResult");


const submitTest = async (req, res) => {
  try {
    const { studentName, answers } = req.body;
    let totalScore = 0;

 
    const result = new StudentResult({
      studentName,
      answers: [],
    });

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      const isCorrect = question.correctAnswer === answer.selectedAnswer;

      result.answers.push({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      });

      if (isCorrect) totalScore++;
    }

    result.totalScore = totalScore;
    await result.save();

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllResults = async (req, res) => {
  try {
    const results = await StudentResult.find().populate("answers.questionId");
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitTest, getAllResults };
