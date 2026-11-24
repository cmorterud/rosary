import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

// Files the site never needs offline: browsers that can run the service worker
// all read WOFF2, and the share image is only fetched by link previews.
const onlineOnly = (file: string) => file === 'sw.js' || file.endsWith('.woff') || file.endsWith('.map') || file === 'social-preview.png';

// Writes sw.js from src/service-worker.js with the list of built files to keep
// on the device and a version that changes whenever any of them does.
function offline(): Plugin {
  let root = '';
  let outDir = '';
  const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
    .flatMap(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
  return {
    name: 'offline-service-worker',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const files = walk(outDir).map(path => relative(outDir, path).split(sep).join('/')).filter(file => !onlineOnly(file)).sort();
      const template = readFileSync(resolve(root, 'src/service-worker.js'), 'utf8');
      const hash = createHash('sha256').update(template);
      for (const file of files) hash.update(file).update(readFileSync(join(outDir, file)));
      const worker = template
        .replace('__VERSION__', hash.digest('hex').slice(0, 16))
        .replace('__FILES__', JSON.stringify(files.map(file => file === 'index.html' ? './' : file)));
      writeFileSync(join(outDir, 'sw.js'), worker);
    },
  };
}

// Relative assets work both at /rosary/ on Pages and at a custom domain's root.
export default defineConfig({ base: './', plugins: [offline()] });
