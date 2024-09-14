const account = require("../models/account");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randomCode = require("../utils/code");
const UserService = require("../services/user.service");
const sendEmailServices = require("../services/emailService");
const TIME_NOW = new Date();
const {
  registerUserSchema,
  loginUserSchema,
} = require("../validation/authValidator");
const { message, error } = require("../validation/addressValidator");
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
      const existingEmail = await User.findOne({
        EMAIL_USER: req.body.email_user,
      });
      if (existingAccount) {
        return res
          .status(400)
          .json({ message: "tên đăng nhập đã tồn tại trên hệ thống" });
      }
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: "email đã tồn tại trên hệ thống" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      //create a new user
      const payload = {
        // FIRST_NAME: req.body.first_name,
        LAST_NAME: req.body.last_name,
        EMAIL_USER: req.body.email_user,
        PHONE_NUMBER: req.body.phone_number,
        CREATED_AT: new Date(),
        // GENGER_USER: req.body.gender_user,
        // MIDDLE_NAME: req.body.middle_name,
        // FULL_NAME: ` ${req.body.first_name} ${req.body.middle_name} ${req.body.last_name}`,
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
      await UserService.addCodeActive(newUser._id, OTP, "ACTIVE", 300);
      await sendEmailServices.sendEmail(req.body.email_user, OTP);
      res.status(200).json({
        message: "tạo tài khoản thành công",
        success: true,
        data: newAccount,
      });
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
      const is_active = await UserService.checkActiveById(loginAccount.id);
      if (is_active[0].IS_ACTIVE == true) {
        if (loginAccount && validPassword) {
          const accessToken = jwt.sign(
            {
              id: loginAccount.id,
              admin: loginAccount.OBJECT_ROLE.IS_ADMIN,
              id_user: loginAccount.USER_ID,
            },
            process.env.JWT_ACCESS_KEY, // key để đăng nhập vào
            { expiresIn: "5h" } // thời gian token hết hạn
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

          res.status(200).json({
            message: "đăng nhập thành công",
            success: true,
            accessToken,
            refreshToken,
          });
        }
      } else {
        return res.status(400).json({
          message: "tài khoản chưa được kích hoạt",
        });
      }
    } catch (e) {
      res.status(500).json({
        message: e.message,
      });
    }
  },
  activeAccount: async (req, res) => {
    try {
      const activeAccount = await UserService.getCodeByEmail(
        req.body.email,
        "ACTIVE"
      );
      if (activeAccount.CODE == req.body.code) {
        const checkActiveUser = await UserService.checkActiveByEmail(
          req.body.email
        );
        const exp_date = new Date(activeAccount.EXP_DATE);
        if (TIME_NOW.getTime() <= exp_date.getTime()) {
          if (checkActiveUser[0].IS_ACTIVE == false) {
            await UserService.updateListCodeById(
              checkActiveUser[0].ACCOUNT_ID,
              activeAccount.ID_CODE
            );
            await UserService.activeAccountById(checkActiveUser[0].ACCOUNT_ID);
            return res.status(200).json({
              message: "tài khoản của bạn đã được kích hoạt",
              success: true,
            });
          } else {
            return res.status(400).json({
              message: "tài khoản của bạn đã được kích hoạt từ trước đó",
              success: false,
            });
          }
        } else {
          res.status(403).json({
            message: "hết thời gian kích hoạt tài khoản",
            success: false,
          });
        }
      } else {
        return res
          .status(400)
          .json({ message: "bạn nhập sai mã kích hoạt", success: false });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Logout
};
module.exports = authController;
