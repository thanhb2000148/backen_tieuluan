const reviewService = require('../services/review.services');

const addReview = async (req, res) => {
  const { productId } = req.params; // Lấy productId từ URL
  const { rating, comment } = req.body; // Lấy rating và comment từ body request
  const userId = req.user.id_user; // Sử dụng id_user từ token

   // Log để kiểm tra dữ liệu từ req.body
  console.log("Rating:", rating, "Comment:", comment);
    // Kiểm tra dữ liệu đầu vào
  if (!rating || !comment) {
    return res.status(400).json({ error: 'Rating và comment là bắt buộc.' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating phải nằm trong khoảng từ 1 đến 5.' });
  }

//   console.log("User ID:", userId); // Kiểm tra userId

  try {
    const newReview = await reviewService.createReview(productId, userId, rating, comment);
    return res.status(200).json({
        message: "Đánh giá sản phẩm thành công!",
        success: true,
        review: newReview,
      });  
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi thêm đánh giá', details: error.message });
  }
};


const getReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await reviewService.getProductReviews(productId);
     return res.status(200).json({
        message: "Lấy Đánh giá sản phẩm thành công!",
        success: true,
        review: reviews,
      });  
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy đánh giá', details: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy tất cả đánh giá', details: error.message });
  }
};

const updateReview = async (req, res) => {
  const { reviewId } = req.params; // Lấy reviewId từ URL
  const { rating, comment } = req.body; // Lấy rating và comment từ body request

  try {
    const updatedReview = await reviewService.updateReview(reviewId, rating, comment);
    res.status(200).json({ message: 'Cập nhật đánh giá thành công', review: updatedReview });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi cập nhật đánh giá', details: error.message });
  }
};

const deleteReview = async (req, res) => {
  const { reviewId } = req.params; // Lấy reviewId từ URL

  try {
    await reviewService.deleteReview(reviewId);
    res.status(200).json({ message: 'Xóa đánh giá thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xóa đánh giá', details: error.message });
  }
};


module.exports = {
  addReview,
    getReviews,
    deleteReview,
    updateReview,
   getAllReviews,
};
