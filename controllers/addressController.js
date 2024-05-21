const AddressService = require("../services/address.services");
const addressController = {
  addAddress: async (req, res, next) => {
    try {
      const addAddress = await AddressService.addAddress(
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
      const addAddress = await AddressService.updateAddress({
        address_id: req.params.id,
        user_id: req.user.id_user,
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
      const getAddressUser = await AddressService.getAddress(
        req.user.id_user,
        req.query.page,
        req.query.limit
      );
      res.status(200).json(getAddressUser);
    } catch (error) {
      res.status(400).json(error);
    }
  },
  deleteAddress: async (req, res, next) => {
    try {
      await AddressService.deleteAddress(req.user.id_user, req.params.id);
      res.status(200).json("xóa thành công");
    } catch (error) {
      res.status(400).json(error);
    }
  },
};
module.exports = addressController;
