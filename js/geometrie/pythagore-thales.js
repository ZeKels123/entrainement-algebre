'use strict';
/* ===== Géométrie : Pythagore et Thalès ===== */
/* aides pour les copies d'élèves (work / w) : valeur « propre » (≤ 3 décimales), a × b / c (fraction irréductible si le quotient ne tombe pas juste), racine, arrondi */
const ghWnice=x=>Math.abs(Math.round(x*1000)/1000-x)<1e-9;
const ghWgcd=(x,y)=>y?ghWgcd(y,x%y):x;
const ghWfr=(n,d)=>{ const N=Math.round(n*100), D=Math.round(d*100), g=ghWgcd(Math.abs(N),Math.abs(D)); return NF(N/g)+' / '+NF(D/g); };
const ghWdiv=(a,b,c)=>NF(a)+' × '+NF(b)+' / '+NF(c)+' = '+(ghWnice(a*b/c)?NF(a*b/c):ghWfr(a*b,c));
const ghWrt=n=>'√'+NF(n)+(ghWnice(Math.sqrt(n))?' = '+NF(Math.sqrt(n)):'');
const ghWr=(x,d)=>(Math.round(x*Math.pow(10,d))/Math.pow(10,d)).toFixed(d).replace('.',',');
const PYNAMES=[['A','B','C'],['A','B','C'],['E','F','G'],['M','N','P']];
function pyRight(nm,a,b,flip,ul,unk,alt){ return svgRight({a,b,flip,names:nm,lAB:unk==='AB'?'?':a+' '+ul,lBC:unk==='BC'?'?':b+' '+ul,lAC:unk==='AC'?'?':null,uAB:unk==='AB',uBC:unk==='BC',uAC:unk==='AC',alt}); }

