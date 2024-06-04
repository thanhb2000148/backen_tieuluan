const { date } = require("joi");
const ProductModel = require("../models/product");
const category = require("../models/category");
const { $_match } = require("../validation/addressValidator");
const ObjectId = require("mongoose").Types.ObjectId;
const TypeProductModel = require("../models/type_product");
// const ImagesService = require("../services/images.services");
const { image } = require("../config/cloudinaryconfig");
// const path = require("path");
const { json } = require("express");
const PriceModel = require("../models/price");

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

    static async createProductFashion(
        name, code, short_desc,
        desc_product, number_inventory_product,
        category_id, metadata, file_url, file_type,
        account_id,)
    {
        const ACCOUNT__ID = new ObjectId(account_id);
        const CATEGORY_ID = new ObjectId(category_id);
        const { colors,sizes } = metadata;
        // const colorMetadata = colors.map(color => ({ KEY: "COLOR", VALUE: color }));
        // const sizeMetadata = sizes.map(size => ({ KEY: "SIZE", VALUE: size }));
        const product = await ProductModel.create({
            NAME_PRODUCT: name,
            CODE_PRODUCT: code,
            SHORT_DESC: short_desc,
            DESC_PRODUCT: desc_product,
            NUMBER_INVENTORY_PRODUCT: number_inventory_product,
            CREATED_AT: new Date(),
            UPDATED_AT: null,
            CATEGORY_ID: CATEGORY_ID,
            LIST_PRODUCT_METADATA: [
                {
                    KEY: "COLOR",
                    VALUE: colors
                },
                {
                    KEY: "SIZE",
                    VALUE: sizes,
                },
                
            ],
            LIST_FILE_ATTACHMENT:[
            {
                FILE_URL: file_url,
                FILE_TYPE: file_type,
                FROM_DATE: new Date(),
                TO_DATE: null,

                },
            ],
            
            ACCOUNT__ID: ACCOUNT__ID,
        });
        return product;
    }
    static async createProductfood(
        name, code, short_desc,
        desc_product, number_inventory_product,
        category_id, metadata, file_url, file_type,
        account_id)
    {
        const ACCOUNT__ID = new ObjectId(account_id);
        const CATEGORY_ID = new ObjectId(category_id);
        const { sizes,types} = metadata;
        // const sizeMetadata = sizes.map(size => ({ KEY: "SIZE", VALUE: size }));
        // const typeMetadata = types.map(type => ({ KEY: "TYPE", VALUE: type}));
        const product = await ProductModel.create({
            NAME_PRODUCT: name,
            CODE_PRODUCT: code,
            SHORT_DESC: short_desc,
            DESC_PRODUCT: desc_product,
            NUMBER_INVENTORY_PRODUCT: number_inventory_product,
            CREATED_AT: new Date(),
            UPDATED_AT: null,
            CATEGORY_ID: CATEGORY_ID,
            LIST_PRODUCT_METADATA: [
                  {
                    KEY: "SIZE",
                    VALUE: sizes
                },
                {
                    KEY: "TYPE",
                    VALUE: types
                },
                
            ],
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
    static async createProductphone(
        name, code, short_desc,
        desc_product, number_inventory_product,
        category_id, metadata, file_url, file_type,
        account_id)
    {
        const ACCOUNT__ID = new ObjectId(account_id);
        const CATEGORY_ID = new ObjectId(category_id);
        const { memorys,colors} = metadata;
        // const memoryMetadata = memorys.map(memory => ({ KEY: "MEMORY", VALUE: memory }));
        // const colortadata = colors.map(color => ({ KEY: "COLOR", VALUE: color}));
        const product = await ProductModel.create({
            NAME_PRODUCT: name,
            CODE_PRODUCT: code,
            SHORT_DESC: short_desc,
            DESC_PRODUCT: desc_product,
            NUMBER_INVENTORY_PRODUCT: number_inventory_product,
            CREATED_AT: new Date(),
            UPDATED_AT: null,
            CATEGORY_ID: CATEGORY_ID,
            LIST_PRODUCT_METADATA: [
                {
                    KEY: "MEMORY",
                    VALUE: memorys
                },
                {
                    KEY: "COLOR",
                    VALUE: colors,
                },
            ],
            LIST_FILE_ATTACHMENT: [
                {
                    FILE_URL: file_url,
                    FILE_TYPE: file_type,
                    FROM_DATE: new Date(),
                    TO_DATE: null
                },
            ],

            ACCOUNT__ID: ACCOUNT__ID,

        });
        return product;
    }

    static async updateProduct(id_product, name, code, short_desc,
        desc_product, number_inventory_product,
        category_id, key, value, file_url, file_type,
        account_id)
    {
        const ID = new ObjectId(id_product);
        const ACCOUNT__ID = new ObjectId(account_id);
        const CATEGORY_ID = new ObjectId(category_id);
        const updateProduct = await ProductModel.updateOne(
            {
                ACCOUNT__ID: ACCOUNT__ID
            },
            {
                $set: {
                    NAME_PRODUCT: name,
                    CODE_PRODUCT: code,
                    SHORT_DESC: short_desc,
                    DESC_PRODUCT: desc_product,
                    NUMBER_INVENTORY_PRODUCT: number_inventory_product,
                    CREATED_AT: new Date(),
                    UPDATED_AT: new Date(),
                    CATEGORY_ID: CATEGORY_ID,
                },
                $push: {
                    LIST_PRODUCT_METADATA: {
                        KEY: key,
                        VALUE: value,
                    },
                    LIST_FILE_ATTACHMENT: {
                        FILE_URL: file_url,
                        FILE_TYPE: file_type,
                        FROM_DATE: new Date(),
                        TO_DATE: new Date(),
                    },
                }
            }
        );
        return updateProduct;
    }

    // static async quantityProduct(
    //     size, quantity)
    // {
    //     const ACCOUNT__ID = new ObjectId(account_id);
    //     const CATEGORY_ID = new ObjectId(category_id);
    //     const { size,quantity} = metadata;
    // }

    static deleteProduct = async (id_product) => {
        const ID_PRODUCT = new ObjectId(id_product);
        const deletedProduct = await ProductModel.updateOne(
            { _id: ID_PRODUCT },
            {
                $set: {
                    IS_DELETED: true,
                }
            }
        );
        // const updatePrice =  await PriceModel.updateMany(
        //     { ID_PRODUCT: ID_PRODUCT },
        //     {
        //         $set: {
        //             "LIST_PRICE.$[elem].TO_DATE": new Date(),
        //         },
        //     },
        //     {
        //         arrayFilters: [{ "elem.TO_DATE": null }] ,
        //     }
        // );
        return { deletedProduct };
        
    };
    
 
}


module.exports = ProductService;
