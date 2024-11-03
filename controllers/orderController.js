const OrderService = require("../services/order.service");
  // const AccountModel = require("../models/account");

  class OrderController {
    static addOrder = async (req, res) => {
      try {
        const addOrder = await OrderService.addOrder(
          req.user.id_user,
          req.user.id,
          req.body.PROVINCE,
          req.body.DISTRICT,
          req.body.COMMUNE,
          req.body.DESC
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
        // const numberOrder = await OrderService.updateNumberProduct(
        //   req.user.id_user
        // );
        // res.status(200).json({ data: numberOrder });
      } catch (error) {
        console.error("Error in addOrder:", error.message);
        res.status(400).json({ error: error.message }); // Trả về lỗi chi tiết hơn
      }
    };
    static getTotalRevenueAllTime = async (req, res) => {
    try {
      const totalRevenue = await OrderService.getTotalRevenueAllTime();
      res.status(200).json({
        success: true,
        message: "Tính tổng doanh thu thành công",
        data: totalRevenue
      });
    } catch (error) {
      console.error("Error in getTotalRevenueAllTime:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }
    // doanh thu theo ngày
   static getTotalRevenue = async (req, res) => {
    const { fromDate, toDate } = req.body; // Lấy từ request body
    try {
        const { totalRevenue, orders } = await OrderService.getTotalRevenue(new Date(fromDate), new Date(toDate));
        res.status(200).json({
            success: true,
            message: "Tính tổng doanh thu thành công",
            data: totalRevenue,
            orders: orders, // Trả về danh sách đơn hàng
        });
    } catch (error) {
        console.error("Error in getTotalRevenue:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
  }
    // lấy số lượng các đơn hàng
     static getOrderCount = async (req, res) => {
        try {
          const orderCount = await OrderService.countOrders();
          res.status(200).json({
            success: true,
            message: "Lấy số lượng đơn hàng thành công",
            data: orderCount,
          });
        } catch (error) {
          console.error("Error in getOrderCount:", error.message);
          res.status(500).json({ success: false, error: error.message });
        }
    };
    //lay dơn hàng gần nhất
    static getRecentOrders = async (req, res) => {
    try {
      const recentOrders = await OrderService.getRecentOrders(); // Lấy đơn hàng gần đây
      res.status(200).json({
        success: true,
        message: "Lấy các đơn hàng gần đây thành công",
        data: recentOrders,
      });
    } catch (error) {
      console.error("Error in getRecentOrders:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  };

    static getUserOrder = async (req, res) => {
      try {
        const response = await OrderService.getUserOrder(req.user.id);
        res.status(200).json({
          success: true,
          message: "Lấy thông tin đơn hàng thành công",
          data: response,
        });
      } catch (error) {
        console.error("Error in getUserOrder:", error.message);
      }
    };
    static getAllOrders = async (req, res) => {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json({
        success: true,
        message: "Lấy tất cả đơn hàng thành công",
        data: orders,
      });
    } catch (error) {
      console.error("Error in getAllOrders:", error.message);
      res.status(400).json({ success: false, error: error.message });
      }
      
    };
    //lọc dơn hàng theo trạng thái
    static filterOrders = async (req, res) => {
        try {
          const status = req.query.status; // Lấy trạng thái từ query params

          if (!status) {
            return res.status(400).json({ success: false, message: 'Trạng thái không được cung cấp.' });
          }

          const filteredOrders = await OrderService.filterOrdersByStatus(status);

          res.status(200).json({
            success: true,
            message: 'Lọc đơn hàng theo trạng thái thành công',
            data: filteredOrders, // Dữ liệu trả về đã lọc
          });
        } catch (error) {
          console.error("Error in filterOrders:", error.message);
          res.status(500).json({ success: false, error: error.message });
        }
      };


    

    static confirmPayment = async (req, res) => {
      try {
          const orderId = req.params.id; // Lấy ID từ params
          const order = await OrderService.getOrderById(orderId); // Lấy đơn hàng theo ID

          // Kiểm tra nếu đơn hàng không tồn tại
          if (!order) {
              return res.status(404).json({ error: 'Không tìm thấy đơn hàng với ID đã cho!' });
          }

          // Kiểm tra trạng thái cho phép thanh toán
          const currentStatus = order.LIST_STATUS[order.LIST_STATUS.length - 1].STATUS_NAME;
          if (currentStatus !== 'chưa hoàn thành thanh toán') {
              return res.status(400).json({ error: 'Không thể xác nhận thanh toán khi đơn hàng không ở trạng thái cho phép!' });
          }

          const confirmedOrder = await OrderService.statusOrder2(orderId); // Gọi phương thức xác nhận thanh toán
          res.json(confirmedOrder);
      } catch (error) {
          console.error("Error in confirmPayment:", error.message);
          res.status(500).json({ error: error.message });
      }
  };

    //Cập nhập trạng thái dơn hàng là đang xử lý
    static updateOrderToProcessing = async (req, res) => {
      try {
          const orderId = req.params.id; // Lấy ID từ params
          const order = await OrderService.getOrderById(orderId); // Lấy đơn hàng theo ID

          // Kiểm tra nếu đơn hàng không tồn tại
          if (!order) {
              return res.status(404).json({ error: 'Không tìm thấy đơn hàng với ID đã cho!' });
          }

          // Cập nhật trạng thái đơn hàng
          const updatedOrder = await OrderService.updateOrderStatusToProcessing(orderId);
          res.status(200).json({
              success: true,
              message: "Cập nhật trạng thái đơn hàng thành công",
              data: updatedOrder,
          });
      } catch (error) {
          console.error("Error in updateOrderToProcessing:", error.message);
          res.status(500).json({ error: error.message });
      }
    };
  static updateOrderToShipping = async (req, res) => {
      try {
          const orderId = req.params.id; // Get the order ID from the request parameters

          const order = await OrderService.getOrderById(orderId); // Get the order by ID
          if (!order) {
              return res.status(404).json({ success: false, error: 'Không tìm thấy đơn hàng với ID đã cho!' });
          }

          // Update the order status to "Đang vận chuyển"
          const updatedOrder = await OrderService.updateOrderToShipping(orderId);
          
          // Kiểm tra updatedOrder có giá trị hay không
          if (!updatedOrder) {
              return res.status(400).json({ success: false, message: "Cập nhật đơn hàng không thành công." });
          }

          res.status(200).json({
              success: true,
              message: "Cập nhật trạng thái đơn hàng thành công sang 'Đang vận chuyển'",
              data: updatedOrder,
          });
      } catch (error) {
          console.error("Error in updateOrderToShipping:", error.message);
          return res.status(500).json({ success: false, error: error.message });
      }
  };


    static updateOrderStatusSuccess = async (req, res) => {
    try {
      const orderId = req.params.id; // Get the order ID from the request parameters

      const order = await OrderService.getOrderById(orderId); // Get the order by ID
      if (!order) {
        return res.status(404).json({ error: 'Không tìm thấy đơn hàng với ID đã cho!' });
      }

      // Update the order status to "Đang vận chuyển"
      const updatedOrder = await OrderService.updateOrderStatusSuccess(orderId);
      res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái đơn hàng thành công sang 'Đã Giao'",
        data: updatedOrder,
      });
    } catch (error) {
      console.error("Error in updateOrderStatusSuccess:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  static cancelOrder = async (req, res) => {
    try {
      const orderId = req.params.id; // Lấy ID từ params
      const { cancelReason } = req.body; // Lấy lý do hủy từ body

      if (!cancelReason) {
        return res.status(400).json({ success: false, message: 'Lý do hủy không được cung cấp.' });
      }

      const result = await OrderService.cancelOrder(orderId, cancelReason); // Gọi phương thức hủy đơn hàng

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.updatedOrder,
      });
    } catch (error) {
      console.error("Error in cancelOrder:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
    };
    static testUpdateOrder = async (req, res) => {
    try {
      const { orderCode, paymentMethod } = req.body;

      const result = await OrderService.updateStatusOrderMomo(orderCode, paymentMethod);

      if (result.matchedCount > 0 && result.modifiedCount > 0) {
        res.status(200).json({ message: 'Order updated successfully', result });
      } else if (result.matchedCount > 0 && result.modifiedCount === 0) {
        res.status(200).json({ message: 'Order found but no changes were made', result });
      } else {
        res.status(404).json({ message: 'Order not found', result });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
    }
    
  static getMonthlyRevenue = async (req, res) => {
    const year = parseInt(req.query.year); // Lấy năm từ query parameters
    try {
      const monthlyRevenue = await OrderService.getMonthlyRevenue(year);
      res.status(200).json({
        success: true,
        message: "Lấy doanh thu theo tháng thành công",
        data: monthlyRevenue
      });
    } catch (error) {
      console.error("Error in getMonthlyRevenue:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }

}

  module.exports = OrderController;
