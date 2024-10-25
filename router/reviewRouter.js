const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verify = require("../middleware/verifyToken");


// Route để thêm đánh giá cho sản phẩm


router.post('/:productId/reviews', verify.verityToken,reviewController.addReview);
// router.get('/user', verify.verityToken, reviewController.getReviewsByUser); //láy đánh giá theo người dùng
// Route để lấy tất cả đánh giá của sản phẩm
router.get('/:productId/user', verify.verityToken, reviewController.getUserReviewByProductId);
router.get('/reviews/total', reviewController.getTotalReviewsCount); // Thêm route mới

// Route để lấy tất cả đánh giá của sản phẩm
router.get('/:productId', verify.verityToken, reviewController.getReviews);
router.get('/:productId/:rating', reviewController.getReviewsByRating);
router.get('/', reviewController.getAllReviews); // Lấy tất cả các đánh giá
router.put('/:reviewId', verify.verityToken,reviewController.updateReview); // Cập nhật đánh giá
router.delete('/:reviewId',verify.verityToken, reviewController.deleteReview); // Xóa đánh giá

module.exports = router;
