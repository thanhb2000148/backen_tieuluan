const News = require('../models/new.js');
class NewsService {
    // Tạo bài viết mới
    static createNews = async (newsData) => {
        const news = new News(newsData);
        return await news.save();
    };
    // Lấy tất cả bài viết
    static getAllNews = async () => {
        return await News.find(); // Lấy tất cả tin tức từ cơ sở dữ liệu
    };
     // Lấy bài viết theo ID
    static getNewsById = async (id) => {
        return await News.findById(id); // Tìm bài viết theo ID
    };
    // Xóa bài viết theo ID
    static deleteNews = async (id) => {
        const deletedNews = await News.findByIdAndDelete(id); // Xóa bài viết theo ID
        return deletedNews; // Trả về bài viết đã bị xóa (hoặc null nếu không tìm thấy)
    };
     // Cập nhật bài viết theo ID
    static updateNews = async (id, newsData) => {
        return await News.findByIdAndUpdate(id, newsData, { new: true }); // Cập nhật bài viết và trả về phiên bản mới
    };
}
    


module.exports = NewsService;
