'use strict';
/* ===== Géométrie : niveau 6 (problèmes de synthèse) ===== */
Object.assign(TAGS,{
  'geo-heron':{label:'Formule de Héron mal appliquée',tip:'Héron : p = (a + b + c) / 2 (demi-périmètre), puis A = √(p(p − a)(p − b)(p − c)). Ne suppose pas d\'angle droit si l\'énoncé ne le dit pas.'},
  'geo-equation':{label:'Équation de Pythagore mal résolue',tip:'Écris (hypoténuse)² = (côté)² + (côté)², développe avec les identités remarquables, ramène tout d\'un côté et résous. Une longueur est positive : rejette la solution négative.'},
  'geo-quadrillage':{label:'Rapport mal choisi dans le quadrillage',tip:'Dans un quadrillage, la diagonale coupe les lignes en gardant des rapports constants : la hauteur de la diagonale à la colonne j vaut (j / nombre de colonnes) × hauteur totale.'},
  'geo-tangente-corde':{label:'Tangente et corde',tip:'L\'angle entre la tangente en A et la corde [AB] est égal à l\'angle inscrit qui intercepte l\'arc AB. Ensuite, la somme des angles d\'un triangle vaut 180°.'},
  'geo-couronne':{label:'Secteur d\'anneau mal décomposé',tip:'Aire = (angle / 360) × π × (R² − r²). Périmètre = arc extérieur + arc intérieur + les deux bords droits (largeur de l\'anneau).'}
});

/* ---------- Triangle défini par ses trois côtés (Héron) ---------- */
const HERON=[[13,14,15,84],[5,5,6,12],[10,13,13,60],[17,25,28,210],[9,10,17,36],[13,13,24,60],[15,15,24,108],[7,15,20,42],[8,15,17,60],[6,25,29,60]];
function genTri6(){
  const t=pick(HERON), k=pick([1,1,1,2]), u=uP();
  const s=[t[0]*k,t[1]*k,t[2]*k].sort((x,y)=>y-x), A=t[3]*k*k;
  const a=s[0], rest=Math.random()<0.5?[s[1],s[2]]:[s[2],s[1]], b=rest[0], c=rest[1];
  const p=(a+b+c)/2, prod=p*(p-a)*(p-b)*(p-c);
  const svg=svgTri3({a,b,c,la:a+' '+u,lb:b+' '+u,lc:c+' '+u,alt:'Triangle ABC de côtés BC = '+a+', CA = '+b+', AB = '+c});
  return mkGeo({svg,text:'Le triangle «ABC» a pour côtés «BC = '+a+'» '+u+', «CA = '+b+'» '+u+' et «AB = '+c+'» '+u+'. Aucune hauteur n\'est donnée. Calcule son aire.',ask:'l\'aire du triangle',val:A,unit:u,pow:2,
    placeholder:'p = (a + b + c) / 2 = ...\nA = √(p(p − a)(p − b)(p − c))\nA = ... cm²',
    steps:[stp('Demi-périmètre',M('p = ('+a+' + '+b+' + '+c+') / 2 = '+p)+' '+u),stp('Formule de Héron',M('A = √(p(p − a)(p − b)(p − c))')),stp('Remplace',M('A = √('+p+' × '+(p-a)+' × '+(p-b)+' × '+(p-c)+') = √'+prod)),stp('Racine carrée',M('A = '+A)+' '+u+'²')],
    hints:['Le triangle n\'a pas d\'angle droit et aucune hauteur n\'est donnée : utilise la formule de Héron.','Calcule d\'abord le demi-périmètre p, puis les trois différences p − a, p − b, p − c.'],
    work:['p = ('+a+' + '+b+' + '+c+') / 2 = '+p,'A = √('+p+' × '+(p-a)+' × '+(p-b)+' × '+(p-c)+') = √'+prod+' = '+A+' '+u+'²'],
    mistakes:[{v:a+b+c,tag:'geo-perim-aire',msg:'Tu as calculé le périmètre.',w:['A = '+a+' + '+b+' + '+c+' = '+(a+b+c)+' '+u+'²']},{v:p,tag:'geo-heron',msg:'Tu t\'es arrêté au demi-périmètre p. Il faut ensuite appliquer la formule de Héron.',w:['p = ('+a+' + '+b+' + '+c+') / 2 = '+p,'A = '+p+' '+u+'²']},{v:prod,tag:'geo-racine',msg:'Tu as oublié la racine carrée dans la formule de Héron.',w:['p = ('+a+' + '+b+' + '+c+') / 2 = '+p,'A = '+p+' × '+(p-a)+' × '+(p-b)+' × '+(p-c)+' = '+prod+' '+u+'²']},{v:b*c/2,tag:'geo-heron',msg:'Tu as supposé un angle droit. Rien ne l\'indique : le triangle n\'est pas rectangle.',w:['A = '+b+' × '+c+' / 2 = '+NF(b*c/2)+' '+u+'²']},{v:a*b*c/2,tag:'geo-formule',msg:'Tu as multiplié les trois côtés. Cette formule ne donne pas une aire.',w:['A = '+a+' × '+b+' × '+c+' / 2 = '+NF(a*b*c/2)+' '+u+'²']}]});
}

