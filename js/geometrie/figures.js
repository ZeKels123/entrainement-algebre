'use strict';
/* ===== Géométrie plane : figures SVG, mkGeo, triangles et quadrilatères ===== */
const HINT_GEO='Écris tes calculs ligne par ligne, par exemple A = 7 × 5 / 2 puis A = 17,5. Termine par la valeur demandée. L\'unité est facultative ; si tu l\'écris, elle doit être juste (cm pour une longueur, cm² pour une aire).';
const GS={W:340,H:230};
const gf=n=>Math.round(n*100)/100;
const vsub=(a,b)=>[a[0]-b[0],a[1]-b[1]], vadd=(a,b)=>[a[0]+b[0],a[1]+b[1]], vmul=(a,k)=>[a[0]*k,a[1]*k];
const vlen=a=>Math.hypot(a[0],a[1]), vunit=a=>{ const l=vlen(a)||1; return [a[0]/l,a[1]/l]; };
const vmid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
const vperp=a=>[-a[1],a[0]];
const vdot=(a,b)=>a[0]*b[0]+a[1]*b[1];
const cen=P=>[P.reduce((s,p)=>s+p[0],0)/P.length,P.reduce((s,p)=>s+p[1],0)/P.length];
const NF=n=>String(Math.round(n*1000)/1000).replace('.',',');
function gfit(pts,o){
  o=o||{}; const W=o.W||GS.W, H=o.H||GS.H, pad=o.pad==null?38:o.pad;
  const xs=pts.map(p=>p[0]), ys=pts.map(p=>p[1]);
  const x0=Math.min(...xs), x1=Math.max(...xs), y0=Math.min(...ys), y1=Math.max(...ys);
  const s=Math.min((W-2*pad)/((x1-x0)||1),(H-2*pad)/((y1-y0)||1));
  const ox=(W-s*(x1-x0))/2-s*x0, oy=(H-s*(y1-y0))/2-s*y0;
  const f=p=>[ox+s*p[0],H-(oy+s*p[1])]; f.s=s; return f;
}
let GID=0;
const g={
  seg:(a,b,c)=>'<line class="g-l '+(c||'')+'" x1="'+gf(a[0])+'" y1="'+gf(a[1])+'" x2="'+gf(b[0])+'" y2="'+gf(b[1])+'"/>',
  poly:(P,c)=>'<polygon class="g-f '+(c||'')+'" points="'+P.map(p=>gf(p[0])+','+gf(p[1])).join(' ')+'"/>',
  path:(d,c)=>'<path class="'+(c||'g-f')+'" d="'+d+'"/>',
  circle:(c,r,cl)=>'<circle class="g-f '+(cl||'')+'" cx="'+gf(c[0])+'" cy="'+gf(c[1])+'" r="'+gf(r)+'"/>',
  dot:p=>'<circle class="g-d" cx="'+gf(p[0])+'" cy="'+gf(p[1])+'" r="2.8"/>',
  text:(p,s,c,anchor)=>'<text class="g-t '+(c||'')+'" x="'+gf(p[0])+'" y="'+gf(p[1])+'" dy=".35em" text-anchor="'+(anchor||'middle')+'">'+s+'</text>',
  vert:(p,name,from,d)=>{ const u=vunit(vsub(p,from)); return g.text(vadd(p,vmul(u,d||15)),name,'g-v'); },
  len:(a,b,s,from,d,cls)=>{ const m=vmid(a,b); let n=vunit(vperp(vsub(b,a))); if(vdot(n,vsub(m,from))<0) n=vmul(n,-1); const dd=(d==null?14:d)+String(s).replace(/<[^>]+>/g,'').length*3.4*Math.abs(n[0]); return g.text(vadd(m,vmul(n,dd)),s,cls); },
  right:(P,A,B,s)=>{ s=s||11; const u=vmul(vunit(vsub(A,P)),s), v=vmul(vunit(vsub(B,P)),s); const a=vadd(P,u), b=vadd(vadd(P,u),v), c=vadd(P,v); return '<path class="g-mark" d="M'+gf(a[0])+' '+gf(a[1])+' L'+gf(b[0])+' '+gf(b[1])+' L'+gf(c[0])+' '+gf(c[1])+'"/>'; },
  arc:(P,A,B,r,label,cls)=>{
    const a1=Math.atan2(A[1]-P[1],A[0]-P[0]); let d=Math.atan2(B[1]-P[1],B[0]-P[0])-a1;
    while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI;
    const a2=a1+d, s=[P[0]+r*Math.cos(a1),P[1]+r*Math.sin(a1)], e=[P[0]+r*Math.cos(a2),P[1]+r*Math.sin(a2)], mid=a1+d/2;
    let out='<path class="g-mark" d="M'+gf(s[0])+' '+gf(s[1])+' A'+gf(r)+' '+gf(r)+' 0 0 '+(d>0?1:0)+' '+gf(e[0])+' '+gf(e[1])+'"/>';
    if(label!=null){ const rr=r+(label.length>3?17:13); out+=g.text([P[0]+rr*Math.cos(mid),P[1]+rr*Math.sin(mid)],label,cls||'g-a'); }
    return out;
  },
  tick:(a,b,n)=>{ const m=vmid(a,b), u=vunit(vsub(b,a)), v=vperp(u); let o=''; for(let i=0;i<n;i++){ const c=vadd(m,vmul(u,(i-(n-1)/2)*5)); o+=g.seg(vadd(c,vmul(v,5)),vadd(c,vmul(v,-5)),'g-mark'); } return o; },
  par:(a,b,n)=>{ const m=vmid(a,b), u=vunit(vsub(b,a)), v=vperp(u); let o=''; for(let i=0;i<n;i++){ const c=vadd(m,vmul(u,(i-(n-1)/2)*6)); const p1=vadd(vsub(c,vmul(u,4)),vmul(v,4)), p2=vsub(vsub(c,vmul(u,4)),vmul(v,4)); o+='<path class="g-mark" d="M'+gf(p1[0])+' '+gf(p1[1])+' L'+gf(c[0])+' '+gf(c[1])+' L'+gf(p2[0])+' '+gf(p2[1])+'"/>'; } return o; },
  dim:(a,b,s,from,off,cls)=>{ const m=vmid(a,b); let n=vunit(vperp(vsub(b,a))); if(vdot(n,vsub(m,from))<0) n=vmul(n,-1); const a2=vadd(a,vmul(n,off)), b2=vadd(b,vmul(n,off)); return g.seg(a,a2,'g-thin')+g.seg(b,b2,'g-thin')+g.seg(a2,b2,'g-mark')+g.text(vadd(vmid(a2,b2),vmul(n,11)),s,cls); },
  hatchify:(el,fill)=>el.replace('/>',' style="fill:'+fill+';fill-opacity:1"/>'),
  hatch:()=>{ const id='h'+(++GID); return {id,def:'<defs><pattern id="'+id+'" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="currentColor" stroke-width="2" stroke-opacity=".55"/></pattern></defs>',fill:'url(#'+id+')'}; }
};
function figure(mathPts,build,alt,o){
  o=o||{}; const f=gfit(mathPts,o), W=o.W||GS.W, H=o.H||GS.H;
  return '<figure class="geofig"><svg class="geo-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(alt)+'">'+build(f)+'</svg><figcaption>Figure non à l\'échelle.</figcaption></figure>';
}
const NAMES3=[['A','B','C'],['A','B','C'],['E','F','G'],['M','N','P'],['R','S','T']];

