import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import pngToIco from 'png-to-ico'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const logoPath = path.join(root, 'public/logo.svg')
const outDir = path.join(root, 'public')

const SPECS = [
  [16, 'favicon-16x16.png'],
  [32, 'favicon-32x32.png'],
  [48, 'favicon-48x48.png'],
  [64, 'favicon-64x64.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'android-chrome-192x192.png'],
  [512, 'android-chrome-512x512.png'],
]

async function makeSquare(size, filename) {
  const maxW = Math.round(size * 0.88)
  const maxH = Math.round(size * 0.55)
  const rendered = await sharp(logoPath, { density: 600 })
    .resize({
      width: maxW,
      height: maxH,
      fit: 'inside',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .ensureAlpha()
    .png()
    .toBuffer()

  const meta = await sharp(rendered).metadata()
  const left = Math.max(0, Math.floor((size - (meta.width ?? size)) / 2))
  const top = Math.max(0, Math.floor((size - (meta.height ?? size)) / 2))

  const out = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: rendered, left, top }])
    .png({ compressionLevel: 9 })
    .toBuffer()

  writeFileSync(path.join(outDir, filename), out)
  console.log(`✓ ${filename} (${size}×${size})`)
  return path.join(outDir, filename)
}

const icoSources = []
for (const [size, name] of SPECS) {
  const filePath = await makeSquare(size, name)
  if ([16, 32, 48].includes(size)) icoSources.push(filePath)
}
await makeSquare(32, 'icon.png')

const ico = await pngToIco(icoSources)
writeFileSync(path.join(outDir, 'favicon.ico'), ico)
console.log(`✓ favicon.ico (${ico.length} bytes)`)
