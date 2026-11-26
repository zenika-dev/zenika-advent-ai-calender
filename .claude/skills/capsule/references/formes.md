# Formes de particules

Chaque page déclare `forme: { type, ...paramètres }`. L'**accent** (or) marque l'élément qui porte le fait ; le reste est en lavande. Démonstration vivante de chaque forme : `engine/catalogue.html`.

Les formes `nuage` (ouverture) et `anneau` (À retenir) sont posées par le moteur : n'en déclare pas dans `pages`.

## texte
Mots, sigles ou chiffres dessinés en particules.
```js
{ type: "texte", segments: ["to", "ken", "isa", "tion"], accent: "alterne" }
```
- `segments` : morceaux affichés côte à côte avec un espace. **10 caractères au total au maximum**, sinon le tracé devient trop fin pour être lu.
- `accent` : `"alterne"` (un segment sur deux), `"tout"`, ou une liste d'indices (`[2]`).
- Montre : un découpage, un sigle, une inégalité (`["EN", "<", "FR"]`), un chiffre isolé (`["4"]`).
- C'est la seule forme qui peut revenir deux pages de suite. Garde-la pour les cas où le mot est lui-même le fait.

## grille
Une grille de pastilles dont les `accent` premières sont allumées, ligne par ligne.
```js
{ type: "grille", cols: 10, rows: 10, accent: 42 }
```
- Montre : une proportion (42 sur 100), un « 1 sur N », un taux.
- Garde `cols × rows` à 100 pour un pourcentage. Pour « 1 sur 20 », utilise 5 × 4 avec `accent: 1`.

## barres
Des colonnes à l'échelle, posées sur la même base.
```js
{ type: "barres", valeurs: [1, 5], accent: [1] }
```
- `valeurs` : de 1 à 6 barres, proportionnelles entre elles.
- `accent` : indices des barres allumées.
- Montre : un rapport (« × 5 »), une comparaison de coûts, de tailles ou de durées.
- Règle stricte : les valeurs sont les vraies grandeurs ou leur rapport exact. Une barre 10 fois plus petite que la plus grande reste visible ; au-delà de 50 fois, préfère `texte` avec le rapport.

## entonnoir
Des tranches horizontales empilées de haut en bas, chacune avec une largeur proportionnelle à sa valeur.
```js
{ type: "entonnoir", niveaux: [100, 60, 25, 8], accent: [3] }
```
- Montre : ce qui reste après des filtres successifs (documents → passages retrouvés → passages utilisés), une conversion, une perte par étapes.
- 3 à 6 niveaux.

## frise
Une ligne et des jalons régulièrement espacés de gauche à droite.
```js
{ type: "frise", jalons: 5, accent: [4] }
```
- Montre : une chronologie, ou les étapes d'un processus dont une compte plus que les autres.
- 3 à 8 jalons. Les dates et les étapes elles-mêmes s'écrivent dans `texte`.

## reseau
Un nœud central (index 0) relié à des satellites placés en cercle, chaque satellite étant relié à ses voisins.
```js
{ type: "reseau", noeuds: 6, accent: [0, 2, 4], centre: true }
```
- `accent` : indices des nœuds allumés. Un lien s'allume quand ses deux extrémités sont allumées.
- `centre: false` retire les liens vers le centre (on obtient un anneau de pairs).
- Montre : un agent et ses outils, des systèmes connectés, un graphe de connaissances, plusieurs modèles qui coopèrent.
- 4 à 8 satellites.

## pile
Une pile de feuilles inclinée.
```js
{ type: "pile", feuilles: 24, accent: "dessus" }
```
- `accent` : `"dessus"` (la dernière feuille), `"tous-les-6"` (repères réguliers), ou une liste d'indices.
- Montre : un volume de documents, une fenêtre de contexte, une base de connaissances, un historique.

## pictos
Des pictogrammes en particules, côte à côte.
```js
{ type: "pictos", icones: ["engrenage", "document", "bulle"], accent: [0] }
```
- `icones` : 1 à 4 parmi `engrenage` (outil, action), `document` (fichier, ressource), `bulle` (message, prompt), `base` (base de données), `loupe` (recherche, contrôle), `cadenas` (sécurité, accès), `personne` (un humain, un rôle, une décision).
- `accent` : liste d'indices, ou `"tout"`.
- Montre : les catégories d'un système quand chacune a un objet reconnaissable, et celle qui porte le fait.

## Formes inventées
Quand aucune forme du catalogue ne montre bien le fait, invente l'illustration directement dans la capsule. Deux types le permettent, sans toucher au moteur.

