const newsService = require('../services/new.services');

class NewController {
    // Tạo bài viết mới
    static createNews = async (req, res) => {
        try {
            const newsData = req.body; // Dữ liệu bài viết từ client
            const newArticle = await newsService.createNews(newsData);
            res.status(201).json({
                message: "Tạo bài viết thành công!", // Thông báo thành công
                success: true,
                article: newArticle // Trả về bài viết mới với status 201
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Lấy tất cả bài viết
    static getAllNews = async (req, res) => {
        try {
            const articles = await newsService.getAllNews(); // Gọi service để lấy bài viết
            const totalArticlesCount = articles.length; // Tính tổng số bài viết

            res.status(200).json({
                message: "Lấy tất cả bài viết thành công!", // Thông báo thành công
                success: true,
                totalArticlesCount: totalArticlesCount, // Tổng số lượng bài viết
                articles: articles // Trả về danh sách bài viết
            });
        } catch (error) {
            res.status(500).json({ message: error.message }); // Bắt lỗi
        }
    };

    // Lấy bài viết theo ID
    static getNewsById = async (req, res) => {
        try {
            const { id } = req.params; // Lấy ID từ tham số URL
            const article = await newsService.getNewsById(id); // Gọi service để lấy bài viết theo ID
            
            if (!article) {
                return res.status(404).json({ message: "Bài viết không tồn tại!" });
            }

            res.status(200).json({
                message: "Lấy bài viết thành công!", // Thông báo thành công
                success: true,
                article: article // Trả về bài viết
            });
        } catch (error) {
            res.status(500).json({ message: error.message }); // Bắt lỗi
        }
    };
    // Xóa bài viết theo ID
    static deleteNews = async (req, res) => {
        try {
            const { id } = req.params; // Lấy ID từ tham số URL
            const deletedArticle = await newsService.deleteNews(id); // Gọi service để xóa bài viết

            if (!deletedArticle) {
                return res.status(404).json({ message: "Bài viết không tồn tại!" });
            }

            res.status(200).json({
                message: "Xóa bài viết thành công!", // Thông báo thành công
                success: true,
            });
        } catch (error) {
            res.status(500).json({ message: error.message }); // Bắt lỗi
        }
    };
    // Cập nhật bài viết theo ID
    static updateNews = async (req, res) => {
        try {
            const { id } = req.params; // Lấy ID từ tham số URL
            const newsData = req.body; // Dữ liệu bài viết mới từ client

            const updatedArticle = await newsService.updateNews(id, newsData); // Gọi service để cập nhật bài viết

            if (!updatedArticle) {
                return res.status(404).json({ message: "Bài viết không tồn tại!" });
            }

            res.status(200).json({
                message: "Cập nhật bài viết thành công!", // Thông báo thành công
                success: true,
                article: updatedArticle // Trả về bài viết đã cập nhật
            });
        } catch (error) {
            res.status(400).json({ message: error.message }); // Bắt lỗi
        }
    };
}

module.exports = NewController;
