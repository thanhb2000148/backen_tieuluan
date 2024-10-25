const { date } = require("joi");
const ProductModel = require("../models/product");
const category = require("../models/category");
const { $_match } = require("../validation/addressValidator");
const ObjectId = require("mongoose").Types.ObjectId;
const TypeProductModel = require("../models/type_product");
// const ImagesService = require("../services/images.services");
const { image } = require("../config/cloudinaryconfig");
// const path = require("path");
const { json, text } = require("express");
const PriceModel = require("../models/price");

class ProductService {
  static getProducts = async (page = 1, limit = 10) => {
    page = Number(page);
    limit = Number(limit);
    const getProduct = await ProductModel.aggregate([
      {
        $match: {
          IS_DELETED: false,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          IS_DELETED: 0,
        },
      },
    ]);
    return getProduct;
  };
  
  static getProductsAll = async () => {
    const getProduct = await ProductModel.aggregate([
      {
        $match: {
          IS_DELETED: false,
        },
      },
      {
        $project: {
          IS_DELETED: 0,
        },
      },
    ]);
    return getProduct;
  };
  //api tổng số lượng các sản phẩm hiện có
    static async getTotalProducts() {
    return await ProductModel.countDocuments({ IS_DELETED: false }); // Đếm số lượng sản phẩm không bị xóa
  }