/* ---------- Trapèze, diagonales et Thalès ---------- */
function genQuad6(){
  const T=pick([[3,4,5],[4,3,5],[5,12,13],[12,5,13],[6,8,10],[8,6,10],[8,15,17],[15,8,17]]), h=T[0], a=T[1], c=T[2], m=pick([3,4]), CD=m*a, u=uP();
  const asked=pick(['BE','CE']), be=c/(m+1), ce=c*m/(m+1), val=asked==='BE'?be:ce;
  const svg=figure([[0,0],[CD,0],[0,h],[a,h]],f=>{
    const C=f([0,0]),D=f([CD,0]),A=f([0,h]),B=f([a,h]),E=f([a*m/(m+1),h*m/(m+1)]),ce_=cen([A,B,C,D]);
    return g.seg(A,B)+g.seg(C,D)+g.seg(A,C)+g.seg(B,D)+g.seg(A,D,'g-l')+g.seg(B,C,'g-l')+g.right(C,A,D,10)+g.par(A,B,1)+g.par(C,D,1)
      +g.text([(A[0]+B[0])/2,A[1]-14],a+' '+u)+g.text([(C[0]+D[0])/2,C[1]+17],CD+' '+u)+g.text([C[0]-8,(A[1]+C[1])/2],h+' '+u,'','end')
      +(asked==='BE'?g.len(B,E,'?',ce_,9,'g-u'):g.len(C,E,'?',ce_,9,'g-u'))+g.dot(E)
      +g.vert(A,'A',ce_)+g.vert(B,'B',ce_)+g.vert(C,'C',ce_)+g.vert(D,'D',ce_)+g.text([E[0]+2,E[1]+14],'E','g-v');
  },'Trapèze ABDC, diagonales AD et BC se coupant en E',{pad:44});
  const wBC=['BC² = '+h+'² + '+a+'² = '+(h*h+a*a),'BC = √'+(h*h+a*a)+' = '+c+' '+u], wRt='BE / CE = '+a+' / '+CD+' = 1 / '+m;
  const wBE=c+' / '+(m+1)+' = '+NF(be), wCE=m+' × '+c+' / '+(m+1)+' = '+NF(ce), cq=c/m, cqS=Math.abs(cq*1000-Math.round(cq*1000))<1e-6?c+' / '+m+' = '+NF(cq):c+' / '+m;
  const mst=[{v:c,tag:'geo-thales-segment',msg:'Tu as donné la longueur BC en entier. E est un point intérieur de la diagonale : il faut encore partager BC.',w:wBC.concat([asked+' = BC = '+c+' '+u])},{v:c/2,tag:'geo-thales-segment',msg:'E n\'est pas le milieu de [BC] : les côtés parallèles ne sont pas égaux (AB ≠ CD).',w:wBC.concat([asked+' = '+c+' / 2 = '+NF(c/2)+' '+u])},{v:asked==='BE'?ce:be,tag:'geo-thales-inverse',msg:'Tu as échangé BE et CE. Le petit segment est du côté du petit côté parallèle AB.',w:wBC.concat([wRt,asked+' = '+(asked==='BE'?wCE:wBE)+' '+u])},{v:c/m,tag:'geo-thales-segment',msg:'Tu as divisé BC par '+m+' au lieu de '+(m+1)+'. BE et CE sont deux morceaux de BC : BE + CE = BC, donc il y a '+(m+1)+' parts en tout.',w:wBC.concat([wRt,asked+' = '+cqS+' '+u])}];
  return mkGeo({svg,text:'Dans le trapèze «ABDC», «(AB) // (CD)» et «(AC) ⊥ (CD)». On donne «AB = '+a+'» '+u+', «AC = '+h+'» '+u+' et «CD = '+CD+'» '+u+'. Les diagonales «[AD]» et «[BC]» se coupent en «E». Calcule «'+asked+'».',ask:'la longueur '+asked,val,unit:u,
    placeholder:'BC² = AC² + AB² = ...\nBE / CE = AB / CD = ...\n'+asked+' = ...',
    steps:[stp('Pythagore dans ABC… ou ACB : BC',M('BC² = AC² + AB² = '+h+'² + '+a+'² = '+(h*h+a*a)),M('BC = '+c)+' '+u),stp('Thalès (papillon) avec (AB) // (CD)',M('EB / EC = AB / CD = '+a+' / '+CD+' = 1 / '+m)+' : BC est partagé en '+(m+1)+' parts égales.'),stp('Longueurs',M('BE = '+c+' / '+(m+1)+' = '+NF(be))+' '+u+' et '+M('CE = '+m+' × '+NF(be)+' = '+NF(ce))+' '+u)],
    hints:['Le triangle ABC est rectangle en A (AC ⊥ CD et AB // CD) : Pythagore donne BC.','Les triangles ABE et DCE sont en configuration de Thalès (papillon) : EB / EC = AB / CD.'],
    work:wBC.concat([wRt,asked+' = '+(asked==='BE'?wBE:wCE)+' '+u]),
    mistakes:mst});
}

