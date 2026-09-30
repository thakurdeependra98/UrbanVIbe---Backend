require("dotenv").config();
const users = require("../../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new users({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ msg: "Registration successful", user: newUser });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Password are not match" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({ msg: "Login successful", user, token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, 
      sameSite: "Strict",
    });
    return res.status(200).json({ msg: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ msg: "Server error during logout" });
  }
};



exports.getAllUsers = async (req, res) => {
  try{
    const usersList = (await users.find({})).filter((user) => user.role !== "admin");
    if (!usersList || usersList.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }
    res.status(200).json(usersList);
  }catch(error){
    console.error("Error fetching users:", error); 
    res.status(500).send("Server Error");
  }
}