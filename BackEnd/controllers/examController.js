const { stat } = require("fs");
const Exam = require("../models/Exam");
const Submission = require("../models/SubmitExam");
const User = require("../models/User");
const moment = require("moment-timezone");
const e = require("express");
const stages = require("../utils/stages");
const subjects = require("../utils/subjects");

const getExamsWithScores = async (req, res) => {
  try {
    const { user_id, stage, role } = req;
    const { subject, unit, type } = req.query;

    let exams;
    if (role === "admin") {
      if (stage || subject || unit || type) {
        exams = await Exam.find({
          stage: stage === "" ? { $exists: true } : stage,
          subject: subject === "" ? { $exists: true } : subject,
          unit: unit === "" ? { $exists: true } : unit,
          type: type === "" ? { $exists: true } : type,
        });
      } else exams = await Exam.find();
    } else if (role !== "admin") {
      if (stage || subject || unit) {
        exams = await Exam.find({
          stage,
          subject,
          unit,
          type,
        });
      }
    } else {
      // If no stage is provided and user is not admin, return an error
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch user's submissions
    const submissions = await Submission.find({ user_id });

    // Create a map of exam_id to user submissions for fast lookup
    const submissionMap = submissions.reduce((acc, submission) => {
      acc[submission.exam_id.toString()] = submission;
      return acc;
    }, {});

    const currentTime = new Date();

    // Process exams to include status, scores, and attendance
    const examsWithScores = exams.map((exam) => {
      const examStartTime = exam.date;
      const examEndTime = new Date(exam.date.getTime() + exam.duration * 60000);

      // Determine exam status
      const status =
        currentTime < examStartTime
          ? "قادم" // Upcoming
          : currentTime >= examStartTime && currentTime <= examEndTime
          ? "متاح" // Active
          : "انتهى"; // Ended

      // Get user's submission for this exam, if it exists
      const userSubmission = submissionMap[exam._id.toString()];

      // Calculate user score and attendance
      const userScore =
        status === "متاح" || status === "انتهى" ? userSubmission?.score : null;

      const attendance =
        status === "انتهى" && !userSubmission
          ? "لم يحضر"
          : userSubmission
          ? "حضر"
          : null;

      return {
        id: exam._id,
        title: exam.title,
        type: exam.type,
        subject: exam.subject,
        description: exam.description,
        date: exam.date,
        duration: exam.duration,
        questionsCount: exam.questions.length,
        questions: role === "admin" || status !== "قادم" ? exam.questions : [], // Admin can see all questions
        userScore: role === "admin" ? undefined : userScore, // Admin doesn't need user-specific scores
        attendance: role === "admin" ? undefined : attendance, // Admin doesn't need attendance
        status,
        stage: exam.stage,
      };
    });
    res.status(200).json(examsWithScores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching exams and scores" });
  }
};

const addExam = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      duration,
      questions,
      stage,
      why,
      type,
      subject,
      unit,
    } = req.body;

    console.log("Request Body:", req.body); // Log the request body

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Exam title is required" });
    }
    if (!description) {
      return res.status(400).json({ message: "Exam description is required" });
    }
    if (!subject) {
      return res.status(400).json({ message: "Exam subject is required" });
    }
    if (typeof subject !== "string") {
      return res.status(400).json({ message: "Subject must be a string" });
    }
    if (!subjects.includes(subject)) {
      return res.status(400).json({ message: "المادة الدراسية غير صالحة" });
    }
    if (!date) {
      return res.status(400).json({ message: "Exam date is required" });
    }
    if (!unit) {
      return res.status(400).json({ message: "الوحدة مطلوبة" });
    }

    const examDate = moment.tz(date, "Africa/Cairo");
    const currentTime = moment.tz(new Date() - 60 * 1000, "Africa/Cairo");

    if (currentTime > examDate) {
      return res
        .status(400)
        .json({ message: "Exam date must be in the future" });
    }

    if (!stage) {
      return res.status(400).json({ message: "Exam stage is required" });
    }
    if (!stages.includes(stage)) {
      return res.status(400).json({ message: "المرحلة الدراسية غير صالحة" });
    }
    if (!duration || duration <= 0) {
      return res
        .status(400)
        .json({ message: "Valid exam duration is required" });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one question is required" });
    }

    // Validate questions
    for (const q of questions) {
      const { question, options, correctAnswer } = q;
      if (!question) {
        return res.status(400).json({ message: "Question text is required" });
      }
      if (!Array.isArray(options) || options.length < 2) {
        return res
          .status(400)
          .json({ message: "Each question must have at least two options" });
      }
      if (
        correctAnswer == null ||
        correctAnswer < 0 ||
        correctAnswer >= options.length
      ) {
        return res.status(400).json({
          message: "Correct option must be a valid index within the options",
        });
      }
    }
    if (type !== "امتحان" && type !== "تدريب") {
      return res.status(400).json({ message: `Invalid type: ${type}` });
    }

    // Create new exam document
    const newExam = new Exam({
      title,
      description,
      date: examDate, // Ensure the date is a valid Date object
      duration,
      questions,
      stage,
      why,
      type,
      subject,
      unit,
    });

    // Save to database
    await newExam.save();

    res.status(201).json(newExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating exam" });
  }
};

