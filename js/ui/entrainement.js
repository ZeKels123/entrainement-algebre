'use strict';
/* ===== Interface : entraînement ===== */
const $=id=>document.getElementById(id);
let TOTAL=10;
const KIND_LABEL={expand:'Développer',factor:'Factoriser',solve:'Résoudre',problem:'Problèmes',quad:'Second degré',system:'Systèmes',gtri:'Triangles',gquad:'Quadrilatères',gpyth:'Pythagore',gthal:'Thalès',gcirc:'Cercles',gcomp:'Figures composées',gang:'Angles',gsol:'Solides et volumes',gtrig:'Trigonométrie',frrg:'Reconnaître le registre',frre:'Trouver l\'équivalent',frfa:'Analyser un exemple',fsnt:'Notions du cours',fsms:'Sens des mots',fsvc:'Valeur et connotation',fscl:'Champs lexicaux',frfg:'Reconnaître la figure',enps:'Present simple',enpc:'Present continuous',epps:'Past simple',eppc:'Past continuous',epmx:'Simple ou continuous'};
const HINT_ALG='Écris une étape par ligne, ou sépare-les par =. La dernière ligne est ta réponse finale. Chaque ligne est vérifiée, ce qui permet de repérer l\'étape fautive.';
const HINT_PB='Première ligne : l\'équation qui traduit l\'énoncé. Ensuite une ligne par étape de résolution. Termine par la solution, par exemple x = 7 ; si l\'équation a deux solutions, garde celle qui convient au problème.';
const HINT_EQ='Écris une équation par ligne : chaque ligne doit avoir les mêmes solutions que la précédente. Termine par la solution, par exemple x = 2 (pour deux solutions : x = 2 ou x = -3 ; sinon « aucune solution » ou « tous les réels »). Fractions autorisées dans la solution : x = 3/2.';
const RES_LABEL={clean:'Sans aide',helped:'Avec aide',shown:'Solution vue'};
const S={mode:'mix',level:1,ex:null,n:0,results:[],log:[],status:'idle',tries:0,hints:0,recent:[],seriesErrs:{},pool:null,stepCount:1,domain:'alg',view:'train',combo:0,gxp:0,boss:null,bossNext:false};
const DKINDS={alg:['expand','factor'],eq:['solve','system','quad','problem'],geo:['gtri','gquad','gpyth','gthal','gcirc','gcomp','gang','gsol','gtrig'],ang:['enps','enpc'],apa:['epps','eppc','epmx'],fr:['frrg','frre'],ff:['frfg','frfa'],fs:['fsnt','fsms','fsvc','fscl']};
const MODES={alg:[['expand','Développer'],['factor','Factoriser'],['mix','Mélange'],['copy','Corrige la copie'],['srs','À revoir'],['review','Chasse aux erreurs']],eq:[['solve','1 inconnue'],['system','2 et 3 inconnues'],['quad','Second degré'],['problem','Problèmes'],['mix','Mélange'],['copy','Corrige la copie'],['srs','À revoir'],['review','Chasse aux erreurs']],geo:[['gtri','Triangles'],['gquad','Quadrilatères'],['gpyth','Pythagore'],['gthal','Thalès'],['gcirc','Cercles'],['gcomp','Figures composées'],['gang','Angles et unités'],['gsol','Solides et volumes'],['gtrig','Trigonométrie'],['mix','Mélange'],['copy','Corrige la copie'],['srs','À revoir'],['review','Chasse aux erreurs']],ang:[['enps','Present simple'],['enpc','Present continuous'],['mix','Mélange'],['srs','À revoir'],['review','Chasse aux erreurs']],apa:[['epps','Past simple'],['eppc','Past continuous'],['epmx','Simple ou continuous'],['mix','Mélange'],['srs','À revoir'],['review','Chasse aux erreurs']],fr:[['frrg','Reconnaître le registre'],['frre','Équivalents'],['mix','Mélange'],['srs','À revoir'],['review','Chasse aux erreurs']],ff:[['frfg','Reconnaître la figure'],['frfa','Analyser un exemple'],['mix','Mélange'],['srs','À revoir'],['review','Chasse aux erreurs']],fs:[['fsnt','Notions du cours'],['fsms','Sens des mots'],['fsvc','Valeur et connotation'],['fscl','Champs lexicaux'],['mix','Mélange'],['srs','À revoir'],['review','Chasse aux erreurs']]};
const DOM_TITLE={alg:'Développer <span class="amp">&amp;</span> Factoriser',eq:'Équations',geo:'Géométrie',ang:'Present simple / continuous',apa:'Past simple / continuous',fr:'Registres de langue',ff:'Figures de style',fs:'Sémantique'};
const DOM_KICK={alg:'Algèbre · calcul littéral',eq:'Algèbre · équations, systèmes, problèmes',geo:'Géométrie plane · figures, aires et théorèmes',ang:'Anglais · present simple et present continuous',apa:'Anglais · past simple et past continuous',fr:'Français · familier, courant, soutenu',ff:'Français · reconnaître et analyser les figures',fs:'Français · analyse de texte : sémantique'};
const DOMSTORE={alg:{mode:'mix',level:1},eq:{mode:'solve',level:1},geo:{mode:'gtri',level:1},ang:{mode:'mix',level:1},apa:{mode:'mix',level:1},fr:{mode:'mix',level:1},ff:{mode:'mix',level:1},fs:{mode:'mix',level:1}};
function maxLevel(){
  if(S.mode==='review'||S.mode==='srs') return 0;
  if(S.mode==='copy') return copyMaxLevel();
  const ks=S.mode==='mix'?DKINDS[S.domain]:[S.mode];
  return Math.max.apply(null,Object.keys(TOPICS).map(id=>TOPICS[id]).filter(T=>ks.includes(T.kind)).map(T=>T.level));
}

