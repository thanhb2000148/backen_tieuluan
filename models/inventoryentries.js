var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var INVENTORYENTRIES = new Schema({
  CRATED_DATE: {
    type: Date,
  },
  LIST_PRODUCT_CREATED: [
    {
      ID_PRODUCT: {
        type: Schema.Types.ObjectId,
      },
      UNITPRICES: {
        type: Number,
      },
      QLT: {
        type: String,
      },
    },
  ],
  ID_SUPPLIERS: {
    type: Schema.Types.ObjectId,
  },
  ACCOUNT__ID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
module.exports = mongoose.model("inventoryentries", INVENTORYENTRIES);
