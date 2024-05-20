var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CART = new Schema({
  USER_ID: {
    type: String,
  },
  LIST_PRODUCT: [
    {
      ID_PRODUCT: {
        type: Schema.Types.ObjectId,
      },
      FROM_DATE: {
        type: Date,
      },
      TO_DATE: {
        type: Date,
      },
      QLT: {
        type: String,
      },
      UNITPRICES: {
        type: Number,
      },
    },
  ],
  LIST_PRODUCT_MAX_NUMBER: {
    type: Number,
  },
});
module.exports = mongoose.model("cart", CART);
