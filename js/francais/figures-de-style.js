'use strict';
/* ===== Français : figures de style (exercices rédigés pour l'appli ; définitions d'après les pages de cours reçues) ===== */
Object.assign(TAGS,{
  'fr-fig':{label:'Figure de style confondue',tip:'Repère le mécanisme : analogie (comparaison, métaphore…), substitution (métonymie, synecdoque, périphrase), atténuation (litote, euphémisme), opposition (antithèse, oxymore, antiphrase, chiasme, parallélisme), amplification (énumération, accumulation, gradation, répétition, anaphore, hyperbole).'},
  'fr-struct':{label:'Structure ABBA ou ABAB',tip:'Chiasme : termes croisés en miroir (ABBA). Parallélisme : mêmes places dans les deux membres (ABAB).'},
  'fr-lito':{label:'Litote ou euphémisme',tip:'La litote dit moins pour faire entendre plus (elle renforce). L\'euphémisme adoucit une réalité désagréable (il l\'amoindrit).'},
  'fr-grad':{label:'Gradation ascendante ou descendante',tip:'Ascendante : termes de plus en plus forts. Descendante : termes de plus en plus faibles.'},
  'fr-comp':{label:'Comparé, comparant, outil',tip:'Comparé : ce dont on parle. Comparant : ce à quoi on le compare. Outil : le mot qui les relie (comme, tel, ressembler à…). Le verbe être n\'est pas un outil de comparaison.'}
});
/* [nom, famille, définition] */
const FR_FIGS=[
  ['comparaison','analogie','rapproche un comparé et un comparant grâce à un outil de comparaison (comme, tel, ressembler à…)'],
  ['métaphore','analogie','rapproche deux éléments sans outil de comparaison (in presentia : comparé et comparant présents ; in absentia : comparé absent)'],
  ['personnification','analogie','donne un caractère humain à un objet ou à un animal'],
  ['allégorie','analogie','personnification appliquée à une idée abstraite'],
  ['animalisation','analogie','représente une personne ou une chose sous les traits d\'un animal'],
  ['réification','analogie','donne les caractéristiques d\'un objet à une personne ou à un animal'],
  ['métonymie','substitution','désigne une chose par un terme lié à elle par un rapport logique (contenant pour contenu, lieu pour fonction, œuvre pour auteur…)'],
  ['synecdoque','substitution','forme de métonymie fondée sur l\'inclusion (la partie pour le tout, la matière pour l\'objet)'],
  ['périphrase','substitution','remplace un mot par une expression qui désigne la même chose sans la nommer'],
  ['litote','atténuation','dit le moins pour faire entendre le plus, souvent par la négation du contraire ; elle renforce l\'information'],
  ['euphémisme','atténuation','atténue une réalité choquante ou désagréable ; il amoindrit l\'information'],
  ['antithèse','opposition','met en parallèle des éléments antonymes pour mettre en valeur ce qui les sépare'],
  ['oxymore','opposition','allie deux mots de sens opposés dans un même groupe de mots'],
  ['antiphrase','opposition','exprime une idée par l\'expression contraire (base de l\'ironie)'],
  ['chiasme','opposition','construction en miroir, termes croisés selon la structure ABBA'],
  ['parallélisme','opposition','construction de deux membres dont les termes se suivent dans le même ordre (ABAB)'],
  ['énumération','amplification','détaille les parties de ce qu\'on décrit, avec des éléments de même nature et de même fonction'],
  ['accumulation','amplification','énumération excessive, interminable, souvent désordonnée'],
  ['gradation','amplification','série de termes de plus en plus forts (ascendante) ou de plus en plus faibles (descendante)'],
  ['répétition','amplification','reprend les mêmes termes sans aucune modification lexicale'],
  ['anaphore','amplification','répète un mot ou un groupe de mots au début de phrases ou de vers qui se suivent'],
  ['hyperbole','amplification','expression exagérée, superlative, d\'une idée']
];
const FIGN=FR_FIGS.map(f=>f[0]), FIGD={}; FR_FIGS.forEach(f=>{ FIGD[f[0]]=f; });
const FIGMIST=good=>FIGN.filter(n=>n!==good&&enNorm2(n)!==enNorm2(good)).map(n=>[n,'Ce n\'est pas une '+n+' : cette figure '+FIGD[n][2]+'.']);
const FIGFB={tag:'fr-fig',title:'Nomme la figure de style',html:'<p>Écris le nom d\'une figure de style (par exemple métaphore, litote, anaphore…). Les accents et les majuscules ne comptent pas. Utilise un indice si tu bloques.</p>'};
/* phrases rédigées pour l'appli : [phrase, figure, indice] */
const FIG1=[
  ['Elle restait immobile, pareille à une statue de sel.','comparaison','L\'outil « pareille à » relie « elle » (comparé) et « une statue de sel » (comparant).'],
  ['Sa colère montait comme le lait sur le feu.','comparaison','L\'outil « comme » rapproche la colère et le lait qui déborde.'],
  ['Il dormait, semblable à un enfant fatigué.','comparaison','L\'outil « semblable à » rapproche l\'homme et un enfant fatigué.'],
  ['Sa mémoire est un coffre sans fond.','métaphore','Aucun outil : la mémoire est directement appelée « coffre » (métaphore in presentia).'],
  ['Les étoiles étaient des lanternes accrochées au plafond de la nuit.','métaphore','Les étoiles sont identifiées à des lanternes, sans outil de comparaison.'],
  ['Cette fille est un rayon de soleil dans la maison.','métaphore','Le comparé (la fille) est identifié au comparant (un rayon de soleil), sans outil.'],
  ['La mer murmurait des secrets aux rochers.','personnification','La mer reçoit des traits humains : murmurer, confier des secrets.'],
  ['La lune souriait derrière les nuages.','personnification','« Souriait » donne un comportement humain à la lune.'],
  ['Le vieux chêne protégeait le village de ses grands bras.','personnification','Le chêne reçoit des bras et un geste protecteur : traits humains.'],
  ['Le chef rugit ses ordres devant toute l\'équipe.','animalisation','Une personne est représentée sous les traits d\'un animal (rugir).'],
  ['Les clients, troupeau docile, attendaient devant la caisse.','animalisation','Les clients (des personnes) deviennent un « troupeau » : traits d\'un animal.'],
  ['Sa voisine, vipère jalouse, répandait des rumeurs.','animalisation','Une personne est présentée comme un animal (une vipère).'],
  ['Le soldat, simple rouage de la machine, obéissait sans réfléchir.','réification','Une personne reçoit les caractéristiques d\'un objet : un rouage.'],
  ['On l\'a traitée comme une marchandise qu\'on déplace d\'un entrepôt à l\'autre.','réification','Une personne est traitée comme un objet : une marchandise.'],
  ['Le chanteur, devenu produit de l\'industrie, était exposé en vitrine.','réification','Une personne devient un objet de commerce : un produit en vitrine.'],
  ['La Paix, une branche d\'olivier à la main, marchait entre les armées.','allégorie','Une idée abstraite (la Paix) est représentée comme un personnage.'],
  ['L\'Hiver, vieillard voûté, traînait sa cape de givre sur les champs.','allégorie','Une idée abstraite (l\'Hiver) est personnifiée.'],
  ['Le Temps, vieillard muni d\'un sablier, regardait passer les saisons.','allégorie','Une idée abstraite (le Temps) est représentée comme un personnage.'],
  ['Il a bu un verre de trop pendant la soirée.','métonymie','On désigne le contenu (la boisson) par le contenant (le verre).'],
  ['Washington a imposé de nouvelles sanctions.','métonymie','On désigne le gouvernement par le lieu où il siège.'],
  ['Il lit du Victor Hugo avant de dormir.','métonymie','On désigne l\'œuvre par son auteur.'],
  ['Dix voiles apparurent à l\'horizon.','synecdoque','Les « voiles » (une partie) désignent les bateaux (le tout).'],
  ['Sous ce ciel, vingt mille âmes se pressaient dans la ville.','synecdoque','Les « âmes » (une partie de l\'être) désignent les personnes.'],
  ['Il a enfilé son cuir avant de partir.','synecdoque','La matière (le cuir) désigne l\'objet (le blouson).'],
  ['L\'astre du jour se leva sur la vallée.','périphrase','« L\'astre du jour » désigne le soleil sans le nommer.'],
  ['Le septième art attire de moins en moins de jeunes.','périphrase','« Le septième art » désigne le cinéma sans le nommer.'],
  ['Le pays du soleil levant exporte ces appareils.','périphrase','« Le pays du soleil levant » désigne le Japon sans le nommer.'],
  ['Ses mains étaient froides comme du marbre.','comparaison','L\'outil « comme » relie « ses mains » (comparé) et « du marbre » (comparant).'],
  ['Le directeur parlait tel un général devant ses troupes.','comparaison','L\'outil « tel » rapproche le directeur et un général.'],
  ['Cette ville ressemble à une fourmilière en plein été.','comparaison','L\'outil « ressemble à » rapproche la ville et une fourmilière.'],
  ['La nouvelle s\'est répandue ainsi qu\'une traînée de poudre.','comparaison','L\'outil « ainsi que » relie les deux termes.'],
  ['Cette classe est une ruche bourdonnante.','métaphore','Aucun outil de comparaison : la classe est directement appelée « ruche » (métaphore in presentia).'],
  ['Le lac est un miroir d\'argent à l\'aube.','métaphore','Le lac (comparé) est identifié à un miroir (comparant), sans outil.'],
  ['Il déversait un torrent d\'insultes sur l\'arbitre.','métaphore','« Un torrent d\'insultes » : les insultes sont comparées à un torrent, sans outil de comparaison.'],
  ['Les notes du piano pleuvaient dans la salle.','métaphore','Le verbe « pleuvaient » est une métaphore : les notes sont comparées à de la pluie, sans outil.'],
  ['Le vent siffle sa colère dans la cheminée.','personnification','Le vent éprouve de la colère : un trait humain est donné à un élément naturel.'],
  ['La vieille horloge soupirait à chaque heure.','personnification','« Soupirait » donne un comportement humain à un objet.'],
  ['La nuit étendit sa main sur la ville.','personnification','La nuit reçoit une main : un caractère humain est donné à une chose.'],
  ['Ce vieux voisin grogne et aboie sur tous les passants.','animalisation','Une personne est représentée sous les traits d\'un animal (grogner, aboyer).'],
  ['La foule se précipita, meute affamée, sur les derniers billets.','animalisation','La foule (des personnes) devient une « meute » : traits d\'un animal.'],
  ['Le prisonnier, pantin sans volonté, se laissait pousser d\'une salle à l\'autre.','réification','Une personne reçoit les caractéristiques d\'un objet : un pantin.'],
  ['On l\'avait rangé dans un coin comme un meuble, et on l\'oubliait.','réification','Une personne est traitée comme un objet : un meuble.'],
  ['La Justice, les yeux bandés, tient sa balance au-dessus des hommes.','allégorie','Une idée abstraite (la Justice) est personnifiée.'],
  ['La Mort, la faux à l\'épaule, avançait lentement dans la plaine.','allégorie','Une idée abstraite (la Mort) est représentée comme un personnage.'],
  ['Il a avalé deux assiettes avant de repartir.','métonymie','On désigne le contenu (la nourriture) par le contenant (l\'assiette).'],
  ['L\'Élysée a démenti ces rumeurs.','métonymie','On désigne la fonction ou le gouvernement par le lieu où il siège.'],
  ['Elle a acheté un Monet pour son salon.','métonymie','On désigne l\'œuvre par son auteur.'],
  ['Il a commandé un champagne pour fêter la nouvelle.','métonymie','On désigne l\'objet par son lieu d\'origine.'],
  ['Tout le stade s\'est levé pour applaudir.','métonymie','On désigne les personnes par le lieu où elles se trouvent.'],
  ['Il n\'y a pas un toit pour abriter ces gens.','synecdoque','Le « toit » (une partie) désigne la maison (le tout).'],
  ['Nous cherchons des bras pour la récolte.','synecdoque','Les « bras » (partie du corps) désignent les ouvriers.'],
  ['Les mauvaises langues du village ont tout répété.','synecdoque','Les « langues » (une partie) désignent les personnes.'],
  ['La ville lumière accueille chaque année des millions de visiteurs.','périphrase','« La ville lumière » désigne Paris sans la nommer.'],
  ['Le roi des animaux se reposait à l\'ombre.','périphrase','« Le roi des animaux » désigne le lion sans le nommer.'],
  ['Notre planète bleue est fragile.','périphrase','« Planète bleue » désigne la Terre sans la nommer.']
];
const FIG2=[
  ['Le bonheur des uns fait le malheur des autres.','antithèse','« bonheur » et « malheur » sont des termes opposés mis en parallèle.'],
  ['Il est petit par la taille, mais grand par le cœur.','antithèse','« petit » et « grand » s\'opposent dans la même phrase.'],
  ['La ville s\'endort quand la campagne s\'éveille.','antithèse','« s\'endort » et « s\'éveille » sont opposés.'],
  ['Ils gardaient un silence éloquent.','oxymore','« silence » et « éloquent » sont contradictoires dans un même groupe de mots.'],
  ['Une joyeuse tristesse l\'envahit au moment de partir.','oxymore','« joyeuse » et « tristesse » sont réunis dans le même groupe.'],
  ['Ce secret de polichinelle, tout le village le connaît.','oxymore','« secret » et « de polichinelle » (connu de tous) se contredisent dans une même expression.'],
  ['Il pleut des cordes et on part en pique-nique : la belle journée !','antiphrase','Le locuteur pense le contraire de ce qu\'il dit : c\'est ironique.'],
  ['Devant les bagages perdus, elle soupira : « Quelle chance nous avons ! »','antiphrase','« Quelle chance » veut dire le contraire : antiphrase ironique.'],
  ['Tu as encore perdu ton téléphone ? Quelle merveille d\'organisation !','antiphrase','Le compliment signifie son contraire : antiphrase.'],
  ['Le train a trois heures de retard : c\'est d\'une ponctualité remarquable.','antiphrase','L\'éloge signifie le contraire de ce qu\'il dit : antiphrase.'],
  ['Ce n\'est pas rien, ce que tu as fait pour nous !','litote','Négation (« pas rien ») pour dire que c\'est beaucoup : dire moins pour suggérer plus.'],
  ['Il ne manque pas d\'humour, ton frère.','litote','Négation du contraire pour dire qu\'il en a beaucoup.'],
  ['Ce film ne m\'a pas déplu du tout.','litote','La négation du contraire suggère qu\'il a beaucoup plu.'],
  ['Cet été, le chat a été endormi par le vétérinaire.','euphémisme','On adoucit une réalité pénible : l\'euthanasie.'],
  ['Le rapport évoque des « dommages collatéraux » pour parler des victimes civiles.','euphémisme','L\'expression atténue une réalité choquante.'],
  ['L\'entreprise procède à une restructuration de ses effectifs.','euphémisme','Le terme évite de dire « supprimer des emplois ».'],
  ['Il est pauvre en argent, mais riche en amis.','antithèse','« pauvre » et « riche » sont des antonymes mis en parallèle.'],
  ['Les uns rient, les autres pleurent.','antithèse','« rient » et « pleurent » s\'opposent.'],
  ['Elle cherche la lumière quand lui préfère l\'ombre.','antithèse','« lumière » et « ombre » sont des termes opposés mis en parallèle.'],
  ['Un silence assourdissant remplit la salle.','oxymore','« silence » et « assourdissant » sont contradictoires dans un même groupe de mots.'],
  ['Il avait un froid brûlant dans le dos.','oxymore','« froid » et « brûlant » sont réunis dans le même groupe.'],
  ['Cette douce violence m\'a surpris.','oxymore','« douce » et « violence » sont contradictoires, dans un même groupe nominal.'],
  ['Tu as renversé tout le café : bravo, quel talent !','antiphrase','Le locuteur pense le contraire de ce qu\'il dit : c\'est ironique.'],
  ['Il a oublié mon anniversaire : quel ami attentionné !','antiphrase','« attentionné » veut dire le contraire : antiphrase ironique.'],
  ['Tu ris quand je pleure et pleures quand je ris.','chiasme','« ris – pleure / pleures – ris » : termes croisés en miroir (ABBA).'],
  ['Il faut manger pour vivre et non vivre pour manger.','chiasme','« manger – vivre / vivre – manger » : construction en miroir (ABBA).'],
  ['Le matin, il marche dans les bois ; le soir, il marche sur la plage.','parallélisme','Les deux membres suivent le même ordre (ABAB).'],
  ['Elle écrivait des lettres d\'amour ; il écrivait des lettres de rupture.','parallélisme','Les deux membres reprennent la même construction dans le même ordre (ABAB).'],
  ['Cette soupe n\'est pas mauvaise, dit-il en la resservant trois fois.','litote','Négation du contraire (« pas mauvaise ») pour dire qu\'elle est très bonne.'],
  ['Elle n\'est pas sans talent.','litote','Double négation qui suggère bien plus que ce qui est dit.'],
  ['Notre voisin est parti pour un monde meilleur.','euphémisme','On adoucit une réalité pénible : la mort.'],
  ['Un plan social a été annoncé à l\'usine.','euphémisme','Le terme neutre évite le mot « licenciements ».'],
  ['Mon fils a quelques difficultés d\'apprentissage.','euphémisme','On adoucit une réalité désagréable.']
];
const FIG3=[
  ['Dans la valise, il y avait des chemises, des chaussettes, des mouchoirs et deux livres.','énumération','Des éléments de même nature sont détaillés l\'un après l\'autre.'],
  ['La recette demande de la farine, du beurre, du sucre et des œufs.','énumération','Les ingrédients sont énumérés un à un.'],
  ['Le jardin contenait des roses, des tulipes, des lilas et des pivoines.','énumération','Des éléments de même nature sont détaillés pour donner une idée d\'abondance.'],
  ['On entendait les klaxons, les sirènes, les cris, les moteurs, les pas, les portes, les alarmes : un vacarme sans fin.','accumulation','Énumération excessive qui donne une impression de trop-plein.'],
  ['Papiers, factures, stylos, dossiers, tasses, plantes, cartons, câbles : son bureau croulait sous les objets.','accumulation','Énumération excessive et désordonnée : impression de surcharge.'],
  ['Il y avait des fleurs partout : sur les tables, sur les chaises, sur les marches, sur les fenêtres, dans les coupes, dans les vases, jusque sur le piano.','accumulation','Les lieux s\'enchaînent sans fin : impression de profusion.'],
  ['Il pâlit, trembla, chancela, s\'effondra.','gradation','Les verbes expriment une intensité de plus en plus forte.'],
  ['Le bruit s\'atténua, se fit murmure, puis souffle, puis rien.','gradation','Les termes sont de plus en plus faibles : gradation descendante.'],
  ['Un soupçon, un doute, une certitude, une évidence.','gradation','Les termes sont de plus en plus forts.'],
  ['On le remarqua, on le salua, on l\'acclama, on le porta en triomphe.','gradation','L\'intensité des actions augmente à chaque terme.'],
  ['Jamais, jamais je n\'oublierai ce jour.','répétition','Le même mot est repris sans modification.'],
  ['La pluie, la pluie, toujours la pluie.','répétition','Les mêmes termes sont repris pour insister.'],
  ['Encore un effort, un dernier effort.','répétition','Le mot « effort » est repris pour insister.'],
  ['Si tu m\'écoutes, si tu me crois, si tu restes, tout ira mieux.','anaphore','« Si » est répété au début de chaque groupe.'],
  ['Rien ne l\'arrêtait. Rien ne le faisait douter. Rien, pas même la peur.','anaphore','« Rien » est répété au début de chaque phrase.'],
  ['Pour ceux qui attendent, pour ceux qui espèrent, pour ceux qui n\'abandonnent pas.','anaphore','« Pour ceux qui » est répété au début de chaque groupe.'],
  ['J\'ai attendu des siècles devant ce guichet !','hyperbole','L\'expression exagère la durée de l\'attente.'],
  ['Elle a une faim de loup et pourrait avaler un éléphant.','hyperbole','L\'expression exagère volontairement son appétit.'],
  ['Il y avait un monde fou : la ville entière était là.','hyperbole','L\'expression exagère le nombre de personnes.'],
  ['Dans son sac, elle avait un livre, une pomme, une écharpe, des clés et un carnet.','énumération','Éléments de même nature détaillés l\'un après l\'autre.'],
  ['Au marché on trouvait des abricots, des melons, des fraises, des figues et des pêches.','énumération','Des éléments de même nature sont détaillés pour donner une idée d\'abondance.'],
  ['Ça criait, ça riait, ça sifflait, ça cognait, ça se bousculait, ça chantait, ça hurlait dans toute la cour.','accumulation','Énumération interminable et désordonnée qui donne une impression de profusion.'],
  ['Valises, cartons, sacs, chaises, lampes, tableaux, vélos : tout s\'empilait dans le couloir sans ordre.','accumulation','Énumération excessive et désordonnée : impression de désordre.'],
  ['Il hésita, protesta, cria, hurla.','gradation','Les verbes expriment une intensité de plus en plus forte.'],
  ['La bougie vacilla, faiblit, s\'éteignit.','gradation','Les termes sont de plus en plus faibles : gradation descendante.'],
  ['Elle attendait, attendait, attendait encore.','répétition','Le même mot est repris sans modification.'],
  ['Ce n\'est pas la peine, pas la peine du tout.','répétition','Les mêmes termes sont repris pour insister.'],
  ['Ici, on rit. Ici, on joue. Ici, on s\'aime.','anaphore','« Ici » est répété au début de chaque phrase.'],
  ['Il faut que tu partes. Il faut que tu oublies. Il faut que tu vives.','anaphore','« Il faut que tu » est répété au début de phrases qui se suivent.'],
  ['J\'ai attendu des siècles devant ce guichet.','hyperbole','« Des siècles » est une exagération.'],
  ['Il y avait un million de personnes à ce concert !','hyperbole','Le chiffre est volontairement exagéré.'],
  ['Cette tarte est à mourir de bonne.','hyperbole','L\'expression exagère le plaisir.'],
  ['Je te l\'ai dit mille fois : tu me fais mourir de honte !','hyperbole','« Mille fois » et « mourir de honte » sont des exagérations.']
];
/* définitions : dérivées de FR_FIGS ; phrase d'ouverture variée */
const frCl=s=>{ const m=s.match(/^[^(]+/); return m?m[0].trim():s; };
function figQ(arr,id,lvl){ return ()=>{ const p=enPick(arr);
  return {lang:'fr',choices:FIGN,keys:FR_KEYS,tag:'fr-fig',statement:p[0],answers:[p[1]],instr:'Quelle figure de style ?',
    hintline:'Écris le nom de la figure de style. Les accents et les majuscules ne comptent pas.',placeholder:'nom de la figure',
    hint:p[2],solution:'Figure : <b>'+p[1]+'</b>. '+p[2],mist:FIGMIST(p[1]),fallback:FIGFB}; }; }
FRGEN['fr-fig1']=figQ(FIG1);
FRGEN['fr-fig2']=figQ(FIG2);
FRGEN['fr-fig3']=figQ(FIG3);
FRGEN['fr-def']=()=>{ const f=enPick(FR_FIGS);
  return {lang:'fr',choices:FIGN,keys:FR_KEYS,tag:'fr-fig',statement:'Quelle figure de style correspond à cette définition : « '+frCl(f[2])+' » ?',answers:[f[0]],instr:'Retrouve la figure à partir de sa définition',
    hintline:'Écris le nom de la figure de style. Les accents et les majuscules ne comptent pas.',placeholder:'nom de la figure',
    hint:'Cette figure appartient à la famille des figures d\'« '+f[1]+' ».',solution:'La <b>'+f[0]+'</b> '+f[2]+'.',mist:FIGMIST(f[0]),fallback:FIGFB}; };
FRGEN['fr-abab']=()=>{ const P=[
   ['Il faut aimer ce que l\'on fait et faire ce que l\'on aime.','chiasme','« aimer – faire / faire – aimer » : termes croisés en miroir (ABBA).'],
   ['Les enfants jouent dans la cour, les parents discutent sur le banc.','parallélisme','Les deux membres suivent la même construction dans le même ordre (ABAB).'],
   ['La peur donne du courage, et le courage chasse la peur.','chiasme','« peur – courage / courage – peur » : termes croisés en miroir (ABBA).'],
   ['Le blanc fait ressortir le noir, le noir exalte le blanc.','chiasme','« blanc – noir / noir – blanc » : disposition croisée (ABBA).'],
   ['Tu parles du silence, et le silence te fait parler.','chiasme','« parles – silence / silence – parler » : termes croisés (ABBA).'],
   ['Il a le cœur lourd, elle a l\'esprit léger.','parallélisme','Même construction dans les deux membres, dans le même ordre (ABAB).'],
   ['À l\'aube, les pêcheurs rentrent ; au crépuscule, les marins repartent.','parallélisme','Les deux membres suivent le même ordre (ABAB).'],
   ['Il aime la montagne pour son calme, elle aime la mer pour sa lumière.','parallélisme','Les deux membres suivent la même construction (ABAB).'],
   ['Il a promis de ne jamais partir, mais partir était tout ce qu\'il promettait.','chiasme','« partir – promis / promettait – partir » : les termes se croisent en miroir.'],
   ['Elle aime la musique qui la rend heureuse, et le bonheur qui la rend musicienne.','chiasme','« musique – heureuse / bonheur – musicienne » : idées croisées (ABBA).'],
   ['Le voyageur hâte le pas, le berger ralentit le sien.','parallélisme','Les deux membres suivent la même construction dans le même ordre (ABAB).'],
   ['Aux uns la gloire, aux autres l\'oubli.','parallélisme','Les deux membres suivent le même ordre : « Aux… la… », « aux… l\'… » (ABAB).'],
   ['Je ne travaille pas pour dormir mais je dors pour pouvoir travailler.','chiasme','« travaille – dormir / dors – travailler » : disposition croisée (ABBA).'],
   ['Sa main tenait un livre, son regard tenait une porte.','parallélisme','Même construction dans les deux membres, dans le même ordre.']];
  const p=enPick(P);
  return {lang:'fr',choices:['chiasme','parallélisme'],tag:'fr-struct',statement:p[0],answers:[p[1]],instr:'Chiasme ou parallélisme ?',
    hintline:'Écris « chiasme » ou « parallélisme » (les touches remplissent la zone).',placeholder:'chiasme ou parallélisme',
    hint:'Compare l\'ordre des termes dans les deux membres : croisé (ABBA) ou identique (ABAB).',solution:'<b>'+p[1]+'</b>. '+p[2],
    mist:[[p[1]==='chiasme'?'parallélisme':'chiasme','Compare l\'ordre des termes : croisé = chiasme (ABBA), identique = parallélisme (ABAB).']],fallback:{tag:'fr-struct',title:'Chiasme ou parallélisme ?',html:'<p>Réponds par <b>chiasme</b> ou <b>parallélisme</b>.</p>'}}; };
FRGEN['fr-lito']=()=>{ const P=[
   ['Pour dire que le restaurant est excellent, il glisse : « On n\'y mange pas mal. »','litote','Il dit moins que ce qu\'il pense pour renforcer le compliment.'],
   ['Pour parler d\'une forte chute de la bourse, on dit qu\'elle « corrige ».','euphémisme','Le verbe adoucit une réalité jugée désagréable.'],
   ['Pour féliciter sa collègue d\'un travail excellent, il dit : « Ce n\'est pas du mauvais travail. »','litote','Il dit moins que ce qu\'il pense pour renforcer le compliment.'],
   ['Pour dire qu\'elle a adoré ce voyage, elle dit : « Je ne regrette pas d\'être venue. »','litote','La négation atténuée suggère un enthousiasme bien plus fort.'],
   ['Pour dire que l\'idée est excellente, il répond : « Ce n\'est pas une idée stupide. »','litote','Dire moins pour faire entendre plus : la litote renforce.'],
   ['Pour annoncer un licenciement, le patron parle d\'une « séparation d\'un commun accord ».','euphémisme','L\'expression adoucit une réalité désagréable.'],
   ['Au lieu de dire « il est gros », elle dit « il est bien en chair ».','euphémisme','Le terme amoindrit une réalité jugée désagréable.'],
   ['Pour parler de son chien mort, la fillette dit qu\'il « est parti jouer dans les étoiles ».','euphémisme','L\'expression adoucit une réalité douloureuse : la mort.'],
   ['Elle veut dire que ce gâteau est délicieux : « Ce gâteau n\'est pas mauvais ! »','litote','La négation du contraire renforce l\'idée (elle dit moins pour suggérer plus).'],
   ['Pour dire que l\'exposé était magnifique, il murmure : « Ce n\'était pas inintéressant. »','litote','Il dit moins que ce qu\'il pense pour renforcer le compliment.'],
   ['Pour annoncer une mauvaise nouvelle sans choquer, le médecin dit : « Votre père s\'est éteint cette nuit. »','euphémisme','Le terme adoucit une réalité douloureuse.'],
   ['Pour ne pas vexer le client, le vendeur parle de « petits défauts de finition » au lieu de « pièces cassées ».','euphémisme','L\'expression atténue une réalité désagréable.'],
   ['Elle veut dire qu\'il est très brillant : « Il n\'est pas bête, ce garçon. »','litote','Dire moins pour faire entendre plus : la litote renforce.'],
   ['Pour ménager sa tante, il dit que son plat est « un peu particulier » alors qu\'il est immangeable.','euphémisme','Il amoindrit une réalité désagréable pour ménager l\'autre.']];
  const p=enPick(P);
  return {lang:'fr',choices:['litote','euphémisme'],tag:'fr-lito',statement:p[0],answers:[p[1]],instr:'Litote ou euphémisme ?',
    hintline:'Écris « litote » ou « euphémisme » (les touches remplissent la zone).',placeholder:'litote ou euphémisme',
    hint:'La litote renforce l\'information ; l\'euphémisme adoucit une réalité désagréable.',solution:'<b>'+p[1]+'</b>. '+p[2],
    mist:[[p[1]==='litote'?'euphémisme':'litote','La litote renforce l\'idée ; l\'euphémisme adoucit une réalité pénible. Regarde l\'intention de celui qui parle.']],fallback:{tag:'fr-lito',title:'Litote ou euphémisme ?',html:'<p>Réponds par <b>litote</b> ou <b>euphémisme</b>.</p>'}}; };
FRGEN['fr-grad']=()=>{ const P=[
   ['Il se redressa, avança, courut, bondit sur l\'estrade.','ascendante','Chaque verbe exprime un mouvement plus vif.'],
   ['La tempête gronda, se calma, murmura, s\'éteignit.','descendante','L\'intensité diminue à chaque verbe.'],
   ['Il frappa à la porte, secoua la poignée, cogna du poing, défonça le battant.','ascendante','Chaque geste est plus violent que le précédent.'],
   ['Les applaudissements s\'éteignirent, les murmures s\'apaisèrent, un souffle passa, le silence revint.','descendante','Le bruit diminue à chaque terme.'],
   ['Elle s\'agaça, s\'énerva, s\'emporta, explosa de rage.','ascendante','L\'intensité de la colère augmente à chaque verbe.'],
   ['Sa colère tomba, s\'adoucit, se dissipa, s\'effaça.','descendante','L\'intensité de la colère diminue à chaque verbe.'],
   ['Il murmura, parla, s\'exclama, rugit.','ascendante','Les verbes expriment une voix de plus en plus forte.'],
   ['La lumière baissa, pâlit, vacilla, disparut.','descendante','Les termes expriment une intensité de plus en plus faible.'],
   ['Je te remercie, je te félicite, je t\'admire, je te vénère.','ascendante','Le sentiment exprimé est de plus en plus fort.'],
   ['Le malade parlait d\'abord fort, puis bas, puis à peine, puis plus du tout.','descendante','Les termes sont de plus en plus faibles.'],
   ['C\'est utile, c\'est précieux, c\'est indispensable, c\'est vital.','ascendante','Chaque adjectif est plus fort que le précédent.'],
   ['Il marchait, ralentissait, traînait, s\'arrêtait.','descendante','Les verbes montrent un mouvement de plus en plus faible.']];
  const p=enPick(P);
  return {lang:'fr',choices:['ascendante','descendante'],tag:'fr-grad',statement:p[0],answers:[p[1]],instr:'Gradation ascendante ou descendante ?',
    hintline:'Écris « ascendante » ou « descendante » (les touches remplissent la zone).',placeholder:'ascendante ou descendante',
    hint:'Compare le premier et le dernier terme : sont-ils de plus en plus forts ou de plus en plus faibles ?',solution:'Gradation <b>'+p[1]+'</b>. '+p[2],
    mist:[[p[1]==='ascendante'?'descendante':'ascendante','Compare le premier et le dernier terme : de plus en plus forts = ascendante, de plus en plus faibles = descendante.']],fallback:{tag:'fr-grad',title:'Ascendante ou descendante ?',html:'<p>Réponds par <b>ascendante</b> ou <b>descendante</b>.</p>'}}; };
FRGEN['fr-comp']=()=>{ const C=[
   ['Cette valise est lourde comme du plomb.',['cette valise','valise'],['du plomb','plomb'],['comme']],
   ['Ses cheveux brillaient tels des fils d\'or.',['ses cheveux','cheveux'],['des fils d\'or','fils d\'or'],['tels','tel']],
   ['Mon voisin ronfle ainsi qu\'un ours.',['mon voisin','voisin'],['un ours','ours'],['ainsi que','ainsi qu\'']],
   ['Elle a l\'air d\'une reine dans cette robe.',['elle'],['une reine','reine'],['a l\'air de','avoir l\'air de','l\'air de']],
   ['Sa voix est douce comme le miel.',['sa voix','voix'],['le miel','miel'],['comme']],
   ['Cet enfant court tel un lapin.',['cet enfant','enfant','l\'enfant'],['un lapin','lapin'],['tel']],
   ['Ses yeux semblent deux lacs profonds.',['ses yeux','yeux'],['deux lacs profonds','deux lacs','lacs'],['semblent','sembler']],
   ['La ville ressemble à un grand jardin.',['la ville','ville'],['un grand jardin','jardin'],['ressemble à','ressemble','ressembler à']],
   ['Il est rusé comme un renard.',['il'],['un renard','renard'],['comme']],
   ['Les nuages avançaient pareils à des troupeaux.',['les nuages','nuages'],['des troupeaux','troupeaux'],['pareils à','pareil à','pareils']]];
  const c=enPick(C), q=enPick([['comparé',1],['comparant',2],['outil de comparaison',3]]), ans=c[q[1]];
  return {lang:'fr',tag:'fr-comp',statement:c[0]+'\nQuel est le '+q[0]+' ?',answers:ans,instr:'Repère le '+q[0],
    hintline:'Écris le mot ou le groupe de mots (une seule ligne). Les accents, majuscules et articles sont acceptés.',placeholder:q[0],keys:FR_KEYS,
    hint:q[1]===1?'Le comparé est ce dont on parle (le thème).':q[1]===2?'Le comparant est ce à quoi on compare le thème.':'L\'outil est le mot ou l\'expression qui relie les deux termes.',
    solution:'Comparé : <b>'+c[1][0]+'</b> ; comparant : <b>'+c[2][0]+'</b> ; outil : <b>'+c[3][0]+'</b>.',mist:[],
    fallback:{tag:'fr-comp',title:'Ce n\'est pas le bon élément',html:'<p>Comparé = ce dont on parle ; comparant = ce à quoi on le compare ; outil = le mot qui relie. Utilise un indice si tu bloques.</p>'}}; };
FRT('fr-def',1,'frfg','Retrouver la figure d\'après sa définition');
FRT('fr-fig1',1,'frfg','Analogie et substitution');
FRT('fr-fig2',2,'frfg','Opposition et atténuation');
FRT('fr-fig3',2,'frfg','Amplification');
FRT('fr-abab',2,'frfa','Chiasme ou parallélisme');
FRT('fr-comp',3,'frfa','Comparé, comparant et outil');
FRT('fr-lito',2,'frfa','Litote ou euphémisme');
FRT('fr-grad',1,'frfa','Gradation ascendante ou descendante');
/* niveau « toutes les figures » : une phrase, 22 figures possibles. Réserve = phrases des niveaux 1 et 2, plus celles de chiasme/parallélisme et de litote/euphémisme */
const FIG_ALL=(()=>{ const m={}, add=(s,f,h)=>{ const a=m[f]||(m[f]=[]); if(!a.some(x=>x[0]===s)) a.push([s,f,h]); };
  FIG1.concat(FIG2,FIG3).forEach(p=>add(p[0],p[1],p[2]));
  ['fr-abab','fr-lito'].forEach(id=>{ for(let i=0;i<60;i++){ const g=FRGEN[id](); add(g.statement,g.answers[0],g.hint); } });
  return m; })();
FRGEN['fr-fig4']=()=>{ const f=enPick(Object.keys(FIG_ALL)), p=enPick(FIG_ALL[f]);
  return {lang:'fr',choices:FIGN,keys:FR_KEYS,tag:'fr-fig',statement:p[0],answers:[p[1]],instr:'Quelle figure de style ? (toutes les figures sont possibles)',
    hintline:'Écris le nom de la figure de style. Les accents et les majuscules ne comptent pas.',placeholder:'nom de la figure',
    hint:'Cette figure appartient à la famille des figures d\'« '+FIGD[p[1]][1]+' ». Relis la phrase en cherchant ce qu\'elle fait (rapprocher, remplacer, atténuer, opposer, amplifier).',solution:'Figure : <b>'+p[1]+'</b>. '+p[2],mist:FIGMIST(p[1]),fallback:FIGFB}; };
FRT('fr-fig4',3,'frfg','Toutes les figures de style');

/* ===== textes d'auteurs du domaine public : version d'origine (soutenu) ou réécriture de ma main (courant, familier) ===== */
Object.assign(TAGS,{'fr-txt':{label:'Registre d\'un texte',tip:'Compare les mots (recherchés, neutres ou familiers), la syntaxe (inversions, subjonctif imparfait, passé simple) et les marques de l\'oral (« ne » omis, sujet répété, abréviations).'}});
const FR_TXT=[
 ['Jean de La Fontaine, « La Cigale et la Fourmi » (1668)',
  ['La Cigale, ayant chanté\nTout l\'été,\nSe trouva fort dépourvue\nQuand la bise fut venue.','« fort dépourvue », « la bise » (le vent froid), participe présent et passé simple : langue littéraire.'],
  ['La cigale avait chanté tout l\'été. Quand l\'hiver est arrivé, elle s\'est retrouvée sans rien.','Mots neutres (« l\'hiver », « sans rien ») et phrases simples.'],
  ['La cigale avait chanté tout l\'été ; quand l\'hiver s\'est pointé, elle s\'est retrouvée complètement fauchée.','« s\'est pointé » et « fauchée » (sans argent) sont des mots familiers.']],
 ['Jean de La Fontaine, « Le Corbeau et le Renard » (1668)',
  ['Maître Corbeau, sur un arbre perché,\nTenait en son bec un fromage.\nMaître Renard, par l\'odeur alléché,\nLui tint à peu près ce langage :','« alléché », « langage » (manière de parler), « tint » (passé simple), « en son bec » : langue littéraire.'],
  ['Un corbeau, perché sur un arbre, tenait un fromage dans son bec. Un renard, attiré par l\'odeur, lui parla à peu près ainsi.','Vocabulaire neutre (« attiré », « parla ») et construction simple.'],
  ['Un corbeau, posé sur une branche, avait un fromage dans le bec. Le renard, qui avait flairé le truc, lui a dit à peu près ça.','« flairer le truc » et « ça » à la place de « ainsi » : langue de l\'oral.']],
 ['Victor Hugo, « Demain, dès l\'aube » (1856)',
  ['Demain, dès l\'aube, à l\'heure où blanchit la campagne,\nJe partirai. Vois-tu, je sais que tu m\'attends.','« à l\'heure où blanchit la campagne » (image poétique) et futur littéraire : langue soutenue.'],
  ['Demain matin, au lever du jour, je partirai. Tu vois, je sais que tu m\'attends.','Mots neutres (« demain matin », « au lever du jour »).'],
  ['Demain, à la première heure, je me tire. Tu vois, je sais que tu m\'attends.','« je me tire » (je pars) est une expression familière.']],
 ['Voltaire, « Candide » (1759)',
  ['Il y avait en Westphalie, dans le château de M. le baron de Thunder-ten-tronckh, un jeune garçon à qui la nature avait donné les mœurs les plus douces.','« à qui la nature avait donné les mœurs les plus douces » : tournure ample et vocabulaire classique (« mœurs »).'],
  ['En Westphalie, dans le château du baron de Thunder-ten-tronckh, vivait un jeune garçon d\'un caractère très doux.','Phrase correcte et neutre : « caractère », « très doux ».'],
  ['En Westphalie, chez le baron de Thunder-ten-tronckh, il y avait un jeune gars hyper gentil.','« gars » et « hyper gentil » sont des mots familiers.']],
 ['Molière, « Le Bourgeois gentilhomme » (1670)',
  ['Par ma foi ! il y a plus de quarante ans que je dis de la prose sans que j\'en susse rien.','Imparfait du subjonctif (« susse »), « Par ma foi » et « n\'en… rien » : langue classique soutenue.'],
  ['Il y a plus de quarante ans que je parle en prose sans le savoir.','Vocabulaire et syntaxe neutres : pas de subjonctif imparfait, pas de mot familier.'],
  ['Ça fait plus de quarante ans que je cause en prose sans m\'en douter.','« Ça fait » et « causer » (parler) sont de l\'oral familier.']],
 ['Pierre de Ronsard, « Mignonne, allons voir si la rose » (1553)',
  ['Mignonne, allons voir si la rose\nQui ce matin avait déclose\nSa robe de pourpre au soleil,','« Mignonne », « déclose » (ouverte) et « robe de pourpre » (image) : langue poétique soutenue.'],
  ['Ma chérie, allons voir si la rose, qui s\'était ouverte ce matin, montre encore sa robe pourpre au soleil.','Mots neutres (« ma chérie », « s\'était ouverte »).'],
  ['Ma belle, viens voir si la rose qui s\'est ouverte ce matin fait toujours sa belle en rouge au soleil.','« fait sa belle » et « viens voir » : ton de l\'oral et expressions familières.']],
 ['Jean Racine, « Phèdre » (1677)',
  ['Je le vis, je rougis, je pâlis à sa vue ;\nUn trouble s\'éleva dans mon âme éperdue.','Passé simple (« vis », « rougis », « pâlis »), « âme éperdue » : langue classique soutenue.'],
  ['Je l\'ai vu, j\'ai rougi, j\'ai pâli en le voyant ; je me suis sentie très troublée.','Passé composé et mots neutres : registre courant.'],
  ['Je l\'ai vu, je suis devenue toute rouge, puis toute blanche ; j\'étais complètement chamboulée.','« toute rouge, toute blanche » et « chamboulée » : langage imagé de l\'oral, mots familiers.']],
 ['Alphonse de Lamartine, « Le Lac » (1820)',
  ['Ô temps ! suspends ton vol, et vous, heures propices !\nSuspendez votre cours :','« Ô », apostrophe au temps, « suspends ton vol », « heures propices » : langue poétique soutenue.'],
  ['Temps, arrête-toi, et vous, heures favorables, arrêtez-vous.','Mots neutres (« arrête-toi », « favorables »).'],
  ['Eh, le temps, fais une pause ! Et vous, les bons moments, restez un peu.','« Eh », « fais une pause » et « les bons moments » : ton oral et familier.']],
 ['Joachim du Bellay, « Heureux qui, comme Ulysse… » (1558)',
  ['Heureux qui, comme Ulysse, a fait un beau voyage,\nOu comme cestuy-là qui conquit la toison,','« Heureux qui » (tournure sans sujet), « cestuy-là » et « la toison » (allusion mythologique) : langue poétique soutenue.'],
  ['Il est heureux, celui qui a fait un beau voyage, comme Ulysse ou comme le héros qui a conquis la Toison d\'or.','Tournure normale (« celui qui »), mots neutres.'],
  ['Il a du bol, celui qui a fait un super voyage, comme Ulysse ou comme le mec qui a décroché la Toison d\'or.','« avoir du bol », « super », « le mec » et « décrocher » : mots familiers.']],
 ['Charles Baudelaire, « L\'Albatros » (1857)',
  ['Souvent, pour s\'amuser, les hommes d\'équipage\nPrennent des albatros, vastes oiseaux des mers,','« hommes d\'équipage », « vastes oiseaux des mers » : périphrases et vocabulaire poétique, langue soutenue.'],
  ['Souvent, pour se distraire, les marins attrapent des albatros, ces grands oiseaux de mer.','« marins », « attrapent », « grands oiseaux de mer » : mots du quotidien.'],
  ['Souvent, pour se marrer, les gars de l\'équipage chopent des albatros, ces gros oiseaux de mer.','« se marrer », « les gars », « choper » et « gros » : mots familiers.']],
 ['Paul Verlaine, « Chanson d\'automne » (1866)',
  ['Les sanglots longs\nDes violons\nDe l\'automne\nBlessent mon cœur\nD\'une langueur\nMonotone.','« sanglots longs » (image), « langueur monotone » : vocabulaire poétique, langue soutenue.'],
  ['Les longs bruits tristes des violons d\'automne me serrent le cœur et me rendent triste.','Mots neutres, phrase claire (« me serrent le cœur » est une expression courante).'],
  ['Les violons d\'automne qui pleurnichent, ça me fout le cafard.','« pleurnicher », « ça » et « foutre le cafard » : mots et tours familiers.']],
 ['Arthur Rimbaud, « Le Dormeur du val » (1870)',
  ['C\'est un trou de verdure où chante une rivière\nAccrochant follement aux herbes des haillons\nD\'argent ;','« trou de verdure » et « haillons d\'argent » : images poétiques, langue soutenue.'],
  ['C\'est un creux de verdure où coule une rivière, qui fait briller de l\'argent sur les herbes.','Mots neutres (« creux », « coule », « briller »).'],
  ['C\'est un petit coin tout vert où coule une rivière qui fait briller plein d\'argent sur l\'herbe.','« petit coin tout vert » et « plein de » : mots de l\'oral, simples et familiers.']],
 ['Jean de La Fontaine, « Le Loup et l\'Agneau » (1668)',
  ['La raison du plus fort est toujours la meilleure :\nNous l\'allons montrer tout à l\'heure.','« Nous l\'allons montrer » (ordre classique du pronom), « tout à l\'heure » (dans un instant) : langue classique soutenue.'],
  ['Le plus fort a toujours raison. Nous allons vous le montrer dans un instant.','Ordre des mots actuel et mots neutres.'],
  ['C\'est toujours le plus costaud qui gagne. On va vous le prouver tout de suite.','« costaud » et « on va » (à la place de « nous allons ») : oral familier.']],
 ['Gustave Flaubert, « Madame Bovary » (1857)',
  ['Nous étions à l\'Étude, quand le Proviseur entra, suivi d\'un nouveau habillé en bourgeois et d\'un garçon de classe qui portait un grand pupitre.','Imparfait, passé simple et phrase longue bien construite, vocabulaire de l\'époque (« l\'Étude », « le Proviseur ») : langue soutenue, style littéraire.'],
  ['Nous étions en salle d\'étude quand le proviseur est entré, avec un nouvel élève en vêtements de ville et un surveillant qui portait un grand pupitre.','Passé composé et mots neutres.'],
  ['On était en étude quand le prov est entré avec un nouveau en civil et un pion qui portait un gros pupitre.','« on était », « prov », « pion » et « en civil » : mots familiers (« pion » = surveillant).']],
 ['Pierre Corneille, « Le Cid » (1637)',
  ['Nous partîmes cinq cents ; mais par un prompt renfort\nNous nous vîmes trois mille en arrivant au port,','Passé simple (« partîmes », « vîmes ») et « prompt renfort » : langue classique soutenue.'],
  ['Nous sommes partis à cinq cents, mais avec des renforts rapides, nous étions trois mille en arrivant au port.','Passé composé, mots neutres.'],
  ['On est partis à cinq cents, mais avec des renforts arrivés vite fait, on s\'est retrouvés à trois mille en arrivant au port.','« on est partis » et « vite fait » : mots de l\'oral familier.']],
 ['Guy de Maupassant, « La Parure » (1884)',
  ['C\'était une de ces jolies et charmantes filles, nées, comme par une erreur du destin, dans une famille d\'employés.','Syntaxe soignée (participe « nées », comparaison « comme par une erreur du destin ») : style littéraire, langue soutenue.'],
  ['C\'était une jeune fille jolie et charmante, née dans une famille d\'employés, comme par une erreur du destin.','Ordre des mots plus simple, vocabulaire neutre.'],
  ['C\'était une nana canon, née dans une famille d\'employés, comme par erreur.','« nana » et « canon » (très belle) : mots familiers.']],
 ['Émile Zola, « Germinal » (1885)',
  ['Dans la plaine rase, sous la nuit sans étoiles, d\'une obscurité et d\'une épaisseur d\'encre, un homme suivait seul la grande route de Marchiennes à Montsou.','Phrase longue, comparaison (« épaisseur d\'encre »), adjectifs recherchés (« rase ») : langue soutenue littéraire.'],
  ['Dans la plaine plate, une nuit noire sans étoiles, un homme marchait seul sur la grande route entre Marchiennes et Montsou.','Mots neutres et syntaxe simple.'],
  ['Dans la plaine toute plate, en pleine nuit, noire à ne rien voir, un type marchait tout seul sur la grande route entre Marchiennes et Montsou.','« un type » et « noire à ne rien voir » : tournures familières.']],
 ['Molière, « Tartuffe » (1664)',
  ['Couvrez ce sein que je ne saurais voir.','Impératif et « que je ne saurais voir » (« ne » + conditionnel littéraire) : langue classique soutenue.'],
  ['Cachez cette poitrine, je ne peux pas la voir.','Mots neutres et construction actuelle.'],
  ['Planque-moi ça, j\'peux pas voir ça !','« planque-moi ça », « j\'peux » et « ça » répété : langue familière.']]
];
FRGEN['fr-txt']=()=>{ const t=enPick(FR_TXT), i=enPick([0,1,2]), v=t[i+1], reg=['soutenu','courant','familier'][i];
  const orig=i===0;
  return {lang:'fr',choices:FR_CH,tag:'fr-txt',statement:'Texte d\'après '+t[0]+' :\n« '+v[0]+' »\nQuel est le registre de langue de ce texte ?',answers:[reg],instr:'Quel est le registre de ce texte ?',
    hintline:'Réponds par un seul mot : familier, courant ou soutenu (les touches remplissent la zone). Les accents et les majuscules ne comptent pas.',placeholder:'familier, courant ou soutenu',
    hint:'Cherche les mots recherchés ou poétiques, les constructions rares (passé simple, subjonctif imparfait, inversion), ou au contraire les mots familiers et les tournures de l\'oral.',
    solution:'Registre <b>'+reg+'</b>. '+(orig?'C\'est la version d\'origine de l\'auteur. ':'C\'est une réécriture de ma main (le texte d\'origine, de '+t[0].split(',')[0]+', est soutenu). ')+v[1],
    mist:frMist(reg),fallback:{tag:'fr-txt',title:'Réponds par un registre',html:'<p>Écris l\'un des trois registres : <b>familier</b>, <b>courant</b> ou <b>soutenu</b>.</p>'}}; };
FRT('fr-txt',3,'frrg','Registre d\'un texte (extrait ou réécriture)');
