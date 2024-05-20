const cloudinary = require('../config/cloudinaryconfig');
// controllers/imagesControllers.js
exports.uploadImages = async (req, res) => {
  try {
    const file = req.file.path;
    const response = await cloudinary.uploader.upload(file, {folder: 'test_folder'});
    return res.status(200).json({
      message: 'Uploaded images thành công!',
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      name: error.name,
      message: error.message,
    });
  }
};
