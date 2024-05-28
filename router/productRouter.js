const router = require("express").Router();
const productController = require('../controllers/productController');
const type_product = require("../models/type_product");


router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductByid);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/type_product', productController.getAllTYPE_PRODUCT);


module.exports = router;
