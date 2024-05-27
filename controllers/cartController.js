const CartService = require("../services/cart.service");
const cartController = {
  addCart: async (req, res) => {
    try {
      const newCart = await CartService.addCart(
        req.user.id_user,
        req.params.id
      );
      res.status(200).json({
        message: "Thêm sản phẩm thành công",
        success: true,
        data: newCart,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getCart: async (req, res) => {
    try {
      const getCart = await CartService.getCart(req.user.id_user);
      res.status(200).json({
        message: "Lấy giỏ hàng thành công",
        success: true,
        data: getCart,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = cartController;
