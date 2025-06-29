// server.js или модуль

// Вход: 
// cells - массив из 256 hex цветов (#rrggbb)
// w = 16, h = 16
// outputWidth = 460, outputHeight = 460

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  const bigint = parseInt(hex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getInterpolatedColor(cells, w, h, px, py) {
  const x0 = Math.floor(px);
  const y0 = Math.floor(py);
  const x1 = Math.min(x0 + 1, w - 1);
  const y1 = Math.min(y0 + 1, h - 1);

  const tx = px - x0;
  const ty = py - y0;

  const c00 = hexToRgb(cells[y0 * w + x0]);
  const c10 = hexToRgb(cells[y0 * w + x1]);
  const c01 = hexToRgb(cells[y1 * w + x0]);
  const c11 = hexToRgb(cells[y1 * w + x1]);

  const r0 = lerp(c00[0], c10[0], tx);
  const r1 = lerp(c01[0], c11[0], tx);
  const g0 = lerp(c00[1], c10[1], tx);
  const g1 = lerp(c01[1], c11[1], tx);
  const b0 = lerp(c00[2], c10[2], tx);
  const b1 = lerp(c01[2], c11[2], tx);

  const r = Math.round(lerp(r0, r1, ty));
  const g = Math.round(lerp(g0, g1, ty));
  const b = Math.round(lerp(b0, b1, ty));
  const a = 255;

  return [r, g, b, a];
}

/**
 * Преобразует сетку 16x16 цветов в массив 460x460 пикселей RGBA с билинейной интерполяцией
 * @param {string[]} cells массив hex цветов длиной w*h (256)
 * @param {number} w ширина сетки (16)
 * @param {number} h высота сетки (16)
 * @param {number} outputWidth ширина выходного изображения (460)
 * @param {number} outputHeight высота выходного изображения (460)
 * @returns {number[]} массив RGBA для 460x460 пикселей (length = 460*460*4)
 */
export default function generateInterpolatedImage(cells, w, h, outputWidth, outputHeight) {
  const output = new Uint8Array(outputWidth * outputHeight * 4);

  for (let py = 0; py < outputHeight; py++) {
    for (let px = 0; px < outputWidth; px++) {
      // координаты в сетке от 0 до w-1/h-1
      const gx = (px / (outputWidth - 1)) * (w - 1);
      const gy = (py / (outputHeight - 1)) * (h - 1);

      const [r, g, b, a] = getInterpolatedColor(cells, w, h, gx, gy);

      const idx = (py * outputWidth + px) * 4;
      output[idx] = r;
      output[idx + 1] = g;
      output[idx + 2] = b;
      output[idx + 3] = a;
    }
  }

  return output;
}


// --- пример использования ---

// const cells = ["#ffffff", "#f94144", ... ]; // 256 элементов
// const w = 16;
// const h = 16;
// const outputWidth = 460;
// const outputHeight = 460;

// const rgbaArray = generateInterpolatedImage(cells, w, h, outputWidth, outputHeight);

// Чтобы вернуть в API, например:
// res.json({ width: outputWidth, height: outputHeight, data: Array.from(rgbaArray) });