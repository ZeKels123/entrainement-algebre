'use strict';
/* ===== Géométrie : exercices supplémentaires pour les thèmes existants ===== */
Object.assign(TAGS,{
  'geo-rapport-aire':{label:'Rapport d\'agrandissement et aires',tip:'Dans un agrandissement ou une réduction de rapport k, les longueurs sont multipliées par k, les aires par k² et les volumes par k³.'},
  'geo-sinus-aire':{label:'Aire avec deux côtés et l\'angle',tip:'Aire d\'un triangle = 1/2 × a × b × sin(angle compris entre a et b). L\'angle doit être celui qui est entre les deux côtés utilisés.'},
  'geo-arc-secteur':{label:'Arc et secteur : fraction du cercle',tip:'Un angle α au centre représente la fraction α/360 du cercle : arc = (α/360) × 2πr ; secteur = (α/360) × πr².'}
});
const gcdP=(a,b)=>b?gcdP(b,a%b):a;
const fracPiP=(n,d)=>{ const k=gcdP(Math.abs(n),d); n/=k; d/=k; const c=n===1?'':String(n); return d===1?c+'π':(c+'π')+'/'+d; };
const TRIPP=[[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15]];

/* ----- gt-3b : triangle, valeur manquante ----- */
function genTriInv(){
  const u=uP(), t=pick(['h','b','third']);
  if(t==='third'){
    let a,b,c; do{ a=rnd(4,12); b=rnd(4,12); c=rnd(4,12); }while(a+b<=c||a+c<=b||b+c<=a); const P=a+b+c;
    const svg=svgTri3({a,b,c,la:a+' '+u,lb:b+' '+u,lc:'?',alt:'Triangle avec deux côtés connus'});
    return mkGeo({svg,val:c,unit:u,text:'Un triangle a un périmètre de «'+P+'» '+u+'. Deux de ses côtés mesurent «'+a+'» '+u+' et «'+b+'» '+u+'. Calcule la longueur du troisième côté.',ask:'le troisième côté',placeholder:'P = a + b + c\n'+P+' = '+a+' + '+b+' + c',
      work:['P = '+a+' + '+b+' + c = '+P,'c = '+P+' − '+a+' − '+b+' = '+c+' '+u],steps:[stp('Périmètre',M('P = a + b + c')+', donc '+M(P+' = '+a+' + '+b+' + c')+'.'),stp('Isoler',M('c = '+P+' − '+a+' − '+b+' = '+c)+' '+u)],hints:['Le périmètre est la somme des trois côtés : retire les deux côtés connus.'],
      mistakes:[{v:P-a,tag:'geo-perim-cote',msg:'Il faut aussi retirer le second côté connu ('+b+').',w:['c = '+P+' − '+a+' = '+(P-a)]},{v:P+a+b,tag:'geo-perim-cote',msg:'Le périmètre contient déjà les trois côtés : on soustrait les côtés connus.',w:['c = '+P+' + '+a+' + '+b]},{v:P/3,tag:'geo-formule',msg:'Le triangle n\'est pas équilatéral : les côtés sont différents.',w:['c = '+P+' / 3']}]});
  }
  const b=rnd(4,14), h=rnd(3,12), A=b*h/2, px=+(b*pick([0.3,0.5,0.7])).toFixed(2);
  if(t==='h') return mkGeo({svg:svgTriH({b,px,h,labBase:b+' '+u,labH:'?',hUnk:true,alt:'Triangle de base '+b}),val:h,unit:u,text:'Un triangle a une aire de «'+NF(A)+'» '+u+'² et une base de «'+b+'» '+u+'. Calcule la hauteur correspondante.',ask:'la hauteur',placeholder:'A = b × h / 2\n'+NF(A)+' = '+b+' × h / 2',
    work:['A = b × h / 2','h = 2 × '+NF(A)+' / '+b+' = '+h+' '+u],steps:[stp('Formule',M('A = b × h / 2')+' donc '+M('h = 2A / b')),stp('Calcul',M('h = 2 × '+NF(A)+' / '+b+' = '+h)+' '+u)],hints:['Aire = base × hauteur / 2 : retourne la formule pour isoler h.'],
    mistakes:[{v:A/b,tag:'geo-demi',msg:'La formule est A = b × h / 2 : h = 2A / b (il faut doubler l\'aire).',w:['h = '+NF(A)+' / '+b]},{v:A*b/2,tag:'geo-formule',msg:'On divise l\'aire par la base, on ne la multiplie pas.',w:['h = '+NF(A)+' × '+b+' / 2']},{v:A*2,tag:'geo-formule',msg:'Il faut aussi diviser par la base.',w:['h = 2 × '+NF(A)]}]});
  return mkGeo({svg:svgTriH({b,px,h,labBase:'?',bUnk:true,labH:h+' '+u,alt:'Triangle de hauteur '+h}),val:b,unit:u,text:'Un triangle a une aire de «'+NF(A)+'» '+u+'² et une hauteur de «'+h+'» '+u+'. Calcule la longueur de la base correspondante.',ask:'la base',placeholder:'A = b × h / 2\n'+NF(A)+' = b × '+h+' / 2',
    work:['A = b × h / 2','b = 2 × '+NF(A)+' / '+h+' = '+b+' '+u],steps:[stp('Formule',M('A = b × h / 2')+' donc '+M('b = 2A / h')),stp('Calcul',M('b = 2 × '+NF(A)+' / '+h+' = '+b)+' '+u)],hints:['Retourne la formule A = b × h / 2 pour isoler b.'],
    mistakes:[{v:A/h,tag:'geo-demi',msg:'b = 2A / h : n\'oublie pas de doubler l\'aire.',w:['b = '+NF(A)+' / '+h]},{v:A*h/2,tag:'geo-formule',msg:'On divise l\'aire par la hauteur, on ne la multiplie pas.',w:['b = '+NF(A)+' × '+h+' / 2']}]});
}

/* ----- gt-5b : aire d'un triangle avec deux côtés et l'angle compris ----- */
function genTriSin(){
  const a=rnd(5,14), b=rnd(4,12), ga=pick([30,40,50,60,70,110,120,130]), u=uP(), A=0.5*a*b*Math.sin(ga*Math.PI/180), ans=Math.round(A*10)/10;
  const svg=figure((()=>{ const r=ga*Math.PI/180; return [[0,0],[a,0],[b*Math.cos(r),b*Math.sin(r)]]; })(),f=>{
    const r=ga*Math.PI/180, C=[0,0], B=[a,0], Ap=[b*Math.cos(r),b*Math.sin(r)], c_=f(C), b_=f(B), a_=f(Ap), ce=cen([c_,b_,a_]);
    let out=g.poly([c_,b_,a_])+g.dot(c_)+g.dot(b_)+g.dot(a_)+g.len(c_,b_,String(a),ce,10)+g.len(c_,a_,String(b),ce,10);
    const rad=24, u1=vunit(vsub(b_,c_)), u2=vunit(vsub(a_,c_)), p1=vadd(c_,vmul(u1,rad)), p2=vadd(c_,vmul(u2,rad)), bs=vunit(vadd(u1,u2)), pm=vadd(c_,vmul(bs,rad));
    out+='<path class="g-mark" d="M'+gf(p1[0])+' '+gf(p1[1])+arcM(p1,p2,pm,rad)+'"/>'+g.text(vadd(c_,vmul(bs,rad+(ga>100?18:24))),ga+'°','g-u');
    return out;
  },'Triangle avec deux côtés de '+a+' et '+b+' encadrant un angle de '+ga+' degrés',{H:230,pad:34});
  const sg='sin '+ga+'°';
  const wr=[{v:a*b*Math.sin(ga*Math.PI/180),tag:'geo-demi',msg:'Il manque le facteur 1/2 : A = 1/2 × a × b × sin(angle).',w:['A = '+a+' × '+b+' × '+sg]},{v:0.5*a*b*Math.cos(ga*Math.PI/180),tag:'geo-sinus-aire',msg:'C\'est le sinus de l\'angle qu\'il faut, pas le cosinus.',w:['A = 1/2 × '+a+' × '+b+' × cos '+ga+'°']},{v:0.5*a*b,tag:'geo-sinus-aire',msg:'Le triangle n\'est pas rectangle : l\'aire fait intervenir le sinus de l\'angle.',w:['A = 1/2 × '+a+' × '+b]}].filter(m=>Math.round(m.v*10)/10!==ans&&m.v>0);
  return mkGeo({svg,mode:'round',d:1,val:A,unit:u,pow:2,text:'Un triangle a deux côtés de «'+a+'» '+u+' et «'+b+'» '+u+' qui forment un angle de «'+ga+'°». Calcule son aire, arrondie au <b>dixième</b> (calculatrice en degrés).',ask:'l\'aire (arrondie au dixième)',placeholder:'A = 1/2 × a × b × sin(angle)',
    work:['A = 1/2 × '+a+' × '+b+' × '+sg,'A ≈ '+NF(ans)+' '+u+'²'],steps:[stp('Formule','Avec deux côtés et l\'angle compris : '+M('A = (1/2) × a × b × sin(γ)')+'. (C\'est base × hauteur / 2 avec la hauteur '+M('b × sin γ')+'.)'),stp('Calcul',M('A = (1/2) × '+a+' × '+b+' × '+sg+' ≈ '+NF(ans))+' '+u+'²')],hints:['La hauteur issue du sommet de l\'angle vaut côté × sin(angle).'],mistakes:wr});
}

/* ----- gq-3b : parallélogramme, deux hauteurs ----- */
function genParaH(){
  const [hh,xx,b2]=pick([[4,3,5],[3,4,5],[12,5,13],[8,6,10],[6,8,10]]), k=pick([2,3]), b1=k*b2, u=uP(), A=b1*hh, h2=k*hh;
  const P0=[0,0], P1=[b1,0], P3=[xx,hh], P2=[b1+xx,hh];
  const dv=vunit(vsub(P3,P0)), t_=(P1[0]-P0[0])*dv[0]+(P1[1]-P0[1])*dv[1], F=vadd(P0,vmul(dv,t_));
  const svg=figure([P0,P1,P2,P3,F],f=>{
    const a0=f(P0),a1=f(P1),a2=f(P2),a3=f(P3),fF=f(F),ce=cen([a0,a1,a2,a3]);
    let out=g.poly([a0,a1,a2,a3])+g.len(a0,a1,String(b1),ce,10)+g.len(a0,a3,String(b2),ce,10);
    const hf=f([xx,0]); out+=g.seg(a3,hf,'g-dash')+g.right(hf,a3,a1,9)+g.text(vadd(vmid(a3,hf),[10,0]),String(hh),'g-t','start');
    if(t_>vlen(vsub(P3,P0))+0.01) out+=g.seg(a3,fF,'g-dash g-thin');
    out+=g.seg(a1,fF,'g-dash')+g.right(fF,a1,a3,9)+g.text(vadd(vmid(a1,fF),[0,-9]),'?','g-u');
    return out;
  },'Parallélogramme avec ses deux hauteurs',{H:240,pad:34});
  return mkGeo({svg,val:h2,unit:u,text:'Un parallélogramme a un côté de «'+b1+'» '+u+' dont la hauteur correspondante mesure «'+hh+'» '+u+'. Son autre côté mesure «'+b2+'» '+u+'. Calcule la hauteur correspondante à ce côté de «'+b2+'» '+u+'.',ask:'la hauteur cherchée',placeholder:'A = '+b1+' × '+hh+'\nA = b2 × h2',
    work:['A = '+b1+' × '+hh+' = '+A+' '+u+'²','h = '+A+' / '+b2+' = '+h2+' '+u],steps:[stp('Aire','Aire = côté × hauteur correspondante : '+M('A = '+b1+' × '+hh+' = '+A)+' '+u+'².'),stp('Autre hauteur','La même aire s\'écrit avec l\'autre côté : '+M(A+' = '+b2+' × h')+', donc '+M('h = '+A+' / '+b2+' = '+h2)+' '+u)],hints:['L\'aire est la même quel que soit le côté choisi comme base.'],
    mistakes:[{v:hh,tag:'geo-hauteur',msg:'Les deux hauteurs ne sont pas égales : chaque côté a sa hauteur correspondante.',w:['h = '+hh]},{v:b2*hh/b1,tag:'geo-formule',msg:'Tu as inversé le rapport : le plus grand côté a la plus petite hauteur.',w:['h = '+b2+' × '+hh+' / '+b1]},{v:A,tag:'geo-formule',msg:'Tu as calculé l\'aire. Il faut diviser par '+b2+'.',w:['A = '+A]},{v:A/2/b2,tag:'geo-demi',msg:'L\'aire d\'un parallélogramme est côté × hauteur (pas de division par 2).',w:['A = '+b1+' × '+hh+' / 2']}].filter(m=>m.v!==h2)});
}

