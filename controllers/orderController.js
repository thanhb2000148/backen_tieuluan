const OrderService = require("../services/order.service");

class OrderController {
  static addOrder = async (req, res) => {
    try {
      const addOrder = await OrderService.addOrder(
        req.user.id_user,
        req.user.id,
        req.body.province,
        req.body.district,
        req.body.commune,
        req.body.desc
      );
      if (addOrder.success == false) {
        res.status(200).json({
          success: false,
          message: "Thêm order thất bại",
          data1: addOrder,
        });
      } else {
        const statusOrder1 = await OrderService.statusOrder1(req.user.id);
        res.status(200).json({
          success: true,
          message: "Thêm order thành công",
          data1: addOrder,
          data2: statusOrder1,
        });
      }
    } catch (error) {
      console.error("Error in addOrder:", error.message);
      res.status(400).json({ error: error.message }); // Trả về lỗi chi tiết hơn
    }
  };
}

module.exports = OrderController;
