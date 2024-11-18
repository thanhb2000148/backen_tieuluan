const express = require('express');
const FavoriteController = require('../controllers/favoriteController');
const verify = require("../middleware/verifyToken");
const router = express.Router();


router.get('/',verify.verityToken, FavoriteController.getAllFavorites);
// Lấy danh sách sản phẩm yêu thích theo USER_ID
router.get('/user/:userId',verify.verityToken,FavoriteController.getFavoritesByUserId);
// Thêm sản phẩm vào danh sách yêu thích
router.post('/',verify.verityToken, FavoriteController.addFavorite);
// Xóa sản phẩm yêu thích
router.delete('/user/:userId/:productId', FavoriteController.removeFavorite);


module.exports = router;
