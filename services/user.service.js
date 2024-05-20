const UserModel = require("../models/user");
const AccountModel = require("../models/account");
const ObjectId = require("mongoose").Types.ObjectId;
class UserService {
  static addUser = async (payload) => {
    const newUser = new UserModel(payload);
    return newUser;
  };

  static addAccount = async (payload) => {
    const newAccount = new AccountModel(payload);
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
                TO_DATE: new Date(),
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
                TO_DATE: new Date(),
                IS_DEFAULT: false,
              },
            },
          }
        );
      }
      return user;
    } catch (error) {
      res.status(400).json(error);
    }
  };
  static updateAddress = async (
    address_id,
    province,
    district,
    commune,
    desc
  ) => {
    try {
      const ADDRESS_ID = new ObjectId(address_id);
      const update = UserModel.findByIdAndUpdate(
        {
          _id: ADDRESS_ID,
        },
        {
          $push: {
            LIST_ADDRES_USER: {
              PROVINCE: province,
              DISTRICT: district,
              COMMUNE: commune,
              DESC: desc,
              TO_DATE: new Date(),
            },
          },
        }
      );
      return update;
    } catch (error) {
      res.status(400).json(error);
    }
  };
}
module.exports = UserService;
