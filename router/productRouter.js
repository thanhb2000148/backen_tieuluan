const router = require("express").Router();
const productController = require("../controllers/productController");
const verify = require("../middleware/verifyToken");
//các  router  sản phẩm
router.get('/', productController.getProducts);
// Route để lấy danh sách sản phẩm không bị xóa
router.get('/delete_true', productController.getActiveProducts);
router.get('/search', productController.searchProducts);
router.get("/getAll", productController.getProductsAll);
router.get("/products/count", productController.getTotalProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:id', productController.getProductsByCategory);
router.post('/fashion', verify.verityToken, productController.createProductFashion);
// router.post('/food', verify.verityToken, productController.createProductFood);
// router.post('/phone', verify.verityToken, productController.createProductPhone);
// router.post('/earphone', verify.verityToken, productController.createProductEarphone);
router.put('/:id', verify.verityToken,productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
//xóa ảnh
router.delete('/:productId/images/:imageId', productController.deleteImageFromProduct);

module.exports = router;