const updateExam = async (req, res) => {
  const { id } = req.params; // Exam ID from URL parameters
  const {
    title,
    description,
    date,
    duration,
    questions,
    stage,
    why,
    type,
    subject,
    unit,
  } = req.body;

  try {
    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Exam title is required" });
    }
    if (!description) {
      return res.status(400).json({ message: "Exam description is required" });
    }
    if (!subject) {
      return res.status(400).json({ message: "Exam subject is required" });
    }
    if (!subjects.includes(subject)) {
      return res.status(400).json({ message: "المادة الدراسية غير صالحة" });
    }

    if (!stage) {
      return res.status(400).json({ message: "Exam stage is required" });
    }
    if (!stages.includes(stage)) {
      return res.status(400).json({ message: "المرحلة الدراسية غير صالحة" });
    }
    if (!date) {
      return res.status(400).json({ message: "Exam date is required" });
    }

    if (!unit) {
      return res.status(400).json({ message: "الوحدة مطلوبة" });
    }

    if (!date) {
      return res.status(400).json({ message: "Exam date is required" });
    }

    const examDate = moment.tz(date, "Africa/Cairo");
    const currentTime = moment.tz("Africa/Cairo");

    if (currentTime > examDate) {
      return res
        .status(400)
        .json({ message: "Exam date must be in the future" });
    }

    // Fetch the existing exam
    const existingExam = await Exam.findById(id);
    if (!existingExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Validate questions if provided
    if (questions) {
      for (const q of questions) {
        const { question, options, correctAnswer } = q;
        if (!question) {
          return res.status(400).json({ message: "Question text is required" });
        }
        if (!Array.isArray(options) || options.length < 2) {
          return res.status(400).json({
            message: "Each question must have at least two options",
          });
        }
        if (
          correctAnswer == null ||
          correctAnswer < 0 ||
          correctAnswer >= options.length
        ) {
          return res.status(400).json({
            message: "Correct answer must be a valid index within options",
          });
        }
      }
    }

    // Update exam fields
    if (title) existingExam.title = title;
    if (description) existingExam.description = description;
    if (date) existingExam.date = examDate;
    if (duration) existingExam.duration = duration;
    if (questions) existingExam.questions = questions;
    if (stage) existingExam.stage = stage;
    if (why) existingExam.why = why;
    if (type) existingExam.type = type;
    if (subject) existingExam.subject = subject;
    if (unit) existingExam.unit = unit;

    // Save updated exam
    const updatedExam = await existingExam.save();

    res.status(200).json({
      message: "Exam updated successfully",
      exam: updatedExam,
    });
  } catch (error) {
    console.error("Error updating exam:", error);
    res.status(500).json({ message: "Error updating exam" });
  }
};

