const userController = require("../controllers/userController");
const verify = require("../middleware/verifyToken");
const router = require("express").Router();
const passport = require("../config/passport");
router.get("/userLogin", verify.verityToken, userController.getLoginUser);
router.get("/", userController.getAllUsers);
router.get("/:id", verify.verityToken, userController.getUserById);
// Đăng nhập bằng Google
// router.get(
//   '/v1/user/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// router.get(
//   '/v1/user/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   userController.googleLogin // Sử dụng controller googleLogin mới để xử lý sau khi xác thực thành công
// );
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: true }),
  (req, res) => {
    // Redirect người dùng đến trang chủ sau khi đăng nhập thành công
    res.redirect('http://localhost:3000'); // Trang chủ của bạn
  }
);
module.exports = router;
