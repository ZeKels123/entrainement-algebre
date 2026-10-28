'use strict';
/* ===== Noyau : polynômes, analyse d'expressions, mise en forme ===== */

function keyOf(e){ return Object.keys(e).filter(v=>e[v]>0).sort().map(v=>v+e[v]).join(','); }
function expsOf(k){ const e={}; if(!k) return e; k.split(',').forEach(s=>{ e[s[0]]=parseInt(s.slice(1),10); }); return e; }
function totalDeg(k){ const e=expsOf(k); return Object.keys(e).reduce((s,v)=>s+e[v],0); }
const pconst = n => (n===0?{}:{'':n});
const pvar = v => ({[v+'1']:1});
const pmono = (c,e) => (c===0?{}:{[keyOf(e)]:c});
function padd(a,b){ const r=Object.assign({},a); for(const k in b){ r[k]=(r[k]||0)+b[k]; if(r[k]===0) delete r[k]; } return r; }
function pneg(a){ const r={}; for(const k in a) r[k]=-a[k]; return r; }
function psub(a,b){ return padd(a,pneg(b)); }
function pmul(a,b){
  const r={};
  for(const ka in a) for(const kb in b){
    const e=expsOf(ka), f=expsOf(kb);
    for(const v in f) e[v]=(e[v]||0)+f[v];
    const k=keyOf(e); r[k]=(r[k]||0)+a[ka]*b[kb];
  }
  for(const k in r) if(r[k]===0) delete r[k];
  return r;
}
function ppow(a,n){ let r=pconst(1); for(let i=0;i<n;i++) r=pmul(r,a); return r; }
function peq(a,b){ const ka=Object.keys(a), kb=Object.keys(b); return ka.length===kb.length && ka.every(k=>a[k]===b[k]); }
const pterms = a => Object.keys(a).length;
const psum = arr => arr.reduce(padd,{});
function evalPoly(p,env){ let s=0; for(const k in p){ const e=expsOf(k); let t=p[k]; for(const v in e) t*=Math.pow(env[v],e[v]); s+=t; } return s; }
function varsOfPoly(p){ const s=new Set(); Object.keys(p).forEach(k=>Object.keys(expsOf(k)).forEach(v=>s.add(v))); return [...s].sort(); }
function polyDeg(p){ return Object.keys(p).reduce((m,k)=>Math.max(m,totalDeg(k)),0); }

function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ const t=a%b; a=b; b=t; } return a; }
function isSq(n){ if(n<0) return false; const r=Math.round(Math.sqrt(n)); return r*r===n; }
const sqrtInt = n => Math.round(Math.sqrt(n));
function divisors(n){ n=Math.abs(n); const r=[]; for(let i=1;i*i<=n;i++){ if(n%i===0){ r.push(i); if(i*i!==n) r.push(n/i); } } return r.sort((a,b)=>a-b); }
function content(p){ return Object.values(p).reduce((g,c)=>gcd(g,c),0); }
function commonMono(p){
  const keys=Object.keys(p); if(!keys.length) return {};
  const first=expsOf(keys[0]), cm={};
  for(const v in first){ let m=first[v]; for(const k of keys) m=Math.min(m,expsOf(k)[v]||0); if(m>0) cm[v]=m; }
  return cm;
}
