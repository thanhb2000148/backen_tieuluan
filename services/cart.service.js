const CartModel = require("../models/cart");
const PriceModel = require("../models/price");
const ObjectId = require("mongoose").Types.ObjectId;
const PriceService = require("../services/price.service");
class CartService {
  static addCart = async (id_user, id_product, key, value) => {
    const ID_USER = new ObjectId(id_user);
    const ID_PRODUCT = new ObjectId(id_product);
    const getPrice = await PriceService.getPriceProduct(id_product, key, value);
    console.log(getPrice[0].PRICE_NUMBER);
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
            $lt: 10,
          },
        },
        {
          $push: {
            LIST_PRODUCT: {
              ID_PRODUCT: ID_PRODUCT,
              FROM_DATE: new Date(),
              TO_DATE: null,
              QUANTITY: 1,
              PRICE: getPrice[0].PRICE_NUMBER,
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
  static getCart = async (id_user, page, limit) => {
    page = Number(page);
    limit = Number(limit);
    const ID_USER = new ObjectId(id_user);
    const getCart = await CartModel.aggregate([
      {
        $match: {
          USER_ID: ID_USER,
        },
      },
      { $unwind: "$LIST_PRODUCT" },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          LIST_PRODUCT_MAX_NUMBER: 0,
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
          _id: 1,
          USER_ID: 1,
          ITEM: {
            $mergeObjects: [
              "$LIST_PRODUCT",
              {
                PRODUCT_DETAILS: "$PRODUCT",
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          USER_ID: { $first: "$USER_ID" },
          ITEMS: { $push: "$ITEM" },
        },
      },
    ]);
    return getCart;
  };
  static updateCart = async (id_user, id_product, body) => {
    const ID_USER = new ObjectId(id_user);
    const ID_PRODUCT = new ObjectId(id_product);
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
        $set: {
          "LIST_PRODUCT.$.QUANTITY": body,
        },
      }
    );
    return updateCart;
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
