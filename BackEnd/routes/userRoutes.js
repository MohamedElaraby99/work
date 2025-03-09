const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const { verifyJWT, verifyAdmin } = require("../middlewares/verifyToken");

router.get("/", verifyJWT, verifyAdmin, userController.getAllUsers);
router.get("/user", verifyJWT, verifyAdmin, userController.getUser);
router.put("/:id", verifyJWT, verifyAdmin, userController.updateUser);
router.delete("/:id", verifyJWT, verifyAdmin, userController.deleteUser);

module.exports = router;
