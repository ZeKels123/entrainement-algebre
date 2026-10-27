'use strict';
/* Contenu Français : thème « Registres de langue » (d'après la feuille d'exercices du cours MPT-CRS-FRA, pages 3 et 4) */
Object.assign(brData('francais'),{
fiches:[
{d:'fr',t:'Registres de langue : repères',html:
'<p>Les pages de théorie ne sont pas encore dans l\'appli : cette fiche ne reprend que ce qui apparaît dans tes exercices.</p>'
+'<p><b>Familier</b> : langue de l\'oral. Indices relevés : mots familiers (<i>bouffer, mater, tabasser, bagnole, bossant, mec, type, clopes</i>), abréviations (<i>ciné, télé, docu, frigo</i>), élisions (<i>Not\' gosse, d\'répéter</i>), « ne » omis (<i>on peut rien, il faut jamais</i>), sujet répété (<i>sa femme elle a eu</i>), écriture phonétique (<i>jmonte, voulàtipas</i>).</p>'
+'<p><b>Courant</b> : langue neutre, sans mot familier ni recherché : <i>avoir très froid, manger, regarder quelqu\'un, battre quelqu\'un</i>.</p>'
+'<p><b>Soutenu</b> : langue recherchée. Indices relevés : mots rares ou poétiques (<i>luth, constellé, livrée, blasonné, sudoripare</i>), imparfait du subjonctif et inversion (<i>fallait-il que je vous visse</i>), phrases longues et complexes.</p>'},
{d:'fr',t:'Un même sens, trois registres',html:
'<table class="ov"><thead><tr><th>Courant</th><th>Familier</th><th>Soutenu</th></tr></thead><tbody>'
+'<tr><td>avoir très froid</td><td>se les geler</td><td>être transi</td></tr>'
+'<tr><td>manger</td><td>bouffer</td><td></td></tr>'
+'<tr><td>regarder quelqu\'un</td><td>mater</td><td>toiser</td></tr>'
+'<tr><td>battre quelqu\'un</td><td>tabasser</td><td>châtier</td></tr>'
+'<tr><td>café</td><td>caoua</td><td></td></tr>'
+'<tr><td>cinéma · télévision · documentaire</td><td>ciné · télé · docu</td><td></td></tr>'
+'<tr><td>réfrigérateur · cigarettes</td><td>frigo · clopes</td><td></td></tr>'
+'<tr><td>homme</td><td>type · mec</td><td></td></tr></tbody></table>'},
{d:'fr',t:'Autres exemples (ajoutés par moi, pas tirés de ton cours)',html:'<table class="ov"><thead><tr><th>Courant</th><th>Familier</th><th>Soutenu</th></tr></thead><tbody>'+FR_TRIOS.map(t=>'<tr><td>'+t[0]+'</td><td>'+t[1].join(' · ')+'</td><td>'+(t[2]?t[2].join(' · '):'')+'</td></tr>').join('')+'</tbody></table>'},
{d:'fr',t:'Le familier dans le texte de David Thomas',html:
'<p>Dans la micronouvelle (« Ça a commencé quand je me suis réveillé… »), les traits du registre familier sont :</p>'
+'<ul><li><b>lexique</b> : <i>caoua, type, mec, ciné, télé, docu, frigo, clopes, pourries, envoyer chier, passer des coups de fil, tuer une heure, ça m\'a foutu un bourdon</i></li>'
+'<li><b>syntaxe</b> : phrases sans « ne » (<i>il faut jamais désespérer</i>), tournures orales (<i>Y avait que…, Fallait pas insister, plus qu\'à</i>), phrases très courtes (<i>Bon, c\'était pas mon jour, quoi.</i>)</li></ul>'}
]});
/* Thème 2 : figures de style (pages « Analyse de texte : figures de style », Section Maturité) */
brData('francais').fiches.push(
{d:'ff',t:'Figures de style : les cinq familles',html:
'<table class="ov"><thead><tr><th>Famille</th><th>Figures</th></tr></thead><tbody>'
+'<tr><td>Analogie</td><td>comparaison, métaphore (in presentia, in absentia, filée), personnification, allégorie, animalisation, réification</td></tr>'
+'<tr><td>Substitution ↔</td><td>métonymie, synecdoque, périphrase</td></tr>'
+'<tr><td>Atténuation ▼</td><td>litote, euphémisme</td></tr>'
+'<tr><td>Opposition ≠</td><td>antithèse, oxymore, antiphrase, chiasme, parallélisme</td></tr>'
+'<tr><td>Amplification ▲</td><td>énumération, accumulation, gradation, répétition, anaphore, hyperbole</td></tr></tbody></table>'},
{d:'ff',t:'La comparaison',html:
'<p>La comparaison relie le <b>comparé</b> (ce dont on parle, le thème) et le <b>comparant</b> (ce qu\'on en dit, le propos) par un <b>outil</b>. Le <b>motif</b> est ce qui les rapproche.</p>'
+'<p>Outils fréquents : <i>comme, ainsi que, de même que, pareil à, semblable à, identique à, tel, différent de, ressembler à, sembler, avoir l\'air de, en, de, ressemblance, similitude</i>. Ils peuvent être de catégories grammaticales différentes. <b>Le verbe « être » n\'est pas un outil de comparaison.</b></p>'
+'<p>Le rapprochement est le plus souvent logique (motif évident) ; il peut être paradoxal ou énigmatique, car purement subjectif.</p>'
+'<p>Certaines comparaisons <b>ne sont pas des figures de style</b> : celles de la langue populaire devenues banales (<i>malin comme un singe, blanc comme un linge…</i>) et la comparaison simple, factuelle et objective (comparaison <b>grammaticale</b> : informer, décrire, clarifier).</p>'},
{d:'ff',t:'Métaphore et cas particuliers',html:
'<ul><li><b>Métaphore in presentia</b> : le comparé et le comparant sont tous deux présents. <b>In absentia</b> : le comparé est absent, le destinataire doit « décoder » l\'image.</li>'
+'<li>Les termes rapprochés peuvent être des noms, mais aussi des adjectifs ou des verbes.</li>'
+'<li><b>Métaphore filée</b> : suite de métaphores sur le même thème (même « fil »), avec des sèmes communs.</li>'
+'<li><b>Métaphores lexicalisées ou figées</b> (catachrèses) : la langue n\'a pas de mot propre (<i>le bras du fauteuil</i>). Les <b>figures d\'usage</b> sont des métaphores devenues courantes (<i>ne pas mettre la charrue avant les bœufs</i>). Elles ne sont plus considérées comme des figures de style.</li>'
+'<li><b>Personnification</b> : donne un caractère humain à un objet ou à un animal. Appliquée à une idée abstraite, c\'est une <b>allégorie</b>.</li>'
+'<li><b>Animalisation</b> : représenter une personne ou une chose sous les traits d\'un animal.</li>'
+'<li><b>Réification</b> : donner les caractéristiques d\'un objet à une personne ou à un animal.</li></ul>'},
{d:'ff',t:'Substitution : métonymie, synecdoque, périphrase',html:
'<p>La <b>métonymie</b> désigne une chose par un terme lié à elle par un rapport logique. On désigne :</p>'
+'<ul><li>le contenu par le contenant ; l\'objet par son lieu d\'origine ; l\'œuvre par son auteur</li><li>l\'abstrait par le concret ; la fonction par le lieu où elle est exercée ; le sentiment par une partie du corps</li></ul>'
+'<p>La <b>synecdoque</b> est une métonymie fondée sur l\'<b>inclusion</b> : la partie pour le tout, la matière pour l\'objet.</p>'
+'<p>La <b>périphrase</b> désigne quelqu\'un ou quelque chose par une expression au lieu de son nom (définition générale : elle n\'est pas rédigée dans les pages reçues, seulement travaillée en exercices).</p>'},
{d:'ff',t:'Atténuation : litote et euphémisme',html:
'<p><b>Litote</b> : expression affaiblie, en deçà de la réalité, qui cherche en fait à <b>renforcer</b> l\'information. Souvent fondée sur la négation de son contraire. Elle dit le moins pour exprimer le plus. Il faut connaître l\'intention de l\'émetteur pour l\'interpréter.</p>'
+'<p><b>Euphémisme</b> : atténue une réalité choquante, désagréable ou douloureuse, par souci réel ou feint de bienséance. Il cherche à <b>amoindrir</b> l\'information, et permet parfois d\'éviter un terme dévalorisant par un terme neutre. Fréquent dans les discours « politiquement corrects ».</p>'},
{d:'ff',t:'Opposition : antithèse, oxymore, antiphrase, chiasme, parallélisme',html:
'<ul><li><b>Antithèse</b> : met en parallèle des éléments antonymes pour mettre en valeur ce qui les sépare.</li>'
+'<li><b>Oxymore</b> (alliance de mots) : deux mots de sens opposés dans un même groupe de mots ; association inattendue qui met en évidence une réalité paradoxale.</li>'
+'<li><b>Antiphrase</b> : emploi d\'un mot dans un sens contraire à son sens habituel ; l\'ironie repose souvent sur elle (il faut le contexte ou l\'intonation).</li>'
+'<li><b>Chiasme</b> : construction en miroir, termes croisés <b>ABBA</b>.</li>'
+'<li><b>Parallélisme</b> : structure <b>ABAB</b> (à ne pas confondre avec le chiasme).</li></ul>'},
{d:'ff',t:'Amplification : énumération, accumulation, gradation, répétition, anaphore, hyperbole',html:
'<ul><li><b>Énumération</b> : détaille successivement les parties de ce qu\'on décrit ; éléments de même nature et de même fonction. <b>Inventaire</b> : énumération exhaustive.</li>'
+'<li><b>Accumulation</b> : énumération excessive ou interminable, souvent désordonnée (profusion, désordre, disproportion).</li>'
+'<li><b>Gradation</b> : termes juxtaposés ou coordonnés exprimant la même idée, de plus en plus forts (<b>ascendante</b>) ou de plus en plus faibles (<b>descendante</b>). Elle peut être parodique.</li>'
+'<li><b>Répétition</b> : reprise des mêmes termes sans modification lexicale ; peut renforcer une idée.</li>'
+'<li><b>Anaphore</b> : répétition d\'un mot ou groupe de mots au début de phrases ou de vers qui se suivent (symétrie, insistance).</li>'
+'<li><b>Hyperbole</b> : expression exagérée, superlative. Mots hyperboliques (<i>géant, fabuleux</i>), préfixes (<i>super, hyper</i>), suffixe <i>-issime</i>, superlatifs.</li></ul>'}
);

