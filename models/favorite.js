var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FAVORITE = new Schema({
  USER_ID: {
    type: Schema.Types.ObjectId, // ID của người dùng
    required: true,
    ref: 'User' // Giả sử bạn có một mô hình người dùng
  },
  PRODUCT_ID: {
    type: Schema.Types.ObjectId, // ID của sản phẩm yêu thích
    required: true,
    ref: 'product' // Giả sử bạn có một mô hình sản phẩm
  },
  CREATED_AT: {
    type: Date,
    default: Date.now // Thời gian thêm vào danh sách yêu thích
  }
});

// Đảm bảo không có người dùng nào có thể yêu thích cùng một sản phẩm nhiều lần
FAVORITE.index({ USER_ID: 1, PRODUCT_ID: 1 }, { unique: true });

module.exports = mongoose.model("favorite", FAVORITE);
