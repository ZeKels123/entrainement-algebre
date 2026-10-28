'use strict';
/* ===== Géométrie : angles et unités, problèmes du livre avec π et √ ===== */
Object.assign(TAGS,{
  'geo-reuleaux':{label:'Aire de l\'intersection des trois cercles',tip:'L\'intersection = 3 secteurs de 60° (chacun πr²/6) moins 2 fois le triangle équilatéral de côté r (√3/4 r²) : chaque triangle est compté trois fois, on veut le compter une fois.'},
  'geo-empilement':{label:'Empilement de cercles',tip:'Les centres de deux rangées voisines forment un triangle équilatéral de côté 2y : la hauteur entre rangées vaut y√3, pas 2y.'}
});
const gcd_=(a,b)=>b?gcd_(b,a%b):Math.abs(a);
const fracPi=(num,den)=>{ const d=gcd_(num,den); num/=d; den/=d; return {num,den,str:(num===1?'':num)+'π'+(den===1?'':'/'+den)}; };
/* écriture exacte d'un rationnel pour les copies d'élèves : décimal fini (virgule) ou fraction p/q */
const kX=x=>{ const sg=x<0?'−':''; x=Math.abs(x); for(let d=1;d<=1000;d++){ const n=Math.round(x*d); if(Math.abs(x*d-n)<1e-7*Math.max(1,x*d)){ let q=d; while(q%2===0) q/=2; while(q%5===0) q/=5; return sg+(q===1?String(n/d).replace('.',','):n+'/'+d); } } return sg+String(Math.round(x*1e6)/1e6).replace('.',','); };
const kSym=(c,sym)=>{ const t=kX(c), i=t.indexOf('/'); if(i<0) return (t==='1'?'':t==='−1'?'−':t)+sym; const nu=t.slice(0,i); return (nu==='1'?'':nu==='−1'?'−':nu)+sym+t.slice(i); };
const kPi=c=>kSym(c,'π'), kRt=(c,n)=>kSym(c,'√'+n);
const kPar=s=>/[\/+− ]/.test(s)?'('+s+')':s;
const kD6=x=>String(Math.round(x*1e6)/1e6).replace('.',',');

/* ----- petites figures d'angles ----- */
function figSector(deg){
  return figure([[-1.2,-1.2],[1.2,1.2]],f=>{
    const c=f([0,0]), s=f.s, P=a=>f([Math.cos(a*Math.PI/180),Math.sin(a*Math.PI/180)]), e=P(deg);
    const d='M'+gf(c[0])+' '+gf(c[1])+' L'+gf(P(0)[0])+' '+gf(P(0)[1])+' A'+gf(s)+' '+gf(s)+' 0 '+(deg>180?1:0)+' 0 '+gf(e[0])+' '+gf(e[1])+' Z';
    return g.circle(c,s,'g-circle')+g.path(d,'g-f')+g.dot(c);
  },'Disque et secteur angulaire',{H:170,pad:14});
}
/* deux parallèles coupées par une sécante ; lab = {pos:'T|B'+'UL|UR|LL|LR' : texte} */
function figPar(theta,lab,unk){
  const th=theta*Math.PI/180, u=[Math.cos(th),Math.sin(th)];
  return figure([[-2.2,-1],[2.2,1]],f=>{
    const T=f([u[0]*0.9,0.9*u[1]/u[1]*0+1]), B=f([-u[0]*0.9,-1]);
    // T sur y=+1 , B sur y=-1 (même droite : direction u)
    const tt=1/u[1], Tm=f([u[0]*tt,1]), Bm=f([-u[0]*tt,-1]);
    let out=g.seg(f([-2.2,1]),f([2.2,1]))+g.seg(f([-2.2,-1]),f([2.2,-1]))+g.seg(f([-u[0]*tt*1.35,-1.35]),f([u[0]*tt*1.35,1.35]));
    const L=48, dirs={R:[1,0],L:[-1,0],U:[u[0],-u[1]],D:[-u[0],u[1]]}; // repère écran (y inversé)
    const reg={UR:['R','U'],UL:['U','L'],LL:['L','D'],LR:['D','R']};
    const pts={T:Tm,B:Bm};
    Object.keys(lab).forEach(k=>{
      const P=pts[k[0]], rg=reg[k.slice(1)], a=vadd(P,vmul(dirs[rg[0]],L)), b=vadd(P,vmul(dirs[rg[1]],L));
      out+=g.arc(P,a,b,17,lab[k],unk===k?'g-u':'g-a');
    });
    out+=g.text([f([-2.2,1])[0]+6,f([-2.2,1])[1]-11],'(d₁)','g-v','start')+g.text([f([-2.2,-1])[0]+6,f([-2.2,-1])[1]+12],'(d₂)','g-v','start');
    return out;
  },'Deux droites parallèles coupées par une sécante',{H:200,pad:30});
}
const REGN={UL:'en haut à gauche',UR:'en haut à droite',LL:'en bas à gauche',LR:'en bas à droite'};
const CLS={UR:0,LL:0,UL:1,LR:1};

/* gang-1 : degrés, grades, tours */
function genAng1(){
  const t=pick([0,1,2,3]);
  if(t===0){ const gr=10*rnd(2,39), deg=gr*0.9; const svg=figSector(deg);
    return mkGeo({svg,text:'Un angle mesure «'+gr+'» grades. Convertis-le en degrés. (Un tour complet = 360° = 400 grades.)',ask:'l\'angle en degrés',val:deg,unit:'°',
      placeholder:'x = '+gr+' × 360 / 400',steps:[stp('Proportionnalité',M('400 grades = 360°')),stp('Calcule',M('x = '+gr+' × 360 / 400 = '+gr+' × 0,9 = '+NF(deg))+'°')],hints:['400 grades = 360°, donc 1 grade = 0,9°.'],
      work:['x = '+gr+' × 360 / 400 = '+NF(deg)+'°'],
      mistakes:[{v:gr*400/360,tag:'geo-unite-angle',msg:'Tu as converti dans le mauvais sens (degrés → grades).',w:['x = '+gr+' × 400 / 360 = '+kX(gr*400/360)+'°']},{v:gr*1.1,tag:'geo-unite-angle',msg:'Tu as multiplié par 400/360 au lieu de 360/400.',w:['x = '+gr+' × 1,1 = '+NF(gr*1.1)+'°']},{v:gr/360*400,tag:'geo-unite-angle',msg:'Tu as converti dans le mauvais sens.',w:['x = '+gr+' / 360 × 400 = '+kX(gr/360*400)+'°']}]}); }
  if(t===1){ const deg=9*rnd(2,39), gr=deg/0.9; const svg=figSector(deg);
    return mkGeo({svg,text:'Un angle mesure «'+deg+'°». Convertis-le en grades. (Un tour complet = 360° = 400 grades.)',ask:'l\'angle en grades',val:gr,unit:'',
      placeholder:'x = '+deg+' × 400 / 360',steps:[stp('Proportionnalité',M('360° = 400 grades')),stp('Calcule',M('x = '+deg+' × 400 / 360 = '+NF(gr)))],hints:['360° = 400 grades, donc 1° = 400/360 grades.'],
      work:['x = '+deg+' × 400 / 360 = '+NF(gr)],
      mistakes:[{v:deg*0.9,tag:'geo-unite-angle',msg:'Tu as converti dans le mauvais sens (grades → degrés).',w:['x = '+deg+' × 360 / 400 = '+NF(deg*0.9)]},{v:deg*400/180,tag:'geo-unite-angle',msg:'Tu as utilisé 180 au lieu de 360 (c\'est un demi-tour).',w:['x = '+deg+' × 400 / 180 = '+kX(deg*400/180)]}]}); }
  const fr=pick(t===2?[[1,8],[3,8],[5,8],[1,6],[5,6],[1,12],[7,12],[1,5],[2,5],[3,10],[1,3],[2,3]]:[[1,8],[3,8],[5,8],[1,5],[2,5],[3,10],[1,10],[7,10],[1,4],[3,4]]), deg=360*fr[0]/fr[1], gr=400*fr[0]/fr[1];
  if(t===2){ const svg=figSector(deg);
    return mkGeo({svg,text:'Un angle représente «'+fr[0]+'/'+fr[1]+'» de tour. Donne sa mesure en degrés.',ask:'l\'angle en degrés',val:deg,unit:'°',placeholder:'x = 360 × '+fr[0]+' / '+fr[1],
      steps:[stp('Un tour = 360°',M('x = 360 × '+fr[0]+' / '+fr[1]+' = '+NF(deg))+'°')],hints:['Un tour complet mesure 360°.'],
      work:['x = 360 × '+fr[0]+' / '+fr[1]+' = '+NF(deg)+'°'],
      mistakes:[{v:180*fr[0]/fr[1],tag:'geo-unite-angle',msg:'Tu as utilisé 180 : c\'est un demi-tour. Un tour complet = 360°.',w:['x = 180 × '+fr[0]+' / '+fr[1]+' = '+kX(180*fr[0]/fr[1])+'°']},{v:gr,tag:'geo-unite-angle',msg:'Tu as calculé en grades (400 par tour) au lieu de degrés.',w:['x = 400 × '+fr[0]+' / '+fr[1]+' = '+kX(gr)]}]}); }
  const svg=figSector(deg);
  return mkGeo({svg,text:'Un angle mesure «'+deg+'°». Quelle fraction de tour est-ce, et combien de grades ? Donne la mesure en <b>grades</b>.',ask:'l\'angle en grades',val:gr,unit:'',placeholder:'fraction = '+deg+' / 360\nx = 400 × fraction',
    steps:[stp('Fraction de tour',M(deg+' / 360 = '+fr[0]+' / '+fr[1])),stp('Grades',M('400 × '+fr[0]+' / '+fr[1]+' = '+NF(gr)))],hints:['Un tour = 400 grades.'],
    work:['f = '+deg+' / 360 = '+fr[0]+' / '+fr[1],'x = 400 × '+fr[0]+' / '+fr[1]+' = '+NF(gr)],
    mistakes:[{v:deg,tag:'geo-unite-angle',msg:'Tu as gardé la valeur en degrés.',w:['f = '+deg+' / 360 = '+fr[0]+' / '+fr[1],'x = '+deg]},{v:deg*0.9,tag:'geo-unite-angle',msg:'Tu as converti dans le mauvais sens.',w:['f = '+deg+' / 360 = '+fr[0]+' / '+fr[1],'x = '+deg+' × 360 / 400 = '+NF(deg*0.9)]}]});
}

/* gang-2 : degrés ↔ radians */
function genAng2(){
  const deg=pick([30,45,60,90,120,135,150,180,210,225,240,270,300,315,330,360]);
  const f=fracPi(deg,180), svg=figSector(deg);
  if(Math.random()<0.55){
    return mkGeo({svg,text:'Convertis «'+deg+'°» en radians (π rad = 180°). Donne la valeur exacte, en fonction de π.',ask:'l\'angle en radians (valeur exacte)',val:{a:0,b:deg/180},mode:'pi',exact:f.str,unit:'',
      placeholder:'x = '+deg+' × π / 180',steps:[stp('Proportionnalité',M('180° = π rad')),stp('Calcule',M('x = '+deg+' × π / 180 = '+f.str)+' rad')],hints:['180° = π radians, donc a° = a × π / 180.'],
      work:['x = '+deg+' × π / 180 = '+f.str],
      mistakes:[{v:{a:0,b:deg/360},tag:'geo-unite-angle',msg:'Tu as utilisé 360 : un tour complet vaut 2π rad, donc 180° = π rad.',w:['x = '+deg+' × π / 360 = '+fracPi(deg,360).str]},{v:{a:0,b:deg/90},tag:'geo-unite-angle',msg:'Tu as utilisé 90 au lieu de 180.',w:['x = '+deg+' × π / 90 = '+fracPi(deg,90).str]},{v:{a:0,b:180/deg},tag:'geo-unite-angle',msg:'Tu as inversé la fraction.',w:['x = 180 × π / '+deg+' = '+fracPi(180,deg).str]}]});
  }
  const e_=c=>f.num+' × '+c+(f.den===1?'':' / '+f.den);
  return mkGeo({svg,text:'Un angle mesure «'+f.str+'» radians. Convertis-le en degrés (π rad = 180°).',ask:'l\'angle en degrés',val:deg,unit:'°',
    placeholder:'x = '+f.str.replace('π','')+' × 180',steps:[stp('Remplace π par 180°',M('x = '+f.str+' rad = '+deg))],hints:['π rad = 180°, donc remplace π par 180.'],
    work:['x = '+e_(180)+' = '+deg+'°'],
    mistakes:[{v:deg/2,tag:'geo-unite-angle',msg:'Tu as remplacé π par 90 : π rad = 180°.',w:['x = '+e_(90)+' = '+NF(deg/2)+'°']},{v:deg*2,tag:'geo-unite-angle',msg:'Tu as remplacé π par 360 : 2π rad = 360°, donc π rad = 180°.',w:['x = '+e_(360)+' = '+(deg*2)+'°']},{v:deg*Math.PI/180,tag:'geo-unite-angle',msg:'Tu as fait la conversion dans le mauvais sens.',w:['x = '+e_(180)+' × π / 180','x = '+e_('π')+' ≈ '+kD6(deg*Math.PI/180)]}]});
}

