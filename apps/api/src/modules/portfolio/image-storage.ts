export interface StoredImage {
  storageKey: string;
  url: string;
  thumbnailUrl: string;
  smallUrl: string;
  mediumUrl: string;
  largeUrl: string;
  width: number;
  height: number;
  mimeType: string;
  bytes: number;
}

export interface ImageStorage {
  upload(buffer: Buffer, filename: string, mimeType: string): Promise<StoredImage>;
  destroy(storageKey: string): Promise<void>;
}

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function assertSafeImageMeta(mimeType: string, bytes: number, maxBytes: number) {
  if (!ALLOWED_MIME.has(mimeType)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed.');
  }
  if (bytes > maxBytes) {
    throw new Error('Image exceeds the maximum allowed size.');
  }
}
