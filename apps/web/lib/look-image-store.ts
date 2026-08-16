type StoredLookImage = {
  bytes: Buffer;
  type: string;
  expiresAt: number;
};

const TTL_MS = 24 * 60 * 60 * 1000;
const images = new Map<string, StoredLookImage>();

function pruneLookImages() {
  const now = Date.now();
  for (const [id, image] of images) {
    if (image.expiresAt <= now) images.delete(id);
  }
}

export function saveLookImageFromBytes(bytes: Buffer, type: string) {
  pruneLookImages();
  const id = crypto.randomUUID();
  images.set(id, {
    bytes,
    type: type.startsWith('image/') ? type : 'image/jpeg',
    expiresAt: Date.now() + TTL_MS,
  });
  return id;
}

export function getLookImage(id: string) {
  pruneLookImages();
  return images.get(id) ?? null;
}
