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
        type: Schema.Types.ObjectId,
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
        type: Number,
      },
      LIST_MATCH_KEY: [
        {
          KEY: {
            type: String,
          },
          VALUE: {
            type: String,
          },
        },
      ],
      NUMBER_PRODUCT: {
        type: Number,
        default: 0,
      },
      ID_KEY_VALUE: {
        type: Schema.Types.ObjectId,
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
  ORDER_STATUS: { // Trạng thái quản lý đơn hàng
    type: String,
    enum: [
      'Chờ Duyệt',
      'Đang xử lý', 
      'Đang vận chuyển', 
      'Đã giao', 
      'Đã hủy'
    ],
    default: 'Chờ Duyệt',
  },
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
  STATUS_HISTORY: [ // Lưu trữ lịch sử các trạng thái
    {
      status: {
        type: String,
        required: true,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
module.exports = mongoose.model("order", ORDER);
