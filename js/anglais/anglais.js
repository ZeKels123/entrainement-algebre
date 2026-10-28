'use strict';
/* ===== Anglais : present simple / present continuous, exercices du moteur (domaine « ang ») ===== */
const EN={
  s3(v){ if(v==='have') return 'has'; if(/(s|sh|ch|x|z|o)$/.test(v)) return v+'es'; if(/[^aeiou]y$/.test(v)) return v.slice(0,-1)+'ies'; return v+'s'; },
  ing(v){ if(/ie$/.test(v)) return v.slice(0,-2)+'ying'; if(/[^aeiouy]e$/.test(v)&&!/ee$/.test(v)) return v.slice(0,-1)+'ing'; if(EN.DBL.indexOf(v)>=0) return v+v.slice(-1)+'ing'; return v+'ing'; },
  DBL:['run','sit','stop','swim','get','put','plan','shop','cut','hit'],
  whyS3(v){ if(v==='have') return ' (have est irrégulier : has)'; const m=v.match(/(sh|ch|s|x|z|o)$/); if(m) return ' (verbe en -'+m[1]+' : on ajoute -es)'; if(/[^aeiou]y$/.test(v)) return ' (consonne + y : y devient -ies)'; return ' (on ajoute -s)'; },
  whyIng(v){ if(/ie$/.test(v)) return ' (ie devient ying)'; if(/[^aeiouy]e$/.test(v)&&!/ee$/.test(v)) return ' (le e final muet disparaît)'; if(EN.DBL.indexOf(v)>=0) return ' (verbe court consonne-voyelle-consonne : on double la consonne)'; return ' (on ajoute simplement -ing)'; },
  S:[{s:'I',q:'I',g:'1',c:"I'm"},{s:'You',q:'you',g:'p',c:"you're"},{s:'He',q:'he',g:'3',c:"he's"},{s:'She',q:'she',g:'3',c:"she's"},{s:'We',q:'we',g:'p',c:"we're"},{s:'They',q:'they',g:'p',c:"they're"},
     {s:'My brother',q:'my brother',g:'3'},{s:'Our teacher',q:'our teacher',g:'3'},{s:'My parents',q:'my parents',g:'p'},{s:'Tom and Anna',q:'Tom and Anna',g:'p'},{s:'My cousin',q:'my cousin',g:'3'},{s:'My sister',q:'my sister',g:'3'}],
  VP:[['play','football'],['watch','TV'],['study','French'],['go','to the market'],['wash','the car'],['cook','dinner'],['read','a book'],['drink','coffee'],['open','the window'],['fix','the bike'],['help','at home'],['speak','German'],['write','emails'],['clean','the kitchen'],['drive','to the shop'],['eat','an apple'],['swim','in the lake'],['play','the piano'],['buy','bread'],['carry','the bags'],['fly','a kite'],['stay','at home'],['paint','the wall'],['finish','the homework'],['have','a shower'],['walk','to the station'],['make','tea'],['run','in the park'],['sit','on the sofa'],['make','a cake'],['take','the bus'],['dance','in the hall']],
  STAT:[['know','the answer'],['like','this song'],['want','a coffee'],['need','help'],['understand','the question'],['love','this film']],
  be:S=>S.g==='1'?'am':S.g==='3'?'is':'are',
  aux:S=>S.g==='3'?'does':'do',
  vf:(S,v)=>S.g==='3'?EN.s3(v):v
};
const enSubj=()=>enPick(EN.S);
function enBase(topic,level,instr,statement,answers,hint,solution,mist){ const an=answers.map(enNorm); return {topic,level,instr,statement,answers,hint,solution,mist:(mist||[]).filter(m=>an.indexOf(enNorm(m[0]))<0)}; }