/* ---------- Pythagore avec inconnue x : équation ---------- */
function genPyth6(){
  const T=pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15],[12,16,20],[20,21,29],[9,40,41]]), x=T[0], p=T[1]-T[0], q=T[2]-T[0], d=q-p, u=uP(), flip=Math.random()<0.5;
  const disc=d*d+q*q-p*p, r=Math.sqrt(disc), x2=d-r;
  const svg=svgRight({a:T[0],b:T[1],flip,lAB:'x',lBC:'x + '+p,lAC:'x + '+q,alt:'Triangle rectangle de côtés x, x + '+p+' et x + '+q});
  const K=q*q-p*p, wEq=['(x + '+q+')² = x² + (x + '+p+')²','x² + '+(2*q)+'x + '+(q*q)+' = 2x² + '+(2*p)+'x + '+(p*p),'x² − '+(2*d)+'x − '+K+' = 0'];
  const wX=wEq.concat(['x = '+d+' + √('+d+'² + '+K+') = '+d+' + √'+disc,'x = '+d+' + '+r+' = '+x+' '+u]);
  return mkGeo({svg,text:'Un triangle rectangle a pour côtés «x», «x + '+p+'» (les deux côtés de l\'angle droit) et «x + '+q+'» (l\'hypoténuse), en '+u+'. Trouve la valeur de «x» en résolvant une équation.',ask:'la valeur de x',val:x,unit:u,
    placeholder:'(x + '+q+')² = x² + (x + '+p+')²\n...\nx² − ... x − ... = 0\nx = ...',
    steps:[stp('Théorème de Pythagore',M('(x + '+q+')² = x² + (x + '+p+')²')),stp('Développe',M('x² + '+(2*q)+'x + '+(q*q)+' = x² + x² + '+(2*p)+'x + '+(p*p))),stp('Ramène tout à droite',M('0 = x² − '+(2*d)+'x − '+(q*q-p*p))),stp('Résous',M('x = '+d+' ± √('+d+'² + '+(q*q-p*p)+') = '+d+' ± √'+disc+' = '+d+' ± '+r),'Solutions : '+M('x = '+x)+' ou '+M('x = '+x2)+'.'),stp('Une longueur est positive','On rejette '+M('x = '+x2)+' et on garde '+M('x = '+x)+' '+u+'. Vérification : '+M(x+'² + '+T[1]+'² = '+(x*x+T[1]*T[1])+' = '+T[2]+'²')+'.')],
    hints:['Écris que le carré de l\'hypoténuse est la somme des carrés des deux autres côtés, avec les expressions en x.','Les x² se simplifient : tu obtiens une équation du second degré. Tu peux la résoudre avec le discriminant ou en la factorisant.'],
    sanity:[{when:v=>v<=0,tag:'geo-equation',msg:'Une longueur est strictement positive : rejette la solution négative de l\'équation.'}],
    work:wX,
    mistakes:[{v:x2,tag:'geo-equation',msg:'Tu as gardé la solution négative de l\'équation. Une longueur est positive.',w:wEq.concat(['x = '+d+' − √('+d+'² + '+K+') = '+d+' − √'+disc,'x = '+d+' − '+r+' = '+(x2<0?'−'+(-x2):x2)+' '+u])},{v:T[1],tag:'geo-equation',msg:'Tu as calculé l\'autre côté de l\'angle droit ('+T[1]+') : on te demande x.',w:wX.concat(['x + '+p+' = '+x+' + '+p+' = '+T[1]+' '+u])},{v:T[2],tag:'geo-equation',msg:'Tu as calculé l\'hypoténuse : on te demande x.',w:wX.concat(['x + '+q+' = '+x+' + '+q+' = '+T[2]+' '+u])},{v:d,tag:'geo-equation',msg:'Tu as oublié la racine dans la résolution : x = '+d+' + √'+disc+'.',w:wEq.concat(['x = '+(2*d)+' / 2 = '+d+' '+u])},{v:q-p,tag:'geo-equation',msg:'Tu n\'as fait que la différence des constantes : il faut résoudre l\'équation complète.',w:[wEq[0],'x = '+q+' − '+p+' = '+(q-p)+' '+u]}]});
}

