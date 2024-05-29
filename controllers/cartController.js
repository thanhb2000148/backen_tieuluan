const CartService = require("../services/cart.service");
const cartController = {
  addCart: async (req, res) => {
    try {
      const newCart = await CartService.addCart(
        req.user.id_user,
        req.params.id,
        req.body.key,
        req.body.value
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
      const getCart = await CartService.getCart(
        req.user.id_user,
        req.query.page,
        req.query.limit
      );
      res.status(200).json({
        message: "Lấy giỏ hàng thành công",
        success: true,
        data: getCart,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateCart: async (req, res) => {
    try {
      const updateCart = await CartService.updateCart(
        req.user.id_user,
        req.params.id,
        req.body.price
      );
      res.status(200).json({
        message: "Cập nhật giỏ hàng thành công",
        success: true,
        data: updateCart,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = cartController;