  static async searchProducts(searchQuery, page = 1, limit = 10) {
    page = Number(page);
    limit = Number(limit);

    const query = {
      $text: { $search: searchQuery },
      IS_DELETED: false
    };

    try {
      const products = await ProductModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-IS_DELETED');

      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  static async getProductById(id) {
    return await ProductModel.findById(id);
  }
  static getProductsByCategory = async (id) => {
    const CATEGORY_ID = new ObjectId(id);
    const products = await ProductModel.aggregate([
      {
        $match: {
          CATEGORY_ID: CATEGORY_ID,
          IS_DELETED: false,
        },
      },
    ]);
    return products;
  };
 // product.service.js
static async updateProduct(id, updateData) {
  try {
    // Log ID sản phẩm đang cố gắng cập nhật
    console.log("Cập nhật sản phẩm với ID:", id);

    // Lấy sản phẩm hiện tại từ cơ sở dữ liệu
    const existingProduct = await ProductModel.findById(id);
    if (!existingProduct) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    // Log sản phẩm hiện tại
    console.log("Sản phẩm hiện tại:", JSON.stringify(existingProduct, null, 2));


    // Tạo một đối tượng chứa các trường cần cập nhật
    const updatedFields = {};

    // Chỉ cập nhật các trường có trong updateData
    if (updateData.NAME_PRODUCT) {
      updatedFields.NAME_PRODUCT = updateData.NAME_PRODUCT; // Cập nhật tên sản phẩm
    }
    if (updateData.SHORT_DESC) {
      updatedFields.SHORT_DESC = updateData.SHORT_DESC; // Cập nhật mô tả ngắn
    }
    if (updateData.DESC_PRODUCT) {
      updatedFields.DESC_PRODUCT = updateData.DESC_PRODUCT; // Cập nhật mô tả chi tiết
    }
    if (updateData.CATEGORY_ID) {
      updatedFields.CATEGORY_ID = new ObjectId(updateData.CATEGORY_ID); // Cập nhật ID danh mục
    }

    // Cập nhật thuộc tính sản phẩm (kích thước, màu sắc)
    if (updateData.LIST_PRODUCT_METADATA) {
      // Tìm và cập nhật kích thước
      const sizeMetadata = updateData.LIST_PRODUCT_METADATA.find(meta => meta.KEY === "Kích Thước");
      if (sizeMetadata) {
        const sizeIndex = existingProduct.LIST_PRODUCT_METADATA.findIndex(item => item.KEY === "Kích Thước");
        if (sizeIndex >= 0) {
          // Đảm bảo VALUE là một mảng và không phải chuỗi
          existingProduct.LIST_PRODUCT_METADATA[sizeIndex].VALUE = Array.isArray(sizeMetadata.VALUE)
            ? sizeMetadata.VALUE
            : sizeMetadata.VALUE.split(','); // Nếu không phải mảng, tách chuỗi thành mảng
        } else {
          // Thêm mới kích thước
          existingProduct.LIST_PRODUCT_METADATA.push({
            KEY: "Kích Thước",
            VALUE: Array.isArray(sizeMetadata.VALUE) ? sizeMetadata.VALUE : sizeMetadata.VALUE.split(',')
          });
        }
      }

      // Tìm và cập nhật màu sắc
      const colorMetadata = updateData.LIST_PRODUCT_METADATA.find(meta => meta.KEY === "Màu Sắc");
      if (colorMetadata) {
        const colorIndex = existingProduct.LIST_PRODUCT_METADATA.findIndex(item => item.KEY === "Màu Sắc");
        if (colorIndex >= 0) {
          // Đảm bảo VALUE là một mảng và không phải chuỗi
          existingProduct.LIST_PRODUCT_METADATA[colorIndex].VALUE = Array.isArray(colorMetadata.VALUE)
            ? colorMetadata.VALUE
            : colorMetadata.VALUE.split(','); // Nếu không phải mảng, tách chuỗi thành mảng
        } else {
          // Thêm mới màu sắc
          existingProduct.LIST_PRODUCT_METADATA.push({
            KEY: "Màu Sắc",
            VALUE: Array.isArray(colorMetadata.VALUE) ? colorMetadata.VALUE : colorMetadata.VALUE.split(',')
          });
        }
      }

      // Gán thuộc tính cập nhật vào updatedFields
      updatedFields.LIST_PRODUCT_METADATA = existingProduct.LIST_PRODUCT_METADATA;
    }

   // Cập nhật hoặc thay thế hình ảnh
    if (updateData.LIST_FILE_ATTACHMENT) {
      // Thay thế ảnh mặc định (thumbnail)
      const thumbnailIndex = existingProduct.LIST_FILE_ATTACHMENT.findIndex(file => file.FILE_TYPE === "thumbnail");
      const newThumbnail = updateData.LIST_FILE_ATTACHMENT.find(file => file.FILE_TYPE === "thumbnail");
      if (newThumbnail) {
        if (thumbnailIndex >= 0) {
          existingProduct.LIST_FILE_ATTACHMENT[thumbnailIndex] = newThumbnail;
        } else {
          existingProduct.LIST_FILE_ATTACHMENT.push(newThumbnail);
        }
      }

      // Thay thế toàn bộ ảnh chi tiết
      const newDetailImages = updateData.LIST_FILE_ATTACHMENT.filter(file => file.FILE_TYPE === "detail");
      if (newDetailImages && newDetailImages.length > 0) {
        // Xoá tất cả ảnh chi tiết cũ
        existingProduct.LIST_FILE_ATTACHMENT = existingProduct.LIST_FILE_ATTACHMENT.filter(file => file.FILE_TYPE !== "detail");

        // Thêm ảnh chi tiết mới
        existingProduct.LIST_FILE_ATTACHMENT.push(...newDetailImages);
      }

      updatedFields.LIST_FILE_ATTACHMENT = existingProduct.LIST_FILE_ATTACHMENT;
    }


    // Cập nhật trường UPDATED_AT
    updatedFields.UPDATED_AT = new Date();

    // Cập nhật sản phẩm trong cơ sở dữ liệu
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });
    if (!updatedProduct) {
      throw new Error("Cập nhật sản phẩm thất bại");
    }

    // Log sản phẩm sau khi cập nhật
   console.log("Sản phẩm sau khi cập nhật:", JSON.stringify(updatedProduct, null, 2));


    // Trả về sản phẩm sau khi cập nhật thành công
    return updatedProduct;
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error.message);
    throw error; // Ném lỗi để controller có thể xử lý
  }
}

  static async createProductFashion(
    name,
    code,
    short_desc,
    desc_product,
    category_id,
    metadata,
    file_attachments,
    file_attachmentsdefault,
    account_id
  ) {
    const ACCOUNT__ID = new ObjectId(account_id);
    const CATEGORY_ID = new ObjectId(category_id);
    const { colors, sizes } = metadata;
    const listFileAttachments = file_attachments.map((file) => ({
      FILE_URL: file.file_url,
      FILE_TYPE: file.file_type,
      FROM_DATE: new Date(),
      TO_DATE: null,
    }));
    const listFileAttachmentsdefault = file_attachmentsdefault.map((file) => ({
      FILE_URL: file.file_url,
      FILE_TYPE: file.file_type,
      FROM_DATE: new Date(),
      TO_DATE: null,
    }));
    const product = await ProductModel.create({
      NAME_PRODUCT: name,
      CODE_PRODUCT: code,
      SHORT_DESC: short_desc,
      DESC_PRODUCT: desc_product,
      // NUMBER_INVENTORY_PRODUCT: ,
      CREATED_AT: new Date(),
      UPDATED_AT: null,
      CATEGORY_ID: CATEGORY_ID,
      LIST_PRODUCT_METADATA: [
        {
          KEY: "Màu Sắc",
          VALUE: colors,
        },
        {
          KEY: "Kích Thước",
          VALUE: sizes,
        },
      ],
      LIST_FILE_ATTACHMENT: listFileAttachments,
      ACCOUNT__ID: ACCOUNT__ID,
      LIST_FILE_ATTACHMENT_DEFAULT: listFileAttachmentsdefault,
      // QUANTITY_BY_KEY_VALUE: quantityByKeyValue,
    });
    return product;
  }
  // static async createProductfood(
  //   name,
  //   code,
  //   short_desc,
  //   desc_product,
  //   category_id,
  //   metadata,
  //   file_attachments,
  //   file_attachmentsdefault,
  //   account_id
  // ) {
  //   const ACCOUNT__ID = new ObjectId(account_id);
  //   const CATEGORY_ID = new ObjectId(category_id);
  //   const { sizes, types } = metadata;
  //   const listFileAttachments = file_attachments.map((file) => ({
  //     FILE_URL: file.file_url,
  //     FILE_TYPE: file.file_type,
  //     FROM_DATE: new Date(),
  //     TO_DATE: null,
  //   }));
  //   const listFileAttachmentsdefault = file_attachmentsdefault.map((file) => ({
  //     FILE_URL: file.file_url,
  //     FILE_TYPE: file.file_type,
  //     FROM_DATE: new Date(),
  //     TO_DATE: null,
  //   }));
  //   const product = await ProductModel.create({
  //     NAME_PRODUCT: name,
  //     CODE_PRODUCT: code,
  //     SHORT_DESC: short_desc,
  //     DESC_PRODUCT: desc_product,
  //     // NUMBER_INVENTORY_PRODUCT: quantity,
  //     CREATED_AT: new Date(),
  //     UPDATED_AT: null,
  //     CATEGORY_ID: CATEGORY_ID,
  //     LIST_PRODUCT_METADATA: [
  //       {
  //         KEY: "Kích Cỡ",
  //         VALUE: sizes,
  //       },
  //       {
  //         KEY: "Loại",
  //         VALUE: types,
  //       },
  //     ],
  //     LIST_FILE_ATTACHMENT: listFileAttachments,
  //     ACCOUNT__ID: ACCOUNT__ID,
  //     LIST_FILE_ATTACHMENT_DEFAULT: listFileAttachmentsdefault,
  //     // QUANTITY_BY_KEY_VALUE: quantityByKeyValue,
  //   });
  //   return product;
  // }
  // static async createProductphone(
  //   name,
  //   code,
  //   short_desc,
  //   desc_product,
  //   category_id,
  //   metadata,
  //   file_attachments,
  //   file_attachmentsdefault,
  //   account_id
  // ) {
  //   const ACCOUNT__ID = new ObjectId(account_id);
  //   const CATEGORY_ID = new ObjectId(category_id);
  //   const { memorys, colors } = metadata;
  //   const listFileAttachments = file_attachments.map((file) => ({
  //     FILE_URL: file.file_url,
  //     FILE_TYPE: file.file_type,
  //     FROM_DATE: new Date(),
  //     TO_DATE: null,
  //   }));
  //   const listFileAttachmentsdefault = file_attachmentsdefault.map((file) => ({
  //     FILE_URL: file.file_url,
  //     FILE_TYPE: file.file_type,
  //     FROM_DATE: new Date(),
  //     TO_DATE: null,
  //   }));
  //   const product = await ProductModel.create({
  //     NAME_PRODUCT: name,
  //     CODE_PRODUCT: code,
  //     SHORT_DESC: short_desc,
  //     DESC_PRODUCT: desc_product,
  //     // NUMBER_INVENTORY_PRODUCT: number_inventory_product,
  //     CREATED_AT: new Date(),
  //     UPDATED_AT: null,
  //     CATEGORY_ID: CATEGORY_ID,
  //     LIST_PRODUCT_METADATA: [
  //       {
  //         KEY: "Bộ Nhớ",
  //         VALUE: memorys,
  //       },
  //       {
  //         KEY: "Màu Sắc",
  //         VALUE: colors,
  //       },
  //     ],

  //     LIST_FILE_ATTACHMENT: listFileAttachments,
  //     // QUANTITY_BY_KEY_VALUE: quantityByKeyValue,
  //     LIST_FILE_ATTACHMENT_DEFAULT: listFileAttachmentsdefault,
  //     ACCOUNT__ID: ACCOUNT__ID,
  //   });
  //   return product;
  // }
  // static async createProductEarphone(
  //   name,
  //   code,
  //   short_desc,
  //   desc_product,
  //   category_id,
  //   metadata,
  //   file_attachments,
  //   file_attachmentsdefault,
  //   account_id
  // ) {
  //   const ACCOUNT__ID = new ObjectId(account_id);
  //   const CATEGORY_ID = new ObjectId(category_id);
  //   const { memorys,colors } = metadata;
  //   const listFileAttachments = file_attachments.map((file) => ({
  //     FILE_URL: file.file_url,
  //     FILE_TYPE: file.file_type,
  //     FROM_DATE: new Date(),
  //     TO_DATE: null,
  //   }));
  //   const listFileAttachmentsdefault = file_attachmentsdefault.map((file) => ({
  //     FILE_URL: file.file_url,
  //     FILE_TYPE: file.file_type,
  //     FROM_DATE: new Date(),
  //     TO_DATE: null,
  //   }));
  //   const product = await ProductModel.create({
  //     NAME_PRODUCT: name,
  //     CODE_PRODUCT: code,
  //     SHORT_DESC: short_desc,
  //     DESC_PRODUCT: desc_product,
  //     // NUMBER_INVENTORY_PRODUCT: number_inventory_product,
  //     CREATED_AT: new Date(),
  //     UPDATED_AT: null,
  //     CATEGORY_ID: CATEGORY_ID,
  //     LIST_PRODUCT_METADATA: [
  //       {
  //         KEY: "Bộ Nhớ",
  //         VALUE: memorys,
  //       },
  //       {
  //         KEY: "Màu Sắc",
  //         VALUE: colors,
  //       },
  //     ],

  //     LIST_FILE_ATTACHMENT: listFileAttachments,
  //     // QUANTITY_BY_KEY_VALUE: quantityByKeyValue,
  //     LIST_FILE_ATTACHMENT_DEFAULT: listFileAttachmentsdefault,
  //     ACCOUNT__ID: ACCOUNT__ID,
  //   });
  //   return product;
  // }

  static deleteProduct = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const deletedProduct = await ProductModel.updateOne(
      { _id: ID_PRODUCT },
      {
        $set: {
          IS_DELETED: true,
        },
      }
    );

    return { deletedProduct };
  };
}

module.exports = ProductService;
