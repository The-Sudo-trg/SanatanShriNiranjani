// Generates PWA icons (saffron field + gold ॐ-disc) without a canvas dependency.
// Raw PNG encoder: IHDR + IDAT (zlib) + IEND, 8-bit RGB.
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(size) {
  const S = size;
  const px = Buffer.alloc(S * S * 3);
  const cx = S / 2, cy = S / 2, rOuter = S * 0.32, rInner = S * 0.24;
  for (let y = 0; y < S; y++) {
    px[y * S * 3] = 0; // row filter byte handled below — offset trick instead
  }
  const raw = Buffer.alloc(S * (S * 3 + 1));
  for (let y = 0; y < S; y++) {
    raw[y * (S * 3 + 1)] = 0; // filter: none
    for (let x = 0; x < S; x++) {
      const dist = Math.hypot(x - cx, y - cy);
      let r = 0xff, g = 0x67, b = 0x00; // saffron #FF6700
      if (dist <= rOuter) {
        r = 0xff; g = 0xd7; b = 0x00; // gold #FFD700
        if (dist <= rInner) {
          r = 0x4a; g = 0x15; b = 0x00; // maroon #4A1500 core
        }
      }
      const o = y * (S * 3 + 1) + 1 + x * 3;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(S, 0);
  ihdr.writeUInt32BE(S, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit, truecolor
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync("public/icons", { recursive: true });
writeFileSync("public/icons/icon-192.png", png(192));
writeFileSync("public/icons/icon-512.png", png(512));
console.log("✅ PWA icons generated (192/512)");
