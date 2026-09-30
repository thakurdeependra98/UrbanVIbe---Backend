const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token; // Safely access req.cookies.token

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({ msg: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
