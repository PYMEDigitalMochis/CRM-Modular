import { readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve, dirname } from 'node:path';
const base = new URL('../src/', import.meta.url).pathname;
const files = [];
async function walk(dir) { for (const e of await readdir(dir, { withFileTypes: true })) { const p = join(dir, e.name); if (e.isDirectory()) await walk(p); else if (/\.(ts|tsx)$/.test(e.name)) files.push(p); } }
await walk(base);
const violations = [];
for (const file of files) {
  const location = relative(base, file).replaceAll('\\', '/');
  const content = await readFile(file, 'utf8');
  const imports = [...content.matchAll(/(?:from\s*|import\s*\()['"]([^'"]+)['"]/g)].map(x => x[1]);
  for (const dep of imports) {
    if (location.startsWith('core/') && dep.includes('/modules/')) violations.push(`${location}: core importa módulo`);
    if (location.startsWith('modules/') && dep.includes('/adapters/')) violations.push(`${location}: módulo importa proveedor`);
    if (location.startsWith('modules/') && dep.startsWith('.') && relative(base, resolve(dirname(file), dep)).replaceAll('\\', '/').startsWith('modules/') && !relative(base, resolve(dirname(file), dep)).replaceAll('\\', '/').startsWith(location.split('/').slice(0,2).join('/') + '/')) violations.push(`${location}: dependencia entre módulos`);
  }
}
if (violations.length) { console.error(violations.join('\n')); process.exitCode = 1; }
else console.log(`OK: ${files.length} archivos TS/TSX examinados; sin violaciones detectadas.`);