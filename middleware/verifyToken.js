const jwt = require("jsonwebtoken");
const verify = {
  verityToken: (req, res, next) => {
    const token = req.headers.token;
    // console.log("Token nhận được:", token); // In token ra để kiểm tra
    if (token) {
      const accessToken = token;
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json({
            message: "token không tồn tại",
            success: false,
          });
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(403).json({
        message: "bạn chưa xác thực token",
        success: false,
      });
    }
  },
};
module.exports = verify;
