'use strict';
/* ===== Compte (pseudo + mot de passe, Supabase) : synchronisation entre appareils + classement hebdomadaire ===== */
const SYNCKEY='dev-fact-sync-v1', BACKKEY='dev-fact-backup-v1';
const LB_MIN_XP=150, LB_CAP=10000, LB_PUSH_MS=4000;
const LB_REWARDS=[{coins:300,title:'champion'},{coins:200,title:'dauphin'},{coins:120,title:'podium'}];
const SB_URL='https://pgdmtokjwevqmvorujgs.supabase.co', SB_KEY='sb_publishable_raG6hGktoPEhiYepyxKQzA_nMLz1eWS', ACCKEY='dev-fact-acct-v1', MAIL='@dev-fact.app';
const SYNC={st:'init',db:null,user:null,uid:null,name:'',busyAuth:false,authErr:'',meta:null,base:0,busy:false,again:false,timer:null,applying:false,conflict:null,board:[],bready:false,names:{},titles:{},bkey:'',myb:null,err:''};
/* st : init (reconnexion) · out (non connecté) · ok · conflict · err (serveur injoignable) */

/* ---------- accès au serveur (API REST de Supabase, sans bibliothèque) ---------- */
function loadSession(){ try{ const a=JSON.parse(localStorage.getItem(ACCKEY)); if(a&&a.refresh&&a.uid) return a; }catch(e){} return null; }
function saveSession(a){ try{ if(a) localStorage.setItem(ACCKEY,JSON.stringify(a)); else localStorage.removeItem(ACCKEY); }catch(e){} SYNC.sess=a; }
SYNC.sess=loadSession();
const pseudoOk=p=>/^[A-Za-z0-9_.-]{2,20}$/.test(p);
function sessFromAuth(r,pseudo){ return {access:r.access_token,refresh:r.refresh_token,uid:r.user&&r.user.id,name:pseudo||(r.user&&r.user.user_metadata&&r.user.user_metadata.pseudo)||'',exp:Date.now()+((+r.expires_in||3600)-60)*1000}; }
async function rawFetch(path,method,body,token,extra){
  let r;
  try{ r=await fetch(SB_URL+path,{method:method,headers:Object.assign({apikey:SB_KEY,Authorization:'Bearer '+(token||SB_KEY),'Content-Type':'application/json'},extra||{}),body:body===undefined?undefined:JSON.stringify(body)}); }
  catch(e){ throw {code:'network',message:'Serveur injoignable.'}; }
  let j=null; try{ const t=await r.text(); j=t?JSON.parse(t):null; }catch(e){}
  if(!r.ok) throw {code:r.status===401||r.status===403&&!(j&&j.code==='42501')?'auth':'http',status:r.status,body:j,message:(j&&(j.msg||j.message||j.error_description))||('Erreur '+r.status)};
  return j;
}
async function refreshSession(){
  const a=SYNC.sess; if(!a) throw {code:'auth'};
  const r=await rawFetch('/auth/v1/token?grant_type=refresh_token','POST',{refresh_token:a.refresh});
  saveSession(sessFromAuth(r,a.name)); return SYNC.sess;
}
async function sb(path,method,body,extra){
  if(!SYNC.sess) throw {code:'auth'};
  if(Date.now()>SYNC.sess.exp) await refreshSession();
  try{ return await rawFetch(path,method,body,SYNC.sess.access,extra); }
  catch(e){ if(e.code==='auth'){ await refreshSession(); return await rawFetch(path,method,body,SYNC.sess.access,extra); } throw e; }
}
function authMsg(e){
  const m=String((e&&(e.body&&(e.body.error_code||e.body.code)||e.message))||'').toLowerCase();
  if(e&&e.code==='network') return 'Serveur injoignable depuis cette page (réseau ou accès bloqué).';
  if(/invalid_credentials|invalid login/.test(m)) return 'Pseudo ou mot de passe incorrect.';
  if(/user_already_exists|already/.test(m)) return 'Ce pseudo est déjà pris.';
  if(/weak_password|password/.test(m)) return 'Mot de passe refusé : 8 caractères minimum.';
  if(/over_.*rate|rate/.test(m)) return 'Trop d\'essais : réessaie dans quelques minutes.';
  if(/email_not_confirmed|confirm/.test(m)) return 'Le projet exige encore une confirmation par email : désactive « Confirm email » dans Supabase.';
  if(/signup.*disabled/.test(m)) return 'Les inscriptions sont désactivées sur le serveur.';
  return 'Échec : '+(e&&e.message||'erreur inconnue');
}
async function authDo(kind,pseudo,pw){
  if(!pseudoOk(pseudo)) throw {message:'Pseudo : 2 à 20 caractères (lettres, chiffres, _ . -).'};
  if(!pw||pw.length<8) throw {message:'Mot de passe : 8 caractères minimum.'};
  const mail=pseudo.toLowerCase()+MAIL;
  let r;
  if(kind==='signup'){
    r=await rawFetch('/auth/v1/signup','POST',{email:mail,password:pw,data:{pseudo:pseudo}});
    if(!r||!r.access_token) throw {message:'confirm email'};
  } else r=await rawFetch('/auth/v1/token?grant_type=password','POST',{email:mail,password:pw});
  const pseu=(r.user&&r.user.user_metadata&&r.user.user_metadata.pseudo)||pseudo;
  saveSession(sessFromAuth(r,pseu));
}
/* adaptateur : mêmes gestes que la base d'origine (set / onSnapshot / delete) */
function poller(fn,ms){ let stop=false; const run=async()=>{ if(stop) return; try{ await fn(); }catch(e){ } }; run(); const id=setInterval(()=>{ if(typeof document==='undefined'||!document.hidden) run(); },ms); return {stop:()=>{ stop=true; clearInterval(id); },run};}
const REMOTE={
  saveSet:async b=>{ await sb('/rest/v1/saves?on_conflict=user_id','POST',{user_id:SYNC.uid,data:b.j,t:b.t,x:b.x|0,c:b.c|0,n:b.n|0},{Prefer:'resolution=merge-duplicates,return=minimal'}); },
  saveWatch:(cb,er)=>{ let last=undefined, firstDone=false;
    return poller(async()=>{ let rows; try{ rows=await sb('/rest/v1/saves?user_id=eq.'+SYNC.uid+'&select=data,t,x,c,n','GET'); }catch(e){ if(!firstDone&&er) er(e); else if(e.code==='auth') er&&er(e); return; }
      firstDone=true; const row=rows&&rows[0], sig=row?row.t:0; if(last===sig) return; last=sig;
      cb(row?{exists:true,data:()=>({j:row.data,t:+row.t,x:row.x,c:row.c,n:row.n})}:{exists:false,data:()=>undefined}); },20000); },
  boardSet:async d=>{ await sb('/rest/v1/scores?on_conflict=user_id','POST',{user_id:SYNC.uid,name:SYNC.name,cur_w:d.cur.w,cur_xp:Math.min(LB_CAP,d.cur.xp|0),prev_w:d.prev.w,prev_xp:Math.min(LB_CAP,d.prev.xp|0),claims:d.claims,title:d.title||'',upd:new Date().toISOString()},{Prefer:'resolution=merge-duplicates,return=minimal'}); },
  boardDel:async()=>{ await sb('/rest/v1/scores?user_id=eq.'+SYNC.uid,'DELETE'); },
  boardWatch:(cb)=>poller(async()=>{ const rows=await sb('/rest/v1/scores?select=user_id,name,cur_w,cur_xp,prev_w,prev_xp,claims,title','GET');
      cb((rows||[]).map(r=>({id:r.user_id,name:r.name,cur:{w:r.cur_w,xp:r.cur_xp},prev:{w:r.prev_w,xp:r.prev_xp},claims:r.claims||{},title:r.title||''}))); },45000)
};

