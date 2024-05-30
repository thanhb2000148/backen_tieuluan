const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const verify = require("../middleware/verifyToken");
router.post("/", verify.verityToken, paymentController.payment);
router.post("/callback", paymentController.callbacks);
module.exports = router;
