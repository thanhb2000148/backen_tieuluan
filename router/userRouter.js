const userController = require("../controllers/userController");
const authController = require("../controllers/authControllers");
const UserService = require("../services/user.service");
const verify = require("../middleware/verifyToken");
const router = require("express").Router();
const passport = require("../config/passport");
router.get("/userLogin", verify.verityToken, userController.getLoginUser);
router.get("/", userController.getAllUsers);
router.get("/:id", verify.verityToken, userController.getUserById);

// // Đăng nhập bằng Google : Gửi auth URL cho frontend
// router.get('/auth/google', (req, res) => {
//   const googleClientId = process.env.GOOGLE_CLIENT_ID; // Sử dụng biến môi trường
//   const redirectUri = 'http://localhost:8000/v1/user/auth/google/callback'; 
//   const scope = 'profile email';
//   const responseType = 'code';
//   const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=${responseType}&client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
//   res.status(200).json({ authUrl: googleAuthUrl });
// });

// // Đăng nhập bằng Google  Xử lý callback từ Google
// router.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login', session: false }),
//   async (req, res) => {
//     if (!req.user) {
//       return res.status(401).json({ message: "Authentication failed!" });
//     }
//     console.log('Google user info:', req.user);

//     try {
//       const data = { userId: req.user.id };
//       const accessToken = await UserService.generateAccessToken(data); 
      
//       // res.redirect(`http://localhost:3000/?token=${accessToken}`);
      
//     res.status(200).json({
//         accessToken,
//         message: 'Đăng nhập Google thành công',
//         success: true,
//       });
      
//     } catch (error) {
//       console.error(error);
//       if (!res.headersSent) {
//         res.status(500).json({ message: error.message });
//       }
//     }
//   }
// );


module.exports = router;