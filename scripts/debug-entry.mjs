const SAFE_PATTERN = /PORT|SOCK|LSWS|LSNODE|LISTEN|ADDR|HOST|NODE_|LS_/i;

const allKeys = Object.keys(process.env).sort();
const safeEntries = allKeys.filter((key) => SAFE_PATTERN.test(key)).map((key) => `${key}=${process.env[key]}`);

console.log('[debug-entry] all env var names:', JSON.stringify(allKeys));
console.log('[debug-entry] port/socket-related env vars:', JSON.stringify(safeEntries));
console.log('[debug-entry] argv:', JSON.stringify(process.argv));
console.log('[debug-entry] cwd:', process.cwd());

await import('./entry.mjs');
