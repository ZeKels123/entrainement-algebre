'use strict';
/* ===== Géométrie niveau 6 : nouvelles formes composées (rosace, hexagone à pétales, courroie, lunules) ===== */
Object.assign(TAGS,{
  'geo-rosace':{label:'Rosace de demi-disques',tip:'Les demi-disques se recouvrent : les pétales sont comptées deux fois dans la somme des demi-disques. Somme des demi-disques − carré = aire des pétales. Ou : un pétale = 2 × (quart de disque − triangle).'},
  'geo-hexagone':{label:'Hexagone régulier',tip:'Un hexagone régulier de côté a se découpe en 6 triangles équilatéraux de côté a (aire √3/4 × a² chacun). Seuls les arcs forment le contour de la figure complète.'},
  'geo-courroie':{label:'Courroie autour de deux poulies',tip:'Les rayons vers les points de contact sont perpendiculaires à la courroie. Dans le triangle rectangle formé par les centres, l\'hypoténuse vaut d et un côté vaut R − r : la longueur d\'un brin est le troisième côté (pas d), et l\'angle donne les arcs.'},
  'geo-lunule':{label:'Lunules d\'Hippocrate',tip:'Lunules = demi-disques des deux côtés de l\'angle droit + triangle − demi-disque de l\'hypoténuse. Le demi-disque de l\'hypoténuse contient le triangle et les deux segments que les lunules n\'occupent pas.'}
});
/* arc passant par un point intermédiaire (coordonnées d'écran) */
const arcM=(P,Q,Mid,R)=>{ const cr=(Mid[0]-P[0])*(Q[1]-Mid[1])-(Mid[1]-P[1])*(Q[0]-Mid[0]); return ' A'+gf(R)+' '+gf(R)+' 0 0 '+(cr>0?1:0)+' '+gf(Q[0])+' '+gf(Q[1]); };
const dashArc=d=>'<path class="g-l g-dash" fill="none" d="'+d+'"/>';
const SQ3=Math.sqrt(3);

/* ----- rosace de quatre demi-disques dans un carré ----- */
function genRosace(){
  const r=rnd(2,6), Lc=2*r, ask=pick(['aire','périmètre']), u=uP(), r2=r*r;
  const svg=figure([[-r,-r],[r,r]],f=>{
    const O=f([0,0]), C1=f([r,r]), C2=f([-r,r]), C3=f([-r,-r]), C4=f([r,-r]), St=f([0,r]), Sr=f([r,0]), Sl=f([-r,0]), Sb=f([0,-r]), R=r*f.s;
    let out='';
    [[C1,St,Sr],[C2,St,Sl],[C3,Sb,Sl],[C4,Sb,Sr]].forEach(L=>{ out+=g.path(mv(O)+carc(O,L[0],L[1],R)+carc(L[0],O,L[2],R)+' Z','g-f'); });
    out+=outline(mv(C1)+' L'+gf(C2[0])+' '+gf(C2[1])+' L'+gf(C3[0])+' '+gf(C3[1])+' L'+gf(C4[0])+' '+gf(C4[1])+' Z');
    out+=dashArc(mv(C1)+arcM(C1,C2,O,R))+dashArc(mv(C2)+arcM(C2,C3,O,R))+dashArc(mv(C3)+arcM(C3,C4,O,R))+dashArc(mv(C4)+arcM(C4,C1,O,R));
    out+=g.dim(C3,C4,String(Lc),O,10);
    return out;
  },'Carré de côté '+Lc+' avec un demi-disque tracé à l\'intérieur sur chaque côté : les quatre pétales communes sont colorées',{H:250,pad:34});
  const txt='Un carré a pour côté «'+Lc+'» '+u+'. Sur chacun de ses côtés, on trace à l\'<b>intérieur</b> du carré le demi-disque dont ce côté est le diamètre. Les quatre demi-disques se chevauchent : la surface colorée est formée des points couverts par <b>deux</b> demi-disques (quatre <i>pétales</i>). ';
  const D0='r = '+Lc+' / 2 = '+r, u2=' '+u+'²';
  const s1=stp('Rayon des demi-disques','Le diamètre est le côté du carré : '+M(D0)+' '+u+'.');
  if(ask==='aire'){
    const Dp='Pétale = 2 × (π × '+r+'² / 4 − '+r+' × '+r+' / 2) = '+kPi(r2/2)+' − '+r2;
    return mkGeo({svg,mode:'pi',val:pib(-4*r2,2*r2),unit:u,pow:2,text:txt+'Calcule l\'<b>aire</b> de la surface colorée. Donne la <b>valeur exacte</b>.',ask:'l\'aire (valeur exacte)',
      placeholder:'r = ...\nun pétale = ...\nA = ...',work:[D0,Dp,'A = 4 × ('+kPi(r2/2)+' − '+r2+') = '+kPi(2*r2)+' − '+4*r2+u2],
      steps:[s1,stp('Un pétale','Il est formé de deux segments circulaires. Chaque segment = quart de disque − triangle rectangle de côtés '+M(r)+' et '+M(r)+' :',M('π × '+r+'² / 4 − '+r+' × '+r+' / 2 = '+kPi(r2/4)+' − '+NF(r2/2))),
        stp('Quatre pétales',M('A = 4 × 2 × ('+kPi(r2/4)+' − '+NF(r2/2)+') = '+kPi(2*r2)+' − '+4*r2+' ≈ '+NF(Math.round((2*r2*Math.PI-4*r2)*100)/100))+' '+u+'²')],
      hints:['Un pétale est l\'intersection de deux demi-disques : deux segments circulaires symétriques par rapport à la diagonale du carré.','Segment circulaire = quart de disque − triangle rectangle isocèle de côté '+r+'. Autre voie : somme des 4 demi-disques − aire du carré (les demi-disques recouvrent exactement le carré).'],
      mistakes:[{v:pib(0,2*r2),tag:'geo-rosace',msg:'Tu as additionné les quatre demi-disques. Dans cette somme les pétales sont comptées deux fois et le carré entier est couvert : il faut retirer l\'aire du carré ('+4*r2+').',w:[D0,'A = 4 × π × '+r+'² / 2 = '+kPi(2*r2)+u2]},
        {v:pib(-4*r2,4*r2),tag:'geo-rosace',msg:'Chaque demi-disque a pour aire πr²/2 (et non πr²).',w:[D0,'A = 4 × π × '+r+'² − '+4*r2+' = '+kPi(4*r2)+' − '+4*r2+u2]},
        {v:pib(-4*Lc*Lc,2*Lc*Lc),tag:'geo-aire-pi',msg:'Le rayon vaut la moitié du côté ('+r+'), pas le côté entier.',w:['r = '+Lc,'A = 2π × '+Lc+'² − 4 × '+Lc+'² = '+kPi(2*Lc*Lc)+' − '+4*Lc*Lc+u2]},
        {v:pib(-2*r2,r2),tag:'geo-segment',msg:'Un pétale est la réunion de <b>deux</b> segments circulaires : tu en as compté un seul par pétale.',w:[D0,'A = 4 × ('+kPi(r2/4)+' − '+NF(r2/2)+') = '+kPi(r2)+' − '+2*r2+u2]},
        {v:pib(-r2,r2/2),tag:'geo-rosace',msg:'Il y a quatre pétales : tu en as compté un seul.',w:[D0,'A = '+kPi(r2/2)+' − '+r2+u2]}]});
  }
  const Pa=4*r;
  return mkGeo({svg,mode:'pi',val:pib(0,Pa),unit:u,pow:1,text:txt+'Calcule le <b>périmètre</b> de la surface colorée (le contour des quatre pétales). Donne la <b>valeur exacte</b>.',ask:'le périmètre (valeur exacte)',
    placeholder:'r = ...\nun pétale = ...\nP = ...',work:[D0,'Pétale : 2 quarts de cercle = 2 × (2π × '+r+' / 4) = '+kPi(r),'P = 4 × '+kPi(r)+' = '+kPi(Pa)+' '+u],
    steps:[s1,stp('Contour d\'un pétale','Chaque pétale est limité par deux arcs de quart de cercle (angle au centre de 90°) :',M('2 × (90/360) × 2π × '+r+' = '+kPi(r))),stp('Quatre pétales',M('P = 4 × '+kPi(r)+' = '+kPi(Pa))+' '+u)],
    hints:['Le contour d\'un pétale est formé de deux arcs de cercle de rayon '+r+'.','Les extrémités d\'un arc sont un coin du carré et le centre du carré : l\'angle au centre de l\'arc est de 90°.'],
    mistakes:[{v:pib(0,2*r),tag:'geo-rosace',msg:'Un pétale a deux arcs, et il y a quatre pétales : 8 arcs de quart de cercle en tout.',w:[D0,'P = 4 × '+kPi(r/2)+' = '+kPi(2*r)+' '+u]},
      {v:pib(0,8*r),tag:'geo-perim-cote',msg:'Un arc de 90° vaut le quart du cercle (2πr / 4), pas la moitié.',w:[D0,'P = 8 × '+kPi(r)+' = '+kPi(8*r)+' '+u]},
      {v:pib(0,4*Lc),tag:'geo-aire-pi',msg:'Le rayon vaut la moitié du côté ('+r+'), pas le côté entier.',w:['r = '+Lc,'P = 4 × '+kPi(Lc)+' = '+kPi(4*Lc)+' '+u]},
      {v:pib(4*Lc,4*r),tag:'geo-perim-cote',msg:'Le contour de la surface colorée ne comprend pas les côtés du carré.',w:[D0,'P = '+kPi(Pa)+' + 4 × '+Lc+' = '+kPi(Pa)+' + '+4*Lc+' '+u]}]});
}

