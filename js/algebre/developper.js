'use strict';
/* ===== Générateurs d'exercices : outils communs + développement ===== */
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const nz=(a,b)=>{ let v=0; while(v===0) v=rnd(a,b); return v; };
const lin=(a,b,v)=>padd(pmono(a,{[v||'x']:1}),pconst(b));
const step=(t,...l)=>({t,l});
const last=a=>a[a.length-1];
const VARS2=[['x','y'],['a','b'],['m','n']];
const mis=(tag,msg,poly)=>({tag,msg,poly});
const flip=(expected,term)=>padd(expected,pneg(pmul(pconst(2),term)));   // change le signe d'un terme

const TAGS={
  'oubli-distribution':{label:'Distribution incomplète',tip:'Un facteur devant une parenthèse multiplie chaque terme de la parenthèse, pas seulement le premier.'},
  'signe':{label:'Erreur de signe',tip:'Règle des signes : (+)×(+)=+, (−)×(−)=+, (+)×(−)=−. Écris chaque produit sur une ligne et vérifie son signe.'},
  'signe-parenthese':{label:'Signe devant une parenthèse',tip:'Un signe − devant une parenthèse change le signe de tous les termes qu\'elle contient.'},
  'oubli-produits-croises':{label:'Produits croisés oubliés',tip:'Dans (a+b)(c+d), il y a quatre produits : ac, ad, bc et bd.'},
  'oubli-terme':{label:'Terme oublié',tip:'Compte les produits avant de réduire : rien ne doit manquer.'},
  'identite-carre-somme':{label:'(a+b)² confondu avec a²+b²',tip:'(a+b)² = a² + 2ab + b². Le double produit 2ab ne disparaît jamais.'},
  'identite-double-produit':{label:'Double produit incorrect',tip:'Le terme du milieu est 2ab (ou 3a²b et 3ab² pour un cube) : ne pas oublier le coefficient.'},
  'identite-carre-diff':{label:'(a−b)² confondu avec a²−b²',tip:'(a−b)² = a² − 2ab + b², tandis que (a−b)(a+b) = a² − b².'},
  'signe-carre':{label:'Signe du carré de b',tip:'Un carré est toujours positif : dans (a−b)², le terme b² est précédé de +.'},
  'coef-carre':{label:'Coefficient non mis au carré',tip:'(3x)² = 3² × x² = 9x². Le nombre est lui aussi élevé au carré.'},
  'identite-conjuguee':{label:'Produit conjugué mal développé',tip:'(a+b)(a−b) = a² − b² : pas de terme du milieu, et b² est précédé de −.'},
  'identite-cube':{label:'(a+b)³ mal développé',tip:'(a+b)³ = a³ + 3a²b + 3ab² + b³.'},
  'facteur-double':{label:'Facteur multiplié deux fois',tip:'Dans k(x+a)(x+b), le facteur k multiplie le produit une seule fois, pas chaque parenthèse.'},
  'division-oubliee':{label:'Terme non divisé',tip:'Après avoir sorti le facteur commun, chaque terme doit être divisé par lui. Développe pour vérifier.'},
  'oubli-1':{label:'Le « 1 » oublié',tip:'Si un terme est égal au facteur commun, il reste 1 dans la parenthèse (et non 0).'},
  'facteur-oublie':{label:'Facteur commun oublié',tip:'Quand on factorise une partie, le facteur commun de départ reste devant le résultat.'},
  'confusion-identites':{label:'Identités confondues',tip:'Différence de carrés : a²−b² = (a−b)(a+b). Carré parfait : a²±2ab+b² = (a±b)². Compte les termes et regarde le double produit.'},
  'somme-fausse':{label:'Produit bon, somme fausse',tip:'Il faut deux nombres dont le produit vaut c ET dont la somme vaut b.'},
  'signe-racines':{label:'Signes des nombres inversés',tip:'Si r + s = b et r × s = c, alors x² + bx + c = (x + r)(x + s). Vérifie le signe du terme du milieu.'},
  'facteurs-croises':{label:'Nombres mal placés',tip:'Développe ta réponse : le terme du milieu dépend de la place de chaque nombre.'},
  'incomplet':{label:'Factorisation incomplète',tip:'Après avoir factorisé, regarde chaque parenthèse : reste-t-il un facteur commun, ou une identité remarquable ?'},
  'pas-produit':{label:'Le résultat n\'est pas un produit',tip:'Factoriser, c\'est transformer une somme en produit : 3x + 6 devient 3(x + 2).'},
  'presentation':{label:'Écriture à terminer',tip:'Supprime les parenthèses inutiles et regroupe les termes semblables.'},
  'calcul':{label:'Erreur de calcul',tip:'Écris chaque étape sur une ligne et vérifie avec une valeur numérique (x = 2, par exemple).'}
};

