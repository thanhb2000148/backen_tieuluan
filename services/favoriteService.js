const Favorite = require('../models/favorite'); // Mô hình yêu thích
const Product = require('../models/product');
const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require('mongoose');

class FavoriteService {
    
   // Tạo yêu thích mới
 static async addFavorite(userId, productId) {
    try {
        // Kiểm tra xem sản phẩm đã yêu thích hay chưa
        const existingFavorite = await Favorite.findOne({ userId, productId });
        if (existingFavorite) {
            throw new Error("Sản phẩm đã được yêu thích.");
        }

        // Tạo và lưu yêu thích mới
        const favorite = new Favorite({
            USER_ID: userId,    // Sử dụng đúng tên trường
            PRODUCT_ID: productId // Sử dụng đúng tên trường
        });
        return await favorite.save();
    } catch (error) {
        throw new Error(error.message);
    }
    }
    static async getProductById(productId) {
    try {
        return await Product.findById(productId); // Thay thế bằng phương thức tìm kiếm phù hợp của bạn
    } catch (error) {
        throw new Error("Không thể tìm sản phẩm.");
    }
    }
    // Lấy tất cả sản phẩm yêu thích
    static async getAllFavorites() {
        try {
            const favorites = await Favorite.find().populate('PRODUCT_ID');

            return favorites; // Trả về danh sách sản phẩm yêu thích
        } catch (error) {
            throw new Error("Không thể lấy danh sách sản phẩm yêu thích: " + error.message);
        }
    }

  // Lấy danh sách sản phẩm yêu thích theo userId
static async getFavoritesByUserId(userId) {
    try {
        if (!userId) {
            throw new Error("userId không hợp lệ.");
        }

        const favorites = await Favorite.find({ USER_ID: userId }).populate('PRODUCT_ID');
        return favorites; // Trả về danh sách sản phẩm yêu thích
    } catch (error) {
        throw new Error("Không thể lấy danh sách sản phẩm yêu thích: " + error.message);
    }
}

  // Xóa sản phẩm yêu thích
    static async removeFavorite(userId, productId) {
        try {
            const result = await Favorite.deleteOne({ USER_ID: userId, PRODUCT_ID: productId });
            if (result.deletedCount === 0) {
                throw new Error("Không tìm thấy sản phẩm yêu thích để xóa.");
            }
            return result;
        } catch (error) {
            throw new Error("Không thể xóa sản phẩm yêu thích: " + error.message);
        }
    }

    // Kiểm tra xem sản phẩm đã yêu thích hay chưa
    static async isFavorited(userId, productId) {
        try {
            return await Favorite.findOne({ userId, productId });
        } catch (error) {
            throw new Error("Lỗi khi kiểm tra sản phẩm yêu thích.");
        }
    }
}

module.exports = FavoriteService;
