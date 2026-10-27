'use strict';
/* ===== Français : registres de langue (exercices rédigés pour l'appli, sans reprendre ceux de la feuille) ===== */
Object.assign(TAGS,{
  'fr-reg':{label:'Registre confondu',tip:'Familier : mots et tournures de l\'oral (boulot, fringues, « y a », négation sans « ne »). Courant : neutre. Soutenu : vocabulaire recherché et syntaxe élaborée (imparfait du subjonctif, inversions).'},
  'fr-equiv':{label:'Équivalent de registre',tip:'Un même sens existe en trois registres : courant (travail), familier (boulot), soutenu (labeur). Cherche le mot du bon registre.'}
});
const FR_KEYS=['é','è','ê','à','â','ç','î','ô','û','\'','-'];
const FR_CH=['familier','courant','soutenu'];
/* trios courant / familier / soutenu, rédigés pour l'appli (pas repris de la feuille) : [courant, familiers, soutenus|null, précision] */
const FR_TRIOS=[
  ['travail',['boulot','taf','turbin'],['labeur','besogne'],'',['emploi']],['maison',['baraque'],['demeure','résidence','logis'],'',[]],
  ['peur',['trouille','frousse','pétoche'],['effroi','épouvante'],'',['crainte','frayeur']],
  ['fatigué',['crevé','claqué','vanné','lessivé'],['harassé','exténué','fourbu','recru'],'',['épuisé','las']],
  ['voler',['piquer','faucher','chiper','barboter'],['dérober','subtiliser'],' (prendre ce qui ne t\'appartient pas)',[]],
  ['mourir',['crever','clamser','calancher','casser sa pipe'],['trépasser','expirer'],'',['décéder']],
  ['argent',['fric','pognon','blé','oseille','thune'],null,'',[]],['livre',['bouquin'],['ouvrage'],'',[]],
  ['se dépêcher',['se magner','se grouiller'],['se hâter','s\'empresser'],'',['se presser']],
  ['rire',['se marrer','rigoler','se poiler','se bidonner'],['s\'esclaffer'],'',['rigoler']],
  ['regarder',['zieuter','reluquer'],['contempler'],'',['observer'],['mater']],
  ['se moquer de quelqu\'un',['se foutre de quelqu\'un','se payer la tête de quelqu\'un'],['railler quelqu\'un','se gausser de quelqu\'un'],'',[]],
  ['beaucoup de',['plein de','un tas de','un paquet de','des tonnes de','une tonne de','une chiée de','une flopée de','un max de','des masses de'],['moult','force'],'',[]],
  ['médecin',['toubib','doc'],null,'',['docteur']],['policier',['flic','poulet'],null,'',[]],['ami',['pote'],null,'',['camarade','copain']],
  ['vêtements',['fringues','nippes','frusques','sapes'],['atours'],'',['habits']],
  ['avoir faim',['avoir la dalle','avoir les crocs','crever de faim'],null,'',[]],['enfant',['gamin','mioche','gosse','marmot','môme'],null,'',[]],
  ['s\'ennuyer',['se barber'],null,'',[]],['partir',['se barrer','se tirer'],['prendre congé'],'',['s\'en aller']],
  ['dormir',['roupiller','pioncer'],null,'',['sommeiller']],['se tromper',['se planter','se gourer'],['se méprendre'],'',['faire une erreur']],
  ['nez',['pif','tarin','blair'],null,'',[]],['tête',['caboche','tronche','ciboulot','bouille'],null,'',[]],
  ['gifler',['mettre une baffe','mettre une claque'],['souffleter'],'',[]],['stupide',['débile','crétin'],['inepte','sot'],'',['idiot','bête']],
  ['ennuyeux',['barbant','rasoir'],['fastidieux'],'',[]],['abandonner',['laisser tomber','plaquer'],['délaisser'],'',[]],
  ['crier',['gueuler','brailler'],['vociférer'],'',['hurler']],['pleurer',['chialer'],['se lamenter'],'',[]],
  ['chaussures',['godasses','pompes'],null,'',[]],['bavarder',['papoter','tailler une bavette'],['converser','deviser'],'',[]],
  ['mauvais',['pourri','nul'],['exécrable','détestable'],'',[]],['en colère',['furax','remonté'],['courroucé'],'',['furieux','fâché']],
  ['se disputer',['s\'engueuler','se chamailler'],['se quereller'],'',['se fâcher']],['très beau',['canon','super beau'],['sublime','splendide'],'',['magnifique']],
  ['travailler dur',['bosser','trimer','bûcher'],['œuvrer','peiner'],'',[]],['nourriture',['graille'],['victuailles'],'',[]],
  ['très riche',['friqué','plein aux as'],['opulent','fortuné'],'',['riche']],['pauvre',['fauché','raide'],['indigent','nécessiteux'],'',['démuni']],
  ['ivre',['bourré','beurré'],['éméché','aviné'],'',['soûl','saoul']],['sale',['crado'],['malpropre','fangeux'],'',[]],
  ['laid',['moche'],['hideux','disgracieux'],'',[]],['fort',['costaud','balèze'],['vigoureux'],'',['robuste','musclé']],
  ['facile',['fastoche'],['aisé'],'',['simple']],['difficile',['coton'],['ardu','malaisé'],'',['compliqué']],
  ['frère',['frangin','frérot'],null,'',[]],['sœur',['frangine'],null,'',[]],['comprendre',['piger','capter','percuter'],null,'',['saisir']],
  ['s\'énerver',['péter un câble','péter les plombs'],null,'',['se mettre en colère']],['avoir de la chance',['avoir du bol','avoir du pot'],null,'',[]],
  ['jeter',['balancer','bazarder'],null,'',[]],['cacher',['planquer'],['dissimuler'],'',[]],['arrêter quelqu\'un',['choper','pincer'],['appréhender'],'',[]],
  ['se coucher',['se pieuter'],null,'',[]],['fou',['dingue','timbré','cinglé'],['insensé'],'',[]],['lycée',['bahut'],null,'',['établissement']],
  ['professeur',['prof'],null,'',['enseignant']],['examen',['exam','interro'],null,'',['contrôle']],['ordinateur',['ordi'],null,'',[]],
  ['petit-déjeuner',['petit-déj'],null,'',[]],['apéritif',['apéro'],null,'',[]],['sympathique',['sympa'],['aimable','avenant'],'',[]],
  ['excellent',['génial','top','super'],['remarquable','admirable'],'',['formidable','très bien']],['vite',['fissa'],['promptement'],'',['rapidement']],
  ['malade',['patraque','mal fichu'],['souffrant','indisposé'],'',['mal en point']],['tomber',['se casser la figure','se ramasser'],['choir'],'',['chuter']],
  ['gronder',['engueuler','enguirlander'],['admonester','tancer'],'',['réprimander','disputer']],['plaisanter',['blaguer','déconner'],['badiner'],'',[]],
  ['ventre',['bide','brioche'],null,'',[]],['bouche',['clapet','gueule'],null,'',[]],['mains',['pattes','paluches'],null,'',[]],
  ['pieds',['panards','arpions'],null,'',[]],['yeux',['mirettes','quinquets'],null,'',[]]
];
/* mots à classer : [mot, registre, équivalent courant] */
const FR_MOTS=[];
FR_TRIOS.forEach(t=>{ FR_MOTS.push([t[0],'courant','']); t[1].filter(f=>!(t[4]||[]).includes(f)).forEach(f=>FR_MOTS.push([f,'familier',t[0]])); (t[2]||[]).forEach(f=>FR_MOTS.push([f,'soutenu',t[0]])); });
/* phrases : [texte, registre, indice] */
const FR_PHR=[
  ['Franchement, ce film, c\'était nul : j\'ai failli m\'endormir.','familier','« Franchement » et « nul » (au sens de « mauvais ») sont des mots de l\'oral.'],
  ['Tu viens avec nous ou t\'as pas envie ?','familier','« t\'as » (tu as) et « ne » omis (« pas envie ») : langue de l\'oral.'],
  ['Ma copine, elle m\'a dit qu\'elle viendrait pas.','familier','Sujet répété (« Ma copine, elle ») et « ne » omis : langue de l\'oral.'],
  ['J\'ai la flemme de ranger ma piaule, c\'est le bazar total.','familier','« la flemme », « piaule » et « bazar » sont des mots familiers.'],
  ['On s\'est bien marrés hier soir, c\'était trop cool.','familier','« marrés » et « trop cool » sont des expressions familières.'],
  ['Il est vachement sympa, ce prof, mais il nous gave avec ses contrôles.','familier','« vachement » et « gaver » (ennuyer) sont des mots familiers.'],
  ['Je suis allé chez le dentiste ce matin ; j\'y retourne la semaine prochaine.','courant','Vocabulaire et syntaxe neutres : ni familier, ni recherché.'],
  ['Les élèves ont préparé leur exposé pendant la récréation.','courant','Phrase neutre, correcte, sans mot familier ni mot recherché.'],
  ['Il fait froid ce soir : prends une veste avant de sortir.','courant','Phrase simple, correcte et neutre : registre courant.'],
  ['Nous mangerons à midi, puis nous irons au marché.','courant','Vocabulaire ordinaire et syntaxe correcte : registre courant.'],
  ['Mon voisin a repeint sa clôture en vert.','courant','Phrase neutre, sans mot familier ni mot recherché.'],
  ['Elle a téléphoné à sa mère pour lui annoncer la nouvelle.','courant','Vocabulaire et syntaxe ordinaires : registre courant.'],
  ['Nul n\'eût imaginé que l\'entreprise périrait si vite.','soutenu','« Nul… ne » et subjonctif plus-que-parfait (« eût imaginé ») : langue écrite et recherchée.'],
  ['Il me plairait que vous consentissiez à m\'entendre.','soutenu','Imparfait du subjonctif (« consentissiez ») : syntaxe très soignée.'],
  ['Les ténèbres enveloppaient le château, tandis qu\'un vent funeste gémissait dans les tours.','soutenu','Vocabulaire littéraire (« ténèbres », « funeste ») et images.'],
  ['Veuillez agréer, Madame, l\'expression de ma considération distinguée.','soutenu','Formule de politesse très cérémonieuse.'],
  ['Se peut-il que l\'on se soit mépris à ce point sur ses desseins ?','soutenu','Inversion du sujet (« Se peut-il ») et mots recherchés (« se mépris », « desseins »).'],
  ['Elle contemplait, rêveuse, l\'onde argentée qui s\'effaçait sous la lune.','soutenu','« onde » (eau, poétique) et vocabulaire imagé : registre soutenu.'],
  ['T\'as vu ça ? J\'y crois pas, il s\'est barré sans rien dire !','familier','« T\'as vu », « ne » omis (« J\'y crois pas ») et « s\'est barré » : langue de l\'oral.'],
  ['Mon frangin, il a paumé ses clés encore une fois.','familier','Sujet répété (« Mon frangin, il ») et mots familiers (« frangin », « paumé »).'],
  ['Ça fait un bail qu\'on s\'est pas vus, non ?','familier','« un bail » (longtemps), « on » pour « nous » et « ne » omis : langue de l\'oral.'],
  ['Il s\'est fait virer de sa boîte parce qu\'il glandait toute la journée.','familier','« virer », « boîte » (entreprise) et « glandait » sont des mots familiers.'],
  ['C\'est dingue, ce prof : il nous file un max de devoirs !','familier','« dingue », « filer » et « un max de » sont des expressions familières.'],
  ['Y a trop de monde dans ce truc, j\'en peux plus.','familier','« Y a », « truc » et « ne » omis (« j\'en peux plus »).'],
  ['Je vais acheter du pain, je reviens dans dix minutes.','courant','Vocabulaire et syntaxe neutres : ni familier, ni recherché.'],
  ['Nous avons visité le musée avant de rentrer à l\'hôtel.','courant','Phrase neutre, correcte, sans mot familier ni mot recherché.'],
  ['Il a oublié ses clés, alors il a dû attendre sa sœur dehors.','courant','Vocabulaire simple et syntaxe correcte : registre courant.'],
  ['Pourriez-vous me dire à quelle heure part le prochain train ?','courant','Question polie mais neutre : pas de mot recherché ni de tournure rare.'],
  ['La réunion a été reportée à jeudi, car le directeur est malade.','courant','Phrase neutre, sans mot familier ni mot recherché.'],
  ['Elle travaille dans une banque depuis trois ans.','courant','Vocabulaire et syntaxe ordinaires : registre courant.'],
  ['Il s\'abîma dans une profonde méditation, nul bruit ne venant troubler le silence.','soutenu','Passé simple (« s\'abîma »), « nul… ne » et participe absolu (« nul bruit ne venant… ») : syntaxe littéraire.'],
  ['Quoi qu\'il en eût, il dut se résoudre à partir avant l\'aube.','soutenu','Subjonctif plus-que-parfait (« eût ») et tournure figée : langue écrite et recherchée.'],
  ['Je vous saurais gré de bien vouloir m\'accorder un entretien.','soutenu','Formule de politesse très cérémonieuse (« je vous saurais gré »).'],
  ['Le crépuscule, dans sa mélancolique splendeur, drapait la vallée d\'un voile d\'or.','soutenu','Vocabulaire poétique (« crépuscule », « drapait », « voile d\'or ») et images.'],
  ['Il convient que vous vous acquittiez de cette tâche sans tarder.','soutenu','Subjonctif présent (« acquittiez ») après « il convient que » et verbe « s\'acquitter » : registre soutenu.'],
  ['Bien que fourbu, le voyageur poursuivit sa route d\'un pas résolu.','soutenu','Passé simple (« poursuivit »), mot recherché (« fourbu ») et construction soignée.']
];
const frCap=s=>s.charAt(0).toUpperCase()+s.slice(1);
function frMist(good){ return FR_CH.filter(c=>c!==good).map(c=>[c,'Ce n\'est pas le registre « '+c+' » : relis les indices (vocabulaire, syntaxe) et utilise un indice si besoin.']); }
const FRGEN={
 'fr-mot':()=>{ const m=enPick(FR_MOTS);
   return {lang:'fr',choices:FR_CH,tag:'fr-reg',statement:'« '+m[0]+' » : quel est son registre de langue ?',answers:[m[1]],instr:'Quel est le registre de langue ?',
     hintline:'Réponds par un seul mot : familier, courant ou soutenu (les touches remplissent la zone). Les accents et les majuscules ne comptent pas.',placeholder:'familier, courant ou soutenu',
     hint:m[1]==='courant'?'Cette expression est neutre : on la dit à tout le monde, dans toutes les situations.':m[1]==='familier'?'Cette expression appartient à la langue de l\'oral, entre proches.':'Cette expression est recherchée : elle appartient à la langue écrite ou cérémonieuse.',
     solution:'« '+m[0]+' » : registre <b>'+m[1]+'</b>'+(m[2]?' ; équivalent courant : « '+m[2]+' »':'')+'.',mist:frMist(m[1]),fallback:{tag:'fr-reg',title:'Réponds par un registre',html:'<p>Écris l\'un des trois registres : <b>familier</b>, <b>courant</b> ou <b>soutenu</b>.</p>'}}; },
 'fr-phr':()=>{ const p=enPick(FR_PHR);
   return {lang:'fr',choices:FR_CH,tag:'fr-reg',statement:p[0],answers:p[1]==='familier'?['familier','argot']:[p[1]],instr:'Quel est le registre de langue de cette phrase ?',
     hintline:'Réponds par un seul mot : familier, courant ou soutenu (les touches remplissent la zone). Les accents et les majuscules ne comptent pas.',placeholder:'familier, courant ou soutenu',
     hint:p[2],solution:'Registre <b>'+p[1]+'</b>. '+p[2],mist:frMist(p[1]),fallback:{tag:'fr-reg',title:'Réponds par un registre',html:'<p>Écris l\'un des trois registres : <b>familier</b>, <b>courant</b> ou <b>soutenu</b>.</p>'}}; },
 'fr-eqc':()=>{ const t=enPick(FR_TRIOS.filter(x=>x[0]!=='voler')), f=enPick(t[1].filter(x=>!(t[4]||[]).includes(x)));
   return {lang:'fr',tag:'fr-equiv',statement:'Mot familier : « '+f+' ». Écris le mot ou l\'expression du registre courant qui a le même sens.',answers:[t[0]].concat(t[4]||[]),instr:'Trouve l\'équivalent courant',
     hintline:'Écris le mot ou l\'expression (une seule ligne). Les accents et les majuscules ne comptent pas.',placeholder:'équivalent courant',
     hint:'L\'équivalent courant commence par « '+t[0].charAt(0)+' ».',solution:'« '+f+' » (familier) → <b>'+[t[0]].concat(t[4]||[]).join('</b> ou <b>')+'</b> (courant).',mist:[],keys:FR_KEYS,
     fallback:{tag:'fr-equiv',title:'Ce n\'est pas l\'équivalent attendu',html:'<p>Cherche le mot ou l\'expression neutre qui a le même sens. Utilise un indice si tu bloques.</p>'}}; },
 'fr-eqf':()=>{ const t=enPick(FR_TRIOS), sout=!!t[2]&&Math.random()<0.5, reg=sout?'soutenu':'familier', A=sout?t[2]:t[1].concat(t[5]||[]);
   return {lang:'fr',tag:'fr-equiv',statement:'Mot courant : « '+t[0]+' »'+t[3]+'. Écris un équivalent du registre '+reg+'.',answers:A,instr:'Trouve l\'équivalent '+reg,
     hintline:'Écris le mot ou l\'expression (une seule ligne). Les accents et les majuscules ne comptent pas.',placeholder:'équivalent '+reg,
     hint:'Un équivalent '+reg+' commence par « '+A[0].charAt(0)+' ».',solution:'« '+t[0]+' » (courant) → <b>'+A.join('</b> ou <b>')+'</b> ('+reg+').',mist:[],keys:FR_KEYS,
     fallback:{tag:'fr-equiv',title:'Ce n\'est pas l\'équivalent attendu',html:'<p>Il faut un mot ou une expression du registre demandé, avec le même sens. Utilise un indice si tu bloques.</p>'}}; }
};
const FRT=(id,level,kind,label)=>{ TOPICS[id]={kind,level,label,gen:()=>mkTxt(FRGEN[id]())}; };
FRT('fr-mot',1,'frrg','Registre d\'un mot ou d\'une expression');
FRT('fr-eqc',1,'frre','Du familier au mot courant');
FRT('fr-eqf',2,'frre','Équivalent familier ou soutenu');
FRT('fr-phr',2,'frrg','Registre d\'une phrase ou d\'un texte');
