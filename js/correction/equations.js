'use strict';
/* ===== Correction des équations ===== */
Object.assign(TAGS,{
  'eq-signe':{label:'Signe en changeant de membre',tip:'Quand un terme passe de l\'autre côté du signe =, il change de signe. Vérifie ta solution en la remplaçant dans l\'équation de départ.'},
  'eq-division':{label:'Division incorrecte',tip:'Pour isoler l\'inconnue, on divise les deux membres par son coefficient.'},
  'eq-distribution':{label:'Distribution oubliée',tip:'Un nombre devant une parenthèse multiplie tous les termes de la parenthèse : k(a + b) = ka + kb.'},
  'eq-un-facteur':{label:'Une solution oubliée',tip:'Un produit est nul si l\'un des facteurs est nul : chaque facteur donne sa propre solution.'},
  'eq-signe-racine':{label:'Signe de la solution',tip:'x − 3 = 0 donne x = 3 ; x + 3 = 0 donne x = −3. La solution est l\'opposé du nombre écrit dans la parenthèse.'},
  'eq-racine-carree':{label:'Deux solutions pour un carré',tip:'x² = 9 a deux solutions, 3 et −3, car 3² = 9 et (−3)² = 9.'},
  'eq-oubli-zero':{label:'Division par l\'inconnue',tip:'Ne divise jamais par x : tu perds la solution x = 0. Ramène tout à gauche, factorise, puis utilise le produit nul.'},
  'eq-produit-non-nul':{label:'Produit nul appliqué à tort',tip:'La règle du produit nul ne marche que si le produit vaut 0. Ramène d\'abord tout dans un seul membre.'},
  'eq-fraction':{label:'Solution d\'un facteur ax + b',tip:'ax + b = 0 donne ax = −b, puis x = −b/a.'},
  'eq-inverse':{label:'Mauvaise opération inverse',tip:'On annule une addition par une soustraction et une multiplication par une division, aux deux membres.'},
  'eq-modele':{label:'Équation mal posée',tip:'Relis l\'énoncé phrase par phrase et traduis chaque information avec l\'inconnue. Repère surtout les mots « de plus », « le double », « au total », « le produit ».'},
  'eq-contexte':{label:'Solution qui ne convient pas au problème',tip:'Après avoir résolu, vérifie chaque solution dans l\'énoncé : une longueur, un âge ou un nombre de pièces ne peuvent pas être négatifs.'},
  'eq-delta':{label:'Discriminant mal calculé',tip:'Δ = b² − 4ac. Mets b entre parenthèses avant de le mettre au carré ((−5)² = 25) et attention au signe de −4ac quand a ou c est négatif.'},
  'eq-coef':{label:'Coefficients a, b, c mal lus',tip:'Écris d\'abord l\'équation sous la forme ax² + bx + c = 0 ; le signe qui précède chaque terme fait partie du coefficient.'},
  'eq-formule':{label:'Formule des solutions',tip:'x = (−b ± √Δ) / (2a) : −b (l\'opposé de b), √Δ, et le dénominateur 2a s\'applique à tout le numérateur.'},
  'eq-viete-signe':{label:'Signe dans les relations de Viète',tip:'Pour ax² + bx + c = 0 : S = x₁ + x₂ = −b/a (avec le signe −) et P = x₁ × x₂ = c/a.'},
  'eq-viete-a':{label:'Division par a oubliée',tip:'Quand a ≠ 1, S = −b/a et P = c/a : il faut diviser par a.'},
  'eq-viete-expr':{label:'Expression de S et P',tip:'On exprime tout avec S et P : x₁² + x₂² = S² − 2P ; 1/x₁ + 1/x₂ = S/P ; (x₁ − 1)(x₂ − 1) = P − S + 1.'},
  'eq-exact':{label:'Valeur exacte demandée',tip:'Écris la valeur exacte avec la racine carrée (par exemple (−1 + √5)/2), pas une valeur décimale arrondie.'},
  'sys-signe':{label:'Signe en additionnant ou soustrayant',tip:'Quand on additionne ou soustrait deux équations, on applique l\'opération aux deux membres, en gardant chaque signe : (a − b) − (c − d) = a − b − c + d.'},
  'sys-mult':{label:'Équation multipliée en partie',tip:'Si on multiplie une équation par k, on multiplie <b>tous</b> les termes des deux membres, second membre compris.'},
  'sys-subst':{label:'Parenthèses en substituant',tip:'Quand on remplace une inconnue par une expression, on met cette expression entre parenthèses : le coefficient multiplie tous ses termes.'},
  'sys-oubli':{label:'Inconnue oubliée ou inversée',tip:'Un système à n inconnues demande n valeurs. Reporte-les dans toutes les équations pour vérifier.'},
  'sys-modele':{label:'Système mal posé',tip:'Une équation par information de l\'énoncé. Chaque inconnue est multipliée par sa quantité, et « dépasse de », « le double de », « au total » se traduisent avec soin.'},
  'eq-non-resolue':{label:'Équation pas encore résolue',tip:'Termine par une ligne du type x = … (ou « aucune solution », ou « tous les réels »).'}
});