/* ----- hexagone régulier et six demi-disques ----- */
function genHexFleur(){
  const k=rnd(1,5), a=2*k, ask=pick(['aire','périmètre']), u=uP(), k2=k*k;
  const svg=figure([[-(a+k),-(a+k)],[a+k,a+k]],f=>{
    const V=[0,1,2,3,4,5].map(i=>[a*Math.cos(i*Math.PI/3),a*Math.sin(i*Math.PI/3)]), fs=V.map(p=>f(p)), O=f([0,0]), R=k*f.s;
    let out=g.poly(fs,'');
    for(let i=0;i<6;i++){ const j=(i+1)%6, ang=(i*60+30)*Math.PI/180, mid=[(V[i][0]+V[j][0])/2,(V[i][1]+V[j][1])/2], top=f([mid[0]+k*Math.cos(ang),mid[1]+k*Math.sin(ang)]);
      out+=g.path(mv(fs[i])+arcM(fs[i],fs[j],top,R)+' Z','g-f'); }
    out+=outline(mv(fs[0])+fs.slice(1).map(p=>' L'+gf(p[0])+' '+gf(p[1])).join('')+' Z');
    const m0=[(fs[0][0]+fs[1][0])/2,(fs[0][1]+fs[1][1])/2], dv=vunit(vsub(O,m0));
    out+=g.text(vadd(m0,vmul(dv,13)),String(a),'g-u');
    return out;
  },'Hexagone régulier de côté '+a+' avec un demi-disque tracé à l\'extérieur sur chaque côté',{H:270,pad:22});
  const txt='Un hexagone régulier a pour côté «'+a+'» '+u+'. Sur chacun de ses côtés, on trace à l\'<b>extérieur</b> le demi-disque dont ce côté est le diamètre. ';
  const D0='r = '+a+' / 2 = '+k, u2=' '+u+'²';
  const s1=stp('Rayon des demi-disques','Le diamètre d\'un demi-disque est un côté de l\'hexagone : '+M(D0)+' '+u+'.');
  if(ask==='aire'){
    const hex=6*k2, exact=kPi(3*k2)+' + '+kRt(6*k2,3);
    return mkGeo({svg,mode:'pi',exact,val:pib(6*k2*SQ3,3*k2),unit:u,pow:2,text:txt+'Calcule l\'<b>aire</b> de la figure colorée (hexagone et demi-disques). Donne la <b>valeur exacte</b>.',ask:'l\'aire (valeur exacte)',
      placeholder:'triangle équilatéral = ...\nhexagone = ...\ndemi-disques = ...\nA = ...',
      work:[D0,'T = √3 / 4 × '+a+'² = '+kRt(k2,3),'H = 6 × '+kRt(k2,3)+' = '+kRt(6*k2,3),'D = 6 × π × '+k+'² / 2 = '+kPi(3*k2),'A = '+kRt(6*k2,3)+' + '+kPi(3*k2)+u2],
      steps:[s1,stp('Aire de l\'hexagone','Il se découpe en 6 triangles équilatéraux de côté '+M(a)+', d\'aire '+M('(√3 / 4) × '+a+'² = '+kRt(k2,3))+' :',M('H = 6 × '+kRt(k2,3)+' = '+kRt(6*k2,3))),
        stp('Aire des 6 demi-disques',M('6 × π × '+k+'² / 2 = '+kPi(3*k2))),stp('Aire totale',M('A = '+kRt(6*k2,3)+' + '+kPi(3*k2)+' ≈ '+NF(Math.round((6*k2*SQ3+3*k2*Math.PI)*100)/100))+' '+u+'²')],
      hints:['Aire = hexagone + 6 demi-disques.','Un triangle équilatéral de côté c a pour aire (√3 / 4) × c². L\'hexagone régulier en contient 6.'],
      mistakes:[{v:pib(0,3*k2),tag:'geo-hexagone',msg:'Tu as oublié l\'hexagone : la surface colorée comprend aussi la partie centrale.',w:[D0,'A = 6 × π × '+k+'² / 2 = '+kPi(3*k2)+u2]},
        {v:pib(6*k2*SQ3,0),tag:'geo-hexagone',msg:'Tu as oublié les six demi-disques.',w:[D0,'A = 6 × '+kRt(k2,3)+' = '+kRt(6*k2,3)+u2]},
        {v:pib(k2*SQ3,3*k2),tag:'geo-hexagone',msg:'L\'hexagone contient 6 triangles équilatéraux : il faut multiplier par 6.',w:[D0,'A = '+kRt(k2,3)+' + '+kPi(3*k2)+u2]},
        {v:pib(6*k2*SQ3,6*k2),tag:'geo-aire-pi',msg:'Un demi-disque a pour aire πr²/2 (et non πr²).',w:[D0,'A = '+kRt(6*k2,3)+' + 6 × π × '+k+'² = '+kRt(6*k2,3)+' + '+kPi(6*k2)+u2]},
        {v:pib(6*a*a*SQ3/4*2/3*0+a*a*SQ3*1.5,12*k2),tag:'geo-aire-pi',msg:'Le rayon d\'un demi-disque vaut la moitié du côté ('+k+'), pas le côté entier.',w:['r = '+a,'A = '+kRt(6*k2,3)+' + 6 × π × '+a+'² / 2 = '+kRt(6*k2,3)+' + '+kPi(12*k2)+u2]}].filter(m=>m.v.a!==1.5*a*a*SQ3||true)});
  }
  return mkGeo({svg,mode:'pi',val:pib(0,6*k),unit:u,pow:1,text:txt+'Calcule le <b>périmètre</b> de la figure colorée. Donne la <b>valeur exacte</b>.',ask:'le périmètre (valeur exacte)',
    placeholder:'un demi-cercle = ...\nP = ...',work:[D0,'Un demi-cercle : π × '+a+' / 2 = '+kPi(k),'P = 6 × '+kPi(k)+' = '+kPi(6*k)+' '+u],
    steps:[s1,stp('Contour','Le contour est formé des six demi-cercles ; les côtés de l\'hexagone sont à l\'intérieur de la figure, ils ne comptent pas.'),stp('Un demi-cercle',M('π × '+a+' / 2 = '+kPi(k))+' '+u),stp('Périmètre',M('P = 6 × '+kPi(k)+' = '+kPi(6*k))+' '+u)],
    hints:['Seuls les six arcs de demi-cercle forment le bord de la figure.','Longueur d\'un demi-cercle de diamètre d : π × d / 2.'],
    mistakes:[{v:pib(6*a,6*k),tag:'geo-perim-cote',msg:'Les côtés de l\'hexagone sont à l\'intérieur de la figure : ils ne font pas partie du contour.',w:[D0,'P = '+kPi(6*k)+' + 6 × '+a+' = '+kPi(6*k)+' + '+6*a+' '+u]},
      {v:pib(0,12*k),tag:'geo-perim-cote',msg:'Un demi-cercle vaut πr (la moitié de 2πr), pas 2πr.',w:[D0,'P = 6 × 2π × '+k+' = '+kPi(12*k)+' '+u]},
      {v:pib(0,3*k),tag:'geo-perim-cote',msg:'Il y a six demi-cercles (un par côté) : tu en as compté trois.',w:[D0,'P = 3 × '+kPi(k)+' = '+kPi(3*k)+' '+u]},
      {v:pib(0,6*a),tag:'geo-aire-pi',msg:'Le rayon vaut la moitié du côté ('+k+'), pas le côté entier.',w:['r = '+a,'P = 6 × '+kPi(a)+' = '+kPi(6*a)+' '+u]}]});
}

