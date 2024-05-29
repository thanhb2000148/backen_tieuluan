const router = require("express").Router();
const productController = require('../controllers/productController');
const verify = require("../middleware/verifyToken");

router.get('/',verify.verityToken, productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/',verify.verityToken, productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
