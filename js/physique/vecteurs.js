'use strict';
/* ===== Physique · Vecteurs (GEN 2) : forme polaire, composantes, somme et résultante ===== */
/* Exercices originaux inspirés de la série GEN 2 (sans en reprendre les dessins ni les valeurs) ; la méthode analytique est celle de l'exemple de la fiche (F₁, F₂, F₃). */

BRDOMS.physique=['ph','pv']; DOMBR.pv='physique';
DKINDS.pv=['pvfg','pvcp','pvsm','pvfo'];
MODES.pv=[['pvfg','Sur la figure'],['pvcp','Composantes'],['pvsm','Somme de vecteurs'],['pvfo','Forces'],['mix','Mélange'],['copy','Corrige la copie'],['srs','À revoir'],['review','Chasse aux erreurs']];
DOM_TITLE.pv='Vecteurs';
DOM_KICK.pv='Physique · vecteurs, forme polaire, composantes, résultante';
DOMSTORE.pv={mode:'mix',level:1};
Object.assign(KIND_LABEL,{pvfg:'Vecteurs sur une figure',pvcp:'Composantes et forme polaire',pvsm:'Somme de vecteurs',pvfo:'Résultante de forces'});

Object.assign(TAGS,{
  'pv-trig':{label:'Cosinus ou sinus',tip:'Avec l\'angle polaire θ (mesuré depuis l\'axe horizontal vers la droite, dans le sens antihoraire) : composante horizontale x = r · cos θ, composante verticale y = r · sin θ.'},
  'pv-signe':{label:'Signe d\'une composante',tip:'Le signe de x et de y dépend du quadrant : θ entre 90° et 180° donne x < 0 et y > 0 ; entre 180° et 270° les deux sont négatives ; entre 270° et 360° x > 0 et y < 0. Une calculatrice en degrés donne ces signes toute seule avec l\'angle polaire.'},
  'pv-somme':{label:'Somme de vecteurs',tip:'On additionne les composantes une à une : Rx = ax + bx + … et Ry = ay + by + … Un vecteur soustrait se compte avec le signe moins sur ses deux composantes. Les modules ne s\'additionnent pas.'},
  'pv-module':{label:'Module d\'un vecteur',tip:'R = √(Rx² + Ry²) : on élève les deux composantes au carré (signes disparus), on additionne, puis on prend la racine.'},
  'pv-angle':{label:'Angle polaire et quadrant',tip:'θ = atan(|Ry| / |Rx|) donne l\'angle de référence ; selon le quadrant : 1er θ = α, 2e θ = 180° − α, 3e θ = 180° + α, 4e θ = 360° − α. Regarde les signes de Rx et Ry.'},
  'pv-conv':{label:'Angle relatif et angle polaire',tip:'Sur une figure, l\'angle est souvent donné avec l\'horizontale. Pour le calcul, passe à l\'angle polaire : haut à droite β ; haut à gauche 180° − α ; bas à gauche 180° + γ ; bas à droite 360° − δ.'},
  'pv-fig':{label:'Lecture de la figure',tip:'Lis les composantes de chaque vecteur sur la figure (dans le quadrillage ou avec les extrémités), additionne-les, puis cherche quel vecteur a ces composantes. Un vecteur peut se déplacer sans changer.'}
});

const pvR=Math.PI/180, pvCos=a=>Math.cos(a*pvR), pvSin=a=>Math.sin(a*pvR);
const pvAng=(x,y)=>{ let a=Math.atan2(y,x)/pvR; if(a<0) a+=360; return a; };
const pvRd=(x,n)=>Math.round(x*Math.pow(10,n))/Math.pow(10,n);
const pvN=x=>x<0?'('+NF(x)+')':NF(x);
const PV_HINT='Écris tes calculs ligne par ligne, par exemple cx = 4 * cos(20) + 6 * cos(180) ≈ -2,24 puis c = √(cx^2 + cy^2) ≈ 3,7. Les angles sont en degrés. Garde 2 ou 3 décimales sur les valeurs intermédiaires. Une valeur arrondie s\'écrit avec ≈.';
function pvNum(o){ return Object.assign(phNum(Object.assign({tol:o.d===1?0.06:o.d===2?0.006:0},o)),{hintline:o.hintline||PV_HINT}); }

/* ---------- somme de termes polaires : expressions et valeurs ---------- */
/* terme : {n:nom, r:module, t:angle polaire, te:écriture de l'angle, s:±1} */
const pvTerm=(q,f)=>NF(q.r)+' * '+f+'('+(q.te||NF(q.t))+')';
function pvSum(T,f,alt){ return T.map((q,i)=>{ const s=alt&&alt.sign?alt.sign(q):q.s; return (i?(s<0?' - ':' + '):(s<0?'-':''))+pvTerm(alt&&alt.te?Object.assign({},q,{te:alt.te(q)}):q,f); }).join(''); }
function pvComp(T,swap,alt){ let x=0,y=0; T.forEach(q=>{ const s=alt&&alt.sign?alt.sign(q):q.s, t=alt&&alt.t?alt.t(q):q.t; x+=s*q.r*(swap?pvSin(t):pvCos(t)); y+=s*q.r*(swap?pvCos(t):pvSin(t)); }); return [x,y]; }
function pvAngExpr(cx,cy){
  const X=NF(pvRd(Math.abs(cx),3)), Y=NF(pvRd(Math.abs(cy),3));
  if(cx>=0&&cy>=0) return 'atan('+Y+' / '+X+')';
  if(cx<0&&cy>=0) return '180 - atan('+Y+' / '+X+')';
  if(cx<0&&cy<0) return '180 + atan('+Y+' / '+X+')';
  return '360 - atan('+Y+' / '+X+')';
}
const pvQuad=(x,y)=>x>=0&&y>=0?1:x<0&&y>=0?2:x<0&&y<0?3:4;
/* texte d'un vecteur polaire */
const pvPol=q=>'«'+q.n+' = ('+NF(q.r)+' ; '+NF(q.t)+'°)»';
const PV_ANGLES=[20,35,45,60,75,100,120,135,150,170,180,200,212,225,240,260,290,300,315,330];

