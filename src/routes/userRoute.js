require("dotenv").config();
const express = require("express");
const passport = require("passport");
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  logout,
  getAllUsers,
  getProfile,
} = require("../controllers/userControllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/users", getAllUsers);
router.get("/profile", authMiddleware, getProfile);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", 
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token, user } = req.user;
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      maxAge: 60 * 60 * 1000, 
    });
    res.redirect("http://localhost:8080"); 
  }
);

 

module.exports = router;