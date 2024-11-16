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
  // IS_FAVORITED: {
  //   type: Boolean,
  //   default: true // Mặc định khi thêm vào là "yêu thích"
  // },
  CREATED_AT: {
    type: Date,
    default: Date.now // Thời gian thêm vào danh sách yêu thích
  }
});

// Đảm bảo không có người dùng nào có thể yêu thích cùng một sản phẩm nhiều lần
FAVORITE.index({ USER_ID: 1, PRODUCT_ID: 1 }, { unique: true });

module.exports = mongoose.model("favorite", FAVORITE);
