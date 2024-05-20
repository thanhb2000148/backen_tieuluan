const addressController = require("../controllers/addressController");
const router = require("express").Router();
router.get("/:id");
router.post("/:id", addressController.addAddress);
router.put("/:id", addressController.updateAddress);
router.delete("/:id");
module.exports = router;
