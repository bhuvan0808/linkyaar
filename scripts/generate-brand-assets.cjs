const sharp = require('sharp')

async function main() {
  const logo = 'public/brand/logo.png'

  // Glyph region of the 1254x1254 lockup (figure + chain, above wordmark)
  const glyph = sharp(logo).extract({ left: 250, top: 215, width: 760, height: 610 })

  // Square favicon / app icons on white, padded
  await glyph
    .clone()
    .resize(440, 440, { fit: 'contain', background: '#ffffff' })
    .extend({ top: 36, bottom: 36, left: 36, right: 36, background: '#ffffff' })
    .resize(512, 512)
    .png()
    .toFile('src/app/icon.png')

  await sharp('src/app/icon.png').resize(180, 180).png().toFile('src/app/apple-icon.png')

  // Small header glyph (transparent-ish edges stay white; used at 28px)
  await sharp('src/app/icon.png').resize(64, 64).png().toFile('public/brand/glyph.png')

  // Default OG image: 1200x630, logo centered on warm white
  await sharp(logo)
    .resize(520, 520, { fit: 'contain', background: '#faf9f7' })
    .toBuffer()
    .then((buf) =>
      sharp({
        create: { width: 1200, height: 630, channels: 3, background: '#faf9f7' },
      })
        .composite([{ input: buf, gravity: 'centre' }])
        .png()
        .toFile('public/og.png')
    )

  console.log('done')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
