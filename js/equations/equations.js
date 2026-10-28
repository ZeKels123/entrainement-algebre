'use strict';
/* ===== Équations : rationnels, résolution exacte, générateurs ===== */
const rat=(n,d)=>{ d=d===undefined?1:d; if(d<0){ n=-n; d=-d; } const g=gcd(n,d)||1; return [n/g,d/g]; };
const isR=r=>Array.isArray(r);
const rVal=r=>isR(r)?r[0]/r[1]:(r.user?r.val:(r.p+r.sg*r.q*Math.sqrt(r.r))/r.s);
const rEq=(a,b)=>{ if(isR(a)&&isR(b)) return a[0]===b[0]&&a[1]===b[1]; const x=rVal(a), y=rVal(b); return Math.abs(x-y)<=1e-9*Math.max(1,Math.abs(x)); };
function irrStr(r){
  const rad=(r.q===1?'':r.q)+'\u221a'+r.r;
  if(r.p===0){ const num=(r.sg<0?'-':'')+rad; return r.s===1?num:num+'/'+r.s; }
  const num=r.p+(r.sg<0?' - ':' + ')+rad; return r.s===1?num:'('+num+')/'+r.s;
}
const rStr=r=>isR(r)?(r[1]===1?String(r[0]):r[0]+'/'+r[1]):(r.user?r.str:irrStr(r));
const rSet=arr=>{ const out=[]; arr.forEach(r=>{ if(!out.some(o=>rEq(o,r))) out.push(r); }); return out.sort((a,b)=>rVal(a)-rVal(b)); };
const sameSol=(a,b)=>{ if(!a||!b||a.type!==b.type) return false; if(a.type!=='set') return true; return a.roots.length===b.roots.length&&a.roots.every((r,i)=>rEq(r,b.roots[i])); };
const setOf=arr=>({type:'set',roots:rSet(arr),complete:true});
function solStr(v,sol){ if(sol.type==='none') return 'aucune solution'; if(sol.type==='all') return 'tous les réels'; return sol.roots.map(r=>v+' = '+rStr(r)).join(' ou '); }
function solHtml(v,sol){ if(sol.type==='none') return 'aucune solution'; if(sol.type==='all') return 'tous les réels'; return sol.roots.map(r=>M(v+' = '+rStr(r))).join(' ou '); }
/* racines irrationnelles (p ± q√r)/s */
function sqfree(n){ let out=1, r=n; for(let f=2;f*f<=r;f++){ while(r%(f*f)===0){ out*=f; r/=f*f; } } return [out,r]; }
function irrRoot(p,q,r,s,sg){ if(s<0){ p=-p; s=-s; q=-q; } if(q<0){ q=-q; sg=-sg; } const g=gcd(gcd(p,q),s)||1; return {irr:true,p:p/g,q:q/g,r,s:s/g,sg}; }
function quadSolFrom(p,D,s){          // solutions de (p ± √D)/s
  if(D<0) return {type:'none'};
  if(D===0) return setOf([rat(p,s)]);
  const k=Math.round(Math.sqrt(D)); if(k*k===D) return setOf([rat(p+k,s),rat(p-k,s)]);
  const [o,r]=sqfree(D); return setOf([irrRoot(p,o,r,s,1),irrRoot(p,o,r,s,-1)]);
}
function coeffsOf(P,v){
  let d=0; for(const k in P){ const e=expsOf(k); if(Object.keys(e).some(x=>x!==v)) return null; d=Math.max(d,e[v]||0); }
  const co=new Array(d+1).fill(0); for(const k in P) co[expsOf(k)[v]||0]+=P[k]; return co;
}
function divLin(co,p,q){                    // division exacte par (q x - p), coefficients croissants
  const d=co.length-1, out=new Array(d).fill(0), rem=co.slice();
  for(let i=d;i>=1;i--){ const lead=rem[i]; if(lead%q!==0) return null; const t=lead/q; out[i-1]=t; rem[i]=0; rem[i-1]+=t*p; }
  return rem[0]===0?out:null;
}
function solvePoly(P){
  const vs=varsOfPoly(P); if(vs.length>1) return null;
  const v=vs[0]||'x'; let co=coeffsOf(P,v); if(!co) return null;
  while(co.length>1&&co[co.length-1]===0) co.pop();
  if(co.length===1) return co[0]===0?{type:'all'}:{type:'none'};
  const roots=[];
  while(co.length>1){
    if(co[0]===0){ roots.push(rat(0)); co=co.slice(1); continue; }
    const d=co.length-1; let found=null;
    outer: for(const p of divisors(co[0])) for(const q of divisors(co[d])) for(const s of [1,-1]){
      let sum=0; for(let i=0;i<=d;i++) sum+=co[i]*Math.pow(s*p,i)*Math.pow(q,d-i);
      if(sum===0){ found=[s*p,q]; break outer; }
    }
    const nq=found?divLin(co,found[0],found[1]):null;
    if(!nq){
      if(co.length===3&&!found){ const D=co[1]*co[1]-4*co[2]*co[0];
        if(D<0) return roots.length?{type:'set',roots:rSet(roots),complete:true}:{type:'none'};
        return {type:'set',roots:rSet(roots.concat(quadSolFrom(-co[1],D,2*co[2]).roots)),complete:true}; }
      return {type:'set',roots:rSet(roots),complete:false};
    }
    roots.push(rat(found[0],found[1])); co=nq;
  }
  return {type:'set',roots:rSet(roots),complete:true};
}
function evalRat(P,v,r){
  let num=0, den=1;
  for(const k in P){ const e=expsOf(k)[v]||0, n=P[k]*Math.pow(r[0],e), d=Math.pow(r[1],e); num=num*d+n*den; den=den*d; const g=gcd(num,den)||1; num/=g; den/=g; }
  return rat(num,den);
}

