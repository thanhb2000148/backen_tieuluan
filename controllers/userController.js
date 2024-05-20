const account = require("../models/account");
const user = require("../models/user");
const userController = {
  getAllUsers: async (req, res) => {
    try {
      const User = await account.find().populate("USER_ID");
      res.status(200).json(User);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
  getAUser: async (req, res) => {
    try {
      const User = await account.findById(req.params.id).populate("USER_ID");
      res.status(200).json(User);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const accountToDelete = await account.findByIdAndDelete(req.params.id);
      if (!accountToDelete) {
        return res.status(404).json({
          message: "account not found",
        });
      }
      if (accountToDelete.USER_ID) {
        await user.findByIdAndDelete(accountToDelete.USER_ID);
      }
      await account.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
};
module.exports = userController;