/* ----- courroie autour de deux poulies (centres distants de 2(R − r)) ----- */
function genCourroie(){
  const r=pick([1,2,3,4]), k=pick([2,3,4]), R=r+k, d=2*k, ask=pick(['longueur','aire']), u=uP(), t3=k*SQ3;
  const svg=figure([[-R,-R],[d+r,R]],f=>{
    const c1=f([0,0]), c2=f([d,0]), c60=0.5, s60=SQ3/2;
    const T1=f([R*c60,R*s60]), T1b=f([R*c60,-R*s60]), T2=f([d+r*c60,r*s60]), T2b=f([d+r*c60,-r*s60]);
    const Rs=R*f.s, rs=r*f.s;
    const belt=mv(T1)+' L'+gf(T2[0])+' '+gf(T2[1])+' A'+gf(rs)+' '+gf(rs)+' 0 0 1 '+gf(T2b[0])+' '+gf(T2b[1])+' L'+gf(T1b[0])+' '+gf(T1b[1])+' A'+gf(Rs)+' '+gf(Rs)+' 0 1 1 '+gf(T1[0])+' '+gf(T1[1])+' Z';
    let out=g.path(belt,ask==='aire'?'g-f':'g-f g-hole')+'<path class="g-l g-thick" fill="none" d="'+belt+'"/>';
    out+=g.seg(c1,c2,'g-dash')+g.seg(c1,T1,'g-thin')+g.seg(c2,T2,'g-thin')+g.dot(c1)+g.dot(c2);
    out+=g.text(vadd(vmid(c1,T1),[-9,-10]),String(R),'g-u2')+g.text(vadd(vmid(c2,T2),[-9,-8]),String(r),'g-u2')+g.text(vadd(vmid(c1,c2),[0,15]),String(d),'g-v');
    return out;
  },'Courroie entourant deux poulies de rayons '+R+' et '+r+' dont les centres sont distants de '+d,{H:230,pad:24});
  const txt='Une courroie entoure deux poulies de <b>rayons «'+R+'» '+u+' et «'+r+'» '+u+'</b>, dont les centres sont distants de <b>«'+d+'» '+u+'</b>. Les deux brins droits sont tangents aux deux poulies. ';
  const D1='R − r = '+R+' − '+r+' = '+k, D2='sin φ = (R − r) / d = '+k+' / '+d+' = 1/2, donc φ = 30°', D3='angles des arcs : 180° + 60° = 240° (grande poulie) et 180° − 60° = 120° (petite)', D4='t = √('+d+'² − '+k+'²) = '+kRt(k,3);
  const s1=stp('Triangle rectangle des centres','Les rayons vers les points de contact sont perpendiculaires aux brins : on obtient un triangle rectangle d\'hypoténuse '+M(d)+' (distance des centres) et de côté '+M(D1)+'.'), s2=stp('Angles','Le côté '+M(k)+' est la moitié de l\'hypoténuse '+M(d)+' : angle de '+M('30°')+' entre les centres et le brin. Les arcs mesurent '+M('240°')+' (grande poulie) et '+M('120°')+' (petite poulie).'), s3=stp('Longueur d\'un brin','Troisième côté du triangle rectangle : '+M(D4)+' '+u+'.');
  const hints=['Trace le segment qui joint le centre de la petite poulie au rayon de la grande, parallèlement au brin : tu obtiens un triangle rectangle de côtés R − r, t (longueur d\'un brin) et d.','Quand le côté opposé à l\'angle vaut la moitié de l\'hypoténuse, l\'angle vaut 30°. L\'arc de la grande poulie vaut 180° + 60°, celui de la petite 180° − 60°.'];
  if(ask==='longueur'){
    const N=4*R+2*r, exact=fr3(N)+' + '+kRt(2*k,3);
    return mkGeo({svg,mode:'pi',exact,val:pib(2*k*SQ3,N/3),unit:u,pow:1,text:txt+'Calcule la <b>longueur de la courroie</b>. Donne la <b>valeur exacte</b>.',ask:'la longueur de la courroie (valeur exacte)',
      placeholder:'R − r = ...\nbrin = ...\narc grande poulie = ...\narc petite poulie = ...\nL = ...',work:[D1,D2,D3,D4,'A1 = 240/360 × 2π × '+R+' = '+fr3(4*R),'A2 = 120/360 × 2π × '+r+' = '+fr3(2*r),'L = 2 × '+kRt(k,3)+' + '+fr3(4*R)+' + '+fr3(2*r)+' = '+exact+' '+u],
      steps:[s1,s2,s3,stp('Arcs',M('(240/360) × 2π × '+R+' = '+fr3(4*R))+' et '+M('(120/360) × 2π × '+r+' = '+fr3(2*r))),stp('Longueur totale',M('L = 2 × '+kRt(k,3)+' + '+fr3(4*R)+' + '+fr3(2*r)+' = '+exact+' ≈ '+NF(Math.round((2*k*SQ3+N/3*Math.PI)*100)/100))+' '+u)],
      hints,
      mistakes:[{v:pib(0,N/3),tag:'geo-courroie',msg:'Les deux brins droits font aussi partie de la courroie : ajoute 2 × '+kRt(k,3)+'.',w:[D1,D3,'L = '+fr3(4*R)+' + '+fr3(2*r)+' = '+fr3(N)+' '+u]},
        {v:pib(2*d,N/3),tag:'geo-courroie',msg:'Un brin ne mesure pas '+d+' (distance des centres) : c\'est le troisième côté du triangle rectangle, '+kRt(k,3)+'.',w:[D1,D3,'L = 2 × '+d+' + '+fr3(N)+' = '+fr3(N)+' + '+2*d+' '+u]},
        {v:pib(2*k*SQ3,(2*R+4*r)/3),tag:'geo-courroie',msg:'Les arcs sont inversés : c\'est la grande poulie qui est enroulée sur 240° et la petite sur 120°.',w:[D1,'A1 = 120/360 × 2π × '+R+' = '+fr3(2*R),'A2 = 240/360 × 2π × '+r+' = '+fr3(4*r),'L = '+kRt(2*k,3)+' + '+fr3(2*R+4*r)+' '+u]},
        {v:pib(2*k*SQ3,R+r),tag:'geo-courroie',msg:'Les arcs ne sont pas des demi-cercles : l\'angle vaut 180° ± 60° (240° et 120°).',w:[D1,'A = π × '+R+' + π × '+r+' = '+kPi(R+r),'L = '+kRt(2*k,3)+' + '+kPi(R+r)+' '+u]},
        {v:pib(k*SQ3,N/3),tag:'geo-courroie',msg:'Il y a deux brins droits (en haut et en bas) : tu n\'en as compté qu\'un.',w:[D1,D4,'L = '+kRt(k,3)+' + '+fr3(N)+' '+u]}]});
  }
  const N2=2*R*R+r*r, exact=fr3(N2)+' + '+kRt((R+r)*k,3), u2=' '+u+'²;'.slice(0,0)+'';
  return mkGeo({svg,mode:'pi',exact,val:pib((R+r)*k*SQ3,N2/3),unit:u,pow:2,text:txt+'Calcule l\'<b>aire</b> de la surface délimitée par la courroie. Donne la <b>valeur exacte</b>.',ask:'l\'aire (valeur exacte)',
    placeholder:'t = ...\nsecteur de la grande poulie = ...\nsecteur de la petite poulie = ...\ntrapèzes = ...\nA = ...',
    work:[D1,D2,D4,'S1 = 240/360 × π × '+R+'² = '+fr3(2*R*R),'S2 = 120/360 × π × '+r+'² = '+fr3(r*r),'T = 2 × ('+R+' + '+r+') × '+kRt(k,3)+' / 2 = '+kRt((R+r)*k,3),'A = '+exact+' '+u+'²'],
    steps:[s1,s2,s3,stp('Découpage de la surface','Deux secteurs (240° et 120°) et deux trapèzes rectangles de bases '+M(R)+' et '+M(r)+' et de hauteur '+M(kRt(k,3))+' (entre les centres et les points de contact).'),
      stp('Secteurs',M('(240/360) × π × '+R+'² = '+fr3(2*R*R))+' et '+M('(120/360) × π × '+r+'² = '+fr3(r*r))),stp('Trapèzes',M('2 × (('+R+' + '+r+') / 2) × '+kRt(k,3)+' = '+kRt((R+r)*k,3))),
      stp('Aire totale',M('A = '+exact+' ≈ '+NF(Math.round(((R+r)*k*SQ3+N2/3*Math.PI)*100)/100))+' '+u+'²')],
    hints:['Découpe la surface en deux secteurs circulaires (un par poulie) et deux trapèzes rectangles (entre les centres et les points de contact).',hints[1]],
    mistakes:[{v:pib(0,N2/3),tag:'geo-courroie',msg:'Il manque les deux trapèzes situés entre les poulies.',w:[D1,'A = '+fr3(2*R*R)+' + '+fr3(r*r)+' = '+fr3(N2)+' '+u+'²']},
      {v:pib(2*(R+r)*k*SQ3,N2/3),tag:'geo-demi',msg:'L\'aire d\'un trapèze vaut (base1 + base2) × hauteur / 2 : tu as oublié de diviser par 2.',w:[D1,'T = 2 × ('+R+' + '+r+') × '+kRt(k,3)+' = '+kRt(2*(R+r)*k,3),'A = '+fr3(N2)+' + '+kRt(2*(R+r)*k,3)+' '+u+'²']},
      {v:pib((R+r)*k*SQ3,(R*R+2*r*r)/3),tag:'geo-courroie',msg:'Les secteurs sont inversés : 240° pour la grande poulie, 120° pour la petite.',w:[D1,'S1 = 120/360 × π × '+R+'² = '+fr3(R*R),'S2 = 240/360 × π × '+r+'² = '+fr3(2*r*r),'A = '+fr3(R*R+2*r*r)+' + '+kRt((R+r)*k,3)+' '+u+'²']},
      {v:pib((R+r)*k*SQ3,(R*R+r*r)/2),tag:'geo-courroie',msg:'Les secteurs ne sont pas des demi-disques : l\'angle vaut 180° ± 60° (240° et 120°).',w:[D1,'S = π × '+R+'² / 2 + π × '+r+'² / 2 = '+kPi((R*R+r*r)/2),'A = '+kPi((R*R+r*r)/2)+' + '+kRt((R+r)*k,3)+' '+u+'²']},
      {v:pib((R+r)*d,N2/3),tag:'geo-courroie',msg:'La hauteur du trapèze n\'est pas la distance des centres '+d+' : c\'est la longueur d\'un brin, '+kRt(k,3)+'.',w:[D1,'T = 2 × ('+R+' + '+r+') × '+d+' / 2 = '+(R+r)*d,'A = '+fr3(N2)+' + '+(R+r)*d+' '+u+'²']}]});
}

