'use strict';
/* ---------- Analyse d'une saisie ---------- */
class ParseError extends Error {}

function tokenize(s,allowDiv){
  s=s.replace(/[−–—]/g,'-').replace(/[×·⋅∙]/g,'*').replace(/ /g,' ').replace(/[\[{]/g,'(').replace(/[\]}]/g,')').replace(/,/g,'.');
  const t=[]; let i=0;
  while(i<s.length){
    const c=s[i];
    if(/\s/.test(c)){ i++; continue; }
    if(/[0-9]/.test(c)){
      let j=i; while(j<s.length && /[0-9]/.test(s[j])) j++;
      if(s[j]==='.') throw new ParseError("Les nombres décimaux ne sont pas utilisés ici : écris des entiers.");
      t.push({k:'num',v:parseInt(s.slice(i,j),10)}); i=j; continue;
    }
    if(/[a-z]/i.test(c)){ t.push({k:'var',v:c.toLowerCase()}); i++; continue; }
    if(c==='²'){ t.push({k:'sup',v:2}); i++; continue; }
    if(c==='³'){ t.push({k:'sup',v:3}); i++; continue; }
    if('+-*^()'.includes(c)){ t.push({k:c}); i++; continue; }
    if((c==='/'||c==='÷')&&allowDiv){ t.push({k:'/'}); i++; continue; }
    if(c==='/'||c==='÷') throw new ParseError("La division n'est pas utilisée ici : écris ton résultat avec des produits et des sommes.");
    throw new ParseError('Caractère non reconnu : « '+c+' ».');
  }
  return t;
}

function parse(str,allowDiv){
  const toks=tokenize(str,allowDiv);
  if(!toks.length) throw new ParseError('Écris ton expression dans la zone de saisie.');
  for(let i=0;i<toks.length-1;i++){
    const a=toks[i], b=toks[i+1];
    if(a.k==='var' && b.k==='num') throw new ParseError('« '+a.v+b.v+' » n\'est pas clair. Pour un carré, écris '+a.v+'^'+b.v+' ou '+a.v+'² ; pour un produit, écris '+b.v+a.v+'.');
    if(a.k==='num' && b.k==='num') throw new ParseError('Deux nombres se suivent sans opérateur : ajoute +, − ou ×.');
    if(a.k===')' && b.k==='num') throw new ParseError('Pour multiplier une parenthèse par un nombre, écris le nombre avant la parenthèse : 2(x+1).');
  }
  let i=0;
  const peek=()=>toks[i], next=()=>toks[i++];
  const startsAtom=t=>t && (t.k==='num'||t.k==='var'||t.k==='(');
  function expr(){
    let left=term();
    while(peek() && (peek().k==='+'||peek().k==='-')){
      const op=next().k; const right=term();
      left={t:op==='+'?'add':'sub',a:left,b:right};
    }
    return left;
  }
  function term(){
    let left=unary();
    while(peek()){
      if(peek().k==='*'){ next(); left={t:'mul',a:left,b:unary()}; }
      else if(peek().k==='/'){ next(); left={t:'div',a:left,b:unary()}; }
      else if(startsAtom(peek())){ left={t:'mul',a:left,b:power()}; }
      else break;
    }
    return left;
  }
  function unary(){
    const t=peek();
    if(t && t.k==='-'){ next(); return {t:'neg',a:unary()}; }
    if(t && t.k==='+'){ next(); return unary(); }
    return power();
  }
  function power(){
    let base=atom(); const t=peek();
    if(t && t.k==='^'){
      next(); const e=next();
      if(!e || e.k!=='num') throw new ParseError('Après ^, écris un exposant entier positif (par exemple x^2).');
      if(e.v>6) throw new ParseError('Exposant trop grand pour cet exercice.');
      base={t:'pow',a:base,n:e.v};
    } else if(t && t.k==='sup'){ next(); base={t:'pow',a:base,n:t.v}; }
    return base;
  }
  function atom(){
    const t=next();
    if(!t) throw new ParseError("L'expression est incomplète : il manque quelque chose à la fin.");
    if(t.k==='num') return {t:'num',v:t.v};
    if(t.k==='var') return {t:'var',n:t.v};
    if(t.k==='('){
      if(peek() && peek().k===')') throw new ParseError('Parenthèses vides.');
      const e=expr(); const c=next();
      if(!c || c.k!==')') throw new ParseError('Il manque une parenthèse fermante.');
      return e;
    }
    if(t.k===')') throw new ParseError('Parenthèse fermante en trop.');
    if(t.k==='sup') throw new ParseError('Un exposant doit suivre une lettre ou une parenthèse.');
    throw new ParseError('Symbole inattendu : « '+t.k+' ».');
  }
  const ast=expr();
  if(i<toks.length){ const t=toks[i]; throw new ParseError(t.k===')' ? 'Parenthèse fermante en trop.' : 'Expression mal formée près de « '+(t.v!==undefined?t.v:t.k)+' ».'); }
  return ast;
}

