'use strict';
/* ===== Révision espacée (Leitner) et défis quotidiens ===== */
const SRS_KEY='dev-fact-srs-v1', SRS_INT=[1,3,7,14,30];
let SR=(function(){ try{ const s=JSON.parse(localStorage.getItem(SRS_KEY)); if(s&&s.t) return s; }catch(e){} return {t:{}}; })();
function saveSR(){ try{ localStorage.setItem(SRS_KEY,JSON.stringify(SR)); }catch(e){} }
function srsUpdate(topic,kind){
  const cur=SR.t[topic]||{b:0,due:''}; let b=cur.b;
  if(kind==='clean') b=Math.min(5,b+1); else if(kind==='helped') b=Math.max(1,b); else b=1;
  const wait=(kind==='clean')?SRS_INT[b-1]:1;
  SR.t[topic]={b,due:dayStr(wait)}; saveSR();
}
function srsDueIds(dom){
  const today=dayStr(0);
  return Object.keys(SR.t).filter(id=>TOPICS[id]&&SR.t[id].due<=today&&(!dom||domainOf(TOPICS[id].kind)===dom)).sort((a,b)=>SR.t[a].due<SR.t[b].due?-1:1);
}
function srsPool(){
  const ids=srsDueIds(S.domain), pool=[];
  ids.forEach(id=>{ const w=Math.max(1,6-SR.t[id].b); for(let i=0;i<w;i++) pool.push(id); });
  return pool.length?pool:null;
}
function srsCardHTML(){
  const doms=DOMBR[S.domain]?BRDOMS[DOMBR[S.domain]].map(d=>[d,DOM_TITLE[d]]):[['alg','Algèbre'],['eq','Équations'],['geo','Géométrie']];
  const tot=doms.reduce((a,d)=>a+srsDueIds(d[0]).length,0);
  let h='<div class="card"><h3>À revoir <span class="cnt">'+tot+'</span></h3>';
  if(!Object.keys(SR.t).length) return h+'<p class="note">Aucun thème suivi pour l\'instant. Chaque thème que tu travailles revient ensuite après 1, 3, 7, 14 puis 30 jours si tu le réussis sans aide (dès le lendemain si tu as eu besoin d\'aide).</p></div>';
  h+='<p class="note">Un thème réussi sans aide revient après 1, 3, 7, 14 puis 30 jours. Un thème raté ou aidé revient dès le lendemain.</p>';
  doms.forEach(d=>{ const ids=srsDueIds(d[0]);
    h+='<p style="margin-top:8px"><b>'+d[1]+'</b> : '+(ids.length?ids.length+' thème'+(ids.length>1?'s':'')+' à revoir':'rien à revoir aujourd\'hui')+'</p>';
    if(ids.length) h+='<ul class="plain">'+ids.slice(0,6).map(id=>'<li>'+esc(TOPICS[id].label)+' <span class="muted">(niveau '+TOPICS[id].level+', boîte '+SR.t[id].b+' sur 5)</span></li>').join('')+(ids.length>6?'<li class="muted">… et '+(ids.length-6)+' autres</li>':'')+'</ul><div class="actions"><button type="button" class="btn" data-g="srsgo:'+d[0]+'">Réviser en '+d[1]+'</button></div>';
  });
  return h+'</div>';
}
function srsGo(dom){ setDomain(dom,'train'); S.mode='srs'; S.pool=null; renderSetup(); newSeries(); }