/* gang-3 : angles, valeurs numériques */
function genAng3(){
  const t=pick([0,0,1,2]);
  if(t===0){
    const th=pick([35,40,50,55,60,65,70,110,115,120,125,130,140]), keys=['UL','UR','LL','LR'], sides=['T','B'];
    const k1=pick(sides)+pick(keys); let k2; do{ k2=pick(sides)+pick(keys); }while(k2===k1);
    const val_of=k=>CLS[k.slice(1)]===0?th:180-th;
    const known=val_of(k1), val=val_of(k2);
    const svg=figPar(th,{[k1]:known+'°',[k2]:'?'},k2);
    const same=CLS[k1.slice(1)]===CLS[k2.slice(1)];
    return mkGeo({svg,text:'Les droites «(d₁)» et «(d₂)» sont <b>parallèles</b>. Un angle vaut «'+known+'°» (repéré sur la figure). Calcule l\'angle marqué d\'un point d\'interrogation.',ask:'l\'angle marqué ?',val,unit:'°',
      placeholder:'? = '+known+'°  (angles ...)\n? = 180 − ...',
      steps:[stp('Type d\'angles',same?'Les deux angles sont égaux (correspondants, alternes-internes ou opposés par le sommet).':'Les deux angles sont supplémentaires : leur somme vaut 180°.'),stp('Calcule',M('? = '+(same?known:'180 − '+known+' = '+val))+'°')],
      hints:['Repère si les deux angles sont du même type (ils sont alors égaux) ou de types différents (ils sont alors supplémentaires).','Avec des parallèles et une sécante, il n\'y a que deux valeurs possibles : θ et 180° − θ.'],
      work:[same?'x = '+known+'°':'x = 180 − '+known+' = '+val+'°'],
      mistakes:[{v:same?180-known:known,tag:'geo-angle-somme',msg:same?'Ces deux angles sont égaux, pas supplémentaires.':'Ces deux angles sont supplémentaires (somme 180°), pas égaux.',w:[same?'x = 180 − '+known+' = '+(180-known)+'°':'x = '+known+'°']},{v:90-known>0?90-known:undefined,tag:'geo-angle-somme',msg:'Tu as fait 90 − angle. Ici l\'angle plat est 180°.',w:['x = 90 − '+known+' = '+(90-known)+'°']},{v:360-known,tag:'geo-angle-somme',msg:'Tu as soustrait à 360°. La somme de deux angles supplémentaires est 180°.',w:['x = 360 − '+known+' = '+(360-known)+'°']}].filter(m=>m.v!==undefined)});
  }
  if(t===1){
    const s=2*rnd(15,80), b=(180-s)/2, up=Math.random()<0.5, A=[0,2.2], B=[-1.2,0], C=[1.2,0];
    const svg=figure([A,B,C],f=>{ const a=f(A),bb=f(B),c=f(C),ce=cen([a,bb,c]); return g.poly([a,bb,c])+g.tick(a,bb,1)+g.tick(a,c,1)+g.arc(a,bb,c,20,up?'?':s+'°',up?'g-u':'g-a')+g.arc(bb,c,a,20,up?b+'°':'?',up?'g-a':'g-u')+g.vert(a,'A',ce)+g.vert(bb,'B',ce)+g.vert(c,'C',ce); },'Triangle ABC isocèle en A',{H:190,pad:36});
    const val=up?s:b; const kn=up?b:s;
    return mkGeo({svg,text:'Le triangle «ABC» est <b>isocèle en A</b>. '+(up?'Son angle à la base vaut «∠B = '+b+'°». Calcule l\'angle au sommet «∠A».':'Son angle au sommet vaut «∠A = '+s+'°». Calcule l\'angle à la base «∠B».'),ask:up?'l\'angle au sommet':'l\'angle à la base',val,unit:'°',
      placeholder:up?'∠C = ∠B = '+b+'°\n∠A = 180 − ... − ...':'∠B + ∠C = 180 − '+s+'\n∠B = ... / 2',
      steps:up?[stp('Isocèle en A','Les angles à la base sont égaux : '+M('∠C = ∠B = '+b)+'°.'),stp('Somme des angles',M('∠A = 180 − '+b+' − '+b+' = '+s)+'°')]:[stp('Somme des angles',M('∠B + ∠C = 180 − '+s+' = '+(180-s))+'°'),stp('Isocèle en A',M('∠B = ∠C = '+(180-s)+' / 2 = '+b)+'°')],
      hints:['Dans un triangle isocèle, les deux angles à la base sont égaux.','La somme des trois angles vaut 180°.'],
      work:up?['∠C = ∠B = '+b+'°','∠A = 180 − '+b+' − '+b+' = '+s+'°']:['∠B + ∠C = 180 − '+s+' = '+(180-s)+'°','∠B = '+(180-s)+' / 2 = '+b+'°'],
      mistakes:up?[{v:180-b,tag:'geo-angle-somme',msg:'Tu as oublié le deuxième angle à la base (∠C = ∠B).',w:['∠A = 180 − '+b+' = '+(180-b)+'°']},{v:180-2*b>0?b:undefined,tag:'geo-angle-somme',msg:'Tu as répété l\'angle donné.',w:['∠A = ∠B = '+b+'°']}].filter(m=>m.v!==undefined):[{v:180-s,tag:'geo-angle-somme',msg:'Tu as donné la somme ∠B + ∠C : il faut la partager entre les deux angles égaux.',w:['∠B + ∠C = 180 − '+s+' = '+(180-s)+'°','∠B = '+(180-s)+'°']},{v:s,tag:'geo-angle-somme',msg:'Tu as répété l\'angle au sommet.',w:['∠B = ∠A = '+s+'°']},{v:(360-s)/2,tag:'geo-angle-somme',msg:'La somme des angles d\'un triangle vaut 180°, pas 360°.',w:['∠B + ∠C = 360 − '+s+' = '+(360-s)+'°','∠B = '+(360-s)+' / 2 = '+NF((360-s)/2)+'°']}]});
  }
  const a1=5*rnd(6,16), a2=5*rnd(6,16), ext=a1+a2; const A=[0,2],B=[-1.3,0],C=[1.1,0],D=[2.9,0];
  const svg=figure([A,B,C,D],f=>{ const a=f(A),bb=f(B),c=f(C),d=f(D),ce=cen([a,bb,c]); return g.poly([a,bb,c])+g.seg(c,d)+g.arc(a,c,bb,20,a1+'°','g-a')+g.arc(bb,a,c,20,a2+'°','g-a')+g.arc(c,d,a,20,'?','g-u')+g.vert(a,'A',ce)+g.vert(bb,'B',ce)+g.vert(c,'C',ce)+g.vert(d,'D',ce); },'Triangle ABC et prolongement de BC jusqu\'en D',{H:190,pad:34});
  return mkGeo({svg,text:'Dans le triangle «ABC», «∠A = '+a1+'°» et «∠B = '+a2+'°». On prolonge «[BC)» jusqu\'en «D». Calcule l\'angle extérieur «∠ACD».',ask:'l\'angle ∠ACD',val:ext,unit:'°',
    placeholder:'∠C = 180 − ... − ...\n∠ACD = 180 − ∠C',steps:[stp('Angle intérieur',M('∠C = 180 − '+a1+' − '+a2+' = '+(180-ext))+'°'),stp('Angle plat',M('∠ACD = 180 − '+(180-ext)+' = '+ext)+'° (= somme des deux angles opposés).')],
    hints:['Commence par l\'angle intérieur ∠ACB, puis utilise l\'angle plat en C.','Un angle extérieur est égal à la somme des deux angles intérieurs non adjacents.'],
    work:['∠C = 180 − '+a1+' − '+a2+' = '+(180-ext)+'°','∠ACD = 180 − '+(180-ext)+' = '+ext+'°'],
    mistakes:[{v:180-ext,tag:'geo-angle-somme',msg:'Tu as calculé l\'angle intérieur ∠ACB. ∠ACD est son supplémentaire.',w:['∠C = 180 − '+a1+' − '+a2+' = '+(180-ext)+'°','∠ACD = '+(180-ext)+'°']},{v:360-ext,tag:'geo-angle-somme',msg:'Les angles ∠ACB et ∠ACD sont sur une droite : leur somme fait 180°, pas 360°.',w:['∠C = 180 − '+a1+' − '+a2+' = '+(180-ext)+'°','∠ACD = 360 − '+a1+' − '+a2+' = '+(360-ext)+'°']}]});
}

/* gang-4 : angles littéraux */
function genAng4(){
  const t=pick([0,1,2,3,4]);
  const fnx=(lhs,exact,vars,mist,svg,text,steps,hints,work)=>mkGeo({mode:'fn',fn:{lhs,exact,vars},svg,text,ask:'l\'angle '+lhs+' en fonction de '+vars.join(', '),val:0,unit:'',placeholder:lhs+' = ...',steps,hints,work,mistakes:mist});
  if(t===0){
    const th=pick([40,50,60,70,110,120]), keys=['UL','UR','LL','LR']; const k1=pick(['T','B'])+pick(keys); let k2; do{ k2=pick(['T','B'])+pick(keys); }while(k2===k1);
    const same=CLS[k1.slice(1)]===CLS[k2.slice(1)], svg=figPar(th,{[k1]:'β',[k2]:'α'},k2);
    return fnx('α',same?'β':'180-β',['β'],[{s:same?'180-β':'β',tag:'geo-angle-somme',msg:same?'Ces deux angles sont égaux, pas supplémentaires.':'Ces deux angles sont supplémentaires : leur somme vaut 180°.',w:same?['α + β = 180','α = 180 − β']:['α = β']},{s:'90-β',tag:'geo-angle-somme',msg:'La somme de deux angles supplémentaires est 180°, pas 90°.',w:['α + β = 90','α = 90 − β']},{s:'360-β',tag:'geo-angle-somme',msg:'La somme de deux angles supplémentaires est 180°, pas 360°.',w:['α + β = 360','α = 360 − β']}],svg,
      'Les droites «(d₁)» et «(d₂)» sont parallèles. Exprime «α» en fonction de «β».',[stp('Type d\'angles',same?'Les deux angles sont égaux.':'Les deux angles sont supplémentaires : '+M('α + β = 180')+'.'),stp('Résultat',M('α = '+(same?'β':'180 − β')))],['Avec des parallèles, deux angles sont soit égaux, soit supplémentaires.'],same?['α = β']:['α + β = 180','α = 180 − β']);
  }
  if(t===1){
    const A=[0,2.2],B=[-1.2,0],C=[1.2,0], svg=figure([A,B,C],f=>{ const a=f(A),bb=f(B),c=f(C),ce=cen([a,bb,c]); return g.poly([a,bb,c])+g.tick(a,bb,1)+g.tick(a,c,1)+g.arc(a,bb,c,20,'β','g-a')+g.arc(bb,c,a,20,'α','g-u')+g.vert(a,'A',ce)+g.vert(bb,'B',ce)+g.vert(c,'C',ce); },'Triangle isocèle en A',{H:190,pad:36});
    return fnx('α',"90-β/2",['β'],[{s:'180-β',tag:'geo-angle-somme',msg:'180 − β est la somme des deux angles à la base : il faut la partager en deux.',w:['β + 2α = 180','α = 180 − β']},{s:'(180-β)/4',tag:'geo-angle-somme',msg:'Il n\'y a que deux angles égaux à la base : divise par 2.',w:['β + 4α = 180','4α = 180 − β','α = (180 − β) / 4']},{s:'90-β',tag:'geo-angle-somme',msg:'Il manque la division de β par 2.',w:['β + 2α = 180','2α = 180 − β','α = 90 − β']}],svg,
      'Le triangle «ABC» est isocèle en «A», d\'angle au sommet «β» et d\'angle à la base «α». Exprime «α» en fonction de «β».',[stp('Somme des angles',M('β + 2α = 180')),stp('Isole α',M('α = (180 − β) / 2 = 90 − β/2'))],['Les deux angles à la base sont égaux à α. Écris la somme des trois angles.'],['β + 2α = 180','2α = 180 − β','α = (180 − β) / 2 = 90 − β/2']);
  }
  if(t===2){
    const A=[0,2],B=[0,0],C=[2.4,0], svg=figure([A,B,C],f=>{ const a=f(A),bb=f(B),c=f(C),ce=cen([a,bb,c]); return g.poly([a,bb,c])+g.right(bb,a,c,12)+g.arc(c,bb,a,22,'β','g-a')+g.arc(a,c,bb,22,'α','g-u')+g.vert(a,'A',ce)+g.vert(bb,'B',ce)+g.vert(c,'C',ce); },'Triangle ABC rectangle en B',{H:190,pad:36});
    return fnx('α',"90-β",['β'],[{s:'180-β',tag:'geo-angle-somme',msg:'Un des trois angles vaut déjà 90° : il reste 90° à partager entre α et β.',w:['α + β = 180','α = 180 − β']},{s:'β',tag:'geo-angle-somme',msg:'α et β ne sont pas égaux : ils sont complémentaires.',w:['α = β']},{s:'90+β',tag:'geo-angle-somme',msg:'α et β s\'additionnent pour faire 90° : α = 90 − β.',w:['α + β + 90 = 180','α = 90 + β']}],svg,
      'Le triangle «ABC» est rectangle en «B». Exprime l\'angle «α = ∠A» en fonction de «β = ∠C».',[stp('Somme des angles',M('α + β + 90 = 180')),stp('Isole α',M('α = 90 − β'))],['La somme des angles d\'un triangle vaut 180° et l\'un des angles vaut 90°.'],['α + β + 90 = 180','α = 90 − β']);
  }
  if(t===3){
    const q=5*rnd(4,16), p=5*rnd(3,10); const A=[0,2.2],B=[-1.5,0],C=[1.3,0], svg=figure([A,B,C],f=>{ const a=f(A),bb=f(B),c=f(C),ce=cen([a,bb,c]); return g.poly([a,bb,c])+g.arc(a,bb,c,20,'α','g-u')+g.arc(bb,c,a,20,'β','g-a')+g.arc(c,a,bb,20,p+'°','g-a')+g.vert(a,'A',ce)+g.vert(bb,'B',ce)+g.vert(c,'C',ce); },'Triangle ABC',{H:190,pad:36});
    return fnx('α',String(180-p)+'-β',['β'],[{s:'180-β',tag:'geo-angle-somme',msg:'Tu as oublié l\'angle de '+p+'° : α + β + '+p+' = 180.',w:['α + β = 180','α = 180 − β']},{s:String(180+p)+'-β',tag:'geo-angle-somme',msg:'Le signe est à revoir : α = 180 − '+p+' − β.',w:['α + β + '+p+' = 180','α = 180 + '+p+' − β','α = '+(180+p)+' − β']},{s:String(p)+'-β',tag:'geo-angle-somme',msg:'La somme vaut 180°, pas '+p+'°.',w:['α + β = '+p,'α = '+p+' − β']}],svg,
      'Dans le triangle «ABC», «∠C = '+p+'°», «∠B = β» et «∠A = α». Exprime «α» en fonction de «β».',[stp('Somme des angles',M('α + β + '+p+' = 180')),stp('Isole α',M('α = '+(180-p)+' − β'))],['Écris que la somme des trois angles vaut 180° et isole α.'],['α + β + '+p+' = 180','α = 180 − '+p+' − β','α = '+(180-p)+' − β']);
  }
  const rot=rnd(0,359), be=5*rnd(6,17), aA=rot, aB=rot+2*be, aC=rot-100;
  const svg=figCirc({P:{A:aA,B:aB,C:aC},chords:[['C','A'],['C','B']],radii:['A','B'],marks:[{at:'C',a:'A',b:'B',r:22,label:'β'},{at:'O',a:'A',b:'B',r:20,label:'α',unk:true}],alt:'Angle inscrit β et angle au centre α'});
  return fnx('α','2β',['β'],[{s:'β/2',tag:'geo-litteral',msg:'C\'est l\'inverse : l\'angle au centre est le double de l\'angle inscrit.',w:['β = 2α','α = β/2']},{s:'β',tag:'geo-litteral',msg:'L\'angle au centre n\'est pas égal à l\'angle inscrit : il en est le double.',w:['α = β']},{s:'180-β',tag:'geo-litteral',msg:'Ce n\'est pas une relation de supplément : l\'angle au centre est le double de l\'angle inscrit.',w:['α + β = 180','α = 180 − β']}],svg,
    'Dans un cercle de centre «O», «β» est l\'angle inscrit «∠ACB» et «α» l\'angle au centre «∠AOB» qui intercepte le même arc. Exprime «α» en fonction de «β».',[stp('Angle au centre',M('α = 2β'))],['L\'angle au centre vaut le double de l\'angle inscrit qui intercepte le même arc.'],['α = 2β']);
}

