import { dbListStyles } from '@/lib/studio-db';
import { studioCloudConfigured } from '@/lib/supabase-admin';
import type { StudioStyle } from '@/lib/studio-styles';

export async function loadPublicStyles(): Promise<StudioStyle[]> {
  if (!studioCloudConfigured()) return [];
  try {
    return await Promise.race([
      dbListStyles('public').then((rows) => rows ?? []),
      new Promise<StudioStyle[]>((_, reject) => {
        setTimeout(() => reject(new Error('Catalog lookup timed out.')), 8000);
      }),
    ]);
  } catch {
    return [];
  }
}
