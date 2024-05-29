const CartModel = require("../models/cart");
const ObjectId = require("mongoose").Types.ObjectId;
class CartService {
  static addCart = async (id_user, id_product) => {
    const ID_USER = new ObjectId(id_user);
    const ID_PRODUCT = new ObjectId(id_product);
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
  };
  static getCart = async (id_user) => {
    const ID_USER = new ObjectId(id_user);
    const getCart = await CartModel.aggregate([
      {
        $match: {
          USER_ID: ID_USER,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "LIST_PRODUCT.ID_PRODUCT",
          foreignField: "_id",
          as: "PRODUCT",
        },
      },
      {
        $unwind: {
          path: "$PRODUCT",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          LIST_PRODUCT: 0,
          LIST_PRODUCT_MAX_NUMBER: 0,
        },
      },
      {
        $replaceRoot: {
          newRoot: "$PRODUCT",
        },
      },
    ]);
    return getCart;
  };
}
module.exports = CartService;