function mkEx(o){
  const ms=(o.mistakes||[]).map(m=>{
    if(m.expr!==undefined){ try{ m.poly=parsePoly(m.expr).poly; }catch(e){ m.poly=null; } }
    return m;
  }).filter(m=>m.poly && !peq(m.poly,o.expected));
  o.mistakes=ms.filter((m,i)=>ms.findIndex(x=>peq(x.poly,m.poly))===i);
  o.hints=o.hints||[]; o.id=Math.random().toString(36).slice(2,9);
  return o;
}
const sqNo=F=>{ const k=Object.keys(F)[0], e=expsOf(k); for(const v in e) e[v]*=2; return pmono(F[k],e); };

/* ---------- Niveau 1 : distribution simple ---------- */
function genDistSimple(){
  const v=pick(['x','x','x','y','a','n']), r=Math.random(); let k, inner;
  if(r<0.45){ k=pconst(pick([2,3,4,5,6,7,8,9,-2,-3,-4,-5,-6,-7])); inner=lin(pick([1,2,3,4,5,-1,-2,-3,-4]),nz(-9,9),v); }
  else if(r<0.75){ k=pmono(pick([1,2,3,4,5,-1,-2,-3,-4]),{[v]:1}); inner=lin(pick([1,2,3,4,-1,-2,-3]),nz(-9,9),v); }
  else { k=pick([pconst(pick([2,3,4,5,-2,-3,-4])),pmono(pick([1,2,3,-1,-2]),{[v]:1})]); inner=psum([pmono(nz(-4,4),{[v]:2}),pmono(nz(-6,6),{[v]:1}),pconst(nz(-9,9))]); }
  const expected=pmul(k,inner), ts=tl(inner), prods=ts.map(t=>pmul(k,t)), kS=polyStr(k);
  const steps=[
    step('Repère le facteur à distribuer','Le facteur '+M(kS)+' multiplie <b>chaque</b> terme de la parenthèse '+M(par(inner))+'.'+(k[Object.keys(k)[0]]<0?' Comme il est négatif, chaque terme change de signe.':'')),
    step('Multiplie terme par terme',...ts.map((t,i)=>M(pw(k))+' × '+M(pw(t))+' = '+M(polyStr(prods[i])))),
    step('Assemble les résultats',M(polyStr(expected)))
  ];
  const mistakes=[mis('oubli-distribution','Tu n\'as multiplié que le premier terme de la parenthèse. Le facteur '+M(kS)+' doit être distribué à <b>chaque</b> terme : '+M('k(a + b) = ka + kb')+'.',padd(prods[0],psum(ts.slice(1))))];
  ts.forEach((t,i)=>mistakes.push(mis('signe','Le signe du produit n°'+(i+1)+' (celui qui contient '+M(pw(t))+') est faux. Rappel : (+)×(+)=+, (−)×(−)=+, (+)×(−)=−, (−)×(+)=−.',flip(expected,prods[i]))));
  return mkEx({kind:'expand',statement:kS+par(inner),expected,expectedStr:polyStr(expected),steps,mistakes,
    hints:['Un facteur devant une parenthèse se distribue : '+M('k(a + b) = ka + kb')+'.','Multiplie '+M(kS)+' par '+M(polyStr(ts[0]))+', puis par chacun des autres termes, sans oublier les signes.']});
}

