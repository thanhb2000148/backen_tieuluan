const UserModel = require("../models/user");
const AccountModel = require("../models/account");
const ObjectId = require("mongoose").Types.ObjectId;
class UserService {
  static addUser = async (payload) => {
    const newUser = new UserModel(payload);
    await newUser.save();
    return newUser;
  };

  static addAccount = async (payload) => {
    const newAccount = new AccountModel(payload);
    await newAccount.save();
    return newAccount;
  };

  static addCodeActive = async (user_id, code, type, exp_seconds = 60) => {
    const USER_ID = new ObjectId(user_id);
    await AccountModel.findOneAndUpdate(
      {
        USER_ID: USER_ID,
      },
      {
        $push: {
          LIST_CODE_ACTIVE: {
            CODE: code,
            IS_USING: false,
            CREATED_AT: new Date(),
            TIME_USING: null,
            EXP_DATE: new Date(new Date().getTime() + exp_seconds * 1000),
            TYPE: type,
          },
        },
      }
    );
  };
  static addAddress = async (user_id, province, district, commune, desc) => {
    const USER_ID = new ObjectId(user_id);
    try {
      let result;
      const user = await UserModel.findById(USER_ID);
      if (user.LIST_ADDRES_USER.length === 0) {
        result = await UserModel.updateOne(
          {
            _id: USER_ID,
          },
          {
            $push: {
              LIST_ADDRES_USER: {
                PROVINCE: province,
                DISTRICT: district,
                COMMUNE: commune,
                DESC: desc,
                FROM_DATE: new Date(),
                TO_DATE: null,
                IS_DEFAULT: true,
              },
            },
          }
        );
      } else {
        result = await UserModel.updateOne(
          {
            _id: USER_ID,
          },
          {
            $push: {
              LIST_ADDRES_USER: {
                PROVINCE: province,
                DISTRICT: district,
                COMMUNE: commune,
                DESC: desc,
                FROM_DATE: new Date(),
                TO_DATE: null,
                IS_DEFAULT: false,
              },
            },
          }
        );
      }
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
      const update = UserModel.findByIdAndUpdate(
        {
          _id: USER_ID,
          "LIST_ADDRES_USER._id": ADDRESS_ID,
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
  static getAddress = async (user_id) => {
    const USER_ID = new ObjectId(user_id);
    try {
      const addressUser = await UserModel.findById(USER_ID);
      return addressUser.LIST_ADDRES_USER;
    } catch (error) {
      res.status(400).json(error);
    }
  };
  static deleteAddress = async (user_id, address_id) => {
    const USER_ID = new ObjectId(user_id);
    console.log(USER_ID);
    const ADDRESS_ID = new ObjectId(address_id);
    try {
      const updateResult = await UserModel.updateOne(
        {
          _id: USER_ID,
        },
        {
          $pull: { LIST_ADDRES_USER: { _id: ADDRESS_ID } },
        }
      );

      if (updateResult.length == 0) {
        throw new Error("không còn địa chỉ nào để xóa");
      }
      return { message: "xóa địa chỉ thành công" };
    } catch (error) {
      throw error;
    }
  };
}
module.exports = UserService;
