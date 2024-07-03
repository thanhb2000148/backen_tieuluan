const Joi = require("joi");
const registerUserSchema = Joi.object({
  user_name: Joi.string().required().min(5),
  password: Joi.string().required().min(3),
  first_name: Joi.string().required().min(2),
  last_name: Joi.string().required().min(2),
  middle_name: Joi.string().required().min(2),
  email_user: Joi.string().email().required(),
  phone_number: Joi.number().required(),
  gender_user: Joi.string().required(),
});

const loginUserSchema = Joi.object({
  user_name: Joi.string().required().min(5),
  password: Joi.string().required().min(3),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
};
