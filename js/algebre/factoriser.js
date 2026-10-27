'use strict';
/* ===== Générateurs d'exercices : factorisation ===== */
/* produit qui garde ses facteurs (affichage d'une factorisation fausse dans « Corrige la copie ») */
function pmulS(a,b){ const r=pmul(a,b); try{ Object.defineProperty(r,'_f',{value:[a,b],enumerable:false}); }catch(e){} return r; }
const pf=p=>pterms(p)>1?par(p):polyStr(p);                       // facteur : parenthèses seulement si somme
function pairsOf(c,b){                                              // paires d'entiers de produit c, somme du signe de b
  const res=[];
  divisors(c).forEach(d=>{
    const e=Math.abs(c)/d; if(d>e) return;
    const cand=c>0?[[d,e],[-d,-e]]:[[d,-e],[-d,e]];
    cand.forEach(pr=>{ if(Math.sign(pr[0]+pr[1])===Math.sign(b)) res.push(pr); });
  });
  return res;
}
function pairLines(prod,sum,label){
  return pairsOf(prod,sum).map(([m,n])=>{
    const hit=m+n===sum;
    return '<span class="pair'+(hit?' hit':'')+'">'+M(String(m))+' × '+M(String(n))+' = '+M(String(prod))+'&nbsp;&nbsp;;&nbsp;&nbsp;'+M(String(m))+' + '+M(String(n))+' = '+M(String(m+n))+(hit?' ✓':'')+'</span>';
  });
}

/* ---------- Niveau 1 : mise en évidence ---------- */
function genCommonFactor(){
  const vs=pick([['x'],['x'],['x'],['a','b'],['x','y'],['m','n']]), u=vs[0], w=vs[1]||u;
  const kind=pick(vs.length===2?['num','mono','quad','two','two']:['num','mono','quad','mono2']);
  let G=pconst(3), Q=lin(2,3,u), E;
  for(let tries=0;tries<120;tries++){
    let g,q;
    if(kind==='num'){ g=pconst(pick([2,3,4,5,6,7,8,9,10,12])); q=Math.random()<0.7?lin(nz(-7,9),nz(-9,9),u):psum([pmono(nz(-5,5),{[u]:2}),pmono(nz(-6,6),{[u]:1}),pconst(nz(-9,9))]); }
    else if(kind==='mono'){ g=pmono(pick([1,2,3,4,5,6]),{[u]:1}); q=lin(nz(-6,6),nz(-9,9),u); }
    else if(kind==='mono2'){ g=pmono(pick([1,2,3,4]),{[u]:2}); q=lin(nz(-5,5),nz(-6,6),u); }
    else if(kind==='quad'){ g=pick([pconst(pick([2,3,4,5])),pmono(pick([1,2,3]),{[u]:1})]); q=psum([pmono(nz(-3,3),{[u]:2}),pmono(nz(-6,6),{[u]:1}),pconst(nz(-9,9))]); }
    else if(Math.random()<0.5){ g=pmono(pick([1,2,3,4,5]),{[u]:1}); q=lin(nz(-6,6),nz(-9,9),w); }
    else { g=pmono(pick([1,2,3,4]),{[u]:1,[w]:1}); q=padd(pmono(nz(-5,5),{[u]:1}),pmono(nz(-5,5),{[w]:1})); }
    if(pterms(q)<2 || canFactorFurther(q)) continue;
    const e=pmul(g,q);
    if(pterms(e)!==pterms(q) || Math.max(...Object.values(e).map(Math.abs))>120) continue;
    if(e[Object.keys(e).sort(cmpKeys)[0]]<0){ g=pneg(g); q=pneg(q); }
    G=g; Q=q; break;
  }
  E=pmul(G,Q);
  const cg=content(E), cm=commonMono(E), Gs=polyStr(G), es=tl(E), qs=tl(Q), model=Gs+par(Q);
  const coefs=es.map(t=>Math.abs(Object.values(t)[0]));
  const s1=['PGCD('+coefs.map(c=>M(String(c))).join(' ; ')+') = '+M(String(cg))+'.',
    Object.keys(cm).length?'Lettres communes à tous les termes : '+M(monoStr(cm))+' (on garde le plus petit exposant).':'Aucune lettre n\'est commune à tous les termes.'];
  if(Object.values(G)[0]<0) s1.push('Le premier terme est négatif : on choisit un facteur commun négatif, ce qui change le signe de tous les termes de la parenthèse.');
  s1.push('Facteur commun : '+M(Gs)+'.');
  const steps=[
    step('Cherche le facteur commun',...s1),
    step('Divise chaque terme par le facteur commun',...es.map((t,i)=>M(polyStr(t))+' ÷ '+M(pw(G))+' = '+M(polyStr(qs[i])))),
    step('Écris le produit',M(model)),
    step('Vérifie en développant',M(model)+' = '+M(polyStr(E)))
  ];
  const mistakes=[];
  qs.forEach((q,i)=>{
    mistakes.push(mis('division-oubliee','Tu as sorti le facteur commun, mais le terme n°'+(i+1)+' de la parenthèse n\'a pas été divisé par '+M(pw(G))+'. Développe ta réponse pour vérifier : tu dois retrouver l\'énoncé.',pmulS(G,padd(psub(Q,q),es[i]))));
    mistakes.push(mis('signe','Le signe du terme n°'+(i+1)+' de la parenthèse est faux : refais la division en tenant compte du signe du facteur commun.',pmulS(G,padd(Q,pneg(pmulS(pconst(2),q))))));
    if(Object.keys(q)[0]==='' && Math.abs(Object.values(q)[0])===1) mistakes.push(mis('oubli-1','Quand un terme est égal au facteur commun (ou à son opposé), il reste 1 dans la parenthèse et non 0 : le terme ne disparaît pas.',pmulS(G,psub(Q,q))));
  });
  return mkEx({kind:'factor',statement:polyStr(E),expected:E,expectedStr:model,steps,mistakes,
    hints:['Cherche ce qui est commun à tous les termes : un nombre (PGCD) et/ou une lettre.','Le facteur commun est '+M(Gs)+'. Divise chaque terme par lui et écris les quotients dans la parenthèse.']});
}

