const Joi = require("joi");
const registerUserSchema = Joi.object({
  user_name: Joi.string().required().min(5),
  password: Joi.string().required().min(3),
  // first_name: Joi.string().required().min(2),
  last_name: Joi.string().required().min(2),
  // middle_name: Joi.string().required().min(2),
  email_user: Joi.string().email().required(),
  phone_number: Joi.number().required(),
  // gender_user: Joi.string().required(),
});

const loginUserSchema = Joi.object({
  user_name: Joi.string().required().min(5),
  password: Joi.string().required().min(3),
});
// const updateUserSchema = Joi.object({
//   last_name: Joi.string().min(2).required(),
//   phone_number: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
//   birthday: Joi.date().required(),
//   genger_user: Joi.string().valid('Nam', 'Nữ', 'Khác').required(),
//   email_user: Joi.string().email().required(),
//   avt_url: Joi.string().uri().optional(),
// });

module.exports = {
  registerUserSchema,
  loginUserSchema,
};
