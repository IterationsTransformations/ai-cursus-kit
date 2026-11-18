// beelden.mjs -- beeldtool van de cursuskit (De Complete AI Opleiding: van A tot I).
//
// Maakt beelden met FLUX 3 Klein via OpenRouter. Leest de OpenRouter-sleutel uit
// openrouter_key.txt op het bureaublad (Windows, ook onder OneDrive; Mac: ~/Desktop),
// en toont of logt de sleutel nooit.
// Alleen ingebouwde Node.js-modules: niets te installeren.
//
// Gebruik (zie LEESMIJ.md):
//   node cursuskit/beelden.mjs --lijst taken.json
//   node cursuskit/beelden.mjs --prompt "..." --out pad/naam.png [--aspect 16:9] [--max 1024] [--geen-transparant]
//
// taken.json is een JSON-array, hoogstens 12 beelden per keer:
//   [{ "prompt": "...", "out": "pad/naam.png", "aspect": "1:1", "max": 512, "transparant": true }, ...]

import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const MODEL = 'black-forest-labs/flux-3-image-klein';
const ENDPOINT = 'https://openrouter.ai/api/v1/images';

// Harde bovengrens voor deze opdracht (de opdracht staat maximaal 12 beelden toe).
const MAX_BEELDEN = 12;

/* ------------------------------------------------------------------ sleutel */

/** Zoek openrouter_key.txt: eerst in de werkmap, daarna op het bureaublad (ook onder OneDrive\\Desktop). */
function findKeyFile() {
  const home = homedir();
  const hier = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(process.cwd(), 'openrouter_key.txt'),
    join(hier, '..', 'openrouter_key.txt'),
    join(hier, 'openrouter_key.txt'),
    join(home, 'Desktop', 'openrouter_key.txt'),
    join(home, 'OneDrive', 'Desktop', 'openrouter_key.txt'),
    process.env.OneDrive ? join(process.env.OneDrive, 'Desktop', 'openrouter_key.txt') : null,
    process.env.OneDriveCommercial
      ? join(process.env.OneDriveCommercial, 'Desktop', 'openrouter_key.txt')
      : null,
  ].filter(Boolean);
  for (const c of candidates) if (existsSync(c)) return c;
  throw new Error('openrouter_key.txt niet gevonden. Zet het bestand in je werkmap (de map waarin cursuskit staat) of op je bureaublad.');
}

