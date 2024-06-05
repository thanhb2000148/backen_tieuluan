const Inventory_EntriesService = require("../services/inventory_entries.service");
const InventoryController = {
  addInventory_Entries: async (req, res) => {
    try {
      const newInventory_Entries =
        await Inventory_EntriesService.addInventory_Entries();
      res.status(200).json({
        message: "Thêm thành công",
        success: true,
        data: newInventory_Entries,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false,
        data: null,
      });
    }
  },
};
