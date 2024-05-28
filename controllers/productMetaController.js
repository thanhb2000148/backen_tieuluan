const Product = require('../models/product');
const ProductmetaModel = require('../models/product');

class productMetaController{
   static addPhoneMetadata = async (req, res) => {
        const { id } = req.params;
        const { key, value } = req.body;

       try {
           const product = await Product.findById(id);
            // console.log('Product:', product);
            //  console.log('Product ID:', id);
            if (!product) {
                return res.status(404).send('Product not found');
            }
            product.LIST_PRODUCT_METADATA.push({ KEY: key, VALUE: value });
            await product.save();
            res.status(201).json(product.LIST_PRODUCT_METADATA);
        } catch (error) {
            res.status(500).send(error);
        }
    }
    static addFoodMetadata = async (req, res) => {
        const { id } = req.params;
        const { key, value } = req.body;

       try {
           const product = await Product.findById(id);
            // console.log('Product:', product);
            //  console.log('Product ID:', id);
            if (!product) {
                return res.status(404).send('Product not found');
            }
            product.LIST_PRODUCT_METADATA.push({ KEY: key, VALUE: value });
           await product.save();
           
           const message = 'Sản phẩm là đồ ăn';
        res.status(201).json({ message, LIST_PRODUCT_METADATA: product.LIST_PRODUCT_METADATA });
        } catch (error) {
            res.status(500).send(error);
        }
    }

    static async updateMetadata(req, res) {
        const { id, metadataId } = req.params;
        const { key, value } = req.body;
        try {
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).send('Product not found');
            }

            const metadata = product.LIST_PRODUCT_METADATA.id(metadataId);
            if (!metadata) {
                return res.status(404).send('Metadata not found');
            }

            metadata.KEY = key;
            metadata.VALUE = value;
            await product.save();

            res.status(200).json(product.LIST_PRODUCT_METADATA);
        } catch (error) {
            res.status(500).send(error);
        }
    }
        // Xóa metadata khỏi sản phẩm
    static deleteMetadata = async (req, res) => {
        const { productId, metadataId } = req.params;

        try {
            const product = await Product.findById(productId);
            if (!product) {
            return res.status(404).send('Product not found');
            }

            const metadata = product.LIST_PRODUCT_METADATA.id(metadataId);
            if (!metadata) {
            return res.status(404).send('Metadata not found');
            }

            metadata.remove();
            await product.save();

            res.status(200).send(product);
        } catch (error) {
            res.status(500).send(error);
        }
        };

        // Lấy tất cả metadata của sản phẩm
    static getAllMetadata = async (req, res) => {
        const { productId } = req.params;

        try {
            const product = await Product.findById(productId);
            if (!product) {
            return res.status(404).send('Product not found');
            }

            res.status(200).send(product.LIST_PRODUCT_METADATA);
        } catch (error) {
            res.status(500).send(error);
        }
        };
}

module.exports = productMetaController;