function readKey() {
  const keyPath = findKeyFile();
  // Bestand kan een BOM, witruimte of "KEY=..." bevatten; normaliseren zonder ooit te loggen.
  let raw = readFileSync(keyPath, 'utf8').replace(/^\uFEFF/, '');
  raw = raw.split(/\r?\n/).find((l) => l.trim() && !l.trim().startsWith('#')) ?? '';
  raw = raw.trim().replace(/^[A-Za-z0-9_]*\s*=\s*/, '').trim();
  const key = raw.replace(/^["']|["']$/g, '').trim();
  if (!key) throw new Error('Geen bruikbare sleutel gevonden in het sleutelbestand.');
  return key;
}

/* ------------------------------------------------------------------- PNG in */

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function isPng(buf) {
  return buf.length > 8 && buf.subarray(0, 8).equals(PNG_SIG);
}

function isJpeg(buf) {
  return buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}

function crc32(buf) {
  let c;
  const table = crc32.table ?? (crc32.table = (() => {
    const t = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c;
    }
    return t;
  })());
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

/**
 * Schrijf een PNG met RGBA-pixels (niet-gefilterde scanlijnen, filter 0).
 * Alleen 'deflate'-opslag (level 0) van zlib: geen compressie, wel geldig.
 * Voor sprites van ~1024x1024 is dat enkele MB; dat is acceptabel.
 */
function writePngRGBA(path, width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const o = y * (width * 4 + 1);
    raw[o] = 0; // filter: none
    rgba.copy(raw, o + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bitdiepte
  ihdr[9] = 6; // kleurtype RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const png = Buffer.concat([
    PNG_SIG,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlibDeflate(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  writeFileSync(path, png);
  return png.length;
}

/** zlib 'deflate' met opgeslagen blokken (geen compressie), zodat we geen zlib nodig hebben. */
function zlibDeflate(buf) {
  const blocks = [];
  const MAX = 65535;
  const adler = adler32(buf);
  blocks.push(Buffer.from([0x78, 0x01])); // zlib-header, geen preset dictionary
  for (let off = 0; off < buf.length; off += MAX) {
    const len = Math.min(MAX, buf.length - off);
    const final = off + len >= buf.length ? 1 : 0;
    const head = Buffer.alloc(5);
    head[0] = final;
    head.writeUInt16LE(len, 1);
    head.writeUInt16LE(~len & 0xffff, 3);
    blocks.push(head, buf.subarray(off, off + len));
  }
  if (buf.length === 0) {
    const head = Buffer.alloc(5);
    head[0] = 1;
    blocks.push(head);
  }
  const ad = Buffer.alloc(4);
  ad.writeUInt32BE(adler, 0);
  blocks.push(ad);
  return Buffer.concat(blocks);
}

function adler32(buf) {
  let a = 1, b = 0;
  for (let i = 0; i < buf.length; i++) {
    a = (a + buf[i]) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}

/* ------------------------------------------------------------------ JPEG in */

/*
 * Kleine baseline-JPEG-decoder (SOF0/SOF1, 8-bit, 1 of 3 componenten, geen
 * progressief, geen restart markers behalve RSTn die we netjes overslaan).
 * Dit is expres compact gehouden: genoeg voor de beelden van OpenRouter.
 */
function decodeJpeg(buf) {
  let p = 2; // skip SOI
  const qt = new Map();
  const huffDC = new Map();
  const huffAC = new Map();
  let frame = null;
  let restartInterval = 0;
  let scan = null;
  const components = new Map();

  const u8 = buf;
  const u16 = (i) => (u8[i] << 8) | u8[i + 1];

  function readHuffmanTable(i, cls, id) {
    const counts = new Uint8Array(16);
    let total = 0;
    for (let k = 0; k < 16; k++) { counts[k] = u8[i + 1 + k]; total += counts[k]; }
    const symbols = new Uint8Array(total);
    for (let k = 0; k < total; k++) symbols[k] = u8[i + 1 + 16 + k];
    // Opbouwen van een tabel: code -> (lengte, symbool)
    const map = new Map();
    let code = 0, k = 0;
    for (let len = 1; len <= 16; len++) {
      for (let n = 0; n < counts[len - 1]; n++) {
        map.set(`${len}:${code}`, symbols[k++]);
        code++;
      }
      code <<= 1;
    }
    const target = cls === 0 ? huffDC : huffAC;
    target.set(id, map);
    return i + 1 + 16 + total;
  }

  while (p < u8.length) {
    if (u8[p] !== 0xff) { p++; continue; }
    let marker = u8[p + 1];
    p += 2;
    while (marker === 0xff) { marker = u8[p]; p++; }
    if (marker === 0xd8 || marker === 0x01) continue;
    if (marker === 0xd9) break;
    const len = u16(p);
    const seg = p + 2;
    if (marker === 0xdb) {
      let i = seg;
      const end = p + len;
      while (i < end) {
        const pq = u8[i] >> 4, tq = u8[i] & 15;
        i++;
        const table = new Uint16Array(64);
        for (let k = 0; k < 64; k++) {
          if (pq) { table[k] = u16(i); i += 2; } else { table[k] = u8[i]; i += 1; }
        }
        qt.set(tq, table);
      }
    } else if (marker === 0xc4) {
      let i = seg;
      const end = p + len;
      while (i < end) {
        const cls = u8[i] >> 4, id = u8[i] & 15;
        i = readHuffmanTable(i, cls, id);
      }
    } else if (marker === 0xc0 || marker === 0xc1) {
      const prec = u8[seg];
      if (prec !== 8) throw new Error('JPEG: alleen 8-bit precisie wordt ondersteund.');
      frame = { h: u16(seg + 1), w: u16(seg + 3), comps: [] };
      const nc = u8[seg + 5];
      let i = seg + 6;
      for (let c = 0; c < nc; c++) {
        frame.comps.push({ id: u8[i], hs: u8[i + 1] >> 4, vs: u8[i + 1] & 15, tq: u8[i + 2] });
        i += 3;
      }
    } else if (marker === 0xc2) {
      throw new Error('Progressieve JPEG wordt niet ondersteund door deze decoder.');
    } else if (marker === 0xdd) {
      restartInterval = u16(seg);
    } else if (marker === 0xda) {
      const ns = u8[seg];
      scan = [];
      let i = seg + 1;
      for (let s = 0; s < ns; s++) {
        scan.push({ id: u8[i], dc: u8[i + 1] >> 4, ac: u8[i + 1] & 15 });
        i += 2;
      }
      p = p + len; // entropiedata begint hier
      break;
    }
    p = p + len;
  }

  if (!frame || !scan) throw new Error('JPEG: geen frame of scan gevonden.');

  for (const c of frame.comps) {
    const s = scan.find((x) => x.id === c.id) ?? scan[0];
    components.set(c.id, {
      ...c,
      dc: huffDC.get(s.dc) ?? huffDC.get(0),
      ac: huffAC.get(s.ac) ?? huffAC.get(0),
      quant: qt.get(c.tq) ?? qt.get(0),
      pred: 0,
    });
  }

  const maxH = Math.max(...frame.comps.map((c) => c.hs));
  const maxV = Math.max(...frame.comps.map((c) => c.vs));
  const mcuW = 8 * maxH, mcuH = 8 * maxV;
  const mcusX = Math.ceil(frame.w / mcuW), mcusY = Math.ceil(frame.h / mcuH);

  const ZIGZAG = new Uint8Array([
    0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5,
    12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28,
    35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51,
    58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63,
  ]);

  // Bitreader over de entropiedata, met destuffing van 0xFF00.
  let bitPos = 0;
  const dataStart = p;
  function nextByte(reader) {
    if (reader.i >= u8.length) return null;
    let b = u8[reader.i++];
    if (b === 0xff) {
      const nxt = u8[reader.i];
      if (nxt === 0x00) reader.i++;
      else if (nxt >= 0xd0 && nxt <= 0xd7) { reader.i++; return nextByte(reader); }
      else return null;
    }
    return b;
  }

  let bitBuf = 0, bitCount = 0;
  let eof = false;
  function ensure(n, reader) {
    while (bitCount < n && !eof) {
      const b = nextByte(reader);
      if (b === null) { eof = true; break; }
      bitBuf = (bitBuf << 8) | b;
      bitCount += 8;
    }
  }
  function getBits(n, reader) {
    if (n === 0) return 0;
    ensure(n, reader);
    if (bitCount < n) { eof = true; return 0; }
    bitCount -= n;
    const v = (bitBuf >> bitCount) & ((1 << n) - 1);
    return v;
  }
  function decodeHuff(map, reader) {
    let code = 0;
    for (let len = 1; len <= 16; len++) {
      code = (code << 1) | getBits(1, reader);
      const s = map.get(`${len}:${code}`);
      if (s !== undefined) return s;
    }
    return 0;
  }
  function extend(v, n) {
    if (n === 0) return 0;
    const vt = 1 << (n - 1);
    return v < vt ? v - (1 << n) + 1 : v;
  }

  function decodeBlock(comp, reader, block) {
    // DC
    const t = decodeHuff(comp.dc, reader);
    const diff = t === 0 ? 0 : extend(getBits(t, reader), t);
    comp.pred += diff;
    const dc = comp.pred * comp.quant[0];
    block[0] = dc;
    // AC
    let k = 1;
    while (k < 64) {
      const rs = decodeHuff(comp.ac, reader);
      const r = rs >> 4, s = rs & 15;
      if (s === 0) {
        if (r === 15) { k += 16; continue; }
        break;
      }
      k += r;
      if (k > 63) break;
      const val = extend(getBits(s, reader), s);
      block[ZIGZAG[k]] = val * comp.quant[k];
      k++;
    }
  }

  const reader = { i: dataStart };
  const compData = new Map();
  for (const c of frame.comps) {
    const cw = Math.ceil((frame.w * c.hs) / maxH);
    const ch = Math.ceil((frame.h * c.vs) / maxV);
    compData.set(c.id, { w: cw, h: ch, data: new Float32Array(cw * ch) });
  }

  const block = new Float32Array(64);
  const natural = new Uint8Array(64);
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) natural[y * 8 + x] = y * 8 + x;

  function idct(blk, out) {
    // Eenvoudige, correcte 2D-IDCT (langzaam maar goed genoeg voor eenmalig gebruik).
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        let sum = 0;
        for (let v = 0; v < 8; v++) {
          const cv = v === 0 ? Math.SQRT1_2 : 1;
          for (let u = 0; u < 8; u++) {
            const cu = u === 0 ? Math.SQRT1_2 : 1;
            sum += cu * cv * blk[v * 8 + u] *
              Math.cos(((2 * x + 1) * u * Math.PI) / 16) *
              Math.cos(((2 * y + 1) * v * Math.PI) / 16);
          }
        }
        out[y * 8 + x] = sum / 4 + 128;
      }
    }
  }

  let mcuCount = 0;
  const blockOut = new Float32Array(64);
  for (let my = 0; my < mcusY; my++) {
    for (let mx = 0; mx < mcusX; mx++) {
      if (restartInterval && mcuCount > 0 && mcuCount % restartInterval === 0) {
        bitBuf = 0; bitCount = 0;
        // Zoek de RST-marker en ga er voorbij.
        while (reader.i < u8.length) {
          if (u8[reader.i] === 0xff && u8[reader.i + 1] >= 0xd0 && u8[reader.i + 1] <= 0xd7) {
            reader.i += 2;
            break;
          }
          reader.i++;
        }
        for (const c of frame.comps) components.get(c.id).pred = 0;
      }
      mcuCount++;
      for (const c of frame.comps) {
        const comp = components.get(c.id);
        const cd = compData.get(c.id);
        for (let by = 0; by < c.vs; by++) {
          for (let bx = 0; bx < c.hs; bx++) {
            block.fill(0);
            decodeBlock(comp, reader, block);
            idct(block, blockOut);
            const baseX = (mx * c.hs + bx) * 8;
            const baseY = (my * c.vs + by) * 8;
            for (let y = 0; y < 8; y++) {
              const py = baseY + y;
              if (py >= cd.h) continue;
              for (let x = 0; x < 8; x++) {
                const px = baseX + x;
                if (px >= cd.w) continue;
                const val = blockOut[y * 8 + x];
                cd.data[py * cd.w + px] = val < 0 ? 0 : val > 255 ? 255 : val;
              }
            }
          }
        }
      }
    }
  }

  // Terug naar volledige resolutie (eenvoudige bilineaire upsampling).
  const W = frame.w, H = frame.h;
  const rgba = Buffer.alloc(W * H * 4);
  const comps = frame.comps;
  const sample = (cd, fx, fy) => {
    const x = Math.min(cd.w - 1, Math.max(0, fx));
    const y = Math.min(cd.h - 1, Math.max(0, fy));
    return cd.data[y * cd.w + x];
  };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const o = (y * W + x) * 4;
      if (comps.length === 1) {
        const cd = compData.get(comps[0].id);
        const v = sample(cd, Math.floor((x * comps[0].hs) / maxH), Math.floor((y * comps[0].vs) / maxV));
        rgba[o] = rgba[o + 1] = rgba[o + 2] = v;
        rgba[o + 3] = 255;
      } else {
        const vals = [];
        for (let ci = 0; ci < 3; ci++) {
          const c = comps[ci];
          const cd = compData.get(c.id);
          vals.push(sample(cd, Math.floor((x * c.hs) / maxH), Math.floor((y * c.vs) / maxV)));
        }
        // YCbCr -> RGB (ITU-R BT.601, full range)
        const Y = vals[0], Cb = vals[1] - 128, Cr = vals[2] - 128;
        const r = Y + 1.402 * Cr;
        const g = Y - 0.344136 * Cb - 0.714136 * Cr;
        const b = Y + 1.772 * Cb;
        rgba[o] = r < 0 ? 0 : r > 255 ? 255 : r;
        rgba[o + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
        rgba[o + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
        rgba[o + 3] = 255;
      }
    }
  }
  return { width: W, height: H, rgba };
}

/* ------------------------------------------------------- transparant maken */

/**
 * Maak de effen achtergrond transparant:
 * flood fill vanaf de rand, met tolerantie, plus een zachte rand (alpha-ramp)
 * zodat pluizige randen niet gaan kartelen.
 */
function makeTransparent(img, tolerance = 34, feather = 26) {
  const { width: W, height: H, rgba } = img;
  const at = (x, y) => (y * W + x) * 4;
  // Achtergrondkleur = mediaan van de randpixels (ruwe schatting).
  const samples = [];
  for (let x = 0; x < W; x += Math.max(1, Math.floor(W / 64))) {
    samples.push([x, 0], [x, H - 1]);
  }
  for (let y = 0; y < H; y += Math.max(1, Math.floor(H / 64))) {
    samples.push([0, y], [W - 1, y]);
  }
  const avg = [0, 0, 0];
  for (const [x, y] of samples) {
    const o = at(x, y);
    avg[0] += rgba[o]; avg[1] += rgba[o + 1]; avg[2] += rgba[o + 2];
  }
  avg[0] /= samples.length; avg[1] /= samples.length; avg[2] /= samples.length;

  const dist = (o) => {
    const dr = rgba[o] - avg[0], dg = rgba[o + 1] - avg[1], db = rgba[o + 2] - avg[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  // Flood fill vanaf alle randpixels.
  const bg = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = y * W + x;
    if (bg[i]) return;
    if (dist(i * 4) > tolerance) return;
    bg[i] = 1;
    stack.push(x, y);
  };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (stack.length) {
    const y = stack.pop(), x = stack.pop();
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }

  const alpha = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) alpha[i] = bg[i] ? 0 : 255;

  // Rand verzachten: pixels naast transparantie krijgen een alpha op basis van kleurafstand.
  if (feather > 0) {
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        if (bg[i]) continue;
        const nb = bg[i - 1] || bg[i + 1] || bg[i - W] || bg[i + W];
        if (!nb) continue;
        const d = dist(i * 4);
        const t = (d - tolerance) / feather;
        alpha[i] = Math.round(255 * Math.max(0, Math.min(1, t)));
      }
    }
  }

  for (let i = 0; i < W * H; i++) {
    rgba[i * 4 + 3] = alpha[i];
    if (alpha[i] === 0) { rgba[i * 4] = 0; rgba[i * 4 + 1] = 0; rgba[i * 4 + 2] = 0; }
  }
  return img;
}