const pad2=n=>String(n).padStart(2,'0');
function weekStart(off){ const t=new Date(); t.setHours(12,0,0,0); t.setDate(t.getDate()-((t.getDay()+6)%7)+7*(off||0)); return t.getFullYear()+'-'+pad2(t.getMonth()+1)+'-'+pad2(t.getDate()); }
const weekId=()=>weekStart(0);
function weekLeftMs(){ const t=new Date(); const n=new Date(t.getFullYear(),t.getMonth(),t.getDate()+(8-((t.getDay()+6)%7+1)),0,0,0); return Math.max(0,n-t); }
function ensureWeek(){ const w=weekId(); if(G.wk.w!==w){ if(G.wk.w) G.pw={w:G.wk.w,xp:G.wk.xp}; G.wk={w,xp:0}; } }
const weekLabel=w=>{ const p=w.split('-'); return 'semaine du '+(+p[2])+'/'+(+p[1]); };

/* ---------- méta locale (quel compte, dernière version synchronisée, modifications en attente) ---------- */
function loadMeta(){ try{ const m=JSON.parse(localStorage.getItem(SYNCKEY)); if(m&&typeof m==='object') return {uid:m.uid||'',base:+m.base||0,dirty:!!m.dirty}; }catch(e){} return {uid:'',base:0,dirty:false}; }
function saveMeta(){ try{ localStorage.setItem(SYNCKEY,JSON.stringify(SYNC.meta)); }catch(e){} }
SYNC.meta=loadMeta();