/* ---------- Thalès dans un quadrillage ---------- */
function genThal6(){
  const w=pick([4,5]), hh=pick([2,3,4]), j=rnd(1,w-1), a=pick([2,3,4,5,6,8]), u=uP();
  const val=hh*a*(w-j)/w, low=hh*a*j/w;
  const wH='H = '+hh+' × '+a+' = '+(hh*a), wh='h = '+(hh*a)+' × '+j+' / '+w+' = '+NF(low);
  const svg=figure([[0,0],[w,hh]],f=>{
    let out='';
    for(let i=0;i<=w;i++) out+=g.seg(f([i,0]),f([i,hh]),'g-grid');
    for(let i=0;i<=hh;i++) out+=g.seg(f([0,i]),f([w,i]),'g-grid');
    out+=g.seg(f([0,0]),f([w,hh]),'g-l')+g.seg(f([j,hh*j/w]),f([j,hh]),'g-thick g-u');
    const q=f([j,(hh*j/w+hh)/2]);
    out+=g.text([q[0]+9,q[1]],'?','g-u','start')+g.dim(f([0,hh]),f([1,hh]),'a = '+a+' '+u,f([w/2,0]),14);
    return out;
  },'Quadrillage de '+w+' colonnes et '+hh+' lignes, avec une diagonale et un segment en gras',{H:210,pad:42});
  return mkGeo({svg,text:'La figure est formée de «'+(w*hh)+'» carrés identiques ('+w+' colonnes, '+hh+' lignes) de côté «a = '+a+'» '+u+'. Calcule la longueur du segment en gras, entre la diagonale et le haut du rectangle, sur la ligne verticale numéro «'+j+'» (en partant de la gauche).',ask:'la longueur du segment en gras',val,unit:u,
    placeholder:'hauteur de la diagonale = ...\nsegment = ... − ...',
    steps:[stp('Dimensions du rectangle',M('largeur = '+w+' × '+a+' = '+(w*a))+' '+u+' et '+M('hauteur = '+hh+' × '+a+' = '+(hh*a))+' '+u),stp('Thalès avec la diagonale','Le petit triangle rectangle sous la diagonale, jusqu\'à la verticale '+j+', est proportionnel au grand : '+M('hauteur / '+(hh*a)+' = '+(j*a)+' / '+(w*a)),M('hauteur = '+(hh*a)+' × '+j+' / '+w+' = '+NF(low))+' '+u),stp('Segment en gras',M('segment = '+(hh*a)+' − '+NF(low)+' = '+NF(val))+' '+u)],
    hints:['Le segment en gras va du haut du rectangle jusqu\'à la diagonale. Calcule d\'abord la hauteur de la diagonale à cet endroit avec Thalès.','La diagonale monte de '+hh+' carrés quand on avance de '+w+' carrés : à la verticale '+j+', elle est à '+j+'/'+w+' de la hauteur totale.'],
    work:[wH,wh,'s = '+(hh*a)+' − '+NF(low)+' = '+NF(val)+' '+u],
    mistakes:[{v:low,tag:'geo-quadrillage',msg:'Tu as calculé la hauteur de la diagonale (la partie sous la diagonale). Le segment en gras est la partie au-dessus : soustrais à la hauteur totale.',w:[wH,wh,'s = '+NF(low)+' '+u]},{v:a*(w-j)/w,tag:'geo-quadrillage',msg:'Tu as oublié de multiplier par le nombre de lignes ('+hh+') : la hauteur totale est '+hh+' × '+a+'.',w:['H = '+a,'h = '+a+' × '+j+' / '+w+' = '+NF(a*j/w),'s = '+a+' − '+NF(a*j/w)+' = '+NF(a*(w-j)/w)+' '+u]},{v:hh*a/w,tag:'geo-quadrillage',msg:'Tu as pris une seule colonne : à la verticale '+j+', il reste '+(w-j)+' colonne(s) à droite.',w:[wH,'s = '+(hh*a)+' × 1 / '+w+' = '+NF(hh*a/w)+' '+u]},{v:hh*a,tag:'geo-quadrillage',msg:'Tu as donné la hauteur totale du rectangle.',w:[wH,'s = '+(hh*a)+' '+u]}]});
}