/* ===== Exercices du livre ===== */
/* n°21 : intersection de trois cercles (triangle de Reuleaux) */
function genReuleaux(){
  const r=pick([2,4,6,8,10]), u=uP(), r2=r*r/2, s3=Math.sqrt(3);
  const svg=figure([[-r,-r*0.7],[2*r,r*1.5]],f=>{
    const A=[0,0],B=[r,0],C=[r/2,r*s3/2], a=f(A),b=f(B),c=f(C), s=f.s;
    const arc=(P,Q,O)=>{ const cr=(Q[0]-P[0])*(O[1]-P[1])-(Q[1]-P[1])*(O[0]-P[0]); return ' A'+gf(r*s)+' '+gf(r*s)+' 0 0 '+(cr>0?1:0)+' '+gf(Q[0])+' '+gf(Q[1]); };
    const d='M'+gf(a[0])+' '+gf(a[1])+arc(a,b,c)+arc(b,c,a)+arc(c,a,b)+' Z';
    return g.circle(a,r*s,'g-circle')+g.circle(b,r*s,'g-circle')+g.circle(c,r*s,'g-circle')+g.path(d,'g-f')+g.dot(a)+g.dot(b)+g.dot(c)+g.vert(a,'A',cen([a,b,c]),13)+g.vert(b,'B',cen([a,b,c]),13)+g.vert(c,'C',cen([a,b,c]),13);
  },'Trois cercles de rayon '+r+' centrés aux sommets d\'un triangle équilatéral, dont chacun passe par les deux autres centres',{H:250,pad:26});
  const ex=(r2)+'π - '+r2+'√3'; const exact=NF(r2)+'π - '+NF(r2)+'√3';
  const cq=r*r/4, uu=' '+u+'²', LS='S = 3 × 60 / 360 × π × '+r+'² = '+kPi(r2), LT='T = '+r+'² × √3 / 4 = '+kRt(cq,3);
  return mkGeo({svg,mode:'pi',exact,val:{a:-r2*s3,b:r2},unit:u,pow:2,
    text:'Trois cercles de <b>rayon «r = '+r+'»</b> '+u+' ont pour centres les sommets «A», «B», «C» d\'un triangle équilatéral de côté «'+r+'» '+u+' : chaque cercle passe par les deux autres centres. Calcule l\'aire de la surface commune aux trois disques (partie colorée). Donne la <b>valeur exacte</b>.',ask:'l\'aire de la surface commune (valeur exacte)',
    placeholder:'3 secteurs de 60° = ...\n2 triangles équilatéraux = ...\nA = ...',
    steps:[stp('Trois secteurs de 60°',M('3 × (60/360) × π × '+r+'² = '+NF(r*r/2)+'π')+' '+u+'²'),stp('Triangle équilatéral de côté r',M('aire = r² √3 / 4 = '+NF(r*r/4)+'√3')+' '+u+'²'),stp('Les triangles sont comptés trois fois','En additionnant les 3 secteurs, le triangle ABC est compté 3 fois : on retire 2 triangles.'),stp('Résultat',M('A = '+NF(r2)+'π − 2 × '+NF(r*r/4)+'√3 = '+exact))],
    hints:['Décompose la surface en 3 secteurs de 60° (autour des sommets) auxquels tu retires le triangle équilatéral, compté trop de fois.','Aire d\'un triangle équilatéral de côté r : r² √3 / 4.'],
    work:[LS,LT,'A = '+kPi(r2)+' − 2 × '+kRt(cq,3)+' = '+kPi(r2)+' − '+kRt(r2,3)+uu],
    mistakes:[{v:{a:0,b:r2},tag:'geo-reuleaux',msg:'Tu as additionné les trois secteurs sans retirer les triangles (le triangle ABC est compté trois fois).',w:[LS,'A = '+kPi(r2)+uu]},{v:{a:-r*r/4*s3,b:r2},tag:'geo-reuleaux',msg:'Il faut retirer 2 fois le triangle équilatéral, pas 1 fois.',w:[LS,LT,'A = '+kPi(r2)+' − '+kRt(cq,3)+uu]},{v:{a:-r*r*s3*3/4,b:r2},tag:'geo-reuleaux',msg:'Tu as retiré 3 triangles : le triangle doit rester compté une fois, donc on en retire 2.',w:[LS,LT,'A = '+kPi(r2)+' − 3 × '+kRt(cq,3)+' = '+kPi(r2)+' − '+kRt(3*cq,3)+uu]},{v:{a:0,b:r*r/6},tag:'geo-reuleaux',msg:'Tu n\'as calculé qu\'un seul secteur de 60°.',w:['S = 60 / 360 × π × '+r+'² = '+kPi(r*r/6),'A = '+kPi(r*r/6)+uu]},{v:{a:0,b:r*r},tag:'geo-reuleaux',msg:'Tu as calculé l\'aire d\'un disque entier.',w:['A = π × '+r+'² = '+kPi(r*r)+uu]}]});
}
/* n°15 : entassement de cercles */
function genEntass(){
  const n=pick([3,3,4,5]), ex_=n===3?'y(1+√3)':(n===4?'y(1+3√3/2)':'y(1+2√3)'), cnt=3, ymax=(n-1)*Math.sqrt(3)+2;
  const svg=figure([[-1,-ymax/2-0.3],[2*cnt+0.2,ymax/2+0.3]],f=>{
    let out='';
    for(let k=0;k<n;k++){ const cy=-((n-1)*Math.sqrt(3))/2+k*Math.sqrt(3); for(let i=0;i<cnt;i++){ const cx=2*i+(k%2)+0.2; out+=g.circle(f([cx,cy]),f.s,'g-circle'); } }
    const top=f([-1,ymax/2]), topR=f([2*cnt,ymax/2]), ax=f([-1,0]), axR=f([2*cnt,0]), bot=f([-1,-ymax/2]);
    out+=g.seg(top,topR,'g-dash')+g.seg(ax,axR,'g-dash')+g.seg(bot,topR&&f([2*cnt,-ymax/2]),'g-dash');
    const xa=f([-0.75,0]), xb=f([-0.75,ymax/2]);
    out+=g.seg(xa,xb,'g-mark g-u')+g.text([xa[0]-11,(xa[1]+xb[1])/2],'x','g-u')+g.text(f([2*cnt+0.5,0]),'y','g-v');
    return out;
  },'Empilement de '+n+' rangées de cercles de rayon y',{H:230,pad:34});
  const h1='h = √((2y)² − y²) = y√3', H1='H = 2y + '+(n-1)+'y√3';
  return mkGeo({mode:'fn',fn:{lhs:'x',exact:ex_,vars:['y']},svg,unit:'',val:0,
    text:'Des cercles de <b>rayon «y»</b> sont empilés en «'+n+'» rangées décalées : deux cercles voisins se touchent, et chaque cercle d\'une rangée touche deux cercles de la rangée voisine. «x» est la <b>demi-hauteur</b> de l\'empilement (de l\'axe médian jusqu\'au sommet). Exprime «x» en fonction de «y».',ask:'x en fonction de y',
    placeholder:'x = ...',
    steps:[stp('Triangle équilatéral','Les centres de trois cercles qui se touchent forment un triangle équilatéral de côté «2y».'),stp('Distance entre rangées',M('h = √((2y)² − y²) = y√3')),stp('Hauteur totale',M('H = 2y + '+(n-1)+' × y√3')),stp('Demi-hauteur',M('x = H / 2 = '+ex_))],
    hints:['Deux rangées voisines : les centres forment un triangle équilatéral de côté 2y. Sa hauteur vaut y√3.','La hauteur totale = un rayon en bas + '+(n-1)+' écarts de rangées + un rayon en haut.'],
    work:[h1,H1,'x = H / 2','x = '+ex_],
    mistakes:[{s:'y('+n+')',tag:'geo-empilement',msg:'Tu as empilé les cercles sans les décaler (écart de 2y entre rangées). Les rangées sont décalées : l\'écart vaut y√3.',w:['h = 2y','H = 2y + '+(n-1)+' × 2y = '+(2*n)+'y','x = H / 2','x = '+n+'y']},{s:'y(1+'+(n-1)+'√3)',tag:'geo-empilement',msg:'Tu as calculé la hauteur totale moins un rayon : x est la <b>moitié</b> de la hauteur totale.',w:[h1,H1,'x = H − y','x = y(1 + '+(n-1)+'√3)']},{s:'y(2+'+(n-1)+'√3)',tag:'geo-empilement',msg:'C\'est la hauteur totale. x est la demi-hauteur : divise par 2.',w:[h1,H1,'x = H','x = y(2 + '+(n-1)+'√3)']},{s:'y(1+'+(n-1)+'/2)',tag:'geo-empilement',msg:'L\'écart entre deux rangées n\'est pas y : dans un triangle équilatéral de côté 2y, la hauteur vaut y√3.',w:['h = y','H = 2y + '+(n-1)+'y','x = H / 2','x = '+kX((n+1)/2)+'y']}]});
}
/* n°9 : triplets n ; n+k ; √(2kn+k²) */
function genTripl(){
  const k=pick([1,1,2,3]), ex_=k===1?'√(2n+1)':'√('+(2*k)+'n+'+(k*k)+')';
  const svg=svgRight({a:3,b:4,flip:false,lAB:'n',lBC:'c',lAC:'n + '+k,uBC:true,alt:'Triangle rectangle de côtés n, c et hypoténuse n + '+k});
  const kn=(2*k)+'n', sub=kn+' + '+(k*k), P1='c² = (n + '+k+')² − n²';
  return mkGeo({mode:'fn',fn:{lhs:'c',exact:ex_,vars:['n']},svg,unit:'',val:0,
    text:'Un triangle rectangle a pour côtés «n» et «c» (côtés de l\'angle droit) et pour <b>hypoténuse</b> «n + '+k+'». Exprime «c» en fonction de «n». (Ex. : pour «n = 4», «c» est-il un nombre entier ?)',ask:'c en fonction de n',
    placeholder:'c² = (n + '+k+')² − n²\nc = ...',
    steps:[stp('Pythagore',M('n² + c² = (n + '+k+')²')),stp('Développe',M('c² = n² + '+(2*k)+'n + '+(k*k)+' − n² = '+(2*k)+'n + '+(k*k))),stp('Racine carrée (c > 0)',M('c = '+ex_))],
    hints:['L\'hypoténuse est le côté n + '+k+' : écris Pythagore avec (n + '+k+')².','Développe (n + '+k+')² avec l\'identité remarquable : les n² se simplifient.'],
    work:[P1,'c² = n² + '+sub+' − n²','c² = '+sub,'c = √('+sub+')'],
    mistakes:[{s:'√(n^2+'+(k*k)+')',tag:'geo-litteral',msg:'Tu as développé (n + '+k+')² comme n² + '+(k*k)+' : il manque le double produit '+(2*k)+'n.',w:['c² = (n + '+k+')²','c² = n² + '+(k*k),'c = √(n² + '+(k*k)+')']},{s:'√(n^2+(n+'+k+')^2)',tag:'geo-litteral',msg:'Tu as pris n + '+k+' comme un côté de l\'angle droit, alors que c\'est l\'hypoténuse : c² = (n+'+k+')² − n².',w:['c² = n² + (n + '+k+')²','c = √(n² + (n + '+k+')²)']},{s:'√('+(2*k)+'n)',tag:'geo-litteral',msg:'Il manque le terme constant '+(k*k)+' du développement (n + '+k+')².',w:[P1,'c² = n² + '+kn+' − n²','c² = '+kn,'c = √('+kn+')']},{s:String(k),tag:'geo-litteral',msg:'Tu as simplifié (n + '+k+') − n. On ne peut pas retirer les côtés directement : il faut passer par les carrés.',w:['c = (n + '+k+') − n','c = '+k]}]});
}