/** Verklein met boxfilter; houdt het resultaat scherp en klein genoeg voor het spel. */
function downscale(img, maxSize) {
  const { width: W, height: H, rgba } = img;
  if (Math.max(W, H) <= maxSize) return img;
  const scale = maxSize / Math.max(W, H);
  const nw = Math.max(1, Math.round(W * scale));
  const nh = Math.max(1, Math.round(H * scale));
  const out = Buffer.alloc(nw * nh * 4);
  for (let y = 0; y < nh; y++) {
    const sy0 = Math.floor((y * H) / nh), sy1 = Math.max(sy0 + 1, Math.floor(((y + 1) * H) / nh));
    for (let x = 0; x < nw; x++) {
      const sx0 = Math.floor((x * W) / nw), sx1 = Math.max(sx0 + 1, Math.floor(((x + 1) * W) / nw));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = sy0; sy < sy1; sy++) {
        for (let sx = sx0; sx < sx1; sx++) {
          const o = (sy * W + sx) * 4;
          const al = rgba[o + 3] / 255;
          r += rgba[o] * al; g += rgba[o + 1] * al; b += rgba[o + 2] * al;
          a += rgba[o + 3]; n++;
        }
      }
      const o = (y * nw + x) * 4;
      const aw = a / 255;
      out[o] = aw > 0 ? Math.round(r / aw) : 0;
      out[o + 1] = aw > 0 ? Math.round(g / aw) : 0;
      out[o + 2] = aw > 0 ? Math.round(b / aw) : 0;
      out[o + 3] = Math.round(a / n);
    }
  }
  return { width: nw, height: nh, rgba: out };
}

