const router = require("express").Router();
const priceController = require("../controllers/priceController");
router.post("/", priceController.addPrice);
module.exports = router;
