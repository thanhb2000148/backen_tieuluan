const Review = require('../models/review');
const Product = require('../models/product');
const User = require('../models/user');
const mongoose = require('mongoose'); // Thêm dòng này



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
    const reviews = await Review.find({ product_id: productId }).populate('user_id', 'FULL_NAME EMAIL_USER AVT_URL');
    return reviews;
  } catch (error) {
    throw error;
  }
};

const getAllReviews = async () => {
  try {
    const reviews = await Review.find().populate('user_id', 'FULL_NAME EMAIL_USER AVT_URL');
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

const getTotalReviewsCount = async () => {
  try {
    // Đếm tổng số đánh giá
    const totalReviewsCount = await Review.countDocuments({});
    return totalReviewsCount; // Trả về tổng số lượng đánh giá
  } catch (error) {
    throw new Error('Lỗi khi lấy tổng số lượng đánh giá');
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

const getUserReviewByProductId = async (productId, userId) => {
  try {
    // Tìm đánh giá của người dùng cho sản phẩm cụ thể
    const review = await Review.findOne({ product_id: productId, user_id: userId }).populate('user_id', 'FULL_NAME EMAIL_USER AVT_URL');
    return review; // Trả về đánh giá của người dùng
  } catch (error) {
    throw new Error(`Không thể lấy đánh giá: ${error.message}`);
  }
};
const getTopReviewedProducts = async () => {
  try {
    const topProducts = await Review.aggregate([
      {
        $group: {
          _id: "$product_id", // Nhóm theo product_id
          totalReviews: { $sum: 1 }, // Đếm số lượng đánh giá
        },
      },
      {
        $lookup: {
          from: "products", // Tên collection của sản phẩm
          localField: "_id", // Trường trong aggregation
          foreignField: "_id", // Trường trong collection sản phẩm
          as: "productDetails", // Đặt tên cho trường mới
        },
      },
      {
        $unwind: "$productDetails", // Giải nén mảng productDetails
      },
      {
        $project: {
          _id: 0, // Không trả về trường _id của aggregation
          productId: "$productDetails._id", // Lấy productId từ productDetails
          productName: "$productDetails.NAME_PRODUCT", // Lấy tên sản phẩm
          totalReviews: 1, // Trả về tổng số đánh giá
        },
      },
      {
        $sort: { totalReviews: -1 }, // Sắp xếp theo số lượng đánh giá giảm dần
      },
      {
        $limit: 10, // Giới hạn số lượng sản phẩm được trả về
      }
    ]);

    // // Log kết quả topProducts
    // console.log("Top Reviewed Products:", topProducts);

    return topProducts; // Trả về danh sách sản phẩm
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm được đánh giá nhiều nhất:", error);
    throw error; // Ném lỗi ra ngoài để controller có thể xử lý
  }
};




module.exports = {
  createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getAllReviews,
  getReviewsByRating,
  // getReviewsByUserId,
  getUserReviewByProductId,
  getTotalReviewsCount,
  getTopReviewedProducts
};
