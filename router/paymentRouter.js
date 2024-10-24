const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const verify = require("../middleware/verifyToken");
router.post("/", verify.verityToken, paymentController.payment);
router.post("/callback", paymentController.callbacks);
router.post("/transaction-status", paymentController.transactionStatus);
router.post("/cod", verify.verityToken, paymentController.paymentCOD);
router.post(
  "/paymentZalo",
  verify.verityToken,
  paymentController.paymentZaloPay
);
router.post("/callbackZalo", paymentController.callbacksZaloPay);
// router.post("/update-order", paymentController.updateOrder);
module.exports = router;