/* ----- gq-4b : losange, côté et diagonale ----- */
function genLosD(){
  const [p,q,s]=pick([[3,4,5],[4,3,5],[5,12,13],[6,8,10],[8,6,10],[12,5,13]]), u=uP(), D1=2*p, D2=2*q, A=D1*D2/2, ask=pick(['aire','périmètre']);
  const svg=figure([[-p,-q],[p,q]],f=>{
    const L=f([-p,0]),R=f([p,0]),T=f([0,q]),B=f([0,-q]),O=f([0,0]),ce=O;
    return g.poly([L,T,R,B])+g.seg(L,R,'g-dash')+g.seg(T,B,'g-dash')+g.dot(O)+g.len(L,T,String(s),ce,10)+g.text(vadd(f([p/2,0]),[0,-8]),String(D1),'g-t');
  },'Losange avec une diagonale de '+D1+' et un côté de '+s,{H:230,pad:40});
  const txt='Un losange a un côté de «'+s+'» '+u+' et une diagonale de «'+D1+'» '+u+'. ';
  const WQ=['demi-diagonale connue : '+D1+' / 2 = '+p,'demi-diagonale cherchée = √('+s+'² − '+p+'²) = '+q,'autre diagonale = 2 × '+q+' = '+D2];
  if(ask==='aire') return mkGeo({svg,val:A,unit:u,pow:2,text:txt+'Calcule son <b>aire</b> (l\'autre diagonale n\'est pas donnée).',ask:'l\'aire du losange',placeholder:'demi-diagonales...\nA = D × d / 2',
    work:WQ.concat(['A = '+D1+' × '+D2+' / 2 = '+A+' '+u+'²']),steps:[stp('Les diagonales','Elles se coupent à angle droit en leur milieu : un triangle rectangle dont l\'hypoténuse est le côté '+M(s)+' et un côté la demi-diagonale '+M(p)+'.'),stp('Autre demi-diagonale',M('√('+s+'² − '+p+'²) = '+q)+', donc la diagonale vaut '+M(D2)+'.'),stp('Aire',M('A = '+D1+' × '+D2+' / 2 = '+A)+' '+u+'²')],hints:['Les diagonales d\'un losange sont perpendiculaires et se coupent en leur milieu.'],
    mistakes:[{v:D1*s/2,tag:'geo-pyth-cote',msg:'Le côté du losange n\'est pas l\'autre diagonale. Cherche la demi-diagonale avec Pythagore.',w:['A = '+D1+' × '+s+' / 2']},{v:D1*q/2,tag:'geo-formule',msg:'Tu as utilisé la demi-diagonale : l\'autre diagonale vaut '+D2+'.',w:['A = '+D1+' × '+q+' / 2']},{v:D1*D2,tag:'geo-demi',msg:'Aire du losange = D × d / 2.',w:['A = '+D1+' × '+D2]},{v:D1*(s-p)/2,tag:'geo-pyth-somme',msg:'Pythagore : q² = '+s+'² − '+p+'² (pas de soustraction directe).',w:['q = '+s+' − '+p]}].filter(m=>m.v!==A)});
  return mkGeo({svg,val:4*s,unit:u,text:txt+'Calcule son <b>périmètre</b>.',ask:'le périmètre du losange',placeholder:'P = 4 × côté',
    work:['P = 4 × '+s+' = '+4*s+' '+u],steps:[stp('Quatre côtés égaux',M('P = 4 × '+s+' = '+4*s)+' '+u+'. La diagonale n\'est pas nécessaire.')],hints:['Un losange a quatre côtés égaux.'],mistakes:[{v:2*(D1+s),tag:'geo-perim-cote',msg:'Les diagonales ne font pas partie du contour.',w:['P = 2 × ('+D1+' + '+s+')']},{v:2*s,tag:'geo-perim-cote',msg:'Un losange a quatre côtés.',w:['P = 2 × '+s]},{v:4*D1,tag:'geo-perim-cote',msg:'Le côté mesure '+s+' (et non la diagonale).',w:['P = 4 × '+D1]}]});
}

/* ----- gq-5b : trapèze isocèle ----- */
function genTrapIso(){
  const [e,h,s]=pick([[3,4,5],[4,3,5],[6,8,10],[5,12,13],[8,6,10],[9,12,15]]), b=rnd(4,10), B=b+2*e, u=uP(), A=(B+b)*h/2, ask=pick(['aire','périmètre']);
  const svg=figure([[0,0],[B,0],[B-e,h],[e,h]],f=>{
    const p0=f([0,0]),p1=f([B,0]),p2=f([B-e,h]),p3=f([e,h]),ce=cen([p0,p1,p2,p3]);
    return g.poly([p0,p1,p2,p3])+g.text([(p0[0]+p1[0])/2,p0[1]+17],String(B))+g.len(p3,p2,String(b),ce,10)+g.len(p0,p3,String(s),ce,10)+g.len(p1,p2,String(s),ce,10)+g.tick(p0,p3,1)+g.tick(p1,p2,1);
  },'Trapèze isocèle de bases '+B+' et '+b+' et de côtés obliques '+s,{H:220,pad:34});
  const txt='Un trapèze isocèle a pour bases «'+B+'» '+u+' et «'+b+'» '+u+' et pour côtés obliques «'+s+'» '+u+'. ';
  if(ask==='périmètre') return mkGeo({svg,val:B+b+2*s,unit:u,text:txt+'Calcule son <b>périmètre</b>.',ask:'le périmètre',placeholder:'P = B + b + 2 × côté',work:['P = '+B+' + '+b+' + 2 × '+s+' = '+(B+b+2*s)+' '+u],steps:[stp('Les quatre côtés','Les deux côtés obliques sont égaux :',M('P = '+B+' + '+b+' + '+s+' + '+s+' = '+(B+b+2*s))+' '+u)],hints:['Un trapèze isocèle a deux côtés obliques de même longueur.'],mistakes:[{v:B+b+s,tag:'geo-perim-cote',msg:'Il y a deux côtés obliques.',w:['P = '+B+' + '+b+' + '+s]},{v:A,tag:'geo-perim-aire',msg:'Tu as calculé l\'aire.',w:['A = ('+B+' + '+b+') × '+h+' / 2']}].filter(m=>m.v!==B+b+2*s)});
  return mkGeo({svg,val:A,unit:u,pow:2,text:txt+'Calcule son <b>aire</b> (la hauteur n\'est pas donnée).',ask:'l\'aire du trapèze',placeholder:'décalage = (B − b) / 2\nh = √(...)\nA = ...',
    work:['décalage = ('+B+' − '+b+') / 2 = '+e,'h = √('+s+'² − '+e+'²) = '+h,'A = ('+B+' + '+b+') × '+h+' / 2 = '+NF(A)+' '+u+'²'],steps:[stp('Décalage','En traçant les deux hauteurs, il reste deux petits triangles rectangles égaux : leur côté horizontal vaut '+M('('+B+' − '+b+') / 2 = '+e)+'.'),stp('Hauteur',M('h = √('+s+'² − '+e+'²) = '+h)),stp('Aire',M('A = ('+B+' + '+b+') × '+h+' / 2 = '+NF(A))+' '+u+'²')],hints:['Les deux hauteurs découpent le trapèze en un rectangle et deux triangles rectangles identiques.'],
    mistakes:[{v:(B+b)*s/2,tag:'geo-pyth-cote',msg:'Le côté oblique n\'est pas la hauteur : h = √('+s+'² − '+e+'²) = '+h+'.',w:['A = ('+B+' + '+b+') × '+s+' / 2']},{v:(B+b)*h,tag:'geo-demi',msg:'Aire du trapèze = (B + b) × h / 2.',w:['A = ('+B+' + '+b+') × '+h]},{v:(B+b)*Math.sqrt(Math.max(0,s*s-(B-b)*(B-b)))/2,tag:'geo-pyth-cote',msg:'Le décalage vaut (B − b) / 2 = '+e+' de chaque côté (et non B − b).',w:['h = √('+s+'² − '+(B-b)+'²)']},{v:(B+b)*(s-e)/2,tag:'geo-pyth-somme',msg:'Pythagore : h² = '+s+'² − '+e+'².',w:['h = '+s+' − '+e]}].filter(m=>isFinite(m.v)&&m.v>0&&Math.abs(m.v-A)>1e-6)});
}

/* ----- gp-3b : distance entre deux points d'un repère ----- */
function genDistPts(){
  const u=pick(['cm','cm','unités']), useT=Math.random()<0.5;
  let dx,dy; if(useT){ const t=pick(TRIPP); dx=t[0]; dy=t[1]; } else { do{ dx=rnd(1,7); dy=rnd(1,7); }while(dx===dy||dx*dx+dy*dy===25||dx*dx+dy*dy===25); }
  const x1=rnd(0,9-dx>0?Math.min(2,9-dx):0), y1=rnd(0,Math.min(2,9-dy>0?9-dy:0)), x2=x1+dx, y2=y1+dy;
  const n=dx*dx+dy*dy, root=Math.sqrt(n), intg=Number.isInteger(root);
  const xm=Math.max(x2,4)+1, ym=Math.max(y2,4)+1;
  const svg=figure([[-0.8,-0.8],[xm,ym]],f=>{
    let out=g.seg(f([0,0]),f([xm-0.3,0]),'g-l')+g.seg(f([0,0]),f([0,ym-0.3]),'g-l');
    for(let i=1;i<xm-0.4;i++) out+=g.seg(f([i,-0.1]),f([i,0.1]),'g-mark')+g.text(f([i,-0.5]),String(i),'g-t');
    for(let j=1;j<ym-0.4;j++) out+=g.seg(f([-0.1,j]),f([0.1,j]),'g-mark')+g.text(f([-0.5,j]),String(j),'g-t');
    const A=f([x1,y1]),B=f([x2,y2]),C=f([x2,y1]);
    out+=g.seg(A,C,'g-dash g-thin')+g.seg(C,B,'g-dash g-thin')+g.seg(A,B,'g-l')+g.dot(A)+g.dot(B);
    out+=g.text(vadd(A,[-4,14]),'A','g-v','end')+g.text(vadd(B,[10,-8]),'B','g-v','start');
    return out;
  },'Deux points A et B dans un repère',{H:250,pad:30});
  const WW=['Δx = '+x2+' − '+x1+' = '+dx,'Δy = '+y2+' − '+y1+' = '+dy,'AB² = '+dx+'² + '+dy+'² = '+n];
  const ex=intg?String(root):radStr(n);
  const mist=[{v:dx+dy,tag:'geo-pyth-somme',msg:'La distance n\'est pas la somme des écarts : c\'est l\'hypoténuse du triangle rectangle de côtés Δx et Δy.',w:['AB = '+dx+' + '+dy]},{v:n,tag:'geo-racine',msg:'AB² = '+n+' : il faut prendre la racine carrée.',w:WW.concat(['AB = '+n])},{v:Math.sqrt(Math.abs(dx*dx-dy*dy)),tag:'geo-pyth-somme',msg:'Pour la distance, on additionne les carrés des écarts.',w:['AB = √('+dx+'² − '+dy+'²)']}].filter(m=>m.v>0&&Math.abs(m.v-root)>1e-6);
  return mkGeo({svg,mode:intg?'num':'sqrt',exact:ex,val:root,unit:'',pow:1,text:'Dans un repère orthonormé (l\'unité est le '+(u==='unités'?'carreau':u)+'), on donne «A('+x1+' ; '+y1+')» et «B('+x2+' ; '+y2+')». Calcule la distance «AB»'+(intg?'.':', en <b>valeur exacte</b>.'),ask:'la distance AB',placeholder:'Δx = ...\nΔy = ...\nAB = √(...)',
    work:WW.concat(['AB = √'+n+' = '+ex]),steps:[stp('Écarts',M('Δx = '+x2+' − '+x1+' = '+dx)+' et '+M('Δy = '+y2+' − '+y1+' = '+dy)+'.'),stp('Pythagore','AB est l\'hypoténuse du triangle rectangle de côtés '+M(dx)+' et '+M(dy)+' :',M('AB = √('+dx+'² + '+dy+'²) = √'+n+' = '+ex))],hints:['Complète la figure par un triangle rectangle dont AB est l\'hypoténuse.'],mistakes:mist});
}

/* ----- gp-4b : diagonale d'un pavé ----- */
function genDiagPave(){
  const [a,b,c,d]=pick([[1,2,2,3],[2,3,6,7],[4,4,7,9],[2,6,9,11],[6,6,7,11],[3,4,12,13],[4,8,8,12],[2,10,11,15]]), k=a<=2?pick([1,2]):1, A=a*k, B=b*k, C=c*k, D=d*k, u=uP();
  const dims=[[A,'long'],[B,'large'],[C,'haut']];
  const L=Math.max(A,B,C), mx=Math.max(A,B,C), n=x=>Math.max(1.6,4.4*x/mx);
  const dL=n(A), dh=n(C), dd=n(B)*0.8;
  const svg=figure([[0,0],[dL+dd*0.62,dh+dd*0.46]],f=>{
    const bx=drawBox3(f,dL,dh,dd); let out=bx.out;
    out+=g.len(bx.A,bx.B,String(A),bx.ce,10)+g.len(bx.A,bx.D,String(C),bx.ce,10)+g.len(bx.B,bx.B2,String(B),bx.ce,9);
    out+=g.seg(bx.A,bx.C2,'g-l g-dash')+g.dot(bx.A)+g.dot(bx.C2)+g.text(vadd(vmid(bx.A,bx.C2),[0,-11]),'?','g-u');
    return out;
  },'Pavé droit avec sa grande diagonale',{H:240,pad:34});
  const f2=Math.sqrt(A*A+B*B);
  return mkGeo({svg,val:D,unit:u,text:'Un pavé droit mesure «'+A+'» '+u+' de long, «'+B+'» '+u+' de large et «'+C+'» '+u+' de haut. Calcule la longueur de sa <b>grande diagonale</b> (d\'un coin au coin opposé).',ask:'la grande diagonale',placeholder:'diagonale de la base = ...\nD = √(...)',
    work:['d² = '+A+'² + '+B+'² = '+(A*A+B*B),'D² = d² + '+C+'² = '+(A*A+B*B)+' + '+C*C+' = '+D*D,'D = '+D+' '+u],steps:[stp('Diagonale de la base','Triangle rectangle de côtés '+M(A)+' et '+M(B)+' : '+M('d² = '+A+'² + '+B+'² = '+(A*A+B*B))+'.'),stp('Deuxième triangle rectangle','La grande diagonale est l\'hypoténuse d\'un triangle de côtés '+M('d')+' et '+M(C)+' (la hauteur) :',M('D² = '+(A*A+B*B)+' + '+C+'² = '+D*D)+', donc '+M('D = '+D)+' '+u)],hints:['Cherche d\'abord la diagonale de la face du dessous, puis un second triangle rectangle vertical.'],
    mistakes:[{v:A+B+C,tag:'geo-pyth-somme',msg:'La diagonale n\'est pas la somme des trois dimensions.',w:['D = '+A+' + '+B+' + '+C]},{v:f2,tag:'geo-decomp',msg:'C\'est la diagonale de la base. Il manque la hauteur : D² = d² + '+C+'².',w:['D = √('+A+'² + '+B+'²)']},{v:D*D,tag:'geo-racine',msg:'D² = '+D*D+' : prends la racine carrée.',w:['D² = '+D*D]},{v:f2+C,tag:'geo-pyth-somme',msg:'On ne peut pas additionner d et la hauteur : Pythagore une seconde fois.',w:['D = '+NF(Math.round(f2*100)/100)+' + '+C]}].filter(m=>Math.abs(m.v-D)>1e-6)});
}

