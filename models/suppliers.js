var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var SUPPLIERS = new Schema({
  NAME_SUPPIERS: {
    type: String,
  },
  NAME_PRODUCT: {
    type: String,
  },
  ADDRES_SUPPIERS: {
    PROVINCE: {
      type: String,
    },
    DISTRICT: {
      type: String,
    },
    COMMUNE: {
      type: String,
    },
    DESC: {
      type: String,
    },
  },
  CODE_SUPPIERS: {
    type: Number,
  },
});
module.exports = mongoose.model("address_suppires", ADDRES_SUPPIERS);
