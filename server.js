const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connectDB = require("./database/connectDB");
const session = require("express-session");
const passport = require("./config/passport");

// Load environment variables from .env file
dotenv.config();

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);


const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
// Cấu hình express-session
app.use(session({
  secret: process.env.SESSION_SECRET,  // Thay 'your_secret_key' bằng một chuỗi bí mật
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Đặt thành true nếu bạn sử dụng HTTPS
}));

// Khởi tạo Passport và session Passport
app.use(passport.initialize());
app.use(passport.session());


// MongoDB connection
connectDB();
// Routes
app.use(require("./router"));
// Start server
app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});

//
