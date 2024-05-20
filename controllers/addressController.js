const UserService = require("../services/user.service");
const addressController = {
  addAddress: async (req, res, next) => {
    try {
      const addAddress = await UserService.addAddress(
        req.params.id,
        req.body.provide,
        req.body.district,
        req.body.commune,
        req.body.desc
      );
      res.status(200).json(addAddress);
    } catch (error) {
      res.status(400).json(error);
    }
  },
  updateAddress: async (req, res, next) => {
    try {
      const addAddress = await UserService.updateAddress(
        req.params.id,
        req.body.provide,
        req.body.district,
        req.body.commune,
        req.body.desc
      );
      res.status(200).json(addAddress);
    } catch (error) {
      res.status(400).json(error);
    }
  },
};
module.exports = addressController;
