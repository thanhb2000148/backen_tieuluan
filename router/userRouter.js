const userController = require("../controllers/userController");
const authController = require("../controllers/authControllers");
const UserService = require("../services/user.service");
const verify = require("../middleware/verifyToken");
const router = require("express").Router();
router.get("/userLogin", verify.verityToken, userController.getLoginUser);
router.get("/", verify.verifyTokenAdmin, userController.getAllUsers);
router.get("/:id", verify.verityToken, userController.getUserById);
router.put('/users/:id', userController.updateUser);



module.exports = router;