/* ---------- Construction d'un exercice d'équation ---------- */
const ax=(a,v)=>pmono(a,{[v]:1});
const msol=(tag,msg,roots)=>({tag,msg,sol:setOf(roots)});
const mpoly=(tag,msg,poly)=>({tag,msg,poly});
function mkEq(o){
  o.kind='solve'; o.v=o.v||'x'; o.expected=psub(o.eqL,o.eqR);
  o.solution=solvePoly(o.expected);
  o.expectedStr=solStr(o.v,o.solution); o.expectedHtml=solHtml(o.v,o.solution);
  { const cs=coeffsOf(o.expected,o.v); if(cs&&cs.length===3&&cs[2]!==0) o.quad={a:cs[2],b:cs[1],c:cs[0],delta:cs[1]*cs[1]-4*cs[2]*cs[0]}; }
  o.vars=[o.v]; o.hints=o.hints||[]; o.id=Math.random().toString(36).slice(2,9);
  const ms=(o.mistakes||[]).map(m=>{ if(m.poly){ const s=solvePoly(m.poly); m.sol=(s&&(s.type!=='set'||s.complete))?s:null; } return m; })
    .filter(m=>m.sol&&!sameSol(m.sol,o.solution));
  o.mistakes=ms.filter((m,i)=>ms.findIndex(x=>sameSol(x.sol,m.sol))===i);
  return o;
}
const div=(a,b)=>b<0?a+'/('+b+')':a+'/'+b;

/* ---------- Niveau 1 : équations du premier degré simples ---------- */
function genEqLin1(){
  const v=pick(['x','x','x','x','y','t']), x0=nz(-9,9), b=nz(-12,12);
  let al, stmt, lhs, c;
  if(Math.random()<0.7){ al=pick([1,2,3,4,5,6,7,8,9,-2,-3,-4,-5]); c=al*x0+b; lhs=padd(ax(al,v),pconst(b)); stmt=polyStr(lhs)+' = '+c; }
  else { const a=pick([2,3,4,5,6,7,8,9]); al=-a; c=b-a*x0; lhs=padd(pconst(b),ax(al,v)); stmt=b+' - '+a+v+' = '+c; }
  const rhs=pconst(c), k=c-b, sol=rat(k,al);
  const steps=[
    step('Isole le terme en '+v,M(stmt),(b>0?'On retranche '+b:'On ajoute '+(-b))+' aux deux membres :',M(polyStr(ax(al,v))+' = '+k)),
    step('Divise par le coefficient de '+v,'On divise les deux membres par '+al+' :',M(v+' = '+div(k,al))+(sol[1]===1&&div(k,al)!==String(sol[0])?' , soit '+M(v+' = '+rStr(sol)):'')),
    step('Vérifie en remplaçant',M(polyStr(lhs).split(v).join('('+sol[0]+')')+' = '+c)+' : le membre de gauche vaut bien '+M(String(c))+'.')
  ];
  steps[2].l=['Pour '+M(v+' = '+sol[0])+' : membre de gauche = '+M(String(al*sol[0]+b))+', membre de droite = '+M(String(c))+'. Les deux membres sont égaux.'];
  const mistakes=[
    msol('eq-signe','Tu as déplacé '+M(String(b))+' sans changer son signe. Quand un terme change de membre, il change de signe.',[rat(c+b,al)]),
    msol('eq-inverse','Pour isoler '+M(v)+', on divise les deux membres par '+M(String(al))+' ; on ne multiplie pas.',[rat(k*al)]),
    msol('eq-inverse','Il faut d\'abord éliminer le nombre ajouté ou retranché ('+M(String(b))+') avant de diviser par '+M(String(al))+'.',[rat(c,al)])
  ];
  if(x0!==0) mistakes.push(msol('eq-signe','Vérifie le signe de ta solution : remplace '+M(v)+' par ta valeur dans l\'équation de départ.',[rat(-sol[0],sol[1])]));
  return mkEq({v,eqL:lhs,eqR:rhs,statement:stmt,steps,mistakes,
    hints:['Isole '+M(v)+' avec les opérations inverses : d\'abord l\'addition ou la soustraction, ensuite la multiplication (division).','Commence par '+(b>0?'retrancher ':'ajouter ')+M(String(Math.abs(b)))+' aux deux membres.']});
}

