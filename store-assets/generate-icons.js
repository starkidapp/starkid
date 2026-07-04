const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SRC_ICON = path.join(__dirname, "../assets/images/star-icon.png");
const SRC_STAR = path.join(__dirname, "../assets/images/star-icon.png");
const OUT = path.join(__dirname, "icons");

const sizes = [
  // ── iOS App Store ──────────────────────────────────────────────
  { file: "ios-appstore-1024.png", size: 1024, src: SRC_ICON, note: "iOS App Store icon" },
  { file: "ios-iphone-60@2x.png",  size: 120,  src: SRC_ICON },
  { file: "ios-iphone-60@3x.png",  size: 180,  src: SRC_ICON },
  { file: "ios-ipad-76@2x.png",    size: 152,  src: SRC_ICON },
  { file: "ios-ipad-83.5@2x.png",  size: 167,  src: SRC_ICON },
  { file: "ios-notification@2x.png", size: 40, src: SRC_ICON },
  { file: "ios-notification@3x.png", size: 60, src: SRC_ICON },
  { file: "ios-settings@2x.png",   size: 58,   src: SRC_ICON },
  { file: "ios-settings@3x.png",   size: 87,   src: SRC_ICON },
  { file: "ios-spotlight@2x.png",  size: 80,   src: SRC_ICON },
  { file: "ios-spotlight@3x.png",  size: 120,  src: SRC_ICON },

  // ── Google Play Store ──────────────────────────────────────────
  { file: "android-playstore-512.png",    size: 512,  src: SRC_STAR, note: "Play Store icon" },
  { file: "android-launcher-48.png",      size: 48,   src: SRC_STAR },
  { file: "android-launcher-72.png",      size: 72,   src: SRC_STAR },
  { file: "android-launcher-96.png",      size: 96,   src: SRC_STAR },
  { file: "android-launcher-144.png",     size: 144,  src: SRC_STAR },
  { file: "android-launcher-192.png",     size: 192,  src: SRC_STAR },

  // ── Notification / favicon ─────────────────────────────────────
  { file: "favicon-32.png",  size: 32,  src: SRC_ICON },
  { file: "favicon-64.png",  size: 64,  src: SRC_ICON },
  { file: "favicon-128.png", size: 128, src: SRC_ICON },
];

async function run() {
  for (const { file, size, src, note } of sizes) {
    const dest = path.join(OUT, file);
    await sharp(src)
      .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(dest);
    console.log(`✅ ${file.padEnd(40)} ${size}x${size}  ${note || ""}`);
  }

  // Play Store feature graphic — 1024×500 composite
  const featureDest = path.join(OUT, "android-feature-graphic-1024x500.png");
  const logoResized = await sharp(SRC_STAR)
    .resize(320, 320, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: { width: 1024, height: 500, channels: 4, background: { r: 135, g: 206, b: 235, alpha: 1 } },
  })
    .composite([{ input: logoResized, gravity: "center" }])
    .png()
    .toFile(featureDest);
  console.log(`✅ android-feature-graphic-1024x500.png  (Play Store feature graphic)`);

  console.log(`\n🎉 All icons saved to store-assets/icons/`);
}

run().catch(console.error);
