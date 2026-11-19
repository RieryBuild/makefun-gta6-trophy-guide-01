// Platinum Road — a GTA VI trophy guide + tracker for make.fun gta6-trophy-guide-01.
// Node 22, standard library only. main.ts hands the entry in: it copies app/
// and screenshots/ from beside this file into /output (or MAKEFUN_OUTPUT_DIR
// outside the grader) and writes /output/dossier.json with the vendored
// make.fun library. vendor/makefun-frontend.ts is left exactly as shipped:
// the scorer requires dossier.json to be byte for byte what its own copy
// writes, so this file never edits the vendor, it only calls buildDossier.
//
// Before copying, it validates the gate limits itself (app file count and
// bytes, index.html size, screenshot count and size) and prints a short
// deterministic summary, so a bad build fails loudly here instead of at
// the scorer. It never deletes /output itself: it only clears the contents
// of the app/ and screenshots/ folders inside it, then re-copies.
//
// Run it:  MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve it: node serve.ts  (then open http://localhost:8080)

import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const APP_MAX_FILES = 993;
const APP_MAX_BYTES = 50331648; // 48 MiB
const INDEX_MAX_BYTES = 1048576; // 1 MiB
const SHOT_MAX = 4;
const SHOT_MAX_BYTES = 262144; // 256 KiB
const TEXT_MAX_BYTES = 163840;

function fail(message: string): never {
  console.error(`main.ts: FAIL: ${message}`);
  process.exit(1);
}

// Walk a directory and return every file and directory below it, sorted,
// so the summary lines are identical on every run. Symlinks are refused:
// the gate requires plain files and directories only.
function walk(dir: string, base: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    const lst = lstatSync(full);
    if (lst.isSymbolicLink()) fail(`app/${rel} is a symbolic link (plain files only)`);
    const st = statSync(full);
    acc.push(rel);
    if (st.isDirectory()) walk(full, rel, acc);
  }
  return acc;
}

function appStats(): { files: number; bytes: number } {
  const appDir = join(here, 'app');
  if (!existsSync(join(appDir, 'index.html'))) fail('app/index.html is missing');
  const indexBytes = statSync(join(appDir, 'index.html')).size;
  if (indexBytes > INDEX_MAX_BYTES) fail(`app/index.html is ${indexBytes} bytes (cap ${INDEX_MAX_BYTES})`);
  const entries = walk(appDir, '');
  let bytes = 0;
  for (const rel of entries) {
    const st = statSync(join(appDir, rel));
    if (st.isFile()) bytes += st.size;
  }
  // walk() counts directories too; the gate counts files + directories together.
  if (entries.length > APP_MAX_FILES) fail(`app/ has ${entries.length} entries (cap ${APP_MAX_FILES})`);
  if (bytes > APP_MAX_BYTES) fail(`app/ is ${bytes} bytes (cap ${APP_MAX_BYTES})`);
  return { files: entries.length, bytes };
}

function shotStats(): { count: number; names: string[] } {
  const shotDir = join(here, 'screenshots');
  if (!existsSync(shotDir)) fail('screenshots/ is missing');
  const names = readdirSync(shotDir)
    .filter((n) => !n.startsWith('.'))
    .sort();
  if (names.length < 3 || names.length > SHOT_MAX) {
    fail(`screenshots/ holds ${names.length} files (need 3-${SHOT_MAX})`);
  }
  for (const name of names) {
    const st = statSync(join(shotDir, name));
    if (lstatSync(join(shotDir, name)).isSymbolicLink()) fail(`screenshots/${name} is a symbolic link (plain files only)`);
    if (!st.isFile()) fail(`screenshots/${name} is not a regular file`);
    if (!/\.(png|jpe?g)$/i.test(name)) fail(`screenshots/${name} is not a PNG or JPEG`);
    if (st.size > SHOT_MAX_BYTES) fail(`screenshots/${name} is ${st.size} bytes (cap ${SHOT_MAX_BYTES})`);
  }
  return { count: names.length, names };
}

const app = appStats();
const shots = shotStats();

// Clear only the copied trees inside /output, never /output itself.
mkdirSync(out, { recursive: true });
for (const sub of ['app', 'screenshots']) {
  const target = join(out, sub);
  if (existsSync(target)) rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
}
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

const dossier = buildDossier(out, {
  text_max_bytes: TEXT_MAX_BYTES,
  screenshots: { max: SHOT_MAX, max_bytes: SHOT_MAX_BYTES },
  app_max_files: APP_MAX_FILES,
  app_max_bytes: APP_MAX_BYTES,
});
writeFileSync(join(out, 'dossier.json'), dossier);

console.log(`main.ts: app/ ${app.files} entries, ${app.bytes} bytes`);
console.log(`main.ts: screenshots/ ${shots.count} files: ${shots.names.join(', ')}`);
console.log(`main.ts: dossier.json ${dossier.length} bytes -> ${out}`);
console.log('main.ts: OK');