/* ---------- Nombres exacts (racines carrées) ---------- */
function parseNum(str){
  const s=str.trim().replace(/[−–—]/g,'-').replace(/[×·⋅∙]/g,'*').replace(/÷/g,'/').replace(/²/g,'^2').replace(/³/g,'^3').replace(/sqrt|racine|rac/gi,'√').replace(/\s+/g,'').replace(/,/g,'.');
  if(!s) throw new ParseError('Il manque une valeur.');
  const t=[]; let i=0, hasSqrt=false, hasDecimal=false; const rad=[];
  while(i<s.length){ const c=s[i];
    if(/[0-9.]/.test(c)){ let j=i; while(j<s.length&&/[0-9.]/.test(s[j])) j++; const w=s.slice(i,j); if((w.match(/\./g)||[]).length>1||w==='.') throw new ParseError('Nombre mal écrit : « '+w+' ».'); if(w.includes('.')) hasDecimal=true; t.push({k:'n',v:parseFloat(w),int:!w.includes('.')}); i=j; continue; }
    if('+-*/^()√'.includes(c)){ t.push({k:c}); i++; continue; }
    throw new ParseError('Caractère non reconnu dans un nombre : « '+c+' ».'); }
  let p=0; const pk=()=>t[p];
  function expr(){ let v=term(); while(pk()&&(pk().k==='+'||pk().k==='-')){ const op=t[p++].k, w=term(); v=op==='+'?v+w:v-w; } return v; }
  function term(){ let v=unary();
    for(;;){ const x=pk(); if(!x) break;
      if(x.k==='*'){ p++; v*=unary(); }
      else if(x.k==='/'){ p++; const d=unary(); if(d===0) throw new ParseError('Division par zéro.'); v/=d; }
      else if(x.k==='('||x.k==='√'||(x.k==='n'&&t[p-1]&&t[p-1].k===')')){ v*=unary(); }
      else break; }
    return v; }
  function unary(){ const x=pk(); if(x&&x.k==='-'){ p++; return -unary(); } if(x&&x.k==='+'){ p++; return unary(); } return power(); }
  function power(){ const b=atom(); if(pk()&&pk().k==='^'){ p++; let sgn=1; if(pk()&&pk().k==='-'){ p++; sgn=-1; } const e=pk(); if(!e||e.k!=='n'||!e.int) throw new ParseError('Exposant entier attendu après ^.'); p++; return Math.pow(b,sgn*e.v); } return b; }
  function atom(){ const x=t[p++]; if(!x) throw new ParseError('Le nombre est incomplet.');
    if(x.k==='n') return x.v;
    if(x.k==='('){ const v=expr(); if(!pk()||pk().k!==')') throw new ParseError('Il manque une parenthèse fermante.'); p++; return v; }
    if(x.k==='√'){ hasSqrt=true; const n=pk(); let v;
      if(n&&n.k==='n'){ p++; v=n.v; if(n.int) rad.push(n.v); }
      else if(n&&n.k==='('){ p++; v=expr(); if(!pk()||pk().k!==')') throw new ParseError('Il manque une parenthèse fermante.'); p++; }
      else throw new ParseError('Écris ce qui est sous la racine, par exemple √5 ou √(12).');
      if(v<0) throw new ParseError('Racine carrée d\'un nombre négatif : ce n\'est pas un nombre réel.'); return Math.sqrt(v); }
    throw new ParseError('Écriture de nombre incorrecte près de « '+x.k+' ».'); }
  const val=expr(); if(p<t.length) throw new ParseError('Écriture de nombre incorrecte : je ne comprends pas la fin de « '+str.trim()+' ».');
  return {val,hasSqrt,hasDecimal,rad};
}
function floatToRat(x){ for(let d=1;d<=2000;d++){ const n=Math.round(x*d); if(Math.abs(n/d-x)<1e-9) return rat(n,d); } return null; }
function parseRational(s){
  s=s.trim().replace(/[−–—]/g,'-').replace(/\s+/g,'');
  let m=s.match(/^([+-]?)(\d+)\/(\d+)$/); if(m){ if(+m[3]===0) return null; return rat((m[1]==='-'?-1:1)*+m[2],+m[3]); }
  m=s.match(/^([+-]?)(\d+)(?:[.,](\d+))?$/); if(!m) return null;
  const dec=m[3]||'', den=Math.pow(10,dec.length); return rat((m[1]==='-'?-1:1)*parseInt(m[2]+dec,10),den);
}
function userRoot(text){
  const r0=parseRational(text); if(r0) return r0;
  const w=parseNum(text), r=floatToRat(w.val); if(r) return r;
  return {irr:true,user:true,val:w.val,str:text.trim().replace(/[−–—]/g,'-'),simplify:w.rad.some(n=>sqfree(n)[0]>1),hasSqrt:w.hasSqrt};
}
const NONE_RE=/^(?:s\s*=\s*)?(?:∅|\{\s*\}|ø|aucune?\s+solution(?:\s+r[ée]elle)?|pas\s+de\s+solution|impossible|aucune?|\{∅\})$/i;
const ALL_RE=/^(?:s\s*=\s*)?(?:ℝ|r|tous?\s+les\s+r[ée]els|tout\s+r[ée]el|tous?\s+les\s+nombres|toutes?\s+les\s+valeurs|infinit[ée]\s+de\s+solutions)$/i;
function parseSolutionSet(line,v){
  let s=line.trim().replace(/[−–—]/g,'-').replace(/\s+/g,' ');
  if(NONE_RE.test(s)) return {type:'none'};
  if(ALL_RE.test(s)) return {type:'all'};
  s=s.replace(/^s\s*=\s*/i,'');
  if(/^\{.*\}$/.test(s)) s=s.slice(1,-1).trim();
  if(!s) return null;
  const parts=s.split(/\s*(?:;|\||\bou\b|\bet\b|,\s+)\s*/i).filter(Boolean), roots=[]; let wrongVar=null;
  for(const p of parts){
    const m=p.match(/^([a-z])\s*[₁₂₃0-9]?\s*=\s*(.+)$/i); let val=p;
    if(m){ val=m[2]; if(m[1].toLowerCase()!==v) wrongVar=m[1].toLowerCase(); }
    try{ roots.push(userRoot(val)); }catch(e){ if(e instanceof ParseError) return null; throw e; }
  }
  const set=setOf(roots); set.wrongVar=wrongVar; set.simplify=roots.some(r=>r.simplify); return set;
}
function parseEqPart(str){
  const halves=str.split('=');
  if(halves.length!==2) throw new ParseError(halves.length<2?'Il manque le signe « = » : écris une équation, par exemple 3x = 6.':'Une seule égalité par ligne : écris chaque étape sur sa propre ligne.');
  let L,R;
  const rq=ratEq(halves[0],halves[1]); L=rq.L; R=rq.R;
  return {L,R,P:rq.P,html:M(astStr(L.ast)+' = '+astStr(R.ast))};
}
const isNumericSeg=seg=>!/[a-zA-Zα-ωΔ]/.test(seg.replace(/sqrt|racine|rac/gi,''));
function parseLine(line,v,ex){
  if(ex){
    const dm=line.match(/^\s*(?:Δ|δ|delta|discriminant|D)\s*=\s*(.+)$/i);
    if(dm){
      if(!ex.quad) throw new ParseError('Cette équation n\'est pas du second degré : il n\'y a pas de discriminant à calculer.');
      const vals=[]; dm[1].split('=').forEach(seg=>{ if(isNumericSeg(seg)) vals.push(parseNum(seg).val); });
      return {kind:'delta',vals,html:M('Δ = '+dm[1].trim())};
    }
    if(ex.quad&&!'abc'.includes(v)&&/^\s*[abc]\s*=/i.test(line)){
      const vals={}, parts=line.trim().split(/\s*(?:;|\bet\b|,\s+)\s*/i).filter(Boolean);
      for(const p of parts){ const m=p.match(/^([abc])\s*=\s*(.+)$/i); if(!m) throw new ParseError('Écris les coefficients sous la forme a = 2 ; b = -5 ; c = 3.'); vals[m[1].toLowerCase()]=parseNum(m[2]).val; }
      return {kind:'coef',vals,html:M(parts.join(' ; '))};
    }
  }
  const set=parseSolutionSet(line,v);
  if(set) return Object.assign({kind:'set',html:set.type==='set'?set.roots.map(r=>M(v+' = '+rStr(r))).join(' ou '):(set.type==='none'?'aucune solution':'tous les réels')},set);
  const pieces=line.split(/\s+ou\s+/i).filter(s=>s.trim());
  if(!pieces.length) throw new ParseError('Écris ton équation ou ta solution dans la zone de saisie.');
  const eqs=pieces.map(parseEqPart);
  for(const e of eqs){ const extra=varsOfPoly(e.P).filter(x=>x!==v); if(extra.length) throw new ParseError('L\'inconnue de cette équation est « '+v+' » ; la lettre « '+extra[0]+' » ne devrait pas apparaître.'); }
  if(eqs.length===1) return {kind:'eq',P:eqs[0].P,html:eqs[0].html};
  const sols=eqs.map(e=>solvePoly(e.P)); let sol=null;
  if(sols.every(s=>s&&s.type==='set'&&s.complete)) sol=setOf([].concat(...sols.map(s=>s.roots)));
  return {kind:'or',P:null,sol,html:eqs.map(e=>e.html).join(' ou ')};
}
function proportional(P,Q){
  const kp=Object.keys(P), kq=Object.keys(Q); if(kp.length!==kq.length) return false; if(!kp.length) return true;
  if(!kp.every(k=>k in Q)) return false;
  const k0=kp[0]; return kp.every(k=>P[k]*Q[k0]===Q[k]*P[k0]);
}
function lineSol(ln){
  if(ln.kind==='set') return ln.type==='set'?{type:'set',roots:ln.roots,complete:true}:{type:ln.type};
  if(ln.kind==='or') return ln.sol;
  if(ln.kind!=='eq') return null;
  const s=solvePoly(ln.P); return s&&(s.type!=='set'||s.complete)?s:null;
}
function deltaOk(ex,x){ const q=ex.quad; if(!q) return false; const g=gcd(gcd(Math.abs(q.a),Math.abs(q.b)),Math.abs(q.c))||1; return divisors(g).some(k=>Math.abs(x*k*k-q.delta)<1e-9); }
function coefOk(ex,vals){
  const q=ex.quad; if(!q) return false; const w={a:q.a,b:q.b,c:q.c}, ks=Object.keys(vals); if(!ks.length) return false;
  const k0=ks.find(k=>w[k]!==0); if(!k0) return false; const k=vals[k0]/w[k0]; if(!k) return false;
  return ks.every(x=>Math.abs(vals[x]-k*w[x])<1e-9);
}
function lineOk(ex,ln){
  if(ln.kind==='delta') return ln.vals.length>0&&ln.vals.every(x=>deltaOk(ex,x));
  if(ln.kind==='coef') return coefOk(ex,ln.vals);
  if(ln.kind==='set') return !ln.wrongVar&&(sameSol(lineSol(ln),ex.solution)||(!!ex.answer&&sameSol(lineSol(ln),ex.answer)));
  if(ln.kind==='or') return !!ln.sol&&sameSol(ln.sol,ex.solution);
  if(proportional(ln.P,ex.expected)) return true;
  const s=lineSol(ln); return !!s&&sameSol(s,ex.solution);
}
function evalAny(P,v,r){ if(isR(r)) return evalRat(P,v,r); const x=rVal(r); let t=0; for(const k in P) t+=P[k]*Math.pow(x,expsOf(k)[v]||0); return t; }
function valEq(l,r){ if(isR(l)&&isR(r)) return rEq(l,r); const a=isR(l)?rVal(l):l, b=isR(r)?rVal(r):r; return Math.abs(a-b)<=1e-7*Math.max(1,Math.abs(a),Math.abs(b)); }
function fmtVal(r){ return isR(r)?M(rStr(r)):'≈ '+M(String(Math.round(r*10000)/10000)); }
function substTable(ex,roots){
  return '<ul class="terms steps-check">'+roots.map(r=>{
    const l=evalAny(ex.eqL,ex.v,r), rr=evalAny(ex.eqR,ex.v,r), ok=valEq(l,rr);
    return '<li class="'+(ok?'ok':'ko')+'"><span class="mk" aria-hidden="true">'+(ok?'✓':'✗')+'</span><span>Pour '+M(ex.v+' = '+rStr(r))+' : membre de gauche '+fmtVal(l)+', membre de droite '+fmtVal(rr)+' <small>('+(ok?'égaux : c\'est une solution':'différents : ce n\'est pas une solution')+')</small></span></li>';
  }).join('')+'</ul>';
}
function diagnoseSet(ex,sol,wrongVar){
  const cand=ex.mistakes.find(m=>m.sol&&sameSol(m.sol,sol));
  let pre='';
  if(wrongVar) pre='<p>L\'inconnue de l\'équation est '+M(ex.v)+' ; tu as écrit '+M(wrongVar)+'.</p>';
  let body='', tag=null, title='Ce n\'est pas l\'ensemble des solutions';
  const irrExp=ex.solution.type==='set'?ex.solution.roots.filter(r=>!isR(r)):[];
  if(sol.type==='set'&&irrExp.length&&sol.roots.some(r=>isR(r)&&irrExp.some(q=>Math.abs(rVal(q)-rVal(r))<0.02))){
    return {status:'wrong',tag:'eq-exact',title:'Valeur approchée : donne la valeur exacte',html:pre+'<p>Ta valeur est proche d\'une solution, mais les solutions de cette équation sont irrationnelles : on les écrit avec une racine carrée, par exemple '+M('(-1 + √5)/2')+', et non avec des décimales.</p>'};
  }
  if(cand&&!(sol.type==='set'&&ex.solution.type==='set')){ return {status:'wrong',tag:cand.tag,title,html:pre+'<p>'+cand.msg+'</p>'}; }
  if(ex.quad&&ex.solution.type==='none'&&sol.type==='set'){ return {status:'wrong',tag:'eq-delta',title:'Regarde le signe du discriminant',html:pre+'<p>Pour cette équation, calcule '+M('Δ = b^2 - 4ac')+' : s\'il est négatif, il n\'y a aucune solution réelle, car une racine carrée d\'un nombre négatif n\'existe pas.</p>'+substTable(ex,sol.roots)}; }
  if(ex.quad&&sol.type==='none'&&ex.solution.type==='set'){ return {status:'wrong',tag:'eq-delta',title:'Regarde le signe du discriminant',html:pre+'<p>Tu as conclu qu\'il n\'y a aucune solution : recalcule '+M('Δ = b^2 - 4ac')+' (attention aux signes de '+M('a')+', '+M('b')+' et '+M('c')+' et au signe de '+M('-4ac')+'). Ici '+M('Δ')+' n\'est pas négatif.</p>'}; }
  if(sol.type==='none'){ body='<p>Tu as conclu qu\'il n\'y a aucune solution, mais l\'équation en a. Essaie de résoudre à nouveau et vérifie en remplaçant.</p>'; tag='calcul'; }
  else if(sol.type==='all'){ body='<p>Tu as conclu que tous les réels sont solutions, ce qui n\'est pas le cas ici. Vérifie en remplaçant l\'inconnue par une valeur simple.</p>'; tag='calcul'; }
  else if(ex.solution.type==='none'){ body='<p>Vérifie ta valeur en la remplaçant dans l\'équation de départ :</p>'+substTable(ex,sol.roots)+'<p>Regarde ce qui arrive aux termes en '+M(ex.v)+' quand tu les regroupes.</p>'; tag='calcul'; }
  else if(ex.solution.type==='all'){ body='<p>Vérifie avec une valeur : les deux membres de l\'équation sont-ils toujours égaux ?</p>'+substTable(ex,sol.roots); tag='calcul'; }
  else {
    const bad=sol.roots.filter(r=>!valEq(evalAny(ex.eqL,ex.v,r),evalAny(ex.eqR,ex.v,r)));
    body='<p>Vérifie chaque valeur en la remplaçant dans l\'équation de départ :</p>'+substTable(ex,sol.roots);
    if(!bad.length){ const n=ex.solution.roots.length; body+='<p>Toutes tes valeurs sont justes, mais il en manque : l\'équation a '+n+' solutions.</p>'; tag='eq-un-facteur'; }
    else tag='calcul';
  }
  if(cand){ tag=cand.tag; return {status:'wrong',tag,title,html:pre+'<p>'+cand.msg+'</p>'+body}; }
  return {status:'wrong',tag,title,html:pre+body};
}
function itemHtml(it){ return it.html; }
function stepsListEq(items,bad){
  return '<ul class="terms steps-check">'+items.map((it,i)=>{
    const cls=bad<0||i<bad?'ok':(i===bad?'ko':'skip'), mk=cls==='ok'?'✓':(cls==='ko'?'✗':'·');
    const note=cls==='ok'?(it.kind==='delta'||it.kind==='coef'?'juste':it.sys?'conséquence du système':'équivalente à l\'énoncé'):(cls==='ko'?(it.kind==='delta'||it.kind==='coef'?'faux':it.sys?'n\'est pas une conséquence du système':'pas équivalente à l\'énoncé'):'non vérifiée');
    return '<li class="'+cls+'"><span class="mk" aria-hidden="true">'+mk+'</span><span>Ligne '+(i+1)+' : '+it.html+' <small>('+note+')</small></span></li>';
  }).join('')+'</ul>';
}
function deltaMsg(ex,vals){
  const q=ex.quad, x=vals[0];
  let m='<p>Le discriminant se calcule avec '+M('Δ = b^2 - 4ac')+' ; ici '+M('a = '+q.a)+', '+M('b = '+q.b)+', '+M('c = '+q.c)+'.</p>';
  if(vals.length&&Math.abs(x-(q.b*q.b+4*q.a*q.c))<1e-9) m+='<p>Tu as calculé '+M('b^2 + 4ac')+' : le signe devant '+M('4ac')+' est un moins. Attention : si '+M('a × c')+' est négatif, alors '+M('-4ac')+' est positif.</p>';
  else if(vals.length&&Math.abs(x-(q.b-4*q.a*q.c))<1e-9) m+='<p>Le terme '+M('b')+' doit être mis <b>au carré</b> : '+M('b^2')+'.</p>';
  else if(vals.length&&Math.abs(x-(-q.b*q.b-4*q.a*q.c))<1e-9) m+='<p>Le carré de '+M('b')+' est toujours positif : '+M('(-5)^2 = 25')+' et non '+M('-25')+'. Mets '+M('b')+' entre parenthèses avant de l\'élever au carré.</p>';
  else if(vals.length&&Math.abs(x-(q.b*q.b-2*q.a*q.c))<1e-9) m+='<p>Le terme est '+M('4ac')+' (quatre fois '+M('a')+' fois '+M('c')+'), pas '+M('2ac')+'.</p>';
  else m+='<p>Recalcule pas à pas : d\'abord '+M('b^2')+', puis '+M('4 × a × c')+' en gardant les signes, puis la soustraction.</p>';
  return m;
}
function checkSolveWork(ex,input){
  if(ex.sys) return checkSystem(ex,input);
  if(ex.viete) return checkViete(ex,input);
  if(ex.build) return checkBuild(ex,input);
  const lines=input.split(/\n/).map(s=>s.trim()).filter(Boolean), v=ex.v;
  if(!lines.length) return {status:'syntax',title:'Écriture à corriger',html:'<p>Écris ton équation ou ta solution dans la zone de saisie.</p>',tag:null};
  const items=[];
  for(let i=0;i<lines.length;i++){
    try{ items.push(parseLine(lines[i],v,ex)); }
    catch(e){ if(e instanceof ParseError) return {status:'syntax',title:lines.length>1?'Ligne '+(i+1)+' : écriture à corriger':'Écriture à corriger',html:'<p>'+esc(e.message)+'</p>',tag:null}; throw e; }
  }
  const bad=items.findIndex(it=>!lineOk(ex,it));
  if(bad>=0){
    const it=items[bad], multi=lines.length>1, pre=multi?stepsListEq(items,bad):'';
    if(it.kind==='delta') return {status:'wrong',tag:'eq-delta',title:multi?'Ligne '+(bad+1)+' : le discriminant est faux':'Le discriminant est faux',html:pre+(it.vals.length?'':'<p>Écris la valeur de '+M('Δ')+', par exemple '+M('Δ = 25 - 24 = 1')+'.</p>')+deltaMsg(ex,it.vals)};
    if(it.kind==='coef') return {status:'wrong',tag:'eq-coef',title:multi?'Ligne '+(bad+1)+' : coefficients faux':'Coefficients faux',html:pre+'<p>Remets d\'abord l\'équation sous la forme '+M('ax^2 + bx + c = 0')+' (tout dans un membre), puis lis chaque coefficient avec son signe. Un terme absent a pour coefficient 0.</p>'};
    if(it.kind==='set'&&it.wrongVar&&sameSol(lineSol(it),ex.solution)) return {status:'wrong',tag:null,title:'Mauvaise lettre',html:pre+'<p>Ta valeur est juste, mais l\'inconnue de l\'équation est '+M(ex.v)+' et tu as écrit '+M(it.wrongVar)+'.</p>'};
    if(it.kind==='set'&&ex.answer&&it.type==='set'&&it.roots.every(r=>ex.solution.roots.some(q=>rEq(q,r)))){
      return {status:'wrong',tag:'eq-contexte',title:'Cette solution ne convient pas au problème',html:pre+'<p>Cette valeur est bien solution de l\'équation, mais elle ne convient pas à l\'énoncé : '+ex.invalidMsg+'</p><p>Résous l\'équation, puis garde uniquement la solution qui a un sens dans le problème.</p>'};
    }
    if(it.kind==='set'){
      const r=diagnoseSet(ex,lineSol(it),it.wrongVar);
      if(multi) r.html='<p>Ligne '+(bad+1)+' :</p>'+pre+r.html;
      return r;
    }
    let tag='calcul', msg='';
    const cand=ex.mistakes.find(m=>(m.poly&&it.P&&proportional(m.poly,it.P))||(m.sol&&lineSol(it)&&sameSol(m.sol,lineSol(it))));
    if(cand){ tag=cand.tag; msg='<p>'+cand.msg+'</p>'; }
    else msg='<p>Cette ligne n\'a pas les mêmes solutions que l\'équation de départ : une transformation est incorrecte. Recalcule terme par terme en vérifiant les signes.</p>';
    return {status:'wrong',tag,title:multi?'Ligne '+(bad+1)+' : erreur de transformation':'Cette équation n\'est pas équivalente à l\'énoncé',
      html:(multi?pre+'<p>L\'erreur se situe entre '+(bad===0?'l\'énoncé et la ligne 1':'la ligne '+bad+' et la ligne '+(bad+1))+'.</p>':'')+msg};
  }
  const fin=items[items.length-1];
  if(fin.kind!=='set'){
    return {status:'incomplete',tag:'eq-non-resolue',title:'Juste, mais l\'équation n\'est pas résolue',
      html:(lines.length>1?stepsListEq(items,-1):'')+'<p>'+(lines.length>1?'Tes étapes sont justes. ':'')+'Termine par une ligne qui donne la valeur de l\'inconnue, par exemple '+M(v+' = 2')+', ou écris « aucune solution » / « tous les réels » si c\'est le cas.</p>'};
  }
  if(ex.answer&&!sameSol(lineSol(fin),ex.answer)) return {status:'incomplete',tag:'eq-contexte',title:'Il reste à choisir la bonne solution',html:(lines.length>1?stepsListEq(items,-1):'')+'<p>Ces valeurs sont les solutions de l\'équation, mais une seule répond au problème : '+ex.invalidMsg+' Garde uniquement celle qui convient.</p>'};
  if(fin.simplify) return {status:'format',tag:'presentation',title:'Juste, mais à simplifier',html:'<p>Ta réponse est exacte, mais une racine peut encore se simplifier : cherche un carré parfait dans le nombre sous la racine, par exemple '+M('√8 = √4 × √2 = 2√2')+' et '+M('√20 = 2√5')+'.</p>'};
  return {status:'ok',steps:lines.length};
}