/* ----- gh-2b : Thalès, ombre et hauteur ----- */
function genOmbre(){
  const [h1,s1]=pick([[2,3],[1.5,2],[2,5],[1,2],[3,4],[1.5,3],[2,4]]), k=pick([3,4,5,6,8]), s2=s1*k, H=h1*k, u='m';
  const objs=pick([['un piquet','un arbre'],['un bâton','un pylône'],['une personne','un immeuble'],['un poteau','un clocher']]);
  const svg=figure([[-0.5,-0.5],[2*s1+s2*0.2+s2+3,H+1]],f=>{ // deux triangles rectangles côte à côte
    const sc=1; const x0=0, x1_=s1+1.6; let out=g.seg(f([-0.3,0]),f([x1_+s2+0.6,0]),'g-l');
    const T=(x,h,s,l1,l2)=>{ const a=f([x,0]),b=f([x,h]),c=f([x+s,0]); return g.poly([a,b,c])+g.right(a,b,c,9)+l1+l2; };
    const t1=(()=>{ const a=f([x0,0]),b=f([x0,h1*(H/H)]),c=f([x0+s1,0]); return g.poly([a,b,c])+g.right(a,b,c,8)+g.text(vadd(vmid(a,b),[-10,0]),NF(h1),'g-t','end')+g.text(vadd(vmid(a,c),[0,15]),NF(s1),'g-t'); })();
    const a2=f([x1_,0]),b2=f([x1_,H]),c2=f([x1_+s2,0]);
    const t2=g.poly([a2,b2,c2])+g.right(a2,b2,c2,8)+g.text(vadd(vmid(a2,b2),[-10,0]),'?','g-u','end')+g.text(vadd(vmid(a2,c2),[0,15]),NF(s2),'g-t');
    return out+t1+t2;
  },'Deux objets verticaux et leurs ombres, formant deux triangles semblables',{H:230,pad:30});
  const val=H;
  return mkGeo({svg,val,unit:u,text:'Au même moment, '+objs[0]+' de «'+NF(h1)+'» m de haut projette une ombre de «'+NF(s1)+'» m, et '+objs[1]+' projette une ombre de «'+NF(s2)+'» m (le sol est plat). Les rayons du soleil sont parallèles. Calcule la hauteur de '+objs[1]+'.',ask:'la hauteur',placeholder:'h1/ombre1 = h2/ombre2',
    work:[NF(h1)+' / '+NF(s1)+' = h / '+NF(s2),'h = '+NF(h1)+' × '+NF(s2)+' / '+NF(s1)+' = '+NF(H)+' m'],steps:[stp('Triangles semblables','Les rayons parallèles font le même angle avec le sol : les deux triangles rectangles sont semblables (Thalès).'),stp('Proportion',M(NF(h1)+' / '+NF(s1)+' = h / '+NF(s2)),M('h = '+NF(h1)+' × '+NF(s2)+' / '+NF(s1)+' = '+NF(H))+' m')],hints:['Hauteur / ombre est le même rapport pour les deux objets.'],
    mistakes:[{v:h1+(s2-s1),tag:'geo-thales-additif',msg:'Les longueurs sont proportionnelles (on multiplie), elles ne s\'additionnent pas.',w:['h = '+NF(h1)+' + ('+NF(s2)+' − '+NF(s1)+')']},{v:h1*s1/s2,tag:'geo-thales-inverse',msg:'Tu as inversé le rapport : le plus grand objet a la plus grande ombre.',w:['h = '+NF(h1)+' × '+NF(s1)+' / '+NF(s2)]},{v:s2,tag:'geo-thales-inverse',msg:'La hauteur n\'est pas égale à la longueur de l\'ombre (sauf soleil à 45°).',w:['h = '+NF(s2)]}].filter(m=>Math.abs(m.v-H)>1e-6)});
}

/* ----- gh-5b : agrandissement, réduction (longueurs, aires) ----- */
function genAgrand(){
  const [p,q]=pick([[3,2],[5,2],[2,1],[3,1],[4,3],[5,3],[5,4]]), m=rnd(1,3), a=q*m, a2=p*m, ask=pick(['aire','périmètre']), u=uP(), n=rnd(1,4), t=rnd(2,5);
  const A1=q*q*n, A2=p*p*n, P1=q*t*3, P2=p*t*3;
  const svg=figure([[0,0],[13,5.2]],f=>{
    const s1=1.2, s2=p/q*1.2; const tri=(x,sc,lab)=>{ const A=f([x,0]),B=f([x+3*sc,0]),C=f([x+0.8*sc,2.4*sc]); return g.poly([A,B,C])+g.text(vadd(vmid(A,B),[0,15]),lab,'g-t'); };
    return tri(0,s1,String(a))+tri(4.6,s2,String(a2));
  },'Deux triangles semblables',{H:200,pad:30});
  const kt=p+'/'+q, base='Un triangle a un côté de «'+a+'» '+u+', une aire de «'+A1+'» '+u+'² et un périmètre de «'+P1+'» '+u+'. On l\'<b>agrandit</b> : le côté correspondant du nouveau triangle mesure «'+a2+'» '+u+'. ';
  if(ask==='aire') return mkGeo({svg,val:A2,unit:u,pow:2,text:base+'Calcule l\'<b>aire</b> du nouveau triangle.',ask:'l\'aire du triangle agrandi',placeholder:'k = '+a2+' / '+a+'\nA\' = A × k²',
    work:['k = '+a2+' / '+a+' = '+kt,'A\' = '+A1+' × ('+kt+')² = '+A2+' '+u+'²'],steps:[stp('Rapport d\'agrandissement',M('k = '+a2+' / '+a+' = '+kt)),stp('Aires','Les longueurs sont multipliées par k, les <b>aires par k²</b> :',M('A\' = '+A1+' × ('+kt+')² = '+A1+' × '+(p*p)+'/'+(q*q)+' = '+A2)+' '+u+'²')],hints:['Dans un agrandissement de rapport k, les aires sont multipliées par k².'],
    mistakes:[{v:A1*p/q,tag:'geo-rapport-aire',msg:'Les aires sont multipliées par k², pas par k.',w:['A\' = '+A1+' × '+kt+' = '+NF(A1*p/q)]},{v:A1+(a2-a),tag:'geo-thales-additif',msg:'Un agrandissement est une multiplication, pas un ajout.',w:['A\' = '+A1+' + ('+a2+' − '+a+')']},{v:A1*a2/a*a2/a*(p/q),tag:'geo-rapport-aire',msg:'Un seul facteur k² suffit.',w:['A\' = '+A1+' × k³']}].filter(m=>Math.abs(m.v-A2)>1e-6)});
  return mkGeo({svg,val:P2,unit:u,text:base+'Calcule le <b>périmètre</b> du nouveau triangle.',ask:'le périmètre du triangle agrandi',placeholder:'k = '+a2+' / '+a+'\nP\' = P × k',
    work:['k = '+a2+' / '+a+' = '+kt,'P\' = '+P1+' × '+kt+' = '+P2+' '+u],steps:[stp('Rapport',M('k = '+a2+' / '+a+' = '+kt)),stp('Périmètre','Les longueurs sont multipliées par k, donc le périmètre aussi :',M('P\' = '+P1+' × '+kt+' = '+P2)+' '+u)],hints:['Le périmètre est une longueur : il est multiplié par k.'],
    mistakes:[{v:P1*p*p/(q*q),tag:'geo-rapport-aire',msg:'Seules les aires sont multipliées par k². Un périmètre est une longueur : × k.',w:['P\' = '+P1+' × ('+kt+')²']},{v:P1+(a2-a),tag:'geo-thales-additif',msg:'Tous les côtés sont multipliés par k : on ne rajoute pas simplement la différence d\'un côté.',w:['P\' = '+P1+' + '+(a2-a)]}].filter(m=>Math.abs(m.v-P2)>1e-6)});
}

/* ----- gc-3b : arc de cercle et secteur ----- */
function genArcSect(){
  const al=pick([30,45,60,90,120,135,150]), r=pick([2,3,4,5,6,8,9,10,12]), u=uP(), ask=pick(['arc','secteur']);
  const svg=figure([[-r,-r*0.3],[r,r]],f=>{
    const O=f([0,0]), R=r*f.s, P=f([r,0]), Q=f([r*Math.cos(al*Math.PI/180),r*Math.sin(al*Math.PI/180)]), M_=f([r*Math.cos(al*Math.PI/360),r*Math.sin(al*Math.PI/360)]);
    let out=g.path(mv(O)+' L'+gf(P[0])+' '+gf(P[1])+arcM(P,Q,M_,R)+' Z','g-f')+g.dot(O);
    const rad=22, u1=[1,0], u2=vunit(vsub(Q,O)), a1=vadd(O,vmul(u1,rad)), a2=vadd(O,vmul(u2,rad)), bs=vunit(vadd(u1,u2)), am=vadd(O,vmul(bs,rad));
    out+='<path class="g-mark" d="M'+gf(a1[0])+' '+gf(a1[1])+arcM(a1,a2,am,rad)+'"/>'+g.text(vadd(O,vmul(bs,rad+(al>100?24:20))),al+'°','g-u');
    out+=g.text(vadd(vmid(O,P),[0,12]),String(r),'g-t');
    return out;
  },'Secteur circulaire de rayon '+r+' et d\'angle '+al+' degrés',{H:230,pad:30});
  const txt='Un secteur circulaire a un rayon de «'+r+'» '+u+' et un angle au centre de «'+al+'°». ';
  const fr=al+'/360';
  if(ask==='arc'){ const exs=fracPiP(al*r,180); return mkGeo({svg,mode:'pi',exact:exs,val:pib(0,al*r/180),unit:u,pow:1,text:txt+'Calcule la longueur de l\'<b>arc</b>. Donne la <b>valeur exacte</b>.',ask:'la longueur de l\'arc (valeur exacte)',placeholder:'arc = '+fr+' × 2π × '+r,
    work:['arc = '+fr+' × 2π × '+r+' = '+exs+' '+u],steps:[stp('Fraction du cercle','L\'angle de '+M(al+'°')+' représente la fraction '+M(fr)+' du tour complet.'),stp('Longueur',M('arc = ('+al+'/360) × 2π × '+r+' = '+exs)+' '+u)],hints:['Longueur du cercle entier : 2πr. L\'arc en est la fraction α/360.'],
    mistakes:[{v:pib(0,al*r*r/360),tag:'geo-arc-secteur',msg:'Tu as calculé l\'aire du secteur (πr²). Pour la longueur de l\'arc, on part de 2πr.',w:['arc = '+fr+' × π × '+r+'²']},{v:pib(0,2*r),tag:'geo-arc-secteur',msg:'C\'est le périmètre du cercle entier : l\'arc n\'en est qu\'une fraction.',w:['arc = 2π × '+r]},{v:pib(0,al*r/360),tag:'geo-arc-secteur',msg:'La longueur du cercle est 2πr (avec le 2).',w:['arc = '+fr+' × π × '+r]},{v:pib(r*2,al*r/180),tag:'geo-perim-cote',msg:'La question demande seulement l\'arc, sans les deux rayons.',w:['arc + 2r']}].filter(m=>Math.abs(m.v.b-al*r/180)>1e-9||m.v.a!==0)}); }
  const exs=fracPiP(al*r*r,360);
  return mkGeo({svg,mode:'pi',exact:exs,val:pib(0,al*r*r/360),unit:u,pow:2,text:txt+'Calcule l\'<b>aire</b> du secteur. Donne la <b>valeur exacte</b>.',ask:'l\'aire du secteur (valeur exacte)',placeholder:'aire = '+fr+' × π × '+r+'²',
    work:['A = '+fr+' × π × '+r+'² = '+exs+' '+u+'²'],steps:[stp('Fraction du disque','L\'angle de '+M(al+'°')+' représente la fraction '+M(fr)+' du disque.'),stp('Aire',M('A = ('+al+'/360) × π × '+r+'² = '+exs)+' '+u+'²')],hints:['Aire du disque entier : πr². Le secteur en est la fraction α/360.'],
    mistakes:[{v:pib(0,al*r/180),tag:'geo-arc-secteur',msg:'Tu as calculé la longueur de l\'arc. L\'aire du secteur est la fraction de πr².',w:['A = '+fr+' × 2π × '+r]},{v:pib(0,r*r),tag:'geo-arc-secteur',msg:'C\'est l\'aire du disque entier. Le secteur en est la fraction '+fr+'.',w:['A = π × '+r+'²']},{v:pib(0,al*r/360),tag:'geo-aire-pi',msg:'Dans l\'aire d\'un disque, le rayon est au carré.',w:['A = '+fr+' × π × '+r]},{v:pib(0,al*r*r/180),tag:'geo-arc-secteur',msg:'Aire du secteur = (α/360) × πr² (et non 2πr²).',w:['A = '+fr+' × 2π × '+r+'²']}].filter(m=>Math.abs(m.v.b-al*r*r/360)>1e-9)});
}