/* ---------- niveau 1 : composante à partir du module et de l'angle ---------- */
function genPvComp(){
  const r=pick([5,8,10,12,15,20,25,30,40,50]), t=pick([20,35,50,65,110,125,150,160,200,215,240,260,290,305,330,345]), wantX=Math.random()<0.5;
  const val=wantX?r*pvCos(t):r*pvSin(t), th=t%180, ref=th>90?180-th:th, f=wantX?'cos':'sin', g=wantX?'sin':'cos', nm=wantX?'ax':'ay', d=1, rr=phR(val,d);
  const alt=wantX?r*pvSin(t):r*pvCos(t);
  const quad=t<90?'1er':t<180?'2e':t<270?'3e':'4e';
  return pvNum({svg:'',text:'Le vecteur «a» a pour module «a = '+r+'» et pour angle polaire «θ = '+t+'°» (mesuré depuis l\'axe horizontal vers la droite, dans le sens antihoraire). Calcule sa composante «'+nm+'» (horizontale)'.replace('(horizontale)',wantX?'(horizontale)':'(verticale)')+', '+phArr(d)+'.',
    ask:'la composante '+nm,val,d,placeholder:nm+' = '+r+' * '+f+'('+t+')\n'+nm+' ≈ '+NF(rr),
    steps:[stp('Formule',M(wantX?'a_x = a · cos θ':'a_y = a · sin θ')),stp('Calcul',M(nm+' = '+r+' × '+f+'('+t+'°) ≈ '+NF(rr))+' (angle dans le '+quad+' quadrant)')],
    hints:['Composante horizontale : ax = a · cos θ ; composante verticale : ay = a · sin θ.','Calculatrice en degrés. Le signe vient directement de θ.'],
    work:[nm+' = '+r+' * '+f+'('+t+')',nm+' ≈ '+NF(rr)],
    mistakes:[{v:alt,x:r+' * '+g+'('+t+')',tag:'pv-trig',msg:'Tu as inversé cosinus et sinus : '+(wantX?'la composante horizontale est a · cos θ.':'la composante verticale est a · sin θ.')},
      {v:Math.abs(val),x:r+' * '+f+'('+ref+')',tag:'pv-signe',msg:'Le signe est faux : pour θ = '+t+'°, la composante '+(wantX?'horizontale':'verticale')+' est '+(val<0?'négative':'positive')+'. Utilise θ lui-même, pas l\'angle de référence.'},
      {v:-val,x:'-'+r+' * '+f+'('+t+')',tag:'pv-signe',msg:'Le signe est inversé : vérifie dans quel quadrant se trouve θ = '+t+'°.'}]});
}
/* ---------- niveau 2 : module à partir des composantes ---------- */
function genPvMod(){
  const x=pick([-1,1])*rnd(5,45), y=pick([-1,1])*rnd(5,45), val=Math.hypot(x,y), d=1, r=phR(val,d), X=pvN(x), Y=pvN(y);
  return pvNum({svg:'',text:'Un vecteur «a» a pour composantes «a = ('+x+' ; '+y+')». Calcule son module «a», '+phArr(d)+'.',
    ask:'le module du vecteur',val,d,placeholder:'a = √(25^2 + (-30)^2)\na ≈ 39,1',
    steps:[stp('Formule',M('a = √(a_x² + a_y²)')),stp('Calcul',M('a = √(('+x+')² + ('+y+')²) = √'+(x*x+y*y)+' ≈ '+NF(r)))],
    hints:['Pythagore : a = √(ax² + ay²).','Les signes disparaissent quand on élève au carré.'],
    work:['a = √('+X+'^2 + '+Y+'^2)','a ≈ '+NF(r)],
    mistakes:[{v:Math.abs(x)+Math.abs(y),x:Math.abs(x)+' + '+Math.abs(y),tag:'pv-module',msg:'Le module n\'est pas la somme des composantes : c\'est l\'hypoténuse du triangle rectangle de côtés |ax| et |ay|.'},
      {v:x*x+y*y,x:X+'^2 + '+Y+'^2',tag:'pv-module',msg:'Il manque la racine carrée : a = √(ax² + ay²).'},
      {v:Math.hypot(x,y)*Math.sign(x+y||1)>0&&Math.abs(Math.abs(x)-Math.abs(y))>0?Math.abs(Math.abs(x)-Math.abs(y)):NaN,x:Math.abs(Math.abs(x)-Math.abs(y))+'',tag:'pv-module',msg:'Les composantes ne se soustraient pas : on additionne leurs carrés puis on prend la racine.'}]});
}
/* ---------- niveau 2 : angle polaire à partir des composantes ---------- */
function genPvAngle(){
  let x,y; do{ x=pick([-1,1])*rnd(5,45); y=pick([-1,1])*rnd(5,45); }while(pvQuad(x,y)===1&&Math.random()<0.8);
  const val=pvAng(x,y), d=1, r=phR(val,d), q=pvQuad(x,y), ex=pvAngExpr(x,y), X=pvN(x), Y=pvN(y), ref=Math.atan(Math.abs(y)/Math.abs(x))/pvR;
  const sw=pvAngExpr(y,x);
  return pvNum({svg:'',text:'Un vecteur «a» a pour composantes «a = ('+x+' ; '+y+')». Calcule son angle polaire «θ» (entre 0° et 360°, depuis l\'axe horizontal vers la droite), '+phArr(d)+'.',
    ask:'l\'angle polaire (en °)',val,d,unit:'°',placeholder:'θ = 180 - atan(22 / 42)\nθ ≈ 152,4',
    steps:[stp('Quadrant','x '+(x<0?'< 0':'> 0')+' et y '+(y<0?'< 0':'> 0')+' : '+['premier','deuxième','troisième','quatrième'][q-1]+' quadrant.'),stp('Angle de référence',M('α = atan(|y| / |x|) = atan('+Math.abs(y)+' / '+Math.abs(x)+') ≈ '+NF(phR(ref,2)))+'°'),stp('Angle polaire',M('θ = '+['α','180° − α','180° + α','360° − α'][q-1]+' ≈ '+NF(r))+'°')],
    hints:['Calcule l\'angle de référence α = atan(|y| / |x|), puis corrige selon le quadrant.','1er : θ = α ; 2e : θ = 180 − α ; 3e : θ = 180 + α ; 4e : θ = 360 − α.'],
    work:['θ = '+ex,'θ ≈ '+NF(r)],
    mistakes:[{v:Math.atan(y/x)/pvR,x:'atan('+Y+' / '+X+')',tag:'pv-angle',msg:'La calculatrice donne un angle entre −90° et 90° : il faut corriger selon le quadrant du vecteur (signes de x et de y).'},
      {v:pvAng(y,x),x:sw,tag:'pv-angle',msg:'Tu as inversé x et y : la tangente de θ est y / x.'},
      {v:ref,x:'atan('+Math.abs(y)+' / '+Math.abs(x)+')',tag:'pv-angle',msg:'Tu as donné l\'angle de référence. Selon le quadrant (signes de x et de y), il faut le corriger : θ = '+['α','180° − α','180° + α','360° − α'][q-1]+'.'}]});
}
/* ---------- niveau 2 à 4 : somme de deux vecteurs donnés par leurs composantes ---------- */
function pvTwo(){ let a,b; do{ a=[pick([-1,1])*rnd(5,45),pick([-1,1])*rnd(5,45)]; b=[pick([-1,1])*rnd(5,45),pick([-1,1])*rnd(5,45)]; }while(Math.hypot(a[0]+b[0],a[1]+b[1])<8||a[0]+b[0]===0||a[1]+b[1]===0||a[0]===b[0]||a[1]===b[1]); return [a,b]; }
function genPvSomme1(){
  const [a,b]=pvTwo(), wantX=Math.random()<0.5, i=wantX?0:1, nm=wantX?'cx':'cy', val=a[i]+b[i];
  const text='Soit «a = ('+a[0]+' ; '+a[1]+')» et «b = ('+b[0]+' ; '+b[1]+')». On pose «c = a + b». Calcule la composante «'+nm+'» de c.';
  return pvNum({svg:'',text,ask:'la composante '+nm,val,d:0,placeholder:nm+' = '+a[i]+' + '+pvN(b[i])+'\n'+nm+' = '+val,
    steps:[stp('Somme',M(nm+' = a'+(wantX?'_x':'_y')+' + b'+(wantX?'_x':'_y')+' = '+a[i]+' + '+pvN(b[i])+' = '+val))],
    hints:['On additionne les composantes de même nom : cx = ax + bx et cy = ay + by.'],
    work:[nm+' = '+a[i]+' + '+pvN(b[i]),nm+' = '+val],
    mistakes:[{v:a[i]-b[i],x:a[i]+' - '+pvN(b[i]),tag:'pv-somme',msg:'Tu as soustrait : pour c = a + b, on additionne les composantes.'},
      {v:a[1-i]+b[i],x:a[1-i]+' + '+pvN(b[i]),tag:'pv-somme',msg:'Tu as mélangé une composante horizontale et une verticale : x avec x, y avec y.'},
      {v:Math.abs(a[i])+Math.abs(b[i]),x:Math.abs(a[i])+' + '+Math.abs(b[i]),tag:'pv-signe',msg:'Garde les signes des composantes : '+a[i]+' + '+pvN(b[i])+'.'}]});
}
function pvSommeRes(kind){
  const [a,b]=pvTwo(), cx=a[0]+b[0], cy=a[1]+b[1], mod=Math.hypot(cx,cy), ang=pvAng(cx,cy), d=1;
  const head='Soit «a = ('+a[0]+' ; '+a[1]+')» et «b = ('+b[0]+' ; '+b[1]+')». On pose «c = a + b». ';
  const L1='cx = '+a[0]+' + '+pvN(b[0]), L2='cy = '+a[1]+' + '+pvN(b[1]), S1=pvN(cx), S2=pvN(cy);
  if(kind==='mod'){ const r=phR(mod,d);
    return pvNum({svg:'',text:head+'Calcule le module «c» de ce vecteur, '+phArr(d)+'.',ask:'le module de c',val:mod,d,placeholder:L1+'\n'+L2+'\nc = √('+S1+'^2 + '+S2+'^2) ≈ '+NF(r),
      steps:[stp('Composantes de c',M('c_x = '+a[0]+' + ('+b[0]+') = '+cx)+' ; '+M('c_y = '+a[1]+' + ('+b[1]+') = '+cy)),stp('Module',M('c = √(('+cx+')² + ('+cy+')²) ≈ '+NF(r)))],
      hints:['D\'abord la somme composante par composante, puis le module avec Pythagore.'],
      work:[L1+' = '+cx,L2+' = '+cy,'c = √('+S1+'^2 + '+S2+'^2) ≈ '+NF(r)],
      mistakes:[{v:Math.hypot(a[0],a[1])+Math.hypot(b[0],b[1]),x:'√('+pvN(a[0])+'^2 + '+pvN(a[1])+'^2) + √('+pvN(b[0])+'^2 + '+pvN(b[1])+'^2)',tag:'pv-somme',msg:'Le module d\'une somme n\'est pas la somme des modules : additionne d\'abord les composantes.'},
        {v:Math.hypot(a[0]-b[0],a[1]-b[1]),x:'√(('+a[0]+' - '+pvN(b[0])+')^2 + ('+a[1]+' - '+pvN(b[1])+')^2)',tag:'pv-somme',msg:'Tu as calculé a − b au lieu de a + b.'},
        {v:cx*cx+cy*cy,x:S1+'^2 + '+S2+'^2',tag:'pv-module',msg:'Il manque la racine carrée : c = √(cx² + cy²).'}]}); }
  const r=phR(ang,d);
  return pvNum({svg:'',text:head+'Calcule l\'angle polaire «θ» de ce vecteur (entre 0° et 360°), '+phArr(d)+'.',ask:'l\'angle polaire de c (en °)',val:ang,d,unit:'°',placeholder:L1+'\n'+L2+'\nθ = '+pvAngExpr(cx,cy)+'\nθ ≈ '+NF(r),
    steps:[stp('Composantes de c',M('c_x = '+cx)+' ; '+M('c_y = '+cy)),stp('Quadrant',['Premier','Deuxième','Troisième','Quatrième'][pvQuad(cx,cy)-1]+' quadrant.'),stp('Angle',M('θ = '+pvAngExpr(cx,cy)+' ≈ '+NF(r))+'°')],
    hints:['Somme des composantes, puis angle de référence atan(|cy| / |cx|) corrigé selon le quadrant.'],
    work:[L1+' = '+cx,L2+' = '+cy,'θ = '+pvAngExpr(cx,cy),'θ ≈ '+NF(r)],
    mistakes:[{v:Math.atan(cy/cx)/pvR,x:'atan('+S2+' / '+S1+')',tag:'pv-angle',msg:'La calculatrice donne un angle entre −90° et 90° : corrige selon le quadrant de c (signes de cx et cy).'},
      {v:pvAng(cy,cx),x:pvAngExpr(cy,cx),tag:'pv-angle',msg:'Tu as inversé cx et cy : la tangente de θ est cy / cx.'},
      {v:pvAng(a[0]-b[0],a[1]-b[1]),x:pvAngExpr(a[0]-b[0],a[1]-b[1]),tag:'pv-somme',msg:'Tu as calculé l\'angle de a − b au lieu de a + b.'}]});
}
const genPvSommeMod=()=>pvSommeRes('mod'), genPvSommeAng=()=>pvSommeRes('ang');