const hasProgress=()=>G.xp>0||G.c.n>0||(stats.series||0)>0;
const clone=o=>JSON.parse(JSON.stringify(o));

/* ---------- appelé à chaque sauvegarde locale ---------- */
function syncTouch(){
  if(SYNC.applying) return;
  SYNC.meta.dirty=true; saveMeta();
  if(SYNC.st==='ok') schedulePush();
}
function schedulePush(){ if(SYNC.timer) return; SYNC.timer=setTimeout(()=>{ SYNC.timer=null; syncFlush(); },LB_PUSH_MS); }

function packSave(){
  ensureWeek();
  let s=clone(stats), j=JSON.stringify({g:G,s:s});
  if(j.length>230000){ s.errors={}; j=JSON.stringify({g:G,s:s}); }
  return {t:Math.max(Date.now(),SYNC.base+1),j:j,x:G.xp,c:G.coins,n:G.c.n};
}

async function syncFlush(){
  if(SYNC.st!=='ok') return;
  if(SYNC.busy){ SYNC.again=true; return; }
  SYNC.busy=true;
  try{
    const body=packSave(); SYNC.meta.dirty=false;
    await REMOTE.saveSet(body);
    SYNC.base=body.t; SYNC.meta.uid=SYNC.uid; SYNC.meta.base=body.t; saveMeta();
    SYNC.err='';
  }catch(e){
    SYNC.meta.dirty=true; saveMeta();
    if(e&&e.code==='auth'){ expired(); }
    else { SYNC.err='Serveur injoignable : nouvel essai dans 30 s.'; if(!SYNC.timer) SYNC.timer=setTimeout(()=>{ SYNC.timer=null; syncFlush(); },30000); }
  }
  SYNC.busy=false;
  await boardPush();
  syncUI();
  if(SYNC.again){ SYNC.again=false; schedulePush(); }
}

async function boardPush(){
  if(SYNC.st!=='ok'||!G.lb) return;
  ensureWeek();
  const key=[G.wk.w,G.wk.xp,G.pw.w,G.pw.xp,Object.keys(G.claims).length,G.title||''].join('|');
  if(key===SYNC.bkey) return;
  try{
    const doc={cur:{w:G.wk.w,xp:G.wk.xp},prev:{w:G.pw.w,xp:G.pw.xp},claims:clone(G.claims),title:(G.title&&TITLES[G.title])?G.title:'',upd:Date.now()};
    await REMOTE.boardSet(doc); SYNC.bkey=key; SYNC.myb=doc;
    if(SYNC.bw) SYNC.bw.run();
  }catch(e){ if(e&&e.code==='auth') expired(); }
}

