const PriceService = require("../services/price.service");
const priceController = {
  addPrice: async (req, res) => {
    try {
      const newPrice = await PriceService.addPrice(
        req.params.id,
        req.body.price_number
      );
      res.status(200).json({
        message: "Thêm giá thành công",
        success: true,
        data: newPrice,
      });
    } catch (e) {
      res.status(500).json({
        message: e.message,
      });
    }
  },
};
module.exports = priceController;