TOPICS['gang-1']={kind:'gang',level:1,label:'Degrés, grades et tours',gen:genAng1};
TOPICS['gang-2']={kind:'gang',level:2,label:'Degrés et radians',gen:genAng2};
TOPICS['gang-3']={kind:'gang',level:3,label:'Angles : parallèles et triangles',gen:genAng3};
TOPICS['gang-4']={kind:'gang',level:4,label:'Angles : expressions littérales',gen:genAng4};
TOPICS['gc-6b']={kind:'gcirc',level:6,label:'Intersection de trois cercles (π et √)',gen:genReuleaux};
TOPICS['gm-6b']={kind:'gcomp',level:6,label:'Empilement de cercles',gen:genEntass};
TOPICS['gp-6b']={kind:'gpyth',level:6,label:'Triplets pythagoriciens : loi générale',gen:genTripl};

/* ===== Livre n°16, 22, 23 ===== */
const carc=(P,Q,O,R)=>{ const cr=(Q[0]-P[0])*(O[1]-P[1])-(Q[1]-P[1])*(O[0]-P[0]); return ' A'+gf(R)+' '+gf(R)+' 0 0 '+(cr>0?1:0)+' '+gf(Q[0])+' '+gf(Q[1]); };
const mv=p=>'M'+gf(p[0])+' '+gf(p[1]);
const outline=d=>'<path class="g-l" fill="none" d="'+d+'"/>';

/* n°16 : ogive, deux demi-disques et un cercle tangent */
function genOgive(){
  const yv=6, r0=5, W=20, h=Math.sqrt(96), num=Math.random()<0.4, k=pick([1,2,3]), u=uP();
  const C=[10,h], A0=[W,0], dd=vsub(C,A0), T=vadd(A0,vmul(vunit(dd),W)), apex=[10,Math.sqrt(300)];
  const svg=figure([[0,0],[W,18]],f=>{
    const s=f.s, P=q=>f(q), o=P([0,0]), e=P([W,0]);
    let out=g.seg(o,P([0,18.6]))+g.seg(o,e);
    out+=g.path(mv(o)+' A'+gf(r0*s)+' '+gf(r0*s)+' 0 0 1 '+gf(P([10,0])[0])+' '+gf(P([10,0])[1])+' Z','g-f')+g.path(mv(P([10,0]))+' A'+gf(r0*s)+' '+gf(r0*s)+' 0 0 1 '+gf(e[0])+' '+gf(e[1])+' Z','g-f');
    out+=g.circle(P(C),yv*s,'g-f');
    out+=outline(mv(o)+carc(o,P(apex),e,W*s)+carc(P(apex),e,o,W*s));
    const ang=200*Math.PI/180, pe=P([C[0]+yv*Math.cos(ang),C[1]+yv*Math.sin(ang)]), pc=P(C);
    out+=g.seg(pc,pe)+g.dot(pc)+g.text(vadd(vmid(pc,pe),[-2,-10]),'y','g-u2');
    out+=g.seg(P(A0),P(T),'g-thick g-u')+g.text(vadd(vmid(P(A0),P(T)),[13,-8]),'x','g-u');
    out+=g.seg(pc,P([10,0]),'g-dash')+g.text(vadd(vmid(pc,P([10,0])),[11,0]),'h','g-v');
    return out;
  },'Ogive formée de deux arcs de rayon x, deux demi-disques égaux sur la base et un cercle de rayon y tangent à tout',{H:250,pad:26});
  const desc='Deux demi-disques <b>égaux</b> sont posés sur la base : chacun touche le bord vertical et ils se touchent entre eux. Un cercle de <b>rayon «y»</b> est tangent aux deux demi-disques et aux deux arcs de l\'ogive. Chaque arc de l\'ogive a pour <b>rayon «x»</b> : il est centré à une extrémité de la base et passe par l\'autre extrémité.';
  const steps=[stp('Inconnues auxiliaires','Soit «r» le rayon des demi-disques : la base mesure «4r», donc «x = 4r».'),stp('Hauteur du centre du cercle',M('h² = (r + y)² − r² = 2ry + y²')+' (triangle rectangle dont l\'hypoténuse joint le centre d\'un demi-disque et celui du cercle).'),stp('Tangence avec l\'arc',M('(x − y)² = (2r)² + h²')+' : le centre de l\'arc est à l\'extrémité de la base, le cercle est tangent à l\'arc.'),stp('Remplace',M('(4r − y)² = 4r² + 2ry + y²')+', donc '+M('12r² = 10ry')+', donc '+M('r = 5y/6')),stp('Conclus',M('x = 4r = 10y/3'))];
  const hints=['Appelle r le rayon des demi-disques : x = 4r. Exprime ensuite r en fonction de y.','Utilise deux triangles rectangles : un pour la hauteur h (avec r + y), un pour la distance entre le centre de l\'arc et celui du cercle (avec x − y).'];
  const O3=['h² = (r + y)² − r² = 2ry + y²','(4r − y)² = 4r² + 2ry + y²','12r² = 10ry'];
  if(num){ const y=3*k, rv=NF(2.5*k), O4=O3.concat(['r = 5y/6 = 5 × '+y+' / 6 = '+rv]);
    return mkGeo({svg,val:10*k,unit:u,text:desc+' On donne «y = '+y+'» '+u+'. Calcule «x».',ask:'la longueur x',placeholder:'r = ...\nx = 4r = ...',steps,hints,
      work:O4.concat(['x = 4 × '+rv+' = '+(10*k)+' '+u]),
      mistakes:[{v:4*y,tag:'geo-empilement',msg:'Tu as pris r = y. Les demi-disques n\'ont pas le même rayon que le cercle du haut : r = 5y/6.',w:['r = y = '+y,'x = 4 × '+y+' = '+(4*y)+' '+u]},{v:3*y,tag:'geo-empilement',msg:'Ce n\'est pas la bonne valeur : écris les deux relations de Pythagore (avec r + y et avec x − y).',w:['x = 3y = 3 × '+y+' = '+(3*y)+' '+u]},{v:5*y/6,tag:'geo-empilement',msg:'C\'est le rayon r des demi-disques, pas x. On a x = 4r.',w:O4.concat(['x = r = '+rv+' '+u])},{v:5*y/3,tag:'geo-empilement',msg:'Tu as pris 2r. La base entière mesure 4r et x = 4r.',w:O4.concat(['x = 2r = 2 × '+rv+' = '+NF(5*k)+' '+u])}]});
  }
  return mkGeo({mode:'fn',fn:{lhs:'x',exact:'10y/3',vars:['y']},svg,unit:'',val:0,text:desc+' Détermine «x» en fonction de «y».',ask:'x en fonction de y',placeholder:'x = ...',steps,hints,
    work:O3.concat(['r = 5y/6','x = 4r = 10y/3']),
    mistakes:[{s:'4y',tag:'geo-empilement',msg:'Tu as pris r = y. Les demi-disques n\'ont pas le même rayon que le cercle du haut : r = 5y/6.',w:['r = y','x = 4r = 4y']},{s:'3y',tag:'geo-empilement',msg:'Ce n\'est pas la bonne valeur : écris les deux relations de Pythagore (avec r + y et avec x − y).',w:['x = 3y']},{s:'5y/6',tag:'geo-empilement',msg:'C\'est le rayon r des demi-disques, pas x. On a x = 4r.',w:O3.concat(['r = 5y/6','x = 5y/6'])},{s:'5y/3',tag:'geo-empilement',msg:'Tu as pris 2r. La base entière mesure 4r et x = 4r.',w:O3.concat(['r = 5y/6','x = 2r = 5y/3'])},{s:'10y/6',tag:'geo-empilement',msg:'Tu as divisé par 6 au lieu de 3 : x = 4 × 5y/6.',w:O3.concat(['r = 5y/6','x = 4r = 4 × 5y/6','x = 10y/6'])}]});
}

/* n°22 : trois cercles sur quadrillage */
function genSurfGrise(){
  const a=pick([1,2,3]), u=uP();
  const svg=figure([[0,0],[6,5]],f=>{
    let out='';
    for(let i=0;i<=6;i++) out+=g.seg(f([i,0]),f([i,5]),'g-grid');
    for(let i=0;i<=5;i++) out+=g.seg(f([0,i]),f([6,i]),'g-grid');
    [[2,3],[4,3],[3,2]].forEach(c=>{ out+=g.circle(f(c),f.s,'g-f g-hl'); });
    out+=g.dim(f([0,0]),f([1,0]),'a',f([3,5]),12);
    return out;
  },'Trois cercles de rayon a sur un quadrillage de carrés de côté a',{H:230,pad:30});
  const A=2*a*a, B=2*a*a, a2=a*a, uu=' '+u+'²', LD='D = 3 × π × '+a+'² = '+kPi(3*a2), LL='L = 2 × (π × '+a+'² / 4 − '+a+'² / 2) = '+kPi(a2/2)+' − '+a2;
  return mkGeo({svg,mode:'pi',val:{a:A,b:B},unit:u,pow:2,
    text:'Sur un quadrillage de carrés de côté «a = '+a+'» '+u+', trois cercles de <b>rayon «a»</b> sont tracés (centres aux nœuds). Les deux cercles du haut se touchent en un point ; le cercle du bas coupe chacun des deux autres. Calcule l\'aire de la <b>surface grise</b> (la réunion des trois disques). Donne la <b>valeur exacte</b>.',ask:'l\'aire de la surface grise (valeur exacte)',
    placeholder:'3 disques = ...\nune lentille = ...\nA = ...',
    steps:[stp('Trois disques',M('3 × π × '+a+'² = '+3*a*a+'π')+' '+u+'²'),stp('Une lentille (intersection de deux disques)','Les centres sont distants de '+M('a√2')+' : les rayons se coupent à angle droit. Lentille = 2 × (quart de disque − triangle rectangle isocèle) :',M('2 × (π'+(a>1?' × '+a+'²':'')+'/4 − '+a+'²/2) = '+NF(a*a/2)+'π − '+a*a)),stp('Deux lentilles','Le cercle du bas coupe les deux autres ; les deux du haut ne se chevauchent pas : '+M('2 × (' +NF(a*a/2)+'π − '+a*a+') = '+a*a+'π − '+2*a*a)),stp('Réunion',M('A = '+3*a*a+'π − ('+a*a+'π − '+2*a*a+') = '+2*a*a+'π + '+2*a*a))],
    hints:['Aire de la réunion = somme des trois disques − les parties comptées deux fois (les lentilles).','La lentille entre deux cercles de rayon a dont les centres sont à distance a√2 vaut 2 × (πa²/4 − a²/2).'],
    work:[LD,LL,'A = '+kPi(3*a2)+' − 2 × ('+kPi(a2/2)+' − '+a2+') = '+kPi(2*a2)+' + '+(2*a2)+uu],
    mistakes:[{v:pib(0,3*a*a),tag:'geo-lentille',msg:'Tu as additionné les trois disques sans retirer les parties communes.',w:[LD,'A = '+kPi(3*a2)+uu]},{v:pib(a*a,2.5*a*a),tag:'geo-lentille',msg:'Tu as retiré un quart de disque par recouvrement au lieu de la lentille entière (quart de disque − triangle, deux fois).',w:[LD,'L = π × '+a+'² / 4 − '+a+'² / 2 = '+kPi(a2/4)+' − '+kX(a2/2),'A = '+kPi(3*a2)+' − 2 × ('+kPi(a2/4)+' − '+kX(a2/2)+') = '+kPi(2.5*a2)+' + '+a2+uu]},{v:pib(A/2*0+a*a,2.5*a*a),tag:'geo-lentille',msg:'Tu as retiré une seule lentille : le cercle du bas en coupe deux.',w:[LD,LL,'A = '+kPi(3*a2)+' − ('+kPi(a2/2)+' − '+a2+') = '+kPi(2.5*a2)+' + '+a2+uu]},{v:pib(-A,B),tag:'geo-lentille',msg:'Signe à revoir : la lentille vaut (π/2 − 1)a², donc en la retirant deux fois on ajoute 2a².',w:[LD,LL,'A = '+kPi(3*a2)+' − 2 × '+kPi(a2/2)+' − 2 × '+a2+' = '+kPi(2*a2)+' − '+(2*a2)+uu]},{v:pib(0,2*a*a),tag:'geo-lentille',msg:'Il manque la partie « triangles » : la lentille n\'est pas un quart de disque, on retire quart de disque − triangle.',w:[LD,'L = 2 × π × '+a+'² / 4 = '+kPi(a2/2),'A = '+kPi(3*a2)+' − 2 × '+kPi(a2/2)+' = '+kPi(2*a2)+uu]}]});
}
TAGS['geo-lentille']={label:'Recouvrement de disques',tip:'Aire d\'une réunion = somme des aires − aires des parties communes. Une lentille entre deux quarts de disque se calcule : quart de disque − triangle, deux fois.'};

