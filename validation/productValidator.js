const { json } = require("express");
const Joi = require("joi");
const productSchema = Joi.object({
    name: Joi.string().required().min(5),
    short_desc: Joi.string().required().min(5),
    desc_product: Joi.string().required().min(10),
    number_inventory_product: Joi.number().required(),
    category_id: Joi.string().hex().length(24),
    size: Joi.array().items(Joi.string()),
    type: Joi.array().items(Joi.string()),
    memory: Joi.array().items(Joi.string()),
    color: Joi.array().items(Joi.string()),
    file_url: Joi.string().required(),
    file_type: Joi.string().required(),
});

module.exports = { productSchema };