/* ----- construction d'un exercice de géométrie ----- */
function mkGeo(o){
  const val=typeof o.val==='number'?{a:o.val,b:0}:(o.val||{a:0,b:0}), mode=o.mode||'num', unit=o.unit||'', pow=o.pow||1;
  const ustr=unit==='°'?'°':(unit?' '+unit+(pow===2?'²':pow===3?'³':''):'');
  const pv=v=>v.a+v.b*Math.PI;
  const pstr=v=>{ const bs=(Math.abs(v.b)===1?'':NF(Math.abs(v.b)))+'π'; if(!v.b) return NF(v.a); if(!v.a) return (v.b<0?'−':'')+bs; if(v.a<0&&v.b>0) return bs+' − '+NF(-v.a); return NF(v.a)+(v.b<0?' − ':' + ')+bs; };
  let es; if(mode==='choice') es=o.choice; else if(mode==='fn') es=o.fn.lhs+' = '+o.fn.exact; else if(o.exact) es=o.exact; else if(mode==='sqrt') es=o.exact; else if(mode==='round') es=NF(Math.round(pv(val)*Math.pow(10,o.d))/Math.pow(10,o.d)); else es=pstr(val);
  const tx=TX(o.text);
  const ms=(o.mistakes||[]).map(m=>m.s!==undefined?{s:m.s,msg:m.msg,tag:m.tag||'geo-methode',w:m.w||null}:{v:typeof m.v==='number'?{a:m.v,b:0}:m.v,msg:m.msg,tag:m.tag||'geo-methode',w:m.w||null})
    .filter(m=>m.s!==undefined||(isFinite(pv(m.v))&&Math.abs(pv(m.v)-pv(val))>1e-6));
  const uniq=o.mode==='fn'?ms:ms.filter((m,i)=>ms.findIndex(x=>x.v&&Math.abs(pv(x.v)-pv(m.v))<1e-6&&Math.abs(x.v.b-m.v.b)<1e-9)===i);
  return {kind:'geo',expected:{},vars:o.fn?[o.fn.lhs].concat(o.fn.vars):[],v:null,
    geo:{unit,pow,mode,d:o.d,val,choice:o.choice,sanity:o.sanity||[],fn:o.fn||null},
    statement:tx.plain.replace(/<[^>]+>/g,''), html:'<div class="geo">'+o.svg+'<p class="geotxt">'+tx.html+'</p></div>',
    expectedStr:es+(mode==='choice'?'':ustr), expectedHtml:M(es)+(mode==='choice'?'':esc(ustr)),
    steps:o.steps||[], hints:o.hints||[], mistakes:uniq,
    instr:o.instr||('Calcule '+(o.ask||'la valeur demandée')), hintline:HINT_GEO,
    placeholder:o.placeholder||'A = 7 × 5 / 2\nA = 17,5 cm²', work:o.work||null, id:Math.random().toString(36).slice(2,9)};
}
const stp=(t,...l)=>({t,l});
const uP=()=>pick(['cm','cm','cm','m']);
const PYTRI=[[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29]];
function tripleK(maxH){ for(let i=0;i<50;i++){ const t=pick(PYTRI), k=pick([1,1,1,2,2,3]); if(t[2]*k<=maxH){ const s=[t[0]*k,t[1]*k,t[2]*k]; return Math.random()<0.5?s:[s[1],s[0],s[2]]; } } return [3,4,5]; }
function simpRad(n){ let k=1,r=n; for(let d=Math.floor(Math.sqrt(n));d>1;d--){ if(r%(d*d)===0){ k*=d; r/=d*d; } } return {k,r}; }
const radStr=n=>{ const s=simpRad(n); return s.r===1?String(s.k):(s.k===1?'':s.k)+'√'+s.r; };

/* ----- figure : triangle à base horizontale et hauteur ----- */
function svgTriH(o){
  const b=o.b, px=o.px, h=o.h, A=[px,h], B=[0,0], C=[b,0], F=[px,0];
  return figure([A,B,C,F],f=>{
    const a=f(A), bb=f(B), c=f(C), fo=f(F), ce=cen([a,bb,c]); let out=g.poly([a,bb,c]);
    if(px<0) out+=g.seg(bb,fo,'g-dash g-thin'); else if(px>b) out+=g.seg(c,fo,'g-dash g-thin');
    if(!o.noHeight){
      out+=g.seg(a,fo,'g-dash')+g.right(fo,a,[fo[0]+(px>b?-10:10),fo[1]],10);
      out+=(px>b/2?g.text([fo[0]-9,(a[1]+fo[1])/2],o.labH,o.hUnk?'g-u':'','end'):g.text([fo[0]+9,(a[1]+fo[1])/2],o.labH,o.hUnk?'g-u':'','start'));
    }
    out+=g.text([(bb[0]+c[0])/2,bb[1]+17],o.labBase,o.bUnk?'g-u':'');
    if(o.labL) out+=g.len(a,bb,o.labL,ce,13); if(o.labR) out+=g.len(a,c,o.labR,ce,13);
    const nm=o.names||['A','B','C']; out+=g.vert(a,nm[0],ce)+g.vert(bb,nm[1],ce)+g.vert(c,nm[2],ce);
    return out;
  },o.alt);
}
/* triangle à trois côtés connus (B en bas à gauche, BC horizontal) */
function triFromSides(a,b,c){ const x=(a*a+c*c-b*b)/(2*a), y=Math.sqrt(Math.max(0.0001,c*c-x*x)); return {A:[x,y],B:[0,0],C:[a,0]}; }
function svgTri3(o){
  const T=triFromSides(o.a,o.b,o.c), nm=o.names||['A','B','C'];
  return figure([T.A,T.B,T.C],f=>{
    const A=f(T.A),B=f(T.B),C=f(T.C),ce=cen([A,B,C]);
    let out=g.poly([A,B,C])+g.text([(B[0]+C[0])/2,B[1]+17],o.la)+g.len(C,A,o.lb,ce,13)+g.len(A,B,o.lc,ce,13);
    out+=g.vert(A,nm[0],ce)+g.vert(B,nm[1],ce)+g.vert(C,nm[2],ce);
    if(o.eq) out+=g.tick(B,C,1)+g.tick(C,A,1)+g.tick(A,B,1);
    return out;
  },o.alt);
}
/* triangle rectangle en B : AB vertical, BC horizontal */
function svgRight(o){
  const a=o.a, b=o.b, fl=o.flip?-1:1, A=[0,a], B=[0,0], C=[fl*b,0], nm=o.names||['A','B','C'];
  return figure([A,B,C],f=>{
    const pa=f(A),pb=f(B),pc=f(C),ce=cen([pa,pb,pc]);
    let out=g.poly([pa,pb,pc])+g.right(pb,pa,pc,12);
    if(o.lAB!=null) out+=g.len(pa,pb,o.lAB,ce,15,o.uAB?'g-u':'');
    if(o.lBC!=null) out+=g.len(pb,pc,o.lBC,ce,15,o.uBC?'g-u':'');
    if(o.lAC!=null) out+=g.len(pa,pc,o.lAC,ce,15,o.uAC?'g-u':'');
    out+=g.vert(pa,nm[0],ce)+g.vert(pb,nm[1],ce)+g.vert(pc,nm[2],ce);
    return out;
  },o.alt);
}