function setTab(t){
  if(running()&&t!=='train'&&t!=='exam'){ toast('Examen en cours : rends la copie ou abandonne-le avant de changer d\'onglet.'); return; }
  if(running()&&t==='exam') t='train';
  if(t==='shop'||t==='lb'){ setBranch(t); return; }
  const st=t==='stats'||t==='shop'||t==='lb';
  ['train','course','formulas','exam','stats','shop','lb'].forEach(k=>{ $('view-'+k).hidden=(k!==t); });
  ['train','course','formulas','exam'].forEach(k=>{ const on=k===t||(k==='exam'&&running()); $('tab-'+k).setAttribute('aria-selected',String(on)); $('tab-'+k).tabIndex=on?0:-1; });
  ['alg','eq','geo','ang','apa','ph','fr','ff','fs'].forEach(d=>{ const on=!st&&d===S.domain; $('tab-'+d).setAttribute('aria-selected',String(on)); $('tab-'+d).tabIndex=on?0:-1; });
  ['stats','shop','lb'].forEach(k=>{ const on=t===k; $('tab-'+k).setAttribute('aria-selected',String(on)); $('tab-'+k).tabIndex=on?0:-1; });
  $('subnav').hidden=st;
  if(!st) S.view=t;
  if(t==='stats') renderStats();
  if(t==='shop') renderShop();
  if(t==='lb') renderLb();
  if(t==='exam') renderExamView();
  if(t==='formulas') renderFormulas();
}
function setDomain(d,view){
  if(running()&&d!==S.domain){ toast('Examen en cours : rends la copie ou abandonne-le avant de changer d\'onglet.'); return; }
  if(d!==S.domain){
    DOMSTORE[S.domain]={mode:S.mode,level:S.level};
    S.domain=d; S.mode=DOMSTORE[d].mode; S.level=DOMSTORE[d].level; S.pool=null;
    $('view-course').innerHTML=courseHTML(d);
    $('brand-title').innerHTML=DOM_TITLE[d]; $('brand-kicker').textContent=DOM_KICK[d];
    renderSetup(); newSeries();
  }
  setTab(view||S.view||'train');
}

