const multer = require("multer");
const path = require("path");

// Set up Multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads")); // Save to `uploads` directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix); // Append timestamp to filename for uniqueness
  },
});

const upload = multer({ storage });

module.exports = upload;
