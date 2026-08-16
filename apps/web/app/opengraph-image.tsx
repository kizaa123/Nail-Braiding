import { ImageResponse } from 'next/og';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = "KAS Beauty Plus — adding values to God's creation";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function logoFile() {
  const local = join(process.cwd(), 'public/kas-beauty-plus-logo.png');
  if (existsSync(local)) return local;
  return join(process.cwd(), 'apps/web/public/kas-beauty-plus-logo.png');
}

export default async function OpenGraphImage() {
  const logo = await readFile(logoFile());
  const src = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#171211',
        }}
      >
        <img src={src} width={360} height={360} style={{ borderRadius: 180 }} />
        <div
          style={{
            marginTop: 28,
            color: '#F4E6C3',
            fontSize: 44,
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          KAS Beauty Plus
        </div>
        <div style={{ marginTop: 12, color: '#C9A46A', fontSize: 26 }}>
          adding values to God's creation
        </div>
      </div>
    ),
    { ...size },
  );
}
