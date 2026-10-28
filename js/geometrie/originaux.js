'use strict';
/* ===== Géométrie niveau 6 : formes composées et cercles — exercices originaux (hors livre) ===== */
Object.assign(TAGS,{
  'geo-arbelos':{label:'Arbelos : demi-disques',tip:'La surface est un grand demi-disque privé de deux petits demi-disques. Chaque demi-disque vaut πr²/2 avec r = diamètre / 2. Le contour est formé de trois demi-cercles (la base n\'en fait pas partie).'},
  'geo-octogone':{label:'Octogone et disque',tip:'Octogone = carré − quatre coins (triangles rectangles isocèles de côté k, aire k²/2 chacun). Les côtés obliques mesurent k√2 (Pythagore). Le disque a pour rayon la moitié du côté du carré.'},
  'geo-rainure':{label:'Rainure oblongue et perçages',tip:'Une rainure oblongue = rectangle + deux demi-disques. Sa partie rectangulaire a pour longueur la longueur totale moins le diamètre. Aire de matière = plaque − rainure − trous.'},
  'geo-chemin':{label:'Chemin de largeur constante',tip:'Autour d\'un rectangle, un chemin de largeur w se décompose en 4 rectangles (2 × w × L et 2 × w × l) et en 4 quarts de disque de rayon w aux coins, qui forment un disque complet.'},
  'geo-patron-cone':{label:'Patron d\'un cône',tip:'L\'arc du secteur (patron) devient le cercle de base du cône : θ/360 × 2π s = 2π r, donc r = s × θ / 360. Aire latérale = aire du secteur = π r s. Aire totale = π r s + π r².'},
  'geo-inscrit-triangle':{label:'Cercle inscrit dans un triangle rectangle',tip:'Les deux tangentes issues d\'un même point ont la même longueur. Pour un triangle rectangle de côtés a, b et d\'hypoténuse c : r = (a + b − c) / 2. Autre voie : aire = r × demi-périmètre.'},
  'geo-hypo-diametre':{label:'Triangle rectangle inscrit',tip:'Un triangle inscrit dont un côté est un diamètre est rectangle (angle inscrit de 90°). L\'hypoténuse est le diamètre : on retrouve le troisième côté par Pythagore, puis l\'aire du disque hors du triangle.'},
  'geo-vide-disques':{label:'Surface entre disques tangents',tip:'Les centres de disques tangents (de rayon r) forment un polygone régulier de côté 2r. La surface entre les disques = polygone − secteurs aux sommets (angle intérieur du polygone : 90° pour le carré, 60° pour le triangle).'}
});
const SQ2=Math.SQRT2;

/* ----- gm-8a : arbelos ----- */
function genArbelosR(){
  let a=rnd(1,5), b=rnd(1,5); while(a===b) b=rnd(1,5); if(a>b){ const t=a; a=b; b=t; }
  const ask=pick(['aire','périmètre']), u=uP(), s=a+b, Dm=2*s, u2=' '+u+'²';
  const svg=figure([[0,-0.7*s],[Dm,s]],f=>{
    const A_=f([0,0]), C_=f([2*a,0]), B_=f([Dm,0]), top=f([s,s]), ctr=f([s,s*0.5]);
    let out=g.path(mv(A_)+arcM(A_,B_,top,s*f.s)+arcM(B_,C_,f([2*a+b,b]),b*f.s)+arcM(C_,A_,f([a,a]),a*f.s)+' Z','g-f g-hl');
    out+=g.seg(A_,B_,'g-thin')+g.dot(A_)+g.dot(B_)+g.dot(C_)+g.vert(A_,'A',ctr,13)+g.vert(B_,'B',ctr,13)+g.vert(C_,'C',ctr,13);
    out+=g.dim(A_,C_,String(2*a),ctr,36)+g.dim(C_,B_,String(2*b),ctr,36);
    return out;
  },'Trois demi-cercles de diamètres AB, AC et CB tracés du même côté de la droite (AB) : la surface limitée par les trois arcs est colorée',{H:215,pad:30});
  const txt='Sur un segment [AB], on place un point C tel que AC = «'+(2*a)+'» '+u+' et CB = «'+(2*b)+'» '+u+'. Du même côté de (AB), on trace les trois demi-cercles de diamètres [AB], [AC] et [CB]. La surface colorée est limitée par ces trois demi-cercles. ';
  const D0='R = ('+(2*a)+' + '+(2*b)+') / 2 = '+s, D1='r1 = '+(2*a)+' / 2 = '+a, D2='r2 = '+(2*b)+' / 2 = '+b;
  const s1=stp('Rayons des trois demi-cercles','Rayon de chaque demi-cercle = diamètre / 2 :',M(D0)+' ; '+M(D1)+' ; '+M(D2)+'.');
  if(ask==='aire'){
    return mkGeo({svg,mode:'pi',val:pib(0,a*b),unit:u,pow:2,text:txt+'Calcule l\'<b>aire</b> de la surface colorée. Donne la <b>valeur exacte</b>.',ask:'l\'aire (valeur exacte)',
      placeholder:'R = ...\nr1 = ... ; r2 = ...\nA = ...',
      work:[D0,D1+' ; '+D2,'A = π × '+s+'² / 2 − π × '+a+'² / 2 − π × '+b+'² / 2','A = '+kPi(s*s/2)+' − '+kPi(a*a/2)+' − '+kPi(b*b/2)+' = '+kPi(a*b)+u2],
      steps:[s1,stp('Soustraire les petits demi-disques','La surface colorée est le grand demi-disque privé des deux petits :',M('A = π × '+s+'² / 2 − π × '+a+'² / 2 − π × '+b+'² / 2')),
        stp('Calculer','Mets π / 2 en facteur : '+M('A = (π / 2) × ('+s+'² − '+a+'² − '+b+'²) = (π / 2) × '+(2*a*b)+' = '+kPi(a*b))+' '+u+'².')],
      hints:['Un demi-disque de rayon r a pour aire πr² / 2.','Aire = demi-disque de [AB] − demi-disque de [AC] − demi-disque de [CB]. Mets π / 2 en facteur.'],
      mistakes:[{v:pib(0,s*s/2),tag:'geo-arbelos',msg:'Tu as calculé le grand demi-disque seul : il faut retirer les deux petits demi-disques.',w:[D0,'A = π × '+s+'² / 2 = '+kPi(s*s/2)+u2]},
        {v:pib(0,(s*s-a*a)/2),tag:'geo-arbelos',msg:'Il faut retirer les <b>deux</b> petits demi-disques, pas un seul.',w:[D0+' ; '+D1,'A = π × '+s+'² / 2 − π × '+a+'² / 2 = '+kPi((s*s-a*a)/2)+u2]},
        {v:pib(0,2*a*b),tag:'geo-demi',msg:'Un demi-disque vaut πr² / 2 : il manque la division par 2.',w:[D0+' ; '+D1+' ; '+D2,'A = π × '+s+'² − π × '+a+'² − π × '+b+'² = '+kPi(2*a*b)+u2]},
        {v:pib(0,4*a*b),tag:'geo-rayon',msg:'Le rayon vaut la moitié du diamètre : tu as utilisé les diamètres ('+Dm+', '+(2*a)+', '+(2*b)+') comme rayons.',w:['A = π × '+Dm+'² / 2 − π × '+(2*a)+'² / 2 − π × '+(2*b)+'² / 2 = '+kPi(4*a*b)+u2]}]});
  }
  const Pt=2*s;
  return mkGeo({svg,mode:'pi',val:pib(0,Pt),unit:u,pow:1,text:txt+'Calcule le <b>périmètre</b> de la surface colorée. Donne la <b>valeur exacte</b>.',ask:'le périmètre (valeur exacte)',
    placeholder:'R = ...\nP = ...',work:[D0+' ; '+D1+' ; '+D2,'P = π × '+s+' + π × '+a+' + π × '+b+' = '+kPi(Pt)+' '+u],
    steps:[s1,stp('Les trois arcs','Un demi-cercle de rayon r mesure '+M('π × r')+'. Le contour est formé des trois arcs :',M('P = π × '+s+' + π × '+a+' + π × '+b)),
      stp('Calculer',M('P = π × ('+s+' + '+a+' + '+b+') = '+kPi(Pt))+' '+u+'.')],
    hints:['La longueur d\'un demi-cercle de rayon r est π × r (la moitié de 2πr).','Le contour comprend trois demi-cercles ; le segment [AB] n\'est pas un bord de la surface colorée.'],
    mistakes:[{v:pib(0,s),tag:'geo-arbelos',msg:'Le contour comprend aussi les deux petits demi-cercles (en plus du grand).',w:['P = π × '+s+' = '+kPi(s)+' '+u]},
      {v:pib(0,4*s),tag:'geo-perim-cote',msg:'Un demi-cercle mesure π × r (la moitié du cercle) : tu as pris des cercles entiers.',w:['P = 2π × '+s+' + 2π × '+a+' + 2π × '+b+' = '+kPi(4*s)+' '+u]},
      {v:pib(2*s,2*s),tag:'geo-perim-cote',msg:'La base [AB] n\'est pas un bord de la surface colorée : le contour est formé des trois arcs seulement.',w:['P = '+kPi(Pt)+' + '+Dm+' = '+kPi(Pt)+' + '+Dm+' '+u]}]});
}