/* ---------- Niveau 2 : inconnue des deux côtés, parenthèses ---------- */
function genEqLin2(){
  const v=pick(['x','x','x','y','t']), X=pmono(1,{[v]:1}), x0=nz(-8,8), form=Math.random();
  let lhs, rhs, stmt, kind='normal', para=false, wrong=[];
  if(form<0.08){ const a=pick([2,3,4,-2,-3]), b=nz(-9,9), d=b+nz(-6,6); if(d===b) return genEqLin2(); lhs=padd(ax(a,v),pconst(b)); rhs=padd(ax(a,v),pconst(d)); stmt=polyStr(lhs)+' = '+polyStr(rhs); kind='none'; }
  else if(form<0.14){ const k=pick([2,3,4,-2,-3]), m=nz(-6,6); lhs=pmul(pconst(k),lin(1,m,v)); rhs=padd(ax(k,v),pconst(k*m)); stmt=k+par(lin(1,m,v))+' = '+polyStr(rhs); kind='all'; para=true; }
  else if(form<0.5){ const a=pick([2,3,4,5,6,-2,-3,-4]), c=pick([1,2,3,4,-1,-2,-3,-5]); if(a===c) return genEqLin2(); const b=nz(-9,9), d=a*x0+b-c*x0; lhs=padd(ax(a,v),pconst(b)); rhs=padd(ax(c,v),pconst(d)); stmt=polyStr(lhs)+' = '+polyStr(rhs); if(d===0) return genEqLin2(); }
  else if(form<0.78){ const k=pick([2,3,4,-2,-3]), m=nz(-6,6), p=pick([1,2,3,4,5,-1,-2]); if(p===k) return genEqLin2(); const q=k*(x0+m)-p*x0; if(q===0) return genEqLin2(); lhs=pmul(pconst(k),lin(1,m,v)); rhs=padd(ax(p,v),pconst(q)); stmt=k+par(lin(1,m,v))+' = '+polyStr(rhs); para=true;
    wrong.push(mpoly('eq-distribution','Le facteur '+M(String(k))+' doit multiplier <b>chaque</b> terme de la parenthèse : '+M(k+par(lin(1,m,v))+' = '+polyStr(lhs))+'. Tu as oublié de le distribuer sur le second terme.',psub(padd(ax(k,v),pconst(m)),rhs))); }
  else { const k=pick([2,3,-2,-3]), m=nz(-5,5), p=pick([1,2,4,-1,-2]), q=nz(-5,5); if(p===k) return genEqLin2(); const r=k*(x0+m)-p*(x0+q); if(r===0) return genEqLin2(); lhs=pmul(pconst(k),lin(1,m,v)); const rr=pmul(pconst(p),lin(1,q,v)); rhs=padd(rr,pconst(r)); stmt=k+par(lin(1,m,v))+' = '+(p===1?'':p)+par(lin(1,q,v))+(r<0?' - '+(-r):' + '+r); para=true;
    wrong.push(mpoly('eq-distribution','Chaque facteur placé devant une parenthèse doit multiplier <b>tous</b> les termes de cette parenthèse, dans les deux membres.',psub(padd(ax(k,v),pconst(m)),padd(pmul(pconst(p),X),padd(pconst(q),pconst(r)))))); }
  const al=lhs[keyOf({[v]:1})]||0, be=lhs['']||0, ga=rhs[keyOf({[v]:1})]||0, de=rhs['']||0;
  const steps=[];
  steps.push(step('Écris l\'équation de départ',M(stmt)));
  if(para) steps.push(step('Développe les parenthèses',M(polyStr(lhs)+' = '+polyStr(rhs))));
  const kk=de-be, aa=al-ga;
  steps.push(step('Regroupe les termes en '+v+' à gauche et les nombres à droite','Un terme qui change de membre change de signe :',M(aa===0?'0 = '+kk:polyStr(ax(aa,v))+' = '+kk)));
  if(kind==='none') steps.push(step('Conclus','Les termes en '+v+' disparaissent et il reste l\'égalité fausse '+M('0 = '+kk)+' : l\'équation n\'a aucune solution.'));
  else if(kind==='all') steps.push(step('Conclus','Les deux membres sont identiques : '+M('0 = 0')+' est toujours vrai, donc tous les réels sont solutions.'));
  else steps.push(step('Divise par le coefficient de '+v,M(v+' = '+div(kk,aa)),'Solution : '+M(v+' = '+x0)+'.'),
    step('Vérifie en remplaçant','Pour '+M(v+' = '+x0)+' : membre de gauche = '+M(String(evalRat(lhs,v,[x0,1])[0]))+', membre de droite = '+M(String(evalRat(rhs,v,[x0,1])[0]))+'. Les deux membres sont égaux.'));
  const mistakes=wrong.slice();
  if(kind==='normal'){
    if(al+ga!==0) mistakes.push(msol('eq-signe','En passant '+M(polyStr(ax(ga,v)))+' à gauche, son signe doit changer : on retranche '+M(polyStr(ax(ga,v)))+' aux deux membres.',[rat(kk,al+ga)]));
    mistakes.push(msol('eq-signe','En passant '+M(String(be))+' à droite, son signe doit changer.',[rat(de+be,aa)]));
    mistakes.push(msol('eq-signe','Vérifie le signe de ta solution en remplaçant '+M(v)+' dans l\'équation de départ.',[rat(-x0)]));
  }
  return mkEq({v,eqL:lhs,eqR:rhs,statement:stmt,steps,mistakes,
    hints:para?['Développe d\'abord les parenthèses : '+M('k(a + b) = ka + kb')+', puis regroupe les termes en '+M(v)+'.','Après développement, mets les termes en '+M(v)+' d\'un côté et les nombres de l\'autre.']:['Mets tous les termes en '+M(v)+' dans un membre et tous les nombres dans l\'autre, en changeant le signe de ceux qui changent de membre.','Retranche '+M(polyStr(ax(ga,v)))+' aux deux membres, puis élimine le nombre.']});
}