/* ----- lunules d'Hippocrate ----- */
function genLunules(){
  const T_=pick([[6,8,10],[12,16,20],[18,24,30],[10,24,26],[16,30,34]]), sw=Math.random()<0.5, a=sw?T_[1]:T_[0], b=sw?T_[0]:T_[1], c=T_[2], ask=pick(['aire','périmètre']), u=uP(), ra=a/2, rb=b/2, rc=c/2;
  const svg=figure([[-b/2-1,-a/2-1],[a+1,b+1]],f=>{
    const C=f([0,0]), A=f([a,0]), B=f([0,b]), ma=f([a/2,-a/2]), mb=f([-b/2,b/2]), Ra=ra*f.s, Rb=rb*f.s, Rc=rc*f.s;
    let out=g.path(mv(C)+arcM(C,A,ma,Ra)+' Z','g-f')+g.path(mv(B)+arcM(B,C,mb,Rb)+' Z','g-f');
    out+=g.path(mv(A)+arcM(A,B,C,Rc)+' Z','g-f g-hole');
    out+=outline(mv(C)+arcM(C,A,ma,Ra))+outline(mv(B)+arcM(B,C,mb,Rb))+outline(mv(A)+arcM(A,B,C,Rc));
    out+=outline(mv(C)+' L'+gf(A[0])+' '+gf(A[1])+' L'+gf(B[0])+' '+gf(B[1])+' Z')+g.right(C,A,B,10);
    out+=g.text(vadd(vmid(C,A),[0,-12]),String(a),'g-u')+g.text(vadd(vmid(C,B),[12,0]),String(b),'g-u')+g.text(vadd(vmid(A,B),[10,-8]),'c','g-v');
    return out;
  },'Triangle rectangle de côtés '+a+' et '+b+', avec un demi-disque sur chaque côté : deux lunules colorées',{H:260,pad:22});
  const txt='Un triangle rectangle a pour côtés de l\'angle droit «'+a+'» '+u+' et «'+b+'» '+u+'. On trace un demi-disque ayant pour diamètre chacun de ses côtés : ceux des côtés de l\'angle droit à l\'<b>extérieur</b> du triangle, celui de l\'hypoténuse du côté du triangle. Les deux <i>lunules</i> colorées sont les parties des petits demi-disques situées hors du grand. ';
  const Dc='c² = '+a+'² + '+b+'² = '+(a*a+b*b)+', c = '+c, u2=' '+u+'²';
  const s1=stp('Hypoténuse','Pythagore : '+M(Dc)+' '+u+'. Le demi-disque de l\'hypoténuse a pour rayon '+M(c+' / 2 = '+rc)+'.');
  if(ask==='aire'){
    const Sa=kPi(ra*ra/2), Sb=kPi(rb*rb/2), Sc=kPi(rc*rc/2), ab=a*b/2;
    return mkGeo({svg,mode:'pi',val:pib(ab,0),unit:u,pow:2,text:txt+'Calcule l\'<b>aire</b> des deux lunules.',ask:'l\'aire des deux lunules',
      placeholder:'c = ...\ndemi-disques = ...\nA = ...',
      work:[Dc,'S1 = π × '+ra+'² / 2 = '+Sa,'S2 = π × '+rb+'² / 2 = '+Sb,'S3 = π × '+rc+'² / 2 = '+Sc,'T = '+a+' × '+b+' / 2 = '+ab,'A = S1 + S2 + T − S3 = '+ab+u2],
      steps:[s1,stp('Les trois demi-disques',M('π × '+ra+'² / 2 = '+Sa)+', '+M('π × '+rb+'² / 2 = '+Sb)+' et '+M('π × '+rc+'² / 2 = '+Sc)),
        stp('Relation entre les surfaces','Le grand demi-disque contient le triangle et deux segments circulaires. Les lunules sont les petits demi-disques privés de ces segments : lunules = petits demi-disques + triangle − grand demi-disque.',M('T = '+a+' × '+b+' / 2 = '+ab)),
        stp('Aire des lunules',M('A = '+Sa+' + '+Sb+' + '+ab+' − '+Sc+' = '+ab)+u2+' (les π se compensent : l\'aire des lunules est égale à celle du triangle)')],
      hints:['Le grand demi-disque (hypoténuse) est formé du triangle et de deux segments circulaires. Chaque lunule = petit demi-disque − un de ces segments.','Écris : lunules = demi-disque a + demi-disque b + triangle − demi-disque c. Utilise c² = a² + b².'],
      mistakes:[{v:pib(0,0),tag:'geo-lunule',msg:'Tu as oublié le triangle : le grand demi-disque contient le triangle, que les lunules ne retirent pas.',w:[Dc,'A = '+Sa+' + '+Sb+' − '+Sc+' = 0'+u2]},
        {v:pib(a*b,0),tag:'geo-demi',msg:'L\'aire d\'un triangle rectangle vaut (côté × côté) / 2.',w:[Dc,'T = '+a+' × '+b+' = '+a*b,'A = '+a*b+u2]},
        {v:pib(ab,(a*a+b*b+c*c)/8),tag:'geo-lunule',msg:'Le demi-disque de l\'hypoténuse se soustrait (il contient le triangle et les segments qui ne font pas partie des lunules).',w:[Dc,'A = '+Sa+' + '+Sb+' + '+Sc+' + '+ab+' = '+kPi((a*a+b*b+c*c)/8)+' + '+ab+u2]},
        {v:pib(ab,(a*a+b*b-c*c)/4),tag:'geo-aire-pi',msg:'Un demi-disque a pour aire πr²/2 avec r = diamètre / 2 : tu as pris le diamètre comme rayon ou oublié la division par 2.',w:[Dc,'S = π × '+a+'² / 4 ...']},
        {v:pib(0,(a*a+b*b)/8),tag:'geo-lunule',msg:'Tu as seulement calculé les deux petits demi-disques : les lunules sont ces demi-disques privés des segments du grand cercle.',w:[Dc,'A = '+Sa+' + '+Sb+' = '+kPi((a*a+b*b)/8)+u2]}]});
  }
  const P=(a+b+c)/2;
  return mkGeo({svg,mode:'pi',val:pib(0,P),unit:u,pow:1,text:txt+'Calcule le <b>périmètre</b> des deux lunules (somme des deux contours). Donne la <b>valeur exacte</b>.',ask:'le périmètre des deux lunules (valeur exacte)',
    placeholder:'c = ...\narcs des petits demi-cercles = ...\narcs du grand cercle = ...\nP = ...',work:[Dc,'P1 = π × '+a+' / 2 + π × '+b+' / 2 = '+kPi((a+b)/2),'P2 = π × '+c+' / 2 = '+kPi(c/2),'P = '+kPi((a+b)/2)+' + '+kPi(c/2)+' = '+kPi(P)+' '+u],
    steps:[stp('Hypoténuse','Pythagore : '+M(Dc)+' '+u+'.'),stp('Contour des lunules','Chaque lunule est limitée par l\'arc d\'un petit demi-cercle et par un arc du grand cercle. Les deux arcs du grand cercle forment ensemble le demi-cercle de diamètre '+M(c)+'.'),
      stp('Longueurs',M('π × '+a+' / 2 + π × '+b+' / 2 = '+kPi((a+b)/2))+' et '+M('π × '+c+' / 2 = '+kPi(c/2))),stp('Périmètre',M('P = '+kPi((a+b)/2)+' + '+kPi(c/2)+' = '+kPi(P))+' '+u)],
    hints:['Le contour des lunules est formé des arcs des deux petits demi-cercles et des arcs du grand cercle situés entre les sommets du triangle.','Les deux arcs du grand cercle, mis bout à bout, forment le demi-cercle de diamètre l\'hypoténuse.'],
    mistakes:[{v:pib(0,(a+b)/2),tag:'geo-lunule',msg:'Chaque lunule a aussi un bord intérieur : l\'arc du grand cercle (au total un demi-cercle de diamètre '+c+').',w:[Dc,'P = '+kPi((a+b)/2)+' '+u]},
      {v:pib(a+b+c,P),tag:'geo-perim-cote',msg:'Les côtés du triangle ne font pas partie du contour des lunules.',w:[Dc,'P = '+kPi(P)+' + '+(a+b+c)+' '+u]},
      {v:pib(0,a+b+c),tag:'geo-perim-cote',msg:'Un demi-cercle de diamètre d vaut π × d / 2 (et non π × d).',w:[Dc,'P = π × '+a+' + π × '+b+' + π × '+c+' = '+kPi(a+b+c)+' '+u]},
      {v:pib(0,(a+b)/2+c),tag:'geo-perim-cote',msg:'Le demi-cercle de diamètre '+c+' vaut π × '+c+' / 2, pas '+c+'.',w:[Dc,'P = '+kPi((a+b)/2)+' + '+c+' '+u]}]});
}

TOPICS['gm-6f']={kind:'gcomp',level:6,label:'Rosace de quatre demi-disques',gen:genRosace};
TOPICS['gm-6g']={kind:'gcomp',level:6,label:'Hexagone et demi-disques',gen:genHexFleur};
TOPICS['gm-6h']={kind:'gcomp',level:6,label:'Courroie autour de deux poulies',gen:genCourroie};
TOPICS['gm-6i']={kind:'gcomp',level:6,label:'Lunules d\'Hippocrate',gen:genLunules};

/* ===== Géométrie niveau 6 : figures à encoches et bosses (trapèze, maison, triangle rectangle) ===== */
const abPi=(a,b)=>b===0?NF(a):(a===0?kPi(b):NF(a)+(b<0?' − ':' + ')+kPi(Math.abs(b)));
const LQ=P=>' L'+gf(P[0])+' '+gf(P[1]);
const rad2=(r)=>String(r);

