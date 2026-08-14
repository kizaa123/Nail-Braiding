import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, '.data', 'pglite');
await mkdir(dataDir, { recursive: true });

const db = await PGlite.create({ dataDir });
const server = new PGLiteSocketServer({
  db,
  host: '127.0.0.1',
  port: 5432,
});

await server.start();
console.log('Local PGlite ready on postgresql://postgres@127.0.0.1:5432/postgres');

const stop = async () => {
  await server.stop();
  await db.close();
  process.exit(0);
};

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