const ENGEN={
 'ps-3s':()=>{ const v=enPick(['go','do','have','watch','wash','fix','pass','study','carry','cry','fly','play','buy','stay','teach','finish','enjoy','try','miss','push','relax','say','read']);
   const r=EN.s3(v);
   return enBase('ps-3s',1,'Écris la 3e personne du singulier','he / she / it  +  « '+v+' »  →  ______',[r],
     'Verbes en -s, -sh, -ch, -x, -z, -o : -es. Consonne + y : -ies. Sinon : -s. Cas particulier : have → has.',
     v+' → <b>'+r+'</b>'+EN.whyS3(v)+'.',[[v,'À la 3e personne du singulier il faut ajouter la terminaison.'],[v+'s','Vérifie la règle d\'orthographe de la terminaison (-es, -ies ou -s).']]); },
 'ps-fill':()=>{ const S=enSubj(), vp=enPick(EN.VP), v=vp[0], useAdv=Math.random()<0.5, adv=enPick(['always','usually','often','sometimes','never']), time=enPick(['every day','every morning','on Sundays','every weekend','twice a week']);
   const r=EN.vf(S,v), st=S.s+' '+(useAdv?adv+' ':'')+'___ ('+v+') '+vp[1]+(useAdv?'':' '+time)+'.';
   const mist=S.g==='3'?[[v,'Sujet à la 3e personne du singulier : il faut le -s / -es (ici « '+r+' »).']]:[[EN.s3(v),'Avec « '+S.s+' » il n\'y a pas de -s : le verbe reste à la base.']];
   mist.push([EN.be(S)+' '+EN.ing(v),'« '+(useAdv?adv:time)+' » indique une habitude : c\'est le present simple, pas le continuous.']);
   return enBase('ps-fill',1,'Complète au present simple',st,[r],
     (useAdv?'« '+adv+' »':'« '+time+' »')+' = habitude → present simple. '+(S.g==='3'?'Sujet à la 3e personne du singulier : -s / -es.':'Sujet « '+S.s+' » : verbe à la base.'),
     'Habitude → present simple. '+(S.g==='3'?v+' → <b>'+r+'</b>'+EN.whyS3(v)+'.':'Avec « '+S.s+' » : verbe à la base, <b>'+v+'</b>.'),mist); },
 'pc-ing':()=>{ const v=enPick(['make','run','sit','write','stop','swim','lie','play','dance','get','come','study','take','have','see','plan','hit','cut','ride','die','use','shop','read','go']);
   const r=EN.ing(v);
   return enBase('pc-ing',1,'Écris la forme en -ing','« '+v+' »  →  ______',[r],
     'e muet : il disparaît. Verbe court consonne-voyelle-consonne : on double la consonne. ie → ying.',
     v+' → <b>'+r+'</b>'+EN.whyIng(v)+'.',[[v+'ing','Vérifie l\'orthographe : e muet, consonne doublée ou ie → ying.']]); },
 'pc-fill':()=>{ const S=enSubj(), vp=enPick(EN.VP), v=vp[0], m=enPick([['Look!','',1],['','at the moment',0],['','now',0],['','right now',0]]);
   const b=EN.be(S), ing=EN.ing(v), r=b+' '+ing, st=(m[0]?m[0]+' ':'')+S.s+' ___ ('+v+') '+vp[1]+(m[1]?' '+m[1]:'')+'.';
   const ans=[r,S.s+' '+r]; if(S.c) ans.push(S.c+' '+ing);
   if(b==='am') ans.push("'m "+ing); else if(b==='is') ans.push("'s "+ing); else ans.push("'re "+ing);
   const mist=[[ing,'Il manque am / is / are devant le verbe en -ing.'],[v,'Present continuous : am / is / are + verbe en -ing.'],[EN.s3(v),'Present continuous : am / is / are + verbe en -ing.']];
   ['am','is','are'].forEach(x=>{ if(x!==b) mist.push([x+' '+ing,'Avec « '+S.s+' » on utilise « '+b+' ».']); });
   return enBase('pc-fill',1,'Complète au present continuous',st,ans,
     '« '+(m[0]||m[1])+' » : action en cours → am / is / are + verbe-ing. Avec « '+S.s+' » : '+b+'.',
     'Action en cours → <b>'+r+'</b> ('+b+' + '+ing+').'+EN.whyIng(v).replace(/^ \(/,' Orthographe : ').replace(/\)$/,'.'),mist); },
 'ps-neg':()=>{ const S=enSubj(), vp=enPick(EN.VP), v=vp[0], st=S.s+' '+EN.vf(S,v)+' '+vp[1]+'.', ax=EN.aux(S);
   const a1=S.s+' '+ax+"n't "+v+' '+vp[1], a2=S.s+' '+ax+' not '+v+' '+vp[1];
   const mist=S.g==='3'?[[S.s+" doesn't "+EN.s3(v)+' '+vp[1],'Après doesn\'t / does not, le verbe reste à la base : pas de -s.'],[S.s+' not '+EN.s3(v)+' '+vp[1],'Il faut l\'auxiliaire does : does not / doesn\'t + verbe à la base.']]:[[S.s+" don't "+EN.s3(v)+' '+vp[1],'Pas de -s après don\'t.'],[S.s+' not '+v+' '+vp[1],'Il faut l\'auxiliaire do : do not / don\'t + verbe à la base.']];
   return enBase('ps-neg',2,'Mets la phrase au négatif',st,[a1,a2],
     'Négation du present simple : do not (don\'t) / does not (doesn\'t) + verbe à la base.',
     'Négation : <b>'+a1+'.</b> (ou « '+a2+' »). Après '+ax+' not, le verbe est à la base.',mist); },
 'ps-q':()=>{ const S=enSubj(), vp=enPick(EN.VP), v=vp[0], st=S.s+' '+EN.vf(S,v)+' '+vp[1]+'.', ax=EN.aux(S);
   const a=(ax==='does'?'Does ':'Do ')+S.q+' '+v+' '+vp[1]+'?';
   const mist=S.g==='3'?[['Does '+S.q+' '+EN.s3(v)+' '+vp[1]+'?','Après Does, le verbe reste à la base : pas de -s.']]:[];
   return enBase('ps-q',2,'Transforme en question',st,[a],
     'Question au present simple : Do / Does + sujet + verbe à la base.',
     'Question : <b>'+a+'</b> (Do/Does + sujet + base verbale).',mist); },
 'pc-neg':()=>{ const S=enSubj(), vp=enPick(EN.VP.filter(x=>['play','watch','study','go','cook','read','eat','walk','run','make','take'].indexOf(x[0])>=0)), v=vp[0], b=EN.be(S), ing=EN.ing(v);
   const st=S.s+' '+b+' '+ing+' '+vp[1]+'.', neg=b==='am'?'am not':b==='is'?"isn't":"aren't", full=b+' not';
   const ans=[S.s+' '+neg+' '+ing+' '+vp[1], S.s+' '+full+' '+ing+' '+vp[1]];
   if(S.c){ ans.push(S.c+' not '+ing+' '+vp[1]); }
   const mist=[[S.s+" don't "+ing+' '+vp[1],'Present continuous : la négation se fait avec be + not, pas avec don\'t.'],[S.s+" doesn't "+ing+' '+vp[1],'Present continuous : la négation se fait avec be + not, pas avec doesn\'t.']];
   return enBase('pc-neg',2,'Mets la phrase au négatif',st,ans,
     'Négation du present continuous : am not / isn\'t / aren\'t + verbe-ing.',
     'Négation : <b>'+ans[0]+'.</b> On place not après am / is / are.',mist); },
 'pc-q':()=>{ const S=enSubj(), vp=enPick(EN.VP.filter(x=>['play','watch','study','go','cook','read','eat','walk','run','make','take'].indexOf(x[0])>=0)), v=vp[0], b=EN.be(S), ing=EN.ing(v);
   const st=S.s+' '+b+' '+ing+' '+vp[1]+'.', a=(b==='am'?'Am':b==='is'?'Is':'Are')+' '+S.q+' '+ing+' '+vp[1]+'?';
   return enBase('pc-q',2,'Transforme en question',st,[a],
     'Question du present continuous : am / is / are + sujet + verbe-ing.',
     'Question : <b>'+a+'</b> (on inverse le sujet et am / is / are).',[]); },
 'mix-sc':()=>{ const t=enPick(['ps','pc','stat','have']);
   if(t==='stat'){ const S=enPick(EN.S.filter(x=>x.g!=='1'||true)), vp=enPick(EN.STAT), v=vp[0], r=EN.vf(S,v), ing=EN.be(S)+' '+EN.ing(v);
     return enBase('mix-sc',3,'Simple ou continuous ? Complète',enPick(['At the moment','Right now','Now'])+', '+S.q+' ___ ('+v+') '+vp[1]+'.',[r],
       '« '+v+' » est un verbe d\'état : on ne le met en général pas à la forme en -ing, même avec « now ».',
       v+' est un verbe d\'état → present simple : <b>'+r+'</b>, pas « '+ing+' ».',[[ing,v+' est un verbe d\'état : pas de forme en -ing.']]); }
   if(t==='have'){ const S=enPick(EN.S), noun=enPick(['lunch','a shower','breakfast','a break']), b=EN.be(S);
     return enBase('mix-sc',3,'Simple ou continuous ? Complète','Please wait. '+S.s+' ___ (have) '+noun+' at the moment.',[b+' having',S.s+' '+b+' having'].concat(S.c?[S.c+' having']:[]).concat([b==='am'?"'m having":b==='is'?"'s having":"'re having"]),
       '« have » + repas / douche = action : « at the moment » → present continuous. (« have » = posséder serait un verbe d\'état.)',
       '« have lunch / a shower » est une action en cours → <b>'+b+' having</b>.',[[EN.vf(S,'have'),'« at the moment » + action : present continuous.']]); }
   if(t==='ps'){ const S=enSubj(), vp=enPick(EN.VP), v=vp[0], r=EN.vf(S,v), w=enPick([['Every day,',''],['Usually,','']]);
     return enBase('mix-sc',3,'Simple ou continuous ? Complète',w[0]+' '+S.q+' ___ ('+v+') '+vp[1]+'.',[r],
       'Repère : '+w[0].replace(',','')+' = habitude → present simple.','Habitude → present simple : <b>'+r+'</b>'+(S.g==='3'?EN.whyS3(v):'')+'.',[[EN.be(S)+' '+EN.ing(v),'Habitude : present simple.']]); }
   const S=enSubj(), vp=enPick(EN.VP), v=vp[0], b=EN.be(S), ing=EN.ing(v), mk=enPick(['Look!','Right now,','At the moment,']);
   return enBase('mix-sc',3,'Simple ou continuous ? Complète',mk+' '+(mk.endsWith(',')?S.q:S.s)+' ___ ('+v+') '+vp[1]+'.',[b+' '+ing,S.s+' '+b+' '+ing].concat(S.c?[S.c+' '+ing]:[]).concat([b==='am'?"'m "+ing:b==='is'?"'s "+ing:"'re "+ing]),
     '« '+mk.replace(',','')+' » : action en cours → present continuous.','Action en cours → <b>'+b+' '+ing+'</b>.',[[EN.vf(S,v),'« '+mk.replace(',','')+' » : action en cours, present continuous.']]); },
 'fix':()=>{ const L=[["She go to school every day.",["She goes to school every day"],"3e personne du singulier au present simple : go → goes."],
   ["He don't like coffee.",["He doesn't like coffee","He does not like coffee"],"Avec he / she / it : doesn't (does not) + verbe à la base."],
   ["Does she plays tennis?",["Does she play tennis"],"Après Does, le verbe reste à la base."],
   ["I am knowing the answer.",["I know the answer"],"know est un verbe d'état : present simple, pas de forme en -ing."],
   ["They is playing football now.",["They are playing football now"],"Avec they : are."],
   ["We are go to the cinema now.",["We are going to the cinema now"],"Present continuous : am / is / are + verbe-ing."],
   ["She is work at the moment.",["She is working at the moment"],"Present continuous : verbe-ing."],
   ["Do he speak English?",["Does he speak English"],"Avec he : Does."],
   ["My brother watch TV every evening.",["My brother watches TV every evening"],"3e personne : watch → watches (-ch : -es)."],
   ["I doesn't understand.",["I don't understand","I do not understand"],"Avec I : don't."],
   ["Look! It rains.",["Look! It is raining","Look! It's raining"],"« Look! » : action en cours, present continuous."],
   ["He is never late not.",["He is never late"],"Une seule négation : he is never late."],
   ["The train leave at 8:15.",["The train leaves at 8:15"],"3e personne du singulier : leave → leaves."],
   ["She studys French on Mondays.",["She studies French on Mondays"],"Consonne + y : study → studies."],
   ["We are runing in the park.",["We are running in the park"],"run : on double le n devant -ing."]];
   const x=enPick(L);
   return enBase('fix',3,'Corrige l\'erreur (écris la phrase correcte)',x[0],x[1],'Repère le temps (habitude ou action en cours), puis vérifie l\'auxiliaire, la terminaison et l\'orthographe.',
     'Phrase correcte : <b>'+x[1][0]+'.</b> '+x[2],[]); }
};

