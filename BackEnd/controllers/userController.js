const User = require("../models/User");
const jwt = require("jsonwebtoken");
const getAllUsers = async (req, res) => {
  // const users = await User.find().select("-password").lean();
  const users = await User.find();

  if (users.length === 0) {
    return res.status(400).json({ message: "لا يوجد مستخدمين" });
  }
  res.json(users);
};

const getUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization; // "Bearer token"
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token part
    let decoded;

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      decoded = result;
    });

    // Check if decoded contains user ID
    if (!decoded?.userInfo?.id) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Fetch user from the database
    const user = await User.findById(decoded.userInfo.id)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, username, stage, password, role, subject } = req.body;
  if (!name) {
    return res.status(400).json({ message: "الاسم مطلوب" });
  }
  if (!username) {
    return res.status(400).json({ message: " اسم المسخدم مطلوب" });
  }
  if (role !== "admin") {
    if (!stage) {
      return res
        .status(400)
        .json({ message: "المرحلة الدراسية مطلوبة اذا لم تكن مشرف" });
    }
    if (!subject) {
      return res
        .status(400)
        .json({ message: "المادة الدراسية مطلوبة اذا لم تكن مشرف" });
    }
  }
  if (!password) {
    return res.status(400).json({ message: "كلمة المرور مطلوبة " });
  }
  if (!role) {
    return res.status(400).json({ message: "وصف المستخدم" });
  }

  const user = await User.findByIdAndUpdate(id, {
    ...req.body,
    stage: role === "admin" ? "" : stage,
    subject: role === "admin" ? "" : subject,
  });

  if (!user) {
    return res.status(404).json({ message: "المستخدم غير موجود" });
  }

  const updatedUser = await User.findById(id);
  return res.status(200).json(updatedUser);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({ message: "المستخدم غير موجود" });
  }

  return res.status(200).json({ message: "تم حذف المستخدم بنجاح" });
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
