'use strict';
/* ===== Corrige la copie : une copie d'élève à diagnostiquer ===== */
const COPY_NAMES=['Léo','Emma','Noah','Mila','Luca','Zoé','Nathan','Léa','Elias','Chloé','Gabriel','Lina','Arthur','Julie'];
/* conseils trop généraux pour désigner une erreur précise : jamais proposés comme commentaire */
const COPY_VAGUE=/^(Vérifie le signe de ta solution|Vérifie le signe en regroupant|Attention aux signes|Vérifie tes valeurs|Recompte |Regarde d'abord)/;
const shuffleArr=a=>{ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; } return a; };
function fracOf(x,maxQ){ for(let q=1;q<=(maxQ||12);q++){ const p=Math.round(x*q); if(Math.abs(p/q-x)<1e-9*Math.max(1,Math.abs(x))) return [p,q]; } return null; }
const SQF=[2,3,5,6,7,10,11,13,14,15,17,19,21,22,23,26,29,30,31,33,34,35,37,38,39,41,42,43,46,47,51,53,55,57,58,59];
/* (p/q)·tail, par ex. 3√15/2, 67π/3, −√3 */
function coefStr(p,q,tail){ const s=p<0?'-':'', a=Math.abs(p); const num=(a===1&&tail?'':String(a))+tail; return s+(q===1?num:num+'/'+q); }
/* écriture exacte d'un réel : décimal court, fraction, c√n ou m + c√n ; null sinon */
function niceReal(x){
  if(Math.abs(x)<1e-12) return '0';
  const r3=Math.round(x*1000)/1000; if(Math.abs(r3-x)<1e-9*Math.max(1,Math.abs(x))) return NF(r3);
  const f=fracOf(x,12); if(f) return coefStr(f[0],f[1],'');
  for(const n of SQF){ const c=fracOf(x/Math.sqrt(n),12); if(c&&Math.abs(c[0])<=5000) return coefStr(c[0],c[1],'√'+n); }
  for(const n of SQF){ const s=Math.sqrt(n); for(let k=-400;k<=400;k++){ if(!k) continue; const c=k/4, m=x-c*s, mf=fracOf(m,4); if(mf&&mf[0]!==0){ const cs=fracOf(Math.abs(c),4); return coefStr(mf[0],mf[1],'')+(c<0?' - ':' + ')+coefStr(cs[0],cs[1],'√'+n); } } }
  return null;
}
/* paire {a, b} = a + bπ */
function niceGeoPair(v){
  const hasB=Math.abs(v.b)>=1e-12, hasA=Math.abs(v.a)>=1e-12;
  let bf=null; if(hasB){ bf=fracOf(v.b,12); if(!bf) return null; }
  if(!hasB) return niceReal(v.a);
  if(!hasA) return coefStr(bf[0],bf[1],'π');
  if(v.a<0&&v.b>0){ const as=niceReal(-v.a); return as==null?null:coefStr(bf[0],bf[1],'π')+' - '+as; }
  const as=niceReal(v.a); if(as==null) return null;
  return as+(v.b<0?' - ':' + ')+coefStr(Math.abs(bf[0]),bf[1],'π');
}
/* factorisation gardée par pmulS : 2x(x − 3), (x + 1)(x − 4), (x − 3)^2 */
function prodFactors(P,out){ if(P&&P._f){ prodFactors(P._f[0],out); prodFactors(P._f[1],out); } else out.push(P); return out; }
function prodStr(P){
  const fs=prodFactors(P,[]); let mono=pconst(1); const sums=[];
  fs.forEach(f=>{ if(pterms(f)<=1) mono=pmul(mono,f); else { const k=sums.find(s=>peq(s.p,f)); if(k) k.n++; else sums.push({p:f,n:1}); } });
  if(!pterms(mono)) return '0';
  let ms=polyStr(mono); if(!sums.length) return ms;
  if(ms==='1') ms=''; else if(ms==='-1') ms='-';
  return ms+sums.map(s=>'('+polyStr(s.p)+')'+(s.n>1?'^'+s.n:'')).join('');
}
/* équation P = 0 écrite « termes en x = nombre » */
function eqStr(P){
  let Q=P; const ks=Object.keys(Q).filter(k=>k!=='').sort(cmpKeys);
  if(!ks.length) return polyStr(Q)+' = 0';
  if(Q[ks[0]]<0) Q=pneg(Q);
  const c=Q['']||0, L=Object.assign({},Q); delete L[''];
  return polyStr(L)+' = '+(-c);
}
/* réponse écrite sur la copie : m = erreur fréquente, ou null pour la bonne réponse */
function copyAnswer(ex,m){
  const G=ex.geo;
  if(ex.kind==='expand'){ if(m&&!m.poly) return null; const s=m?polyStr(m.poly):ex.expectedStr; return {plain:s,lines:[M(s)]}; }
  if(ex.kind==='factor'){ const s=m?(m.expr||(m.poly&&m.poly._f?prodStr(m.poly):null)):ex.expectedStr; return s?{plain:s,lines:[M(s)]}:null; }
  if(ex.kind==='geo'){
    if(!G||G.mode==='choice') return null;
    if(G.mode==='fn'){ if(m&&m.s===undefined) return null; const s=G.fn.lhs+' = '+(m?m.s:G.fn.exact); return {plain:s,lines:[M(s)]}; }
    if(!m) return {plain:ex.expectedStr,lines:[ex.expectedHtml]};
    if(!m.v) return null;
    const us=G.unit==='°'?'°':(G.unit?' '+G.unit+(G.pow===2?'²':G.pow===3?'³':''):'');
    const core=G.mode==='round'?NF(Math.round((m.v.a+m.v.b*Math.PI)*Math.pow(10,G.d))/Math.pow(10,G.d)):niceGeoPair(m.v);
    if(core==null) return null;
    return {plain:core+us,lines:[M(core)+esc(us)]};
  }
  if(ex.sys){
    if(ex.sys.type!=='unique') return null;
    if(!m) return {plain:ex.expectedStr,lines:[ex.expectedHtml]};
    if(!m.assign) return null;
    const vs=ex.sys.vars;
    return {plain:vs.map(v=>v+' = '+rStr(m.assign[v])).join(' ; '),lines:[vs.map(v=>M(v+' = '+rStr(m.assign[v]))).join(' ; ')]};
  }
  if(ex.kind==='solve'){
    if(ex.viete||ex.build) return null;
    if(m&&!m.sol) return null;
    const plain=m?solStr(ex.v,m.sol):ex.expectedStr, html=m?solHtml(ex.v,m.sol):ex.expectedHtml, lines=[];
    if(ex.word){ const P=m?m.poly:(ex.eqL&&ex.eqR?psub(ex.eqL,ex.eqR):null); if(P&&pterms(P)) lines.push('Équation : '+M(eqStr(P))); }
    lines.push((ex.word?'Solution : ':'')+html);
    return {plain,lines};
  }
  return null;
}
/* construit la copie (développement complet) : juste 1 fois sur 5, sinon avec une erreur fréquente ; null si l'exercice ne s'y prête pas */
function copyMake(ex,wrongRate){
  if(!ex||!ex.mistakes||ex.mistakes.length<2) return null;
  const txt=h=>String(h).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
  const good=copyDev(ex,null); if(!good) return null;
  let r; try{ r=checkWork(ex,dvPlain(good)); }catch(e){ return null; }
  if(!r||r.status!=='ok') return null;
  const cands=[], seenK={[good.key]:1}, seenM={};
  ex.mistakes.forEach(m=>{
    const t=txt(m.msg); if(!t||seenM[t]||COPY_VAGUE.test(t)) return;
    const d=copyDev(ex,m); if(!d||seenK[d.key]) return;
    let rr; try{ rr=checkWork(ex,dvPlain(d)); }catch(e){ return; }
    if(!rr||rr.status==='ok'||rr.status==='syntax') return;
    seenK[d.key]=1; seenM[t]=1; cands.push({m,d});
  });
  if(cands.length<2) return null;
  const wrong=Math.random()<(wrongRate==null?0.8:wrongRate);
  const sh=shuffleArr(cands.slice()), target=wrong?sh[0]:null;
  const opts=shuffleArr(sh.slice(0,3).map(c=>({html:c.m.msg,ok:c===target,tag:c.m.tag||null})));
  opts.push({html:'La copie est juste : rien à corriger.',ok:!wrong,juste:true});
  const d=wrong?target.d:good;
  let html; try{ html=d.lines.map((l,i)=>dvLineHTML(ex,d,l,i)); }catch(e){ return null; }
  return {name:COPY_NAMES[Math.floor(Math.random()*COPY_NAMES.length)],wrong,plain:dvPlain(d),lines:html,options:opts,tag:target?(target.m.tag||null):null};
}

