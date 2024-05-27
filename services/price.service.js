const PriceModel = require("../models/pirce");
const ObjectId = require("mongoose").Types.ObjectId;
class PriceService {
  static addPrice = async (id_product, price_number) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const newPrice = await PriceModel.create({
      ID_PRODUCT: ID_PRODUCT,
      LIST_PRICE: [
        {
          PRICE_NUMBER: price_number,
          FROM_DATE: new Date(),
          TO_DATE: null,
        },
      ],
    });
    return newPrice;
  };
  static deletePrice = async (id_product) => {};
}
module.exports = PriceService;
