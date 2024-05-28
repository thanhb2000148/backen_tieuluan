const PaymentMethod = require("../services/payment.service");
const paymentController = {
  payment: async (req, res) => {
    try {
      const payment = await PaymentMethod.payment();
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
    return res.status(200).json(req.body);
  },
};
module.exports = paymentController;