/* ---------- somme de vecteurs polaires (deux ou quatre vecteurs) ---------- */
function pvPolarSet(n){
  for(let k=0;k<100;k++){
    const names=n===2?['a','b']:['a','b','d','f'], signs=n===2?[1,1]:[1,1,1,-1];
    const T=names.map((nm,i)=>({n:nm,r:rnd(2,9),t:pick(PV_ANGLES),s:signs[i]}));
    if(new Set(T.map(q=>q.t)).size<n) continue;
    const [x,y]=pvComp(T); if(Math.hypot(x,y)<1.5||Math.abs(x)<0.3||Math.abs(y)<0.3) continue;
    return T;
  }
  return [{n:'a',r:4,t:20,s:1},{n:'b',r:6,t:180,s:1}];
}
function pvPolarRes(n,kind,forces){
  const T=forces||pvPolarSet(n), [x,y]=pvComp(T), cx=pvRd(x,3), cy=pvRd(y,3), mod=Math.hypot(x,y), ang=pvAng(x,y), d=1, unitN=forces?'N':'';
  const eq=T.length===2?'c = a + b':'c = '+T.map((q,i)=>(i?(q.s<0?' − ':' + '):(q.s<0?'−':''))+q.n).join('');
  const head=forces?'':('On donne '+T.map(pvPol).join(', ')+' (module ; angle polaire). On pose «'+eq+'». ');
  const cn=forces?'R':'c';
  const X='cx = '+pvSum(T,'cos'), Y='cy = '+pvSum(T,'sin'), Xv=X+' ≈ '+NF(cx), Yv=Y+' ≈ '+NF(cy), S1=pvN(cx), S2=pvN(cy);
  const sumMod=T.reduce((s,q)=>s+q.s*q.r,0), sumModE=T.map((q,i)=>(i?(q.s<0?' - ':' + '):(q.s<0?'-':''))+NF(q.r)).join('');
  const allPlus={sign:()=>1}, swapped=pvComp(T,true);
  const fig=pvPolarFig(T,forces);
  const stepsC=[stp('Composantes de chaque vecteur',...T.map(q=>M(q.n+'_x = '+(q.s<0?'−':'')+NF(q.r)+' · cos('+(q.te||NF(q.t))+'°) ≈ '+NF(pvRd(q.s*q.r*pvCos(q.t),2))+'  ;  '+q.n+'_y = '+(q.s<0?'−':'')+NF(q.r)+' · sin('+(q.te||NF(q.t))+'°) ≈ '+NF(pvRd(q.s*q.r*pvSin(q.t),2))))),stp('Somme',M('c_x ≈ '+NF(cx))+' ; '+M('c_y ≈ '+NF(cy)))];
  if(kind==='mod'){ const chain=pvRd(Math.hypot(cx,cy),d);
    const base=(alt)=>{ const p=pvComp(T,false,alt); return p; };
    return pvNum({svg:fig,text:head+'Calcule le module «'+cn+'» de '+(forces?'la résultante':'ce vecteur')+(forces?' (en N)':'')+', '+phArr(d)+'.',ask:'le module'+(forces?' de la résultante':' de c'),val:mod,d,unit:unitN,
      placeholder:'cx = 4 * cos(20) + 6 * cos(180) ≈ -2,24\ncy = 4 * sin(20) + 6 * sin(180) ≈ 1,37\nc = √((-2,24)^2 + 1,37^2) ≈ 2,6',
      steps:stepsC.concat([stp('Module',M(cn+' = √(('+NF(cx)+')² + ('+NF(cy)+')²) ≈ '+NF(chain))+(forces?' N':''))]),
      hints:['Calcule cx = Σ r · cos θ et cy = Σ r · sin θ (un vecteur soustrait compte avec le signe moins), puis c = √(cx² + cy²).','Calculatrice en degrés.'],
      work:[Xv,Yv,cn+' = √('+S1+'^2 + '+S2+'^2) ≈ '+NF(chain)],
      mistakes:[{v:sumMod,x:sumModE,tag:'pv-somme',msg:'Le module d\'une somme n\'est pas la somme des modules : additionne les composantes (cos et sin) avant de calculer le module.'},
        {v:Math.hypot(swapped[0],swapped[1]),x:'√(('+pvSum(T,'sin')+')^2 + ('+pvSum(T,'cos')+')^2)',tag:'pv-trig',msg:'Tu as inversé cosinus et sinus : x = r · cos θ et y = r · sin θ.'},
        {v:cx*cx+cy*cy,x:'('+pvSum(T,'cos')+')^2 + ('+pvSum(T,'sin')+')^2',tag:'pv-module',msg:'Il manque la racine carrée : c = √(cx² + cy²).'}].concat(forces?[{v:Math.hypot(...pvComp(T,false,{t:q=>q.rel})),x:'√(('+pvSum(T,'cos',{te:q=>NF(q.rel)})+')^2 + ('+pvSum(T,'sin',{te:q=>NF(q.rel)})+')^2)',tag:'pv-conv',msg:'Tu as utilisé les angles de la figure tels quels : il faut les convertir en angles polaires (haut gauche : 180° − α ; bas gauche : 180° + γ…).'}]:(n>2?[{v:Math.hypot(...pvComp(T,false,allPlus)),x:'√(('+pvSum(T,'cos',{sign:()=>1})+')^2 + ('+pvSum(T,'sin',{sign:()=>1})+')^2)',tag:'pv-somme',msg:'Le vecteur '+T[T.length-1].n+' est soustrait : ses deux composantes comptent avec le signe moins.'}]:[]))}); }
  const chainA=pvRd(pvAng(cx,cy),d), ex=pvAngExpr(cx,cy);
  return pvNum({svg:fig,text:head+'Calcule l\'angle polaire «θ» de '+(forces?'la résultante':'ce vecteur')+' (entre 0° et 360°), '+phArr(d)+'.',ask:'l\'angle polaire (en °)',val:ang,d,unit:'°',
    placeholder:'cx = 4 * cos(20) + 6 * cos(180) ≈ -2,24\ncy = 4 * sin(20) + 6 * sin(180) ≈ 1,37\nθ = 180 - atan(1,37 / 2,24) ≈ 148,6',
    steps:stepsC.concat([stp('Angle',M('θ = '+ex+' ≈ '+NF(chainA))+'°')]),
    hints:['Calcule cx et cy, repère le quadrant avec leurs signes, puis θ à partir de atan(|cy| / |cx|).','1er : α ; 2e : 180 − α ; 3e : 180 + α ; 4e : 360 − α.'],
    work:[Xv,Yv,'θ = '+ex+' ≈ '+NF(chainA)],
    mistakes:[{v:Math.atan(cy/cx)/pvR,x:'atan('+S2+' / '+S1+')',tag:'pv-angle',msg:'La calculatrice donne un angle entre −90° et 90° : corrige selon le quadrant du vecteur (signes de cx et cy).'},
      {v:pvAng(swapped[0],swapped[1]),x:pvAngExpr(pvRd(swapped[0],3),pvRd(swapped[1],3)),tag:'pv-trig',msg:'Tu as inversé cosinus et sinus pour les composantes : x = r · cos θ et y = r · sin θ.'},
      {v:pvAng(cy,cx),x:pvAngExpr(cy,cx),tag:'pv-angle',msg:'Tu as inversé cx et cy : la tangente de θ est cy / cx.'}].concat(forces?[{v:pvAng(...pvComp(T,false,{t:q=>q.rel})),x:pvAngExpr(...pvComp(T,false,{t:q=>q.rel}).map(z=>pvRd(z,3))),tag:'pv-conv',msg:'Tu as utilisé les angles de la figure tels quels : convertis-les d\'abord en angles polaires.'}]:(n>2?[{v:pvAng(...pvComp(T,false,allPlus)),x:pvAngExpr(...pvComp(T,false,allPlus).map(z=>pvRd(z,3))),tag:'pv-somme',msg:'Le vecteur '+T[T.length-1].n+' est soustrait : ses deux composantes comptent avec le signe moins.'}]:[]))});
}
const genPvPolar2=()=>pvPolarRes(2,'mod'), genPvPolar4Mod=()=>pvPolarRes(4,'mod'), genPvPolar4Ang=()=>pvPolarRes(4,'ang');

