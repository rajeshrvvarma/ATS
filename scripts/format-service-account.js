#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

function usage() {
  console.log('Usage: node scripts/format-service-account.js <path-to-service-account.json>');
  process.exit(1);
}

const file = process.argv[2];
if (!file) usage();

const abs = path.resolve(process.cwd(), file);
try {
  const raw = fs.readFileSync(abs, 'utf8');
  const obj = JSON.parse(raw);
  const single = JSON.stringify(obj);
  console.log(single);
} catch (err) {
  console.error('Error reading or parsing file:', err.message);
  process.exit(2);
}