/* ----- gc-4b : corde et distance au centre ----- */
function genCorde(){
  const [p0,d0,r0]=pick([[3,4,5],[4,3,5],[5,12,13],[12,5,13],[6,8,10],[8,6,10]]), k=pick([1,1,2]), p=p0*k, d=d0*k, r=r0*k, c=2*p, u=uP(), ask=pick(['dist','corde']);
  const svg=figure([[-r,-r],[r,r]],f=>{
    const O=f([0,0]), Rr=r*f.s, A=f([-p,d]), B=f([p,d]), M_=f([0,d]);
    let out=g.circle(O,Rr,'g-circle')+g.seg(A,B,'g-l')+g.seg(O,M_,'g-dash')+g.seg(O,A,'g-thin g-dash')+g.dot(O)+g.dot(M_)+g.right(M_,O,B,9)+g.dot(A)+g.dot(B);
    out+=g.text(vadd(O,[8,12]),'O','g-v');
    out+=ask==='dist'?g.len(A,B,String(c),O,12)+g.text(vadd(vmid(O,M_),[-10,0]),'?','g-u','end'):g.len(A,B,'?',O,12,'g-u')+g.text(vadd(vmid(O,M_),[-10,0]),String(d),'g-t','end');
    out+=g.text(vadd(vmid(O,A),[-9,-4]),String(r),'g-t','end');
    return out;
  },'Cercle de rayon '+r+' avec une corde et la distance du centre à la corde',{H:250,pad:36});
  const WQ=['moitié de la corde : '+(ask==='dist'?c+' / 2 = '+p:'?')];
  if(ask==='dist') return mkGeo({svg,val:d,unit:u,text:'Un cercle de centre «O» a un rayon de «'+r+'» '+u+'. Une corde mesure «'+c+'» '+u+'. Calcule la <b>distance</b> du centre «O» à cette corde (perpendiculaire).',ask:'la distance du centre à la corde',placeholder:'demi-corde = ...\nd = √(r² − ...²)',
    work:['demi-corde = '+c+' / 2 = '+p,'d = √('+r+'² − '+p+'²) = √'+(r*r-p*p)+' = '+d+' '+u],steps:[stp('Triangle rectangle','La perpendiculaire du centre à la corde passe par son milieu : triangle rectangle d\'hypoténuse le rayon '+M(r)+' et de côté la demi-corde '+M(c+' / 2 = '+p)+'.'),stp('Pythagore',M('d = √('+r+'² − '+p+'²) = '+d)+' '+u)],hints:['La perpendiculaire menée du centre coupe la corde en son milieu.'],
    mistakes:[{v:Math.sqrt(Math.max(0,r*r-c*c)),tag:'geo-pyth-cote',msg:'C\'est la moitié de la corde ('+p+') qui est dans le triangle rectangle.',w:['d = √('+r+'² − '+c+'²)']},{v:r-p,tag:'geo-pyth-somme',msg:'Pythagore : d² = r² − (demi-corde)², pas d = r − demi-corde.',w:['d = '+r+' − '+p]},{v:Math.sqrt(r*r+p*p),tag:'geo-pyth-cote',msg:'Le rayon est l\'hypoténuse : on soustrait les carrés.',w:['d = √('+r+'² + '+p+'²)']}].filter(m=>m.v>0&&Math.abs(m.v-d)>1e-6)});
  return mkGeo({svg,val:c,unit:u,text:'Un cercle de centre «O» a un rayon de «'+r+'» '+u+'. Une corde est à la distance «'+d+'» '+u+' du centre. Calcule la <b>longueur de la corde</b>.',ask:'la longueur de la corde',placeholder:'demi-corde = √(r² − d²)\ncorde = 2 × ...',
    work:['demi-corde = √('+r+'² − '+d+'²) = '+p,'corde = 2 × '+p+' = '+c+' '+u],steps:[stp('Demi-corde','Triangle rectangle d\'hypoténuse le rayon '+M(r)+' et de côté '+M(d)+' : '+M('√('+r+'² − '+d+'²) = '+p)+'.'),stp('Corde','Le pied de la perpendiculaire est le milieu de la corde :',M('corde = 2 × '+p+' = '+c)+' '+u)],hints:['La demi-corde est un côté de l\'angle droit du triangle rectangle.'],
    mistakes:[{v:p,tag:'geo-decomp',msg:'C\'est la demi-corde : la corde entière vaut le double.',w:['demi-corde = '+p]},{v:2*(r-d),tag:'geo-pyth-somme',msg:'Pythagore : demi-corde² = r² − d².',w:['corde = 2 × ('+r+' − '+d+')']},{v:2*Math.sqrt(r*r+d*d),tag:'geo-pyth-cote',msg:'Le rayon est l\'hypoténuse : demi-corde² = r² − d².',w:['corde = 2 × √('+r+'² + '+d+'²)']}].filter(m=>m.v>0&&Math.abs(m.v-c)>1e-6)});
}

/* ----- gm-3b : couronne circulaire ----- */
function genCouronne(){
  const R=rnd(4,12), r=rnd(1,R-2), u=uP(), ask=pick(['aire','périmètre']), useD=Math.random()<0.4;
  const svg=figure([[-R,-R],[R,R]],f=>{
    const O=f([0,0]); let out=g.circle(O,R*f.s,'g-circle')+g.circle(O,r*f.s,'g-hole')+g.dot(O);
    const e=f([R,0]), e2=f([r*Math.cos(2.2),r*Math.sin(2.2)]);
    const u2=vunit(vsub(e2,O)), lab2=useD?'Ø'+2*r:String(r);
    out+=g.seg(O,e,'g-thin')+g.text(vadd(e,[5,-8]),useD?'Ø'+2*R:String(R),'g-t','start')+g.seg(O,e2,'g-thin');
    out+=g.text(r*f.s>=34?vadd(vmid(O,e2),vmul([-u2[1],u2[0]],-17)):vadd(e2,vmul(u2,13)),lab2,'g-t');
    return out;
  },'Couronne circulaire de rayons '+R+' et '+r,{H:230,pad:46});
  const txt=useD?'Une couronne (anneau) est comprise entre deux cercles de même centre, de diamètres «'+2*R+'» '+u+' et «'+2*r+'» '+u+'. ':'Une couronne (anneau) est comprise entre deux cercles de même centre, de rayons «'+R+'» '+u+' et «'+r+'» '+u+'. ';
  const pre=useD?['R = '+2*R+' / 2 = '+R,'r = '+2*r+' / 2 = '+r]:[];
  if(ask==='aire') return mkGeo({svg,mode:'pi',val:pib(0,R*R-r*r),unit:u,pow:2,text:txt+'Calcule l\'<b>aire</b> de la couronne. Donne la <b>valeur exacte</b>.',ask:'l\'aire (valeur exacte)',placeholder:'grand disque = ...\npetit disque = ...\nA = ...',
    work:pre.concat(['A = π × '+R+'² − π × '+r+'² = '+kPi(R*R)+' − '+kPi(r*r)+' = '+kPi(R*R-r*r)+' '+u+'²']),steps:(useD?[stp('Rayons',M('R = '+2*R+' / 2 = '+R)+' et '+M('r = '+2*r+' / 2 = '+r))]:[]).concat([stp('Grand disque moins petit disque',M('A = πR² − πr² = '+kPi(R*R)+' − '+kPi(r*r)+' = '+kPi(R*R-r*r))+' '+u+'²')]),hints:['Aire de la couronne = aire du grand disque − aire du petit disque.'],
    mistakes:[{v:pib(0,(R-r)*(R-r)),tag:'geo-decomp',msg:'On soustrait les aires (R² − r²), pas les rayons avant de les élever au carré.',w:['A = π × ('+R+' − '+r+')² = '+kPi((R-r)**2)]},{v:pib(0,R*R),tag:'geo-decomp',msg:'Tu n\'as calculé que le grand disque : retire le petit.',w:['A = π × '+R+'²']},{v:pib(0,2*(R-r)),tag:'geo-aire-pi',msg:'Une aire utilise πr² (le rayon au carré), pas 2πr.',w:['A = 2π × ('+R+' − '+r+')']},{v:pib(0,4*(R*R-r*r)),tag:'geo-rayon',msg:'Tu as utilisé les diamètres à la place des rayons.',w:['A = π × '+2*R+'² − π × '+2*r+'²']}].filter(m=>Math.abs(m.v.b-(R*R-r*r))>1e-9)});
  return mkGeo({svg,mode:'pi',val:pib(0,2*(R+r)),unit:u,pow:1,text:txt+'Calcule le <b>périmètre</b> de la couronne (les deux cercles). Donne la <b>valeur exacte</b>.',ask:'le périmètre (valeur exacte)',placeholder:'cercle extérieur = ...\ncercle intérieur = ...\nP = ...',
    work:pre.concat(['P = 2π × '+R+' + 2π × '+r+' = '+kPi(2*R)+' + '+kPi(2*r)+' = '+kPi(2*(R+r))+' '+u]),steps:[stp('Deux cercles','Le bord de la couronne comprend le cercle extérieur et le cercle intérieur.',M('P = 2π × '+R+' + 2π × '+r+' = '+kPi(2*(R+r)))+' '+u)],hints:['Le contour d\'une couronne est formé de deux cercles.'],
    mistakes:[{v:pib(0,2*R),tag:'geo-perim-cote',msg:'Le cercle intérieur fait aussi partie du bord de la couronne.',w:['P = 2π × '+R]},{v:pib(0,2*(R-r)),tag:'geo-perim-cote',msg:'Les deux longueurs de cercle s\'additionnent.',w:['P = 2π × ('+R+' − '+r+')']},{v:pib(0,R*R+r*r),tag:'geo-aire-pi',msg:'πr² donne une aire. La longueur d\'un cercle est 2πr.',w:['P = π × '+R+'² + π × '+r+'²']}].filter(m=>Math.abs(m.v.b-2*(R+r))>1e-9)});
}

/* ----- gm-4b : plaque percée (usinage) ----- */
function genPlaque(){
  const n=pick([2,4]), r=rnd(1,3), W=pick([14,16,18,20,24]), H=pick([10,12,14,16]), u='mm', ask=pick(['aire','périmètre']);
  const holes=n===2?[[W/4,H/2],[3*W/4,H/2]]:[[W/4,H/4],[3*W/4,H/4],[W/4,3*H/4],[3*W/4,3*H/4]];
  const svg=figure([[0,0],[W,H]],f=>{
    const p0=f([0,0]),p1=f([W,0]),p2=f([W,H]),p3=f([0,H]); let out=g.poly([p0,p1,p2,p3]);
    holes.forEach(h=>{ out+=g.circle(f(h),r*f.s,'g-hole'); });
    const h0=f(holes[0]), e=f([holes[0][0]+r,holes[0][1]]); out+=g.dot(h0)+g.seg(h0,e,'g-thin')+g.text(vadd(e,[10,-8]),String(r),'g-t');
    return out+g.text([(p0[0]+p1[0])/2,p0[1]+17],String(W))+g.len(p0,p3,String(H),f([W/2,H/2]),12);
  },'Plaque rectangulaire de '+W+' sur '+H+' avec '+n+' perçages',{H:210,pad:34});
  const txt='Une plaque rectangulaire de «'+W+'» mm sur «'+H+'» mm est percée de «'+n+'» trous circulaires identiques de rayon «'+r+'» mm (entièrement dans la plaque). ';
  if(ask==='aire') return mkGeo({svg,mode:'pi',val:pib(W*H,-n*r*r),unit:u,pow:2,text:txt+'Calcule l\'<b>aire de matière</b> (la surface de la plaque sans les trous). Donne la <b>valeur exacte</b>.',ask:'l\'aire de matière (valeur exacte)',placeholder:'rectangle = ...\ntrous = ...\nA = ...',
    work:['rectangle : '+W+' × '+H+' = '+W*H,'trous : '+n+' × π × '+r+'² = '+kPi(n*r*r),'A = '+W*H+' − '+kPi(n*r*r)+' '+u+'²'],steps:[stp('Rectangle',M(W+' × '+H+' = '+W*H)),stp('Trous',M(n+' × π × '+r+'² = '+kPi(n*r*r))),stp('Matière',M('A = '+W*H+' − '+kPi(n*r*r))+' '+u+'²')],hints:['Aire de matière = rectangle − aire des trous.'],
    mistakes:[{v:pib(W*H,0),tag:'geo-decomp',msg:'Il faut retirer l\'aire des trous.',w:['A = '+W*H]},{v:pib(W*H,-r*r),tag:'geo-decomp',msg:'Il y a '+n+' trous : multiplie par '+n+'.',w:['A = '+W*H+' − '+kPi(r*r)]},{v:pib(W*H,-n*4*r*r),tag:'geo-rayon',msg:'Le rayon vaut '+r+' (et non le diamètre) dans πr².',w:['A = '+W*H+' − '+n+' × π × '+2*r+'²']},{v:pib(W*H,-2*n*r),tag:'geo-aire-pi',msg:'Une aire utilise πr² (pas 2πr).',w:['A = '+W*H+' − '+n+' × 2π × '+r]}].filter(m=>Math.abs(m.v.b+n*r*r)>1e-9)});
  return mkGeo({svg,mode:'pi',val:pib(2*(W+H),2*n*r),unit:u,pow:1,text:txt+'Calcule la longueur totale du <b>contour</b> à usiner : le bord extérieur de la plaque et le bord des trous. Donne la <b>valeur exacte</b>.',ask:'le contour total (valeur exacte)',placeholder:'extérieur = ...\ntrous = ...\nP = ...',
    work:['extérieur : 2 × ('+W+' + '+H+') = '+2*(W+H),'trous : '+n+' × 2π × '+r+' = '+kPi(2*n*r),'P = '+2*(W+H)+' + '+kPi(2*n*r)+' '+u],steps:[stp('Bord extérieur',M('2 × ('+W+' + '+H+') = '+2*(W+H))),stp('Bord des trous',M(n+' × 2π × '+r+' = '+kPi(2*n*r))),stp('Total',M('P = '+2*(W+H)+' + '+kPi(2*n*r))+' '+u)],hints:['Chaque trou ajoute la longueur de son cercle (2πr).'],
    mistakes:[{v:pib(2*(W+H),0),tag:'geo-perim-cote',msg:'Le bord des trous est aussi à usiner.',w:['P = '+2*(W+H)]},{v:pib(2*(W+H),n*r),tag:'geo-perim-cote',msg:'La longueur d\'un cercle est 2πr (avec le 2).',w:['P = '+2*(W+H)+' + '+n+' × π × '+r]},{v:pib(2*(W+H),r*r*n),tag:'geo-aire-pi',msg:'πr² est une aire. La longueur du cercle est 2πr.',w:['P = '+2*(W+H)+' + '+n+' × π × '+r+'²']},{v:pib(2*(W+H),2*r),tag:'geo-decomp',msg:'Il y a '+n+' trous.',w:['P = '+2*(W+H)+' + '+kPi(2*r)]}].filter(m=>Math.abs(m.v.b-2*n*r)>1e-9)});
}