/* ---------- Niveau 2 : facteur commun binôme et groupement ---------- */
function genBinomOrGroup(){
  const r=Math.random();
  if(r<0.35) return genBinomA();
  if(r<0.6) return genBinomB();
  return genGroup();
}
function genBinomA(){
  const v=pick(['x','x','x','y','a']); let C,t1,t2,cof;
  for(let i=0;i<80;i++){
    C=lin(pick([1,1,1,2,3]),nz(-9,9),v);
    let u=pmono(pick([1,2,3,4,-1,-2,-3]),{[v]:1}), w=pconst(nz(-9,9));
    [t1,t2]=Math.random()<0.5?[u,w]:[w,u];
    cof=padd(t1,t2);
    if(!canFactorFurther(C) && pterms(cof)===2 && !canFactorFurther(cof)) break;
  }
  const E=pmul(C,cof), s2=polyStr(t2);
  const statement=polyStr(t1)+par(C)+(s2[0]==='-'?' - '+s2.slice(1):' + '+s2)+par(C), model=par(C)+par(cof);
  const steps=[
    step('Repère le facteur commun','La parenthèse '+M(par(C))+' apparaît dans les deux termes : c\'est le facteur commun.'),
    step('Sors-le de la somme','Ce qui reste devant chaque parenthèse s\'additionne :',M(par(C)+'('+rawSum([t1,t2])+')')+' = '+M(model)),
    step('Vérifie en développant',M(model)+' = '+M(polyStr(E)))
  ];
  const mistakes=[
    mis('oubli-terme','Quand tu sors '+M(par(C))+', il reste <b>les deux</b> termes dans l\'autre parenthèse : '+M(polyStr(t1))+' et '+M(polyStr(t2))+' (avec leurs signes).',pmulS(C,t1)),
    mis('signe','Le signe du second terme de la parenthèse est faux : ce qui reste devant la parenthèse garde son signe.',pmulS(C,psub(t1,t2)))
  ];
  return mkEx({kind:'factor',statement,expected:E,expectedStr:model,steps,mistakes,
    hints:['Repère la parenthèse qui se répète dans les deux termes.','Sors '+M(par(C))+' : dans la seconde parenthèse, écris ce qui reste devant chacune des deux parenthèses.']});
}
function genBinomB(){
  const v=pick(['x','x','x','y','a']); let C,D,F,cof,op;
  for(let i=0;i<100;i++){
    C=lin(pick([1,1,2]),nz(-8,8),v); D=lin(pick([1,2,-1]),nz(-6,6),v); F=lin(pick([1,2,3]),nz(-6,6),v); op=Math.random()<0.6?'+':'-';
    cof=op==='+'?padd(D,F):psub(D,F);
    if(!canFactorFurther(C) && pterms(cof)===2 && polyDeg(cof)===1 && !canFactorFurther(cof)) break;
  }
  const E=pmul(C,cof), statement=pf(C)+par(D)+' '+op+' '+pf(C)+par(F), model=pf(C)+par(cof);
  const inner=op==='+'?polyStr(D)+' + '+polyStr(F):par(D)+' - '+par(F);
  const steps=[
    step('Repère le facteur commun','La parenthèse '+M(par(C))+' est présente dans les deux produits.'),
    step('Sors-le','Ce qui reste : '+M(par(D))+' '+op+' '+M(par(F))+'.',M(pf(C)+'('+inner+')')),
    step('Réduis la seconde parenthèse',M(pf(C)+'('+inner+')')+' = '+M(model)),
    step('Vérifie en développant',M(model)+' = '+M(polyStr(E)))
  ];
  const mistakes=[mis('oubli-terme','Quand tu sors '+M(par(C))+', il reste <b>les deux</b> parenthèses '+M(par(D))+' et '+M(par(F))+' reliées par le signe de départ.',pmul(C,D))];
  if(op==='-') mistakes.push(mis('signe-parenthese','Le signe − devant la 2e parenthèse change <b>tous</b> ses signes : '+M('A - (B + C) = A - B - C')+'.',pmulS(C,padd(D,F))));
  else mistakes.push(mis('signe','Ici les deux produits sont additionnés : le facteur qui reste est la <b>somme</b> des deux parenthèses.',pmulS(C,psub(D,F))));
  return mkEx({kind:'factor',statement,expected:E,expectedStr:model,steps,mistakes,
    hints:['Repère la parenthèse identique dans les deux produits.','Sors '+M(par(C))+' : il reste '+M(par(D))+' '+op+' '+M(par(F))+' à réduire.']});
}
function genGroup(){
  if(Math.random()<0.5){
    const v=pick(['x','x','y','t']), a=nz(-6,6), b=rnd(1,9), C=lin(1,a,v), x2=pmono(1,{[v]:2}), cof=padd(x2,pconst(b)), E=pmul(C,cof);
    const g1=pmul(x2,C), g2=pmul(pconst(b),C), model=par(C)+par(cof);
    const steps=[
      step('Regroupe les termes deux par deux',M('('+polyStr(g1)+') + ('+polyStr(g2)+')')),
      step('Factorise chaque groupe',M(polyStr(x2)+par(C)+' + '+b+par(C)),'Les deux groupes contiennent la même parenthèse '+M(par(C))+'.'),
      step('Sors le facteur commun',M(model)),
      step('Vérifie en développant',M(model)+' = '+M(polyStr(E)))
    ];
    const mistakes=[
      mis('signe','Le signe du second terme de la parenthèse est faux : après avoir sorti '+M(par(C))+', il reste '+M(polyStr(x2))+' et le nombre du second groupe avec son signe.',pmulS(C,padd(x2,pconst(-b)))),
      mis('oubli-terme','Après avoir sorti '+M(par(C))+', il reste deux termes dans l\'autre parenthèse : un pour chaque groupe.',pmulS(C,x2))
    ];
    return mkEx({kind:'factor',statement:polyStr(E),expected:E,expectedStr:model,steps,mistakes,
      hints:['Quatre termes : essaie de les regrouper deux par deux pour faire apparaître une parenthèse commune.','Regroupe les deux premiers termes et les deux derniers, puis factorise chaque groupe.']});
  }
  const [u,w]=pick(VARS2), s=nz(-6,6), t=nz(-6,6), F=lin(1,s,u), H=lin(1,t,w), E=pmul(F,H), model=par(F)+par(H);
  const g1=padd(pmul(pvar(u),pvar(w)),pmono(t,{[u]:1})), g2=padd(pmono(s,{[w]:1}),pconst(s*t));
  const steps=[
    step('Regroupe les termes deux par deux',M('('+polyStr(g1)+') + ('+polyStr(g2)+')')),
    step('Factorise chaque groupe',M(u+par(H)+(s<0?' - '+(-s):' + '+s)+par(H)),'Les deux groupes contiennent la même parenthèse '+M(par(H))+'.'),
    step('Sors le facteur commun',M(model)),
    step('Vérifie en développant',M(model)+' = '+M(polyStr(E)))
  ];
  const mistakes=[
    mis('facteurs-croises','Développe ta réponse : les nombres '+M(String(s))+' et '+M(String(t))+' ne sont pas placés dans les bonnes parenthèses.',pmulS(lin(1,t,u),lin(1,s,w))),
    mis('signe','Un signe est faux dans l\'une des parenthèses : développe ta réponse pour retrouver le terme fautif.',pmulS(lin(1,-s,u),H))
  ];
  return mkEx({kind:'factor',statement:polyStr(E),expected:E,expectedStr:model,steps,mistakes,
    hints:['Quatre termes : regroupe-les deux par deux pour faire apparaître une parenthèse commune.','Regroupe '+M(polyStr(g1))+' d\'un côté et '+M(polyStr(g2))+' de l\'autre.']});
}