function renderSetup(){ renderSetup0(); gameBossZone(); }
function renderSetup0(){
  $('seg-mode').innerHTML=MODES[S.domain].map(m=>'<button type="button" data-v="'+m[0]+'" aria-pressed="'+(m[0]===S.mode)+'">'+m[1]+(m[0]==='srs'&&srsDueIds(S.domain).length?' ('+srsDueIds(S.domain).length+')':'')+'</button>').join('');
  const mx=maxLevel(); if(mx&&S.level>mx) S.level=mx;
  $('seg-level').innerHTML=[0].concat(Array.from({length:mx},(_,i)=>i+1)).map(n=>'<button type="button" data-v="'+n+'" aria-pressed="'+(n===S.level)+'"'+((S.mode==='review'||S.mode==='srs'||!!S.pool)?' disabled':'')+'>'+(n?n:'Tous')+'</button>').join('');
  const canTopic=!(S.pool||S.mode==='srs'||S.mode==='review'||S.mode==='copy');
  const tids=canTopic?Object.keys(TOPICS).filter(id=>(S.mode==='mix'?DKINDS[S.domain].includes(TOPICS[id].kind):TOPICS[id].kind===S.mode)&&(!S.level||TOPICS[id].level===S.level)):[];
  if(S.only&&!tids.includes(S.only)) S.only='';
  $('field-topic').hidden=!(canTopic&&tids.length>1);
  $('sel-topic').innerHTML='<option value="">Tous les exercices ('+tids.length+')</option>'+tids.map(id=>'<option value="'+id+'"'+(id===S.only?' selected':'')+'>'+esc(TOPICS[id].label)+(S.mode==='mix'?' ('+KIND_LABEL[TOPICS[id].kind].toLowerCase()+')':'')+(S.level?'':' · niv. '+TOPICS[id].level)+'</option>').join('');
  if(S.pool){ const u=[...new Set(S.pool)]; $('topics-line').innerHTML='Série ciblée sur tes points faibles : '+u.map(id=>'<b>'+esc(TOPICS[id].label)+'</b> ('+KIND_LABEL[TOPICS[id].kind].toLowerCase()+', niv. '+TOPICS[id].level+')').join(', ')+'.'; return; }
  if(S.mode==='srs'){ const n=srsDueIds(S.domain); $('topics-line').innerHTML=n.length?'<b>À revoir</b> (+50 % d\'XP) : '+n.slice(0,6).map(id=>'<b>'+esc(TOPICS[id].label)+'</b>').join(', ')+(n.length>6?' et '+(n.length-6)+' autres':'')+'. Ces thèmes reviennent selon un calendrier (1, 3, 7, 14, 30 jours).':'<b>À revoir</b> : aucun thème n\'est à revoir aujourd\'hui. La série reprend la chasse aux erreurs.'; return; }
  if(S.mode==='copy'){ $('topics-line').innerHTML=copyTopicsLine(); return; }
  if(S.mode==='review'){ $('topics-line').innerHTML='<b>Chasse aux erreurs</b> (+50 % d\'XP) : tous les thèmes de cet onglet, avec une fréquence plus élevée pour ceux où tu as eu besoin d\'aide ou vu la solution. Tant qu\'il n\'y a pas de résultats, les thèmes sont tirés à égalité.'; return; }
  if(S.only){ $('topics-line').innerHTML='Exercice travaillé : <b>'+esc(TOPICS[S.only].label)+'</b> (niv. '+TOPICS[S.only].level+').'; return; }
  const ids=tids;
  $('topics-line').innerHTML='Exercices travaillés : '+ids.map(id=>'<b>'+esc(TOPICS[id].label)+'</b>'+(S.mode==='mix'?' ('+KIND_LABEL[TOPICS[id].kind].toLowerCase()+')':'')+(S.level?'':' · niv. '+TOPICS[id].level)).join(', ')+'.';
}

function newSeries(){
  if(S.bossNext) S.bossNext=false; else { S.boss=null; TOTAL=10; }
  S.n=0; S.results=[]; S.log=[]; S.seriesErrs={}; S.combo=0; S.gxp=0; S.lvs=[]; gameBossZone();
  $('summary').hidden=true; $('sheet').hidden=false;
  nextExercise(true);
}
function nextExercise(quiet){
  S.ex=S.mode==='copy'?copyExercise(S.pool):newExercise((S.mode==='review'||S.mode==='srs')?'mix':S.mode,S.level,S.recent,S.pool||(S.only&&!S.boss?[S.only]:(S.mode==='review'?reviewPool():S.mode==='srs'?(srsPool()||reviewPool()):null)),S.domain);
  S.recent.push(S.ex.statement); if(S.recent.length>14) S.recent.shift();
  S.status='open'; S.tries=0; S.hints=0; S.stepCount=1;
  S.gold=!S.boss&&!running()&&(G.compass>0||Math.random()<GOLD_RATE+pv('luck')); if(S.gold&&G.compass>0) G.compass--; S.bet=0; S.betDone=false; S.stepUsed=false;
  renderExercise(quiet);
}

