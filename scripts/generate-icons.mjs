/**
 * Génère icon-192.png et icon-512.png dans public/icons/.
 * Pure Node.js, aucune dépendance npm.
 * Fond indigo #6366f1, lettre "D" blanche centrée.
 */

import zlib from 'zlib'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/icons')
fs.mkdirSync(outDir, { recursive: true })

// ── helpers PNG ──────────────────────────────────────────────────────────────

function crc32(buf) {
  const table = crc32.table ??= (() => {
    const t = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
      let c = i
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      t[i] = c
    }
    return t
  })()
  let c = 0xffffffff
  for (const b of buf) c = table[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const len = Buffer.allocUnsafe(4); len.writeUInt32BE(data.length)
  const crcInput = Buffer.concat([typeBytes, data])
  const crcBuf = Buffer.allocUnsafe(4); crcBuf.writeUInt32BE(crc32(crcInput))
  return Buffer.concat([len, typeBytes, data, crcBuf])
}

function makePng(size, drawPixel) {
  // IHDR
  const ihdr = Buffer.allocUnsafe(13)
  ihdr.writeUInt32BE(size, 0)   // width
  ihdr.writeUInt32BE(size, 4)   // height
  ihdr[8]  = 8   // bit depth
  ihdr[9]  = 2   // color type: RGB
  ihdr[10] = 0   // compression
  ihdr[11] = 0   // filter
  ihdr[12] = 0   // interlace

  // Raw scanlines (filter byte 0 + RGB per pixel)
  const raw = Buffer.allocUnsafe(size * (1 + size * 3))
  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 3)] = 0 // filter None
    for (let x = 0; x < size; x++) {
      const [r, g, b] = drawPixel(x, y, size)
      const off = y * (1 + size * 3) + 1 + x * 3
      raw[off] = r; raw[off + 1] = g; raw[off + 2] = b
    }
  }

  const idat = zlib.deflateSync(raw, { level: 9 })
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([PNG_SIG, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

// ── dessin ───────────────────────────────────────────────────────────────────

// Pixels du glyphe "D" sur grille 7×9 (colonne-major pour lisibilité)
const D_GLYPH = [
  [0,1,1,1,1,0,0],
  [0,1,0,0,0,1,0],
  [0,1,0,0,0,0,1],
  [0,1,0,0,0,0,1],
  [0,1,0,0,0,0,1],
  [0,1,0,0,0,0,1],
  [0,1,0,0,0,1,0],
  [0,1,1,1,1,0,0],
  [0,0,0,0,0,0,0],
]
// 9 lignes × 7 colonnes

function drawPixel(x, y, size) {
  const BG  = [0x63, 0x66, 0xf1]   // indigo-500
  const FG  = [0xff, 0xff, 0xff]   // blanc

  const glyphW = 7, glyphH = 9
  const scale = Math.max(1, Math.round(size / 24))
  const totalW = glyphW * scale, totalH = glyphH * scale
  const offX = Math.floor((size - totalW) / 2)
  const offY = Math.floor((size - totalH) / 2)

  const lx = x - offX, ly = y - offY
  if (lx >= 0 && lx < totalW && ly >= 0 && ly < totalH) {
    const col = Math.floor(lx / scale)
    const row = Math.floor(ly / scale)
    if (D_GLYPH[row]?.[col]) return FG
  }

  // Coins arrondis (rayon = 22% de la taille)
  const r = size * 0.22
  const cx = size / 2, cy = size / 2
  const dx = Math.abs(x - cx) - (cx - r), dy = Math.abs(y - cy) - (cy - r)
  if (dx > 0 && dy > 0 && Math.hypot(dx, dy) > r) return [0xf9, 0xfa, 0xfb] // gris très clair = hors icône (transparent simulé)

  return BG
}

// ── export ───────────────────────────────────────────────────────────────────

for (const size of [192, 512]) {
  const buf = makePng(size, drawPixel)
  const dest = path.join(outDir, `icon-${size}.png`)
  fs.writeFileSync(dest, buf)
  console.log(`✓  ${dest}  (${(buf.length / 1024).toFixed(1)} KB)`)
}
