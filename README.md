# Le bon son

Une mini-appli pour s'entraîner aux lettres qui changent de son : **c ou ç**, **g, ge ou gu**, **s ou ss**.

- **Jouer en ligne :** https://lechampdelaurore-boop.github.io/le-bon-son/
- **Toutes les applis :** https://lechampdelaurore-boop.github.io/

## Le jeu

- On entend un mot (« garçon ») et on voit « gar_on » : il faut choisir **c** ou **ç**. Un mot sur trois se joue dans l'autre sens : le mot est écrit en entier et on choisit le son (« ici, ge fait le son g ou j ? »).
- La **règle** est affichée sous le mot, et la voyelle qui décide est en couleur.
- Trois niveaux par son, qui ne redescendent jamais :
  1. voyelle en couleur et règle visible ;
  2. règle visible seulement ;
  3. règle cachée sous un bouton « loupe ».
  On passe au niveau suivant à 8 bonnes réponses du premier coup sur 10. Un son est **acquis** (trophée) après 2 jours réussis au niveau 3.
- Une séance dure environ 5 minutes (12 mots), puis une créature dit « à demain ». Chaque jour de séance ajoute une étoile dans « Ma semaine ».
- En cas d'erreur : la carte secoue la tête, la voyelle qui décide clignote, la ligne de règle utile s'agrandit, et on réessaie. Le mot revient deux mots plus tard. Pas de croix rouge, pas de chrono.
- Les mots ratés reviennent en premier à la séance suivante.
- Récompenses : étoiles, rebond de la carte et 30 créatures kawaii originales.
- **Carnet du parent** (lien en bas de l'accueil) : niveau et réussite par son, jours de séance, mots les plus difficiles.
- **Mes mots** (dans le carnet) : on ajoute à la main les mots des devoirs ou des dictées. L'appli trouve toute seule le son à travailler dans chaque mot. Les mots peuvent être envoyés sur un autre appareil par un lien qui les contient.
- La voix de synthèse lit les mots si l'appareil a une voix française. Sinon, un petit dessin aide à reconnaître le mot.
- Réglages (bouton ⚙) : voix, sons et animations, chacun désactivable. L'appli respecte aussi le réglage « réduire les animations » de l'appareil.
- Design commun à toutes les applis de Marc (charte v1 : couleurs, formes, en-tête 🏠 · titre · ⚙).
- S'installe sur l'écran d'accueil d'un téléphone ou d'une tablette et fonctionne hors ligne.

Les progrès et les mots restent dans le navigateur de l'appareil (clé `marc.bon-son`) : aucun compte, et rien n'est envoyé sur internet.

## Fichiers

- `index.html` : toute l'appli (HTML, CSS et JavaScript, sans bibliothèque). La liste des mots est le tableau `WORDS`.
- `sw.js` et `manifest.webmanifest` : mode hors ligne et installation. Après une modification des fichiers de l'appli, changer la valeur de `CACHE` dans `sw.js`.
- `fonts/` : polices Fredoka et Nunito (licence SIL Open Font License, voir les fichiers `OFL-*.txt`).
- `icons/` : icône de l’appli (coins arrondis, version « maskable » pour Android, version iPhone).
- `tests/telephone.cjs` et `.github/workflows/test-telephone.yml` : après chaque mise en ligne, GitHub ouvre le site publié dans Chrome au format téléphone (7 tailles d'écran), joue trois mots et vérifie que l'écran de jeu ne défile pas et qu'il n'y a pas d'erreur. Résultat et captures dans l'onglet Actions. Lancement local : `npm install --no-save playwright && node tests/telephone.cjs` (ou `node tests/telephone.cjs http://localhost:8000/` pour une copie locale).
