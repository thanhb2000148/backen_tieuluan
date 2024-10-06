const jwt = require("jsonwebtoken");

const verify = {
  verityToken: (req, res, next) => {
    const token = req.headers.token;
    // console.log("Token nhận được:", token); // In token ra để kiểm tra
    if (token) {
      jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json({
            message: "Token không hợp lệ",
            success: false,
          });
        }
        req.user = user; // Lưu thông tin người dùng vào request
        // console.log("User đã giải mã:", user); // In ra user để kiểm tra

        next(); // Chuyển sang middleware hoặc route tiếp theo
      });
    } else {
      return res.status(403).json({
        message: "Bạn chưa xác thực token",
        success: false,
      });
    }
  },
  
  verifyTokenAdmin: (req, res, next) => {
   verify.verityToken(req, res, () => {
    // Kiểm tra xem người dùng có phải là admin không
    if (req.user && req.user.admin === true) {
      next(); // Nếu là admin, cho phép tiếp tục
    } else {
      console.log("admin:", req.user.admin); // In ra để kiểm tra
      return res.status(403).json({
        message: "Bạn không có quyền truy cập",
        success: false,
      });
    }
  });
  },
};

module.exports = verify;
