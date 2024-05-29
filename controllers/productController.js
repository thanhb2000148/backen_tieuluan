const { date } = require("joi");
const ProductService = require("../services/product.service");
const { message } = require("../validation/addressValidator");

class ProductController {
    static getAllProducts = async (req, res) => {
        try {
            const products = await ProductService.getAllProducts(req.user.id);
            res.status(200).json({
                message: "Lấy tất cả sản phẩm thành công",
                success: true, data: products,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static getProductById = async (req, res) => {
        try {
            const product = await ProductService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }
            return res.status(200).json({
                message: 'Lấy sản phẩm thành công',
                success: true, data: product,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static createProduct = async (req, res) => {
        try {
            const savedProduct = await ProductService.createProduct(
                req.body.name,
                req.body.code,
                req.body.short_desc,
                req.body.desc_product,
                req.body.number_inventory_product,
                req.body.category_id,
                req.body.key,
                req.body.value,
                req.body.file_url,
                req.body.file_type,
                req.user.id
            );
            res.status(201).json({
                message: "Tạo sản phẩm thành công",
                success: true, data: savedProduct
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static updateProduct = async (req, res) => {
        try {
            const updatedProduct = await ProductService.updateProduct(
                req.params.id,
                req.body.name,
                req.body.code,
                req.body.short_desc,
                req.body.desc_product,
                req.body.number_inventory_product,
                req.body.category_id,
                req.body.key,
                req.body.value,
                req.user.id
            );
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Cập nhật sản phẩm không thành công' });
            }
            return res.status(200).json({
                message: "Cập nhật sản phẩm thành công!",
                success: true, data: updatedProduct,
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static deleteProduct = async (req, res) => {
        try {
            const deletedProduct = await ProductService.deleteProduct(req.params.id);
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Xóa sản phẩm không thành công' });
            }
            return res.status(200).json({
                message: "Xóa sản phẩm thành công!",
                product: deletedProduct,
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
module.exports = ProductController;
