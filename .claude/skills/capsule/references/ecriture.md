# Rédaction d'une capsule

Les lecteurs sont des salariés du client, non spécialistes, qui lisent en 2 minutes. Écris pour eux :
- vouvoiement ;
- phrases courtes et voix active ;
- un terme technique est expliqué la première fois qu'il apparaît.

Le ton est celui d'un collègue qui sait de quoi il parle : précis et concret, sans jargon ni effet de manche.

## Champs et longueurs

| Champ | Rôle | Longueur |
|---|---|---|
| `titre` (capsule) | Le concept, nommé comme les apprenants le nomment | 1 à 3 mots |
| `accroche` | Pourquoi ce concept compte pour eux | 1 à 2 phrases, 160 caractères max |
| `theme` | La famille de la capsule, partagée avec d'autres | 1 à 3 mots |
| `kicker` | Le rôle de la page dans l'arc | 1 à 3 mots |
| `chiffre` (optionnel) | Le nombre qui porte le fait | **8 caractères max** |
| `titre` (page) | Le fait, sous forme d'affirmation | 70 caractères max |
| `texte` | Le fait expliqué, puis sa conséquence | 1 à 3 phrases, 260 caractères max |
| `source` | `{ label: "Éditeur · Titre du document", url }` | label de 60 caractères max |

Les limites de `chiffre` et de `titre` viennent de la mise en page : au-delà, `tools/check.mjs` signale un débordement.

## Les pages

- **kicker** : varie-les d'une page à l'autre. Exemples : Le principe, Ordre de grandeur, La règle, La comparaison, Le piège, La limite, La facture, En pratique, Le chiffre clé.
- **chiffre** : le nombre seul avec son symbole. Écris-le en typographie française : `200 000`, `42 %`, `× 5`, `≈ 4`, `100 → 75`. Quand il est présent, le `titre` le complète au lieu de le répéter (`chiffre: "≈ 4"`, `titre: "caractères par token"`).
- **titre** : une affirmation qui tient seule. On doit comprendre le fait en ne lisant que le kicker, le chiffre et le titre.
- **texte** : le contexte du fait en une phrase, puis ce que ça change pour le lecteur. Pas de HTML : le moteur échappe ce champ.
- **source** : une source par page chiffrée, et l'URL exacte de la page qui contient le fait. Les sources de toutes les pages sont regroupées automatiquement dans « À retenir ». Ne cite **jamais** un document de travail interne du client (support de formation, kick-off, TOM, PDF ou présentation interne) : la page n'a alors pas de champ `source`, même si le fait en vient.
- **Faits illustratifs** : si une forme montre un exemple et non une mesure (un découpage de mot inventé, par exemple), le `texte` le dit (« Le découpage ci-contre est illustratif. »).

## À retenir

```js
aRetenir: {
  titre: "Trois réflexes",
  points: [
    "<b>Estimez vite.</b> 1 000 mots anglais font environ 1 300 tokens, un peu plus en français.",
    ...
  ]
}
```
- `titre` : annonce la nature des points (Trois réflexes, Deux règles, Ce qu'il faut retenir).
- 2 à 4 points. Chaque point commence par un verbe à l'impératif en `<b>`, suivi d'une phrase directement applicable au travail du lecteur. `<b>` est la seule balise permise.
- Un point reformule un apprentissage de la capsule en action concrète. Il n'introduit pas de fait nouveau.