/* ----- gm-8b : octogone et disque ----- */
function genOctoR(){
  const k=rnd(1,4), L=4*k, ask=pick(['aire','périmètre']), u=uP(), u2=' '+u+'²', r=2*k;
  const svg=figure([[0,-0.32*L],[L,L]],f=>{
    const q=[[0,0],[L,0],[L,L],[0,L]].map(f), V=[[k,0],[L-k,0],[L,k],[L,L-k],[L-k,L],[k,L],[0,L-k],[0,k]].map(f), O=f([L/2,L/2]);
    let out=dashArc(mv(q[0])+' L'+gf(q[1][0])+' '+gf(q[1][1])+' L'+gf(q[2][0])+' '+gf(q[2][1])+' L'+gf(q[3][0])+' '+gf(q[3][1])+' Z');
    out+=g.poly(V,'g-hl')+g.circle(O,r*f.s,'g-hole')+g.dot(O);
    out+=g.dim(q[0],q[1],String(L),O,26)+g.dim(f([L-k,0]),q[1],String(k),O,10);
    return out;
  },'Carré dont les quatre coins sont coupés (octogone) et disque centré dont le diamètre est égal au côté du carré',{H:260,pad:30});
  const txt='Un carré de côté «'+L+'» '+u+' est coupé à ses quatre coins : à chaque coin, on retire un triangle rectangle isocèle dont les côtés de l\'angle droit mesurent «'+k+'» '+u+' (on obtient un octogone). On découpe dans cet octogone un disque de même centre que le carré, dont le diamètre est égal au côté du carré. La surface colorée est l\'octogone privé du disque. ';
  const D1='coin retiré = '+k+' × '+k+' / 2 = '+NF(k*k/2), D2='octogone = '+L+'² − 4 × '+NF(k*k/2)+' = '+(14*k*k), D3='r = '+L+' / 2 = '+r;
  if(ask==='aire'){
    return mkGeo({svg,mode:'pi',val:pib(14*k*k,-4*k*k),unit:u,pow:2,text:txt+'Calcule l\'<b>aire</b> de la surface colorée. Donne la <b>valeur exacte</b>.',ask:'l\'aire (valeur exacte)',
      placeholder:'octogone = ...\ndisque = ...\nA = ...',work:[D1,D2,D3,'disque = π × '+r+'² = '+kPi(r*r),'A = '+(14*k*k)+' − '+kPi(r*r)+u2],
      steps:[stp('Aire de l\'octogone','Carré moins quatre coins (triangles rectangles isocèles de côté '+M(k)+') :',M('A = '+L+'² − 4 × '+k+'² / 2 = '+(L*L)+' − '+(2*k*k)+' = '+(14*k*k))),
        stp('Aire du disque','Le rayon est la moitié du côté du carré : '+M(D3)+', donc '+M('π × '+r+'² = '+kPi(r*r))+'.'),
        stp('Soustraire',M('A = '+(14*k*k)+' − '+kPi(r*r)+' ≈ '+NF(Math.round((14*k*k-4*k*k*Math.PI)*100)/100))+' '+u+'².')],
      hints:['Aire = octogone − disque. L\'octogone est le carré privé de ses quatre coins.','Chaque coin est un triangle rectangle isocèle de côté '+k+' : aire '+NF(k*k/2)+'. Le rayon du disque est '+r+'.'],
      mistakes:[{v:pib(L*L,-4*k*k),tag:'geo-octogone',msg:'Tu as gardé le carré entier : il faut retirer les quatre coins ('+(2*k*k)+' en tout).',w:['A = '+L+'² − '+kPi(r*r)+' = '+(L*L)+' − '+kPi(r*r)+u2]},
        {v:pib(L*L-4*k*k,-4*k*k),tag:'geo-demi',msg:'L\'aire d\'un triangle est la moitié de base × hauteur : un coin vaut '+NF(k*k/2)+' et non '+(k*k)+'.',w:['A = '+L+'² − 4 × '+k+'² − '+kPi(r*r)+' = '+(L*L-4*k*k)+' − '+kPi(r*r)+u2]},
        {v:pib(14*k*k,-16*k*k),tag:'geo-rayon',msg:'Le diamètre du disque vaut le côté du carré ('+L+') : le rayon est '+r+', pas '+L+'.',w:['A = '+(14*k*k)+' − π × '+L+'² = '+(14*k*k)+' − '+kPi(L*L)+u2]},
        {v:pib(14*k*k,-4*k),tag:'geo-aire-pi',msg:'L\'aire d\'un disque est πr² (et non 2πr, qui est son périmètre).',w:['A = '+(14*k*k)+' − 2π × '+r+' = '+(14*k*k)+' − '+kPi(4*k)+u2]}]});
  }
  const exact=NF(8*k)+' + '+kRt(4*k,2)+' + '+kPi(4*k);
  return mkGeo({svg,mode:'pi',exact,val:pib(8*k+4*k*SQ2,4*k),unit:u,pow:1,text:txt+'Calcule le <b>périmètre</b> de la surface colorée (contour de l\'octogone et contour du disque). Donne la <b>valeur exacte</b>.',ask:'le périmètre (valeur exacte)',
    placeholder:'côté droit = ...\ncôté oblique = ...\ncercle = ...\nP = ...',
    work:['côté droit = '+L+' − 2 × '+k+' = '+(2*k),'côté oblique = √('+k+'² + '+k+'²) = '+kRt(k,2),D3,'cercle = 2π × '+r+' = '+kPi(4*k),'P = 4 × '+(2*k)+' + 4 × '+kRt(k,2)+' + '+kPi(4*k)+' = '+exact+' '+u],
    steps:[stp('Côtés de l\'octogone','Côtés « droits » : '+M(L+' − 2 × '+k+' = '+(2*k))+' (au nombre de 4). Côtés obliques : hypoténuse d\'un triangle rectangle isocèle de côté '+M(k)+' :',M('√('+k+'² + '+k+'²) = '+kRt(k,2))+' (au nombre de 4).'),
      stp('Contour du disque','Rayon '+M(D3)+' : '+M('2π × '+r+' = '+kPi(4*k))+'.'),
      stp('Périmètre',M('P = '+(8*k)+' + '+kRt(4*k,2)+' + '+kPi(4*k)+' ≈ '+NF(Math.round((8*k+4*k*SQ2+4*k*Math.PI)*100)/100))+' '+u+'.')],
    hints:['Le bord de la surface colorée a deux morceaux : le contour de l\'octogone (8 côtés) et le cercle du disque (trou).','Côtés obliques : Pythagore dans le coin retiré, avec deux côtés de '+k+'.'],
    mistakes:[{v:pib(8*k+4*k,4*k),tag:'geo-pyth-somme',msg:'Un côté oblique est l\'hypoténuse du coin : '+M('√('+k+'² + '+k+'²) = '+kRt(k,2))+', et non '+k+'.',w:['P = '+(8*k)+' + 4 × '+k+' + '+kPi(4*k)+' = '+(12*k)+' + '+kPi(4*k)+' '+u]},
      {v:pib(8*k+4*k*SQ2,0),tag:'geo-perim-cote',msg:'Le disque est retiré : son contour (le cercle) fait aussi partie du bord de la surface colorée.',w:['P = '+(8*k)+' + '+kRt(4*k,2)+' '+u]},
      {v:pib(16*k,4*k),tag:'geo-octogone',msg:'Les coins sont coupés : le contour de l\'octogone n\'est pas celui du carré.',w:['P = 4 × '+L+' + '+kPi(4*k)+' = '+(16*k)+' + '+kPi(4*k)+' '+u]},
      {v:pib(8*k+4*k*SQ2,8*k),tag:'geo-rayon',msg:'Le diamètre du disque vaut '+L+' : le rayon est '+r+' (la moitié).',w:['cercle = 2π × '+L+' = '+kPi(8*k),'P = '+exact.replace(kPi(4*k),kPi(8*k))+' '+u]}]});
}