/* ---------- Niveau 3 : produit nul ---------- */
function genEqProd(){
  const v=pick(['x','x','x','y','t']), r=Math.random(); let F, stmt, mistakes=[], zeroType=false;
  if(r<0.4){ let a=nz(-9,9), b=nz(-9,9); F=[lin(1,a,v),lin(1,b,v)]; stmt=par(F[0])+par(F[1])+' = 0'; }
  else if(r<0.6){ const a=nz(-9,9); F=[pmono(1,{[v]:1}),lin(1,a,v)]; stmt=v+par(F[1])+' = 0'; zeroType=true; }
  else if(r<0.88){ let p,q,r0,s0; do{ p=pick([2,3,4]); q=pick([1,2,3]); r0=nz(-7,7); s0=nz(-7,7); }while(gcd(p,r0)!==1||gcd(q,s0)!==1); F=[lin(p,r0,v),lin(q,s0,v)]; stmt=par(F[0])+par(F[1])+' = 0'; }
  else { const k=pick([2,3,4,5]), a=nz(-8,8), b=nz(-8,8); F=[pconst(k),lin(1,a,v),lin(1,b,v)]; stmt=k+par(F[1])+par(F[2])+' = 0'; }
  const fs=F.filter(f=>polyDeg(f)===1), roots=fs.map(f=>{ const co=coeffsOf(f,v); return rat(-co[0],co[1]); });
  let lhs=pconst(1); F.forEach(f=>{ lhs=pmul(lhs,f); });
  const steps=[
    step('Repère un produit égal à 0','Le membre de gauche est un produit de facteurs et le membre de droite vaut 0.'),
    step('Applique la règle du produit nul','Un produit est nul si et seulement si <b>l\'un au moins</b> de ses facteurs est nul : '+M('A × B = 0')+' équivaut à '+M('A = 0')+' ou '+M('B = 0')+'.'),
    step('Résous chaque équation',...fs.map((f,i)=>{ const co=coeffsOf(f,v); const eq=polyStr(f)+' = 0'; return co[1]===1?M(eq)+' donne '+M(v+' = '+rStr(roots[i])):M(eq)+' donne '+M(polyStr(ax(co[1],v))+' = '+(-co[0]))+' puis '+M(v+' = '+rStr(roots[i])); })),
    step('Conclus','Les solutions sont : '+roots.map(x=>M(v+' = '+rStr(x))).join(' ou ')+'.')
  ];
  const wrongRoots=roots.map(x=>rat(-x[0],x[1]));
  mistakes.push(msol('eq-signe-racine','Vérifie les signes : '+M('x - 3 = 0')+' donne '+M('x = 3')+' (et non −3), et '+M('x + 3 = 0')+' donne '+M('x = -3')+'.',wrongRoots));
  if(roots.length>=2){
    roots.forEach((x,i)=>mistakes.push(msol(zeroType&&rEq(x,rat(0))?'eq-oubli-zero':'eq-un-facteur',zeroType?'Le facteur '+M(v)+' vaut aussi 0 : '+M(v+' = 0')+' est une solution. Ne divise jamais par '+M(v)+', utilise la règle du produit nul.':'Chaque facteur donne une solution : tu n\'en as donné qu\'une. Il faut résoudre '+M('A = 0')+' <b>et</b> '+M('B = 0')+'.',roots.filter((_,j)=>j!==i))));
    if(roots.some(x=>x[1]>1)) mistakes.push(msol('eq-fraction','Pour '+M('ax + b = 0')+', la solution est '+M('x = -b/a')+' : le coefficient de '+M(v)+' se met au dénominateur.',roots.map(x=>x[1]>1?rat(x[1],-x[0]):x)));
  }
  return mkEq({v,eqL:lhs,eqR:pconst(0),statement:stmt,steps,mistakes,
    hints:['Le membre de gauche est un produit et le membre de droite vaut 0 : utilise la règle du produit nul.','Écris une équation par facteur (chaque facteur égal à 0), puis résous-les séparément.']});
}

