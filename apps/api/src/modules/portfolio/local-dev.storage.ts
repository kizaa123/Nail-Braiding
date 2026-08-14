import { randomUUID } from 'node:crypto';
import type { ImageStorage, StoredImage } from './image-storage';
import { assertSafeImageMeta } from './image-storage';
import { loadEnv } from '../../config/env';

/** Development/test storage that never writes binary data to PostgreSQL. */
export class LocalDevStorage implements ImageStorage {
  async upload(buffer: Buffer, _filename: string, mimeType: string): Promise<StoredImage> {
    const env = loadEnv();
    assertSafeImageMeta(mimeType, buffer.byteLength, env.IMAGE_MAX_BYTES);
    const id = randomUUID();
    const base = `https://picsum.photos/seed/${id}`;
    return {
      storageKey: `local/${id}`,
      url: `${base}/1200/1600`,
      thumbnailUrl: `${base}/240/320`,
      smallUrl: `${base}/480/640`,
      mediumUrl: `${base}/960/1280`,
      largeUrl: `${base}/1600/2000`,
      width: 1200,
      height: 1600,
      mimeType,
      bytes: buffer.byteLength,
    };
  }

  async destroy(_storageKey: string): Promise<void> {
    return;
  }
}
