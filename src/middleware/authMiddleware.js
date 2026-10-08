const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token;
    const authorizationHeader = req.headers.authorization;
    const headerToken = authorizationHeader?.match(/^Bearer\s+(.+)$/i)?.[1].trim();
    const token = headerToken || cookieToken;

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        msg: "Session expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      msg: "Invalid token. Please login again.",
    });
  }
};

module.exports = authMiddleware;