/* ----- gm-8c : plaque à rainure oblongue et deux perçages ----- */
function genRainureR(){
  const d=pick([6,8,10]), dh=pick([4,6,8]), e=rnd(2,10), Lt=e+d, a=Lt+rnd(8,16), b=d+dh+rnd(14,22), u='mm', u2=' mm²';
  const cP=d*d/4+dh*dh/2, base=a*b-e*d;
  const svg=figure([[0,0],[a,b]],f=>{
    const P0=f([0,0]), P1=f([a,0]), P2=f([a,b]), P3=f([0,b]), O=f([a/2,b/2]);
    const yy=b*0.68, xc=a/2, rr=d/2, c1=xc-e/2, c2=xc+e/2;
    const TR=f([c2,yy+rr]), BR=f([c2,yy-rr]), BL=f([c1,yy-rr]), TL=f([c1,yy+rr]), R=rr*f.s;
    let out=g.poly([P0,P1,P2,P3],'g-hl');
    out+=g.path(mv(TL)+' L'+gf(TR[0])+' '+gf(TR[1])+arcM(TR,BR,f([c2+rr,yy]),R)+' L'+gf(BL[0])+' '+gf(BL[1])+arcM(BL,TL,f([c1-rr,yy]),R)+' Z','g-f g-hole');
    const hr=dh/2, hy=b*0.22;
    out+=g.circle(f([a*0.25,hy]),hr*f.s,'g-hole')+g.circle(f([a*0.75,hy]),hr*f.s,'g-hole');
    out+=g.text(f([xc,yy]),String(Lt),'g-t');
    out+=g.dim(P0,P1,String(a),O,12)+g.dim(P1,P2,String(b),O,12);
    return out;
  },'Plaque rectangulaire avec une rainure oblongue (rectangle à extrémités arrondies) et deux trous ronds',{H:230,pad:38});
  const txt='Une plaque rectangulaire mesure «'+a+'» mm sur «'+b+'» mm. On y usine une <b>rainure oblongue</b> : un rectangle de largeur «'+d+'» mm dont les deux extrémités sont des demi-cercles ; la longueur totale de la rainure, d\'une extrémité arrondie à l\'autre, est de «'+Lt+'» mm. On perce aussi deux trous ronds de diamètre «'+dh+'» mm. Calcule l\'<b>aire de matière</b> qui reste (surface colorée). Donne la <b>valeur exacte</b>.';
  const D1='longueur du rectangle = '+Lt+' − '+d+' = '+e, D2='rainure = '+e+' × '+d+' + π × '+(d/2)+'² = '+(e*d)+' + '+kPi(d*d/4), D3='2 trous = 2 × π × '+(dh/2)+'² = '+kPi(dh*dh/2);
  return mkGeo({svg,mode:'pi',val:pib(base,-cP),unit:u,pow:2,text:txt,ask:'l\'aire de matière (valeur exacte)',
    placeholder:'partie droite = ...\nrainure = ...\ntrous = ...\nA = ...',work:[D1,D2,D3,'A = '+(a*b)+' − ('+(e*d)+' + '+kPi(d*d/4)+') − '+kPi(dh*dh/2)+' = '+NF(base)+' − '+kPi(cP)+u2],
    steps:[stp('Découper la rainure','Les deux bouts arrondis forment un disque de diamètre '+M(d)+' (rayon '+M(d/2)+'). Le rectangle central a pour longueur '+M(D1)+' mm.'),
      stp('Aires à retirer','Rainure : '+M('e × d + π r² = '+e+' × '+d+' + '+kPi(d*d/4)+' = '+(e*d)+' + '+kPi(d*d/4))+'. Deux trous : '+M(D3)+'.'),
      stp('Matière restante',M('A = '+(a*b)+' − '+(e*d)+' − '+kPi(cP)+' = '+NF(base)+' − '+kPi(cP)+' ≈ '+NF(Math.round((base-cP*Math.PI)*100)/100))+' mm².')],
    hints:['Aire de matière = plaque − rainure − deux trous.','La rainure = un rectangle + deux demi-disques. La longueur du rectangle est la longueur totale moins le diamètre ('+Lt+' − '+d+').'],
    mistakes:[{v:pib(a*b,-cP),tag:'geo-rainure',msg:'Tu as oublié la partie rectangulaire de la rainure ('+e+' × '+d+' = '+(e*d)+') : il n\'y a pas que les deux bouts arrondis.',w:['A = '+(a*b)+' − '+kPi(d*d/4)+' − '+kPi(dh*dh/2)+' = '+(a*b)+' − '+kPi(cP)+u2]},
      {v:pib(a*b-Lt*d,-dh*dh/2),tag:'geo-rainure',msg:'Les extrémités sont arrondies : la rainure n\'est pas un rectangle de longueur '+Lt+'. Le rectangle mesure '+e+' et il y a deux demi-disques.',w:['A = '+(a*b)+' − '+Lt+' × '+d+' − '+kPi(dh*dh/2)+' = '+(a*b-Lt*d)+' − '+kPi(dh*dh/2)+u2]},
      {v:pib(base,-(d*d/4+2*dh*dh)),tag:'geo-rayon',msg:'Un trou de diamètre '+dh+' a pour rayon '+(dh/2)+' : tu as pris le diamètre comme rayon.',w:['A = '+(a*b)+' − '+(e*d)+' − '+kPi(d*d/4)+' − 2 × π × '+dh+'² = '+NF(base)+' − '+kPi(d*d/4+2*dh*dh)+u2]},
      {v:pib(base,-(d*d/4+dh*dh/4)),tag:'geo-rainure',msg:'Il y a <b>deux</b> trous ronds à retirer.',w:['A = '+(a*b)+' − '+(e*d)+' − '+kPi(d*d/4)+' − '+kPi(dh*dh/4)+' = '+NF(base)+' − '+kPi(d*d/4+dh*dh/4)+u2]}]});
}

