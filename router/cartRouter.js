const router = require("express").Router();
const cartController = require("../controllers/cartController");
const verify = require("../middleware/verifyToken");
router.post("/:id", verify.verityToken, cartController.addCart);
router.get("/", verify.verityToken, cartController.getCart);
module.exports = router;