/* n°23 : zones grises, système x, y */
function genZones(){
  const sq=Math.random()<0.5, u=uP();
  if(sq){
    const c=pick([2,4,6,8]), r=c*Math.SQRT1_2, val=pib(-c*c,c*c/2);
    const c2=c*c, uu=' '+u+'²', Z5=['r² = ('+c+' / 2)² + ('+c+' / 2)² = '+kX(c2/2),'4x + 4y = '+c+'² = '+c2,'2x + y = π × '+kX(c2/2)+' / 4 = '+kPi(c2/8),'2y = '+c2+' − '+kPi(c2/4),'y = ('+c2+' − '+kPi(c2/4)+') / 2 = '+kX(c2/2)+' − '+kPi(c2/8)];
    const Z2x='2x = '+kPi(c2/8)+' − ('+kX(c2/2)+' − '+kPi(c2/8)+') = '+kPi(c2/4)+' − '+kX(c2/2);
    const svg=figure([[0,0],[c,c]],f=>{
      const s=f.s, P=q=>f(q), col=[[0,0],[c,0],[c,c],[0,c]];
      // pétales : entre deux sommets adjacents A,B ; sur le côté AB
      const petal=(A,B)=>{ const d=vunit(vsub(B,A)), p1=vadd(A,vmul(d,c-r)), p2=vadd(A,vmul(d,r)), M_=[c/2,c/2];
        return g.path(mv(P(M_))+carc(P(M_),P(p1),P(B),r*s)+' L'+gf(P(p2)[0])+' '+gf(P(p2)[1])+carc(P(p2),P(M_),P(A),r*s)+' Z','g-f g-hl'); };
      let out=g.poly(col.map(P),'g-sq');
      for(let i=0;i<4;i++) out+=petal(col[i],col[(i+1)%4]);
      out+=g.seg(P([0,c]),P([c/2,c/2]),'g-dash')+g.text(vadd(vmid(P([0,c]),P([c/2,c/2])),[-9,-9]),'r','g-v')+g.dim(P([c,0]),P([c,c]),'c',P([0,c/2]),14);
      return out;
    },'Carré de côté c avec quatre pétales gris obtenus par des arcs de rayon r centrés aux sommets',{H:240,pad:34});
    return mkGeo({svg,mode:'pi',val,unit:u,pow:2,
      text:'Dans un carré de côté «c = '+c+'» '+u+', quatre arcs de rayon «r» (la demi-diagonale du carré) sont centrés aux quatre sommets et se rejoignent au centre. Calcule l\'aire des <b>quatre zones grises</b> (valeur exacte). Note «x» l\'aire d\'un pétale gris et «y» celle d\'un coin blanc.',ask:'l\'aire des quatre zones grises (valeur exacte)',
      placeholder:'4x + 4y = c²\n2x + y = π r² / 4\n4x = ...',
      steps:[stp('Rayon',M('r = √((c/2)² + (c/2)²) = c√2/2')+', donc '+M('r² = c²/2 = '+NF(c*c/2))),stp('Le carré se décompose en 4 pétales et 4 coins',M('4x + 4y = c² = '+c*c)),stp('Un quart de disque de rayon r contient 2 pétales et 1 coin',M('2x + y = πr²/4 = πc²/8 = '+NF(c*c/8)+'π')),stp('Élimine y','On multiplie la seconde équation par (−2) et on additionne membre à membre :',M('2y = c² − πc²/4')+', donc '+M('y = c²(4 − π)/8')),stp('Aire grise',M('4x = c² − 4y = c² − c²(4 − π)/2 = c²(π − 2)/2 = '+NF(c*c/2)+'π − '+c*c))],
      hints:['Compte les morceaux : 4 pétales (x) et 4 coins (y) remplissent le carré ; un quart de disque centré en un sommet contient 2 pétales et 1 coin.','Résous le système « 4x + 4y = c² ; 2x + y = πr²/4 » par combinaison.'],
      work:Z5.concat(['4x = '+c2+' − 4 × ('+kX(c2/2)+' − '+kPi(c2/8)+') = '+kPi(c2/2)+' − '+c2+uu]),
      mistakes:[{v:pib(0,c*c/2),tag:'geo-zones',msg:'Tu as additionné les quatre quarts de disque (πr²) : chaque pétale y est compté deux fois et les coins aussi. Il faut résoudre le système.',w:[Z5[0],'A = 4 × π × '+kX(c2/2)+' / 4 = '+kPi(c2/2)+uu]},{v:pib(-c*c/2,c*c/4),tag:'geo-zones',msg:'Tu as calculé 2x (deux pétales), pas quatre.',w:Z5.concat([Z2x+uu])},{v:pib(-c*c/4,c*c/8),tag:'geo-zones',msg:'Tu as calculé l\'aire d\'un seul pétale x.',w:Z5.concat([Z2x,'x = ('+kPi(c2/4)+' − '+kX(c2/2)+') / 2 = '+kPi(c2/8)+' − '+kX(c2/4)+uu])},{v:pib(-2*c*c,c*c),tag:'geo-zones',msg:'Il y a un facteur 2 en trop : 4x = c²(π − 2)/2.',w:Z5.concat([Z2x,'4x = 4 × ('+kPi(c2/4)+' − '+kX(c2/2)+') = '+kPi(c2)+' − '+(2*c2)+uu])},{v:pib(c*c,-c*c/2),tag:'geo-zones',msg:'Signe inversé : l\'aire est positive, π − 2 > 0.',w:Z5.concat(['4x = 4 × ('+kX(c2/2)+' − '+kPi(c2/8)+') − '+c2+' = '+c2+' − '+kPi(c2/2)+uu])}].filter(m=>m.v.a!==val.a||m.v.b!==val.b)});
  }
  const c=pick([2,4,6]), val={a:-1.5*c*c*Math.sqrt(3),b:c*c};
  const exact=NF(c*c)+'π - '+NF(1.5*c*c)+'√3';
  const c2=c*c, uu=' '+u+'²', H1='3x + 3y = 6 × '+c+'² × √3 / 4 = '+kRt(1.5*c2,3), H2='2x + y = 120 / 360 × π × '+c+'² = '+kPi(c2/3), H3='−3x = '+kRt(1.5*c2,3)+' − 3 × '+kPi(c2/3)+' = '+kRt(1.5*c2,3)+' − '+kPi(c2), Hx='x = ('+kPi(c2)+' − '+kRt(1.5*c2,3)+') / 3 = '+kPi(c2/3)+' − '+kRt(0.5*c2,3);
  const svg=figure([[-1.15,-1.0],[1.15,1.0]],f=>{
    const s=f.s, V=k=>[Math.cos(k*Math.PI/3),Math.sin(k*Math.PI/3)], P=q=>f(q), O=[0,0];
    let out=g.poly([0,1,2,3,4,5].map(k=>P(V(k))),'g-sq');
    [3,1,5].forEach(k=>{ const Vk=V(k), N1=V((k+1)%6), N2=V((k+5)%6);
      out+=g.path(mv(P(O))+carc(P(O),P(Vk),P(N1),s)+carc(P(Vk),P(O),P(N2),s)+' Z','g-f g-hl'); });
    out+=g.dim(P(V(0)),P(V(1)),'c',P(O),14);
    return out;
  },'Hexagone régulier de côté c avec trois pétales gris',{H:230,pad:34});
  return mkGeo({svg,mode:'pi',exact,val,unit:u,pow:2,
    text:'Un hexagone régulier de côté «c = '+c+'» '+u+' contient trois pétales gris, chacun formé par l\'intersection de deux disques de rayon «c» centrés aux sommets voisins. Calcule l\'aire des <b>trois zones grises</b> (valeur exacte). Note «x» l\'aire d\'un pétale gris et «y» celle des trois autres zones blanches, chacune valant «y».',ask:'l\'aire des trois zones grises (valeur exacte)',
    placeholder:'3x + 3y = aire de l\'hexagone\n2x + y = π c² / 3\n3x = ...',
    steps:[stp('Aire de l\'hexagone','6 triangles équilatéraux de côté c :',M('3x + 3y = 6 × c²√3/4 = 3c²√3/2 = '+NF(1.5*c*c)+'√3')),stp('Un secteur de 120° et de rayon c contient 2 pétales et 1 zone blanche',M('2x + y = (120/360) π c² = πc²/3 = '+NF(c*c/3)+'π')),stp('Élimine y','On multiplie la seconde équation par (−3) et on additionne :',M('−3x = 3c²√3/2 − πc²'),M('3x = πc² − 3c²√3/2 = c²(π − 3√3/2)')),stp('Aire grise',M('3x = '+exact))],
    hints:['L\'hexagone régulier se coupe en 6 triangles équilatéraux de côté c : son aire vaut 6 × c²√3/4.','Un secteur de 120° centré en un sommet contient 2 pétales et 1 zone blanche.'],
    work:[H1,H2,H3,'3x = '+kPi(c2)+' − '+kRt(1.5*c2,3)+uu],
    mistakes:[{v:{a:0,b:c*c},tag:'geo-zones',msg:'Tu as calculé πc² sans retirer la partie « hexagone » : il faut résoudre le système.',w:[H1,H2,'3x = 3 × '+kPi(c2/3)+' = '+kPi(c2)+uu]},{v:{a:-1.5*c*c*Math.sqrt(3)/3,b:c*c/3},tag:'geo-zones',msg:'Tu as calculé l\'aire d\'un seul pétale x (le tiers).',w:[H1,H2,H3,Hx+uu]},{v:{a:-3*c*c*Math.sqrt(3),b:2*c*c},tag:'geo-zones',msg:'Facteur 2 en trop : 3x = c²(π − 3√3/2).',w:[H1,H2,H3,Hx,'A = 6 × ('+kPi(c2/3)+' − '+kRt(0.5*c2,3)+') = '+kPi(2*c2)+' − '+kRt(3*c2,3)+uu]},{v:{a:0,b:c*c/3},tag:'geo-zones',msg:'Tu as calculé 2x + y (un secteur de 120°), pas l\'aire des trois pétales.',w:[H1,H2,'A = '+kPi(c2/3)+uu]},{v:{a:-0.75*c*c*Math.sqrt(3),b:c*c},tag:'geo-zones',msg:'L\'aire de l\'hexagone est 3c²√3/2, pas 3c²√3/4.',w:['3x + 3y = 3 × '+c+'² × √3 / 4 = '+kRt(0.75*c2,3),H2,'−3x = '+kRt(0.75*c2,3)+' − 3 × '+kPi(c2/3)+' = '+kRt(0.75*c2,3)+' − '+kPi(c2),'3x = '+kPi(c2)+' − '+kRt(0.75*c2,3)+uu]}]});
}
TAGS['geo-zones']={label:'Système d\'aires (pétales)',tip:'Pose deux équations : la somme de toutes les zones (aire de la figure) et l\'aire d\'un secteur ou d\'un quart de disque exprimée avec les mêmes zones. Combine-les pour éliminer y.'};

TOPICS['gm-6c']={kind:'gcomp',level:6,label:'Ogive et cercles tangents',gen:genOgive};
TOPICS['gc-6c']={kind:'gcirc',level:6,label:'Réunion de trois disques (quadrillage)',gen:genSurfGrise};
TOPICS['gc-6d']={kind:'gcirc',level:6,label:'Zones grises : carré et hexagone',gen:genZones};

/* ===== Livre n°24 et n°26 ===== */
Object.assign(TAGS,{
  'geo-euclide':{label:'Hauteur du triangle rectangle',tip:'Dans un triangle rectangle, la hauteur issue de l\'angle droit crée deux petits triangles rectangles. Théorème d\'Euclide : cathète² = projection × hypoténuse (AE² = AB × AD). Sans Euclide : pose AB = x et écris Pythagore dans les trois triangles rectangles.'},
  'geo-tangentes':{label:'Cercles tangents dans un angle',tip:'Les centres sont sur l\'axe (bissectrice). Les rayons menés aux points de contact sont perpendiculaires au côté, donc parallèles : Thalès ou triangles semblables. Deux cercles tangents : distance des centres = somme des rayons.'},
  'geo-heron':{label:'Triangle dont on connaît les trois côtés',tip:'Formule de Héron : p = (a + b + c)/2 et A = √(p(p − a)(p − b)(p − c)). Vérifie d\'abord la longueur de chaque côté (un côté peut contenir le diamètre d\'une encoche).'},
  'geo-segment':{label:'Segment circulaire',tip:'Segment circulaire = secteur − triangle formé par les deux rayons et la corde. Si la corde est à une distance du centre égale à la moitié du rayon, l\'angle au centre vaut 120° (demi-triangle équilatéral).'}
});
/* (num/den)·√n simplifié, par ex. 3√15/2 */
const sqrtFrac=(num,den,n)=>{ const s=simpRad(n); let c=num*s.k, d=den; const q=gcd_(c,d); c/=q; d/=q; const core=s.r===1?String(c):(c===1?'':c)+'√'+s.r; return d===1?core:core+'/'+d; };
const fr3=N=>{ if(N%3===0){ const q=N/3; return (q===1?'':q)+'π'; } return N+'π/3'; };