/* ---------- réception du cloud ---------- */
function onCloud(cd){
  const m=SYNC.meta;
  if(!cd){ SYNC.base=0; if(hasProgress()||m.dirty){ SYNC.st='ok'; syncFlush(); } else SYNC.st='ok'; return; }
  if(SYNC.busy) return;
  if(m.uid===SYNC.uid&&m.base===cd.t){ SYNC.base=cd.t; SYNC.st='ok'; if(m.dirty) syncFlush(); return; }
  if(cd.t===SYNC.base) return;
  if(!hasProgress()){ adopt(cd); return; }
  if(m.uid===SYNC.uid&&!m.dirty){ adopt(cd); return; }
  SYNC.conflict=cd; SYNC.st='conflict'; syncUI();
}
function adopt(cd){
  let o=null; try{ o=JSON.parse(cd.j); }catch(e){}
  if(!o||!o.g){ SYNC.st='ok'; return; }
  const lc=G.claims;
  SYNC.applying=true;
  G=normGame(o.g); G.claims=Object.assign({},lc,G.claims); ensureWeek();
  if(o.s&&o.s.topics) stats=o.s;
  try{ localStorage.setItem(GSTORE,JSON.stringify(G)); localStorage.setItem(STORE,JSON.stringify(stats)); }catch(e){}
  SYNC.applying=false;
  SYNC.base=cd.t; SYNC.meta={uid:SYNC.uid,base:cd.t,dirty:false}; saveMeta(); SYNC.conflict=null; SYNC.st='ok'; SYNC.bkey='';
  applyTheme(); renderBar();
  if(!$('view-stats').hidden) renderStats(); if(!$('view-shop').hidden) renderShop(); gameBossZone(); gameRender();
  toast('Progression synchronisée depuis ton compte');
  syncUI(); boardPush(); checkRewards();
}
function resolveConflict(choice){
  const cd=SYNC.conflict; if(!cd) return;
  if(choice==='cloud'){
    try{ localStorage.setItem(BACKKEY,JSON.stringify({d:Date.now(),g:G,s:stats})); }catch(e){}
    adopt(cd);
  } else {
    SYNC.base=cd.t; SYNC.meta.uid=SYNC.uid; SYNC.meta.base=cd.t; SYNC.meta.dirty=true; saveMeta();
    SYNC.conflict=null; SYNC.st='ok'; syncFlush();
  }
  syncUI();
}

/* ---------- classement ---------- */
function entryXp(d,W){
  const v=d&&d.cur&&d.cur.w===W?d.cur.xp:(d&&d.prev&&d.prev.w===W?d.prev.xp:0);
  return Math.max(0,Math.min(LB_CAP,Math.floor(+v||0)));
}
function ranking(W){
  const rows=[]; let seen=false;
  SYNC.board.forEach(b=>{
    if(b.id===SYNC.uid){ seen=true; if(!G.lb) return; rows.push({id:b.id,xp:Math.max(entryXp(b,W),G.wk.w===W?Math.min(LB_CAP,G.wk.xp):(G.pw.w===W?Math.min(LB_CAP,G.pw.xp):0))}); }
    else { const x=entryXp(b,W); rows.push({id:b.id,xp:x}); }
  });
  if(!seen&&G.lb&&SYNC.uid){ const x=G.wk.w===W?G.wk.xp:(G.pw.w===W?G.pw.xp:0); rows.push({id:SYNC.uid,xp:Math.min(LB_CAP,x)}); }
  return rows.filter(r=>r.xp>0).sort((a,b)=>b.xp-a.xp||(a.id<b.id?-1:1));
}
function checkRewards(){
  if(SYNC.st!=='ok'||!G.lb||!SYNC.bready||!SYNC.uid) return;
  ensureWeek(); let granted=false, changed=false;
  for(let k=3;k>=1;k--){
    const W=weekStart(-k);
    if(G.claims[W]!==undefined) continue;
    changed=true;
    if(SYNC.myb&&SYNC.myb.claims&&SYNC.myb.claims[W]!==undefined){ G.claims[W]=SYNC.myb.claims[W]; continue; }
    if(!G.lbSince||W<G.lbSince){ G.claims[W]=0; continue; }
    const r=ranking(W), i=r.findIndex(x=>x.id===SYNC.uid);
    if(i>=0&&i<3&&r.length>=2&&r[i].xp>=LB_MIN_XP){ grantReward(W,i+1); granted=true; }
    else G.claims[W]=0;
  }
  if(changed){ saveGame(); boardPush(); }
  if(granted){ renderBar(); if(!$('view-shop').hidden) renderShop(); if(!$('view-stats').hidden) renderStats(); }
  if(!$('view-lb').hidden) renderLb();
}
function grantReward(W,rank){
  const R=LB_REWARDS[rank-1];
  G.coins+=R.coins; G.c.podium=(G.c.podium||0)+1; if(rank===1) G.c.champion=(G.c.champion||0)+1;
  if(!G.titles.includes(R.title)) G.titles.push(R.title);
  G.claims[W]=rank; G.lastReward={w:W,rank:rank,coins:R.coins};
  toast('Classement hebdomadaire : place '+rank+' ! +'+R.coins+' pièces et le titre « '+TITLES[R.title][0]+' »','goal');
  tone(SND.rank); confetti();
  announceBadges(checkBadges());
}

