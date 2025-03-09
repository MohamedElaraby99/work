const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization; // "Bearer token"

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; //["Bearer", "token"]

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    // Extract user information from the token
    req.user_id = decoded.userInfo.id;
    req.role = decoded.userInfo.role; // Assume the role is in userInfo
    req.stage = decoded.userInfo.stage; // Assume the stage is in userInfo
    req.subject = decoded.userInfo.subject;
    console.log(req.user_id, req.role, req.stage);

    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};


module.exports = {verifyJWT, verifyAdmin};