/* ---------- Niveau 2 : double distribution ---------- */
function genDouble(){
  const v=pick(['x','x','x','x','y','a','t']), r=Math.random(); let a=1,c=1;
  if(r<0.4){ a=1;c=1; } else if(r<0.75){ a=pick([1,2,3,-1,-2]); c=pick([1,2,3]); } else { a=pick([2,3,4]); c=pick([2,3,-2,-3]); }
  const b=nz(-9,9), d=nz(-9,9), F=lin(a,b,v), G=lin(c,d,v), expected=pmul(F,G);
  if(pterms(expected)<2) return genDouble();
  const t1=pmono(a,{[v]:1}), t2=pconst(b), u1=pmono(c,{[v]:1}), u2=pconst(d);
  const P=[pmul(t1,u1),pmul(t1,u2),pmul(t2,u1),pmul(t2,u2)];
  const lab=['premier × premier','premier × dernier','dernier × premier','dernier × dernier'];
  const pairs=[[t1,u1],[t1,u2],[t2,u1],[t2,u2]];
  const mid=padd(P[1],P[2]);
  const steps=[
    step('Écris les quatre produits','Chaque terme de la 1re parenthèse multiplie chaque terme de la 2e.',...pairs.map((p,i)=>M(pw(p[0]))+' × '+M(pw(p[1]))+' = '+M(polyStr(P[i])))),
    step('Additionne les quatre produits',M(rawSum(P))),
    step('Regroupe les termes semblables',Object.keys(mid).length?M(rawSum([P[1],P[2]]))+' = '+M(polyStr(mid)):'Les deux termes en '+M(v)+' s\'annulent : '+M(rawSum([P[1],P[2]]))+' = 0.',M(polyStr(expected)))
  ];
  const mistakes=[
    mis('oubli-produits-croises','Tu as multiplié « premier × premier » et « dernier × dernier », mais pas les produits croisés. Il y a quatre produits en tout : chaque terme de la 1re parenthèse doit multiplier chaque terme de la 2e.',padd(P[0],P[3])),
    mis('oubli-distribution','Le second terme de la 1re parenthèse, '+M(pw(t2))+', n\'a pas multiplié toute la 2e parenthèse : chaque terme doit être distribué.',padd(pmul(t1,G),t2)),
    mis('oubli-distribution','Le premier terme de la 1re parenthèse, '+M(pw(t1))+', n\'a pas multiplié toute la 2e parenthèse : chaque terme doit être distribué.',padd(pmul(t2,G),t1))
  ];
  P.forEach((p,i)=>{
    mistakes.push(mis('oubli-terme','Il manque le produit « '+lab[i]+' ». Tu dois obtenir quatre produits avant de réduire.',padd(expected,pneg(p))));
    mistakes.push(mis('signe','Le signe du produit « '+lab[i]+' » est faux : refais ce produit avec la règle des signes.',flip(expected,p)));
  });
  return mkEx({kind:'expand',statement:par(F)+par(G),expected,expectedStr:polyStr(expected),steps,mistakes,
    hints:['Double distribution : '+M('(a + b)(c + d) = ac + ad + bc + bd')+'.','Écris d\'abord les quatre produits (avec leurs signes), puis regroupe les termes en '+M(v)+'.']});
}

