const FavoriteService = require("../services/favoriteService"); // Import service

class FavoriteController {
   // Thêm sản phẩm vào danh sách yêu thích
        static addFavorite = async (req, res) => {
            const { productId } = req.body; // Lấy productId từ request body
            const userId = req.user.id; // Giả định bạn có user ID từ token hoặc session

            // Kiểm tra xem productId có tồn tại hay không
            if (!productId) {
                return res.status(400).json({ error: "productId là bắt buộc." });
            }

            try {
                const favorite = await FavoriteService.addFavorite(userId, productId);

                // Lấy thông tin sản phẩm vừa được thêm vào yêu thích
                const product = await FavoriteService.getProductById(productId);
                if (!product) {
                    return res.status(404).json({ error: "Sản phẩm không tồn tại." });
                }

                res.status(201).json({
                    message: "Thêm sản phẩm vào danh sách yêu thích thành công",
                    success: true,
                    favorite: favorite,
                    product: product, // Trả về thông tin sản phẩm
                });
            } catch (error) {
                // Phân loại lỗi để trả về mã trạng thái phù hợp
                if (error.message === "Sản phẩm đã được yêu thích.") {
                    return res.status(409).json({ error: error.message }); // Conflict
                }
                res.status(500).json({ error: "Có lỗi xảy ra. Vui lòng thử lại." }); // Internal Server Error
            }
        };
         // Lấy tất cả sản phẩm yêu thích
    static getAllFavorites = async (req, res) => {
        try {
            const favorites = await FavoriteService.getAllFavorites();
            res.status(200).json({
                message: "Lấy danh sách sản phẩm yêu thích thành công",
                success: true,
                data: favorites,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

 // Lấy danh sách sản phẩm yêu thích theo userId
static getFavoritesByUserId = async (req, res) => {
    const userId = req.params.userId; // Lấy userId từ tham số đường dẫn
    if (!userId) {
        return res.status(400).json({ error: "userId là bắt buộc." });
    }

    try {
        // Lấy danh sách sản phẩm yêu thích theo userId
        const favorites = await FavoriteService.getFavoritesByUserId(userId);
        res.status(200).json({
            message: "Lấy danh sách sản phẩm yêu thích thành công",
            success: true,
            data: favorites,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Xóa sản phẩm yêu thích
    static removeFavorite = async (req, res) => {
        const userId = req.params.userId; // Lấy userId từ URL
        const productId = req.params.productId; // Lấy productId từ URL

        try {
            const result = await FavoriteService.removeFavorite(userId, productId);
            res.status(200).json({
                message: "Xóa sản phẩm yêu thích thành công",
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

}

module.exports = FavoriteController;
