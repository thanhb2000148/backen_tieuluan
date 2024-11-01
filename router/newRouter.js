const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newController');

// Định nghĩa các endpoint
router.post('/', newsController.createNews); // Tạo bài viết mới
// Route để lấy tất cả tin tức
router.get('/', newsController.getAllNews);
// Route để lấy bài viết theo ID
router.get('/news/:id', newsController.getNewsById);
router.delete('/news/:id', newsController.deleteNews); // Đảm bảo đường dẫn khớp với ID
router.put('/news/:id', newsController.updateNews);

module.exports = router;




