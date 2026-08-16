import { dbListStyles } from '@/lib/studio-db';
import { studioCloudConfigured } from '@/lib/supabase-admin';
import type { StudioStyle } from '@/lib/studio-styles';

export async function loadPublicStyles(): Promise<StudioStyle[]> {
  if (!studioCloudConfigured()) return [];
  try {
    return (await dbListStyles('public')) ?? [];
  } catch {
    return [];
  }
}