/* ---------- Relations de Viète : S et P, expressions symétriques ---------- */
function vNum(str){ const w=parseNum(str), r=floatToRat(w.val); if(!r) throw new ParseError('Écris la valeur sous forme d\'un entier ou d\'une fraction.'); return r; }
function checkViete(ex,input){
  const V=ex.viete, single=V.targets.length===1;
  const pieces=input.split(/\n|;|\bet\b|,\s*(?=[a-zA-Z])/i).map(s=>s.trim()).filter(Boolean);
  if(!pieces.length) return {status:'syntax',title:'Écriture à corriger',html:'<p>Écris ta réponse dans la zone de saisie.</p>',tag:null};
  const found={};
  try{
    for(const p of pieces){
      const segs=p.split('=').map(s=>s.trim()); let target, vals;
      if(single){ target=V.targets[0]; vals=segs.filter(isNumericSeg).map(vNum); }
      else {
        target=V.targets.find(t=>t.re.test(segs[0].replace(/\s+/g,'')));
        if(!target) throw new ParseError('Je ne reconnais pas « '+segs[0]+' » : écris '+V.targets.map(t=>t.key+' = …').join(' et ')+'.');
        vals=segs.slice(1).filter(isNumericSeg).map(vNum);
      }
      if(vals.length) found[target.key]={vals};
    }
  }catch(e){ if(e instanceof ParseError) return {status:'syntax',title:'Écriture à corriger',html:'<p>'+esc(e.message)+'</p>',tag:null}; throw e; }
  const missing=V.targets.filter(t=>!found[t.key]);
  if(missing.length===V.targets.length||missing.length) return {status:'incomplete',tag:null,title:'Il manque une réponse',html:'<p>Donne '+missing.map(t=>M(t.key)).join(' et ')+' avec sa valeur, par exemple '+M(missing[0].key+' = 3')+'.</p>'};
  let badTag=null; const rows=[], msgs=[];
  V.targets.forEach(t=>{
    const vals=found[t.key].vals, wrong=vals.find(x=>!rEq(x,t.value));
    if(!wrong){ rows.push('<li class="ok"><span class="mk" aria-hidden="true">✓</span><span>'+M(t.key+' = '+rStr(vals[vals.length-1]))+' <small>(juste)</small></span></li>'); return; }
    const err=(t.errs||[]).find(e=>rEq(e.val,wrong));
    rows.push('<li class="ko"><span class="mk" aria-hidden="true">✗</span><span>'+M(t.key+' = '+rStr(wrong))+' <small>(faux)</small></span></li>');
    msgs.push('<p>'+(err?err.msg:'Recalcule '+M(t.key)+' avec la formule '+M(t.formula)+', en gardant le signe de chaque coefficient.')+'</p>');
    if(!badTag) badTag=err?err.tag:'calcul';
  });
  if(!badTag) return {status:'ok'};
  return {status:'wrong',tag:badTag,title:'Réponse à corriger',html:'<ul class="terms steps-check">'+rows.join('')+'</ul>'+msgs.join('')+'<p class="tip">'+esc(V.recall||'')+'</p>'};
}