function renderExercise(quiet){
  const ex=S.ex, t=TOPICS[ex.topic];
  $('cartouche').innerHTML='<div><span class="lbl">N°</span><b>'+String(S.n+1).padStart(2,'0')+' / '+TOTAL+'</b></div>'
    +'<div><span class="lbl">Niveau</span><b>'+ex.level+'</b></div>'
    +'<div><span class="lbl">Type</span><b>'+KIND_LABEL[t.kind]+'</b></div>'
    +'<div><span class="lbl">Exercice</span><b>'+esc(t.label)+'</b></div>';
  $('instr').textContent=ex.kind==='expand'?'Développe et réduis':(ex.instr?ex.instr:ex.word?'Pose l\'équation, puis résous-la':ex.sys?'Résous le système':ex.kind==='solve'?'Résous l\'équation d\'inconnue '+ex.v:'Factorise complètement');
  $('hintline').textContent=ex.hintline?ex.hintline:ex.word?HINT_PB:(ex.kind==='solve'?HINT_EQ:HINT_ALG);
  $('answer').placeholder=ex.txt?(ex.placeholder||'ta réponse'):ex.geo?'réponse = ...':(ex.kind==='expand'||ex.kind==='factor')?'= ...':'x = ...';
  $('btn-check').textContent='Vérifier'; $('btn-step').hidden=!!ex.txt;
  const cx=$('context'); if(ex.context){ cx.innerHTML=ex.context; cx.hidden=false; } else { cx.innerHTML=''; cx.hidden=true; }
  $('statement').innerHTML=((ex.word||ex.sys||ex.geo)&&ex.html?ex.html:M(ex.statement))+(ex.kind==='geo'&&!running()?geoVisual(ex.topic,false):''); $('statement').classList.toggle('word',!!ex.word||!!ex.geo); $('statement').classList.toggle('sys',!!ex.sys&&!ex.word);
  buildKeys();
  const inp=$('answer'); inp.value=''; inp.disabled=false;
  ['hint','feedback','solution','study-out'].forEach(id=>{ const e=$(id); e.hidden=true; e.innerHTML=''; });
  $('feedback').className='fb';
  $('btn-check').hidden=false; $('btn-hint').hidden=false; $('btn-hint').disabled=false;
  $('btn-solution').hidden=false; $('btn-solution').textContent='Voir la solution'; $('btn-next').hidden=true;
  updatePreview(); renderProgress(); gameRender(); funRender(); attachDraw(); renderStudy();
  if(!quiet&&!S.ex.copy) inp.focus({preventScroll:true});
}

function renderProgress(){
  const cells=[]; for(let i=0;i<TOTAL;i++){ const r=S.results[i]; cells.push('<span class="'+(r||(i===S.n?'cur':''))+'"></span>'); }
  const done=S.results.length;
  $('progress').innerHTML='<div class="cells" aria-hidden="true">'+cells.join('')+'</div><span class="txt">'+(S.boss?'Boss · ':'Série · ')+Math.min(S.n+1,TOTAL)+' / '+TOTAL+'</span>'+(S.combo>=2?'<span class="txt combo">Combo ×'+S.combo+'</span>':'')+'<span class="txt score">Score '+fr(scoreOf(S.results))+' / '+done+'</span>';
}