/* ---------- Niveau 3 : identités remarquables ---------- */
function genFactIdent(){
  const two=Math.random()<0.35; let u,w,A,B;
  if(two){ [u,w]=pick(VARS2); A=pmono(pick([1,2,3,4,5]),{[u]:1}); B=pmono(pick([1,2,3,4,5]),{[w]:1}); }
  else { u=pick(['x','x','x','y','a','t']); A=pmono(pick([1,1,2,3,4,5]),{[u]:1}); B=pconst(pick([1,2,3,4,5,6,7,8,9])); }
  if(gcd(Object.values(A)[0],Object.values(B)[0])!==1) return genFactIdent();   // évite un facteur commun numérique caché
  const kind=pick(['sq+','sq-','dsq','dsq','sq+','sq-']), rev=kind==='dsq'&&Math.random()<0.3;
  const a2=pmul(A,A), b2=pmul(B,B), ab2=pmul(pconst(2),pmul(A,B)), As=polyStr(A), Bs=polyStr(B);
  let statement, E, model, steps, mistakes=[], hints;
  if(kind==='dsq'){
    const [P,Qq]=rev?[B,A]:[A,B], Ps=polyStr(P), Qs=polyStr(Qq);
    E=psub(pmul(P,P),pmul(Qq,Qq)); statement=polyStr(pmul(P,P))+' - '+polyStr(pmul(Qq,Qq)); model=pf(lin1(P,Qq,-1))+pf(lin1(P,Qq,1));
    steps=[
      step('Reconnais deux carrés séparés par un signe −',M(polyStr(pmul(P,P)))+' = '+M('('+Ps+')^2'),M(polyStr(pmul(Qq,Qq)))+' = '+M('('+Qs+')^2')),
      step('Applique l\'identité',M('a^2 - b^2 = (a - b)(a + b)'),'Ici '+M('a = '+Ps)+' et '+M('b = '+Qs)+'.'),
      step('Écris la factorisation',M(model))
    ];
    mistakes=[mis('confusion-identites','Il n\'y a pas de terme du milieu ici : '+M('(a - b)^2')+' donnerait '+M('a^2 - 2ab + b^2')+'. Une différence de deux carrés se factorise en un produit de deux parenthèses différentes.',pmulS(lin1(P,Qq,-1),lin1(P,Qq,-1))),
      mis('confusion-identites','Une différence de deux carrés n\'est pas un carré : '+M('(a + b)^2')+' contient un double produit.',pmulS(lin1(P,Qq,1),lin1(P,Qq,1)))];
    hints=['Deux termes, tous deux des carrés, séparés par un signe − : '+M('a^2 - b^2 = (a - b)(a + b)')+'.','Ici '+M('a = '+Ps)+' et '+M('b = '+Qs)+'.'];
  } else {
    const sg=kind==='sq+'?1:-1; E=pmul(lin1(A,B,sg),lin1(A,B,sg)); statement=polyStr(E); model='('+As+(sg>0?' + ':' - ')+Bs+')^2';
    steps=[
      step('Compte les termes et cherche deux carrés','Trois termes, dont deux sont des carrés parfaits :',M(polyStr(a2))+' = '+M('('+As+')^2')+' et '+M(polyStr(b2))+' = '+M('('+Bs+')^2')),
      step('Vérifie le double produit',M('2ab')+' = 2 × '+M(pw(A))+' × '+M(pw(B))+' = '+M(polyStr(ab2)),'C\'est bien la valeur absolue du terme du milieu'+(sg<0?' ; comme il est négatif, on utilise '+M('a - b')+'.':'.')),
      step('Applique l\'identité',M(sg>0?'a^2 + 2ab + b^2 = (a + b)^2':'a^2 - 2ab + b^2 = (a - b)^2'),'Résultat : '+M(model))
    ];
    const other='('+As+(sg>0?' - ':' + ')+Bs+')^2';
    mistakes=[
      mis('signe','Le signe du terme du milieu est '+(sg>0?'+':'−')+' : l\'identité à utiliser est '+M(sg>0?'(a + b)^2':'(a - b)^2')+'.',pmulS(lin1(A,B,-sg),lin1(A,B,-sg))),
      mis('confusion-identites','Le produit '+M('(a + b)(a - b)')+' donne '+M('a^2 - b^2')+', sans terme du milieu. Ici il y a trois termes : c\'est un carré.',pmulS(lin1(A,B,1),lin1(A,B,-1)))
    ];
    hints=['Trois termes dont deux sont des carrés parfaits : pense à '+M('a^2 ± 2ab + b^2')+'.','Ici '+M('a = '+As)+' et '+M('b = '+Bs)+'. Vérifie que le terme du milieu vaut '+M('2ab')+'.'];
  }
  return mkEx({kind:'factor',statement,expected:E,expectedStr:model,steps,mistakes,hints});
}
const lin1=(P,Q,s)=>s>0?padd(P,Q):psub(P,Q);                       // P + Q ou P - Q

