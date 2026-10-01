require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const passport = require("passport");
require("./src/controllers/userControllers/googleAuthcontroller"); 
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/userRoute");
const productRoutes = require("./src/routes/productRoute");
const cartRoutes = require("./src/routes/cartRoute");
const wishlistRoutes = require("./src/routes/wishlistRoute");
const categoryRoutes = require("./src/routes/categoryRoute");
const dbConnection = require("./src/dbConnection/dbConnection");
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Required environment variables are missing.");
}

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(passport.initialize());

app.use("/api", authRoutes, productRoutes, cartRoutes, wishlistRoutes, categoryRoutes);

dbConnection().catch((error) => {
  console.error("Error connecting to MongoDB:", error.message);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
