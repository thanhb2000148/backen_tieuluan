const express = require("express");
const router = express.Router();
const authRouter = require("../router/authRouter");
const userRouter = require("../router/userRouter");
const emailRouter = require("../router/sendMailRouter");
const addressRouter = require("../router/addressRouter");
const uploadRouter = require("../router/uploadRouter"); 
const productRouter = require("../router/productRouter");
const categoryRouter = require("../router/categoryRouter");
const addmetadataRouter = require("../router/addmetadataRouter");

router.use("/v1/auth", authRouter);
router.use("/v1/user", userRouter);
router.use("/v1/sendMail", emailRouter);
router.use("/v1/address", addressRouter);
router.use("/api/upload", uploadRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/typeproduct", productRouter);
router.use("/product-meta", addmetadataRouter);

module.exports = router;