/* ----- gang-3b : polygones réguliers ----- */
function genPolyReg(){
  const n=pick([5,6,8,9,10,12]), ask=pick(['somme','interieur','centre','exterieur']), nm={5:'pentagone',6:'hexagone',8:'octogone',9:'ennéagone',10:'décagone',12:'dodécagone'}[n];
  const svg=figure([[-1.2,-1.2],[1.2,1.2]],f=>{
    const V=[...Array(n)].map((_,i)=>f([Math.cos(Math.PI/2+2*Math.PI*i/n),Math.sin(Math.PI/2+2*Math.PI*i/n)])), O=f([0,0]);
    let out=g.poly(V)+g.seg(O,V[0],'g-dash')+g.seg(O,V[1],'g-dash')+g.dot(O);
    if(ask==='centre'||ask==='exterieur'){ const rad=22, u1=vunit(vsub(V[0],O)), u2=vunit(vsub(V[1],O)), a1=vadd(O,vmul(u1,rad)), a2=vadd(O,vmul(u2,rad)), bs=vunit(vadd(u1,u2)); out+='<path class="g-mark" d="M'+gf(a1[0])+' '+gf(a1[1])+arcM(a1,a2,vadd(O,vmul(bs,rad)),rad)+'"/>'+g.text(vadd(O,vmul(bs,rad+14)),'?','g-u'); }
    if(ask==='interieur'){ const P=V[1], rad=20, u1=vunit(vsub(V[0],P)), u2=vunit(vsub(V[2%n],P)), a1=vadd(P,vmul(u1,rad)), a2=vadd(P,vmul(u2,rad)), bs=vunit(vadd(u1,u2)); out+='<path class="g-mark" d="M'+gf(a1[0])+' '+gf(a1[1])+arcM(a1,a2,vadd(P,vmul(bs,rad)),rad)+'"/>'+g.text(vadd(P,vmul(bs,rad+14)),'?','g-u'); }
    return out;
  },'Polygone régulier à '+n+' côtés',{H:220,pad:26});
  const ex=(n-2)*180, it=ex/n, ce=360/n;
  const T='Un '+nm+' régulier a «'+n+'» côtés égaux et «'+n+'» angles égaux. ';
  if(ask==='somme') return mkGeo({svg,val:ex,unit:'°',text:T+'Calcule la <b>somme</b> de ses angles intérieurs.',ask:'la somme des angles intérieurs',placeholder:'S = (n − 2) × 180°',work:['S = ('+n+' − 2) × 180 = '+ex+'°'],steps:[stp('Découpe en triangles','Depuis un sommet, on trace les diagonales : on obtient '+M(n+' − 2 = '+(n-2))+' triangles, chacun de somme d\'angles 180°.'),stp('Somme',M('S = ('+n+' − 2) × 180 = '+ex)+'°')],hints:['Un polygone à n côtés se découpe en n − 2 triangles.'],mistakes:[{v:n*180,tag:'geo-angle-somme',msg:'Un polygone à n côtés se découpe en n − 2 triangles (pas n).',w:['S = '+n+' × 180']},{v:(n-1)*180,tag:'geo-angle-somme',msg:'Il y a n − 2 triangles, pas n − 1.',w:['S = ('+n+' − 1) × 180']},{v:360,tag:'geo-angle-somme',msg:'360° est la somme des angles d\'un quadrilatère, pas de ce polygone.',w:['S = 360']}].filter(m=>m.v!==ex)});
  if(ask==='interieur') return mkGeo({svg,val:it,unit:'°',text:T+'Calcule l\'<b>angle intérieur</b> en un sommet.',ask:'l\'angle intérieur',placeholder:'somme = ...\nangle = somme / n',work:['somme = ('+n+' − 2) × 180 = '+ex,'angle = '+ex+' / '+n+' = '+it+'°'],steps:[stp('Somme des angles',M('('+n+' − 2) × 180 = '+ex)+'°.'),stp('Un angle','Les '+n+' angles sont égaux :',M(ex+' / '+n+' = '+it)+'°')],hints:['Somme des angles intérieurs = (n − 2) × 180°, à partager entre les n angles égaux.'],mistakes:[{v:ce,tag:'geo-angle-somme',msg:'360 / n est l\'angle au centre, pas l\'angle intérieur au sommet.',w:['angle = 360 / '+n]},{v:ex/(n-2),tag:'geo-angle-somme',msg:'Il faut partager la somme entre les n angles.',w:['angle = '+ex+' / '+(n-2)]},{v:180-it,tag:'geo-angle-somme',msg:'180° − angle intérieur est l\'angle extérieur.',w:['angle = 180 − '+it]}].filter(m=>Math.abs(m.v-it)>1e-9)});
  if(ask==='centre') return mkGeo({svg,val:ce,unit:'°',text:T+'Calcule l\'<b>angle au centre</b> ∠AOB entre deux sommets consécutifs (le centre O est à égale distance de tous les sommets).',ask:'l\'angle au centre',placeholder:'angle = 360 / n',work:['angle = 360 / '+n+' = '+ce+'°'],steps:[stp('Tour complet','Les '+n+' angles au centre sont égaux et leur somme vaut 360° :',M('360 / '+n+' = '+ce)+'°')],hints:['Autour du centre, on fait un tour complet : 360°.'],mistakes:[{v:it,tag:'geo-angle-somme',msg:'C\'est l\'angle intérieur au sommet. L\'angle au centre vaut 360 / n.',w:['angle = '+ex+' / '+n]},{v:180/n,tag:'geo-angle-somme',msg:'Un tour complet vaut 360° (pas 180°).',w:['angle = 180 / '+n]},{v:360/(n-2),tag:'geo-angle-somme',msg:'On divise par le nombre de côtés n.',w:['angle = 360 / '+(n-2)]}].filter(m=>Math.abs(m.v-ce)>1e-9)});
  return mkGeo({svg,val:ce,unit:'°',text:T+'L\'<b>angle extérieur</b> (en prolongeant un côté) est le supplément de l\'angle intérieur. Calcule-le.',ask:'l\'angle extérieur',placeholder:'intérieur = ...\nextérieur = 180 − intérieur',work:['intérieur = '+it+'°','extérieur = 180 − '+it+' = '+ce+'°'],steps:[stp('Angle intérieur',M('(('+n+' − 2) × 180) / '+n+' = '+it)+'°'),stp('Supplément',M('180 − '+it+' = '+ce)+'° (c\'est aussi 360 / n).')],hints:['Intérieur + extérieur = 180°.'],mistakes:[{v:it,tag:'geo-angle-somme',msg:'C\'est l\'angle intérieur. L\'extérieur est son supplément : 180° − intérieur.',w:['extérieur = '+it]},{v:ex,tag:'geo-angle-somme',msg:'La somme des angles intérieurs n\'est pas l\'angle extérieur.',w:['extérieur = '+ex]}].filter(m=>Math.abs(m.v-ce)>1e-9)});
}
TOPICS['gt-3b']={kind:'gtri',level:3,label:'Triangle : valeur manquante',gen:genTriInv};
TOPICS['gt-5b']={kind:'gtri',level:5,label:'Aire avec deux côtés et l\'angle',gen:genTriSin};
TOPICS['gq-3b']={kind:'gquad',level:3,label:'Parallélogramme : deux hauteurs',gen:genParaH};
TOPICS['gq-4b']={kind:'gquad',level:4,label:'Losange : côté et diagonale',gen:genLosD};
TOPICS['gq-5b']={kind:'gquad',level:5,label:'Trapèze isocèle',gen:genTrapIso};
TOPICS['gp-3b']={kind:'gpyth',level:3,label:'Distance dans un repère',gen:genDistPts};
TOPICS['gp-4b']={kind:'gpyth',level:4,label:'Diagonale d\'un pavé',gen:genDiagPave};
TOPICS['gh-2b']={kind:'gthal',level:2,label:'Thalès : ombre et hauteur',gen:genOmbre};
TOPICS['gh-5b']={kind:'gthal',level:5,label:'Agrandissement et réduction',gen:genAgrand};
TOPICS['gc-3b']={kind:'gcirc',level:3,label:'Arc de cercle et secteur',gen:genArcSect};
TOPICS['gc-4b']={kind:'gcirc',level:4,label:'Corde et distance au centre',gen:genCorde};
TOPICS['gm-3b']={kind:'gcomp',level:3,label:'Couronne circulaire',gen:genCouronne};
TOPICS['gm-4b']={kind:'gcomp',level:4,label:'Plaque percée (usinage)',gen:genPlaque};
TOPICS['gang-3b']={kind:'gang',level:3,label:'Polygones réguliers : angles',gen:genPolyReg};

/* ===== Figures composées inspirées d'exercices de synthèse (vague, parallèles, billard, tunnel, pavage, parallélogramme, allumettes, médianes) ===== */
Object.assign(TAGS,{
  'geo-compensation':{label:'Parties qui se compensent',tip:'Quand une partie est ajoutée d\'un côté et retirée de l\'autre avec la même forme, les aires s\'annulent : on peut déplacer mentalement un morceau pour retrouver une figure simple.'},
  'geo-rebond':{label:'Rebond : angles égaux',tip:'À la bande, l\'angle d\'arrivée est égal à l\'angle de départ. Les deux triangles rectangles formés sont semblables : leurs côtés sont proportionnels.'},
  'geo-corde-tangente':{label:'Corde tangente au petit cercle',tip:'Si la corde est tangente au petit cercle, le rayon du petit cercle est perpendiculaire à la corde et la coupe en son milieu. Le triangle rectangle utilise la <b>moitié</b> de la corde.'},
  'geo-mediane':{label:'Médianes d\'un triangle',tip:'Les trois médianes se coupent en un point G (centre de gravité). G est situé aux 2/3 de chaque médiane en partant du sommet, donc au 1/3 en partant du milieu du côté.'},
  'geo-allumettes':{label:'Allumettes : triangles isocèles',tip:'Chaque allumette ferme un triangle isocèle : l\'angle avec la demi-droite augmente de α à chaque allumette (α, 2α, 3α…).'}
});
const thickQ=s=>s.replace('/>',' style="stroke-width:3.4"/>');

/* ----- gm-7a : vague, lentille, carré moins quart de disque ----- */
function genVagueQ(){
  const t=pick(['vague','lentille','carre']), u=uP();
  if(t==='vague'){
    const k=rnd(2,5), W=4*k, Hh=2*k, A=W*k;
    const svg=figure([[0,0],[W,Hh]],f=>{
      const p=(x,y)=>f([x,y]), R=k*f.s, P0=p(0,0), P1=p(W,0), P2=p(W,k), P3=p(2*k,k), P4=p(0,k), ctr=p(W/2,k);
      let out=g.poly([P0,P1,p(W,Hh),p(0,Hh)]);
      out+=g.path(mv(P0)+LQ(P1)+LQ(P2)+arcM(P2,P3,p(3*k,0),R)+arcM(P3,P4,p(k,2*k),R)+' Z','g-f g-hl');
      out+=g.len(P0,P1,String(W),ctr,10)+g.len(P1,p(W,Hh),String(Hh),ctr,10);
      return out;
    },'Rectangle partagé par une courbe formée de deux demi-cercles',{H:200,pad:34});
    return mkGeo({svg,val:A,unit:u,pow:2,text:'Un rectangle mesure «'+W+'» '+u+' sur «'+Hh+'» '+u+'. La courbe qui le traverse est formée de deux demi-cercles de diamètre «'+Hh+'» '+u+' : l\'un bombe vers le haut, l\'autre vers le bas. Calcule l\'aire de la partie grisée, sous la courbe.',ask:'l\'aire grisée',placeholder:'demi-disque en plus = ...\ndemi-disque en moins = ...\nA = ...',
      work:['Le demi-disque ajouté en haut et le demi-disque retiré en bas sont identiques (rayon '+k+').','A = moitié du rectangle = '+W+' × '+k+' = '+A+' '+u+'²'],
      steps:[stp('Observer','La partie grisée = la moitié inférieure du rectangle ('+M(W+' × '+k)+'), <b>plus</b> un demi-disque en haut, <b>moins</b> un demi-disque en bas.'),stp('Compenser','Les deux demi-disques ont le même rayon '+M(k)+' : ils s\'annulent, il n\'y a pas de π.',M('A = '+W+' × '+k+' = '+A)+' '+u+'².')],hints:['Compare le demi-disque ajouté et le demi-disque retiré : sont-ils égaux ?'],
      mistakes:[{v:{a:A,b:k*k/2},tag:'geo-compensation',msg:'Le demi-disque du bas est retiré : il compense celui du haut.',w:['A = '+W+' × '+k+' + π × '+k+'² / 2']},{v:{a:A,b:-k*k/2},tag:'geo-compensation',msg:'Le demi-disque du haut est ajouté : il compense celui du bas.',w:['A = '+W+' × '+k+' − π × '+k+'² / 2']},{v:W*Hh,tag:'geo-decomp',msg:'Tu as pris tout le rectangle : la partie grisée n\'en est que la moitié.',w:['A = '+W+' × '+Hh]}]});
  }
  const a=pick([2,4,6,8,10]);
  const mid1=[a*Math.SQRT1_2,a*Math.SQRT1_2], mid2=[a-a*Math.SQRT1_2,a-a*Math.SQRT1_2];
  if(t==='lentille'){
    const ex=(a*a/2)+'π − '+(a*a);
    const svg=figure([[0,0],[a,a]],f=>{
      const p=(x,y)=>f([x,y]), R=a*f.s, A_=p(0,0), B_=p(a,0), C_=p(a,a), D_=p(0,a), ctr=p(a/2,a/2);
      let out=g.poly([A_,B_,C_,D_])+g.path(mv(B_)+arcM(B_,D_,p(mid1[0],mid1[1]),R)+arcM(D_,B_,p(mid2[0],mid2[1]),R)+' Z','g-f g-hl');
      out+=g.dot(A_)+g.dot(C_)+g.vert(A_,'A',ctr,13)+g.vert(B_,'B',ctr,13)+g.vert(C_,'C',ctr,13)+g.vert(D_,'D',ctr,13)+g.len(A_,B_,String(a),ctr,10);
      return out;
    },'Carré ABCD et deux quarts de cercle de centres A et C formant une lentille',{H:230,pad:36});
    return mkGeo({svg,mode:'pi',exact:ex,val:{a:-a*a,b:a*a/2},unit:u,pow:2,text:'ABCD est un carré de côté «'+a+'» '+u+'. Un arc de cercle de centre A passe par B et D ; un arc de cercle de centre C passe aussi par B et D. Calcule l\'aire de la <b>lentille</b> grisée. Donne la <b>valeur exacte</b>.',ask:'l\'aire de la lentille (valeur exacte)',placeholder:'quart de disque = ...\ncarré = ...\nA = 2 × quart − carré',
      work:['quart de disque = π × '+a+'² / 4 = '+(a*a/4)+'π','A = 2 × '+(a*a/4)+'π − '+a+'² = '+ex+' '+u+'²'],
      steps:[stp('Deux quarts de disque','Chaque arc délimite un quart de disque de rayon '+M(a)+' : '+M('π × '+a+'² / 4 = '+(a*a/4)+'π')+'.'),stp('Le carré est compté deux fois','Les deux quarts de disque recouvrent le carré, et la lentille est la partie comptée <b>deux fois</b> :',M('A = 2 × '+(a*a/4)+'π − '+a+'² = '+ex)+' '+u+'².')],hints:['Additionne les deux quarts de disque : tu recouvres le carré, et la lentille est comptée deux fois.'],
      mistakes:[{v:{a:0,b:a*a/2},tag:'geo-decomp',msg:'Les deux quarts de disque recouvrent aussi le carré : il faut retirer son aire.',w:['A = 2 × π × '+a+'² / 4']},{v:{a:-a*a,b:a*a/4},tag:'geo-arc-secteur',msg:'Il y a deux quarts de disque (un par arc), pas un seul.',w:['A = π × '+a+'² / 4 − '+a+'²']},{v:{a:-a*a,b:a*a},tag:'geo-arc-secteur',msg:'Deux quarts de disque font un demi-disque (πr²/2), pas un disque entier.',w:['A = π × '+a+'² − '+a+'²']},{v:{a:a*a,b:-a*a/2},tag:'geo-decomp',msg:'Le résultat est positif : (deux quarts de disque) − carré.',w:['A = '+a+'² − 2 × π × '+a+'² / 4']}]});
  }
  const ex=a*a+' − '+(a*a/4)+'π';
  const svg=figure([[0,0],[a,a]],f=>{
    const p=(x,y)=>f([x,y]), R=a*f.s, A_=p(0,0), B_=p(a,0), C_=p(a,a), D_=p(0,a), ctr=p(a/2,a/2);
    let out=g.poly([A_,B_,C_,D_])+g.path(mv(B_)+arcM(B_,D_,p(mid1[0],mid1[1]),R)+LQ(C_)+' Z','g-f g-hl');
    out+=g.dot(A_)+g.vert(A_,'A',ctr,13)+g.vert(B_,'B',ctr,13)+g.vert(C_,'C',ctr,13)+g.vert(D_,'D',ctr,13)+g.len(A_,B_,String(a),ctr,10);
    return out;
  },'Carré ABCD avec un quart de disque de centre A',{H:230,pad:36});
  return mkGeo({svg,mode:'pi',exact:ex,val:{a:a*a,b:-a*a/4},unit:u,pow:2,text:'ABCD est un carré de côté «'+a+'» '+u+'. L\'arc de cercle de centre A passe par B et D. Calcule l\'aire de la partie <b>grisée</b>, entre l\'arc et le sommet C. Donne la <b>valeur exacte</b>.',ask:'l\'aire grisée (valeur exacte)',placeholder:'carré = ...\nquart de disque = ...\nA = carré − quart',
    work:['carré = '+a+'² = '+(a*a),'quart de disque = π × '+a+'² / 4 = '+(a*a/4)+'π','A = '+ex+' '+u+'²'],
    steps:[stp('Carré et quart de disque',M(a+'² = '+(a*a))+' et '+M('π × '+a+'² / 4 = '+(a*a/4)+'π')+'.'),stp('Soustraire','La partie grisée est le carré privé du quart de disque :',M('A = '+ex)+' '+u+'².')],hints:['Aire grisée = aire du carré − aire du quart de disque de rayon '+a+'.'],
    mistakes:[{v:{a:0,b:a*a/4},tag:'geo-decomp',msg:'C\'est l\'aire du quart de disque, pas de la partie grisée.',w:['A = π × '+a+'² / 4']},{v:{a:a*a,b:-a*a/2},tag:'geo-arc-secteur',msg:'Un quart de disque vaut πr²/4 (pas πr²/2).',w:['A = '+a+'² − π × '+a+'² / 2']},{v:{a:a*a,b:-a*a},tag:'geo-arc-secteur',msg:'L\'arc ne découpe qu\'un quart de disque, pas le disque entier.',w:['A = '+a+'² − π × '+a+'²']},{v:{a:-a*a,b:a*a/4},tag:'geo-decomp',msg:'Le résultat est positif : carré − quart de disque.',w:['A = π × '+a+'² / 4 − '+a+'²']}]});
}

