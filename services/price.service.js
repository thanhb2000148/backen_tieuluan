const PriceModel = require("../models/price");
const ObjectId = require("mongoose").Types.ObjectId;
class PriceService {
  static addPrice = async (id_product, price_number, key, value) => {
    const ID_PRODUCT = new ObjectId(id_product);
    let listMatchKey = [];
    if (key && value) {
      listMatchKey = {
        KEY: key,
        VALUE: value,
      };
    }
    const addPrice = await PriceModel.updateOne(
      {
        ID_PRODUCT: ID_PRODUCT,
        LIST_PRICE_MAX_NUMBER: {
          $lt: 100,
        },
      },
      {
        $push: {
          LIST_PRICE: {
            PRICE_NUMBER: price_number,
            FROM_DATE: new Date(),
            TO_DATE: null,
            LIST_MATCH_KEY: key && value ? [{ KEY: key, VALUE: value }] : [],
          },
        },
        $inc: {
          LIST_PRICE_MAX_NUMBER: 1,
        },
      },
      {
        upsert: true,
      }
    );
    return addPrice;
  };
  static getPrice = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const getALLPrice = PriceModel.aggregate([
      {
        $match: {
          ID_PRODUCT: ID_PRODUCT,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "ID_PRODUCT",
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
        $group: {
          _id: "$ID_PRODUCT",
          PRODUCT: {
            $addToSet: "$PRODUCT",
          },
          LIST_PRICE: {
            $push: "$LIST_PRICE",
          },
        },
      },
    ]);
    return getALLPrice;
  };
  static updatePrice = async (id_product, id_list_price, price_number) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const ID_LIST_PRICE = new ObjectId(id_list_price);
    const update = await PriceModel.updateOne(
      {
        ID_PRODUCT: ID_PRODUCT,
        LIST_PRICE: {
          $elemMatch: {
            TO_DATE: null,
            _id: ID_LIST_PRICE,
          },
        },
      },
      {
        $set: {
          "LIST_PRICE.$[element].PRICE_NUMBER": price_number,
          "LIST_PRICE.$[element].TO_DATE": new Date(),
        },
      },
      {
        arrayFilters: [
          {
            "element._id": ID_LIST_PRICE,
          },
        ],
      }
    );
    return update;
  };
  static getPriceProduct = async (id_product, key, value) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const getPrice = await PriceModel.aggregate([
      {
        $match: {
          ID_PRODUCT: ID_PRODUCT,
          "LIST_PRICE.LIST_MATCH_KEY.KEY": key,
          "LIST_PRICE.LIST_MATCH_KEY.VALUE": value,
        },
      },
      {
        $unwind: {
          path: "$LIST_PRICE",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$LIST_MATCH_KEY",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          ID_PRODUCT: 1,
          PRICE_NUMBER: "$LIST_PRICE.PRICE_NUMBER",
          FROM_DATE: "$LIST_PRICE.FROM_DATE",
          TO_DATE: "$LIST_PRICE.TO_DATE",
          KEY: "$LIST_MATCH_KEY.KEY",
        },
      },
    ]);
    return getPrice;
  };
  static getPriceWithoutKey = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const getPrice = await PriceModel.aggregate([
      {
        $match: {
          ID_PRODUCT: ID_PRODUCT,
          "LIST_PRICE.LIST_MATCH_KEY": { $size: 0 },
        },
      },
      {
        $project: {
          LIST_PRICE: {
            $filter: {
              input: "$LIST_PRICE",
              as: "price",
              cond: { $eq: ["$$price.LIST_MATCH_KEY", []] },
            },
          },
        },
      },
    ]);
    return getPrice;
  };
}
module.exports = PriceService;
