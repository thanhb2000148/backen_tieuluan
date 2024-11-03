const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verify = require("../middleware/verifyToken");
router.post("/", verify.verityToken, orderController.addOrder);
router.post('/test-update-order',verify.verifyTokenAdmin, orderController.testUpdateOrder);

router.get("/", verify.verityToken, orderController.getUserOrder);
router.get('/monthly', orderController.getMonthlyRevenue);
router.get("/all", verify.verifyTokenAdmin, orderController.getAllOrders);
router.get("/orders/filter", verify.verifyTokenAdmin, orderController.filterOrders);

router.get("/orders/count", orderController.getOrderCount);
router.get("/orders/recent", orderController.getRecentOrders);
router.get('/total-revenue', orderController.getTotalRevenue);
// Route để lấy tổng doanh thu của tất cả đơn hàng
router.get('/totalall', orderController.getTotalRevenueAllTime);

// Route để admin cập nhật trạng thái thanh toán cho đơn hàng
router.put("/confirm-payment/:id", verify.verifyTokenAdmin, orderController.confirmPayment);
//cac router trạng thái
router.put("/orders/:id/proceed",verify.verifyTokenAdmin, orderController.updateOrderToProcessing);
router.put("/orders/:id/shipping", verify.verifyTokenAdmin, orderController.updateOrderToShipping);
router.patch("/orders/:id/success", verify.verityToken, orderController.updateOrderStatusSuccess);
router.delete('/orders/:id/cancel', verify.verityToken, orderController.cancelOrder);



module.exports = router;
