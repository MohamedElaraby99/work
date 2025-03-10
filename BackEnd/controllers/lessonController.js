const Lesson = require("../models/Lesson");
const stages = require("../utils/stages");
const subjects = require("../utils/subjects");

const getAllLessons = async (req, res) => {
  try {
    const { role, stage } = req;
    const { subject, unit } = req.query;

    let lessons;
    if (role === "admin") {
      if (stage || subject || unit) {
        lessons = await Lesson.find({
          stage: stage === "" ? { $exists: true } : stage,
          subject: subject === "" ? { $exists: true } : subject,
          unit: unit === "" ? { $exists: true } : unit,
        });
      } else lessons = await Lesson.find();
    } else if (role !== "admin") {
      if (stage || subject || unit) {
        lessons = await Lesson.find({
          stage,
          subject,
          unit,
        });
      }
    } else {
      // If the user has no stage (and is not admin), return an error
      return res.status(403).json({ message: "Access denied" });
    }
    return res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLesson = async (req, res) => {
  const { title, lesson_link, stage, description, notes, subject, unit } =
    req.body;
  if (!title) {
    return res.status(400).json({ message: " العنوان مطلوب" });
  }
  if (!lesson_link) {
    return res.status(400).json({ message: " رابط الفيديو مطلوب" });
  }
  if (!stage) {
    return res.status(400).json({ message: "المرحلة الدراسية مطلوبة" });
  }
  if (!stages.includes(stage)) {
    return res.status(400).json({ message: "المادة الدراسية غير صالحة" });
  }
  if (!subject) {
    return res.status(400).json({ message: "المادة الدراسية مطلوبة" });
  }
  if (!subjects.includes(subject)) {
    return res.status(400).json({ message: "المادة الدراسية غير صالحة" });
  }
  if (!unit) {
    return res.status(400).json({ message: "الوحدة مطلوبة" });
  }

  try {
    const lesson = new Lesson({
      title,
      lesson_link,
      stage,
      description,
      notes,
      subject,
      unit,
    });
    await lesson.save();

    return res
      .status(200)
      .json({ message: "الفيديو تم انشاءه بنجاح", ...lesson });
  } catch (error) {
    console.error("Error creating lesson:", error);
  }
};

const updateLesson = async (req, res) => {
  const { id } = req.params;
  const { title, lesson_link, stage, description, notes, subject, unit } =
    req.body;
  if (!title) {
    return res.status(400).json({ message: "العنوان مطلوب" });
  }
  if (!lesson_link) {
    return res.status(400).json({ message: " رابط الفيديو مطلوب" });
  }
  if (!stage) {
    return res.status(400).json({ message: "المرحلة الدراسية مطلوبة" });
  }
  if (!stages.includes(stage)) {
    return res.status(400).json({ message: "المادة الدراسية غير صالحة" });
  }

  if (!subject) {
    return res.status(400).json({ message: "المادة الدراسية مطلوبة" });
  }

  if (!subjects.includes(subject)) {
    return res.status(400).json({ message: "المادة الدراسية غير صالحة" });
  }

  if (!unit) {
    return res.status(400).json({ message: "الوحدة مطلوبة" });
  }
  const lesson = await Lesson.findByIdAndUpdate(id, req.body);

  if (!lesson) {
    return res.status(404).json({ message: "الفيديو غير موجود" });
  }

  const updatedLesson = await Lesson.findById(id);
  return res.status(200).json(updatedLesson);
};

const deleteLesson = async (req, res) => {
  const { id } = req.params;
  const lesson = await Lesson.findByIdAndDelete(id);

  if (!lesson) {
    return res.status(404).json({ message: "الفيديو غير موجود" });
  }

  return res.status(200).json({ message: "تم حذف الفيديو بنجاح" });
};

module.exports = {
  getAllLessons,
  createLesson,
  updateLesson,
  deleteLesson,
};
