// router/uploadRouter.js
const express = require('express');
const router = express.Router();
const uploadCloud = require('../config/cloudinaryconfig'); // Sử dụng đúng tên tệp
const multer = require('multer');
const upload = require('../config/multer')
const imagesControllers = require('../controllers/imagesControllers');

// Định nghĩa route để upload ảnh
router.post('/', upload.single('image'), imagesControllers.uploadImages);

module.exports = router;
