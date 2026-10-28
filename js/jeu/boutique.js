'use strict';
/* ===== Jeu : corrige la copie, pari de confiance, récompenses surprises, boutique ===== */
const GOLD_RATE=0.08;
const BETS=[[0,'Pas sûr'],[5,'Sûr'],[20,'Certain']];
const BET_NAMES=['Jackpot','Méga jackpot','Ultra jackpot','Titan','Légendaire'];
const betList=()=>BETS.concat(PERKS.bet.v.slice(1,lv('bet')+1).map((n,i)=>[n,BET_NAMES[i]]));
const BET_RATIO=0.5;
const betCap=()=>15+6*(lv('bet')+lv('winb'));
const betToday=()=>(G.betDay&&G.betDay.d===dayStr(0))?G.betDay.g:0;
const betLeft=()=>Math.max(0,betCap()-betToday());
const betGain=n=>Math.min(betLeft(),Math.round(n*BET_RATIO*pv('winb')));

/* ---------- Corrige la copie ---------- */
const COPYOK={};
function copyOk(id){
  if(COPYOK[id]!==undefined) return COPYOK[id];
  let ok=false;
  for(let i=0;i<6&&!ok;i++){ try{ const ex=TOPICS[id].gen(); ex.topic=id; ex.level=TOPICS[id].level; if(!(ex.vars&&ex.vars.length)) ex.vars=varsOfPoly(ex.expected); if(copyMake(ex)) ok=true; }catch(e){} }
  return COPYOK[id]=ok;
}
function copyIds(level,pool){
  const base=pool&&pool.length?[...new Set(pool)]:Object.keys(TOPICS).filter(id=>DKINDS[S.domain].includes(TOPICS[id].kind)&&(!level||TOPICS[id].level===level));
  return base.filter(copyOk);
}
function copyMaxLevel(){
  const ids=Object.keys(TOPICS).filter(id=>DKINDS[S.domain].includes(TOPICS[id].kind)&&copyOk(id));
  return ids.length?Math.max.apply(null,ids.map(id=>TOPICS[id].level)):0;
}
function copyTopicsLine(){
  const ids=copyIds(S.level,null);
  return '<b>Corrige la copie</b> : un élève a rendu sa copie. Refais l\'exercice au brouillon, compare, puis choisis le commentaire à écrire en rouge (ou « la copie est juste »). Thèmes : '+(ids.length?ids.map(id=>'<b>'+esc(TOPICS[id].label)+'</b>'+(S.level?'':' · niv. '+TOPICS[id].level)).join(', '):'aucun à ce niveau')+'.';
}
function copyExercise(pool){
  const ids=copyIds(S.level,pool);
  if(!ids.length) return newExercise('mix',S.level,S.recent,pool,S.domain);
  for(let i=0;i<60;i++){
    const id=pick(ids), ex=newExercise('mix',S.level,S.recent,[id],S.domain), c=copyMake(ex);
    if(c){ ex.copy=c; return ex; }
  }
  return newExercise('mix',S.level,S.recent,ids,S.domain);
}
function copyHTML(c){
  const L='ABCD';
  return '<div class="copy-sheet"><div class="copy-head"><span class="lbl">Copie de '+esc(c.name)+'</span></div><div class="copy-lines">'+c.lines.map(l=>'<div>'+l+'</div>').join('')+'</div></div>'
    +'<p class="copy-q" id="copy-q">Quel commentaire écris-tu en rouge sur cette copie ?</p>'
    +'<div class="copy-opts" role="group" aria-labelledby="copy-q">'+c.options.map((o,i)=>'<button type="button" class="copt'+(o.juste?' juste':'')+'" data-i="'+i+'"><span class="copt-k">'+L[i]+'</span><span>'+o.html+'</span></button>').join('')+'</div>';
}
function copyLock(reveal){
  document.querySelectorAll('#copybox .copt').forEach(b=>{ b.disabled=true; const o=S.ex.copy.options[+b.dataset.i]; if(reveal&&o.ok) b.classList.add('ok'); });
}
function onCopyClick(e){
  const b=e.target.closest('button[data-i]'); if(!b||b.disabled||S.status!=='open'||!S.ex||!S.ex.copy||running()) return;
  const c=S.ex.copy, o=c.options[+b.dataset.i];
  if(o.ok){ betSettle(S.tries===0&&S.hints===0); b.classList.add('ok'); resolve(S.tries===0&&S.hints===0?'clean':'helped'); return; }
  betSettle(false);
  S.tries++; gameWrong(); b.classList.add('ko'); b.disabled=true;
  if(S.tries>=2){ resolve('shown'); return; }
  renderBet();
  showFb('ko','Ce n\'est pas ce commentaire','<p>'+(o.juste?'La copie contient une erreur : cherche laquelle.':'Ce commentaire ne correspond pas à ce qui est écrit sur la copie.')+' Refais le calcul au brouillon et compare avec la copie. Il te reste un essai.</p>');
}
function copyAfterResolve(kind){
  const c=S.ex.copy; copyLock(true);
  let ref=null; try{ ref=copyAnswer(S.ex,null); }catch(e){}
  const refHtml=ref?'<p>Réponse juste : '+ref.lines.join(' · ')+'</p>':'';
  const retain=c.tag&&TAGS[c.tag]?'<p class="retain"><b>À retenir</b> · '+esc(TAGS[c.tag].tip)+'</p>':'';
  if(kind==='shown') showFb('ko','Correction affichée','<p>'+(c.wrong?'La copie de '+esc(c.name)+' contenait l\'erreur surlignée en vert.':'La copie de '+esc(c.name)+' était juste : il n\'y avait rien à corriger.')+'</p>'+(c.wrong?refHtml+retain:''));
  else showFb('ok',kind==='clean'?'Bien corrigé, du premier coup':'Bien corrigé','<p>'+(c.wrong?'C\'est bien l\'erreur de '+esc(c.name)+'.':'Rien à redire : la copie de '+esc(c.name)+' est juste.')+'</p>'+(c.wrong?refHtml+retain:''));
}

