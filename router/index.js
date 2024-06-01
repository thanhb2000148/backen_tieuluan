const express = require("express");
const router = express.Router();
const authRouter = require("../router/authRouter");
const userRouter = require("../router/userRouter");
const emailRouter = require("../router/sendMailRouter");
const addressRouter = require("../router/addressRouter");
const productRouter = require("../router/productRouter");
const categoryRouter = require("../router/categoryRouter");
const uploadRouter = require("../router/uploadRouter");
const priceRouter = require("../router/priceRouter");
const cartRouter = require("../router/cartRouter");
const paymentRouter = require("../router/paymentRouter");
const suppliersRouter = require("../router/suppliersRouter");
const orderRouter = require("../router/orderRouter");

router.use("/v1/auth", authRouter);
router.use("/v1/user", userRouter);
router.use("/v1/sendMail", emailRouter);
router.use("/v1/address", addressRouter);
router.use("/v1/upload", uploadRouter);
router.use("/v1/product", productRouter);
router.use("/v1/category", categoryRouter);
router.use("/v1/typeproduct", productRouter);

router.use("/v1/price", priceRouter);
router.use("/v1/cart", cartRouter);
router.use("/v1/payment", paymentRouter);
router.use("/v1/order", orderRouter);
module.exports = router;
