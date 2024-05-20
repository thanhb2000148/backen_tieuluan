const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
// MongoDB connection
const password = encodeURIComponent("tttt2024group1#@");
const mongoConnect = `mongodb://internship_group_1:${password}@dtuct.ddns.net:6969/STORE_MANGAGER`;
mongoose
  .connect(mongoConnect, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
