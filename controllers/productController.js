const { date } = require("joi");
const ProductService = require("../services/product.service");
const TypeProductModel = require("../models/type_product");
const { message, error } = require("../validation/productValidator");

const { productSchema } = require("../validation/productValidator");

class ProductController {
  static getProducts = async (req, res, next) => {
    try {
      const products = await ProductService.getProducts(
        // req.user.id,
        req.query.page,
        req.query.limit
      );
      res.status(200).json({
        message: "Lấy tất cả sản phẩm thành công",
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
    };
   static searchProducts = async (req, res) => {
    try {
      const { query, page, limit } = req.query;
      const products = await ProductService.searchProducts(query, page, limit);
      res.status(200).json({
        message: "Tìm kiếm sản phẩm thành công",
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false
      });
    }
  };
  static getProductsAll = async (req, res, next) => {
    try {
      const products = await ProductService.getProductsAll();
      res.status(200).json({
        message: "Lấy tất cả sản phẩm thành công",
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  static getProductById = async (req, res) => {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      return res.status(200).json({
        message: "Lấy sản phẩm thành công",
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static getProductsByCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      // console.log("Category ID:", categoryId);
      const products = await ProductService.getProductsByCategory(categoryId);
      if (!products || products.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm nào cho danh mục này" });
      }
      return res.status(200).json({
        message: "Lấy sản phẩm theo danh mục thành công",
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  //api số lượng các sản phẩm hiện có
  static getTotalProducts = async (req, res) => {
    try {
      const totalProducts = await ProductService.getTotalProducts();
      res.status(200).json({
        message: "Lấy tổng số sản phẩm thành công",
        success: true,
        total: totalProducts,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy tổng số sản phẩm.",
        error: error.message,
        success: false,
      });
    }
  };
// product.controller.js
static updateProduct = async (req, res) => {
  try {
    const updateData = req.body; // Lấy tất cả dữ liệu từ request body
    console.log("Cập nhật sản phẩm với ID:", req.params.id);
console.log("Dữ liệu cập nhật:", JSON.stringify(updateData, null, 2));

    // Kiểm tra xem có trường nào để cập nhật không
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Không có trường nào để cập nhật" });
    }

    const updatedProduct = await ProductService.updateProduct(req.params.id, updateData);
    
    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    console.log("Cập nhật sản phẩm thành công:", updatedProduct); // Log thông tin sản phẩm

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Lỗi trong controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};




  // Thời Trang
  static createProductFashion = async (req, res) => {
    try {
      const { error } = productSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const {
        name,
        code,
        short_desc,
        desc_product,
        category_id,
        size,
        color,
        file_attachments,
        file_attachmentsdefault,
        number_inventory_product,
        quantity_by_key_value,
      } = req.body;

      const metadata = {
        sizes: size,
        colors: color,
      };
      const savedProduct = await ProductService.createProductFashion(
        name,
        code,
        short_desc,
        desc_product,
        category_id,
        metadata,
        file_attachments,
        file_attachmentsdefault,
        // number_inventory_product,
        // quantity_by_key_value,
        req.user.id
      );
      res.status(201).json({
        message: "Tạo sản phẩm thành công",
        success: true,
        product: savedProduct,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  // // Thức Ăn
  // static createProductFood = async (req, res) => {
  //   try {
  //     const { error } = productSchema.validate(req.body);
  //     if (error) {
  //       return res.status(400).json({ message: error.details[0].message });
  //     }
  //     const {
  //       name,
  //       code,
  //       short_desc,
  //       desc_product,
  //       category_id,
  //       size,
  //       type,
  //       file_attachments,
  //       file_attachmentsdefault,
  //       quantity_by_key_value,
  //     } = req.body;
  //     const metadata = {
  //       sizes: size,
  //       types: type,
  //     };
  //     const savedProduct = await ProductService.createProductfood(
  //       name,
  //       code,
  //       short_desc,
  //       desc_product,
  //       category_id,
  //       metadata,
  //       file_attachments,
  //       file_attachmentsdefault,
  //       // quantity_by_key_value,
  //       req.user.id
  //     );
  //     res.status(201).json({
  //       message: "Tạo sản phẩm thành công",
  //       success: true,
  //       data: savedProduct,
  //     });
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  // };
  // // Điện Thoại
  // static createProductEarphone = async (req, res) => {
  //   try {
  //     const { error } = productSchema.validate(req.body);
  //     if (error) {
  //       return res.status(400).json({ message: error.details[0].message });
  //     }
  //     const {
  //       name,
  //       code,
  //       short_desc,
  //       desc_product,
  //       category_id,
  //       color,
  //       memory,
  //       file_attachments,
  //       file_attachmentsdefault,
  //     } = req.body;
  //       const metadata = {
  //       memorys: memory,
  //       colors: color,
  //     };
  //     const savedProduct = await ProductService.createProductEarphone(
  //       name,
  //       code,
  //       short_desc,
  //       desc_product,
  //       category_id,
  //       metadata,
  //       file_attachments,
  //       file_attachmentsdefault,
  //       req.user.id
  //     );
  //     res.status(201).json({
  //       message: "Tạo sản phẩm thành công",
  //       success: true,
  //       data: savedProduct,
  //     });
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  //   };

  //   static createProductPhone = async (req, res) => {
  //   try {
  //     const { error } = productSchema.validate(req.body);
  //     if (error) {
  //       return res.status(400).json({ message: error.details[0].message });
  //     }
  //     const {
  //       name,
  //       code,
  //       short_desc,
  //       desc_product,
  //       category_id,
  //       memory,
  //       color,
  //       file_attachments,
  //       file_attachmentsdefault,
  //       quantity_by_key_value,
  //     } = req.body;
  //     const metadata = {
  //       memorys: memory,
  //       colors: color,
  //     };
  //     const savedProduct = await ProductService.createProductphone(
  //       name,
  //       code,
  //       short_desc,
  //       desc_product,
  //       category_id,
  //       metadata,
  //       file_attachments,
  //       file_attachmentsdefault,
  //       req.user.id
  //     );
  //     res.status(201).json({
  //       message: "Tạo sản phẩm thành công",
  //       success: true,
  //       data: savedProduct,
  //     });
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  // };

  
  static deleteProduct = async (req, res) => {
    try {
      const deletedProduct = await ProductService.deleteProduct(req.params.id);
      if (!deletedProduct) {
        return res
          .status(404)
          .json({ message: "Xóa sản phẩm không thành công" });
      }
      return res.status(200).json({
        message: "Xóa sản phẩm thành công!",
        success: true,
        product: deletedProduct,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  //lay san pham không bị xóa
  static getActiveProducts = async (req, res) => {
    try {
      const activeProducts = await ProductService.getActiveProducts();
      return res.status(200).json({
        message: "Lấy danh sách sản phẩm thành công!",
        success: true,
        products: activeProducts,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  

  static getAllTypeProducts = async (req, res) => {
    try {
      const type_Products = await TypeProductModel.find();
      res.status(200).json({
        message: "Lấy tất cả loại sản phẩm thành công",
        success: true,
        data: type_Products,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  //xóa ảnh sản phẩm
  static deleteImageFromProduct = async (req, res) => {
  try {
    const { productId, imageId } = req.params;

    const updatedProduct = await ProductService.deleteImageFromProduct(productId, imageId);

    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm hoặc ảnh để xóa" });
    }

    return res.status(200).json({
      message: "Xóa ảnh thành công!",
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    }
  };
  static getProductsCountByCategory = async (req, res) => {
    try {
        const categoryCounts = await ProductService.getProductsCountByCategory();
        res.status(200).json({
            message: "Lấy số lượng sản phẩm theo danh mục thành công",
            success: true,
            data: categoryCounts,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};



}

module.exports = ProductController;