/* ---------- Niveau 3 : identités remarquables ---------- */
function genIdentExpand(){
  const two=Math.random()<0.4; let u,w,A,B;
  if(two){ [u,w]=pick(VARS2); A=pmono(pick([1,2,3,4,5]),{[u]:1}); B=pmono(pick([1,2,3,4,5]),{[w]:1}); }
  else { u=pick(['x','x','x','y','a','t']); A=pmono(pick([1,1,2,3,4,5]),{[u]:1}); B=pconst(pick([1,2,3,4,5,6,7,8,9])); }
  const kind=pick(['plus','minus','conj','plus','minus']);
  const rev=!two && kind!=='conj' && Math.random()<0.2;
  const F1=rev?B:A, F2=rev?A:B;
  const a2=pmul(F1,F1), b2=pmul(F2,F2), ab=pmul(F1,F2), ab2=pmul(pconst(2),ab);
  let statement, expected, pieces, formula;
  if(kind==='plus'){ statement='('+polyStr(F1)+' + '+polyStr(F2)+')^2'; expected=psum([a2,ab2,b2]); pieces=[a2,ab2,b2]; formula='(a + b)^2 = a^2 + 2ab + b^2'; }
  else if(kind==='minus'){ statement='('+polyStr(F1)+' - '+polyStr(F2)+')^2'; expected=psum([a2,pneg(ab2),b2]); pieces=[a2,pneg(ab2),b2]; formula='(a - b)^2 = a^2 - 2ab + b^2'; }
  else { const s1='('+polyStr(F1)+' + '+polyStr(F2)+')', s2='('+polyStr(F1)+' - '+polyStr(F2)+')'; statement=Math.random()<0.5?s1+s2:s2+s1; expected=psub(a2,b2); pieces=[a2,pneg(b2)]; formula='(a + b)(a - b) = a^2 - b^2'; }
  const lines=[M('a^2')+' = '+M('('+polyStr(F1)+')^2')+' = '+M(polyStr(a2)), M('b^2')+' = '+M('('+polyStr(F2)+')^2')+' = '+M(polyStr(b2))];
  if(kind!=='conj') lines.push(M('2ab')+' = 2 × '+M(pw(F1))+' × '+M(pw(F2))+' = '+M(polyStr(ab2)));
  const raw=rawSum(pieces), fin=polyStr(expected);
  const steps=[
    step('Reconnais l\'identité remarquable',M(formula),'Ici '+M('a = '+polyStr(F1))+' et '+M('b = '+polyStr(F2))+'.'),
    step('Calcule chaque morceau',...lines),
    step('Assemble',raw===fin?M(fin):M(raw)+' = '+M(fin))
  ];
  const mistakes=[];
  if(kind==='plus'){
    mistakes.push(mis('identite-carre-somme','Attention : '+M('(a + b)^2')+' n\'est pas égal à '+M('a^2 + b^2')+'. Il manque le double produit '+M('2ab')+'.',padd(a2,b2)));
    mistakes.push(mis('identite-double-produit','Le double produit vaut '+M('2ab')+' : tu as oublié le facteur 2.',psum([a2,ab,b2])));
  } else if(kind==='minus'){
    mistakes.push(mis('signe','Le signe du double produit est faux : dans '+M('(a - b)^2')+', il est négatif ('+M('a^2 - 2ab + b^2')+').',psum([a2,ab2,b2])));
    mistakes.push(mis('identite-carre-diff',M('(a - b)^2')+' n\'est pas égal à '+M('a^2 - b^2')+' : il y a un double produit '+M('-2ab')+'.',psub(a2,b2)));
    mistakes.push(mis('signe-carre','Un carré n\'est jamais négatif : '+M('b^2')+' garde le signe + même dans '+M('(a - b)^2')+'.',psum([a2,pneg(ab2),pneg(b2)])));
    mistakes.push(mis('identite-double-produit','Le double produit vaut '+M('2ab')+' : tu as oublié le facteur 2.',psum([a2,pneg(ab),b2])));
  } else {
    mistakes.push(mis('identite-conjuguee','Dans '+M('(a + b)(a - b)')+' les termes du milieu s\'annulent, mais '+M('b^2')+' garde un signe − : le résultat est '+M('a^2 - b^2')+'.',padd(a2,b2)));
    mistakes.push(mis('confusion-identites','Ce produit n\'est pas un carré : '+M('(a + b)(a - b)')+' est un produit conjugué, il n\'y a pas de double produit.',psum([a2,ab2,b2])));
    mistakes.push(mis('confusion-identites','Ce produit n\'est pas un carré : '+M('(a + b)(a - b)')+' est un produit conjugué, il n\'y a pas de double produit.',psum([a2,pneg(ab2),b2])));
  }
  [F1,F2].forEach(F=>{
    if(Math.abs(Object.values(F)[0])>1) mistakes.push(mis('coef-carre','Dans '+M('('+polyStr(F)+')^2')+', le nombre est lui aussi mis au carré : '+M('('+polyStr(F)+')^2 = '+polyStr(pmul(F,F)))+'.',padd(expected,psub(sqNo(F),pmul(F,F)))));
  });
  return mkEx({kind:'expand',statement,expected,expectedStr:fin,steps,mistakes,
    hints:['Identité à reconnaître : '+M(formula)+'.','Ici '+M('a = '+polyStr(F1))+' et '+M('b = '+polyStr(F2))+'. Calcule '+M('a^2')+', '+(kind==='conj'?'puis ':M('2ab')+' et ')+M('b^2')+'.']});
}

