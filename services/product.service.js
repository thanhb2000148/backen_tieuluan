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
    // static getProducts = async (page, limit) => {
    //     page = Number(page);
    //     limit = Number(limit);
    //     const getProduct = await ProductModel.aggregate([
    //         {
    //             $match: {
    //                IS_DELETED: false, 
    //             }, 
    //         },
    //         { $skip: (page - 1) * limit },
    //         { $limit: limit },
    //         {
    //             $project: {
    //                 IS_DELETED: 0
    //             }
    //         }
    //     ])
    //     return getProduct;
    // }
    static getProducts = async () => {
        const getProduct = await ProductModel.aggregate([
            {
                $match: {
                   IS_DELETED: false, 
                }, 
            },
            {
                $project: {
                    IS_DELETED: 0
                }
            }
        ]);
        return getProduct;
    }
   
    static async getProductById(id) {
        return await ProductModel.findById(id);
    }
    static getProductsByCategory = async (id) => {
        const CATEGORY_ID = new ObjectId(id);
        const products = await ProductModel.aggregate([
        {
            $match: {
                CATEGORY_ID: CATEGORY_ID,
                IS_DELETED: false
            }
        }
    ]);
    return products;
    }

    
    static async createProductFashion(
        name, code, short_desc,
        desc_product,
        category_id, metadata, file_attachments,file_attachmentsdefault,
        account_id,)
    {
        const ACCOUNT__ID = new ObjectId(account_id);
        const CATEGORY_ID = new ObjectId(category_id);
        const { colors, sizes } = metadata;
        const listFileAttachments = file_attachments.map(file => ({
            FILE_URL: file.file_url,
            FILE_TYPE: file.file_type,
            FROM_DATE: new Date(),
            TO_DATE: null,
        }));
         const listFileAttachmentsdefault = file_attachmentsdefault.map(file => ({
            FILE_URL: file.file_url,
            FILE_TYPE: file.file_type,
            FROM_DATE: new Date(),
            TO_DATE: null,
        }));
        // const quantityByKeyValue = quantity_by_key_value.map(item => ({
        //     QUANTITY: item.quantity,
        //     LIST_MATCH_KEY: item.list_match_key.map(match => ({
        //         KEY: match.key,
        //         VALUE: match.value,
        //     }))
        // }));
        // const quantity = quantity_by_key_value.reduce((total, item) => total + item.quantity, 0);
        //total: giá trị ban đầu là 0
        //item.quantity: giá trị của  quantity được nhập
        // console.log("#tongspluong: " + quantity);
    
        // const colorMetadata = colors.map(color => ({ KEY: "COLOR", VALUE: color }));
        // const sizeMetadata = sizes.map(size => ({ KEY: "SIZE", VALUE: size }));
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
                    KEY: "COLOR",
                    VALUE: colors
                },
                {
                    KEY: "SIZE",
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
    static async createProductfood(
        name, code, short_desc,
        desc_product, 
        category_id, metadata, file_attachments,file_attachmentsdefault,
        account_id)
    {
        const ACCOUNT__ID = new ObjectId(account_id);
        const CATEGORY_ID = new ObjectId(category_id);
        const { sizes, types } = metadata;
        const listFileAttachments = file_attachments.map(file => ({
            FILE_URL: file.file_url,
            FILE_TYPE: file.file_type,
            FROM_DATE: new Date(),
            TO_DATE: null,
        }));
        const listFileAttachmentsdefault = file_attachmentsdefault.map(file => ({
            FILE_URL: file.file_url,
            FILE_TYPE: file.file_type,
            FROM_DATE: new Date(),
            TO_DATE: null,
        }));
        // const quantityByKeyValue = quantity_by_key_value.map(item => ({
        //     QUANTITY: item.quantity,
        //     LIST_MATCH_KEY: item.list_match_key.map(match => ({
        //         KEY: match.key,
        //         VALUE: match.value,
        //     }))
        // }));
        // const quantity = quantity_by_key_value.reduce((total, item) => total + item.quantity, 0);

        // const sizeMetadata = sizes.map(size => ({ KEY: "SIZE", VALUE: size }));
        // const typeMetadata = types.map(type => ({ KEY: "TYPE", VALUE: type}));
        const product = await ProductModel.create({
            NAME_PRODUCT: name,
            CODE_PRODUCT: code,
            SHORT_DESC: short_desc,
            DESC_PRODUCT: desc_product,
            // NUMBER_INVENTORY_PRODUCT: quantity,
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
            LIST_FILE_ATTACHMENT: listFileAttachments,
            ACCOUNT__ID: ACCOUNT__ID,
            LIST_FILE_ATTACHMENT_DEFAULT: listFileAttachmentsdefault,
            // QUANTITY_BY_KEY_VALUE: quantityByKeyValue,
        });
        return product;
    }
    static async createProductphone(
        name, code, short_desc,
        desc_product, 
        category_id, metadata, file_attachments,file_attachmentsdefault,
        account_id)
    {
        const ACCOUNT__ID = new ObjectId(account_id);
        const CATEGORY_ID = new ObjectId(category_id);
        const { memorys, colors } = metadata;
        const listFileAttachments = file_attachments.map(file => ({
            FILE_URL: file.file_url,
            FILE_TYPE: file.file_type,
            FROM_DATE: new Date(),
            TO_DATE: null,
        }));
        const listFileAttachmentsdefault = file_attachmentsdefault.map(file => ({
            FILE_URL: file.file_url,
            FILE_TYPE: file.file_type,
            FROM_DATE: new Date(),
            TO_DATE: null,
        }));
        // const quantityByKeyValue = quantity_by_key_value.map(item => ({
        //     QUANTITY: item.quantity,
        //     LIST_MATCH_KEY: item.list_match_key.map(match => ({
        //         KEY: match.key,
        //         VALUE: match.value,
        //     }))
        // }));
        //  const quantity = quantity_by_key_value.reduce((total, item) => total + item.quantity, 0);

        // const memoryMetadata = memorys.map(memory => ({ KEY: "MEMORY", VALUE: memory }));
        // const colortadata = colors.map(color => ({ KEY: "COLOR", VALUE: color}));
        const product = await ProductModel.create({
            NAME_PRODUCT: name,
            CODE_PRODUCT: code,
            SHORT_DESC: short_desc,
            DESC_PRODUCT: desc_product,
            // NUMBER_INVENTORY_PRODUCT: number_inventory_product,
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

            LIST_FILE_ATTACHMENT: listFileAttachments,
            // QUANTITY_BY_KEY_VALUE: quantityByKeyValue,
            LIST_FILE_ATTACHMENT_DEFAULT: listFileAttachmentsdefault,
            ACCOUNT__ID: ACCOUNT__ID,

        });
        return product;
    }

    static async updateProduct(
        name, code, short_desc,
        desc_product, number_inventory_product,
        category_id, metadata, file_attachments,quantity_by_key_value,
        account_id)
    {
        const ID = new ObjectId(id_product);
        const ACCOUNT__ID = new ObjectId(account_id);
        const CATEGORY_ID = new ObjectId(category_id);

        const listFileAttachments = file_attachments.map(file => ({
            FILE_URL: file.file_url,
            FILE_TYPE: file.file_type,
            FROM_DATE: new Date(),
            TO_DATE: null,
        }));
        const quantityByKeyValue = quantity_by_key_value.map(item => ({
            QUANTITY: item.quantity,
            LIST_MATCH_KEY: item.list_match_key.map(match => ({
                KEY: match.key,
                VALUE: match.value,
            }))
        }));
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
                        $each: listFileAttachments
                    },
                    QUANTITY_BY_KEY_VALUE: {
                        $each: quantityByKeyValue
                    }
                }
            }
        );
        return updateProduct;
    }


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

        return { deletedProduct };
        
    };
//     static updateNumberInventoryProduct = async (id_product) => {
//     const ID_PRODUCT = new ObjectId(id_product);
//     const product = await ProductModel.findById(ID_PRODUCT);
//     if (!product) {
//       throw new Error("Product not found");
//     }
//     let totalQuantity = 0;
//     product.QUANTITY_BY_KEY_VALUE.forEach((item) => {
//       totalQuantity = totalQuantity + item.QUANTITY;
//     });
//     product.NUMBER_INVENTORY_PRODUCT = totalQuantity;
//     product.save();
//     return product;
//   };
    
 
}


module.exports = ProductService;
