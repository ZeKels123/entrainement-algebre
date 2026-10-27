'use strict';
/* ===== Problèmes : mise en équation puis résolution ===== */
const sg=n=>n<0?' - '+(-n):' + '+n;
const cf=(n,v)=>n===1?v:(n===-1?'-'+v:n+v);
const TX=s=>({html:s.replace(/«(.+?)»/g,(_,m)=>M(m)),plain:s.replace(/«(.+?)»/g,'$1')});
const NAMES=['Marc','Théo','Nora','Jules','Inès','Léa','Hugo','Sara'];
function mkProb(o){
  const v=o.v, tx=TX(o.text), P=psub(o.eqL,o.eqR);
  const ex=mkEq({v,eqL:o.eqL,eqR:o.eqR,statement:tx.plain,steps:[],mistakes:o.mistakes.map(m=>Array.isArray(m)?{tag:'eq-modele',msg:m[0],poly:m[1]}:m),hints:[]});
  ex.word=true; ex.html=tx.html; ex.invalidMsg=o.invalidMsg||'';
  const sol=ex.solution;
  if(sol.type!=='set'||!sol.complete||!sol.roots.every(isR)) throw new Error('bad problem');
  if(o.valid){ ex.answer=setOf(sol.roots.filter(r=>o.valid(rVal(r)))); if(ex.answer.roots.length!==1) throw new Error('answer'); }
  const fin=ex.answer||sol; ex.expectedStr=solStr(v,fin); ex.expectedHtml=solHtml(v,fin);
  if(ex.answer) ex.mistakes=ex.mistakes.filter(m=>!sameSol(m.sol,ex.answer));
  const val=fin.roots[0], deg=polyDeg(P), lines=[];
  if(deg===1){
    const co=coeffsOf(P,v);
    lines.push('On développe et on regroupe : '+M(polyStr(o.eqL)+' = '+polyStr(o.eqR)));
    lines.push('On isole le terme en '+M(v)+' : '+M(polyStr(ax(co[1],v))+' = '+(-co[0])));
    lines.push('On divise par '+M(String(co[1]))+' : '+M(v+' = '+rStr(val)));
  } else {
    lines.push('On développe et on ramène tout à gauche : '+M(polyStr(P)+' = 0'));
    lines.push('On factorise : '+M(sol.roots.map(r=>par(lin(1,-r[0],v))).join('')+' = 0'));
    lines.push('Produit nul : '+sol.roots.map(r=>M(v+' = '+rStr(r))).join(' ou ')+'.');
  }
  const l=evalRat(o.eqL,v,val), r=evalRat(o.eqR,v,val);
  const concl=['Pour '+M(v+' = '+rStr(val))+' : membre de gauche = '+M(rStr(l))+', membre de droite = '+M(rStr(r))+'. Les deux membres sont égaux.'];
  if(ex.answer&&sol.roots.length>ex.answer.roots.length){ const rej=sol.roots.find(x=>!rEq(x,val)); concl.push('L\'autre solution de l\'équation, '+M(v+' = '+rStr(rej))+', est rejetée : '+o.invalidMsg); }
  concl.push(o.sentence(val[0]));
  ex.steps=o.model?[step('Repère l\'inconnue',o.unk),step('Traduis l\'énoncé en équation',...o.model),step('Résous l\'équation',...lines),step('Vérifie et conclus',...concl)]:[];
  ex.hints=['Relis l\'énoncé phrase par phrase : la phrase qui exprime une égalité (« on obtient », « le total est », « même prix »...) donne le signe = de l\'équation.',
    'Traduis chaque information avec l\''+'inconnue '+M(v)+' : '+(o.model?o.model[0]:''),
    'Une fois l\'équation posée, résous-la ligne par ligne, puis vérifie que la valeur convient dans l\'énoncé.'];
  ex.hints[1]='Traduis les informations une par une avec '+M(v)+'. Par exemple : '+(o.model?o.model[0]:'');
  if(o.steps) ex.steps=o.steps;
  if(o.hints) ex.hints=o.hints;
  if(o.instr) ex.instr=o.instr;
  if(o.hintline) ex.hintline=o.hintline;
  if(o.placeholder) ex.placeholder=o.placeholder;
  return ex;
}
const X1=(v)=>pmono(1,{[v]:1});

