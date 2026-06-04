// Generates the Lumble app icon — three lens shapes on a dark background.
// Zero external dependencies: uses only Node.js built-ins (zlib, fs).
import zlib from "node:zlib";
import fs   from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const deflate = promisify(zlib.deflate);

// ─── Config ───────────────────────────────────────────────────────────────────

const W = 1024, H = 1024;

// Background: deep purple-black
const BG = [8, 6, 17];

// Gradient: #E85C7A → #B855E0 (pink → purple)
function gradColor(yFrac) {
  const t = Math.max(0, Math.min(1, yFrac));
  return [
    Math.round(232 + (184 - 232) * t),
    Math.round(92  + (85  - 92)  * t),
    Math.round(122 + (224 - 122) * t),
  ];
}

// ─── Pixel buffer ─────────────────────────────────────────────────────────────

const pixels = new Uint8Array(W * H * 4);

// Fill background
for (let i = 0; i < W * H; i++) {
  pixels[i * 4]     = BG[0];
  pixels[i * 4 + 1] = BG[1];
  pixels[i * 4 + 2] = BG[2];
  pixels[i * 4 + 3] = 255;
}

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 4;
  pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b; pixels[i+3] = a;
}

// ─── Draw lens shape ───────────────────────────────────────────────────────────
// Uses anti-aliased edge: pixels at the boundary are blended by coverage.

function drawLens(cx, cy, rx, ry) {
  const y0 = Math.floor(cy - ry) - 1;
  const y1 = Math.ceil(cy + ry)  + 1;

  for (let y = y0; y <= y1; y++) {
    const t = (y - cy) / ry;
    if (Math.abs(t) > 1.0) continue;

    const hw = rx * Math.sqrt(1 - t * t);  // half-width at this y
    const xLeft  = cx - hw;
    const xRight = cx + hw;

    const yFrac = y / H;
    const [r, g, b] = gradColor(yFrac);

    // Fill solid pixels between the boundaries
    for (let x = Math.ceil(xLeft); x <= Math.floor(xRight); x++) {
      setPixel(x, y, r, g, b);
    }

    // Anti-alias left edge
    const leftFrac = Math.ceil(xLeft) - xLeft;
    if (leftFrac > 0) {
      const xa = Math.floor(xLeft);
      const alpha = Math.round(leftFrac * 255);
      const i = (y * W + xa) * 4;
      if (xa >= 0 && xa < W) {
        pixels[i]   = Math.round(pixels[i]   * (1 - leftFrac) + r * leftFrac);
        pixels[i+1] = Math.round(pixels[i+1] * (1 - leftFrac) + g * leftFrac);
        pixels[i+2] = Math.round(pixels[i+2] * (1 - leftFrac) + b * leftFrac);
      }
    }

    // Anti-alias right edge
    const rightFrac = xRight - Math.floor(xRight);
    if (rightFrac > 0) {
      const xa = Math.ceil(xRight);
      if (xa >= 0 && xa < W) {
        const i = (y * W + xa) * 4;
        pixels[i]   = Math.round(pixels[i]   * (1 - rightFrac) + r * rightFrac);
        pixels[i+1] = Math.round(pixels[i+1] * (1 - rightFrac) + g * rightFrac);
        pixels[i+2] = Math.round(pixels[i+2] * (1 - rightFrac) + b * rightFrac);
      }
    }
  }
}

// ─── Three lens shapes (proportions matched to original logo) ─────────────────
// Canvas 1024×1024. Original reference was ~1080×1080.

//         cx   cy   rx   ry
drawLens(  256, 488,  50, 368);   // left  — tall, slightly upper
drawLens(  512, 512,  60, 158);   // center — shorter, centered
drawLens(  768, 518,  50, 368);   // right  — tall, slightly lower

// ─── PNG encoder (pure Node.js) ───────────────────────────────────────────────

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (const byte of buf) {
    crc ^= byte;
    for (let k = 0; k < 8; k++) {
      crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const len = Buffer.allocUnsafe(4);
  len.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([len, typeBytes, data, crcBuf]);
}

async function encodePng() {
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(W,  0);
  ihdr.writeUInt32BE(H,  4);
  ihdr[8]  = 8;  // bit depth
  ihdr[9]  = 6;  // RGBA
  ihdr[10] = 0;  // compression: deflate
  ihdr[11] = 0;  // filter: adaptive
  ihdr[12] = 0;  // interlace: none

  // Raw image: 1 filter byte (0 = None) per scanline, then RGBA row data
  const rows = [];
  for (let y = 0; y < H; y++) {
    rows.push(Buffer.from([0]));
    rows.push(Buffer.from(pixels.buffer, y * W * 4, W * 4));
  }
  const raw        = Buffer.concat(rows);
  const compressed = await deflate(raw, { level: 9 });

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),  // PNG signature
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ─── Write files ──────────────────────────────────────────────────────────────

const pngData = await encodePng();

const targets = [
  "artifacts/afterglow/assets/images/icon.png",
  "artifacts/afterglow/assets/images/splash.png",
];

for (const target of targets) {
  const dest = path.resolve(process.cwd(), target);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, pngData);
  console.log(`✓ wrote ${target}`);
}

console.log("Done — logo generated at 1024×1024.");