function genPy1(){
  const u=uP(), nm=pick(PYNAMES), [a,b,c]=tripleK(41), flip=Math.random()<0.5, X=nm[0],Y=nm[1],Z=nm[2];
  const svg=svgRight({a,b,flip,names:nm,lAB:a+' '+u,lBC:b+' '+u,lAC:'?',uAC:true,alt:'Triangle '+X+Y+Z+' rectangle en '+Y});
  return mkGeo({svg,text:'Le triangle «'+X+Y+Z+'» est rectangle en «'+Y+'», avec «'+X+Y+' = '+a+'» '+u+' et «'+Y+Z+' = '+b+'» '+u+'. Calcule la longueur de l\'hypoténuse «'+X+Z+'».',ask:'l\'hypoténuse '+X+Z,val:c,unit:u,
    placeholder:X+Z+'² = 3² + 4² = 25\n'+X+Z+' = 5 cm',
    steps:[stp('Le triangle est rectangle en '+Y+' : théorème de Pythagore',M(X+Z+'² = '+X+Y+'² + '+Y+Z+'²')),stp('Remplace',M(X+Z+'² = '+a+'² + '+b+'² = '+(a*a)+' + '+(b*b)+' = '+(a*a+b*b))),stp('Racine carrée',M(X+Z+' = √'+(a*a+b*b)+' = '+c)+' '+u)],
    hints:['L\'hypoténuse est le côté opposé à l\'angle droit : c\'est ici '+X+Z+'.','Pythagore : le carré de l\'hypoténuse est égal à la somme des carrés des deux autres côtés.'],
    sanity:[{when:x=>x<Math.max(a,b)-1e-9,tag:'geo-pyth-cote',msg:'L\'hypoténuse est le plus grand côté du triangle rectangle : ta valeur est plus petite qu\'un des côtés de l\'angle droit.'}],
    work:[X+Z+'² = '+a+'² + '+b+'² = '+(a*a)+' + '+(b*b)+' = '+(a*a+b*b),X+Z+' = √'+(a*a+b*b)+' = '+c+' '+u],
    mistakes:[{v:a+b,tag:'geo-pyth-somme',msg:'Tu as additionné les longueurs. Pythagore additionne les <b>carrés</b> : c² = a² + b², puis on prend la racine.',w:[X+Z+' = '+a+' + '+b,X+Z+' = '+(a+b)+' '+u]},{v:a*a+b*b,tag:'geo-racine',msg:'Tu as calculé '+X+Z+'² mais pas '+X+Z+' : il reste à prendre la racine carrée.',w:[X+Z+'² = '+a+'² + '+b+'² = '+(a*a)+' + '+(b*b)+' = '+(a*a+b*b),X+Z+' = '+(a*a+b*b)+' '+u]},{v:Math.abs(a*a-b*b),tag:'geo-pyth-cote',msg:'Tu as soustrait les carrés : cela sert à trouver un côté de l\'angle droit. Pour l\'hypoténuse, on additionne.',w:[X+Z+'² = '+Math.max(a,b)+'² − '+Math.min(a,b)+'² = '+Math.max(a*a,b*b)+' − '+Math.min(a*a,b*b)+' = '+Math.abs(a*a-b*b),X+Z+' = '+Math.abs(a*a-b*b)+' '+u]}]});
}
function genPy2(){
  const u=uP(), nm=pick(PYNAMES), [a,b,c]=tripleK(41), flip=Math.random()<0.5, X=nm[0],Y=nm[1],Z=nm[2], unkAB=Math.random()<0.5;
  const kn=unkAB?a:b, kk=unkAB?b:a, un=unkAB?X+Y:Y+Z, kw=unkAB?Y+Z:X+Y;
  const svg=svgRight({a,b,flip,names:nm,lAB:unkAB?'?':a+' '+u,lBC:unkAB?b+' '+u:'?',uAB:unkAB,uBC:!unkAB,lAC:c+' '+u,alt:'Triangle '+X+Y+Z+' rectangle en '+Y+', hypoténuse '+c});
  return mkGeo({svg,text:'Le triangle «'+X+Y+Z+'» est rectangle en «'+Y+'», avec «'+X+Z+' = '+c+'» '+u+' et «'+kw+' = '+kk+'» '+u+'. Calcule «'+un+'».',ask:'le côté '+un,val:kn,unit:u,
    placeholder:un+'² = 5² − 3² = 16\n'+un+' = 4 cm',
    steps:[stp('Pythagore (hypoténuse '+X+Z+')',M(X+Z+'² = '+X+Y+'² + '+Y+Z+'²')),stp('Isole '+un,M(un+'² = '+X+Z+'² − '+kw+'² = '+c+'² − '+kk+'² = '+(c*c)+' − '+(kk*kk)+' = '+(c*c-kk*kk))),stp('Racine carrée',M(un+' = √'+(c*c-kk*kk)+' = '+kn)+' '+u)],
    hints:['L\'hypoténuse est '+X+Z+' (en face de l\'angle droit). Elle porte le carré « seul » : '+X+Z+'² = ...','On cherche un côté de l\'angle droit : on <b>soustrait</b> les carrés.'],
    sanity:[{when:x=>x>=c-1e-9,tag:'geo-pyth-cote',msg:'Un côté de l\'angle droit est toujours plus court que l\'hypoténuse ('+c+' '+u+') : ta valeur est trop grande.'}],
    work:[un+'² = '+c+'² − '+kk+'² = '+(c*c)+' − '+(kk*kk)+' = '+(c*c-kk*kk),un+' = √'+(c*c-kk*kk)+' = '+kn+' '+u],
    mistakes:[{v:Math.sqrt(c*c+kk*kk),tag:'geo-pyth-cote',msg:'Tu as additionné les carrés. Ici l\'hypoténuse est connue (c² = a² + b²) : on <b>soustrait</b> pour trouver un côté de l\'angle droit.',w:[un+'² = '+c+'² + '+kk+'² = '+(c*c)+' + '+(kk*kk)+' = '+(c*c+kk*kk),un+' = '+ghWrt(c*c+kk*kk)+' '+u]},{v:c-kk,tag:'geo-pyth-somme',msg:'Tu as soustrait les longueurs. Il faut soustraire les <b>carrés</b>, puis prendre la racine.',w:[un+' = '+c+' − '+kk,un+' = '+(c-kk)+' '+u]},{v:c*c-kk*kk,tag:'geo-racine',msg:'Il reste à prendre la racine carrée de '+(c*c-kk*kk)+'.',w:[un+'² = '+c+'² − '+kk+'² = '+(c*c)+' − '+(kk*kk)+' = '+(c*c-kk*kk),un+' = '+(c*c-kk*kk)+' '+u]}]});
}
function genPy3(){
  const u=uP(), nm=pick(PYNAMES), X=nm[0],Y=nm[1],Z=nm[2]; let a,b,n; do{ a=rnd(2,9); b=rnd(2,9); n=a*a+b*b; }while(Math.round(Math.sqrt(n))**2===n||a===b);
  const exact=Math.random()<0.5, flip=Math.random()<0.5, v=Math.sqrt(n);
  const svg=svgRight({a,b,flip,names:nm,lAB:a+' '+u,lBC:b+' '+u,lAC:'?',uAC:true,alt:'Triangle '+X+Y+Z+' rectangle en '+Y});
  const steps=[stp('Pythagore',M(X+Z+'² = '+a+'² + '+b+'² = '+n)),stp('Racine carrée',exact?M(X+Z+' = √'+n+(simpRad(n).k>1?' = '+radStr(n):''))+' '+u:M(X+Z+' = √'+n+' ≈ '+NF(Math.round(v*10)/10))+' '+u)];
  const hints=['Pythagore : '+X+Z+'² = '+X+Y+'² + '+Y+Z+'².'+(exact?' Simplifie la racine si possible : cherche un carré parfait qui divise le nombre.':' Utilise la touche √ de la calculatrice puis arrondis.')];
  const wl1=X+Z+'² = '+a+'² + '+b+'² = '+(a*a)+' + '+(b*b)+' = '+n;
  const ms=[{v:a+b,tag:'geo-pyth-somme',msg:'Tu as additionné les longueurs. Pythagore additionne les <b>carrés</b>.',w:[X+Z+' = '+a+' + '+b,X+Z+' = '+(a+b)+' '+u]},{v:n,tag:'geo-racine',msg:'Tu as oublié la racine carrée : '+n+' est le carré de '+X+Z+'.',w:[wl1,X+Z+' = '+n+' '+u]}];
  if(exact) return mkGeo({svg,text:'Le triangle «'+X+Y+Z+'» est rectangle en «'+Y+'», avec «'+X+Y+' = '+a+'» '+u+' et «'+Y+Z+' = '+b+'» '+u+'. Calcule «'+X+Z+'». Donne la <b>valeur exacte</b> (avec une racine carrée, simplifiée si possible).',ask:'l\'hypoténuse (valeur exacte)',val:v,mode:'sqrt',exact:radStr(n),unit:u,placeholder:X+Z+'² = 2² + 3² = 13\n'+X+Z+' = √13 cm',steps,hints,mistakes:ms,sanity:[{when:x=>x<Math.max(a,b),tag:'geo-pyth-cote',msg:'L\'hypoténuse est le plus grand côté.'}],
    work:[wl1,X+Z+' = √'+n+(simpRad(n).k>1?' = '+radStr(n):'')+' '+u]});
  return mkGeo({svg,text:'Le triangle «'+X+Y+Z+'» est rectangle en «'+Y+'», avec «'+X+Y+' = '+a+'» '+u+' et «'+Y+Z+' = '+b+'» '+u+'. Calcule «'+X+Z+'», arrondi au <b>dixième</b>.',ask:'l\'hypoténuse (arrondie au dixième)',val:v,mode:'round',d:1,unit:u,placeholder:X+Z+'² = 2² + 3² = 13\n'+X+Z+' ≈ 3,6 cm',steps,hints,mistakes:ms,work:[wl1,X+Z+' = √'+n+' ≈ '+ghWr(v,1)+' '+u],sanity:[{when:x=>x<Math.max(a,b),tag:'geo-pyth-cote',msg:'L\'hypoténuse est le plus grand côté.'}]});
}
function genPy4(){
  const u=uP(); let [a,b,c]=tripleK(30); if(a>b){ const t=a; a=b; b=t; }
  const isRect=Math.random()<0.5; let c2=c; if(!isRect){ do{ c2=c+pick([-2,-1,1,2]); }while(c2<=Math.max(a,b)-0||a+b<=c2||c2<=0||c2*c2===a*a+b*b); if(c2<=b) c2=c+1; }
  const svg=svgTri3({a:b,b:c2,c:a,la:b+' '+u,lb:c2+' '+u,lc:a+' '+u,alt:'Triangle ABC avec AB = '+a+', BC = '+b+' et AC = '+c2});
  const s1=c2*c2, s2=a*a+b*b;
  return mkGeo({svg,text:'Dans le triangle «ABC», «AB = '+a+'» '+u+', «BC = '+b+'» '+u+' et «AC = '+c2+'» '+u+'. Le triangle est-il rectangle ? Réponds par <b>oui</b> ou <b>non</b>, après avoir justifié par un calcul.',mode:'choice',choice:isRect?'oui':'non',instr:'Ce triangle est-il rectangle ?',placeholder:'AC² = ...\nAB² + BC² = ...\nOn compare : ...\nnon',
    steps:[stp('Le plus grand côté est AC',M('AC² = '+c2+'² = '+s1)),stp('Somme des carrés des deux autres',M('AB² + BC² = '+a+'² + '+b+'² = '+(a*a)+' + '+(b*b)+' = '+s2)),stp('Conclusion',isRect?'AC² = AB² + BC² : d\'après la <b>réciproque</b> du théorème de Pythagore, le triangle est rectangle en B.':'AC² ≠ AB² + BC² : d\'après la contraposée de Pythagore, le triangle n\'est pas rectangle.')],
    hints:['Compare le carré du plus grand côté avec la somme des carrés des deux autres.','Si les deux nombres sont égaux, la réciproque de Pythagore montre que le triangle est rectangle. Sinon, il ne l\'est pas.']});
}
function genPy5(){
  const r=Math.random(), nmR=['A','B','C','D'];
  if(r<0.34){
    const u=uP(), triple=Math.random()<0.6; let a,b,c;
    if(triple){ [a,b,c]=tripleK(41); } else { do{ a=rnd(3,12); b=rnd(3,12); }while(Math.round(Math.sqrt(a*a+b*b))**2===a*a+b*b); c=Math.sqrt(a*a+b*b); }
    const svg=figure([[0,0],[a,0],[a,b],[0,b]],f=>{ const A=f([0,0]),B=f([a,0]),C=f([a,b]),D=f([0,b]),ce=cen([A,B,C,D]);
      return g.poly([A,B,C,D])+g.right(B,C,A,10)+g.seg(A,C,'g-dash')+g.text([(A[0]+B[0])/2,A[1]+17],a+' '+u)+g.len(B,C,b+' '+u,ce,17)+g.text([(A[0]+C[0])/2-10,(A[1]+C[1])/2-10],'?','g-u')+g.vert(A,'A',ce)+g.vert(B,'B',ce)+g.vert(C,'C',ce)+g.vert(D,'D',ce); },'Rectangle ABCD et sa diagonale AC');
    const base={svg,ask:'la diagonale du rectangle',unit:u,steps:[stp('Le triangle ABC est rectangle en B',M('AC² = AB² + BC² = '+a+'² + '+b+'² = '+(a*a+b*b))),stp('Racine carrée',M('AC = √'+(a*a+b*b)+(triple?' = '+c:' ≈ '+NF(Math.round(c*10)/10)))+' '+u)],hints:['La diagonale coupe le rectangle en deux triangles rectangles.'],
      work:['AC² = '+a+'² + '+b+'² = '+(a*a)+' + '+(b*b)+' = '+(a*a+b*b),'AC = √'+(a*a+b*b)+(triple?' = '+c:' ≈ '+ghWr(c,1))+' '+u],
      mistakes:[{v:a+b,tag:'geo-pyth-somme',msg:'Tu as additionné les côtés. La diagonale est l\'hypoténuse : √(a² + b²).',w:['AC = '+a+' + '+b,'AC = '+(a+b)+' '+u]},{v:a*a+b*b,tag:'geo-racine',msg:'Il manque la racine carrée.',w:['AC² = '+a+'² + '+b+'² = '+(a*a)+' + '+(b*b)+' = '+(a*a+b*b),'AC = '+(a*a+b*b)+' '+u]},{v:2*(a+b),tag:'geo-perim-aire',msg:'Tu as calculé le périmètre. La question porte sur la diagonale.',w:['P = 2 × ('+a+' + '+b+')','P = '+(2*(a+b))+' '+u]}]};
    const t='Un rectangle «ABCD» mesure «AB = '+a+'» '+u+' sur «BC = '+b+'» '+u+'. Calcule la longueur de sa diagonale «AC»';
    return triple?mkGeo(Object.assign(base,{text:t+'.',val:c,placeholder:'AC² = 6² + 8² = 100\nAC = 10 cm'})):mkGeo(Object.assign(base,{text:t+', arrondie au <b>dixième</b>.',val:c,mode:'round',d:1,placeholder:'AC² = 5² + 7² = 74\nAC ≈ 8,6 cm'}));
  }
  if(r<0.67){
    const sc=pick([1,1,0.5]), [a0,b0,c0]=tripleK(13).map(x=>x*sc), [d,h,L]=(()=>{ const t=pick([[3,4,5],[5,12,13],[6,8,10]]); return t.map(x=>x*sc); })();
    const askH=Math.random()<0.7, unk=askH?h:d;
    const svg=svgRight({a:h,b:d,flip:false,names:['','',''],lAB:askH?'?':NF(h)+' m',uAB:askH,lBC:askH?NF(d)+' m':'?',uBC:!askH,lAC:NF(L)+' m',alt:'Échelle de '+NF(L)+' m appuyée contre un mur vertical'});
    return mkGeo({svg,text:'Une échelle de «'+NF(L)+'» m est appuyée contre un mur vertical. '+(askH?'Son pied est à «'+NF(d)+'» m du mur. À quelle hauteur touche-t-elle le mur ?':'Elle touche le mur à «'+NF(h)+'» m de hauteur. À quelle distance du mur se trouve son pied ?'),instr:'Calcule '+(askH?'la hauteur atteinte':'la distance du pied au mur'),val:unk,unit:'m',
      placeholder:'échelle² = 2,5² ...\nhauteur² = ... \nhauteur = ... m',
      steps:[stp('Le mur et le sol sont perpendiculaires','Le triangle formé par le mur, le sol et l\'échelle est rectangle : l\'échelle est l\'<b>hypoténuse</b>.'),stp('Pythagore',M('x² = '+NF(L)+'² − '+NF(askH?d:h)+'² = '+NF(L*L)+' − '+NF((askH?d:h)**2)+' = '+NF(unk*unk))),stp('Racine carrée',M('x = √'+NF(unk*unk)+' = '+NF(unk))+' m')],
      hints:['Fais un schéma : l\'échelle est le côté le plus long du triangle rectangle.'],
      sanity:[{when:x=>x>=L-1e-9,tag:'geo-pyth-cote',msg:'La hauteur (ou la distance) est plus courte que l\'échelle, qui est l\'hypoténuse.'}],
      work:['x² = '+NF(L)+'² − '+NF(askH?d:h)+'² = '+NF(L*L)+' − '+NF((askH?d:h)**2)+' = '+NF(unk*unk),'x = '+ghWrt(unk*unk)+' m'],
      mistakes:[{v:Math.sqrt(L*L+(askH?d:h)**2),tag:'geo-pyth-cote',msg:'Tu as additionné les carrés. L\'échelle est l\'hypoténuse : on soustrait pour trouver un côté de l\'angle droit.',w:['x² = '+NF(L)+'² + '+NF(askH?d:h)+'² = '+NF(L*L)+' + '+NF((askH?d:h)**2)+' = '+NF(L*L+(askH?d:h)**2),'x = '+ghWrt(L*L+(askH?d:h)**2)+' m']},{v:L-(askH?d:h),tag:'geo-pyth-somme',msg:'Tu as soustrait les longueurs. Il faut soustraire les carrés, puis prendre la racine.',w:['x = '+NF(L)+' − '+NF(askH?d:h),'x = '+NF(L-(askH?d:h))+' m']}]});
  }
  /* distance dans un repère */
  const triple=Math.random()<0.6; let dx,dy; if(triple){ const t=tripleK(20); dx=(Math.random()<0.5?1:-1)*t[0]; dy=(Math.random()<0.5?1:-1)*t[1]; if(Math.abs(dx)>7||Math.abs(dy)>7){ const t2=pick([[3,4,5],[4,3,5]]); dx=(Math.random()<0.5?1:-1)*t2[0]; dy=(Math.random()<0.5?1:-1)*t2[1]; } } else { do{ dx=rnd(-6,6); dy=rnd(-6,6); }while(!dx||!dy||Math.round(Math.sqrt(dx*dx+dy*dy))**2===dx*dx+dy*dy); }
  const xa=rnd(-3,2), ya=rnd(-3,2), xb=xa+dx, yb=ya+dy, n=dx*dx+dy*dy, dist=Math.sqrt(n);
  const x0=Math.min(xa,xb)-1, x1=Math.max(xa,xb)+1, y0=Math.min(ya,yb)-1, y1=Math.max(ya,yb)+1;
  const svg=figure([[x0,y0],[x1,y1]],f=>{
    let out=''; for(let x=Math.ceil(x0);x<=Math.floor(x1);x++){ out+=g.seg(f([x,y0]),f([x,y1]),x===0?'g-axis':'g-grid'); out+=g.text([f([x,y0])[0],f([x,y0])[1]+13],String(x),'g-num'); }
    for(let y=Math.ceil(y0);y<=Math.floor(y1);y++){ out+=g.seg(f([x0,y]),f([x1,y]),y===0?'g-axis':'g-grid'); out+=g.text([f([x0,y])[0]-8,f([x0,y])[1]],String(y),'g-num'); }
    const A=f([xa,ya]),B=f([xb,yb]);
    return out+g.seg(A,B,'g-l')+g.dot(A)+g.dot(B)+g.text([A[0]+(xb>=xa?-16:16),A[1]+(yb>=ya?14:-14)],'A','g-v')+g.text([B[0]+(xb>=xa?16:-16),B[1]+(yb>=ya?-14:14)],'B','g-v');
  },'Repère avec les points A('+xa+' ; '+ya+') et B('+xb+' ; '+yb+')',{pad:26});
  const st=[stp('Distance entre deux points',M('AB² = (xB − xA)² + (yB − yA)²')),stp('Remplace',M('AB² = ('+xb+' − '+(xa<0?'('+xa+')':xa)+')² + ('+yb+' − '+(ya<0?'('+ya+')':ya)+')² = '+dx+'² + '+dy+'² = '+n)),stp('Racine carrée',triple?M('AB = √'+n+' = '+dist):M('AB = √'+n+' ≈ '+NF(Math.round(dist*10)/10)))];
  const wp=v=>v<0?'(−'+(-v)+')':String(v), ws=v=>v<0?'−'+(-v):String(v);
  const wl1='AB² = ('+ws(xb)+' − '+wp(xa)+')² + ('+ws(yb)+' − '+wp(ya)+')² = '+wp(dx)+'² + '+wp(dy)+'² = '+(dx*dx)+' + '+(dy*dy)+' = '+n;
  const ms=[{v:Math.abs(dx)+Math.abs(dy),tag:'geo-pyth-somme',msg:'Tu as additionné les écarts. La distance en ligne droite est l\'hypoténuse du triangle rectangle de côtés '+Math.abs(dx)+' et '+Math.abs(dy)+'.',w:['AB = '+Math.abs(dx)+' + '+Math.abs(dy),'AB = '+(Math.abs(dx)+Math.abs(dy))]},{v:n,tag:'geo-racine',msg:'Il manque la racine carrée.',w:[wl1,'AB = '+n]}];
  const t='Dans un repère orthonormé (unité : 1 carreau), on place «A('+xa+' ; '+ya+')» et «B('+xb+' ; '+yb+')». Calcule la distance «AB»';
  return triple?mkGeo({svg,text:t+'.',ask:'la distance AB',val:dist,placeholder:'dx = ... ; dy = ...\nAB² = ...\nAB = ...',steps:st,hints:['Trace le triangle rectangle qui a [AB] pour hypoténuse : ses côtés sont les écarts horizontal et vertical.'],mistakes:ms,work:[wl1,'AB = √'+n+' = '+dist]}):mkGeo({svg,text:t+', arrondie au <b>dixième</b>.',ask:'la distance AB (arrondie au dixième)',val:dist,mode:'round',d:1,placeholder:'AB² = ...\nAB ≈ ...',steps:st,hints:['Trace le triangle rectangle qui a [AB] pour hypoténuse.'],mistakes:ms,work:[wl1,'AB = √'+n+' ≈ '+ghWr(dist,1)]});
}
TOPICS['gp-1']={kind:'gpyth',level:1,label:'Hypoténuse',gen:genPy1};
TOPICS['gp-2']={kind:'gpyth',level:2,label:'Côté de l\'angle droit',gen:genPy2};
TOPICS['gp-3']={kind:'gpyth',level:3,label:'Racine non entière',gen:genPy3};
TOPICS['gp-4']={kind:'gpyth',level:4,label:'Réciproque de Pythagore',gen:genPy4};
TOPICS['gp-5']={kind:'gpyth',level:5,label:'Applications de Pythagore',gen:genPy5};