/* ---------- Niveau 4 : factoriser pour résoudre ---------- */
function genEqFact(){
  const v=pick(['x','x','x','y','t']), X2=pmono(1,{[v]:2}), t=rnd(1,7); let lhs, rhs=pconst(0), stmt, factLine, method, roots, mistakes=[], type;
  const flipAll=(tag,msg,rs)=>mistakes.push(msol(tag,msg,rs.map(x=>rat(-x[0],x[1]))));
  if(t===1){ type='A'; const n=rnd(2,12); lhs=psub(X2,pconst(n*n)); stmt=v+'^2 - '+n*n+' = 0'; roots=[rat(-n),rat(n)]; method='différence de deux carrés : '+M(v+'^2 - '+n+'^2 = ('+v+' - '+n+')('+v+' + '+n+')'); factLine='('+v+' - '+n+')('+v+' + '+n+') = 0';
    mistakes.push(msol('eq-racine-carree','Une équation du type '+M('x^2 = n')+' a deux solutions : la racine positive et son opposé.',[rat(n)])); }
  else if(t===2){ type='B'; const n=rnd(2,12); lhs=X2; rhs=pconst(n*n); stmt=v+'^2 = '+n*n; roots=[rat(-n),rat(n)]; method='on ramène tout à gauche : '+M(v+'^2 - '+n*n+' = 0')+', puis différence de deux carrés'; factLine='('+v+' - '+n+')('+v+' + '+n+') = 0';
    mistakes.push(msol('eq-racine-carree','Une équation du type '+M('x^2 = n')+' a deux solutions : la racine positive et son opposé.',[rat(n)])); }
  else if(t===3){ type='C'; const a=nz(-9,9); lhs=padd(X2,ax(a,v)); stmt=polyStr(lhs)+' = 0'; roots=[rat(0),rat(-a)]; method='facteur commun '+M(v); factLine=v+'('+v+(a<0?' - '+(-a):' + '+a)+') = 0';
    mistakes.push(msol('eq-oubli-zero','Ne divise jamais par '+M(v)+' : tu perds la solution '+M(v+' = 0')+'. Factorise, puis utilise le produit nul.',[rat(-a)])); }
  else if(t===4||t===5){ let r0,s0; do{ r0=nz(-9,9); s0=nz(-9,9); }while(r0===s0||r0===-s0);
    roots=[rat(-r0),rat(-s0)]; const e=pmul(lin(1,r0,v),lin(1,s0,v));
    if(t===4){ type='D'; lhs=e; stmt=polyStr(e)+' = 0'; }
    else { type='E'; lhs=psub(e,pconst(r0*s0)); rhs=pconst(-r0*s0); stmt=polyStr(lhs)+' = '+(-r0*s0); mistakes.push(msol('eq-produit-non-nul','La règle du produit nul ne s\'applique que si le produit vaut <b>0</b>. Ici le membre de droite n\'est pas 0 : ramène d\'abord tout dans le membre de gauche.',[rat(-r0*s0),rat(-r0*s0-(r0+s0))])); }
    method='deux nombres de produit '+M(String(r0*s0))+' et de somme '+M(String(r0+s0))+' : '+M(String(r0))+' et '+M(String(s0)); factLine='('+v+(r0<0?' - '+(-r0):' + '+r0)+')('+v+(s0<0?' - '+(-s0):' + '+s0)+') = 0'; }
  else if(t===6){ type='F'; let p,q,r0,s0; do{ p=pick([1,2,3]); q=pick([1,2,3]); r0=nz(-6,6); s0=nz(-6,6); }while((p===1&&q===1)||gcd(p,r0)!==1||gcd(q,s0)!==1||p*s0+q*r0===0);
    lhs=pmul(lin(p,r0,v),lin(q,s0,v)); stmt=polyStr(lhs)+' = 0'; roots=[rat(-r0,p),rat(-s0,q)];
    method='trinôme avec '+M('a ≠ 1')+' : '+M('a × c = '+p*q*r0*s0)+', on cherche deux nombres de somme '+M(String(p*s0+q*r0))+' : '+M(String(p*s0))+' et '+M(String(q*r0)); factLine='('+polyStr(lin(p,r0,v))+')('+polyStr(lin(q,s0,v))+') = 0';
    mistakes.push(msol('eq-fraction','Pour '+M('ax + b = 0')+', la solution est '+M('x = -b/a')+' : le coefficient de '+M(v)+' se met au dénominateur.',[rat(-r0,1),rat(-s0,1)])); }
  else { type='G'; const k=nz(-9,9); lhs=X2; rhs=ax(k,v); stmt=v+'^2 = '+(k===1?'':(k===-1?'-':k))+v; roots=[rat(0),rat(k)]; method='on ramène tout à gauche : '+M(v+'^2 - '+(k<0?'('+k+')':k)+v+' = 0')+', puis facteur commun '+M(v); factLine=v+'('+v+(k<0?' + '+(-k):' - '+k)+') = 0';
    mistakes.push(msol('eq-oubli-zero','Ne divise jamais les deux membres par '+M(v)+' : tu perds la solution '+M(v+' = 0')+'. Ramène tout à gauche et factorise.',[rat(k)])); }
  if(roots.length===2){ mistakes.push(msol('eq-un-facteur','Un produit nul donne deux équations : chaque facteur égal à 0 fournit une solution. Il t\'en manque une.',[roots[0]])); mistakes.push(msol('eq-un-facteur','Un produit nul donne deux équations : chaque facteur égal à 0 fournit une solution. Il t\'en manque une.',[roots[1]])); flipAll('eq-signe-racine','Vérifie les signes des solutions : '+M('x - 3 = 0')+' donne '+M('x = 3')+'.',roots); }
  const P0=psub(lhs,rhs), steps=[];
  if(!rEq(rat(rhs['']||0),rat(0))||polyDeg(rhs)>0) steps.push(step('Ramène tout dans le membre de gauche','Le membre de droite doit valoir 0 :',M(polyStr(P0)+' = 0')));
  steps.push(step('Factorise le membre de gauche','Méthode : '+method+'.',M(factLine)));
  steps.push(step('Applique la règle du produit nul','Un facteur est nul : '+roots.map(x=>M(v+' = '+rStr(x))).join(' ou ')+'.'));
  steps.push(step('Conclus','Les solutions sont : '+roots.map(x=>M(v+' = '+rStr(x))).join(' ou ')+'.'));
  return mkEq({v,eqL:lhs,eqR:rhs,statement:stmt,steps,mistakes,
    hints:['Pour résoudre une équation du second degré : ramène tout à gauche pour avoir « ... = 0 », factorise, puis utilise le produit nul.','Le membre de gauche se factorise par : '+method+'.']});
}