/* ---------- Saisie ---------- */
function buildKeys(){
  const box=$('keys'); box.innerHTML='';
  const add=(html,label,fn,cls)=>{ const b=document.createElement('button'); b.type='button'; b.className='key'+(cls?' '+cls:''); b.innerHTML=html; b.setAttribute('aria-label',label); b.addEventListener('click',fn); box.appendChild(b); };
  if(S.ex.txt&&S.ex.choices&&!S.ex.keys){ S.ex.choices.forEach(c=>add(c,c,()=>{ const el=$('answer'); if(el.disabled) return; el.value=c; el.focus(); updatePreview(); },'wide')); add('⌫','Effacer le dernier caractère',backspace); return; }
  if(S.ex.txt&&S.ex.keys){ S.ex.keys.forEach(k=>add(k,'Caractère '+k,()=>ins(k))); add('⌫','Effacer le dernier caractère',backspace); add('Tout effacer','Effacer toute la saisie',()=>{ const el=$('answer'); if(el.disabled) return; el.value=''; el.focus(); updatePreview(); },'wide'); return; }
  if(S.ex.txt){
    [["'",'Apostrophe',"'"],["n't",'n apostrophe t',"n't"],["'s",'apostrophe s',"'s"],["'m",'apostrophe m',"'m"],["'re",'apostrophe re',"'re"],['-ing','terminaison ing','ing'],['?','Point d\'interrogation','?']].forEach(k=>add(k[0],k[1],()=>ins(k[2])));
    add('⌫','Effacer le dernier caractère',backspace);
    add('Tout effacer','Effacer toute la saisie',()=>{ const el=$('answer'); if(el.disabled) return; el.value=''; el.focus(); updatePreview(); },'wide');
    return;
  }
  S.ex.vars.forEach(v=>add('<i>'+v+'</i>','Lettre '+v,()=>ins(v)));
  if(S.ex.geo){ add('²','Au carré',()=>ins('²')); add('√','Racine carrée',()=>ins('√')); add('π','Pi',()=>ins('π')); }
  else if(!S.ex.sys){ add('²','Au carré',()=>ins('²')); add('^','Exposant (accent circonflexe)',()=>ins('^')); }
  add('(','Parenthèse ouvrante',()=>ins('(')); add(')','Parenthèse fermante',()=>ins(')'));
  add('+','Plus',()=>ins('+')); add('−','Moins',()=>ins('-')); add('×','Fois',()=>ins('*'));
  if(S.ex.geo){ add('=','Signe égal',()=>ins(' = ')); add('≈','Environ égal (valeur arrondie)',()=>ins(' ≈ ')); add('/','Barre de division',()=>ins(' / ')); if(S.ex.geo.mode==='choice'){ add('oui','Réponse oui',()=>ins('oui'),'wide'); add('non','Réponse non',()=>ins('non'),'wide'); } }
  else if(S.ex.sys){ add('=','Signe égal',()=>ins(' = ')); add(';','Séparateur entre deux valeurs',()=>ins(' ; ')); add('/','Barre de fraction (pour une solution fractionnaire)',()=>ins('/')); }
  else if(S.ex.kind==='solve'){ add('=','Signe égal',()=>ins(' = ')); add('ou','Ou (plusieurs solutions)',()=>ins(' ou ')); add('/','Barre de fraction (pour une solution fractionnaire)',()=>ins('/')); add('√','Racine carrée',()=>ins('√')); if(S.ex.quad) add('Δ','Discriminant',()=>ins('Δ = ')); if(S.ex.viete||S.ex.build){ add('S','Somme des solutions',()=>ins('S = ')); add('P','Produit des solutions',()=>ins('P = ')); } if(S.ex.viete) add(';','Séparateur',()=>ins(' ; ')); }
  add('↵ Étape','Nouvelle ligne pour une étape intermédiaire',()=>ins('\n'),'wide');
  add('⌫','Effacer le dernier caractère',backspace);
  add('Tout effacer','Effacer toute la saisie',()=>{ const el=$('answer'); if(el.disabled) return; el.value=''; el.focus(); updatePreview(); },'wide');
}
function ins(txt){
  const el=$('answer'); if(el.disabled) return;
  const s=el.selectionStart==null?el.value.length:el.selectionStart, e=el.selectionEnd==null?s:el.selectionEnd;
  el.value=el.value.slice(0,s)+txt+el.value.slice(e);
  const p=s+txt.length; el.focus(); el.setSelectionRange(p,p); updatePreview();
}
function backspace(){
  const el=$('answer'); if(el.disabled) return;
  let s=el.selectionStart==null?el.value.length:el.selectionStart; const e=el.selectionEnd==null?s:el.selectionEnd;
  if(s===e){ if(s===0) return; s--; }
  el.value=el.value.slice(0,s)+el.value.slice(e); el.focus(); el.setSelectionRange(s,s); updatePreview();
}
function autoGrow(){ const el=$('answer'); el.style.height='auto'; el.style.height=Math.min(el.scrollHeight+2,220)+'px'; }
function updatePreview(){
  const v=$('answer').value, pv=$('preview'); autoGrow();
  const solve=S.ex&&S.ex.kind==='solve', sysx=solve&&S.ex.sys, geo=S.ex&&S.ex.kind==='geo', txt=S.ex&&S.ex.kind==='txt';
  const lines=(solve||geo||txt)?v.split('\n').map(s=>s.trim()).filter(Boolean):splitSteps(v);
  if(!lines.length){ pv.innerHTML='<span class="muted">L\'aperçu de tes lignes apparaît ici, écrites comme sur une feuille.</span>'; return; }
  pv.innerHTML=lines.map((l,i)=>{
    const lab='<span class="lbl">'+(lines.length===1?'Lu comme':'Ligne '+(i+1))+'</span>';
    try{ return '<div class="pl">'+lab+(txt?'<span>'+esc(l)+'</span>':geo?previewGeo(l):solve?(sysx?previewSys(l,S.ex):(S.ex.viete||S.ex.build)?M(l.replace(/\s+/g,' ')):parseLine(l,S.ex.v,S.ex).html):M(astStr(parsePoly(l).ast)))+'</div>'; }
    catch(e){ if(!(e instanceof ParseError)) throw e; return '<div class="pl">'+lab+'<span class="muted bad">'+esc(e.message)+'</span></div>'; }
  }).join('');
}