/* ----- trapèze rectangle : encoche en bas, bosse en haut ----- */
function genTrapeze(){
  const ask=pick(['aire','périmètre']), u=uP();
  let p,H,s,T,B,r1,r2;
  for(let i=0;i<500;i++){
    [p,H,s]=pick([[3,4,5],[4,3,5],[5,12,13],[6,8,10],[8,6,10],[9,12,15],[12,9,15]]);
    r2=rnd(1,3); r1=rnd(1,Math.min(3,H-1)); T=rnd(2*r2+2,2*r2+5); B=T+p;
    if(r1!==r2&&B/2-r1>=0.6&&H*B/(2*s)>=r1+0.5) break;
  }
  const svg=figure([[-1,-0.8],[B+1.2,H+r2+1.4]],f=>{
    const sc=f.s, F=q=>f(q), O=F([0,0]), Bp=F([B,0]), Tp=F([T,H]), Lp=F([0,H]), c1=F([B/2,0]), c2=F([T/2,H]), ce=F([B/2,H/2]);
    const n1a=F([B/2-r1,0]), n1b=F([B/2+r1,0]), t1=F([T/2+r2,H]), t2=F([T/2-r2,H]);
    const d=mv(O)+LQ(n1a)+arcM(n1a,n1b,F([B/2,r1]),r1*sc)+LQ(Bp)+LQ(Tp)+LQ(t1)+arcM(t1,t2,F([T/2,H+r2]),r2*sc)+LQ(Lp)+' Z';
    let out=g.path(d,'g-f')+g.right(O,Lp,Bp,10)+g.right(Lp,O,Tp,10);
    const e1=F([B/2,r1]), e2=F([T/2,H+r2]);
    out+=g.seg(c1,e1,'g-thin')+g.seg(c2,e2,'g-thin')+g.dot(c1)+g.dot(c2)+g.text(vadd(vmid(c1,e1),[8,0]),String(r1),'g-u2')+g.text(vadd(vmid(c2,e2),[8,0]),String(r2),'g-u2');
    [O,Bp,Tp,Lp].forEach(q=>{ out+=g.dot(q); });
    out+=g.len(O,Bp,String(B),ce,10)+g.dim(Lp,Tp,String(T),ce,r2*sc+14);
    out+= ask==='aire'?g.len(Bp,Tp,String(s),ce,10):g.len(O,Lp,String(H),ce,10);
    return out;
  },'Trapèze rectangle avec une encoche en demi-cercle de rayon '+r1+' sur la base et une bosse en demi-cercle de rayon '+r2+' sur le côté du haut',{H:250,pad:30});
  const intro='La surface colorée est un trapèze rectangle (angles droits à gauche) auquel on a <b>retiré</b> une encoche en demi-cercle de rayon «'+r1+'» sur la base et <b>ajouté</b> une bosse en demi-cercle de rayon «'+r2+'» sur le côté du haut. Les centres des demi-cercles sont au milieu des côtés. Les longueurs sont en '+u+'. ';
  const d_=B-T, At=(B+T)*H/2, bA=(r2*r2-r1*r1)/2, u2=' '+u+'²';
  const sAB='B − T = '+B+' − '+T+' = '+d_;
  if(ask==='aire'){
    const WH=[sAB,'H = √('+s+'² − '+d_+'²) = '+H], WA='A₁ = ('+B+' + '+T+') × '+H+' / 2 = '+NF(At);
    const WD='bosse = π × '+r2+'² / 2 = '+kPi(r2*r2/2), WE='encoche = π × '+r1+'² / 2 = '+kPi(r1*r1/2);
    const Wf=WH.concat([WA,WD,WE]), fin=abPi(At,bA);
    const mk=(v,tag,msg,w)=>({v,tag,msg,w});
    return mkGeo({svg,mode:'pi',val:pib(At,bA),unit:u,pow:2,
      text:intro+'La hauteur du trapèze n\'est pas donnée. Calcule l\'<b>aire</b> de la surface colorée. Donne la <b>valeur exacte</b>.',ask:'l\'aire (valeur exacte)',
      placeholder:'hauteur = ...\ntrapèze = ...\ndemi-disques = ...\nA = ...',
      work:Wf.concat(['A = '+NF(At)+' + '+kPi(r2*r2/2)+' − '+kPi(r1*r1/2)+' = '+fin+u2]),
      steps:[stp('Hauteur du trapèze','Le côté oblique est l\'hypoténuse d\'un triangle rectangle dont un côté vaut '+M(sAB)+' et l\'autre est la hauteur :',M('H = √('+s+'² − '+d_+'²) = √'+(s*s-d_*d_)+' = '+H)),
        stp('Aire du trapèze',M('A₁ = (B + T) × H / 2 = ('+B+' + '+T+') × '+H+' / 2 = '+NF(At))),
        stp('Bosse et encoche','La bosse s\'ajoute, l\'encoche se retire : '+M('π × '+r2+'² / 2 = '+kPi(r2*r2/2))+' et '+M('π × '+r1+'² / 2 = '+kPi(r1*r1/2))),
        stp('Aire totale',M('A = '+NF(At)+' + '+kPi(r2*r2/2)+' − '+kPi(r1*r1/2)+' = '+fin+' ≈ '+NF(Math.round((At+bA*Math.PI)*100)/100))+' '+u+'²')],
      hints:['Pour trouver la hauteur, trace dans le trapèze un triangle rectangle : son hypoténuse est le côté oblique '+s+' et un côté vaut B − T.','Aire du trapèze : (B + T) × H / 2. Un demi-disque de rayon r a pour aire πr² / 2 : la bosse s\'ajoute, l\'encoche se retire.'],
      mistakes:[mk(pib(At,0),'geo-decomp','Tu as calculé le trapèze seul : il faut ajouter la bosse et retirer l\'encoche.',Wf.concat(['A = '+NF(At)+u2])),
        mk(pib(At,-bA),'geo-decomp','Signe inversé : la bosse ajoute de la surface, l\'encoche en retire.',Wf.concat(['A = '+NF(At)+' − '+kPi(r2*r2/2)+' + '+kPi(r1*r1/2)+u2])),
        mk(pib(At,-(r1*r1+r2*r2)/2),'geo-decomp','La bosse dépasse du trapèze : on l\'ajoute. Seule l\'encoche se retire.',Wf.concat(['A = '+NF(At)+' − '+kPi(r2*r2/2)+' − '+kPi(r1*r1/2)+u2])),
        mk(pib(At,r2*r2-r1*r1),'geo-aire-pi','Un demi-disque a pour aire πr² / 2 (et non πr²).',Wf.concat(['A = '+NF(At)+' + '+kPi(r2*r2)+' − '+kPi(r1*r1)+u2])),
        mk(pib((B+T)*s/2,bA),'geo-pyth-cote','Le côté oblique n\'est pas la hauteur : la hauteur est un côté de l\'angle droit, H = √('+s+'² − '+d_+'²) = '+H+'.',['A₁ = ('+B+' + '+T+') × '+s+' / 2 = '+NF((B+T)*s/2),'A = '+NF((B+T)*s/2)+' + '+kPi(r2*r2/2)+' − '+kPi(r1*r1/2)+u2]),
        mk(pib((B+T)*Math.sqrt(s*s+d_*d_)/2,bA),'geo-pyth-somme','Dans le triangle rectangle, le côté oblique est l\'hypoténuse : H² = '+s+'² − '+d_+'² (et non +).',['H = √('+s+'² + '+d_+'²) = '+NF(Math.round(Math.sqrt(s*s+d_*d_)*1000)/1000),'A₁ = ('+B+' + '+T+') × H / 2 ≈ '+NF(Math.round((B+T)*Math.sqrt(s*s+d_*d_)/2*100)/100)]),
        mk(pib((B+T)*H,bA),'geo-demi','L\'aire d\'un trapèze vaut (B + T) × H / 2 : la division par 2 est oubliée.',[sAB,'H = '+H,'A₁ = ('+B+' + '+T+') × '+H+' = '+NF((B+T)*H)])]});
  }
  const aP=B+H+T+s-2*r1-2*r2, bP=r1+r2, PS='côtés droits : B + H + T = '+B+' + '+H+' + '+T+' = '+(B+H+T);
  const WP=[sAB,'s = √('+d_+'² + '+H+'²) = '+s,PS,'diamètres retirés : '+(2*r1)+' + '+(2*r2)+' = '+(2*r1+2*r2),'demi-cercles : π × '+r1+' + π × '+r2+' = '+kPi(bP)];
  return mkGeo({svg,mode:'pi',val:pib(aP,bP),unit:u,pow:1,
    text:intro+'La longueur du côté oblique n\'est pas donnée. Calcule le <b>périmètre</b> de la surface colorée. Donne la <b>valeur exacte</b>.',ask:'le périmètre (valeur exacte)',
    placeholder:'côté oblique = ...\nsegments = ...\ndemi-cercles = ...\nP = ...',
    work:WP.concat(['P = '+(B+H+T+s)+' − '+(2*r1+2*r2)+' + '+kPi(bP)+' = '+abPi(aP,bP)+' '+u]),
    steps:[stp('Côté oblique','Triangle rectangle de côtés '+M(sAB)+' et '+M('H = '+H)+' :',M('s = √('+d_+'² + '+H+'²) = '+s)),
      stp('Segments du contour','Côtés complets : '+M(B+' + '+H+' + '+T+' + '+s+' = '+(B+H+T+s))+'. Le bord du bas perd le diamètre de l\'encoche ('+2*r1+') et celui du haut perd le diamètre de la bosse ('+2*r2+') : '+M((B+H+T+s)+' − '+(2*r1+2*r2)+' = '+aP)),
      stp('Demi-cercles','Un demi-cercle de rayon r mesure '+M('πr')+' : '+M('π × '+r1+' + π × '+r2+' = '+kPi(bP))),
      stp('Périmètre',M('P = '+abPi(aP,bP)+' ≈ '+NF(Math.round((aP+bP*Math.PI)*100)/100))+' '+u)],
    hints:['Le côté oblique est l\'hypoténuse d\'un triangle rectangle de côtés B − T et H.','Sur la base et sur le haut, le contour suit le demi-cercle à la place du diamètre : retire les diamètres, ajoute πr pour chaque demi-cercle.'],
    mistakes:[{v:pib(aP,0),tag:'geo-perim-cote',msg:'Tu as retiré les diamètres mais oublié les demi-cercles : le contour suit les arcs (πr chacun).',w:WP.slice(0,4).concat(['P = '+(B+H+T+s)+' − '+(2*r1+2*r2)+' = '+aP+' '+u])},
      {v:pib(B+H+T+s,bP),tag:'geo-perim-cote',msg:'Les diamètres ne font plus partie du contour : il faut les retirer des côtés avant d\'ajouter les arcs.',w:[WP[0],WP[1],'P = '+(B+H+T+s)+' + '+kPi(bP)+' '+u]},
      {v:pib(aP,2*bP),tag:'geo-perim-cote',msg:'Ce sont des demi-cercles : πr, pas 2πr.',w:WP.slice(0,4).concat(['cercles entiers : 2π × '+r1+' + 2π × '+r2+' = '+kPi(2*bP),'P = '+aP+' + '+kPi(2*bP)+' '+u])},
      {v:pib(aP,(r1*r1+r2*r2)/2),tag:'geo-aire-pi',msg:'πr² / 2 est l\'aire d\'un demi-disque. Pour la longueur d\'un demi-cercle, on utilise πr.',w:WP.slice(0,4).concat(['demi-cercles : '+kPi(r1*r1/2)+' + '+kPi(r2*r2/2)+' = '+kPi((r1*r1+r2*r2)/2),'P = '+aP+' + '+kPi((r1*r1+r2*r2)/2)+' '+u])},
      {v:pib(aP-s+H+d_,bP),tag:'geo-pyth-somme',msg:'Le côté oblique est l\'hypoténuse : '+s+' = √('+d_+'² + '+H+'²), et non '+d_+' + '+H+'.',w:['s = '+d_+' + '+H+' = '+(d_+H),'P = '+(B+H+T+d_+H)+' − '+(2*r1+2*r2)+' + '+kPi(bP)+' '+u]},
      {v:pib(aP-s,bP),tag:'geo-perim-cote',msg:'Il manque le côté oblique : '+s+' (hypoténuse du triangle rectangle).',w:[PS,'P = '+(B+H+T)+' − '+(2*r1+2*r2)+' + '+kPi(bP)+' '+u]}]});
}

