const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var REVIEW = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    },
//    averageRating: {
//     type: Number,
//     default: 0, // Giá trị mặc định là 0
//   },
});

module.exports = mongoose.model("review", REVIEW);