/* ---------- Pari de confiance ---------- */
function betLockReason(){
  if(S.betDone) return S.bet?'Pari joué : '+(S.betWon?'gagné, +':'perdu, −')+S.bet+' pièces.':'Pari fermé après la première réponse.';
  if(S.hints>0) return 'Pari fermé : un indice a été demandé.';
  if(S.stepUsed) return 'Pari fermé : une étape a été vérifiée.';
  if(S.tries>0) return 'Pari fermé après la première réponse.';
  if(betLeft()<=0) return 'Plafond de gains de paris atteint aujourd\'hui ('+betCap()+' pièces). Les paris reprennent demain.';
  return '';
}
function renderBet(){
  const z=$('bet'); if(!z) return;
  const show=!running()&&S.ex&&S.status==='open';
  z.hidden=!show; if(!show){ z.innerHTML=''; return; }
  const lock=betLockReason();
  z.innerHTML='<span class="lbl" id="bet-lbl">Pari</span><div class="seg bet-seg" role="group" aria-labelledby="bet-lbl">'
    +betList().map(([n,l])=>'<button type="button" data-bet="'+n+'" aria-pressed="'+(S.bet===n)+'"'+(lock||(n&&G.coins<n)?' disabled':'')+'>'+l+(n?' · '+n+' pièces':'')+'</button>').join('')+'</div>'
    +'<span class="bet-note">'+(lock||(S.bet?'Mise : '+S.bet+' pièces. Juste du premier coup, sans indice : +'+betGain(S.bet)+'. Faux : −'+S.bet+'.':'Mise des pièces si tu es sûr de toi : juste du premier coup, tu gagnes '+Math.round(100*BET_RATIO*pv('winb'))+' % de ta mise ; faux, tu la perds. Gains encore possibles aujourd\'hui : '+betLeft()+' pièces.'))+'</span>';
}
function onBetClick(e){
  const b=e.target.closest('button[data-bet]'); if(!b||b.disabled||S.status!=='open'||betLockReason()) return;
  const n=+b.dataset.bet; if(n&&G.coins<n) return;
  S.bet=n; renderBet();
}
function betSettle(win){
  if(S.betDone) return;
  S.betDone=true; S.betWon=!!win;
  if(!S.bet){ renderBet(); return; }
  if(win){ const gain=betGain(S.bet); G.coins+=gain; G.betDay={d:dayStr(0),g:betToday()+gain}; G.c.betW=(G.c.betW||0)+1; toast('Pari gagné : +'+gain+' pièces'+(betLeft()<=0?' (plafond du jour atteint)':''),'ok'); tone(SND.coin); }
  else if(G.ins>0){ G.ins--; G.c.betL=(G.c.betL||0)+1; toast('Pari perdu, mais l\'assurance rend ta mise ('+G.ins+' restante'+(G.ins>1?'s':'')+')'); }
  else { G.coins=Math.max(0,G.coins-S.bet); G.c.betL=(G.c.betL||0)+1; toast('Pari perdu : −'+S.bet+' pièces'); }
  announceBadges(checkBadges()); saveGame(); renderBar(); renderBet();
}
function betCancel(why){
  if(S.bet&&!S.betDone) toast('Pari annulé ('+why+') : mise rendue');
  if(!S.betDone) S.bet=0;
  renderBet();
}