function toPoly(n){
  let r;
  switch(n.t){
    case 'num': return pconst(n.v);
    case 'var': return pvar(n.n);
    case 'add': r=padd(toPoly(n.a),toPoly(n.b)); break;
    case 'sub': r=psub(toPoly(n.a),toPoly(n.b)); break;
    case 'mul': r=pmul(toPoly(n.a),toPoly(n.b)); break;
    case 'neg': r=pneg(toPoly(n.a)); break;
    case 'pow': r=ppow(toPoly(n.a),n.n); break;
  }
  if(polyDeg(r)>14) throw new ParseError('Expression trop grande pour cet exercice.');
  return r;
}
function parsePoly(str){ const ast=parse(str); return {ast, poly:toPoly(ast)}; }
/* équations : division autorisée (par un nombre ou une expression) ; chaque côté est une fraction N/D de polynômes */
function pSame(a,b){ const ka=Object.keys(a),kb=Object.keys(b); return ka.length===kb.length&&ka.every(k=>a[k]===b[k]); }
function toRat(n){
  switch(n.t){
    case 'num': case 'var': return {N:toPoly(n),D:pconst(1)};
    case 'add': case 'sub': { const a=toRat(n.a), b=toRat(n.b), sg=n.t==='add'?1:-1; const bn=sg>0?b.N:pneg(b.N);
      if(pSame(a.D,b.D)) return {N:padd(a.N,bn),D:a.D};
      return {N:padd(pmul(a.N,b.D),pmul(bn,a.D)),D:pmul(a.D,b.D)}; }
    case 'neg': { const a=toRat(n.a); return {N:pneg(a.N),D:a.D}; }
    case 'mul': { const a=toRat(n.a), b=toRat(n.b); return {N:pmul(a.N,b.N),D:pmul(a.D,b.D)}; }
    case 'pow': { const a=toRat(n.a); return {N:ppow(a.N,n.n),D:ppow(a.D,n.n)}; }
    case 'div': { const a=toRat(n.a), b=toRat(n.b);
      if(!Object.keys(b.N).length) throw new ParseError('Division par zéro : le diviseur vaut 0.');
      return {N:pmul(a.N,b.D),D:pmul(a.D,b.N)}; }
  }
}
function ratEq(strL,strR){
  const aL=parse(strL,true), aR=parse(strR,true), L=toRat(aL), R=toRat(aR);
  const P=psub(pmul(L.N,R.D),pmul(R.N,L.D));
  if(polyDeg(P)>14) throw new ParseError('Expression trop grande pour cet exercice.');
  return {L:{ast:aL},R:{ast:aR},P};
}

/* ---------- Affichage de l'arbre tel qu'il a été saisi ---------- */
function astStr(n,ctx){
  ctx=ctx||'top';
  switch(n.t){
    case 'num': return String(n.v);
    case 'var': return n.n;
    case 'pow': return astStr(n.a,'powBase')+'^'+n.n;
    case 'div': { let d=astStr(n.b,'divR'); if(!/^[0-9a-z]+$/.test(d)&&!/^\(.*\)$/.test(d)) d='('+d+')'; const s=astStr(n.a,'divL')+'/'+d; return (ctx==='powBase'||ctx==='negArg'||ctx==='mulL'||ctx==='mulR'||ctx==='divL'||ctx==='divR')?'('+s+')':s; }
    case 'neg': { const s='-'+astStr(n.a,'negArg'); return (ctx==='top'||ctx==='mulL') ? s : '('+s+')'; }
    case 'add': case 'sub': {
      const s=astStr(n.a,'addL')+(n.t==='add'?' + ':' - ')+astStr(n.b,'addR');
      return (ctx==='top'||ctx==='addL') ? s : '('+s+')';
    }
    case 'mul': {
      const l=astStr(n.a,'mulL'), r=astStr(n.b,'mulR');
      const s=l+(/^[0-9]/.test(r)?'*':'')+r;
      return ctx==='powBase' ? '('+s+')' : s;
    }
  }
}

