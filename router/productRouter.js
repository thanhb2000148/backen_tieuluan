const router = require("express").Router();
const productController = require('../controllers/productController');
const verify = require("../middleware/verifyToken");

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:id', productController.getProductsByCategory);
router.get('/search', productController.searchProducts);
router.post('/fashion', verify.verityToken, productController.createProductFashion);
router.post('/food', verify.verityToken, productController.createProductFood);
router.post('/phone', verify.verityToken, productController.createProductPhone);
router.put('/:id', verify.verityToken,productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
module.exports = router;