/* ----- gm-8d : chemin de largeur constante autour d'un rectangle ----- */
function genCheminR(){
  const w=rnd(1,4), l=rnd(4,10), L=l+rnd(2,8), ask=pick(['aire','périmètre']), u=uP(), u2=' '+u+'²';
  const svg=figure([[-w,-w-0.3*l],[L+w,l+w]],f=>{
    const c=Math.SQRT1_2*w, P=(x,y)=>f([x,y]), R=w*f.s;
    const pts=[P(0,-w),P(L,-w),P(L+w,0),P(L+w,l),P(L,l+w),P(0,l+w),P(-w,l),P(-w,0)];
    const d=mv(pts[0])+' L'+gf(pts[1][0])+' '+gf(pts[1][1])+arcM(pts[1],pts[2],P(L+c,-c),R)+' L'+gf(pts[3][0])+' '+gf(pts[3][1])+arcM(pts[3],pts[4],P(L+c,l+c),R)+' L'+gf(pts[5][0])+' '+gf(pts[5][1])+arcM(pts[5],pts[6],P(-c,l+c),R)+' L'+gf(pts[7][0])+' '+gf(pts[7][1])+arcM(pts[7],pts[0],P(-c,-c),R)+' Z';
    const ctr=P(L/2,l/2), Q0=P(0,0), Q1=P(L,0), Q2=P(L,l), Q3=P(0,l);
    let out=g.path(d,'g-f g-hl')+g.poly([Q0,Q1,Q2,Q3],'')+g.text(ctr,'jardin','g-t');
    out+=g.dim(Q0,Q1,String(L),ctr,w*f.s+14)+g.dim(Q1,Q2,String(l),ctr,w*f.s+14)+g.text(P(-w/2,l/2),String(w),'g-u');
    return out;
  },'Jardin rectangulaire entouré d\'un chemin de largeur constante dont les coins extérieurs sont arrondis',{H:240,pad:30});
  const txt='Un jardin rectangulaire de «'+L+'» '+u+' sur «'+l+'» '+u+' est entouré d\'un chemin de largeur constante «'+w+'» '+u+'. Le bord <b>extérieur</b> du chemin est formé de segments parallèles aux côtés du jardin et, aux quatre coins, de quarts de cercle centrés sur les sommets du jardin. ';
  const Sd=2*w*(L+l), Pd=2*(L+l);
  if(ask==='aire'){
    return mkGeo({svg,mode:'pi',val:pib(Sd,w*w),unit:u,pow:2,text:txt+'Calcule l\'<b>aire du chemin</b> (surface colorée). Donne la <b>valeur exacte</b>.',ask:'l\'aire du chemin (valeur exacte)',
      placeholder:'4 rectangles = ...\n4 quarts de disque = ...\nA = ...',work:['2 rectangles de '+L+' × '+w+' et 2 de '+l+' × '+w+' : '+(2*w*L)+' + '+(2*w*l)+' = '+Sd,'4 quarts de disque de rayon '+w+' = 1 disque : π × '+w+'² = '+kPi(w*w),'A = '+Sd+' + '+kPi(w*w)+u2],
      steps:[stp('Découper le chemin','4 rectangles le long des côtés : deux de '+M(L+' × '+w)+' et deux de '+M(l+' × '+w)+' ; aux coins, 4 quarts de disque de rayon '+M(w)+'.'),
        stp('Rectangles',M('2 × '+L+' × '+w+' + 2 × '+l+' × '+w+' = '+Sd)),stp('Coins','Quatre quarts de disque forment un disque entier :',M('π × '+w+'² = '+kPi(w*w))),
        stp('Total',M('A = '+Sd+' + '+kPi(w*w)+' ≈ '+NF(Math.round((Sd+w*w*Math.PI)*100)/100))+' '+u+'².')],
      hints:['Découpe le chemin en 4 rectangles (un par côté du jardin) et 4 coins arrondis.','Les 4 quarts de disque de rayon '+w+' recollés forment un disque entier : aire π × '+w+'².'],
      mistakes:[{v:pib(Sd+4*w*w,0),tag:'geo-chemin',msg:'Les coins sont arrondis (quarts de disque), pas des carrés de côté '+w+' : les quatre coins valent ensemble π × '+w+'².',w:['A = '+Sd+' + 4 × '+w+'² = '+(Sd+4*w*w)+u2]},
        {v:pib(Sd,0),tag:'geo-chemin',msg:'Tu as oublié les quatre coins arrondis : ils forment un disque entier de rayon '+w+'.',w:['A = 2 × '+L+' × '+w+' + 2 × '+l+' × '+w+' = '+Sd+u2]},
        {v:pib(Sd,4*w*w),tag:'geo-chemin',msg:'Quatre quarts de disque font <b>un</b> disque (pas quatre).',w:['A = '+Sd+' + 4 × π × '+w+'² = '+Sd+' + '+kPi(4*w*w)+u2]},
        {v:pib(Sd,w*w/2),tag:'geo-aire-pi',msg:'Quatre quarts de disque font un disque entier, pas un demi-disque.',w:['A = '+Sd+' + π × '+w+'² / 2 = '+Sd+' + '+kPi(w*w/2)+u2]}]});
  }
  return mkGeo({svg,mode:'pi',val:pib(Pd,2*w),unit:u,pow:1,text:txt+'Calcule la <b>longueur du bord extérieur</b> du chemin. Donne la <b>valeur exacte</b>.',ask:'la longueur du bord extérieur (valeur exacte)',
    placeholder:'segments = ...\narcs = ...\nP = ...',work:['segments : 2 × '+L+' + 2 × '+l+' = '+Pd,'4 quarts de cercle de rayon '+w+' = 1 cercle : 2π × '+w+' = '+kPi(2*w),'P = '+Pd+' + '+kPi(2*w)+' '+u],
    steps:[stp('Segments droits','Chacun a la même longueur que le côté du jardin le long duquel il passe :',M('2 × '+L+' + 2 × '+l+' = '+Pd)),stp('Quarts de cercle','Les 4 quarts de cercle de rayon '+M(w)+' forment un cercle entier :',M('2π × '+w+' = '+kPi(2*w))),
      stp('Total',M('P = '+Pd+' + '+kPi(2*w)+' ≈ '+NF(Math.round((Pd+2*w*Math.PI)*100)/100))+' '+u+'.')],
    hints:['Le bord extérieur = 4 segments droits + 4 quarts de cercle.','Les segments droits ont les mêmes longueurs que les côtés du jardin ; les quatre quarts de cercle de rayon '+w+' forment un cercle complet.'],
    mistakes:[{v:pib(Pd+8*w,0),tag:'geo-chemin',msg:'Aux coins, le bord est arrondi (quart de cercle) : il ne suit pas un angle droit.',w:['P = 2 × ('+(L+2*w)+' + '+(l+2*w)+') = '+(Pd+8*w)+' '+u]},
      {v:pib(Pd,8*w),tag:'geo-perim-cote',msg:'Quatre quarts de cercle font <b>un</b> cercle de longueur 2πr (pas quatre).',w:['P = '+Pd+' + 4 × 2π × '+w+' = '+Pd+' + '+kPi(8*w)+' '+u]},
      {v:pib(Pd,w),tag:'geo-perim-cote',msg:'Quatre quarts de cercle font un cercle entier : 2π × '+w+', pas π × '+w+'.',w:['P = '+Pd+' + π × '+w+' = '+Pd+' + '+kPi(w)+' '+u]},
      {v:pib(Pd,0),tag:'geo-chemin',msg:'Il manque les arcs aux quatre coins du bord extérieur.',w:['P = 2 × '+L+' + 2 × '+l+' = '+Pd+' '+u]}]});
}

