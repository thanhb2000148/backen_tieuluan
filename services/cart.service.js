const CartModel = require("../models/cart");
const PriceModel = require("../models/price");
const ObjectId = require("mongoose").Types.ObjectId;
class CartService {
  static addCart = async (id_user, id_product) => {
    const ID_USER = new ObjectId(id_user);
    const ID_PRODUCT = new ObjectId(id_product);
    const cart = await CartModel.findOne({
      USER_ID: ID_USER,
      LIST_PRODUCT: {
        $elemMatch: {
          ID_PRODUCT: ID_PRODUCT,
        },
      },
    });
    if (cart) {
      const updateCart = await CartModel.updateOne(
        {
          USER_ID: ID_USER,
          LIST_PRODUCT: {
            $elemMatch: {
              ID_PRODUCT: ID_PRODUCT,
            },
          },
        },
        {
          $inc: {
            "LIST_PRODUCT.$.QUANTITY": 1,
          },
        }
      );
      return updateCart;
    } else {
      const addCart = await CartModel.updateOne(
        {
          USER_ID: ID_USER,
          LIST_PRODUCT_MAX_NUMBER: {
            $lt: 3,
          },
        },
        {
          $push: {
            LIST_PRODUCT: {
              ID_PRODUCT: ID_PRODUCT,
              FROM_DATE: new Date(),
              TO_DATE: null,
              QUANTITY: 1,
              PRICE: 0,
            },
          },
          $inc: {
            LIST_PRODUCT_MAX_NUMBER: 1,
          },
        },
        {
          upsert: true,
        }
      );
      return addCart;
    }
  };
  static getCart = async (id_user) => {
    const ID_USER = new ObjectId(id_user);
    const getCart = await CartModel.aggregate([
      {
        $match: {
          USER_ID: ID_USER,
        },
      },
      // {
      //   $lookup: {
      //     from: "products",
      //     localField: "LIST_PRODUCT.ID_PRODUCT",
      //     foreignField: "_id",
      //     as: "PRODUCT",
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$PRODUCT",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // {
      //   $replaceRoot: {
      //     newRoot: "$PRODUCT",
      //   },
      // },
    ]);
    return getCart;
  };
  static getPriceProduct = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const getPrice = await PriceModel.aggregate([
      {
        $match: {
          ID_PRODUCT: ID_PRODUCT,
        },
      },
    ]);
    return getPrice;
  };
}
module.exports = CartService;