/* ---------- défis quotidiens ---------- */
const DQ_TYPES=['clean','dom','combo','lvl','series','rev','copy'];
function seedRand(str){ let h=2166136261; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619); } return function(){ h+=0x6D2B79F5; let t=h; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }
function dqMake(day){
  const R=seedRand(day), pk=a=>a[Math.floor(R()*a.length)];
  const types=DQ_TYPES.slice(); const out=[];
  for(let i=0;i<3;i++){ const t=types.splice(Math.floor(R()*types.length),1)[0]; let c={t,n:1,p:0,done:false};
    if(t==='clean') c.n=pk([8,10,12]);
    if(t==='dom'){ c.d=pk(['alg','eq','geo']); c.n=pk([5,6,7]); }
    if(t==='combo') c.n=pk([4,5,6]);
    if(t==='lvl'){ c.l=pk([3,4]); c.n=pk([3,4]); }
    if(t==='series') c.n=8;
    if(t==='rev') c.n=pk([4,5]);
    if(t==='copy') c.n=pk([3,4,5]);
    c.xp=t==='combo'||t==='series'?30:20+(c.n>=8?5:0); c.coins=t==='combo'||t==='series'?5:3;
    out.push(c); }
  return out;
}
const DOMN={alg:'Algèbre',eq:'Équations',geo:'Géométrie'};
function dqText(c){
  if(c.t==='clean') return 'Réussis '+c.n+' exercices du premier coup, sans indice';
  if(c.t==='dom') return 'Réussis '+c.n+' exercices sans aide en '+DOMN[c.d];
  if(c.t==='combo') return 'Atteins un combo ×'+c.n;
  if(c.t==='lvl') return 'Réussis '+c.n+' exercices de niveau '+c.l+' ou plus, sans aide';
  if(c.t==='series') return 'Termine une série avec un score d\'au moins 8 / 10';
  if(c.t==='copy') return 'Corrige '+c.n+' copies du premier coup, sans indice (mode « Corrige la copie »)';
  return 'Réussis '+c.n+' exercices sans aide en mode « À revoir » ou « Chasse aux erreurs »';
}
function dqEnsure(){ const d=dayStr(0); if(!G.dq||G.dq.d!==d) G.dq={d,l:dqMake(d)}; return G.dq; }
function dqDoneN(){ return dqEnsure().l.filter(c=>c.done).length; }
function dqBump(c,v,abs){
  if(c.done) return;
  c.p=abs?Math.max(c.p,v):c.p+v;
  if(c.p>=c.n){ c.p=c.n; c.done=true; G.c.dqDone=(G.c.dqDone||0)+1; addXp(c.xp); G.coins+=c.coins;
    toast('Défi réussi : +'+c.xp+' XP, +'+c.coins+' pièces','goal');
    if(G.dq.l.every(x=>x.done)){ G.c.dqAll=(G.c.dqAll||0)+1; addXp(40); G.coins+=10; toast('Trois défis réussis aujourd\'hui : +40 XP, +10 pièces','goal'); } }
}
function dqResolve(kind){
  const dq=dqEnsure(), clean=kind==='clean', L=S.ex.level||1;
  dq.l.forEach(c=>{
    if(c.t==='clean'&&clean) dqBump(c,1);
    else if(c.t==='dom'&&clean&&S.domain===c.d) dqBump(c,1);
    else if(c.t==='combo') dqBump(c,S.combo||0,true);
    else if(c.t==='lvl'&&clean&&L>=c.l) dqBump(c,1);
    else if(c.t==='rev'&&clean&&(S.mode==='review'||S.mode==='srs')) dqBump(c,1);
    else if(c.t==='copy'&&clean&&S.ex.copy) dqBump(c,1);
  });
}
function dqSeries(sc){ if(S.boss) return; dqEnsure().l.forEach(c=>{ if(c.t==='series'&&sc>=8) dqBump(c,1); }); }
function dqCardHTML(){
  const dq=dqEnsure();
  return '<div class="card"><h3>Défis du jour <span class="cnt">'+dqDoneN()+' / 3</span></h3><ul class="dq">'+dq.l.map(c=>'<li class="'+(c.done?'done':'')+'"><span>'+esc(dqText(c))+'</span><span class="dq-r">'+(c.done?'Réussi':Math.min(c.p,c.n)+' / '+c.n)+' · +'+c.xp+' XP, +'+c.coins+' pièces</span><span class="g-bar" aria-hidden="true"><i style="width:'+Math.round(100*Math.min(c.p,c.n)/c.n)+'%"></i></span></li>').join('')+'</ul><p class="note">Trois nouveaux défis chaque jour. Les trois réussis : +40 XP et +10 pièces de plus.</p></div>';
}
function srsPills(){
  const n=srsDueIds().length, d=dqDoneN();
  return '<span class="g-it'+(d>=3?' done':'')+'"><span class="lbl">Défis</span><b>'+d+' / 3</b></span>'+(n?'<span class="g-it"><span class="lbl">À revoir</span><b>'+n+'</b></span>':'');
}