/* ----- gc-7a : patron d'un cône ----- */
function genPatronConeR(){
  const s=pick([4,6,8,9,10,12,15,18,20]); let r; do{ r=rnd(2,Math.floor(s*0.8)); }while(r>=s||360*r/s>300);
  const th=360*r/s, ask=pick(['rayon','latérale','totale']), u=uP(), u2=' '+u+'²';
  const svg=figure((function(){ const p=[[0,0]]; for(let a=90-th/2;a<=90+th/2+0.1;a+=5) p.push([s*Math.cos(a*Math.PI/180),s*Math.sin(a*Math.PI/180)]); return p; })(),f=>{
    const A1=90-th/2, A2=90+th/2, P1=f([s*Math.cos(A1*Math.PI/180),s*Math.sin(A1*Math.PI/180)]), P2=f([s*Math.cos(A2*Math.PI/180),s*Math.sin(A2*Math.PI/180)]), O=f([0,0]);
    let out=g.path(mv(O)+' L'+gf(P1[0])+' '+gf(P1[1])+' A'+gf(s*f.s)+' '+gf(s*f.s)+' 0 '+(th>180?1:0)+' 0 '+gf(P2[0])+' '+gf(P2[1])+' Z','g-f g-hl');
    const ra=0.2*s*f.s, q1=[O[0]+ra*Math.cos(A1*Math.PI/180),O[1]-ra*Math.sin(A1*Math.PI/180)], q2=[O[0]+ra*Math.cos(A2*Math.PI/180),O[1]-ra*Math.sin(A2*Math.PI/180)];
    out+=g.dot(O)+'<path class="g-mark" fill="none" d="M'+gf(q1[0])+' '+gf(q1[1])+' A'+gf(ra)+' '+gf(ra)+' 0 '+(th>180?1:0)+' 0 '+gf(q2[0])+' '+gf(q2[1])+'"/>'+g.text(f([0,0.36*s]),th+'°','g-u')+g.text(vadd(vmid(O,P2),[-12,-4]),String(s),'g-t','end');
    return out;
  },'Secteur circulaire de rayon '+s+' et d\'angle '+th+' degrés : patron de la surface latérale d\'un cône',{H:240,pad:30});
  const txt='Le patron de la surface latérale d\'un cône est un secteur circulaire de rayon «'+s+'» '+u+' et d\'angle «'+th+'°». On enroule ce secteur pour fabriquer le cône : l\'arc de cercle du secteur devient le cercle de base du cône. ';
  const D1='arc = '+th+' / 360 × 2π × '+s+' = '+kPi(2*r), D2='2π × r = '+kPi(2*r)+' donc r = '+r;
  const s1=stp('L\'arc devient le cercle de base','Longueur de l\'arc : '+M('(' +th+' / 360) × 2π × '+s+' = '+kPi(2*r))+'. Le cercle de base a la même longueur : '+M('2π × r = '+kPi(2*r))+', donc '+M('r = '+r)+' '+u+'.');
  const hRadius=['L\'arc du secteur et le cercle de base ont la même longueur : '+th+'/360 × 2π × '+s+' = 2π × r.','On peut simplifier par 2π : r = '+s+' × '+th+' / 360.'];
  if(ask==='rayon'){
    return mkGeo({svg,mode:'num',val:r,unit:u,pow:1,text:txt+'Calcule le <b>rayon du cercle de base</b> du cône.',ask:'le rayon du cercle de base',
      placeholder:'arc = ...\nr = ...',work:[D1,D2,'r = '+r+' '+u],
      steps:[s1,stp('Résultat','Autrement dit '+M('r = s × θ / 360 = '+s+' × '+th+' / 360 = '+r)+' '+u+'.')],
      hints:hRadius,
      mistakes:[{v:s,tag:'geo-patron-cone',msg:'Le rayon du secteur ('+s+') est la génératrice du cône, pas le rayon de sa base.',w:['r = '+s+' '+u]},
        {v:2*r,tag:'geo-patron-cone',msg:'Tu as obtenu le diamètre de la base : pense à diviser par 2 (circonférence = 2π × r).',w:['arc = '+kPi(2*r),'π × d = '+kPi(2*r)+' donc d = '+(2*r)+' '+u]},
        {v:r/2,tag:'geo-patron-cone',msg:'La circonférence de la base est 2πr (pas 4πr) : une division par 2 en trop.',w:['arc = '+kPi(2*r),'4π × r = '+kPi(2*r)+' donc r = '+NF(r/2)+' '+u]},
        {v:Math.round(s*(360-th)/360*1000)/1000,tag:'geo-patron-cone',msg:'Utilise l\'angle du secteur ('+th+'°) et non l\'angle complémentaire à 360°.',w:['r = '+s+' × '+(360-th)+' / 360 = '+NF(Math.round(s*(360-th)/360*1000)/1000)+' '+u]}]});
  }
  if(ask==='latérale'){
    return mkGeo({svg,mode:'pi',val:pib(0,r*s),unit:u,pow:2,text:txt+'Calcule l\'<b>aire de la surface latérale</b> du cône. Donne la <b>valeur exacte</b>.',ask:'l\'aire latérale (valeur exacte)',
      placeholder:'r = ...\nA = ...',work:[D1,'r = '+r,'aire du secteur = '+th+' / 360 × π × '+s+'² = '+kPi(r*s)+u2],
      steps:[s1,stp('Aire du secteur','La surface latérale est exactement l\'aire du secteur :',M('(' +th+' / 360) × π × '+s+'² = '+kPi(r*s))+' '+u+'².'),
        stp('Contrôle','Formule du cône : '+M('π × r × s = π × '+r+' × '+s+' = '+kPi(r*s))+'.')],
      hints:['L\'aire latérale du cône = aire du secteur = (θ/360) × π × s².','Contrôle : aire latérale = π × r × s (r = rayon de la base, s = rayon du secteur).'],
      mistakes:[{v:pib(0,s*s),tag:'geo-patron-cone',msg:'C\'est l\'aire du disque entier de rayon '+s+' : le patron n\'en est qu\'une partie ('+th+'/360).',w:['A = π × '+s+'² = '+kPi(s*s)+u2]},
        {v:pib(0,r*r),tag:'geo-patron-cone',msg:'π × r² est l\'aire de la <b>base</b> du cône, pas de sa surface latérale.',w:['r = '+r,'A = π × '+r+'² = '+kPi(r*r)+u2]},
        {v:pib(0,2*r*s),tag:'geo-aire-pi',msg:'L\'aire latérale vaut π × r × s (et non 2π × r × s, qui est le double).',w:['r = '+r,'A = 2π × '+r+' × '+s+' = '+kPi(2*r*s)+u2]},
        {v:pib(0,r*s+r*r),tag:'geo-patron-cone',msg:'La surface <b>latérale</b> ne comprend pas le disque de base.',w:['r = '+r,'A = π × '+r+' × '+s+' + π × '+r+'² = '+kPi(r*s+r*r)+u2]}]});
  }
  return mkGeo({svg,mode:'pi',val:pib(0,r*(s+r)),unit:u,pow:2,text:txt+'Calcule l\'<b>aire totale</b> du cône (surface latérale et disque de base). Donne la <b>valeur exacte</b>.',ask:'l\'aire totale (valeur exacte)',
    placeholder:'r = ...\nlatérale = ...\nbase = ...\nA = ...',work:[D1,'r = '+r,'latérale = '+th+' / 360 × π × '+s+'² = '+kPi(r*s),'base = π × '+r+'² = '+kPi(r*r),'A = '+kPi(r*s)+' + '+kPi(r*r)+' = '+kPi(r*(s+r))+u2],
    steps:[s1,stp('Surface latérale','Aire du secteur : '+M('(' +th+' / 360) × π × '+s+'² = '+kPi(r*s))+'.'),stp('Disque de base',M('π × '+r+'² = '+kPi(r*r))+'.'),
      stp('Total',M('A = '+kPi(r*s)+' + '+kPi(r*r)+' = '+kPi(r*(s+r))+' ≈ '+NF(Math.round(r*(s+r)*Math.PI*100)/100))+' '+u+'².')],
    hints:['Aire totale = surface latérale (le secteur) + disque de base.','D\'abord le rayon de la base : r = s × θ / 360. Puis π × r × s + π × r².'],
    mistakes:[{v:pib(0,r*s),tag:'geo-patron-cone',msg:'Tu as calculé la surface latérale seule : il faut ajouter le disque de base (π × '+r+'² = '+kPi(r*r)+').',w:['r = '+r,'A = '+kPi(r*s)+u2]},
      {v:pib(0,s*s+r*r),tag:'geo-patron-cone',msg:'Le patron est un <b>secteur</b> ('+th+'/360 du disque), pas le disque entier de rayon '+s+'.',w:['r = '+r,'A = π × '+s+'² + π × '+r+'² = '+kPi(s*s+r*r)+u2]},
      {v:pib(0,r*s+2*r*r),tag:'geo-patron-cone',msg:'Il n\'y a qu\'<b>un</b> disque de base.',w:['r = '+r,'A = '+kPi(r*s)+' + 2 × '+kPi(r*r)+' = '+kPi(r*s+2*r*r)+u2]},
      {v:pib(0,2*r*s+r*r),tag:'geo-aire-pi',msg:'L\'aire latérale vaut π × r × s (et non 2π × r × s).',w:['r = '+r,'A = 2π × '+r+' × '+s+' + π × '+r+'² = '+kPi(2*r*s+r*r)+u2]}]});
}

