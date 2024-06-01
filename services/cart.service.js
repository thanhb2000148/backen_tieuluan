const { json } = require("express");
const CartModel = require("../models/cart");
const PriceModel = require("../models/price");
const ObjectId = require("mongoose").Types.ObjectId;
const PriceService = require("../services/price.service");
const { message } = require("../validation/addressValidator");
class CartService {
  static addCart = async (id_user, id_product, key, value) => {
    const ID_USER = new ObjectId(id_user);
    const ID_PRODUCT = new ObjectId(id_product);
    const getPrice = await PriceService.getPriceProduct(id_product, key, value);
    const cart = await CartModel.findOne({
      USER_ID: ID_USER,
      LIST_PRODUCT: {
        $elemMatch: {
          ID_PRODUCT: ID_PRODUCT,
        },
      },
      "LIST_PRODUCT.LIST_MATCH_KEY": {
        $elemMatch: {
          KEY: key,
          VALUE: value,
        },
      },
    });
    if (cart) {
      const updateCart = await CartModel.updateOne(
        {
          USER_ID: ID_USER,
          "LIST_PRODUCT.ID_PRODUCT": ID_PRODUCT,
          "LIST_PRODUCT.LIST_MATCH_KEY": {
            $elemMatch: {
              KEY: key,
              VALUE: value,
            },
          },
        },
        {
          $inc: {
            "LIST_PRODUCT.$[element].QUANTITY": 1,
          },
        },
        {
          arrayFilters: [
            {
              "element.ID_PRODUCT": ID_PRODUCT,
              "element.LIST_MATCH_KEY": {
                $elemMatch: {
                  KEY: key,
                  VALUE: value,
                },
              },
            },
          ],
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
              LIST_MATCH_KEY: { KEY: key, VALUE: value },
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
      {
        $project: {
          LIST_PRODUCT: {
            $filter: {
              input: "$LIST_PRODUCT",
              as: "product",
              cond: {
                $eq: ["$$product.TO_DATE", null],
              },
            },
          },
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          LIST_PRODUCT_MAX_NUMBER: 0,
        },
      },
      {
        $unwind: {
          path: "$LIST_PRODUCT",
          preserveNullAndEmptyArrays: true,
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
        $project: {
          "ITEM._id": 0,
          "ITEM.PRODUCT_DETAILS._id": 0,
          "ITEM.PRODUCT_DETAILS.LIST_PRODUCT_METADATA": 0,
        },
      },
    ]);
    return getCart;
  };
  static getAllCart = async (id_user) => {
    const ID_USER = new ObjectId(id_user);
    const getCart = await CartModel.aggregate([
      {
        $match: {
          USER_ID: ID_USER,
          "LIST_PRODUCT.TO_DATE": null,
        },
      },
      { $unwind: "$LIST_PRODUCT" },
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
      {
        $project: {
          "ITEMS.LIST_MATCH_KEY": 0,
          "ITEMS.PRODUCT_DETAILS.LIST_PRODUCT_METADATA": 0,
        },
      },
    ]);
    return getCart;
  };
  static getPriceCart = async (id_user) => {
    const ID_USER = new ObjectId(id_user);
    const getCart = await CartModel.aggregate([
      {
        $match: {
          USER_ID: ID_USER,
        },
      },
      {
        $project: {
          LIST_PRODUCT_MAX_NUMBER: 0,
          _id: 0,
          "LIST_PRODUCT.ID_PRODUCT": 0,
          "LIST_PRODUCT.FROM_DATE": 0,
          "LIST_PRODUCT.TO_DATE": 0,
          "LIST_PRODUCT.LIST_MATCH_KEY": 0,
        },
      },
      {
        $unwind: "$LIST_PRODUCT",
      },
    ]);
    let totalCart = 0;
    getCart.forEach((item) => {
      totalCart =
        totalCart + item.LIST_PRODUCT.QUANTITY * item.LIST_PRODUCT.PRICE;
    });
    return totalCart;
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
  static deleteAllCart = async (id_user) => {
    const ID_USER = new ObjectId(id_user);
    const deleteAllCart = await CartModel.updateMany(
      {
        USER_ID: ID_USER,
      },
      {
        $set: {
          "LIST_PRODUCT.$[elem].TO_DATE": new Date(),
        },
      },
      {
        arrayFilters: [{ elem: { $exists: true } }],
      }
    );
    return deleteAllCart;
  };
}
module.exports = CartService;
