'use strict';
/* ===== Géométrie : cercles (angles) et figures composées ===== */
const cpt=a=>[Math.cos(a*Math.PI/180),Math.sin(a*Math.PI/180)];
function figCirc(o){
  const P={}; Object.keys(o.P).forEach(k=>{ P[k]=cpt(o.P[k]); });
  const extra=[]; if(o.tan) extra.push(o.tan[0],o.tan[1]);
  return figure([[-1.28,-1.28],[1.28,1.28]].concat(extra),f=>{
    const c=f([0,0]), r=f.s, S=k=>k==='O'?c:f(P[k]);
    let out=g.circle(c,r,'g-circle');
    (o.chords||[]).forEach(z=>{ out+=g.seg(S(z[0]),S(z[1])); });
    (o.radii||[]).forEach(z=>{ out+=g.seg(c,S(z)); });
    (o.dashed||[]).forEach(z=>{ out+=g.seg(S(z[0]),S(z[1]),'g-dash'); });
    if(o.tan) out+=g.seg(f(o.tan[0]),f(o.tan[1]));
    (o.marks||[]).forEach(m=>{ out+=g.arc(S(m.at),m.toT?f(m.toT):S(m.a),m.toT2?f(m.toT2):S(m.b),m.r||20,m.label,m.unk?'g-u':'g-a'); });
    (o.right||[]).forEach(m=>{ out+=g.right(S(m.at),m.toT?f(m.toT):S(m.a),m.toT2?f(m.toT2):S(m.b),9); });
    Object.keys(P).forEach(k=>{ out+=g.dot(S(k))+g.vert(S(k),k,c,15); });
    (o.labels||[]).forEach(l=>{ const p=f(l.p); out+=g.dot(p)+g.vert(p,l.s,c,14); });
    if(o.O!==false) out+=g.dot(c)+g.text([c[0]+9,c[1]+12],'O','g-v');
    return out;
  },o.alt,{H:250,pad:34});
}
const DEG=v=>v+'°';
function angText(s){ return s; }
function genCi1(){
  const al=5*rnd(4,16), aA=rnd(0,359), aB=aA+2*al, aC=aB+rnd(30,360-2*al-30);
  const svg=figCirc({P:{A:aA,B:aB,C:aC},chords:[['C','A'],['C','B']],radii:['A','B'],marks:[{at:'C',a:'A',b:'B',r:22,label:DEG(al)},{at:'O',a:'A',b:'B',r:20,label:'?',unk:true}],alt:'Cercle de centre O avec un angle inscrit ACB de '+al+' degrés'});
  return mkGeo({svg,text:'Les points «A», «B» et «C» sont sur le cercle de centre «O». L\'angle inscrit «∠ACB» mesure «'+al+'»°. Calcule l\'angle au centre «∠AOB».',ask:'l\'angle au centre ∠AOB',val:2*al,unit:'°',placeholder:'∠AOB = 2 × ∠ACB\n∠AOB = 2 × 35 = 70°',
    work:['∠AOB = 2 × '+al,'∠AOB = '+2*al+'°'],
    steps:[stp('Repère l\'arc','Les angles ∠ACB (inscrit) et ∠AOB (au centre) interceptent le <b>même arc</b> AB.'),stp('Théorème de l\'angle inscrit','L\'angle au centre mesure le <b>double</b> de l\'angle inscrit : '+M('∠AOB = 2 × ∠ACB')),stp('Calcul',M('∠AOB = 2 × '+al+' = '+2*al)+'°')],
    hints:['Un angle inscrit a son sommet sur le cercle ; un angle au centre a son sommet au centre. Ici, ils interceptent le même arc AB.'],
    mistakes:[{v:al,tag:'geo-angle-centre',msg:'Tu as recopié l\'angle inscrit. L\'angle au centre est le <b>double</b> de l\'angle inscrit qui intercepte le même arc.',w:['∠AOB = '+al+'°']},{v:al/2,tag:'geo-angle-centre',msg:'Tu as pris la moitié : c\'est l\'angle inscrit qui est la moitié de l\'angle au centre, pas l\'inverse.',w:['∠AOB = '+al+' / 2','∠AOB = '+NF(al/2)+'°']},{v:180-2*al,tag:'geo-supp',msg:'Tu as cherché un angle du triangle OAB, pas l\'angle au centre demandé.',w:['∠AOB = 180 − 2 × '+al,'∠AOB = '+(180-2*al)+'°']}]});
}
function genCi2(){
  const th=10*rnd(4,16), aA=rnd(0,359), aB=aA+th, aC=aB+rnd(30,360-th-30);
  const svg=figCirc({P:{A:aA,B:aB,C:aC},chords:[['C','A'],['C','B']],radii:['A','B'],marks:[{at:'O',a:'A',b:'B',r:20,label:DEG(th)},{at:'C',a:'A',b:'B',r:22,label:'?',unk:true}],alt:'Cercle de centre O avec un angle au centre AOB de '+th+' degrés'});
  return mkGeo({svg,text:'Les points «A», «B» et «C» sont sur le cercle de centre «O». L\'angle au centre «∠AOB» mesure «'+th+'»°. Calcule l\'angle inscrit «∠ACB».',ask:'l\'angle inscrit ∠ACB',val:th/2,unit:'°',placeholder:'∠ACB = ∠AOB / 2\n∠ACB = 70 / 2 = 35°',
    work:['∠ACB = '+th+' / 2','∠ACB = '+NF(th/2)+'°'],
    steps:[stp('Repère l\'arc','∠AOB (au centre) et ∠ACB (inscrit) interceptent le même arc AB.'),stp('Théorème de l\'angle inscrit','L\'angle inscrit mesure la <b>moitié</b> de l\'angle au centre : '+M('∠ACB = ∠AOB / 2')),stp('Calcul',M('∠ACB = '+th+' / 2 = '+th/2)+'°')],
    hints:['Le sommet C est sur le cercle : c\'est l\'angle inscrit. Il est plus petit que l\'angle au centre.'],
    mistakes:[{v:th,tag:'geo-angle-centre',msg:'Tu as recopié l\'angle au centre. L\'angle inscrit en est la <b>moitié</b>.',w:['∠ACB = '+th+'°']},{v:2*th,tag:'geo-angle-centre',msg:'Tu as doublé : c\'est l\'angle au centre qui est le double de l\'angle inscrit, pas l\'inverse.',w:['∠ACB = 2 × '+th,'∠ACB = '+2*th+'°']},{v:(180-th)/2,tag:'geo-supp',msg:'Tu as calculé un angle à la base du triangle isocèle OAB, pas l\'angle inscrit.',w:['∠ACB = (180 − '+th+') / 2','∠ACB = '+NF((180-th)/2)+'°']}]});
}
function genCi3(){
  const al=5*rnd(5,13), askC=Math.random()<0.25, aA=180, aB=0, aC=2*al;
  const rot=rnd(-30,30);
  const svg=figCirc({P:{A:aA+rot,B:aB+rot,C:aC+rot},chords:[['A','B'],['A','C'],['C','B']],marks:[{at:'A',a:'B',b:'C',r:24,label:DEG(al)},askC?{at:'B',a:'A',b:'C',r:24,label:DEG(90-al)}:{at:'B',a:'A',b:'C',r:24,label:'?',unk:true}],right:askC?[]:[],alt:'Triangle ABC inscrit dans un cercle, AB est un diamètre'});
  if(askC){ const svg2=figCirc({P:{A:aA+rot,B:aB+rot,C:aC+rot},chords:[['A','B'],['A','C'],['C','B']],marks:[{at:'A',a:'B',b:'C',r:24,label:DEG(al)}],alt:'Triangle ABC inscrit, AB diamètre'});
    return mkGeo({svg:svg2,text:'Le segment «[AB]» est un <b>diamètre</b> du cercle de centre «O», et «C» est un autre point du cercle. Calcule l\'angle «∠ACB».',ask:'l\'angle ∠ACB',val:90,unit:'°',placeholder:'∠ACB = 90°',
      work:['∠ACB = 90°'],
      steps:[stp('Triangle inscrit dans un demi-cercle','Le côté [AB] est un diamètre : le triangle ABC est rectangle en C (le point C est sur le cercle de diamètre [AB]).'),stp('Conclusion',M('∠ACB = 90')+'°')],hints:['Un triangle inscrit dans un cercle dont un côté est un diamètre est rectangle.'],
      mistakes:[{v:180,tag:'geo-supp',msg:'180° est la somme des trois angles du triangle. Ici, l\'angle en C est droit.',w:['∠ACB = 180°']},{v:45,tag:'geo-angle-centre',msg:'Le diamètre AB est vu depuis C sous un angle de 90° : c\'est le théorème du triangle rectangle inscrit dans un demi-cercle.',w:['∠ACB = 90 / 2','∠ACB = 45°']}]}); }
  return mkGeo({svg,text:'Le segment «[AB]» est un <b>diamètre</b> du cercle de centre «O», et «C» est un autre point du cercle. On donne «∠CAB = '+al+'»°. Calcule l\'angle «∠ABC».',ask:'l\'angle ∠ABC',val:90-al,unit:'°',placeholder:'ABC est rectangle en C\n∠ABC = 90 − 35 = 55°',
    work:['∠ABC = 180 − 90 − '+al,'∠ABC = '+(90-al)+'°'],
    steps:[stp('Triangle rectangle','[AB] est un diamètre et C est sur le cercle : le triangle ABC est rectangle en C.'),stp('Angles d\'un triangle rectangle','Les deux angles aigus sont complémentaires : '+M('∠ABC + ∠CAB = 90')),stp('Calcul',M('∠ABC = 90 − '+al+' = '+(90-al))+'°')],
    hints:['Un triangle inscrit dans un demi-cercle est rectangle : où est l\'angle droit ?','Dans un triangle rectangle, les deux angles aigus totalisent 90°.'],
    mistakes:[{v:180-al,tag:'geo-supp',msg:'Tu as oublié l\'angle droit en C : 180 − '+al+' n\'est pas l\'angle ∠ABC. Les deux angles aigus totalisent 90°.',w:['∠ABC = 180 − '+al,'∠ABC = '+(180-al)+'°']},{v:al,tag:'geo-supp',msg:'Les angles en A et B ne sont pas égaux (le triangle n\'est pas isocèle).',w:['∠ABC = '+al+'°']},{v:90+al,tag:'geo-supp',msg:'Ce nombre est trop grand : un angle aigu d\'un triangle rectangle est inférieur à 90°.',w:['∠ABC = 90 + '+al,'∠ABC = '+(90+al)+'°']},{v:2*al,tag:'geo-angle-centre',msg:'Tu as doublé l\'angle. Il faut utiliser le fait que le triangle est rectangle en C.',w:['∠ABC = 2 × '+al,'∠ABC = '+2*al+'°']}]});
}
function genCi4(){
  if(Math.random()<0.5){
    const al=5*rnd(4,15), aA=rnd(0,359), aB=aA+2*al, Mj=360-2*al, aC=aB+rnd(30,Math.floor(Mj/2)-10), aD=aB+rnd(Math.floor(Mj/2)+10,Mj-30);
    const svg=figCirc({P:{A:aA,B:aB,C:aC,D:aD},chords:[['C','A'],['C','B'],['D','A'],['D','B']],marks:[{at:'C',a:'A',b:'B',r:22,label:DEG(al)},{at:'D',a:'A',b:'B',r:22,label:'?',unk:true}],O:false,alt:'Deux angles inscrits ACB et ADB interceptant le même arc AB'});
    return mkGeo({svg,text:'Les points «A», «B», «C» et «D» sont sur un même cercle, et «C» et «D» sont du même côté de la droite «(AB)». On donne «∠ACB = '+al+'»°. Calcule «∠ADB».',ask:'l\'angle ∠ADB',val:al,unit:'°',placeholder:'∠ADB = ∠ACB = 35°',
      work:['∠ADB = '+al+'°'],
      steps:[stp('Même arc','Les angles ∠ACB et ∠ADB sont inscrits et interceptent le <b>même arc AB</b>.'),stp('Conclusion','Deux angles inscrits qui interceptent le même arc sont <b>égaux</b> : '+M('∠ADB = ∠ACB = '+al)+'°')],hints:['Les deux angles regardent le segment [AB] depuis le même côté.'],
      mistakes:[{v:2*al,tag:'geo-angle-centre',msg:'Tu as doublé : le double, c\'est pour l\'angle au centre. Ici, les deux angles sont inscrits, donc égaux.',w:['∠ADB = 2 × '+al,'∠ADB = '+2*al+'°']},{v:180-al,tag:'geo-supp',msg:'Les angles opposés d\'un quadrilatère inscrit sont supplémentaires, mais ici C et D sont du même côté de (AB) : les angles sont égaux.',w:['∠ADB = 180 − '+al,'∠ADB = '+(180-al)+'°']},{v:al/2,tag:'geo-angle-centre',msg:'Il n\'y a pas de division par 2 entre deux angles inscrits qui interceptent le même arc : ils sont égaux.',w:['∠ADB = '+al+' / 2','∠ADB = '+NF(al/2)+'°']}]});
  }
  const be=5*rnd(12,24); if(be===90) return genCi4();
  const aA=rnd(0,359), aC=aA+360-2*be, aB=aA+rnd(30,360-2*be-30), aD=aC+rnd(30,2*be-30);
  const svg=figCirc({P:{A:aA,B:aB,C:aC,D:aD},chords:[['A','B'],['B','C'],['C','D'],['D','A']],marks:[{at:'B',a:'A',b:'C',r:22,label:DEG(be)},{at:'D',a:'C',b:'A',r:22,label:'?',unk:true}],O:false,alt:'Quadrilatère ABCD inscrit dans un cercle'});
  return mkGeo({svg,text:'Le quadrilatère «ABCD» est inscrit dans un cercle. On donne «∠ABC = '+be+'»°. Calcule «∠ADC».',ask:'l\'angle ∠ADC',val:180-be,unit:'°',placeholder:'∠ADC = 180 − ∠ABC\n∠ADC = 180 − 110 = 70°',
    work:['∠ADC = 180 − '+be,'∠ADC = '+(180-be)+'°'],
    steps:[stp('Quadrilatère inscrit','Les angles ∠ABC et ∠ADC sont <b>opposés</b> dans un quadrilatère inscrit dans un cercle.'),stp('Propriété','Deux angles opposés d\'un quadrilatère inscrit sont <b>supplémentaires</b> : '+M('∠ABC + ∠ADC = 180')),stp('Calcul',M('∠ADC = 180 − '+be+' = '+(180-be))+'°')],
    hints:['∠ABC intercepte l\'arc AC qui ne contient pas B ; ∠ADC intercepte l\'arc AC qui ne contient pas D : ces deux arcs forment le cercle entier (360°).'],
    mistakes:[{v:be,tag:'geo-supp',msg:'Les deux angles opposés ne sont pas égaux : ils totalisent 180°.',w:['∠ADC = '+be+'°']},{v:360-be,tag:'geo-supp',msg:'La somme des angles opposés d\'un quadrilatère inscrit est 180°, pas 360° (360° est la somme des quatre angles).',w:['∠ADC = 360 − '+be,'∠ADC = '+(360-be)+'°']},{v:be/2,tag:'geo-angle-centre',msg:'Pas de demi ici : les angles inscrits sont déjà des angles « à moitié ». Les angles opposés totalisent 180°.',w:['∠ADC = '+be+' / 2','∠ADC = '+NF(be/2)+'°']},{v:2*be,tag:'geo-angle-centre',msg:'Pas de double ici : les deux angles sont inscrits.',w:['∠ADC = 2 × '+be,'∠ADC = '+2*be+'°']}]});
}
function genCi5(){
  if(Math.random()<0.5){
    const al=5*rnd(4,14), aA=rnd(0,359), aB=aA+2*al, aC=aB+rnd(30,360-2*al-30);
    const svg=figCirc({P:{A:aA,B:aB,C:aC},chords:[['C','A'],['C','B'],['A','B']],radii:['A','B'],marks:[{at:'C',a:'A',b:'B',r:22,label:DEG(al)},{at:'A',a:'O',b:'B',r:20,label:'?',unk:true}],alt:'Cercle de centre O, angle inscrit ACB de '+al+' degrés'});
    return mkGeo({svg,text:'Les points «A», «B» et «C» sont sur le cercle de centre «O». L\'angle inscrit «∠ACB» mesure «'+al+'»°. Calcule l\'angle «∠OAB».',ask:'l\'angle ∠OAB',val:90-al,unit:'°',placeholder:'∠AOB = 2 × ∠ACB = ...\nOAB est isocèle en O\n∠OAB = (180 − ...) / 2',
      work:['∠AOB = 2 × '+al+' = '+2*al+'°','∠OAB = (180 − '+2*al+') / 2','∠OAB = '+(90-al)+'°'],
      steps:[stp('Angle au centre',M('∠AOB = 2 × ∠ACB = 2 × '+al+' = '+2*al)+'°'),stp('Triangle OAB isocèle en O','OA = OB (rayons) : les angles à la base sont égaux, ∠OAB = ∠OBA.'),stp('Somme des angles',M('∠OAB = (180 − '+2*al+') / 2 = '+(90-al))+'°')],
      hints:['Commence par l\'angle au centre ∠AOB.','Le triangle OAB est isocèle : OA et OB sont des rayons.'],
      mistakes:[{v:2*al,tag:'geo-angle-centre',msg:'2 × '+al+' est l\'angle au centre ∠AOB, pas l\'angle ∠OAB.',w:['∠OAB = 2 × '+al,'∠OAB = '+2*al+'°']},{v:180-2*al,tag:'geo-supp',msg:'Tu as trouvé la somme des deux angles à la base. Ils sont égaux : divise par 2.',w:['∠AOB = 2 × '+al+' = '+2*al+'°','∠OAB = 180 − '+2*al,'∠OAB = '+(180-2*al)+'°']},{v:al,tag:'geo-angle-centre',msg:'Les angles ∠OAB et ∠ACB ne sont pas égaux : passe par l\'angle au centre puis par le triangle isocèle.',w:['∠OAB = '+al+'°']}]});
  }
  const th=10*rnd(4,14), aA=rnd(0,359), aB=aA+th, u=[-Math.sin(aA*Math.PI/180),Math.cos(aA*Math.PI/180)], A=cpt(aA), T=vadd(A,vmul(u,0.7)), T2=vadd(A,vmul(u,-0.55));
  const svg=figCirc({P:{A:aA,B:aB},chords:[['A','B']],radii:['A','B'],tan:[T2,T],marks:[{at:'O',a:'A',b:'B',r:20,label:DEG(th)},{at:'A',a:'B',toT2:T,r:26,label:'?',unk:true}],right:[{at:'A',a:'O',toT2:T}],labels:[{p:T,s:'T'}],alt:'Cercle de centre O, tangente en A, angle au centre AOB de '+th+' degrés'});
  return mkGeo({svg,text:'La droite «(AT)» est <b>tangente</b> en «A» au cercle de centre «O», et «B» est un point du cercle situé du côté de «T». On donne «∠AOB = '+th+'»°. Calcule l\'angle «∠BAT».',ask:'l\'angle ∠BAT',val:th/2,unit:'°',placeholder:'∠OAB = (180 − ...) / 2\n∠BAT = 90 − ∠OAB',
    work:['∠OAB = (180 − '+th+') / 2 = '+NF(90-th/2)+'°','∠BAT = 90 − '+NF(90-th/2),'∠BAT = '+NF(th/2)+'°'],
    steps:[stp('Triangle OAB isocèle en O',M('∠OAB = (180 − '+th+') / 2 = '+(90-th/2))+'°'),stp('La tangente est perpendiculaire au rayon',M('∠OAT = 90')+'° : le rayon [OA] est perpendiculaire à la tangente en A.'),stp('Soustraction',M('∠BAT = ∠OAT − ∠OAB = 90 − '+(90-th/2)+' = '+th/2)+'°')],
    hints:['La tangente en A est perpendiculaire au rayon [OA].','Calcule d\'abord ∠OAB dans le triangle isocèle OAB.'],
    mistakes:[{v:90-th/2,tag:'geo-supp',msg:'Tu as calculé ∠OAB (angle à la base du triangle isocèle). Il faut ensuite le soustraire à l\'angle droit ∠OAT.',w:['∠OAB = (180 − '+th+') / 2 = '+NF(90-th/2)+'°','∠BAT = '+NF(90-th/2)+'°']},{v:th,tag:'geo-angle-centre',msg:'L\'angle demandé n\'est pas égal à l\'angle au centre : il en vaut la moitié.',w:['∠BAT = '+th+'°']},{v:180-th,tag:'geo-supp',msg:'Regarde d\'abord le triangle isocèle OAB, puis l\'angle droit entre le rayon et la tangente.',w:['∠BAT = 180 − '+th,'∠BAT = '+(180-th)+'°']}]});
}
TOPICS['gc-1']={kind:'gcirc',level:1,label:'Angle inscrit → angle au centre',gen:genCi1};
TOPICS['gc-2']={kind:'gcirc',level:2,label:'Angle au centre → angle inscrit',gen:genCi2};
TOPICS['gc-3']={kind:'gcirc',level:3,label:'Triangle inscrit dans un demi-cercle',gen:genCi3};
TOPICS['gc-4']={kind:'gcirc',level:4,label:'Même arc et quadrilatère inscrit',gen:genCi4};
TOPICS['gc-5']={kind:'gcirc',level:5,label:'Triangle isocèle et tangente',gen:genCi5};

