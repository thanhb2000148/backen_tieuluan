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
const typeProductRouter = require("../router/typeProductRouter");
const suppliersRouter = require("../router/suppliersRouter");
const orderRouter = require("../router/orderRouter");
const inventoryRouter = require("../router/inventory_entriesRouter");
const testRouter = require("../router/testRouter");

router.use("/v1/auth", authRouter);
router.use("/v1/user", userRouter);
router.use("/v1/sendMail", emailRouter);
router.use("/v1/address", addressRouter);
router.use("/v1/upload", uploadRouter);
router.use("/v1/product", productRouter);
router.use("/v1/category", categoryRouter);
router.use("/v1/typeproduct", typeProductRouter);
router.use("/v1/suppliers", suppliersRouter);
router.use("/v1/inventory", inventoryRouter);

router.use("/v1/price", priceRouter);
router.use("/v1/cart", cartRouter);
router.use("/v1/payment", paymentRouter);
router.use("/v1/order", orderRouter);

router.use("/v1/test", testRouter);
module.exports = router;
