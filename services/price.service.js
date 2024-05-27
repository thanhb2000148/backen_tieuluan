const PriceModel = require("../models/pirce");
const ObjectId = require("mongoose").Types.ObjectId;
class PriceService {
  static addPrice = async (payload) => {
    const newPrice = new PriceModel(payload);
    await newPrice.save();
    return newPrice;
  };
}
module.exports = PriceService;
