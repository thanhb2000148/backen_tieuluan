const UserService = require("../services/user.service");
const addressController = {
  addAddress: async (req, res, next) => {
    try {
      const addAddress = await UserService.addAddress(
        req.user.id_user,
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
      const addAddress = await UserService.updateAddress({
        address_id: req.params.id,
        user_id: req.user.id,
        province: req.body.provide,
        district: req.body.district,
        commune: req.body.commune,
        desc: req.body.desc,
      });
      res.status(200).json(addAddress);
    } catch (error) {
      res.status(400).json(error);
    }
  },
  getAddress: async (req, res, next) => {
    try {
      const getAddressUser = await UserService.getAddress(req.user.id_user);
      res.status(200).json(getAddressUser);
    } catch (error) {
      res.status(400).json(error);
    }
  },
};
module.exports = addressController;