/* ----- gm-7b : droites parallèles et papillon (Thalès) ----- */
function genPapillonQ(){
  const [p,q]=pick([[2,3],[3,2],[1,2],[2,1],[3,4],[4,3],[3,5],[5,3],[4,5],[5,4]]), k=p/q, u=uP(), ask=pick(['x','y']);
  let m,n,tt; do{ m=rnd(1,4); n=rnd(1,4); tt=rnd(1,4); }while(!(m+n>tt&&m+tt>n&&n+tt>m));
  const OA=q*m, OD=p*m, OB=q*n, OC=p*n, AB=q*tt, CD=p*tt;
  const ax=-(0.9+Math.random()*0.6), bx=0.7+Math.random()*0.6;
  const A=[ax,1], B=[bx,1], D=[-k*ax,-k], C=[-k*bx,-k], O=[0,0];
  const svg=figure([A,B,C,D,[ax-0.5,1],[bx+0.5,1],[-k*bx-0.5,-k],[-k*ax+0.5,-k]],f=>{
    const a=f(A),b=f(B),c=f(C),d=f(D),o=f(O), cx=cen([a,b,c,d]);
    const x1=Math.min(a[0],b[0])-22, x2=Math.max(a[0],b[0])+22, y1=a[1], x3=Math.min(c[0],d[0])-22, x4=Math.max(c[0],d[0])+22, y2=c[1];
    let out=g.seg([x1,y1],[x2,y1],'g-thin')+g.seg([x3,y2],[x4,y2],'g-thin')+g.text([x2+3,y1-11],'d1','g-t','start')+g.text([x4+3,y2+11],'d2','g-t','start');
    out+=g.seg(a,d,'')+g.seg(b,c,'')+g.seg(a,b,'')+g.seg(c,d,'')+g.par(a,b,1)+g.par(c,d,1);
    out+=g.dot(a)+g.dot(b)+g.dot(c)+g.dot(d)+g.dot(o);
    out+=g.vert(a,'A',o,13)+g.vert(b,'B',o,13)+g.vert(c,'C',o,13)+g.vert(d,'D',o,13)+g.text(vadd(o,[11,-1]),'O','g-v','start');
    out+=g.len(o,a,String(OA),b,9)+g.len(o,d,String(OD),c,9);
    if(ask==='x'){ out+=g.len(o,b,String(OB),a,9)+g.len(o,c,'?',d,9,'g-u'); }
    else { out+=g.len(a,b,String(AB),o,8)+g.len(c,d,'?',o,8,'g-u'); }
    return out;
  },'Deux droites parallèles coupées par deux droites sécantes en O (configuration en papillon)',{H:250,pad:40});
  const kt=p+'/'+q, base='Les droites (d1) et (d2) sont <b>parallèles</b>. Les droites (AD) et (BC) se coupent en O, avec A et B sur (d1), C et D sur (d2). ';
  if(ask==='x') return mkGeo({svg,val:OC,unit:u,text:base+'On a OA = «'+OA+'» '+u+', OD = «'+OD+'» '+u+' et OB = «'+OB+'» '+u+'. Calcule OC.',ask:'OC',placeholder:'OD / OA = OC / OB',
    work:['OD / OA = OC / OB','OC = '+OD+' × '+OB+' / '+OA+' = '+OC+' '+u],steps:[stp('Thalès (papillon)','Comme (AB) ∥ (CD), les triangles OAB et ODC ont des côtés proportionnels :',M('OD / OA = OC / OB')),stp('Calcul',M('OC = '+OD+' × '+OB+' / '+OA+' = '+OC)+' '+u)],hints:['Associe bien OD avec OA, et OC avec OB : le rapport est le même.'],
    mistakes:[{v:OB+(OD-OA),tag:'geo-thales-additif',msg:'Les longueurs sont proportionnelles (on multiplie), elles ne s\'additionnent pas.',w:['OC = '+OB+' + ('+OD+' − '+OA+')']},{v:OB*OA/OD,tag:'geo-thales-inverse',msg:'Tu as inversé le rapport : OC et OD sont du même côté.',w:['OC = '+OB+' × '+OA+' / '+OD]},{v:OD*OA/OB,tag:'geo-thales-inverse',msg:'OC est associé à OB, pas à OA.',w:['OC = '+OD+' × '+OA+' / '+OB]}].filter(m_=>Math.abs(m_.v-OC)>1e-6)});
  return mkGeo({svg,val:CD,unit:u,text:base+'On a OA = «'+OA+'» '+u+', OD = «'+OD+'» '+u+' et AB = «'+AB+'» '+u+'. Calcule CD.',ask:'CD',placeholder:'OD / OA = CD / AB',
    work:['OD / OA = CD / AB','CD = '+OD+' × '+AB+' / '+OA+' = '+CD+' '+u],steps:[stp('Thalès (papillon)','Comme (AB) ∥ (CD), le rapport des longueurs est le même :',M('OD / OA = CD / AB')),stp('Calcul',M('CD = '+OD+' × '+AB+' / '+OA+' = '+CD)+' '+u)],hints:['Le rapport OD / OA est le même que CD / AB.'],
    mistakes:[{v:AB+(OD-OA),tag:'geo-thales-additif',msg:'Les longueurs sont proportionnelles (on multiplie), elles ne s\'additionnent pas.',w:['CD = '+AB+' + ('+OD+' − '+OA+')']},{v:AB*OA/OD,tag:'geo-thales-inverse',msg:'Tu as inversé le rapport : CD et OD sont du même côté.',w:['CD = '+AB+' × '+OA+' / '+OD]},{v:OD,tag:'geo-thales-inverse',msg:'CD n\'est pas égal à OD : calcule le rapport OD / OA et applique-le à AB.',w:['CD = '+OD]}].filter(m_=>Math.abs(m_.v-CD)>1e-6)});
}

/* ----- gm-7c : billard, rebond sur la bande ----- */
function genBillardQ(){
  let p,q; do{ p=rnd(1,5); q=rnd(1,5); }while(p===q);
  const s=p+q, mm=s<=5?2:((s<=8&&Math.random()<0.4)?2:1), a=10*p, b=10*q, D=10*s*mm, x=10*p*mm, Ht=Math.max(a,b)*1.25+10, e=0.09*D;
  const svg=figure([[-e,0],[D+e,Ht],[0,-Ht*0.55]],f=>{
    const Hf=f([0,0]), Kf=f([D,0]), Pf=f([x,0]), Af=f([0,a]), Bf=f([D,b]), tl=f([-e,Ht]), tr=f([D+e,Ht]), bl=f([-e,0]), br=f([D+e,0]), ctr=f([D/2,a/2]);
    let out=g.poly([bl,br,tr,tl])+g.seg(bl,br,'').replace('/>',' style="stroke-width:3.6"/>');
    out+=g.seg(Hf,Af,'g-dash')+g.seg(Kf,Bf,'g-dash')+thickQ(g.seg(Af,Pf,''))+thickQ(g.seg(Pf,Bf,''));
    out+=g.right(Hf,Af,Pf,8)+g.right(Kf,Bf,Pf,8)+g.arc(Pf,Af,Hf,15)+g.arc(Pf,Af,Hf,19)+g.arc(Pf,Bf,Kf,15)+g.arc(Pf,Bf,Kf,19);
    out+=g.dot(Pf)+g.dot(Af)+g.dot(Bf)+g.text(vadd(Af,[0,-12]),'A','g-v')+g.text(vadd(Bf,[0,-12]),'B','g-v')+g.text(vadd(Hf,[-9,12]),'H','g-v')+g.text(vadd(Kf,[9,12]),'K','g-v')+g.text(vadd(Pf,[0,13]),'P','g-v');
    out+=g.text(vadd(vmid(Hf,Af),[-9,0]),String(a),'g-t','end')+g.text(vadd(vmid(Kf,Bf),[9,0]),String(b),'g-t','start');
    out+=g.dim(Hf,Pf,'x',Af,30,'g-u')+g.dim(Hf,Kf,String(D),Af,52);
    return out;
  },'Table de billard : une bille rebondit sur la bande en P',{H:240,pad:26});
  const u='cm';
  return mkGeo({svg,val:x,unit:u,text:'Sur une table de billard, la bille A est à «'+a+'» cm de la bande du bas ; la bille B est à «'+b+'» cm de cette même bande. H et K sont les pieds des perpendiculaires à la bande issues de A et de B, avec HK = «'+D+'» cm. La bille A part, touche la bande en P, puis atteint B : à la bande, l\'angle d\'arrivée est égal à l\'angle de départ. Calcule x = HP.',ask:'x = HP',placeholder:'x / (D − x) = a / b',
    work:['Triangles AHP et BKP semblables : HP / KP = AH / BK','x / ('+D+' − x) = '+a+' / '+b,x+' = '+D+' × '+a+' / ('+a+' + '+b+') = '+x+' cm'].slice(0,3),
    steps:[stp('Triangles semblables','Les triangles AHP et BKP ont un angle droit et des angles égaux en P (rebond) : ils sont semblables.'),stp('Proportion',M('HP / KP = AH / BK')+', soit '+M('x / ('+D+' − x) = '+a+' / '+b)+'.'),stp('Résoudre',M(b+'x = '+a+'('+D+' − x)')+', donc '+M('x = '+D+' × '+a+' / ('+a+' + '+b+') = '+x)+' cm.')],hints:['Les deux triangles rectangles sont semblables : HP / KP = AH / BK, avec KP = HK − x.'],
    mistakes:[{v:D/2,tag:'geo-rebond',msg:'P n\'est le milieu que si les deux billes sont à la même distance de la bande.',w:['x = '+D+' / 2']},{v:D*b/(a+b),tag:'geo-thales-inverse',msg:'Tu as inversé le rapport : P est plus proche de la bille la plus proche de la bande.',w:['x = '+D+' × '+b+' / ('+a+' + '+b+')']},{v:D*a/b,tag:'geo-thales-inverse',msg:'Le rapport est a / (a + b), car x + (D − x) = D.',w:['x = '+D+' × '+a+' / '+b]},{v:a,tag:'geo-rebond',msg:'x n\'est pas égal à la distance AH : il faut utiliser la proportionnalité des triangles.',w:['x = '+a]}].filter(m_=>Math.abs(m_.v-x)>1e-6)});
}

