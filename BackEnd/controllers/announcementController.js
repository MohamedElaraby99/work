const Announcement = require("../models/Announcement");
const mongoose = require("mongoose");
const subjects = require("../utils/subjects");
const stages = require("../utils/stages");

const getAnnouncements = async (req, res) => {
  try {
    const { role, stage, subject } = req;

    let announcements;

    if (role === "admin") {
      announcements = await Announcement.find();
    } else if (role !== "admin") {
      announcements = await Announcement.find({
        stage: { $in: [stage] },
        subject: { $in: subject },
      });
    }
    // } else if (stage) {
    //   // Map the incoming `stage` string to the corresponding object key
    //   const stageKeyMap = {
    //     "أولى ثانوي": "stage_one",
    //     "ثانية ثانوي": "stage_two",
    //     "ثالثة ثانوي": "stage_three",
    //   };

    //   const stageKey = stageKeyMap[stage]; // Get the corresponding key

    //   if (!stageKey) {
    //     return res.status(400).json({ message: "المرحلة غير معروفة" });
    //   }

    //   // Filter announcements where the specific stage key is true and subject matches
    //   announcements = await Announcement.find({
    //     [`stage.${stageKey}`]: true, // Dynamic query for nested field
    //     $or: [
    //       { subject: subject },
    //       { subject: "تاريخ وجغرافيا" },
    //       { subject: subject === "تاريخ" ? "تاريخ" : "جغرافيا" },
    //     ],
    //   });
    // }
    else {
      // If the user has no stage (and is not admin), return an error
      return res.status(403).json({ message: "Access denied" });
    }
    return res.status(200).json(announcements);
  } catch (error) {
    console.error("Error retrieving announcements:", error);
    return res.status(500).json({ message: "حدث خطأ أثناء استرجاع الإعلان" });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, description, stage, subject } = req.body;

    // Validate `title`
    if (!title) {
      return res.status(400).json({ message: "العنوان مطلوب" });
    }

    // Validate `description`
    if (!description) {
      return res.status(400).json({ message: "الوصف مطلوب" });
    }

    // Validate `subject`
    if (!subject) {
      return res.status(400).json({ message: "المادة الدراسية مطلوبة" });
    }

    const isSubjectValid = subject.every((sub) => {
      return subjects.includes(sub);
    });

    if (!isSubjectValid) {
      return res.status(400).json({ message: "المادة الدراسية غير صالحة" });
    }

    // // Validate `stage`
    // const allowedKeys = ["stage_one", "stage_two", "stage_three"];
    // if (!stage || typeof stage !== "object") {
    //   return res
    //     .status(400)
    //     .json({ message: "المرحلة الدراسية مطلوبة ويجب أن تكون كائنًا" });
    // }

    // // Ensure all allowed keys exist and are Booleans
    // for (const key of allowedKeys) {
    //   if (!stage.hasOwnProperty(key)) {
    //     return res.status(400).json({ message: ` مطلوبة ${key} قيمة ` });
    //   }
    //   if (typeof stage[key] !== "boolean") {
    //     return res
    //       .status(400)
    //       .json({ message: `يجب أن تكون قيمة ${key} بنعم او لا` });
    //   }
    // }

    // Validate `stage`
    if (!stage) {
      return res.status(400).json({ message: "المرحلة الدراسية مطلوبة" });
    }

    const isStageValid = stage.every((sub) => {
      return stages.includes(sub);
    });

    if (!isStageValid) {
      return res.status(400).json({ message: "المرحلة الدراسية غير صالحة" });
    }

    // Create the announcement
    const announcement = await Announcement.create({
      title,
      description,
      stage,
      subject,
    });

    return res.status(200).json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    return res.status(500).json({ message: "حدث خطأ أثناء إنشاء الإعلان" });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, stage, subject } = req.body;

    // Validate `id`
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "معرف غير صالح" });
    }

    // Validate `title`
    if (!title) {
      return res.status(400).json({ message: "العنوان مطلوب" });
    }

    // Validate `description`
    if (!description) {
      return res.status(400).json({ message: "الوصف مطلوب" });
    }

    // // Validate `subject`
    // if (!subject) {
    //   return res.status(400).json({ message: "المادة الدراسية مطلوبة" });
    // }

    // if (!["تاريخ وجغرافيا", "جغرافيا", "تاريخ"].includes(subject)) {
    //   return res.status(400).json({ message: "المادة الدراسية غير صالحة" });
    // }

    // // Validate `stage`
    // const allowedKeys = ["stage_one", "stage_two", "stage_three"];
    // if (!stage || typeof stage !== "object") {
    //   return res
    //     .status(400)
    //     .json({ message: "المرحلة الدراسية مطلوبة ويجب أن تكون كائنًا" });
    // }

    // for (const key of allowedKeys) {
    //   if (!stage.hasOwnProperty(key)) {
    //     return res
    //       .status(400)
    //       .json({ message: `المرحلة ${key} مطلوبة في الكائن` });
    //   }
    //   if (typeof stage[key] !== "boolean") {
    //     return res
    //       .status(400)
    //       .json({ message: `المرحلة ${key} يجب أن تكون قيمة منطقية` });
    //   }
    // }

    // Validate `subject`
    if (!subject) {
      return res.status(400).json({ message: "المادة الدراسية مطلوبة" });
    }

    const isSubjectValid = subject.every((sub) => {
      return subjects.includes(sub);
    });

    if (!isSubjectValid) {
      return res.status(400).json({ message: "المادة الدراسية غير صالحة" });
    }

    // Validate `stage`
    if (!stage) {
      return res.status(400).json({ message: "المرحلة الدراسية مطلوبة" });
    }

    const isStageValid = stage.every((sub) => {
      return stages.includes(sub);
    });

    if (!isStageValid) {
      return res.status(400).json({ message: "المرحلة الدراسية غير صالحة" });
    }

    // Find and update the announcement
    const announcement = await Announcement.findByIdAndUpdate(
      id,
      { title, description, stage, subject },
      { new: true, runValidators: true } // Return updated document and run validators
    );

    if (!announcement) {
      return res.status(404).json({ message: "الإعلان غير موجود" });
    }

    return res.status(200).json(announcement);
  } catch (error) {
    console.error("Error updating announcement:", error);
    return res.status(500).json({ message: "حدث خطأ أثناء تحديث الإعلان" });
  }
};

const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  try {
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) {
      return res.status(404).json({ message: "الإعلان غير موجود" });
    }
    return res.status(200).json({ message: "تم حذف الإعلان بنجاح" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return res.status(500).json({ message: "حدث خطأ أثناء حذف الإعلان" });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