/* ---------- Niveau 5 : équations à développer et cas mixtes ---------- */
function genEqMixed(){
  const v=pick(['x','x','x','y','t']), X=pmono(1,{[v]:1}), t=rnd(1,4);
  if(t===1){
    let r0,s0,a,b,m,n; do{ r0=nz(-6,6); s0=nz(-6,6); a=nz(-6,6); b=nz(-6,6); m=a+b+r0+s0; n=a*b-r0*s0; }while(r0===s0||(m===0&&n===0));
    const L=pmul(lin(1,a,v),lin(1,b,v)), R=padd(ax(m,v),pconst(n)), Q=pmul(lin(1,-r0,v),lin(1,-s0,v));
    const steps=[
      step('Développe le membre de gauche',M(par(lin(1,a,v))+par(lin(1,b,v))+' = '+polyStr(L))),
      step('Ramène tout dans le membre de gauche','On retranche '+M(polyStr(R))+' aux deux membres (les signes changent) :',M(polyStr(Q)+' = 0')),
      step('Factorise','Deux nombres de produit '+M(String(r0*s0))+' et de somme '+M(String(-r0-s0))+' :',M(par(lin(1,-r0,v))+par(lin(1,-s0,v))+' = 0')),
      step('Applique la règle du produit nul','Solutions : '+M(v+' = '+r0)+' ou '+M(v+' = '+s0)+'.')
    ];
    const mistakes=[mpoly('eq-signe','En ramenant le membre de droite à gauche, chaque terme doit changer de signe. Tu as additionné au lieu de retrancher.',padd(L,R))];
    mistakes.push(msol('eq-un-facteur','Un produit nul donne deux équations : il t\'en manque une.',[rat(r0)])); mistakes.push(msol('eq-un-facteur','Un produit nul donne deux équations : il t\'en manque une.',[rat(s0)]));
    return mkEq({v,eqL:L,eqR:R,statement:par(lin(1,a,v))+par(lin(1,b,v))+' = '+polyStr(R),steps,mistakes,
      hints:['Développe le membre de gauche, puis ramène tout dans un seul membre pour obtenir « ... = 0 ».','Après avoir tout ramené à gauche, tu obtiens un trinôme du second degré : factorise-le.']});
  }
  if(t===2){
    let a,b,c,d,x0,den;
    for(let i=0;i<500;i++){ a=nz(-6,6); b=nz(-6,6); c=nz(-6,6); d=nz(-6,6); den=a+b-c-d; if(den===0) continue; const num=c*d-a*b; if(num%den===0&&num/den!==0&&!(a===c&&b===d)){ x0=num/den; break; } }
    if(x0===undefined) return genEqMixed();
    const L=pmul(lin(1,a,v),lin(1,b,v)), R=pmul(lin(1,c,v),lin(1,d,v));
    const steps=[
      step('Développe les deux membres',M(polyStr(L)+' = '+polyStr(R))),
      step('Simplifie','Les termes en '+M(v+'^2')+' sont les mêmes des deux côtés : ils s\'annulent en retranchant '+M(v+'^2')+'.',M(polyStr(ax(a+b,v))+(b+a>=0?'':'')+(a*b<0?' - '+(-a*b):' + '+a*b)+' = '+polyStr(padd(ax(c+d,v),pconst(c*d))))),
      step('Regroupe et divise',M(polyStr(ax(den,v))+' = '+(c*d-a*b)),M(v+' = '+x0)),
      step('Vérifie en remplaçant','Pour '+M(v+' = '+x0)+' : membre de gauche = '+M(String(evalRat(L,v,[x0,1])[0]))+', membre de droite = '+M(String(evalRat(R,v,[x0,1])[0]))+'.')
    ];
    const mistakes=[msol('eq-signe','Vérifie le signe en regroupant : un terme qui change de membre change de signe.',[rat(a*b-c*d,den)]),msol('eq-signe','Vérifie le signe de ta solution en remplaçant '+M(v)+' dans l\'équation de départ.',[rat(-x0)])];
    return mkEq({v,eqL:L,eqR:R,statement:par(lin(1,a,v))+par(lin(1,b,v))+' = '+par(lin(1,c,v))+par(lin(1,d,v)),steps,mistakes,
      hints:['Développe les deux membres : les termes en '+M(v+'^2')+' vont s\'annuler.','Après simplification, il reste une équation du premier degré.']});
  }
  if(t===3){
    const n=rnd(2,9), P=psub(pmono(1,{[v]:3}),ax(n*n,v)), roots=[rat(-n),rat(0),rat(n)];
    const steps=[
      step('Factorise : facteur commun',M(polyStr(P)+' = '+v+'('+v+'^2 - '+n*n+')')),
      step('Factorise : différence de deux carrés',M(v+'('+v+' - '+n+')('+v+' + '+n+') = 0')),
      step('Applique la règle du produit nul','Trois facteurs, donc jusqu\'à trois solutions : '+M(v+' = 0')+', '+M(v+' = '+n)+', '+M(v+' = -'+n)+'.')
    ];
    const mistakes=[msol('eq-oubli-zero','Ne divise jamais par '+M(v)+' : tu perds la solution '+M(v+' = 0')+'. Factorise, puis utilise le produit nul.',[rat(-n),rat(n)]),msol('eq-racine-carree','Le facteur '+M(v+'^2 - '+n*n)+' donne deux solutions, '+M(String(n))+' et '+M(String(-n))+', et le facteur '+M(v)+' donne encore '+M('0')+'.',[rat(0),rat(n)])];
    return mkEq({v,eqL:P,eqR:pconst(0),statement:v+'^3 - '+n*n+v+' = 0',steps,mistakes,
      hints:['Cherche d\'abord un facteur commun, puis regarde si une parenthèse se factorise encore.','Le facteur commun est '+M(v)+'. Il reste '+M(v+'^2 - '+n*n)+' : différence de deux carrés.']});
  }
  const a=nz(-8,8), n=rnd(2,9), L=ppow(lin(1,a,v),2), R=pconst(n*n), roots=[rat(-a-n),rat(-a+n)];
  const steps=[
    step('Ramène tout à gauche','On obtient une différence de deux carrés :',M('('+polyStr(lin(1,a,v))+')^2 - '+n+'^2 = 0')),
    step('Factorise',M('('+polyStr(lin(1,a,v))+' - '+n+')('+polyStr(lin(1,a,v))+' + '+n+') = 0'),'Puis on réduit chaque parenthèse :',M(par(lin(1,a-n,v))+par(lin(1,a+n,v))+' = 0')),
    step('Applique la règle du produit nul','Solutions : '+roots.map(x=>M(v+' = '+rStr(x))).join(' ou ')+'.')
  ];
  const mistakes=[msol('eq-racine-carree','Une équation du type '+M('A^2 = n^2')+' a deux solutions : '+M('A = n')+' ou '+M('A = -n')+'.',[roots[1]]),msol('eq-racine-carree','Une équation du type '+M('A^2 = n^2')+' a deux solutions : '+M('A = n')+' ou '+M('A = -n')+'.',[roots[0]]),msol('eq-signe-racine','Vérifie les signes : '+M('x + 3 = 5')+' donne '+M('x = 2')+'.',[rat(a-n),rat(a+n)])];
  return mkEq({v,eqL:L,eqR:R,statement:'('+polyStr(lin(1,a,v))+')^2 = '+n*n,steps,mistakes,
    hints:['Le carré est égal à un carré : ramène tout à gauche et reconnais une différence de deux carrés.','Ici '+M('a = '+polyStr(lin(1,a,v)))+' et '+M('b = '+n)+' : '+M('a^2 - b^2 = (a - b)(a + b)')+'.']});
}

TOPICS['eq-lin']={kind:'solve',level:1,label:'Équations simples',gen:genEqLin1};
TOPICS['eq-lin2']={kind:'solve',level:2,label:'Inconnue des deux côtés',gen:genEqLin2};
TOPICS['eq-prod']={kind:'solve',level:3,label:'Produit nul',gen:genEqProd};
TOPICS['eq-fact']={kind:'solve',level:4,label:'Second degré par factorisation',gen:genEqFact};
TOPICS['eq-mixte']={kind:'solve',level:5,label:'Équations à développer',gen:genEqMixed};