/* ---------- Réponses et retours ---------- */
function showFb(cls,title,html){
  const f=$('feedback'); f.className='fb '+cls;
  f.innerHTML='<h2><span aria-hidden="true">'+({ok:'✓',ko:'✗',mid:'!'}[cls])+'</span> '+esc(title)+'</h2>'+html;
  f.hidden=false;
}
function onCheck(){
  if(running()) return examSave();
  if(S.status==='solved'||S.status==='shown'){ onNext(); return; }
  if(S.ex&&S.ex.copy) return;
  const v=$('answer').value;
  if(!v.trim()){ showFb('mid','Zone de saisie vide','<p>Écris ta réponse, puis clique sur Vérifier.</p>'); return; }
  const r=checkWork(S.ex,v);
  if(r.status==='ok'){ betSettle(S.tries===0&&S.hints===0); S.stepCount=r.steps||1; resolve(S.tries===0&&S.hints===0?'clean':'helped'); return; }
  if(r.status==='syntax'){ showFb('mid',r.title,r.html); return; }
  betSettle(false);
  S.tries++; gameWrong();
  if(r.tag){ stats.errors[r.tag]=(stats.errors[r.tag]||0)+1; noteErr(r.tag,S.ex.topic); S.seriesErrs[r.tag]=(S.seriesErrs[r.tag]||0)+1; saveStats(); }
  const retain=r.tag&&TAGS[r.tag]?'<p class="retain"><b>À retenir</b> · '+esc(TAGS[r.tag].tip)+'</p>':'';
  showFb(r.status==='wrong'?'ko':'mid',r.title,r.html+retain+'<p class="tip" style="margin-top:8px">Corrige ta réponse puis vérifie de nouveau. Un indice ou la solution sont disponibles.</p>');
}
function resolve(kind){
  if(kind==='shown') betSettle(false);
  S.status=kind==='shown'?'shown':'solved';
  S.results[S.n]=kind; S.log[S.n]={html:(S.ex.word||S.ex.geo)?esc(S.ex.statement.length>80?S.ex.statement.slice(0,80)+'…':S.ex.statement):M(S.ex.statement),statement:S.ex.statement,kind,topic:S.ex.topic,kindEx:S.ex.kind};
  const st=stats.topics[S.ex.topic]||(stats.topics[S.ex.topic]={n:0,clean:0,helped:0,shown:0}); st.n++; st[kind]++; saveStats();
  $('answer').disabled=true; $('btn-check').hidden=true; $('btn-hint').hidden=true; $('btn-step').hidden=true; renderStudy();
  $('btn-solution').textContent='Voir la méthode'; $('btn-next').hidden=false;
  $('btn-next').textContent=S.n+1>=TOTAL?'Voir le bilan de la série':'Exercice suivant';
  if(kind==='shown'){
    showSolution(true);
    showFb('ko','Solution affichée','<p>Cet exercice compte comme non réussi. Relis la méthode et repère l\'étape où tu bloquais.</p>');
  } else {
    const sc=S.stepCount>1?' ('+S.stepCount+' étapes vérifiées)':'';
    const msg=kind==='clean'?'Juste, du premier coup et sans indice'+sc+'.':'Juste'+(S.tries?', après '+S.tries+' réponse'+(S.tries>1?'s':'')+' à corriger':'')+(S.hints?(S.tries?' et ':', après ')+S.hints+' indice'+(S.hints>1?'s':''):'')+sc+'. Relis la méthode pour repérer ce qui a bloqué.';
    showFb('ok','Juste',('<p>'+msg+'</p>')+(S.ex.kind==='factor'?'<p class="tip">Réponse de référence : '+M(S.ex.expectedStr)+'. Toute écriture équivalente et complète est acceptée.</p>':''));
    if(kind==='helped') showSolution(true);
  }
  gameResolve(kind);
  if(S.ex.copy) copyAfterResolve(kind);
  renderBet();
  renderProgress(); $('btn-next').focus({preventScroll:true});
}
function solutionHTML(ex){
  return '<div class="sol-final"><span class="lbl">'+(ex.kind==='expand'?'Résultat développé':(ex.geo?'Réponse':ex.word||ex.sys?'Solution':ex.kind==='solve'?'Ensemble des solutions':'Forme factorisée'))+'</span>'+(ex.kind==='solve'||ex.kind==='geo'||ex.kind==='txt'?ex.expectedHtml:M(ex.expectedStr))+'</div>'
    +'<ol class="steps">'+ex.steps.map(s=>'<li><strong>'+s.t+'</strong>'+s.l.map(l=>'<div class="line">'+l+'</div>').join('')+'</li>').join('')+'</ol>'
    +(ex.kind==='geo'?geoVisual(ex.topic,true):'')
    +(ex.kind==='factor'?'<p class="note">Plusieurs écritures sont acceptées (ordre des facteurs, signes répartis autrement) tant que la factorisation est complète.</p>':'');
}
function showSolution(force){
  const el=$('solution');
  if(!force && !el.hidden){ el.hidden=true; return; }
  el.innerHTML=solutionHTML(S.ex); el.hidden=false;
}
function onSolution(){
  if(running()) return;
  if(S.status==='open'){ resolve('shown'); return; }
  showSolution(false);
}
function onHint(){
  if(running()) return;
  if(S.status!=='open') return;
  const hs=S.ex.hints.concat(['<b>Plan de la solution</b>, sans les résultats :<ol class="check" style="margin-top:6px">'+S.ex.steps.map(s=>'<li>'+s.t+'</li>').join('')+'</ol>']), el=$('hint');
  if(S.hints<hs.length) S.hints++;
  betCancel('indice demandé');
  el.innerHTML=hs.slice(0,S.hints).map((h,i)=>'<span class="lbl">Indice '+(i+1)+' sur '+hs.length+'</span><p>'+h+'</p>').join('<div style="height:8px"></div>')
    +(S.hints>=hs.length?'<p class="note">Plus d\'indice disponible. Tu peux encore voir la solution.</p>':'');
  el.hidden=false; if(S.hints>=hs.length) $('btn-hint').disabled=true;
}
function onNext(){
  if(running()) return examNext();
  if(S.status==='open') return;
  if(S.n+1>=TOTAL){ finishSeries(); return; }
  S.n++; nextExercise();
}

