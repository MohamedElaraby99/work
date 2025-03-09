const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");
const { verifyJWT, verifyAdmin } = require("../middlewares/verifyToken");

router.get("/", verifyJWT, announcementController.getAnnouncements);
router.post(
  "/",
  verifyJWT,
  verifyAdmin,
  announcementController.createAnnouncement
);
router.put(
  "/:id",
  verifyJWT,
  verifyAdmin,
  announcementController.updateAnnouncement
);
router.delete(
  "/:id",
  verifyJWT,
  verifyAdmin,
  announcementController.deleteAnnouncement
);

module.exports = router;
