// Generates every App Store / Play Store graphic for StarBo:
//   node store-assets/generate-store-assets.js
// Inputs:  assets/images/starbo-icon.png, assets/images/starbo-logo.png,
//          store-assets/screenshots/raw/*.png (real iPhone simulator captures)
//          store-assets/screenshots/raw-ipad/*.png (real iPad simulator captures)
// Outputs: store-assets/icons/*, store-assets/screenshots/png/<size>/*

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const ICON = path.join(ROOT, "assets/images/starbo-icon.png");
const LOGO = path.join(ROOT, "assets/images/starbo-logo.png");
const RAW_DIR = path.join(__dirname, "screenshots");
const ICONS_OUT = path.join(__dirname, "icons");
const SHOTS_OUT = path.join(__dirname, "screenshots/png");
const PROMO_OUT = path.join(__dirname, "appstore-header");

const FONT = "Avenir Next";
const BG_TOP = "#3B1F8F";
const BG_BOTTOM = "#6C63FF";
const YELLOW = "#FFD166";

// ── Icons ────────────────────────────────────────────────────────────────
const ICON_SIZES = [
  // iOS (App Store icon must be 1024×1024 with no transparency)
  ["ios-appstore-1024.png", 1024],
  ["ios-iphone-60@2x.png", 120],
  ["ios-iphone-60@3x.png", 180],
  ["ios-ipad-76@2x.png", 152],
  ["ios-ipad-83.5@2x.png", 167],
  ["ios-notification@2x.png", 40],
  ["ios-notification@3x.png", 60],
  ["ios-settings@2x.png", 58],
  ["ios-settings@3x.png", 87],
  ["ios-spotlight@2x.png", 80],
  ["ios-spotlight@3x.png", 120],
  // Google Play
  ["android-playstore-512.png", 512],
  ["android-launcher-48.png", 48],
  ["android-launcher-72.png", 72],
  ["android-launcher-96.png", 96],
  ["android-launcher-144.png", 144],
  ["android-launcher-192.png", 192],
  // Web
  ["favicon-32.png", 32],
  ["favicon-64.png", 64],
  ["favicon-128.png", 128],
];

// ── Screenshots ──────────────────────────────────────────────────────────
const SCREENS = [
  { raw: "home", title: ["Turn everyday tasks", "into shining stars"], sub: "Rewards kids love, routines that stick" },
  { raw: "celebrate", title: ["Every finished task", "gets a celebration"], sub: "Stars, trophies and happy faces" },
  { raw: "kid-tasks", title: ["Kids tick off", "their own tasks"], sub: "Big, simple buttons for little hands" },
  { raw: "kids-picker", title: ["A profile for", "every child"], sub: "Each kid unlocks with their own PIN" },
  { raw: "parent", title: ["Parents stay", "in control"], sub: "Add kids, tasks, bonuses and more" },
  { raw: "leaderboard", title: ["Friendly family", "challenges"], sub: "See who is the top star this round" },
];

const SHOT_SIZES = [
  // App Store — 6.9" is required; 6.5" covers older listings.
  { dir: "iphone-6.9", w: 1320, h: 2868 },
  { dir: "iphone-6.7", w: 1290, h: 2796 },
  { dir: "iphone-6.5", w: 1284, h: 2778 },
  { dir: "iphone-medium-1206x2622", w: 1206, h: 2622 },
  { dir: "iphone-medium-1179x2556", w: 1179, h: 2556 },
  // Required because the app supports iPad (supportsTablet: true).
  { dir: "ipad-13", w: 2064, h: 2752, raw: "raw-ipad" },
  { dir: "iphone-duo-1398x2034", w: 1398, h: 2034 },
  // Google Play phone
  { dir: "android-phone", w: 1080, h: 1920 },
];

