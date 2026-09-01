// [TV 2] Xử lý upload ảnh lên Cloudinary
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

/**
 * Upload buffer lên Cloudinary
 * @param {Buffer} buffer - File buffer từ multer
 * @param {string} folder - Thư mục Cloudinary
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = (buffer, folder = 'ecogreen/products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 800, height: 800, crop: 'limit', quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

/**
 * Xóa ảnh khỏi Cloudinary
 * @param {string} publicId
 */
export const deleteImage = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};
