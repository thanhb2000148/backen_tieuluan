const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
router.post("/", paymentController.payment);
router.post("/callback", paymentController.callbacks);
module.exports = router;
