'use strict';
/* ===== Second degré : discriminant, formule, Viète ===== */
const qpoly=(a,b,c,v)=>padd(padd(pmono(a,{[v]:2}),ax(b,v)),pconst(c));
const isq=n=>{ const k=Math.round(Math.sqrt(n)); return k*k===n; };
const paren=n=>n<0?'('+n+')':String(n);
function arrangeQ(a,b,c,v){
  const r=Math.random();
  if(r<0.25&&c!==0) return {eqL:padd(pmono(a,{[v]:2}),ax(b,v)),eqR:pconst(-c)};
  if(r<0.5&&b!==0) return {eqL:padd(pmono(a,{[v]:2}),pconst(c)),eqR:ax(-b,v)};
  return {eqL:qpoly(a,b,c,v),eqR:pconst(0)};
}
function mkQuad(a,b,c,v,nonstd){
  const D=b*b-4*a*c, P=qpoly(a,b,c,v), arr=nonstd?arrangeQ(a,b,c,v):{eqL:P,eqR:pconst(0)};
  const stmt=polyStr(arr.eqL)+' = '+polyStr(arr.eqR), moved=!(Object.keys(arr.eqR).length===0);
  const t4=-4*a*c, d2=2*a, den=paren(d2);
  const steps=[];
  if(moved) steps.push(step('Mets l\'équation sous la forme '+M('ax^2 + bx + c = 0'),'On ramène tout dans le membre de gauche :',M(polyStr(P)+' = 0')));
  steps.push(step('Repère les coefficients',M('a = '+a+' ; b = '+b+' ; c = '+c),'Les signes font partie des coefficients.'));
  steps.push(step('Calcule le discriminant',M('Δ = b^2 - 4ac'),M('Δ = '+paren(b)+'^2 - 4 × '+paren(a)+' × '+paren(c)+' = '+(b*b)+(t4<0?' - '+(-t4):' + '+t4)+' = '+D)));
  const roots=quadSolFrom(-b,D,d2);
  if(D<0) steps.push(step('Conclus sur le signe de '+M('Δ'),M('Δ < 0'),'Une racine carrée d\'un nombre négatif n\'existe pas : l\'équation n\'a <b>aucune solution réelle</b>.'));
  else if(D===0) steps.push(step('Conclus sur le signe de '+M('Δ'),M('Δ = 0')+' : une seule solution (double).',M('x = -b/(2a) = '+(-b)+'/'+den+' = '+rStr(roots.roots[0]))));
  else if(isq(D)){ const k=Math.round(Math.sqrt(D));
    steps.push(step('Conclus sur le signe de '+M('Δ'),M('Δ > 0')+' : deux solutions distinctes, avec '+M('√Δ = '+k)+'.'));
    steps.push(step('Applique la formule',M('x = (-b ± √Δ)/(2a)'),M('x₁ = ('+(-b)+' - '+k+')/'+den+' = '+rStr(rat(-b-k,d2))+'   et   x₂ = ('+(-b)+' + '+k+')/'+den+' = '+rStr(rat(-b+k,d2))))); }
  else { const [o,r]=sqfree(D);
    steps.push(step('Conclus sur le signe de '+M('Δ'),M('Δ > 0')+' : deux solutions distinctes. '+M(String(D))+' n\'est pas un carré parfait : les solutions s\'écrivent avec une racine.'));
    steps.push(step('Simplifie la racine',o>1?M('√'+D+' = √'+(o*o)+' × √'+r+' = '+o+'√'+r):M('√'+D+' ne se simplifie pas.')));
    steps.push(step('Applique la formule',M('x = (-b ± √Δ)/(2a) = ('+(-b)+' ± '+(o>1?o:'')+'√'+r+')/'+den),'On simplifie la fraction si possible :',roots.roots.map(x=>M('x = '+rStr(x))).join(' ou '))); }
  if(D>=0) steps.push(step('Vérifie avec les relations de Viète',M('x₁ + x₂ = -b/a = '+rStr(rat(-b,a))+' ; x₁ × x₂ = c/a = '+rStr(rat(c,a))),'Si la somme et le produit de tes solutions donnent ces valeurs, tes solutions sont bonnes.'));
  const mk=[];
  const add=(tag,msg,sol)=>mk.push({tag,msg,sol});
  const D1=b*b+4*a*c; add('eq-delta','Le discriminant est '+M('b^2 - 4ac')+' : le signe devant '+M('4ac')+' est un moins. Si '+M('a × c')+' est négatif, alors '+M('-4ac')+' est positif.',quadSolFrom(-b,D1,d2));
  add('eq-delta','Dans '+M('Δ = b^2 - 4ac')+', le terme '+M('b')+' est mis <b>au carré</b>.',quadSolFrom(-b,b-4*a*c,d2));
  add('eq-formule','La formule commence par '+M('-b')+', l\'<b>opposé</b> de '+M('b')+'. Ici '+M('-b = '+(-b))+'.',quadSolFrom(b,D,d2));
  add('eq-formule','Le dénominateur de la formule est '+M('2a')+', pas '+M('a')+', et il divise tout le numérateur.',quadSolFrom(-b,D,a));
  if(D>0){ const s=quadSolFrom(-b,D,d2); s.roots.forEach((r,i)=>add('eq-un-facteur','Quand '+M('Δ > 0')+', il y a deux solutions : le signe ± donne un calcul avec + et un avec −.',setOf([s.roots[1-i]])));
    add('eq-formule','C\'est la racine carrée de '+M('Δ')+' qui intervient dans la formule, pas '+M('Δ')+' lui-même.',setOf([rat(-b+D,d2),rat(-b-D,d2)])); }
  if(D<0) add('eq-delta','Quand '+M('Δ < 0')+', il n\'y a pas de solution réelle : on ne calcule pas de racine carrée d\'un nombre négatif.',setOf([rat(-b,d2)]));
  if(D===0) add('eq-formule','Quand '+M('Δ = 0')+', la solution est '+M('x = -b/(2a)')+' : le dénominateur est '+M('2a')+'.',setOf([rat(-b,a)]));
  const ex=mkEq({v,eqL:arr.eqL,eqR:arr.eqR,statement:stmt,steps,mistakes:mk,
    hints:['Mets d\'abord l\'équation sous la forme '+M('ax^2 + bx + c = 0')+', puis lis '+M('a')+', '+M('b')+' et '+M('c')+' avec leur signe.','Calcule '+M('Δ = b^2 - 4ac')+' : si '+M('Δ < 0')+' il n\'y a aucune solution réelle, si '+M('Δ = 0')+' une seule, sinon deux.','Les solutions sont '+M('x = (-b ± √Δ)/(2a)')+'. Écris la valeur exacte, avec la racine si '+M('Δ')+' n\'est pas un carré parfait.']});
  return ex;
}
function coprime(p,q){ return gcd(p,q)===1; }
function genQuad1(){
  const v=pick(['x','x','x','t','y']), r=Math.random();
  for(let i=0;i<300;i++){
    if(r<0.6){ const q1=pick([1,1,2,3]), q2=pick([1,1,2,3]), p1=nz(-8,8), p2=nz(-8,8); if(!coprime(p1,q1)||!coprime(p2,q2)||p1*q2===p2*q1) continue; const k=pick([1,1,-1,2]);
      const a=k*q1*q2, b=-k*(q1*p2+q2*p1), c=k*p1*p2; if(Math.abs(a)>6||Math.abs(b)>40||Math.abs(c)>60) continue; return mkQuad(a,b,c,v,Math.random()<0.4); }
    if(r<0.8){ const m=pick([1,1,2,3]), n=nz(-7,7), k=pick([1,1,-1,2]); if(!coprime(m,n)) continue; return mkQuad(k*m*m,2*k*m*n,k*n*n,v,Math.random()<0.3); }
    const a=pick([1,1,2,3,-1,-2]), b=rnd(-6,6), c=rnd(-9,9); if(b*b-4*a*c>=0||c===0) continue; return mkQuad(a,b,c,v,Math.random()<0.4);
  }
  return genQuad1();
}
function genQuad2(){
  const v=pick(['x','x','x','t','y']);
  for(let i=0;i<500;i++){
    const a=pick([1,1,1,2,3,-1,-2]), b=rnd(-9,9), c=nz(-9,9), D=b*b-4*a*c; if(D<=0||isq(D)) continue;
    if(i<200&&sqfree(D)[0]===1&&Math.random()<0.7) continue;
    return mkQuad(a,b,c,v,Math.random()<0.4);
  }
  return genQuad2();
}