/* ---------- Exercice doré et rendu ---------- */
function funRender(){
  const ex=S.ex, cp=!!(ex&&ex.copy)&&!running(), box=$('copybox');
  ['answer','keys','preview','answer-lbl'].forEach(id=>{ const e=$(id); if(e) e.hidden=cp; });
  if(cp){
    $('btn-check').hidden=true; $('btn-step').hidden=true;
    $('instr').textContent='Corrige la copie';
    $('hintline').textContent='Résous l\'exercice au brouillon, compare avec la copie, puis choisis le commentaire juste. Premier choix juste : réussi sans aide ; deuxième choix juste : avec aide.';
    box.innerHTML=copyHTML(ex.copy); box.hidden=false;
  } else { box.innerHTML=''; box.hidden=true; }
  const gold=!!S.gold&&!running()&&!S.boss;
  $('sheet').classList.toggle('gold',gold);
  if(gold){
    const ca=$('cartouche'), cell=document.createElement('div'); cell.className='gold-cell';
    cell.innerHTML='<span class="lbl">Bonus</span><b>Doré · XP ×3</b>'; ca.insertBefore(cell,ca.lastChild);
    tone(SND.gold); toast('Exercice doré : XP ×3 et pièces ×2 s\'il est réussi du premier coup, sans indice','gold');
  }
  renderBet();
}

/* ---------- Coffres ---------- */
const CHEST={bois:'Coffre en bois',argent:'Coffre en argent',or:'Coffre en or'};
function cosmeticsMissing(){
  const out=[];
  Object.keys(THEMES).forEach(t=>{ if(t!=='base'&&!G.themes.includes(t)) out.push(t); });
  Object.keys(TITLES).forEach(t=>{ if(TITLES[t][1]>=0&&!G.titles.includes(t)) out.push('title-'+t); });
  Object.keys(SFX).forEach(k=>{ if(k!=='base'&&!G.sfxs.includes(k)) out.push('sfx-'+k); });
  Object.keys(CONFS).forEach(k=>{ if(k!=='base'&&!G.confs.includes(k)) out.push('conf-'+k); });
  Object.keys(FRAMES).forEach(k=>{ if(k!=='base'&&!G.frames.includes(k)) out.push('frame-'+k); });
  return out;
}
function chestGive(tier){
  const R=Math.random(), cos=cosmeticsMissing(), coins=(a,b)=>({type:'coins',n:Math.round(rnd(a,b)*pv('gen'))});
  let loot;
  if(tier==='or') loot=R<0.22&&cos.length?{type:'item',v:pick(cos)}:R<0.38?{type:'item',v:'shield'}:R<0.46?{type:'item',v:'skip',n:2}:R<0.52?{type:'item',v:pick(['ins','dbl','freeze'])}:coins(15,40);
  else if(tier==='argent') loot=R<0.08&&cos.length?{type:'item',v:pick(cos)}:R<0.23?{type:'item',v:'shield'}:R<0.36?{type:'item',v:'skip'}:R<0.41?{type:'item',v:pick(['ins','freeze'])}:coins(8,20);
  else loot=R<0.2?{type:'item',v:'skip'}:coins(3,8);
  if(loot.type==='coins') G.coins+=loot.n; else for(let i=0;i<(loot.n||1);i++) grantItem(loot.v,false);
  G.c.chest=(G.c.chest||0)+1; saveGame();
  return {tier,loot};
}
function chestLootText(ch){
  const l=ch.loot; if(l.type==='coins') return '+'+l.n+' pièces';
  const cosm=/^(title-|sfx-|conf-|frame-)/.test(l.v)||!!THEMES[l.v];
  return (l.n>1?l.n+' × ':'')+itemName(l.v)+(cosm?' : nouveau ! À équiper dans la boutique (onglet Boutique).':'');
}
function chestHTML(ch){
  return '<div class="chest-card tier-'+ch.tier+'"><div class="chest" aria-hidden="true"><svg viewBox="0 0 64 52" width="64" height="52"><rect class="ch-body" x="6" y="22" width="52" height="26" rx="3"/><line class="ch-band" x1="6" y1="34" x2="58" y2="34"/><g class="ch-lid"><path class="ch-lidp" d="M6 22 V16 Q6 8 14 8 H50 Q58 8 58 16 V22 Z"/></g><rect class="ch-lock" x="28" y="18" width="8" height="10" rx="1.5"/></svg></div>'
    +'<div class="chest-txt"><b>'+CHEST[ch.tier]+'</b><span class="chest-loot" hidden>'+esc(chestLootText(ch))+'</span><button type="button" class="btn primary" data-act="chest">Ouvrir le coffre</button></div></div>';
}
function chestOpen(btn){
  const card=btn.closest('.chest-card'); if(!card) return;
  card.classList.add('open'); btn.hidden=true;
  const l=card.querySelector('.chest-loot'); if(l) l.hidden=false;
  tone(SND.chest); if(card.classList.contains('tier-or')) confetti();
}