/* ---------- Niveau 4 : trinômes ---------- */
function genTrinome(){
  const v=pick(['x','x','x','y','t','n']);
  if(Math.random()<0.6){
    let r,s; do{ r=nz(-9,9); s=nz(-9,9); }while(r===s||r===-s||Math.abs(r*s)>60);
    const F=lin(1,r,v), G=lin(1,s,v), E=pmul(F,G), b=r+s, c=r*s, model=par(F)+par(G);
    const steps=[
      step('Cherche deux nombres de produit '+c+' et de somme '+b,'On cherche '+M('r')+' et '+M('s')+' tels que '+M('r × s = '+c)+' et '+M('r + s = '+b)+'.',...pairLines(c,b)),
      step('Écris la factorisation','Avec '+M('r = '+r)+' et '+M('s = '+s)+' :',M(model)),
      step('Vérifie en développant',M(model)+' = '+M(polyStr(E)))
    ];
    const mistakes=[
      mis('signe-racines','Les signes sont inversés : ta réponse donne un terme en '+M(v)+' de signe opposé. Il faut '+M('r + s = '+b)+' (et non '+M(String(-b))+').',pmulS(lin(1,-r,v),lin(1,-s,v))),
      mis('signe','Vérifie les signes : les deux nombres doivent avoir pour produit '+M(String(c))+' <b>et</b> pour somme '+M(String(b))+'.',pmulS(lin(1,-r,v),lin(1,s,v))),
      mis('signe','Vérifie les signes : les deux nombres doivent avoir pour produit '+M(String(c))+' <b>et</b> pour somme '+M(String(b))+'.',pmulS(lin(1,r,v),lin(1,-s,v)))
    ];
    divisors(c).forEach(d=>{ [[d,c/d],[-d,-c/d]].forEach(([m,n])=>{
      if(m+n!==b) mistakes.push(mis('somme-fausse','Le produit '+M(m+' × '+pw(pconst(n)))+' vaut bien '+M(String(c))+', mais la somme '+M(m+' + '+pw(pconst(n)))+' vaut '+M(String(m+n))+' et non '+M(String(b))+'.',pmulS(lin(1,m,v),lin(1,n,v))));
    }); });
    return mkEx({kind:'factor',statement:polyStr(E),expected:E,expectedStr:model,steps,mistakes,
      hints:['Trinôme '+M('x^2 + bx + c')+' : cherche deux nombres de produit '+M('c')+' et de somme '+M('b')+'.','Il te faut deux nombres dont le produit est '+M(String(c))+' et la somme '+M(String(b))+'. Liste les paires de facteurs de '+M(String(Math.abs(c)))+'.']});
  }
  let p,q,r,s;
  do{ p=pick([1,2,3,4]); q=pick([1,2,3]); r=nz(-8,8); s=nz(-8,8); }
  while((p===1&&q===1)||gcd(p,r)!==1||gcd(q,s)!==1||p*s+q*r===0||(p===q&&r===s)||Math.abs(p*s+q*r)>40);
  const F=lin(p,r,v), G=lin(q,s,v), E=pmul(F,G), a=p*q, b=p*s+q*r, c=r*s, m=p*s, n=q*r, model=par(F)+par(G);
  const split=[pmono(a,{[v]:2}),pmono(m,{[v]:1}),pmono(n,{[v]:1}),pconst(c)];
  const steps=[
    step('Repère '+'a, b et c','Dans '+M(polyStr(E))+' : '+M('a = '+a)+', '+M('b = '+b)+', '+M('c = '+c)+'.',M('a × c = '+a+' × '+pw(pconst(c))+' = '+(a*c))),
    step('Cherche deux nombres de produit '+(a*c)+' et de somme '+b,...pairLines(a*c,b)),
    step('Décompose le terme du milieu','On remplace '+M(polyStr(pmono(b,{[v]:1})))+' par '+M(polyStr(pmono(m,{[v]:1})))+' + '+M(polyStr(pmono(n,{[v]:1})))+' (écrit avec ses signes) :',M(rawSum(split))),
    step('Factorise par groupement',M(polyStr(pmono(p,{[v]:1}))+par(G)+(r<0?' - '+(-r):' + '+r)+par(G))),
    step('Sors le facteur commun',M(par(G)+par(F))+' = '+M(model)),
    step('Vérifie en développant',M(model)+' = '+M(polyStr(E)))
  ];
  const mistakes=[
    mis('facteurs-croises','Développe ta réponse : le terme du milieu ne vient pas juste. Les nombres '+M(String(r))+' et '+M(String(s))+' ne sont pas placés dans les bonnes parenthèses.',pmulS(lin(p,s,v),lin(q,r,v))),
    mis('facteurs-croises','Développe ta réponse : les coefficients de '+M(v)+' ne sont pas placés dans les bonnes parenthèses.',pmulS(lin(q,r,v),lin(p,s,v))),
    mis('signe-racines','Les signes des nombres sont inversés : développe pour t\'en apercevoir.',pmulS(lin(p,-r,v),lin(q,-s,v)))
  ];
  return mkEx({kind:'factor',statement:polyStr(E),expected:E,expectedStr:model,steps,mistakes,
    hints:['Trinôme '+M('ax^2 + bx + c')+' avec '+M('a ≠ 1')+' : calcule '+M('a × c')+', puis cherche deux nombres de produit '+M('a × c')+' et de somme '+M('b')+'.','Ici '+M('a × c = '+(a*c))+' et '+M('b = '+b)+'. Sépare le terme du milieu en deux termes, puis factorise par groupement.']});
}