/* ---------- Thalès ---------- */
const RATIOS=[[1,2],[2,3],[3,4],[2,5],[3,5],[3,7],[4,5],[1,3],[1,4],[5,8]];
function thalesData(){ const [p,q]=pick(RATIOS), m=()=>pick([1,1.5,2,2.5,3,4]), k=m(), mm=m(), n=m();
  return {p,q,AM:p*k,AB:q*k,MB:(q-p)*k,AN:p*mm,AC:q*mm,NC:(q-p)*mm,MN:p*n,BC:q*n}; }
/* labels : objet {AM,MB,AB,AN,NC,AC,MN,BC} de chaînes (une chaîne contenant « ? » est en couleur d'accent) */
function svgThalesTri(o){
  const t1=o.t1, t2=o.t2==null?o.t1:o.t2, ax=o.ax==null?38:o.ax, A=[ax,100], B=[0,0], C=[120,0], M_=[A[0]+t1*(B[0]-A[0]),A[1]+t1*(B[1]-A[1])], N_=[A[0]+t2*(C[0]-A[0]),A[1]+t2*(C[1]-A[1])], L=o.lab||{};
  const nm=o.names||['A','B','C','M','N'];
  return figure([A,B,C],f=>{
    const a=f(A),b=f(B),c=f(C),m=f(M_),n=f(N_),ce=cen([a,b,c]), cl=s=>(s&&s.indexOf('?')>=0)?'g-u':'';
    let out=g.poly([a,b,c])+g.seg(m,n,'g-l');
    if(o.par){ out+=g.par(m,n,1)+g.par(b,c,1); }
    out+=g.dot(m)+g.dot(n);
    const oB=[2*b[0]-c[0],2*b[1]-c[1]], oC=[2*c[0]-b[0],2*c[1]-b[1]];
    if(L.AM) out+=g.len(a,m,L.AM,c,10,cl(L.AM));
    if(L.MB) out+=g.len(m,b,L.MB,c,10,cl(L.MB));
    if(L.AB) out+=g.dim(a,b,L.AB,c,64,cl(L.AB));
    if(L.AN) out+=g.len(a,n,L.AN,b,10,cl(L.AN));
    if(L.NC) out+=g.len(n,c,L.NC,b,10,cl(L.NC));
    if(L.AC) out+=g.dim(a,c,L.AC,b,64,cl(L.AC));
    if(L.MN) out+=g.len(m,n,L.MN,a,13,cl(L.MN));
    if(L.BC) out+=g.text([(b[0]+c[0])/2,b[1]+17],L.BC,cl(L.BC));
    return out+g.vert(a,nm[0],ce)+g.vert(b,nm[1],ce)+g.vert(c,nm[2],ce)+g.vert(m,nm[3],ce,17)+g.vert(n,nm[4],ce,17);
  },o.alt,{pad:66});
}
const thHead=(u)=>'Dans le triangle «ABC», le point «M» est sur «[AB]», le point «N» est sur «[AC]» et les droites «(MN)» et «(BC)» sont parallèles. ';
const thSteps=(fr,sub,prod,res,u)=>[stp('Thalès : «(MN) // (BC)», M ∈ [AB], N ∈ [AC]',M('AM/AB = AN/AC = MN/BC')+' (les rapports se lisent « petit côté sur grand côté »).'),stp('Garde les deux rapports utiles',M(fr)+' devient '+M(sub)),stp('Produit en croix',M(prod),M(res)+' '+u)];
function genTh1(){
  const u=uP(), d=thalesData(), askAN=Math.random()<0.5;
  if(askAN){ const val=d.AM*d.AC/d.AB;
    return mkGeo({svg:svgThalesTri({t1:d.p/d.q,par:true,lab:{AM:NF(d.AM)+' '+u,AB:NF(d.AB)+' '+u,AN:'?',AC:NF(d.AC)+' '+u},alt:'Triangle ABC, M sur AB, N sur AC, (MN) parallèle à (BC)'}),
      text:thHead()+'«AM = '+NF(d.AM)+'» '+u+', «AB = '+NF(d.AB)+'» '+u+' et «AC = '+NF(d.AC)+'» '+u+'. Calcule «AN».',ask:'la longueur AN',val,unit:u,placeholder:'AM/AB = AN/AC\n3/5 = AN/10\nAN = 3 × 10 / 5 = 6 cm',
      steps:thSteps('AM/AB = AN/AC',NF(d.AM)+'/'+NF(d.AB)+' = AN/'+NF(d.AC),'AN = '+NF(d.AM)+' × '+NF(d.AC)+' / '+NF(d.AB),'AN = '+NF(val),u),
      hints:['Écris l\'égalité des rapports avec les trois longueurs connues et AN.','AM/AB = AN/AC : le produit en croix donne AN.'],
      work:['AM/AB = AN/AC',NF(d.AM)+'/'+NF(d.AB)+' = AN/'+NF(d.AC),'AN = '+ghWdiv(d.AM,d.AC,d.AB)+' '+u],
      mistakes:[{v:d.AB*d.AC/d.AM,tag:'geo-thales-inverse',msg:'Tu as inversé un rapport. Les rapports se lisent toujours dans le même sens : AM/AB = AN/AC (petit sur grand des deux côtés). AN doit être plus petit que AC.',w:['AM/AB = AC/AN',NF(d.AM)+'/'+NF(d.AB)+' = '+NF(d.AC)+'/AN','AN = '+ghWdiv(d.AB,d.AC,d.AM)+' '+u]},{v:d.AC-(d.AB-d.AM),tag:'geo-thales-additif',msg:'Tu as raisonné par soustraction (AB − AM = MB, puis AC − MB). Le théorème de Thalès est <b>proportionnel</b> : on égale des rapports.',w:['MB = '+NF(d.AB)+' − '+NF(d.AM)+' = '+NF(d.AB-d.AM),'AN = '+NF(d.AC)+' − '+NF(d.AB-d.AM)+' = '+NF(d.AC-(d.AB-d.AM))+' '+u]},{v:d.AM+d.AC-d.AB,tag:'geo-thales-additif',msg:'Les longueurs ne se conservent pas par soustraction : il faut utiliser l\'égalité des rapports.',w:['AN = '+NF(d.AM)+' + '+NF(d.AC)+' − '+NF(d.AB),'AN = '+NF(d.AM+d.AC-d.AB)+' '+u]}]}); }
  const val=d.AM*d.BC/d.AB;
  return mkGeo({svg:svgThalesTri({t1:d.p/d.q,par:true,lab:{AM:NF(d.AM)+' '+u,AB:NF(d.AB)+' '+u,MN:'?',BC:NF(d.BC)+' '+u},alt:'Triangle ABC, M sur AB, N sur AC, (MN) parallèle à (BC)'}),
    text:thHead()+'«AM = '+NF(d.AM)+'» '+u+', «AB = '+NF(d.AB)+'» '+u+' et «BC = '+NF(d.BC)+'» '+u+'. Calcule «MN».',ask:'la longueur MN',val,unit:u,placeholder:'AM/AB = MN/BC\n...\nMN = ... cm',
    steps:thSteps('AM/AB = MN/BC',NF(d.AM)+'/'+NF(d.AB)+' = MN/'+NF(d.BC),'MN = '+NF(d.AM)+' × '+NF(d.BC)+' / '+NF(d.AB),'MN = '+NF(val),u),
    hints:['Le rapport qui contient MN est MN/BC.','AM/AB = MN/BC : produit en croix.'],
    work:['AM/AB = MN/BC',NF(d.AM)+'/'+NF(d.AB)+' = MN/'+NF(d.BC),'MN = '+ghWdiv(d.AM,d.BC,d.AB)+' '+u],
    mistakes:[{v:d.AB*d.BC/d.AM,tag:'geo-thales-inverse',msg:'Tu as inversé un rapport : MN est plus petit que BC, comme AM est plus petit que AB.',w:['AM/AB = BC/MN',NF(d.AM)+'/'+NF(d.AB)+' = '+NF(d.BC)+'/MN','MN = '+ghWdiv(d.AB,d.BC,d.AM)+' '+u]},{v:d.BC-(d.AB-d.AM),tag:'geo-thales-additif',msg:'Tu as raisonné par soustraction. Thalès est proportionnel : on égale des rapports.',w:['MB = '+NF(d.AB)+' − '+NF(d.AM)+' = '+NF(d.AB-d.AM),'MN = '+NF(d.BC)+' − '+NF(d.AB-d.AM)+' = '+NF(d.BC-(d.AB-d.AM))+' '+u]}]});
}
function genTh2(){
  const u=uP(), d=thalesData(), askAC=Math.random()<0.5;
  if(askAC){ const val=d.AN*d.AB/d.AM;
    return mkGeo({svg:svgThalesTri({t1:d.p/d.q,par:true,lab:{AM:NF(d.AM)+' '+u,AB:NF(d.AB)+' '+u,AN:NF(d.AN)+' '+u,AC:'?'},alt:'Triangle ABC, M sur AB, N sur AC, (MN) parallèle à (BC)'}),
      text:thHead()+'«AM = '+NF(d.AM)+'» '+u+', «AB = '+NF(d.AB)+'» '+u+' et «AN = '+NF(d.AN)+'» '+u+'. Calcule «AC».',ask:'la longueur AC',val,unit:u,placeholder:'AM/AB = AN/AC\n...\nAC = ... cm',
      steps:thSteps('AM/AB = AN/AC',NF(d.AM)+'/'+NF(d.AB)+' = '+NF(d.AN)+'/AC','AC = '+NF(d.AN)+' × '+NF(d.AB)+' / '+NF(d.AM),'AC = '+NF(val),u),
      hints:['AC est la longueur cherchée, au dénominateur du second rapport.','Le produit en croix donne AC = AN × AB / AM.'],
      sanity:[{when:x=>x<d.AN,tag:'geo-thales-inverse',msg:'AC est le côté entier : il est plus long que AN.'}],
      work:['AM/AB = AN/AC',NF(d.AM)+'/'+NF(d.AB)+' = '+NF(d.AN)+'/AC','AC = '+ghWdiv(d.AN,d.AB,d.AM)+' '+u],
      mistakes:[{v:d.AM*d.AN/d.AB,tag:'geo-thales-inverse',msg:'Tu as inversé un rapport. AC est plus grand que AN, comme AB est plus grand que AM.',w:['AM/AB = AC/AN',NF(d.AM)+'/'+NF(d.AB)+' = AC/'+NF(d.AN),'AC = '+ghWdiv(d.AM,d.AN,d.AB)+' '+u]},{v:d.AN+(d.AB-d.AM),tag:'geo-thales-additif',msg:'Tu as ajouté la même longueur (AB − AM) aux deux côtés. Thalès est proportionnel, pas additif.',w:['AC = '+NF(d.AN)+' + ('+NF(d.AB)+' − '+NF(d.AM)+')','AC = '+NF(d.AN+(d.AB-d.AM))+' '+u]}]}); }
  const val=d.MN*d.AB/d.AM;
  return mkGeo({svg:svgThalesTri({t1:d.p/d.q,par:true,lab:{AM:NF(d.AM)+' '+u,AB:NF(d.AB)+' '+u,MN:NF(d.MN)+' '+u,BC:'?'},alt:'Triangle ABC, M sur AB, N sur AC, (MN) parallèle à (BC)'}),
    text:thHead()+'«AM = '+NF(d.AM)+'» '+u+', «AB = '+NF(d.AB)+'» '+u+' et «MN = '+NF(d.MN)+'» '+u+'. Calcule «BC».',ask:'la longueur BC',val,unit:u,placeholder:'AM/AB = MN/BC\n...\nBC = ... cm',
    steps:thSteps('AM/AB = MN/BC',NF(d.AM)+'/'+NF(d.AB)+' = '+NF(d.MN)+'/BC','BC = '+NF(d.MN)+' × '+NF(d.AB)+' / '+NF(d.AM),'BC = '+NF(val),u),
    hints:['Le rapport qui contient BC est MN/BC.'],
    sanity:[{when:x=>x<d.MN,tag:'geo-thales-inverse',msg:'BC est plus long que MN (la grande base contient la petite).'}],
    work:['AM/AB = MN/BC',NF(d.AM)+'/'+NF(d.AB)+' = '+NF(d.MN)+'/BC','BC = '+ghWdiv(d.MN,d.AB,d.AM)+' '+u],
    mistakes:[{v:d.AM*d.MN/d.AB,tag:'geo-thales-inverse',msg:'Tu as inversé un rapport : BC est plus grand que MN.',w:['AM/AB = BC/MN',NF(d.AM)+'/'+NF(d.AB)+' = BC/'+NF(d.MN),'BC = '+ghWdiv(d.AM,d.MN,d.AB)+' '+u]},{v:d.MN+(d.AB-d.AM),tag:'geo-thales-additif',msg:'Thalès est proportionnel : on égale des rapports, on n\'ajoute pas la même longueur.',w:['BC = '+NF(d.MN)+' + ('+NF(d.AB)+' − '+NF(d.AM)+')','BC = '+NF(d.MN+(d.AB-d.AM))+' '+u]}]});
}
function genTh3(){
  const u=uP(), d=thalesData(), askAC=Math.random()<0.5;
  if(askAC){ const val=d.AN*d.AB/d.AM;
    return mkGeo({svg:svgThalesTri({t1:d.p/d.q,par:true,lab:{AM:NF(d.AM)+' '+u,MB:NF(d.MB)+' '+u,AN:NF(d.AN)+' '+u,AC:'?'},alt:'Triangle ABC avec AM, MB et AN connus'}),
      text:thHead()+'«AM = '+NF(d.AM)+'» '+u+', «MB = '+NF(d.MB)+'» '+u+' et «AN = '+NF(d.AN)+'» '+u+'. Calcule «AC».',ask:'la longueur AC',val,unit:u,placeholder:'AB = AM + MB = ...\nAM/AB = AN/AC\n...',
      steps:[stp('Calcule d\'abord AB (côté entier)',M('AB = AM + MB = '+NF(d.AM)+' + '+NF(d.MB)+' = '+NF(d.AB))+' '+u)].concat(thSteps('AM/AB = AN/AC',NF(d.AM)+'/'+NF(d.AB)+' = '+NF(d.AN)+'/AC','AC = '+NF(d.AN)+' × '+NF(d.AB)+' / '+NF(d.AM),'AC = '+NF(val),u)),
      hints:['Thalès utilise AB (le côté entier), pas MB. Additionne AM et MB.'],
      work:['AB = '+NF(d.AM)+' + '+NF(d.MB)+' = '+NF(d.AB),'AM/AB = AN/AC',NF(d.AM)+'/'+NF(d.AB)+' = '+NF(d.AN)+'/AC','AC = '+ghWdiv(d.AN,d.AB,d.AM)+' '+u],
      mistakes:[{v:d.AN*d.MB/d.AM,tag:'geo-thales-segment',msg:'Tu as utilisé MB à la place de AB. Le rapport est AM/AB : AB = AM + MB est le côté entier.',w:['AM/MB = AN/AC',NF(d.AM)+'/'+NF(d.MB)+' = '+NF(d.AN)+'/AC','AC = '+ghWdiv(d.AN,d.MB,d.AM)+' '+u]},{v:d.AM*d.AN/d.AB,tag:'geo-thales-inverse',msg:'Tu as inversé un rapport.',w:['AB = '+NF(d.AM)+' + '+NF(d.MB)+' = '+NF(d.AB),'AM/AB = AC/AN',NF(d.AM)+'/'+NF(d.AB)+' = AC/'+NF(d.AN),'AC = '+ghWdiv(d.AM,d.AN,d.AB)+' '+u]},{v:d.AN+d.MB,tag:'geo-thales-additif',msg:'Raisonnement additif : Thalès demande une proportion.',w:['AC = '+NF(d.AN)+' + '+NF(d.MB),'AC = '+NF(d.AN+d.MB)+' '+u]}]}); }
  const val=d.AM*d.AC/d.AB;
  return mkGeo({svg:svgThalesTri({t1:d.p/d.q,par:true,lab:{AM:NF(d.AM)+' '+u,MB:NF(d.MB)+' '+u,AN:'?',AC:NF(d.AC)+' '+u},alt:'Triangle ABC avec AM, MB et AC connus'}),
    text:thHead()+'«AM = '+NF(d.AM)+'» '+u+', «MB = '+NF(d.MB)+'» '+u+' et «AC = '+NF(d.AC)+'» '+u+'. Calcule «AN».',ask:'la longueur AN',val,unit:u,placeholder:'AB = AM + MB = ...\nAM/AB = AN/AC\n...',
    steps:[stp('Calcule d\'abord AB (côté entier)',M('AB = AM + MB = '+NF(d.AM)+' + '+NF(d.MB)+' = '+NF(d.AB))+' '+u)].concat(thSteps('AM/AB = AN/AC',NF(d.AM)+'/'+NF(d.AB)+' = AN/'+NF(d.AC),'AN = '+NF(d.AM)+' × '+NF(d.AC)+' / '+NF(d.AB),'AN = '+NF(val),u)),
    hints:['Thalès utilise AB (le côté entier), pas MB.'],
    work:['AB = '+NF(d.AM)+' + '+NF(d.MB)+' = '+NF(d.AB),'AM/AB = AN/AC',NF(d.AM)+'/'+NF(d.AB)+' = AN/'+NF(d.AC),'AN = '+ghWdiv(d.AM,d.AC,d.AB)+' '+u],
    mistakes:[{v:d.AM*d.AC/d.MB,tag:'geo-thales-segment',msg:'Tu as utilisé MB à la place de AB. Le rapport est AM/AB, avec AB = AM + MB.',w:['AM/MB = AN/AC',NF(d.AM)+'/'+NF(d.MB)+' = AN/'+NF(d.AC),'AN = '+ghWdiv(d.AM,d.AC,d.MB)+' '+u]},{v:d.AB*d.AC/d.AM,tag:'geo-thales-inverse',msg:'Tu as inversé un rapport.',w:['AB = '+NF(d.AM)+' + '+NF(d.MB)+' = '+NF(d.AB),'AM/AB = AC/AN',NF(d.AM)+'/'+NF(d.AB)+' = '+NF(d.AC)+'/AN','AN = '+ghWdiv(d.AB,d.AC,d.AM)+' '+u]}]});
}
function svgButterfly(o){
  const O=[0,0], f1=o.f1*Math.PI/180, f2=o.f2*Math.PI/180, d1=[-Math.cos(f1),Math.sin(f1)], d2=[Math.cos(f2),Math.sin(f2)];
  const A=vmul(d1,o.ra), B=vmul(d1,-o.rb), C=vmul(d2,o.rc), D=vmul(d2,-o.rd), L=o.lab;
  return figure([A,B,C,D],f=>{
    const a=f(A),b=f(B),c=f(C),d=f(D),oo=f(O), cl=s=>(s&&s.indexOf('?')>=0)?'g-u':'';
    let out=g.seg(a,b)+g.seg(c,d)+g.seg(a,c)+g.seg(b,d)+g.par(a,c,1)+g.par(b,d,1)+g.dot(oo);
    const from=oo;
    if(L.OA) out+=g.len(oo,a,L.OA,c,13,cl(L.OA)); if(L.OB) out+=g.len(oo,b,L.OB,d,13,cl(L.OB)); if(L.OC) out+=g.len(oo,c,L.OC,a,13,cl(L.OC)); if(L.OD) out+=g.len(oo,d,L.OD,b,13,cl(L.OD));
    if(L.AC) out+=g.len(a,c,L.AC,oo,13,cl(L.AC)); if(L.BD) out+=g.len(b,d,L.BD,oo,13,cl(L.BD));
    return out+g.vert(a,'A',oo,14)+g.vert(b,'B',oo,14)+g.vert(c,'C',oo,14)+g.vert(d,'D',oo,14)+g.text([oo[0]+2,oo[1]+15],'O','g-v');
  },o.alt,{pad:40});
}
function genTh4(){
  const u=uP(), [p0,q0]=pick(RATIOS), sw=Math.random()<0.5, p=sw?q0:p0, q=sw?p0:q0, m=()=>pick([1,1.5,2,2.5,3]), s=m(), t=m(), w=m();
  const OA=p*s, OB=q*s, OC=p*t, OD=q*t, AC=p*w, BD=q*w, kind=pick(['OD','BD','OB']);
  const base={f1:pick([28,35,42]),f2:pick([30,38,46]),ra:OA,rb:OB,rc:OC,rd:OD};
  const head='Les droites «(AB)» et «(CD)» se coupent en «O», et les droites «(AC)» et «(BD)» sont parallèles. ';
  const fr='OA/OB = OC/OD = AC/BD', stH=stp('Thalès (configuration en papillon)',M(fr)+' : les rapports mettent les côtés « du même côté » de O au même niveau (OA, OC, AC en haut ; OB, OD, BD en bas).');
  if(kind==='OD'){ const val=OC*OB/OA;
    return mkGeo({svg:svgButterfly(Object.assign({lab:{OA:NF(OA)+' '+u,OB:NF(OB)+' '+u,OC:NF(OC)+' '+u,OD:'?'},alt:'Configuration en papillon de centre O'},base)),text:head+'«OA = '+NF(OA)+'» '+u+', «OB = '+NF(OB)+'» '+u+' et «OC = '+NF(OC)+'» '+u+'. Calcule «OD».',ask:'la longueur OD',val,unit:u,placeholder:'OA/OB = OC/OD\n...\nOD = ...',
      steps:[stH,stp('Remplace',M('OA/OB = OC/OD')+' devient '+M(NF(OA)+'/'+NF(OB)+' = '+NF(OC)+'/OD')),stp('Produit en croix',M('OD = '+NF(OB)+' × '+NF(OC)+' / '+NF(OA)),M('OD = '+NF(val))+' '+u)],
      hints:['Les points A et C sont du même côté de O, B et D de l\'autre.'],
      work:['OA/OB = OC/OD',NF(OA)+'/'+NF(OB)+' = '+NF(OC)+'/OD','OD = '+ghWdiv(OB,OC,OA)+' '+u],
      mistakes:[{v:OA*OC/OB,tag:'geo-thales-inverse',msg:'Tu as inversé un rapport. OD est du même côté que OB (le « grand » côté) : OD/OC = OB/OA.',w:['OA/OB = OD/OC',NF(OA)+'/'+NF(OB)+' = OD/'+NF(OC),'OD = '+ghWdiv(OA,OC,OB)+' '+u]},{v:OC+(OB-OA),tag:'geo-thales-additif',msg:'Raisonnement additif : Thalès est proportionnel.',w:['OD = '+NF(OC)+' + ('+NF(OB)+' − '+NF(OA)+')','OD = '+NF(OC+(OB-OA))+' '+u]}]}); }
  if(kind==='BD'){ const val=AC*OB/OA;
    return mkGeo({svg:svgButterfly(Object.assign({lab:{OA:NF(OA)+' '+u,OB:NF(OB)+' '+u,AC:NF(AC)+' '+u,BD:'?'},alt:'Configuration en papillon de centre O'},base)),text:head+'«OA = '+NF(OA)+'» '+u+', «OB = '+NF(OB)+'» '+u+' et «AC = '+NF(AC)+'» '+u+'. Calcule «BD».',ask:'la longueur BD',val,unit:u,placeholder:'OA/OB = AC/BD\n...\nBD = ...',
      steps:[stH,stp('Remplace',M('OA/OB = AC/BD')+' devient '+M(NF(OA)+'/'+NF(OB)+' = '+NF(AC)+'/BD')),stp('Produit en croix',M('BD = '+NF(OB)+' × '+NF(AC)+' / '+NF(OA)),M('BD = '+NF(val))+' '+u)],
      hints:['Compare les côtés parallèles [AC] et [BD] avec les segments issus de O.'],
      work:['OA/OB = AC/BD',NF(OA)+'/'+NF(OB)+' = '+NF(AC)+'/BD','BD = '+ghWdiv(OB,AC,OA)+' '+u],
      mistakes:[{v:OA*AC/OB,tag:'geo-thales-inverse',msg:'Tu as inversé un rapport.',w:['OA/OB = BD/AC',NF(OA)+'/'+NF(OB)+' = BD/'+NF(AC),'BD = '+ghWdiv(OA,AC,OB)+' '+u]},{v:AC+(OB-OA),tag:'geo-thales-additif',msg:'Thalès est proportionnel, pas additif.',w:['BD = '+NF(AC)+' + ('+NF(OB)+' − '+NF(OA)+')','BD = '+NF(AC+(OB-OA))+' '+u]}]}); }
  const val=OA*OD/OC;
  return mkGeo({svg:svgButterfly(Object.assign({lab:{OA:NF(OA)+' '+u,OB:'?',OC:NF(OC)+' '+u,OD:NF(OD)+' '+u},alt:'Configuration en papillon de centre O'},base)),text:head+'«OA = '+NF(OA)+'» '+u+', «OC = '+NF(OC)+'» '+u+' et «OD = '+NF(OD)+'» '+u+'. Calcule «OB».',ask:'la longueur OB',val,unit:u,placeholder:'OA/OB = OC/OD\n...\nOB = ...',
    steps:[stH,stp('Remplace',M('OA/OB = OC/OD')+' devient '+M(NF(OA)+'/OB = '+NF(OC)+'/'+NF(OD))),stp('Produit en croix',M('OB = '+NF(OA)+' × '+NF(OD)+' / '+NF(OC)),M('OB = '+NF(val))+' '+u)],
    hints:['OB est au dénominateur du premier rapport.'],
    work:['OA/OB = OC/OD',NF(OA)+'/OB = '+NF(OC)+'/'+NF(OD),'OB = '+ghWdiv(OA,OD,OC)+' '+u],
    mistakes:[{v:OC*OD/OA,tag:'geo-thales-inverse',msg:'Tu as inversé un rapport.',w:['OA/OC = OD/OB',NF(OA)+'/'+NF(OC)+' = '+NF(OD)+'/OB','OB = '+ghWdiv(OC,OD,OA)+' '+u]},{v:OA+(OD-OC),tag:'geo-thales-additif',msg:'Thalès est proportionnel, pas additif.',w:['OB = '+NF(OA)+' + ('+NF(OD)+' − '+NF(OC)+')','OB = '+NF(OA+(OD-OC))+' '+u]}]});
}
function genTh5(){
  if(Math.random()<0.5){
    const u=uP(), [p,q]=pick(RATIOS), k=pick([1,2,3]), m=pick([1,2,3]), ok=Math.random()<0.5;
    const AM=p*k, AB=q*k, AC=q*m; let AN=p*m;
    if(!ok){ AN=AN+pick([-1,1,1,2]); if(AN<=0||AN>=AC) AN=p*m+1; if(AN*AB===AM*AC) AN=p*m+2; }
    const par=AN*AB===AM*AC;
    const svg=svgThalesTri({t1:AM/AB,t2:AN/AC,par:false,lab:{AM:AM+' '+u,AB:AB+' '+u,AN:AN+' '+u,AC:AC+' '+u},alt:'Triangle ABC avec M sur AB et N sur AC'});
    return mkGeo({svg,text:'Dans le triangle «ABC», «M» est sur «[AB]» et «N» est sur «[AC]». «AM = '+AM+'» '+u+', «AB = '+AB+'» '+u+', «AN = '+AN+'» '+u+' et «AC = '+AC+'» '+u+'. Les droites «(MN)» et «(BC)» sont-elles parallèles ? Réponds par <b>oui</b> ou <b>non</b>, après un calcul.',mode:'choice',choice:par?'oui':'non',instr:'(MN) et (BC) sont-elles parallèles ?',placeholder:'AM/AB = ...\nAN/AC = ...\nnon',
      steps:[stp('Calcule les deux rapports',M('AM/AB = '+AM+'/'+AB),M('AN/AC = '+AN+'/'+AC)),stp('Compare avec les produits en croix',M('AM × AC = '+AM+' × '+AC+' = '+(AM*AC))+' et '+M('AN × AB = '+AN+' × '+AB+' = '+(AN*AB))),stp('Conclusion',par?'Les rapports sont égaux et les points M, A, B et N, A, C sont alignés dans le même ordre : d\'après la <b>réciproque</b> de Thalès, (MN) // (BC).':'Les rapports sont différents : d\'après la contraposée de Thalès, (MN) et (BC) ne sont pas parallèles.')],
      hints:['Compare AM/AB et AN/AC. S\'ils sont égaux, les droites sont parallèles.','Pour comparer deux fractions, utilise les produits en croix.']});
  }
  const [p,q]=pick([[3,4],[3,2],[5,4],[5,6],[4,3],[6,5]]), c=pick([0.5,1]), t=pick([3,4,5,6,8,10,12]), h1=p*c, s1=q*c, s2=q*t, H=p*t;
  const gp=1+0.15*s2, svg=figure([[0,0],[s1,0],[0,h1],[s1+gp+s2,0],[s1+gp,H]],f=>{
    const x0=s1+gp, a=f([0,0]),b=f([s1,0]),tp=f([0,h1]), a2=f([x0,0]),b2=f([x0+s2,0]),t2=f([x0,H]);
    return g.seg(f([-0.6,0]),f([x0+s2+0.8,0]),'g-l')+g.seg(tp,b,'g-dash')+g.seg(t2,b2,'g-dash')+g.seg(a,tp,'g-l g-thick')+g.seg(a2,t2,'g-l g-thick')+g.right(a,tp,b,9)+g.right(a2,t2,b2,9)
      +g.text([a[0]-9,(a[1]+tp[1])/2],NF(h1)+' m','','end')+g.text([(a[0]+b[0])/2,a[1]+16],NF(s1)+' m')+g.text([a2[0]-9,(a2[1]+t2[1])/2],'?','g-u','end')+g.text([(a2[0]+b2[0])/2,a2[1]+16],NF(s2)+' m')
      +g.text([a[0],tp[1]-14],'bâton','g-num')+g.text([a2[0],t2[1]-14],'arbre','g-num');
  },'Un bâton et un arbre projettent leur ombre au même moment',{pad:34});
  return mkGeo({svg,text:'Au même moment de la journée, un bâton vertical de «'+NF(h1)+'» m projette une ombre de «'+NF(s1)+'» m, et un arbre projette une ombre de «'+NF(s2)+'» m. Les rayons du soleil sont parallèles. Quelle est la hauteur de l\'arbre ?',instr:'Calcule la hauteur de l\'arbre',val:H,unit:'m',placeholder:'hauteur/ombre = ...\n...',
    steps:[stp('Deux triangles rectangles aux côtés proportionnels','Les rayons parallèles donnent des triangles semblables (Thalès) : '+M('hauteur du bâton / ombre du bâton = hauteur de l\'arbre / ombre de l\'arbre')),stp('Remplace',M(NF(h1)+'/'+NF(s1)+' = h/'+NF(s2))),stp('Produit en croix',M('h = '+NF(h1)+' × '+NF(s2)+' / '+NF(s1)),M('h = '+H)+' m')],
    hints:['Fais le schéma : deux triangles rectangles avec des rayons parallèles.','Le rapport hauteur/ombre est le même pour le bâton et pour l\'arbre.'],
    work:[NF(h1)+'/'+NF(s1)+' = h/'+NF(s2),'h = '+ghWdiv(h1,s2,s1)+' m'],
    mistakes:[{v:s1*s2/h1,tag:'geo-thales-inverse',msg:'Tu as inversé un rapport : la hauteur de l\'arbre est proportionnelle à celle du bâton (hauteur/ombre).',w:[NF(h1)+'/'+NF(s1)+' = '+NF(s2)+'/h','h = '+ghWdiv(s1,s2,h1)+' m']},{v:s2+(h1-s1),tag:'geo-thales-additif',msg:'Tu as ajouté l\'écart entre hauteur et ombre du bâton. Thalès est proportionnel, pas additif.',w:['h = '+NF(s2)+' + ('+NF(h1)+' − '+NF(s1)+')','h = '+NF(s2+(h1-s1))+' m']},{v:s2,tag:'geo-thales-additif',msg:'Tu as pris la longueur de l\'ombre comme hauteur. Elles ne sont égales que si le soleil est à 45°.',w:['h = '+NF(s2)+' m']}]});
}
TOPICS['gh-1']={kind:'gthal',level:1,label:'Thalès : côté du petit segment',gen:genTh1};
TOPICS['gh-2']={kind:'gthal',level:2,label:'Thalès : côté du grand segment',gen:genTh2};
TOPICS['gh-3']={kind:'gthal',level:3,label:'Thalès avec segments partiels',gen:genTh3};
TOPICS['gh-4']={kind:'gthal',level:4,label:'Thalès : papillon',gen:genTh4};
TOPICS['gh-5']={kind:'gthal',level:5,label:'Réciproque et applications',gen:genTh5};
