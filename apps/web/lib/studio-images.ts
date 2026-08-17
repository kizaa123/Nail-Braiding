import { v2 as cloudinary } from 'cloudinary';
import { getSupabaseAdmin, studioCloudinaryConfigured } from '@/lib/supabase-admin';
import { getLookImage } from '@/lib/look-image-store';

export async function uploadLookImage(bytes: Buffer, contentType: string) {
  if (studioCloudinaryConfigured()) {
    return uploadToCloudinary(bytes);
  }
  return uploadToSupabase(bytes, contentType);
}

export async function persistLookImageUrl(imageUrl: string | undefined) {
  const raw = imageUrl?.trim() ?? '';
  if (!raw) return '';
  if (raw.startsWith('https://') || raw.startsWith('http://')) return raw;

  if (raw.startsWith('data:image/')) {
    const match = raw.match(/^data:(image\/[\w.+-]+);base64,([A-Za-z0-9+/=\s]+)$/);
    if (!match) return raw;
    const bytes = Buffer.from(match[2].replace(/\s/g, ''), 'base64');
    const uploaded = await uploadLookImage(bytes, match[1]);
    return uploaded || raw;
  }

  const lookId = raw.includes('/look-image/') ? raw.split('/look-image/')[1]?.split(/[/?#]/)[0] : '';
  if (lookId) {
    const stored = getLookImage(lookId);
    if (stored) {
      const uploaded = await uploadLookImage(stored.bytes, stored.type);
      if (uploaded) return uploaded;
    }
  }

  return raw;
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