/* ----- gc-7b : cercle inscrit dans un triangle rectangle ----- */
function genInscritR(){
  const T=tripleK(30), a=T[0], b=T[1], c=T[2], r=(a+b-c)/2, ask=pick(['rayon','aire']), u=uP(), u2=' '+u+'²';
  const svg=figure([[0,0],[a,b]],f=>{
    const C_=f([0,0]), A_=f([a,0]), B_=f([0,b]), I=f([r,r]), ctr=f([a/3,b/3]);
    let out=g.poly([C_,A_,B_],'g-hl')+g.circle(I,r*f.s,'g-hole')+g.dot(I)+g.right(C_,A_,B_,11);
    out+=g.vert(C_,'C',ctr,13)+g.vert(A_,'A',ctr,13)+g.vert(B_,'B',ctr,13)+g.len(C_,A_,String(a),ctr,10)+g.len(C_,B_,String(b),ctr,10)+g.len(A_,B_,String(c),ctr,10);
    return out;
  },'Triangle ABC rectangle en C avec un cercle inscrit tangent aux trois côtés',{H:230,pad:40});
  const txt='ABC est un triangle rectangle en C tel que CA = «'+a+'» '+u+', CB = «'+b+'» '+u+' et AB = «'+c+'» '+u+'. Un cercle est <b>inscrit</b> dans ce triangle : il est tangent aux trois côtés. ';
  const D1='r = ('+a+' + '+b+' − '+c+') / 2 = '+r;
  const hr=['Les deux tangentes issues d\'un même sommet ont la même longueur. Au sommet C (angle droit), le rayon et les deux tangentes forment un carré de côté r.','Pour r : AB = (CA − r) + (CB − r), donc r = (CA + CB − AB) / 2. (Autre voie : aire du triangle = r × demi-périmètre.)'];
  const s1=stp('Rayon du cercle inscrit','Les segments de tangentes issus de A mesurent '+M(a+' − r')+', ceux issus de B mesurent '+M(b+' − r')+', et le carré en C a pour côté '+M('r')+'. L\'hypoténuse est la somme des deux tangentes :',M(c+' = ('+a+' − r) + ('+b+' − r)'),M(D1)+' '+u+'.');
  if(ask==='rayon'){
    return mkGeo({svg,mode:'num',val:r,unit:u,pow:1,text:txt+'Calcule le <b>rayon</b> du cercle inscrit.',ask:'le rayon du cercle inscrit',placeholder:'r = ...',
      work:['AB = (CA − r) + (CB − r)',c+' = '+a+' + '+b+' − 2r',D1+' '+u],
      steps:[s1,stp('Contrôle','Aire du triangle : '+M(a+' × '+b+' / 2 = '+(a*b/2))+' ; demi-périmètre : '+M('('+a+' + '+b+' + '+c+') / 2 = '+((a+b+c)/2))+'. Rayon = '+M((a*b/2)+' / '+((a+b+c)/2)+' = '+r)+'.')],
      hints:hr,
      mistakes:[{v:a+b-c,tag:'geo-inscrit-triangle',msg:'Tu as obtenu le <b>diamètre</b> : '+M('2r = '+a+' + '+b+' − '+c)+'. Divise par 2.',w:['c = (CA − r) + (CB − r)','r = '+a+' + '+b+' − '+c+' = '+(a+b-c)+' '+u]},
        {v:(a+b+c)/2,tag:'geo-inscrit-triangle',msg:'Le demi-périmètre n\'est pas le rayon : il faut retirer deux fois r à CA + CB pour obtenir AB.',w:['r = ('+a+' + '+b+' + '+c+') / 2 = '+NF((a+b+c)/2)+' '+u]},
        {v:Math.round(a*b/(a+b)*1000)/1000,tag:'geo-inscrit-triangle',msg:'Les tangentes issues de A et de B font intervenir l\'hypoténuse : r = (CA + CB − AB) / 2.',w:['r = '+a+' × '+b+' / ('+a+' + '+b+') = '+NF(Math.round(a*b/(a+b)*1000)/1000)+' '+u]},
        {v:Math.round(c/2*1000)/1000,tag:'geo-hypo-diametre',msg:'C\'est le rayon du cercle <b>circonscrit</b> (hypoténuse / 2), pas du cercle inscrit.',w:['r = '+c+' / 2 = '+NF(c/2)+' '+u]}]});
  }
  return mkGeo({svg,mode:'pi',val:pib(a*b/2,-r*r),unit:u,pow:2,text:txt+'Calcule l\'<b>aire de la surface colorée</b> (le triangle privé du disque). Donne la <b>valeur exacte</b>.',ask:'l\'aire colorée (valeur exacte)',
    placeholder:'r = ...\ntriangle = ...\ndisque = ...\nA = ...',work:[D1,'triangle = '+a+' × '+b+' / 2 = '+(a*b/2),'disque = π × '+r+'² = '+kPi(r*r),'A = '+(a*b/2)+' − '+kPi(r*r)+u2],
    steps:[s1,stp('Aires','Triangle : '+M(a+' × '+b+' / 2 = '+(a*b/2))+'. Disque : '+M('π × '+r+'² = '+kPi(r*r))+'.'),stp('Soustraire',M('A = '+(a*b/2)+' − '+kPi(r*r)+' ≈ '+NF(Math.round((a*b/2-r*r*Math.PI)*100)/100))+' '+u+'².')],
    hints:hr,
    mistakes:[{v:pib(a*b/2,0),tag:'geo-inscrit-triangle',msg:'Tu as oublié de retirer l\'aire du disque inscrit.',w:['A = '+a+' × '+b+' / 2 = '+(a*b/2)+u2]},
      {v:pib(a*b/2,-4*r*r),tag:'geo-inscrit-triangle',msg:'Tu as pris le diamètre ('+(2*r)+') comme rayon : '+M('2r = '+a+' + '+b+' − '+c)+', donc r = '+r+'.',w:['r = '+(a+b-c),'A = '+(a*b/2)+' − π × '+(a+b-c)+'² = '+(a*b/2)+' − '+kPi((a+b-c)*(a+b-c))+u2]},
      {v:pib(a*b,-r*r),tag:'geo-demi',msg:'L\'aire d\'un triangle rectangle est CA × CB / 2 (il manque la division par 2).',w:['A = '+a+' × '+b+' − π × '+r+'² = '+(a*b)+' − '+kPi(r*r)+u2]},
      {v:pib(a*b/2,-c*c/4),tag:'geo-hypo-diametre',msg:'Tu as utilisé le cercle <b>circonscrit</b> (rayon '+NF(c/2)+') au lieu du cercle inscrit.',w:['r = '+c+' / 2','A = '+(a*b/2)+' − π × '+NF(c/2)+'² = '+(a*b/2)+' − '+kPi(c*c/4)+u2]}]});
}

/* ----- gc-7c : triangle rectangle inscrit, hypoténuse = diamètre ----- */
function genHypoDiamR(){
  let T,c,a,b; do{ T=pick(PYTRI); const kk=(T[2]%2===0)?pick([1,2]):pick([2,2,4]); c=T[2]*kk; a=T[0]*kk; b=T[1]*kk; }while(c>40);
  if(Math.random()<0.5){ const t=a; a=b; b=t; }
  const R=c/2, ask=pick(['aire','longueur']), u=uP(), u2=' '+u+'²';
  const svg=figure([[-R,-R],[R,R]],f=>{
    const O=f([0,0]), A_=f([-R,0]), B_=f([R,0]), cx=-R+a*a/c, cy=a*b/c, C_=f([cx,cy]), ctr=f([0,-R*0.3]);
    let out=g.circle(O,R*f.s,'g-f g-hl')+g.poly([A_,B_,C_],'g-hole')+g.dot(O)+g.right(C_,A_,B_,11);
    out+=g.vert(A_,'A',O,13)+g.vert(B_,'B',O,13)+g.vert(C_,'C',O,13)+g.text(vadd(O,[0,14]),'O','g-v')+g.len(A_,C_,String(a),B_,10);
    return out;
  },'Cercle de centre O et de diamètre [AB] ; C est un point du cercle ; le triangle ABC est blanc, les deux segments de disque sont colorés',{H:240,pad:36});
  const txt='[AB] est un diamètre d\'un cercle de rayon «'+R+'» '+u+'. Le point C est un point du cercle tel que AC = «'+a+'» '+u+'. ';
  const D1='AB = 2 × '+R+' = '+c, D2='BC = √('+c+'² − '+a+'²) = '+b;
  const s1=stp('Triangle rectangle','Le côté [AB] est un diamètre : l\'angle inscrit en C est droit (le triangle ABC est rectangle en C). L\'hypoténuse est '+M(D1)+'.'),
    s2=stp('Troisième côté','Pythagore : '+M('BC² = AB² − AC² = '+c+'² − '+a+'² = '+(c*c-a*a))+', donc '+M('BC = '+b)+' '+u+'.');
  if(ask==='aire'){
    return mkGeo({svg,mode:'pi',val:pib(-a*b/2,R*R),unit:u,pow:2,text:txt+'Calcule l\'<b>aire de la partie du disque extérieure au triangle ABC</b> (surface colorée). Donne la <b>valeur exacte</b>.',ask:'l\'aire colorée (valeur exacte)',
      placeholder:'AB = ...\nBC = ...\ntriangle = ...\nA = ...',work:[D1,D2,'triangle = '+a+' × '+b+' / 2 = '+(a*b/2),'disque = π × '+R+'² = '+kPi(R*R),'A = '+kPi(R*R)+' − '+(a*b/2)+u2],
      steps:[s1,s2,stp('Aires','Triangle : '+M(a+' × '+b+' / 2 = '+(a*b/2))+'. Disque : '+M('π × '+R+'² = '+kPi(R*R))+'.'),stp('Soustraire',M('A = '+kPi(R*R)+' − '+(a*b/2)+' ≈ '+NF(Math.round((R*R*Math.PI-a*b/2)*100)/100))+' '+u+'².')],
      hints:['Si un côté d\'un triangle inscrit est un diamètre, le triangle est rectangle (angle inscrit de 90°).','Calcule BC avec Pythagore, puis aire = disque − triangle.'],
      mistakes:[{v:pib(0,R*R),tag:'geo-hypo-diametre',msg:'C\'est l\'aire du disque entier : il faut retirer l\'aire du triangle ABC.',w:['A = π × '+R+'² = '+kPi(R*R)+u2]},
        {v:pib(-a*b,R*R),tag:'geo-demi',msg:'L\'aire du triangle rectangle est AC × BC / 2 (il manque la division par 2).',w:[D1,D2,'A = '+kPi(R*R)+' − '+a+' × '+b+' = '+kPi(R*R)+' − '+(a*b)+u2]},
        {v:pib(-a*b/2,c*c),tag:'geo-rayon',msg:'Le rayon vaut '+R+' : '+c+' est le diamètre.',w:[D1,D2,'A = π × '+c+'² − '+(a*b/2)+' = '+kPi(c*c)+' − '+(a*b/2)+u2]},
        {v:pib(-a*a/2,R*R),tag:'geo-hypo-diametre',msg:'BC n\'est pas égal à AC : calcule BC avec Pythagore ('+M('√('+c+'² − '+a+'²) = '+b)+').',w:['A = '+kPi(R*R)+' − '+a+' × '+a+' / 2 = '+kPi(R*R)+' − '+NF(a*a/2)+u2]}]});
  }
  return mkGeo({svg,mode:'num',val:b,unit:u,pow:1,text:txt+'Calcule la longueur <b>BC</b>.',ask:'la longueur BC',placeholder:'AB = ...\nBC = ...',
    work:[D1,'AC² + BC² = AB²','BC = √('+c+'² − '+a+'²) = '+b+' '+u],
    steps:[s1,s2],
    hints:['Un triangle inscrit dont un côté est un diamètre est rectangle : l\'angle droit est en C.','L\'hypoténuse est [AB] = 2 × rayon. Pythagore : BC² = AB² − AC².'],
    mistakes:[{v:a,tag:'geo-hypo-diametre',msg:'BC n\'est pas égal à AC : calcule BC avec Pythagore dans le triangle rectangle ABC (hypoténuse AB = '+c+').',w:['BC = AC = '+a+' '+u]},
      {v:Math.round(Math.sqrt(c*c+a*a)*1000)/1000,tag:'geo-pyth-cote',msg:'Pour un côté de l\'angle droit, on <b>soustrait</b> : BC² = AB² − AC².',w:['BC = √('+c+'² + '+a+'²) = '+NF(Math.round(Math.sqrt(c*c+a*a)*1000)/1000)+' '+u]},
      {v:c-a,tag:'geo-pyth-somme',msg:'On ne soustrait pas les longueurs : on soustrait les <b>carrés</b> avant de prendre la racine.',w:['BC = '+c+' − '+a+' = '+(c-a)+' '+u]}]});
}