/* ---------- Niveau 5 : factorisations combinées ---------- */
function genMixed(){
  const t=rnd(1,6), u=pick(['x','x','x','y','t']);
  if(t<=4){
    const G=Math.random()<0.65?pconst(pick([2,3,4,5])):pmono(pick([1,1,2,3]),{[u]:1}), Gs=polyStr(G);
    let base, baseModel, s2Title, s2Lines, mistakes=[], hints;
    if(t<=2){
      const n=rnd(1,7); base=pmulS(lin(1,-n,u),lin(1,n,u)); baseModel=par(lin(1,-n,u))+par(lin(1,n,u));
      s2Title='Factorise la parenthèse : différence de deux carrés';
      s2Lines=[M(polyStr(base))+' = '+M('('+u+')^2 - '+n+'^2')+' = '+M(baseModel)];
      mistakes.push(mis('confusion-identites','Une différence de deux carrés ne se factorise pas en carré : '+M('(a - b)^2')+' contient un double produit.',pmulS(G,pmulS(lin(1,-n,u),lin(1,-n,u)))));
      hints=['Commence par le facteur commun, puis regarde ce qui reste dans la parenthèse.','Le facteur commun est '+M(Gs)+'. Il reste '+M(polyStr(base))+' : quelle identité reconnais-tu ?'];
    } else if(t===3){
      let r,s; do{ r=nz(-6,6); s=nz(-6,6); }while(r===s||r===-s);
      base=pmulS(lin(1,r,u),lin(1,s,u)); baseModel=par(lin(1,r,u))+par(lin(1,s,u));
      s2Title='Factorise le trinôme : produit et somme';
      s2Lines=['Deux nombres de produit '+M(String(r*s))+' et de somme '+M(String(r+s))+' :',...pairLines(r*s,r+s),M(polyStr(base))+' = '+M(baseModel)];
      mistakes.push(mis('signe-racines','Les signes des nombres sont inversés à l\'intérieur des parenthèses.',pmulS(G,pmulS(lin(1,-r,u),lin(1,-s,u)))));
      hints=['Commence par le facteur commun, puis factorise le trinôme restant avec produit et somme.','Le facteur commun est '+M(Gs)+'. Il reste '+M(polyStr(base))+' à factoriser.'];
    } else {
      const n=nz(-6,6); base=pmulS(lin(1,n,u),lin(1,n,u)); baseModel=par(lin(1,n,u))+'^2';
      s2Title='Factorise la parenthèse : carré parfait';
      s2Lines=[M(polyStr(base))+' = '+M('('+u+')^2 '+(n<0?'- ':'+ ')+'2 × '+u+' × '+Math.abs(n)+' + '+Math.abs(n)+'^2')+' = '+M(baseModel)];
      mistakes.push(mis('confusion-identites','Le signe du terme du milieu détermine l\'identité : '+M(n>0?'(a + b)^2':'(a - b)^2')+' ici.',pmulS(G,pmulS(lin(1,-n,u),lin(1,-n,u)))));
      hints=['Commence par le facteur commun, puis regarde si la parenthèse est un carré parfait.','Le facteur commun est '+M(Gs)+'. Il reste '+M(polyStr(base))+'.'];
    }
    const E=pmul(G,base), model=Gs+baseModel;
    mistakes.push(mis('facteur-oublie','Tu as bien factorisé la parenthèse, mais le facteur commun '+M(Gs)+' doit rester devant le résultat.',base));
    const steps=[
      step('Cherche d\'abord un facteur commun','Facteur commun : '+M(Gs)+'.',M(polyStr(E))+' = '+M(Gs+par(base))),
      step(s2Title,...s2Lines),
      step('Écris la factorisation complète',M(model))
    ];
    return mkEx({kind:'factor',statement:polyStr(E),expected:E,expectedStr:model,steps,mistakes,hints});
  }
  if(t===5){
    let a,b; do{ a=nz(-6,6); b=rnd(2,9); }while(false);
    const A=lin(1,a,u), f1=lin(1,a-b,u), f2=lin(1,a+b,u), E=psub(ppow(A,2),pconst(b*b)), model=pf(f1)+pf(f2);
    const steps=[
      step('Reconnais une différence de deux carrés',M('('+polyStr(A)+')^2')+' est un carré et '+M(String(b*b))+' = '+M(b+'^2')+' aussi.',M('a^2 - b^2 = (a - b)(a + b)')+' avec '+M('a = '+polyStr(A))+' et '+M('b = '+b)+'.'),
      step('Remplace a et b',M('('+polyStr(A)+' - '+b+')('+polyStr(A)+' + '+b+')')),
      step('Réduis chaque parenthèse',M(model))
    ];
    const mistakes=[mis('confusion-identites',M('(a - b)^2')+' n\'est pas '+M('a^2 - b^2')+' : ici il faut un produit de deux parenthèses différentes.',pmul(lin(1,a-b,u),lin(1,a-b,u)))];
    return mkEx({kind:'factor',statement:'('+polyStr(A)+')^2 - '+(b*b),expected:E,expectedStr:model,steps,mistakes,
      hints:['Deux carrés séparés par un −, même si l\'un est une parenthèse : '+M('a^2 - b^2 = (a - b)(a + b)')+'.','Ici '+M('a = '+polyStr(A))+' et '+M('b = '+b)+'. N\'oublie pas de réduire chaque parenthèse.']});
  }
  let A,B,f1,f2;
  for(let i=0;i<200;i++){
    A=lin(pick([1,2,3]),nz(-5,5),u); B=lin(pick([1,2,3]),nz(-5,5),u);
    f1=psub(A,B); f2=padd(A,B);
    if(pterms(f1)&&pterms(f2)&&Object.values(A)[0]!==Object.values(B)[0]&&!canFactorFurther(f1)&&!canFactorFurther(f2)&&polyDeg(f1)===1&&polyDeg(f2)===1&&pterms(f1)===2&&pterms(f2)===2) break;
  }
  const E=psub(ppow(A,2),ppow(B,2)), model=pf(f1)+pf(f2);
  const steps=[
    step('Reconnais une différence de deux carrés',M('a^2 - b^2 = (a - b)(a + b)')+' avec '+M('a = '+polyStr(A))+' et '+M('b = '+polyStr(B))+'.'),
    step('Calcule a − b',M('('+polyStr(A)+') - ('+polyStr(B)+')')+' = '+M(rawSum([...tl(A),...tl(pneg(B))]))+' = '+M(polyStr(f1)),'Le signe − change les deux signes de la 2e parenthèse.'),
    step('Calcule a + b',M('('+polyStr(A)+') + ('+polyStr(B)+')')+' = '+M(polyStr(f2))),
    step('Écris la factorisation',M(model))
  ];
  const bx=Object.keys(B).find(k=>k!==''), bc=B[''] ;
  const bad=padd(psub(A,pmono(B[bx],{[u]:1})),pconst(bc||0));
  const mistakes=[mis('signe-parenthese','En calculant '+M('a - b')+', le signe − change <b>tous</b> les signes de la 2e parenthèse : '+M('A - (B + C) = A - B - C')+'.',pmul(bad,f2))];
  return mkEx({kind:'factor',statement:'('+polyStr(A)+')^2 - ('+polyStr(B)+')^2',expected:E,expectedStr:model,steps,mistakes,
    hints:['Deux carrés séparés par un − : '+M('a^2 - b^2 = (a - b)(a + b)')+', avec des parenthèses pour a et b.','Ici '+M('a = '+polyStr(A))+' et '+M('b = '+polyStr(B))+'. Calcule '+M('a - b')+' et '+M('a + b')+' avec soin.']});
}

