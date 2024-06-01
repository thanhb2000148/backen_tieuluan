const account = require("../models/account");
const UserModel = require("../models/user");
const UserService = require("../services/user.service");
const userController = {
  getAllUsers: async (req, res) => {
    try {
      const User = await account.find().populate("USER_ID");
      res.status(200).json(User);
      console.log(req.user.id);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
  getLoginUser: async (req, res) => {
    try {
      const user = await UserService.getLoginUser(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ err: error.message });
    }
  },
};
module.exports = userController;