/* ---------- Bilan de série ---------- */
function finishSeries(){
  stats.series=(stats.series||0)+1; saveStats();
  const sc=scoreOf(S.results), cnt={clean:0,helped:0,shown:0}; S.results.forEach(k=>{ cnt[k]++; });
  const errs=Object.entries(S.seriesErrs).sort((a,b)=>b[1]-a[1]).slice(0,4);
  let advice;
  if(sc>=8) advice=S.level&&S.level<maxLevel()?'Score suffisant pour passer au niveau '+(S.level+1)+'.':(S.level&&S.level===maxLevel()?'Tu peux passer à des séries « Mélange » pour alterner les types d\'exercices.':'Score suffisant pour cibler un niveau plus élevé.');
  else if(sc>=5) advice='Reste sur ce niveau : refais une série en relisant les fiches des thèmes où tu as eu besoin d\'aide.';
  else advice='Relis d\'abord l\'onglet Cours pour les thèmes concernés, puis refais une série au même niveau ou un niveau en dessous.';
  const gh=gameSeries(sc,cnt);
  const canUp=!S.boss&&sc>=8&&S.level&&S.level<maxLevel()&&S.mode!=='review'&&S.mode!=='srs'&&!S.pool;
  const weak=[...new Set(S.log.filter(l=>l.kind!=='clean').map(l=>l.topic))];
  $('sheet').hidden=true;
  const sm=$('summary');
  sm.innerHTML='<h2>Bilan de la série</h2>'
    +'<div class="sumrow"><div><span class="lbl">Score</span><div class="big">'+fr(sc)+' / '+TOTAL+'</div></div>'
    +'<div class="legend"><span><i style="background:var(--ok)"></i>Sans aide : '+cnt.clean+'</span><span><i style="background:var(--warn)"></i>Avec aide : '+cnt.helped+'</span><span><i style="background:var(--bad)"></i>Solution vue : '+cnt.shown+'</span></div></div>'
    +gh+'<p>'+advice+'</p>'
    +(errs.length?'<h3 style="margin-top:16px;font-size:20px">Erreurs relevées pendant la série</h3><ul class="errs" style="margin-top:8px">'+errs.map(([t,n])=>'<li><span class="n">'+n+'</span><span><b>'+esc(TAGS[t].label)+'</b></span><span class="tip">'+esc(TAGS[t].tip)+'</span></li>').join('')+'</ul>':'<p class="note">Aucune erreur détectée par le correcteur pendant cette série.</p>')
    +'<h3 style="margin-top:16px;font-size:20px">Exercices de la série</h3><ul class="rec">'+S.log.map(l=>'<li><span class="tagk '+l.kind+'">'+RES_LABEL[l.kind]+'</span><span>'+(l.html||M(l.statement))+'</span></li>').join('')+'</ul>'
    +'<div class="actions" style="margin-top:16px"><button type="button" class="btn primary" data-act="again">Nouvelle série</button>'+(canUp?'<button type="button" class="btn" data-act="up">Niveau '+(S.level+1)+'</button>':'')+''+(weak.length?'<button type="button" class="btn" data-act="weak">Refaire mes points faibles</button>':'')+'<button type="button" class="btn" data-act="copy">Copier le bilan</button><button type="button" class="btn" data-act="course">Relire le cours</button></div><div id="copy-zone"></div>';
  sm.hidden=false; renderProgress();
  sm.scrollIntoView({block:'start'});
}