/* ---------- Viète ---------- */
const errOf=(val,tag,msg)=>({val,tag,msg});
function uniqErrs(list,truth){ return list.filter((e,i)=>!rEq(e.val,truth)&&list.findIndex(x=>rEq(x.val,e.val))===i); }
function pickABC(needDelta){
  for(let i=0;i<500;i++){ const a=pick([1,1,2,3,-1,-2,4,5]), b=rnd(-9,9), c=nz(-9,9); if(b*b-4*a*c>=0&&b!==0) return [a,b,c]; }
  return [1,-5,6];
}
function vieteBase(a,b,c,v,nonstd){
  const P=qpoly(a,b,c,v), arr=nonstd?arrangeQ(a,b,c,v):{eqL:P,eqR:pconst(0)};
  return {arr,stmt:polyStr(arr.eqL)+' = '+polyStr(arr.eqR),P};
}
function finishViete(ex,tx,o){
  ex.word=true; ex.html=tx.html; ex.statement=tx.plain; ex.viete={targets:o.targets,recall:o.recall};
  ex.expectedStr=o.expectedStr; ex.expectedHtml=M(o.expectedStr); ex.instr=o.instr; ex.placeholder=o.placeholder; ex.hintline=o.hintline; ex.mistakes=[];
  return ex;
}
function genVieteSP(){
  const v=pick(['x','x','x','t','y']), [a,b,c]=pickABC(), B=vieteBase(a,b,c,v,Math.random()<0.4), S=rat(-b,a), Pr=rat(c,a), D=b*b-4*a*c;
  const tx=TX('Sans résoudre l\'équation «'+B.stmt+'», donne la somme «S» et le produit «P» de ses solutions.');
  const ex=mkEq({v,eqL:B.arr.eqL,eqR:B.arr.eqR,statement:tx.plain,mistakes:[],steps:[],hints:[]});
  ex.steps=[step('Repère les coefficients',M('a = '+a+' ; b = '+b+' ; c = '+c),'Mets d\'abord l\'équation sous la forme '+M('ax^2 + bx + c = 0')+' si besoin.'),
    step('Applique les relations de Viète',M('S = x₁ + x₂ = -b/a = -'+paren(b)+'/'+paren(a)+' = '+rStr(S)),M('P = x₁ × x₂ = c/a = '+paren(c)+'/'+paren(a)+' = '+rStr(Pr))),
    step('Vérifie que les solutions existent','Les relations n\'ont de sens que si '+M('Δ ≥ 0')+' : ici '+M('Δ = '+D)+'. Elles fonctionnent même si les solutions sont irrationnelles.')];
  ex.hints=['Pour '+M('ax^2 + bx + c = 0')+', les solutions '+M('x₁')+' et '+M('x₂')+' vérifient '+M('x₁ + x₂ = -b/a')+' et '+M('x₁ × x₂ = c/a')+'.','Lis '+M('a')+', '+M('b')+' et '+M('c')+' avec leurs signes, puis divise par '+M('a')+'.'];
  const sErr=uniqErrs([errOf(rat(b,a),'eq-viete-signe','La somme est '+M('-b/a')+' : il y a un signe moins devant '+M('b')+'. Ici '+M('b = '+b)+', donc '+M('-b = '+(-b))+'.'),
    errOf(rat(-b,1),'eq-viete-a','Il faut diviser par '+M('a')+' : '+M('S = -b/a')+' avec '+M('a = '+a)+'.'),errOf(rat(c,a),'eq-viete-signe','Tu as donné le produit à la place de la somme : '+M('S = -b/a')+' et '+M('P = c/a')+'.')],S);
  const pErr=uniqErrs([errOf(rat(-c,a),'eq-viete-signe','Le produit est '+M('c/a')+', sans signe moins (le signe moins est pour la somme).'),
    errOf(rat(c,1),'eq-viete-a','Il faut diviser par '+M('a')+' : '+M('P = c/a')+' avec '+M('a = '+a)+'.'),errOf(rat(-b,a),'eq-viete-signe','Tu as donné la somme à la place du produit : '+M('P = c/a')+'.')],Pr);
  return finishViete(ex,tx,{targets:[{key:'S',re:/^(s|somme)$/i,value:S,formula:'S = -b/a',errs:sErr},{key:'P',re:/^(p|produit)$/i,value:Pr,formula:'P = c/a',errs:pErr}],
    recall:'Pour ax² + bx + c = 0 : S = x₁ + x₂ = −b/a et P = x₁ × x₂ = c/a.',expectedStr:'S = '+rStr(S)+' ; P = '+rStr(Pr),
    instr:'Donne S et P sans résoudre',placeholder:'S = 5 ; P = 6',hintline:'Écris S = … et P = … (sur la même ligne avec « ; » ou sur deux lignes). Les fractions sont acceptées, par exemple S = 5/2.'});
}
const EXPRS=[
  {t:'x₁^2 + x₂^2',f:(S,P)=>S*S-2*P,how:'x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂ = S² − 2P',errs:[(S,P)=>S*S+2*P,(S,P)=>S*S,(S,P)=>S*S-P]},
  {t:'1/x₁ + 1/x₂',f:(S,P)=>S/P,how:'1/x₁ + 1/x₂ = (x₁ + x₂)/(x₁x₂) = S/P',needP:true,errs:[(S,P)=>P/S,(S,P)=>S*P,(S,P)=>-S/P]},
  {t:'(x₁ - 1)(x₂ - 1)',f:(S,P)=>P-S+1,how:'(x₁ − 1)(x₂ − 1) = x₁x₂ − (x₁ + x₂) + 1 = P − S + 1',errs:[(S,P)=>P+S+1,(S,P)=>P-S-1,(S,P)=>P-S]},
  {t:'(x₁ - x₂)^2',f:(S,P)=>S*S-4*P,how:'(x₁ − x₂)² = (x₁ + x₂)² − 4x₁x₂ = S² − 4P',errs:[(S,P)=>S*S-2*P,(S,P)=>S*S+4*P,(S,P)=>S*S-P]}
];
function genVieteExpr(){
  const v=pick(['x','x','x','t','y']);
  for(let i=0;i<300;i++){
    const [a,b,c]=pickABC(), E=pick(EXPRS); if(E.needP&&c===0) continue;
    const Sn=-b/a, Pn=c/a, B=vieteBase(a,b,c,v,Math.random()<0.3);
    const val=floatToRat(E.f(Sn,Pn)); if(!val) continue;
    const errs=uniqErrs(E.errs.map(f=>{ const x=f(Sn,Pn); const r=isFinite(x)?floatToRat(x):null; return r?errOf(r,'eq-viete-expr','Exprime d\'abord l\'expression avec '+M('S')+' et '+M('P')+' : '+M(E.how.replace(/x₁\^2/g,'x₁^2'))+'.'):null; }).filter(Boolean),val);
    const tx=TX('Soient «x₁» et «x₂» les solutions de l\'équation «'+B.stmt+'». Sans la résoudre, calcule «'+E.t+'».');
    const ex=mkEq({v,eqL:B.arr.eqL,eqR:B.arr.eqR,statement:tx.plain,mistakes:[],steps:[],hints:[]});
    ex.steps=[step('Calcule S et P',M('S = -b/a = '+rStr(rat(-b,a))+' ; P = c/a = '+rStr(rat(c,a)))),
      step('Exprime avec S et P',M(E.how)),
      step('Remplace et calcule',M(E.t+' = '+rStr(val)))];
    ex.hints=['Commence par calculer '+M('S = x₁ + x₂ = -b/a')+' et '+M('P = x₁ × x₂ = c/a')+'.','Réécris l\'expression avec '+M('S')+' et '+M('P')+' : '+M(E.how)+'.'];
    return finishViete(ex,tx,{targets:[{key:'résultat',plain:true,value:val,formula:E.how,errs}],recall:'On écrit l\'expression avec S = x₁ + x₂ et P = x₁ × x₂, puis on remplace : '+E.how+'.',
      expectedStr:E.t.replace('^2','²')+' = '+rStr(val),instr:'Calcule sans résoudre l\'équation',placeholder:'S = 5 ; P = 6\n'+E.t.replace('^2','²')+' = …',hintline:'Tu peux écrire tes calculs de S et P, puis termine par la valeur demandée (une fraction est acceptée, par exemple 13/4).'});
  }
  return genVieteExpr();
}
function genVieteRoot(){
  for(let i=0;i<200;i++){
    const a=pick([1,1,1,2,-1,3]), r1=nz(-8,8), r2=nz(-8,8); if(r1===r2) continue;
    const b=-a*(r1+r2), c=a*r1*r2, g=pick([r1,r2]), o=g===r1?r2:r1, P=qpoly(a,b,c,'x'), S=-b/a, Pn=c/a;
    return mkProb({v:'x',eq:polyStr(P)+' = 0',eqL:P,eqR:pconst(0),
      text:'L\'équation «'+polyStr(P)+' = 0» admet «x = '+g+'» pour solution. Sans la résoudre, détermine son autre solution.',
      valid:z=>Math.abs(z-g)>1e-9,invalidMsg:'l\'énoncé demande l\'<b>autre</b> solution, pas celle qui est donnée.',
      instr:'Trouve l\'autre solution',placeholder:'x = 4',
      hintline:'Tu peux résoudre normalement ou utiliser Viète : écris quelques lignes de calcul, puis termine par x = … (une seule valeur).',
      steps:[step('Utilise la somme des solutions',M('x₁ + x₂ = -b/a = '+rStr(rat(-b,a))),'Une solution vaut '+M(String(g))+', donc l\'autre vaut '+M(rStr(rat(-b,a))+' - '+paren(g)+' = '+o)+'.'),
        step('Contrôle avec le produit',M('x₁ × x₂ = c/a = '+rStr(rat(c,a))),M(g+' × '+paren(o)+' = '+(g*o))+' : cohérent.'),
        step('Conclus','L\'autre solution est '+M('x = '+o)+'.')],
      hints:['La somme des deux solutions vaut '+M('-b/a')+', leur produit vaut '+M('c/a')+'.','Utilise la somme : l\'autre solution est '+M('-b/a')+' moins la solution connue.'],
      mistakes:[{tag:'eq-viete-signe',msg:'La somme des solutions est '+M('-b/a')+' ; l\'autre solution est cette somme <b>moins</b> la solution connue, pas plus.',sol:setOf([rat(S+g)])},
        {tag:'eq-viete-signe',msg:'Attention au signe : la somme est '+M('-b/a')+' (avec un moins), et on retranche la solution connue.',sol:setOf([rat(-o)])},
        {tag:'eq-viete-a',msg:'Le produit des solutions est '+M('c/a')+' : l\'autre solution est ce produit <b>divisé</b> par la solution connue.',sol:setOf([rat(Pn*g)])}],
      sentence:n=>'L\'autre solution est <b>'+n+'</b>.'});
  }
}
function genVieteNumbers(){
  for(let i=0;i<200;i++){
    const r1=nz(-9,9), r2=nz(-9,9); if(r1===r2) continue; const S=r1+r2, Pn=r1*r2, X=pmono(1,{x:1});
    return mkProb({v:'x',eq:'x('+S+' - x) = '+Pn,eqL:pmul(X,padd(pconst(S),ax(-1,'x'))),eqR:pconst(Pn),
      text:'Trouve deux nombres dont la somme vaut «'+S+'» et le produit vaut «'+Pn+'». On note «x» l\'un de ces deux nombres.',
      instr:'Trouve les deux nombres',placeholder:'x(7 - x) = 12\nx = 3 ou x = 4',
      hintline:'Si x est l\'un des nombres, l\'autre s\'exprime avec x. Pose l\'équation puis résous-la, et écris les deux valeurs : x = … ou x = ….',
      steps:[step('Exprime l\'autre nombre','Si '+M('x')+' est un des nombres, l\'autre vaut '+M(S+' - x')+' (la somme est '+S+').'),
        step('Écris le produit',M('x('+S+' - x) = '+Pn),'Développe et ramène à 0 : '+M('x^2 - '+paren(S)+'x + '+paren(Pn)+' = 0')),
        step('Reconnais Viète','On cherche deux nombres de somme '+M(String(S))+' et de produit '+M(String(Pn))+' : ce sont les solutions de '+M('x^2 - Sx + P = 0')+'.'),
        step('Résous et conclus','Les deux nombres sont '+M(String(r1))+' et '+M(String(r2))+' (vérification : '+M(r1+' + '+paren(r2)+' = '+S)+' et '+M(r1+' × '+paren(r2)+' = '+Pn)+').')],
      hints:['Si '+M('x')+' est un des nombres et que la somme vaut '+M(String(S))+', l\'autre vaut '+M(S+' - x')+'.','Deux nombres de somme '+M('S')+' et de produit '+M('P')+' sont les solutions de '+M('x^2 - Sx + P = 0')+'.'],
      mistakes:[['Si la somme vaut '+S+', l\'autre nombre est '+M(S+' - x')+' (et non '+M(S+' + x')+').',psub(pmul(X,padd(pconst(S),ax(1,'x'))),pconst(Pn))],
        ['Tu as échangé la somme et le produit : la somme est '+S+' et le produit est '+Pn+'.',psub(pmul(X,padd(pconst(Pn),ax(-1,'x'))),pconst(S))]],
      sentence:n=>'Les deux nombres sont <b>'+r1+'</b> et <b>'+r2+'</b>.'});
  }
}
function genBuild(){
  for(let i=0;i<300;i++){
    const q1=pick([1,1,1,2,3]), q2=pick([1,1,1,2]), p1=nz(-8,8), p2=nz(-8,8); if(!coprime(p1,q1)||!coprime(p2,q2)||p1*q2===p2*q1) continue;
    const A=q1*q2, Bc=-(q1*p2+q2*p1), C=p1*p2, P=qpoly(A,Bc,C,'x'), r1=rat(p1,q1), r2=rat(p2,q2), S=rat(p1*q2+p2*q1,A), Pr=rat(C,A);
    const tx=TX('Écris une équation du second degré dont les solutions sont «'+rStr(r1)+'» et «'+rStr(r2)+'».');
    const mk=[{tag:'eq-viete-signe',msg:'Le coefficient de '+M('x')+' est l\'<b>opposé</b> de la somme : '+M('x^2 - Sx + P = 0')+'. Tu as le mauvais signe.',poly:qpoly(A,-Bc,C,'x')},
      {tag:'eq-viete-signe',msg:'Le terme constant est le <b>produit</b> des solutions, avec son signe.',poly:qpoly(A,Bc,-C,'x')},
      {tag:'eq-viete-signe',msg:'Les deux signes sont inversés : la forme est '+M('x^2 - Sx + P = 0')+', où '+M('S')+' est la somme et '+M('P')+' le produit.',poly:qpoly(A,-Bc,-C,'x')}];
    const ex=mkEq({v:'x',eqL:P,eqR:pconst(0),statement:tx.plain,mistakes:mk,steps:[],hints:[]});
    // les fausses équations doivent rester détectables même si leurs solutions sont irrationnelles
    ex.mistakes=mk.filter((m,i)=>!proportional(m.poly,P)&&mk.findIndex(x=>proportional(x.poly,m.poly))===i);
    ex.word=true; ex.html=tx.html; ex.build={S,P:Pr}; ex.expectedStr=polyStr(P)+' = 0'; ex.expectedHtml=M(ex.expectedStr);
    ex.instr='Écris l\'équation'; ex.placeholder='S = 3 ; P = -10\nx^2 - 3x - 10 = 0';
    ex.hintline='Tu peux d\'abord écrire S et P, puis l\'équation. Un multiple de l\'équation attendue est accepté (utile si les solutions sont des fractions).';
    ex.steps=[step('Calcule la somme',M('S = '+rStr(r1)+' + '+paren(rStr(r2))+' = '+rStr(S))),step('Calcule le produit',M('P = '+rStr(r1)+' × '+paren(rStr(r2))+' = '+rStr(Pr))),
      step('Écris l\'équation',M('x^2 - Sx + P = 0'),M('x^2 - '+paren(rStr(S))+'x + '+paren(rStr(Pr))+' = 0')+(A>1?' ; on multiplie par '+A+' pour éliminer les fractions : '+M(ex.expectedStr):'')),
      step('Vérifie','Remplace '+M('x')+' par une des solutions : le membre de gauche doit valoir 0.')];
    ex.hints=['Si les solutions sont '+M('x₁')+' et '+M('x₂')+', l\'équation est '+M('x^2 - Sx + P = 0')+' avec '+M('S = x₁ + x₂')+' et '+M('P = x₁ × x₂')+'.','Calcule d\'abord la somme puis le produit, sans oublier leurs signes.'];
    return ex;
  }
}
const Q_LEVEL=[genQuad1,genQuad2,genVieteSP,null,null];
TOPICS['qd-1']={kind:'quad',level:1,label:'Discriminant et formule',gen:genQuad1};
TOPICS['qd-2']={kind:'quad',level:2,label:'Solutions avec racine carrée',gen:genQuad2};
TOPICS['qd-3']={kind:'quad',level:3,label:'Viète : somme et produit',gen:genVieteSP};
TOPICS['qd-4']={kind:'quad',level:4,label:'Viète : applications',gen:()=>pick([genVieteExpr,genVieteRoot,genVieteNumbers,genBuild])()};
TOPICS['qd-5']={kind:'quad',level:5,label:'Choisir sa méthode',gen:()=>pick([genEqFact,genEqFact,genQuad1,genQuad2,genQuad2,genEqMixed])()};