/* ----- gc-7d : surface entre disques tangents ----- */
function genVideDisquesR(){
  const n=pick([4,3]), r=rnd(2,9), ask=pick(['aire','périmètre']), u=uP(), u2=' '+u+'²', SQ3_=Math.sqrt(3);
  let svg;
  if(n===4){
    svg=figure([[-2*r,-2*r],[2*r,2*r]],f=>{
      const C=[[r,r],[-r,r],[-r,-r],[r,-r]], c0=f([0,0]); let out='';
      C.forEach(p=>{ out+=g.circle(f(p),r*f.s,'g-circle'); });
      const M_=[[0,r],[-r,0],[0,-r],[r,0]], Pt=M_.map(f);
      let d=mv(Pt[0]); for(let i=0;i<4;i++){ const Cc=C[(i+1)%4], mid=[Cc[0]*(1-Math.SQRT1_2),Cc[1]*(1-Math.SQRT1_2)]; d+=arcM(Pt[i],Pt[(i+1)%4],f(mid),r*f.s); }
      out+=g.path(d+' Z','g-f g-hl')+C.map(p=>g.dot(f(p))).join('')+g.seg(f([-r,r]),f([0,r]),'g-thin')+g.text(f([-r/2,r*1.2]),String(r),'g-u');
      return out;
    },'Quatre disques de même rayon, tangents deux à deux, dont les centres sont les sommets d\'un carré : la surface entre les disques est colorée',{H:250,pad:20});
  } else {
    svg=figure([[-2*r,-r],[2*r,r*SQ3_+r]],f=>{
      const C=[[-r,0],[r,0],[0,r*SQ3_]], G=[0,r*SQ3_/3]; let out='';
      C.forEach(p=>{ out+=g.circle(f(p),r*f.s,'g-circle'); });
      const Mp=[[0,0],[r/2,r*SQ3_/2],[-r/2,r*SQ3_/2]], P=Mp.map(f), cs=[C[1],C[2],C[0]];
      let d=mv(P[0]); for(let i=0;i<3;i++){ const Cc=cs[i], dv=[G[0]-Cc[0],G[1]-Cc[1]], l=Math.hypot(dv[0],dv[1]), mid=[Cc[0]+r*dv[0]/l,Cc[1]+r*dv[1]/l]; d+=arcM(P[i],P[(i+1)%3],f(mid),r*f.s); }
      out+=g.path(d+' Z','g-f g-hl')+C.map(p=>g.dot(f(p))).join('')+g.seg(f([-r,0]),f([0,0]),'g-thin')+g.text(f([-r/2,-r*0.28]),String(r),'g-u');
      return out;
    },'Trois disques de même rayon, tangents deux à deux, dont les centres sont les sommets d\'un triangle équilatéral : la surface entre les disques est colorée',{H:240,pad:22});
  }
  const txt=(n===4?'Quatre disques de rayon «'+r+'» '+u+' sont tangents deux à deux ; leurs centres sont les sommets d\'un carré. ':'Trois disques de rayon «'+r+'» '+u+' sont tangents deux à deux ; leurs centres sont les sommets d\'un triangle équilatéral. ')+'La surface colorée est la zone comprise entre les disques. ';
  const side=2*r;
  if(n===4){
    const A0=4*r*r, exA=NF(A0)+' − '+kPi(r*r);
    if(ask==='aire'){
      return mkGeo({svg,mode:'pi',exact:exA,val:pib(A0,-r*r),unit:u,pow:2,text:txt+'Calcule son <b>aire</b>. Donne la <b>valeur exacte</b>.',ask:'l\'aire (valeur exacte)',placeholder:'carré = ...\nquarts de disque = ...\nA = ...',
        work:['côté du carré = 2 × '+r+' = '+side,'carré = '+side+'² = '+A0,'4 quarts de disque = π × '+r+'² = '+kPi(r*r),'A = '+exA+u2],
        steps:[stp('Le carré des centres','Deux disques tangents ont leurs centres à la distance '+M('r + r = '+side)+' : le carré a pour côté '+M(side)+' et pour aire '+M(side+'² = '+A0)+'.'),
          stp('Quarts de disque','À chaque sommet, le carré contient un quart de disque de rayon '+M(r)+' (angle de 90°). Les quatre font un disque : '+M('π × '+r+'² = '+kPi(r*r))+'.'),stp('Soustraire',M('A = '+A0+' − '+kPi(r*r)+' ≈ '+NF(Math.round((A0-r*r*Math.PI)*100)/100))+' '+u+'².')],
        hints:['Relie les centres : tu obtiens un carré de côté 2r. La surface cherchée est ce carré privé de quatre quarts de disque.','Quatre quarts de disque de rayon '+r+' = un disque entier.'],
        mistakes:[{v:pib(A0,0),tag:'geo-vide-disques',msg:'Il faut retirer les quatre quarts de disque situés aux sommets du carré.',w:['A = '+side+'² = '+A0+u2]},
          {v:pib(A0,-4*r*r),tag:'geo-vide-disques',msg:'Aux quatre sommets, il y a quatre <b>quarts</b> de disque : ensemble, un seul disque (pas quatre).',w:['A = '+A0+' − 4 × π × '+r+'² = '+A0+' − '+kPi(4*r*r)+u2]},
          {v:pib(r*r,-r*r),tag:'geo-vide-disques',msg:'Le côté du carré des centres est 2r ('+side+') : deux rayons séparent deux centres voisins.',w:['A = '+r+'² − π × '+r+'² = '+(r*r)+' − '+kPi(r*r)+u2]},
          {v:pib(A0,-r*r/2),tag:'geo-aire-pi',msg:'Quatre quarts de disque forment un disque entier : π × '+r+'², pas la moitié.',w:['A = '+A0+' − π × '+r+'² / 2 = '+A0+' − '+kPi(r*r/2)+u2]}]});
    }
    return mkGeo({svg,mode:'pi',val:pib(0,2*r),unit:u,pow:1,text:txt+'Calcule la longueur de son <b>contour</b>. Donne la <b>valeur exacte</b>.',ask:'le contour (valeur exacte)',placeholder:'un arc = ...\nP = ...',
      work:['un arc = 90 / 360 × 2π × '+r+' = '+kPi(r/2),'P = 4 × '+kPi(r/2)+' = '+kPi(2*r)+' '+u],
      steps:[stp('Un arc du contour','Chaque côté courbe est un arc de cercle de rayon '+M(r)+' et d\'angle au centre '+M('90°')+' (angle du carré) : '+M('(90 / 360) × 2π × '+r+' = '+kPi(r/2))+'.'),stp('Quatre arcs',M('P = 4 × '+kPi(r/2)+' = '+kPi(2*r))+' '+u+'.')],
      hints:['Le contour est formé de 4 arcs de cercle de rayon '+r+'.','Chaque arc a un angle au centre de 90° : c\'est le quart du cercle (2πr / 4).'],
      mistakes:[{v:pib(0,4*r),tag:'geo-perim-cote',msg:'Chaque arc vaut le <b>quart</b> du cercle (angle de 90°), pas la moitié.',w:['P = 4 × π × '+r+' = '+kPi(4*r)+' '+u]},
        {v:pib(8*r,2*r),tag:'geo-vide-disques',msg:'Les côtés du carré des centres ne font pas partie du contour de la surface colorée : seuls les 4 arcs le forment.',w:['P = '+kPi(2*r)+' + 4 × '+side+' = '+kPi(2*r)+' + '+(8*r)+' '+u]},
        {v:pib(0,8*r),tag:'geo-perim-cote',msg:'Quatre arcs de 90° font <b>un</b> cercle de longueur 2πr (pas quatre cercles).',w:['P = 4 × 2π × '+r+' = '+kPi(8*r)+' '+u]},
        {v:pib(0,r),tag:'geo-perim-cote',msg:'Il y a quatre arcs (un à chaque sommet du carré).',w:['P = '+kPi(r/2)+' '+u]}]});
  }
  const A0=r*r*SQ3_, exA=kRt(r*r,3)+' − '+kPi(r*r/2);
  if(ask==='aire'){
    return mkGeo({svg,mode:'pi',exact:exA,val:pib(A0,-r*r/2),unit:u,pow:2,text:txt+'Calcule son <b>aire</b>. Donne la <b>valeur exacte</b>.',ask:'l\'aire (valeur exacte)',placeholder:'triangle = ...\nsecteurs = ...\nA = ...',
      work:['côté du triangle = 2 × '+r+' = '+side,'triangle = √3 / 4 × '+side+'² = '+kRt(r*r,3),'3 secteurs de 60° = 3 × π × '+r+'² / 6 = '+kPi(r*r/2),'A = '+exA+u2],
      steps:[stp('Le triangle des centres','Les centres sont à la distance '+M('r + r = '+side)+' : triangle équilatéral de côté '+M(side)+', d\'aire '+M('(√3 / 4) × '+side+'² = '+kRt(r*r,3))+'.'),
        stp('Secteurs','À chaque sommet, le triangle contient un secteur de rayon '+M(r)+' et d\'angle '+M('60°')+' : '+M('(60 / 360) × π × '+r+'² = '+kPi(r*r/6))+'. Les trois : '+M(kPi(r*r/2))+'.'),
        stp('Soustraire',M('A = '+kRt(r*r,3)+' − '+kPi(r*r/2)+' ≈ '+NF(Math.round((A0-r*r*Math.PI/2)*100)/100))+' '+u+'².')],
      hints:['Relie les centres : triangle équilatéral de côté 2r. Aire = triangle − trois secteurs de disque.','Chaque angle d\'un triangle équilatéral vaut 60° : le secteur est 1/6 de disque. Aire d\'un triangle équilatéral de côté c : (√3 / 4) × c².'],
      mistakes:[{v:pib(A0,0),tag:'geo-vide-disques',msg:'Il faut retirer les trois secteurs de disque (un à chaque sommet).',w:['A = '+kRt(r*r,3)+u2]},
        {v:pib(A0,-r*r),tag:'geo-vide-disques',msg:'L\'angle de chaque secteur est 60° : un sixième de disque, soit trois sixièmes = la moitié d\'un disque (pas un disque entier).',w:['A = '+kRt(r*r,3)+' − π × '+r+'² = '+kRt(r*r,3)+' − '+kPi(r*r)+u2]},
        {v:pib(A0/4,-r*r/2),tag:'geo-vide-disques',msg:'Le côté du triangle des centres vaut 2r ('+side+') : deux rayons séparent deux centres voisins.',w:['A = √3 / 4 × '+r+'² − '+kPi(r*r/2)+' = '+kRt(r*r/4,3)+' − '+kPi(r*r/2)+u2]},
        {v:pib(A0,-r*r/3),tag:'geo-vide-disques',msg:'Un secteur de 60° vaut 60/360 = 1/6 du disque : trois secteurs font la moitié du disque.',w:['A = '+kRt(r*r,3)+' − 3 × π × '+r+'² / 9 = '+kRt(r*r,3)+' − '+kPi(r*r/3)+u2]}]});
  }
  return mkGeo({svg,mode:'pi',val:pib(0,r),unit:u,pow:1,text:txt+'Calcule la longueur de son <b>contour</b>. Donne la <b>valeur exacte</b>.',ask:'le contour (valeur exacte)',placeholder:'un arc = ...\nP = ...',
    work:['un arc = 60 / 360 × 2π × '+r+' = '+kPi(r/3),'P = 3 × '+kPi(r/3)+' = '+kPi(r)+' '+u],
    steps:[stp('Un arc du contour','Chaque côté courbe est un arc de rayon '+M(r)+' et d\'angle au centre '+M('60°')+' (angle du triangle équilatéral) : '+M('(60 / 360) × 2π × '+r+' = '+kPi(r/3))+'.'),stp('Trois arcs',M('P = 3 × '+kPi(r/3)+' = '+kPi(r))+' '+u+'.')],
    hints:['Le contour est formé de 3 arcs de cercle de rayon '+r+'.','Chaque arc a un angle au centre de 60° : c\'est le sixième du cercle.'],
    mistakes:[{v:pib(0,2*r),tag:'geo-perim-cote',msg:'Chaque arc vaut le <b>sixième</b> du cercle (angle de 60°), pas le tiers.',w:['P = 3 × (120 / 360) × 2π × '+r+' = '+kPi(2*r)+' '+u]},
      {v:pib(6*r,r),tag:'geo-vide-disques',msg:'Les côtés du triangle des centres ne font pas partie du contour de la surface colorée.',w:['P = '+kPi(r)+' + 3 × '+side+' = '+kPi(r)+' + '+(6*r)+' '+u]},
      {v:pib(0,3*r),tag:'geo-perim-cote',msg:'Un arc de 60° mesure le sixième du cercle (2πr / 6), pas la moitié.',w:['P = 3 × π × '+r+' = '+kPi(3*r)+' '+u]},
      {v:pib(0,r/3),tag:'geo-perim-cote',msg:'Il y a trois arcs (un entre chaque paire de disques).',w:['P = '+kPi(r/3)+' '+u]}]});
}

TOPICS['gm-8a']={kind:'gcomp',level:6,label:'Arbelos : trois demi-cercles',gen:genArbelosR};
TOPICS['gm-8b']={kind:'gcomp',level:6,label:'Octogone et disque inscrit',gen:genOctoR};
TOPICS['gm-8c']={kind:'gcomp',level:6,label:'Plaque, rainure oblongue et perçages',gen:genRainureR};
TOPICS['gm-8d']={kind:'gcomp',level:6,label:'Chemin de largeur constante autour d\'un jardin',gen:genCheminR};
TOPICS['gc-7a']={kind:'gcirc',level:6,label:'Patron d\'un cône : secteur et rayon de base',gen:genPatronConeR};
TOPICS['gc-7b']={kind:'gcirc',level:6,label:'Cercle inscrit dans un triangle rectangle',gen:genInscritR};
TOPICS['gc-7c']={kind:'gcirc',level:6,label:'Triangle rectangle inscrit : hypoténuse = diamètre',gen:genHypoDiamR};
TOPICS['gc-7d']={kind:'gcirc',level:6,label:'Surface entre trois ou quatre disques tangents',gen:genVideDisquesR};