/* ===== Corrige la copie : développement écrit par l'élève (juste ou avec une erreur) =====
   copyDev(ex, m) → {lines:[{m:'ligne'}|{t:'texte'}], key} ; m = null pour la copie juste.
   Les lignes {m} sont dans la syntaxe du correcteur : elles sont vérifiées par checkWork. */
const dvM=s=>({m:s}), dvT=s=>({t:s});
const dvPlain=d=>d.lines.filter(l=>l.m!=null).map(l=>l.m).join('\n');
const dvNum=n=>n<0?'('+n+')':String(n);
const dvRat=r=>{ const s=rStr(r); return /^-/.test(s)||/\//.test(s)?'('+s+')':s; };
/* facteur affiché dans un produit : x, 3, 2x, (−5), (x + 1) */
function dvF(P){ const s=polyStr(P); if(pterms(P)>1) return '('+s+')'; return /^-/.test(s)?'('+s+')':s; }
function dvSq(P){ const s=polyStr(P); return (pterms(P)===1&&/^[a-z]$/.test(s)||/^\d+$/.test(s))?s+'^2':'('+s+')^2'; }
function dvDedup(lines){ const out=[]; lines.forEach(l=>{ const k=l.m!=null?'m'+l.m:'t'+l.t; if(!out.length||out[out.length-1].k!==k) out.push(Object.assign({k},l)); }); return out.map(({k,...r})=>r); }

/* ---------- Développer : liste des produits, erreur = produit oublié, signe faux ou coefficient faux ---------- */
function dvItems(n){
  if(!hasSum(n)&&n.t!=='num'&&n.t!=='var'){ const P=toPoly(n); if(pterms(P)===1) return [{fs:[P],p:P,neg:false}]; if(!pterms(P)) return []; }
  switch(n.t){
    case 'num': return n.v?[{fs:[pconst(n.v)],p:pconst(n.v),neg:false}]:[];
    case 'var': return [{fs:[pvar(n.n)],p:pvar(n.n),neg:false}];
    case 'add': return dvItems(n.a).concat(dvItems(n.b));
    case 'sub': return dvItems(n.a).concat(dvItems(n.b).map(it=>Object.assign({},it,{p:pneg(it.p),neg:!it.neg})));
    case 'neg': return dvItems(n.a).map(it=>Object.assign({},it,{p:pneg(it.p),neg:!it.neg}));
    case 'mul': { const A=dvItems(n.a), B=dvItems(n.b), r=[]; A.forEach(a=>B.forEach(b=>{ if(a.id||b.id) r.push({fs:null,disp:null,p:pmul(a.p,b.p),neg:a.neg!==b.neg,raw:true}); else r.push({fs:a.fs.concat(b.fs),p:pmul(a.p,b.p),neg:a.neg!==b.neg}); })); return r; }
    case 'pow': {
      const B=dvItems(n.a);
      if(n.n===2&&B.length===2&&!B[0].id&&!B[1].id&&B.every(b=>pterms(b.p)===1)){
        const A0=B[0].p, B0=B[1].p;
        return [{id:true,disp:dvSq(A0),p:pmul(A0,A0),neg:false},{id:true,disp:'2*'+dvF(A0)+'*'+dvF(B0),p:pmul(pconst(2),pmul(A0,B0)),neg:false},{id:true,disp:dvSq(B0),p:pmul(B0,B0),neg:false}];
      }
      let r=[{fs:[],p:pconst(1),neg:false}];
      for(let i=0;i<n.n;i++){ const t=[]; r.forEach(a=>B.forEach(b=>t.push({fs:a.fs&&b.fs?a.fs.concat(b.fs):null,p:pmul(a.p,b.p),neg:a.neg!==b.neg,raw:!(a.fs&&b.fs)}))); r=t; }
      return r;
    }
  }
  return [];
}
function dvItemStr(it){
  if(it.id) return it.disp;
  if(!it.fs) return dvF(it.neg?pneg(it.p):it.p);
  const fs=it.fs.filter((f,i)=>!(it.fs.length>1&&polyStr(f)==='1'));
  return fs.map((f,i)=>i===0&&!/^-/.test(polyStr(f))&&pterms(f)===1?polyStr(f):dvF(f)).join('*');
}
function dvItemsLine(items){ return items.map((it,i)=>(i===0?(it.neg?'-':''):(it.neg?' - ':' + '))+dvItemStr(it)).join(''); }
function expandDev(ex,m){
  let ast; try{ ast=parsePoly(ex.statement).ast; }catch(e){ return null; }
  const items=dvItems(ast); if(!items.length||items.length>12) return null;
  const C=psum(items.map(i=>i.p)); if(!peq(C,ex.expected)) return null;
  const W=m?m.poly:ex.expected; if(!W) return null;
  let ops=items.map(()=>'k'), D=null;
  if(m){
    const n=items.length; let found=null;
    const tryOps=o=>{ const S=psum(items.map((it,i)=>o[i]==='k'?it.p:o[i]==='f'?pneg(it.p):{})); return peq(S,W); };
    const idx=[...Array(n).keys()];
    outer: for(let k=1;k<=3&&!found;k++){
      const combos=[]; const rec=(s,acc)=>{ if(acc.length===k){ combos.push(acc.slice()); return; } for(let i=s;i<n;i++){ acc.push(i); rec(i+1,acc); acc.pop(); } }; rec(0,[]);
      for(const cb of combos){ for(let mask=0;mask<(1<<k);mask++){ const o=items.map(()=>'k'); cb.forEach((i,j)=>{ o[i]=(mask>>j)&1?'f':'r'; }); if(tryOps(o)){ found=o; break outer; } } }
    }
    if(!found){ const Df=psub(W,C), dk=Object.keys(Df); if(dk.length===1){ const i=idx.find(j=>Object.keys(items[j].p).length===1&&Object.keys(items[j].p)[0]===dk[0]); if(i!=null){ found=items.map(()=>'k'); found[i]='c'; D=Df; } } }
    if(!found) return null; ops=found;
  }
  const kept=items.filter((it,i)=>ops[i]!=='r');
  const vals=items.map((it,i)=>ops[i]==='r'?null:ops[i]==='f'?pneg(it.p):ops[i]==='c'?padd(it.p,D):it.p).filter(v=>v&&pterms(v));
  const L1=dvItemsLine(kept), L2=rawSum(vals.length?vals:[pconst(0)]), L3=polyStr(W);
  return {lines:dvDedup([dvM(L1),dvM(L2),dvM(L3)]),key:'p:'+L3};
}

/* ---------- Factoriser : décomposition avec le facteur commun, identité, ou paire de nombres ---------- */
function dvFactors(str){
  let ast; try{ ast=parsePoly(str).ast; }catch(e){ return null; }
  let sign=1; const out=[];
  const rec=n=>{ if(n.t==='neg'){ sign=-sign; rec(n.a); } else if(n.t==='mul'){ rec(n.a); rec(n.b); } else if(n.t==='pow'){ for(let i=0;i<n.n;i++) rec(n.a); } else out.push(toPoly(n)); };
  rec(ast);
  let mono=pconst(sign); const sums=[];
  out.forEach(P=>{ if(pterms(P)<=1) mono=pmul(mono,P); else sums.push(P); });
  return {mono,sums};
}
function factorDev(ex,m){
  const disp=m?(m.expr||(m.poly&&m.poly._f?prodStr(m.poly):null)):ex.expectedStr; if(!disp) return null;
  const F=dvFactors(disp); if(!F) return null;
  const E=ex.expected, lines=[], cg=content(E), cm=commonMono(E), hasCommon=cg>1||Object.keys(cm).length>0;
  const monoS=polyStr(F.mono);
  let fin=disp;
  if(F.sums.length===1&&monoS!=='1'&&monoS!=='-1'&&hasCommon){
    let terms=tl(F.sums[0]);
    // copie fausse : retrouver les termes non réduits (terme non divisé, signe changé, terme oublié)
    const Q=ex.kind==='factor'&&m?(()=>{ try{ const Fc=dvFactors(ex.expectedStr); return Fc&&Fc.sums.length===1&&peq(Fc.mono,F.mono)?Fc.sums[0]:null; }catch(e){ return null; } })():null;
    if(Q&&!peq(Q,F.sums[0])){
      const qs=tl(Q), es=tl(E); let alt=null;
      qs.forEach((q,i)=>{ if(alt) return;
        const cands=[qs.map((x,j)=>j===i?es[i]:x),qs.map((x,j)=>j===i?pneg(x):x),qs.filter((x,j)=>j!==i)];
        cands.forEach(c=>{ if(!alt&&es.length===qs.length&&peq(psum(c),F.sums[0])) alt=c; }); });
      if(alt){ terms=alt; fin=(monoS==='1'?'':dvF(F.mono).replace(/^\((.*)\)$/,'$1'))+'('+rawSum(alt)+')'; }
    }
    lines.push(dvM(terms.map(t=>dvF(F.mono)+'*'+dvF(t)).join(' + ')));
  } else if(!hasCommon&&pterms(E)===2){
    const ks=Object.keys(E), pos=ks.find(k=>E[k]>0), neg=ks.find(k=>E[k]<0);
    const hA=pos!==undefined&&halfTerm(pos,E[pos]), hB=neg!==undefined&&halfTerm(neg,-E[neg]);
    if(hA&&hB) lines.push(dvM(dvSq(hA)+' - '+dvSq(hB)));
  } else if(!hasCommon&&pterms(E)===3){
    const ks=Object.keys(E).sort(cmpKeys), a=ks[0], c=ks[2], b=ks[1];
    const hA=halfTerm(a,E[a]), hC=halfTerm(c,E[c]);
    if(hA&&hC){ const dbl=pmul(pconst(2),pmul(hA,hC)); if(peq({[b]:E[b]},dbl)) lines.push(dvM(dvSq(hA)+' + 2*'+dvF(hA)+'*'+dvF(hC)+' + '+dvSq(hC))); else if(peq({[b]:E[b]},pneg(dbl))) lines.push(dvM(dvSq(hA)+' - 2*'+dvF(hA)+'*'+dvF(hC)+' + '+dvSq(hC))); }
    if(!lines.length&&polyStr(F.mono)==='1'&&F.sums.length===2){
      const v=varsOfPoly(E); if(v.length===1&&E[v[0]+'2']===1&&F.sums.every(s=>s[v[0]+'1']===1&&pterms(s)===2)){
        const r=F.sums[0][''], s=F.sums[1][''];
        lines.push(dvT('Deux nombres de produit '+(E['']||0)+' et de somme '+(E[v[0]+'1']||0)+' : '+r+' et '+s+'.'));
      }
    }
  }
  lines.push(dvM(fin));
  return {lines:dvDedup(lines),key:'p:'+polyStr(m?m.poly:E)};
}

/* ---------- Équations du premier degré ---------- */
function dvWrongExpand(ast,variant){
  // première multiplication « nombre × somme » : on ne multiplie que le premier terme (1) ou on se trompe de signe au second (2)
  let done=false;
  const rec=n=>{
    if(done) return toPoly(n);
    if(n.t==='mul'){ const A=toPoly(n.a), B=toPoly(n.b); const k=pterms(A)===1&&pterms(B)>1?[A,B]:(pterms(B)===1&&pterms(A)>1?[B,A]:null);
      if(k){ done=true; const ts=tl(k[1]); const first=pmul(k[0],ts[0]); const rest=psum(ts.slice(1)); return variant===1?padd(first,rest):psub(first,pmul(k[0],rest)); } }
    switch(n.t){ case 'num': return pconst(n.v); case 'var': return pvar(n.n); case 'add': return padd(rec(n.a),rec(n.b)); case 'sub': return psub(rec(n.a),rec(n.b)); case 'neg': return pneg(rec(n.a)); case 'mul': return pmul(rec(n.a),rec(n.b)); case 'pow': return ppow(rec(n.a),n.n); }
  };
  const P=rec(ast); return done?P:null;
}
function linRoute(L,R,v,op){
  const a1=L[v+'1']||0, l0=L['']||0, a2=R[v+'1']||0, r0=R['']||0;
  if(Object.keys(L).some(k=>k!==''&&k!==v+'1')||Object.keys(R).some(k=>k!==''&&k!==v+'1')) return null;
  const vl=[], cr=[];
  if(a1) vl.push(a1); if(a2) vl.push(op==='signV'?a2:-a2);
  if(r0) cr.push(r0); if(l0&&op!=='dropB') cr.push(op==='signC'?l0:-l0);
  if(!vl.length) return null;
  const k=vl.reduce((s,x)=>s+x,0), mm=cr.reduce((s,x)=>s+x,0); if(!k) return null;
  const lines=[dvM(vl.map((c,i)=>termStr(v+'1',c,i===0)).join('')+' = '+(cr.length?cr.map((c,i)=>termStr('',c,i===0)).join(''):'0')),dvM(polyStr(pmono(k,{[v]:1}))+' = '+mm)];
  let root;
  if(op==='mul'){ root=rat(mm*k,1); lines.push(dvM(v+' = '+dvNum(mm)+'*'+dvNum(k))); }
  else if(op==='inv'){ if(!mm) return null; root=rat(k,mm); }
  else if(op==='sgn'){ root=rat(-mm,k); }
  else root=rat(mm,k);
  lines.push(dvM(v+' = '+rStr(root)));
  return {lines,root};
}
function linDev(ex,m){
  const v=ex.v, L=ex.eqL, R=ex.eqR; if(!L||!R) return null;
  const halves=String(ex.statement).split('='); if(halves.length!==2) return null;
  let aL,aR; try{ aL=parsePoly(halves[0]).ast; aR=parsePoly(halves[1]).ast; }catch(e){ return null; }
  const expanded=polyStr(L)+' = '+polyStr(R), needExp=ex.statement.replace(/\s+/g,'')!==expanded.replace(/\s+/g,'')&&/\(/.test(ex.statement);
  const target=m?(m.sol&&m.sol.type==='set'&&m.sol.roots.length===1&&Array.isArray(m.sol.roots[0])?m.sol.roots[0]:null):null;
  if(m&&!target) return null;
  const tries=m?['signC','signV','dropB','mul','inv','sgn','dist1','dist2']:[null];
  for(const op of tries){
    let L1=L, R1=R, expLine=needExp?dvM(expanded):null;
    if(op==='dist1'||op==='dist2'){ if(!needExp) continue; const vv=op==='dist1'?1:2; const wl=dvWrongExpand(aL,vv), wr=wl?null:dvWrongExpand(aR,vv); if(!wl&&!wr) continue; if(wl) L1=wl; else R1=wr; expLine=dvM(polyStr(L1)+' = '+polyStr(R1)); }
    const r=linRoute(L1,R1,v,op&&op.indexOf('dist')===0?null:op); if(!r) continue;
    if(m&&!rEq(r.root,target)) continue;
    const lines=(expLine?[expLine]:[]).concat(r.lines);
    return {lines:dvDedup(lines),key:'s:'+v+'='+rStr(r.root)};
  }
  return null;
}

/* ---------- Produit nul (facteurs), équations de degré ≥ 2 à racines rationnelles ---------- */
function zeroDev(ex,m){
  const v=ex.v, P=psub(ex.eqL,ex.eqR), sol=ex.solution;
  if(!sol||sol.type!=='set'||!sol.roots.every(r=>Array.isArray(r))) return null;
  const co=coeffsOf(P,v); if(!co) return null;
  const facs=sol.roots.map(r=>({root:r,f:padd(pmono(r[1],{[v]:1}),pconst(-r[0]))})).sort((x,y)=>pterms(x.f)-pterms(y.f));
  let prod=pconst(1); facs.forEach(x=>{ prod=pmul(prod,x.f); });
  const lead=co[co.length-1], plead=coeffsOf(prod,v); if(!plead) return null;
  const c=lead/plead[plead.length-1]; if(!Number.isInteger(c)) return null;
  if(!peq(pmul(pconst(c),prod),P)) return null;
  const ssol=m?m.sol:sol; if(!ssol||ssol.type!=='set'||!ssol.roots.every(r=>Array.isArray(r))) return null;
  const lines=[], Rz=!pterms(ex.eqR), stmtFact=Rz&&/\(/.test(ex.statement);
  if(!Rz) lines.push(dvM(polyStr(P)+' = 0'));
  if(!stmtFact) lines.push(dvM((c===1?'':c===-1?'-':String(c))+facs.map(x=>pterms(x.f)>1?'('+polyStr(x.f)+')':polyStr(x.f)).join('')+' = 0'));
  const subset=ssol.roots.length<sol.roots.length&&ssol.roots.every(r=>sol.roots.some(s=>rEq(r,s)));
  const shown=subset?facs.filter(x=>ssol.roots.some(r=>rEq(r,x.root))):facs;
  lines.push(dvM(shown.map(x=>polyStr(x.f)+' = 0').join(' ou ')));
  lines.push(dvM(solStr(v,ssol)));
  return {lines:dvDedup(lines),key:'s:'+solStr(v,ssol)};
}

/* ---------- Second degré : coefficients, Δ, formule ---------- */
function quadRoute(P,v,op){
  const co=coeffsOf(P,v); if(!co||co.length!==3) return null;
  const c=co[0], b=co[1], a=co[2]; if(!a) return null;
  const D=op==='dSign'?b*b+4*a*c:op==='bSq'?b-4*a*c:b*b-4*a*c;
  const lines=[dvM('a = '+a+' ; b = '+b+' ; c = '+c),dvM('Δ = '+dvNum(b)+(op==='bSq'?'':'^2')+(op==='dSign'?' + ':' - ')+'4*'+dvNum(a)+'*'+dvNum(c)+' = '+D)];
  if(D<0){ lines.push(dvM('aucune solution')); return {lines,sol:{type:'none'}}; }
  const p=op==='mB'?b:-b, s=op==='denA'?a:2*a, sS=s<0?'('+s+')':String(s);
  let sol;
  if(op==='noSqrt'){ sol=setOf([rat(p-D,s),rat(p+D,s)]); lines.push(dvM(v+' = ('+p+' - '+D+')/'+sS+' ou '+v+' = ('+p+' + '+D+')/'+sS)); }
  else{ sol=quadSolFrom(p,D,s);
    if(D===0) lines.push(dvM(v+' = '+p+'/'+sS));
    else if(op==='plus'||op==='minus'){ const sg=op==='plus'?'+':'-'; lines.push(dvM(v+' = ('+p+' '+sg+' √'+D+')/'+sS)); const r=sol.roots.find(x=>Math.abs(rVal(x)-(p+(op==='plus'?1:-1)*Math.sqrt(D))/s)<1e-9); if(!r) return null; sol=setOf([r]); }
    else lines.push(dvM(v+' = ('+p+' - √'+D+')/'+sS+' ou '+v+' = ('+p+' + √'+D+')/'+sS)); }
  lines.push(dvM(solStr(v,sol)));
  return {lines,sol};
}
function quadDev(ex,m){
  const v=ex.v, P0=psub(ex.eqL,ex.eqR), Rz=!pterms(ex.eqR);
  const tries=m?['dSign','bSq','mB','denA','noSqrt','plus','minus','move']:[null];
  for(const op of tries){
    if(op==='move'&&Rz) continue;
    const P=op==='move'?padd(ex.eqL,ex.eqR):P0;
    const r=quadRoute(P,v,op==='move'?null:op); if(!r) continue;
    if(m&&!sameSol(r.sol,m.sol)) continue;
    const lines=(Rz?[]:[dvM(polyStr(P)+' = 0')]).concat(r.lines);
    return {lines:dvDedup(lines),key:'s:'+solStr(v,r.sol)};
  }
  return null;
}

/* ---------- Problèmes : équation posée (juste ou fausse), puis résolution correcte ---------- */
function probDev(ex,m){
  const v=ex.v, P=m?m.poly:psub(ex.eqL,ex.eqR); if(!P||!pterms(P)) return null;
  const co=coeffsOf(P,v); if(!co) return null;
  const lines=[dvM(eqStr(P))]; let sol;
  if(co.length===2){ const r=linRoute(Object.assign({},...Object.keys(P).filter(k=>k!=='').map(k=>({[k]:P[k]}))),pconst(-(P['']||0)),v,null); if(!r) return null; lines.push(...r.lines.slice(1)); sol=setOf([r.root]); }
  else if(co.length===3){ const Q=co[2]<0?pneg(P):P; lines.push(dvM(polyStr(Q)+' = 0')); const r2=quadRoute(Q,v,null); if(!r2) return null; lines.push(...r2.lines.slice(0,-1)); sol=r2.sol; }
  else return null;
  if(ex.answer&&sol.type==='set'){ const pos=sol.roots.filter(r=>rVal(r)>0); if(pos.length&&pos.length<sol.roots.length) sol=setOf(pos); }
  if(m&&m.sol&&!sameSol(sol,m.sol)&&!(ex.answer&&sol.type==='set'&&sol.roots.every(r=>m.sol.type==='set'&&m.sol.roots.some(x=>rEq(x,r))))) return null;
  lines.push(dvM(solStr(v,sol)));
  return {lines:dvDedup(lines),key:'s:'+solStr(v,sol)};
}

/* ---------- Systèmes à deux inconnues : élimination, puis substitution ---------- */
function sysRoute(rows,vars,first,op){
  const i1=first, i2=1-first, [r1,r2]=rows;
  const a1=r1[i1], b1=r1[i2], c1=r1[2], a2=r2[i1], b2=r2[i2], c2=r2[2];
  if(!b1&&!b2) return null;
  const V1=vars[i1], V2=vars[i2], lines=[];
  const rowStr=(a,b,c)=>polyStr(padd(pmono(a,{[V1]:1}),pmono(b,{[V2]:1})))+' = '+c;
  // multiplier (1) par b2 et (2) par b1, puis soustraire
  const s1=b2, s2=b1;
  const C1=op==='rhs1'?c1:c1*s1, C2=op==='rhs2'?c2:c2*s2;
  if(s1!==1&&s1!==0) lines.push(dvM(rowStr(a1*s1,b1*s1,C1))); else if(op==='rhs1') return null;
  if(s2!==1&&s2!==0) lines.push(dvM(rowStr(a2*s2,b2*s2,C2))); else if(op==='rhs2') return null;
  const k=a1*s1-a2*s2; if(!k) return null;
  const mm=op==='comb'?C1+C2:C1-C2;
  lines.push(dvM(polyStr(pmono(k,{[V1]:1}))+' = '+mm));
  const x1=rat(mm,k); lines.push(dvM(V1+' = '+rStr(x1)));
  // remonter dans une équation où V2 apparaît
  const rr=b1?r1:r2, ra=rr[i1], rb=rr[i2], rc=rr[2];
  const rhs=rat(rc*x1[1]-ra*x1[0],x1[1]);
  lines.push(dvM(polyStr(pmono(rb,{[V2]:1}))+' = '+rc+(ra?' - '+dvNum(ra)+'*'+dvRat(x1):'')));
  let x2=rat(rhs[0],rhs[1]*rb);
  if(op==='back') x2=rat(-x2[0],x2[1]);
  if(op==='back2'){ const alt=rat(rc*x1[1]+ra*x1[0],x1[1]); x2=rat(alt[0],alt[1]*rb); }
  lines.push(dvM(V2+' = '+rStr(x2)));
  const vals=[]; vals[i1]=x1; vals[i2]=x2;
  return {lines,vals};
}
/* substitution : on isole une inconnue de coefficient ±1 */
function subRoute(rows,vars,op){
  let ri=-1, vi=-1;
  for(let i=0;i<2&&ri<0;i++) for(let j=0;j<2;j++) if(Math.abs(rows[i][j])===1){ ri=i; vi=j; break; }
  if(ri<0) return null;
  const R=rows[ri], O=rows[1-ri], V=vars[vi], U=vars[1-vi], sv=R[vi], cu=R[1-vi], cc=R[2];
  const eU=-cu*sv, e0=cc*sv, expr=padd(pmono(eU,{[U]:1}),pconst(e0)), exprS=polyStr(expr);
  const oV=O[vi], oU=O[1-vi], oc=O[2];
  if(!oV) return null;
  const lines=[dvM(V+' = '+exprS)];
  lines.push(dvM((oU?polyStr(pmono(oU,{[U]:1}))+(oV<0?' - ':' + '):(oV<0?'-':''))+(Math.abs(oV)===1?'':Math.abs(oV))+'('+exprS+') = '+oc));
  const L=padd(pmono(oU+oV*eU,{[U]:1}),pconst(op==='paren'?e0:oV*e0));
  lines.push(dvM(polyStr(L)+' = '+oc));
  const k=L[U+'1']||0, c0=L['']||0; if(!k) return null;
  lines.push(dvM(polyStr(pmono(k,{[U]:1}))+' = '+(oc-c0)));
  const xU=rat(oc-c0,k); lines.push(dvM(U+' = '+rStr(xU)));
  const f0=op==='back'?-e0:e0;
  lines.push(dvM(V+' = '+(eU===1?'':eU===-1?'-':eU+'*')+dvRat(xU)+(f0?(f0<0?' - ':' + ')+Math.abs(f0):'')));
  const xV=rat(eU*xU[0]+f0*xU[1],xU[1]);
  lines.push(dvM(V+' = '+rStr(xV)));
  const vals=[]; vals[vi]=xV; vals[1-vi]=xU;
  return {lines,vals};
}
function sysDev(ex,m){
  const S=ex.sys; if(!S||S.type!=='unique'||S.vars.length!==2||S.rows.length!==2) return null;
  const vars=S.vars, rows=S.rows;
  const want=m?(m.assign?vars.map(v=>m.assign[v]):null):S.vals; if(!want) return null;
  if(ex.topic==='sy-1'){
    for(const op of (m?['paren','back','swap']:[null])){
      const r=subRoute(rows,vars,op==='swap'?null:op); if(!r) continue;
      let vals=r.vals; if(op==='swap') vals=[vals[1],vals[0]];
      if(!vals.every((x,i)=>rEq(x,want[i]))) continue;
      const fin=vars.map((v,i)=>v+' = '+rStr(vals[i])).join(' ; ');
      return {lines:dvDedup(r.lines.concat([dvM(fin)])),key:'y:'+fin};
    }
    return null;
  }
  const tries=m?[['back',0],['back',1],['back2',0],['back2',1],['swap',0],['rhs1',0],['rhs1',1],['rhs2',0],['rhs2',1],['comb',0],['comb',1]]:[[null,0]];
  for(const [op,first] of tries){
    const r=sysRoute(rows,vars,first,op==='swap'?null:op); if(!r) continue;
    let vals=r.vals; if(op==='swap') vals=[vals[1],vals[0]];
    if(!vals.every((x,i)=>rEq(x,want[i]))) continue;
    const fin=vars.map((v,i)=>v+' = '+rStr(vals[i])).join(' ; ');
    return {lines:dvDedup(r.lines.concat([dvM(fin)])),key:'y:'+fin};
  }
  return null;
}

/* ---------- Géométrie : développements écrits dans les générateurs (work / w) ---------- */
function geoDev(ex,m){
  const G=ex.geo; if(!G||G.mode==='choice') return null;
  const L=m?m.w:ex.work; if(!L||!L.length) return null;
  let key;
  if(G.mode==='fn'){ const s=m?m.s:G.fn.exact; try{ key='f:'+FN_PTS.map((_,k)=>Math.round(fnEval(s,G.fn.vars,fnEnv(G.fn.vars,k))*1e6)).join(','); }catch(e){ return null; } }
  else { const v=m?m.v:G.val; key='g:'+Math.round((v.a+v.b*Math.PI)*1e6); }
  return {lines:L.map(dvM),key,geo:true,fn:G.mode==='fn'};
}

function copyDev(ex,m){
  try{
    if(ex.kind==='geo') return geoDev(ex,m);
    if(ex.kind==='expand') return expandDev(ex,m);
    if(ex.kind==='factor') return factorDev(ex,m);
    if(ex.sys) return sysDev(ex,m);
    if(ex.kind==='solve'){
      if(ex.viete||ex.build) return null;
      if(ex.word) return probDev(ex,m);
      if(/^qd-/.test(ex.topic||'')&&ex.quad){ if(ex.topic==='qd-5'){ const z=zeroDev(ex,m); if(z) return z; } return quadDev(ex,m); }
      const co=coeffsOf(psub(ex.eqL,ex.eqR),ex.v); if(!co) return null;
      if(co.length<=2) return linDev(ex,m);
      return zeroDev(ex,m);
    }
  }catch(e){ return null; }
  return null;
}
/* rendu HTML d'une ligne de copie */
function dvLineHTML(ex,d,l,i){
  if(l.t!=null) return esc(l.t);
  const s=l.m;
  if(d.geo&&!d.fn){ try{ return previewGeo(s); }catch(e){ return M(s); } }
  if(d.geo) return M(s);
  if(ex.kind==='expand'||ex.kind==='factor') return M('= '+s);
  if(/^[a-zé ]+$/i.test(s)) return esc(s);
  return s.split(/\s+ou\s+/).map(x=>M(x)).join(' ou ');
}
