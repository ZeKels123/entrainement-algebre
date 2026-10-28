'use strict';
/* ---------- Mise en forme ---------- */
function cmpKeys(k1,k2){
  const d=totalDeg(k2)-totalDeg(k1); if(d) return d;
  const e1=expsOf(k1), e2=expsOf(k2);
  const vs=[...new Set([...Object.keys(e1),...Object.keys(e2)])].sort();
  for(const v of vs){ const x=e1[v]||0, y=e2[v]||0; if(x!==y) return y-x; }
  return 0;
}
function monoStr(e){ return Object.keys(e).sort().map(v=>e[v]===1?v:v+'^'+e[v]).join(''); }
function termStr(k,c,first){
  const m=monoStr(expsOf(k)), abs=Math.abs(c);
  const body = m==='' ? String(abs) : (abs===1 ? m : abs+m);
  if(first) return (c<0?'-':'')+body;
  return (c<0?' - ':' + ')+body;
}
function polyStr(p){
  const keys=Object.keys(p).sort(cmpKeys);
  if(!keys.length) return '0';
  return keys.map((k,i)=>termStr(k,p[k],i===0)).join('');
}
const tl = p => Object.keys(p).sort(cmpKeys).map(k=>({[k]:p[k]}));      // liste de termes
const par = p => '('+polyStr(p)+')';
function rawSum(list){                                                    // somme non réduite
  return list.map((t,i)=>{ const s=polyStr(t); if(i===0) return s; return s[0]==='-' ? ' - '+s.slice(1) : ' + '+s; }).join('');
}
const pw = p => { const s=polyStr(p); return s[0]==='-' ? '('+s+')' : s; };   // parenthèse si négatif
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function mInner(s){
  return esc(s)
    .replace(/&[a-z]+;|[a-z]/g,m=>m.length>1?m:'<i>'+m+'</i>')
    .replace(/\^(\d+)/g,'<sup>$1</sup>')
    .replace(/\*/g,'·')
    .replace(/ - /g,' − ')
    .replace(/(^|[(\s])-(?=[\d(a-z<√])/g,'$1−')
    .replace(/(^|[(\s])-$/,'$1−');
}
const FR_W=/[0-9A-Za-zΔπ√²³^α-ωΑ-Ω]/, FR_D=/[0-9]/;
function frMatchBack(s,j){ let d=0; for(let k=j;k>=0;k--){ if(s[k]===')') d++; else if(s[k]==='('){ d--; if(d===0) return k; } } return -1; }
function frMatchFwd(s,j){ let d=0; for(let k=j;k<s.length;k++){ if(s[k]==='(') d++; else if(s[k]===')'){ d--; if(d===0) return k; } } return -1; }
function frLeft(s,end){
  let j=end;
  while(j>0){
    const ch=s[j-1];
    if(ch===')'){ const k=frMatchBack(s,j-1); if(k<0) break; j=k; }
    else if(FR_W.test(ch)) j--;
    else if((ch==='.'||ch===',')&&j>1&&FR_D.test(s[j-2])&&FR_D.test(s[j]||'')) j--;
    else if(j<end){ const m=/\s*[×*·]\s*$/.exec(s.slice(0,j)); if(m&&m.index>0&&m[0].length<=4){ j=m.index; } else break; }
    else break;
  }
  return j;
}
function frRight(s,start){
  let j=start;
  while(j<s.length){
    const ch=s[j];
    if(ch==='('){ const k=frMatchFwd(s,j); if(k<0) break; j=k+1; }
    else if(FR_W.test(ch)) j++;
    else if((ch==='.'||ch===',')&&j>start&&FR_D.test(s[j-1])&&FR_D.test(s[j+1]||'')) j++;
    else break;
  }
  return j;
}
const frBad=t=>/[A-Za-z]{4,}/.test(t);
function frStrip(t){ if(t[0]==='('&&t[t.length-1]===')'&&frMatchFwd(t,0)===t.length-1) return t.slice(1,-1); return t; }
function mFrac(s,depth){
  let out='', pos=0, i=0;
  while(i<s.length){
    if(s[i]==='/'){
      let a=i; while(a>0&&s[a-1]===' ') a--;
      let b=i+1; while(b<s.length&&s[b]===' ') b++;
      const l=frLeft(s,a), r=frRight(s,b);
      const nu=s.slice(l,a), de=s.slice(b,r);
      const okChar=(x)=>!(x&&/\p{L}/u.test(x));
      if(l>=pos && nu&&de && !frBad(nu)&&!frBad(de) && okChar(s[l-1]) && okChar(s[r]) ){
        out+=mInner(s.slice(pos,l))
          +'<span class="fr"><span class="nu">'+(depth<3?mFrac(frStrip(nu),depth+1):mInner(frStrip(nu)))+'</span><span class="sr"> / </span><span class="de">'+(depth<3?mFrac(frStrip(de),depth+1):mInner(frStrip(de)))+'</span></span>';
        pos=r; i=r; continue;
      }
    }
    i++;
  }
  return out+mInner(s.slice(pos));
}
function M(s){ return '<span class="m">'+mFrac(String(s),0)+'</span>'; }