/* ----- gm-7d : tunnel à voûte semi-circulaire ----- */
function genTunnelQ(){
  const [R,hw,h]=pick([[5,3,4],[5,4,3],[10,6,8],[10,8,6],[13,5,12],[13,12,5],[6.5,2.5,6],[6.5,6,2.5],[7.5,4.5,6],[7.5,6,4.5]]), w=2*hw, e=R-hw, v=pick(['larg','marge']);
  const svg=figure([[-R,0],[R,R]],f=>{
    const O=f([0,0]), Rp=R*f.s, L0=f([-R,0]), R0=f([R,0]), top=f([0,R]), v0=f([-hw,0]), v1=f([hw,0]), v2=f([hw,h]), v3=f([-hw,h]), ctr=f([0,h]);
    let out=g.path(mv(L0)+arcM(L0,R0,top,Rp)+' Z','g-f')+g.poly([v0,v1,v2,v3],'g-hl')+g.seg(O,v2,'g-dash')+g.dot(O);
    const u1=vunit(vsub(v2,O)), mid=vmid(O,v2), nr=vmul(vperp(u1),11);
    out+=g.text(vadd(vadd(O,vmul(vsub(v2,O),0.55)),nr),String(R),'g-t');
    out+=g.text(f([-hw*0.45,h*0.55]),'h = ?','g-u');
    out+=v==='larg'?g.dim(v0,v1,String(w),ctr,20):g.dim(L0,v0,String(NF(e)),ctr,20);
    return out;
  },'Tunnel à voûte semi-circulaire et véhicule rectangulaire',{H:230,pad:36});
  const txt='La section d\'un tunnel est formée d\'un sol plat et d\'une voûte en demi-cercle de rayon «'+NF(R)+'» m. Un véhicule de section rectangulaire roule au centre ; il passe <b>tout juste</b> : ses deux coins supérieurs touchent la voûte. ';
  const q1=v==='larg'?'Sa largeur est de «'+NF(w)+'» m. Calcule sa hauteur maximale h.':'Il reste «'+NF(e)+'» m entre chaque côté du véhicule et la paroi, au niveau du sol. Calcule sa hauteur maximale h.';
  const pre=v==='larg'?[]:['demi-largeur = '+NF(R)+' − '+NF(e)+' = '+NF(hw)];
  const mis=[{v:R-hw,tag:'geo-pyth-cote',msg:'Tu as soustrait les longueurs au lieu d\'utiliser Pythagore.',w:['h = '+NF(R)+' − '+NF(hw)]},{v:Math.sqrt(R*R+hw*hw),tag:'geo-pyth-cote',msg:'Le rayon R est l\'hypoténuse : h² = R² − (demi-largeur)², pas une somme.',w:['h = √('+NF(R)+'² + '+NF(hw)+'²)']},{v:R,tag:'geo-pyth-cote',msg:'La hauteur de la voûte au centre vaut R, mais le véhicule touche la voûte sur les côtés, plus bas.',w:['h = '+NF(R)]}];
  if(v==='larg') mis.push({v:Math.sqrt(R*R-w*w),tag:'geo-racine',msg:'Dans le triangle rectangle, le côté horizontal est la <b>moitié</b> de la largeur.',w:['h = √('+NF(R)+'² − '+NF(w)+'²)']});
  else mis.push({v:Math.sqrt(R*R-e*e),tag:'geo-racine',msg:'Le côté horizontal est la demi-largeur du véhicule, R − '+NF(e)+', pas la marge.',w:['h = √('+NF(R)+'² − '+NF(e)+'²)']});
  return mkGeo({svg,val:h,unit:'m',text:txt+q1,ask:'la hauteur h',placeholder:'demi-largeur = ...\nh² + demi-largeur² = R²',
    work:pre.concat(['h² = '+NF(R)+'² − '+NF(hw)+'² = '+NF(R*R-hw*hw),'h = √'+NF(R*R-hw*hw)+' = '+NF(h)+' m']),
    steps:(v==='larg'?[stp('Demi-largeur',M(NF(w)+' / 2 = '+NF(hw)))]:[stp('Demi-largeur',M(NF(R)+' − '+NF(e)+' = '+NF(hw)))]).concat([stp('Pythagore','Le centre du sol O, le coin du véhicule et sa projection sur le sol forment un triangle rectangle d\'hypoténuse '+M('R = '+NF(R))+'.',M('h² = '+NF(R)+'² − '+NF(hw)+'² = '+NF(R*R-hw*hw))),stp('Racine',M('h = √'+NF(R*R-hw*hw)+' = '+NF(h))+' m')]),
    hints:['Trace le rayon jusqu\'au coin du véhicule : il forme un triangle rectangle avec la demi-largeur et la hauteur.'],mistakes:mis.filter(m_=>Math.abs(m_.v-h)>1e-6)});
}

/* ----- gm-7e : surface pavée (corde tangente au petit cercle) ----- */
function genPaveeQ(){
  const ask=pick(['aire','aire','rayon']), u=pick(['m','m','cm']);
  if(ask==='aire'){
    const hh=pick([3,4,5,6,8,10,12,15]), c=2*hh, r0=hh*0.7, R0=Math.sqrt(r0*r0+hh*hh);
    const svg=figure([[-R0,-R0],[R0,R0]],f=>{
      const O=f([0,0]), A=f([-hh,r0]), B=f([hh,r0]), Mp=f([0,r0]);
      let out=g.circle(O,R0*f.s,'g-circle')+g.circle(O,r0*f.s,'g-hole')+g.seg(A,B,'')+g.seg(O,Mp,'g-dash')+g.right(Mp,O,B,8)+g.dot(O)+g.dot(Mp)+g.dot(A)+g.dot(B);
      out+=g.text(vadd(O,[9,10]),'O','g-v')+g.text(vadd(Mp,[0,-12]),'M','g-v')+g.len(A,B,String(c),O,32)+g.text(vadd(A,[-10,-10]),'A','g-v')+g.text(vadd(B,[10,-10]),'B','g-v');
      return out;
    },'Anneau et corde du grand cercle tangente au petit cercle',{H:240,pad:36});
    return mkGeo({svg,mode:'pi',val:{a:0,b:hh*hh},unit:u,pow:2,text:'Une allée circulaire est comprise entre deux cercles de même centre O. La corde [AB] du grand cercle mesure «'+c+'» '+u+' et elle est <b>tangente</b> au petit cercle en M. Calcule l\'aire de l\'allée (la couronne). Donne la <b>valeur exacte</b>.',ask:'l\'aire de la couronne (valeur exacte)',placeholder:'AM = ...\nR² − r² = AM²\nA = π(R² − r²)',
      work:['M est le milieu de [AB] : AM = '+c+' / 2 = '+hh,'Dans OMA : R² = r² + AM², donc R² − r² = '+hh+'² = '+(hh*hh),'A = π(R² − r²) = '+(hh*hh)+'π '+u+'²'],
      steps:[stp('Demi-corde','La corde est tangente au petit cercle : '+M('OM ⊥ AB')+' et M est le milieu de [AB]. '+M('AM = '+c+' / 2 = '+hh)),stp('Pythagore dans OMA',M('OA² = OM² + AM²')+', c\'est-à-dire '+M('R² = r² + '+hh+'²')+', donc '+M('R² − r² = '+(hh*hh))+'. (On ne connaît ni R ni r, mais on n\'en a pas besoin.)'),stp('Aire de la couronne',M('A = πR² − πr² = π(R² − r²) = '+(hh*hh)+'π')+' '+u+'².')],hints:['Trace OA et OM : le triangle OMA est rectangle en M. Que vaut R² − r² ?'],
      mistakes:[{v:{a:0,b:c*c},tag:'geo-corde-tangente',msg:'Dans le triangle rectangle, on utilise la <b>moitié</b> de la corde (AM), pas la corde entière.',w:['A = π × '+c+'²']},{v:{a:0,b:hh},tag:'geo-aire-pi',msg:'Une aire donne un carré : R² − r² = AM² = '+(hh*hh)+', et non AM.',w:['A = π × '+hh]},{v:{a:0,b:2*hh},tag:'geo-aire-pi',msg:'Ce n\'est pas un périmètre : l\'aire de la couronne est π(R² − r²) = π × AM².',w:['A = π × '+c]},{v:{a:0,b:hh*hh/4},tag:'geo-corde-tangente',msg:'AM = '+hh+' (moitié de la corde) et on le met au carré : '+(hh*hh)+'.',w:['A = π × ('+hh+' / 2)²']}]});
  }
  const [r,hh,R]=pick([[3,4,5],[5,12,13],[6,8,10],[8,6,10],[12,5,13],[9,12,15],[4,3,5]]), c=2*hh;
  const rd=r*0.55*1.0, hd=hh*0.55, Rd=Math.sqrt(rd*rd+hd*hd);
  const svg=figure([[-Rd,-Rd],[Rd,Rd]],f=>{
    const O=f([0,0]), A=f([-hd,rd]), B=f([hd,rd]), Mp=f([0,rd]);
    let out=g.circle(O,Rd*f.s,'g-circle')+g.circle(O,rd*f.s,'g-hole')+g.seg(A,B,'')+g.seg(O,Mp,'g-dash')+g.seg(O,A,'g-dash')+g.right(Mp,O,B,8)+g.dot(O)+g.dot(Mp)+g.dot(A)+g.dot(B);
    out+=g.text(vadd(O,[9,10]),'O','g-v')+g.text(vadd(Mp,[0,-12]),'M','g-v')+g.len(A,B,String(c),O,32)+g.text(vadd(vmid(O,Mp),[9,2]),String(r),'g-t','start')+g.text(vadd(vmid(O,A),[-9,8]),'?','g-u','end')+g.text(vadd(A,[-10,-10]),'A','g-v')+g.text(vadd(B,[10,-10]),'B','g-v');
    return out;
  },'Anneau, corde tangente au petit cercle et rayon du grand cercle',{H:240,pad:36});
  return mkGeo({svg,val:R,unit:u,text:'Deux cercles ont le même centre O. Le petit a pour rayon «'+r+'» '+u+'. La corde [AB] du grand cercle mesure «'+c+'» '+u+' et elle est <b>tangente</b> au petit cercle en M. Calcule le rayon R du grand cercle.',ask:'le rayon R du grand cercle',placeholder:'AM = ...\nR² = OM² + AM²',
    work:['M milieu de [AB] : AM = '+c+' / 2 = '+hh,'R² = '+r+'² + '+hh+'² = '+(r*r+hh*hh),'R = √'+(r*r+hh*hh)+' = '+R+' '+u],
    steps:[stp('Demi-corde',M('OM ⊥ AB')+' et M est le milieu de [AB] : '+M('AM = '+c+' / 2 = '+hh)),stp('Pythagore dans OMA',M('R² = OM² + AM² = '+r+'² + '+hh+'² = '+(r*r+hh*hh))),stp('Racine',M('R = √'+(r*r+hh*hh)+' = '+R)+' '+u)],hints:['Le triangle OMA est rectangle en M ; son hypoténuse est le rayon OA.'],
    mistakes:[{v:r+hh,tag:'geo-pyth-somme',msg:'Pythagore s\'applique aux carrés : R² = r² + AM², pas R = r + AM.',w:['R = '+r+' + '+hh]},{v:Math.sqrt(r*r+c*c),tag:'geo-corde-tangente',msg:'Il faut la moitié de la corde (AM = '+hh+'), pas la corde entière.',w:['R = √('+r+'² + '+c+'²)']},{v:Math.sqrt(Math.abs(hh*hh-r*r)),tag:'geo-pyth-cote',msg:'Le rayon R est l\'hypoténuse : on additionne les carrés des deux côtés de l\'angle droit.',w:['R = √('+hh+'² − '+r+'²)']}].filter(m_=>Math.abs(m_.v-R)>1e-6&&m_.v>0)});
}

/* ----- gm-7f : triangles semblables dans un parallélogramme ----- */
function genParaSembQ(){
  const [p,q]=pick([[1,2],[2,1],[1,3],[3,1],[2,3],[3,2],[1,1]]), t=rnd(1,4), u=uP(), ask=pick(['CF','BF']);
  const ab=q*rnd(2,4), ce=p*(ab/q), bc=(ab+ce)*t, FC=ce*t, FB=ab*t;
  const sk=ab*0.35, hh=ab*0.8;
  const A=[0,0], B=[ab,0], D=[sk,hh], C=[ab+sk,hh], E=[ab+sk+ce,hh], F=[ab+sk*ab/(ab+ce),hh*ab/(ab+ce)];
  const svg=figure([A,B,C,D,E],f=>{
    const a=f(A),b=f(B),c=f(C),d=f(D),e_=f(E),ff=f(F), ct=cen([a,b,c,d]);
    let out=g.poly([a,b,c,d])+g.seg(c,e_,'')+g.seg(a,e_,'g-dash')+g.par(a,b,1)+g.par(d,c,1);
    out+=g.dot(a)+g.dot(b)+g.dot(c)+g.dot(d)+g.dot(e_)+g.dot(ff);
    out+=g.vert(a,'A',ct,13)+g.vert(b,'B',ct,13)+g.vert(d,'D',ct,13)+g.text(vadd(c,[2,-13]),'C','g-v')+g.vert(e_,'E',ct,13)+g.text(vadd(ff,[-11,9]),'F','g-v','end');
    out+=g.len(a,b,String(ab),ct,10)+g.len(c,e_,String(ce),a,8)+g.len(b,c,String(bc),a,16);
    return out;
  },'Parallélogramme ABCD, point E sur le prolongement de [DC] et point F sur [BC]',{H:240,pad:38});
  const base='ABCD est un parallélogramme. Le point E est sur le prolongement de [DC], au-delà de C. La droite (AE) coupe le côté [BC] en F. On donne AB = «'+ab+'» '+u+', CE = «'+ce+'» '+u+' et BC = «'+bc+'» '+u+'. (Les triangles FAB et FEC sont semblables, car (AB) ∥ (CE).) ';
  const sol=ask==='CF'?FC:FB, nm=ask==='CF'?'CF':'BF';
  const mis=ask==='CF'?[{v:bc*ce/ab,tag:'geo-thales-additif',msg:'FC et FB sont les deux parties de BC : FB + FC = BC. Le rapport est CE / (AB + CE).',w:['CF = '+bc+' × '+ce+' / '+ab]},{v:bc*ab/(ab+ce),tag:'geo-thales-inverse',msg:'Tu as calculé BF : CF correspond à CE (côté de E), BF à AB.',w:['CF = '+bc+' × '+ab+' / ('+ab+' + '+ce+')']},{v:bc/2,tag:'geo-rebond',msg:'F n\'est le milieu de [BC] que si CE = AB.',w:['CF = '+bc+' / 2']},{v:ce,tag:'geo-thales-inverse',msg:'CF n\'est pas égal à CE : ce sont des côtés homologues, il faut le rapport.',w:['CF = '+ce]}]
    :[{v:bc*ab/ce,tag:'geo-thales-additif',msg:'FB et FC sont les deux parties de BC : le rapport est AB / (AB + CE).',w:['BF = '+bc+' × '+ab+' / '+ce]},{v:bc*ce/(ab+ce),tag:'geo-thales-inverse',msg:'Tu as calculé CF : BF correspond à AB, CF à CE.',w:['BF = '+bc+' × '+ce+' / ('+ab+' + '+ce+')']},{v:bc/2,tag:'geo-rebond',msg:'F n\'est le milieu de [BC] que si CE = AB.',w:['BF = '+bc+' / 2']},{v:ab,tag:'geo-thales-inverse',msg:'BF n\'est pas égal à AB : il faut appliquer le rapport.',w:['BF = '+ab]}];
  const num=ask==='CF'?ce:ab;
  return mkGeo({svg,val:sol,unit:u,text:base+'Calcule '+nm+'.',ask:nm,placeholder:'FC / FB = CE / AB\nFB + FC = BC',
    work:['FC / FB = CE / AB = '+ce+' / '+ab,'FB + FC = '+bc,nm+' = '+bc+' × '+num+' / ('+ab+' + '+ce+') = '+sol+' '+u],
    steps:[stp('Triangles semblables','(AB) ∥ (CE), donc FAB et FEC sont semblables :',M('FC / FB = CE / AB = '+ce+' / '+ab)),stp('Partager BC','F est sur [BC] : '+M('FB + FC = '+bc)+'. Les parties sont dans le rapport '+M(ab+' : '+ce)+', c\'est-à-dire que BC est partagé en '+M(ab+' + '+ce+' = '+(ab+ce))+' parts égales de '+M(bc+' / '+(ab+ce)+' = '+t)+' '+u+'.'),stp('Résultat',M(nm+' = '+num+' × '+t+' = '+sol)+' '+u)],
    hints:['Dans des triangles semblables, FC / FB = CE / AB. Ajoute la condition FB + FC = BC.'],mistakes:mis.filter(m_=>Math.abs(m_.v-sol)>1e-6)});
}