/* ---------- Boutique : objets, thèmes, titres, sons ---------- */
function itemName(v){
  if(v==='shield') return 'Bouclier de combo'; if(v==='skip') return 'Passe'; if(PERK_NAME[v]) return 'Amélioration « '+PERK_NAME[v]+' »'; if(v==='ins3') return '3 assurances de pari'; if(v==='freeze3') return '3 gels de série'; if(v==='dbl3') return '3 potions double XP'; if(v==='chest-or') return 'Coffre en or';
  if(v==='skip3') return '3 passes'; if(v==='shield3') return '3 boucliers de combo'; if(v==='mag') return 'Aimant à pièces (20 exercices)'; if(v==='compass') return 'Boussole dorée'; if(v==='chest-bois') return 'Coffre en bois'; if(v==='chest-argent') return 'Coffre en argent';
  if(v.indexOf('st-')===0){ const s=STUDY.find(x=>'st-'+x[0]===v); return s?s[1]:v; }
  if(v==='ins') return 'Assurance de pari'; if(v==='dbl') return 'Potion double XP (5 exercices)'; if(v==='freeze') return 'Gel de série';
  if(v==='compass3') return '3 boussoles dorées'; if(v==='chest-argent3') return '3 coffres en argent';
  if(v.indexOf('frame-')===0&&FRAMES[v.slice(6)]) return 'Cadre « '+FRAMES[v.slice(6)].name+' »';
  if(v.indexOf('conf-')===0&&CONFS[v.slice(5)]) return 'Confettis « '+CONFS[v.slice(5)].name+' »';
  if(THEMES[v]) return 'Thème « '+THEMES[v]+' »';
  if(v.indexOf('title-')===0&&TITLES[v.slice(6)]) return 'Titre « '+TITLES[v.slice(6)][0]+' »';
  if(v.indexOf('sfx-')===0&&SFX[v.slice(4)]) return 'Sons « '+SFX[v.slice(4)].name+' »';
  return v;
}
function itemPrice(v){ let p=itemPrice0(v); if(p!=null&&dealId()===v) p=Math.max(1,Math.round(p*DEAL_RATE)); return p!=null&&lv('disc')>0&&!PERK_OF[v]?Math.max(1,Math.round(p*pv('disc'))):p; }
function itemPrice0(v){
  if(PRICES[v]!=null) return PRICES[v];
  if(v.indexOf('title-')===0){ const t=TITLES[v.slice(6)]; return t&&t[1]>0?t[1]:null; }
  if(v.indexOf('sfx-')===0){ const t=SFX[v.slice(4)]; return t&&t.price?t.price:null; }
  if(v.indexOf('conf-')===0){ const t=CONFS[v.slice(5)]; return t&&t.price?t.price:null; }
  if(v.indexOf('frame-')===0){ const t=FRAMES[v.slice(6)]; return t&&t.price?t.price:null; }
  return null;
}
function grantItem(v,equip){
  if(v==='shield'){ G.shield++; return; }
  if(v==='skip'){ G.skip++; return; }
  if(PERK_OF[v]){ G[v]=true; return; }
  if(v==='ins3'){ G.ins+=3; return; }
  if(v==='freeze3'){ G.freeze+=3; return; }
  if(v==='dbl3'){ G.dbl+=15; return; }
  if(v==='skip3'){ G.skip+=3; return; }
  if(v==='compass3'){ G.compass+=3; return; }
  if(v==='chest-argent3'){ const tx=[]; for(let i=0;i<3;i++) tx.push(chestLootText(chestGive('argent'))); toast('3 coffres ouverts : '+tx.join(' · '),'ok'); tone(SND.chest); return; }
  if(v.indexOf('frame-')===0){ const k=v.slice(6); if(!G.frames.includes(k)) G.frames.push(k); if(equip){ G.frame=k; applyTheme(); } return; }
  if(v.indexOf('st-')===0){ studyGrant(v); return; }
  if(v==='shield3'){ G.shield+=3; return; }
  if(v==='mag'){ G.mag+=20; return; }
  if(v==='compass'){ G.compass++; return; }
  if(v.indexOf('chest-')===0){ const ch=chestGive(v.slice(6)); toast('Coffre ouvert : '+chestLootText(ch),'ok'); tone(SND.chest); if(ch.tier==='or') confetti(); return; }
  if(v==='ins'){ G.ins++; return; }
  if(v==='dbl'){ G.dbl+=5; return; }
  if(v==='freeze'){ G.freeze++; return; }
  if(v.indexOf('conf-')===0){ const k=v.slice(5); if(!G.confs.includes(k)) G.confs.push(k); if(equip) G.conf=k; return; }
  if(THEMES[v]){ if(!G.themes.includes(v)) G.themes.push(v); if(equip){ G.theme=v; applyTheme(); } return; }
  if(v.indexOf('title-')===0){ const k=v.slice(6); if(!G.titles.includes(k)) G.titles.push(k); if(equip) G.title=k; return; }
  if(v.indexOf('sfx-')===0){ const k=v.slice(4); if(!G.sfxs.includes(k)) G.sfxs.push(k); if(equip){ G.sfx=k; tone(SND.ok); } }
}
function equipItem(v){
  if(THEMES[v]){ if(v==='base'||G.themes.includes(v)){ G.theme=v; applyTheme(); } return; }
  if(v==='title-none'){ G.title=''; return; }
  if(v.indexOf('frame-')===0){ const k=v.slice(6); if(k==='base'||G.frames.includes(k)){ G.frame=k; applyTheme(); } return; }
  if(v.indexOf('conf-')===0){ const k=v.slice(5); if(k==='base'||G.confs.includes(k)){ G.conf=k; confetti(true); } return; }
  if(v.indexOf('title-')===0){ const k=v.slice(6); if(G.titles.includes(k)) G.title=k; return; }
  if(v.indexOf('sfx-')===0){ const k=v.slice(4); if(k==='base'||G.sfxs.includes(k)){ G.sfx=k; tone(SND.ok); } }
}
/* ---------- Offre du jour : un article au hasard (fixé par la date), à -30 % ---------- */
const DEAL_RATE=0.7;
function dealPool(){
  const p=['shield','skip','ins','dbl','freeze','mag','compass','chest-bois','chest-argent','chest-or','skip3','shield3','ins3','freeze3','dbl3','compass3','chest-argent3'];
  Object.keys(THEMES).forEach(k=>{ if(k!=='base') p.push(k); });
  Object.keys(TITLES).forEach(k=>{ if(TITLES[k][1]>0) p.push('title-'+k); });
  Object.keys(SFX).forEach(k=>{ if(k!=='base') p.push('sfx-'+k); });
  Object.keys(CONFS).forEach(k=>{ if(k!=='base') p.push('conf-'+k); });
  Object.keys(FRAMES).forEach(k=>{ if(k!=='base') p.push('frame-'+k); });
  return p;
}
function ownedItem(v){
  if(THEMES[v]) return G.themes.includes(v);
  if(v.indexOf('title-')===0) return G.titles.includes(v.slice(6));
  if(v.indexOf('sfx-')===0) return G.sfxs.includes(v.slice(4));
  if(v.indexOf('conf-')===0) return G.confs.includes(v.slice(5));
  if(v.indexOf('frame-')===0) return G.frames.includes(v.slice(6));
  return false;
}
function dealId(){
  if(DEAL_RATE>=1) return null;
  const p=dealPool(), d=dayStr(0); let h=7; for(let i=0;i<d.length;i++) h=(h*31+d.charCodeAt(i))%100003;
  return p[h%p.length];
}
function dealHTML(){
  const v=dealId(); if(!v) return '';
  if(ownedItem(v)) return '<div class="card deal"><h3>Offre du jour</h3><p class="note">'+esc(itemName(v))+' (−30 %) : déjà dans ta collection. Une nouvelle offre arrive demain.</p></div>';
  const p=itemPrice(v), full=itemPrice0(v);
  return '<div class="card deal"><h3>Offre du jour <span class="cnt">−30 %</span></h3><ul class="shop"><li><div><b>'+esc(itemName(v))+'</b><span>Prix normal : '+full+' pièces. L\'offre change chaque jour.</span></div><span class="shop-btns"><button type="button" class="btn" data-g="buy:'+v+'"'+(G.coins<p?' disabled':'')+'>'+p+' pièces</button></span></li></ul></div>';
}
function shopNav(){
  const it=[['shop-objets','Objets'],['shop-perm','Permanents']];
  if(PERK_ALL.some(id=>PERK_UP[id]&&G[PERK_UP[id]])) it.push(['shop-niv','Niveaux 2 à 5']);
  it.push(['shop-etude','Pour apprendre'],['shop-themes','Thèmes'],['shop-titres','Titres'],['shop-sons','Sons'],['shop-conf','Confettis'],['shop-cadres','Cadres']);
  return '<div class="card"><h3>Aller à</h3><div class="shop-nav">'+it.map(x=>'<button type="button" class="btn" data-g="goto:'+x[0]+'">'+x[1]+'</button>').join('')+'</div></div>';
}
function invHTML(){
  const it=[['Boucliers de combo',G.shield],['Passes',G.skip],['Assurances de pari',G.ins],['Gels de série',G.freeze],['Potion ×2 XP (exerc.)',G.dbl],['Aimant (exerc.)',G.mag],['Boussoles dorées',G.compass]].concat(STUDY.map(s=>[s[1],stG()[s[0]]||0]));
  return '<div class="card"><h3>Ton sac</h3><div class="kpis inv">'+it.map(x=>'<div class="kpi"><span class="lbl">'+x[0]+'</span><b>'+x[1]+'</b></div>').join('')+'</div>'
    +'<p class="note">Gains de paris aujourd\'hui : '+betToday()+' / '+betCap()+' pièces.</p></div>';
}
function renderShop(){ $('view-shop').innerHTML='<div class="course">'+invHTML()+dealHTML()+shopNav()+shopHTML()+'</div>'; }
function shopHTML(){
  const buy=(v)=>{ const p=itemPrice(v); return '<button type="button" class="btn" data-g="buy:'+v+'"'+(G.coins<p?' disabled':'')+'>'+p+' pièces</button>'; };
  const eq=(v,on)=>'<button type="button" class="btn" data-g="equip:'+v+'"'+(on?' disabled':'')+'>'+(on?'Équipé':'Équiper')+'</button>';
  const li=(name,desc,btn)=>'<li><div><b>'+name+'</b><span>'+desc+'</span></div><span class="shop-btns">'+btn+'</span></li>';
  let h='<div class="card"><h3>Boutique <span class="cnt">'+G.coins+' pièces</span></h3>';
  h+='<h4 class="shop-h" id="shop-objets">Objets</h4><ul class="shop">'
    +li('Bouclier de combo','Garde ton combo quand tu réussis avec aide (une fois par bouclier). Possédés : '+G.shield+'.',buy('shield',PRICES.shield))
    +li('Passe','Remplace un exercice par un autre, sans XP ni pénalité (bouton « Passer », hors boss). Possédés : '+G.skip+'.',buy('skip',PRICES.skip))
    +li('Assurance de pari','Si tu perds un pari de confiance, la mise t\'est rendue (une fois par assurance). Possédées : '+G.ins+'.',buy('ins',PRICES.ins))
    +li('Potion double XP','Les 5 prochains exercices réussis rapportent le double d\'XP. Restant : '+G.dbl+'.',buy('dbl',PRICES.dbl))
    +li('Gel de série','Si tu rates un jour, ta série de jours est conservée (jusqu\'à un jour manqué). Possédés : '+G.freeze+'.',buy('freeze',PRICES.freeze))
    +li('Aimant à pièces','Les pièces gagnées sur les 20 prochains exercices réussis sont doublées. Restant : '+G.mag+'.',buy('mag',PRICES.mag))
    +li('Boussole dorée','Le prochain exercice (hors boss et examen) sera doré : XP ×3 et pièces ×2 s\'il est réussi du premier coup. En réserve : '+G.compass+'.',buy('compass',PRICES.compass))
    +li('Pack de 3 passes','Trois passes d\'un coup, moins cher qu\'à l\'unité.',buy('skip3',PRICES.skip3))
    +li('Pack de 3 boucliers','Trois boucliers de combo d\'un coup, moins cher qu\'à l\'unité.',buy('shield3',PRICES.shield3))
    +li('Coffre en bois','S\'ouvre tout de suite : pièces ou passe.',buy('chest-bois',PRICES['chest-bois']))
    +li('Coffre en argent','S\'ouvre tout de suite : pièces, objets, parfois un thème, un titre, des sons ou des confettis.',buy('chest-argent',PRICES['chest-argent']))
    +li('Pack de 3 boussoles dorées','Trois exercices dorés d\'un coup, moins cher qu\'à l\'unité. En réserve : '+G.compass+'.',buy('compass3',PRICES.compass3))
    +li('Pack de 3 coffres en argent','S\'ouvrent tout de suite : moins cher qu\'à l\'unité.',buy('chest-argent3',PRICES['chest-argent3']))
    +li('Coffre en or','S\'ouvre tout de suite : le meilleur butin, avec plus de chances d\'obtenir un thème, un titre, des sons ou des confettis.',buy('chest-or',PRICES['chest-or']))
    +li('Pack de 3 assurances de pari','Trois assurances d\'un coup, moins cher qu\'à l\'unité. Possédées : '+G.ins+'.',buy('ins3',PRICES.ins3))
    +li('Pack de 3 gels de série','Trois gels d\'un coup, moins cher qu\'à l\'unité. Possédés : '+G.freeze+'.',buy('freeze3',PRICES.freeze3))
    +li('Pack de 3 potions double XP','15 exercices à XP doublé, moins cher qu\'à l\'unité. Restant : '+G.dbl+'.',buy('dbl3',PRICES.dbl3))+'</ul>';
  h+='<h4 class="shop-h" id="shop-etude">Pour apprendre</h4><ul class="shop">'+STUDY.map(s=>li(s[1],s[2]+' En réserve : '+(stG()[s[0]]||0)+'.',buy('st-'+s[0]))).join('')+'</ul>';
  const perm=(v,name,desc)=>li(name,desc,G[v]?'<button type="button" class="btn" disabled>Acquis</button>':buy(v,PRICES[v]));
  const pct=x=>Math.round(x*100);
  const fr1=x=>String(x).replace('.',',');
  const PD={
    purse:n=>'+'+pct(PERKS.purse.v[n])+' % de pièces sur chaque exercice réussi sans aide (les fractions s\'accumulent).',
    luck:n=>'Environ '+Math.round(100*(GOLD_RATE+PERKS.luck.v[n]))+' % d\'exercices dorés (au lieu de '+Math.round(100*(GOLD_RATE+PERKS.luck.v[n-1]))+' %).',
    xpb:n=>'+'+pct(PERKS.xpb.v[n]-1)+' % d\'XP sur chaque exercice réussi.',
    winb:n=>'Un pari gagné rapporte '+Math.round(100*BET_RATIO*PERKS.winb.v[n])+' % de la mise ; le plafond de gains de paris du jour augmente de 6.',
    gen:n=>'Les pièces des coffres augmentent de '+pct(PERKS.gen.v[n]-1)+' %.',
    disc:n=>pct(1-PERKS.disc.v[n])+' % de réduction sur les objets, packs, coffres, thèmes, titres, sons et confettis (pas sur les améliorations).',
    dailyb:n=>'Objectif du jour atteint : '+PERKS.dailyb.v[n]+' pièces.',
    dayskip:n=>PERKS.dayskip.v[n]+' passe'+(PERKS.dayskip.v[n]>1?'s':'')+' offerte'+(PERKS.dayskip.v[n]>1?'s':'')+' par jour (stock limité à 10).',
    bet:n=>'Ajoute la mise « '+BET_NAMES[n-1]+' » de '+PERKS.bet.v[n]+' pièces ; le plafond de gains de paris du jour augmente de 6.'
  };
  h+='<h4 class="shop-h" id="shop-perm">Améliorations permanentes</h4><p class="note">Achat unique, effet pour toujours. Les gains de paris sont plafonnés chaque jour (15 pièces, plus 6 par niveau de Mise maximale et de Flair du parieur).</p><ul class="shop">'
    +Object.keys(PERKS).map(k=>perm(PERKS[k].ids[0],PERKS[k].name,PD[k](1))).join('')+'</ul>';
  /* un palier supérieur n'apparaît qu'une fois le palier précédent acheté */
  const up=(v,name,desc)=>!G[PERK_UP[v]]?'':li(name,desc,G[v]?'<button type="button" class="btn" disabled>Acquis</button>':buy(v));
  let firstUp=true;
  for(let n=2;n<=5;n++){
    const rows=Object.keys(PERKS).map(k=>up(PERKS[k].ids[n-1],PERK_NAME[PERKS[k].ids[n-1]],PD[k](n))).join('');
    if(!rows) continue;
    h+='<h4 class="shop-h"'+(firstUp?' id="shop-niv"':'')+'>Améliorations de niveau '+n+'</h4>'+(firstUp?'<p class="note">Elles renforcent une amélioration permanente et apparaissent dès que le niveau précédent est acheté.</p>':'')+'<ul class="shop">'+rows+'</ul>'; firstUp=false;
  }
  h+='<h4 class="shop-h" id="shop-themes">Thèmes</h4><ul class="shop">'+Object.keys(THEMES).map(t=>{ const own=t==='base'||G.themes.includes(t); return li('Thème « '+esc(THEMES[t])+' »',esc(THEME_DESC[t]),own?eq(t,G.theme===t):buy(t,PRICES[t])); }).join('')+'</ul>';
  h+='<h4 class="shop-h" id="shop-titres">Titres</h4><p class="note">Le titre équipé s\'affiche sous ton rang, dans la barre de jeu.</p><ul class="shop">'
    +Object.keys(TITLES).map(k=>{ const own=G.titles.includes(k), p=TITLES[k][1]; return li('« '+esc(TITLES[k][0])+' »',p>0?'Titre à afficher.':(p<0?'Récompense du classement hebdomadaire (places 1 à 3).':'Titre rare : il ne se trouve que dans les coffres.'),own?eq('title-'+k,G.title===k):(p>0?buy('title-'+k,p):'<span class="muted">'+(p<0?'Classement':'Dans les coffres')+'</span>')); }).join('')
    +(G.title?li('Aucun titre','Retire le titre affiché.',eq('title-none',false)):'')+'</ul>';
  h+='<h4 class="shop-h" id="shop-sons">Sons</h4><ul class="shop">'+Object.keys(SFX).map(k=>{ const own=k==='base'||G.sfxs.includes(k); return li('Sons « '+esc(SFX[k].name)+' »',esc(SFX[k].desc),'<button type="button" class="btn" data-g="hear:'+k+'">Écouter</button>'+(own?eq('sfx-'+k,G.sfx===k):buy('sfx-'+k,SFX[k].price))); }).join('')+'</ul>';
  h+='<h4 class="shop-h" id="shop-conf">Confettis</h4><p class="note">Style des confettis (nouveau rang, exercice doré, coffre en or).</p><ul class="shop">'+Object.keys(CONFS).map(k=>{ const own=k==='base'||G.confs.includes(k); return li('Confettis « '+esc(CONFS[k].name)+' »',esc(CONFS[k].desc),own?eq('conf-'+k,G.conf===k):buy('conf-'+k,CONFS[k].price)); }).join('')+'</ul>';
  h+='<h4 class="shop-h" id="shop-cadres">Cadres</h4><p class="note">Style de la barre de jeu (rang, XP, pièces).</p><ul class="shop">'+Object.keys(FRAMES).map(k=>{ const own=k==='base'||G.frames.includes(k); return li('Cadre « '+esc(FRAMES[k].name)+' »',esc(FRAMES[k].desc),own?eq('frame-'+k,G.frame===k):buy('frame-'+k)); }).join('')+'</ul></div>';
  return h;
}

function funInit(){
  $('copybox').addEventListener('click',onCopyClick);
  $('bet').addEventListener('click',onBetClick);
}
