const { date } = require("joi");
const ProductModel = require("../models/product");
const category = require("../models/category");
const { $_match } = require("../validation/addressValidator");
const ObjectId = require("mongoose").Types.ObjectId;

class ProductService {
    static async getAllProducts(account_id) {
        const getProduct = await ProductModel.aggregate([
            {
                $match: {
                   IS_DELETED: false, 
                } 
            },
        ])
        return getProduct;
    }

    static async getProductById(id) {
        return await ProductModel.findById(id).populate("CATEGORY_ID");
    }

    static async createProduct(
        name, code, short_desc,
        desc_product, number_inventory_product,
        category_id, key, value, file_url, file_type,
        account_id)
    {
        const ACCOUNT__ID = new ObjectId(account_id);
        const CATEGORY_ID = new ObjectId(category_id);
        const product = await ProductModel.create({
            NAME_PRODUCT: name,
            CODE_PRODUCT: code,
            SHORT_DESC: short_desc,
            DESC_PRODUCT: desc_product,
            NUMBER_INVENTORY_PRODUCT: number_inventory_product,
            CREATED_AT: new Date(),
            UPDATED_AT: null,
            CATEGORY_ID: CATEGORY_ID,
            LIST_PRODUCT_METADATA: {
                KEY: key,
                VALUE: value,
            },

            LIST_FILE_ATTACHMENT: {
                FILE_URL: file_url,
                FILE_TYPE: file_type,
                FROM_DATE: new Date(),
                TO_DATE: null,

            },

            ACCOUNT__ID: ACCOUNT__ID,

        });
        return product;
    }

    static async updateProduct(id, newData) {
        return await ProductModel.findByIdAndUpdate(id, newData, { new: true });
    }

    static async deleteProduct(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}

module.exports = ProductService;
