const express = require("express");

const router = express.Router();
const lessonController = require("../controllers/lessonController");
const { verifyJWT, verifyAdmin } = require("../middlewares/verifyToken");

router.get("/", verifyJWT, lessonController.getAllLessons);
router.post("/", verifyJWT, verifyAdmin, lessonController.createLesson);
router.put("/:id", verifyJWT, verifyAdmin, lessonController.updateLesson);
router.delete("/:id", verifyJWT, verifyAdmin, lessonController.deleteLesson);

module.exports = router;