/* Thème « Sémantique » (d'après la feuille « Analyse de texte : sémantique », MPT-CRS-FRA) */
brData('francais').fiches.push(
{d:'fs',t:'Sémantique : signifiant, signifié, monosémie et polysémie',html:
'<p>La <b>sémantique</b> (du grec <i>semantikos</i>, « qui signifie ») est l\'étude du sens des mots. Chaque mot a une <b>forme concrète</b>, sonore ou écrite (le <b>signifiant</b>), et un <b>sens</b> (le <b>signifié</b>).</p>'
+'<p>Un mot <b>monosémique</b> ne porte qu\'une seule signification : soit il n\'a qu\'un sens (dénoté ou objectif) dans le dictionnaire (<i>un séquoia est un conifère et rien d\'autre</i>), soit il a plusieurs sens dans le dictionnaire mais n\'en garde qu\'un dans un énoncé (<i>« j\'ai mangé un croissant chaud » : l\'aliment, pas la lune ni l\'emblème musulman</i>).</p>'
+'<p>Un mot <b>polysémique</b> porte au moins deux significations. Beaucoup de mots le sont ; leur sens dépend du <b>contexte</b> (la phrase, voire le passage), c\'est-à-dire des mots qui précèdent ou qui suivent : c\'est eux qui font choisir un sens plutôt qu\'un autre.</p>'
+'<p>Une personne imperméable au symbolisme, qui ne voit dans le printemps qu\'une saison et dans un cheval qu\'un quadrupède, est victime d\'<b>asymbolie</b> : une monosémie pathologique connue des psychiatres.</p>'},
{d:'fs',t:'Nuances de sens : ancien/moderne, péjoratif/mélioratif, propre/figuré',html:
'<h3>A. Sens ancien et sens moderne</h3>'
+'<p>Certains mots ont un <b>sens ancien</b> et un <b>sens moderne</b> : <i>étonné</i> signifie aujourd\'hui « surpris », mais au XIXe siècle « troublé par une violente émotion » ; <i>gourmand</i> signifie surtout « qui aime faire bonne chère », alors qu\'avant la Révolution française il signifiait exclusivement « glouton ».</p>'
+'<h3>B. Sens péjoratif et sens mélioratif</h3>'
+'<p>Le mot <b>péjoratif</b> dévalorise, le mot <b>mélioratif</b> valorise. Ces mots servent à exprimer des jugements de valeur.</p>'
+'<table class="ov"><thead><tr><th>Neutre</th><th>Péjoratif</th><th>Mélioratif</th></tr></thead><tbody><tr><td>maison</td><td>bicoque</td><td>villa</td></tr><tr><td>voiture</td><td>tacot</td><td>bolide</td></tr></tbody></table>'
+'<p>Un <b>euphémisme</b> est un mot qui atténue une réalité jugée choquante : aujourd\'hui, certains mots sont souvent considérés comme péjoratifs et on les remplace par des euphémismes.</p>'
+'<h3>C. Sens propre et sens figuré</h3>'
+'<p>Le <b>sens propre</b> est le sens premier, le plus concret du mot. Le <b>sens figuré</b> est un sens dérivé, souvent plus imagé. Le passage du sens propre au sens figuré s\'opère principalement quand on passe du <b>concret à l\'abstrait</b>, ainsi que par <b>ressemblance (analogie)</b>.</p>'
+'<ul><li><i>Frappé</i> peut vouloir dire « battu », mais aussi « impressionné ».</li><li><i>Cœur</i> est, au sens propre, un organe ; au sens figuré, le courage, la générosité ou le centre (<i>le cœur d\'une ville</i>).</li></ul>'},
{d:'fs',t:'Dénotation, connotation et symbole',html:
'<p>Tous les mots ont un <b>sens dénoté (objectif)</b> et un <b>sens connoté (subjectif)</b>.</p>'
+'<p>La <b>dénotation</b> est le sens premier, littéral, objectif d\'un terme : l\'ensemble des sens livrés par le dictionnaire, qu\'ils soient au sens propre ou figuré.</p>'
+'<p>La <b>connotation</b> est le sens implicite, subjectif : l\'ensemble des éléments de sens qui peuvent s\'ajouter au sens littéral, l\'ensemble des sensations, des idées et des images que fait naître un mot dans l\'esprit d\'une personne. Elle est liée aux <b>réseaux de sens</b> qui s\'établissent à l\'intérieur d\'un texte : les connotations viennent des rapports et des associations entre les mots, mais aussi de notre subjectivité. Elle peut n\'avoir qu\'un très faible lien avec le sens dénoté.</p>'
+'<ul><li><i>Voiture</i> peut connoter la pollution, l\'accident, la famille… <i>Voiture</i> et <i>caisse</i> ont la même dénotation mais certainement une connotation différente.</li><li><i>Édredon</i> peut connoter la chaleur, le froid, l\'hiver, l\'amour, Andersen (« édredon » vient du danois <i>eider</i>)…</li><li>La couleur blanche connote la pureté et le mariage pour un Européen, le deuil pour un Asiatique.</li><li>Le svastika est perçu par un Indien comme un symbole religieux hindouiste (énergie positive) alors qu\'il évoque pour un Occidental le nazisme.</li></ul>'
+'<p>Le champ de la connotation est difficile à définir : il recouvre tous les sens <b>indirects, subjectifs, culturels, implicites</b>. Un même mot ou symbole peut avoir des connotations différentes selon le contexte.</p>'
+'<p>Un <b>symbole</b> correspond à la coexistence d\'un sens dénoté et d\'au moins un sens connoté <b>commun à un groupe humain</b> : <i>le chien est un animal (sens dénoté) qui symbolise la fidélité (sens connoté)</i>.</p>'
+'<p><b>Quatre grandes sources de connotations</b> : 1. la nature psychologique individuelle ; 2. l\'environnement social ; 3. l\'histoire personnelle ; 4. les interrelations des mots et des phrases, dans le cas d\'un texte.</p>'},
{d:'fs',t:'Champ sémantique et champ lexical',html:
'<p>L\'ensemble des sens d\'un mot constitue son <b>champ sémantique</b>. C\'est à partir de sa polysémie et de sa distribution qu\'on peut l\'établir : la somme des sens qu\'il peut prendre dans des occurrences variées. Exemple : <i>fantaisie</i> = création libre et imprévisible, caprice, création qui ne suit pas les règles établies (notamment en musique)…</p>'
+'<p>Le <b>champ lexical</b> est l\'ensemble des mots qui renvoient à <b>une même réalité, une même idée, une même notion</b> : tous les mots qui peuvent se regrouper autour d\'un même thème. Exemple : le champ lexical du <i>rêve</i> pourrait comprendre <i>songe, mirage, mythe, chimère, utopie, s\'imaginer, croire, se figurer, irréel, saugrenu, insolite, illusoire, pensif, absent…</i></p>'
+'<p>Observer les champs lexicaux d\'un texte permet de <b>déterminer le ou les thèmes dominants</b>. Mais il ne suffit pas d\'énumérer des termes : il faut les <b>interpréter</b>, en tenant compte de leur choix, de leur organisation, de leurs liens, de leur relation (directe ou non) avec le thème concerné. L\'interprétation d\'un même champ lexical <b>diffère selon le contexte</b> : il faut l\'expliquer en fonction du passage où il se trouve.</p>'
+'<p>Dans un texte long, la présence récurrente de certains champs lexicaux crée des échos et des parallélismes de sens appelés <b>motifs</b>. Exemple : dans <i>Germinal</i> de Zola, la fosse de la mine, appelée « Le Voreux », est systématiquement évoquée par le champ lexical d\'un homme ou d\'une bête monstrueuse qui ne cesse de dévorer les mineurs. Les motifs d\'une œuvre permettent de mettre en lumière les idées, les obsessions (parfois conscientes ou non) de l\'écrivain et de révéler les sens profonds d\'un texte.</p>'},
{d:'fs',t:'Exercices de la feuille (E et F)',html:
'<p>Les exercices E (texte de Baudelaire, <i>La Belle Dorothée</i> : sens dénoté et connotations des mots en italique, puis continuation du texte) et F (texte de Laurent Gaudé, <i>Eldorado</i> : trois champs lexicaux à repérer et à analyser sur feuille annexe) sont des travaux rédigés : ils ne sont pas corrigés par l\'appli. Les exercices A à D (deux sens d\'un mot, sens figuré, mot péjoratif, euphémisme) sont à réponse libre ; l\'appli propose à la place des exercices à réponse courte, rédigés par moi.</p>'},
{d:'fs',t:'Autres exemples (ajoutés par moi, pas tirés de ton cours)',html:
'<p>Ces exemples servent aux exercices ; ils viennent de mes connaissances générales (vérifie dans un dictionnaire en cas de doute).</p>'
+'<table class="ov"><thead><tr><th>Neutre</th><th>Péjoratif</th><th>Mélioratif</th></tr></thead><tbody><tr><td>cheveux</td><td>tignasse</td><td>chevelure</td></tr><tr><td>visage</td><td>trogne</td><td>minois</td></tr><tr><td>logement</td><td>taudis</td><td>demeure</td></tr><tr><td>vin</td><td>piquette</td><td>nectar</td></tr><tr><td>odeur</td><td>puanteur</td><td>parfum</td></tr><tr><td>mince</td><td>efflanqué</td><td>svelte</td></tr></tbody></table>'
+'<table class="ov"><thead><tr><th>Mot</th><th>Sens moderne</th><th>Sens ancien</th></tr></thead><tbody><tr><td>formidable</td><td>remarquable</td><td>redoutable, qui fait peur</td></tr><tr><td>énerver</td><td>agacer</td><td>priver de force, affaiblir</td></tr><tr><td>ennui</td><td>lassitude</td><td>tourment, chagrin violent</td></tr><tr><td>bureau</td><td>meuble, pièce de travail</td><td>étoffe de laine grossière</td></tr><tr><td>magasin</td><td>lieu de vente</td><td>entrepôt</td></tr></tbody></table>'
+'<table class="ov"><thead><tr><th>Symbole</th><th>Sens dénoté</th><th>Sens connoté</th></tr></thead><tbody><tr><td>la balance</td><td>instrument de pesée</td><td>la justice</td></tr><tr><td>la colombe</td><td>oiseau</td><td>la paix</td></tr><tr><td>le lion</td><td>grand félin</td><td>le courage</td></tr><tr><td>le renard</td><td>mammifère</td><td>la ruse</td></tr><tr><td>la branche d\'olivier</td><td>rameau d\'arbre</td><td>la paix</td></tr><tr><td>la couronne</td><td>ornement de tête</td><td>le pouvoir</td></tr></tbody></table>'}
);
