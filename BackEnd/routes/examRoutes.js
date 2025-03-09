const express = require("express");
const router = express.Router();
const {
  getExamsWithScores,
  submitExam,
  addExam,
  updateExam,
  deleteExam,
  getExamDataForAdmin
} = require("../controllers/examController");
const { verifyJWT, verifyAdmin } = require("../middlewares/verifyToken");

router.get("/", verifyJWT, getExamsWithScores);
router.post("/", verifyJWT, verifyAdmin, addExam);
router.put("/:id", verifyJWT, verifyAdmin, updateExam);
router.delete("/:id", verifyJWT, verifyAdmin, deleteExam);
router.post("/submit", verifyJWT, submitExam); // Submit an exam
router.get("/submit", verifyJWT, verifyAdmin, getExamDataForAdmin); 

module.exports = router;
