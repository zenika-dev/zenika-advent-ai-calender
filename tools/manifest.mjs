#!/usr/bin/env node
// Capsules IA · régénère capsules/manifest.js à partir des fichiers capsules/*.html.
// Le fichier de chaque capsule est la seule source de vérité ; l'index lit ce manifeste.
// Usage : node tools/manifest.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "capsules");
const problems = [];
const entries = [];

for (const fichier of readdirSync(dir).filter(f => f.endsWith(".html")).sort()) {
  const html = readFileSync(join(dir, fichier), "utf8");
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes("window.CAPSULE"));
  if (!script) { problems.push(`${fichier} : aucun bloc window.CAPSULE`); continue; }
  const sandbox = { window: {} };
  try { vm.runInNewContext(script, sandbox, { timeout: 1000 }); }
  catch (e) { problems.push(`${fichier} : erreur de syntaxe dans window.CAPSULE (${e.message})`); continue; }
  const c = sandbox.window.CAPSULE;
  for (const k of ["numero", "theme", "titre", "accroche", "pages", "aRetenir"]) if (c[k] == null) problems.push(`${fichier} : champ "${k}" manquant`);
  const pages = c.pages || [];
  if (pages.length < 4 || pages.length > 20) problems.push(`${fichier} : ${pages.length} pages (repère : 4 à 20), à justifier`);
  pages.forEach((p, i) => {
    if (!p.titre) problems.push(`${fichier} : page ${i + 1} sans titre`);
    if (!p.forme?.type) problems.push(`${fichier} : page ${i + 1} sans forme`);
    if (i > 0 && p.forme?.type === pages[i - 1].forme?.type && p.forme?.type !== "texte") problems.push(`${fichier} : pages ${i} et ${i + 1} ont la même forme "${p.forme.type}"`);
  });
  entries.push({
    fichier: `capsules/${fichier}`,
    numero: c.numero, theme: c.theme, titre: c.titre, accroche: c.accroche, duree: c.duree || "2 min",
    pages: pages.length,
    formes: pages.map(p => p.forme?.type),
    sources: pages.filter(p => p.source).length
  });
}

entries.sort((a, b) => a.numero - b.numero);
const seen = new Map();
for (const e of entries) {
  if (seen.has(e.numero)) problems.push(`numéro ${e.numero} utilisé par ${seen.get(e.numero)} et ${e.fichier}`);
  seen.set(e.numero, e.fichier);
}

writeFileSync(join(dir, "manifest.js"),
  "// Généré par tools/manifest.mjs : ne pas modifier à la main.\n" +
  `window.CAPSULES = ${JSON.stringify(entries, null, 2)};\n`);

console.log(`manifest.js : ${entries.length} capsule(s)`);
for (const e of entries) console.log(`  n°${String(e.numero).padStart(2, "0")}  ${e.theme.padEnd(18)} ${e.titre}  (${e.pages} pages)`);
if (problems.length) { console.log("\nÀ corriger :"); problems.forEach(p => console.log("  - " + p)); process.exitCode = 1; }