/* ------------------------------------------------------------------- taken */

function parseArgs(argv) {
  const args = { taken: null, prompt: null, out: null, trap: '1K', aspect: '1:1', max: 512, nietTransparant: false, tolerantie: 34, veer: 26 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--lijst') args.taken = argv[++i];
    else if (a === '--prompt') args.prompt = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--trap') args.trap = argv[++i];
    else if (a === '--aspect') args.aspect = argv[++i];
    else if (a === '--max') args.max = parseInt(argv[++i], 10);
    else if (a === '--tolerantie') args.tolerantie = parseFloat(argv[++i]);
    else if (a === '--geen-transparant') args.nietTransparant = true;
  }
  return args;
}

// FLUX 3 Image werkt met resolutietrappen + aspect_ratio, niet met pixelmaten.
const TRAKKEN = ['768', '1K', '1.5K', '2K', '4K'];

function bodyVoor(prompt, trap, aspect) {
  return JSON.stringify({
    model: MODEL,
    prompt,
    n: 1,
    resolution: trap,
    aspect_ratio: aspect,
  });
}

async function genereer(key, prompt, trap, aspect, outPath, transparent, maxSize, tolerantie, veer) {
  const body = bodyVoor(prompt, trap, aspect);
  const started = Date.now();
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body,
    });
  } catch (err) {
    throw new Error(`Netwerkfout: ${err.message}`);
  }
  const text = await res.text();
  const elapsed = (Date.now() - started) / 1000;
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text.slice(0, 500)}`);
  }
  let json;
  try { json = JSON.parse(text); } catch { throw new Error(`Antwoord was geen JSON: ${text.slice(0, 300)}`); }
  const b64 = json?.data?.[0]?.b64_json;
  if (typeof b64 !== 'string' || !b64.length) {
    throw new Error(`Geen data[0].b64_json in het antwoord: ${JSON.stringify(json).slice(0, 300)}`);
  }
  const raw = Buffer.from(b64, 'base64');

  // Formaatdetectie: de naam .png zegt niets over de echte bytes.
  if (!isJpeg(raw) && !isPng(raw)) {
    throw new Error('Onbekend beeldformaat in b64_json (geen JPEG en geen PNG).');
  }

  const result = { bytes: raw.length, bron: isPng(raw) ? 'png' : 'jpeg', tijd: elapsed, usage: json.usage ?? null };
  if (isPng(raw)) {
    // Al PNG: alleen wegschrijven (transparantie laten we aan de bron).
    mkdirSync(dirname(resolve(outPath)), { recursive: true });
    writeFileSync(outPath, raw);
    result.pngBytes = raw.length;
    result.pixels = null;
    return result;
  }

  let img = decodeJpeg(raw);
  if (transparent) makeTransparent(img, tolerantie, veer);
  if (maxSize) img = downscale(img, maxSize);
  mkdirSync(dirname(resolve(outPath)), { recursive: true });
  result.pngBytes = writePngRGBA(outPath, img.width, img.height, img.rgba);
  result.pixels = `${img.width}x${img.height}`;
  return result;
}

const args = parseArgs(process.argv.slice(2));
const key = readKey(); // nooit printen of loggen

let tasks = [];
if (args.taken) {
  tasks = JSON.parse(readFileSync(args.taken, 'utf8'));
} else if (args.prompt && args.out) {
  tasks = [{ prompt: args.prompt, out: args.out }];
} else {
  console.error('Gebruik: node cursuskit/beelden.mjs --lijst taken.json');
  console.error('   of : node cursuskit/beelden.mjs --prompt "..." --out pad.png');
  console.error('Opties: --trap 768|1K|1.5K|2K|4K   --aspect 1:1|16:9|...   --max <px>');
  process.exit(2);
}

if (tasks.length > MAX_BEELDEN) {
  console.error(`Te veel beelden gevraagd: ${tasks.length}, maximum is ${MAX_BEELDEN}.`);
  process.exit(2);
}

let gelukt = 0, mislukt = 0;
const rapport = [];
for (const taak of tasks) {
  const outPath = resolve(taak.out);
  const trap = taak.trap ?? taak.resolution ?? args.trap;
  const aspect = taak.aspect ?? taak.aspect_ratio ?? args.aspect;
  const maxPx = taak.max ?? args.max;
  process.stdout.write(`[${gelukt + mislukt + 1}/${tasks.length}] ${basename(outPath)} ... `);
  try {
    const transparant = taak.transparant ?? !args.nietTransparant;
    const r = await genereer(key, taak.prompt, trap, aspect, outPath, transparant,
      maxPx, taak.tolerantie ?? args.tolerantie, taak.veer ?? args.veer);
    gelukt++;
    console.log(`ok (${r.bron} ${r.bytes} B -> png ${r.pngBytes} B, ${r.pixels ?? '-'}, ${r.tijd.toFixed(1)} s)`);
    writeFileSync(outPath.replace(/\.png$/i, '') + '.prompt.json',
      JSON.stringify({ prompt: taak.prompt, trap, aspect, model: MODEL, usage: r.usage }, null, 2));
    rapport.push({ out: outPath, ok: true, ...r });
  } catch (err) {
    mislukt++;
    console.log(`MISLUKT: ${err.message}`);
    rapport.push({ out: outPath, ok: false, fout: err.message });
  }
}

console.log(`\nklaar: ${gelukt} gelukt, ${mislukt} mislukt.`);
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), 'beelden_rapport.json'), JSON.stringify(rapport, null, 2));
if (mislukt && !gelukt) process.exit(1);
