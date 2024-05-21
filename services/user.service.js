const UserModel = require("../models/user");
const AccountModel = require("../models/account");
const AddressModel = require("../models/address");
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
}
module.exports = UserService;
