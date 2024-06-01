const userController = require("../controllers/userController");
const verify = require("../middleware/verifyToken");
const router = require("express").Router();
router.get("/userLogin", verify.verityToken, userController.getLoginUser);
router.get("/", verify.verityToken, userController.getAllUsers);
module.exports = router;
