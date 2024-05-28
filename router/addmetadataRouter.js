const express = require('express');
const router = express.Router();
const productMetaController = require('../controllers/productMetaController');


router.post('/phone/:id', productMetaController.addPhoneMetadata);
router.post('/food/:id', productMetaController.addFoodMetadata);
router.put('/:id/:metadataId', productMetaController.updateMetadata);
router.delete('/:id',productMetaController.deleteMetadata);
router.get('/',productMetaController.getAllMetadata);

module.exports = router;