const deleteExam = async (req, res) => {
  const { id } = req.params; // Exam ID from URL

  try {
    // Find and delete the exam
    const exam = await Exam.findByIdAndDelete(id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Delete all submissions related to the exam
    await Submission.deleteMany({ exam_id: id });

    res.status(200).json({
      message: "Exam and associated submissions deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting exam:", error);
    res.status(500).json({ message: "Error deleting exam" });
  }
};

const submitExam = async (req, res) => {
  try {
    const { user_id } = req; // From middleware
    const { exam_id, answers } = req.body;

    // Fetch the exam
    const exam = await Exam.findById(exam_id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const currentTime = moment.tz("Africa/Cairo");
    const examEndTime = new Date(exam.date.getTime() + exam.duration * 60000);

    // Check if the submission is within the allowed duration
    if (currentTime > examEndTime) {
      return res
        .status(400)
        .json({ message: "Cannot submit after the exam duration has ended" });
    }

    // Check if the user has already submitted the exam
    let existingSubmission = await Submission.findOne({ user_id, exam_id });

    // If it's an "امتحان", prevent multiple submissions
    if (existingSubmission && exam.type === "امتحان") {
      return res
        .status(400)
        .json({ message: "You have already submitted this exam" });
    }

    // Ensure all questions have been answered
    const questionIds = exam.questions.map((q) => q._id.toString());
    const answeredQuestionIds = answers.map((a) => a.questionId.toString());

    const allQuestionsAnswered = questionIds.every((id) =>
      answeredQuestionIds.includes(id)
    );

    if (!allQuestionsAnswered) {
      return res.status(400).json({
        message: "You must answer all questions before submitting the exam",
      });
    }

    // Calculate the score
    let score = 0;
    const detailedAnswers = answers.map((answer) => {
      const question = exam.questions.id(answer.questionId);

      // Check if the answer is correct
      const isCorrect = question.correctAnswer === `${answer.selectedAnswer}`;
      if (isCorrect) score++;
      return {
        question_id: question._id,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      };
    });

    if (existingSubmission && exam.type === "تدريب") {
      // If it's a training exam, update the submission
      existingSubmission.answers = detailedAnswers;
      existingSubmission.score = score;
      await existingSubmission.save();
      return res
        .status(200)
        .json({ message: "Training exam updated successfully", score });
    } else {
      // Save new submission
      const submission = new Submission({
        user_id,
        exam_id,
        answers: detailedAnswers,
        score,
      });
      await submission.save();

      res.status(201).json({ message: "Exam submitted successfully", score });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting exam" });
  }
};

const getExamDataForAdmin = async (req, res) => {
  try {
    const { stage } = req.query; // Admin provides the `stage` to filter
    if (!stage) {
      return res.status(400).json({ message: "Stage is required" });
    }

    // Fetch all exams for the given stage
    const exams = await Exam.find({ stage }).lean();

    if (exams.length === 0) {
      return res.status(200).json([]);
    }

    // Fetch all students in the given stage
    const students = await User.find({ stage }).lean();

    // if (students.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "No students found for this stage" });
    // }

    // Fetch all submissions for exams in the given stage
    const examIds = exams.map((exam) => exam._id);
    const submissions = await Submission.find({ exam_id: { $in: examIds } })
      .populate("user_id", "name username stage") // Fetch user details
      .populate("exam_id", "title") // Fetch exam details
      .lean();

    // Create a map for submissions grouped by exam_id for fast lookup
    const submissionMap = submissions.reduce((acc, submission) => {
      const examId = submission.exam_id._id.toString();
      if (!acc[examId]) acc[examId] = [];
      acc[examId].push(submission);
      return acc;
    }, {});

    // Process exams with submissions
    const adminViewData = exams.map((exam) => {
      const examSubmissions = submissionMap[exam._id.toString()] || [];

      // Create a map of students who have submitted the exam
      const submittedStudentIds = new Set(
        examSubmissions.map((submission) => {
          return submission.user_id?._id?.toString();
        })
      );
      const currentTime = new Date();

      const examStartTime = exam.date;
      const examDuration = exam.duration * 60000;
      const examEndTime = new Date(exam.date.getTime() + examDuration);

      // Determine exam status
      const status =
        currentTime < examStartTime
          ? "قادم" // Upcoming
          : currentTime >= examStartTime && currentTime <= examEndTime
          ? "متاح" // Active
          : "انتهى"; // Ended

      // Check if the exam has ended
      const examIsEnd = currentTime > examEndTime;

      // Add students who haven't submitted
      let nonSubmittedStudents = [];
      if (examIsEnd) {
        nonSubmittedStudents = students
          .filter((student) => !submittedStudentIds.has(student._id.toString()))
          .filter((student) => student?.subject === exam?.subject)
          .map((student) => ({
            student: {
              name: student.name,
              stage: student.stage,
            },
            score: 0,
            status: "لم يحضر", // "Did not attend"
          }));
      }

      // Map answers to include question details
      const submissionsWithQuestions = examSubmissions.map((submission) => ({
        student: {
          name: submission?.user_id?.name || "Unknown",
          stage: submission?.user_id?.stage || stage,
        },
        score: submission.score,
        status: "حضر", // "Did not attend"
        submittedAt: submission.submittedAt,
        answers: submission.answers.map((answer) => {
          const question = exam.questions.find(
            (q) => q._id.toString() === answer.question_id.toString()
          );
          return {
            question: question || "Question not found",
            selectedAnswer: answer.selectedAnswer,
            correctAnswer: question?.correctAnswer,
            image: question?.image,
            why: question?.why,
            isCorrect:
              question?.correctAnswer === answer.selectedAnswer || false,
          };
        }),
      }));

      return {
        examId: exam._id,
        title: exam.title,
        exam: exam.type,
        description: exam.description,
        date: exam.date,
        duration: exam.duration,
        stage: exam.stage,
        subject: exam.subject,
        exam_status: status,
        submissions: [...submissionsWithQuestions, ...nonSubmittedStudents],
      };
    });

    res.status(200).json(adminViewData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching exam data for admin" });
  }
};

module.exports = {
  getExamsWithScores,
  addExam,
  updateExam,
  deleteExam,
  submitExam,
  getExamDataForAdmin,
};
