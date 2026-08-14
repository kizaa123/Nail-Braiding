import { v2 as cloudinary } from 'cloudinary';
import { loadEnv } from '../../config/env';
import { Errors } from '../../common/errors';
import type { ImageStorage, StoredImage } from './image-storage';
import { assertSafeImageMeta } from './image-storage';

export class CloudinaryStorage implements ImageStorage {
  constructor() {
    const env = loadEnv();
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async upload(buffer: Buffer, _filename: string, mimeType: string): Promise<StoredImage> {
    const env = loadEnv();
    assertSafeImageMeta(mimeType, buffer.byteLength, env.IMAGE_MAX_BYTES);
    if (!env.CLOUDINARY_CLOUD_NAME) {
      throw Errors.unavailable('Image storage is not configured.');
    }

    const uploaded = await new Promise<{
      public_id: string;
      secure_url: string;
      width: number;
      height: number;
      bytes: number;
      format: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'noir-atelier/portfolio',
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
        (error, result) => {
          if (error || !result) reject(error ?? new Error('Upload failed'));
          else resolve(result as typeof uploaded);
        },
      );
      stream.end(buffer);
    });

    if (uploaded.width > env.IMAGE_MAX_WIDTH || uploaded.height > env.IMAGE_MAX_HEIGHT) {
      await cloudinary.uploader.destroy(uploaded.public_id);
      throw Errors.validation('Image dimensions are too large.');
    }

    const transform = (width: number) =>
      cloudinary.url(uploaded.public_id, {
        width,
        crop: 'fill',
        fetch_format: 'auto',
        quality: 'auto',
        secure: true,
      });

    return {
      storageKey: uploaded.public_id,
      url: uploaded.secure_url,
      thumbnailUrl: transform(240),
      smallUrl: transform(480),
      mediumUrl: transform(960),
      largeUrl: transform(1600),
      width: uploaded.width,
      height: uploaded.height,
      mimeType,
      bytes: uploaded.bytes,
    };
  }

  async destroy(storageKey: string): Promise<void> {
    await cloudinary.uploader.destroy(storageKey);
  }
}
