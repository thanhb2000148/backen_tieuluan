const PaymentMethod = require("../services/payment.service");
const CartService = require("../services/cart.service");
const OrderService = require("../services/order.service");
const codeOrder = require("../utils/code");
const code = codeOrder();
const paymentController = {
  payment: async (req, res) => {
    const price = await CartService.getPriceCart(req.user.id_user);
    try {
      const payment = await PaymentMethod.payment(price);
      await OrderService.updateOrderCode(payment.orderId);
      deleteAllCart = await CartService.deleteAllCart(req.user.id_user);
      res.status(200).json({
        message: "Thanh toán thành công",
        success: true,
        data: payment,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false,
        data: null,
      });
    }
  },
  callbacks: async (req, res) => {
    console.log("callbacks");
    console.log(req.body);
    const { orderId, resultCode, partnerCode } = req.body;
    if (resultCode == 0) {
      await OrderService.updateStatusOrderMomo(orderId, partnerCode);
    }
    return res.status(200).json(req.body);
  },

  transactionStatus: async (req, res) => {
    try {
      const payment = await PaymentMethod.transactionStatus(req.body);
      res.status(200).json({
        message: "kiểm tra thanh toán",
        success: true,
        data: payment,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false,
        data: null,
      });
    }
  },
  paymentCOD: async (req, res) => {
    try {
      const cod = await OrderService.updateStatusCOD(code, "COD");
      const deleteAllCart = await CartService.deleteAllCart(req.user.id_user);
      res
        .status(200)
        .json({ message: "success", data1: cod, data2: deleteAllCart });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false,
        data: null,
      });
    }
  },
};
module.exports = paymentController;