/* ---------- Tangente, corde et triangle inscrit ---------- */
function genCirc6(){
  let t,b; do{ t=5*rnd(6,18); b=5*rnd(6,18); }while(t+b>150);
  const al=180-t-b, aA=rnd(0,359), aB=aA+2*t, aC=aA-2*b, uu=[-Math.sin(aA*Math.PI/180),Math.cos(aA*Math.PI/180)], A=cpt(aA), T=vadd(A,vmul(uu,0.7)), T2=vadd(A,vmul(uu,-0.55));
  const findBAC=Math.random()<0.5;
  const marks=[{at:'A',a:'B',toT2:T,r:38,label:DEG(t)}];
  if(findBAC){ marks.push({at:'B',a:'A',b:'C',r:22,label:DEG(b)}); marks.push({at:'A',a:'B',b:'C',r:19,label:'?',unk:true}); }
  else { marks.push({at:'A',a:'B',b:'C',r:19,label:DEG(al)}); marks.push({at:'B',a:'A',b:'C',r:22,label:'?',unk:true}); }
  const svg=figCirc({P:{A:aA,B:aB,C:aC},chords:[['A','B'],['B','C'],['C','A']],tan:[T2,T],marks,labels:[{p:T,s:'T'}],O:false,alt:'Cercle, triangle ABC inscrit et tangente en A'});
  const known=findBAC?'«∠ABC = '+b+'»°':'«∠BAC = '+al+'»°', target=findBAC?'∠BAC':'∠ABC', val=findBAC?al:b;
  const kn=findBAC?b:al, wT='∠ACB = ∠TAB = '+t+'°';
  return mkGeo({svg,text:'Le triangle «ABC» est inscrit dans un cercle. La droite «(AT)» est <b>tangente</b> au cercle en «A», avec «∠TAB = '+t+'»° et '+known+'. Calcule l\'angle «'+target+'».',ask:'l\'angle '+target,val,unit:'°',
    placeholder:'∠ACB = ∠TAB = '+t+'°  (tangente-corde)\n'+target+' = 180 − ... − ...',
    steps:[stp('Théorème de la tangente et de la corde','L\'angle entre la tangente (AT) et la corde [AB] est égal à l\'angle inscrit qui intercepte le même arc AB : '+M('∠ACB = ∠TAB = '+t)+'°.'),stp('Somme des angles du triangle ABC',M('∠BAC + ∠ABC + ∠ACB = 180')+'°'),stp('Calcule '+target,M(target+' = 180 − '+t+' − '+(findBAC?b:al)+' = '+val)+'°')],
    hints:['Repère l\'arc AB : l\'angle entre la tangente et la corde [AB] vaut l\'angle inscrit ∠ACB.','Quand deux angles du triangle ABC sont connus, la somme à 180° donne le troisième.'],
    work:[wT,target+' = 180 − '+t+' − '+kn+' = '+val+'°'],
    mistakes:[{v:180-t,tag:'geo-tangente-corde',msg:'Tu as fait 180 − '+t+' sans tenir compte du deuxième angle du triangle.',w:[wT,target+' = 180 − '+t+' = '+(180-t)+'°']},{v:180-(findBAC?b:al),tag:'geo-supp',msg:'Il manque l\'angle ∠ACB = ∠TAB = '+t+'° (tangente-corde) dans la somme des angles.',w:[target+' = 180 − '+kn+' = '+(180-kn)+'°']},{v:t+(findBAC?b:al),tag:'geo-supp',msg:'Tu as additionné deux angles du triangle : la somme des trois vaut 180°, il faut soustraire.',w:[wT,target+' = '+t+' + '+kn+' = '+(t+kn)+'°']},{v:2*t,tag:'geo-angle-centre',msg:'2 × '+t+' est l\'angle au centre : il n\'est pas demandé ici.',w:[target+' = 2 × ∠TAB = 2 × '+t+' = '+(2*t)+'°']}]});
}

