/**
 * Regenerates all brand assets from the raw exports in public/brand/.
 * The raw logo exports have baked-in gray/glow backgrounds, so we
 * key them out here:
 *  - ink logo:   chroma key  (gray bg has ~zero chroma, violet glyph doesn't)
 *  - white logo: luminance key (bg ~50% gray, glyph ~100% white)
 *  - app icon:   center crop inside the lime rounded square
 *
 * Usage: node scripts/generate-brand-assets.cjs
 */
const sharp = require('sharp')

/**
 * The cleanest glyph edges live inside the app icon (violet on lime),
 * so both transparent marks are derived from it: violet vs lime is a
 * trivial hue key (blue channel dominates only inside the glyph).
 */
async function extractGlyph(color) {
  const { data, info } = await sharp('public/brand/app-icon-src.png')
    .extract({ left: 172, top: 182, width: 680, height: 680 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const [cr, cg, cb] = color
  for (let i = 0; i < data.length; i += 4) {
    const g = data[i + 1]
    const b = data[i + 2]
    const alpha = Math.max(0, Math.min(1, (b - g - 15) / 60))
    data[i] = cr
    data[i + 1] = cg
    data[i + 2] = cb
    data[i + 3] = Math.round(alpha * 255)
  }

  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 10 })
    .png()
}

async function main() {
  // Transparent glyphs — ink for light surfaces, white for dark ones
  await (await extractGlyph([0x2e, 0x10, 0x65])).toFile('public/brand/glyph-ink.png')
  await (await extractGlyph([0xff, 0xff, 0xff])).toFile('public/brand/glyph-white.png')

  // App icon: crop the inner lime area (drops black bg + glow + corner radius)
  await sharp('public/brand/app-icon-src.png')
    .extract({ left: 172, top: 182, width: 680, height: 680 })
    .resize(512, 512)
    .png()
    .toFile('src/app/icon.png')

  await sharp('src/app/icon.png').resize(180, 180).png().toFile('src/app/apple-icon.png')

  // OG image: lime canvas + ink glyph + wordmark
  const glyph = await sharp('public/brand/glyph-ink.png')
    .resize(300, 300, { fit: 'inside' })
    .png()
    .toBuffer()

  const textSvg = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <text x="600" y="475" text-anchor="middle"
        font-family="Segoe UI, Arial, sans-serif" font-weight="900"
        font-size="96" fill="#2E1065">LinkYaar</text>
      <text x="600" y="545" text-anchor="middle"
        font-family="Segoe UI, Arial, sans-serif" font-weight="600"
        font-size="34" fill="#2E1065" opacity="0.75">Everything you are. One beautiful link.</text>
    </svg>`)

  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: '#D7F226' },
  })
    .composite([
      { input: glyph, top: 70, left: 450 },
      { input: textSvg, top: 0, left: 0 },
    ])
    .png()
    .toFile('public/og.png')

  console.log('done')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