/* ----- maison : toit triangulaire, porte arrondie, fenêtre ronde ----- */
function genMaison(){
  const ask=pick(['aire','périmètre']), u=uP();
  const [a,ht,s]=pick([[3,4,5],[4,3,5],[6,8,10],[5,12,13],[6,8,10]]), w=2*a, h=rnd(4,6), r=rnd(1,Math.min(2,Math.floor((w-2)/2)));
  const dh=rnd(1,h-r-1), inr=a*ht/(a+s), rho=rnd(1,Math.max(1,Math.floor(inr-0.3)));
  const svg=figure([[-1.3,-0.9],[w+(ask==='périmètre'?2.2:1.6),h+ht+0.7]],f=>{
    const sc=f.s, F=q=>f(q), O=F([0,0]), Br=F([w,0]), Rr=F([w,h]), Lw=F([0,h]), Ap=F([a,h+ht]), ce=F([a,h/2]);
    const d1=F([a-r,0]), d2=F([a-r,dh]), d3=F([a+r,dh]), d4=F([a+r,0]), W=F([a,h+inr]);
    const d=mv(O)+LQ(d1)+LQ(d2)+arcM(d2,d3,F([a,dh+r]),r*sc)+LQ(d4)+LQ(Br)+LQ(Rr)+LQ(Ap)+LQ(Lw)+' Z';
    let out=g.path(d,'g-f')+g.circle(W,rho*sc,'g-hole')+g.right(O,Lw,d1,10)+g.right(Br,d4,Rr,10);
    const dc=F([a,dh]);
    out+=g.seg(dc,d3,'g-thin')+g.dot(dc)+g.text(F([a+r/2,dh-0.5]),String(r),'g-u2')+g.text(F([a-r-0.5,dh/2]),String(dh),'g-u2');
    const we=F([a+rho,h+inr]);
    out+=g.seg(W,we,'g-thin')+g.dot(W)+g.text(F([a+rho/2,h+inr+0.5]),String(rho),'g-u2');
    [O,Br,Rr,Lw,Ap].forEach(q=>{ out+=g.dot(q); });
    out+=g.len(O,Br,String(w),ce,10)+g.len(O,Lw,String(h),ce,10);
    out+= ask==='aire'?g.len(Rr,Ap,String(s),ce,10):g.dim(Rr,F([w,h+ht]),String(ht),ce,12);
    return out;
  },'Maison : rectangle surmonté d\'un toit triangulaire, avec une porte à sommet arrondi et une fenêtre ronde dans le pignon',{H:270,pad:26});
  const intro='La façade d\'une maison est un rectangle de largeur «'+w+'» et de hauteur «'+h+'» surmonté d\'un toit triangulaire isocèle (le sommet est au-dessus du milieu de la largeur). La <b>porte</b> (en blanc) est formée d\'un rectangle de hauteur «'+dh+'» et d\'un demi-disque de rayon «'+r+'», centrée sur la largeur. Une <b>fenêtre ronde</b> de rayon «'+rho+'» est percée dans le toit. Longueurs en '+u+'. ';
  const u2=' '+u+'²';
  if(ask==='aire'){
    const aA=w*h+a*ht-2*r*dh, bA=-(r*r/2+rho*rho), Rect=w+' × '+h+' = '+(w*h), Tri=w+' × '+ht+' / 2 = '+(a*ht);
    const Wh='moitié de la base : '+w+' / 2 = '+a, Wh2='hauteur du toit = √('+s+'² − '+a+'²) = '+ht;
    const Wp='porte : '+(2*r)+' × '+dh+' + π × '+r+'² / 2 = '+(2*r*dh)+' + '+kPi(r*r/2), Wf='fenêtre : π × '+rho+'² = '+kPi(rho*rho);
    const Wf0=[Wh,Wh2,'rectangle : '+Rect,'triangle : '+Tri,Wp,Wf], fin=abPi(aA,bA);
    return mkGeo({svg,mode:'pi',val:pib(aA,bA),unit:u,pow:2,
      text:intro+'Le côté du toit mesure «'+s+'» ; sa hauteur n\'est pas donnée. Calcule l\'<b>aire</b> de la surface colorée (porte et fenêtre exclues). Donne la <b>valeur exacte</b>.',ask:'l\'aire (valeur exacte)',
      placeholder:'hauteur du toit = ...\nrectangle + triangle = ...\nporte = ...\nfenêtre = ...\nA = ...',
      work:Wf0.concat(['A = '+(w*h)+' + '+(a*ht)+' − ('+(2*r*dh)+' + '+kPi(r*r/2)+') − '+kPi(rho*rho)+' = '+fin+u2]),
      steps:[stp('Hauteur du toit','Le milieu de la base partage le toit en deux triangles rectangles : hypoténuse '+M(s)+', un côté '+M(a)+'.',M('hauteur = √('+s+'² − '+a+'²) = '+ht)),
        stp('Murs et toit',M('rectangle : '+Rect)+' ; '+M('triangle : '+Tri)),
        stp('Porte','Rectangle + demi-disque : '+M((2*r)+' × '+dh+' + π × '+r+'² / 2 = '+(2*r*dh)+' + '+kPi(r*r/2))),
        stp('Fenêtre','Disque de rayon '+M(rho)+' : '+M('π × '+rho+'² = '+kPi(rho*rho))),
        stp('Aire',M('A = '+(w*h+a*ht)+' − '+(2*r*dh)+' − '+kPi(r*r/2)+' − '+kPi(rho*rho)+' = '+fin+' ≈ '+NF(Math.round((aA+bA*Math.PI)*100)/100))+' '+u+'²')],
      hints:['Pour la hauteur du toit, coupe le triangle isocèle en deux par la verticale du sommet : tu obtiens un triangle rectangle.','Aire = rectangle + triangle − porte − fenêtre. La porte = rectangle + demi-disque ; la fenêtre est un disque entier.'],
      mistakes:[{v:pib(aA,-r*r/2),tag:'geo-decomp',msg:'Tu as oublié de retirer la fenêtre ronde.',w:Wf0.slice(0,5).concat(['A = '+(w*h+a*ht-2*r*dh)+' − '+kPi(r*r/2)+u2])},
        {v:pib(w*h+a*ht,-rho*rho),tag:'geo-decomp',msg:'Tu as oublié de retirer la porte (rectangle et demi-disque).',w:Wf0.slice(0,4).concat([Wf,'A = '+(w*h+a*ht)+' − '+kPi(rho*rho)+u2])},
        {v:pib(w*h+a*ht,-(r*r/2+rho*rho)),tag:'geo-decomp',msg:'La porte comprend aussi un rectangle ('+(2*r)+' × '+dh+') : retire-le en plus du demi-disque.',w:Wf0.slice(0,3).concat(['porte : '+kPi(r*r/2),Wf,'A = '+(w*h+a*ht)+' − '+kPi(r*r/2)+' − '+kPi(rho*rho)+u2])},
        {v:pib(aA,-(r*r+rho*rho)),tag:'geo-aire-pi',msg:'La partie arrondie de la porte est un demi-disque : πr² / 2.',w:Wf0.slice(0,4).concat(['porte : '+(2*r*dh)+' + '+kPi(r*r),Wf,'A = '+(w*h+a*ht-2*r*dh)+' − '+kPi(r*r)+' − '+kPi(rho*rho)+u2])},
        {v:pib(aA,-(r*r/2+2*rho)),tag:'geo-aire-pi',msg:'L\'aire d\'un disque de rayon r est πr² (2πr est sa circonférence).',w:Wf0.slice(0,4).concat(['porte : '+(2*r*dh)+' + '+kPi(r*r/2),'fenêtre : 2π × '+rho+' = '+kPi(2*rho),'A = '+(w*h+a*ht-2*r*dh)+' − '+kPi(r*r/2)+' − '+kPi(2*rho)+u2])},
        {v:pib(w*h+a*s-2*r*dh,bA),tag:'geo-pyth-cote',msg:'Le côté du toit n\'est pas sa hauteur. La hauteur est √('+s+'² − '+a+'²) = '+ht+'.',w:['rectangle : '+Rect,'triangle : '+w+' × '+s+' / 2 = '+(a*s),'A = '+(w*h+a*s)+' − '+(2*r*dh)+' − '+kPi(r*r/2)+' − '+kPi(rho*rho)+u2]},
        {v:pib(w*h+w*ht-2*r*dh,bA),tag:'geo-demi',msg:'L\'aire d\'un triangle vaut base × hauteur / 2.',w:[Wh2,'rectangle : '+Rect,'triangle : '+w+' × '+ht+' = '+(w*ht),'A = '+(w*h+w*ht)+' − '+(2*r*dh)+' − '+kPi(r*r/2)+' − '+kPi(rho*rho)+u2]}]});
  }
  const aP=(w-2*r)+2*dh+2*h+2*s, bP=r+2*rho;
  const Ws='côté du toit = √('+a+'² + '+ht+'²) = '+s, Wo='contour : '+(w-2*r)+' + '+(2*h)+' + '+(2*s)+' + '+(2*dh)+' = '+aP;
  return mkGeo({svg,mode:'pi',val:pib(aP,bP),unit:u,pow:1,
    text:intro+'La hauteur du toit est «'+ht+'» ; la longueur de son côté n\'est pas donnée. Calcule le <b>périmètre</b> de la surface colorée : le contour extérieur, le contour de la porte et le bord de la fenêtre. Donne la <b>valeur exacte</b>.',ask:'le périmètre (valeur exacte)',
    placeholder:'côté du toit = ...\nsegments = ...\narcs et cercle = ...\nP = ...',
    work:['moitié de la base : '+w+' / 2 = '+a,Ws,'bas : '+w+' − '+(2*r)+' = '+(w-2*r),Wo,'porte arrondie : π × '+r+' ; fenêtre : 2π × '+rho+' = '+kPi(2*rho),'P = '+aP+' + '+kPi(r)+' + '+kPi(2*rho)+' = '+abPi(aP,bP)+' '+u],
    steps:[stp('Côté du toit','Triangle rectangle de côtés '+M(a)+' (moitié de la base) et '+M(ht)+' (hauteur) :',M('√('+a+'² + '+ht+'²) = '+s)),
      stp('Segments du contour','Bas : '+M(w+' − '+(2*r)+' = '+(w-2*r))+' (la porte interrompt le bas) ; deux murs : '+M(2*h)+' ; deux côtés du toit : '+M(2*s)+' ; deux côtés verticaux de la porte : '+M(2*dh)+'.',M('total = '+aP)),
      stp('Parties rondes','Haut de la porte : demi-cercle '+M('π × '+r+' = '+kPi(r))+' ; fenêtre : cercle entier '+M('2π × '+rho+' = '+kPi(2*rho))),
      stp('Périmètre',M('P = '+abPi(aP,bP)+' ≈ '+NF(Math.round((aP+bP*Math.PI)*100)/100))+' '+u)],
    hints:['Le côté du toit est l\'hypoténuse d\'un triangle rectangle de côtés (largeur / 2) et (hauteur du toit).','La porte enlève sa largeur au bas du contour, mais ajoute ses deux côtés verticaux et son demi-cercle. La fenêtre ajoute son cercle entier.'],
    mistakes:[{v:pib(aP,r),tag:'geo-perim-cote',msg:'Le bord de la fenêtre fait partie du contour de la surface colorée : ajoute 2π × '+rho+'.',w:[Ws,Wo,'P = '+aP+' + '+kPi(r)+' '+u]},
      {v:pib(aP+2*r,bP),tag:'geo-perim-cote',msg:'La porte interrompt le bas du contour : retire sa largeur ('+2*r+') de la longueur du bas.',w:[Ws,'bas : '+w,'P = '+(aP+2*r)+' + '+kPi(bP)+' '+u]},
      {v:pib(aP-2*dh,bP),tag:'geo-perim-cote',msg:'Les deux côtés verticaux de la porte font partie du contour.',w:[Ws,'contour : '+(w-2*r)+' + '+(2*h)+' + '+(2*s)+' = '+(aP-2*dh),'P = '+(aP-2*dh)+' + '+kPi(bP)+' '+u]},
      {v:pib(aP-2*s+2*ht,bP),tag:'geo-pyth-cote',msg:'La hauteur du toit n\'est pas la longueur de son côté : le côté est l\'hypoténuse √('+a+'² + '+ht+'²) = '+s+'.',w:['côté du toit = '+ht,'P = '+(aP-2*s+2*ht)+' + '+kPi(bP)+' '+u]},
      {v:pib(aP-2*s+2*(a+ht),bP),tag:'geo-pyth-somme',msg:'Le côté du toit est une hypoténuse : √('+a+'² + '+ht+'²) et non '+a+' + '+ht+'.',w:['côté du toit = '+a+' + '+ht+' = '+(a+ht),'P = '+(aP-2*s+2*(a+ht))+' + '+kPi(bP)+' '+u]},
      {v:pib(aP,r+rho*rho),tag:'geo-aire-pi',msg:'πr² est une aire. Le bord d\'un disque est un cercle : 2πr.',w:[Ws,Wo,'fenêtre : π × '+rho+'² = '+kPi(rho*rho),'P = '+aP+' + '+kPi(r)+' + '+kPi(rho*rho)+' '+u]},
      {v:pib(aP,2*r+2*rho),tag:'geo-perim-cote',msg:'Le haut de la porte est un demi-cercle (πr), pas un cercle entier.',w:[Ws,Wo,'P = '+aP+' + '+kPi(2*r)+' + '+kPi(2*rho)+' '+u]}]});
}