/* ---------- Écrire une équation à partir de ses solutions ---------- */
function checkBuild(ex,input){
  const lines=input.split(/\n/).map(s=>s.trim()).filter(Boolean), B=ex.build;
  if(!lines.length) return {status:'syntax',title:'Écriture à corriger',html:'<p>Écris ton équation dans la zone de saisie.</p>',tag:null};
  const items=[];
  try{
    for(let i=0;i<lines.length;i++){
      const sp=lines[i].match(/^\s*(S|P|somme|produit)\s*=\s*(.+)$/i);
      if(sp){ const isS=/^(s|somme)$/i.test(sp[1]), tv=isS?B.S:B.P, vals=sp[2].split('=').filter(isNumericSeg).map(vNum);
        if(!vals.length||vals.some(x=>!rEq(x,tv))) return {status:'wrong',tag:'eq-viete-signe',title:'Ligne '+(i+1)+' : '+(isS?'la somme':'le produit')+' est faux',html:'<p>'+(isS?'La somme des solutions est le total des deux nombres donnés, avec leur signe.':'Le produit des solutions est la multiplication des deux nombres donnés, avec la règle des signes.')+'</p>'};
        items.push({kind:'sp',html:M(lines[i])}); continue; }
      const e=parseEqPart(lines[i]); const extra=varsOfPoly(e.P).filter(x=>x!==ex.v); if(extra.length) throw new ParseError('Utilise la lettre « '+ex.v+' » pour l\'inconnue.');
      items.push({kind:'eq',P:e.P,html:e.html});
    }
  }catch(e){ if(e instanceof ParseError) return {status:'syntax',title:'Écriture à corriger',html:'<p>'+esc(e.message)+'</p>',tag:null}; throw e; }
  const okEq=P=>proportional(P,ex.expected)||(()=>{ const s=solvePoly(P); return !!s&&(s.type!=='set'||s.complete)&&sameSol(s,ex.solution); })();
  const bad=items.findIndex(it=>it.kind==='eq'&&!okEq(it.P));
  const multi=lines.length>1;
  if(bad>=0){
    const P=items[bad].P, cs=coeffsOf(P,ex.v); let msg='';
    const cand=ex.mistakes.find(m=>m.poly&&proportional(m.poly,P));
    if(cand) msg='<p>'+cand.msg+'</p>';
    else if(cs&&cs.length===3&&cs[2]!==0) msg='<p>Les solutions de ton équation ont pour somme '+M(rStr(rat(-cs[1],cs[2])))+' et pour produit '+M(rStr(rat(cs[0],cs[2])))+' : ce n\'est pas ce qu\'on demande. Rappel : l\'équation est '+M('x^2 - Sx + P = 0')+'.</p>';
    else msg='<p>Ton équation n\'est pas du second degré ou ses solutions ne sont pas celles demandées. Vérifie en remplaçant.</p>';
    return {status:'wrong',tag:cand?cand.tag:'eq-viete-signe',title:multi?'Ligne '+(bad+1)+' : équation incorrecte':'Ces nombres ne sont pas les solutions de ton équation',html:(multi?stepsListEq(items,bad):'')+msg};
  }
  if(items[items.length-1].kind!=='eq') return {status:'incomplete',tag:'eq-non-resolue',title:'Écris l\'équation',html:'<p>Termine par l\'équation elle-même, sous la forme '+M('x^2 - Sx + P = 0')+' (avec des nombres à la place de '+M('S')+' et '+M('P')+').</p>'};
  return {status:'ok',steps:lines.length};
}


