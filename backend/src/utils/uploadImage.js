const cloudinary = require("../config/cloudinary.config");
const streamifier = require("streamifier");

/**
 * Upload buffer lên Cloudinary, trả về url ảnh
 * @param {Buffer} buffer - file buffer
 * @param {string} folder - thư mục cloudinary
 * @returns {Promise<string>} url ảnh
 */
async function uploadImage(buffer, folder = "uploads") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

module.exports = uploadImage;
