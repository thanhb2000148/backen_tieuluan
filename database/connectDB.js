// const mongoose = require("mongoose");
// const connectDB = () => {
//   const password = encodeURIComponent("tttt2024group1#@");
//   const mongoConnect = `mongodb://internship_group_1:${password}@dtuct.ddns.net:6969/STORE_MANGAGER`;
//   mongoose
//     .connect(mongoConnect, {})
//     .then(() => {
//       console.log("Connected to MongoDB");
//     })
//     .catch((err) => {
//       console.error("Error connecting to MongoDB", err);
//     });
// };
// module.exports = connectDB;

const mongoose = require('mongoose');


const dbName = 'TIEULUAN';
const dbURL = `mongodb://127.0.0.1:27017/${dbName}`;
// const dbURL = `mongodb://localhost:27017/${dbName}`;


const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log('Kết nối cơ sở dữ liệu thành công!');
  } catch (error) {
    console.error('Kết nối cơ sở dữ liệu thất bại:', error);
    process.exit(1); // Thoát ứng dụng với mã lỗi
  }
};

module.exports = connectDB;