/* n°24 (a) : triangle rectangle AED, hauteur EB, arc centré en A */
function genTriGris(){
  const P_=pick([[3,6],[3,6],[3,6],[4,4],[6,3],[6,12],[4,12],[6,6]]), a=P_[0], d=P_[1], AD=a+d, p=a*a/AD, h2=a*a-p*p, bc=a-p, u=uP(), h=Math.sqrt(h2);
  const eb=radStr(h2), exact=sqrtFrac(bc,2,h2), area=bc*h/2;
  const svg=figure([[-0.3*a,-0.45*a],[AD,a*1.02]],f=>{
    const s=f.s, pa=f([0,0]), pb=f([p,0]), pc=f([a,0]), pd=f([AD,0]), pe=f([p,h]), ce=cen([pa,pd,pe]);
    const t1=105*Math.PI/180, t2=-28*Math.PI/180, q1=f([a*Math.cos(t1),a*Math.sin(t1)]), q2=f([a*Math.cos(t2),a*Math.sin(t2)]);
    let out=g.path(mv(q1)+' A'+gf(a*s)+' '+gf(a*s)+' 0 0 1 '+gf(q2[0])+' '+gf(q2[1]),'g-thin g-dash');
    out+=g.poly([pe,pb,pc],'g-hl')+g.poly([pa,pd,pe],'g-sq')+g.seg(pe,pb)+g.right(pb,pe,pc,10)+g.right(pe,pa,pd,10);
    out+=g.len(pa,pe,String(a),ce,10)+g.len(pc,pd,String(d),ce,10);
    out+=g.dot(pa)+g.dot(pc)+g.text([pa[0]-8,pa[1]+17],'A','g-v')+g.text([pb[0]+2,pb[1]+17],'B','g-v')+g.text([pc[0]+8,pc[1]+17],'C','g-v')+g.text([pd[0]+6,pd[1]+17],'D','g-v')+g.text([pe[0],pe[1]-15],'E','g-v');
    return out;
  },'Triangle AED rectangle en E, hauteur EB, triangle gris EBC, arc centré en A passant par E et C',{H:230,pad:30});
  const txt='Les points «A», «B», «C» et «D» sont alignés. Le triangle «AED» est <b>rectangle en «E»</b> et «EB» est sa hauteur. L\'arc en pointillés est <b>centré en «A»</b> : il passe par «E» et par «C». On donne «AE = '+a+'» '+u+' et «CD = '+d+'» '+u+'. Calcule l\'aire du triangle gris «EBC». Donne la <b>valeur exacte</b>.';
  const uu=' '+u+'²', G2=['AC = AE = '+a,'AD = '+a+' + '+d+' = '+AD], G5=G2.concat(['AB = '+a+'² / '+AD+' = '+p,'EB² = '+a+'² − '+p+'² = '+h2,'EB = √'+h2+(eb!=='√'+h2?' = '+eb:'')]), G6=G5.concat(['BC = '+a+' − '+p+' = '+bc]);
  const s2=a*a+p*p, e2=radStr(s2), ha=kX(a/2), eh=sqrtFrac(a,2,3);
  const mis=[{v:bc*h,tag:'geo-demi',msg:'Tu as oublié de diviser par 2 : l\'aire d\'un triangle vaut base × hauteur / 2.',w:G6.concat(['A = '+bc+' × '+eb+' = '+sqrtFrac(bc,1,h2)+uu])},
    {v:d*h/2,tag:'geo-decomp',msg:'Tu as calculé l\'aire du triangle ECD. Le triangle gris est EBC, de base BC = AC − AB.',w:G5.concat(['A = '+d+' × '+eb+' / 2 = '+sqrtFrac(d,2,h2)+uu])},
    {v:p*h/2,tag:'geo-decomp',msg:'Tu as calculé l\'aire du triangle ABE (à gauche de la hauteur). Le triangle gris est EBC.',w:G5.concat(['A = '+p+' × '+eb+' / 2 = '+sqrtFrac(p,2,h2)+uu])},
    {v:AD*h/2,tag:'geo-decomp',msg:'C\'est l\'aire du grand triangle AED. Le triangle gris est seulement EBC.',w:G5.concat(['A = '+AD+' × '+eb+' / 2 = '+sqrtFrac(AD,2,h2)+uu])},
    {v:a*a*Math.sqrt(3)/8,tag:'geo-euclide',msg:'B n\'est pas le milieu de [AC]. Calcule AB avec le théorème d\'Euclide : AE² = AB × AD.',w:G2.concat(['AB = '+a+' / 2 = '+ha,'EB² = '+a+'² − '+ha+'² = '+kX(0.75*a*a),'EB = √'+kX(0.75*a*a)+' = '+eh,'BC = '+a+' − '+ha+' = '+ha,'A = '+ha+' × '+kPar(eh)+' / 2 = '+sqrtFrac(a*a,8,3)+uu])},
    {v:bc*Math.sqrt(a*a+p*p)/2,tag:'geo-pyth-cote',msg:'Dans le triangle ABE, l\'hypoténuse est AE : EB² = AE² − AB² (on soustrait).',w:G2.concat(['AB = '+a+'² / '+AD+' = '+p,'EB² = '+a+'² + '+p+'² = '+s2,'EB = √'+s2+(e2!=='√'+s2?' = '+e2:''),'BC = '+a+' − '+p+' = '+bc,'A = '+bc+' × '+e2+' / 2 = '+sqrtFrac(bc,2,s2)+uu])}];
  const p2=a*a/d; if(p2<a){ const ab=kX(p2), q2=kX(a*a-p2*p2), ebq=sqrtFrac(a,d,d*d-a*a), bq=kX(a-p2);
    mis.push({v:(a-p2)*Math.sqrt(a*a-p2*p2)/2,tag:'geo-euclide',msg:'Dans AE² = AB × AD, il faut l\'hypoténuse entière AD = AC + CD = '+AD+', pas CD.',w:['AC = AE = '+a,'AB = '+a+'² / '+d+' = '+ab,'EB² = '+a+'² − '+kPar(ab)+'² = '+q2,'EB = √'+kPar(q2)+' = '+ebq,'BC = '+a+' − '+ab+' = '+bq,'A = '+kPar(bq)+' × '+kPar(ebq)+' / 2 = '+sqrtFrac(a*a*(d-a),2*d*d,d*d-a*a)+uu]}); }
  return mkGeo({svg,mode:'sqrt',exact,val:area,unit:u,pow:2,text:txt,ask:'l\'aire du triangle gris EBC (valeur exacte)',
    work:G6.concat(['A = '+bc+' × '+eb+' / 2 = '+exact+uu]),
    placeholder:'AD = ...\nAB = AE² / AD = ...\nEB = ...\nA = BC × EB / 2 = ...',
    steps:[stp('Longueurs sur la droite',M('AC = AE = '+a)+' (même arc de centre A), donc '+M('AD = AC + CD = '+a+' + '+d+' = '+AD)),
      stp('Théorème d\'Euclide dans le triangle AED rectangle en E',M('AE² = AB × AD')+', donc '+M('AB = '+a+'² / '+AD+' = '+p),'Sans ce théorème : Pythagore dans ABE, DBE et AED donne la même valeur.'),
      stp('Hauteur EB (Pythagore dans ABE)',M('EB² = AE² − AB² = '+(a*a)+' − '+(p*p)+' = '+h2)+', donc '+M('EB = '+(eb==='√'+h2?eb:'√'+h2+' = '+eb))),
      stp('Base BC',M('BC = AC − AB = '+a+' − '+p+' = '+bc)),
      stp('Aire du triangle gris',M('A = BC × EB / 2 = '+bc+' × '+eb+' / 2 = '+exact)+' '+u+'²')],
    hints:['L\'arc est centré en A : AC = AE. Tu connais donc AD = AC + CD.','Dans le triangle AED rectangle en E, la hauteur EB vérifie AE² = AB × AD (théorème d\'Euclide). Ensuite, Pythagore dans ABE donne EB.'],
    mistakes:mis});
}

/* n°24 (b) : triangle isocèle, cercles de rayons 2r et r */
function genTriCercles(){
  const lit=Math.random()<0.5, r=pick([1,2,3]), u=uP(), S2=Math.SQRT2;
  const svg=figure([[-0.6,-2*S2],[8.6,2*S2]],f=>{
    const s=f.s, S=f([8,0]), B=f([0,2*S2]), C=f([0,-2*S2]), O=f([2,0]), Pc=f([5,0]), H=f([0,0]);
    const e1=f([2+2*Math.cos(2.4),2*Math.sin(2.4)]), e2=f([5+Math.cos(-0.5),Math.sin(-0.5)]);
    let out=g.poly([B,S,C],'g-hl')+g.circle(O,2*s,'g-hole')+g.circle(Pc,s,'g-hole');
    out+=g.seg(O,e1,'g-thin')+g.seg(Pc,e2,'g-thin')+g.dot(O)+g.dot(Pc)+g.dot(H);
    out+=g.text(vadd(vmid(O,e1),[10,-6]),lit?'2r':String(2*r),'g-u2')+g.text(vadd(vmid(Pc,e2),[-2,11]),lit?'r':String(r),'g-u2');
    out+=g.text([S[0]+12,S[1]],'S','g-v')+g.text([B[0]-10,B[1]-6],'B','g-v')+g.text([C[0]-10,C[1]+6],'C','g-v')+g.text([H[0]-12,H[1]],'H','g-v')+g.text([O[0]+2,O[1]+13],'O','g-v')+g.text([Pc[0]-2,Pc[1]-13],'P','g-v');
    return out;
  },'Triangle isocèle SBC contenant un cercle de rayon 2r tangent aux trois côtés et un cercle de rayon r tangent au premier et aux côtés SB et SC',{H:230,pad:26});
  const base='Le triangle «SBC» est <b>isocèle</b> de sommet «S». Le grand cercle (centre «O»'+(lit?', rayon «2r»':', rayon «'+2*r+'» '+u)+') touche les trois côtés ; le petit cercle (centre «P»'+(lit?', rayon «r»':', rayon «'+r+'» '+u)+') touche le grand cercle et les côtés «SB» et «SC». ';
  const k2=lit?'':' ';
  const steps=[stp('Centres sur l\'axe','Les deux cercles touchent [SB] et [SC] : O et P sont sur l\'axe de symétrie (SH). Les cercles sont tangents : '+M('OP = 2r + r = 3r')+'.'),
    stp('Thalès avec les rayons de contact','Les rayons menés aux points de contact avec [SB] sont perpendiculaires à [SB], donc parallèles :',M('SP / SO = r / 2r')+', donc '+M('SP / (SP + 3r) = 1/2')+' : '+M('SP = 3r')+' et '+M('SO = 6r')+'.'),
    stp('Hauteur du triangle',M('SH = SO + OH = 6r + 2r = 8r')),
    stp('Demi-base','Soit T le point de contact du grand cercle avec [SB] : '+M('ST = √(SO² − OT²) = √(36r² − 4r²) = 4√2 r')+'. Les triangles STO et SHB sont semblables (angle en S commun, angles droits en T et H) :',M('HB / SH = OT / ST')+', donc '+M('HB = 8r × 2r / (4√2 r) = 2√2 r')+'.'),
    stp('Aire du triangle',M('A(SBC) = 2 × HB × SH / 2 = 2√2 r × 8r = 16√2 r²')),
    stp('Surface grise',M('A = 16√2 r² − π(2r)² − πr² = 16√2 r² − 5πr²')+(lit?'':' ; avec '+M('r = '+r)+' : '+M('A = '+NF(16*r*r)+'√2 − '+NF(5*r*r)+'π')+' '+u+'²'))];
  const hints=['Place les centres O et P sur l\'axe de symétrie (SH). Distance OP = somme des rayons. Les rayons perpendiculaires à [SB] donnent un rapport de Thalès : SP / SO = r / 2r.','Tu dois trouver la hauteur SH = 8r puis la demi-base HB avec les triangles semblables STO et SHB (T : contact du grand cercle avec [SB]).'];
  /* développement d'élève ; v = '' (juste) ou la variante de l'erreur */
  const tcW=v=>{ const R_=r*r, n=x=>lit?(x===1?'':x)+'r':NF(x*r), q=x=>lit?'('+n(x)+')²':n(x)+'²';
    const rt=c=>lit?kRt(c,2)+' r':kRt(c*r,2), rt2=c=>lit?kRt(c,2)+' r²':kRt(c*R_,2), pk=c=>lit?kPi(c)+'r²':kPi(c*R_);
    const H=v==='sh6'?n(6):n(8), L=['OP = '+n(2)+' + '+n(1)+' = '+n(3),'SP / (SP + '+n(3)+') = 1 / 2','SP = '+n(3),'SO = '+n(3)+' + '+n(3)+' = '+n(6),
      v==='sh6'?'SH = SO = '+n(6):'SH = '+n(6)+' + '+n(2)+' = '+n(8),'ST = √('+q(6)+' − '+q(2)+') = '+rt(4)];
    let T;
    if(v==='so'){ const hb=lit?'8r/3':kX(8*r/3), bc=lit?'16r/3':kX(16*r/3); T=lit?'64r²/3':kX(64*R_/3);
      L.push('HB = '+H+' × '+n(2)+' / '+n(6)+' = '+hb,'BC = 2 × '+kPar(hb)+' = '+bc,'T = '+kPar(bc)+' × '+H+' / 2 = '+T); }
    else { const c=v==='sh6'?1.5:2; T=rt2(v==='sh6'?9:(v==='demi'?32:16));
      L.push('HB = '+H+' × '+n(2)+' / ('+rt(4)+') = '+rt(c),'BC = 2 × '+rt(c)+' = '+rt(2*c),'T = '+rt(2*c)+' × '+H+(v==='demi'?'':' / 2')+' = '+T); }
    const big=lit?'π(2r)²':'π × '+n(2)+'²', sm=lit?'πr²':'π × '+n(1)+'²';
    let A1=' − '+big+' − '+sm, fin=' − '+pk(5);
    if(v==='p2'){ A1=' − 2'+(lit?'':' × ')+sm+' − '+sm; fin=' − '+pk(3); }
    else if(v==='big'){ A1=' − '+big; fin=' − '+pk(4); }
    else if(v==='plus'){ A1=' + '+big+' + '+sm; fin=' + '+pk(5); }
    else if(v==='none'){ A1=''; fin=''; }
    if(lit) return L.concat(A1?['A = '+T+A1,'A = '+T+fin]:['A = '+T]);
    return L.concat(['A = '+T+A1+(A1?' = '+T+fin:'')+' '+u+'²']);
  };
  const M_=[['16√2',16*S2,-3,'geo-aire-pi','L\'aire du grand disque est π(2r)² = 4πr², pas 2πr².','p2'],
    ['16√2',16*S2,-4,'geo-decomp','Tu n\'as retiré que le grand disque : retire aussi le petit (πr²).','big'],
    ['16√2',16*S2,0,'geo-decomp','C\'est l\'aire du triangle. La surface grise = triangle − les deux disques.','none'],
    ['16√2',16*S2,5,'geo-decomp','Les disques sont blancs : on les retire de l\'aire du triangle, on ne les ajoute pas.','plus'],
    ['32√2',32*S2,-5,'geo-demi','L\'aire du triangle vaut base × hauteur / 2 : 4√2 r × 8r / 2 = 16√2 r².','demi'],
    ['64/3',64/3,-5,'geo-tangentes','Dans les triangles semblables STO et SHB, OT correspond à ST (côté de l\'angle droit), pas à SO (hypoténuse) : HB = SH × OT / ST.','so'],
    ['9√2',9*S2,-5,'geo-tangentes','La hauteur SH va jusqu\'à la base : SH = SO + OH = 6r + 2r = 8r (le grand cercle touche la base).','sh6']];
  if(lit) return mkGeo({mode:'fn',fn:{lhs:'A',exact:'16√2 r² − 5πr²',vars:['r']},svg,unit:'',val:0,
    text:base+'Exprime l\'aire de la <b>surface grise</b> en fonction de «r» (valeur exacte).',ask:'l\'aire grise en fonction de r',
    placeholder:'SO = ...\nSH = ...\nHB = ...\nA = ...',steps,hints,
    work:tcW(''),
    mistakes:M_.map(m=>({s:m[0]+'r^2'+(m[2]?(m[2]<0?'-':'+')+Math.abs(m[2])+'πr^2':''),tag:m[3],msg:m[4],w:tcW(m[5])}))});
  const R2=r*r;
  return mkGeo({svg,mode:'pi',exact:NF(16*R2)+'√2 − '+NF(5*R2)+'π',val:{a:16*S2*R2,b:-5*R2},unit:u,pow:2,
    text:base+'Calcule l\'aire de la <b>surface grise</b>. Donne la <b>valeur exacte</b>.',ask:'l\'aire de la surface grise (valeur exacte)',
    placeholder:'SO = ...\nSH = ...\nHB = ...\nA = ...',steps,hints,
    work:tcW(''),
    mistakes:M_.map(m=>({v:{a:m[1]*R2,b:m[2]*R2},tag:m[3],msg:m[4],w:tcW(m[5])}))});
}