/* ---------- Triangles ---------- */
function genTri1(){
  const u=uP();
  if(Math.random()<0.55){
    const b=rnd(5,14), h=rnd(3,10), px=+(b*pick([0.3,0.45,0.6,0.75])).toFixed(2), A=b*h/2;
    const svg=svgTriH({b,px,h,labBase:b+' '+u,labH:h+' '+u,alt:'Triangle ABC de base BC = '+b+' '+u+' et de hauteur '+h+' '+u+' issue de A'});
    return mkGeo({svg,text:'Calcule l\'aire du triangle «ABC» : sa base «BC = '+b+'» '+u+' et sa hauteur issue de «A» mesure «'+h+'» '+u+'.',ask:'l\'aire du triangle',val:A,unit:u,pow:2,
      steps:[stp('Formule',M('A = b × h / 2')+' : base × hauteur, divisé par 2.'),stp('Calcul',M('A = '+b+' × '+h+' / 2 = '+NF(A))+' '+u+'²')],
      hints:['L\'aire d\'un triangle est la moitié de celle d\'un rectangle de même base et de même hauteur.'],
      work:['A = '+b+' × '+h+' / 2','A = '+NF(A)+' '+u+'²'],
      mistakes:[{v:b*h,tag:'geo-demi',msg:'Tu as multiplié base et hauteur sans diviser par 2 : c\'est l\'aire du rectangle de mêmes dimensions. Le triangle en occupe la moitié.',w:['A = '+b+' × '+h,'A = '+NF(b*h)+' '+u+'²']},{v:b+h,tag:'geo-formule',msg:'Tu as additionné la base et la hauteur. Une aire est un produit de deux longueurs, pas une somme.',w:['A = '+b+' + '+h,'A = '+NF(b+h)+' '+u+'²']}]});
  }
  let a,b,c; do{ a=rnd(4,12); b=rnd(4,12); c=rnd(4,12); }while(a+b<=c||a+c<=b||b+c<=a);
  const P=a+b+c;
  const svg=svgTri3({a,b,c,la:a+' '+u,lb:b+' '+u,lc:c+' '+u,alt:'Triangle ABC avec BC = '+a+', CA = '+b+', AB = '+c});
  return mkGeo({svg,text:'Le triangle «ABC» a pour côtés «AB = '+c+'» '+u+', «BC = '+a+'» '+u+' et «CA = '+b+'» '+u+'. Calcule son périmètre.',ask:'le périmètre du triangle',val:P,unit:u,
    placeholder:'P = 5 + 6 + 8\nP = 19 cm',
    steps:[stp('Formule','Le périmètre est la longueur du contour : la somme des trois côtés.'),stp('Calcul',M('P = '+c+' + '+a+' + '+b+' = '+P)+' '+u)],
    hints:['Le périmètre est une longueur : additionne tous les côtés.'],
    work:['P = '+c+' + '+a+' + '+b,'P = '+P+' '+u],
    mistakes:[{v:a+b,tag:'geo-perim-cote',msg:'Il manque un côté : un triangle en a trois.',w:['P = '+a+' + '+b,'P = '+(a+b)+' '+u]},{v:a*b*c,tag:'geo-perim-aire',msg:'Un périmètre est une somme de longueurs, pas un produit.',w:['P = '+c+' × '+a+' × '+b,'P = '+(a*b*c)+' '+u]},{v:(a*b)/2,tag:'geo-perim-aire',msg:'Ce calcul ressemble à une aire. Le périmètre est la somme des côtés.',w:['P = '+a+' × '+b+' / 2','P = '+NF(a*b/2)+' '+u]}]});
}
function genTri2(){
  const u=uP(), [a,b,c]=tripleK(30), flip=Math.random()<0.5, ask=pick(['aire','perim']);
  if(ask==='aire'){
    const svg=svgRight({a,b,flip,lAB:a+' '+u,lBC:b+' '+u,alt:'Triangle ABC rectangle en B, AB = '+a+', BC = '+b});
    return mkGeo({svg,text:'Le triangle «ABC» est rectangle en «B», avec «AB = '+a+'» '+u+' et «BC = '+b+'» '+u+'. Calcule son aire.',ask:'l\'aire du triangle rectangle',val:a*b/2,unit:u,pow:2,
      steps:[stp('Repère la base et la hauteur','Dans un triangle rectangle, les deux côtés de l\'angle droit sont une base et sa hauteur.'),stp('Calcule',M('A = AB × BC / 2 = '+a+' × '+b+' / 2 = '+NF(a*b/2))+' '+u+'²')],
      hints:['Les côtés de l\'angle droit sont perpendiculaires : l\'un sert de base, l\'autre de hauteur.'],
      work:['A = '+a+' × '+b+' / 2','A = '+NF(a*b/2)+' '+u+'²'],
      mistakes:[{v:a*b,tag:'geo-demi',msg:'Tu as oublié de diviser par 2 : ce résultat est l\'aire du rectangle « complété ».',w:['A = '+a+' × '+b,'A = '+NF(a*b)+' '+u+'²']},{v:a+b+c,tag:'geo-perim-aire',msg:'Tu as calculé le périmètre (somme des trois côtés), pas l\'aire.',w:['AC² = '+a+'² + '+b+'² = '+(a*a+b*b),'AC = √'+(a*a+b*b)+' = '+c,'A = '+a+' + '+b+' + '+c,'A = '+NF(a+b+c)+' '+u+'²']}]});
  }
  const svg=svgRight({a,b,flip,lAB:a+' '+u,lBC:b+' '+u,lAC:'?',uAC:true,alt:'Triangle ABC rectangle en B, AB = '+a+', BC = '+b+', AC inconnu'});
  return mkGeo({svg,text:'Le triangle «ABC» est rectangle en «B», avec «AB = '+a+'» '+u+' et «BC = '+b+'» '+u+'. Calcule son périmètre (il faut d\'abord trouver «AC»).',ask:'le périmètre du triangle',val:a+b+c,unit:u,
    placeholder:'AC² = 3² + 4² = 25\nAC = 5\nP = 3 + 4 + 5 = 12 cm',
    steps:[stp('Pythagore pour l\'hypoténuse',M('AC² = AB² + BC² = '+a+'² + '+b+'² = '+(a*a+b*b)),M('AC = √'+(a*a+b*b)+' = '+c)+' '+u),stp('Périmètre',M('P = '+a+' + '+b+' + '+c+' = '+(a+b+c))+' '+u)],
    hints:['Le périmètre demande les trois côtés : il manque l\'hypoténuse AC.','Utilise le théorème de Pythagore dans le triangle rectangle en B.'],
    work:['AC² = '+a+'² + '+b+'² = '+(a*a+b*b),'AC = √'+(a*a+b*b)+' = '+c,'P = '+a+' + '+b+' + '+c,'P = '+NF(a+b+c)+' '+u],
    mistakes:[{v:a+b,tag:'geo-perim-cote',msg:'Il manque l\'hypoténuse. Calcule d\'abord AC avec Pythagore.',w:['P = '+a+' + '+b,'P = '+NF(a+b)+' '+u]},{v:a*b/2,tag:'geo-perim-aire',msg:'Tu as calculé l\'aire. Le périmètre est la somme des trois côtés.',w:['P = '+a+' × '+b+' / 2','P = '+NF(a*b/2)+' '+u]},{v:a+b+a+b,tag:'geo-perim-cote',msg:'Tu as compté deux fois chaque côté de l\'angle droit et oublié l\'hypoténuse.',w:['P = '+a+' + '+b+' + '+a+' + '+b,'P = '+NF(a+b+a+b)+' '+u]}]});
}
function genTri3(){
  /* hauteur ≠ côté : les trois côtés sont donnés, une seule hauteur */
  const u=uP(); const [p,h,s]=tripleK(20); const b=rnd(Math.max(p+2,6),p+10), obtus=Math.random()<0.4;
  const px=obtus?-p:p; /* sommet A à x = px ; s = longueur du côté AB */
  const other=Math.hypot(b-px,h), oStr=NF(Math.round(other*10)/10);
  const svg=svgTriH({b,px,h,labBase:b+' '+u,labH:h+' '+u,labL:s+' '+u,alt:'Triangle ABC avec BC = '+b+' '+u+', AB = '+s+' '+u+' et une hauteur de '+h+' '+u});
  return mkGeo({svg,text:'Dans le triangle «ABC», «BC = '+b+'» '+u+', «AB = '+s+'» '+u+', et la hauteur issue de «A» mesure «'+h+'» '+u+'. Calcule l\'aire du triangle.',ask:'l\'aire du triangle',val:b*h/2,unit:u,pow:2,
    steps:[stp('Choisis la bonne hauteur','La hauteur est perpendiculaire à la base : ici '+h+' '+u+' pour la base BC. Le côté AB ('+s+' '+u+') est oblique : il ne sert pas.'),stp('Calcule',M('A = BC × h / 2 = '+b+' × '+h+' / 2 = '+NF(b*h/2))+' '+u+'²')],
    hints:['Un côté oblique n\'est pas une hauteur. La hauteur est le segment en pointillés.'],
    work:['A = '+b+' × '+h+' / 2','A = '+NF(b*h/2)+' '+u+'²'],
    mistakes:[{v:b*s/2,tag:'geo-hauteur',msg:'Tu as utilisé le côté oblique AB comme hauteur. La hauteur est perpendiculaire à la base : c\'est le segment en pointillés.',w:['A = '+b+' × '+s+' / 2','A = '+NF(b*s/2)+' '+u+'²']},{v:b*h,tag:'geo-demi',msg:'Tu as oublié de diviser par 2.',w:['A = '+b+' × '+h,'A = '+NF(b*h)+' '+u+'²']},{v:b*s,tag:'geo-hauteur',msg:'Tu as utilisé le côté oblique comme hauteur et oublié de diviser par 2.',w:['A = '+b+' × '+s,'A = '+NF(b*s)+' '+u+'²']}]});
}
function genTri4(){
  const u=uP(); const [p,h,s]=tripleK(30), b=2*p;
  const svg=figure([[-p,0],[p,0],[0,h]],f=>{
    const B=f([-p,0]),C=f([p,0]),A=f([0,h]),F=f([0,0]),ce=cen([A,B,C]);
    return g.poly([A,B,C])+g.seg(A,F,'g-dash')+g.right(F,A,C,10)+g.tick(A,B,1)+g.tick(A,C,1)+g.text([(B[0]+C[0])/2,B[1]+17],b+' '+u)+g.len(A,B,s+' '+u,ce,14)+g.text([F[0]+9,(A[1]+F[1])/2],'?','g-u','start')
      +g.vert(A,'A',ce)+g.vert(B,'B',ce)+g.vert(C,'C',ce);
  },'Triangle isocèle ABC de sommet A, BC = '+b+' '+u+', AB = AC = '+s+' '+u);
  return mkGeo({svg,text:'Le triangle «ABC» est isocèle en «A» : «BC = '+b+'» '+u+' et «AB = AC = '+s+'» '+u+'. Calcule son aire (la hauteur n\'est pas donnée).',ask:'l\'aire du triangle isocèle',val:p*h,unit:u,pow:2,
    placeholder:'H est le milieu de [BC] : BH = 3\nAH² = 5² − 3² = 16\nAH = 4\nA = 6 × 4 / 2 = 12 cm²',
    steps:[stp('La hauteur coupe la base en son milieu','Dans un triangle isocèle, la hauteur issue du sommet passe par le milieu H de la base : '+M('BH = '+b+' / 2 = '+p)),stp('Pythagore dans ABH (rectangle en H)',M('AH² = AB² − BH² = '+s+'² − '+p+'² = '+(s*s-p*p)),M('AH = √'+(s*s-p*p)+' = '+h)+' '+u),stp('Aire',M('A = BC × AH / 2 = '+b+' × '+h+' / 2 = '+(p*h))+' '+u+'²')],
    hints:['Trace la hauteur issue de A : dans un triangle isocèle, elle coupe la base en deux parties égales.','Le triangle rectangle ABH permet de calculer la hauteur avec Pythagore : AH² = AB² − BH².'],
    work:['BH = '+b+' / 2 = '+p,'AH² = '+s+'² − '+p+'² = '+(s*s-p*p),'AH = √'+(s*s-p*p)+' = '+h,'A = '+b+' × '+h+' / 2','A = '+NF(p*h)+' '+u+'²'],
    mistakes:[{v:b*s/2,tag:'geo-hauteur',msg:'Tu as pris le côté AB comme hauteur. La hauteur est perpendiculaire à la base : il faut la calculer avec Pythagore.',w:['A = '+b+' × '+s+' / 2','A = '+NF(b*s/2)+' '+u+'²']},{v:b*h,tag:'geo-demi',msg:'Tu as bien trouvé la hauteur mais oublié de diviser par 2.',w:['BH = '+b+' / 2 = '+p,'AH² = '+s+'² − '+p+'² = '+(s*s-p*p),'AH = √'+(s*s-p*p)+' = '+h,'A = '+b+' × '+h,'A = '+NF(b*h)+' '+u+'²']},{v:p*h/2,tag:'geo-demi',msg:'Tu as utilisé la moitié de la base (BH) comme base entière. La base du triangle est BC.',w:['BH = '+b+' / 2 = '+p,'AH² = '+s+'² − '+p+'² = '+(s*s-p*p),'AH = √'+(s*s-p*p)+' = '+h,'A = '+p+' × '+h+' / 2','A = '+NF(p*h/2)+' '+u+'²']}]});
}
function genTri5(){
  const u=uP(), a=pick([4,6,8,10,12]), exact=Math.random()<0.5, h2=a*a*3/4, A=a*a*Math.sqrt(3)/4;
  const svg=figure([[-a/2,0],[a/2,0],[0,a*Math.sqrt(3)/2]],f=>{
    const B=f([-a/2,0]),C=f([a/2,0]),T=f([0,a*Math.sqrt(3)/2]),F=f([0,0]),ce=cen([B,C,T]);
    return g.poly([T,B,C])+g.tick(T,B,1)+g.tick(T,C,1)+g.tick(B,C,1)+g.seg(T,F,'g-dash')+g.right(F,T,C,10)+g.text([(B[0]+C[0])/2,B[1]+17],a+' '+u)+g.text([F[0]+9,(T[1]+F[1])/2],'?','g-u','start')+g.vert(T,'A',ce)+g.vert(B,'B',ce)+g.vert(C,'C',ce);
  },'Triangle équilatéral ABC de côté '+a+' '+u);
  const k=(a/2)*(a/2), steps=[stp('Hauteur avec Pythagore',M('h² = '+a+'² − '+(a/2)+'² = '+(a*a-a*a/4)),M('h = √'+(a*a*3/4)+' = '+radStr(a*a*3/4))+' '+u),stp('Aire',M('A = '+a+' × h / 2 = '+(a/2)+' × h'),exact?M('A = '+k+'√3')+' '+u+'²':M('A ≈ '+NF(Math.round(A*10)/10))+' '+u+'²')];
  const hints=['Trace une hauteur : elle coupe la base en deux parties égales ('+(a/2)+' '+u+' chacune).','Pythagore dans un demi-triangle : h² = côté² − (côté/2)².'];
  const ms=[{v:a*a/2,tag:'geo-hauteur',msg:'Tu as pris le côté comme hauteur. Dans un triangle équilatéral la hauteur est plus courte que le côté.',w:['A = '+a+' × '+a+' / 2','A = '+NF(a*a/2)+' '+u+'²']},{v:a*a/4,tag:'geo-methode',msg:'Il manque la hauteur : elle n\'est pas égale à la moitié du côté (il faut Pythagore).',w:['h = '+a+' / 2 = '+(a/2),'A = '+a+' × '+(a/2)+' / 2','A = '+NF(a*a/4)+' '+u+'²']}];
  const hr=Math.round(Math.sqrt(h2)*1000)/1000, w1='h² = '+a+'² − '+(a/2)+'² = '+h2;
  if(exact) return mkGeo({svg,text:'Le triangle «ABC» est équilatéral, de côté «'+a+'» '+u+'. Calcule son aire. Donne la <b>valeur exacte</b> (avec une racine carrée).',ask:'l\'aire (valeur exacte)',val:A,mode:'sqrt',exact:k+'√3',unit:u,pow:2,placeholder:'h² = 6² − 3² = 27\nh = 3√3\nA = 6 × 3√3 / 2 = 9√3 cm²',steps,hints,
    work:[w1,'h = √'+h2+' = '+radStr(h2),'A = '+a+' × '+radStr(h2)+' / 2','A = '+k+'√3 '+u+'²'],mistakes:ms});
  return mkGeo({svg,text:'Le triangle «ABC» est équilatéral, de côté «'+a+'» '+u+'. Calcule son aire, arrondie au <b>dixième</b>.',ask:'l\'aire (arrondie au dixième)',val:A,mode:'round',d:1,unit:u,pow:2,placeholder:'h² = 6² − 3² = 27\nh ≈ 5,196\nA = 6 × 5,196 / 2 ≈ 15,6 cm²',steps,hints,
    work:[w1,'h = √'+h2+' ≈ '+NF(hr),'A = '+a+' × '+NF(hr)+' / 2 ≈ '+NF(Math.round(A*10)/10)+' '+u+'²'],mistakes:ms});
}
TOPICS['gt-1']={kind:'gtri',level:1,label:'Aire ou périmètre d\'un triangle',gen:genTri1};
TOPICS['gt-2']={kind:'gtri',level:2,label:'Triangle rectangle',gen:genTri2};
TOPICS['gt-3']={kind:'gtri',level:3,label:'Bonne hauteur',gen:genTri3};
TOPICS['gt-4']={kind:'gtri',level:4,label:'Triangle isocèle (hauteur à calculer)',gen:genTri4};
TOPICS['gt-5']={kind:'gtri',level:5,label:'Triangle équilatéral',gen:genTri5};