/* petit schéma : les vecteurs tracés depuis l'origine (ou bout à bout pour les forces) */
function pvArrowDefs(){ return '<defs><marker id="pvah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>'; }
function pvArrow(a,b,cls){ return '<line class="g-l '+(cls||'')+'" x1="'+gf(a[0])+'" y1="'+gf(a[1])+'" x2="'+gf(b[0])+'" y2="'+gf(b[1])+'" marker-end="url(#pvah)"/>'; }
function pvPolarFig(T,forces){
  const pts=[[0,0]]; let P=[0,0], tips=[];
  if(forces){ T.forEach(q=>{ const e=[P[0]+q.r*pvCos(q.t),P[1]+q.r*pvSin(q.t)]; tips.push([P,e,q]); P=e; pts.push(e); }); }
  else T.forEach(q=>{ const e=[q.r*pvCos(q.t),q.r*pvSin(q.t)]; tips.push([[0,0],e,q]); pts.push(e); });
  return figure(pts,f=>{ let o=pvArrowDefs(); tips.forEach(t=>{ const a=f(t[0]), b=f(t[1]); o+=pvArrow(a,b); const m=vmid(a,b), u=vunit(vsub(b,a)), n=vperp(u); o+=g.text(vadd(m,vmul(n,13)),t[2].n+(forces?'':''),'g-v'); });
    if(forces){ const a=f([0,0]), b=f(P); o+='<line class="g-l g-thin" style="stroke-dasharray:5 4" x1="'+gf(a[0])+'" y1="'+gf(a[1])+'" x2="'+gf(b[0])+'" y2="'+gf(b[1])+'" marker-end="url(#pvah)"/>'+g.text(vadd(vmid(a,b),[-14,-6]),'R','g-v'); }
    else o+=g.dot(f([0,0]));
    return o; },forces?'Forces mises bout à bout':'Vecteurs tracés depuis l\'origine');
}

