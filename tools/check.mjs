#!/usr/bin/env node
// Capsules IA · vérifie une capsule dans un vrai navigateur.
// Ouvre la capsule en desktop (1280×800) et en mobile (390×844), se place au milieu du cran
// de chaque page, relève les erreurs console et les débordements de texte, puis produit
// une planche contact par format : .check/<capsule>/planche-desktop.png et planche-mobile.png.
// Usage : node tools/check.mjs capsules/01-le-token.html [autres fichiers…]
//         (variable CHROME_PATH pour un autre navigateur Chromium)
import { chromium } from "playwright-core";
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { resolve, basename, join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = process.argv.slice(2);
if (!files.length) { console.error("Usage : node tools/check.mjs capsules/<fichier>.html"); process.exit(2); }

const chromePath = process.env.CHROME_PATH || [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome", "/usr/bin/chromium"
].find(existsSync);
if (!chromePath) { console.error("Chrome introuvable : définir CHROME_PATH."); process.exit(2); }

const VIEWPORTS = { desktop: { width: 1280, height: 800 }, mobile: { width: 390, height: 844 } };
const browser = await chromium.launch({ executablePath: chromePath, args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
let failed = false;

for (const file of files) {
  const slug = basename(file, ".html"), out = join(root, ".check", slug);
  mkdirSync(out, { recursive: true });
  console.log(`\n${slug}`);
  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.goto(pathToFileURL(resolve(file)).href);
    await page.waitForFunction(() => typeof window.__capsuleStepY === "function", null, { timeout: 10000 }).catch(() => errors.push("moteur non initialisé"));
    await page.waitForTimeout(2500);
    const count = await page.evaluate(() => document.querySelectorAll(".step").length);
    const shots = [], warnings = [];
    for (let k = 0; k < count; k++) {
      await page.evaluate(k => scrollTo(0, window.__capsuleStepY(k)), k);
      await page.waitForTimeout(1600);   // le temps que les particules se figent
      const issues = await page.evaluate(k => {
        const card = document.querySelectorAll(".card")[k], r = card.getBoundingClientRect(), out = [];
        const topbar = document.querySelector(".topbar").getBoundingClientRect().bottom;
        if (r.top < topbar - 4) out.push(`carte coupée en haut (${Math.round(topbar - r.top)} px sous la barre)`);
        if (r.bottom > innerHeight) out.push(`carte coupée en bas (${Math.round(r.bottom - innerHeight)} px)`);
        card.querySelectorAll(".big, h1, h2").forEach(el => { if (el.scrollWidth > el.clientWidth + 2) out.push(`${el.className || el.tagName} trop large (${el.scrollWidth} > ${el.clientWidth} px) : « ${el.textContent.slice(0, 30)} »`); });
        if (document.documentElement.scrollWidth > innerWidth) out.push("défilement horizontal de la page");
        return out;
      }, k);
      issues.forEach(i => warnings.push(`page ${String(k + 1).padStart(2, "0")} : ${i}`));
      const shot = join(out, `${name}-${String(k + 1).padStart(2, "0")}.png`);
      await page.screenshot({ path: shot });
      shots.push(shot);
    }
    await page.close();

    // Planche contact : toutes les pages d'un format sur une seule image.
    const cols = name === "desktop" ? 3 : 5, w = name === "desktop" ? 420 : 200;
    const sheet = await browser.newPage({ viewport: { width: cols * (w + 12) + 12, height: 400 } });
    await sheet.setContent(`<body style="margin:0;padding:12px;background:#111;display:grid;grid-template-columns:repeat(${cols},${w}px);gap:12px;font:12px sans-serif;color:#ccc">
      ${shots.map((s, i) => `<figure style="margin:0"><img src="data:image/png;base64,${readFileSync(s).toString("base64")}" style="width:${w}px;display:block"><figcaption>${String(i + 1).padStart(2, "0")}</figcaption></figure>`).join("")}</body>`);
    await sheet.waitForTimeout(300);
    await sheet.screenshot({ path: join(out, `planche-${name}.png`), fullPage: true });
    await sheet.close();

    const status = errors.length || warnings.length ? "À CORRIGER" : "OK";
    if (status !== "OK") failed = true;
    console.log(`  ${name.padEnd(8)} ${status}  ${count} pages · planche : .check/${slug}/planche-${name}.png`);
    errors.forEach(e => console.log(`    erreur  ${e}`));
    warnings.forEach(w => console.log(`    alerte  ${w}`));
  }
}
await browser.close();
process.exitCode = failed ? 1 : 0;