/* n°26 (a) : pentagone à deux encoches */
function genBotte(){
  const k=pick([1,1,2]), ask=pick(['aire','périmètre']), u=uP(), K=q=>vmul(q,k);
  const Lt=[0,5], Sx=[12,0], uu=[12/13,-5/13], nn=[5/13,12/13], xa=62/13, ha=8*Math.sqrt(35)/13;
  const Pp=vadd(vadd(Lt,vmul(uu,xa)),vmul(nn,ha)), v=vunit(vsub(Sx,Pp)), nOut=[-v[1],v[0]];
  const Q=vadd(Pp,vmul(v,3)), Rr=vadd(Pp,vmul(v,5)), N=vadd(Pp,vmul(v,4));
  const svg=figure([K([-0.8,-0.6]),K([12.4,7.2])],f=>{
    const s=f.s, F=q=>f(K(q)), o=F([0,0]), a1=F([3,0]), a2=F([7,0]), ce=F([4,3]);
    const d=mv(o)+' L'+gf(a1[0])+' '+gf(a1[1])+carc(a1,a2,F([5,-0.5]),2*k*s)+' L'+gf(F(Sx)[0])+' '+gf(F(Sx)[1])+' L'+gf(F(Rr)[0])+' '+gf(F(Rr)[1])+carc(F(Rr),F(Q),F(vadd(N,vmul(nOut,0.5))),k*s)+' L'+gf(F(Pp)[0])+' '+gf(F(Pp)[1])+' L'+gf(F(Lt)[0])+' '+gf(F(Lt)[1])+' Z';
    let out=g.path(d,'g-f')+g.right(o,F(Lt),a1,10);
    const r2=F([5+2*Math.cos(2.1),2*Math.sin(2.1)]), r1=F(vadd(N,vmul(nOut,-1)));
    out+=g.seg(F([5,0]),r2,'g-thin')+g.seg(F(N),r1,'g-thin')+g.dot(F([5,0]))+g.dot(F(N));
    out+=g.text(vadd(vmid(F([5,0]),r2),[9,2]),String(2*k),'g-u2')+g.text(vadd(vmid(F(N),r1),[9,4]),String(k),'g-u2');
    [[0,0],[3,0],[7,0],Sx,Rr,Q,Pp,Lt].forEach(q=>{ out+=g.dot(F(q)); });
    out+=g.len(o,F(Lt),String(5*k),ce,10)+g.len(F(Lt),F(Pp),String(6*k),ce,10)+g.len(F(Pp),F(Q),String(3*k),ce,10)+g.len(F(Rr),F(Sx),String(4*k),ce,10)+g.len(o,a1,String(3*k),ce,8)+g.len(a2,F(Sx),String(5*k),ce,8);
    return out;
  },'Pentagone avec une encoche en demi-cercle de rayon '+2*k+' sur la base et une encoche de rayon '+k+' sur le côté oblique',{H:240,pad:26});
  const intro='La surface colorée est limitée par des segments et par deux <b>demi-cercles</b> (encoches) de rayons «'+2*k+'» et «'+k+'», dont les centres sont sur le bord. L\'angle en bas à gauche est droit. Les côtés «'+3*k+'» et «'+4*k+'» de droite et le diamètre de la petite encoche sont <b>alignés</b>. Les longueurs sont en '+u+'. ';
  const K2=k*k, A0=K2*(30+4*Math.sqrt(35));
  const PS='S = '+[5,6,3,4,5,3].map(x=>x*k).join(' + ')+' = '+26*k, PC='C = π × '+2*k+' + π × '+k+' = '+kPi(3*k);
  if(ask==='périmètre') return mkGeo({svg,mode:'pi',val:pib(26*k,3*k),unit:u,pow:1,
    text:intro+'Calcule le <b>périmètre</b> de la surface colorée. Donne la <b>valeur exacte</b>.',ask:'le périmètre (valeur exacte)',
    placeholder:'segments = ...\ndemi-cercles = ...\nP = ...',
    steps:[stp('Segments du contour',M([5,6,3,4,5,3].map(x=>x*k).join(' + ')+' = '+26*k)+'. Les diamètres des encoches ne font pas partie du contour.'),
      stp('Demi-cercles','Un demi-cercle de rayon r mesure '+M('πr')+' : '+M('π × '+2*k+' + π × '+k+' = '+(3*k)+'π')),
      stp('Périmètre',M('P = '+26*k+' + '+3*k+'π ≈ '+NF(Math.round((26*k+3*k*Math.PI)*100)/100))+' '+u)],
    hints:['Le contour est formé de six segments et de deux demi-cercles. Les diamètres des encoches ne sont pas sur le contour.','Longueur d\'un demi-cercle de rayon r : la moitié de 2πr, donc πr.'],
    work:[PS,PC,'P = '+26*k+' + '+kPi(3*k)+' '+u],
    mistakes:[{v:pib(32*k,0),tag:'geo-perim-cote',msg:'Tu as remplacé les demi-cercles par leurs diamètres. Le contour suit les arcs : un demi-cercle mesure πr.',w:[PS,'D = '+4*k+' + '+2*k+' = '+6*k,'P = '+26*k+' + '+6*k+' = '+32*k+' '+u]},
      {v:pib(26*k,6*k),tag:'geo-perim-cote',msg:'Tu as compté des cercles entiers. Chaque encoche est un demi-cercle : πr.',w:[PS,'C = 2π × '+2*k+' + 2π × '+k+' = '+kPi(6*k),'P = '+26*k+' + '+kPi(6*k)+' '+u]},
      {v:pib(26*k,2.5*K2),tag:'geo-aire-pi',msg:'πr² donne une aire. Pour une longueur d\'arc, utilise πr (demi-cercle).',w:[PS,'C = π × '+2*k+'² / 2 + π × '+k+'² / 2 = '+kPi(2.5*K2),'P = '+26*k+' + '+kPi(2.5*K2)+' '+u]},
      {v:pib(32*k,3*k),tag:'geo-perim-cote',msg:'Les diamètres des encoches ne font pas partie du contour : ne les ajoute pas aux arcs.',w:[PS,PC,'D = '+4*k+' + '+2*k+' = '+6*k,'P = '+26*k+' + '+6*k+' + '+kPi(3*k)+' = '+32*k+' + '+kPi(3*k)+' '+u]},
      {v:pib(26*k,1.5*k),tag:'geo-aire-pi',msg:'Un demi-cercle de rayon r mesure πr (moitié de 2πr), pas πr/2.',w:[PS,'C = π × '+2*k+' / 2 + π × '+k+' / 2 = '+kPi(1.5*k),'P = '+26*k+' + '+kPi(1.5*k)+' '+u]}]});
  const half=5*K2%2===0?NF(2.5*K2)+'π':(5*K2)+'π/2';
  const exact=NF(30*K2)+' + '+NF(4*K2)+'√35 − '+half;
  const L=x=>NF(x*k);
  const u2_=' '+u+'²', B1='b = '+L(3)+' + '+L(4)+' + '+L(5)+' = '+L(12), B2='A₁ = '+L(5)+' × '+L(12)+' / 2 = '+NF(30*K2), B3='d = √('+L(5)+'² + '+L(12)+'²) = '+L(13);
  const B6=[B1,B2,B3,'c = '+L(3)+' + '+L(2)+' + '+L(4)+' = '+L(9),'p = ('+L(6)+' + '+L(9)+' + '+L(13)+') / 2 = '+L(14),'A₂ = √('+L(14)+' × '+L(8)+' × '+L(5)+' × '+L(1)+') = '+kRt(4*K2,35)];
  const B7='E = π × '+L(2)+'² / 2 + π × '+L(1)+'² / 2 = '+half, AP=NF(30*K2)+' + '+kRt(4*K2,35);
  return mkGeo({svg,mode:'pi',exact,val:{a:A0,b:-2.5*K2},unit:u,pow:2,
    text:intro+'Calcule l\'<b>aire</b> de la surface colorée. Donne la <b>valeur exacte</b>.',ask:'l\'aire (valeur exacte)',
    placeholder:'triangle rectangle = ...\ntriangle (Héron) = ...\nencoches = ...\nA = ...',
    work:B6.concat([B7,'A = '+AP+' − '+half+u2_]),
    steps:[stp('Découpe','Sans les encoches, la figure est un pentagone. Trace la diagonale du haut du côté vertical jusqu\'au coin inférieur droit : un triangle rectangle et un triangle dont on connaît les trois côtés.'),
      stp('Triangle rectangle','Base : '+M(L(3)+' + '+L(4)+' + '+L(5)+' = '+L(12))+' (le diamètre de la grande encoche compte). '+M('A₁ = '+L(5)+' × '+L(12)+' / 2 = '+NF(30*K2))+' ; diagonale '+M('√('+L(5)+'² + '+L(12)+'²) = '+L(13))),
      stp('Triangle de côtés '+L(6)+', '+L(9)+' et '+L(13),'Le côté oblique mesure '+M(L(3)+' + '+L(2)+' + '+L(4)+' = '+L(9))+'. Héron : '+M('p = ('+L(6)+' + '+L(9)+' + '+L(13)+')/2 = '+L(14)),M('A₂ = √('+L(14)+' × '+L(8)+' × '+L(5)+' × '+L(1)+') = √'+(560*K2*K2)+' = '+NF(4*K2)+'√35')),
      stp('Encoches (demi-disques)',M('π × '+L(2)+'² / 2 + π × '+L(1)+'² / 2 = '+NF(2*K2)+'π + '+(K2===1?'π/2':NF(K2/2)+'π')+' = '+half)),
      stp('Aire',M('A = '+exact+' ≈ '+NF(Math.round((A0-2.5*K2*Math.PI)*100)/100))+' '+u+'²')],
    hints:['Découpe le pentagone (sans les encoches) par la diagonale qui part du haut du côté vertical : un triangle rectangle '+L(5)+' × '+L(12)+' et un triangle dont tu connais les trois côtés.','Pour un triangle de côtés a, b, c : Héron, avec p = (a + b + c)/2. Le côté oblique de droite mesure '+L(3)+' + '+L(2)+' + '+L(4)+'. Retire ensuite les deux demi-disques.'],
    mistakes:[{v:{a:A0,b:0},tag:'geo-decomp',msg:'C\'est l\'aire du pentagone : il faut encore retirer les deux encoches (demi-disques).',w:B6.concat(['A = '+AP+u2_])},
      {v:{a:A0,b:-5*K2},tag:'geo-decomp',msg:'Les encoches sont des demi-disques : aire πr² / 2 chacune, pas πr².',w:B6.concat(['E = π × '+L(2)+'² + π × '+L(1)+'² = '+kPi(5*K2),'A = '+AP+' − '+kPi(5*K2)+u2_])},
      {v:{a:A0,b:2.5*K2},tag:'geo-decomp',msg:'Les encoches sont retirées de la surface : on soustrait leur aire.',w:B6.concat([B7,'A = '+AP+' + '+half+u2_])},
      {v:{a:A0,b:-1.5*K2},tag:'geo-aire-pi',msg:'Aire du demi-disque de rayon '+L(2)+' : π × '+L(2)+'² / 2 = '+NF(2*K2)+'π (le rayon est au carré).',w:B6.concat(['E = π × 2 × '+L(1)+'² / 2 + π × '+L(1)+'² / 2 = '+kPi(1.5*K2),'A = '+AP+' − '+kPi(1.5*K2)+u2_])},
      {v:{a:30*K2,b:-2.5*K2},tag:'geo-heron',msg:'Le côté oblique mesure '+L(3)+' + '+L(2)+' + '+L(4)+' = '+L(9)+' (diamètre de l\'encoche compris). Avec '+L(7)+', le triangle serait aplati ('+L(6)+' + '+L(7)+' = '+L(13)+').',w:[B1,B2,B3,'c = '+L(3)+' + '+L(4)+' = '+L(7),'p = ('+L(6)+' + '+L(7)+' + '+L(13)+') / 2 = '+L(13),'A₂ = √('+L(13)+' × '+L(7)+' × '+L(6)+' × 0) = 0',B7,'A = '+NF(30*K2)+' + 0 − '+half+u2_]},
      {v:{a:A0+30*K2,b:-2.5*K2},tag:'geo-demi',msg:'L\'aire du triangle rectangle vaut '+L(5)+' × '+L(12)+' / 2 = '+NF(30*K2)+' (division par 2 oubliée).',w:[B1,'A₁ = '+L(5)+' × '+L(12)+' = '+NF(60*K2)].concat(B6.slice(2),[B7,'A = '+NF(60*K2)+' + '+kRt(4*K2,35)+' − '+half+u2_])}]});
}