/* ---------- Systèmes linéaires ---------- */
function linRow(P,vars){
  const row=vars.map(()=>0); let c=0;
  for(const k in P){ if(k===''){ c=P[k]; continue; } const e=expsOf(k), ks=Object.keys(e);
    if(ks.length!==1||e[ks[0]]!==1) return null; const idx=vars.indexOf(ks[0]); if(idx<0) return 'var:'+ks[0]; row[idx]=P[k]; }
  return row.concat([-c]);
}
function sysSubstTable(ex,assign){
  const S=ex.sys, n=S.vars.length;
  return '<ul class="terms steps-check">'+S.rows.map((r,i)=>{
    const terms=S.vars.map((v,j)=>r[j]?paren(r[j])+' × '+paren(rStr(assign[j])):null).filter(Boolean).join(' + ');
    const tot=S.vars.reduce((a,_,j)=>rAdd(a,rMul(rat(r[j]),assign[j])),rat(0)), ok=rEq(tot,rat(r[n]));
    return '<li class="'+(ok?'ok':'ko')+'"><span class="mk" aria-hidden="true">'+(ok?'✓':'✗')+'</span><span>Équation ('+(i+1)+') : '+M(terms+' = '+rStr(tot))+' <small>('+(ok?'vérifiée : '+M(String(r[n])):'devrait valoir '+M(String(r[n])))+')</small></span></li>';
  }).join('')+'</ul>';
}
function checkSystem(ex,input){
  const S=ex.sys, n=S.vars.length, vars=S.vars;
  const pieces=input.split(/\n|;|\bet\b/i).map(s=>s.trim()).filter(Boolean);
  if(!pieces.length) return {status:'syntax',title:'Écriture à corriger',html:'<p>Écris tes équations ou ta solution dans la zone de saisie.</p>',tag:null};
  const items=[], assign={};
  try{
    pieces.forEach((p,i)=>{
      if(NONE_RE.test(p.replace(/\s+/g,' '))){ items.push({kind:'none',html:'aucune solution',sys:true}); return; }
      if(ALL_RE.test(p.replace(/\s+/g,' '))||/^infinit[ée]\s+de\s+solutions?$/i.test(p)||/^une\s+infinit[ée]/i.test(p)){ items.push({kind:'all',html:'infinité de solutions',sys:true}); return; }
      const am=p.match(/^([a-z])\s*=\s*(.+)$/i);
      if(am&&vars.includes(am[1].toLowerCase())){ let rv=null; try{ rv=userRoot(am[2]); }catch(er){ if(!(er instanceof ParseError)) throw er; }
        if(rv&&isR(rv)){ const j=vars.indexOf(am[1].toLowerCase()), row=vars.map((_,q)=>q===j?rat(1):rat(0)).concat([rv]); items.push({kind:'eq',row,html:M(vars[j]+' = '+rStr(rv)),sys:true,assign:{j,val:rv}}); return; } }
      const e=parseEqPart(p), row=linRow(e.P,vars);
      if(row===null) throw new ParseError('Dans un système linéaire, chaque terme est de la forme « ax » : pas de x², de xy ni de fraction en x.');
      if(typeof row==='string') throw new ParseError('La lettre « '+row.slice(4)+' » n\'est pas une inconnue de ce système (inconnues : '+vars.join(', ')+').');
      const nz=row.slice(0,n).map((c,j)=>c?j:-1).filter(j=>j>=0);
      const it={kind:'eq',row,html:e.html,sys:true}; if(nz.length===1){ it.assign={j:nz[0],val:rat(row[n],row[nz[0]])}; }
      items.push(it);
    });
  }catch(e){ if(e instanceof ParseError) return {status:'syntax',title:'Écriture à corriger',html:'<p>'+esc(e.message)+'</p>',tag:null}; throw e; }
  const multi=items.length>1;
  const bad=items.findIndex(it=>it.kind==='none'?S.type!=='none':it.kind==='all'?S.type!=='all':!inSpan(S.rows,it.row,n));
  if(bad>=0){
    const it=items[bad], pre=multi?stepsListEq(items,bad):'';
    let tag='calcul', msg='';
    if(it.kind==='none'||it.kind==='all'){
      tag='calcul'; msg='<p>'+(S.type==='unique'?'Ce système a une <b>solution unique</b> : élimine une inconnue et tu obtiendras une valeur, pas une contradiction.':S.type==='none'?'Ce système n\'est pas indéterminé : quand tu élimines une inconnue, tu obtiens une égalité <b>fausse</b> (par exemple '+M('0 = 5')+').':'Ce système n\'est pas impossible : quand tu élimines une inconnue, tu obtiens '+M('0 = 0')+'.')+'</p>';
    } else {
      const cand=ex.mistakes.find(m=>(m.row&&proportional(rowPoly(m.row,vars),rowPoly(it.row,vars)))||(m.assign&&it.assign&&rEq(m.assign[vars[it.assign.j]],it.assign.val)));
      if(cand){ tag=cand.tag; msg='<p>'+cand.msg+'</p>'; }
      else if(S.type!=='unique') msg='<p>Ce système n\'a pas de solution unique. Regarde ce qui se passe quand tu élimines une inconnue : tu dois obtenir '+M('0 = 0')+' ou une égalité fausse.</p>';
      else msg='<p>Cette équation n\'est pas une conséquence du système : une transformation est incorrecte. Recalcule terme par terme, signes compris'+(it.assign?', ou remplace ta valeur dans les équations de départ':'')+'.</p>';
      if(it.assign){
        const vals=vars.map((v,j)=>j===it.assign.j?it.assign.val:(items.slice(0,bad).reverse().find(x=>x.assign&&x.assign.j===j)||{assign:{val:null}}).assign.val);
        if(vals.every(x=>x)) msg+=sysSubstTable(ex,vals);
      }
    }
    return {status:'wrong',tag,title:multi?'Ligne '+(bad+1)+' : erreur':'Cette ligne est fausse',html:pre+msg};
  }
  const got={}; items.forEach(it=>{ if(it.assign) got[it.assign.j]=it.assign.val; });
  const done=items.some(it=>it.kind==='none'||it.kind==='all');
  if(S.type==='unique'){
    const missing=vars.filter((_,j)=>!got[j]);
    if(missing.length) return {status:'incomplete',tag:'sys-oubli',title:'Il reste '+(missing.length>1?'des inconnues':'une inconnue')+' à trouver',html:(multi?stepsListEq(items,-1):'')+'<p>Il te manque la valeur de '+missing.map(v=>M(v)).join(' et ')+'. Un système à '+n+' inconnues demande '+n+' valeurs.</p>'};
    return {status:'ok',steps:pieces.length};
  }
  if(!done) return {status:'incomplete',tag:'eq-non-resolue',title:'Conclus',html:(multi?stepsListEq(items,-1):'')+'<p>Tes lignes sont justes. Conclus : '+(S.type==='none'?'ce système n\'a <b>aucune solution</b>.':'ce système a une <b>infinité de solutions</b>.')+'</p>'};
  return {status:'ok',steps:pieces.length};
}
const rowPoly=(row,vars)=>{ let P={}; vars.forEach((v,j)=>{ if(row[j]) P=padd(P,pmono(row[j],{[v]:1})); }); return padd(P,pconst(-row[vars.length])); };

function previewSys(line,ex){
  const vars=ex.sys.vars;
  const parts=line.split(/\s*(?:;|\bet\b)\s*/i).filter(Boolean);
  return parts.map(p=>{
    const q=p.replace(/\s+/g,' ').trim();
    if(NONE_RE.test(q)) return 'aucune solution';
    if(ALL_RE.test(q)||/^(?:une\s+)?infinit[ée]/i.test(q)) return 'infinité de solutions';
    const am=q.match(/^([a-z])\s*=\s*(.+)$/i);
    if(am&&vars.includes(am[1].toLowerCase())){ try{ const rv=userRoot(am[2]); if(rv&&isR(rv)) return M(am[1].toLowerCase()+' = '+rStr(rv)); }catch(e){ if(!(e instanceof ParseError)) throw e; } }
    return parseEqPart(q).html;
  }).join(' ; ');
}
