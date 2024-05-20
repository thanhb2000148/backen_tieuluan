const userController = require("../controllers/userController");
const verify = require("../middleware/verifyToken");
const router = require("express").Router();
router.get("/", verify.verityToken, userController.getAllUsers);
router.get("/:id", userController.getAUser);
router.delete("/:id", userController.deleteUser);
module.exports = router;