/* ----- adaptation au moteur : un exercice d'anglais est un exercice « texte » (ex.txt) ----- */
Object.assign(TAGS,{
  'en-s3':{label:'Terminaison de la 3e personne',tip:'Au present simple, he / she / it prend -s (-es après s, sh, ch, x, z, o ; -ies après consonne + y). Après do / does / don\'t / doesn\'t, le verbe reste à la base.'},
  'en-aux':{label:'Auxiliaire do / does',tip:'Négation et question du present simple : do / does + verbe à la base. Does pour he / she / it, do pour les autres sujets.'},
  'en-be':{label:'am / is / are',tip:'Present continuous : am (I), is (he, she, it), are (you, we, they) + verbe en -ing.'},
  'en-ing':{label:'Forme en -ing',tip:'-ing : le e muet disparaît (make → making), consonne-voyelle-consonne : on double (run → running), ie → ying (lie → lying).'},
  'en-temps':{label:'Simple ou continuous ?',tip:'Habitude, vérité générale, horaire → present simple. Action en cours (now, at the moment, Look!) → present continuous. Les verbes d\'état (know, like, want…) restent au simple.'},
  'en-forme':{label:'Forme de la phrase',tip:'Repère le temps, puis vérifie sujet, auxiliaire, terminaison et orthographe.'}
});
function enTag(msg){
  if(/am \/ is \/ are|« (am|is|are) »|Il manque am/.test(msg)) return 'en-be';
  if(/auxiliaire|Après d|Après Does|Do \/ Does|Avec he : Does|Avec I : don|Avec he \/ she/.test(msg)) return 'en-aux';
  if(/orthographe|e muet|consonne doubl|ie → ying|double/.test(msg)) return 'en-ing';
  if(/habitude|continuous|en cours|verbe d.état|simple/.test(msg)) return 'en-temps';
  if(/3e personne|-s|-es|terminaison/.test(msg)) return 'en-s3';
  return 'en-forme';
}
const ENT=(id,level,kind,label)=>{ TOPICS['en-'+id]={kind,level,label,gen:()=>mkTxt(ENGEN[id]())}; };
ENT('ps-fill',1,'enps','Compléter au present simple');
ENT('ps-neg',2,'enps','Present simple : négation');
ENT('ps-q',2,'enps','Present simple : question');
ENT('pc-fill',1,'enpc','Compléter au present continuous');
ENT('pc-neg',2,'enpc','Present continuous : négation');
ENT('pc-q',2,'enpc','Present continuous : question');
