# Avent IA · Zenika

Calendrier de l'Avent : 24 portes, une capsule animée par jour sur un concept d'IA (tokens, prompt, contexte, RAG, agents, Nexus, évaluation, sécurité…). Chaque capsule est une page de particules en quelques « crans » à faire défiler, avec des faits sourcés et un « À retenir ».

Site : https://zenika-dev.github.io/zenika-advent-ai-calender/

## Fonctionnement

- `index.html` : le calendrier (les portes s'ouvrent à partir de leur jour en décembre ; `?debug` ouvre tout, `?mois=11` simule novembre).
- `capsules/NN-nom.html` : une capsule, décrite par un objet `window.CAPSULE`.
- `engine/` : le moteur (three.js), la charte Zenika (`tokens.css`) et les logos.
- `tools/manifest.mjs` : génère `capsules/manifest.js` et vérifie les capsules.
- `tools/check.mjs` : contrôle visuel dans un vrai navigateur (`npm install` puis `node tools/check.mjs capsules/01-le-token.html`).
- `.claude/skills/capsule/` : consignes pour créer ou modifier une capsule avec Claude Code.

## Publication

Chaque push sur `main` reconstruit et publie le site avec GitHub Pages (`.github/workflows/deploy.yml`). Le site est public, sans mot de passe.