/* ---------- forces : angle donné avec l'horizontale ---------- */
const PV_DIRS=[['vers le haut à droite',a=>a,'β'],['vers le haut à gauche',a=>180-a,'α'],['vers le bas à gauche',a=>180+a,'γ'],['vers le bas à droite',a=>360-a,'δ']];
const PV_DEXPR=[(a)=>NF(a),(a)=>'180 - '+NF(a),(a)=>'180 + '+NF(a),(a)=>'360 - '+NF(a)];
function pvForcesSet(){
  for(let k=0;k<100;k++){
    const idx=[0,1,2,3].sort(()=>Math.random()-0.5).slice(0,3);
    const T=idx.map((di,i)=>{ const rel=pick([15,20,25,30,35,40,45,50,55,60,65,70]); return {n:'F'+['₁','₂','₃'][i],r:pick([10,15,20,25,30,35,40,45]),t:PV_DIRS[di][1](rel),te:PV_DEXPR[di](rel),rel,di,s:1}; });
    const [x,y]=pvComp(T); if(Math.hypot(x,y)<6||Math.abs(x)<1||Math.abs(y)<1) continue;
    return T;
  }
  return [{n:'F₁',r:40,t:150,te:'180 - 30',rel:30,di:1,s:1},{n:'F₂',r:35,t:45,te:'45',rel:45,di:0,s:1},{n:'F₃',r:25,t:200,te:'180 + 20',rel:20,di:2,s:1}];
}
function pvForcesText(T){
  return 'Trois forces s\'appliquent au même point : '+T.map(q=>'«'+q.n+' = '+q.r+' N», dirigée '+PV_DIRS[q.di][0]+' et formant «'+PV_DIRS[q.di][2]+' = '+q.rel+'°» avec l\'horizontale').join(' ; ')+'. ';
}
const genPvForcesMod=()=>{ const T=pvForcesSet(), ex=pvPolarRes(3,'mod',T); return pvForcesFix(ex,T); };
const genPvForcesAng=()=>{ const T=pvForcesSet(), ex=pvPolarRes(3,'ang',T); return pvForcesFix(ex,T); };
function pvForcesFix(ex,T){
  const tx=TX(pvForcesText(T)+(/module/.test(ex.instr)?'Calcule le module «R» de leur résultante (en N), arrondi au dixième.':'Calcule l\'angle polaire «θ» de leur résultante (entre 0° et 360°), arrondi au dixième.'));
  ex.html='<div class="geo">'+ex.html.replace(/^<div class="geo">/,'').replace(/<p class="geotxt">[\s\S]*<\/p><\/div>$/,'')+'<p class="geotxt">'+tx.html+'</p></div>';
  ex.statement=tx.plain.replace(/<[^>]+>/g,'');
  ex.hints=ex.hints.concat(['Angle polaire de chaque force : haut à droite β ; haut à gauche 180° − α ; bas à gauche 180° + γ ; bas à droite 360° − δ.']);
  return ex;
}
/* composante d'une seule force */
function genPvForce1(){
  const di=pick([0,1,2,3]), rel=pick([15,20,25,30,35,40,45,50,55,60,65,70]), r=pick([10,15,20,25,30,40,50]), t=PV_DIRS[di][1](rel), te=PV_DEXPR[di](rel), wantX=Math.random()<0.5, f=wantX?'cos':'sin', g2=wantX?'sin':'cos', nm=wantX?'Fx':'Fy', d=1;
  const val=r*(wantX?pvCos(t):pvSin(t)), rr=phR(val,d), alt=r*(wantX?pvSin(t):pvCos(t)), relv=r*(wantX?pvCos(rel):pvSin(rel));
  return pvNum({svg:'',text:'Une force «F = '+r+' N» est dirigée '+PV_DIRS[di][0]+' et forme un angle de «'+rel+'°» avec l\'horizontale. Calcule sa composante «'+nm+'» ('+(wantX?'horizontale':'verticale')+'), '+phArr(d)+'.',
    ask:'la composante '+nm+' (en N)',val,d,unit:'N',placeholder:'angle polaire : '+te+'\n'+nm+' = '+r+' * '+f+'('+te+')\n'+nm+' ≈ '+NF(rr)+' N',
    steps:[stp('Angle polaire','Force dirigée '+PV_DIRS[di][0]+' : '+M('θ = '+te+' = '+NF(t))+'°'),stp('Composante',M(nm+' = '+r+' · '+f+'('+NF(t)+'°) ≈ '+NF(rr))+' N')],
    hints:['Passe d\'abord à l\'angle polaire : haut à droite β ; haut à gauche 180° − α ; bas à gauche 180° + γ ; bas à droite 360° − δ.','Puis Fx = F · cos θ et Fy = F · sin θ.'],
    work:[nm+' = '+r+' * '+f+'('+te+')',nm+' ≈ '+NF(rr)],
    mistakes:[{v:relv,x:r+' * '+f+'('+rel+')',tag:'pv-conv',msg:'Tu as utilisé l\'angle de la figure ('+rel+'°) directement : il faut l\'angle polaire ('+te+')° pour avoir le bon signe.'},
      {v:alt,x:r+' * '+g2+'('+te+')',tag:'pv-trig',msg:'Tu as inversé cosinus et sinus : Fx = F · cos θ et Fy = F · sin θ.'},
      {v:r*(wantX?pvSin(rel):pvCos(rel)),x:r+' * '+g2+'('+rel+')',tag:'pv-trig',msg:'Avec l\'angle relatif à l\'horizontale, cosinus donne la composante horizontale (en valeur absolue) ; et il faut ensuite le bon signe selon la direction.'}]});
}