/* ---------- initialisation ---------- */
function stopWatch(){ ['sw','bw'].forEach(k=>{ if(SYNC[k]){ SYNC[k].stop(); SYNC[k]=null; } }); }
function expired(){ stopWatch(); saveSession(null); SYNC.st='out'; SYNC.authErr='Session expirée : reconnecte-toi.'; syncUI(); }
function startSync(){
  const a=SYNC.sess; SYNC.uid=a.uid; SYNC.name=a.name; SYNC.st='init'; SYNC.authErr=''; SYNC.board=[]; SYNC.bready=false; SYNC.bkey=''; SYNC.myb=null; ensureWeek();
  stopWatch();
  SYNC.sw=REMOTE.saveWatch(snap=>{ onCloud(snap.exists?snap.data():null); syncUI(); },e=>{ if(e&&e.code==='auth') expired(); else { SYNC.st='err'; SYNC.err='Serveur injoignable.'; syncUI(); } });
  SYNC.bw=REMOTE.boardWatch(rows=>{
    SYNC.board=rows; SYNC.bready=true; rows.forEach(r=>{ if(r.name) SYNC.names[r.id]=r.name; SYNC.titles[r.id]=r.title||''; });
    const me=rows.find(b=>b.id===SYNC.uid); if(me) SYNC.myb=me;
    checkRewards(); if(!$('view-lb').hidden) renderLb();
  });
}
async function ping(){
  try{ const r=await fetch(SB_URL+'/auth/v1/settings',{headers:{apikey:SB_KEY}}); SYNC.reach=r.ok; }catch(e){ SYNC.reach=false; }
  if(SYNC.st==='out') syncUI();
}
function syncInit(){
  if(SYNC.sess){ startSync(); } else { SYNC.st='out'; syncUI(); ping(); }
}
async function doAuth(kind){
  const u=($('lb-user')||{}).value||'', p=($('lb-pass')||{}).value||'';
  if(SYNC.busyAuth) return; SYNC.busyAuth=true; SYNC.authErr='Connexion…'; renderLb();
  try{ await authDo(kind,u.trim(),p); SYNC.authErr=''; SYNC.busyAuth=false; startSync(); }
  catch(e){ SYNC.busyAuth=false; SYNC.authErr=authMsg(e); renderLb(); }
}
function logout(){ stopWatch(); if(SYNC.timer){ clearTimeout(SYNC.timer); SYNC.timer=null; } saveSession(null); SYNC.st='out'; SYNC.uid=null; SYNC.conflict=null; SYNC.board=[]; SYNC.myb=null; SYNC.authErr=''; syncUI(); }
async function changePass(){
  const p=($('lb-newpass')||{}).value||''; if(p.length<8){ SYNC.err='Mot de passe : 8 caractères minimum.'; renderLb(); return; }
  try{ await sb('/auth/v1/user','PUT',{password:p}); SYNC.err='Mot de passe modifié.'; }catch(e){ SYNC.err=authMsg(e); }
  renderLb();
}

