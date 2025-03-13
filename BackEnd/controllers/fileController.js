const File = require("../models/File");
const fs = require("fs");
const path = require("path");
const stages = require("../utils/stages");
const subjects = require("../utils/subjects");

const getFiles = async (req, res) => {
  try {
    const { role, stage } = req;
    const { subject, unit } = req.query;
    console.log(subject, unit, "");
    let files;

    if (role === "admin") {
      if (stage || subject || unit) {
        files = await File.find({
          stage: stage === "" ? { $exists: true } : stage,
          subject: subject === "" ? { $exists: true } : subject,
          unit: unit === "" ? { $exists: true } : unit,
        });
      } else files = await File.find();
    } else if (role !== "admin") {
      if (stage || subject || unit) {
        files = await File.find({
          stage,
          subject,
          unit,
        });
      }
    } else {
      // If the user has no stage (and is not admin), return an error
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedFiles = files.map((file) => ({
      ...file.toObject(), // Convert Mongoose document to plain object
      file: `${process.env.BASE_URL}${file.file}`, // Prepend domain to file path
    }));

    res.status(200).json(updatedFiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء استرجاع الملفات" });
  }
};

// Upload a file with metadata
const uploadFile = async (req, res) => {
  try {
    const { title, stage, subject, unit } = req.body;

    // Validate required fields
    if (!req.file) {
      return res.status(400).json({ message: "الملف مطلوب" });
    }
    if (!title) {
      return res.status(400).json({ message: "العنوان مطلوب" });
    }
    if (!stage) {
      return res.status(400).json({ message: "المرحلة الدراسية مطلوبة" });
    }
    if (!stages.includes(stage)) {
      return res.status(400).json({ message: "المرحلة الدراسية غير صالحة" });
    }
    if (!subjects.includes(subject)) {
      return res.status(400).json({ message: "المادة الدراسية غير صالحة" });
    }
    if (!unit) {
      return res.status(400).json({ message: "الوحدة مطلوبة" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;

    // Save metadata in a separate collection
    const newfile = new File({
      title,
      stage,
      file: fileUrl,
      subject,
      unit,
    });

    await newfile.save();

    res.status(201).json({
      fileId: newfile._id,
      title: newfile.title,
      stage: newfile.stage,
      subject: newfile.subject,
      unit: newfile.unit,
      file: `${process.env.BASE_URL}${fileUrl}`, // Include the base URL
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء رفع الملف وحفظ البيانات" });
  }
};

const updateFile = async (req, res) => {
  const { id } = req.params;
  try {
    const { title, stage, subject } = req.body;
    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "العنوان مطلوب" });
    }
    if (!stage) {
      return res.status(400).json({ message: "المرحلة الدراسية مطلوبة" });
    }
    if (!stages.includes(stage)) {
      return res.status(400).json({ message: "المرحلة الدراسية غير صالحة" });
    }

    if (!subjects.includes(subject)) {
      return res.status(400).json({ message: "المادة الدراسية غير صالحة" });
    }
    if (!unit) {
      return res.status(400).json({ message: "الوحدة مطلوبة" });
    }

    // Fetch the existing file record
    const existingFile = await File.findById(id);

    if (!existingFile) {
      return res.status(404).json({ message: "الملف غير موجود" });
    }

    let fileUrl = existingFile.file;

    // Handle new file upload
    if (req.file) {
      // Construct the path to the old file
      const oldFilePath = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(existingFile.file)
      );

      // Delete the old file
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error("Error deleting old file:", err);
        }
      });

      // Set the new file URL
      fileUrl = `/uploads/${req.file.filename}`;
    }

    // Update the file record
    const updatedFile = await File.findByIdAndUpdate(
      id,
      {
        title,
        stage,
        file: fileUrl,
        subject,
        unit,
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      fileId: updatedFile._id,
      title: updatedFile.title,
      stage: updatedFile.stage,
      subject: updatedFile.subject,
      unit: updatedFile.unit,
      file: `${process.env.BASE_URL}${updatedFile.file}`, // Include the updated file URL
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء رفع الملف وحفظ البيانات" });
  }
};

const deleteFile = async (req, res) => {
  const { id } = req.params;
  try {
    // البحث عن الملف في قاعدة البيانات
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "الملف غير موجود" });
    }

    // بناء مسار الملف
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      path.basename(file.file)
    );

    // التحقق مما إذا كان الملف موجودًا قبل محاولة حذفه
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res
            .status(500)
            .json({ message: "حدث خطأ أثناء حذف الملف من النظام" });
        }
      });
    } else {
      console.warn(
        "الملف غير موجود في النظام، سيتم حذفه من قاعدة البيانات فقط."
      );
    }

    // حذف سجل الملف من قاعدة البيانات
    await file.deleteOne();

    res.status(200).json({ message: "تم حذف الملف بنجاح" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء حذف الملف" });
  }
};

const downloadFile = async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "الملف غير موجود" });
    }

    // Extract the file name from the file field
    const fileName = path.basename(file.file); // Extracts the file name
    const filePath = path.join(__dirname, "..", "uploads", fileName);

    res.download(filePath, file.title, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        return res.status(500).json({ message: "حدث خطاء اثناء تحميل الملف" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطاء اثناء تحميل الملف" });
  }
};

module.exports = { getFiles, uploadFile, updateFile, deleteFile, downloadFile };
