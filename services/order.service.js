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

      const ListProduct = ListProductData.map((cart) =>
        cart.ITEMS.map((item) => ({
          ID_PRODUCT: item.ID_PRODUCT,
          FROM_DATE: item.FROM_DATE,
          TO_DATE: item.TO_DATE,
          UNITPRICES: item.PRICE,
          QLT: item.QUANTITY,
        }))
      ).flat();
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
      return null; // Không tìm thấy bản ghi nào có ORDER_CODE là null
    }
  };
  static updateStatusCOD = async (orderCode, payment_method) => {
    // Tìm bản ghi cuối cùng có ORDER_CODE là null
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
}

module.exports = OrderService;
