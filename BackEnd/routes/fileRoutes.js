const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const { verifyJWT, verifyAdmin } = require("../middlewares/verifyToken");
const upload = require("../middlewares/uploadFiles");

// Route to upload file with metadata
router.get("/", verifyJWT, fileController.getFiles);
router.get("/download/:id", verifyJWT, fileController.downloadFile);
router.post(
  "/",
  verifyJWT,
  verifyAdmin,
  upload.single("file"),
  fileController.uploadFile
);
router.put(
  "/:id",
  verifyJWT,
  verifyAdmin,
  upload.single("file"),
  fileController.updateFile
);
router.delete("/:id", verifyJWT, verifyAdmin, fileController.deleteFile);

module.exports = router;
