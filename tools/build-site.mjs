// Capsules IA · prépare le site publié dans _site/ (voir .github/workflows/deploy.yml).
// Copie les pages et le moteur, et intègre capsules/manifest.js dans index.html :
// l'index est ainsi autonome, sans second fichier à charger.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const out = process.argv[2] || "_site";
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
cpSync("engine", `${out}/engine`, { recursive: true });
cpSync("capsules", `${out}/capsules`, { recursive: true, filter: f => !f.endsWith("manifest.js") });

const balise = '<script src="capsules/manifest.js"></script>';
const index = readFileSync("index.html", "utf8");
if (!index.includes(balise)) throw new Error(`index.html : balise introuvable : ${balise}`);
const manifeste = readFileSync("capsules/manifest.js", "utf8").replace(/<\/script/gi, "<\\/script");
writeFileSync(`${out}/index.html`, index.replace(balise, () => `<script>\n${manifeste}\n</script>`));
console.log(`Site prêt dans ${out}/`);