/* ---------- Structure : développé ? factorisé ? ---------- */
function addTerms(n){ return (n.t==='add'||n.t==='sub') ? addTerms(n.a).concat(addTerms(n.b)) : [n]; }
function hasSum(n){
  switch(n.t){
    case 'add': case 'sub': return true;
    case 'num': case 'var': return false;
    case 'neg': return hasSum(n.a);
    case 'mul': return hasSum(n.a)||hasSum(n.b);
    case 'pow': return hasSum(n.a);
  }
}
const stripNeg = n => { while(n.t==='neg') n=n.a; return n; };
function isDeveloped(ast){ return addTerms(ast).every(t=>!hasSum(t)); }
function duplicateKeys(ast){
  const cnt={};
  addTerms(ast).forEach(t=>{ Object.keys(toPoly(t)).forEach(k=>{ cnt[k]=(cnt[k]||0)+1; }); });
  return Object.keys(cnt).filter(k=>cnt[k]>1);
}

function halfTerm(k,c){
  if(c<=0 || !isSq(c)) return null;
  const e=expsOf(k), h={};
  for(const v in e){ if(e[v]%2) return null; h[v]=e[v]/2; }
  return pmono(sqrtInt(c),h);
}
function hasRationalRoot(co){
  const d=co.length-1; if(!co[0]||!co[d]) return false;
  for(const p of divisors(co[0])) for(const q of divisors(co[d])) for(const s of [1,-1]){
    const r=s*p; let sum=0;
    for(let i=0;i<=d;i++) sum+=co[i]*Math.pow(r,i)*Math.pow(q,d-i);
    if(sum===0) return true;
  }
  return false;
}
/* Renvoie null si le polynôme est irréductible « pour un élève », sinon la raison. */
function canFactorFurther(p){
  const keys=Object.keys(p); if(keys.length<2) return null;
  const c=content(p); if(c>1) return {type:'content',g:c};
  const cm=commonMono(p); if(Object.keys(cm).length) return {type:'monome',m:monoStr(cm)};
  if(keys.length===2){
    const [k1,k2]=keys;
    if(p[k1]*p[k2]<0){
      const pos=p[k1]>0?k1:k2, neg=p[k1]>0?k2:k1;
      if(halfTerm(pos,p[pos]) && halfTerm(neg,-p[neg])) return {type:'diffsq'};
    }
  }
  if(keys.length===3){
    for(let i=0;i<3;i++){
      const a=keys[i], b=keys[(i+1)%3], m=keys[(i+2)%3];
      const ha=halfTerm(a,p[a]), hb=halfTerm(b,p[b]);
      if(ha && hb){
        const dbl=pmul(pconst(2),pmul(ha,hb)), rest={[m]:p[m]};
        if(peq(rest,dbl)||peq(rest,pneg(dbl))) return {type:'square'};
      }
    }
  }
  const vs=varsOfPoly(p);
  if(vs.length===1){
    const v=vs[0], d=Math.max(...keys.map(k=>expsOf(k)[v]||0));
    if(d>=2){
      const co=[]; for(let i=0;i<=d;i++) co.push(p[keyOf(i?{[v]:i}:{})]||0);
      if(d===2){ const disc=co[1]*co[1]-4*co[2]*co[0]; if(disc>=0 && isSq(disc)) return {type:disc===0?'square':'trinome'}; }
      else if(hasRationalRoot(co)) return {type:'racine'};
    }
  }
  if(vs.length===2 && keys.every(k=>totalDeg(k)===2)){
    const [u,w]=vs;
    const A=p[keyOf({[u]:2})]||0, B=p[keyOf({[u]:1,[w]:1})]||0, C=p[keyOf({[w]:2})]||0;
    const disc=B*B-4*A*C;
    if(disc>=0 && isSq(disc)) return {type:disc===0?'square':'trinome'};
  }
  return null;
}

function collectFactors(n,out){
  switch(n.t){
    case 'neg': collectFactors(n.a,out); break;
    case 'mul': collectFactors(n.a,out); collectFactors(n.b,out); break;
    case 'pow': collectFactors(n.a,out); break;
    default: out.push(n);
  }
}
function analyzeFactored(ast){
  const top=stripNeg(ast);
  if(top.t==='add'||top.t==='sub') return {ok:false};
  const facs=[]; collectFactors(ast,facs);
  const problems=[];
  facs.forEach(f=>{
    if(f.t==='add'||f.t==='sub'){
      const poly=toPoly(f), shown=astStr(f);
      const r=canFactorFurther(poly);
      if(r) problems.push(Object.assign({factor:shown,poly},r));
      else if(addTerms(f).length!==pterms(poly) || addTerms(f).some(hasSum)) problems.push({factor:shown,poly,type:'notreduced',reduced:polyStr(poly)});
    }
  });
  return {ok:true,factors:facs,problems};
}