/* n°26 (b) : disque percé de deux segments circulaires */
function genDisqueE(){
  const P_=pick([[3,1],[3,1],[3,1],[2,1],[4,1],[4,2],[6,2]]), t=P_[0], s=P_[1], R=t+2*s, rho=2*s, ask=pick(['aire','périmètre']), u=uP(), r3=Math.sqrt(3), hs=s*r3;
  const svg=figure([[-1.5*R,-R],[R,R]],f=>{
    const sc=f.s, C0=f([0,0]), xd=-1.2*R, tk=0.05*R;
    let out=g.circle(C0,R*sc,'');
    [1,-1].forEach(sg=>{ const p1=f([-hs,sg*s]), p2=f([hs,sg*s]); out+=g.path(mv(p1)+carc(p1,p2,C0,rho*sc)+' Z','g-f g-hole'); });
    [[R,0],[2*s,0],[s,-hs],[-s,-hs]].forEach(L=>{ out+=g.seg(f([xd-tk,L[0]]),f([L[1],L[0]]),'g-thin g-dash')+g.seg(f([xd-tk,L[0]]),f([xd+tk,L[0]]),'g-mark'); });
    out+=g.seg(f([xd,R]),f([xd,-s]),'g-mark');
    [[R,2*s,t],[2*s,s,s],[s,-s,2*s]].forEach(L=>{ out+=g.text(f([xd-0.09*R,(L[0]+L[1])/2]),String(L[2]),'','end'); });
    return out;
  },'Disque de rayon '+R+' percé de deux trous en forme de segments circulaires',{H:250,pad:24});
  const txt='Un disque est percé de deux trous blancs symétriques. Chaque trou est limité par une corde et par un arc de cercle <b>centré au centre du disque</b>. Les cotes à gauche donnent, de haut en bas (en '+u+') : «'+t+'» du haut du disque au sommet du trou supérieur, «'+s+'» pour la hauteur du trou, «'+2*s+'» entre les deux trous. ';
  const chord=radStr(12*s*s), hc=radStr(3*s*s);
  const D1='R = '+t+' + '+s+' + '+s+' = '+R, D2='r = '+s+' + '+s+' = '+rho, D3='α = 2 × 60 = 120°', D4='c = 2 × √('+rho+'² − '+s+'²) = '+chord, Dh='c = √('+rho+'² − '+s+'²) = '+hc;
  const s1=stp('Lire les cotes','Le centre est au milieu de la bande de '+M(2*s)+' : rayon du disque '+M('R = '+t+' + '+s+' + '+s+' = '+R)+'. Les arcs des trous ont pour rayon '+M(s+' + '+s+' = '+rho)+' et les cordes sont à la distance '+M(s)+' du centre.');
  const s2=stp('Angle au centre d\'un trou','Triangle rectangle : centre, milieu de la corde, extrémité de la corde. Hypoténuse '+M(rho)+', côté '+M(s)+' (la moitié) : c\'est un demi-triangle équilatéral, donc l\'angle au centre vaut '+M('2 × 60° = 120°')+'.','Demi-corde : '+M('√('+rho+'² − '+s+'²) = '+hc)+' ; corde : '+M(chord));
  if(ask==='périmètre'){
    const Np=6*R+8*s, exact=fr3(Np)+' + '+NF(4*s)+'√3', arc=fr3(4*s), D5='a = 120 / 360 × 2π × '+rho+' = '+arc, Pc='P = 2π × '+R;
    return mkGeo({svg,mode:'pi',exact,val:{a:4*s*r3,b:Np/3},unit:u,pow:1,
      text:txt+'Calcule le <b>périmètre</b> de la surface colorée (bord extérieur et bords des trous). Donne la <b>valeur exacte</b>.',ask:'le périmètre (valeur exacte)',
      placeholder:'cercle = ...\narc d\'un trou = ...\ncorde = ...\nP = ...',
      work:[D1,D2,D3,D4,D5,Pc+' + 2 × ('+arc+' + '+chord+') = '+exact+' '+u],
      steps:[s1,s2,stp('Contour d\'un trou','Arc de 120° : '+M('(120/360) × 2π × '+rho+' = '+arc)+' ; corde : '+M(chord)),
        stp('Périmètre',M('P = 2π × '+R+' + 2 × ('+arc+' + '+chord+') = '+exact+' ≈ '+NF(Math.round((4*s*r3+Np/3*Math.PI)*100)/100))+' '+u)],
      hints:['Le périmètre comprend le cercle extérieur et le contour des deux trous (un arc et une corde chacun).','Pour l\'angle au centre : la corde est à la distance '+s+' du centre et l\'arc a pour rayon '+rho+'. Un triangle rectangle dont l\'hypoténuse vaut le double d\'un côté est un demi-triangle équilatéral.'],
      mistakes:[{v:{a:0,b:Np/3},tag:'geo-perim-cote',msg:'Le contour de chaque trou comprend aussi la corde (segment) : ajoute 2 × '+chord+'.',w:[D1,D2,D3,D5,Pc+' + 2 × '+kPar(arc)+' = '+fr3(Np)+' '+u]},
        {v:{a:0,b:2*R},tag:'geo-perim-cote',msg:'Le bord des trous fait aussi partie du contour de la surface colorée.',w:[D1,Pc+' = '+kPi(2*R)+' '+u]},
        {v:{a:4*s*r3,b:2*R+4*s/3},tag:'geo-segment',msg:'L\'angle au centre de chaque arc vaut 120°, pas 60° : la demi-corde est à 60° de part et d\'autre.',w:[D1,D2,'α = 60°',D4,'a = 60 / 360 × 2π × '+rho+' = '+fr3(2*s),Pc+' + 2 × ('+fr3(2*s)+' + '+chord+') = '+fr3(6*R+4*s)+' + '+NF(4*s)+'√3 '+u]},
        {v:{a:2*s*r3,b:Np/3},tag:'geo-segment',msg:'Tu as pris la demi-corde. La corde entière mesure 2 × '+hc+' = '+chord+'.',w:[D1,D2,D3,Dh,D5,Pc+' + 2 × ('+arc+' + '+hc+') = '+fr3(Np)+' + '+kRt(2*s,3)+' '+u]},
        {v:{a:4*s*r3,b:2*R+4*s},tag:'geo-segment',msg:'Les arcs ne sont pas des demi-cercles : l\'angle au centre vaut 120° (et non 180°).',w:[D1,D2,'α = 180°',D4,'a = 180 / 360 × 2π × '+rho+' = '+kPi(2*s),Pc+' + 2 × ('+kPi(2*s)+' + '+chord+') = '+kPi(2*R+4*s)+' + '+NF(4*s)+'√3 '+u]}]});
  }
  const Na=3*R*R-8*s*s, exact=fr3(Na)+' + '+NF(2*s*s)+'√3', sect=fr3(4*s*s), tri=radStr(3*s*s*s*s);
  const u2_=' '+u+'²', DS='S = 120 / 360 × π × '+rho+'² = '+sect, DT='T = '+chord+' × '+s+' / 2 = '+tri, Ad='A = π × '+R+'²';
  return mkGeo({svg,mode:'pi',exact,val:{a:2*s*s*r3,b:Na/3},unit:u,pow:2,
    text:txt+'Calcule l\'<b>aire</b> de la surface colorée. Donne la <b>valeur exacte</b>.',ask:'l\'aire (valeur exacte)',
    placeholder:'disque = ...\nun trou = secteur − triangle = ...\nA = ...',
    work:[D1,D2,D3,D4,DS,DT,Ad+' − 2 × ('+sect+' − '+tri+') = '+exact+u2_],
    steps:[s1,s2,stp('Un trou = segment circulaire','Secteur de 120° moins le triangle (base : la corde, hauteur '+M(s)+') :',M('(120/360) × π × '+rho+'² − '+chord+' × '+s+' / 2 = '+sect+' − '+tri)),
      stp('Surface colorée',M('A = π × '+R+'² − 2 × ('+sect+' − '+tri+') = '+exact+' ≈ '+NF(Math.round((2*s*s*r3+Na/3*Math.PI)*100)/100))+' '+u+'²')],
    hints:['Aire = disque − 2 trous. Chaque trou est un segment circulaire : secteur − triangle.','Pour l\'angle au centre : la corde est à la distance '+s+' du centre et l\'arc a pour rayon '+rho+'. Un triangle rectangle dont l\'hypoténuse vaut le double d\'un côté est un demi-triangle équilatéral.'],
    mistakes:[{v:{a:0,b:Na/3},tag:'geo-segment',msg:'Tu as retiré les secteurs de 120° entiers. Un trou est un segment : secteur − triangle.',w:[D1,D2,D3,D4,DS,Ad+' − 2 × '+kPar(sect)+' = '+fr3(Na)+u2_]},
      {v:{a:-2*s*s*r3,b:Na/3},tag:'geo-segment',msg:'Signe : trou = secteur − triangle. En retirant les trous, on retire les secteurs et on <b>ajoute</b> les triangles.',w:[D1,D2,D3,D4,DS,DT,Ad+' − 2 × '+kPar(sect)+' − 2 × '+tri+' = '+fr3(Na)+' − '+kRt(2*s*s,3)+u2_]},
      {v:{a:0,b:R*R},tag:'geo-decomp',msg:'C\'est l\'aire du disque entier : il faut retirer les deux trous.',w:[D1,Ad+' = '+kPi(R*R)+u2_]},
      {v:{a:0,b:R*R-s*s},tag:'geo-segment',msg:'Les trous ne sont pas des demi-disques de rayon '+s+' : ce sont des segments d\'un cercle de rayon '+rho+'.',w:[D1,'h = π × '+s+'² / 2 = '+kPi(s*s/2),Ad+' − 2 × '+kPar(kPi(s*s/2))+' = '+kPi(R*R-s*s)+u2_]},
      {v:{a:s*s*r3,b:Na/3},tag:'geo-demi',msg:'Aire d\'un triangle : corde × hauteur / 2 = '+chord+' × '+s+' / 2 = '+tri+' par trou, donc '+NF(2*s*s)+'√3 pour les deux.',w:[D1,D2,D3,Dh,DS,'T = '+hc+' × '+s+' / 2 = '+sqrtFrac(s*s,2,3),Ad+' − 2 × ('+sect+' − '+sqrtFrac(s*s,2,3)+') = '+fr3(Na)+' + '+kRt(s*s,3)+u2_]},
      {v:{a:2*s*s*r3,b:R*R-4*s*s/3},tag:'geo-segment',msg:'L\'angle au centre vaut 120°, pas 60°.',w:[D1,D2,'α = 60°',D4,'S = 60 / 360 × π × '+rho+'² = '+fr3(2*s*s),DT,Ad+' − 2 × ('+fr3(2*s*s)+' − '+tri+') = '+fr3(3*R*R-4*s*s)+' + '+NF(2*s*s)+'√3'+u2_]}]});
}

TOPICS['gp-6c']={kind:'gpyth',level:6,label:'Hauteur d\'un triangle rectangle (surface grise)',gen:genTriGris};
TOPICS['gc-6e']={kind:'gcirc',level:6,label:'Deux cercles tangents dans un triangle',gen:genTriCercles};
TOPICS['gm-6d']={kind:'gcomp',level:6,label:'Figure à encoches (Héron)',gen:genBotte};
TOPICS['gm-6e']={kind:'gcomp',level:6,label:'Disque percé de deux segments',gen:genDisqueE};
