const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verify = require("../middleware/verifyToken");


// Route để thêm đánh giá cho sản phẩm
router.post('/:productId/reviews', verify.verityToken,reviewController.addReview);

// Route để lấy tất cả đánh giá của sản phẩm
router.get('/:productId', verify.verityToken, reviewController.getReviews);
router.get('/', reviewController.getAllReviews); // Lấy tất cả các đánh giá
router.put('/:reviewId', reviewController.updateReview); // Cập nhật đánh giá
router.delete('/:reviewId', reviewController.deleteReview); // Xóa đánh giá

module.exports = router;