/* ----- triangle rectangle avec deux encoches (une sur un côté, une sur l'hypoténuse) ----- */
function genTriEnc(){
  const ask=pick(['aire','périmètre']), u=uP();
  let p,q,hy,r1,r2,x1;
  for(let i=0;i<500;i++){
    [p,q,hy]=pick([[6,8,10],[8,6,10],[9,12,15],[12,9,15],[8,15,17],[15,8,17]]);
    r1=rnd(1,3); r2=rnd(1,3); x1=p*pick([0.3,0.35,0.4]);
    const M0=[p/2,q/2];
    if(x1-r1>=0.5&&q*(p-x1)/hy>=r1+0.5&&p/2>=r2+0.5&&q/2>=r2+0.5&&Math.hypot(x1-M0[0],M0[1])>=r1+r2+0.5) break;
    if(i===499){ r1=1; r2=1; x1=p*0.4; }
  }
  const hide=pick(['p','q']);
  const svg=figure([[-1,-0.9],[p+1.3,q+1.2]],f=>{
    const sc=f.s, F=q_=>f(q_), O=F([0,0]), A=F([p,0]), Bq=F([0,q]), ce=F([p/3,q/3]);
    const uh=[-p/hy,q/hy], nIn=[-q/hy,-p/hy], Mh=[p/2,q/2];
    const n1a=F([x1-r1,0]), n1b=F([x1+r1,0]), h1=F(vsub(Mh,vmul(uh,r2))), h2=F(vadd(Mh,vmul(uh,r2))), hm=F(vadd(Mh,vmul(nIn,r2)));
    const d=mv(O)+LQ(n1a)+arcM(n1a,n1b,F([x1,r1]),r1*sc)+LQ(A)+LQ(h1)+arcM(h1,h2,hm,r2*sc)+LQ(Bq)+' Z';
    let out=g.path(d,'g-f')+g.right(O,Bq,A,10);
    const c1=F([x1,0]), e1=F([x1,r1]), cm=F(Mh), e2=F(vadd(Mh,vmul(nIn,r2)));
    const sd=vunit(vsub(F(vadd(Mh,uh)),cm));
    out+=g.seg(c1,e1,'g-thin')+g.dot(c1)+g.text(vadd(vmid(c1,e1),[8,0]),String(r1),'g-u2')+g.seg(cm,e2,'g-thin')+g.dot(cm)+g.text(vadd(vmid(cm,e2),vmul(sd,9)),String(r2),'g-u2');
    [O,A,Bq].forEach(P=>{ out+=g.dot(P); });
    const lp=ask==='aire'?hide!=='p':true, lq=ask==='aire'?hide!=='q':true;
    if(lp) out+=g.len(O,A,String(p),ce,10);
    if(lq) out+=g.len(O,Bq,String(q),ce,10);
    if(ask==='aire') out+=g.len(A,Bq,String(hy),ce,10);
    return out;
  },'Triangle rectangle avec une encoche en demi-cercle de rayon '+r1+' sur un côté de l\'angle droit et une encoche de rayon '+r2+' au milieu de l\'hypoténuse',{H:250,pad:30});
  const intro='La surface colorée est un triangle rectangle (angle droit en bas à gauche) dont on a retiré deux demi-disques : une encoche de rayon «'+r1+'» centrée sur le côté du bas et une encoche de rayon «'+r2+'» centrée au milieu de l\'hypoténuse. Longueurs en '+u+'. ';
  const u2=' '+u+'²';
  if(ask==='aire'){
    const kn=hide==='p'?q:p, hd=hide==='p'?p:q, nm=hide==='p'?'le côté du bas':'le côté vertical', kname=hide==='p'?'le côté vertical':'le côté du bas';
    const aA=p*q/2, bA=-(r1*r1+r2*r2)/2, WL=(hide==='p'?'p':'q')+' = √('+hy+'² − '+kn+'²) = '+hd, WT='A₁ = '+p+' × '+q+' / 2 = '+NF(aA);
    const WE='encoches : π × '+r1+'² / 2 + π × '+r2+'² / 2 = '+kPi((r1*r1+r2*r2)/2), fin=abPi(aA,bA);
    const W0=[WL,WT,WE];
    return mkGeo({svg,mode:'pi',val:pib(aA,bA),unit:u,pow:2,
      text:intro+'La longueur d\'un côté de l\'angle droit n\'est pas donnée. Calcule l\'<b>aire</b> de la surface colorée. Donne la <b>valeur exacte</b>.',ask:'l\'aire (valeur exacte)',
      placeholder:'côté manquant = ...\ntriangle = ...\nencoches = ...\nA = ...',
      work:W0.concat(['A = '+NF(aA)+' − '+kPi((r1*r1+r2*r2)/2)+' = '+fin+u2]),
      steps:[stp('Côté manquant','L\'hypoténuse mesure '+M(hy)+' et '+kname+' mesure '+M(kn)+' :',M((hide==='p'?'p':'q')+' = √('+hy+'² − '+kn+'²) = √'+(hy*hy-kn*kn)+' = '+hd)),
        stp('Aire du triangle',M('A₁ = '+p+' × '+q+' / 2 = '+NF(aA))),
        stp('Encoches',M('π × '+r1+'² / 2 + π × '+r2+'² / 2 = '+kPi((r1*r1+r2*r2)/2))),
        stp('Aire',M('A = '+NF(aA)+' − '+kPi((r1*r1+r2*r2)/2)+' = '+fin+' ≈ '+NF(Math.round((aA+bA*Math.PI)*100)/100))+' '+u+'²')],
      hints:['Dans un triangle rectangle, l\'hypoténuse est le plus grand côté : (côté manquant)² = hypoténuse² − (autre côté)².','Aire = triangle − deux demi-disques (πr² / 2 chacun).'],
      mistakes:[{v:pib(aA,0),tag:'geo-decomp',msg:'C\'est l\'aire du triangle : il faut encore retirer les deux encoches.',w:[WL,WT,'A = '+NF(aA)+u2]},
        {v:pib(aA,(r1*r1+r2*r2)/2),tag:'geo-decomp',msg:'Les encoches sont retirées : on soustrait leur aire.',w:W0.concat(['A = '+NF(aA)+' + '+kPi((r1*r1+r2*r2)/2)+u2])},
        {v:pib(aA,-(r1*r1+r2*r2)),tag:'geo-aire-pi',msg:'Une encoche est un demi-disque : aire πr² / 2 (et non πr²).',w:[WL,WT,'encoches : π × '+r1+'² + π × '+r2+'² = '+kPi(r1*r1+r2*r2),'A = '+NF(aA)+' − '+kPi(r1*r1+r2*r2)+u2]},
        {v:pib(aA,-r1*r1/2),tag:'geo-decomp',msg:'Il y a deux encoches : retire aussi celle de l\'hypoténuse.',w:[WL,WT,'encoche : '+kPi(r1*r1/2),'A = '+NF(aA)+' − '+kPi(r1*r1/2)+u2]},
        {v:pib(hy*kn/2,bA),tag:'geo-pyth-cote',msg:'L\'hypoténuse n\'est pas un côté de l\'angle droit : l\'autre côté vaut √('+hy+'² − '+kn+'²) = '+hd+'.',w:['A₁ = '+hy+' × '+kn+' / 2 = '+NF(hy*kn/2),'A = '+NF(hy*kn/2)+' − '+kPi((r1*r1+r2*r2)/2)+u2]},
        {v:pib((hy-kn)*kn/2,bA),tag:'geo-pyth-somme',msg:'Pythagore s\'applique aux carrés : '+hd+' = √('+hy+'² − '+kn+'²), pas '+hy+' − '+kn+'.',w:[(hide==='p'?'p':'q')+' = '+hy+' − '+kn+' = '+(hy-kn),'A₁ = '+(hy-kn)+' × '+kn+' / 2 = '+NF((hy-kn)*kn/2)]},
        {v:pib(p*q,bA),tag:'geo-demi',msg:'L\'aire d\'un triangle vaut base × hauteur / 2.',w:[WL,'A₁ = '+p+' × '+q+' = '+(p*q),'A = '+(p*q)+' − '+kPi((r1*r1+r2*r2)/2)+u2]}]});
  }
  const aP=p+q+hy-2*r1-2*r2, bP=r1+r2, WH='hypoténuse = √('+p+'² + '+q+'²) = '+hy, WS='côtés : '+p+' + '+q+' + '+hy+' = '+(p+q+hy);
  const WP=[WH,WS,'diamètres retirés : '+(2*r1)+' + '+(2*r2)+' = '+(2*r1+2*r2),'demi-cercles : π × '+r1+' + π × '+r2+' = '+kPi(bP)];
  return mkGeo({svg,mode:'pi',val:pib(aP,bP),unit:u,pow:1,
    text:intro+'La longueur de l\'hypoténuse n\'est pas donnée. Calcule le <b>périmètre</b> de la surface colorée. Donne la <b>valeur exacte</b>.',ask:'le périmètre (valeur exacte)',
    placeholder:'hypoténuse = ...\nsegments = ...\ndemi-cercles = ...\nP = ...',
    work:WP.concat(['P = '+(p+q+hy)+' − '+(2*r1+2*r2)+' + '+kPi(bP)+' = '+abPi(aP,bP)+' '+u]),
    steps:[stp('Hypoténuse',M('√('+p+'² + '+q+'²) = √'+(p*p+q*q)+' = '+hy)),
      stp('Segments du contour','Les trois côtés mesurent '+M(p+' + '+q+' + '+hy+' = '+(p+q+hy))+'. Chaque encoche remplace son diamètre par un demi-cercle : on retire '+M(2*r1+' + '+2*r2+' = '+(2*r1+2*r2))+' : '+M(aP)),
      stp('Demi-cercles',M('π × '+r1+' + π × '+r2+' = '+kPi(bP))),
      stp('Périmètre',M('P = '+abPi(aP,bP)+' ≈ '+NF(Math.round((aP+bP*Math.PI)*100)/100))+' '+u)],
    hints:['Calcule d\'abord l\'hypoténuse avec Pythagore.','Sur chaque encoche, le contour suit le demi-cercle à la place du diamètre : retire 2r, ajoute πr.'],
    mistakes:[{v:pib(aP,0),tag:'geo-perim-cote',msg:'Tu as retiré les diamètres mais oublié les demi-cercles : le contour suit les arcs (πr chacun).',w:WP.slice(0,3).concat(['P = '+aP+' '+u])},
      {v:pib(p+q+hy,bP),tag:'geo-perim-cote',msg:'Les diamètres ne font plus partie du contour : retire-les avant d\'ajouter les arcs.',w:[WH,WS,'P = '+(p+q+hy)+' + '+kPi(bP)+' '+u]},
      {v:pib(aP,2*bP),tag:'geo-perim-cote',msg:'Ce sont des demi-cercles : πr, pas 2πr.',w:WP.slice(0,3).concat(['P = '+aP+' + '+kPi(2*bP)+' '+u])},
      {v:pib(aP,(r1*r1+r2*r2)/2),tag:'geo-aire-pi',msg:'πr² / 2 est une aire. La longueur d\'un demi-cercle est πr.',w:WP.slice(0,3).concat(['P = '+aP+' + '+kPi((r1*r1+r2*r2)/2)+' '+u])},
      {v:pib(p+q+(p+q)-2*r1-2*r2,bP),tag:'geo-pyth-somme',msg:'L\'hypoténuse n\'est pas la somme des deux côtés : elle vaut √('+p+'² + '+q+'²) = '+hy+'.',w:['hypoténuse = '+p+' + '+q+' = '+(p+q),'P = '+(2*(p+q))+' − '+(2*r1+2*r2)+' + '+kPi(bP)+' '+u]},
      {v:pib(p+q-2*r1-2*r2,bP),tag:'geo-perim-cote',msg:'Il manque l\'hypoténuse ('+hy+') dans le contour.',w:['P = '+(p+q)+' − '+(2*r1+2*r2)+' + '+kPi(bP)+' '+u]}]});
}
TOPICS['gm-6j']={kind:'gcomp',level:6,label:'Trapèze à encoche et bosse',gen:genTrapeze};
TOPICS['gm-6k']={kind:'gcomp',level:6,label:'Maison, porte et fenêtre',gen:genMaison};
TOPICS['gm-6l']={kind:'gcomp',level:6,label:'Triangle rectangle à deux encoches',gen:genTriEnc};