function pbNombre(){
  const x0=rnd(2,15), a=pick([2,3,4,5,6,7]), b=nz(-12,12), c=a*x0+b; if(c<=0) return pbNombre();
  return mkProb({v:'x',eq:a+'x'+sg(b)+' = '+c,eqL:padd(ax(a,'x'),pconst(b)),eqR:pconst(c),
    text:'Je pense à un nombre. Je le multiplie par '+a+', puis '+(b>0?'j\'ajoute '+b:'je retranche '+(-b))+' : je trouve '+c+'. On note «x» le nombre choisi. Quel est ce nombre ?',
    unk:M('x')+' est le nombre choisi.',
    model:['Le nombre multiplié par '+a+' : '+M(a+'x'),(b>0?'On ajoute ':'On retranche ')+Math.abs(b)+' : '+M(a+'x'+sg(b)),'Le résultat est '+c+' : '+M(a+'x'+sg(b)+' = '+c)],
    mistakes:[['Relis l\'ordre des opérations : on multiplie d\'abord le nombre par '+a+', puis on '+(b>0?'ajoute ':'retranche ')+Math.abs(b)+' au résultat. Ton équation fait l\'inverse.',padd(pmul(pconst(a),lin(1,b,'x')),pconst(-c))],
      ['Ajouter se traduit par + et retrancher par − : le signe de '+M(String(Math.abs(b)))+' n\'est pas le bon dans ton équation.',padd(ax(a,'x'),pconst(-b-c))]],
    sentence:n=>'Le nombre choisi est <b>'+n+'</b>.'});
}
function pbStylos(){
  const n0=rnd(2,9), p=pick([2,3,4,5,6]), q=rnd(3,15), T=p*n0+q, nm=pick(['Léa','Nora','Inès','Sara']);
  return mkProb({v:'n',eq:p+'n + '+q+' = '+T,eqL:padd(ax(p,'n'),pconst(q)),eqR:pconst(T),
    text:nm+' achète des stylos à '+p+' CHF pièce et un cahier à '+q+' CHF. Elle paie '+T+' CHF au total. On note «n» le nombre de stylos. Combien de stylos achète-t-elle ?',
    unk:M('n')+' est le nombre de stylos.',
    model:['Prix des stylos : '+M(p+'n')+' CHF','On ajoute le cahier : '+M(p+'n + '+q),'Le total est '+T+' CHF : '+M(p+'n + '+q+' = '+T)],
    mistakes:[['Le prix unitaire '+p+' CHF ne s\'applique qu\'aux stylos ; le cahier '+q+' CHF n\'est acheté qu\'une seule fois, il ne dépend pas de '+M('n')+'.',padd(ax(p+q,'n'),pconst(-T))],
      ['Le total est la somme du prix des stylos et du cahier ; ici les deux prix ne se soustraient pas.',padd(ax(p,'n'),pconst(-q-T))]],
    sentence:n=>nm+' achète <b>'+n+'</b> stylos.'});
}
function pbPiece(){
  const t0=rnd(5,30), p=pick([2,3,4,5]), q=rnd(10,60), T=p*t0+q;
  return mkProb({v:'t',eq:q+' + '+p+'t = '+T,eqL:padd(pconst(q),ax(p,'t')),eqR:pconst(T),
    text:'Une pièce usinée coûte '+q+' CHF de matière, plus '+p+' CHF par minute de machine. Son coût total est de '+T+' CHF. On note «t» la durée d\'usinage en minutes. Quelle est cette durée ?',
    unk:M('t')+' est la durée d\'usinage (en minutes).',
    model:['Coût de la machine : '+M(p+'t')+' CHF','Avec la matière : '+M(q+' + '+p+'t'),'Le coût total est '+T+' CHF : '+M(q+' + '+p+'t = '+T)],
    mistakes:[['La matière ('+q+' CHF) est payée une seule fois : elle ne se multiplie pas par la durée.',padd(ax(p+q,'t'),pconst(-T))],
      ['Le coût de la matière s\'ajoute au coût de la machine, il ne se retranche pas.',padd(ax(p,'t'),pconst(-q-T))]],
    sentence:n=>'L\'usinage dure <b>'+n+'</b> minutes.'});
}
function pbTarifs(){
  const h0=rnd(2,10), p2=rnd(2,6), p1=p2+rnd(1,5), b1=rnd(5,30), b2=b1+(p1-p2)*h0, machine=Math.random()<0.5, v=machine?'n':'h';
  const text=machine?'Pour usiner une série, la machine A demande un réglage de '+b1+' min puis '+p1+' min par pièce ; la machine B demande un réglage de '+b2+' min puis '+p2+' min par pièce. On note «n» le nombre de pièces. Pour quel nombre de pièces la durée totale est-elle la même avec les deux machines ?'
    :'Pour louer un banc d\'essai, le fournisseur A demande '+b1+' CHF de frais fixes plus '+p1+' CHF par heure ; le fournisseur B demande '+b2+' CHF de frais fixes plus '+p2+' CHF par heure. On note «h» le nombre d\'heures. Au bout de combien d\'heures les deux offres coûtent-elles le même prix ?';
  const A=padd(pconst(b1),ax(p1,v)), B=padd(pconst(b2),ax(p2,v));
  return mkProb({v,eq:b1+' + '+cf(p1,v)+' = '+b2+' + '+cf(p2,v),eqL:A,eqR:B,text,
    unk:M(v)+(machine?' est le nombre de pièces.':' est le nombre d\'heures.'),
    model:[(machine?'Durée avec A : ':'Prix avec A : ')+M(b1+' + '+cf(p1,v)),(machine?'Durée avec B : ':'Prix avec B : ')+M(b2+' + '+cf(p2,v)),'Les deux sont égaux : '+M(b1+' + '+cf(p1,v)+' = '+b2+' + '+cf(p2,v))],
    mistakes:[['Chaque offre a un montant fixe, puis une partie qui dépend de '+M(v)+'. Dans ton équation, le terme en '+M(v)+' de B a le mauvais signe.',padd(A,padd(ax(p2,v),pconst(-b2)))],
      ['Le facteur '+M(v)+' doit apparaître des deux côtés : la partie variable de B dépend aussi de '+M(v)+'.',padd(A,pconst(-b2-p2))]],
    sentence:n=>machine?'Les deux machines demandent la même durée pour <b>'+n+'</b> pièces.':'Les deux offres coûtent autant au bout de <b>'+n+'</b> heures.'});
}
function pbAges(){
  const x0=rnd(8,20), k=rnd(2,9), S=2*x0+k, nm=pick(NAMES), sis=pick(['sœur','cousine','voisine']);
  return mkProb({v:'x',eq:'x + (x + '+k+') = '+S,eqL:padd(X1('x'),lin(1,k,'x')),eqR:pconst(S),
    text:nm+' a «x» ans. Sa '+sis+' a '+k+' ans de plus que lui. À eux deux, ils ont '+S+' ans. Quel âge a '+nm+' ?',
    unk:M('x')+' est l\'âge de '+nm+'.',
    model:['Âge de sa '+sis+' : '+M('x + '+k),'Somme des âges : '+M('x + (x + '+k+')'),'Cette somme vaut '+S+' : '+M('x + (x + '+k+') = '+S)],
    mistakes:[['Il faut additionner les deux âges : celui de '+nm+' ('+M('x')+') et celui de sa '+sis+' ('+M('x + '+k)+'). Ton équation en oublie un.',padd(lin(1,k,'x'),pconst(-S))],
      ['L\'écart de '+k+' ans doit apparaître dans l\'âge de sa '+sis+' : ton équation compte deux fois le même âge.',padd(ax(2,'x'),pconst(-S))]],
    sentence:n=>nm+' a <b>'+n+'</b> ans.'});
}
function pbConsec(){
  const n0=rnd(3,30), S=3*n0+3;
  return mkProb({v:'n',eq:'n + (n + 1) + (n + 2) = '+S,eqL:padd(X1('n'),padd(lin(1,1,'n'),lin(1,2,'n'))),eqR:pconst(S),
    text:'La somme de trois entiers consécutifs est '+S+'. On note «n» le plus petit de ces trois entiers. Quels sont ces entiers ? Donne la valeur de «n».',
    unk:M('n')+' est le plus petit des trois entiers.',
    model:['Les trois entiers sont '+M('n')+', '+M('n + 1')+' et '+M('n + 2'),'Leur somme : '+M('n + (n + 1) + (n + 2)'),'Elle vaut '+S+' : '+M('n + (n + 1) + (n + 2) = '+S)],
    mistakes:[['Trois entiers consécutifs sont '+M('n')+', '+M('n + 1')+' et '+M('n + 2')+' : le troisième dépasse '+M('n')+' de 2, pas de 1.',padd(ax(3,'n'),pconst(2-S))],
      ['Les trois entiers doivent tous apparaître dans la somme, avec leur écart à '+M('n')+'.',padd(ax(2,'n'),pconst(3-S))]],
    sentence:n=>'Les entiers sont <b>'+n+'</b>, <b>'+(n+1)+'</b> et <b>'+(n+2)+'</b>.'});
}
function pbArbre(){
  const x0=rnd(10,40), a=rnd(5,25), L=4*x0+a;
  return mkProb({v:'x',eq:'x + (x + '+a+') + 2x = '+L,eqL:padd(X1('x'),padd(lin(1,a,'x'),ax(2,'x'))),eqR:pconst(L),
    text:'Un arbre de '+L+' mm est formé de trois tronçons. Le premier mesure «x» mm, le deuxième mesure '+a+' mm de plus que le premier et le troisième mesure le double du premier. Quelle est la longueur du premier tronçon ?',
    unk:M('x')+' est la longueur du premier tronçon (en mm).',
    model:['Deuxième tronçon : '+M('x + '+a),'Troisième tronçon : '+M('2x'),'Longueur totale : '+M('x + (x + '+a+') + 2x = '+L)],
    mistakes:[['Le troisième tronçon mesure le <b>double</b> du premier : '+M('2x')+', pas '+M('x')+'.',padd(ax(3,'x'),padd(pconst(a),pconst(-L)))],
      ['Le double se traduit par une multiplication par 2 (et non par une addition de 2).',padd(ax(3,'x'),pconst(a+2-L))]],
    sentence:n=>'Le premier tronçon mesure <b>'+n+'</b> mm.'});
}
function pbRect(){
  const l0=rnd(3,15), d=rnd(2,9), P=2*(2*l0+d);
  return mkProb({v:'l',eq:'2(l + (l + '+d+')) = '+P,eqL:pmul(pconst(2),padd(X1('l'),lin(1,d,'l'))),eqR:pconst(P),
    text:'Un rectangle a une largeur de «l» cm. Sa longueur mesure '+d+' cm de plus que sa largeur. Son périmètre est de '+P+' cm. Quelle est sa largeur ?',
    unk:M('l')+' est la largeur (en cm).',
    model:['Longueur : '+M('l + '+d),'Périmètre = 2 × (largeur + longueur) : '+M('2(l + (l + '+d+'))'),'Il vaut '+P+' : '+M('2(l + (l + '+d+')) = '+P)],
    mistakes:[['Le périmètre est le double de la somme largeur + longueur : il manque le facteur 2 dans ton équation.',padd(padd(X1('l'),lin(1,d,'l')),pconst(-P))],
      ['Le facteur 2 multiplie la somme <b>entière</b> (largeur + longueur), pas seulement la largeur.',padd(padd(ax(2,'l'),lin(1,d,'l')),pconst(-P))]],
    sentence:n=>'La largeur est de <b>'+n+'</b> cm (et la longueur de '+(n+d)+' cm).'});
}
function pbPere(){
  for(let i=0;i<200;i++){
    const m=rnd(4,7), f=rnd(2,3), k=rnd(1,8); if(f>=m) continue;
    const num=k*(f-1); if(num%(m-f)) continue; const x0=num/(m-f); if(x0<5||x0>20) continue;
    const nm=pick(NAMES);
    return mkProb({v:'x',eq:m+'x + '+k+' = '+f+'(x + '+k+')',eqL:padd(ax(m,'x'),pconst(k)),eqR:pmul(pconst(f),lin(1,k,'x')),
      text:'Aujourd\'hui, un père a '+m+' fois l\'âge de son fils '+nm+', qui a «x» ans. Dans '+k+' an'+(k>1?'s':'')+', le père aura '+f+' fois l\'âge de son fils. Quel âge a '+nm+' aujourd\'hui ?',
      unk:M('x')+' est l\'âge actuel de '+nm+'.',
      model:['Âge actuel du père : '+M(m+'x'),'Dans '+k+' an'+(k>1?'s':'')+' : le père a '+M(m+'x + '+k)+' et le fils a '+M('x + '+k),'Le père aura '+f+' fois l\'âge du fils : '+M(m+'x + '+k+' = '+f+'(x + '+k+')')],
      mistakes:[['Dans '+k+' an'+(k>1?'s':'')+', <b>les deux</b> âges augmentent de '+k+' : il faut ajouter '+k+' à l\'âge du père aussi.',padd(ax(m,'x'),pconst(-f*k)) && psub(ax(m,'x'),pmul(pconst(f),lin(1,k,'x')))],
        ['Le facteur '+f+' multiplie l\'âge futur du fils, '+M('x + '+k)+', en entier : il faut distribuer sur '+M('x')+' <b>et</b> sur '+M(String(k))+'.',psub(ax(m,'x'),ax(f,'x'))]],
      sentence:n=>nm+' a <b>'+n+'</b> ans aujourd\'hui.'});
  }
  return pbPere();
}
function pbNombre2(){
  for(let i=0;i<200;i++){
    const k=pick([2,3,4]), s=pick([1,-1]), x0=rnd(2,12), a=rnd(1,8), b=k*(x0+s*a)-x0; if(b<=0) continue;
    const W=['','','double','triple','quadruple'][k], op=s===1?'somme':'différence';
    return mkProb({v:'x',eq:k+'(x'+sg(s*a)+') = x + '+b,eqL:pmul(pconst(k),lin(1,s*a,'x')),eqR:padd(X1('x'),pconst(b)),
      text:'Le '+W+' de la '+op+' d\'un nombre «x» et de '+a+(s===1?'':' (dans cet ordre : «x» puis '+a+')')+' est égal à ce nombre augmenté de '+b+'. Quel est ce nombre ?',
      unk:M('x')+' est le nombre cherché.',
      model:['La '+op+' : '+M('x'+sg(s*a)),'Le '+W+' de cette '+op+' : '+M(k+'(x'+sg(s*a)+')'),'Égal au nombre augmenté de '+b+' : '+M(k+'(x'+sg(s*a)+') = x + '+b)],
      mistakes:[['Le '+W+' s\'applique à la '+op+' <b>entière</b> : il faut des parenthèses et distribuer '+M(String(k))+' sur les deux termes.',psub(padd(ax(k,'x'),pconst(s*a)),padd(X1('x'),pconst(b)))]],
      sentence:n=>'Le nombre cherché est <b>'+n+'</b>.'});
  }
  return pbNombre2();
}
function pbAire(){
  const w=rnd(3,12), d=rnd(1,8), A=w*(w+d), r=Math.random();
  if(r<0.4) return mkProb({v:'x',eq:'x(x + '+d+') = '+A,eqL:pmul(X1('x'),lin(1,d,'x')),eqR:pconst(A),
    text:'Un rectangle a une largeur de «x» cm. Sa longueur dépasse sa largeur de '+d+' cm. Son aire est de '+A+' cm². Quelle est sa largeur ?',
    unk:M('x')+' est la largeur (en cm).',
    model:['Longueur : '+M('x + '+d),'Aire = largeur × longueur : '+M('x(x + '+d+')'),'Elle vaut '+A+' : '+M('x(x + '+d+') = '+A)],
    valid:z=>z>0,invalidMsg:'une largeur est un nombre positif.',
    mistakes:[['L\'aire est un <b>produit</b> largeur × longueur, pas une somme.',psub(padd(X1('x'),lin(1,d,'x')),pconst(A))],
      ['La largeur multiplie toute la longueur '+M('x + '+d)+', pas seulement '+M('x')+'.',padd(pmono(1,{x:2}),pconst(d-A))]],
    sentence:n=>'La largeur est de <b>'+n+'</b> cm (et la longueur de '+(n+d)+' cm).'});
  if(r<0.7){ const n0=rnd(3,14), P=n0*(n0+1);
    return mkProb({v:'n',eq:'n(n + 1) = '+P,eqL:pmul(X1('n'),lin(1,1,'n')),eqR:pconst(P),
      text:'Le produit de deux entiers naturels consécutifs est '+P+'. On note «n» le plus petit des deux. Quel est-il ?',
      unk:M('n')+' est le plus petit des deux entiers.',
      model:['Le suivant est '+M('n + 1'),'Leur produit : '+M('n(n + 1)'),'Il vaut '+P+' : '+M('n(n + 1) = '+P)],
      valid:z=>z>=0,invalidMsg:'l\'énoncé parle d\'entiers naturels, donc positifs.',
      mistakes:[['C\'est le <b>produit</b> qui vaut '+P+', pas la somme.',psub(padd(X1('n'),lin(1,1,'n')),pconst(P))],
        ['Le produit '+M('n(n + 1)')+' se développe en '+M('n^2 + n')+' : ne perds pas le terme en '+M('n')+'.',padd(pmono(1,{n:2}),pconst(-P))]],
      sentence:n=>'Les deux entiers sont <b>'+n+'</b> et <b>'+(n+1)+'</b>.'}); }
  const x0=rnd(2,10), k=rnd(2,8), N=x0*x0+k*x0;
  return mkProb({v:'x',eq:'x^2 + '+cf(k,'x')+' = '+N,eqL:padd(pmono(1,{x:2}),ax(k,'x')),eqR:pconst(N),
    text:'Le carré d\'un nombre positif «x», augmenté de '+k+' fois ce nombre, vaut '+N+'. Quel est ce nombre ?',
    unk:M('x')+' est le nombre positif cherché.',
    model:['Le carré du nombre : '+M('x^2'),k+' fois le nombre : '+M(cf(k,'x')),'La somme vaut '+N+' : '+M('x^2 + '+cf(k,'x')+' = '+N)],
    valid:z=>z>0,invalidMsg:'l\'énoncé demande un nombre positif.',
    mistakes:[['Le carré du nombre est '+M('x^2')+' (le nombre multiplié par lui-même), et non '+M('2x')+'.',padd(ax(2+k,'x'),pconst(-N))],
      ['Les '+k+' fois le nombre s\'écrivent '+M(cf(k,'x'))+' : le nombre '+M('x')+' ne doit pas disparaître.',padd(pmono(1,{x:2}),pconst(k-N))]],
    sentence:n=>'Le nombre est <b>'+n+'</b>.'});
}
function pbAgrandi(){
  if(Math.random()<0.5){
    const x0=rnd(3,12), d=rnd(2,8), e=rnd(1,4), G=2*e*x0+e*(d+e);
    return mkProb({v:'x',eq:'(x + '+e+')(x + '+(d+e)+') = x(x + '+d+') + '+G,eqL:pmul(lin(1,e,'x'),lin(1,d+e,'x')),eqR:padd(pmul(X1('x'),lin(1,d,'x')),pconst(G)),
      text:'Un rectangle a une largeur de «x» cm et une longueur de '+d+' cm de plus que sa largeur. On augmente la largeur et la longueur de '+e+' cm chacune : l\'aire augmente alors de '+G+' cm². Quelle est la largeur de départ ?',
      unk:M('x')+' est la largeur de départ (en cm).',
      model:['Aire de départ : '+M('x(x + '+d+')'),'Nouvelles dimensions : '+M('x + '+e)+' et '+M('x + '+(d+e)),'Nouvelle aire = ancienne aire + '+G+' : '+M('(x + '+e+')(x + '+(d+e)+') = x(x + '+d+') + '+G)],
      mistakes:[['La nouvelle aire est l\'aire de départ <b>plus</b> '+G+' : ce n\'est pas '+G+' tout seul.',psub(pmul(lin(1,e,'x'),lin(1,d+e,'x')),pconst(G))],
        ['La longueur aussi augmente de '+e+' cm : elle devient '+M('x + '+(d+e))+'.',psub(pmul(lin(1,e,'x'),lin(1,d,'x')),padd(pmul(X1('x'),lin(1,d,'x')),pconst(G))) ]],
      sentence:n=>'La largeur de départ est de <b>'+n+'</b> cm.'});
  }
  for(let i=0;i<100;i++){
    const a=rnd(1,6), b=rnd(1,6), x0=b+rnd(2,9), A=(x0+a)*(x0-b);
    return mkProb({v:'x',eq:'(x + '+a+')(x - '+b+') = '+A,eqL:pmul(lin(1,a,'x'),lin(1,-b,'x')),eqR:pconst(A),
      text:'Un carré a un côté de «x» cm. On rallonge un côté de '+a+' cm et on raccourcit l\'autre de '+b+' cm : le rectangle obtenu a une aire de '+A+' cm². Quel est le côté du carré ?',
      unk:M('x')+' est le côté du carré (en cm).',
      model:['Côtés du rectangle : '+M('x + '+a)+' et '+M('x - '+b),'Aire du rectangle : '+M('(x + '+a+')(x - '+b+')'),'Elle vaut '+A+' : '+M('(x + '+a+')(x - '+b+') = '+A)],
      valid:z=>z>b,invalidMsg:'un côté du rectangle, '+'x − '+b+', doit rester positif.',
      mistakes:[['Le côté raccourci mesure '+M('x - '+b)+' (on retranche), pas '+M('x + '+b)+'.',psub(pmul(lin(1,a,'x'),lin(1,b,'x')),pconst(A))],
        ['L\'aire est le <b>produit</b> des deux côtés, pas leur somme.',psub(padd(lin(1,a,'x'),lin(1,-b,'x')),pconst(A))]],
      sentence:n=>'Le côté du carré est de <b>'+n+'</b> cm.'});
  }
}
const pick1=list=>()=>pick(list)();
TOPICS['pb-1']={kind:'problem',level:1,label:'Mise en équation simple',gen:pick1([pbNombre,pbStylos,pbPiece])};
TOPICS['pb-2']={kind:'problem',level:2,label:'Comparaisons, âges, longueurs',gen:pick1([pbTarifs,pbAges,pbConsec,pbArbre])};
TOPICS['pb-3']={kind:'problem',level:3,label:'Périmètres et parenthèses',gen:pick1([pbRect,pbPere,pbNombre2])};
TOPICS['pb-4']={kind:'problem',level:4,label:'Problèmes du second degré',gen:pbAire};
TOPICS['pb-5']={kind:'problem',level:5,label:'Aires et équations complètes',gen:pbAgrandi};
