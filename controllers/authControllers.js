const account = require("../models/account");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randomCode = require("../utils/code");
const UserService = require("../services/user.service");
const sendEmailServices = require("../services/emailService");

const {
  registerUserSchema,
  loginUserSchema,
} = require("../validation/authValidator");
const authController = {
  registerUser: async (req, res) => {
    try {
      const { error } = registerUserSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const existingAccount = await account.findOne({
        USER_NAME: req.body.user_name,
      });
      if (existingAccount) {
        return res
          .status(400)
          .json({ message: "tên đăng nhập đã tồn tại trên hệ thống" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      //create a new user
      const payload = {
        FIRST_NAME: req.body.first_name,
        LAST_NAME: req.body.last_name,
        EMAIL_USER: req.body.email_user,
        PHONE_NUMBER: req.body.phone_number,
        CREATED_AT: new Date(),
        GENGER_USER: req.body.gender_user,
        MIDDLE_NAME: req.body.middle_name,
        FULL_NAME: req.body.full_name,
        AVT_URL: req.body.avt,
      };
      const newUser = await UserService.addUser(payload);

      // create a new account link it to the user
      const payloadAccount = {
        USER_NAME: req.body.user_name,
        PASSWORD: hashedPassword,
        USER_ID: newUser._id,
      };
      // save the account
      const newAccount = await UserService.addAccount(payloadAccount);
      const OTP = randomCode();
      await UserService.addCodeActive(newUser._id, OTP, "ACTIVE", 120);
      await sendEmailServices(req.body.email_user, OTP);
      res.status(201).json({ account: newAccount, user: newUser });
    } catch (e) {
      res.status(500).json({
        message: e.message,
      });
    }
  },
  // generate access token
  // Login
  loginUser: async (req, res) => {
    try {
      const { error } = loginUserSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const loginAccount = await account.findOne({
        USER_NAME: req.body.user_name,
      });
      if (!loginAccount) {
        return res.status(404).json({
          message: "sai tên đăng nhập",
        });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        loginAccount.PASSWORD
      );
      if (!validPassword) {
        return res.status(400).json({
          message: "sai mật khẩu",
        });
      }
      if (loginAccount && validPassword) {
        const accessToken = jwt.sign(
          {
            id: loginAccount.id,
            admin: loginAccount.OBJECT_ROLE.IS_ADMIN,
            id_user: loginAccount.USER_ID,
          },
          process.env.JWT_ACCESS_KEY, // key để đăng nhập vào
          { expiresIn: "1h" } // thời gian token hết hạn
        );
        const refreshToken = jwt.sign(
          {
            id: loginAccount.id,
            admin: loginAccount.OBJECT_ROLE.IS_ADMIN,
            id_user: loginAccount.USER_ID,
          },
          process.env.JWT_REFRESH_KEY, // key để đăng nhập vào
          { expiresIn: "365d" } // thời gian token hết hạn
        );
      }
      res.status(200).json({ accessToken, refreshToken });
    } catch (e) {
      res.status(500).json({
        message: e.message,
      });
    }
  },
  acviteAccount: async (req, res) => {},

  // Logout
};
module.exports = authController;