/* ---------- Secteur d'anneau et forme en U ---------- */
function genComp6(){
  const ask=pick(['aire','périmètre']), u=uP();
  const piS=(n,d)=>{ const k=gcd(n,d); n/=k; d/=k; let e=d; while(e%2===0) e/=2; while(e%5===0) e/=5; return e===1?(n===d?'π':NF(n/d)+'π'):n+'π/'+d; };
  if(Math.random()<0.5){
    let x,y,al,ok=false,tries=0;
    do{ x=rnd(1,5); y=rnd(1,6); al=pick([60,90,120]); tries++;
      const th=360-al, v=x*(x+2*y), b=ask==='aire'?th/360*v:th/180*(2*y+x); ok=Math.abs(b*4-Math.round(b*4))<1e-9;
    }while(!ok&&tries<300);
    if(!ok){ x=2; y=3; al=90; }
    const th=360-al, R=x+y, v=x*(x+2*y);
    const svg=figure([[-R,-R],[R,R]],f=>{
      const c=f([0,0]), s=f.s, P=(ang,r)=>f([r*Math.cos(ang*Math.PI/180),r*Math.sin(ang*Math.PI/180)]), lg=th>180?1:0, e=360-al/2, st=al/2;
      const so=P(st,R), eo=P(e,R), ei=P(e,y), si=P(st,y);
      const d='M'+gf(so[0])+' '+gf(so[1])+' A'+gf(R*s)+' '+gf(R*s)+' 0 '+lg+' 0 '+gf(eo[0])+' '+gf(eo[1])+' L'+gf(ei[0])+' '+gf(ei[1])+' A'+gf(y*s)+' '+gf(y*s)+' 0 '+lg+' 1 '+gf(si[0])+' '+gf(si[1])+' Z';
      const yl=P(200,y*0.55);
      return g.path(d,'g-f')+g.seg(c,P(st,y),'g-dash')+g.seg(c,P(-st,y),'g-dash')+g.seg(c,P(200,y),'g-l')+g.dot(c)
        +g.text([yl[0]-1,yl[1]-10],'y','g-u2')+g.dim(P(st,y),P(st,R),'x',c,10)+g.arc(c,P(st,y*0.6),P(-st,y*0.6),Math.max(y*s*0.45,16),'α','g-a');
    },'Anneau de rayon intérieur '+y+' et de largeur '+x+', privé d\'un secteur d\'angle '+al+' degrés',{H:250,pad:34});
    const arcE=th/360, vv=x*(x+2*y);
    const val=ask==='aire'?pib(0,arcE*vv):pib(2*x,th/180*(2*y+x));
    const wR='R = '+y+' + '+x+' = '+R, wTh='θ = 360 − '+al+' = '+th, wA=[wR,wTh,'A = '+th+'/360 × π × ('+R+'² − '+y+'²)','A = '+piS(th*vv,360)+' '+u+'²'];
    const s1=piS(th*2*R,360), s2=piS(th*2*y,360), wP1='P1 = '+th+'/360 × 2π × '+R+' = '+s1, wP2='P2 = '+th+'/360 × 2π × '+y+' = '+s2, sT=piS(th*2*(R+y),360);
    const wP=[wR,wTh,wP1,wP2,'P = '+s1+' + '+s2+' + 2 × '+x+' = '+sT+' + '+(2*x)+' '+u];
    const r1=piS(al*2*R,360), r2=piS(al*2*y,360);
    const mist=ask==='aire'
      ?[{v:pib(0,al/360*vv),tag:'geo-couronne',msg:'Tu as utilisé l\'angle du secteur retiré ('+al+'°). La surface colorée correspond à '+th+'°.',w:[wR,'A = '+al+'/360 × π × ('+R+'² − '+y+'²)','A = '+piS(al*vv,360)+' '+u+'²']},{v:pib(0,vv),tag:'geo-couronne',msg:'Tu as calculé l\'aire de l\'anneau complet : retire la part correspondant à l\'angle de '+al+'°.',w:[wR,'A = π × ('+R+'² − '+y+'²)','A = '+piS(vv,1)+' '+u+'²']},{v:pib(0,arcE*R*R),tag:'geo-couronne',msg:'Tu as calculé le secteur du grand disque seulement : il faut retirer le secteur du petit disque.',w:[wR,wTh,'A = '+th+'/360 × π × '+R+'²','A = '+piS(th*R*R,360)+' '+u+'²']},{v:pib(0,arcE*(x*x)),tag:'geo-couronne',msg:'Tu as calculé π(R − r)² au lieu de π(R² − r²).',w:[wR,wTh,'A = '+th+'/360 × π × ('+R+' − '+y+')²','A = '+piS(th*x*x,360)+' '+u+'²']}]
      :[{v:pib(0,th/180*(2*y+x)),tag:'geo-couronne',msg:'Tu as oublié les deux bords droits (chacun de longueur x = '+x+').',w:[wR,wTh,wP1,wP2,'P = '+s1+' + '+s2+' = '+sT+' '+u]},{v:pib(2*x,th/360*2*R),tag:'geo-couronne',msg:'Tu as oublié l\'arc intérieur (de rayon y).',w:[wR,wTh,wP1,'P = '+s1+' + 2 × '+x+' = '+s1+' + '+(2*x)+' '+u]},{v:pib(4*x,th/180*(2*y+x)),tag:'geo-couronne',msg:'Il n\'y a que deux bords droits, chacun de longueur x.',w:[wR,wTh,wP1,wP2,'P = '+s1+' + '+s2+' + 4 × '+x+' = '+sT+' + '+(4*x)+' '+u]},{v:pib(2*x,al/180*(2*y+x)),tag:'geo-couronne',msg:'Tu as utilisé l\'angle retiré ('+al+'°). Les arcs correspondent à '+th+'°.',w:[wR,'P1 = '+al+'/360 × 2π × '+R+' = '+r1,'P2 = '+al+'/360 × 2π × '+y+' = '+r2,'P = '+r1+' + '+r2+' + 2 × '+x+' = '+piS(al*2*(R+y),360)+' + '+(2*x)+' '+u]},{v:pib(0,arcE*vv),tag:'geo-perim-aire',msg:'Tu as calculé l\'aire.',w:wA}];
    return mkGeo({svg,text:'Un anneau de <b>rayon intérieur</b> «y = '+y+'» '+u+' et de <b>largeur</b> «x = '+x+'» '+u+' est privé d\'un secteur d\'angle «α = '+al+'»° (voir figure). Calcule '+(ask==='aire'?'l\'aire':'le périmètre')+' de la surface colorée. Donne la <b>valeur exacte</b>.',ask:(ask==='aire'?'l\'aire':'le périmètre')+' de la surface colorée (valeur exacte)',val,mode:'pi',unit:u,pow:ask==='aire'?2:1,
      placeholder:ask==='aire'?'angle coloré = 360 − α = ...\nA = ... / 360 × π × (R² − y²)':'angle coloré = 360 − α = ...\narc extérieur = ...\narc intérieur = ...\nP = ...',
      steps:ask==='aire'
        ?[stp('Angle de la surface colorée',M('360 − '+al+' = '+th)+'°'),stp('Rayons',M('r = y = '+y)+' et '+M('R = y + x = '+R)+' '+u),stp('Fraction de l\'anneau',M('A = '+th+'/360 × π × (R² − r²) = '+th+'/360 × π × ('+R*R+' − '+y*y+')'),M('A = '+NF(arcE*vv)+'π')+' '+u+'²')]
        :[stp('Angle de la surface colorée',M('360 − '+al+' = '+th)+'°'),stp('Arc extérieur (rayon '+R+')',M(th+'/360 × 2π × '+R+' = '+NF(th/360*2*R)+'π')+' '+u),stp('Arc intérieur (rayon '+y+')',M(th+'/360 × 2π × '+y+' = '+NF(th/360*2*y)+'π')+' '+u),stp('Bords droits','Il y en a deux, de longueur '+M('x = '+x)+' : '+M('2x = '+2*x)+' '+u),stp('Somme',M('P = '+NF(th/180*(2*y+x))+'π + '+2*x)+' '+u)],
      hints:['La partie retirée a un angle de '+al+'°, la surface colorée a donc l\'angle complémentaire à 360°.',ask==='aire'?'Aire d\'un secteur : (angle / 360) × π × rayon². Ici, celui du grand disque moins celui du petit.':'Le contour comprend deux arcs de cercle (un extérieur, un intérieur) et deux segments.'],
      work:ask==='aire'?wA:wP,
      mistakes:mist.filter(m=>[m.v.a,m.v.b].every(z=>Math.abs(z*4-Math.round(z*4))<1e-9))});
  }
  const x=rnd(1,6);
  const svg=figure([[0,0],[5,4]],f=>{
    const P=(a,b)=>f([a,b]), s=f.s, cf=P(2.5,-2);
    const d='M'+P(0,0).map(gf).join(' ')+' L'+P(3,0).map(gf).join(' ')+' A'+gf(2*s)+' '+gf(2*s)+' 0 0 0 '+P(3,4).map(gf).join(' ')+' L'+P(0,4).map(gf).join(' ')+' L'+P(0,3).map(gf).join(' ')+' L'+P(3,3).map(gf).join(' ')+' A'+gf(s)+' '+gf(s)+' 0 0 1 '+P(3,1).map(gf).join(' ')+' L'+P(0,1).map(gf).join(' ')+' Z';
    return g.path(d,'g-f')+g.dim(P(0,3),P(3,3),'3x',P(1.5,8),14)+g.dim(P(0,1),P(0,3),'2x',P(9,2),14)+g.dim(P(0,0),P(0,1),'x',P(9,.5),14);
  },'Forme en U : deux bras et une demi-couronne',{H:230,pad:44});
  const A_=pib(6*x*x,1.5*x*x), P_=pib(14*x,3*x), val=ask==='aire'?pib(6*x*x,1.5*x*x):P_;
  const wA1='A1 = 2 × '+(3*x)+' × '+x+' = '+(6*x*x), wA2='A2 = π × ('+(2*x)+'² − '+x+'²) / 2 = '+piS(3*x*x,2), wUA=[wA1,wA2,'A = '+(6*x*x)+' + '+piS(3*x*x,2)+' '+u+'²'];
  const wQ1='P1 = 4 × '+(3*x)+' + 2 × '+x+' = '+(14*x), wQ2='P2 = π × '+(2*x)+' + π × '+x+' = '+piS(3*x,1), wUP=[wQ1,wQ2,'P = '+(14*x)+' + '+piS(3*x,1)+' '+u];
  const mist=ask==='aire'
    ?[{v:pib(6*x*x,0),tag:'geo-decomp',msg:'Tu as oublié la partie arrondie (demi-couronne).',w:[wA1,'A = '+(6*x*x)+' '+u+'²']},{v:pib(0,1.5*x*x),tag:'geo-decomp',msg:'Tu as oublié les deux bras rectangulaires.',w:[wA2,'A = '+piS(3*x*x,2)+' '+u+'²']},{v:pib(6*x*x,3*x*x),tag:'geo-decomp',msg:'La partie arrondie est une <b>demi</b>-couronne : divise par 2 son aire π(R² − r²).',w:[wA1,'A2 = π × ('+(2*x)+'² − '+x+'²) = '+piS(3*x*x,1),'A = '+(6*x*x)+' + '+piS(3*x*x,1)+' '+u+'²']},{v:pib(3*x*x,1.5*x*x),tag:'geo-decomp',msg:'Il y a deux bras (haut et bas), pas un seul.',w:['A1 = '+(3*x)+' × '+x+' = '+(3*x*x),wA2,'A = '+(3*x*x)+' + '+piS(3*x*x,2)+' '+u+'²']}]
    :[{v:pib(12*x,3*x),tag:'geo-perim-cote',msg:'Tu as oublié les deux petits côtés de longueur x aux extrémités des bras.',w:['P1 = 4 × '+(3*x)+' = '+(12*x),wQ2,'P = '+(12*x)+' + '+piS(3*x,1)+' '+u]},{v:pib(14*x,2*x),tag:'geo-perim-cote',msg:'Tu as oublié le demi-cercle intérieur (de rayon x).',w:[wQ1,'P2 = π × '+(2*x)+' = '+piS(2*x,1),'P = '+(14*x)+' + '+piS(2*x,1)+' '+u]},{v:pib(14*x,x),tag:'geo-perim-cote',msg:'Tu as oublié le demi-cercle extérieur (de rayon 2x).',w:[wQ1,'P2 = π × '+x+' = '+piS(x,1),'P = '+(14*x)+' + '+piS(x,1)+' '+u]},{v:pib(0,3*x),tag:'geo-perim-cote',msg:'Il manque tous les côtés droits.',w:[wQ2,'P = '+piS(3*x,1)+' '+u]},{v:pib(6*x*x,1.5*x*x),tag:'geo-perim-aire',msg:'Tu as calculé l\'aire.',w:wUA}];
  return mkGeo({svg,text:'La forme en U ci-dessus est faite de deux bras rectangulaires et d\'une demi-couronne. La largeur des bras est «x = '+x+'» '+u+', l\'ouverture intérieure mesure «2x» et la longueur intérieure des bras «3x». Calcule '+(ask==='aire'?'l\'aire':'le périmètre')+' de la forme. Donne la <b>valeur exacte</b>.',ask:(ask==='aire'?'l\'aire':'le périmètre')+' de la forme (valeur exacte)',val,mode:'pi',unit:u,pow:ask==='aire'?2:1,
    placeholder:ask==='aire'?'bras = 3x × x = ...\ndemi-couronne = π (R² − r²) / 2':'côtés droits = ...\ndemi-cercles = ...',
    steps:ask==='aire'
      ?[stp('Les deux bras',M('2 × (3x × x) = 6x² = 6 × '+x*x+' = '+6*x*x)+' '+u+'²'),stp('Demi-couronne : rayons',M('r = x = '+x)+' et '+M('R = 2x = '+2*x)+' '+u),stp('Aire de la demi-couronne',M('π (R² − r²) / 2 = π ('+4*x*x+' − '+x*x+') / 2 = '+NF(1.5*x*x)+'π')+' '+u+'²'),stp('Somme',M('A = '+6*x*x+' + '+NF(1.5*x*x)+'π')+' '+u+'²')]
      :[stp('Côtés droits',M('extérieur : 3x + 3x = '+6*x)+', '+M('intérieur : 3x + 3x = '+6*x)+', '+M('extrémités des bras : x + x = '+2*x)+' ; total '+M(14*x)+' '+u),stp('Demi-cercles',M('π × R = π × '+2*x+' = '+2*x+'π')+' (extérieur) et '+M('π × r = '+x+'π')+' (intérieur) ; total '+M(3*x+'π')+' '+u),stp('Périmètre',M('P = '+14*x+' + '+3*x+'π')+' '+u)],
    hints:[ask==='aire'?'Décompose : deux rectangles (les bras) et une demi-couronne.':'Fais le tour de la forme : côtés droits, arc extérieur, côtés droits, arc intérieur.','Rayon extérieur de la partie arrondie : 2x ; rayon intérieur : x.'],
    work:ask==='aire'?wUA:wUP,
    mistakes:mist});
}

TOPICS['gt-6']={kind:'gtri',level:6,label:'Triangle défini par ses trois côtés (Héron)',gen:genTri6};
TOPICS['gq-6']={kind:'gquad',level:6,label:'Trapèze, diagonales et Thalès',gen:genQuad6};
TOPICS['gp-6']={kind:'gpyth',level:6,label:'Pythagore et équation',gen:genPyth6};
TOPICS['gh-6']={kind:'gthal',level:6,label:'Thalès dans un quadrillage',gen:genThal6};
TOPICS['gc-6']={kind:'gcirc',level:6,label:'Tangente, corde et triangle inscrit',gen:genCirc6};
TOPICS['gm-6']={kind:'gcomp',level:6,label:'Secteur d\'anneau et forme en U',gen:genComp6};
