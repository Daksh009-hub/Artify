import { v2 as cloudinary } from 'cloudinary';

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Upload an image buffer or base64 string to Cloudinary.
 * Falls back to inline data URI if Cloudinary credentials are not set (for offline/local demo resilience).
 */
export const uploadImageToCloud = async (bufferOrBase64, options = {}) => {
  if (!isCloudinaryConfigured) {
    console.warn('Cloudinary not fully configured. Using inline data URI fallback.');
    let dataUri;
    if (Buffer.isBuffer(bufferOrBase64)) {
      const mime = options.format ? `image/${options.format}` : 'image/jpeg';
      dataUri = `data:${mime};base64,${bufferOrBase64.toString('base64')}`;
    } else if (typeof bufferOrBase64 === 'string') {
      dataUri = bufferOrBase64.startsWith('data:') ? bufferOrBase64 : `data:image/jpeg;base64,${bufferOrBase64}`;
    }
    return {
      secure_url: dataUri,
      public_id: `local_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      format: options.format || 'jpg'
    };
  }

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'artify/products',
      resource_type: 'image',
      ...options
    };

    if (Buffer.isBuffer(bufferOrBase64)) {
      const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      stream.end(bufferOrBase64);
    } else if (typeof bufferOrBase64 === 'string') {
      cloudinary.uploader.upload(bufferOrBase64, uploadOptions)
        .then(resolve)
        .catch(reject);
    } else {
      reject(new Error('Invalid image data provided for upload'));
    }
  });
};

export default cloudinary;
