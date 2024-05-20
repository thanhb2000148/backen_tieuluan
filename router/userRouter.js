const userController = require("../controllers/userController");
const middlewareController = require("../middleware/middlewareController");
const router = require("express").Router();
router.get("/", middlewareController.verityToken, userController.getAllUsers);
router.get("/:id", userController.getAUser);
router.delete(
  "/:id",
  middlewareController.verifyTokenAndAdminAuth,
  userController.deleteUser
);
module.exports = router;
