const account = require("../models/account");
const UserModel = require("../models/user");
const UserService = require("../services/user.service");
const passport = require("../config/passport");
const ImagesService = require('../services/images.services');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const User = await account.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "USER_ID",
            foreignField: "_id",
            as: "user",
          },
        },
      ]);
      res.status(200).json({
        message: "lấy thông tin người dùng thành công",
        success: true,
        data: User,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
  getAUser: async (req, res) => {
    try {
      const User = await account.findById(req.params.id).populate("USER_ID");
      res.status(200).json({
        message: "lấy thông tin người dùng thành công",
        success: true,
        data: User,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const accountToDelete = await account.findByIdAndDelete(req.params.id);
      if (!accountToDelete) {
        return res.status(404).json({
          message: "Người dùng không tồn tại",
          success: false,
        });
      }
      if (accountToDelete.USER_ID) {
        await UserModel.findByIdAndDelete(accountToDelete.USER_ID);
      }
      await account.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User deleted", success: true });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
  getLoginUser: async (req, res) => {
    try {
      const user = await account.findById(req.user.id);
      res.status(200).json({
        message: "lấy thông tin người dùng đăng nhập thành công",
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({ err: error.message });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại", success: false });
      }
      res.status(200).json({
        message: "lấy thông tin người dùng thành công",
        success: true,
        data: user,
      });
    } catch (error) {
      console.error(error);
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id } = req.params; // Lấy id từ tham số đường dẫn
      const updateData = req.body; // Dữ liệu để cập nhật, trong đó bao gồm URL ảnh đại diện

      // Chỉ cập nhật thông tin người dùng, không xử lý tải ảnh lên
      const updatedUser = await UserService.updateUserById(id, updateData);

      if (!updatedUser) {
        return res.status(404).json({
          message: "Người dùng không tồn tại",
          success: false,
        });
      }

      res.status(200).json({
        message: "Cập nhật thông tin người dùng thành công",
        success: true,
        data: updatedUser,
      });
    } catch (err) {
      res.status(500).json({
        message: "Lỗi hệ thống. Vui lòng thử lại sau.",
        error: err.message,
        success: false,
      });
    }
  }

//  updateUser: async (req, res) => {
//     try {
//         const { id } = req.params; // Lấy id từ tham số đường dẫn
//         const updateData = req.body; // Dữ liệu để cập nhật

//         // Kiểm tra xem có tệp hình ảnh không
//         if (req.file) {
//             const response = await ImagesService.uploadImage(req.file.path);
//             updateData.AVT_URL = response.secure_url; // Cập nhật đường dẫn của ảnh đại diện
//         }

//         // Cập nhật thông tin người dùng
//         const updatedUser = await UserService.updateUserById(id, updateData);
        
//         if (!updatedUser) {
//             return res.status(404).json({
//                 message: "Người dùng không tồn tại",
//                 success: false,
//             });
//         }

//         res.status(200).json({
//             message: "Cập nhật thông tin người dùng thành công",
//             success: true,
//             data: updatedUser,
//         });
//     } catch (err) {
//         res.status(500).json({
//             message: "Lỗi hệ thống. Vui lòng thử lại sau.",
//             error: err.message,
//             success: false,
//         });
//     }



// },


// googleLogin: async (req, res) => {
//     if (!req.user) {
//       return res.status(401).json({ message: "Authentication failed!" });
//     }

//     try {
//       // Tìm kiếm tài khoản dựa trên ID của người dùng đã đăng nhập qua Google
//       const userAccount = await account.findOne({ USER_ID: req.user._id }).populate('USER_ID');
      
//       if (!userAccount) {
//         return res.status(404).json({ message: "Account not found!" });
//       }

//       return res.status(200).json({
//         message: "Authentication successful",
//         data: {
//           account: userAccount, // Trả về dữ liệu từ bảng Account
//           user: userAccount.USER_ID, // Trả về dữ liệu từ bảng User
//         },
//       });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: error.message });
//     }
//   },
};
module.exports = userController;