// sharp applies composite() last, so flatten in a second pass: App Store
// screenshots and artwork must not have an alpha channel.
function saveOpaque(buf, file) {
  return sharp(buf).flatten({ background: BG_TOP }).removeAlpha().png().toFile(file);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// Five-point star path centred on (cx, cy).
function starPath(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

function backgroundSvg(w, h) {
  const u = Math.min(w, h) / 100;
  const stars = [
    // Kept clear of the caption area (top ~20%, centre).
    [0.05, 0.3, 2.2, 0.45], [0.95, 0.26, 2.6, 0.35], [0.96, 0.03, 1.4, 0.35],
    [0.04, 0.55, 1.4, 0.3], [0.96, 0.7, 1.8, 0.3],
  ]
    .map(([x, y, r, o]) => `<path d="${starPath(x * w, y * h, r * u)}" fill="${YELLOW}" opacity="${o}"/>`)
    .join("");
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stop-color="${BG_TOP}"/>
        <stop offset="1" stop-color="${BG_BOTTOM}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <circle cx="${w * 1.02}" cy="${h * 0.12}" r="${w * 0.32}" fill="#fff" opacity="0.06"/>
    <circle cx="${-w * 0.05}" cy="${h * 0.62}" r="${w * 0.28}" fill="#fff" opacity="0.05"/>
    <circle cx="${w * 0.85}" cy="${h * 0.95}" r="${w * 0.3}" fill="${YELLOW}" opacity="0.08"/>
    ${stars}
  </svg>`;
}

function captionSvg(w, captionH, title, sub) {
  const size = Math.round(Math.min(w * 0.078, captionH * 0.24));
  const subSize = Math.round(size * 0.46);
  const y1 = captionH * 0.36;
  const y2 = y1 + size * 1.08;
  const y3 = y2 + subSize * 1.9;
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${captionH}">
    <g font-family="${FONT}" text-anchor="middle">
      <text x="${w / 2}" y="${y1}" font-size="${size}" font-weight="800" fill="#fff">${esc(title[0])}</text>
      <text x="${w / 2}" y="${y2}" font-size="${size}" font-weight="800" fill="${YELLOW}">${esc(title[1])}</text>
      <text x="${w / 2}" y="${y3}" font-size="${subSize}" font-weight="600" fill="#fff" opacity="0.88">${esc(sub)}</text>
    </g>
  </svg>`;
}

// Screenshot inside a dark rounded "phone" bezel with a soft shadow.
async function phoneFrame(rawPath, screenW) {
  const meta = await sharp(rawPath).metadata();
  const screenH = Math.round((meta.height / meta.width) * screenW);
  const tablet = meta.width / meta.height > 0.6;
  const bezel = Math.round(screenW * (tablet ? 0.02 : 0.028));
  const radius = Math.round(screenW * (tablet ? 0.045 : 0.11));
  const frameW = screenW + bezel * 2;
  const frameH = screenH + bezel * 2;

  const mask = Buffer.from(
    `<svg width="${screenW}" height="${screenH}"><rect width="${screenW}" height="${screenH}" rx="${radius - bezel}" fill="#fff"/></svg>`,
  );
  const screen = await sharp(rawPath)
    .resize(screenW, screenH)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const body = Buffer.from(
    `<svg width="${frameW}" height="${frameH}"><rect width="${frameW}" height="${frameH}" rx="${radius}" fill="#15122B"/></svg>`,
  );
  const phone = await sharp(body)
    .composite([{ input: screen, left: bezel, top: bezel }])
    .png()
    .toBuffer();

  const pad = Math.round(screenW * 0.08);
  const shadow = await sharp(
    Buffer.from(
      `<svg width="${frameW + pad * 2}" height="${frameH + pad * 2}"><rect x="${pad}" y="${pad * 1.4}" width="${frameW}" height="${frameH}" rx="${radius}" fill="#120A3A" opacity="0.55"/></svg>`,
    ),
  )
    .blur(pad / 2.5)
    .png()
    .toBuffer();

  return { phone, shadow, frameW, frameH, pad };
}

async function screenshot(size, screen, index) {
  const { w, h } = size;
  const captionH = Math.round(h * (w / h > 0.65 ? 0.17 : 0.2));
  const bottomMargin = Math.round(h * 0.035);
  const rawPath = path.join(RAW_DIR, size.raw ?? "raw", `${screen.raw}.png`);
  const meta = await sharp(rawPath).metadata();
  const aspect = meta.width / meta.height;

  // Fit the phone between the caption and the bottom margin, max 80% wide.
  const maxFrameH = h - captionH - bottomMargin;
  const screenW = Math.round(Math.min(w * 0.8, maxFrameH * aspect * 0.97));
  const { phone, shadow, frameW, frameH, pad } = await phoneFrame(rawPath, screenW);
  const left = Math.round((w - frameW) / 2);
  const top = captionH + Math.round((maxFrameH - frameH) / 2);

  const file = path.join(SHOTS_OUT, size.dir, `${index + 1}-${screen.raw}.png`);
  await sharp(Buffer.from(backgroundSvg(w, h)))
    .composite([
      { input: Buffer.from(captionSvg(w, captionH, screen.title, screen.sub)), left: 0, top: 0 },
      { input: shadow, left: left - pad, top: top - pad },
      { input: phone, left, top },
    ])
    .png()
    .toBuffer()
    .then((buf) => saveOpaque(buf, file));
}

async function featureGraphic() {
  const w = 1024;
  const h = 500;
  const logo = await sharp(LOGO).resize(380, 380).png().toBuffer();
  const text = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <g font-family="${FONT}">
      <text x="470" y="205" font-size="62" font-weight="800" fill="#fff">Turn tasks</text>
      <text x="470" y="275" font-size="62" font-weight="800" fill="${YELLOW}">into stars</text>
      <text x="472" y="335" font-size="26" font-weight="600" fill="#fff" opacity="0.88">Fun rewards that help kids</text>
      <text x="472" y="370" font-size="26" font-weight="600" fill="#fff" opacity="0.88">build good habits</text>
    </g>
  </svg>`;
  await sharp(Buffer.from(backgroundSvg(w, h)))
    .composite([
      { input: logo, left: 50, top: 60 },
      { input: Buffer.from(text), left: 0, top: 0 },
    ])
    .png()
    .toBuffer()
    .then((buf) => saveOpaque(buf, path.join(ICONS_OUT, "android-feature-graphic-1024x500.png")));
}

// App Store Connect → Asset Library: product-page header (21:9) and search
// result artwork (3:2). Both must be opaque PNG/JPEG.
async function promoArtwork({ w, h, file, logoSize, logoPos, textX, textY, fontSize, phones }) {
  const logo = await sharp(LOGO).resize(logoSize, logoSize).png().toBuffer();
  const sub = Math.round(fontSize * 0.36);
  const text = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <g font-family="${FONT}">
      <text x="${textX}" y="${textY}" font-size="${fontSize}" font-weight="800" fill="#fff">Turn tasks</text>
      <text x="${textX}" y="${textY + fontSize * 1.05}" font-size="${fontSize}" font-weight="800" fill="${YELLOW}">into stars</text>
      <text x="${textX + 6}" y="${textY + fontSize * 1.05 + sub * 2.2}" font-size="${sub}" font-weight="600" fill="#fff" opacity="0.9">Fun rewards that help kids</text>
      <text x="${textX + 6}" y="${textY + fontSize * 1.05 + sub * 3.5}" font-size="${sub}" font-weight="600" fill="#fff" opacity="0.9">build good habits</text>
    </g>
  </svg>`;

  const layers = [
    { input: logo, left: logoPos[0], top: logoPos[1] },
    { input: Buffer.from(text), left: 0, top: 0 },
  ];
  for (const { raw, screenW, left, top } of phones) {
    const { phone, shadow, pad } = await phoneFrame(path.join(RAW_DIR, "raw", `${raw}.png`), screenW);
    layers.push({ input: shadow, left: left - pad, top: top - pad }, { input: phone, left, top });
  }

  await sharp(Buffer.from(backgroundSvg(w, h)))
    .composite(layers)
    .png()
    .toBuffer()
    .then((buf) => saveOpaque(buf, path.join(PROMO_OUT, file)));
}

async function run() {
  fs.mkdirSync(PROMO_OUT, { recursive: true });
  await promoArtwork({
    w: 3840,
    h: 1646,
    file: "starbo-header-3840x1646.png",
    logoSize: 820,
    logoPos: [230, 410],
    textX: 1120,
    textY: 700,
    fontSize: 190,
    phones: [
      { raw: "home", screenW: 600, left: 2380, top: 150 },
      { raw: "celebrate", screenW: 600, left: 3080, top: 150 },
    ],
  });
  console.log("✅ App Store header 3840×1646");
  await promoArtwork({
    w: 3840,
    h: 2560,
    file: "starbo-search-3840x2560.png",
    logoSize: 820,
    logoPos: [220, 480],
    textX: 260,
    textY: 1550,
    fontSize: 175,
    phones: [
      { raw: "home", screenW: 720, left: 1290, top: 510 },
      { raw: "celebrate", screenW: 720, left: 2090, top: 450 },
      { raw: "parent", screenW: 720, left: 2890, top: 510 },
    ],
  });
  console.log("✅ App Store search result 3840×2560");

  fs.mkdirSync(ICONS_OUT, { recursive: true });
  for (const [file, size] of ICON_SIZES) {
    await sharp(ICON)
      .resize(size, size)
      .flatten({ background: BG_TOP }) // App Store rejects icons with alpha
      .png()
      .toFile(path.join(ICONS_OUT, file));
  }
  console.log(`✅ ${ICON_SIZES.length} icons`);

  await featureGraphic();
  console.log("✅ Play feature graphic 1024×500");

  for (const size of SHOT_SIZES) {
    const dir = path.join(SHOTS_OUT, size.dir);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    for (let i = 0; i < SCREENS.length; i++) await screenshot(size, SCREENS[i], i);
    console.log(`✅ ${size.dir} (${size.w}×${size.h}) × ${SCREENS.length}`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