/* ---------- Applications techniques : aires de plaques (mm) ---------- */
function withCtx(ex,ctx,firstStep){ ex.context=ctx; if(firstStep) ex.steps.unshift(firstStep); return ex; }
function genCtxDev(){
  if(Math.random()<0.5){
    for(let i=0;i<300;i++){
      const ex=genDouble(), m=ex.statement.match(/^\(x \+ (\d+)\)\(x \+ (\d+)\)$/);
      if(m) return withCtx(ex,'Une plaque rectangulaire a pour longueur '+M('(x + '+m[2]+')')+' mm et pour largeur '+M('(x + '+m[1]+')')+' mm, où '+M('x')+' est une cote en mm. Exprime son aire (en mm²) sous forme développée.',
        step('Traduis la situation en calcul','L\'aire d\'un rectangle est longueur × largeur :',M(ex.statement)));
    }
  }
  for(let i=0;i<400;i++){
    const ex=genIdentExpand(), m=ex.statement.match(/^\((\d*)x \+ (\d+)\)\^2$/);
    if(m){ const side=ex.statement.slice(0,ex.statement.lastIndexOf('^'));
      return withCtx(ex,'Une plaque carrée a pour côté '+M(side)+' mm, où '+M('x')+' est une cote en mm. Exprime son aire (en mm²) sous forme développée.',
        step('Traduis la situation en calcul','L\'aire d\'un carré est côté × côté :',M(ex.statement)+' = '+M(side+side))); }
  }
  return genDouble();
}
function genCtxFact(){
  if(Math.random()<0.5){
    for(let i=0;i<400;i++){
      const ex=genFactIdent(), m=ex.statement.match(/^(\d*)x\^2 - (\d+)$/);
      if(m && isSq(+m[1]||1) && isSq(+m[2])){
        const sa=sqrtInt(+m[1]||1), b=sqrtInt(+m[2]), A=sa===1?'x':sa+'x';
        return withCtx(ex,'Une plaque carrée de côté '+M(A)+' mm est percée d\'un trou carré de côté '+M(String(b))+' mm. Son aire restante (en mm²) est donnée par l\'expression ci-dessous. Factorise-la.',
          step('Traduis la situation en calcul','Aire restante = aire de la plaque − aire du trou :',M('('+A+')^2 - '+b+'^2')+' = '+M(ex.statement),'C\'est une différence de deux carrés.'));
      }
    }
  }
  for(let i=0;i<400;i++){
    const ex=genTrinome();
    if(/^\(x \+ \d+\)\(x \+ \d+\)$/.test(ex.expectedStr))
      return withCtx(ex,'L\'aire d\'un rectangle (en mm²) est donnée par l\'expression ci-dessous. Factorise-la pour obtenir les deux côtés du rectangle.',
        step('Traduis la situation en calcul','Aire = longueur × largeur : les deux côtés sont les deux facteurs de la factorisation.'));
  }
  return genTrinome();
}

