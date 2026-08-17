import { v2 as cloudinary } from 'cloudinary';
import { getSupabaseAdmin, studioCloudinaryConfigured } from '@/lib/supabase-admin';
import { getLookImage } from '@/lib/look-image-store';

export function isPublicLookImageUrl(url: string | null | undefined) {
  const raw = url?.trim() ?? '';
  if (!raw || raw.startsWith('data:') || raw.includes('/look-image/')) return false;
  return /^https?:\/\//i.test(raw);
}

export async function uploadLookImage(bytes: Buffer, contentType: string) {
  if (studioCloudinaryConfigured()) {
    return uploadToCloudinary(bytes, contentType);
  }
  return uploadToSupabase(bytes, contentType);
}

export async function persistLookImageUrl(imageUrl: string | undefined) {
  const raw = imageUrl?.trim() ?? '';
  if (!raw) return '';
  if (isPublicLookImageUrl(raw)) return raw;

  if (raw.startsWith('data:image/')) {
    const match = raw.match(/^data:(image\/[\w.+-]+);base64,([A-Za-z0-9+/=\s]+)$/);
    if (!match) return '';
    const bytes = Buffer.from(match[2].replace(/\s/g, ''), 'base64');
    const uploaded = await uploadLookImage(bytes, match[1]);
    return uploaded && isPublicLookImageUrl(uploaded) ? uploaded : '';
  }

  const lookId = raw.includes('/look-image/') ? raw.split('/look-image/')[1]?.split(/[/?#]/)[0] : '';
  if (lookId) {
    const stored = getLookImage(lookId);
    if (stored) {
      const uploaded = await uploadLookImage(stored.bytes, stored.type);
      if (uploaded && isPublicLookImageUrl(uploaded)) return uploaded;
    }
  }

  return '';
}

async function uploadToCloudinary(bytes: Buffer, contentType: string) {
  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .split('/')[0];
  cloudinary.config({
    cloud_name: cloudName,
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure: true,
  });
  const mime = contentType.startsWith('image/') ? contentType : 'image/jpeg';
  const uploaded = await cloudinary.uploader.upload(`data:${mime};base64,${bytes.toString('base64')}`, {
    folder: 'kas-looks',
    public_id: `look_${Date.now()}`,
    resource_type: 'image',
    overwrite: false,
  });
  if (!uploaded.secure_url) throw new Error('Cloudinary did not return a photo URL.');
  return uploaded.secure_url;
}

async function uploadToSupabase(bytes: Buffer, contentType: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const path = `looks/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('studio-looks').upload(path, bytes, {
    contentType: contentType.startsWith('image/') ? contentType : 'image/jpeg',
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from('studio-looks').getPublicUrl(path).data.publicUrl;
}
