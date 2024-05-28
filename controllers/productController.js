const ProductModel = require("../models/product");
const category = require('../models/category');
const type_product = require("../models/type_product");
const product = require("../models/product");
class ProductController {
    static getAllProducts = async (req, res) => {
        try {
            const products = await ProductModel.find({}).populate("CATEGORY_ID");
            const type_products = await type_product.find();
            res.status(200).json({ products,type_products });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static getProductByid = async (req, res) => {
        try {
            const product = await ProductModel.findById(req.params.id).populate("CATEGORY_ID");
            if (!product) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }
            return res.status(400).json({
                message: 'Lấy sản phẩm thành công',
                product: product,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static createProduct = async (req, res) => {
        try {
            const product = new ProductModel(req.body);
            product.CREATED_AT = new Date();
            product.UPDATED_AT = new Date();
            await product.save();
             const savedProduct = await ProductModel.findById(product._id).populate("CATEGORY_ID");
            res.status(201).json(savedProduct);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static updateProduct = async (req, res) => {
        try {
            const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!product) {
                return res.status(404).json({ message: 'update không thành công' });
            }
             return res.status(200).json({
                message: "Cập nhập sản phẫm thành công!",
                product: product,// trả về dl vừa xóa
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static deleteProduct = async (req, res) => {
        try {
            const product = await ProductModel.findByIdAndDelete(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Xóa thất bại' });
            }
             return res.status(200).json({
                message: "Xoá sản phẫm thành công!",
                product: product,// trả về dl vừa xóa
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
   static getAllTYPE_PRODUCT = async (req, res) => {
    try {
        const typeProducts = await type_product.find();
        res.status(200).json(typeProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
}


module.exports = ProductController;
