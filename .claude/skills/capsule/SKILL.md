---
name: capsule
description: Crée ou modifie une capsule IA de ce dépôt (page animée de particules sur un concept, faits sourcés, « À retenir ») et la référence dans l'index. À utiliser dès qu'on demande une capsule, un nouveau sujet de capsule, ou une retouche d'une capsule existante.
---

# Capsule IA

Une capsule explique **un seul concept d'IA** à des apprenants non spécialistes, en quelques **faits** concrets et sourcés, lus en défilant. Chaque page affiche un fait à gauche et une forme de particules qui le montre à droite.

Une capsule est un fichier de **données** : `capsules/NN-slug.html` ne contient que `window.CAPSULE`. Le rendu vient du moteur commun (`engine/capsule.js`, `engine/capsule.css`, `engine/tokens.css`), identique pour toutes. La constance visuelle vient du moteur, la variété vient des formes et des faits.

Structure imposée par le moteur :
1. **Ouverture**, générée : titre + accroche sur un nuage de particules.
2. **Pages** : entre 4 et 20, c'est un repère. Moins si le sujet est mince, plus si chaque page reste un fait distinct.
3. **À retenir**, généré à partir de `aRetenir` : 2 à 4 points, un arc d'anneau par point, et la liste des sources.

## Étapes

### 1. Cadrer
Fixe le titre (idéalement 1 à 3 mots), le thème, le numéro et l'angle en une phrase.
- **Thème** : lis `capsules/manifest.js` et reprends un thème existant quand il convient, pour que les filtres de l'index restent courts. Sinon crée-en un.
- **Numéro** : c'est le jour de la porte du calendrier « Avent IA ». Les capsules sont ordonnées par difficulté croissante, du concept le plus simple au plus complexe : place la nouvelle à son rang et décale les suivantes si besoin (renommer les fichiers, mettre à jour `numero` et le titre, puis `node tools/manifest.mjs`).
- Si l'utilisateur donne seulement un sujet, choisis toi-même l'angle et le thème, puis annonce-les dans le compte rendu.

### 2. Collecter les faits
Chaque page porte **un fait** précis et vérifiable : un chiffre, un ordre de grandeur, une comparaison, un mécanisme, un exemple concret ou un piège. Le chiffre est facultatif : une page sans `chiffre` montre son fait avec `texte`, `frise` ou `reseau`. Une définition générale seule n'est pas un fait.
- Si l'utilisateur colle une **fiche d'extraction** (réponse au prompt `prompts/extraction.md`, produite par une IA qui a accès à la base de connaissance du client), elle est la source principale : reprends ses faits et ses dates tels quels. Ses sources servent à vérifier les faits, mais un document de travail interne (support de formation, kick-off, TOM, PDF ou présentation de la base du client) n'apparaît **jamais** dans la capsule : la page n'a pas de champ `source`. Un fait marqué « non sourcé » est écarté, ou présenté comme illustratif. Complète par le web seulement si l'utilisateur le demande.
- Sinon, cherche sur le web et privilégie les sources primaires : documentation d'éditeur, article de recherche, étude, organisme public.
- Les faits **datés** (prix, tailles de fenêtre de contexte, scores de benchmark, versions de modèles) se vérifient à leur valeur actuelle. Note la date de vérification pour le compte rendu.

Terminé quand chaque page a son fait et que chaque chiffre affiché a une source dont tu as ouvert l'URL. Exceptions : une page explicitement présentée comme illustrative dans son texte, et une page tirée d'un document de travail interne, qui n'affiche pas de source.

### 3. Storyboard
Ordonne les pages en arc. Un repère : principe → ordre de grandeur → comparaison → piège ou limite → conséquence pratique.

Pour chaque page, choisis une forme dans [references/formes.md](references/formes.md). La forme doit **montrer** le fait : une grille pour une proportion, des barres pour un rapport à l'échelle, un entonnoir pour une perte par étapes.
- Les valeurs des formes sont **à l'échelle** du fait : `valeurs: [1, 5]` pour « × 5 », `accent: 42` sur 100 cases pour « 42 % ».
- Varie les formes : jamais deux fois la même d'affilée (sauf `texte`), et au moins 3 formes différentes par capsule.
- L'accent or marque toujours l'élément qui porte le fait.
- **Tu peux inventer** de nouvelles illustrations quand le catalogue ne montre pas bien un fait : un dessin en chemins SVG (`dessin`) ou une forme calculée (`libre`), écrits directement dans la capsule. N'hésite pas à en mettre plusieurs : une forme sur mesure montre souvent mieux le fait qu'une forme du catalogue. Les règles sont dans la section « Formes inventées » de [references/formes.md](references/formes.md).

### 4. Écrire le fichier
Copie [references/modele.html](references/modele.html) vers `capsules/NN-slug.html` (slug en minuscules, sans accents) et remplis `window.CAPSULE`. Les règles de rédaction et les longueurs maximales sont dans [references/ecriture.md](references/ecriture.md).

### 5. Régénérer l'index
`node tools/manifest.mjs`. Terminé quand la sortie ne contient plus de ligne « À corriger », ou seulement des écarts assumés (par exemple 11 pages).

### 6. Vérifier dans le navigateur
`node tools/check.mjs capsules/NN-slug.html`. La première fois dans le dépôt, lance d'abord `npm install`.

Le script fait défiler la capsule en desktop et en mobile, relève les erreurs et les débordements, puis écrit deux planches contact. Lis `.check/NN-slug/planche-desktop.png` et `.check/NN-slug/planche-mobile.png`, et regarde page par page :
- la forme se lit et dit la même chose que le fait ;
- l'or est sur le bon élément ;
- un mot en particules n'est pas trop petit ;
- la carte n'est pas surchargée.

Corrige puis relance. Terminé quand le script affiche `OK` pour les deux formats et que les deux planches sont propres.

### 7. Rendre compte
Donne à l'utilisateur :
- le chemin du fichier ;
- les pages en une ligne chacune (kicker et fait) ;
- les faits datés à revérifier avant diffusion, avec leur date de vérification ;
- comment ouvrir : `open index.html` ou le fichier de la capsule.

La palette reprend la charte Zenika (`engine/tokens.css`) : la capsule reste un fichier local. Publie-la en ligne seulement si l'utilisateur le demande explicitement.

## Modifier une capsule existante
Modifie le fichier de la capsule, puis refais les étapes 5 et 6. Le moteur ne change que si aucune forme existante ne peut montrer un fait. Dans ce cas, ajoute la forme dans `engine/capsule.js`, ajoute une page de démonstration dans `engine/catalogue.html`, documente-la dans [references/formes.md](references/formes.md), puis vérifie avec `node tools/check.mjs engine/catalogue.html`.
