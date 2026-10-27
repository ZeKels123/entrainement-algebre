# Structure du code

Le site est statique : `index.html` charge `css/style.css`, puis une suite de scripts
classiques (`<script defer src="…">`), **sans modules ES, sans bundler et sans npm**.
Il fonctionne tel quel sur GitHub Pages (`/entrainement-algebre/`) et en ouvrant
`index.html` directement (`file://`).

Ce découpage vient de l'ancien `index.html` monolithique (un `<style>` et un unique
`<script>` d'environ 10 000 lignes, enveloppé dans `(function(){ 'use strict'; … })();`).
Le code a été **déplacé tel quel** : aucune ligne n'a été réécrite ni renommée.

## Principe de fonctionnement

- **Portée partagée.** L'ancien script était une seule fonction (IIFE) : toutes les
  fonctions et constantes se voyaient entre elles. L'enveloppe a été retirée, donc les
  déclarations de premier niveau (`function`, `const`, `let`, `class`) vivent maintenant
  dans la portée globale du document, partagée par tous les scripts classiques. Un
  fichier peut ainsi utiliser une fonction ou une constante déclarée dans un autre, avec
  les mêmes noms qu'avant.
- **Mode strict.** Chaque fichier commence par `'use strict';` (comme l'ancienne IIFE).
- **Ordre de chargement.** Les `<script defer>` s'exécutent dans l'ordre où ils
  apparaissent dans `index.html`, une fois le HTML analysé (même moment que l'ancien
  script placé en fin de page). Cet ordre compte pour le code qui **s'exécute au
  chargement** :
  - enregistrements dans les registres (`TOPICS[...] = …`, `Object.assign(TAGS, …)`,
    `FRGEN`, `GV`, `GVMAP`, `ENT(...)`, `FRT(...)`) ;
  - lectures du `localStorage` (`stats`, `G`, `SR`, `brProg`, `SYNC`) ;
  - `brSetup()` (écouteurs de la barre des branches) ;
  - `init()` en tout dernier (`js/init.js`).

  Une `const` ou `let` doit être déclarée dans un fichier chargé **avant** tout code
  qui la lit au chargement. Les fonctions appelées plus tard (clics, `init()`) peuvent,
  elles, utiliser n'importe quel nom défini dans n'importe quel fichier.
- **Noms uniques.** Deux fichiers ne peuvent pas déclarer le même nom de premier niveau
  (`const`/`let` en double = `SyntaxError` au chargement du second fichier ; `function`
  en double = la dernière écrase la première). Avant d'ajouter un nom, chercher s'il
  existe déjà (`grep -rn "nomCherché" js/`).

## Arborescence et ordre de chargement

Les numéros de lignes renvoient à l'ancien `index.html` (commit `ceee127`).

| # | Fichier | Rôle | Lignes d'origine |
|---|---------|------|------------------|
| 1 | `js/core/polynomes.js` | Polynômes creux (`padd`, `pmul`, `peq`…), pgcd, diviseurs | 651–691 |
| 2 | `js/core/rendu-math.js` | Mise en forme : `polyStr`, `esc`, rendu HTML des maths `M()` et des fractions | 692–776 |
| 3 | `js/core/analyse.js` | Analyse d'une saisie : `tokenize`, `parse`, `toPoly`, structure développée/factorisée | 777–1024 |
| 4 | `js/algebre/developper.js` | Outils communs des générateurs (`rnd`, `pick`, `mkEx`…), **`TAGS`**, générateurs « développer » | 1025–1238 |
| 5 | `js/algebre/factoriser.js` | Générateurs « factoriser », **`TOPICS`**, `LEVEL_NAMES`, `domainOf`, `newExercise` | 1239–1599 |
| 6 | `js/equations/equations.js` | Rationnels, résolution exacte, équations (`eq-*`) | 1600–1850 |
| 7 | `js/equations/problemes.js` | Mise en équation (`pb-1` à `pb-5`) | 1851–2062 |
| 8 | `js/equations/second-degre.js` | Discriminant, Viète (`qd-*`) | 2063–2246 |
| 9 | `js/equations/systemes.js` | Systèmes 2 et 3 inconnues (`sy-*`, `pb-6`, `pb-7`) | 2247–2593 |
| 10 | `js/correction/diagnostic.js` | Correction : diagnostic des réponses (`checkAnswer`, `checkWork`…) | 3399–3537 |
| 11 | `js/correction/equations.js` | Correction des équations, systèmes, second degré | 3538–3924 |
| 12 | `js/geometrie/figures.js` | Figures SVG (`g`, `mkGeo`), triangles et quadrilatères (`gt-*`, `gq-*`) | 2594–2916 |
| 13 | `js/geometrie/pythagore-thales.js` | Pythagore (`gp-*`), Thalès (`gh-*`) | 2917–3166 |
| 14 | `js/geometrie/cercles-composees.js` | Angles dans le cercle (`gc-*`), figures composées (`gm-*`) | 3167–3398 |
| 15 | `js/correction/geometrie.js` | Correction de la géométrie (valeurs avec π et √, unités) | 3925–4170 |
| 16 | `js/geometrie/niveau6.js` | Problèmes de synthèse de niveau 6 | 4171–4340 |
| 17 | `js/geometrie/angles-livre.js` | Angles et unités (`gang-*`), exercices du livre | 4341–4883 |
| 18 | `js/geometrie/niveau6-formes.js` | Formes composées de niveau 6 (rosace, lunules, encoches…) | 4884–5273 |
| 19 | `js/geometrie/solides.js` | Solides et volumes (`gs-*`) | 5274–5590 |
| 20 | `js/geometrie/trigonometrie.js` | Trigonométrie du triangle rectangle (`gr-*`) | 5591–5776 |
| 21 | `js/geometrie/supplements.js` | Exercices supplémentaires et figures de synthèse (`gm-7*`…) | 5777–6304 |
| 22 | `js/geometrie/originaux.js` | Exercices originaux (`gm-8*`, `gc-7*`) | 6305–6652 |
| 23 | `js/geometrie/schemas.js` | Schémas explicatifs : `GV`, `GVMAP` | 8121–8438 |
| 24 | `js/core/exercices-texte.js` | Exercices « texte » partagés par l'anglais et le français : `enPick`, `enNorm`, `enNorm2`, `mkTxt`, `checkTxt`, correspondance `BRDOM` / `DOMBR` / `BRDOMS`, `tagDom` | 6654–6655, 6777–6806 |
| 25 | `js/anglais/anglais.js` | Anglais : données `EN`, générateurs `ENGEN`, `ENT(...)` | 6653, 6656–6776, 6807–6814 |
| 26 | `js/francais/registres.js` | Registres de langue : données, `FRGEN`, `FRT(...)` | 6815–6934 |
| 27 | `js/francais/figures-de-style.js` | Figures de style, textes d'auteurs | 6935–7290 |
| 28 | `js/francais/semantique.js` | Sémantique | 7291–7678 |
| 29 | `js/copie/corrige-copie.js` | Mode « Corrige la copie » (copies d'élèves à diagnostiquer) | 7679–8120 |
| 30 | `js/stockage/stats.js` | Statistiques : `STORE`, `stats`, `loadStats`, `saveStats` | 8459–8464 |
| 31 | `js/ui/entrainement.js` | Interface d'entraînement : `$`, état `S`, `DKINDS`, `MODES`, `DOM_TITLE`, `setTab`, `newSeries`, `onCheck`… | 8439–8458, 8465–8724 |
| 32 | `js/geometrie/cours.js` | Cours de géométrie (`courseGeo`) | 8725–8842 |
| 33 | `js/ui/dessin.js` | Dessin sur la figure (crayon, ligne, gomme) | 8843–8894 |
| 34 | `js/jeu/jeu.js` | Couche de jeu : `GSTORE`, état `G`, XP, rangs, badges, sons | 8895–9203 |
| 35 | `js/stockage/revision-srs.js` | Révision espacée (Leitner) : `SRS_KEY`, `SR` ; défis quotidiens | 9204–9294 |
| 36 | `js/ui/examen.js` | Mode examen, fiche de formules, vérification pas à pas | 9295–9483 |
| 37 | `js/jeu/boutique.js` | Paris, récompenses, coffres, boutique | 9484–9806 |
| 38 | `js/jeu/objets.js` | Objets pour apprendre (consommables) | 9807–9876 |
| 39 | `js/compte/compte.js` | Compte Supabase, synchronisation, classement | 9877–10190 |
| 40 | `js/branches/branches.js` | Branches de maturité : `BRANCHES`, `BR`, `brProg`, accueil, `setBranch`, `brSetup()` | 10191–10310 |
| 41 | `js/anglais/fiches.js` | Fiches de cours d'anglais (`brData('anglais')`) | 10311–10336 |
| 42 | `js/francais/fiches.js` | Fiches de cours de français (`brData('francais')`) | 10337–10444 |
| 43 | `js/ui/cours-bilan.js` | Cours, bilan, rangs par thème | 10445–10691 |
| 44 | `js/init.js` | `init()` : branchement des événements puis démarrage, appelé en dernier | 10692–10735 |

`css/style.css` contient exactement l'ancien bloc `<style>` (lignes 6–535). Le reste de
`index.html` (le `<head>`, avec les polices Google Fonts, et tout le HTML) est inchangé.

### Écarts par rapport à l'ordre d'origine

Quelques blocs ont été regroupés par thème au lieu de suivre l'ordre du fichier
d'origine. Un outil d'analyse (AST) a vérifié que ces déplacements ne changent rien :
aucun code exécuté au chargement ne lit une `const`/`let` déclarée plus loin, et
l'ordre relatif de toutes les écritures dans un même registre est conservé (en
particulier l'ordre des clés de `TOPICS`, qui fixe l'ordre d'affichage des thèmes).

- `correction/diagnostic.js` et `correction/equations.js` sont chargés avant la géométrie
  (ils étaient entre les figures composées et la correction de la géométrie) ;
- `geometrie/schemas.js` est chargé juste après les autres fichiers de géométrie (il
  était après « Corrige la copie ») ;
- `core/exercices-texte.js` regroupe les parties génériques de l'ancienne section
  « Anglais » (utilisées aussi par le français) ;
- `stockage/stats.js` est chargé juste avant `ui/entrainement.js`, dont il faisait partie ;
- les fiches d'anglais et de français sont sorties de la section « Branches ».

## Registres et état partagés

| Nom | Déclaré dans | Rôle |
|-----|--------------|------|
| `TOPICS` | `algebre/factoriser.js` | Tous les thèmes d'exercices : `{kind, level, label, gen}` ; chaque fichier de branche y ajoute les siens |
| `TAGS` | `algebre/developper.js` | Étiquettes d'erreurs (titre, conseil) ; complété par `Object.assign(TAGS, …)` |
| `domainOf(kind)` | `algebre/factoriser.js` | Domaine du moteur (`alg`, `eq`, `geo`, `ang`, `fr`, `ff`, `fs`) d'après le préfixe du `kind` |
| `DKINDS`, `MODES`, `DOM_TITLE`, `DOM_KICK`, `DOMSTORE`, `KIND_LABEL` | `ui/entrainement.js` | Description des domaines pour l'interface |
| `S` | `ui/entrainement.js` | État de l'entraînement en cours |
| `BRDOM`, `DOMBR`, `BRDOMS` | `core/exercices-texte.js` | Correspondance branches de maturité ↔ domaines du moteur |
| `GV`, `GVMAP` | `geometrie/schemas.js` | Schémas explicatifs et association thème → schéma |
| `FRGEN`, `ENGEN` | `francais/registres.js`, `anglais/anglais.js` | Générateurs des exercices de texte |
| `BRANCHES`, `BR` | `branches/branches.js` | Liste des branches de maturité, branche affichée |
| `stats`, `G`, `SR`, `brProg`, `SYNC` | voir ci-dessous | État persistant |

## Stockage local et Supabase (inchangés)

| Constante | Clé `localStorage` | Fichier |
|-----------|--------------------|---------|
| `STORE` | `dev-fact-stats-v1` | `stockage/stats.js` |
| `GSTORE` | `dev-fact-game-v1` | `jeu/jeu.js` |
| `SRS_KEY` | `dev-fact-srs-v1` | `stockage/revision-srs.js` |
| `SYNCKEY` | `dev-fact-sync-v1` | `compte/compte.js` |
| `BACKKEY` | `dev-fact-backup-v1` | `compte/compte.js` |
| `ACCKEY` | `dev-fact-acct-v1` | `compte/compte.js` |
| `BRSTORE` | `maturite-branches-v1` | `branches/branches.js` |

La connexion Supabase (`SB_URL`, `SB_KEY`, `REMOTE`, `sb()`) est dans
`js/compte/compte.js`, à l'identique.

## Dépendances principales entre fichiers

Seules les dépendances **au chargement** imposent un ordre ; les autres sont résolues
au moment de l'appel.

- `core/*` ne dépend de rien d'autre que `core/*`.
- Toutes les branches d'exercices utilisent `core/*` et les outils de
  `algebre/developper.js` (`rnd`, `pick`, `mkEx`, `TAGS`) ; elles écrivent dans `TOPICS`
  (déclaré dans `algebre/factoriser.js`), donc elles se chargent après ces deux fichiers.
- La géométrie s'appuie sur `geometrie/figures.js` (`g`, `mkGeo`, `NF`…), puis sur les
  fichiers de géométrie précédents (`figCirc`, `kPi`, `arcM`…).
- Le français et l'anglais s'appuient sur `core/exercices-texte.js` (`mkTxt`, `enNorm2`).
- `stockage/stats.js`, `jeu/jeu.js`, `stockage/revision-srs.js`, `compte/compte.js` et
  `branches/branches.js` lisent le `localStorage` au chargement.
- `ui/*`, `jeu/*`, `compte/compte.js`, `branches/branches.js` et `init.js` s'appellent
  entre eux dans les deux sens, uniquement à l'exécution (après `init()`).
