'use strict';
/* ===== Anglais : past simple / past continuous (domaine « apa »), grammaire standard ===== */
Object.assign(EN,{
  IRR:{go:'went',do:'did',have:'had',read:'read',drink:'drank',speak:'spoke',write:'wrote',eat:'ate',take:'took',make:'made',run:'ran',swim:'swam',sit:'sat',get:'got',put:'put',cut:'cut',hit:'hit',buy:'bought',see:'saw',come:'came',give:'gave',find:'found',tell:'told',say:'said',know:'knew',think:'thought',leave:'left',meet:'met',sleep:'slept',sing:'sang',ride:'rode',drive:'drove',begin:'began',lose:'lost',win:'won',bring:'brought',teach:'taught',fly:'flew',wear:'wore',forget:'forgot',sell:'sold',send:'sent',build:'built',pay:'paid',stand:'stood',understand:'understood',hear:'heard',feel:'felt',keep:'kept',wake:'woke',fall:'fell',catch:'caught'},
  DBLP:['stop','plan','shop','drop','jog','chat'],
  past(v){ if(EN.IRR[v]) return EN.IRR[v]; if(/e$/.test(v)) return v+'d'; if(/[^aeiou]y$/.test(v)) return v.slice(0,-1)+'ied'; if(EN.DBLP.indexOf(v)>=0) return v+v.slice(-1)+'ed'; return v+'ed'; },
  whyPast(v){ if(EN.IRR[v]) return ' (verbe irrégulier : '+v+' → '+EN.IRR[v]+', à connaître)'; if(/e$/.test(v)) return ' (verbe en -e : on ajoute seulement -d)'; if(/[^aeiou]y$/.test(v)) return ' (consonne + y : y devient -ied)'; if(EN.DBLP.indexOf(v)>=0) return ' (verbe court consonne-voyelle-consonne : on double la consonne, puis -ed)'; return ' (on ajoute -ed)'; },
  wb:S=>S.g==='p'?'were':'was'
});
const EP_REG=['play','watch','study','stop','like','plan','carry','open','visit','cry','dance','wash','help','clean','finish','shop','try','stay','live','cook','walk','enjoy','use','hope','listen','start'];
const EP_IRR=Object.keys(EN.IRR);
const EP_PAST_T=['yesterday','last week','two days ago','last Monday','a week ago','on Saturday morning'];
const EP_PC_T=['at 8 pm last night','at ten o\'clock yesterday morning','at this time yesterday','at noon yesterday','at 6 pm on Friday'];
const EP_VPC=EN.VP.filter(x=>['play','watch','study','go','cook','read','eat','walk','run','make','take','clean','write','swim','help','drive','dance','sit','speak','drink'].indexOf(x[0])>=0);
const EP_EV=[['the phone','ring','rang'],['the bell','ring','rang'],['the teacher','arrive','arrived'],['the lights','go out','went out'],['the alarm','sound','sounded'],['a friend','call','called'],['the baby','wake up','woke up'],['the door','open','opened']];
const epWasN=(S,b)=>b==='was'?"wasn't":"weren't";
const EPGEN={
 'pa-reg':()=>{ const v=enPick(EP_REG), r=EN.past(v);
   return enBase('pa-reg',1,'Écris le prétérit (past simple)','« '+v+' »  →  ______',[r],
     'Verbe régulier : -ed. Verbe en -e : -d. Consonne + y : -ied. Verbe court consonne-voyelle-consonne (stop, plan, shop) : on double la consonne.',
     v+' → <b>'+r+'</b>'+EN.whyPast(v)+'.',[[v,'Au passé il faut une terminaison.'],[v+'ed','Vérifie l\'orthographe : -d après e, -ied après consonne + y, consonne doublée pour stop / plan / shop.']]); },
 'pa-irr':()=>{ const v=enPick(EP_IRR), r=EN.IRR[v];
   return enBase('pa-irr',1,'Écris le prétérit de ce verbe irrégulier','« '+v+' »  →  ______',[r],
     'Verbe irrégulier : la forme du passé est à connaître par cœur (pas de -ed).',
     v+' → <b>'+r+'</b> (verbe irrégulier).',[[v+'ed','Ce verbe est irrégulier : on ne lui ajoute pas -ed.'],[v,'Il faut la forme du passé, différente (ou à vérifier) de l\'infinitif.']]); },
 'pa-fill':()=>{ const S=enSubj(), vp=enPick(EN.VP), v=vp[0], t=enPick(EP_PAST_T), r=EN.past(v), b=EN.wb(S);
   const st=S.s+' ___ ('+v+') '+vp[1]+' '+t+'.';
   const mist=[[v,'« '+t+' » : fait terminé dans le passé → past simple (forme du passé).'],[b+' '+EN.ing(v),'« '+t+' » : fait terminé → past simple, pas past continuous.']];
   if(EN.IRR[v]) mist.push([v+'ed','« '+v+' » est irrégulier : '+r+'.']); else if(S.g==='3') mist.push([EN.s3(v),'Au passé, aucun -s à la 3e personne : forme en -ed.']);
   return enBase('pa-fill',1,'Complète au past simple',st,[r],
     '« '+t+' » = fait terminé dans le passé → past simple. Même forme pour tous les sujets.',
     'Fait terminé → past simple : <b>'+r+'</b>'+EN.whyPast(v)+'.',mist); },
 'pa-neg':()=>{ const S=enSubj(), vp=enPick(EN.VP), v=vp[0], r=EN.past(v), st=S.s+' '+r+' '+vp[1]+'.';
   const a1=S.s+" didn't "+v+' '+vp[1], a2=S.s+' did not '+v+' '+vp[1];
   return enBase('pa-neg',2,'Mets la phrase au négatif',st,[a1,a2],
     'Négation du past simple : did not (didn\'t) + verbe à la base. Le -ed disparaît.',
     'Négation : <b>'+a1+'.</b> (ou « '+a2+' »). Après didn\'t, le verbe est à la base.',
     [[S.s+" didn't "+r+' '+vp[1],'Après didn\'t, le verbe reste à la base (pas de forme du passé).'],[S.s+' not '+r+' '+vp[1],'Il faut l\'auxiliaire did : did not / didn\'t + base.'],[S.s+" don't "+v+' '+vp[1],'Phrase au passé : l\'auxiliaire est did, pas do.']]); },
 'pa-q':()=>{ const S=enSubj(), vp=enPick(EN.VP), v=vp[0], r=EN.past(v), st=S.s+' '+r+' '+vp[1]+'.', a='Did '+S.q+' '+v+' '+vp[1]+'?';
   return enBase('pa-q',2,'Transforme en question',st,[a],
     'Question au past simple : Did + sujet + verbe à la base.',
     'Question : <b>'+a+'</b> (Did + sujet + base verbale, sans -ed).',
     [['Did '+S.q+' '+r+' '+vp[1]+'?','Après Did, le verbe reste à la base (pas de forme du passé).'],['Do '+S.q+' '+v+' '+vp[1]+'?','Phrase au passé : l\'auxiliaire est Did.']]); },
 'pt-fill':()=>{ const S=enSubj(), vp=enPick(EP_VPC), v=vp[0], t=enPick(EP_PC_T), b=EN.wb(S), ing=EN.ing(v), r=b+' '+ing;
   const st=S.s+' ___ ('+v+') '+vp[1]+' '+t+'.';
   const mist=[[EN.past(v),'« '+t+' » : action en cours à un moment précis du passé → was / were + verbe-ing.'],[ing,'Il manque was / were devant le verbe en -ing.'],[v,'Past continuous : was / were + verbe-ing.']];
   const w=b==='was'?'were':'was'; mist.push([w+' '+ing,'Avec « '+S.s+' » on utilise « '+b+' ».']);
   return enBase('pt-fill',1,'Complète au past continuous',st,[r],
     '« '+t+' » : action en cours à un moment précis du passé → was / were + verbe-ing. Avec « '+S.s+' » : '+b+'.',
     'Action en cours dans le passé → <b>'+r+'</b> ('+b+' + '+ing+').'+EN.whyIng(v).replace(/^ \(/,' Orthographe : ').replace(/\)$/,'.'),mist); },
 'pt-neg':()=>{ const S=enSubj(), vp=enPick(EP_VPC), v=vp[0], b=EN.wb(S), ing=EN.ing(v), st=S.s+' '+b+' '+ing+' '+vp[1]+'.', neg=epWasN(S,b);
   const ans=[S.s+' '+neg+' '+ing+' '+vp[1], S.s+' '+b+' not '+ing+' '+vp[1]];
   return enBase('pt-neg',2,'Mets la phrase au négatif',st,ans,
     'Négation du past continuous : wasn\'t / weren\'t (was not / were not) + verbe-ing.',
     'Négation : <b>'+ans[0]+'.</b> On place not après was / were.',
     [[S.s+" didn't "+ing+' '+vp[1],'Past continuous : la négation se fait avec was / were + not, pas avec didn\'t.'],[S.s+" didn't "+v+' '+vp[1],'Il faut conserver le past continuous : wasn\'t / weren\'t + verbe-ing.']]); },
 'pt-q':()=>{ const S=enSubj(), vp=enPick(EP_VPC), v=vp[0], b=EN.wb(S), ing=EN.ing(v), st=S.s+' '+b+' '+ing+' '+vp[1]+'.', a=(b==='was'?'Was':'Were')+' '+S.q+' '+ing+' '+vp[1]+'?';
   return enBase('pt-q',2,'Transforme en question',st,[a],
     'Question du past continuous : Was / Were + sujet + verbe-ing.',
     'Question : <b>'+a+'</b> (on inverse le sujet et was / were).',[['Did '+S.q+' '+ing+' '+vp[1]+'?','Past continuous : on inverse was / were et le sujet, pas de did.']]); },
 'pm-fill':()=>{ const t=enPick(['int','while','when']);
   if(t==='int'){ const S=enSubj(), vp=enPick(EP_VPC), v=vp[0], b=EN.wb(S), ing=EN.ing(v), e=enPick(EP_EV);
     return enBase('pm-fill',3,'Simple ou continuous ? Complète',S.s+' '+b+' '+ing+' '+vp[1]+' when '+e[0]+' ___ ('+e[1]+').',[e[2]],
       'Une action brève qui interrompt une action en cours : past simple (la longue est au past continuous).',
       'L\'action brève (« '+e[0]+' ») est au past simple : <b>'+e[2]+'</b>.',[[EN.wb({g:'3'})+' '+EN.ing(e[1].split(' ')[0])+(e[1].split(' ').slice(1).length?' '+e[1].split(' ').slice(1).join(' '):''),'Action brève et terminée qui interrompt : past simple.']]); }
   if(t==='while'){ const S=enSubj(), vp=enPick(EP_VPC), v=vp[0], b=EN.wb(S), ing=EN.ing(v), e=enPick(EP_EV);
     return enBase('pm-fill',3,'Simple ou continuous ? Complète','While '+S.q+' ___ ('+v+') '+vp[1]+', '+e[0]+' '+e[2]+'.',[b+' '+ing],
       '« While » introduit l\'action longue, en cours : past continuous (was / were + verbe-ing).',
       'Action longue interrompue → <b>'+b+' '+ing+'</b>.',[[EN.past(v),'Avec « while », l\'action en cours est au past continuous.'],[ing,'Il manque was / were.']]); }
   const S=enSubj(), vp=enPick(EP_VPC), v=vp[0], b=EN.wb(S), ing=EN.ing(v), who=enPick(['I','we','she','he']), arr=who==='I'||who==='we'?['got home','arrived','came back']:['got home','arrived','came back'];
   return enBase('pm-fill',3,'Simple ou continuous ? Complète','When '+who+' '+enPick(arr)+', '+S.q+' ___ ('+v+') '+vp[1]+'.',[b+' '+ing],
     'L\'action déjà en cours quand l\'autre se produit est au past continuous.',
     'Action déjà en cours → <b>'+b+' '+ing+'</b>.',[[EN.past(v),'L\'action en cours à ce moment-là est au past continuous.'],[ing,'Il manque was / were.']]); },
 'pm-fix':()=>{ const L=[["She goed to school yesterday.",["She went to school yesterday"],"go est irrégulier : go → went."],
   ["I didn't went to the party.",["I didn't go to the party","I did not go to the party"],"Après didn't, le verbe reste à la base."],
   ["Did you saw the film?",["Did you see the film"],"Après Did, le verbe reste à la base."],
   ["He studyed all night.",["He studied all night"],"Consonne + y : study → studied."],
   ["We stoped at the shop.",["We stopped at the shop"],"stop : on double le p devant -ed."],
   ["They was playing football.",["They were playing football"],"Avec they : were."],
   ["I were reading at 8 pm.",["I was reading at 8 pm"],"Avec I : was."],
   ["She wasn't watched TV.",["She wasn't watching TV","She was not watching TV"],"Past continuous négatif : wasn't + verbe-ing."],
   ["While I cooked, the phone was ringing.",["While I was cooking, the phone rang"],"L'action longue est au past continuous, l'action brève au past simple."],
   ["Was he went home?",["Did he go home"],"Question au past simple : Did + sujet + base."],
   ["He buyed a new bike.",["He bought a new bike"],"buy est irrégulier : buy → bought."],
   ["We didn't saw anyone.",["We didn't see anyone","We did not see anyone"],"Après didn't, le verbe reste à la base."],
   ["She was cry when I arrived.",["She was crying when I arrived"],"Past continuous : was + verbe-ing."],
   ["Yesterday I was visiting my aunt.",["Yesterday I visited my aunt"],"Fait terminé à un moment défini (yesterday) : past simple."],
   ["Did she cried yesterday?",["Did she cry yesterday"],"Après Did, le verbe reste à la base."]];
   const x=enPick(L);
   return enBase('pm-fix',3,'Corrige l\'erreur (écris la phrase correcte)',x[0],x[1],'Repère le temps (fait terminé ou action en cours), puis vérifie l\'auxiliaire, la forme du verbe et l\'orthographe.',
     'Phrase correcte : <b>'+x[1][0]+'.</b> '+x[2],[]); }
};
Object.assign(TAGS,{
  'ep-pa':{label:'Forme du passé',tip:'Past simple : verbe régulier + -ed (-d après e ; -ied après consonne + y ; consonne doublée pour stop, plan, shop). Verbes irréguliers (go → went) à connaître.'},
  'ep-aux':{label:'Auxiliaire did',tip:'Négation et question du past simple : did not (didn\'t) / Did + sujet + verbe à la base. Le passé n\'apparaît que sur did.'},
  'ep-be':{label:'was / were',tip:'Past continuous : was (I, he, she, it) / were (you, we, they) + verbe-ing. Négation : wasn\'t / weren\'t. Question : Was / Were + sujet.'},
  'ep-temps':{label:'Simple ou continuous ?',tip:'Fait terminé à un moment défini → past simple. Action en cours à un moment passé ou action longue interrompue (while / when) → past continuous ; l\'action brève qui interrompt est au past simple.'},
  'ep-forme':{label:'Forme de la phrase',tip:'Repère le temps, puis vérifie sujet, auxiliaire, forme du verbe et orthographe.'}
});
function epTag(msg){
  if(/was \/ were|« (was|were) »|Il manque was|wasn|weren|[Pp]ast continuous/.test(msg)) return 'ep-be';
  if(/did|Did|didn/.test(msg)) return 'ep-aux';
  if(/action en cours|action brève|interromp|while|terminé|défini/.test(msg)) return 'ep-temps';
  if(/orthographe|irrégulier|-ed|-ied|terminaison|passé/.test(msg)) return 'ep-pa';
  return 'ep-forme';
}
const EPT=(id,level,kind,label)=>{ TOPICS['ep-'+id]={kind,level,label,gen:()=>{ const g=EPGEN[id](); g.tagf=epTag; g.fallback={tag:'ep-forme',title:'Ce n\'est pas la forme attendue',html:'<p>Relis la consigne, repère le temps (fait terminé ou action en cours), puis vérifie l\'auxiliaire (did, was / were), la forme du verbe et l\'orthographe. Utilise un indice si tu bloques.</p>'}; return mkTxt(g); }}; };
EPT('pa-reg',1,'epps','Prétérit des verbes réguliers');
EPT('pa-irr',1,'epps','Prétérit des verbes irréguliers');
EPT('pa-fill',1,'epps','Compléter au past simple');
EPT('pa-neg',2,'epps','Past simple : négation');
EPT('pa-q',2,'epps','Past simple : question');
EPT('pt-fill',1,'eppc','Compléter au past continuous');
EPT('pt-neg',2,'eppc','Past continuous : négation');
EPT('pt-q',2,'eppc','Past continuous : question');
EPT('pm-fill',3,'epmx','Simple ou continuous ? (compléter)');
EPT('pm-fix',3,'epmx','Corriger la phrase');