/* ---------- Figures composées ---------- */
function genCp1(){
  const u=uP(), W=rnd(7,13), H=rnd(6,10), t=rnd(2,W-2), r=rnd(2,H-2), ask=pick(['aire','périmètre']);
  const pts=[[0,0],[W,0],[W,r],[t,r],[t,H],[0,H]];
  const svg=figure(pts,f=>{ const P=pts.map(f), ce=cen(P);
    return g.poly(P)+g.text([(P[0][0]+P[1][0])/2,P[0][1]+17],W+' '+u)+g.len(P[5],P[0],H+' '+u,[P[1][0],P[1][1]],15)+g.len(P[4],P[5],t+' '+u,[P[0][0],P[0][1]],14)+g.len(P[1],P[2],r+' '+u,[P[0][0],P[0][1]],15); },'Figure en L : rectangle de '+W+' sur '+H+' auquel on a enlevé un coin');
  const A=W*H-(W-t)*(H-r), P=2*(W+H);
  const txt='La figure ci-dessus est un rectangle de «'+W+'» '+u+' sur «'+H+'» '+u+' dont on a enlevé un coin. Les angles sont tous droits. Les côtés visibles mesurent «'+W+'», «'+H+'», «'+t+'» et «'+r+'» '+u+'. ';
  if(ask==='aire') return mkGeo({svg,text:txt+'Calcule l\'aire de la figure.',ask:'l\'aire de la figure',val:A,unit:u,pow:2,placeholder:'grand rectangle : 10 × 8\ncoin enlevé : ...\nA = ...',
    work:['A1 = '+W+' × '+H+' = '+W*H,'A2 = ('+W+' − '+t+') × ('+H+' − '+r+') = '+(W-t)*(H-r),'A = '+W*H+' − '+(W-t)*(H-r)+' = '+A+' '+u+'²'],
    steps:[stp('Grand rectangle',M(W+' × '+H+' = '+W*H)),stp('Coin enlevé (dimensions à déduire)','Largeur du coin : '+M(W+' − '+t+' = '+(W-t))+' ; hauteur du coin : '+M(H+' − '+r+' = '+(H-r))+'. Aire : '+M((W-t)+' × '+(H-r)+' = '+(W-t)*(H-r))),stp('Soustraction',M('A = '+W*H+' − '+(W-t)*(H-r)+' = '+A)+' '+u+'²')],
    hints:['Imagine le rectangle complet, puis retire le coin manquant.','Les dimensions du coin ne sont pas écrites : déduis-les par soustraction.'],
    mistakes:[{v:W*H,tag:'geo-decomp',msg:'Tu as calculé l\'aire du rectangle complet : il faut retirer le coin manquant.',w:['A1 = '+W+' × '+H+' = '+W*H,'A = '+W*H+' '+u+'²']},{v:W*H-t*r,tag:'geo-decomp',msg:'Tu as retiré un rectangle de '+t+' sur '+r+' : ce ne sont pas les dimensions du coin. Le coin mesure '+(W-t)+' sur '+(H-r)+'.',w:['A1 = '+W+' × '+H+' = '+W*H,'A2 = '+t+' × '+r+' = '+t*r,'A = '+W*H+' − '+t*r+' = '+(W*H-t*r)+' '+u+'²']},{v:t*H+W*r,tag:'geo-decomp',msg:'Tu as additionné deux rectangles qui se chevauchent : le carré commun de '+t+' sur '+r+' est compté deux fois.',w:['A1 = '+t+' × '+H+' = '+t*H,'A2 = '+W+' × '+r+' = '+W*r,'A = '+t*H+' + '+W*r+' = '+(t*H+W*r)+' '+u+'²']},{v:2*(W+H),tag:'geo-perim-aire',msg:'Tu as calculé le périmètre.',w:['A = 2 × ('+W+' + '+H+')','A = '+2*(W+H)+' '+u+'²']}]});
  return mkGeo({svg,text:txt+'Calcule le périmètre de la figure.',ask:'le périmètre de la figure',val:P,unit:u,placeholder:'P = ...',
    work:['P = '+W+' + '+r+' + '+(W-t)+' + '+(H-r)+' + '+t+' + '+H,'P = '+P+' '+u],
    steps:[stp('Ne compte que le contour','Le contour contient deux côtés horizontaux (en bas '+W+', en haut '+t+' et le retrait de '+(W-t)+') et de même en vertical.'),stp('Astuce des « escaliers »','Les segments horizontaux du contour totalisent '+M(W+' + '+W)+' et les verticaux '+M(H+' + '+H)+' : le périmètre est celui du grand rectangle.'),stp('Calcul',M('P = 2 × ('+W+' + '+H+') = '+P)+' '+u)],
    hints:['Fais le tour de la figure. Les côtés « rentrants » se compensent avec ceux du rectangle complet.'],
    mistakes:[{v:W+H+t+r,tag:'geo-perim-cote',msg:'Tu as additionné les quatre côtés écrits, mais il manque les deux côtés du coin enlevé ('+(W-t)+' et '+(H-r)+' '+u+').',w:['P = '+W+' + '+r+' + '+t+' + '+H,'P = '+(W+H+t+r)+' '+u]},{v:W*H-(W-t)*(H-r),tag:'geo-perim-aire',msg:'Tu as calculé l\'aire.',w:['P = '+W+' × '+H+' − '+(W-t)+' × '+(H-r),'P = '+(W*H-(W-t)*(H-r))+' '+u]},{v:2*(t+r)+W+H,tag:'geo-decomp',msg:'Recompte les côtés un par un en faisant le tour de la figure.',w:['P = '+W+' + '+r+' + '+t+' + '+r+' + '+t+' + '+H,'P = '+(2*(t+r)+W+H)+' '+u]}]});
}
function genCp2(){
  const u=uP(), [p,t,s]=tripleK(20), w=2*p, h=rnd(3,8), ask=pick(['aire','périmètre']);
  const pts=[[0,0],[w,0],[w,h],[p,h+t],[0,h]];
  const svg=figure(pts,f=>{ const P=pts.map(f), ce=cen(P), Fm=f([p,h]);
    let out=g.poly(P)+g.seg(P[4],P[2],'g-thin')+g.text([(P[0][0]+P[1][0])/2,P[0][1]+17],w+' '+u)+g.len(P[1],P[2],h+' '+u,[P[0][0],P[0][1]],15);
    if(ask==='aire') out+=g.seg(P[3],Fm,'g-dash')+g.right(Fm,P[3],P[2],9)+g.text([Fm[0]+9,(P[3][1]+Fm[1])/2],t+' '+u,'','start');
    else out+=g.len(P[2],P[3],s+' '+u,[P[0][0],P[0][1]],15);
    return out; },'Maison : rectangle surmonté d\'un triangle');
  const A=w*h+w*t/2, Pm=w+2*h+2*s;
  const txt='La figure est un rectangle de «'+w+'» '+u+' sur «'+h+'» '+u+' surmonté d\'un triangle isocèle. ';
  if(ask==='aire') return mkGeo({svg,text:txt+'La hauteur du triangle mesure «'+t+'» '+u+'. Calcule l\'aire de la figure.',ask:'l\'aire de la figure',val:A,unit:u,pow:2,placeholder:'rectangle : ...\ntriangle : ...\nA = ...',
    work:['A1 = '+w+' × '+h+' = '+w*h,'A2 = '+w+' × '+t+' / 2 = '+NF(w*t/2),'A = '+w*h+' + '+NF(w*t/2)+' = '+NF(A)+' '+u+'²'],
    steps:[stp('Découpe','La figure = un rectangle + un triangle.'),stp('Rectangle',M(w+' × '+h+' = '+w*h)),stp('Triangle',M(w+' × '+t+' / 2 = '+w*t/2)),stp('Somme',M('A = '+w*h+' + '+w*t/2+' = '+A)+' '+u+'²')],
    hints:['Calcule séparément l\'aire du rectangle et celle du triangle, puis additionne.'],
    mistakes:[{v:w*h+w*t,tag:'geo-demi',msg:'Tu as oublié de diviser par 2 pour le triangle.',w:['A1 = '+w+' × '+h+' = '+w*h,'A2 = '+w+' × '+t+' = '+w*t,'A = '+w*h+' + '+w*t+' = '+(w*h+w*t)+' '+u+'²']},{v:w*h,tag:'geo-decomp',msg:'Tu n\'as compté que le rectangle : il faut ajouter le triangle du toit.',w:['A1 = '+w+' × '+h+' = '+w*h,'A = '+w*h+' '+u+'²']},{v:w*t/2,tag:'geo-decomp',msg:'Tu n\'as compté que le triangle : il faut ajouter le rectangle.',w:['A2 = '+w+' × '+t+' / 2 = '+NF(w*t/2),'A = '+NF(w*t/2)+' '+u+'²']},{v:w*h+w*s/2,tag:'geo-hauteur',msg:'Tu as pris le côté oblique du toit comme hauteur du triangle.',w:['A1 = '+w+' × '+h+' = '+w*h,'A2 = '+w+' × '+s+' / 2 = '+NF(w*s/2),'A = '+w*h+' + '+NF(w*s/2)+' = '+NF(w*h+w*s/2)+' '+u+'²']}]});
  return mkGeo({svg,text:txt+'Chaque côté oblique du toit mesure «'+s+'» '+u+'. Calcule le périmètre de la figure.',ask:'le périmètre de la figure',val:Pm,unit:u,placeholder:'P = ...',
    work:['P = '+w+' + 2 × '+h+' + 2 × '+s,'P = '+Pm+' '+u],
    steps:[stp('Fais le tour de la figure','Le contour contient : la base ('+w+'), les deux murs ('+h+' chacun) et les deux côtés du toit ('+s+' chacun).'),stp('Ne compte pas le segment commun','Le côté du rectangle situé sous le toit est <b>à l\'intérieur</b> de la figure : il n\'appartient pas au contour.'),stp('Somme',M('P = '+w+' + 2 × '+h+' + 2 × '+s+' = '+Pm)+' '+u)],
    hints:['Le segment horizontal qui sépare le rectangle du triangle est à l\'intérieur de la figure.'],
    mistakes:[{v:2*w+2*h+2*s,tag:'geo-perim-cote',msg:'Tu as compté le segment commun au rectangle et au triangle : il est à l\'intérieur de la figure, pas sur son contour.',w:['P = '+w+' + '+w+' + 2 × '+h+' + 2 × '+s,'P = '+(2*w+2*h+2*s)+' '+u]},{v:w+2*h,tag:'geo-perim-cote',msg:'Tu as oublié les deux côtés du toit.',w:['P = '+w+' + 2 × '+h,'P = '+(w+2*h)+' '+u]},{v:w+2*h+2*t,tag:'geo-hauteur',msg:'Tu as utilisé la hauteur du toit à la place de ses côtés obliques.',w:['t = √('+s+'² − '+p+'²) = '+t,'P = '+w+' + 2 × '+h+' + 2 × '+t,'P = '+(w+2*h+2*t)+' '+u]},{v:w*h+w*t/2,tag:'geo-perim-aire',msg:'Tu as calculé l\'aire.',w:['t = √('+s+'² − '+p+'²) = '+t,'P = '+w+' × '+h+' + '+w+' × '+t+' / 2','P = '+NF(w*h+w*t/2)+' '+u]}]});
}
const pib=(a,b)=>({a,b});
function genCp3(){
  const kind=pick(['disque','demi','quart','disque']), ask=pick(['aire','périmètre']);
  if(kind==='disque'){ const d=2*rnd(3,10), r=d/2, u=uP();
    const svg=figure([[-1.2,-1.2],[1.2,1.2]],f=>{ const c=f([0,0]), rr=f.s; return g.circle(c,rr)+g.seg(f([-1,0]),f([1,0]),'g-dash')+g.dot(c)+g.text([c[0],c[1]-12],d+' '+u)+g.text([c[0]+5,c[1]+12],'O','g-v','start'); },'Disque de diamètre '+d+' '+u,{H:200,pad:24});
    if(ask==='aire') return mkGeo({svg,text:'Un disque a un <b>diamètre</b> de «'+d+'» '+u+'. Calcule son aire. Donne la <b>valeur exacte</b> (avec «π»).',ask:'l\'aire du disque (valeur exacte)',val:pib(0,r*r),mode:'pi',unit:u,pow:2,placeholder:'r = 6 / 2 = 3\nA = π × 3² = 9π cm²',
      work:['r = '+d+' / 2 = '+r,'A = π × '+r+'² = '+r*r+'π '+u+'²'],
      steps:[stp('Rayon',M('r = d / 2 = '+d+' / 2 = '+r)+' '+u),stp('Aire',M('A = π × r² = π × '+r+'² = '+r*r+'π')+' '+u+'²')],hints:['Attention : on donne le diamètre, la formule utilise le rayon.'],
      mistakes:[{v:pib(0,d*d),tag:'geo-rayon',msg:'Tu as utilisé le diamètre à la place du rayon. r = d / 2.',w:['A = π × '+d+'² = '+d*d+'π '+u+'²']},{v:pib(0,2*r),tag:'geo-aire-pi',msg:'2πr est le <b>périmètre</b> du cercle (avec r, pas r²). L\'aire est πr².',w:['r = '+d+' / 2 = '+r,'A = 2 × π × '+r+' = '+2*r+'π '+u+'²']},{v:pib(0,d),tag:'geo-aire-pi',msg:'πd est le périmètre du cercle. L\'aire est πr².',w:['A = π × '+d+' = '+d+'π '+u+'²']},{v:pib(0,2*r*r),tag:'geo-aire-pi',msg:'Le facteur 2 n\'apparaît pas dans l\'aire : A = πr².',w:['r = '+d+' / 2 = '+r,'A = 2 × π × '+r+'² = '+2*r*r+'π '+u+'²']},{v:pib(0,r),tag:'geo-aire-pi',msg:'Le rayon doit être élevé au carré : A = πr².',w:['r = '+d+' / 2 = '+r,'A = π × '+r+' = '+r+'π '+u+'²']}]});
    return mkGeo({svg,text:'Un disque a un <b>diamètre</b> de «'+d+'» '+u+'. Calcule le périmètre de son cercle. Donne la <b>valeur exacte</b> (avec «π»).',ask:'le périmètre du cercle (valeur exacte)',val:pib(0,d),mode:'pi',unit:u,placeholder:'P = π × 6 = 6π cm',
      work:['r = '+d+' / 2 = '+r,'P = 2 × π × '+r+' = '+d+'π '+u],
      steps:[stp('Formule',M('P = π × d = 2 × π × r')),stp('Calcul',M('P = π × '+d+' = '+d+'π')+' '+u)],hints:['Le périmètre d\'un cercle vaut π fois son diamètre.'],
      mistakes:[{v:pib(0,2*d),tag:'geo-rayon',msg:'Tu as utilisé 2πr avec le diamètre à la place du rayon.',w:['P = 2 × π × '+d+' = '+2*d+'π '+u]},{v:pib(0,r*r),tag:'geo-aire-pi',msg:'πr² est l\'aire du disque. Le périmètre est πd = 2πr.',w:['r = '+d+' / 2 = '+r,'P = π × '+r+'² = '+r*r+'π '+u]},{v:pib(0,d*d),tag:'geo-aire-pi',msg:'Tu as calculé π × d² : ce n\'est ni le périmètre ni l\'aire (avec le bon rayon).',w:['P = π × '+d+'² = '+d*d+'π '+u]},{v:pib(0,r),tag:'geo-rayon',msg:'Il manque le facteur 2 : P = 2πr, avec r = '+r+'.',w:['r = '+d+' / 2 = '+r,'P = π × '+r+' = '+r+'π '+u]}]}); }
  if(kind==='demi'){ const r=2*rnd(2,7), u=uP();
    const svg=figure([[-1.2,-0.35],[1.2,1.2]],f=>{ const a=f([-1,0]),b=f([1,0]),rr=f.s;
      return g.path('M'+gf(a[0])+' '+gf(a[1])+' A'+gf(rr)+' '+gf(rr)+' 0 0 1 '+gf(b[0])+' '+gf(b[1])+' Z')+g.text([(a[0]+b[0])/2,a[1]+17],'diamètre '+(2*r)+' '+u); },'Demi-disque de diamètre '+2*r+' '+u,{H:170,pad:30});
    if(ask==='aire') return mkGeo({svg,text:'Un demi-disque a un diamètre de «'+2*r+'» '+u+'. Calcule son aire. Donne la <b>valeur exacte</b>.',ask:'l\'aire du demi-disque (valeur exacte)',val:pib(0,r*r/2),mode:'pi',unit:u,pow:2,placeholder:'r = ...\nA = π × r² / 2',
      work:['r = '+2*r+' / 2 = '+r,'A = π × '+r+'² / 2 = '+NF(r*r/2)+'π '+u+'²'],
      steps:[stp('Rayon',M('r = '+2*r+' / 2 = '+r)+' '+u),stp('Aire du demi-disque',M('A = π × r² / 2 = π × '+r+'² / 2 = '+r*r/2+'π')+' '+u+'²')],hints:['Un demi-disque a la moitié de l\'aire du disque complet.'],
      mistakes:[{v:pib(0,r*r),tag:'geo-demi',msg:'Tu as calculé l\'aire du disque complet : un demi-disque en vaut la moitié.',w:['r = '+2*r+' / 2 = '+r,'A = π × '+r+'² = '+r*r+'π '+u+'²']},{v:pib(0,2*r*r),tag:'geo-rayon',msg:'Tu as utilisé le diamètre à la place du rayon, puis divisé par 2.',w:['A = π × '+2*r+'² / 2 = '+2*r*r+'π '+u+'²']},{v:pib(0,4*r*r),tag:'geo-rayon',msg:'Tu as utilisé le diamètre à la place du rayon.',w:['A = π × '+2*r+'² = '+4*r*r+'π '+u+'²']}]});
    return mkGeo({svg,text:'Un demi-disque a un diamètre de «'+2*r+'» '+u+'. Calcule son périmètre (l\'arc <b>et</b> le diamètre). Donne la <b>valeur exacte</b>.',ask:'le périmètre du demi-disque (valeur exacte)',val:pib(2*r,r),mode:'pi',unit:u,placeholder:'arc = π × r = ...\ndiamètre = ...\nP = ...',
      work:['r = '+2*r+' / 2 = '+r,'P = π × '+r+' + '+2*r+' = '+2*r+' + '+r+'π '+u],
      steps:[stp('Arc de cercle','La demi-circonférence vaut '+M('π × r = '+r+'π')+' '+u),stp('Diamètre','Le contour contient aussi le diamètre : '+M(2*r+'')+' '+u),stp('Somme',M('P = '+r+'π + '+2*r)+' '+u)],hints:['Le contour d\'un demi-disque comprend l\'arc et le segment (le diamètre).'],
      mistakes:[{v:pib(0,r),tag:'geo-perim-cote',msg:'Tu as oublié le diamètre : le contour du demi-disque est fermé par un segment.',w:['r = '+2*r+' / 2 = '+r,'P = π × '+r+' = '+r+'π '+u]},{v:pib(0,2*r),tag:'geo-perim-cote',msg:'Tu as calculé le périmètre du cercle complet, sans le diamètre.',w:['r = '+2*r+' / 2 = '+r,'P = 2 × π × '+r+' = '+2*r+'π '+u]},{v:pib(4*r,2*r),tag:'geo-rayon',msg:'Tu as utilisé le diamètre à la place du rayon pour l\'arc.',w:['P = π × '+2*r+' + 2 × '+2*r+' = '+4*r+' + '+2*r+'π '+u]},{v:pib(0,r*r/2),tag:'geo-perim-aire',msg:'Tu as calculé l\'aire.',w:['r = '+2*r+' / 2 = '+r,'P = π × '+r+'² / 2 = '+NF(r*r/2)+'π '+u]}]}); }
  const r=2*rnd(2,6), u=uP();
  const svg=figure([[-0.3,-0.3],[1.2,1.2]],f=>{ const o=f([0,0]),a=f([1,0]),b=f([0,1]),rr=f.s;
    return g.path('M'+gf(o[0])+' '+gf(o[1])+' L'+gf(a[0])+' '+gf(a[1])+' A'+gf(rr)+' '+gf(rr)+' 0 0 0 '+gf(b[0])+' '+gf(b[1])+' Z')+g.right(o,a,b,10)+g.text([(o[0]+a[0])/2,o[1]+15],r+' '+u)+g.text([o[0]-18,o[1]+4],'O','g-v'); },'Quart de disque de rayon '+r+' '+u,{H:200,pad:28});
  if(ask==='aire') return mkGeo({svg,text:'Un quart de disque a un rayon de «'+r+'» '+u+'. Calcule son aire. Donne la <b>valeur exacte</b>.',ask:'l\'aire du quart de disque (valeur exacte)',val:pib(0,r*r/4),mode:'pi',unit:u,pow:2,placeholder:'A = π × r² / 4',
    work:['A = π × '+r+'² / 4 = '+NF(r*r/4)+'π '+u+'²'],
    steps:[stp('Aire du disque',M('π × '+r+'² = '+r*r+'π')),stp('Un quart',M('A = '+r*r+'π / 4 = '+r*r/4+'π')+' '+u+'²')],hints:['Un quart de disque a le quart de l\'aire du disque complet.'],
    mistakes:[{v:pib(0,r*r),tag:'geo-demi',msg:'C\'est l\'aire du disque complet. Un quart de disque en vaut le quart.',w:['A = π × '+r+'² = '+r*r+'π '+u+'²']},{v:pib(0,r*r/2),tag:'geo-demi',msg:'C\'est l\'aire d\'un demi-disque. Ici, c\'est un quart.',w:['A = π × '+r+'² / 2 = '+NF(r*r/2)+'π '+u+'²']},{v:pib(0,r/2),tag:'geo-aire-pi',msg:'Le rayon doit être au carré dans l\'aire.',w:['A = 2 × π × '+r+' / 4 = '+NF(r/2)+'π '+u+'²']}]});
  return mkGeo({svg,text:'Un quart de disque a un rayon de «'+r+'» '+u+'. Calcule son périmètre (l\'arc et les deux rayons). Donne la <b>valeur exacte</b>.',ask:'le périmètre du quart de disque (valeur exacte)',val:pib(2*r,r/2),mode:'pi',unit:u,placeholder:'arc = 2 × π × r / 4\n...',
    work:['L = 2 × π × '+r+' / 4 = '+NF(r/2)+'π','P = '+NF(r/2)+'π + 2 × '+r+' = '+2*r+' + '+NF(r/2)+'π '+u],
    steps:[stp('Arc','Un quart du cercle : '+M('2π × '+r+' / 4 = '+r/2+'π')+' '+u),stp('Les deux rayons',M('2 × '+r+' = '+2*r)+' '+u),stp('Somme',M('P = '+r/2+'π + '+2*r)+' '+u)],hints:['Le contour comprend l\'arc et les deux rayons qui le ferment.'],
    mistakes:[{v:pib(0,r/2),tag:'geo-perim-cote',msg:'Tu as oublié les deux rayons qui ferment le contour.',w:['L = 2 × π × '+r+' / 4 = '+NF(r/2)+'π','P = '+NF(r/2)+'π '+u]},{v:pib(r,r/2),tag:'geo-perim-cote',msg:'Il y a deux rayons dans le contour, pas un seul.',w:['L = 2 × π × '+r+' / 4 = '+NF(r/2)+'π','P = '+NF(r/2)+'π + '+r+' = '+r+' + '+NF(r/2)+'π '+u]},{v:pib(0,2*r),tag:'geo-decomp',msg:'C\'est le cercle entier : il faut un quart de la circonférence.',w:['L = 2 × π × '+r+' = '+2*r+'π','P = '+2*r+'π '+u]},{v:pib(0,r*r/4),tag:'geo-perim-aire',msg:'Tu as calculé l\'aire.',w:['P = π × '+r+'² / 4 = '+NF(r*r/4)+'π '+u]}]});
}
function genCp4(){
  const u=uP(), ask=pick(['aire','périmètre']);
  if(Math.random()<0.55){ const d=2*rnd(2,6), r=d/2, L=rnd(d+1,d+9);
    const svg=figure([[-r,-r],[L+r,r]],f=>{ const a=f([0,-r]),b=f([L,-r]),c=f([L,r]),e=f([0,r]),rr=f.s*r, ce=f([L/2,0]);
      return g.path('M'+gf(a[0])+' '+gf(a[1])+' L'+gf(b[0])+' '+gf(b[1])+' A'+gf(rr)+' '+gf(rr)+' 0 0 0 '+gf(c[0])+' '+gf(c[1])+' L'+gf(e[0])+' '+gf(e[1])+' A'+gf(rr)+' '+gf(rr)+' 0 0 0 '+gf(a[0])+' '+gf(a[1])+' Z')
        +g.seg(a,e,'g-dash g-thin')+g.seg(b,c,'g-dash g-thin')+g.text([(a[0]+b[0])/2,a[1]+17],L+' '+u)+g.text([a[0]+9,ce[1]],d+' '+u,'','start'); },'Piste : un rectangle et deux demi-disques',{H:200,pad:34});
    if(ask==='aire') return mkGeo({svg,text:'Une piste est formée d\'un rectangle de longueur «'+L+'» '+u+' et de largeur «'+d+'» '+u+', et de deux demi-disques de diamètre «'+d+'» '+u+' aux extrémités. Calcule l\'aire de la piste. Valeur exacte.',ask:'l\'aire de la piste (valeur exacte)',val:pib(L*d,r*r),mode:'pi',unit:u,pow:2,placeholder:'rectangle : ...\ndeux demi-disques = un disque de rayon ...\nA = ...',
      work:['A1 = '+L+' × '+d+' = '+L*d,'r = '+d+' / 2 = '+r,'A2 = π × '+r+'² = '+r*r+'π','A = '+L*d+' + '+r*r+'π '+u+'²'],
      steps:[stp('Rectangle',M(L+' × '+d+' = '+L*d)),stp('Deux demi-disques','Ensemble, ils forment un disque de rayon '+M('r = '+d+' / 2 = '+r)+' : '+M('π × '+r+'² = '+r*r+'π')),stp('Somme',M('A = '+L*d+' + '+r*r+'π')+' '+u+'²')],hints:['Deux demi-disques identiques font un disque entier.'],
      mistakes:[{v:pib(L*d,r*r/2),tag:'geo-decomp',msg:'Il y a deux demi-disques, donc un disque entier, pas un seul demi-disque.',w:['A1 = '+L+' × '+d+' = '+L*d,'r = '+d+' / 2 = '+r,'A2 = π × '+r+'² / 2 = '+NF(r*r/2)+'π','A = '+L*d+' + '+NF(r*r/2)+'π '+u+'²']},{v:pib(L*d,d*d),tag:'geo-rayon',msg:'Tu as utilisé le diamètre à la place du rayon dans πr².',w:['A1 = '+L+' × '+d+' = '+L*d,'A2 = π × '+d+'² = '+d*d+'π','A = '+L*d+' + '+d*d+'π '+u+'²']},{v:pib(L*d,r*r*2),tag:'geo-decomp',msg:'Deux demi-disques valent un seul disque, pas deux.',w:['A1 = '+L+' × '+d+' = '+L*d,'r = '+d+' / 2 = '+r,'A2 = 2 × π × '+r+'² = '+2*r*r+'π','A = '+L*d+' + '+2*r*r+'π '+u+'²']},{v:pib(L*d,0),tag:'geo-decomp',msg:'Tu as oublié les deux demi-disques.',w:['A1 = '+L+' × '+d+' = '+L*d,'A = '+L*d+' '+u+'²']}]});
    return mkGeo({svg,text:'Une piste est formée d\'un rectangle de longueur «'+L+'» '+u+' et de largeur «'+d+'» '+u+', et de deux demi-disques de diamètre «'+d+'» '+u+' aux extrémités. Calcule le périmètre de la piste (le tour complet). Valeur exacte.',ask:'le périmètre de la piste (valeur exacte)',val:pib(2*L,d),mode:'pi',unit:u,placeholder:'deux côtés droits : ...\ndeux demi-cercles = un cercle : ...\nP = ...',
      work:['P1 = 2 × '+L+' = '+2*L,'P2 = π × '+d+' = '+d+'π','P = '+2*L+' + '+d+'π '+u],
      steps:[stp('Deux côtés droits',M('2 × '+L+' = '+2*L)),stp('Deux demi-cercles','Ensemble, ils forment un cercle de diamètre '+d+' : '+M('π × '+d+' = '+d+'π')),stp('Somme',M('P = '+2*L+' + '+d+'π')+' '+u)],hints:['Les segments de largeur d sont à l\'intérieur de la piste : ils ne font pas partie du tour.'],
      mistakes:[{v:pib(2*L+2*d,d),tag:'geo-perim-cote',msg:'Les deux côtés de largeur ne font pas partie du contour : ils sont remplacés par les demi-cercles.',w:['P1 = 2 × '+L+' + 2 × '+d+' = '+(2*L+2*d),'P2 = π × '+d+' = '+d+'π','P = '+(2*L+2*d)+' + '+d+'π '+u]},{v:pib(2*L,d/2),tag:'geo-rayon',msg:'Tu as utilisé πr au lieu de πd (ou 2πr) pour les deux demi-cercles.',w:['P1 = 2 × '+L+' = '+2*L,'r = '+d+' / 2 = '+r,'P2 = π × '+r+' = '+NF(r)+'π','P = '+2*L+' + '+NF(d/2)+'π '+u]},{v:pib(L*d,r*r),tag:'geo-perim-aire',msg:'Tu as calculé l\'aire.',w:['P1 = '+L+' × '+d+' = '+L*d,'P2 = π × '+r+'² = '+r*r+'π','P = '+L*d+' + '+r*r+'π '+u]},{v:pib(2*L,2*d),tag:'geo-decomp',msg:'Deux demi-cercles font un seul cercle, de périmètre πd.',w:['P1 = 2 × '+L+' = '+2*L,'P2 = 2 × π × '+d+' = '+2*d+'π','P = '+2*L+' + '+2*d+'π '+u]}]}); }
  const r=2*rnd(1,4), w=2*r, h=rnd(3,9);
  const svg=figure([[0,0],[w,h+r]],f=>{ const a=f([0,0]),b=f([w,0]),c=f([w,h]),e=f([0,h]),rr=f.s*r;
    return g.path('M'+gf(a[0])+' '+gf(a[1])+' L'+gf(b[0])+' '+gf(b[1])+' L'+gf(c[0])+' '+gf(c[1])+' A'+gf(rr)+' '+gf(rr)+' 0 0 0 '+gf(e[0])+' '+gf(e[1])+' Z')+g.seg(e,c,'g-dash g-thin')
      +g.text([(a[0]+b[0])/2,a[1]+17],w+' '+u)+g.len(a,e,h+' '+u,f([w,0]),15); },'Fenêtre : rectangle surmonté d\'un demi-disque',{H:230,pad:34});
  if(ask==='aire') return mkGeo({svg,text:'Une fenêtre est formée d\'un rectangle de largeur «'+w+'» '+u+' et de hauteur «'+h+'» '+u+', surmonté d\'un demi-disque dont le diamètre est la largeur du rectangle. Calcule l\'aire de la fenêtre. Valeur exacte.',ask:'l\'aire de la fenêtre (valeur exacte)',val:pib(w*h,r*r/2),mode:'pi',unit:u,pow:2,placeholder:'rectangle : ...\ndemi-disque : ...\nA = ...',
    work:['A1 = '+w+' × '+h+' = '+w*h,'r = '+w+' / 2 = '+r,'A2 = π × '+r+'² / 2 = '+NF(r*r/2)+'π','A = '+w*h+' + '+NF(r*r/2)+'π '+u+'²'],
    steps:[stp('Rectangle',M(w+' × '+h+' = '+w*h)),stp('Demi-disque','Rayon '+M('r = '+w+' / 2 = '+r)+' : '+M('π × '+r+'² / 2 = '+r*r/2+'π')),stp('Somme',M('A = '+w*h+' + '+r*r/2+'π')+' '+u+'²')],hints:['Le rayon du demi-disque est la moitié de la largeur.'],
    mistakes:[{v:pib(w*h,r*r),tag:'geo-demi',msg:'Tu as ajouté un disque entier : il s\'agit d\'un demi-disque.',w:['A1 = '+w+' × '+h+' = '+w*h,'r = '+w+' / 2 = '+r,'A2 = π × '+r+'² = '+r*r+'π','A = '+w*h+' + '+r*r+'π '+u+'²']},{v:pib(w*h,w*w/2),tag:'geo-rayon',msg:'Tu as utilisé la largeur (diamètre) à la place du rayon.',w:['A1 = '+w+' × '+h+' = '+w*h,'A2 = π × '+w+'² / 2 = '+NF(w*w/2)+'π','A = '+w*h+' + '+NF(w*w/2)+'π '+u+'²']},{v:pib(w*h,0),tag:'geo-decomp',msg:'Tu as oublié le demi-disque.',w:['A1 = '+w+' × '+h+' = '+w*h,'A = '+w*h+' '+u+'²']}]});
  return mkGeo({svg,text:'Une fenêtre est formée d\'un rectangle de largeur «'+w+'» '+u+' et de hauteur «'+h+'» '+u+', surmonté d\'un demi-disque dont le diamètre est la largeur du rectangle. Calcule le périmètre de la fenêtre. Valeur exacte.',ask:'le périmètre de la fenêtre (valeur exacte)',val:pib(w+2*h,r),mode:'pi',unit:u,placeholder:'base + 2 côtés + demi-cercle',
    work:['P1 = '+w+' + 2 × '+h+' = '+(w+2*h),'r = '+w+' / 2 = '+r,'P2 = π × '+r+' = '+r+'π','P = '+(w+2*h)+' + '+r+'π '+u],
    steps:[stp('Trois côtés du rectangle','La base et les deux côtés verticaux : '+M(w+' + 2 × '+h+' = '+(w+2*h))),stp('Demi-cercle','Le côté du haut est remplacé par l\'arc : '+M('π × r = '+r+'π')),stp('Somme',M('P = '+(w+2*h)+' + '+r+'π')+' '+u)],hints:['Le côté du rectangle qui porte le demi-disque n\'est pas sur le contour.'],
    mistakes:[{v:pib(2*w+2*h,r),tag:'geo-perim-cote',msg:'Tu as compté le côté supérieur du rectangle : il est recouvert par le demi-disque et n\'appartient pas au contour.',w:['P1 = 2 × '+w+' + 2 × '+h+' = '+(2*w+2*h),'r = '+w+' / 2 = '+r,'P2 = π × '+r+' = '+r+'π','P = '+(2*w+2*h)+' + '+r+'π '+u]},{v:pib(w+2*h,w),tag:'geo-decomp',msg:'πw est le périmètre du cercle entier. Il n\'y a qu\'un demi-cercle : π × r.',w:['P1 = '+w+' + 2 × '+h+' = '+(w+2*h),'P2 = π × '+w+' = '+w+'π','P = '+(w+2*h)+' + '+w+'π '+u]},{v:pib(w+2*h,2*r),tag:'geo-rayon',msg:'Tu as utilisé πd pour un demi-cercle : π × r suffit.',w:['P1 = '+w+' + 2 × '+h+' = '+(w+2*h),'r = '+w+' / 2 = '+r,'P2 = 2 × π × '+r+' = '+2*r+'π','P = '+(w+2*h)+' + '+2*r+'π '+u]},{v:pib(w*h,r*r/2),tag:'geo-perim-aire',msg:'Tu as calculé l\'aire.',w:['P1 = '+w+' × '+h+' = '+w*h,'r = '+w+' / 2 = '+r,'P2 = π × '+r+'² / 2 = '+NF(r*r/2)+'π','P = '+w*h+' + '+NF(r*r/2)+'π '+u]}]});
}
function genCp5(){
  const u=uP(), v=pick(['carre','couronne','inscrit']);
  if(v==='carre'){ const c=2*rnd(3,7), r=c/2;
    const hh=g.hatch();
    const svg=figure([[0,0],[c,c]],f=>{ const a=f([0,0]),b=f([c,0]),cc=f([c,c]),d=f([0,c]),ce=f([r,r]);
      return hh.def+g.hatchify(g.poly([a,b,cc,d]),hh.fill)+g.circle(ce,f.s*r,'g-hole')+g.text([(a[0]+b[0])/2,a[1]+17],c+' '+u)+g.dot(ce); },'Carré de côté '+c+' avec un disque inscrit retiré',{H:230,pad:30});
    return mkGeo({svg,text:'Un carré de côté «'+c+'» '+u+' contient un disque inscrit (le disque touche les quatre côtés). Calcule l\'aire de la partie <b>hachurée</b> (le carré privé du disque). Valeur exacte.',ask:'l\'aire hachurée (valeur exacte)',val:pib(c*c,-r*r),mode:'pi',unit:u,pow:2,placeholder:'carré : ...\ndisque de rayon ... : ...\nA = ... − ...π',
      work:['A1 = '+c+'² = '+c*c,'r = '+c+' / 2 = '+r,'A2 = π × '+r+'² = '+r*r+'π','A = '+c*c+' − '+r*r+'π '+u+'²'],
      steps:[stp('Carré',M(c+'² = '+c*c)),stp('Disque inscrit','Son diamètre vaut le côté du carré, donc '+M('r = '+c+' / 2 = '+r)+' : '+M('π × '+r+'² = '+r*r+'π')),stp('Soustraction',M('A = '+c*c+' − '+r*r+'π')+' '+u+'²')],hints:['Aire hachurée = aire du carré − aire du disque.','Le diamètre du disque égale le côté du carré.'],
      mistakes:[{v:pib(c*c,-c*c),tag:'geo-rayon',msg:'Tu as utilisé le diamètre à la place du rayon dans πr².',w:['A1 = '+c+'² = '+c*c,'A2 = π × '+c+'² = '+c*c+'π','A = '+c*c+' − '+c*c+'π '+u+'²']},{v:pib(-c*c,r*r),tag:'geo-decomp',msg:'Tu as fait disque − carré : la partie hachurée est le carré privé du disque.',w:['A1 = '+c+'² = '+c*c,'r = '+c+' / 2 = '+r,'A2 = π × '+r+'² = '+r*r+'π','A = '+r*r+'π − '+c*c+' '+u+'²']},{v:pib(c*c,0),tag:'geo-decomp',msg:'Tu n\'as pas retiré le disque.',w:['A1 = '+c+'² = '+c*c,'A = '+c*c+' '+u+'²']},{v:pib(c*c,-2*r),tag:'geo-aire-pi',msg:'2πr est le périmètre. L\'aire du disque est πr².',w:['A1 = '+c+'² = '+c*c,'r = '+c+' / 2 = '+r,'A2 = 2 × π × '+r+' = '+2*r+'π','A = '+c*c+' − '+2*r+'π '+u+'²']}]}); }
  if(v==='couronne'){ const R=rnd(4,9), r=rnd(2,R-1);
    const hh=g.hatch();
    const svg=figure([[-R,-R],[R,R]],f=>{ const c=f([0,0]);
      return hh.def+g.hatchify(g.circle(c,f.s*R),hh.fill)+g.circle(c,f.s*r,'g-hole')+g.dot(c)+g.seg(c,f([R*Math.cos(0.6),R*Math.sin(0.6)]),'g-thin')+g.seg(c,f([-r,0]),'g-thin')+g.text(f([R*0.55,R*0.62]),R+' '+u,'g-num')+g.text(f([-r*0.5,-r*0.42]),r+' '+u,'g-num'); },'Couronne de rayons '+R+' et '+r,{H:230,pad:24});
    return mkGeo({svg,text:'Une couronne est limitée par deux cercles de même centre, de rayons «'+R+'» '+u+' et «'+r+'» '+u+'. Calcule l\'aire de la couronne (partie hachurée). Valeur exacte.',ask:'l\'aire de la couronne (valeur exacte)',val:pib(0,R*R-r*r),mode:'pi',unit:u,pow:2,placeholder:'grand disque : ...\npetit disque : ...\nA = ...',
      work:['A1 = π × '+R+'² = '+R*R+'π','A2 = π × '+r+'² = '+r*r+'π','A = '+R*R+'π − '+r*r+'π = '+(R*R-r*r)+'π '+u+'²'],
      steps:[stp('Grand disque',M('π × '+R+'² = '+R*R+'π')),stp('Petit disque',M('π × '+r+'² = '+r*r+'π')),stp('Différence',M('A = '+R*R+'π − '+r*r+'π = '+(R*R-r*r)+'π')+' '+u+'²')],hints:['Aire de la couronne = aire du grand disque − aire du petit disque.'],
      mistakes:[{v:pib(0,(R-r)*(R-r)),tag:'geo-decomp',msg:'(R − r)² n\'est pas égal à R² − r². Calcule chaque aire, puis soustrais.',w:['A = π × ('+R+' − '+r+')² = '+((R-r)*(R-r)===1?'':(R-r)*(R-r))+'π '+u+'²']},{v:pib(0,R*R),tag:'geo-decomp',msg:'Tu n\'as pas retiré le petit disque.',w:['A1 = π × '+R+'² = '+R*R+'π','A = '+R*R+'π '+u+'²']},{v:pib(0,R*R+r*r),tag:'geo-decomp',msg:'Il faut soustraire l\'aire du petit disque, pas l\'ajouter.',w:['A1 = π × '+R+'² = '+R*R+'π','A2 = π × '+r+'² = '+r*r+'π','A = '+R*R+'π + '+r*r+'π = '+(R*R+r*r)+'π '+u+'²']},{v:pib(0,2*(R-r)),tag:'geo-aire-pi',msg:'Tu as calculé une différence de périmètres. L\'aire d\'un disque est πr².',w:['A1 = 2 × π × '+R+' = '+2*R+'π','A2 = 2 × π × '+r+' = '+2*r+'π','A = '+2*R+'π − '+2*r+'π = '+2*(R-r)+'π '+u+'²']}]}); }
  const R=rnd(3,8), hh=g.hatch();
  const svg=figure([[-R,-R],[R,R]],f=>{ const c=f([0,0]), pts=[[R,0],[0,R],[-R,0],[0,-R]].map(f);
    return hh.def+g.hatchify(g.circle(c,f.s*R),hh.fill)+g.poly(pts,'g-hole')+g.seg(f([-R,0]),f([R,0]),'g-dash g-thin')+g.seg(f([0,-R]),f([0,R]),'g-dash g-thin')+g.dot(c)+g.text(f([R*0.5,R*0.1]),R+' '+u,'g-num')+g.right(c,pts[0],pts[1],8); },'Carré inscrit dans un disque de rayon '+R,{H:230,pad:24});
  return mkGeo({svg,text:'Un carré est inscrit dans un disque de rayon «'+R+'» '+u+' : ses quatre sommets sont sur le cercle, et ses diagonales sont des diamètres perpendiculaires. Calcule l\'aire de la partie hachurée (le disque privé du carré). Valeur exacte.',ask:'l\'aire hachurée (valeur exacte)',val:pib(-2*R*R,R*R),mode:'pi',unit:u,pow:2,placeholder:'disque : ...\ncarré : diagonale = ..., aire = d²/2\nA = ...',
    work:['A1 = π × '+R+'² = '+R*R+'π','d = 2 × '+R+' = '+2*R,'A2 = '+2*R+'² / 2 = '+2*R*R,'A = '+R*R+'π − '+2*R*R+' '+u+'²'],
    steps:[stp('Disque',M('π × '+R+'² = '+R*R+'π')),stp('Carré','Sa diagonale est un diamètre : '+M('d = 2 × '+R+' = '+2*R)+'. Un carré de diagonale d a pour aire '+M('d² / 2 = '+(2*R)+'² / 2 = '+2*R*R)),stp('Différence',M('A = '+R*R+'π − '+2*R*R)+' '+u+'²')],hints:['Un carré est un losange : son aire vaut (diagonale × diagonale) / 2.','Ici les deux diagonales valent 2R.'],
    mistakes:[{v:pib(-R*R,R*R),tag:'geo-decomp',msg:'Le carré n\'a pas pour côté R. Sa diagonale vaut 2R, son aire (2R)² / 2 = '+2*R*R+'.',w:['A1 = π × '+R+'² = '+R*R+'π','A2 = '+R+'² = '+R*R,'A = '+R*R+'π − '+R*R+' '+u+'²']},{v:pib(-4*R*R,R*R),tag:'geo-decomp',msg:'Le carré n\'a pas pour côté 2R : 2R est sa diagonale.',w:['A1 = π × '+R+'² = '+R*R+'π','d = 2 × '+R+' = '+2*R,'A2 = '+2*R+'² = '+4*R*R,'A = '+R*R+'π − '+4*R*R+' '+u+'²']},{v:pib(0,R*R),tag:'geo-decomp',msg:'Tu n\'as pas retiré le carré.',w:['A1 = π × '+R+'² = '+R*R+'π','A = '+R*R+'π '+u+'²']},{v:pib(2*R*R,-R*R),tag:'geo-decomp',msg:'Tu as fait carré − disque : la partie hachurée est le disque privé du carré.',w:['A1 = π × '+R+'² = '+R*R+'π','d = 2 × '+R+' = '+2*R,'A2 = '+2*R+'² / 2 = '+2*R*R,'A = '+2*R*R+' − '+R*R+'π '+u+'²']}]});
}
TOPICS['gm-1']={kind:'gcomp',level:1,label:'Figure en L (rectangles)',gen:genCp1};
TOPICS['gm-2']={kind:'gcomp',level:2,label:'Rectangle et triangle',gen:genCp2};
TOPICS['gm-3']={kind:'gcomp',level:3,label:'Disque, demi-disque, quart de disque',gen:genCp3};
TOPICS['gm-4']={kind:'gcomp',level:4,label:'Piste et fenêtre',gen:genCp4};
TOPICS['gm-5']={kind:'gcomp',level:5,label:'Aires hachurées',gen:genCp5};
