const AddressModel = require("../models/address");
const ObjectId = require("mongoose").Types.ObjectId;
class AddressService {
  static addAddress = async (user_id, province, district, commune, desc) => {
    const USER_ID = new ObjectId(user_id);
    try {
      let result;
      const checkFirstAddress = AddressModel.findOne(
        {
          USER_ID: USER_ID,
          LIST_ADDRESS: {
            $elemMatch: {
              TO_DATE: null,
            },
          },
        },
        { USER_ID: 1 }
      );
      result = await AddressModel.updateOne(
        {
          USER_ID: USER_ID,
          LIST_ADDRESS_MAX_NUMBER: {
            $lt: 500,
          },
        },
        {
          $push: {
            LIST_ADDRESS: {
              PROVINCE: province,
              DISTRICT: district,
              COMMUNE: commune,
              DESC: desc,
              FROM_DATE: new Date(),
              TO_DATE: null,
              IS_DEFAULT: checkFirstAddress ? true : false,
            },
          },
          $inc: {
            LIST_ADDRESS_MAX_NUMBER: 1,
          },
        },
        {
          upsert: true,
        }
      );
      return result;
    } catch (error) {
      res.status(400).json(error);
    }
  };
  static updateAddress = async ({
    address_id,
    user_id,
    province,
    district,
    commune,
    desc,
  }) => {
    try {
      const ADDRESS_ID = new ObjectId(address_id);
      const USER_ID = new ObjectId(user_id);
      const update = await AddressModel.findByIdAndUpdate(
        {
          USER_ID: USER_ID,
        },
        {
          $set: {
            "LIST_ADDRES_USER.$[element].PROVINCE": province,
            "LIST_ADDRES_USER.$[element].DISTRICT": district,
            "LIST_ADDRES_USER.$[element].COMMUNE": commune,
            "LIST_ADDRES_USER.$[element].DESC": desc,
          },
        },
        {
          new: true,
          arrayFilters: [
            {
              "element._id": ADDRESS_ID,
              "element.TO_DATE": null,
            },
          ],
        }
      );
      return update;
    } catch (error) {
      res.status(400).json(error);
    }
  };
  static getAddress = async (user_id, page, limit) => {
    page = Number(page);
    limit = Number(limit);
    const USER_ID = new ObjectId(user_id);
    try {
      const addressUser = await AddressModel.aggregate([
        {
          $match: {
            USER_ID: USER_ID,
          },
        },
        { $unwind: "$LIST_ADDRESS" },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $group: {
            _id: "$USER_ID",
            LIST_ADDRESS_USER: {
              $push: "$LIST_ADDRESS",
            },
          },
        },
        { $unwind: "$LIST_ADDRESS_USER" },
        {
          $match: {
            "LIST_ADDRESS_USER.TO_DATE": null,
          },
        },
        {
          $replaceRoot: {
            newRoot: "$LIST_ADDRESS_USER",
          },
        },
      ]);
      return addressUser;
    } catch (error) {
      console.error(error);
      res.status(400).json(error);
    }
  };
  static deleteAddress = async (user_id, address_id) => {
    const USER_ID = new ObjectId(user_id);
    console.log(USER_ID);
    const ADDRESS_ID = new ObjectId(address_id);
    try {
      const updateResult = await AddressModel.updateOne(
        {
          USER_ID: USER_ID,
          LIST_ADDRESS: {
            $elemMatch: {
              _id: ADDRESS_ID,
            },
          },
        },
        {
          $set: { "LIST_ADDRESS.$[element].TO_DATE": new Date() },
        },
        {
          arrayFilters: [
            {
              "element._id": ADDRESS_ID,
            },
          ],
        }
      );

      if (updateResult.length == 0) {
        throw new Error("không còn địa chỉ nào để xóa");
      }
      return { message: "xóa địa chỉ thành công" };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
module.exports = AddressService;