/* ---------- Niveau 4 : expressions combinées ---------- */
function genCombined(){
  const v=pick(['x','x','x','y','a']), t=rnd(1,3), bin=(a,b)=>lin(a,b,v);
  if(t===1){
    const k=pick([2,3,4,5,-2,-3,-4]), a=nz(-6,6), b=nz(-6,6), F=bin(1,a), G=bin(1,b), inner=pmul(F,G), expected=pmul(pconst(k),inner);
    const P=[pmul(pmono(1,{[v]:1}),pmono(1,{[v]:1})),pmul(pmono(1,{[v]:1}),pconst(b)),pmul(pconst(a),pmono(1,{[v]:1})),pmul(pconst(a),pconst(b))];
    const its=tl(inner), kk=pconst(k);
    const steps=[
      step('Développe d\'abord le produit des deux parenthèses',M(par(F)+par(G))+' = '+M(rawSum(P))+' = '+M(polyStr(inner))),
      step('Distribue le facteur '+k+' sur chaque terme',...its.map(x=>M(pw(kk))+' × '+M(pw(x))+' = '+M(polyStr(pmul(kk,x))))),
      step('Assemble',M(polyStr(expected)))
    ];
    const mistakes=[
      mis('facteur-double','Le facteur '+M(String(k))+' ne multiplie qu\'une seule fois le produit : tu l\'as appliqué à chaque parenthèse (donc '+M(String(k*k))+' fois au total).',pmul(pconst(k*k),inner)),
      mis('oubli-distribution','Le facteur '+M(String(k))+' n\'a été distribué que sur le premier terme du produit développé : il doit multiplier <b>chaque</b> terme.',padd(pmul(kk,its[0]),psum(its.slice(1))))
    ];
    return mkEx({kind:'expand',statement:k+par(F)+par(G),expected,expectedStr:polyStr(expected),steps,mistakes,
      hints:['Développe d\'abord le produit des deux parenthèses, puis multiplie chaque terme obtenu par '+M(String(k))+'.','Les deux parenthèses donnent '+M(polyStr(inner))+'. Multiplie maintenant par '+M(String(k))+'.']});
  }
  const sq=(c,d)=>{ const F=bin(c,d); return {str:par(F)+'^2',poly:ppow(F,2)}; };
  const prod=()=>{ const F=bin(1,nz(-6,6)), G=bin(1,nz(-6,6)); return {str:par(F)+par(G),poly:pmul(F,G)}; };
  const monoTimes=()=>{ const km=pmono(pick([1,2,3,-2]),{[v]:1}), F=bin(1,nz(-6,6)); return {str:polyStr(km)+par(F),poly:pmul(km,F)}; };
  let P1, P2;
  if(t===2){ P1=pick([()=>sq(1,nz(-6,6)),monoTimes,prod])(); P2=pick([prod,()=>sq(1,nz(-6,6)),monoTimes])(); }
  else { P1=sq(pick([2,3]),nz(-5,5)); P2=sq(pick([1,2]),nz(-5,5)); }
  const op=(t===3||Math.random()<0.65)?'-':'+';
  const expected=op==='+'?padd(P1.poly,P2.poly):psub(P1.poly,P2.poly);
  if(pterms(expected)<1||P1.str===P2.str) return genCombined();
  const steps=[step('Développe chaque partie séparément',M(P1.str)+' = '+M(polyStr(P1.poly)),M(P2.str)+' = '+M(polyStr(P2.poly)))];
  if(op==='-') steps.push(step('Le signe − devant la 2e partie change tous ses signes',M(polyStr(P1.poly)+' - ('+polyStr(P2.poly)+')')+' = '+M(rawSum([...tl(P1.poly),...tl(pneg(P2.poly))]))));
  else steps.push(step('Additionne les deux développements',M(rawSum([...tl(P1.poly),...tl(P2.poly)]))));
  steps.push(step('Réduis',M(polyStr(expected))));
  const mistakes=[];
  if(op==='-'){
    const q=tl(P2.poly);
    mistakes.push(mis('signe-parenthese','Le signe − devant la 2e partie s\'applique à <b>tous</b> ses termes : '+M('A - (B + C) = A - B - C')+'. Tu as traité la soustraction comme une addition.',padd(P1.poly,P2.poly)));
    if(q.length>1) mistakes.push(mis('signe-parenthese','Le signe − devant la 2e partie doit changer le signe de <b>chaque</b> terme, pas seulement du premier.',padd(P1.poly,padd(pneg(q[0]),psum(q.slice(1))))));
  }
  return mkEx({kind:'expand',statement:P1.str+' '+op+' '+P2.str,expected,expectedStr:polyStr(expected),steps,mistakes,
    hints:['Développe chaque partie séparément, puis combine-les.'+(op==='-'?' Attention : le − devant la 2e partie change tous les signes.':''),'Première partie : '+M(P1.str)+' = '+M(polyStr(P1.poly))+'.']});
}

