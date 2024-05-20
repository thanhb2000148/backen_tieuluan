// controllers/imagesControllers.js
exports.uploadImages = async (req, res) => {
  try {
    const images = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
    }));

    return res.status(200).json({
      message: 'Uploaded images thành công!',
      datas: images,
    });
  } catch (error) {
    return res.status(400).json({
      name: error.name,
      message: error.message,
    });
  }
};
