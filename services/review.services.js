const Review = require('../models/review');
const Product = require('../models/product');
const User = require('../models/user');


const createReview = async (productId, userId, rating, comment) => {
  try {
    console.log("Checking for user ID:", userId); // Log userId

    // Kiểm tra sự tồn tại của sản phẩm và người dùng
    const productExists = await Product.findById(productId);
    const userExists = await User.findById(userId);

    // console.log("Product Exists:", productExists); // Log sản phẩm
    // console.log("User Exists:", userExists); // Log người dùng

    if (!productExists) {
      throw new Error('Sản phẩm không tồn tại');
    }
    if (!userExists) {
      throw new Error('Người dùng không tồn tại');
    }

    // Kiểm tra nếu người dùng đã đánh giá sản phẩm này trước đó
    const existingReview = await Review.findOne({ product_id: productId, user_id: userId });
    if (existingReview) {
      throw new Error('Bạn đã đánh giá sản phẩm này trước đó');
    }

    // Tạo đánh giá mới
    const newReview = await Review.create({
      product_id: productId,
      user_id: userId,
      rating,
      comment,
    });

    //  await updateAverageRating(productId); // Gọi hàm cập nhật trung bình đánh giá  
      
    return newReview;
  } catch (error) {
    throw error;
  }
};



const getProductReviews = async (productId) => {
  try {
    // Lấy tất cả các đánh giá của sản phẩm theo productId
    const reviews = await Review.find({ product_id: productId }).populate('user_id', 'FULL_NAME EMAIL_USER');
    return reviews;
  } catch (error) {
    throw error;
  }
};

const getAllReviews = async () => {
  try {
    const reviews = await Review.find().populate('user_id', 'FULL_NAME EMAIL_USER');
    return reviews;
  } catch (error) {
    throw error;
  }
};

const getReviewsByRating = async (productId, rating) => {
  try {
      const reviews = await Review.find({ product_id: productId, rating: rating })
           .populate('user_id', 'EMAIL_USER'); // Chỉ lấy trường EMAIL_USER từ user_id;
    return reviews;
  } catch (error) {
    throw error;
  }
};



const updateReview = async (reviewId, rating, comment) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true } // Trả về tài liệu đã cập nhật
    );
    if (!updatedReview) {
      throw new Error('Đánh giá không tồn tại');
    }
    return updatedReview;
  } catch (error) {
    throw error;
  }
};
const deleteReview = async (reviewId) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      throw new Error('Đánh giá không tồn tại');
    }
  } catch (error) {
    throw error;
  }
};




module.exports = {
  createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getAllReviews,
    getReviewsByRating,
};
