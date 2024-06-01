var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ORDER = new Schema({
  ORDER_CODE: {
    type: String,
  },
  ADDRESS_USER: {
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
  PHONE_USER: {
    type: Number,
  },
  LIST_PRODUCT: [
    {
      ID_PRODUCT: {
        type: String,
      },
      FROM_DATE: {
        type: Date,
      },
      TO_DATE: {
        type: Date,
      },
      UNITPRICES: {
        type: Number,
      },
      QLT: {
        type: String,
      },
    },
  ],
  LIST_STATUS: [
    {
      STATUS_NAME: {
        type: String,
      },
      STATUS_CODE: {
        type: Number,
      },
      FROM_DATE: {
        type: Date,
      },
      TO_DATE: {
        type: Date,
      },
    },
  ],
  PAYMENT_METHOD: {
    type: String,
    enum: ["cod", "online"],
  },
  IS_PAYMENT: {
    type: Boolean,
  },
  TIME_PAYMENT: {
    type: Date,
  },
  CANCEL_REASON: {
    type: String,
  },
  ACCOUNT__ID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
module.exports = mongoose.model("order", ORDER);
