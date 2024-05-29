const Joi = require("joi");
const registerUserSchema = Joi.object({
  user_name: Joi.string().required(),
  password: Joi.string().required(),
  first_name: Joi.string().required().min(3),
  last_name: Joi.string().required().min(3),
  middle_name: Joi.string().required().min(2),
  email_user: Joi.string().email().required(),
  phone_number: Joi.number().required(),
  gender_user: Joi.string().required(),
  avt: Joi.string().required(),
});

const loginUserSchema = Joi.object({
  user_name: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
};