/* ---------- figure : étoile de huit vecteurs, évaluation d'expressions ---------- */
const PV_STAR={a:[-2,0],e:[2,0],g:[0,1],c:[0,-1],h:[-2,1],f:[2,1],b:[-2,-1],d:[2,-1]};
function pvStarFig(){
  const C=[170,115], u=[62,62];
  let o=pvArrowDefs();
  Object.keys(PV_STAR).forEach(k=>{ const v=PV_STAR[k], e=[C[0]+v[0]*u[0],C[1]-v[1]*u[1]]; o+=pvArrow(C,e); const dir=vunit([v[0],-v[1]]); o+=g.text([e[0]+dir[0]*13,e[1]+dir[1]*13+(v[1]===0?-4:0)],k,'g-v'); });
  return '<figure class="geofig"><svg class="geo-svg" viewBox="0 0 340 230" role="img" aria-label="Huit vecteurs a à h tracés depuis un même point">'+o+'</svg><figcaption>Les huit vecteurs partent du même point.</figcaption></figure>';
}
function genPvStar(n){
  const keys=Object.keys(PV_STAR), names=[['a','b','c','d','e','f','g','h']];
  for(let k=0;k<400;k++){
    const used=[]; while(used.length<n){ const c=pick(keys); if(used.indexOf(c)<0) used.push(c); }
    const sg=used.map((_,i)=>i===0?1:pick([1,1,-1]));
    let x=0,y=0; used.forEach((c,i)=>{ x+=sg[i]*PV_STAR[c][0]; y+=sg[i]*PV_STAR[c][1]; });
    const res=keys.find(c=>PV_STAR[c][0]===x&&PV_STAR[c][1]===y), zero=x===0&&y===0;
    if(!res&&!zero) continue;
    const expr=used.map((c,i)=>(i?(sg[i]<0?' − ':' + '):'')+c).join(''), ans=zero?'nul':res;
    const comp=used.map((c,i)=>(sg[i]<0?'−':'+')+'('+PV_STAR[c][0]+' ; '+PV_STAR[c][1]+')').join(' ').replace(/^\+/,'');
    const ch=keys.slice().sort().concat(['nul']);
    const ex=phTxt({choices:ch,tag:'pv-fig',statement:'Quel vecteur est égal à '+expr+' ?',answers:[ans],instr:'Écris la lettre du vecteur (ou « nul » pour le vecteur nul)',
      hint:'Lis les composantes des vecteurs sur la figure (la largeur est le double de la hauteur), additionne-les, puis cherche le vecteur qui a ces composantes.',
      solution:'<b>'+ans+'</b>. Avec les composantes lues sur la figure : '+used.map((c,i)=>(i?(sg[i]<0?' − ':' + '):'')+c+' = ('+PV_STAR[c][0]+' ; '+PV_STAR[c][1]+')').join('')+', la somme vaut ('+x+' ; '+y+')'+(zero?' : c\'est le vecteur nul.':', soit le vecteur '+res+'.'),
      mist:phMist(ch,ans,c=>{ const v=c==='nul'?[0,0]:PV_STAR[c]; return 'Ce vecteur a pour composantes ('+v[0]+' ; '+v[1]+'), mais la somme demandée vaut ('+x+' ; '+y+') : additionne les composantes une à une.'; }),
      fallback:{tag:'pv-fig',title:'Choisis l\'un des vecteurs proposés',html:'<p>Réponds par une lettre de a à h, ou par « nul ».</p>'}});
    ex.html='<div class="geo">'+pvStarFig()+'<p class="geotxt">'+esc('Quel vecteur est égal à '+expr+' ?')+'</p></div>';
    return ex;
  }
}
const genPvStar2=()=>genPvStar(2), genPvStar3=()=>genPvStar(3);