/* ---------- Niveau 5 : trois facteurs et cubes ---------- */
function genTriple(){
  if(Math.random()<0.6){
    const v=pick(['x','x','x','y','t']), a=nz(-5,5), b=nz(-5,5), c=nz(-5,5);
    const F=lin(1,a,v), G=lin(1,b,v), H=lin(1,c,v), FG=pmul(F,G), expected=pmul(FG,H);
    const steps=[
      step('Développe deux parenthèses',M(par(F)+par(G))+' = '+M(polyStr(FG))),
      step('Multiplie le résultat par la troisième parenthèse',...tl(FG).map(t=>M(pw(t))+' × '+M(par(H))+' = '+M(polyStr(pmul(t,H))))),
      step('Réduis',M(polyStr(expected)))
    ];
    const x1={[keyOf({[v]:1})]:1};
    const mistakes=[
      mis('oubli-terme','Le terme en '+M(v)+' semble oublié : il regroupe les produits « deux à deux » des nombres.',psum([pmono(1,{[v]:3}),pmono(a+b+c,{[v]:2}),pconst(a*b*c)])),
      mis('signe','Le terme constant est le produit des trois nombres : vérifie son signe.',flip(expected,pconst(a*b*c)))
    ];
    return mkEx({kind:'expand',statement:par(F)+par(G)+par(H),expected,expectedStr:polyStr(expected),steps,mistakes,
      hints:['Développe d\'abord deux parenthèses, puis multiplie le résultat par la troisième.','Les deux premières donnent '+M(polyStr(FG))+'. Distribue maintenant chacun de ses termes sur '+M(par(H))+'.']});
  }
  const v=pick(['x','y','t']), a=pick([1,2,3]), b=nz(-4,4), A=pmono(a,{[v]:1}), B=pconst(b);
  const A3=ppow(A,3), A2B=pmul(pmul(A,A),B), AB2=pmul(A,pmul(B,B)), B3=ppow(B,3);
  const t2=pmul(pconst(3),A2B), t3=pmul(pconst(3),AB2), expected=psum([A3,t2,t3,B3]), stmt='('+polyStr(lin(a,b,v))+')^3';
  const steps=[
    step('Utilise l\'identité du cube',M('(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3'),'Ici '+M('a = '+polyStr(A))+' et '+M('b = '+String(b))+'.'),
    step('Calcule chaque terme',M('a^3')+' = '+M('('+polyStr(A)+')^3')+' = '+M(polyStr(A3)),M('3a^2b')+' = 3 × '+M('('+polyStr(A)+')^2')+' × '+M(pw(B))+' = '+M(polyStr(t2)),M('3ab^2')+' = 3 × '+M(pw(A))+' × '+M('('+String(b)+')^2')+' = '+M(polyStr(t3)),M('b^3')+' = '+M(pw(B)+'^3')+' = '+M(polyStr(B3))),
    step('Assemble',M(polyStr(expected)))
  ];
  const mistakes=[
    mis('identite-cube',M('(a + b)^3')+' n\'est pas égal à '+M('a^3 + b^3')+' : il y a deux termes intermédiaires, '+M('3a^2b')+' et '+M('3ab^2')+'.',padd(A3,B3)),
    mis('identite-double-produit','Les termes intermédiaires sont '+M('3a^2b')+' et '+M('3ab^2')+' : le facteur 3 a été oublié.',psum([A3,A2B,AB2,B3]))
  ];
  return mkEx({kind:'expand',statement:stmt,expected,expectedStr:polyStr(expected),steps,mistakes,
    hints:['Cube d\'un binôme : '+M('(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3')+'.','Ici '+M('a = '+polyStr(A))+' et '+M('b = '+String(b))+'. Attention au signe de '+M('b')+' dans chaque terme.']});
}
