import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const svgPath = resolve(import.meta.dirname!, '../public/icons/icon.svg');
const svg = readFileSync(svgPath);

async function generate() {
  await sharp(svg).resize(192, 192).png().toFile(resolve(import.meta.dirname!, '../public/icons/icon-192.png'));
  await sharp(svg).resize(512, 512).png().toFile(resolve(import.meta.dirname!, '../public/icons/icon-512.png'));
  console.log('Icons generated: icon-192.png, icon-512.png');
}

generate();