PHT('pv-f1',1,'pvfg','Additionner deux vecteurs sur une figure',genPvStar2);
PHT('pv-c1',1,'pvcp','Composante à partir du module et de l\'angle',genPvComp);
PHT('pv-c2',2,'pvcp','Module à partir des composantes',genPvMod);
PHT('pv-c3',2,'pvcp','Angle polaire à partir des composantes',genPvAngle);
PHT('pv-s1',2,'pvsm','Somme de deux vecteurs : une composante',genPvSomme1);
PHT('pv-f2',3,'pvfg','Expression à trois vecteurs sur une figure',genPvStar3);
PHT('pv-s2',3,'pvsm','Module de la somme de deux vecteurs',genPvSommeMod);
PHT('pv-r0',3,'pvfo','Composante d\'une force',genPvForce1);
PHT('pv-s3',4,'pvsm','Angle polaire de la somme de deux vecteurs',genPvSommeAng);
PHT('pv-s4',4,'pvsm','Somme de deux vecteurs en forme polaire',genPvPolar2);
PHT('pv-r1',4,'pvfo','Résultante de trois forces : module',genPvForcesMod);
PHT('pv-s5',5,'pvsm','Quatre vecteurs en forme polaire : module',genPvPolar4Mod);
PHT('pv-s6',5,'pvsm','Quatre vecteurs en forme polaire : angle',genPvPolar4Ang);
PHT('pv-r2',5,'pvfo','Résultante de trois forces : angle',genPvForcesAng);

