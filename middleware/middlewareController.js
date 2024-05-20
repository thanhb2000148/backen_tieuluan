const jwt = require("jsonwebtoken");
const middlewareController = {
  verityToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token;
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json("token không tồn tại");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(403).json("bạn chưa được xác thực");
    }
  },
  verifyTokenAndAdminAuth: (req, res, next) => {
    // nếu là người dùng thì có quyền xóa tk của mình admin = true có quyền xóa mọi tk
    middlewareController.verityToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("bạn đã xóa tài khoản");
      }
    });
  },
};
module.exports = middlewareController;