/* ---------- Quadrilatères ---------- */
function genGQ1(){
  const u=uP(), sq=Math.random()<0.3, L=rnd(5,15), l=sq?L:rnd(3,L-1), ask=pick(['aire','périmètre']);
  const svg=figure([[0,0],[L,0],[L,l],[0,l]],f=>{
    const A=f([0,0]),B=f([L,0]),C=f([L,l]),D=f([0,l]),ce=cen([A,B,C,D]);
    let out=g.poly([A,B,C,D])+g.right(A,B,D,10)+g.right(B,C,A,10)+g.right(C,D,B,10)+g.right(D,A,C,10);
    if(sq) out+=g.tick(A,B,1)+g.tick(B,C,1)+g.tick(C,D,1)+g.tick(D,A,1)+g.text([(A[0]+B[0])/2,A[1]+17],L+' '+u);
    else out+=g.text([(A[0]+B[0])/2,A[1]+17],L+' '+u)+g.len(B,C,l+' '+u,ce,17);
    return out+g.vert(A,'A',ce)+g.vert(B,'B',ce)+g.vert(C,'C',ce)+g.vert(D,'D',ce);
  },(sq?'Carré':'Rectangle')+' ABCD');
  const nm=sq?'carré':'rectangle', txt=sq?'Un carré «ABCD» a pour côté «'+L+'» '+u+'.':'Un rectangle «ABCD» a pour longueur «AB = '+L+'» '+u+' et pour largeur «BC = '+l+'» '+u+'.';
  if(ask==='aire') return mkGeo({svg,text:txt+' Calcule son aire.',ask:'l\'aire du '+nm,val:L*l,unit:u,pow:2,placeholder:'A = 8 × 5\nA = 40 cm²',
    steps:[stp('Formule',M(sq?'A = c × c = c²':'A = L × l')),stp('Calcul',M('A = '+L+' × '+l+' = '+(L*l))+' '+u+'²')],hints:['L\'aire d\'un rectangle est le produit de ses deux dimensions.'],
    work:['A = '+L+' × '+l,'A = '+NF(L*l)+' '+u+'²'],
    mistakes:[{v:2*(L+l),tag:'geo-perim-aire',msg:'Tu as calculé le périmètre. L\'aire est le produit longueur × largeur.',w:['A = 2 × ('+L+' + '+l+')','A = '+NF(2*(L+l))+' '+u+'²']},{v:L+l,tag:'geo-formule',msg:'Une aire est un produit de longueurs, pas une somme.',w:['A = '+L+' + '+l,'A = '+NF(L+l)+' '+u+'²']}]});
  return mkGeo({svg,text:txt+' Calcule son périmètre.',ask:'le périmètre du '+nm,val:2*(L+l),unit:u,placeholder:'P = 2 × (8 + 5)\nP = 26 cm',
    steps:[stp('Formule',M(sq?'P = 4 × c':'P = 2 × (L + l)')),stp('Calcul',M('P = 2 × ('+L+' + '+l+') = '+2*(L+l))+' '+u)],hints:['Le périmètre est la longueur du contour : tous les côtés.'],
    work:[sq?'P = 4 × '+L:'P = 2 × ('+L+' + '+l+')','P = '+NF(2*(L+l))+' '+u],
    mistakes:[{v:L*l,tag:'geo-perim-aire',msg:'Tu as calculé l\'aire. Le périmètre est la longueur du contour.',w:['P = '+L+' × '+l,'P = '+NF(L*l)+' '+u]},{v:L+l,tag:'geo-perim-cote',msg:'Tu n\'as compté que deux côtés : il y en a quatre (deux longueurs et deux largeurs).',w:['P = '+L+' + '+l,'P = '+NF(L+l)+' '+u]}]});
}
function genGQ2(){
  const u=uP(), [d,h,s]=tripleK(20), b=rnd(Math.max(d+2,6),14), ask=pick(['aire','périmètre']);
  const svg=figure([[0,0],[b,0],[b+d,h],[d,h]],f=>{
    const A=f([0,0]),B=f([b,0]),C=f([b+d,h]),D=f([d,h]),F=f([d,0]),ce=cen([A,B,C,D]);
    return g.poly([A,B,C,D])+g.seg(D,F,'g-dash')+g.right(F,D,B,10)+g.par(A,B,1)+g.par(D,C,1)+g.par(A,D,2)+g.par(B,C,2)
      +g.text([(A[0]+B[0])/2,A[1]+17],b+' '+u)+g.len(A,D,s+' '+u,ce,22)+g.text([F[0]+9,(D[1]+F[1])/2],h+' '+u,'','start')
      +g.vert(A,'A',ce)+g.vert(B,'B',ce)+g.vert(C,'C',ce)+g.vert(D,'D',ce);
  },'Parallélogramme ABCD avec AB = '+b+', AD = '+s+' et une hauteur de '+h);
  const txt='Le parallélogramme «ABCD» a pour côtés «AB = '+b+'» '+u+' et «AD = '+s+'» '+u+'. La hauteur relative au côté «[AB]» mesure «'+h+'» '+u+'.';
  if(ask==='aire') return mkGeo({svg,text:txt+' Calcule son aire.',ask:'l\'aire du parallélogramme',val:b*h,unit:u,pow:2,
    steps:[stp('Formule',M('A = base × hauteur')+' (la hauteur est perpendiculaire à la base, ce n\'est pas le côté oblique).'),stp('Calcul',M('A = '+b+' × '+h+' = '+(b*h))+' '+u+'²')],hints:['Il faut la hauteur (le segment en pointillés), pas le côté oblique AD.'],
    work:['A = '+b+' × '+h,'A = '+NF(b*h)+' '+u+'²'],
    mistakes:[{v:b*s,tag:'geo-hauteur',msg:'Tu as multiplié par le côté oblique AD. Il faut la hauteur, perpendiculaire à la base.',w:['A = '+b+' × '+s,'A = '+NF(b*s)+' '+u+'²']},{v:b*h/2,tag:'geo-demi',msg:'Tu as divisé par 2 : c\'est la formule du triangle. Un parallélogramme vaut base × hauteur.',w:['A = '+b+' × '+h+' / 2','A = '+NF(b*h/2)+' '+u+'²']},{v:2*(b+s),tag:'geo-perim-aire',msg:'Tu as calculé le périmètre.',w:['A = 2 × ('+b+' + '+s+')','A = '+NF(2*(b+s))+' '+u+'²']}]});
  return mkGeo({svg,text:txt+' Calcule son périmètre.',ask:'le périmètre du parallélogramme',val:2*(b+s),unit:u,placeholder:'P = 2 × (9 + 5)\nP = 28 cm',
    steps:[stp('Côtés opposés égaux',M('P = 2 × (AB + AD)')+' : la hauteur n\'est pas un côté de la figure.'),stp('Calcul',M('P = 2 × ('+b+' + '+s+') = '+2*(b+s))+' '+u)],hints:['Les côtés opposés d\'un parallélogramme sont égaux. La hauteur ne fait pas partie du contour.'],
    work:['P = 2 × ('+b+' + '+s+')','P = '+NF(2*(b+s))+' '+u],
    mistakes:[{v:2*(b+h),tag:'geo-hauteur',msg:'Tu as utilisé la hauteur comme côté. Le côté oblique AD mesure '+s+' '+u+' : la hauteur n\'appartient pas au contour.',w:['P = 2 × ('+b+' + '+h+')','P = '+NF(2*(b+h))+' '+u]},{v:b*h,tag:'geo-perim-aire',msg:'Tu as calculé l\'aire.',w:['P = '+b+' × '+h,'P = '+NF(b*h)+' '+u]},{v:b+s,tag:'geo-perim-cote',msg:'Tu n\'as compté que deux côtés : il y en a quatre.',w:['P = '+b+' + '+s,'P = '+NF(b+s)+' '+u]}]});
}
function genGQ3(){
  const u=uP(), [p,q,c]=tripleK(20), sw=Math.random()<0.5, Dg=2*(sw?p:q), dg=2*(sw?q:p), ask=pick(['aire','périmètre']);
  const hp=Dg/2, hq=dg/2;
  const svg=figure([[-hp,0],[hp,0],[0,hq],[0,-hq]],f=>{
    const A=f([-hp,0]),C=f([hp,0]),B=f([0,hq]),D=f([0,-hq]),O=f([0,0]),ce=O;
    return g.poly([A,B,C,D])+g.seg(A,C,'g-dash')+g.seg(B,D,'g-dash')+g.right(O,C,B,9)+g.tick(A,B,1)+g.tick(B,C,1)+g.tick(C,D,1)+g.tick(D,A,1)
      +g.text([C[0],C[1]+22],'AC = '+Dg+' '+u,'g-u2')+g.text([B[0]+12,B[1]+4],'BD = '+dg+' '+u,'g-u2','start')
      +g.vert(A,'A',ce)+g.vert(B,'B',ce)+g.vert(C,'C',ce)+g.vert(D,'D',ce)+g.text([O[0]-7,O[1]+14],'O','g-v','end');
  },'Losange ABCD de diagonales '+Dg+' et '+dg);
  const txt='Le losange «ABCD» a pour diagonales «AC = '+Dg+'» '+u+' et «BD = '+dg+'» '+u+'.';
  if(ask==='aire') return mkGeo({svg,text:txt+' Calcule son aire.',ask:'l\'aire du losange',val:Dg*dg/2,unit:u,pow:2,
    steps:[stp('Formule',M('A = D × d / 2')+' (produit des diagonales, divisé par 2).'),stp('Calcul',M('A = '+Dg+' × '+dg+' / 2 = '+(Dg*dg/2))+' '+u+'²')],hints:['Le losange est formé de quatre triangles rectangles égaux, ou de deux triangles de base une diagonale.'],
    work:['A = '+Dg+' × '+dg+' / 2','A = '+NF(Dg*dg/2)+' '+u+'²'],
    mistakes:[{v:Dg*dg,tag:'geo-demi',msg:'Tu as oublié de diviser par 2. Le losange vaut la moitié du rectangle formé par les diagonales.',w:['A = '+Dg+' × '+dg,'A = '+NF(Dg*dg)+' '+u+'²']},{v:4*c,tag:'geo-perim-aire',msg:'Tu as calculé le périmètre.',w:['OA = '+Dg+' / 2 = '+hp,'OB = '+dg+' / 2 = '+hq,'AB² = '+hp+'² + '+hq+'² = '+(hp*hp+hq*hq),'AB = √'+(hp*hp+hq*hq)+' = '+c,'A = 4 × '+c,'A = '+NF(4*c)+' '+u+'²']}]});
  return mkGeo({svg,text:txt+' Calcule son périmètre (le côté n\'est pas donné).',ask:'le périmètre du losange',val:4*c,unit:u,placeholder:'OA = 3 ; OB = 4\nAB² = 3² + 4² = 25\nAB = 5\nP = 4 × 5 = 20 cm',
    steps:[stp('Les diagonales sont perpendiculaires et se coupent en leur milieu',M('OA = '+Dg+' / 2 = '+hp)+' et '+M('OB = '+dg+' / 2 = '+hq)),stp('Pythagore dans le triangle AOB, rectangle en O',M('AB² = '+hp+'² + '+hq+'² = '+(hp*hp+hq*hq)),M('AB = '+c)+' '+u),stp('Périmètre',M('P = 4 × '+c+' = '+4*c)+' '+u)],
    hints:['Les diagonales d\'un losange se coupent à angle droit en leur milieu : cherche un triangle rectangle.','Les quatre côtés d\'un losange sont égaux.'],
    work:['OA = '+Dg+' / 2 = '+hp,'OB = '+dg+' / 2 = '+hq,'AB² = '+hp+'² + '+hq+'² = '+(hp*hp+hq*hq),'AB = √'+(hp*hp+hq*hq)+' = '+c,'P = 4 × '+c,'P = '+NF(4*c)+' '+u],
    mistakes:[{v:2*(Dg+dg),tag:'geo-perim-cote',msg:'Les diagonales ne sont pas des côtés. Il faut calculer le côté avec Pythagore.',w:['P = 2 × ('+Dg+' + '+dg+')','P = '+NF(2*(Dg+dg))+' '+u]},{v:4*(hp+hq),tag:'geo-pyth-somme',msg:'Tu as additionné les demi-diagonales pour obtenir le côté. Le côté est l\'hypoténuse : √(OA² + OB²).',w:['OA = '+Dg+' / 2 = '+hp,'OB = '+dg+' / 2 = '+hq,'AB = '+hp+' + '+hq+' = '+(hp+hq),'P = 4 × '+(hp+hq),'P = '+NF(4*(hp+hq))+' '+u]},{v:Dg*dg/2,tag:'geo-perim-aire',msg:'Tu as calculé l\'aire.',w:['P = '+Dg+' × '+dg+' / 2','P = '+NF(Dg*dg/2)+' '+u]},{v:hp*hp+hq*hq,tag:'geo-racine',msg:'Tu as calculé AB² mais pas AB (racine carrée), et il faut ensuite multiplier par 4.',w:['OA = '+Dg+' / 2 = '+hp,'OB = '+dg+' / 2 = '+hq,'AB² = '+hp+'² + '+hq+'² = '+(hp*hp+hq*hq)]}]});
}
function genGQ4(){
  const u=uP();
  if(Math.random()<0.5){
    const B=rnd(8,16), b=rnd(3,B-3), h=rnd(3,9), x0=rnd(0,B-b);
    const svg=figure([[0,0],[B,0],[x0+b,h],[x0,h]],f=>{
      const A=f([0,0]),Bp=f([B,0]),C=f([x0+b,h]),D=f([x0,h]),F=f([x0,0]),ce=cen([A,Bp,C,D]);
      return g.poly([A,Bp,C,D])+g.seg(D,F,'g-dash')+g.right(F,D,Bp,10)+g.par(A,Bp,1)+g.par(D,C,1)+g.text([(A[0]+Bp[0])/2,A[1]+17],B+' '+u)+g.text([(D[0]+C[0])/2,D[1]-14],b+' '+u)+g.text([F[0]+9,(D[1]+F[1])/2],h+' '+u,'','start')
        +g.vert(A,'A',ce)+g.vert(Bp,'B',ce)+g.vert(C,'C',ce)+g.vert(D,'D',ce);
    },'Trapèze ABCD de bases '+B+' et '+b+' et de hauteur '+h);
    return mkGeo({svg,text:'Le trapèze «ABCD» a pour bases «AB = '+B+'» '+u+' et «DC = '+b+'» '+u+', et pour hauteur «'+h+'» '+u+'. Calcule son aire.',ask:'l\'aire du trapèze',val:(B+b)*h/2,unit:u,pow:2,placeholder:'A = (12 + 8) × 5 / 2\nA = 50 cm²',
      steps:[stp('Formule',M('A = (B + b) × h / 2')+' : moyenne des bases × hauteur.'),stp('Calcul',M('A = ('+B+' + '+b+') × '+h+' / 2 = '+NF((B+b)*h/2))+' '+u+'²')],hints:['Les deux bases sont les côtés parallèles. Additionne-les avant de multiplier par la hauteur.'],
      work:['A = ('+B+' + '+b+') × '+h+' / 2','A = '+NF((B+b)*h/2)+' '+u+'²'],
      mistakes:[{v:(B+b)*h,tag:'geo-demi',msg:'Tu as oublié de diviser par 2.',w:['A = ('+B+' + '+b+') × '+h,'A = '+NF((B+b)*h)+' '+u+'²']},{v:B*h/2,tag:'geo-formule',msg:'Tu n\'as utilisé que la grande base. Il faut additionner les deux bases.',w:['A = '+B+' × '+h+' / 2','A = '+NF(B*h/2)+' '+u+'²']},{v:(B-b)*h/2,tag:'geo-formule',msg:'Tu as soustrait les bases. On les additionne.',w:['A = ('+B+' − '+b+') × '+h+' / 2','A = '+NF((B-b)*h/2)+' '+u+'²']},{v:B*b*h/2,tag:'geo-formule',msg:'Les bases s\'additionnent, elles ne se multiplient pas.',w:['A = '+B+' × '+b+' × '+h+' / 2','A = '+NF(B*b*h/2)+' '+u+'²']}]});
  }
  const [d,h,s]=tripleK(20), b=rnd(3,10), B=b+d;
  const svg=figure([[0,0],[B,0],[b,h],[0,h]],f=>{
    const A=f([0,0]),Bp=f([B,0]),C=f([b,h]),D=f([0,h]),ce=cen([A,Bp,C,D]);
    return g.poly([A,Bp,C,D])+g.right(A,Bp,D,10)+g.right(D,A,C,10)+g.text([(A[0]+Bp[0])/2,A[1]+17],B+' '+u)+g.text([(D[0]+C[0])/2,D[1]-14],b+' '+u)+g.len(D,A,h+' '+u,ce,14)+g.len(Bp,C,'?',ce,14,'g-u')
      +g.vert(A,'A',ce)+g.vert(Bp,'B',ce)+g.vert(C,'C',ce)+g.vert(D,'D',ce);
  },'Trapèze rectangle ABCD, AB = '+B+', DC = '+b+', AD = '+h);
  return mkGeo({svg,text:'Le trapèze «ABCD» est rectangle en «A» et en «D» : «AB = '+B+'» '+u+', «DC = '+b+'» '+u+' et «AD = '+h+'» '+u+'. Calcule son périmètre (il faut d\'abord trouver «BC»).',ask:'le périmètre du trapèze',val:B+b+h+s,unit:u,
    placeholder:'Le côté BC est l\'hypoténuse d\'un triangle rectangle de côtés 8 − 3 et 12\nBC² = ...\nP = ...',
    steps:[stp('Trace la hauteur issue de C','Elle forme un triangle rectangle de côtés '+M('AB − DC = '+B+' − '+b+' = '+d)+' et '+M('AD = '+h)),stp('Pythagore',M('BC² = '+d+'² + '+h+'² = '+(d*d+h*h)),M('BC = '+s)+' '+u),stp('Périmètre',M('P = '+B+' + '+s+' + '+b+' + '+h+' = '+(B+b+h+s))+' '+u)],
    hints:['Le côté BC est oblique : sa longueur n\'est pas donnée.','Trace la parallèle à (AD) passant par C : elle coupe [AB] et crée un triangle rectangle.'],
    work:['HB = '+B+' − '+b+' = '+d,'BC² = '+d+'² + '+h+'² = '+(d*d+h*h),'BC = √'+(d*d+h*h)+' = '+s,'P = '+B+' + '+s+' + '+b+' + '+h,'P = '+NF(B+b+h+s)+' '+u],
    mistakes:[{v:B+b+2*h,tag:'geo-perim-cote',msg:'Tu as supposé que BC = AD. BC est oblique : il est plus long que AD.',w:['BC = '+h,'P = '+B+' + '+h+' + '+b+' + '+h,'P = '+NF(B+b+2*h)+' '+u]},{v:B+b+h,tag:'geo-perim-cote',msg:'Il manque un côté : le côté oblique BC.',w:['P = '+B+' + '+b+' + '+h,'P = '+NF(B+b+h)+' '+u]},{v:(B+b)*h/2,tag:'geo-perim-aire',msg:'Tu as calculé l\'aire.',w:['P = ('+B+' + '+b+') × '+h+' / 2','P = '+NF((B+b)*h/2)+' '+u]},{v:B+b+h+(B-b)+h,tag:'geo-pyth-somme',msg:'Tu as additionné les côtés du triangle rectangle au lieu de calculer l\'hypoténuse avec Pythagore.',w:['HB = '+B+' − '+b+' = '+d,'BC = '+d+' + '+h+' = '+(d+h),'P = '+B+' + '+(d+h)+' + '+b+' + '+h,'P = '+NF(B+b+h+d+h)+' '+u]}]});
}
const QUAD_PAIRS={5:[[3,4]],10:[[6,8]],13:[[5,12]],15:[[9,12]],17:[[8,15]],20:[[12,16]],25:[[7,24],[15,20]]};
function genGQ5(){
  const u=uP(), ac=pick([13,17,20,25,25]), ps=QUAD_PAIRS[ac];
  let p1=pick(ps), p2=pick(ps); if(ps.length>1&&Math.random()<0.8) p2=ps.find(x=>x!==p1)||p1;
  if(Math.random()<0.5) p1=[p1[1],p1[0]]; if(Math.random()<0.5) p2=[p2[1],p2[0]];
  const [ab,bc]=p1, [ad,dc]=p2, ask=pick(['aire','périmètre']);
  const Bp=[ab*ab/ac,ab*bc/ac], Dp=[ad*ad/ac,-ad*dc/ac];
  const svg=figure([[0,0],[ac,0],Bp,Dp],f=>{
    const A=f([0,0]),C=f([ac,0]),B=f(Bp),D=f(Dp),ce=cen([A,B,C,D]);
    return g.poly([A,B,C,D])+g.seg(A,C,'g-dash')+g.right(B,A,C,10)+g.right(D,A,C,10)
      +g.len(A,B,ab+' '+u,ce,14)+g.len(B,C,bc+' '+u,ce,14)+g.len(D,A,ad+' '+u,ce,14)+g.len(C,D,'?',ce,14,'g-u')
      +g.vert(A,'A',ce)+g.vert(B,'B',ce)+g.vert(C,'C',ce)+g.vert(D,'D',ce);
  },'Quadrilatère ABCD avec deux angles droits en B et D');
  const txt='Dans le quadrilatère «ABCD», les angles en «B» et en «D» sont droits. «AB = '+ab+'» '+u+', «BC = '+bc+'» '+u+' et «AD = '+ad+'» '+u+'. ';
  const st=[stp('Pythagore dans ABC, rectangle en B',M('AC² = '+ab+'² + '+bc+'² = '+(ab*ab+bc*bc)),M('AC = '+ac)+' '+u),stp('Pythagore dans ACD, rectangle en D',M('CD² = AC² − AD² = '+ac+'² − '+ad+'² = '+(ac*ac-ad*ad)),M('CD = '+dc)+' '+u)];
  const wAC=['AC² = '+ab+'² + '+bc+'² = '+(ab*ab+bc*bc),'AC = √'+(ab*ab+bc*bc)+' = '+ac], wCD=wAC.concat(['CD² = '+ac+'² − '+ad+'² = '+(ac*ac-ad*ad),'CD = √'+(ac*ac-ad*ad)+' = '+dc]);
  if(ask==='aire') return mkGeo({svg,text:txt+'Calcule l\'aire de «ABCD».',ask:'l\'aire du quadrilatère',val:(ab*bc+ad*dc)/2,unit:u,pow:2,placeholder:'AC² = ...\nCD² = ...\nA = ...',
    steps:st.concat([stp('Aire = somme des deux triangles rectangles',M('A = '+ab+' × '+bc+' / 2 + '+ad+' × '+dc+' / 2 = '+NF((ab*bc+ad*dc)/2))+' '+u+'²')]),
    hints:['La diagonale AC découpe le quadrilatère en deux triangles rectangles.','Calcule AC avec le premier triangle, puis CD avec le second.'],
    work:wCD.concat(['A = '+ab+' × '+bc+' / 2 + '+ad+' × '+dc+' / 2','A = '+NF((ab*bc+ad*dc)/2)+' '+u+'²']),
    mistakes:[{v:ab*bc,tag:'geo-decomp',msg:'Tu as supposé que les deux triangles sont identiques. Le second triangle a pour côtés AD et CD, à calculer.',w:['A = '+ab+' × '+bc+' / 2 + '+ab+' × '+bc+' / 2','A = '+NF(ab*bc)+' '+u+'²']},{v:ab*bc/2,tag:'geo-decomp',msg:'Tu n\'as calculé que l\'aire du triangle ABC. Il faut ajouter celle du triangle ACD.',w:['A = '+ab+' × '+bc+' / 2','A = '+NF(ab*bc/2)+' '+u+'²']},{v:ab*bc/2+ad*ac/2,tag:'geo-pyth-cote',msg:'Tu as pris AC comme côté de l\'angle droit dans ACD. Dans ce triangle, AC est l\'hypoténuse.',w:wAC.concat(['A = '+ab+' × '+bc+' / 2 + '+ad+' × '+ac+' / 2','A = '+NF(ab*bc/2+ad*ac/2)+' '+u+'²'])}]});
  return mkGeo({svg,text:txt+'Calcule le périmètre de «ABCD».',ask:'le périmètre du quadrilatère',val:ab+bc+dc+ad,unit:u,placeholder:'AC² = ...\nCD² = ...\nP = ...',
    steps:st.concat([stp('Périmètre',M('P = AB + BC + CD + DA = '+ab+' + '+bc+' + '+dc+' + '+ad+' = '+(ab+bc+dc+ad))+' '+u)]),
    hints:['Il manque le côté CD. La diagonale AC est commune aux deux triangles rectangles.'],
    work:wCD.concat(['P = '+ab+' + '+bc+' + '+dc+' + '+ad,'P = '+NF(ab+bc+dc+ad)+' '+u]),
    mistakes:[{v:2*(ab+bc),tag:'geo-decomp',msg:'Tu as supposé que le quadrilatère est symétrique (CD = AB, DA = BC). Ici CD est à calculer.',w:['P = '+ab+' + '+bc+' + '+ab+' + '+bc,'P = '+NF(2*(ab+bc))+' '+u]},{v:ab+bc+ad,tag:'geo-perim-cote',msg:'Il manque le côté CD.',w:['P = '+ab+' + '+bc+' + '+ad,'P = '+NF(ab+bc+ad)+' '+u]},{v:ab+bc+ad+ac,tag:'geo-perim-cote',msg:'La diagonale AC est à l\'intérieur de la figure : elle n\'appartient pas au contour.',w:wAC.concat(['P = '+ab+' + '+bc+' + '+ac+' + '+ad,'P = '+NF(ab+bc+ad+ac)+' '+u])},{v:(ab*bc+ad*dc)/2,tag:'geo-perim-aire',msg:'Tu as calculé l\'aire.',w:wCD.concat(['P = '+ab+' × '+bc+' / 2 + '+ad+' × '+dc+' / 2','P = '+NF((ab*bc+ad*dc)/2)+' '+u])}]});
}
TOPICS['gq-1']={kind:'gquad',level:1,label:'Rectangle et carré',gen:genGQ1};
TOPICS['gq-2']={kind:'gquad',level:2,label:'Parallélogramme',gen:genGQ2};
TOPICS['gq-3']={kind:'gquad',level:3,label:'Losange',gen:genGQ3};
TOPICS['gq-4']={kind:'gquad',level:4,label:'Trapèze',gen:genGQ4};
TOPICS['gq-5']={kind:'gquad',level:5,label:'Quadrilatère découpé en triangles',gen:genGQ5};