/* ----- fiche de cours et formulaire ----- */
const PV_FORM=[
  ['Forme polaire et composantes',[['Forme polaire',M('a = (r ; θ)')+' : module r, angle θ depuis l\'axe horizontal vers la droite, sens antihoraire'],['Composantes',M('a_x = r · cos θ')+' ; '+M('a_y = r · sin θ')],['Retour au polaire',M('r = √(a_x² + a_y²)')+' ; '+M('θ = atan(|a_y| / |a_x|)')+' puis correction selon le quadrant']]],
  ['Quadrant de l\'angle',[['1er (x > 0, y > 0)',M('θ = α')],['2e (x < 0, y > 0)',M('θ = 180° − α')],['3e (x < 0, y < 0)',M('θ = 180° + α')],['4e (x > 0, y < 0)',M('θ = 360° − α')],['α',M('α = atan(|y| / |x|)')]]],
  ['Somme de vecteurs',[['Composantes',M('R_x = a_x + b_x + …')+' ; '+M('R_y = a_y + b_y + …')],['Soustraction','On compte le vecteur avec le signe moins sur ses deux composantes'],['Attention','Le module d\'une somme n\'est pas la somme des modules']]],
  ['Angle donné avec l\'horizontale',[['Haut à droite',M('θ = β')],['Haut à gauche',M('θ = 180° − α')],['Bas à gauche',M('θ = 180° + γ')],['Bas à droite',M('θ = 360° − δ')]]]
];
function pvFormulas(T){ return PV_FORM.map(f=>T(f[0],f[1])).join(''); }
brData('physique').fiches.push(
{d:'pv',t:'Vecteurs · forme polaire, composantes et somme',html:
'<p>Un vecteur peut s\'écrire par ses <b>composantes</b> '+M('a = (a_x ; a_y)')+' ou en <b>forme polaire</b> '+M('a = (r ; θ)')+' : le module r est sa longueur et l\'angle polaire θ se mesure depuis l\'axe horizontal vers la droite, dans le sens antihoraire.</p>'
+'<h3>Passer d\'une forme à l\'autre</h3><p>'+M('a_x = r · cos θ')+' et '+M('a_y = r · sin θ')+'<br>'+M('r = √(a_x² + a_y²)')+' et '+M('α = atan(|a_y| / |a_x|)')+'</p>'
+'<p>La calculatrice donne α entre 0° et 90° : on corrige avec le quadrant. 1er quadrant θ = α ; 2e θ = 180° − α ; 3e θ = 180° + α ; 4e θ = 360° − α.</p>'
+'<h3>Somme de vecteurs (méthode analytique)</h3><p>On additionne les composantes de même nom : '+M('R_x = Σ r · cos θ')+' et '+M('R_y = Σ r · sin θ')+'. Un vecteur soustrait compte avec le signe moins. Ensuite : '+M('R = √(R_x² + R_y²)')+' et l\'angle selon le quadrant.</p>'
+'<h3>Exemple (résultante de trois forces)</h3><p>F₁ = 40 (α = 30°, vers le haut à gauche), F₂ = 35 (β = 45°, vers le haut à droite), F₃ = 25 (γ = 20°, vers le bas à gauche). Angles polaires : 180° − 30° = 150°, 45° et 180° + 20° = 200°.<br>'
+M('R_x = 40 · cos 150° + 35 · cos 45° + 25 · cos 200° ≈ −33,4')+'<br>'+M('R_y = 40 · sin 150° + 35 · sin 45° + 25 · sin 200° ≈ 36,1')+'</p>'
+'<p>La résolution graphique (règle du parallélogramme ou vecteurs mis bout à bout) donne le même résultat, mais avec moins de précision.</p>'},
{d:'pv',t:'À propos des exercices (GEN 2)',html:
'<p>Les exercices sont originaux, d\'après la série GEN 2 : lecture d\'expressions sur une figure, composantes et forme polaire, somme analytique, résultante de forces. Les exercices <b>graphiques</b> de la série (à la règle et au rapporteur) ne peuvent pas se faire à l\'écran : ils sont remplacés par la méthode analytique, qui donne le même résultat.</p>'}
);