### dessin
Une illustration sur mesure en chemins SVG, échantillonnée en particules.
```js
{ type: "dessin", vue: [110, 62], accent: [1], trait: 0, chemins: [
  "M8 2 h52 a8 8 0 0 1 8 8 v28 a8 8 0 0 1 -8 8 h-34 l-14 12 v-12 h-4 a8 8 0 0 1 -8 -8 v-28 a8 8 0 0 1 8 -8 z",
  "M80 12 l14 -8 l14 8 v18 l-14 8 l-14 -8 z"
] }
```
- `chemins` : de 1 à 6 attributs `d` SVG. Chaque chemin est un groupe d'accent.
- `vue` : `[largeur, hauteur]` du repère des chemins, qui part de 0,0. Serre-la au plus près du dessin pour qu'il occupe tout l'espace.
- `trait` : `0` remplit les formes, ce qui demande des chemins fermés. Une valeur positive les trace avec cette épaisseur, dans le repère : c'est ce qu'il faut pour des lignes ou des flèches ouvertes. Vise 3 à 5 % de la hauteur de `vue`.
- `accent` : liste d'indices de chemins, ou `"tout"`.
- Silhouettes **pleines et simples** : les particules ne rendent pas les détails fins. Un trait plus fin que 2 % de la hauteur de la vue disparaît.
- Montre : un objet ou un schéma propre au sujet (un ticket, une ampoule, une flèche qui boucle, un avant / après).

### libre
Une forme calculée en JavaScript, particule par particule.
```js
{ type: "libre", fn: (i, n, o) => {
  const t = (i % 2000) / 2000, a = t * o.TAU * 3, y = (t - .5) * 4.6, brin = i % 2;
  return [Math.cos(a + brin * Math.PI) * 1.1, y, Math.sin(a + brin * Math.PI) * 1.1, brin];
} }
```
- `fn(i, n, o)` est appelée pour chaque particule `i` sur `n` (environ 7 500 en desktop, 4 200 en mobile). Elle renvoie `[x, y, z, accent]`.
- Repère : x de -3.2 à 3.2, y de -2.4 à 2.4, z de -1 à 1. `accent` vaut 0 pour la lavande et 1 pour l'or.
- `o` fournit `TAU`, `gauss()` (bruit centré d'environ ±1), `rand()` et `tiltX(y, z, angle)`.
- Montre : ce qui est géométrique, en 3D ou en mouvement (spirale, orbite, onde, nuage qui se resserre, deux populations qui se séparent).

### Règles pour une forme inventée
- Elle obéit aux mêmes règles que le catalogue : elle montre le fait, ses valeurs sont à l'échelle, et l'or est sur l'élément qui porte le fait.
- Les formes inventées sont encouragées, autant que les faits le justifient. La série reste reconnaissable grâce au moteur commun (particules, palette, accent or).
- Juge le rendu sur les planches de `tools/check.mjs`. Si la forme ne se lit pas en un coup d'œil, simplifie-la ou reviens au catalogue.
- Si une même forme inventée sert dans plusieurs capsules, propose à l'utilisateur de la promouvoir en forme du moteur (voir « Modifier une capsule existante » dans SKILL.md).

## Choisir vite
| Le fait est… | Forme |
|---|---|
| une proportion, un taux | grille |
| un rapport, « × N », une comparaison chiffrée | barres |
| une perte ou une sélection par étapes | entonnoir |
| une chronologie, un processus | frise |
| un système d'acteurs, des connexions | reseau |
| un volume, une quantité de texte | pile |
| des catégories, chacune incarnée par un objet | pictos |
| un mot, un sigle, un chiffre emblématique, une inégalité | texte |
| un objet ou un schéma propre au sujet, absent du catalogue | dessin |
| une géométrie, une 3D, un phénomène qu'aucune forme ne rend | libre |

## Feu d'artifice (effet de page)
Ajoute `feuDArtifice: true` à une page (à côté de `forme`, `kicker`…) pour lancer des fusées dorées et lavande pendant environ 6 secondes quand elle devient active. L'effet passe derrière la carte de texte et est ignoré si le lecteur préfère moins d'animations. À réserver à une page de célébration (la dernière capsule du calendrier, par exemple).

## Décors de Noël (ouverture)

Ajoute `decor: "<nom>"` au niveau de `window.CAPSULE` (à côté de `titre`) pour poser un petit décor de particules sur la sphère d'ouverture. Noms : `sapin` (guirlandes clignotantes), `traineau` (le Père Noël traverse la sphère), `bonhomme` (bonhomme de neige), `etoiles` (étoiles filantes), `cadeaux` (pile de cadeaux au centre), `painDepice` (bonhomme en pain d'épice qui marche) et `lutins` (trois lutins qui dansent). Le décor disparaît dès qu'on défile et est ignoré si le lecteur préfère moins d'animations. Les anciennes clés `traineau: true` et `bonhommeDeNeige: true` fonctionnent encore. Pour un nouveau décor : ajouter une entrée dans `DECORS` de `engine/capsule.js` (dessin sur canevas en rouge codé 40 = clair, 80 = accent, 120 = cyan, puis `sprite(...)`).
