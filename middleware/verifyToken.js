const jwt = require("jsonwebtoken");
const verify = {
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
      return res.status(403).json("bạn chưa xđược xác thực");
    }
  },
};
module.exports = verify;
