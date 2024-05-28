const router = require("express").Router();
const priceController = require("../controllers/priceController");
router.post("/:id", priceController.addPrice);
router.get("/:id", priceController.getPrice);
router.put("/:id_product/:id_list_price", priceController.updatePrice);
module.exports = router;