/* ---------- interface ---------- */
function syncUI(){
  const bar=$('syncbar'), foot=$('foot-note');
  if(bar){
    if(SYNC.st==='conflict'){ bar.hidden=false; bar.innerHTML='<span>Ton compte contient une autre progression que cet appareil.</span><button type="button" class="btn" data-l="goto">Choisir</button>'; }
    else { bar.hidden=true; bar.innerHTML=''; }
  }
  if(foot){
    foot.textContent=SYNC.st==='ok'?'Ta progression est synchronisée avec ton compte (et enregistrée dans ce navigateur).':'Tes résultats sont conservés dans ce navigateur, sur cet appareil uniquement.';
  }
  if(!$('view-lb').hidden) renderLb();
}
function lbDur(ms){ const h=Math.floor(ms/3600000), d=Math.floor(h/24); return d>=1?d+' j '+(h%24)+' h':h+' h '+pad2(Math.floor(ms%3600000/60000))+' min'; }
const lbTitle=id=>{ const k=id===SYNC.uid?G.title:SYNC.titles[id]; return (k&&TITLES[k])?'<small class="lbt">« '+esc(TITLES[k][0])+' »</small>':''; };
const lbName=id=>id===SYNC.uid?'Toi':(SYNC.names[id]||'Joueur');
function lbRows(r,limit){
  const me=r.findIndex(x=>x.id===SYNC.uid), show=r.slice(0,limit);
  let h='<ol class="lbrows">'+show.map((x,i)=>'<li class="'+(x.id===SYNC.uid?'me':'')+(i<3?' top':'')+'"><span class="pos">'+(i+1)+'</span><span class="nm">'+esc(lbName(x.id))+lbTitle(x.id)+'</span><b>'+x.xp+' XP</b></li>').join('')+'</ol>';
  if(me>=limit) h+='<p class="note">Ta place : '+(me+1)+' sur '+r.length+' ('+r[me].xp+' XP).</p>';
  return h;
}
function lbHTML(){
  let h='<div class="course">';
  const st=SYNC.st;
  if(st==='init') return h+'<div class="card"><h3>Compte</h3><p class="note">Connexion en cours…</p></div></div>';
  if(st==='out'){
    return h+'<div class="card"><h3>Compte</h3><p>Crée un compte pour retrouver ta progression sur tous tes appareils et participer au classement hebdomadaire. Il suffit d\'un pseudo et d\'un mot de passe, sans adresse email.</p>'
      +'<form class="acct" id="lb-form" autocomplete="on"><label>Pseudo<input id="lb-user" type="text" autocomplete="username" maxlength="20" autocapitalize="off" spellcheck="false" value="'+esc(SYNC.sess&&SYNC.sess.name||'')+'"></label>'
      +'<label>Mot de passe<input id="lb-pass" type="password" autocomplete="current-password" minlength="8"></label>'
      +(SYNC.reach===false?'<p class="note acct-err" role="alert">Le serveur de comptes n\'est pas joignable depuis cette page (réseau ou accès bloqué).</p>':(SYNC.reach===true?'<p class="note">Serveur de comptes joignable.</p>':''))
      +(SYNC.authErr?'<p class="note acct-err" role="alert">'+esc(SYNC.authErr)+'</p>':'')
      +'<div class="actions"><button type="submit" class="btn primary" data-l="login">Se connecter</button><button type="button" class="btn" data-l="signup">Créer le compte</button></div></form>'
      +'<p class="note">Pseudo : 2 à 20 caractères (lettres, chiffres, _ . -). Mot de passe : 8 caractères minimum. Sans adresse email, un mot de passe oublié ne peut pas être récupéré : note-le. Le pseudo est visible dans le classement si tu y participes. Sans compte, tout continue de fonctionner sur cet appareil.</p></div></div>';
  }
  const stTxt={ok:'Connecté : '+SYNC.name+'. Progression synchronisée.',conflict:'Connecté : '+SYNC.name+'. Choix nécessaire (voir ci-dessous).',err:SYNC.err||'Serveur injoignable.'}[st]||'';
  h+='<div class="card"><h3>Compte</h3><p>'+esc(stTxt)+(SYNC.err&&st==='ok'?' '+esc(SYNC.err):'')+'</p><div class="actions"><button type="button" class="btn" data-l="sync">Synchroniser maintenant</button><button type="button" class="btn" data-l="logout">Se déconnecter</button></div>'
    +'<details class="rules"><summary>Changer le mot de passe</summary><div class="acct"><label>Nouveau mot de passe<input id="lb-newpass" type="password" autocomplete="new-password" minlength="8"></label><div class="actions"><button type="button" class="btn" data-l="pass">Modifier</button></div></div></details></div>';
  if(st==='conflict'&&SYNC.conflict){
    const c=SYNC.conflict;
    h+='<div class="card conflict"><h3>Quelle progression garder ?</h3><p>Cet appareil et ton compte ont chacun une progression différente. L\'autre ne sera pas fusionnée.</p><ul class="lbrew"><li><b>Cet appareil</b> : '+G.xp+' XP, '+G.coins+' pièces, '+G.c.n+' exercices.</li><li><b>Ton compte</b> : '+(c.x||0)+' XP, '+(c.c||0)+' pièces, '+(c.n||0)+' exercices.</li></ul><div class="actions"><button type="button" class="btn primary" data-l="keep">Garder cet appareil</button><button type="button" class="btn" data-l="cloud">Prendre celle du compte</button></div><p class="note">Si tu prends celle du compte, la progression de cet appareil est mise de côté localement (copie de sauvegarde).</p></div>';
    return h+'</div>';
  }
  /* participation */
  const W=weekId(), r=ranking(W);
  if(!G.lb){
    h+='<div class="card"><h3>Classement hebdomadaire</h3><p>Participer rend ton pseudo et tes XP de la semaine visibles par les autres joueurs connectés. Seuls ces deux éléments sont partagés.</p><div class="actions"><button type="button" class="btn primary" data-l="join">Participer au classement</button></div></div>';
  }
  h+='<div class="card"><h3>Cette semaine</h3><p class="note">'+esc(weekLabel(W))+' · fin dans '+lbDur(weekLeftMs())+' (dimanche minuit). Classement sur les XP gagnés cette semaine.</p>'+(r.length?lbRows(r,10):'<p class="empty">Personne n\'a encore d\'XP cette semaine.</p>')
    +(G.lb?'<p class="note">Tes XP cette semaine : <b>'+G.wk.xp+'</b>'+(G.wk.xp<LB_MIN_XP?' · il en faut au moins '+LB_MIN_XP+' pour toucher une récompense.':'')+'</p><div class="actions"><button type="button" class="btn" data-l="leave">Quitter le classement</button></div>':'')+'</div>';
  const pr=ranking(weekStart(-1));
  if(pr.length) h+='<div class="card"><h3>Semaine dernière</h3><p class="note">'+esc(weekLabel(weekStart(-1)))+'</p>'+lbRows(pr,3)+(G.lastReward&&G.lastReward.w===weekStart(-1)?'<p><b>Récompense reçue : place '+G.lastReward.rank+', +'+G.lastReward.coins+' pièces et un titre.</b></p>':'')+'</div>';
  h+='<div class="card"><h3>Récompenses</h3><ul class="lbrew"><li><b>1<sup>re</sup> place</b> : 300 pièces, titre « Champion de la semaine », badge.</li><li><b>2<sup>e</sup> place</b> : 200 pièces, titre « Vice-champion ».</li><li><b>3<sup>e</sup> place</b> : 120 pièces, titre « Sur le podium ».</li></ul><p class="note">Le classement se remet à zéro chaque lundi à minuit. Les récompenses sont versées à l\'ouverture de la page la semaine suivante, à condition d\'avoir au moins '+LB_MIN_XP+' XP et d\'être au moins 2 participants avec des XP. Les scores sont envoyés par chaque appareil : le classement repose sur la confiance.</p></div>';
  return h+'</div>';
}
function renderLb(){ const a=document.activeElement, v=$('view-lb'); if(a&&a.tagName==='INPUT'&&v.contains(a)&&a.value) return; v.innerHTML=lbHTML(); }
async function leaveBoard(){ G.lb=false; saveGame(); try{ if(SYNC.uid&&SYNC.sess) await REMOTE.boardDel(); }catch(e){} SYNC.bkey=''; SYNC.myb=null; renderLb(); }
function lbClick(e){
  const b=e.target.closest('[data-l]'); if(!b) return; const a=b.dataset.l;
  if(a==='goto') setTab('lb');
  else if(a==='join'){ ensureWeek(); G.lb=true; if(!G.lbSince) G.lbSince=weekId(); saveGame(); SYNC.bkey=''; boardPush().then(()=>{ renderLb(); }); renderLb(); }
  else if(a==='leave') leaveBoard();
  else if(a==='sync'){ if(SYNC.st==='err') startSync(); else syncFlush(); }
  else if(a==='signup') doAuth('signup');
  else if(a==='logout') logout();
  else if(a==='pass') changePass();
  else if(a==='keep') resolveConflict('local');
  else if(a==='cloud') resolveConflict('cloud');
}
function lbInit(){ $('view-lb').addEventListener('click',lbClick); $('view-lb').addEventListener('submit',e=>{ e.preventDefault(); doAuth('login'); }); $('syncbar').addEventListener('click',lbClick); }
