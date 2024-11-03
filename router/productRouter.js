const router = require("express").Router();
const productController = require("../controllers/productController");
const verify = require("../middleware/verifyToken");
//các  router  sản phẩm
router.get('/', productController.getProducts);
// Route để lấy danh sách sản phẩm không bị xóa
router.get('/delete_true', productController.getActiveProducts);
router.get("/deleted-co", productController.getDeletedProducts);

router.get('/search', productController.searchProducts);
router.get("/getAll", productController.getProductsAll);
router.get("/products/count", productController.getTotalProducts);
// Thêm route cho việc lấy số lượng sản phẩm theo danh mục
router.get('/category-count', productController.getProductsCountByCategory);
router.get('/:id', productController.getProductById);
// Route cập nhật trạng thái IS_DELETED
router.put('/:id/delete', productController.updateDeletedStatus);
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