/* ----- gm-7g : allumettes et angle α ----- */
function genAllumQ(){
  const m=pick([3,4,5,6,8]), al=90/m, r=al*Math.PI/180, d1=[1,0], d2=[Math.cos(r),Math.sin(r)];
  const pts=[[0,0],d1]; let mx=1;
  for(let j=2;j<=m;j++){ const ray=j%2?d1:d2, P=pts[j-1], b=ray[0]*P[0]+ray[1]*P[1], disc=b*b-(P[0]*P[0]+P[1]*P[1])+1, tt=b+Math.sqrt(Math.max(0,disc)); pts.push([ray[0]*tt,ray[1]*tt]); mx=Math.max(mx,tt); }
  const rl=mx*1.1;
  const svg=figure(pts.concat([[d1[0]*rl,0],[d2[0]*rl,d2[1]*rl]]),f=>{
    const O=f([0,0]), P=pts.map(f);
    let out=g.seg(O,f([d1[0]*rl,0]),'g-thin g-dash')+g.seg(O,f([d2[0]*rl,d2[1]*rl]),'g-thin g-dash');
    for(let j=1;j<=m;j++) out+=thickQ(g.seg(P[j-1],P[j],''));
    out+=g.right(P[m-1],P[m],O,9)+g.dot(O)+g.arc(O,f(d1),f(d2),24)+g.text(vadd(O,[-9,-3]),'α','g-u','end');
    return out;
  },m+' allumettes de même longueur posées en zigzag entre deux demi-droites',{H:220,pad:30});
  const ex=NF(al);
  return mkGeo({svg,val:al,unit:'°',text:'«'+m+'» allumettes de <b>même longueur</b> sont posées en zigzag entre deux demi-droites qui forment un angle α. La première allumette est posée le long de la première demi-droite, à partir de leur point commun O ; chaque allumette suivante a une extrémité sur la demi-droite opposée. La dernière allumette forme un <b>angle droit</b> avec la demi-droite sur laquelle elle prend appui à son départ. Calcule α.',ask:'l\'angle α',placeholder:'α + (m − 1)α + 90° = 180°',
    work:['Dernier triangle : angle en O = α, angle à l\'arrivée = '+(m-1)+'α, angle droit au départ','α + '+(m-1)+'α + 90° = 180°',''+m+'α = 90° donc α = 90 / '+m+' = '+ex+'°'],
    steps:[stp('Triangles isocèles','Deux allumettes consécutives ont la même longueur : chaque triangle est isocèle. L\'angle de la 2e allumette avec la demi-droite vaut α, celui de la 3e vaut 2α, celui de la 4e vaut 3α…'),stp('Dernier triangle','Pour la '+m+'e allumette : angle en O = α, angle à l\'arrivée = '+M((m-1)+'α')+', angle droit au départ. La somme vaut 180° :',M('α + '+(m-1)+'α + 90 = 180')+', donc '+M(m+'α = 90')),stp('Calcul',M('α = 90 / '+m+' = '+ex)+'°')],
    hints:['Dans le triangle formé avec la dernière allumette, la somme des angles vaut 180°.'],
    mistakes:[{v:90/(m-1),tag:'geo-allumettes',msg:'Il y a '+m+' fois l\'angle α dans la somme : α + '+(m-1)+'α = '+m+'α.',w:['α = 90 / '+(m-1)]},{v:90/(m+1),tag:'geo-allumettes',msg:'α + '+(m-1)+'α fait '+m+'α, pas '+(m+1)+'α.',w:['α = 90 / '+(m+1)]},{v:180/m,tag:'geo-allumettes',msg:'Un angle droit vaut 90° : la somme des deux autres angles est 90°, pas 180°.',w:['α = 180 / '+m]},{v:90*m,tag:'geo-allumettes',msg:'On divise 90° par m, on ne le multiplie pas.',w:['α = 90 × '+m]}].filter(m_=>Math.abs(m_.v-al)>1e-6)});
}

/* ----- gm-7h : vol d'oiseau (médianes et centre de gravité) ----- */
function genMedianeQ(){
  const ask=pick(['AG','GI','AI','somme']), thing=pick(['hélicoptères','drones','bateaux']), u=pick(['km','km','m']), tA=rnd(4,20), tB=rnd(4,20);
  const AI=3*tA, BJ=3*tB;
  const A=[0,0], B=[5.2,0], C=[1.6+Math.random()*2.8,3.6+Math.random()*0.8], I=vmid(B,C), J=vmid(A,C), G=[(A[0]+B[0]+C[0])/3,(A[1]+B[1]+C[1])/3];
  const svg=figure([A,B,C],f=>{
    const a=f(A),b=f(B),c=f(C),i=f(I),j=f(J),gg=f(G), ct=cen([a,b,c]);
    const place=(P,Q,frac,lab,away)=>{ const m=vadd(P,vmul(vsub(Q,P),frac)); let n=vunit(vperp(vsub(Q,P))); if(vdot(n,vsub(m,away))<0) n=vmul(n,-1); return g.text(vadd(m,vmul(n,12+String(lab).length*3)),lab,'g-t'); };
    let out=g.poly([a,b,c])+thickQ(g.seg(a,i,''))+thickQ(g.seg(b,j,''))+g.tick(b,i,1)+g.tick(i,c,1)+g.tick(a,j,2)+g.tick(j,c,2);
    out+=g.dot(a)+g.dot(b)+g.dot(c)+g.dot(i)+g.dot(j)+g.dot(gg)+g.vert(a,'A',ct,13)+g.vert(b,'B',ct,13)+g.vert(c,'C',ct,13)+g.vert(i,'I',ct,13)+g.vert(j,'J',ct,13)+g.text(vadd(gg,[0,15]),'G','g-v');
    if(ask==='AG'||ask==='GI') out+=place(a,i,0.4,String(AI),c);
    else if(ask==='AI') out+=place(a,gg,0.5,String(2*tA),c);
    else out+=place(a,i,0.4,String(AI),c)+place(b,j,0.4,String(BJ),c);
    return out;
  },'Triangle ABC avec ses médianes (AI) et (BJ) qui se coupent en G',{H:250,pad:38});
  const base='Un terrain triangulaire ABC est survolé par deux '+thing+' : l\'un part de A et rejoint le milieu I du côté [BC], l\'autre part de B et rejoint le milieu J du côté [AC]. Leurs trajets (AI) et (BJ) se croisent en G. ';
  const mkSteps=(l)=>[stp('Médianes','(AI) et (BJ) sont deux <b>médianes</b> du triangle ; G est leur point d\'intersection (centre de gravité).'),stp('Propriété','G est aux '+M('2/3')+' de chaque médiane en partant du sommet : '+M('AG = (2/3) × AI')+' et '+M('GI = (1/3) × AI')+'.')].concat(l);
  if(ask==='AG') return mkGeo({svg,val:2*tA,unit:u,text:base+'On a AI = «'+AI+'» '+u+'. Calcule la distance AG.',ask:'AG',placeholder:'AG = 2/3 × AI',
    work:['AG = (2/3) × AI = (2/3) × '+AI+' = '+2*tA+' '+u],steps:mkSteps([stp('Calcul',M('AG = (2/3) × '+AI+' = '+2*tA)+' '+u)]),hints:['G se trouve aux deux tiers de la médiane, en partant du sommet A.'],
    mistakes:[{v:AI/2,tag:'geo-mediane',msg:'G n\'est pas le milieu de [AI] : il est aux 2/3 en partant de A.',w:['AG = '+AI+' / 2']},{v:AI/3,tag:'geo-mediane',msg:'1/3 est la distance GI (depuis le milieu I). AG vaut les 2/3.',w:['AG = '+AI+' / 3']},{v:AI*2,tag:'geo-mediane',msg:'AG est une partie de AI : elle est plus courte que AI.',w:['AG = 2 × '+AI]}].filter(m_=>Math.abs(m_.v-2*tA)>1e-6)});
  if(ask==='GI') return mkGeo({svg,val:tA,unit:u,text:base+'On a AI = «'+AI+'» '+u+'. Calcule la distance GI.',ask:'GI',placeholder:'GI = 1/3 × AI',
    work:['GI = (1/3) × AI = '+AI+' / 3 = '+tA+' '+u],steps:mkSteps([stp('Calcul',M('GI = (1/3) × '+AI+' = '+tA)+' '+u)]),hints:['G est au tiers de la médiane en partant du milieu I.'],
    mistakes:[{v:AI/2,tag:'geo-mediane',msg:'G n\'est pas le milieu de [AI].',w:['GI = '+AI+' / 2']},{v:2*AI/3,tag:'geo-mediane',msg:'Les 2/3 correspondent à AG (depuis le sommet). GI est le tiers restant.',w:['GI = (2/3) × '+AI]}].filter(m_=>Math.abs(m_.v-tA)>1e-6)});
  if(ask==='AI') return mkGeo({svg,val:AI,unit:u,text:base+'On a AG = «'+(2*tA)+'» '+u+'. Calcule la longueur du trajet complet AI.',ask:'AI',placeholder:'AG = 2/3 × AI',
    work:['AG = (2/3) × AI, donc AI = (3/2) × AG = (3/2) × '+2*tA+' = '+AI+' '+u],steps:mkSteps([stp('Calcul à l\'envers',M('AI = (3/2) × AG = (3/2) × '+2*tA+' = '+AI)+' '+u)]),hints:['AG représente 2 tiers de AI : un tiers vaut AG / 2.'],
    mistakes:[{v:4*tA,tag:'geo-mediane',msg:'G n\'est pas le milieu de [AI] : AI n\'est pas le double de AG.',w:['AI = 2 × '+2*tA]},{v:tA,tag:'geo-mediane',msg:'Tu as calculé GI. AI = AG + GI.',w:['AI = '+2*tA+' / 2']},{v:(2*tA)*2/3,tag:'geo-mediane',msg:'AI est plus long que AG : on multiplie par 3/2, on ne prend pas les 2/3.',w:['AI = (2/3) × '+2*tA]}].filter(m_=>Math.abs(m_.v-AI)>1e-6)});
  const S=2*tA+2*tB;
  return mkGeo({svg,val:S,unit:u,text:base+'On a AI = «'+AI+'» '+u+' et BJ = «'+BJ+'» '+u+'. Les deux '+thing+' avancent jusqu\'à G, puis s\'arrêtent. Calcule la distance <b>totale</b> parcourue par les deux '+thing+' (AG + BG).',ask:'AG + BG',placeholder:'AG = 2/3 × AI\nBG = 2/3 × BJ',
    work:['AG = (2/3) × '+AI+' = '+2*tA,'BG = (2/3) × '+BJ+' = '+2*tB,'AG + BG = '+S+' '+u],steps:mkSteps([stp('Les deux parcours',M('AG = (2/3) × '+AI+' = '+2*tA)+' et '+M('BG = (2/3) × '+BJ+' = '+2*tB)),stp('Total',M('AG + BG = '+2*tA+' + '+2*tB+' = '+S)+' '+u)]),hints:['Calcule AG et BG séparément (aux 2/3 de chaque médiane), puis additionne.'],
    mistakes:[{v:AI+BJ,tag:'geo-mediane',msg:'Les '+thing+' s\'arrêtent en G, pas en I et en J.',w:['AI + BJ = '+(AI+BJ)]},{v:(AI+BJ)/2,tag:'geo-mediane',msg:'G n\'est pas au milieu des médianes : il est aux 2/3.',w:['(AI + BJ) / 2']},{v:tA+tB,tag:'geo-mediane',msg:'1/3 est la distance depuis le milieu du côté. Depuis le sommet, G est aux 2/3.',w:['(1/3) × AI + (1/3) × BJ']}].filter(m_=>Math.abs(m_.v-S)>1e-6)});
}

TOPICS['gm-7a']={kind:'gcomp',level:5,label:'Vague, lentille et quart de disque',gen:genVagueQ};
TOPICS['gm-7b']={kind:'gcomp',level:4,label:'Droites parallèles : papillon',gen:genPapillonQ};
TOPICS['gm-7c']={kind:'gcomp',level:5,label:'Billard : rebond sur la bande',gen:genBillardQ};
TOPICS['gm-7d']={kind:'gcomp',level:5,label:'Tunnel à voûte semi-circulaire',gen:genTunnelQ};
TOPICS['gm-7e']={kind:'gcomp',level:5,label:'Surface pavée : corde tangente',gen:genPaveeQ};
TOPICS['gm-7f']={kind:'gcomp',level:5,label:'Parallélogramme et triangles semblables',gen:genParaSembQ};
TOPICS['gm-7g']={kind:'gcomp',level:6,label:'Allumettes et angle α',gen:genAllumQ};
TOPICS['gm-7h']={kind:'gcomp',level:4,label:'Vol d\'oiseau : médianes',gen:genMedianeQ};
