import { v2 as cloudinary } from 'cloudinary';
import { getSupabaseAdmin, studioCloudinaryConfigured } from '@/lib/supabase-admin';

export async function uploadLookImage(bytes: Buffer, contentType: string) {
  if (studioCloudinaryConfigured()) {
    return uploadToCloudinary(bytes);
  }
  return uploadToSupabase(bytes, contentType);
}

async function uploadToCloudinary(bytes: Buffer) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  const uploaded = await new Promise<{ secure_url?: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'kas-beauty-plus/looks',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      },
      (error, result) => {
        if (error || !result) reject(error ?? new Error('Cloudinary upload failed.'));
        else resolve(result);
      },
    );
    stream.end(bytes);
  });
  if (!uploaded.secure_url) throw new Error('Cloudinary did not return a photo URL.');
  return uploaded.secure_url;
}

async function uploadToSupabase(bytes: Buffer, contentType: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('studio-looks').upload(path, bytes, {
    contentType,
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from('studio-looks').getPublicUrl(path).data.publicUrl;
}
