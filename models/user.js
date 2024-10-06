var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var USER = new Schema({
  // FIRST_NAME: {
  //   type: String,
  // },
  // MIDDLE_NAME: {
  //   type: String,
  // },
  FULL_NAME: {
    type: String,
  },
  LAST_NAME: {
    type: String,
    required: true,
    unique: true,
  },
  EMAIL_USER: {
    type: String,
  },
  PHONE_NUMBER: {
    type: Number,
  },
  CREATED_AT: {
    type: Date,
  },
  GENGER_USER: {
    type: String,
  },
   BIRTHDAY: {
    type: Date, // Thêm trường ngày sinh với kiểu dữ liệu là Date
  },
  AVT_URL: {
    type: String,
    trim: true,
    default: ""
  },
  // GOOGLE_ID: {
  //   type: String,
  //   unique: true
  // }
});
module.exports = mongoose.model("user", USER);
