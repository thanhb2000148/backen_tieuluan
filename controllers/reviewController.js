const reviewService = require('../services/review.services');
const mongoose = require('mongoose'); // Thêm dòng này


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

const getReviewsByRating = async (req, res) => {
  const { productId, rating } = req.params;
  try {
    const reviews = await reviewService.getReviewsByRating(productId, rating);

    if (reviews.length === 0) {
      // Nếu không có đánh giá nào với số sao được tìm thấy
      return res.status(200).json({
        message: "Chưa có đánh giá nào với số sao này",
        success: true,
        review: [],
      });
    }

    // Nếu có đánh giá, trả về danh sách đánh giá
    res.status(200).json({
      message: "Lấy số sao đánh giá thành công",
      success: true,
      review: reviews,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
// const getReviewsByUser = async (req, res) => {
//   try {
//     const userId = req.user.id; // Lấy userId từ thông tin người dùng đã xác thực

//     // Kiểm tra xem userId có hợp lệ không
//     if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: 'Không tìm thấy userId hoặc userId không hợp lệ.' });
//     }

//     const reviews = await reviewService.getReviewsByUserId(userId);

//     // Kiểm tra nếu không tìm thấy đánh giá
//     if (!reviews || reviews.length === 0) {
//       return res.status(404).json({ message: 'Không tìm thấy đánh giá nào cho người dùng này.' });
//     }

//     res.status(200).json(reviews); // Trả về các đánh giá của người dùng
//   } catch (error) {
//     console.error("Error fetching reviews by user:", error);
//     res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy đánh giá của người dùng.', details: error.message });
//   }
// };
// controllers/reviewController.js
const getUserReviewByProductId = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id_user; // Giả định rằng bạn có user ID từ token

  try {
    // Gọi service để lấy đánh giá của người dùng cho sản phẩm
    const userReview = await reviewService.getUserReviewByProductId(productId, userId);

    // Nếu không có đánh giá nào của người dùng
    if (!userReview) {
      return res.status(404).json({ message: 'Người dùng chưa đánh giá sản phẩm này.', userReview: null });
    }

    res.status(200).json({ userReview }); // Gửi đánh giá của người dùng
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá của người dùng theo sản phẩm:", error);
    res.status(500).json({ message: 'Lỗi khi lấy đánh giá', error });
  }
};







module.exports = {
  addReview,
    getReviews,
    deleteReview,
    updateReview,
    getAllReviews,
  getReviewsByRating,
  // getReviewsByUser,
    getUserReviewByProductId,
};
