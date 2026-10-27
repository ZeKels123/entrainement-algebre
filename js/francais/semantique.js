'use strict';
/* ===== Français : sémantique (exercices rédigés pour l'appli ; notions d'après les pages de cours reçues, aucun exemple de la feuille réutilisé dans les exercices) ===== */
Object.assign(TAGS,{
  'fr-sem':{label:'Notion de sémantique confondue',tip:'Signifiant = forme du mot (sons, lettres). Signifié = son sens. Monosémique = un seul sens ; polysémique = plusieurs sens. Dénotation = sens objectif du dictionnaire ; connotation = sens implicite et subjectif.'},
  'fr-sens':{label:'Sens d\'un mot dans son contexte',tip:'Un mot polysémique prend un seul sens dans une phrase : les mots qui l\'entourent le disent. Sens propre = sens premier, concret ; sens figuré = sens dérivé, plus imagé (passage du concret à l\'abstrait, analogie).'},
  'fr-val':{label:'Valeur d\'un mot (neutre, péjoratif, mélioratif)',tip:'Un mot péjoratif dévalorise, un mot mélioratif valorise, un mot neutre ne juge pas. Un euphémisme atténue une réalité jugée choquante.'},
  'fr-conn':{label:'Dénotation, connotation, symbole',tip:'Dénotation : sens objectif, celui du dictionnaire. Connotation : sens implicite, subjectif, souvent culturel. Un symbole associe un sens dénoté et un sens connoté commun à un groupe.'},
  'fr-champ':{label:'Champ lexical',tip:'Un champ lexical est l\'ensemble des mots qui renvoient à une même réalité, une même idée, une même notion. Repère le thème commun, puis cherche ce qui ne s\'y rattache pas.'}
});
const FSN=['signifiant','signifié','monosémie','polysémie','dénotation','connotation','symbole','péjoratif','mélioratif','euphémisme','motif','asymbolie','lexical','sémantique'];
const FSD={
  signifiant:['le signifiant','la forme concrète d\'un mot, sonore ou écrite'],
  signifié:['le signifié','le sens d\'un mot'],
  monosémie:['la monosémie','le caractère d\'un mot qui ne porte qu\'une seule signification'],
  polysémie:['la polysémie','le caractère d\'un mot qui porte au moins deux significations ; son sens dépend alors du contexte'],
  dénotation:['la dénotation','le sens premier, littéral et objectif d\'un terme, celui que livre le dictionnaire (propre ou figuré)'],
  connotation:['la connotation','le sens implicite et subjectif : l\'ensemble des sensations, des idées et des images que fait naître un mot dans l\'esprit d\'une personne'],
  symbole:['le symbole','la coexistence d\'un sens dénoté et d\'au moins un sens connoté commun à un groupe humain'],
  péjoratif:['un mot péjoratif','un mot qui dévalorise'],
  mélioratif:['un mot mélioratif','un mot qui valorise'],
  euphémisme:['un euphémisme','un mot qui atténue une réalité jugée choquante'],
  motif:['un motif','l\'écho ou le parallélisme de sens créé, dans un texte long, par la présence récurrente d\'un même champ lexical'],
  asymbolie:['l\'asymbolie','une monosémie pathologique : l\'incapacité de voir dans un mot autre chose que son sens littéral'],
  lexical:['le champ lexical','l\'ensemble des mots qui renvoient à une même réalité, à une même idée, à une même notion'],
  sémantique:['le champ sémantique','l\'ensemble des sens qu\'un mot peut prendre dans des emplois variés']
};
const FSD2={
  signifiant:'la partie matérielle du mot : ce que l\'on entend ou ce que l\'on lit',
  signifié:'l\'idée, le contenu que le mot représente',
  monosémie:'le fait qu\'un mot n\'ait qu\'un seul sens',
  polysémie:'le fait qu\'un mot ait plusieurs sens, le contexte choisissant lequel',
  dénotation:'le sens objectif d\'un mot, tel que le donne le dictionnaire',
  connotation:'les idées et les émotions que le mot suggère en plus de son sens littéral',
  symbole:'un signe à la fois dénoté et connoté de la même façon pour tout un groupe',
  péjoratif:'qualifie un mot qui rabaisse ce qu\'il désigne',
  mélioratif:'qualifie un mot qui met en valeur ce qu\'il désigne',
  euphémisme:'une manière d\'adoucir ce qui choque ou fait mal',
  motif:'un écho de sens dû à un champ lexical qui revient souvent dans une œuvre',
  asymbolie:'le fait de ne voir que le sens littéral des mots, au point d\'en souffrir (monosémie pathologique)',
  lexical:'les mots qui se rattachent à un même thème',
  sémantique:'tous les sens qu\'un mot peut prendre'
};
const fsShuf=a=>{ const b=a.slice(); for(let i=b.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b; };
const fsMist=(ch,ans,fn)=>ch.filter(c=>enNorm2(c)!==enNorm2(ans)).map(c=>[c,fn(c)]);
const fsFB=(tag,title,html)=>({tag,title,html});
/* [phrase, notion] : quelle notion illustre cette phrase ? (mot de réponse) */
const FS_REF=[
  ['Le mot « bureau » désigne un meuble, une pièce ou un service administratif.','polysémie','Plusieurs sens pour un mot : polysémie.'],
  ['Pour beaucoup de gens, le mot « fondue » évoque la convivialité d\'un repas partagé.','connotation','Idée associée au mot, implicite et subjective : connotation.'],
  ['Le dictionnaire définit « rose » comme la fleur du rosier.','dénotation','Sens objectif livré par le dictionnaire : dénotation.'],
  ['Les lettres t-i-g-r-e à l\'écrit et le son [tigr] à l\'oral sont deux présentations du même mot.','signifiant','La forme sonore ou écrite du mot : signifiant.'],
  ['Ce que l\'on se représente en pensant à « tigre » : un grand félin rayé.','signifié','Le sens du mot, ce qu\'il fait imaginer : signifié.'],
  ['Le mot « baobab » ne désigne qu\'un seul type d\'arbre.','monosémie','Une seule signification : monosémie.'],
  ['Le drapeau blanc, simple tissu clair, signifie la reddition pour tous ceux qui partagent ce code.','symbole','Sens dénoté (un tissu) et sens connoté commun à un groupe (la reddition) : symbole.'],
  ['Dans tout un roman reviennent la mer, les vagues, les voiles, le port et la houle : écho d\'un chapitre à l\'autre.','motif','Un champ lexical qui revient dans un texte long crée un motif.'],
  ['Pluie, averse, orage, ondée, bruine : tous ces mots renvoient à une même notion.','lexical','Ensemble de mots d\'un même thème : champ lexical.'],
  ['Le mot « chaîne » peut désigner un lien de métal, une série de télévision ou une suite de montagnes.','polysémie','Plusieurs sens pour un mot : polysémie.'],
  ['Le mot « glace » peut désigner de l\'eau gelée, un miroir ou un dessert.','polysémie','Un même mot porte plusieurs sens : c\'est la polysémie.'],
  ['Le mot « xylophone » ne renvoie qu\'à un seul instrument de musique.','monosémie','Une seule signification : monosémie.'],
  ['Pour beaucoup de gens, le mot « lundi » évoque la fatigue et le retour au travail.','connotation','Ce sont des idées et des sensations ajoutées au sens : connotation.'],
  ['Le dictionnaire définit « lundi » comme le premier jour de la semaine.','dénotation','Sens objectif livré par le dictionnaire : dénotation.'],
  ['La suite de sons que l\'on entend, ou de lettres que l\'on lit, quand on dit ou écrit « table ».','signifiant','La forme sonore ou écrite du mot : signifiant.'],
  ['L\'idée de meuble à plateau posé sur des pieds que le mot « table » fait surgir.','signifié','Le sens du mot, ce que l\'on se représente : signifié.'],
  ['La balance est un instrument de pesée, mais elle représente aussi la justice pour tout un groupe humain.','symbole','Sens dénoté et sens connoté commun à un groupe : symbole.'],
  ['Dans tout un roman, le vocabulaire du feu (flamme, brasier, cendre, étincelle) revient d\'un chapitre à l\'autre et fait écho.','motif','Un champ lexical qui revient dans un texte long crée un motif.'],
  ['Mer, vague, écume, marée, rivage : tous ces mots se rapportent à une même réalité.','lexical','Ensemble de mots d\'un même thème : champ lexical.'],
  ['Selon la phrase, « pièce » peut désigner une monnaie, une salle ou un spectacle.','polysémie','Plusieurs sens pour un mot : polysémie.'],
  ['Le mot « orage » évoque la peur pour Samir, parce que la foudre l\'a surpris quand il était enfant.','connotation','Sens subjectif lié à une histoire personnelle : connotation.'],
  ['« Orage » : perturbation atmosphérique accompagnée d\'éclairs et de tonnerre.','dénotation','Sens littéral et objectif : dénotation.']
];
const FS_REFCH=['polysémie','monosémie','dénotation','connotation','signifiant','signifié','symbole','motif','lexical'];
/* [mot, mono|poly, explication] */
const FS_MONO=[
  ['stéthoscope','monosémique','Il ne désigne qu\'un seul instrument médical.'],['microscope','monosémique','Il ne désigne qu\'un seul instrument d\'optique.'],
  ['rhinocéros','monosémique','Il ne désigne qu\'un seul animal.'],['nénuphar','monosémique','Il ne désigne qu\'une seule plante aquatique.'],
  ['paratonnerre','monosémique','Il ne désigne qu\'un seul dispositif.'],['vélodrome','monosémique','Il ne désigne qu\'un seul type de piste.'],
  ['cadre','polysémique','Cadre d\'un tableau, cadre d\'une entreprise, cadre d\'une action…'],['pile','polysémique','Pile électrique, pile de livres, côté d\'une pièce de monnaie…'],
  ['vol','polysémique','Vol d\'un oiseau, vol d\'un bijou…'],['plan','polysémique','Plan d\'une ville, plan d\'un projet, plan incliné…'],
  ['ornithorynque','monosémique','Il ne désigne qu\'un seul animal.'],['hippopotame','monosémique','Il ne désigne qu\'un seul animal.'],
  ['xylophone','monosémique','Il ne désigne qu\'un seul instrument.'],['ophtalmologue','monosémique','Il ne désigne qu\'un seul métier : le médecin des yeux.'],
  ['thermomètre','monosémique','Il ne désigne qu\'un seul instrument : celui qui mesure la température.'],['tétraèdre','monosémique','Il ne désigne qu\'un seul solide : celui qui a quatre faces triangulaires.'],
  ['pied','polysémique','Pied du corps, pied d\'une table, pied d\'une montagne, pied (unité de mesure)…'],['tour','polysémique','Une tour (bâtiment), un tour (promenade, rang, tour de magie)…'],
  ['mine','polysémique','Mine de charbon, mine d\'un crayon, mine explosive, bonne ou mauvaise mine…'],['avocat','polysémique','Un fruit ou un juriste.'],
  ['souris','polysémique','Un animal ou un appareil informatique.'],['pièce','polysémique','Une monnaie, une salle, une œuvre de théâtre, un morceau…'],
  ['carte','polysémique','Carte à jouer, carte routière, carte d\'un restaurant, carte bancaire…'],['feuille','polysémique','Feuille d\'un arbre ou feuille de papier.']
];
/* [phrase, mot, sens, tous les sens possibles (mots), explication] */
const FS_POLY=[
  ['Elle a accroché un cadre au-dessus du canapé.','cadre','tableau',['tableau','dirigeant'],'« accroché au-dessus du canapé » indique l\'objet décoratif.'],
  ['Le cadre de l\'entreprise a présenté ses résultats au conseil.','cadre','dirigeant',['tableau','dirigeant'],'« entreprise » et « conseil » indiquent la fonction.'],
  ['Il a changé la pile de la télécommande.','pile','batterie',['batterie','tas','côté'],'« télécommande » indique la source d\'énergie.'],
  ['Une pile de livres menaçait de tomber.','pile','tas',['batterie','tas','côté'],'« de livres menaçait de tomber » indique un entassement.'],
  ['Il a lancé la pièce : pile, c\'est lui qui commence.','pile','côté',['batterie','tas','côté'],'« lancé la pièce » indique le jeu de pile ou face.'],
  ['Le vol des hirondelles dessinait des arabesques dans le ciel.','vol','envol',['envol','larcin'],'« hirondelles » et « dans le ciel » indiquent le déplacement dans les airs.'],
  ['On a signalé un vol de bijoux dans la bijouterie.','vol','larcin',['envol','larcin'],'« signalé » et « bijouterie » indiquent un délit.'],
  ['Il a déplié le plan de la ville pour trouver la rue.','plan','carte',['carte','projet','surface'],'« la ville » et « la rue » indiquent un document géographique.'],
  ['Leur plan pour la fête est prêt : tout est organisé.','plan','projet',['carte','projet','surface'],'« pour la fête » et « organisé » indiquent une intention préparée.'],
  ['La bille roulait le long du plan incliné.','plan','surface',['carte','projet','surface'],'« incliné » et « roulait le long » indiquent une surface.'],
  ['Elle a rangé sa souris sur le tapis avant d\'éteindre l\'ordinateur.','souris','appareil',['animal','appareil'],'« ordinateur » et « tapis » indiquent l\'objet informatique.'],
  ['Une souris s\'est glissée sous le placard et le chat l\'a poursuivie.','souris','animal',['animal','appareil'],'« le chat l\'a poursuivie » indique l\'animal.'],
  ['Pour le dessert, il a écrasé un avocat sur du pain grillé.','avocat','fruit',['fruit','juriste'],'« écrasé sur du pain grillé » indique un aliment.'],
  ['L\'avocat a plaidé pendant deux heures devant le tribunal.','avocat','juriste',['fruit','juriste'],'« plaidé » et « tribunal » indiquent la profession.'],
  ['Elle a glissé une pièce dans la machine à café.','pièce','monnaie',['monnaie','salle','spectacle'],'On « glisse » une pièce dans une machine : c\'est de la monnaie.'],
  ['Leur appartement compte quatre pièces, cuisine non comprise.','pièce','salle',['monnaie','salle','spectacle'],'« appartement » et « cuisine » indiquent les espaces du logement.'],
  ['Nous avons vu une pièce au théâtre hier soir.','pièce','spectacle',['monnaie','salle','spectacle'],'« au théâtre » indique une œuvre jouée.'],
  ['Le serveur nous a apporté la carte des desserts.','carte','menu',['menu','plan','jeu'],'« desserts » et « serveur » indiquent la liste du restaurant.'],
  ['Il a déplié la carte pour retrouver la route.','carte','plan',['menu','plan','jeu'],'« déplié » et « route » indiquent le document géographique.'],
  ['Elle a posé une carte sur la table : le roi de trèfle.','carte','jeu',['menu','plan','jeu'],'« le roi de trèfle » indique un jeu de cartes.'],
  ['Une feuille est tombée du chêne.','feuille','végétal',['végétal','papier'],'« tombée du chêne » indique l\'arbre.'],
  ['Elle a écrit son nom en haut d\'une feuille blanche.','feuille','papier',['végétal','papier'],'« écrit son nom » et « blanche » indiquent le papier.'],
  ['Son grand-père a travaillé trente ans dans une mine de charbon.','mine','gisement',['aspect','gisement','explosif'],'« charbon » et « travaillé trente ans » indiquent l\'exploitation du sous-sol.'],
  ['Un démineur a désamorcé une mine enterrée sur la plage.','mine','explosif',['aspect','gisement','explosif'],'« démineur » et « désamorcé » indiquent un engin explosif.'],
  ['Il avait bien mauvaise mine ce matin, après une nuit blanche.','mine','aspect',['aspect','gisement','explosif'],'« nuit blanche » indique l\'allure du visage.'],
  ['Nous nous sommes assis sur un banc, à l\'ombre du tilleul.','banc','siège',['siège','groupe'],'« assis » et « à l\'ombre » indiquent un siège de parc.'],
  ['Un banc de sardines a longé la coque du bateau.','banc','groupe',['siège','groupe'],'« de sardines » indique un groupe de poissons.'],
  ['Du sommet de la tour, on voit toute la ville.','tour','bâtiment',['bâtiment','promenade','rang'],'« sommet » indique un édifice élevé.'],
  ['C\'est à ton tour de lancer les dés.','tour','rang',['bâtiment','promenade','rang'],'« à ton » et « de lancer les dés » indiquent un ordre de passage.'],
  ['Ils ont fait un tour du lac à vélo avant le dîner.','tour','promenade',['bâtiment','promenade','rang'],'« à vélo » indique un petit trajet.'],
  ['Elle a mangé une glace à la vanille sur le port.','glace','dessert',['dessert','miroir','gel'],'« à la vanille » indique un dessert.'],
  ['Il s\'est regardé dans la glace de l\'entrée avant de sortir.','glace','miroir',['dessert','miroir','gel'],'« regardé dans » indique un miroir.'],
  ['Une couche de glace couvrait l\'étang ce matin.','glace','gel',['dessert','miroir','gel'],'« couche » et « étang » indiquent de l\'eau gelée.']
];
/* [phrase au sens propre, phrase au sens figuré, mot] */
const FS_PROP=[
  ['Un nuage cache le soleil.','Il cache sa tristesse derrière un sourire.','cache'],
  ['Elle a ouvert la porte du garage.','Il a ouvert un débat sur l\'avenir du club.','ouvert'],
  ['Le tunnel traverse la montagne.','Une idée folle a traversé son esprit.','traverse'],
  ['Le chien mord le facteur.','Le froid mord les doigts des promeneurs.','mord'],
  ['Le vent enfle la voile.','La rumeur enfle de jour en jour.','enfle'],
  ['Il a mis la clé dans la serrure.','Cette découverte donne la clé du mystère.','clé'],
  ['Elle a posé un voile sur la statue.','Un voile de tristesse passa sur son visage.','voile'],
  ['Elle allume une bougie.','Cette remarque allume la colère de la foule.','allume'],
  ['Le pont relie les deux rives.','Cette amitié relie deux familles.','relie'],
  ['Le chat a grimpé sur l\'armoire.','Le prix du pain a grimpé en un mois.','grimpé'],
  ['Il a plongé dans la piscine du village.','Il a plongé dans la lecture de ce roman.','plongé'],
  ['Cette valise est lourde à porter.','Il porte une lourde responsabilité.','lourde'],
  ['Le lion dévore sa proie.','Elle dévore les romans policiers.','dévore'],
  ['L\'eau coule de la fontaine.','Le temps coule trop vite pendant les vacances.','coule'],
  ['Une lampe éclaire la pièce.','Cet exemple éclaire le problème.','éclaire'],
  ['Il a brisé le vase en le lâchant.','Ce chagrin l\'a brisé.','brisé'],
  ['Un mur sépare les deux jardins.','Un mur d\'incompréhension les sépare.','mur'],
  ['Le paysan sème du blé en octobre.','Cette rumeur sème la discorde.','sème'],
  ['Le ciel est sombre ce soir.','Il a des pensées sombres.','sombre'],
  ['Cette soupe est brûlante.','Elle lui lança un regard brûlant de colère.','brûlant'],
  ['La porte est fermée à clé.','Elle est fermée à toute critique.','fermée']
];
/* [mot, définition actuelle, sens ancien (mot), distracteurs] */
const FS_EVO=[
  ['travail','« activité professionnelle, tâche »','tourment',['plaisir','repos'],'Jadis, « travail » pouvait désigner une souffrance, un tourment (le mot est souvent rattaché à un instrument de torture, le tripalium).'],
  ['vilain','« laid ; méchant »','paysan',['noble','marchand'],'Jadis, « vilain » désignait un paysan, un habitant du village (du latin villanus).'],
  ['pitoyable','« très mauvais, lamentable »','compatissant',['joyeux','rapide'],'À l\'origine, « pitoyable » signifiait « qui a pitié, compatissant ».'],
  ['formidable','« remarquable, très bien »','redoutable',['minuscule','ennuyeux'],'Jadis, « formidable » (du latin formidabilis) voulait dire « qui fait peur, redoutable ».'],
  ['énerver','« agacer, irriter »','affaiblir',['calmer','soigner'],'Jadis, « énerver » signifiait « priver de nerf, de force », donc « affaiblir ».'],
  ['ennui','« lassitude, manque d\'intérêt »','tourment',['plaisir','repos'],'Jadis, « ennui » désignait un tourment, un chagrin violent.'],
  ['bureau','« pièce ou meuble où l\'on travaille »','étoffe',['outil','jardin'],'À l\'origine, « bureau » désignait une étoffe de laine grossière (la bure), dont on couvrait les tables.'],
  ['magasin','« lieu où l\'on vend des marchandises »','entrepôt',['école','jardin'],'À l\'origine, « magasin » était un lieu où l\'on entreposait des marchandises.']
];
/* [neutre, péjoratif, mélioratif, ce que désigne le trio] */
const FS_TRI=[
  ['bateau','rafiot','vaisseau','un moyen de transport sur l\'eau'],
  ['vêtement','guenille','parure','ce que l\'on porte sur soi'],
  ['cuisine','tambouille','gastronomie','l\'art de préparer les repas'],
  ['femme','mégère','dame','une personne de sexe féminin'],
  ['chanson','rengaine','mélodie','un air chanté ou joué'],
  ['cheveux','tignasse','chevelure','les cheveux d\'une personne'],
  ['visage','trogne','minois','le visage d\'une personne'],
  ['logement','taudis','demeure','l\'endroit où l\'on habite'],
  ['vin','piquette','nectar','une boisson'],
  ['odeur','puanteur','parfum','ce que perçoit le nez'],
  ['mince','efflanqué','svelte','une silhouette peu épaisse']
];
const FS_VCH=['neutre','péjoratif','mélioratif'];
/* [situation, euphémisme, expression crue, expression neutre] */
const FS_EPH=[
  ['une entreprise met un employé à la porte','Elle a décidé de ne pas poursuivre sa collaboration avec lui.','Elle l\'a foutu dehors.','Elle l\'a renvoyé.'],
  ['quelqu\'un vit dans la rue','Il est sans domicile fixe.','C\'est un clodo.','Il vit dans la rue.'],
  ['un élève échoue à l\'école','Il rencontre quelques difficultés scolaires.','Il est nul à l\'école.','Il échoue à l\'école.'],
  ['quelqu\'un a trop bu','Il a un peu forcé sur la boisson.','Il est complètement bourré.','Il est ivre.'],
  ['quelqu\'un vient de mourir','Il nous a quittés.','Il a clamsé.','Il est mort.'],
  ['un patron licencie des employés','Nous nous séparons de plusieurs collaborateurs.','On a viré plusieurs employés.','Nous licencions plusieurs employés.'],
  ['quelqu\'un manque d\'argent','Il a des revenus modestes.','Il est fauché.','Il est pauvre.'],
  ['quelqu\'un ne peut pas marcher','C\'est une personne à mobilité réduite.','C\'est un infirme.','C\'est une personne qui ne marche pas.'],
  ['un lycée exclut un élève','L\'établissement l\'invite à poursuivre sa scolarité ailleurs.','On l\'a viré du lycée.','Le lycée l\'a renvoyé.'],
  ['quelqu\'un ne dit pas la vérité','Il entretient un rapport approximatif avec la vérité.','Il ment comme il respire.','Il ment.']
];
/* [mot, idée, dénoté|connoté] */
const FS_DEN=[
  ['feu','phénomène de combustion qui dégage chaleur et lumière','dénoté'],['feu','la passion, la destruction','connoté'],
  ['soleil','étoile autour de laquelle tourne la Terre','dénoté'],['soleil','la joie, la vie','connoté'],
  ['ombre','zone sombre due à l\'absence de lumière','dénoté'],['ombre','le secret, la menace','connoté'],
  ['chêne','arbre qui porte des glands','dénoté'],['chêne','la solidité, la longévité','connoté'],
  ['corbeau','grand oiseau noir','dénoté'],['corbeau','le mauvais présage','connoté'],
  ['colombe','oiseau de la famille des pigeons','dénoté'],['colombe','la paix','connoté'],
  ['rose','fleur à épines','dénoté'],['rose','l\'amour, le romantisme','connoté'],
  ['loup','mammifère carnivore voisin du chien','dénoté'],['loup','le danger, la cruauté','connoté'],
  ['nuit','période d\'obscurité entre le coucher et le lever du soleil','dénoté'],['nuit','le mystère, l\'inquiétude','connoté'],
  ['hiver','saison la plus froide de l\'année','dénoté'],['hiver','la solitude, la mélancolie','connoté'],
  ['mer','vaste étendue d\'eau salée','dénoté'],['mer','la liberté, l\'évasion','connoté'],
  ['lion','grand félin d\'Afrique','dénoté'],['lion','le courage, la force','connoté'],
  ['renard','mammifère à queue touffue','dénoté'],['renard','la ruse','connoté'],
  ['rouge','couleur','dénoté'],['rouge','le danger, l\'interdit','connoté'],
  ['maison','bâtiment destiné à l\'habitation','dénoté'],['maison','le refuge, la sécurité','connoté']
];
/* [phrase, dénoté, connoté] */
const FS_SYM=[
  ['Le drapeau blanc symbolise la reddition.','tissu','reddition'],
  ['Le chêne symbolise la force tranquille.','arbre','force'],
  ['La rose symbolise l\'amour.','fleur','amour'],
  ['Le corbeau symbolise le mauvais présage.','oiseau','présage'],
  ['La balance symbolise la justice.','pesée','justice'],
  ['La colombe symbolise la paix.','oiseau','paix'],
  ['Le lion symbolise le courage.','félin','courage'],
  ['Le renard symbolise la ruse.','mammifère','ruse'],
  ['La branche d\'olivier symbolise la paix.','arbre','paix'],
  ['La couronne symbolise le pouvoir.','ornement','pouvoir']
];
const FS_SRC=[
  ['Élevée au bord de la mer, elle trouve que le mot « horizon » promet toujours une aventure.','histoire'],
  ['Dans les familles d\'agriculteurs de la région, le mot « orage » évoque d\'abord le risque pour la récolte.','société'],
  ['Très inquiet de nature, il entend dans toute sonnerie de téléphone une mauvaise nouvelle.','psychologie'],
  ['Dans un conte, le mot « forêt » devient menaçant parce que les phrases voisines parlent de loups, de nuit et d\'égarés.','contexte'],
  ['Ayant grandi dans un quartier d\'artistes, il associe « atelier » à la liberté et à la fête.','société'],
  ['Le jour de son premier concours, elle a reçu une enveloppe : depuis, ce mot lui serre le ventre.','histoire'],
  ['Pour Inès, le mot « moto » fait peur : elle est d\'un naturel très anxieux, quoi qu\'elle ait vécu.','psychologie'],
  ['Chez les marins de l\'Atlantique, le mot « brume » évoque d\'abord le danger pour la navigation.','société'],
  ['Pour Jules, le mot « sapin » évoque la maison de ses grands-parents, où il passait chaque Noël.','histoire'],
  ['Dans un poème, le mot « ombre » devient inquiétant à cause de « glacé », « silence » et « tombeau » qui l\'entourent.','contexte'],
  ['Dans son club de randonnée, le mot « sommet » évoque l\'effort partagé et la fierté du groupe.','société'],
  ['Il a été mordu par un chien à six ans : depuis, ce mot lui rappelle la peur.','histoire'],
  ['D\'un tempérament mélancolique, il trouve de la tristesse à tout ce qu\'il lit, même au mot « pluie ».','psychologie'],
  ['Dans un roman, « soleil » est répété près de « poussière » et de « soif » : il finit par évoquer la sécheresse, non la joie.','contexte']
];
const FS_SRCCH=['psychologie','société','histoire','contexte'];
const FS_SRCN={psychologie:'la nature psychologique individuelle',société:'l\'environnement social',histoire:'l\'histoire personnelle',contexte:'les interrelations des mots et des phrases dans un texte'};
/* [thème, [4 mots], intrus] */
const FS_INT=[
  ['la montagne',['sommet','col','glacier','alpage'],'orchestre'],
  ['le sport',['arbitre','match','maillot','score'],'rideau'],
  ['le théâtre',['scène','rideau','comédien','répétition'],'carburant'],
  ['l\'automobile',['moteur','volant','embrayage','pneu'],'estuaire'],
  ['la justice',['tribunal','verdict','juge','plaidoirie'],'balançoire'],
  ['le jardinage',['bêche','semis','arrosoir','compost'],'ordinateur'],
  ['la cuisine',['casserole','four','recette','marmite'],'tableau'],
  ['l\'école',['classe','cartable','leçon','récréation'],'moteur'],
  ['l\'orage',['éclair','tonnerre','averse','foudre'],'bibliothèque'],
  ['l\'hôpital',['infirmière','médecin','civière','scalpel'],'crayon'],
  ['la musique',['mélodie','rythme','accord','partition'],'tournevis'],
  ['la forêt',['sapin','mousse','clairière','sentier'],'comptable'],
  ['le voyage',['valise','billet','escale','passeport'],'fourchette'],
  ['le froid',['glace','frisson','givre','verglas'],'brasier']
];
/* [texte, thème] */
const FS_THM=[
  ['Les violons s\'accordèrent, la cheffe leva sa baguette et le premier mouvement commença.','musique'],
  ['Le chirurgien enfila ses gants, l\'anesthésiste vérifia le moniteur et on poussa le patient vers le bloc opératoire.','hôpital'],
  ['Ils bouclèrent leurs valises, attendirent à la gare et montrèrent leurs billets au contrôleur.','voyage'],
  ['Le cuisinier émincia les carottes, assaisonna la sauce et dressa les assiettes.','cuisine'],
  ['La neige tombait sur les skis, le givre brillait et le vent glacial piquait les joues.','hiver'],
  ['Le guide encorda la cordée, ils gravirent l\'arête et atteignirent le sommet avant la tempête.','montagne'],
  ['Le juge ouvrit l\'audience, l\'avocat plaida et le tribunal rendit son verdict.','justice'],
  ['Le rideau se leva, le comédien entra en scène et le public retint son souffle.','théâtre'],
  ['L\'arbitre siffla la fin du match : l\'attaquant avait marqué deux buts et le gardien s\'était incliné.','sport'],
  ['Le capitaine hissa le pavillon et le navire doubla le cap par gros temps.','mer'],
  ['Le mécanicien vérifia le moteur, changea les pneus et resserra le volant.','automobile'],
  ['La lame fendit l\'air. Le duel fut bref : le fer claqua contre le fer et le vaincu rendit son épée.','combat'],
  ['Il fit revenir l\'oignon, versa le bouillon, laissa mijoter le ragoût et goûta la sauce.','cuisine'],
  ['Le voilier prit le vent, les vagues claquèrent contre la coque et la côte disparut derrière l\'horizon.','mer'],
  ['Le professeur corrigea les copies, distribua les devoirs et nota les élèves un à un.','école'],
  ['Les flocons tombaient, le givre blanchissait les toits et chaque souffle se changeait en buée.','hiver'],
  ['Le train quitta le quai ; elle vérifia son billet, replia son passeport et regarda la valise au-dessus d\'elle.','voyage'],
  ['Le médecin ausculta le malade, l\'infirmière prépara la perfusion et on le transporta sur un brancard.','hôpital'],
  ['Le chœur reprit la mélodie, le violon marqua le rythme et le dernier accord résonna dans la salle.','musique']
];
const FS_THMCH=['combat','cuisine','mer','école','hiver','voyage','hôpital','musique','montagne','justice','théâtre','sport','automobile'];
/* [texte, thème dominant, autre thème présent, thèmes distracteurs] */
const FS_MIX=[
  ['Le chirurgien opérait, l\'infirmière préparait les compresses, le brancard attendait ; un oiseau chanta dehors.','hôpital','nature',['sport','voyage']],
  ['Les violons jouaient, le chef battait la mesure, la mélodie s\'élevait ; un enfant toussa dans la salle.','musique','public',['justice','mer']],
  ['Le tribunal siégeait, l\'avocat plaidait, le juge écoutait le témoin ; au dehors, un chien aboyait.','justice','animal',['mer','cuisine']],
  ['Le cuisinier flambait, salait, goûtait, nappait ; un enfant riait au fond de la salle.','cuisine','enfance',['combat','hôpital']],
  ['Le sommet se dressait, la cordée progressait sur l\'arête, le glacier craquait ; un avion traversa le ciel.','montagne','aviation',['musique','école']],
  ['Les vagues se brisaient sur le récif, l\'écume giclait, le vent gonflait la voile ; seul un téléphone sonna au loin.','mer','téléphone',['musique','cuisine']],
  ['Il écrasa l\'ail, fit dorer l\'oignon, versa la crème et surveilla la cuisson ; à côté, la radio parlait de football.','cuisine','sport',['combat','école']],
  ['Le glaive brilla, la lance frappa, le bouclier se fendit ; un oiseau chanta dans la haie.','combat','nature',['voyage','hôpital']],
  ['Elle ouvrit son cahier, relut la leçon, recopia l\'exercice et rangea son stylo ; dehors, il pleuvait.','école','météo',['mer','musique']],
  ['Les moteurs rugirent, les pneus crissèrent, le pilote écrasa l\'accélérateur ; un drapeau s\'agita au bord de la piste.','course','fête',['cuisine','hôpital']]
];
Object.assign(FRGEN,{
 'fr-s-def':()=>{ const k=enPick(FSN), d=FSD[k], lex=k==='lexical'||k==='sémantique';
   const dd=Math.random()<0.5?d[1]:FSD2[k], st=lex?'Complète : « champ ______ » — '+dd+'.':'De quoi parle-t-on ? « '+dd.charAt(0).toUpperCase()+dd.slice(1)+'. »';
   return {lang:'fr',choices:FSN,keys:FR_KEYS,tag:'fr-sem',statement:st,answers:[k],instr:lex?'Quel adjectif complète « champ … » ?':'Quelle notion de sémantique ?',
     hintline:'Écris le mot (ou clique sur un mot de la liste). Les accents et les majuscules ne comptent pas.',placeholder:lex?'lexical ou sémantique':'nom de la notion',
     hint:lex?'« Lexical » renvoie aux mots d\'un même thème ; « sémantique » renvoie aux sens d\'un seul mot.':'Repère le mot-clé de la définition : forme, sens, un seul sens, plusieurs sens, objectif, subjectif, valorise, dévalorise, atténue…',
     solution:'<b>'+k+'</b> : '+d[0]+' est '+d[1]+'.',
     mist:fsMist(FSN,k,c=>'Ce n\'est pas « '+c+' » : '+FSD[c][0]+' est '+FSD[c][1]+'.'),fallback:fsFB('fr-sem','Nomme la notion','<p>Écris le nom d\'une notion (par exemple signifiant, connotation, polysémie…). Les accents et les majuscules ne comptent pas.</p>')}; },
 'fr-s-ref':()=>{ const p=enPick(FS_REF);
   return {lang:'fr',choices:FS_REFCH,keys:FR_KEYS,tag:'fr-sem',statement:p[0],answers:[p[1]],instr:'Quelle notion cette phrase illustre-t-elle ?',
     hintline:'Écris un mot : polysémie, monosémie, dénotation, connotation, signifiant, signifié, symbole, motif ou lexical (pour champ lexical).',placeholder:'notion illustrée',
     hint:'Cherche le mot-clé de la phrase : forme ou sens, un ou plusieurs sens, objectif ou subjectif, groupe humain, thème commun, écho dans un texte long.',solution:'<b>'+p[1]+'</b>. '+p[2],
     mist:fsMist(FS_REFCH,p[1],c=>'Ce n\'est pas « '+c+' » : '+FSD[c][0]+' est '+FSD[c][1]+'.'),fallback:fsFB('fr-sem','Nomme la notion','<p>Écris l\'un des mots proposés. Pour le champ lexical, écris <b>lexical</b>.</p>')}; },
 'fr-s-mono':()=>{ const p=enPick(FS_MONO), other=p[1]==='monosémique'?'polysémique':'monosémique';
   return {lang:'fr',choices:['monosémique','polysémique'],tag:'fr-sens',statement:'Le mot « '+p[0]+' » est-il monosémique ou polysémique ?',answers:[p[1]],instr:'Monosémique ou polysémique ?',
     hintline:'Écris « monosémique » ou « polysémique » (les boutons remplissent la zone).',placeholder:'monosémique ou polysémique',
     hint:'Essaie de trouver deux sens bien différents pour ce mot : si tu y arrives, il est polysémique.',solution:'« '+p[0]+' » est <b>'+p[1]+'</b>. '+p[2],
     mist:[[other,'« '+p[0]+' » est '+p[1]+' : '+p[2]]],fallback:fsFB('fr-sens','Monosémique ou polysémique ?','<p>Réponds par <b>monosémique</b> (un seul sens) ou <b>polysémique</b> (plusieurs sens).</p>')}; },
 'fr-s-poly':()=>{ const p=enPick(FS_POLY);
   return {lang:'fr',choices:p[3],tag:'fr-sens',statement:p[0]+'\nDans cette phrase, que désigne « '+p[1]+' » ?',answers:[p[2]],instr:'Quel sens le contexte impose-t-il ?',
     hintline:'Écris un mot parmi les propositions (ou clique dessus). Les accents et les majuscules ne comptent pas.',placeholder:p[3].join(', '),keys:FR_KEYS,
     hint:'Regarde les mots autour de « '+p[1]+' » : ils choisissent le sens.',solution:'Ici « '+p[1]+' » désigne : <b>'+p[2]+'</b>. '+p[4],
     mist:fsMist(p[3],p[2],c=>'Le contexte ne donne pas le sens « '+c+' ». '+p[4]),fallback:fsFB('fr-sens','Choisis un des sens proposés','<p>Écris un mot parmi : '+p[3].join(', ')+'.</p>')}; },
 'fr-s-prop':()=>{ const p=enPick(FS_PROP), fig=Math.random()<0.5, ph=fig?p[1]:p[0], a=fig?'figuré':'propre';
   return {lang:'fr',choices:['propre','figuré'],tag:'fr-sens',statement:ph+'\nLe mot « '+p[2]+' » est-il employé au sens propre ou au sens figuré ?',answers:[a],instr:'Sens propre ou sens figuré ?',
     hintline:'Écris « propre » ou « figuré » (les boutons remplissent la zone). Les accents et les majuscules ne comptent pas.',placeholder:'propre ou figuré',
     hint:'Sens propre : le sens premier, concret. Sens figuré : un sens dérivé, plus imagé, qui passe du concret à l\'abstrait par analogie.',
     solution:'Ici « '+p[2]+' » est employé au sens <b>'+a+'</b> : '+(fig?'on passe du concret à l\'abstrait par analogie (« '+p[0]+' » serait le sens propre).':'c\'est le sens premier, concret (« '+p[1]+' » illustre le sens figuré).'),
     mist:[[fig?'propre':'figuré',fig?'Non : ici le sens est abstrait ou imagé, donc figuré.':'Non : ici le sens est concret, donc propre.']],keys:FR_KEYS,
     fallback:fsFB('fr-sens','Propre ou figuré ?','<p>Réponds par <b>propre</b> ou <b>figuré</b>.</p>')}; },
 'fr-s-evo':()=>{ const p=enPick(FS_EVO), ch=fsShuf([p[2]].concat(p[3]));
   return {lang:'fr',choices:ch,keys:FR_KEYS,tag:'fr-sens',statement:'Aujourd\'hui, « '+p[0]+' » signifie '+p[1]+'. Quel était son sens ancien (ou son sens d\'origine) ?',answers:[p[2]],instr:'Quel est le sens ancien ?',
     hintline:'Écris un mot parmi les propositions (ou clique dessus). Les accents et les majuscules ne comptent pas.',placeholder:ch.join(', '),
     hint:'Le sens a changé avec le temps : pense à l\'origine du mot.',solution:'Sens ancien : <b>'+p[2]+'</b>. '+p[4]+' (d\'après l\'histoire du mot : vérifie dans un dictionnaire étymologique.)',
     mist:fsMist(ch,p[2],c=>'Ce n\'est pas le sens ancien. '+p[4]),fallback:fsFB('fr-sens','Choisis un des sens proposés','<p>Écris un mot parmi : '+ch.join(', ')+'.</p>')}; },
 'fr-s-val':()=>{ const t=enPick(FS_TRI), i=Math.floor(Math.random()*3), w=t[i];
   return {lang:'fr',choices:FS_VCH,tag:'fr-val',statement:'Pour parler de '+t[3]+', on peut dire « '+t[0]+' », « '+t[1]+' » ou « '+t[2]+' ».\nQuelle valeur porte le mot « '+w+' » ?',answers:[FS_VCH[i]],instr:'Neutre, péjoratif ou mélioratif ?',
     hintline:'Écris « neutre », « péjoratif » ou « mélioratif » (les boutons remplissent la zone). Les accents et les majuscules ne comptent pas.',placeholder:'neutre, péjoratif ou mélioratif',keys:FR_KEYS,
     hint:'Un mot péjoratif dévalorise, un mot mélioratif valorise, un mot neutre ne juge pas.',solution:'« '+w+' » est <b>'+FS_VCH[i]+'</b> ; les trois mots : « '+t[0]+' » (neutre), « '+t[1]+' » (péjoratif), « '+t[2]+' » (mélioratif).',
     mist:fsMist(FS_VCH,FS_VCH[i],c=>'Ce n\'est pas « '+c+' » : un mot neutre ne juge pas, un mot péjoratif dévalorise, un mot mélioratif valorise.'),fallback:fsFB('fr-val','Neutre, péjoratif ou mélioratif ?','<p>Réponds par <b>neutre</b>, <b>péjoratif</b> ou <b>mélioratif</b>.</p>')}; },
 'fr-s-nuance':()=>{ const t=enPick(FS_TRI), pej=Math.random()<0.5, a=pej?t[1]:t[2], ch=fsShuf(t.slice(0,3));
   return {lang:'fr',choices:ch,keys:FR_KEYS,tag:'fr-val',statement:'Trois mots désignent '+t[3]+' : « '+ch.join(' », « ')+' ».\nLequel est '+(pej?'péjoratif':'mélioratif')+' ?',answers:[a],instr:'Lequel est '+(pej?'péjoratif':'mélioratif')+' ?',
     hintline:'Écris un des trois mots (ou clique dessus). Les accents et les majuscules ne comptent pas.',placeholder:'un des trois mots',
     hint:pej?'Cherche le mot qui dévalorise ce dont on parle.':'Cherche le mot qui valorise ce dont on parle.',solution:'« '+t[0]+' » est neutre, « '+t[1]+' » est péjoratif, « '+t[2]+' » est mélioratif : réponse <b>'+a+'</b>.',
     mist:fsMist(ch,a,c=>'« '+c+' » est '+(c===t[0]?'neutre':c===t[1]?'péjoratif':'mélioratif')+'.'),fallback:fsFB('fr-val','Choisis un des trois mots','<p>Écris l\'un des trois mots proposés.</p>')}; },
 'fr-s-eph':()=>{ const p=enPick(FS_EPH), opts=fsShuf([[p[1],'e'],[p[2],'c'],[p[3],'n']]), L=['a','b','c'], good=L[opts.findIndex(o=>o[1]==='e')];
   const st='Situation : '+p[0]+'. Quelle formulation est un euphémisme ?\n'+opts.map((o,i)=>L[i]+') '+o[0]).join('\n');
   const ex={e:'un euphémisme (elle atténue)',c:'une formulation crue ou familière (elle ne ménage pas)',n:'une formulation directe et neutre (elle ne ménage pas)'};
   return {lang:'fr',choices:L,tag:'fr-val',statement:st,answers:[good],instr:'Quelle lettre ?',
     hintline:'Écris la lettre de la bonne formulation : a, b ou c (ou clique dessus).',placeholder:'a, b ou c',
     hint:'Un euphémisme atténue une réalité jugée choquante : cherche la formulation la plus adoucie.',solution:'Réponse <b>'+good+'</b> : '+p[1],
     mist:opts.map((o,i)=>[L[i],o[1]==='e'?'':'Cette formulation est '+ex[o[1]]+'.']).filter((m,i)=>opts[i][1]!=='e'),fallback:fsFB('fr-val','Réponds par une lettre','<p>Écris <b>a</b>, <b>b</b> ou <b>c</b>.</p>')}; },
 'fr-s-den':()=>{ const p=enPick(FS_DEN), a=p[2], o=a==='dénoté'?'connoté':'dénoté';
   return {lang:'fr',choices:['dénoté','connoté'],tag:'fr-conn',statement:'Pour le mot « '+p[0]+' », l\'idée « '+p[1]+' » relève-t-elle du sens dénoté ou du sens connoté ?',answers:[a],instr:'Sens dénoté ou connoté ?',
     hintline:'Écris « dénoté » ou « connoté » (les boutons remplissent la zone). Les accents et les majuscules ne comptent pas.',placeholder:'dénoté ou connoté',keys:FR_KEYS,
     hint:'Dénoté : objectif, celui du dictionnaire. Connoté : implicite, subjectif, souvent culturel.',
     solution:'Sens <b>'+a+'</b> : '+(a==='dénoté'?'c\'est l\'information objective que donne le dictionnaire.':'c\'est une idée associée au mot, implicite et partagée par un groupe, pas une définition.'),
     mist:[[o,a==='dénoté'?'Non : cette idée est objective, elle figure dans la définition.':'Non : cette idée est implicite et subjective, elle ne figure pas dans la définition.']],
     fallback:fsFB('fr-conn','Dénoté ou connoté ?','<p>Réponds par <b>dénoté</b> (objectif) ou <b>connoté</b> (implicite, subjectif).</p>')}; },
 'fr-s-symb':()=>{ const p=enPick(FS_SYM), con=Math.random()<0.5, a=con?p[2]:p[1], ch=fsShuf([p[1],p[2]]);
   return {lang:'fr',choices:ch,keys:FR_KEYS,tag:'fr-conn',statement:'« '+p[0]+' »\nQuel mot donne le sens '+(con?'connoté (symbolique)':'dénoté (objectif)')+' ?',answers:[a],instr:'Quel mot correspond au sens '+(con?'connoté':'dénoté')+' ?',
     hintline:'Écris un des deux mots proposés (ou clique dessus). Les accents et les majuscules ne comptent pas.',placeholder:ch.join(' ou '),
     hint:'Un symbole réunit un sens dénoté (ce que l\'on voit, l\'objet ou l\'animal) et un sens connoté commun à un groupe (l\'idée qu\'il représente).',
     solution:'Sens dénoté : <b>'+p[1]+'</b> ; sens connoté : <b>'+p[2]+'</b>. Réponse : <b>'+a+'</b>.',
     mist:fsMist(ch,a,c=>'« '+c+' » est le sens '+(c===p[1]?'dénoté':'connoté')+' ; on te demande le sens '+(con?'connoté':'dénoté')+'.'),fallback:fsFB('fr-conn','Choisis un des deux mots','<p>Écris l\'un des deux mots proposés.</p>')}; },
 'fr-s-src':()=>{ const p=enPick(FS_SRC);
   return {lang:'fr',choices:FS_SRCCH,keys:FR_KEYS,tag:'fr-conn',statement:p[0]+'\nQuelle source de connotation est en jeu ?\n(psychologie = nature psychologique individuelle ; société = environnement social ; histoire = histoire personnelle ; contexte = rapports entre les mots d\'un texte)',answers:[p[1]],instr:'Quelle source de connotation ?',
     hintline:'Écris un mot : psychologie, société, histoire ou contexte (ou clique dessus). Les accents et les majuscules ne comptent pas.',placeholder:'psychologie, société, histoire ou contexte',
     hint:'Demande-toi d\'où vient l\'idée associée au mot : du caractère, du milieu, d\'un souvenir ou des mots voisins dans le texte.',solution:'Source : <b>'+FS_SRCN[p[1]]+'</b> (« '+p[1]+' »).',
     mist:fsMist(FS_SRCCH,p[1],c=>'Ici ce n\'est pas '+FS_SRCN[c]+'.'),fallback:fsFB('fr-conn','Choisis une source','<p>Écris l\'un des quatre mots : psychologie, société, histoire, contexte.</p>')}; },
 'fr-s-int':()=>{ const p=enPick(FS_INT), ch=fsShuf(p[1].concat([p[2]]));
   return {lang:'fr',choices:ch,keys:FR_KEYS,tag:'fr-champ',statement:'Quatre de ces mots appartiennent au même champ lexical ; un seul n\'y appartient pas :\n« '+ch.join(' », « ')+' »',answers:[p[2]],instr:'Quel est l\'intrus ?',
     hintline:'Écris le mot intrus (ou clique dessus). Les accents et les majuscules ne comptent pas.',placeholder:'le mot intrus',
     hint:'Cherche le thème que partagent quatre mots, puis repère celui qui n\'y renvoie pas.',solution:'Le thème commun est « '+p[0]+' » ; l\'intrus est <b>'+p[2]+'</b>.',
     mist:fsMist(ch,p[2],c=>'« '+c+' » appartient bien au champ lexical de '+p[0]+'.'),fallback:fsFB('fr-champ','Choisis un des mots','<p>Écris l\'un des cinq mots proposés.</p>')}; },
 'fr-s-thm':()=>{ const p=enPick(FS_THM), ch=fsShuf([p[1]].concat(fsShuf(FS_THMCH.filter(x=>x!==p[1])).slice(0,3)));
   return {lang:'fr',choices:ch,keys:FR_KEYS,tag:'fr-champ',statement:'« '+p[0]+' »\nQuel champ lexical domine dans ce passage ?',answers:[p[1]],instr:'Quel est le thème dominant ?',
     hintline:'Écris un mot parmi les propositions (ou clique dessus). Les accents et les majuscules ne comptent pas.',placeholder:ch.join(', '),
     hint:'Souligne les mots qui se rapportent à une même réalité : leur thème est le champ lexical.',solution:'Le champ lexical dominant est celui de <b>'+p[1]+'</b>.',
     mist:fsMist(ch,p[1],c=>'Aucun mot du passage ne renvoie vraiment à « '+c+' ».'),fallback:fsFB('fr-champ','Choisis un thème','<p>Écris l\'un des thèmes proposés.</p>')}; },
 'fr-s-mix':()=>{ const p=enPick(FS_MIX), ch=fsShuf([p[1],p[2]].concat(p[3]));
   return {lang:'fr',choices:ch,keys:FR_KEYS,tag:'fr-champ',statement:'« '+p[0]+' »\nDeux thèmes sont présents. Lequel domine (le plus de mots) ?',answers:[p[1]],instr:'Quel champ lexical domine ?',
     hintline:'Écris un mot parmi les propositions (ou clique dessus). Les accents et les majuscules ne comptent pas.',placeholder:ch.join(', '),
     hint:'Compte les mots qui renvoient à chaque thème : le champ lexical dominant est celui qui en compte le plus.',solution:'Le champ lexical dominant est <b>'+p[1]+'</b> ; « '+p[2]+' » n\'apparaît que ponctuellement.',
     mist:fsMist(ch,p[1],c=>c===p[2]?'« '+c+' » est présent, mais seulement par un ou deux mots : il ne domine pas.':'Aucun mot du passage ne renvoie à « '+c+' ».'),fallback:fsFB('fr-champ','Choisis un thème','<p>Écris l\'un des thèmes proposés.</p>')}; }
});
FRT('fr-s-def',1,'fsnt','Retrouver la notion d\'après sa définition');
FRT('fr-s-ref',2,'fsnt','Reconnaître la notion dans une phrase');
FRT('fr-s-mono',1,'fsms','Monosémique ou polysémique');
FRT('fr-s-poly',1,'fsms','Le sens d\'un mot dans la phrase');
FRT('fr-s-prop',2,'fsms','Sens propre ou sens figuré');
FRT('fr-s-evo',3,'fsms','Sens ancien et sens moderne');
FRT('fr-s-val',1,'fsvc','Neutre, péjoratif ou mélioratif');
FRT('fr-s-nuance',2,'fsvc','Repérer le mot péjoratif ou mélioratif');
FRT('fr-s-eph',2,'fsvc','Reconnaître un euphémisme');
FRT('fr-s-den',2,'fsvc','Sens dénoté ou sens connoté');
FRT('fr-s-symb',3,'fsvc','Symbole : sens dénoté et sens connoté');
FRT('fr-s-src',3,'fsvc','Les sources de la connotation');
FRT('fr-s-int',1,'fscl','Trouver l\'intrus d\'un champ lexical');
FRT('fr-s-thm',2,'fscl','Le champ lexical d\'un passage');
FRT('fr-s-mix',3,'fscl','Le champ lexical dominant');
