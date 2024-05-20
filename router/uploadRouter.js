// router/uploadRouter.js
const express = require('express');
const router = express.Router();
const uploadCloud = require('../config/cloudinaryconfig'); // Sử dụng đúng tên tệp
const imagesControllers = require('../controllers/imagesControllers');

// Định nghĩa route để upload ảnh
router.post('/', uploadCloud.array('images', 10), imagesControllers.uploadImages);

module.exports = router;
