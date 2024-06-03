const OrderModel = require("../models/order");
const ObjectId = require("mongoose").Types.ObjectId;
const randomCode = require("../utils/code");
const AddressService = require("../services/address.services");
const CartService = require("../services/cart.service");
const UserService = require("../services/user.service");
const payment_method = require("../models/payment_method");
const code = randomCode();
class OrderService {
  static addOrder = async (id_user, id_account) => {
    try {
      const ID_USER = new ObjectId(id_user);
      const ID_ACCOUNT = new ObjectId(id_account);
      const PhoneUser = await UserService.getNumberPhoneUser(ID_ACCOUNT);
      const ListProductData = await CartService.getAllCart(ID_USER);
      if (ListProductData.length > 0) {
        const ListProduct = ListProductData.map((cart) => ({
          ID_PRODUCT: cart.ITEM.ID_PRODUCT,
          FROM_DATE: cart.ITEM.FROM_DATE,
          TO_DATE: cart.ITEM.TO_DATE,
          UNITPRICES: cart.ITEM.PRICE,
          QLT: cart.ITEM.QUANTITY,
        }));
        const newOrder = await OrderModel.create({
          ORDER_CODE: null,
          PHONE_USER: PhoneUser,
          LIST_PRODUCT: ListProduct,
          ACCOUNT__ID: ID_ACCOUNT,
          PAYMENT_METHOD: null,
          IS_PAYMENT: false,
          TIME_PAYMENT: null,
          CANCEL_REASON: null,
          // ADDRESS_USER: await AddressService.getAddress(ID_ACCOUNT),
        });
        return newOrder;
      } else {
        return {
          message: "Không có sản phẩm trong giỏ hàng",
          success: false,
          data: null,
        };
      }
    } catch (error) {
      console.error("Error in addOrder:", error.message);
      throw error; // Re-throw the error to be handled by the calling function
    }
  };
  static updateOrderCode = async (orderCode) => {
    const updateCode = await OrderModel.updateOne(
      {
        ORDER_CODE: null,
      },
      {
        ORDER_CODE: orderCode,
      }
    );
  };
  static updateStatusOrderMomo = async (orderCode, payment_method) => {
    const update = await OrderModel.updateOne(
      { ORDER_CODE: orderCode },
      {
        IS_PAYMENT: true,
        TIME_PAYMENT: new Date(),
        PAYMENT_METHOD: payment_method,
      }
    );
    return update;
  };
  static updateStatusCOD = async (orderCode, payment_method) => {
    const lastOrder = await OrderModel.findOne({ ORDER_CODE: null }).sort({
      _id: -1,
    });

    if (lastOrder) {
      const update = await OrderModel.updateOne(
        { _id: lastOrder._id },
        {
          ORDER_CODE: orderCode,
          IS_PAYMENT: true,
          TIME_PAYMENT: new Date(),
          PAYMENT_METHOD: payment_method,
        }
      );
      return update;
    } else {
      return null;
    }
  };
  // trạng thái chờ thanh toán
  static statusOrder1 = async (id_account) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const lastOrder = await OrderModel.findOne({
      ACCOUNT__ID: ID_ACCOUNT,
    }).sort({ _id: -1 });
    if (lastOrder) {
      const updateStatus = await OrderModel.updateOne(
        {
          _id: lastOrder.id,
        },
        {
          $set: {
            LIST_STATUS: {
              STATUS_NAME: "Chờ thanh toán",
              STATUS_CODE: 1,
              FROM_DATE: new Date(),
              TO_DATE: null,
            },
          },
        }
      );
      return updateStatus;
    }
  };
  // trạng thái đã thanh toán
  static statusOrder2 = async (id_account) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const lastOrder = await OrderModel.findOne({
      ACCOUNT__ID: ID_ACCOUNT,
    }).sort({ _id: -1 });
    if (lastOrder) {
      await OrderModel.updateOne(
        {
          _id: lastOrder._id,
          "LIST_STATUS.TO_DATE": null,
        },
        {
          $set: {
            "LIST_STATUS.$.TO_DATE": new Date(),
          },
        }
      );
      const updateStatus = await OrderModel.updateOne(
        {
          _id: lastOrder._id,
        },
        {
          $push: {
            LIST_STATUS: {
              STATUS_NAME: "Đã thanh toán",
              STATUS_CODE: 2,
              FROM_DATE: new Date(),
              TO_DATE: null,
            },
          },
        }
      );
      return updateStatus;
    }
  };
}

module.exports = OrderService;
