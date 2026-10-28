'use strict';
/* ===== Mode examen, fiche de formules, vérification pas à pas ===== */
const EXCFG={dur:30,lv:0,scope:"dom"};
const EXN={30:8,45:12,60:16};
const running=()=>!!(S.exam&&!S.exam.done);
const EXKINDS=['alg','eq','geo'];
const EXD=dom=>DOMBR[dom]?BRDOMS[DOMBR[dom]]:EXKINDS;
function examKeyLabel(k){
  const clean=h=>h.replace(/<[^>]+>/g,'').replace('&amp;','&');
  if(DOM_TITLE[k]) return clean(DOM_TITLE[k]);
  if(k==='all') return 'Tous les domaines';
  const d=domainOf(k), m=(MODES[d]||[]).find(x=>x[0]===k);
  return clean(DOM_TITLE[d])+' · '+(m?m[1]:k);
}
function examScope(dom){ const sc=EXCFG.scope||'dom'; return (sc==='all'||sc==='dom'||DKINDS[dom].includes(sc))?sc:'dom'; }
function examKey(dom){ const sc=examScope(dom); return sc==='dom'?dom:sc; }
function examIds(dom,d2){
  const sc=examScope(dom), ks=sc==='all'?DKINDS[d2||dom]:(sc==='dom'?DKINDS[dom]:[sc]);
  return Object.keys(TOPICS).filter(id=>ks.includes(TOPICS[id].kind));
}
function examLvMax(dom){ const all=examScope(dom)==='all'?EXD(dom).reduce((a,d)=>a.concat(examIds(dom,d)),[]):examIds(dom); return Math.max.apply(null,all.map(id=>TOPICS[id].level)); }
function examLevels(n,dom){
  const mx=examLvMax(dom);
  if(EXCFG.lv) return Array.from({length:n},()=>Math.min(EXCFG.lv,mx));
  return Array.from({length:n},(_,i)=>Math.max(1,Math.min(mx,1+Math.floor(i*mx/n))));
}
function examPick(l,dom,i,avoid){
  const d2=examScope(dom)==='all'?EXD(dom)[i%EXD(dom).length]:dom, ids=examIds(dom,d2);
  const lvs=[...new Set(ids.map(id=>TOPICS[id].level))], L=lvs.reduce((p,c)=>Math.abs(c-l)<Math.abs(p-l)?c:p,lvs[0]);
  return newExercise('mix',L,avoid,ids.filter(id=>TOPICS[id].level===L),d2);
}
function examStart(){
  const dom=S.domain, n=EXN[EXCFG.dur], lvs=examLevels(n,dom), avoid=[], qs=[];
  lvs.forEach((l,i)=>{ const ex=examPick(l,dom,i,avoid); avoid.push(ex.statement); qs.push({ex,ans:''}); });
  S.exam={qs,i:0,dom,sk:examKey(dom),dur:EXCFG.dur,end:Date.now()+EXCFG.dur*60000,done:false,timer:null};
  S.pool=null; S.boss=null; TOTAL=n;
  S.exam.timer=setInterval(examTick,1000);
  document.getElementById('view-train').classList.add('examrun');
  setTab('train'); examRender(); examTick();
}
function examTick(){
  if(!S.exam||S.exam.done){ return; }
  const left=Math.max(0,Math.round((S.exam.end-Date.now())/1000));
  const el=$('exam-time'); if(el){ el.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0'); el.classList.toggle('low',left<=300); }
  if(left<=0) examFinish(true);
}
function examCommit(){ if(running()) S.exam.qs[S.exam.i].ans=$('answer').value; }
function examRender(){
  const E=S.exam; S.ex=E.qs[E.i].ex; S.n=E.i; S.status='open'; S.tries=0; S.hints=0; S.stepCount=1;
  renderExercise(true);
  $('answer').value=E.qs[E.i].ans; updatePreview();
  ['btn-hint','btn-solution','btn-skip','btn-step'].forEach(id=>{ const b=$(id); if(b) b.hidden=true; });
  $('btn-check').textContent='Enregistrer'; $('btn-next').hidden=false; $('btn-next').textContent=E.i+1>=E.qs.length?'Dernière question : rendre la copie':'Question suivante';
  $('hintline').textContent='Mode examen : ni indice, ni correction avant la fin. Écris ta démarche et ta réponse finale ; tu peux revenir sur une question avant de rendre la copie.';
  $('exam-bar').hidden=false;
  $('exam-dots').innerHTML=E.qs.map((q,k)=>'<button type="button" class="exdot'+(k===E.i?' cur':'')+(q.ans.trim()?' ans':'')+'" data-q="'+k+'" aria-label="Question '+(k+1)+(q.ans.trim()?' (répondue)':'')+'">'+(k+1)+'</button>').join('');
  $('exam-prog').textContent=E.qs.filter(q=>q.ans.trim()).length+' / '+E.qs.length+' répondues';
  examTick();
}
function examGo(k){ if(!running()) return; examCommit(); S.exam.i=Math.max(0,Math.min(S.exam.qs.length-1,k)); examRender(); }
function examSave(){ examCommit(); const f=$('feedback'); f.className='fb'; f.innerHTML='<h2><span aria-hidden="true">✓</span> Réponse enregistrée</h2><p class="note">Elle sera corrigée à la fin de l\'examen.</p>'; f.hidden=false; $('exam-prog').textContent=S.exam.qs.filter(q=>q.ans.trim()).length+' / '+S.exam.qs.length+' répondues'; const d=$('exam-dots').children[S.exam.i]; if(d&&S.exam.qs[S.exam.i].ans.trim()) d.classList.add('ans'); }
function examNext(){ if(!running()) return; if(S.exam.i+1>=S.exam.qs.length){ examAskFinish(); } else examGo(S.exam.i+1); }
function examAskFinish(){
  examCommit(); const E=S.exam, blank=E.qs.filter(q=>!q.ans.trim()).length;
  const f=$('feedback'); f.className='fb'; f.hidden=false;
  f.innerHTML='<h2><span aria-hidden="true">!</span> Rendre la copie ?</h2><p>'+(blank?blank+' question'+(blank>1?'s':'')+' sans réponse. ':'Toutes les questions ont une réponse. ')+'Après la remise, tu ne pourras plus modifier tes réponses.</p><div class="actions"><button type="button" class="btn primary" data-ex="finish">Rendre la copie</button><button type="button" class="btn" data-ex="resume">Continuer</button></div>';
  f.scrollIntoView&&f.scrollIntoView({block:'nearest'});
}
function examAbandon(){
  if(!S.exam) return; clearInterval(S.exam.timer); S.exam=null; TOTAL=10;
  document.getElementById('view-train').classList.remove('examrun'); $('exam-bar').hidden=true;
  setTab('exam'); newSeries();
}
function examFinish(timeout){
  const E=S.exam; if(!E||E.done) return; examCommit(); E.done=true; clearInterval(E.timer);
  let W=0, got=0, ok=0; const rows=[];
  E.qs.forEach((q,k)=>{
    const L=q.ex.level||1, blank=!q.ans.trim(); let res=null;
    if(!blank){ try{ res=checkWork(q.ex,q.ans); }catch(e){ res={status:'syntax',title:'Écriture non reconnue'}; } }
    const good=res&&res.status==='ok'; W+=L; if(good){ got+=L; ok++; }
    const st=stats.topics[q.ex.topic]||(stats.topics[q.ex.topic]={n:0,clean:0,helped:0,shown:0}); st.n++; st[good?'clean':'shown']++;
    srsUpdate(q.ex.topic,good?'clean':'shown');
    if(res&&res.tag&&!good){ stats.errors[res.tag]=(stats.errors[res.tag]||0)+1; noteErr(res.tag,q.ex.topic); }
    rows.push({q,k,L,blank,good,res});
  });
  saveStats();
  const ratio=W?got/W:0, note=Math.round((1+5*ratio)*10)/10;
  let xp=0; rows.forEach(r=>{ if(r.good) xp+=xpBase(r.L); }); xp=Math.round(xp*1.25); const coins=Math.ceil(ok/2)+(note>=5?5:0);
  G.c.n+=E.qs.length; G.c.exam=(G.c.exam||0)+1; if(note>=5) G.c.exam5=(G.c.exam5||0)+1;
  G.coins+=coins; const up=addXp(xp);
  const key='exam|'+E.sk; const rec=G.rec[key]||(G.rec[key]={best:0,n:0}); rec.n++; if(note>rec.best) rec.best=note;
  (G.exams=G.exams||[]).push({d:dayStr(0),dm:E.sk,n:E.qs.length,dur:E.dur,note,ok}); if(G.exams.length>12) G.exams.splice(0,G.exams.length-12);
  const fresh=checkBadges(); announceBadges(fresh); saveGame(); renderBar();
  if(note>=5){ confetti(); tone(SND.good); }
  S.exam.result={rows,note,ratio,xp,coins,up,fresh,timeout,ok};
  document.getElementById('view-train').classList.remove('examrun'); $('exam-bar').hidden=true; TOTAL=10;
  S.exam=null; S.lastExam={rows,note,ratio,xp,coins,up,fresh,timeout,ok,dom:E.dom,sk:E.sk,dur:E.dur};
  setTab('exam'); newSeries();
}
function examViewHTML(){
  const dom=S.domain;
  if(S.lastExam&&S.lastExam.show){ /* résultat affiché une fois */ }
  let h='';
  const R=S.lastExam;
  if(R&&R.sk===examKey(dom)){
    h+='<div class="card exres"><h3>Résultat de l\'examen'+(R.timeout?' <span class="cnt">temps écoulé</span>':'')+'</h3><div class="kpis"><div class="kpi"><span class="lbl">Note</span><b>'+fr(R.note)+' / 6</b></div><div class="kpi"><span class="lbl">Réussies</span><b>'+R.ok+' / '+R.rows.length+'</b></div><div class="kpi"><span class="lbl">Récompense</span><b>+'+R.xp+' XP</b></div></div>'
      +'<p class="note">Note = 1 + 5 × points obtenus / points possibles ; une question vaut autant de points que son niveau. Récompense : +25 % d\'XP, +'+R.coins+' pièces.'+(R.up?' Nouveau rang : '+esc(rankOf(G.xp).name)+'.':'')+'</p>'
      +(R.fresh.length?'<p class="rw-b"><span class="lbl">Badges obtenus</span> '+R.fresh.map(b=>'<span class="bdg-chip">'+esc(b[1])+'</span>').join(' ')+'</p>':'')
      +'<ul class="rec">'+R.rows.map(r=>'<li class="exq"><details><summary><span class="tagk '+(r.good?'clean':'shown')+'">'+(r.good?'Juste':r.blank?'Sans réponse':'Faux')+'</span><span>Q'+(r.k+1)+' · niv. '+r.L+' · '+esc(r.q.ex.statement.length>90?r.q.ex.statement.slice(0,90)+'…':r.q.ex.statement)+'</span></summary>'
        +(r.blank?'':'<p class="lbl">Ta réponse</p><pre class="exans">'+esc(r.q.ans)+'</pre>')+(r.res&&!r.good&&r.res.html?'<div class="fb ko" style="margin:8px 0">'+'<h2>'+esc(r.res.title||'')+'</h2>'+r.res.html+'</div>':'')+solutionHTML(r.q.ex)+'</details></li>').join('')+'</ul></div>';
  }
  const lvMax=examLvMax(dom), sc=examScope(dom), scL=sc==='all'?'Tous les domaines':sc==='dom'?DOM_TITLE[dom].replace(/<[^>]+>/g,'').replace('&amp;','&'):((MODES[dom].find(m=>m[0]===sc)||[0,sc])[1]);
  h+='<div class="card"><h3>Examen blanc · '+esc(scL)+'</h3><p>Conditions d\'examen : temps limité, aucun indice, aucune correction avant la fin. Tu réponds dans l\'ordre que tu veux et tu peux revenir sur une question. Tout est corrigé à la remise de la copie, avec la solution détaillée.</p>'
    +'<div class="field"><label class="lbl" for="ex-scope">Thème</label><select id="ex-scope" class="sel"><option value="dom"'+(sc==='dom'?' selected':'')+'>Tout le domaine (mélange)</option>'+MODES[dom].filter(m=>DKINDS[dom].includes(m[0])).map(m=>'<option value="'+m[0]+'"'+(sc===m[0]?' selected':'')+'>'+esc(m[1])+'</option>').join('')+(EXD(dom).length>1?'<option value="all"'+(sc==='all'?' selected':'')+'>'+(DOMBR[dom]?'Tous les thèmes mélangés':'Tous les domaines mélangés')+'</option>':'')+'</select></div>'
    +'<div class="field"><span class="lbl">Durée</span><div class="seg" id="ex-dur" role="group">'+[30,45,60].map(m=>'<button type="button" data-d="'+m+'" aria-pressed="'+(EXCFG.dur===m)+'">'+m+' min · '+EXN[m]+' questions</button>').join('')+'</div></div>'
    +'<div class="field"><span class="lbl">Difficulté</span><div class="seg" id="ex-lv" role="group"><button type="button" data-l="0" aria-pressed="'+(EXCFG.lv===0)+'">Progressive</button>'+Array.from({length:lvMax},(_,i)=>'<button type="button" data-l="'+(i+1)+'" aria-pressed="'+(EXCFG.lv===i+1)+'">Niveau '+(i+1)+'</button>').join('')+'</div></div>'
    +'<div class="actions"><button type="button" class="btn primary" data-ex="start">Commencer l\'examen</button></div></div>';
  const past=(G.exams||[]).filter(x=>x.dm===examKey(dom)).slice(-5).reverse();
  if(past.length) h+='<div class="card"><h3>Examens précédents</h3><ul class="rec">'+past.map(x=>'<li><span class="tagk '+(x.note>=5?'clean':x.note>=4?'helped':'shown')+'">'+fr(x.note)+' / 6</span><span>'+esc(x.d)+' · '+x.n+' questions ('+x.dur+' min) · '+x.ok+' réussies</span></li>').join('')+'</ul></div>';
  return h;
}
function renderExamView(){ $('view-exam').innerHTML=examViewHTML(); }
function examChange(e){ if(e.target.id==='ex-scope'){ EXCFG.scope=e.target.value; EXCFG.lv=0; renderExamView(); } }
function examClick(e){
  const b=e.target.closest('button'); if(!b) return;
  if(b.dataset.d){ EXCFG.dur=+b.dataset.d; renderExamView(); return; }
  if(b.dataset.l!==undefined&&b.parentNode.id==='ex-lv'){ EXCFG.lv=+b.dataset.l; renderExamView(); return; }
  if(b.dataset.ex==='start'){ S.lastExam=null; examStart(); }
}
function examBarClick(e){
  const b=e.target.closest('button'); if(!b) return;
  if(b.dataset.q!==undefined) return examGo(+b.dataset.q);
  const a=b.dataset.ex;
  if(a==='prev') examGo(S.exam.i-1); else if(a==='fin') examAskFinish(); else if(a==='ab') { $('exam-ab').hidden=false; }
  else if(a==='ab-yes') examAbandon(); else if(a==='ab-no') $('exam-ab').hidden=true;
}
function examFbClick(e){
  const b=e.target.closest('button[data-ex]'); if(!b||!running()) return;
  if(b.dataset.ex==='finish') examFinish(false); else if(b.dataset.ex==='resume'){ $('feedback').hidden=true; }
}

/* ---------- vérification d'une étape ---------- */
function onStep(){
  if(S.status!=='open'||running()) return;
  const v=$('answer').value;
  if(v.trim()){ S.stepUsed=true; betCancel('étape vérifiée'); }
  if(!v.trim()){ showFb('mid','Rien à vérifier','<p>Écris au moins une ligne, puis clique sur « Vérifier l\'étape ».</p>'); return; }
  const r=checkWork(S.ex,v), nl=v.split('\n').map(s=>s.trim()).filter(Boolean).length;
  if(r.status==='syntax'){ showFb('mid',r.title,r.html); return; }
  if(r.status==='ok'){ showFb('ok','Étapes justes','<p>Tout ce que tu as écrit est correct, et la dernière ligne est une réponse finale valable. Clique sur « Vérifier » pour valider l\'exercice.</p>'); return; }
  if(r.status==='incomplete'||r.status==='format'){ showFb('ok',nl>1?'Tes étapes sont justes':'Cette étape est juste','<p>Aucune erreur jusqu\'ici. '+(r.status==='format'?'Le résultat est exact mais sa présentation est à terminer (réduire, développer, simplifier).':'Il reste des étapes avant la réponse finale.')+' Écris la ligne suivante.</p>'); return; }
  if(S.ex.kind==='geo'){
    if(r.tag==='geo-calcul'||r.tag==='geo-arrondi'){ showFb('ko',r.title,r.html+(r.tag&&TAGS[r.tag]?'<p class="retain"><b>À retenir</b> · '+esc(TAGS[r.tag].tip)+'</p>':'')); return; }
    showFb('ok','Aucune incohérence dans tes égalités','<p>Chaque égalité que tu as écrite est numériquement exacte. Cela ne dit pas encore si ta méthode mène à la bonne réponse : continue, puis clique sur « Vérifier » pour la valeur finale.</p>'); return;
  }
  const retain=r.tag&&TAGS[r.tag]?'<p class="retain"><b>À retenir</b> · '+esc(TAGS[r.tag].tip)+'</p>':'';
  showFb('ko',r.title,r.html+retain);
}

/* ---------- fiche de formules ---------- */
function formulasHTML(d){
  const T=(h,rows)=>'<div class="card"><h3>'+h+'</h3><div class="tbl"><table class="ov"><tbody>'+rows.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>').join('')+'</tbody></table></div></div>';
  const E=s=>'<span lang="en">'+esc(s)+'</span>';
  let h='<div class="formulas"><div class="fhead"><h2>Fiche de formules · '+DOM_TITLE[d].replace(/<[^>]+>/g,'').replace('&amp;','&')+'</h2><button type="button" class="btn noprint" data-f="print">Imprimer la fiche</button></div>';
  if(d==='alg') h+=T('Identités remarquables',[['Carré d\'une somme',M('(a + b)² = a² + 2ab + b²')],['Carré d\'une différence',M('(a - b)² = a² - 2ab + b²')],['Différence de deux carrés',M('(a + b)(a - b) = a² - b²')],['Double distribution',M('(a + b)(c + d) = ac + ad + bc + bd')]])
    +T('Factoriser',[['Facteur commun',M('ka + kb = k(a + b)')],['Différence de carrés',M('a² - b² = (a + b)(a - b)')],['Trinôme carré parfait',M('a² ± 2ab + b² = (a ± b)²')],['Groupement',M('ac + ad + bc + bd = (a + b)(c + d)')],['Trinôme x² + Sx + P',M('x² + Sx + P = (x - r)(x - s)')+' avec '+M('r + s = S')+' et '+M('r × s = P')]])
    +T('Vérifier',[['Test numérique','Remplace la lettre par une valeur simple (2, −1…) dans l\'énoncé et dans ton résultat : les deux nombres doivent être égaux.'],['Signes','Un signe − devant une parenthèse change tous les signes à l\'intérieur.']]);
  else if(d==='eq') h+=T('Équation du premier degré',[['Forme',M('ax + b = c')+' donc '+M('x = (c - b)/a')],['Règle','Ce que tu fais d\'un côté, fais-le de l\'autre. Vérifie en remplaçant.']])
    +T('Second degré '+M('ax² + bx + c = 0'),[['Discriminant',M('Δ = b² - 4ac')],['Δ > 0','Deux solutions : '+M('x = (-b ± √Δ)/(2a)')],['Δ = 0','Une solution : '+M('x = -b/(2a)')],['Δ < 0','Aucune solution réelle'],['Somme et produit',M('x₁ + x₂ = -b/a')+' ; '+M('x₁ × x₂ = c/a')],['Factorisation',M('a(x - x₁)(x - x₂)')]])
    +T('Systèmes',[['Substitution','Isole une inconnue dans une équation, remplace-la dans l\'autre.'],['Combinaison','Multiplie les équations pour faire disparaître une inconnue, puis additionne ou soustrais.'],['Vérification','Remplace dans les deux équations.']])
    +T('Problèmes',[['Méthode','1. Choisir l\'inconnue avec son unité. 2. Traduire l\'énoncé en équation. 3. Résoudre. 4. Vérifier que la solution convient (positive, entière…). 5. Répondre par une phrase.']]);
  else if(d==='fs') h+=T('Sens des mots',[['Signifiant / signifié','Forme du mot (sons, lettres) / son sens'],['Monosémique / polysémique','Un seul sens / au moins deux sens (le contexte choisit)'],['Sens propre / figuré','Sens premier, concret / sens dérivé, imagé (concret → abstrait, analogie)'],['Sens ancien / moderne','Un même mot dont le sens a changé avec le temps']])
    +T('Valeur et connotation',[['Péjoratif / mélioratif','Le mot dévalorise / le mot valorise (neutre : aucun jugement)'],['Euphémisme','Mot qui atténue une réalité jugée choquante'],['Dénotation','Sens premier, littéral, objectif (celui du dictionnaire)'],['Connotation','Sens implicite, subjectif : sensations, idées, images associées au mot'],['Symbole','Sens dénoté + au moins un sens connoté commun à un groupe humain'],['Sources de connotation','Nature psychologique individuelle · environnement social · histoire personnelle · interrelations des mots et phrases d\'un texte']])
    +T('Champs',[['Champ sémantique','Ensemble des sens d\'un mot (somme de ses emplois)'],['Champ lexical','Ensemble des mots qui renvoient à une même réalité, idée, notion (thème dominant)'],['Motif','Écho de sens créé par un champ lexical qui revient dans un texte long'],['À l\'analyse','Ne pas seulement énumérer : interpréter selon le contexte']]);
  else if(d==='ff') h+=T('Figures de style',FR_FIGS.map(f=>['<b>'+f[0]+'</b> <small>('+f[1]+')</small>',f[2]]));
  else if(d==='fr') h+=T('Registres de langue',[['Familier','Langue de l\'oral : mots comme bouffer, mater, tabasser, se les geler ; ciné, télé, docu, frigo, clopes ; négation sans « ne », sujet répété'],['Courant','Langue neutre : manger, regarder quelqu\'un, battre quelqu\'un, avoir très froid'],['Soutenu','Langue recherchée : déguster, toiser, châtier, être transi ; subjonctif imparfait, inversions, vocabulaire poétique']])
    +T('Trios courant / familier / soutenu',[['avoir très froid','se les geler (fam.) · être transi (soutenu)'],['regarder quelqu\'un','mater (fam.) · toiser (soutenu)'],['battre quelqu\'un','tabasser (fam.) · châtier (soutenu)'],['manger','bouffer (fam.)']]);
  else if(d==='apa') h+=T('Past simple',[['Affirmatif','verbe régulier + -ed : '+E('I played')+', '+E('she studied')+', '+E('we stopped')+' ; irréguliers : '+E('went, saw, bought')],['Négatif',E('I didn\'t go')+' ; '+E('She didn\'t like it')+' (did + verbe à la base)'],['Question',E('Did you see him?')+' (Did + sujet + base)'],['be',E('I / he was')+' ; '+E('you / we / they were')+' ; '+E('wasn\'t, weren\'t')],['Emploi','Fait terminé à un moment défini ; suite d\'actions passées'],['Repères','yesterday, last week, two days ago, in 2019']])
    +T('Past continuous',[['Affirmatif','was / were + verbe-ing : '+E('I was reading')+', '+E('they were playing')],['Négatif',E('He wasn\'t sleeping')+' ; '+E('We weren\'t working')],['Question',E('Was she working?')+' ; '+E('Were you listening?')],['Emploi','Action en cours à un moment précis du passé ; décor ; action longue interrompue'],['Repères','at 8 pm last night, at this time yesterday, while, when']])
    +T('Orthographe',[['-ed','-e : +d (like → liked) ; consonne + y → -ied (study → studied) ; consonne doublée (stop → stopped)'],['-ing','e muet supprimé (make → making) ; consonne doublée (run → running) ; ie → ying (lie → lying)']])
    +T('Simple ou continuous ?',[['Action longue + brève',E('I was walking home when it started to rain.')+' (longue : continuous ; brève : simple)'],['while / when',E('While I was cooking…')+' ; '+E('…when the phone rang')],['Suite d\'actions terminées','past simple : '+E('He got up, had breakfast and left.')]]);
  else if(d==='ang') h+=T('Present simple',[['Affirmatif',E('I work')+', '+E('he works')+' (3e personne : -s / -es / -ies ; have → has)'],['Négatif',E('I don\'t work')+' ; '+E('she doesn\'t work')+' (verbe à la base)'],['Question',E('Do you work?')+' ; '+E('Does he work?')+' (verbe à la base)'],['Emploi','Habitudes, vérités générales, horaires, états (know, like, want)'],['Repères','always, usually, often, sometimes, never, every day, on Sundays']])
    +T('Present continuous',[['Affirmatif','am / is / are + verbe-ing : '+E('I am working')+', '+E('she is working')+', '+E('they are working')],['Négatif',E('He isn\'t working')+' ; '+E('We aren\'t working')],['Question',E('Is he working?')+' ; '+E('Are you working?')],['Emploi','Action en cours maintenant ou autour de maintenant'],['Repères','now, right now, at the moment, Look!, Listen!']])
    +T('Orthographe',[['3e personne','-s ; -es après s, sh, ch, x, z, o ; consonne + y → -ies ; have → has'],['Forme en -ing','e muet supprimé (make → making) ; consonne doublée (run → running) ; ie → ying (lie → lying)']])
    +T('Simple ou continuous ?',[['Verbes d\'état','know, like, love, want, need, understand : pas de forme en -ing (même avec now)'],['have','have = posséder : simple ; have lunch / a shower : action, continuous possible']]);
  else if(d==='ph'||d==='phd'||d==='phg') h+=phFormulas(T,d);
  else h+=T('Aires et périmètres',[['Rectangle / carré',M('A = L × l')+' ; '+M('P = 2(L + l)')],['Triangle',M('A = b × h / 2')],['Triangle équilatéral de côté a',M('h = a√3 / 2')+' ; '+M('A = a²√3 / 4')],['Parallélogramme / losange',M('A = b × h')+' ; '+M('A = D × d / 2')],['Trapèze',M('A = (B + b) × h / 2')],['Héron',M('p = (a + b + c)/2')+' ; '+M('A = √(p(p - a)(p - b)(p - c))')]])
    +T('Théorèmes',[['Pythagore',M('a² + b² = c²')+' (c = hypoténuse) ; réciproque : si l\'égalité est vraie, le triangle est rectangle'],['Thalès',M('AM/AB = AN/AC = MN/BC')+' avec (MN) // (BC)'],['Papillon',M('OA/OB = OC/OD = AC/BD')+' avec (AC) // (BD)'],['Euclide','Triangle AED rectangle en E, hauteur [EB] : '+M('AE² = AB × AD')+' ; '+M('EB² = AB × BD')]])
    +T('Cercle et disque',[['Disque',M('A = πr²')+' ; '+M('P = 2πr')],['Secteur d\'angle α',M('A = α/360 × πr²')+' ; '+M('arc = α/360 × 2πr')],['Anneau',M('A = π(R² - r²)')],['Segment circulaire',M('secteur − triangle')+' (rayons + corde)'],['Angle inscrit',M('∠ au centre = 2 × ∠ inscrit')],['Demi-cercle','Triangle inscrit dans un demi-cercle : rectangle'],['Tangente-corde','Angle tangente-corde = angle inscrit sur le même arc'],['Quadrilatère inscrit','Angles opposés supplémentaires (somme 180°)']])
    +T('Angles et unités',[['Un tour',M('360° = 400 grades = 2π rad')],['Conversions',M('a° = a × π/180 rad')+' ; '+M('1 grade = 0,9°')],['Triangle','Somme 180° ; isocèle : angles à la base égaux ; angle extérieur = somme des deux non adjacents'],['Parallèles','Correspondants et alternes-internes égaux ; angles sur une droite : somme 180°']])
    +T('Résultats à connaître',[['Intersection de 3 cercles de rayon r',M('A = (π - √3) r² / 2')],['Cercles tangents en quinconce','Écart entre rangées : '+M('y√3')],['Triplets',M('n ; n + k ; √(2kn + k²)')],['Réunion de disques','Somme des disques − parties communes ; lentille = 2 × (quart de disque − triangle)'],['Zones grises','Système : somme des zones = aire de la figure ; secteur = combinaison de zones'],['Cercles tangents dans un angle','Centres sur la bissectrice ; rayons de contact parallèles : Thalès']]);
  return h+(DOMBR[d]?'':'<p class="note noprint">Astuce : écris toujours l\'unité (cm, cm²) et garde les valeurs exactes (π, √) sauf si l\'énoncé demande un arrondi.</p>')+'</div>';
}
function renderFormulas(){ $('view-formulas').innerHTML=formulasHTML(S.domain); }
