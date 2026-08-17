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
    return uploadToCloudinary(bytes);
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

function resolveCloudinaryCloudName() {
  const fromUrl = (process.env.CLOUDINARY_URL || '').trim().match(/@([^/?#]+)/);
  if (fromUrl?.[1]) return fromUrl[1].trim();

  const raw = (process.env.CLOUDINARY_CLOUD_NAME || '').trim().replace(/^['"]|['"]$/g, '');
  const hosted = raw.match(/(?:res|api)\.cloudinary\.com\/(?:v1_1\/)?([^/]+)/i);
  if (hosted?.[1]) return hosted[1];
  return raw.replace(/^https?:\/\//i, '').split('/')[0].replace(/[^a-z0-9_-]/gi, '');
}

function configureCloudinary() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
  if (cloudinaryUrl) {
    cloudinary.config({ url: cloudinaryUrl, secure: true });
    return;
  }
  cloudinary.config({
    cloud_name: resolveCloudinaryCloudName(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure: true,
  });
}

async function uploadToCloudinary(bytes: Buffer) {
  configureCloudinary();
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        public_id: `kaslook_${Date.now()}`,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(new Error(error?.message || 'Cloudinary did not return a photo URL.'));
          return;
        }
        resolve(result.secure_url);
      },
    );
    stream.end(bytes);
  });
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
