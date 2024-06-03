const cloudinary = require('../config/cloudinaryconfig');
const ImagesService = require('../services/images.services');
// controllers/imagesControllers.js
exports.uploadImages = async (req, res) => {
  try {
    const file = req.file.path;
    const response = await ImagesService.uploadImage(file);
    return res.status(200).json({
      message: 'Uploaded images thành công!',
      success: true,
      data: response
    });
  } catch (error) {
    return res.status(400).json({
      name: error.name,
      message: error.message,
    });
  }
};
