'use strict';
/* ===== Couche de jeu : XP, rangs, combo, boss, badges, boutique, records ===== */
const GSTORE='dev-fact-game-v1';
const RANKS=[[0,'Novice'],[50,'Novice II'],[75,'Novice III'],[100,'Élève'],[200,'Élève II'],[250,'Élève III'],[300,'Studieux'],[500,'Studieux II'],[600,'Studieux III'],[700,'Assidu'],[1000,'Assidu II'],[1200,'Assidu III'],[1400,'Confirmé'],[1900,'Confirmé II'],[2200,'Confirmé III'],[2500,'Érudit'],[3200,'Érudit II'],[3600,'Érudit III'],[4000,'Lauréat'],[5500,'Lauréat II'],[6500,'Lauréat III'],[7500,'Expert'],[10000,'Expert II'],[11750,'Expert III'],[13500,'Maître'],[18000,'Maître II'],[21000,'Maître III'],[24000,'Grand maître'],[32000,'Grand maître II'],[37000,'Grand maître III'],[42000,'Légende'],[55000,'Légende II'],[65000,'Légende III'],[75000,'Mythique'],[90000,'Mythique II'],[110000,'Mythique III']];
const RK=n=>RANKS.findIndex(x=>x[1]===n);
const DAILY_GOAL=15, BOSS_TOTAL=5, BOSS_WIN=4;
const xpBase=L=>Math.round(10*Math.pow(1.4,Math.max(1,L)-1));
const coinBase=L=>Math.ceil(Math.max(1,L)/2);
const PRICES={shield:25,skip:15,ins:15,dbl:45,freeze:30,ins3:40,freeze3:80,dbl3:110,'chest-or':55,xpb:300,disc:400,gen:200,winb:200,dayskip:180,dailyb:120,purse2:450,luck2:350,xpb2:600,winb2:400,gen2:400,disc2:800,dailyb2:250,dayskip2:250,bet100:200,bet50:80,luck:150,purse:250,skip3:40,shield3:65,mag:25,compass:35,'chest-bois':12,'chest-argent':30,orange:60,vert:60,violet:60,rouge:60,turquoise:60,quadrille:100,rose:60,ambre:60,indigo:60,kraft:100,carbone:120,'chest-argent3':80,compass3:90,'frame-cartouche':60,'frame-or':80,'frame-neon':80,plan:120};
/* Bonus permanents à 5 paliers : ids[n-1] = palier n ; v[n] = valeur au palier n (0 = pas acheté) ; price[n-1] = prix du palier n */
const PERKS={
  purse:{name:'Bourse améliorée',ids:['purse','purse2','purse3','purse4','purse5'],price:[300,450,700,1000,1350],v:[0,0.15,0.30,0.45,0.60,0.75]},
  luck:{name:'Chance dorée',ids:['luck','luck2','luck3','luck4','luck5'],price:[220,520,1050,1800,3000],v:[0,0.05,0.10,0.15,0.20,0.25]},
  xpb:{name:'Expérience accrue',ids:['xpb','xpb2','xpb3','xpb4','xpb5'],price:[450,900,1500,2700,4500],v:[1,1.1,1.2,1.3,1.4,1.5]},
  winb:{name:'Flair du parieur',ids:['winb','winb2','winb3','winb4','winb5'],price:[300,520,830,1200,1800],v:[1,1.2,1.4,1.6,1.8,2]},
  gen:{name:'Coffres généreux',ids:['gen','gen2','gen3','gen4','gen5'],price:[300,500,750,1100,1500],v:[1,1.4,1.8,2.2,2.6,3]},
  disc:{name:'Carte de fidélité',ids:['disc','disc2','disc3','disc4','disc5'],price:[150,270,450,680,980],v:[1,0.9,0.8,0.75,0.7,0.65]},
  dailyb:{name:'Prime du jour',ids:['dailyb','dailyb2','dailyb3','dailyb4','dailyb5'],price:[150,270,450,700,1000],v:[5,10,15,20,25,30]},
  dayskip:{name:'Passe quotidienne',ids:['dayskip','dayskip2','dayskip3','dayskip4','dayskip5'],price:[270,380,750,1350,2250],v:[0,1,2,3,4,5]},
  bet:{name:'Mise maximale',ids:['bet50','bet100','bet200','bet500','bet1000'],price:[180,300,520,830,1200],v:[0,50,100,200,500,1000]}
};
const ROMAN=['','',' II',' III',' IV',' V'];
const PERK_ALL=[]; const PERK_UP={}; const PERK_OF={}; const PERK_NAME={};
Object.keys(PERKS).forEach(k=>{ const P=PERKS[k]; P.ids.forEach((id,i)=>{ PRICES[id]=P.price[i]; PERK_ALL.push(id); PERK_OF[id]=[k,i+1]; if(i) PERK_UP[id]=P.ids[i-1]; PERK_NAME[id]=P.name+ROMAN[i+1]; }); });
const lv=k=>{ let n=0; const ids=PERKS[k].ids; while(n<5&&G[ids[n]]) n++; return n; };
const pv=k=>PERKS[k].v[lv(k)];
const THEMES={base:'Bleu (par défaut)',orange:'Orange atelier',vert:'Vert vérificateur',violet:'Violet prototype',rouge:'Rouge signalisation',turquoise:'Turquoise laser',quadrille:'Cahier quadrillé',plan:'Plan technique',rose:'Rose fluo',ambre:'Ambre laiton',indigo:'Indigo nuit',kraft:'Papier kraft',carbone:'Carbone'};
const SKINS=['plan','quadrille','kraft','carbone'];
const THEME_DESC={base:'Couleur d\'origine.',orange:'Change la couleur d\'accent de l\'outil.',vert:'Change la couleur d\'accent de l\'outil.',violet:'Change la couleur d\'accent de l\'outil.',rouge:'Change la couleur d\'accent de l\'outil.',turquoise:'Change la couleur d\'accent de l\'outil.',rose:'Change la couleur d\'accent de l\'outil.',ambre:'Change la couleur d\'accent de l\'outil.',indigo:'Change la couleur d\'accent de l\'outil.',kraft:'Fond de papier kraft chaud, accent brun.',carbone:'Fond gris carbone et accent orange, pour travailler le soir.',quadrille:'Fond à petits carreaux, comme un cahier de maths.',plan:'Fond bleu et traits blancs : tout l\'outil devient un plan technique.'};
const TITLES={lynx:['Œil de lynx',30],as:['As du discriminant',40],pi:['Maître du π',50],pyth:['Disciple de Pythagore',50],regleur:['Régleur de précision',70],horloger:['Horloger du calcul',100],apprenti:['Futur technicien',20],rigueur:['Rigueur absolue',60],micron:['Orfèvre du micron',80],matu:['Prêt pour la matu',120],legende:['Légende de l\'atelier',200],mesure:['Maître de la cote',90],coffre:['Chasseur de trésors',60],parieur:['Parieur prudent',70],serie:['Infatigable',90],boss:['Tueur de boss',110],zero:['Zéro défaut',150],chance:['Main chanceuse',0],champion:['Champion de la semaine',-1],dauphin:['Vice-champion',-1],podium:['Sur le podium',-1]};
const SFX={base:{name:'Classique',desc:'Notes douces (sons d\'origine).',w:'sine',m:1,d:1,v:1,price:0},meca:{name:'Mécanique',desc:'Cliquetis secs, comme une machine qui tourne.',w:'square',m:0.5,d:0.55,v:0.32,price:40},carillon:{name:'Carillon',desc:'Petites cloches aiguës.',w:'triangle',m:2,d:1.7,v:0.9,price:40},flute:{name:'Flûte',desc:'Notes claires et légères.',w:'sine',m:1.5,d:1.3,v:0.9,price:40},retro:{name:'8 bits',desc:'Bips de console rétro.',w:'square',m:1,d:0.6,v:0.3,price:50},marimba:{name:'Marimba',desc:'Notes boisées, courtes et chaudes.',w:'triangle',m:0.75,d:1.4,v:1,price:45},orgue:{name:'Orgue',desc:'Notes tenues, comme un petit orgue.',w:'sawtooth',m:1,d:1.6,v:0.25,price:50},grave:{name:'Basse',desc:'Sons graves et ronds.',w:'sawtooth',m:0.5,d:1.2,v:0.3,price:45}};
const CONFS={base:{name:'Classique',desc:'Couleurs du thème.',price:0,cols:null},arc:{name:'Arc-en-ciel',desc:'Confettis multicolores.',price:40,cols:['#E5484D','#F5A524','#F2D33C','#3DB36B','#2E90FA','#8E5CF0']},or:{name:'Pluie d\'or',desc:'Confettis dorés.',price:50,cols:['#FFD95A','#F5B700','#FFE9A0','#D99A00']},braise:{name:'Braise',desc:'Confettis rouge et orange.',price:45,cols:['#FF5A36','#FF9F1C','#FFD166','#E63946']},ronds:{name:'Bulles',desc:'Confettis ronds aux couleurs du thème.',price:40,cols:null,shape:'round'},etoiles:{name:'Étoiles',desc:'Petites étoiles dorées et bleutées.',price:60,cols:['#FFD95A','#FFFFFF','#9FD3FF'],shape:'star'},neige:{name:'Neige',desc:'Petits flocons blancs et bleutés.',price:40,cols:['#FFFFFF','#CFE6FF','#A9D0FF','#E8F2FF']}};
const FRAMES={base:{name:'Aucun',desc:'Cadre d\'origine.',price:0},cartouche:{name:'Cartouche',desc:'Double trait, comme le cadre d\'un plan.',price:60},or:{name:'Doré',desc:'Liseré doré autour de la barre de jeu.',price:80},neon:{name:'Néon',desc:'Halo lumineux aux couleurs du thème.',price:80}};
function gameDefaults(){ const o={xp:0,coins:0,streak:0,best:0,lastDay:'',daily:{d:'',n:0},dq:{d:'',l:[]},exams:[],badges:{},rec:{},hist:[],boss:{},shield:0,skip:0,ins:0,dbl:0,freeze:0,mag:0,compass:0,st:{ex:0,trap:0,chk:0,tab:0,perso:0},purse2:false,luck2:false,xpb2:false,winb2:false,gen2:false,disc2:false,dailyb2:false,dayskip2:false,bet100:false,bet50:false,pcarry:0,lb:false,lbSince:'',lastReward:null,wk:{w:'',xp:0},pw:{w:'',xp:0},claims:{},betDay:{d:'',g:0},luck:false,purse:false,xpb:false,disc:false,gen:false,winb:false,dayskip:false,dailyb:false,conf:'base',confs:['base'],frame:'base',frames:['base'],theme:'base',themes:['base'],title:'',titles:[],sfx:'base',sfxs:['base'],sound:true,fx:true,c:{n:0,clean:0,rev:0,alg:0,eq:0,geo:0,maxCombo:0,buys:0,perfect:0,dailyDone:0,dqDone:0,dqAll:0,exam:0,exam5:0,copy:0,betW:0,betL:0,gold:0,chest:0,podium:0,champion:0}}; PERK_ALL.forEach(id=>{ o[id]=false; }); return o; }
let G=loadGame();
function normGame(s){
  const d=gameDefaults();
  if(s&&typeof s==='object'){ Object.keys(d).forEach(k=>{ if(s[k]!==undefined) d[k]=s[k]; }); d.c=Object.assign(gameDefaults().c,s.c||{}); d.daily=Object.assign({d:'',n:0},s.daily||{}); if(s.dq&&s.dq.l) d.dq=s.dq; d.wk=Object.assign({w:'',xp:0},s.wk||{}); d.pw=Object.assign({w:'',xp:0},s.pw||{}); d.claims=Object.assign({},s.claims||{}); }
  return d;
}
function loadGame(){
  let s=null; try{ s=JSON.parse(localStorage.getItem(GSTORE)); }catch(e){}
  return normGame(s);
}
function saveGame(){ try{ localStorage.setItem(GSTORE,JSON.stringify(G)); }catch(e){} syncTouch('g'); }
const dayStr=(off)=>{ const t=new Date(); t.setDate(t.getDate()+(off||0)); return t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0'); };
const rankOf=xp=>{ let i=0; RANKS.forEach((r,k)=>{ if(xp>=r[0]) i=k; }); return {i,name:RANKS[i][1],min:RANKS[i][0],next:i+1<RANKS.length?RANKS[i+1][0]:null,nextName:i+1<RANKS.length?RANKS[i+1][1]:null}; };
const streakNow=()=>(G.lastDay===dayStr(0)||G.lastDay===dayStr(-1)||(G.lastDay===dayStr(-2)&&G.freeze>0))?G.streak:0;
const dailyN=()=>G.daily.d===dayStr(0)?G.daily.n:0;
const modeLabel=(dm,m)=>{ const f=(MODES[dm]||[]).find(x=>x[0]===m); return f?f[1]:m; };

/* ---------- badges ---------- */
const BADGES=[
  ['first','Premier pas','Terminer un premier exercice.',()=>G.c.n>=1],
  ['n50','Établi rempli','Terminer 50 exercices.',()=>G.c.n>=50],
  ['n200','Production en série','Terminer 200 exercices.',()=>G.c.n>=200],
  ['n500','Atelier tournant','Terminer 500 exercices.',()=>G.c.n>=500],
  ['combo5','Sans temps mort','Enchaîner 5 réussites du premier coup, sans indice.',()=>G.c.maxCombo>=5],
  ['combo10','Précision d\'horloger','Enchaîner 10 réussites du premier coup, sans indice.',()=>G.c.maxCombo>=10],
  ['perfect','Sans-faute','Réussir une série de 10 sans aucune aide.',()=>G.c.perfect>=1],
  ['daily','Objectif du jour','Atteindre l\'objectif quotidien ('+DAILY_GOAL+' exercices).',()=>G.c.dailyDone>=1],
  ['exam','Copie rendue','Rendre la copie d\'un examen blanc.',()=>G.c.exam>=1],
  ['exam5','Mention très bien','Obtenir une note d\'au moins 5 sur 6 à un examen blanc.',()=>G.c.exam5>=1],
  ['dq3','Trio du jour','Réussir les trois défis quotidiens le même jour.',()=>G.c.dqAll>=1],
  ['dq15','Défis relevés','Réussir 15 défis quotidiens.',()=>G.c.dqDone>=15],
  ['streak3','Trois jours de suite','Atteindre l\'objectif du jour 3 jours d\'affilée.',()=>G.best>=3],
  ['streak7','Semaine complète','Atteindre l\'objectif du jour 7 jours d\'affilée.',()=>G.best>=7],
  ['streak30','Un mois de régularité','Atteindre l\'objectif du jour 30 jours d\'affilée.',()=>G.best>=30],
  ['boss1','Premier boss','Vaincre un boss de niveau.',()=>Object.keys(G.boss).length>=1],
  ['boss5','Chasseur de boss','Vaincre 5 boss différents.',()=>Object.keys(G.boss).length>=5],
  ['boss6','Maître du niveau 6','Vaincre un boss de niveau 6.',()=>Object.keys(G.boss).some(k=>/\|6$/.test(k))],
  ['hunt','Chasse aux erreurs','Réussir 20 exercices en mode Chasse aux erreurs.',()=>G.c.rev>=20],
  ['algo','Algébriste','Réussir 40 exercices de l\'onglet Développer & factoriser sans aide.',()=>G.c.alg>=40],
  ['equa','Équationniste','Réussir 40 exercices de l\'onglet Équations sans aide.',()=>G.c.eq>=40],
  ['geom','Géomètre','Réussir 40 exercices de l\'onglet Géométrie sans aide.',()=>G.c.geo>=40],
  ['rank3','Assidu','Atteindre le rang « Assidu ».',()=>rankOf(G.xp).i>=RK('Assidu')],
  ['rank6','Lauréat','Atteindre le rang « Lauréat ».',()=>rankOf(G.xp).i>=RK('Lauréat')],
  ['copy20','Correcteur','Corriger 20 copies du premier coup, sans indice.',()=>G.c.copy>=20],
  ['bet10','Parieur avisé','Gagner 10 paris de confiance.',()=>G.c.betW>=10],
  ['gold','Pépite','Réussir un exercice doré du premier coup, sans indice.',()=>G.c.gold>=1],
  ['podium','Sur le podium','Terminer dans les 3 premiers du classement hebdomadaire.',()=>G.c.podium>=1],
  ['champion','Champion de la semaine','Terminer premier du classement hebdomadaire.',()=>G.c.champion>=1],
  ['b_anglais','Anglophone','Réussir 40 exercices d\'anglais sans aide.',()=>(G.c.ang||0)>=40],
  ['shop','Premier achat','Acheter un article à la boutique.',()=>G.c.buys>=1]
];
function checkBadges(){
  const fresh=[];
  BADGES.forEach(b=>{ if(!G.badges[b[0]]&&b[3]()){ G.badges[b[0]]=dayStr(0); fresh.push(b); } });
  return fresh;
}

/* ---------- effets : sons, confettis, messages ---------- */
let AC=null;
function tone(seq){
  if(!G.sound) return;
  try{
    const C=window.AudioContext||window.webkitAudioContext; if(!C) return; AC=AC||new C(); if(AC.state==='suspended') AC.resume();
    let t=AC.currentTime;
    const P=SFX[G.sfx]||SFX.base;
    seq.forEach(([f,d0,v])=>{ const d=d0*P.d, o=AC.createOscillator(), a=AC.createGain(); o.type=P.w; o.frequency.value=f*P.m; a.gain.setValueAtTime(0.0001,t); a.gain.exponentialRampToValueAtTime((v||0.12)*P.v,t+0.015); a.gain.exponentialRampToValueAtTime(0.0001,t+d); o.connect(a); a.connect(AC.destination); o.start(t); o.stop(t+d+0.02); t+=d*0.85; });
  }catch(e){}
}
const SND={ok:[[660,0.09],[880,0.14]],good:[[523,0.08],[659,0.08],[784,0.16]],ko:[[220,0.16,0.08]],rank:[[523,0.1],[659,0.1],[784,0.1],[1047,0.24]],badge:[[784,0.09],[988,0.09],[1319,0.2]],boss:[[392,0.12],[523,0.12],[659,0.12],[784,0.12],[1047,0.3]],gold:[[1047,0.06],[1319,0.06],[1568,0.06],[2093,0.18]],chest:[[392,0.08],[494,0.08],[587,0.08],[784,0.22]],coin:[[988,0.05],[1319,0.12]]};
const reduced=()=>{ try{ return window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } };
function toast(msg,cls){
  const box=$('toasts'); if(!box) return;
  const t=document.createElement('div'); t.className='toast'+(cls?' '+cls:'')+(G.fx&&!reduced()?' anim':''); t.textContent=msg; box.appendChild(t);
  while(box.children.length>4) box.removeChild(box.firstChild);
  setTimeout(()=>{ if(t.parentNode) t.parentNode.removeChild(t); },3200);
}
function confetti(){
  if(!G.fx||reduced()) return;
  const layer=$('fx'); if(!layer) return;
  const cf=CONFS[G.conf], cols=(cf&&cf.cols)||['var(--accent)','var(--ok)','var(--warn)','var(--ink-2)'];
  for(let i=0;i<28;i++){ const p=document.createElement('i'); p.style.left=(10+Math.random()*80)+'%'; p.style.background=cols[i%cols.length]; if(cf&&cf.shape==='round'){ p.style.borderRadius='50%'; p.style.width='10px'; p.style.height='10px'; } else if(cf&&cf.shape==='star'){ p.style.width='13px'; p.style.height='13px'; p.style.borderRadius='0'; p.style.clipPath='polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'; } p.style.animationDelay=(Math.random()*0.25)+'s'; p.style.setProperty('--dx',(Math.random()*160-80)+'px'); p.style.setProperty('--rot',(Math.random()*720-360)+'deg'); layer.appendChild(p); setTimeout(()=>{ if(p.parentNode) p.parentNode.removeChild(p); },2000); }
}

/* ---------- barre de jeu ---------- */
function renderBar(){
  const bar=$('gamebar'); if(!bar) return;
  const bx=(typeof BR!=='undefined'&&typeof brXp==='function'&&(BR.id==='math'||BRDOM[BR.id]))?brXp(BR.id):G.xp, r=rankOf(bx), pct=r.next?Math.min(100,Math.round(100*(bx-r.min)/(r.next-r.min))):100, d=dailyN();
  bar.innerHTML='<span class="g-rk"><span class="lbl">Rang</span><b>'+esc(r.name)+'</b>'+(G.title&&TITLES[G.title]?'<span class="g-title">'+esc(TITLES[G.title][0])+'</span>':'')+'</span>'
    +'<span class="g-xp"><span class="g-bar" aria-hidden="true"><i style="width:'+pct+'%"></i></span><span class="g-txt">'+bx+(r.next?' / '+r.next:'')+' XP</span></span>'
    +'<span class="g-it"><span class="lbl">Pièces</span><b>'+G.coins+'</b></span>'
    +'<span class="g-it"><span class="lbl">Série</span><b>'+streakNow()+' j</b></span>'
    +'<span class="g-it'+(d>=DAILY_GOAL?' done':'')+'"><span class="lbl">Aujourd\'hui</span><b>'+Math.min(d,DAILY_GOAL)+' / '+DAILY_GOAL+'</b></span>'+srsPills();
  bar.setAttribute('aria-label','Profil : rang '+r.name+', '+bx+' XP, '+G.coins+' pièces, série de '+streakNow()+' jours, '+Math.min(d,DAILY_GOAL)+' exercices sur '+DAILY_GOAL+' aujourd\'hui. Ouvrir le bilan.');
}
function addXp(n){
  const before=rankOf(G.xp).i; brAttr(n); G.xp+=n; ensureWeek(); G.wk.xp+=n; const after=rankOf(G.xp).i;
  if(after>before){ toast('Nouveau rang : '+rankOf(G.xp).name,'rank'); tone(SND.rank); confetti(); return true; }
  return false;
}
function announceBadges(list){
  list.forEach(b=>{ toast('Badge obtenu : '+b[1],'badge'); });
  if(list.length){ tone(SND.badge); }
}

/* ---------- après chaque exercice ---------- */
function gameResolve(kind){
  const L=Math.max(1,S.ex.level||1), base=xpBase(L), rev=(S.mode==='review'||S.mode==='srs')?1.5:1; (S.lvs=S.lvs||[]).push(L);
  let xp=0, coins=0; const notes=[];
  G.c.n++;
  if(kind==='clean'){
    S.combo=(S.combo||0)+1; G.c.clean++;
    if(S.combo>G.c.maxCombo) G.c.maxCombo=S.combo;
    xp=base+(S.boss?0:Math.round(2*Math.min(S.combo-1,5)*base/10)); coins=coinBase(L);
    G.c[S.domain]=(G.c[S.domain]||0)+1;
    if(S.ex.copy) G.c.copy=(G.c.copy||0)+1;
    if(S.gold&&!S.boss){ xp*=3; coins*=2; G.c.gold=(G.c.gold||0)+1; notes.push('Exercice doré : XP ×3 et pièces ×2'); }
    if(S.mode==='review'||S.mode==='srs') G.c.rev++;
  } else {
    if((S.combo||0)>=3&&G.shield>0&&kind==='helped'){ G.shield--; notes.push('Bouclier utilisé : combo conservé'); }
    else S.combo=0;
    xp=kind==='helped'?Math.round(base*0.4):0;
    if(kind==='helped'&&S.mode==='review') G.c.rev++;
  }
  xp=Math.round(xp*rev); if(lv('xpb')>0&&xp>0) xp=Math.round(xp*pv('xpb')); if(G.dbl>0&&xp>0){ xp*=2; G.dbl--; notes.push('Potion double XP : ×2 ('+G.dbl+' restant'+(G.dbl>1?'s':'')+')'); } if(G.mag>0&&coins>0){ coins*=2; G.mag--; notes.push('Aimant à pièces : pièces ×2 ('+G.mag+' restant'+(G.mag>1?'s':'')+')'); } if(lv('purse')>0&&kind==='clean'&&coins>0){ G.pcarry=(G.pcarry||0)+coins*pv('purse'); const bp=Math.floor(G.pcarry+1e-9); G.pcarry-=bp; coins+=bp; } S.gxp=(S.gxp||0)+xp; G.coins+=coins;
  if(xp||coins) notes.unshift((S.gold&&kind==='clean'&&!S.boss?'Doré ! ':'')+'+'+xp+' XP'+(coins?' · +'+coins+' pièce'+(coins>1?'s':''):'')+(S.combo>=2&&kind==='clean'?' · combo ×'+S.combo:''));
  addXp(xp);
  // objectif du jour
  const today=dayStr(0);
  if(G.daily.d!==today){ G.daily={d:today,n:0}; if(lv('dayskip')>0){ const n=Math.min(pv('dayskip'),Math.max(0,10-G.skip)); if(n>0){ G.skip+=n; notes.push(n+' passe'+(n>1?'s':'')+' offerte'+(n>1?'s':'')+' du jour'); } } }
  G.daily.n++;
  if(G.daily.n===DAILY_GOAL){
    if(G.lastDay===dayStr(-1)) G.streak++; else if(G.lastDay===dayStr(-2)&&G.freeze>0){ G.freeze--; G.streak++; notes.push('Gel de série utilisé : série conservée'); } else if(G.lastDay!==today) G.streak=1;
    G.lastDay=today; if(G.streak>G.best) G.best=G.streak;
    addXp(20); G.coins+=pv('dailyb'); G.c.dailyDone=(G.c.dailyDone||0)+1;
    toast('Objectif du jour atteint : +20 XP, +'+pv('dailyb')+' pièces · série de '+G.streak+' j','goal'); notes.push('Objectif du jour atteint');
  }
  dqResolve(kind); srsUpdate(S.ex.topic,kind);
  announceBadges(checkBadges());
  saveGame(); renderBar();
  if(kind==='clean') tone(S.gold&&!S.boss?SND.gold:(S.combo>=5?SND.good:SND.ok)); else if(kind==='shown') tone(SND.ko);
  if(notes.length){ toast(notes[0],kind==='clean'?(S.gold&&!S.boss?'gold':'ok'):''); }
  if(kind==='clean'&&S.gold&&!S.boss) confetti();
  const sk=$('btn-skip'); if(sk) sk.hidden=true;
}
function gameWrong(){ tone(SND.ko); }

/* ---------- fin de série et boss ---------- */
function levelOk(kind,L){
  let n=0,c=0; Object.keys(TOPICS).forEach(id=>{ const T=TOPICS[id], st=stats.topics[id]; if(T.kind===kind&&T.level===L&&st){ n+=st.n; c+=st.clean; } });
  return {n,c,ok:n>=5&&c/n>=0.7};
}
function gameSeries(sc,cnt){
  const lines=[]; let xp=0, coins=0, win=null;
  const Lav=S.boss?S.boss.level:Math.max(1,Math.round((S.lvs&&S.lvs.length?S.lvs.reduce((a,b)=>a+b,0)/S.lvs.length:S.level)||1)), f=xpBase(Lav)/10;
  const key=S.domain+'|'+S.mode+'|'+(S.boss?'boss'+S.boss.level:S.level);
  const rec=G.rec[key]||(G.rec[key]={best:0,n:0}); rec.n++; if(sc>rec.best) rec.best=sc;
  if(S.boss){
    win=cnt.clean>=BOSS_WIN;
    if(win){ xp=40+20*Lav; coins=15+5*Lav; G.boss[S.boss.kind+'|'+S.boss.level]=dayStr(0); lines.push('Boss de niveau '+Lav+' vaincu : +'+xp+' XP, +'+coins+' pièces'); }
    else { xp=Math.round(10*f); lines.push('Boss non vaincu ('+cnt.clean+' réussite'+(cnt.clean>1?'s':'')+' du premier coup sur '+BOSS_TOTAL+', il en faut '+BOSS_WIN+') : +'+xp+' XP'); }
  } else {
    if(sc>=8){ const b=Math.round(20*f); xp+=b; lines.push('Score de '+fr(sc)+' / '+TOTAL+' : +'+b+' XP'); }
    if(cnt.clean===TOTAL){ const b=Math.round(40*f), cb=4+Lav; xp+=b; coins+=cb; G.c.perfect=(G.c.perfect||0)+1; lines.push('Sans-faute et sans aucune aide : +'+b+' XP, +'+cb+' pièces'); }
  }
  G.coins+=coins; const up=addXp(xp);
  const chest=chestGive(S.boss?(win?'or':'bois'):(sc>=8?'or':sc>=5?'argent':'bois'));
  G.hist.push({d:dayStr(0),s:sc,t:S.boss?BOSS_TOTAL:TOTAL,m:S.mode,l:S.boss?S.boss.level:S.level,dm:S.domain,x:(S.gxp||0)+xp,b:!!S.boss});
  if(G.hist.length>40) G.hist.splice(0,G.hist.length-40);
  dqSeries(sc); const fresh=checkBadges(); announceBadges(fresh);
  saveGame(); renderBar(); gameBossZone();
  if(win||(!S.boss&&cnt.clean===TOTAL)){ confetti(); tone(win?SND.boss:SND.good); }
  const total=(S.gxp||0)+xp;
  let h='<div class="reward"><h3>'+(S.boss?(win?'Boss vaincu':'Boss non vaincu'):'Récompenses')+'</h3><p class="rw-total"><b>+'+total+' XP</b> pendant cette série'+(coins?' · <b>+'+coins+' pièces</b> de bonus':'')+'.</p>';
  if(lines.length) h+='<ul class="plain">'+lines.map(l=>'<li>'+esc(l)+'</li>').join('')+'</ul>';
  if(up) h+='<p><b>Nouveau rang : '+esc(rankOf(G.xp).name)+'</b></p>';
  if(fresh.length) h+='<p class="rw-b"><span class="lbl">Badges obtenus</span> '+fresh.map(b=>'<span class="bdg-chip">'+esc(b[1])+'</span>').join(' ')+'</p>';
  if(rec.best===sc&&rec.n>1&&sc>0) h+='<p class="note">Nouveau record pour ce mode et ce niveau : '+fr(sc)+' / '+(S.boss?BOSS_TOTAL:TOTAL)+'.</p>';
  h+=chestHTML(chest)+'</div>';
  return h;
}
function startBoss(){
  const lv=levelOk(S.mode,S.level); if(!lv.ok||S.pool||S.mode==='mix'||S.mode==='review'||S.mode==='srs'||S.mode==='copy'||S.level<1) return;
  S.boss={kind:S.mode,level:S.level}; S.bossNext=true; TOTAL=BOSS_TOTAL; newSeries();
  $('sheet').scrollIntoView&&$('sheet').scrollIntoView({block:'start'});
}
function gameBossZone(){
  const rl=$('reward-line');
  if(rl){ const mx=maxLevel();
    if(S.mode==='copy') rl.innerHTML='<b>Récompenses</b> : comme un exercice normal du même niveau. Premier choix juste : réussi sans aide ; deuxième choix juste : avec aide.'; else if(S.mode==='srs') rl.innerHTML='<b>Récompenses</b> : <b>+50 %</b> d\'XP sur les thèmes à revoir.'; else if(S.mode==='review') rl.innerHTML='<b>Récompenses</b> : chaque exercice rapporte selon son niveau, avec <b>+50 %</b> en Chasse aux erreurs.';
    else if(S.level>=1) rl.innerHTML='<b>Récompenses niveau '+S.level+'</b> : '+xpBase(S.level)+' XP et '+coinBase(S.level)+' pièce'+(coinBase(S.level)>1?'s':'')+' par exercice réussi sans aide (bonus de combo en plus), bonus de série et boss proportionnels.';
    else rl.innerHTML='<b>Récompenses</b> : chaque exercice rapporte selon son niveau, de '+xpBase(1)+' XP (niveau 1) à '+xpBase(mx||1)+' XP (niveau '+(mx||1)+').'; }
  const f=$('boss-field'); if(!f) return;
  const show=!S.pool&&S.mode!=='mix'&&S.mode!=='review'&&S.mode!=='srs'&&S.mode!=='copy'&&S.level>=1;
  f.hidden=!show; if(!show) return;
  const lv=levelOk(S.mode,S.level), beaten=G.boss[S.mode+'|'+S.level];
  $('boss-zone').innerHTML='<button type="button" class="btn" data-g="boss"'+(lv.ok?'':' disabled')+'>'+(beaten?'Rejouer le boss':'Affronter le boss')+' · niveau '+S.level+'</button>'
    +'<span class="boss-note">'+(beaten?'<b class="ok-tag">Vaincu</b> le '+esc(beaten)+'. ':'')
    +(lv.ok?BOSS_TOTAL+' exercices, sans indice : '+BOSS_WIN+' réussites du premier coup pour vaincre le boss (+'+(40+20*S.level)+' XP, +'+(15+5*S.level)+' pièces).':'Se débloque après 5 exercices de ce niveau avec 70 % de réussite sans aide (actuellement '+lv.n+' exercice'+(lv.n>1?'s':'')+(lv.n?', '+Math.round(100*lv.c/lv.n)+' %':'')+').')+'</span>';
}
function gameRender(){
  const boss=!!S.boss;
  if(boss) $('btn-hint').hidden=true;
  const sk=$('btn-skip'); if(sk){ sk.hidden=!(G.skip>0&&!boss&&S.status==='open'); sk.textContent='Passer (×'+G.skip+')'; }
  $('gamebar').classList.toggle('boss',boss);
}
function onSkip(){
  if(S.status!=='open'||S.boss||G.skip<1) return;
  G.skip--; saveGame(); renderBar(); toast('Exercice passé : sans XP ni pénalité'); nextExercise();
}

/* ---------- profil (onglet Bilan) ---------- */
function sparkline(){
  const h=G.hist.slice(-20); if(h.length<2) return '<p class="note">Le graphique apparaît après deux séries.</p>';
  const W=320,H=90,px=i=>10+i*(W-20)/(h.length-1), py=v=>H-10-(H-20)*v;
  const pts=h.map((x,i)=>px(i).toFixed(1)+','+py(x.s/x.t).toFixed(1)).join(' ');
  return '<svg class="spark" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Scores des '+h.length+' dernières séries"><line x1="10" x2="'+(W-10)+'" y1="'+py(0.8)+'" y2="'+py(0.8)+'" class="s-ref"/><polyline points="'+pts+'" class="s-line"/>'+h.map((x,i)=>'<circle cx="'+px(i).toFixed(1)+'" cy="'+py(x.s/x.t).toFixed(1)+'" r="'+(x.b?4:2.6)+'" class="'+(x.b?'s-boss':'s-dot')+'"/>').join('')+'</svg><p class="note">Score de chaque série (ligne pointillée : 80 %). Les gros points sont des boss.</p>';
}
function gameProfileHTML(){
  const r=rankOf(G.xp), d=dailyN(), pct=r.next?Math.min(100,Math.round(100*(G.xp-r.min)/(r.next-r.min))):100;
  let h='<div class="card game-card"><h3>Profil de joueur</h3><div class="kpis">'
    +'<div class="kpi"><span class="lbl">Rang</span><b>'+esc(r.name)+'</b></div>'
    +'<div class="kpi"><span class="lbl">XP</span><b>'+G.xp+'</b></div>'
    +'<div class="kpi"><span class="lbl">Pièces</span><b>'+G.coins+'</b></div>'
    +'<div class="kpi"><span class="lbl">Série de jours</span><b>'+streakNow()+'</b></div>'
    +'<div class="kpi"><span class="lbl">Meilleure série</span><b>'+G.best+'</b></div>'
    +'<div class="kpi"><span class="lbl">Combo max</span><b>'+G.c.maxCombo+'</b></div>'
    +'<div class="kpi"><span class="lbl">Paris gagnés</span><b>'+(G.c.betW||0)+' / '+((G.c.betW||0)+(G.c.betL||0))+'</b></div></div>'
    +(G.title&&TITLES[G.title]?'<p class="g-next">Titre : <b>'+esc(TITLES[G.title][0])+'</b></p>':'')
    +'<p class="g-next">'+(r.next?'Prochain rang : <b>'+esc(r.nextName)+'</b> à '+r.next+' XP (encore '+(r.next-G.xp)+').':'Rang maximal atteint.')+'</p>'
    +'<div class="g-bar big" aria-hidden="true"><i style="width:'+pct+'%"></i></div>'
    +'<p class="note">Aujourd\'hui : '+Math.min(d,DAILY_GOAL)+' / '+DAILY_GOAL+' exercices. Atteindre l\'objectif chaque jour prolonge ta série et rapporte +20 XP et 5 pièces.</p>'
    +'<details class="rules"><summary>Comment gagner de l\'XP</summary><ul class="plain"><li>Exercice réussi sans aide : de <b>10 XP</b> (niveau 1) à <b>'+xpBase(6)+' XP</b> (niveau 6), avec 1 à '+coinBase(6)+' pièces, plus un bonus de combo (jusqu\'à +100 %) tant que tu enchaînes des réussites sans aide.</li><li>Par niveau : '+[1,2,3,4,5,6].map(l=>'niv. '+l+' = '+xpBase(l)+' XP').join(', ')+'.</li><li>Réussi avec aide : 40 % de l\'XP du niveau. Solution vue : 0 XP et le combo retombe.</li><li>La Chasse aux erreurs rapporte +50 %.</li><li>Série avec 8 ou plus : bonus de 20 XP au niveau 1 (jusqu\'à '+Math.round(20*xpBase(6)/10)+' au niveau 6). Sans-faute sans aide : de 40 XP à '+Math.round(40*xpBase(6)/10)+' XP, et des pièces en plus.</li><li>Boss vaincu : de 60 XP et 20 pièces (niveau 1) à '+(40+20*6)+' XP et '+(15+5*6)+' pièces (niveau 6).</li><li><b>Exercice doré</b> (environ 1 sur 12, cadre doré) : XP ×3 et pièces ×2 s\'il est réussi du premier coup, sans indice.</li><li><b>Pari de confiance</b> : avant de vérifier, mise 5 ou 20 pièces. Juste du premier coup sans indice : tu gagnes la moitié de ta mise. Première réponse fausse (ou solution affichée) : tu la perds. Un indice ou « Vérifier l\'étape » annule le pari sans frais. Les gains de paris sont plafonnés chaque jour (15 pièces au départ, plus avec les améliorations « Mise maximale » et « Flair du parieur »).</li><li><b>Coffre</b> à chaque fin de série : en bois, en argent (score de 5 ou plus) ou en or (8 ou plus, ou boss vaincu). Il contient des pièces, des objets, et parfois un thème, un titre ou des sons.</li><li><b>Objets de la boutique</b> : l\'assurance rend la mise d\'un pari perdu ; la potion double l\'XP des 5 prochains exercices réussis ; le gel de série sauve un jour manqué.</li><li>Aimant, boussole dorée, packs et coffres s\'achètent aussi dans l\'onglet Boutique, qui propose chaque jour une offre à −30 %.</li><li><b>Corrige la copie</b> : même XP qu\'un exercice normal. Premier choix juste : sans aide ; deuxième choix juste : avec aide ; sinon la correction s\'affiche.</li></ul></details></div>';
  // badges
  const got=Object.keys(G.badges).filter(k=>BADGES.some(b=>b[0]===k)).length;
  h+='<div class="card"><h3>Badges <span class="cnt">'+got+' / '+BADGES.length+'</span></h3><ul class="badges">'+BADGES.map(b=>{ const on=!!G.badges[b[0]]; return '<li class="bdg'+(on?' on':'')+'"><b>'+esc(b[1])+'</b><span>'+esc(b[2])+'</span><em>'+(on?'Obtenu le '+esc(G.badges[b[0]]):'À obtenir')+'</em></li>'; }).join('')+'</ul></div>';
  // boss
  const bk=Object.keys(G.boss);
  h+='<div class="card"><h3>Boss vaincus <span class="cnt">'+bk.length+'</span></h3>'+(bk.length?'<ul class="plain">'+bk.map(k=>{ const p=k.split('|'); return '<li>'+esc(KIND_LABEL[p[0]]||p[0])+' · niveau '+esc(p[1])+' <span class="muted">('+esc(G.boss[k])+')</span></li>'; }).join('')+'</ul>':'<p class="empty">Aucun pour l\'instant. Le bouton « Affronter le boss » apparaît dans l\'onglet Entraînement quand un niveau est validé (5 exercices, 70 % sans aide).</p>')+'</div>';
  // records
  const rk=Object.keys(G.rec);
  h+='<div class="card"><h3>Records</h3>'+(rk.length?'<div class="tbl"><table class="trap"><thead><tr><th>Onglet</th><th>Mode</th><th>Niveau</th><th>Meilleur score</th><th>Séries</th></tr></thead><tbody>'+rk.sort().map(k=>{ const p=k.split('|'); if(p[0]==='exam') return '<tr><td>'+esc(examKeyLabel(p[1]))+'</td><td>Examen blanc</td><td>—</td><td>'+fr(G.rec[k].best)+' / 6</td><td>'+G.rec[k].n+'</td></tr>'; const b=/^boss/.test(p[2]); return '<tr><td>'+esc(DOM_TITLE[p[0]].replace(/<[^>]+>/g,'').replace('&amp;','&'))+'</td><td>'+esc(modeLabel(p[0],p[1]))+'</td><td>'+(b?'Boss '+esc(p[2].slice(4)):(p[2]==='0'?'Tous':esc(p[2])))+'</td><td>'+fr(G.rec[k].best)+' / '+(b?BOSS_TOTAL:TOTAL)+'</td><td>'+G.rec[k].n+'</td></tr>'; }).join('')+'</tbody></table></div>':'<p class="empty">Termine une série pour établir un premier record.</p>')+'</div>';
  // historique
  h+='<div class="card"><h3>Historique des séries</h3>'+sparkline()+(G.hist.length?'<ul class="rec hist">'+G.hist.slice(-8).reverse().map(x=>'<li><span class="tagk '+(x.s/x.t>=0.8?'clean':x.s/x.t>=0.5?'helped':'shown')+'">'+fr(x.s)+' / '+x.t+'</span><span>'+esc(x.d)+' · '+esc(modeLabel(x.dm,x.m))+(x.b?' · boss':(x.l?' · niveau '+x.l:''))+' · +'+x.x+' XP</span></li>').join('')+'</ul>':'')+'</div>';
  // boutique
  h+='<div class="card"><h3>Boutique <span class="cnt">'+G.coins+' pièces</span></h3><p class="note">Objets, thèmes, titres, sons, confettis et améliorations permanentes ont leur propre onglet.</p><div class="actions"><button type="button" class="btn primary" data-act="gotoshop">Ouvrir la boutique</button></div></div>';
  // réglages
  h+='<div class="card"><h3>Réglages du jeu</h3><div class="actions"><button type="button" class="btn" data-g="tog:sound" aria-pressed="'+G.sound+'">Sons : '+(G.sound?'activés':'coupés')+'</button><button type="button" class="btn" data-g="tog:fx" aria-pressed="'+G.fx+'">Effets visuels : '+(G.fx?'activés':'coupés')+'</button></div><div class="actions" id="game-reset-zone" style="margin-top:10px"><button type="button" class="btn" data-g="reset">Réinitialiser ma progression de jeu</button></div><p class="note">La progression de jeu (XP, pièces, badges) est indépendante de « Effacer mes résultats ».</p></div>';
  return h;
}
function applyTheme(){ const gb=document.getElementById('gamebar'); if(gb){ if(G.frame&&G.frame!=='base') gb.setAttribute('data-frame',G.frame); else gb.removeAttribute('data-frame'); } const r=document.documentElement; r.removeAttribute('data-accent'); r.removeAttribute('data-skin'); if(SKINS.includes(G.theme)) r.setAttribute('data-skin',G.theme); else if(G.theme&&G.theme!=='base') r.setAttribute('data-accent',G.theme); }
function gameAction(a){
  if(a==='boss') return startBoss();
  if(a==='skip') return onSkip();
  if(a.indexOf('goto:')===0){ const el=document.getElementById(a.slice(5)); if(el&&el.scrollIntoView) el.scrollIntoView({block:'start'}); return; }
  if(a.indexOf('srsgo:')===0) return srsGo(a.slice(6));
  const [k,v]=a.split(':');
  if(k==='buy'){ const p=itemPrice(v); if(p==null||G.coins<p||(PERK_OF[v]&&G[v])||(PERK_UP[v]&&!G[PERK_UP[v]])) return; G.coins-=p; G.c.buys++; grantItem(v,true);
    announceBadges(checkBadges()); toast('Achat effectué'); }
  else if(k==='equip'){ equipItem(v); }
  else if(k==='hear'){ const o=G.sfx, so=G.sound; G.sfx=v; G.sound=true; tone(SND.good); G.sfx=o; G.sound=so; return; }
  else if(k==='tog'){ G[v]=!G[v]; if(v==='sound') tone(SND.ok); }
  else if(a==='reset'){ $('game-reset-zone').innerHTML='<span style="align-self:center">Effacer XP, pièces, badges et records ?</span><button type="button" class="btn primary" data-g="reset-yes">Oui, effacer</button><button type="button" class="btn" data-g="reset-no">Annuler</button>'; return; }
  else if(a==='reset-yes'){ const cl=G.claims,lb=G.lb,ls=G.lbSince; G=gameDefaults(); G.claims=cl; G.lb=lb; G.lbSince=ls; applyTheme(); }
  else if(a==='reset-no'){ }
  saveGame(); renderBar(); if(!$('view-stats').hidden) renderStats(); if(!$('view-shop').hidden) renderShop(); gameBossZone(); gameRender();
}
function gameInit(){
  applyTheme(); renderBar();
  const go=e=>{ const b=e.target.closest('[data-g]'); if(!b||b.disabled) return; gameAction(b.dataset.g); };
  $('view-stats').addEventListener('click',go); $('view-shop').addEventListener('click',go); $('boss-zone').addEventListener('click',go);
  $('btn-skip').addEventListener('click',onSkip);
  const bar=$('gamebar'); const openStats=()=>{ setBranch('bilan'); };
  bar.addEventListener('click',openStats);
  bar.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openStats(); } });
}
