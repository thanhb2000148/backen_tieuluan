const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verify = require("../middleware/verifyToken");
router.post("/", verify.verityToken, orderController.addOrder);
router.get("/", verify.verityToken, orderController.getUserOrder);
router.get("/all",verify.verifyTokenAdmin, orderController.getAllOrders);


module.exports = router;
