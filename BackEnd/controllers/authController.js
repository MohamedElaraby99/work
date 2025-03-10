const User = require("../models/User");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");
const subjects = require("../utils/subjects");
const stages = require("../utils/stages");
const register = async (req, res) => {
  const { name, username, password, role, stage, subject } = req.body;
  if (!name || !username || !password || !role) {
    return res.status(400).json({ message: "كل الحقول مطلوبة" });
  }

  if (role !== "admin") {
    if (!stage) {
      return res
        .status(400)
        .json({ message: "المرحلة الدراسية مطلوبة اذا لم تكن مشرف" });
    }
    if (!stages.includes(stage)) {
      return res.status(400).json({ message: "المرحلة الدراسية غير صالحة" });
    }
    if (subject.length === 0) {
      return res
        .status(400)
        .json({ message: "المادة الدراسية مطلوبة اذا لم تكن مشرف" });
    }
    const isSubjectValid = subject.every((sub) => {
      return subjects.includes(sub);
    });

    if (!isSubjectValid) {
      return res.status(400).json({ message: "المادة الدراسية غير صالحة" });
    }
  }

  const foundUser = await User.findOne({ username }).exec();
  if (foundUser) {
    return res.status(401).json({ message: "المستخدم موجود بالفعل" });
  }

  // const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    username,
    stage,
    password,
    role,
    subject,
  });

  const accessToken = jsonWebToken.sign(
    {
      userInfo: {
        id: user._id,
        role: user.role,
        stage: user.stage,
        subject: user.subject,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30d" }
  );

  const refreshToken = jsonWebToken.sign(
    {
      userInfo: {
        id: user._id,
        role: user.role,
        stage: user.stage,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: "None", // cross-site cookie
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  res.json({
    accessToken,
    username: user.username,
    stage: user.stage,
    role: user.role,
    subject: user.subject,
    name: user.name,
  });
};

const registerUsers = async (req, res) => {
  // const hashedPassword = await bcrypt.hash(password, 10);

  // const users = await User.create({
  //   name,
  //   username,
  //   stage,
  //   password,
  //   role,
  //   subject
  // });

  if (req.body.length === 0) {
    return res.status(400).json({ message: "لا يوجد مستخدمين" });
  }

  const newUsers = await User.insertMany(req.body);
  res.json({
    message: "تم تسجيل المستخدمين بنجاح",
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "كل الحقول مطلوبة" });
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    return res.status(401).json({ message: "المستخدم غير موجود" });
  }

  // const isMatch = await bcrypt.compare(password, foundUser.password);
  const foundPassword = await User.findOne({ password }).exec();

  if (!foundPassword) {
    return res.status(401).json({ message: "كلمة المرور خاطئة" });
  }
  const accessToken = jsonWebToken.sign(
    {
      userInfo: {
        id: foundUser._id,
        role: foundUser.role,
        stage: foundUser.stage,
        subject: foundUser.subject,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30d" }
  );

  const refreshToken = jsonWebToken.sign(
    {
      userInfo: {
        id: foundUser._id,
        role: foundUser.role,
        stage: foundUser.stage,
        subject: foundUser.subject,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    username: foundUser.username,
    role: foundUser.role,
    stage: foundUser.stage,
    subject: foundUser.subject,
    name: foundUser.name,
  });
};

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" }); // No refresh token
  const refreshToken = cookies.jwt;
  jwt.verfy(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" }); // Invalid refresh token
      const foundUser = await User.findById(decoded.userInfo.id).exec();
      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const accessToken = jsonWebToken.sign(
        {
          userInfo: {
            id: foundUser._id,
            role: foundUser.role,
            stage: foundUser.stage,
            subject: foundUser.subject,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30d" }
      );
      res.json({ accessToken });
    }
  );
};

module.exports = {
  register,
  registerUsers,
  login,
  refreshToken,
};