function reviewPool(){
  const pool=[];
  Object.keys(TOPICS).filter(id=>DKINDS[S.domain].includes(TOPICS[id].kind)).forEach(id=>{
    const s=stats.topics[id]; let w=1;
    if(s&&s.n) w=Math.max(1,Math.round(1+6*(s.helped+s.shown)/s.n));
    for(let i=0;i<w;i++) pool.push(id);
  });
  return pool;
}
function summaryText(){
  const sc=scoreOf(S.results);
  return 'Série d\'entraînement : '+fr(sc)+' / '+TOTAL+'\n'+S.log.map((l,i)=>(i+1)+'. '+l.statement+' : '+RES_LABEL[l.kind].toLowerCase()).join('\n');
}
function copySummary(){
  const zone=$('copy-zone'), text=summaryText();
  const fallback=()=>{ zone.innerHTML='<p class="note">La copie automatique est indisponible ici. Sélectionne le texte ci-dessous et copie-le.</p><textarea id="copy-area" readonly rows="8" style="width:100%;font:14px/1.4 var(--f-mono);background:var(--card-2);color:var(--ink);border:1px solid var(--line);border-radius:6px;padding:8px"></textarea>'; const a=$('copy-area'); a.value=text; a.focus(); a.select(); };
  try{ navigator.clipboard.writeText(text).then(()=>{ zone.innerHTML='<p class="note">Bilan copié dans le presse-papiers.</p>'; },fallback); }catch(e){ fallback(); }
}