/* ---------- Catalogue ---------- */
const TOPICS={
  'dist-simple':{kind:'expand',level:1,label:'Distribution simple',gen:genDistSimple},
  'double':{kind:'expand',level:2,label:'Double distribution',gen:genDouble},
  'identites-dev':{kind:'expand',level:3,label:'Identités remarquables',gen:genIdentExpand},
  'combine':{kind:'expand',level:4,label:'Expressions combinées',gen:genCombined},
  'triple':{kind:'expand',level:5,label:'Trois facteurs et cubes',gen:genTriple},
  'commun':{kind:'factor',level:1,label:'Facteur commun',gen:genCommonFactor},
  'binome':{kind:'factor',level:2,label:'Binôme commun et groupement',gen:genBinomOrGroup},
  'identites-fact':{kind:'factor',level:3,label:'Identités remarquables',gen:genFactIdent},
  'trinome':{kind:'factor',level:4,label:'Trinômes',gen:genTrinome},
  'mixte':{kind:'factor',level:5,label:'Factorisations combinées',gen:genMixed},
  'ctx-dev':{kind:'expand',level:3,label:'Applications : aires',gen:genCtxDev},
  'ctx-fact':{kind:'factor',level:4,label:'Applications : aires',gen:genCtxFact}
};
const LEVEL_NAMES={1:'Niveau 1',2:'Niveau 2',3:'Niveau 3',4:'Niveau 4',5:'Niveau 5'};
const domainOf=kind=>(kind==='expand'||kind==='factor')?'alg':(/^g/.test(kind)?'geo':/^en/.test(kind)?'ang':/^frf/.test(kind)?'ff':/^fs/.test(kind)?'fs':/^fr/.test(kind)?'fr':'eq');
function newExercise(mode,level,avoid,pool,domain){
  const ids=pool&&pool.length?pool:Object.keys(TOPICS).filter(id=>(mode==='mix'?domainOf(TOPICS[id].kind)===(domain||'alg'):TOPICS[id].kind===mode)&&(!level||TOPICS[id].level===level));
  let ex;
  for(let i=0;i<40;i++){
    const id=pick(ids); ex=TOPICS[id].gen(); ex.topic=id; ex.level=TOPICS[id].level;
    if(!avoid||!avoid.includes(ex.statement)) break;
  }
  ex.vars=ex.vars&&ex.vars.length?ex.vars:varsOfPoly(ex.expected);
  return ex;
}
