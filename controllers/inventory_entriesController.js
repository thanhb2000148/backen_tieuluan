const Inventory_EntriesService = require("../services/inventory_entries.service");
const InventoryController = {
  addInventory_Entries: async (req, res) => {
    try {
      const newInventory_Entries =
        await Inventory_EntriesService.addInventory_Entries(
          req.params.id,
          req.body.price,
          req.body.quantity,
          req.body.key,
          req.body.value,
          req.body.id_supplier,
          req.user.id
        );
      const quantity = newInventory_Entries.LIST_PRODUCT_CREATED[0].QUANTITY;
      const update = await Inventory_EntriesService.updateInventoryProduct(
        req.params.id,
        req.body.key,
        req.body.value,
        quantity
      );
      const updateInventoryProduct =
        await Inventory_EntriesService.updateNumberInventoryProduct(
          req.params.id
        );
      res.status(200).json({
        message: "Thêm thành công",
        success: true,
        data1: newInventory_Entries,
        data2: update,
        data3: updateInventoryProduct,
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
module.exports = InventoryController;
