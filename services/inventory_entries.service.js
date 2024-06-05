const inventory_entriesModel = require("../models/inventory_entries");

class Inventory_EntriesService {
  static addInventory_Entries = async (payload) => {
    const newInventory_Entries = new inventory_entriesModel(payload);
    await newInventory_Entries.save();
    return newInventory_Entries;
  };
  static getInventory_Entries = async () => {
    const getInventory_Entries = await inventory_entriesModel.find();
    return getInventory_Entries;
  };
  static getInventory_EntriesById = async (id) => {
    const getInventory_Entries = await inventory_entriesModel.findById(id);
    return getInventory_Entries;
  };
  static updateInventory_Entries = async (id, payload) => {};
  static deleteInventory_Entries = async (id) => {};
}
module.exports = Inventory_EntriesService;
