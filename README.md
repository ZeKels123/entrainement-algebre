# Entraînement algèbre

Outil d'entraînement pour la maturité : calcul littéral, équations, géométrie, français
et anglais, avec fiches de cours par branche. Site statique, servi tel quel par GitHub
Pages : pas d'étape de build, pas de bundler, pas de npm. On peut aussi ouvrir
`index.html` directement dans le navigateur.

## Arborescence

```
index.html              squelette HTML, <link> vers le CSS, <script defer> dans l'ordre de chargement
css/style.css           toute la feuille de style
js/
  core/                 noyau partagé
    polynomes.js          polynômes, pgcd, diviseurs
    rendu-math.js         mise en forme et rendu des maths (polyStr, M, esc)
    analyse.js            analyse des saisies (tokenize, parse, toPoly)
    exercices-texte.js    exercices à réponse écrite (mkTxt, checkTxt), branches ↔ domaines
  algebre/              développer (+ outils communs, TAGS), factoriser (+ TOPICS, newExercise)
  equations/            équations, problèmes, second degré, systèmes
  correction/           diagnostic des réponses : algèbre, équations, géométrie
  geometrie/            figures, Pythagore/Thalès, cercles, solides, trigonométrie,
                        niveau 6, schémas explicatifs, cours de géométrie
  anglais/              exercices (anglais.js) et fiches de cours (fiches.js)
  francais/             registres, figures de style, sémantique, fiches de cours
  copie/                mode « Corrige la copie »
  stockage/             statistiques (stats.js), révision espacée SRS (revision-srs.js)
  ui/                   entraînement, examen, dessin, cours et bilan
  jeu/                  XP, rangs, badges, boutique, objets
  compte/               compte Supabase, synchronisation, classement
  branches/             branches de maturité : liste, accueil, navigation
  init.js               démarrage, chargé en dernier
docs/STRUCTURE.md       cartographie détaillée : rôle de chaque fichier, ordre de
                        chargement, registres partagés, clés localStorage
```

Les fichiers JS sont des scripts classiques qui partagent la portée globale : une
fonction déclarée dans un fichier est utilisable dans tous les autres. **L'ordre des
balises `<script>` dans `index.html` compte** : un fichier doit être chargé après ceux
dont il utilise les constantes **au chargement** (par exemple `TOPICS`, déclaré dans
`js/algebre/factoriser.js`). `js/init.js` reste toujours le dernier. Le détail est dans
[`docs/STRUCTURE.md`](docs/STRUCTURE.md).

Les données des élèves restent dans le `localStorage` sous les mêmes clés
(`dev-fact-stats-v1`, `dev-fact-game-v1`, `dev-fact-srs-v1`, …) et peuvent être
synchronisées par Supabase (`js/compte/compte.js`).

## Comment ajouter une branche

### Une branche de maturité avec ses fiches de cours

C'est le cas de Physique, Chimie, Histoire… Il suffit d'un fichier et d'une ligne dans
`index.html`.

1. Créer `js/<branche>/<branche>.js`, par exemple `js/biologie/biologie.js` :

   ```js
   'use strict';
   /* Biologie : fiches de cours */
   BRANCHES.push({id:'biologie',name:'Biologie',themes:['La cellule'],fiches:[
   {t:'La cellule',html:'<p>La cellule est l\'unité de base du vivant.</p>'}
   ]});
   ```

   Pour une branche déjà présente dans `BRANCHES` (par exemple `physique`), on remplit
   ses fiches au lieu de l'ajouter :
   `Object.assign(brData('physique'),{fiches:[ … ]});`
   (même modèle que `js/anglais/fiches.js` et `js/francais/fiches.js`).

2. Dans `index.html`, ajouter la balise **après** `js/branches/branches.js` et **avant**
   `js/ui/cours-bilan.js` :

   ```html
   <script defer src="js/biologie/biologie.js"></script>
   ```

La carte apparaît sur l'accueil, avec son rang et l'onglet « Cours ». La progression est
enregistrée sous l'`id` de la branche : ne plus le changer une fois publié.

### Des exercices dans un domaine existant (algèbre, équations, géométrie, français, anglais)

1. Créer un fichier, par exemple `js/geometrie/mon-theme.js`, qui définit ses
   générateurs et les enregistre dans `TOPICS` :

   ```js
   'use strict';
   function genMonTheme(){ /* … renvoie un exercice, comme les autres générateurs … */ }
   TOPICS['gt-7']={kind:'gtri',level:6,label:'Mon nouveau thème',gen:genMonTheme};
   ```

   Le `kind` doit faire partie du domaine visé (voir `DKINDS` dans
   `js/ui/entrainement.js`) et l'identifiant (`'gt-7'`) doit être nouveau : il sert de clé
   aux statistiques enregistrées. Utiliser des noms de fonctions et de constantes qui
   n'existent pas encore ailleurs.

2. Ajouter la balise dans `index.html` après les fichiers dont il dépend (pour la
   géométrie : après `js/geometrie/schemas.js`) et avant `js/stockage/stats.js`.

### Un nouveau domaine du moteur d'exercices

Créer un domaine avec son propre onglet d'entraînement (comme `ang` pour l'anglais)
demande encore de modifier des fichiers partagés :

- `domainOf` dans `js/algebre/factoriser.js` (associe un `kind` à son domaine) ;
- `DKINDS`, `MODES`, `DOM_TITLE`, `DOM_KICK`, `DOMSTORE`, `KIND_LABEL` dans
  `js/ui/entrainement.js` ;
- `BRDOM`, `DOMBR`, `BRDOMS` dans `js/core/exercices-texte.js` pour le rattacher à une
  branche ;
- la fiche de formules de l'examen dans `js/ui/examen.js`, si besoin.

S'inspirer de l'anglais (`js/anglais/anglais.js`) : générateurs, `TAGS` et
enregistrement dans `TOPICS`.
