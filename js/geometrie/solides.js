'use strict';
/* ===== Géométrie : solides et volumes (pavé, cylindre, cône, pyramide, sphère, pièces composées) ===== */
Object.assign(TAGS,{
  'geo-vol-aire':{label:'Volume et aire confondus',tip:'Un volume (cm³) se calcule avec trois dimensions (aire de la base × hauteur…). Une aire de surface (cm²) additionne des aires de faces. Ce sont deux grandeurs différentes.'},
  'geo-vol-formule':{label:'Formule du volume',tip:'Pavé : L × l × h. Cylindre : πr² × h. Cône et pyramide : (aire de la base × h) / 3. Boule : 4/3 × πr³. Le rayon est au carré (ou au cube pour la boule).'},
  'geo-tiers':{label:'Facteur 1/3 (cône, pyramide)',tip:'Le cône et la pyramide occupent le tiers du volume du cylindre ou du prisme de même base et de même hauteur : V = (aire de la base × h) / 3.'},
  'geo-unites-vol':{label:'Unités de volume',tip:'1 L = 1 dm³ = 1 000 cm³ et 1 m³ = 1 000 L. Pour passer de cm³ à des litres on divise par 1 000.'}
});
const S3E=0.28;
const S3arc=(f,c,r,front)=>{ const L=f([c[0]-r,c[1]]), R=f([c[0]+r,c[1]]), sc=f.s; return 'M'+gf(L[0])+' '+gf(L[1])+' A'+gf(r*sc)+' '+gf(S3E*r*sc)+' 0 0 '+(front?0:1)+' '+gf(R[0])+' '+gf(R[1]); };
const S3ell=(f,c,r)=>{ const L=f([c[0]-r,c[1]]), R=f([c[0]+r,c[1]]), sc=f.s, a=gf(r*sc)+' '+gf(S3E*r*sc); return 'M'+gf(L[0])+' '+gf(L[1])+' A'+a+' 0 0 0 '+gf(R[0])+' '+gf(R[1])+' A'+a+' 0 0 0 '+gf(L[0])+' '+gf(L[1])+' Z'; };
const S3P=P=>gf(P[0])+' '+gf(P[1]);
/* pavé : dimensions d'affichage normalisées */
function drawBox3(f,dL,dh,dd){
  const v=[dd*0.62,dd*0.46], A=f([0,0]), B=f([dL,0]), C=f([dL,dh]), D=f([0,dh]), A2=f([v[0],v[1]]), B2=f([dL+v[0],v[1]]), C2=f([dL+v[0],dh+v[1]]), D2=f([v[0],dh+v[1]]);
  let out=g.path('M'+S3P(A)+' L'+S3P(B)+' L'+S3P(C)+' L'+S3P(D)+' Z','g-f')+g.path('M'+S3P(D)+' L'+S3P(C)+' L'+S3P(C2)+' L'+S3P(D2)+' Z','g-f g-hl')+g.path('M'+S3P(B)+' L'+S3P(C)+' L'+S3P(C2)+' L'+S3P(B2)+' Z','g-f g-hl');
  out+=g.seg(A,A2,'g-dash g-thin')+g.seg(A2,B2,'g-dash g-thin')+g.seg(A2,D2,'g-dash g-thin');
  return {out,A,B,C,D,B2,C2,D2,ce:f([dL/2+v[0]/2,dh/2+v[1]/2])};
}
function pavSvg(L,l,h,labs,alt,mid){
  const mx=Math.max(L,l,h), n=x=>Math.max(1.6,4.4*x/mx);
  const dL=n(L), dh=n(h), dd=n(l)*0.8;
  return figure([[0,0],[dL+dd*0.62,dh+dd*0.46]],f=>{
    const b=drawBox3(f,dL,dh,dd); let o=b.out;
    o+=g.len(b.A,b.B,labs[0],b.ce,10)+g.len(b.A,b.D,labs[2],b.ce,10)+g.len(b.B,b.B2,labs[1],b.ce,9);
    if(mid) o+=g.text(vmid(b.A,b.C),mid,'g-u');
    return o;
  },alt,{H:230,pad:30});
}
function cylSvg(r,h,lab,alt,o){
  o=o||{};
  return figure([[-r*1.1,-r*S3E*1.1],[r*1.1,h+r*S3E*1.1+(o.hemi?r:0)]],f=>{
    const BL=f([-r,0]), BR=f([r,0]), TL=f([-r,h]), TR=f([r,h]), sc=f.s, rs=r*sc, ce=f([0,h/2]), eRx=gf(rs)+' '+gf(S3E*rs);
    let body;
    if(o.hemi) body='M'+S3P(BL)+' L'+S3P(TL)+' A'+gf(rs)+' '+gf(rs)+' 0 0 1 '+S3P(TR)+' L'+S3P(BR)+' A'+eRx+' 0 0 1 '+S3P(BL)+' Z';
    else body='M'+S3P(TL)+' L'+S3P(BL)+' A'+eRx+' 0 0 0 '+S3P(BR)+' L'+S3P(TR)+' A'+eRx+' 0 0 0 '+S3P(TL)+' Z';
    let out=g.path(body,'g-f');
    if(!o.hemi) out+=g.path(S3ell(f,[0,h],r),'g-f g-hl');
    out+=dashArc(S3arc(f,[0,0],r,false));
    if(o.hemi) out+=dashArc(S3arc(f,[0,h],r,true)); 
    if(o.hole){ out+=g.path(S3ell(f,[0,h],o.hole),'g-f g-hole')+dashArc(S3arc(f,[0,0],o.hole,false)); }
    const cT=f([0,h]), eT=f([o.hole||r,h]);
    if(String(lab[0])[0]==='Ø'){ const eL=f([-r,h]); out+=g.seg(eL,eT,'g-thin')+g.dot(cT)+g.text(vadd(cT,[0,-10]),lab[0],'g-u2'); }
    else out+=g.seg(cT,eT,'g-thin')+g.dot(cT)+g.text(vadd(vmid(cT,eT),[0,-9]),lab[0],'g-u2');
    
    out+=g.len(BL,TL,lab[1],ce,10);
    if(o.hemiTxt) out+=g.text(vadd(f([0,h+r/2]),[0,0]),o.hemiTxt,'g-u2');
    return out;
  },alt,{H:o.H||250,pad:30});
}
function coneSvg(r,H,labs,alt,o){
  o=o||{};
  return figure([[-r*1.1,-r*S3E*1.1],[r*1.1+(o.cyl?0:0),H+(o.cyl?o.cyl:0)+0.2]],f=>{
    const BL=f([-r,0]), BR=f([r,0]), sc=f.s, rs=r*sc, eRx=gf(rs)+' '+gf(S3E*rs), Ap=f([0,H]), O=f([0,0]), ce=f([0,H/2]);
    let out=g.path('M'+S3P(Ap)+' L'+S3P(BL)+' A'+eRx+' 0 0 0 '+S3P(BR)+' Z','g-f')+dashArc(S3arc(f,[0,0],r,false));
    out+=g.seg(Ap,O,'g-dash g-thin')+g.dot(O)+g.right(O,Ap,BR,8);
    if(labs[0]!=null){ const e=f([r,0]); out+=g.seg(O,e,'g-thin')+g.text(vadd(vmid(O,e),[0,10]),labs[0],'g-u2'); }
    if(labs[1]!=null) out+=g.text(vadd(vadd(O,vmul(vsub(Ap,O),0.35)),[9,0]),labs[1],'g-u2','start');
    if(labs[2]!=null) out+=g.len(Ap,BR,labs[2],ce,10);
    return out;
  },alt,{H:240,pad:30});
}
function pyrSvg(c,H,labs,alt){
  const dc=3.4, vx=1.5, vy=1.0, hh=3.4;
  return figure([[0,0],[dc+vx,hh+0.2]],f=>{
    const A=f([0,0]), B=f([dc,0]), C=f([dc+vx,vy]), D=f([vx,vy]), cen_=f([(dc+vx)/2,vy/2]), P=f([(dc+vx)/2,vy/2+hh]), Mab=f([dc/2,0]), ce=f([(dc+vx)/2,hh/3]);
    let out=g.path('M'+S3P(A)+' L'+S3P(B)+' L'+S3P(P)+' Z','g-f')+g.path('M'+S3P(B)+' L'+S3P(C)+' L'+S3P(P)+' Z','g-f g-hl');
    out+=g.seg(A,D,'g-dash g-thin')+g.seg(D,C,'g-dash g-thin')+g.seg(D,P,'g-dash g-thin')+g.seg(P,cen_,'g-dash g-thin')+g.dot(cen_);
    out+=g.len(A,B,labs[0],ce,10);
    if(labs[1]!=null) out+=g.text(vadd(vmid(P,cen_),[9,0]),labs[1],'g-u2','start');
    if(labs[2]!=null){ out+=g.seg(P,Mab,'g-thin')+g.dot(Mab)+g.text(vadd(vadd(P,vmul(vsub(Mab,P),0.6)),[10,0]),labs[2],'g-u2','start'); }
    return out;
  },alt,{H:240,pad:30});
}
function sphSvg(r,lab,alt,o){
  o=o||{};
  return figure([[-r,-r],[r,r+(o.cube?0:0)]],f=>{
    const C0=f([0,0]), sc=f.s; let out='';
    if(o.cube){ const q=f([-r,-r]), q2=f([r,r]); out+='<rect class="g-l" fill="none" x="'+gf(q[0])+'" y="'+gf(q2[1])+'" width="'+gf(q2[0]-q[0])+'" height="'+gf(q[1]-q2[1])+'"/>'; }
    out+=g.circle(C0,r*sc,'')+dashArc(S3arc(f,[0,0],r,false))+'<path class="g-l g-thin" fill="none" d="'+S3arc(f,[0,0],r,true)+'"/>'+g.dot(C0);
    const e=f([r,0]); out+=g.seg(C0,e,'g-thin')+g.text(vadd(vmid(C0,e),[0,-9]),lab,'g-u2');
    return out;
  },alt,{H:o.cube?240:230,pad:30});
}

const t3=(s)=>s; // lisibilité
const volU=(u)=>u+'³';

/* ----- gs-1 : pavé droit et cube : volume, aire totale ----- */
function genPave(){
  const cube=Math.random()<0.3, ask=pick(['volume','aire','volume']), u=uP();
  let a,L,l,h;
  if(cube){ a=rnd(2,9); L=l=h=a; } else { do{ L=rnd(4,12); l=rnd(2,8); h=rnd(2,9); }while(L===l||l===h||L===h); }
  const svg=cube?pavSvg(a,a,a,[a,a,a],'Cube d\'arête '+a):pavSvg(L,l,h,[L,l,h],'Pavé droit de longueur '+L+', largeur '+l+' et hauteur '+h);
  const txt=cube?'Un cube a pour arête «'+a+'» '+u+'. ':'Un pavé droit mesure «'+L+'» '+u+' de long, «'+l+'» '+u+' de large et «'+h+'» '+u+' de haut. ';
  if(ask==='volume'){
    const V=L*l*h;
    return mkGeo({svg,val:V,unit:u,pow:3,text:txt+'Calcule son <b>volume</b>.',ask:'le volume',placeholder:cube?'V = 4 × 4 × 4\nV = 64 cm³':'V = 8 × 5 × 3\nV = 120 cm³',
      work:cube?['V = '+a+'³ = '+V+' '+volU(u)]:['V = '+L+' × '+l+' × '+h+' = '+V+' '+volU(u)],
      steps:[stp('Formule',cube?'Volume d\'un cube : arête × arête × arête, soit '+M('a³')+'.':'Volume d\'un pavé droit : '+M('longueur × largeur × hauteur')+'.'),stp('Calcul',M(cube?'V = '+a+'³ = '+V:'V = '+L+' × '+l+' × '+h+' = '+V)+' '+volU(u))],
      hints:['Le volume d\'un pavé droit est le produit de ses trois dimensions.'],
      mistakes:(cube?[{v:3*a,tag:'geo-vol-formule',msg:'Le volume est un produit : a × a × a (et non 3 × a).',w:['V = 3 × '+a+' = '+3*a]},{v:a*a,tag:'geo-vol-formule',msg:'a × a est l\'aire d\'une face. Le volume demande une troisième dimension : a³.',w:['V = '+a+' × '+a+' = '+a*a]},{v:6*a*a,tag:'geo-vol-aire',msg:'Tu as calculé l\'aire totale (6 faces). Le volume est a³.',w:['A = 6 × '+a+'² = '+6*a*a]}]
        :[{v:L+l+h,tag:'geo-vol-formule',msg:'Les dimensions se multiplient, elles ne s\'additionnent pas.',w:['V = '+L+' + '+l+' + '+h+' = '+(L+l+h)]},{v:L*l,tag:'geo-vol-formule',msg:'L × l est l\'aire de la base. Il faut encore multiplier par la hauteur.',w:['V = '+L+' × '+l+' = '+L*l]},{v:2*(L*l+L*h+l*h),tag:'geo-vol-aire',msg:'Tu as calculé l\'aire totale. Le volume est le produit des trois dimensions.',w:['A = 2 × ('+L*l+' + '+L*h+' + '+l*h+') = '+2*(L*l+L*h+l*h)]}])});
  }
  const A=cube?6*a*a:2*(L*l+L*h+l*h), faces=cube?[a*a]:[L*l,L*h,l*h];
  return mkGeo({svg,val:A,unit:u,pow:2,text:txt+'Calcule son <b>aire totale</b> (la somme de l\'aire de toutes les faces).',ask:'l\'aire totale',placeholder:cube?'A = 6 × 4²\nA = 96 cm²':'A = 2 × (8×5 + 8×3 + 5×3)\nA = 158 cm²',
    work:cube?['A = 6 × '+a+'² = '+A+' '+u+'²']:['faces : '+L+' × '+l+' = '+L*l+' ; '+L+' × '+h+' = '+L*h+' ; '+l+' × '+h+' = '+l*h,'A = 2 × ('+L*l+' + '+L*h+' + '+l*h+') = '+A+' '+u+'²'],
    steps:[stp('Les faces',cube?'Un cube a 6 faces carrées de côté '+M(a)+' : '+M(a+'² = '+a*a)+' chacune.':'Un pavé a 6 faces, identiques deux à deux : '+M(L+' × '+l+' = '+L*l)+', '+M(L+' × '+h+' = '+L*h)+' et '+M(l+' × '+h+' = '+l*h)+'.'),stp('Aire totale',cube?M('A = 6 × '+a*a+' = '+A)+' '+u+'²':M('A = 2 × ('+L*l+' + '+L*h+' + '+l*h+') = '+A)+' '+u+'²')],
    hints:[cube?'6 faces carrées identiques.':'Les 6 faces sont identiques deux à deux : calcule les trois aires différentes et multiplie leur somme par 2.'],
    mistakes:(cube?[{v:a*a,tag:'geo-vol-formule',msg:'Tu as compté une seule face : il y en a 6.',w:['A = '+a+'² = '+a*a]},{v:4*a*a,tag:'geo-vol-formule',msg:'Tu as oublié le dessus et le dessous (4 faces au lieu de 6).',w:['A = 4 × '+a+'² = '+4*a*a]},{v:a*a*a,tag:'geo-vol-aire',msg:'Tu as calculé le volume. L\'aire totale additionne les 6 faces.',w:['V = '+a+'³ = '+a**3]}]
      :[{v:L*l+L*h+l*h,tag:'geo-vol-formule',msg:'Chaque aire apparaît deux fois (dessus/dessous, avant/arrière, gauche/droite) : multiplie la somme par 2.',w:['A = '+L*l+' + '+L*h+' + '+l*h+' = '+(L*l+L*h+l*h)]},{v:L*l*h,tag:'geo-vol-aire',msg:'Tu as calculé le volume. L\'aire totale additionne les aires des faces.',w:['V = '+L+' × '+l+' × '+h+' = '+L*l*h]},{v:2*(L*l+L*h),tag:'geo-vol-formule',msg:'Il manque la face '+l+' × '+h+' (et son opposée) : un pavé a trois paires de faces.',w:['A = 2 × ('+L*l+' + '+L*h+') = '+2*(L*l+L*h)]}])});
}

/* ----- gs-2 : contenances et unités de volume ----- */
function genContenance(){
  const t=pick(['cm3L','Lcm3','dm3L','m3L']);
  if(t==='cm3L'){
    const D=[10,12,15,20,25,30,40,50], pk=()=>pick(D); let L=pk(),l=pk(),h=pk(); while(L===l||l===h||L===h){ L=pk(); l=pk(); h=pk(); }
    const V=L*l*h, ans=V/1000;
    return mkGeo({svg:pavSvg(L,l,h,[L,l,h],'Bac de '+L+' sur '+l+' sur '+h+' centimètres'),val:ans,unit:'',pow:1,
      text:'Un bac a la forme d\'un pavé droit de «'+L+'» cm de long, «'+l+'» cm de large et «'+h+'» cm de haut. Combien de <b>litres</b> peut-il contenir ?',ask:'la contenance en litres',placeholder:'V = 30 × 20 × 15 = 9000 cm³\nV = 9 L',
      work:['V = '+L+' × '+l+' × '+h+' = '+V+' cm³','1 L = 1000 cm³','V = '+V+' / 1000 = '+NF(ans)+' L'],
      steps:[stp('Volume en cm³',M(L+' × '+l+' × '+h+' = '+V)+' cm³'),stp('Conversion','1 L = 1 dm³ = 1 000 cm³ : on divise par 1 000.',M(V+' / 1000 = '+NF(ans))+' L')],
      hints:['Calcule d\'abord le volume en cm³, puis convertis : 1 litre = 1 000 cm³.'],
      mistakes:[{v:V,tag:'geo-unites-vol',msg:'C\'est le volume en cm³. Pour avoir des litres, divise par 1 000.',w:['V = '+V+' cm³']},{v:V/100,tag:'geo-unites-vol',msg:'1 L = 1 000 cm³ (et non 100 cm³).',w:['V = '+V+' / 100 = '+NF(V/100)+' L']},{v:V/10,tag:'geo-unites-vol',msg:'1 L = 1 000 cm³ : divise par 1 000.',w:['V = '+V+' / 10 = '+NF(V/10)+' L']},{v:V/1000000,tag:'geo-unites-vol',msg:'1 L vaut 1 000 cm³ (1 million de cm³ = 1 m³).',w:['V = '+V+' / 1000000 = '+NF(V/1e6)+' L']}]});
  }
  if(t==='Lcm3'){
    const q=pick([0.25,0.5,0.75,1.5,2,2.5,3,0.33,1.2]);
    return mkGeo({svg:pavSvg(10,6,8,['','',''],'Récipient',''),val:q*1000,unit:'',pow:1,
      text:'Un récipient contient «'+NF(q)+'» litre'+(q>1?'s':'')+' d\'huile. Exprime ce volume en <b>cm³</b>.',ask:'le volume en cm³',placeholder:'V = 1,5 × 1000\nV = 1500 cm³',
      work:['1 L = 1000 cm³','V = '+NF(q)+' × 1000 = '+NF(q*1000)+' cm³'],
      steps:[stp('Conversion','1 L = 1 dm³ = 1 000 cm³ : on multiplie par 1 000.',M(NF(q)+' × 1000 = '+NF(q*1000))+' cm³')],
      hints:['1 litre = 1 000 cm³.'],
      mistakes:[{v:q*100,tag:'geo-unites-vol',msg:'1 L = 1 000 cm³ (et non 100).',w:['V = '+NF(q)+' × 100 = '+NF(q*100)]},{v:q*10,tag:'geo-unites-vol',msg:'1 L = 1 000 cm³ : multiplie par 1 000.',w:['V = '+NF(q)+' × 10 = '+NF(q*10)]},{v:q/1000,tag:'geo-unites-vol',msg:'Pour aller vers la petite unité (cm³), on multiplie.',w:['V = '+NF(q)+' / 1000 = '+NF(q/1000)]}]});
  }
  if(t==='dm3L'){
    let L=rnd(3,12), l=rnd(2,8), h=rnd(2,9); while(L===l||l===h||L===h){ L=rnd(3,12); l=rnd(2,8); h=rnd(2,9); }
    const V=L*l*h;
    return mkGeo({svg:pavSvg(L,l,h,[L,l,h],'Aquarium de '+L+' sur '+l+' sur '+h+' décimètres'),val:V,unit:'',pow:1,
      text:'Un aquarium a la forme d\'un pavé droit de «'+L+'» dm de long, «'+l+'» dm de large et «'+h+'» dm de haut. Combien de <b>litres</b> d\'eau contient-il quand il est plein ?',ask:'la contenance en litres',placeholder:'V = 8 × 4 × 5 = 160 dm³\nV = 160 L',
      work:['V = '+L+' × '+l+' × '+h+' = '+V+' dm³','1 dm³ = 1 L','V = '+V+' L'],
      steps:[stp('Volume en dm³',M(L+' × '+l+' × '+h+' = '+V)+' dm³'),stp('Conversion','1 dm³ = 1 L : le nombre ne change pas.',M(V)+' L')],
      hints:['1 dm³ correspond exactement à 1 litre.'],
      mistakes:[{v:V*1000,tag:'geo-unites-vol',msg:'Les dimensions sont déjà en dm : 1 dm³ = 1 L, il n\'y a rien à multiplier.',w:['V = '+V+' × 1000 = '+V*1000]},{v:V/1000,tag:'geo-unites-vol',msg:'Les dimensions sont en dm : 1 dm³ = 1 L (la division par 1 000 sert pour des cm³).',w:['V = '+V+' / 1000 = '+NF(V/1000)]},{v:L+l+h,tag:'geo-vol-formule',msg:'Le volume est le produit des trois dimensions.',w:['V = '+L+' + '+l+' + '+h]}]});
  }
  const m3=pick([0.5,1.2,1.5,2,2.5,3,4.5,0.8]);
  return mkGeo({svg:pavSvg(10,6,8,['','',''],'Citerne',''),val:m3*1000,unit:'',pow:1,
    text:'Une citerne a un volume de «'+NF(m3)+'» m³. Exprime sa contenance en <b>litres</b>.',ask:'la contenance en litres',placeholder:'V = 2 × 1000\nV = 2000 L',
    work:['1 m³ = 1000 dm³ = 1000 L','V = '+NF(m3)+' × 1000 = '+NF(m3*1000)+' L'],
    steps:[stp('Conversion','1 m³ = 1 000 dm³ = 1 000 L.',M(NF(m3)+' × 1000 = '+NF(m3*1000))+' L')],
    hints:['1 m³ = 1 000 dm³ et 1 dm³ = 1 L.'],
    mistakes:[{v:m3*100,tag:'geo-unites-vol',msg:'1 m³ = 1 000 L (et non 100).',w:['V = '+NF(m3)+' × 100']},{v:m3*1e6,tag:'geo-unites-vol',msg:'1 m³ = 1 000 L ; 1 million est le nombre de cm³.',w:['V = '+NF(m3)+' × 1000000']},{v:m3/1000,tag:'geo-unites-vol',msg:'Le litre est plus petit que le m³ : on multiplie.',w:['V = '+NF(m3)+' / 1000']}]});
}

/* ----- gs-3 : cylindre (valeur exacte) ----- */
function genCylindre(){
  const r=rnd(2,8), h=rnd(3,12), ask=pick(['volume','latérale','totale']), u=uP(), useD=Math.random()<0.4, d=2*r;
  const svg=cylSvg(r,h,[useD?'Ø '+d:r,h],'Cylindre de hauteur '+h);
  const txt='Un cylindre de révolution a un '+(useD?'diamètre de «'+d+'» '+u:'rayon de «'+r+'» '+u)+' et une hauteur de «'+h+'» '+u+'. ';
  const R0=useD?['r = '+d+' / 2 = '+r]:[], R1=useD?stp('Rayon','Le diamètre est '+M(d)+' : le rayon est la moitié, '+M('r = '+d+' / 2 = '+r)+'.'):null;
  const pre=s=>R1?[R1].concat(s):s, rr=useD?d:r;
  if(ask==='volume'){
    const b=r*r*h;
    return mkGeo({svg,mode:'pi',val:pib(0,b),unit:u,pow:3,text:txt+'Calcule son <b>volume</b>. Donne la <b>valeur exacte</b>.',ask:'le volume (valeur exacte)',placeholder:'V = π × 3² × 5\nV = 45π cm³',
      work:R0.concat(['V = π × '+r+'² × '+h+' = '+kPi(b)+' '+volU(u)]),
      steps:pre([stp('Formule','Volume = aire de la base × hauteur : '+M('V = πr² × h')+'.'),stp('Calcul',M('V = π × '+r+'² × '+h+' = '+kPi(b))+' '+volU(u)+' ≈ '+NF(Math.round(b*Math.PI*100)/100)+' '+volU(u))]),
      hints:['La base est un disque de rayon r : son aire vaut πr².','Volume du cylindre : πr² × h.'],
      mistakes:[{v:pib(0,r*h),tag:'geo-vol-formule',msg:'Le rayon est au carré dans l\'aire de la base : πr².',w:R0.concat(['V = π × '+r+' × '+h+' = '+kPi(r*h)])},{v:pib(0,4*r*r*h),tag:'geo-rayon',msg:'Tu as utilisé le diamètre à la place du rayon.',w:['V = π × '+d+'² × '+h+' = '+kPi(4*r*r*h)]},{v:pib(0,r*r*h/3),tag:'geo-tiers',msg:'Le facteur 1/3 est pour le cône et la pyramide, pas pour le cylindre.',w:['V = π × '+r+'² × '+h+' / 3']},{v:pib(0,2*r*h),tag:'geo-vol-aire',msg:'2πrh est l\'aire latérale. Le volume est πr²h.',w:['A = 2π × '+r+' × '+h+' = '+kPi(2*r*h)]}]});
  }
  if(ask==='latérale'){
    const b=2*r*h;
    return mkGeo({svg,mode:'pi',val:pib(0,b),unit:u,pow:2,text:txt+'Calcule son <b>aire latérale</b> (sans les deux disques). Donne la <b>valeur exacte</b>.',ask:'l\'aire latérale (valeur exacte)',placeholder:'A = 2π × 3 × 5\nA = 30π cm²',
      work:R0.concat(['A = 2π × '+r+' × '+h+' = '+kPi(b)+' '+u+'²']),
      steps:pre([stp('Idée','Déroulée, la surface latérale est un rectangle : sa largeur est le périmètre de la base '+M('2πr')+' et sa hauteur est '+M('h')+'.'),stp('Calcul',M('A = 2π × '+r+' × '+h+' = '+kPi(b))+' '+u+'²')]),
      hints:['Développe la surface latérale : un rectangle de longueur 2πr et de largeur h.'],
      mistakes:[{v:pib(0,r*h),tag:'geo-aire-pi',msg:'Le périmètre de la base est 2πr (et non πr).',w:R0.concat(['A = π × '+r+' × '+h+' = '+kPi(r*h)])},{v:pib(0,r*r*h),tag:'geo-vol-aire',msg:'πr²h est le volume. L\'aire latérale est 2πrh.',w:['V = π × '+r+'² × '+h]},{v:pib(0,2*r*(r+h)),tag:'geo-vol-formule',msg:'Tu as ajouté les deux disques : ils ne font pas partie de l\'aire latérale.',w:['A = 2π × '+r+' × ('+r+' + '+h+') = '+kPi(2*r*(r+h))]},{v:pib(0,4*r*h),tag:'geo-rayon',msg:'Tu as utilisé le diamètre à la place du rayon.',w:['A = 2π × '+d+' × '+h+' = '+kPi(4*r*h)]}]});
  }
  const b=2*r*(r+h);
  return mkGeo({svg,mode:'pi',val:pib(0,b),unit:u,pow:2,text:txt+'Calcule son <b>aire totale</b> (surface latérale et deux disques). Donne la <b>valeur exacte</b>.',ask:'l\'aire totale (valeur exacte)',placeholder:'A = 2π × 3 × 5 + 2 × π × 3²\nA = 48π cm²',
    work:R0.concat(['latérale : 2π × '+r+' × '+h+' = '+kPi(2*r*h),'deux disques : 2 × π × '+r+'² = '+kPi(2*r*r),'A = '+kPi(2*r*h)+' + '+kPi(2*r*r)+' = '+kPi(b)+' '+u+'²']),
    steps:pre([stp('Surface latérale',M('2π × '+r+' × '+h+' = '+kPi(2*r*h))),stp('Deux disques',M('2 × π × '+r+'² = '+kPi(2*r*r))),stp('Aire totale',M('A = '+kPi(2*r*h)+' + '+kPi(2*r*r)+' = '+kPi(b))+' '+u+'²')]),
    hints:['Aire totale = surface latérale + les deux bases (haut et bas).'],
    mistakes:[{v:pib(0,2*r*h),tag:'geo-vol-formule',msg:'Il manque les deux disques (haut et bas).',w:R0.concat(['A = 2π × '+r+' × '+h+' = '+kPi(2*r*h)])},{v:pib(0,r*r+2*r*h),tag:'geo-vol-formule',msg:'Un cylindre a deux bases : 2πr², pas πr².',w:R0.concat(['A = '+kPi(2*r*h)+' + '+kPi(r*r)+' = '+kPi(r*r+2*r*h)])},{v:pib(0,r*r*h),tag:'geo-vol-aire',msg:'Tu as calculé le volume. L\'aire totale additionne des aires.',w:['V = π × '+r+'² × '+h]},{v:pib(0,2*r*r*h),tag:'geo-vol-formule',msg:'Les deux aires s\'additionnent, elles ne se multiplient pas.',w:['A = 2π'+r+' × '+h+' × '+r]}]});
}

/* ----- gs-4 : cône et pyramide ----- */
function genConePyr(){
  const t=pick(['cone-h','cone-s','pyr-h','pyr-a']), u=uP();
  if(t==='cone-h'){
    const r=rnd(2,8), H=rnd(3,12), N=r*r*H, ex=fr3(N);
    return mkGeo({svg:coneSvg(r,H,[r,H,null],'Cône de rayon '+r+' et de hauteur '+H),mode:'pi',exact:ex,val:pib(0,N/3),unit:u,pow:3,text:'Un cône de révolution a un rayon de base de «'+r+'» '+u+' et une hauteur de «'+H+'» '+u+'. Calcule son <b>volume</b>. Donne la <b>valeur exacte</b>.',ask:'le volume (valeur exacte)',placeholder:'V = π × 3² × 4 / 3\nV = 12π cm³',
      work:['V = π × '+r+'² × '+H+' / 3 = '+ex+' '+volU(u)],
      steps:[stp('Formule','Le volume d\'un cône est le tiers de celui du cylindre de même base : '+M('V = πr² × h / 3')+'.'),stp('Calcul',M('V = π × '+r+'² × '+H+' / 3 = '+ex)+' '+volU(u))],
      hints:['Cône : V = (aire de la base × hauteur) / 3.'],
      mistakes:[{v:pib(0,N),tag:'geo-tiers',msg:'Le volume du cône est le tiers de πr²h : n\'oublie pas de diviser par 3.',w:['V = π × '+r+'² × '+H+' = '+kPi(N)]},{v:pib(0,r*H/3),tag:'geo-vol-formule',msg:'Le rayon est au carré : πr².',w:['V = π × '+r+' × '+H+' / 3']},{v:pib(0,4*N/3),tag:'geo-rayon',msg:'Le rayon est '+r+' (c\'est lui qu\'on met au carré).',w:['V = π × '+2*r+'² × '+H+' / 3']},{v:pib(0,N/2),tag:'geo-tiers',msg:'C\'est un tiers (÷ 3), pas une moitié.',w:['V = π × '+r+'² × '+H+' / 2']}]});
  }
  if(t==='cone-s'){
    const [p,q,s0]=pick([[3,4,5],[4,3,5],[6,8,10],[5,12,13],[9,12,15],[8,6,10]]), r=p, H=q, s=s0, ask=pick(['volume','aire']);
    const svg=coneSvg(r,H,[r,null,s],'Cône de rayon '+r+' et de génératrice '+s);
    const base='Un cône de révolution a un rayon de base de «'+r+'» '+u+' et une génératrice (côté oblique) de «'+s+'» '+u+'. ';
    if(ask==='volume'){
      const N=r*r*H, ex=fr3(N), WH='H = √('+s+'² − '+r+'²) = '+H;
      return mkGeo({svg,mode:'pi',exact:ex,val:pib(0,N/3),unit:u,pow:3,text:base+'Calcule son <b>volume</b>. Donne la <b>valeur exacte</b> (la hauteur n\'est pas donnée).',ask:'le volume (valeur exacte)',placeholder:'H = ...\nV = ...',
        work:[WH,'V = π × '+r+'² × '+H+' / 3 = '+ex+' '+volU(u)],
        steps:[stp('Hauteur du cône','La hauteur, le rayon et la génératrice forment un triangle rectangle (l\'hypoténuse est la génératrice) :',M('H = √('+s+'² − '+r+'²) = √'+(s*s-r*r)+' = '+H)),stp('Volume',M('V = π × '+r+'² × '+H+' / 3 = '+ex)+' '+volU(u))],
        hints:['Dans le triangle rectangle formé par la hauteur, le rayon et la génératrice, la génératrice est l\'hypoténuse.'],
        mistakes:[{v:pib(0,r*r*s/3),tag:'geo-pyth-cote',msg:'La génératrice n\'est pas la hauteur : H = √('+s+'² − '+r+'²) = '+H+'.',w:['V = π × '+r+'² × '+s+' / 3 = '+fr3(r*r*s)]},{v:pib(0,N),tag:'geo-tiers',msg:'N\'oublie pas de diviser par 3.',w:[WH,'V = π × '+r+'² × '+H+' = '+kPi(N)]},{v:pib(0,r*r*(s-r)/3),tag:'geo-pyth-somme',msg:'Pythagore s\'applique aux carrés : H² = '+s+'² − '+r+'².',w:['H = '+s+' − '+r+' = '+(s-r),'V = π × '+r+'² × '+(s-r)+' / 3']}]});
    }
    return mkGeo({svg,mode:'pi',val:pib(0,r*s),unit:u,pow:2,text:base+'Calcule son <b>aire latérale</b>. Donne la <b>valeur exacte</b>.',ask:'l\'aire latérale (valeur exacte)',placeholder:'A = π × 3 × 5\nA = 15π cm²',
      work:['A = π × '+r+' × '+s+' = '+kPi(r*s)+' '+u+'²'],
      steps:[stp('Formule','Aire latérale d\'un cône : '+M('π × r × g')+' (g = génératrice).'),stp('Calcul',M('A = π × '+r+' × '+s+' = '+kPi(r*s))+' '+u+'²')],
      hints:['Aire latérale du cône : π × rayon × génératrice.'],
      mistakes:[{v:pib(0,r*H),tag:'geo-pyth-cote',msg:'Il faut la génératrice ('+s+'), pas la hauteur ('+H+').',w:['A = π × '+r+' × '+H+' = '+kPi(r*H)]},{v:pib(0,r*(r+s)),tag:'geo-vol-formule',msg:'Tu as ajouté le disque de base : l\'aire latérale n\'en tient pas compte.',w:['A = π × '+r+' × ('+r+' + '+s+')']},{v:pib(0,2*r*s),tag:'geo-aire-pi',msg:'L\'aire latérale du cône est πrg (pas 2πrg).',w:['A = 2π × '+r+' × '+s]},{v:pib(0,r*r*H/3),tag:'geo-vol-aire',msg:'Tu as calculé le volume.',w:['V = π × '+r+'² × '+H+' / 3']}]});
  }
  if(t==='pyr-h'){
    const c=rnd(3,10), H=c%3===0?rnd(2,12):3*rnd(1,4), V=c*c*H/3;
    return mkGeo({svg:pyrSvg(c,H,[c,H,null],'Pyramide à base carrée de côté '+c+' et de hauteur '+H),val:V,unit:u,pow:3,text:'Une pyramide a pour base un carré de côté «'+c+'» '+u+' et pour hauteur «'+H+'» '+u+'. Calcule son <b>volume</b>.',ask:'le volume',placeholder:'V = 6 × 6 × 9 / 3\nV = 108 cm³',
      work:['aire de la base : '+c+'² = '+c*c,'V = '+c*c+' × '+H+' / 3 = '+NF(V)+' '+volU(u)],
      steps:[stp('Formule','Pyramide : '+M('V = (aire de la base × hauteur) / 3')+'.'),stp('Calcul',M('V = '+c+'² × '+H+' / 3 = '+c*c*H+' / 3 = '+NF(V))+' '+volU(u))],
      hints:['La base est un carré de côté '+c+'. Volume = base × hauteur / 3.'],
      mistakes:[{v:c*c*H,tag:'geo-tiers',msg:'Le volume d\'une pyramide est le tiers de base × hauteur : divise par 3.',w:['V = '+c+'² × '+H+' = '+c*c*H]},{v:c*H/3,tag:'geo-vol-formule',msg:'L\'aire de la base carrée est c² ('+c*c+').',w:['V = '+c+' × '+H+' / 3']},{v:c*c*H/2,tag:'geo-tiers',msg:'C\'est un tiers (÷ 3), pas une moitié.',w:['V = '+c+'² × '+H+' / 2']}]});
  }
  const [p,q,a_]=pick([[3,4,5],[4,3,5],[5,12,13],[6,8,10],[8,6,10],[9,12,15],[12,5,13],[8,15,17]]), c=2*p, H=q, V=c*c*H/3;
  return mkGeo({svg:pyrSvg(c,null,[c,null,a_],'Pyramide à base carrée de côté '+c+' et d\'apothème '+a_),val:V,unit:u,pow:3,text:'Une pyramide régulière a pour base un carré de côté «'+c+'» '+u+'. La hauteur d\'une face triangulaire (l\'apothème) mesure «'+a_+'» '+u+'. Calcule son <b>volume</b> (la hauteur de la pyramide n\'est pas donnée).',ask:'le volume',placeholder:'H = ...\nV = ...',
    work:['demi-côté : '+c+' / 2 = '+p,'H = √('+a_+'² − '+p+'²) = '+H,'V = '+c+'² × '+H+' / 3 = '+NF(V)+' '+volU(u)],
    steps:[stp('Hauteur de la pyramide','Le pied de la hauteur est le centre de la base : la distance au milieu d\'un côté est '+M(c+' / 2 = '+p)+'. Triangle rectangle d\'hypoténuse l\'apothème :',M('H = √('+a_+'² − '+p+'²) = √'+(a_*a_-p*p)+' = '+H)),stp('Volume',M('V = '+c+'² × '+H+' / 3 = '+NF(V))+' '+volU(u))],
    hints:['Le pied de la hauteur est au centre de la base : il est à c / 2 du milieu d\'un côté. Triangle rectangle : hauteur, c / 2 et apothème (hypoténuse).'],
    mistakes:[{v:c*c*a_/3,tag:'geo-pyth-cote',msg:'L\'apothème n\'est pas la hauteur de la pyramide : H = √('+a_+'² − '+p+'²) = '+H+'.',w:['V = '+c+'² × '+a_+' / 3 = '+NF(c*c*a_/3)]},{v:c*c*H,tag:'geo-tiers',msg:'N\'oublie pas de diviser par 3.',w:['H = '+H,'V = '+c+'² × '+H+' = '+c*c*H]},{v:c*c*Math.sqrt(Math.max(0,a_*a_-c*c))/3,tag:'geo-pyth-cote',msg:'Dans le triangle rectangle, c\'est la moitié du côté ('+p+') qu\'on utilise, pas le côté entier.',w:['H = √('+a_+'² − '+c+'²)']}].filter(m=>isFinite(m.v)&&m.v>0)});
}

/* ----- gs-5 : boule (valeur exacte) ----- */
function genBoule(){
  const r=rnd(2,9), useD=Math.random()<0.4, d=2*r, t=pick(['V','V','A','demi','cube']), u=uP();
  const intro=useD?'Une boule a un diamètre de «'+d+'» '+u+'. ':'Une boule a un rayon de «'+r+'» '+u+'. ';
  const R0=useD?['r = '+d+' / 2 = '+r]:[], R1=useD?[stp('Rayon','Le diamètre est '+M(d)+' : '+M('r = '+d+' / 2 = '+r))]:[];
  if(t==='V'){
    const N=4*r**3, ex=fr3(N);
    return mkGeo({svg:sphSvg(r,r,'Boule de rayon '+r),mode:'pi',exact:ex,val:pib(0,N/3),unit:u,pow:3,text:intro+'Calcule son <b>volume</b>. Donne la <b>valeur exacte</b>.',ask:'le volume (valeur exacte)',placeholder:'V = 4/3 × π × 3³\nV = 36π cm³',
      work:R0.concat(['V = 4/3 × π × '+r+'³ = '+ex+' '+volU(u)]),
      steps:R1.concat([stp('Formule','Volume d\'une boule : '+M('V = (4/3) × π × r³')+'.'),stp('Calcul',M('V = (4/3) × π × '+r+'³ = '+N+'π / 3 = '+ex)+' '+volU(u))]),
      hints:['Volume de la boule : 4/3 × π × r³ (le rayon est au cube).'],
      mistakes:[{v:pib(0,4*r*r),tag:'geo-vol-aire',msg:'4πr² est l\'aire de la sphère. Le volume est 4/3 πr³.',w:['A = 4π × '+r+'² = '+kPi(4*r*r)]},{v:pib(0,4*r**3),tag:'geo-vol-formule',msg:'Il manque le facteur 1/3 : V = 4/3 × πr³.',w:['V = 4π × '+r+'³ = '+kPi(4*r**3)]},{v:pib(0,4*r*r/3),tag:'geo-vol-formule',msg:'Pour la boule, le rayon est au cube (r³).',w:['V = 4/3 π × '+r+'²']},{v:pib(0,4*d**3/3),tag:'geo-rayon',msg:'Tu as utilisé le diamètre à la place du rayon.',w:['V = 4/3 π × '+d+'³']}].filter(m=>Math.abs(m.v.b-N/3)>1e-9)});
  }
  if(t==='A'){
    return mkGeo({svg:sphSvg(r,r,'Sphère de rayon '+r),mode:'pi',val:pib(0,4*r*r),unit:u,pow:2,text:intro.replace('boule','sphère')+'Calcule l\'<b>aire de sa surface</b>. Donne la <b>valeur exacte</b>.',ask:'l\'aire (valeur exacte)',placeholder:'A = 4π × 3²\nA = 36π cm²',
      work:R0.concat(['A = 4π × '+r+'² = '+kPi(4*r*r)+' '+u+'²']),
      steps:R1.concat([stp('Formule','Aire d\'une sphère : '+M('A = 4πr²')+'.'),stp('Calcul',M('A = 4π × '+r+'² = '+kPi(4*r*r))+' '+u+'²')]),
      hints:['Aire de la sphère : 4πr².'],
      mistakes:[{v:pib(0,4*r**3/3),tag:'geo-vol-aire',msg:'4/3 πr³ est le volume. L\'aire de la sphère est 4πr².',w:['V = 4/3 π × '+r+'³']},{v:pib(0,r*r),tag:'geo-aire-pi',msg:'πr² est l\'aire d\'un disque. La sphère vaut 4 fois cette aire.',w:['A = π × '+r+'² = '+kPi(r*r)]},{v:pib(0,2*r*r),tag:'geo-aire-pi',msg:'L\'aire de la sphère est 4πr² (et non 2πr²).',w:['A = 2π × '+r+'²']},{v:pib(0,16*r*r),tag:'geo-rayon',msg:'Tu as utilisé le diamètre à la place du rayon.',w:['A = 4π × '+d+'²']}]});
  }
  if(t==='demi'){
    const N=2*r**3, ex=fr3(N);
    return mkGeo({svg:sphSvg(r,r,'Demi-boule de rayon '+r),mode:'pi',exact:ex,val:pib(0,N/3),unit:u,pow:3,text:'Une <b>demi-boule</b> (un dôme plein) a un rayon de «'+r+'» '+u+'. Calcule son <b>volume</b>. Donne la <b>valeur exacte</b>.',ask:'le volume (valeur exacte)',placeholder:'V = 1/2 × 4/3 × π × 3³\nV = 18π cm³',
      work:['V = 1/2 × 4/3 × π × '+r+'³ = '+ex+' '+volU(u)],
      steps:[stp('Moitié d\'une boule','Boule entière : '+M('(4/3) × π × '+r+'³ = '+fr3(4*r**3))+'. On prend la moitié :',M('V = '+ex)+' '+volU(u))],
      hints:['Volume d\'une demi-boule = la moitié de 4/3 πr³ = 2/3 πr³.'],
      mistakes:[{v:pib(0,4*r**3/3),tag:'geo-vol-formule',msg:'C\'est le volume de la boule entière : il faut prendre la moitié.',w:['V = '+fr3(4*r**3)]},{v:pib(0,r**3/3*1),tag:'geo-vol-formule',msg:'Moitié de 4/3 πr³ = 2/3 πr³.',w:['V = 1/3 π × '+r+'³']},{v:pib(0,2*r**3),tag:'geo-tiers',msg:'Il manque le facteur 1/3 : V = 2/3 πr³.',w:['V = 2π × '+r+'³']}]});
  }
  const a8=8*r**3, bb=4*r**3/3, ex=NF(a8)+' − '+fr3(4*r**3);
  return mkGeo({svg:sphSvg(r,r,'Boule de rayon '+r+' dans un cube d\'arête '+2*r,{cube:true}),mode:'pi',exact:ex,val:pib(a8,-bb),unit:u,pow:3,text:'Une boule de rayon «'+r+'» '+u+' est exactement contenue dans un cube (elle touche les six faces). Calcule le volume de <b>l\'espace vide</b> entre la boule et le cube. Donne la <b>valeur exacte</b>.',ask:'le volume vide (valeur exacte)',placeholder:'cube = ...\nboule = ...\nV = ...',
    work:['arête du cube = 2 × '+r+' = '+2*r,'cube : '+2*r+'³ = '+a8,'boule : 4/3 π × '+r+'³ = '+fr3(4*r**3),'V = '+ex+' '+volU(u)],
    steps:[stp('Cube','L\'arête est le diamètre de la boule : '+M('2 × '+r+' = '+2*r)+'. Volume : '+M(2*r+'³ = '+a8)),stp('Boule',M('(4/3) × π × '+r+'³ = '+fr3(4*r**3))),stp('Espace vide','Cube − boule : '+M('V = '+ex)+' '+volU(u))],
    hints:['L\'arête du cube est égale au diamètre de la boule.'],
    mistakes:[{v:pib(a8,0),tag:'geo-vol-formule',msg:'C\'est le volume du cube : il faut retirer celui de la boule.',w:['V = '+a8]},{v:pib(r**3,-bb),tag:'geo-rayon',msg:'L\'arête du cube est le diamètre : 2 × '+r+' = '+2*r+', pas '+r+'.',w:['cube : '+r+'³ = '+r**3,'V = '+r**3+' − '+fr3(4*r**3)]},{v:pib(0,bb),tag:'geo-vol-formule',msg:'Tu n\'as calculé que la boule : l\'espace vide, c\'est cube − boule.',w:['V = '+fr3(4*r**3)]},{v:pib(a8,bb),tag:'geo-vol-formule',msg:'Le vide, c\'est le cube moins la boule (et non plus).',w:['V = '+a8+' + '+fr3(4*r**3)]}]});
}

/* ----- gs-6 : pièces composées ----- */
function genPieceS(){
  const t=pick(['silo','rivet','tube']), u=uP();
  if(t==='silo'){
    const [p,q,s]=pick([[3,4,5],[6,8,10],[9,12,15],[5,12,13]]), r=p, Hc=q, h=rnd(3,8), N=r*r*(3*h+Hc), ex=fr3(N);
    const svg=figure([[-r*1.1,-r*S3E*1.1],[r*1.1,h+Hc+0.2]],f=>{
      const BL=f([-r,0]), BR=f([r,0]), TL=f([-r,h]), TR=f([r,h]), Ap=f([0,h+Hc]), sc=f.s, eRx=gf(r*sc)+' '+gf(S3E*r*sc), ce=f([0,h/2]), cr=f([r,h]);
      let out=g.path('M'+S3P(BL)+' L'+S3P(TL)+' L'+S3P(Ap)+' L'+S3P(TR)+' L'+S3P(BR)+' A'+eRx+' 0 0 1 '+S3P(BL)+' Z','g-f')+dashArc(S3arc(f,[0,0],r,false))+'<path class="g-l g-thin" fill="none" d="'+S3arc(f,[0,h],r,true)+'"/>'+dashArc(S3arc(f,[0,h],r,false));
      const O=f([0,0]), cT=f([0,h]), eT=f([r,h]);
      out+=g.seg(cT,eT,'g-thin')+g.dot(cT)+g.text(vadd(vmid(cT,eT),[0,10]),String(r),'g-u2')+g.len(BL,TL,String(h),ce,10)+g.len(Ap,TR,String(s),f([0,h/2]),10);
      return out;
    },'Silo : cylindre de rayon '+r+' et de hauteur '+h+' surmonté d\'un cône de génératrice '+s,{H:260,pad:30});
    return mkGeo({svg,mode:'pi',exact:ex,val:pib(0,N/3),unit:u,pow:3,text:'Un silo est formé d\'un cylindre de rayon «'+r+'» '+u+' et de hauteur «'+h+'» '+u+', surmonté d\'un cône de même base dont la génératrice mesure «'+s+'» '+u+'. Calcule le <b>volume</b> du silo. Donne la <b>valeur exacte</b>.',ask:'le volume (valeur exacte)',placeholder:'hauteur du cône = ...\ncylindre = ...\ncône = ...\nV = ...',
      work:['H = √('+s+'² − '+r+'²) = '+Hc,'cylindre : π × '+r+'² × '+h+' = '+kPi(r*r*h),'cône : π × '+r+'² × '+Hc+' / 3 = '+fr3(r*r*Hc),'V = '+ex+' '+volU(u)],
      steps:[stp('Hauteur du cône',M('H = √('+s+'² − '+r+'²) = '+Hc)),stp('Cylindre',M('π × '+r+'² × '+h+' = '+kPi(r*r*h))),stp('Cône',M('π × '+r+'² × '+Hc+' / 3 = '+fr3(r*r*Hc))),stp('Volume total',M('V = '+ex)+' '+volU(u))],
      hints:['La hauteur du cône se trouve avec Pythagore (rayon, hauteur, génératrice).','Volume total = cylindre + cône.'],
      mistakes:[{v:pib(0,r*r*h),tag:'geo-decomp',msg:'Tu as oublié le cône du dessus.',w:['V = '+kPi(r*r*h)]},{v:pib(0,r*r*(h+Hc)),tag:'geo-tiers',msg:'Le volume du cône est divisé par 3.',w:['V = '+kPi(r*r*h)+' + '+kPi(r*r*Hc)]},{v:pib(0,r*r*(3*h+s)/3),tag:'geo-pyth-cote',msg:'La génératrice n\'est pas la hauteur du cône : H = √('+s+'² − '+r+'²) = '+Hc+'.',w:['cône : π × '+r+'² × '+s+' / 3']},{v:pib(0,r*r*(3*h-Hc)/3),tag:'geo-decomp',msg:'Le cône s\'ajoute au cylindre (il est posé dessus).',w:['V = '+kPi(r*r*h)+' − '+fr3(r*r*Hc)]}].filter(m=>m.v.b>0&&Math.abs(m.v.b-N/3)>1e-9)});
  }
  if(t==='rivet'){
    const r=rnd(2,6), h=rnd(3,10), N=3*r*r*h+2*r**3, ex=fr3(N);
    const svg=cylSvg(r,h,[r,h],'Cylindre de rayon '+r+' et de hauteur '+h+' surmonté d\'une demi-boule',{hemi:true,H:260});
    return mkGeo({svg,mode:'pi',exact:ex,val:pib(0,N/3),unit:u,pow:3,text:'Une pièce est formée d\'un cylindre de rayon «'+r+'» '+u+' et de hauteur «'+h+'» '+u+', surmonté d\'une <b>demi-boule</b> de même rayon. Calcule son <b>volume</b>. Donne la <b>valeur exacte</b>.',ask:'le volume (valeur exacte)',placeholder:'cylindre = ...\ndemi-boule = ...\nV = ...',
      work:['cylindre : π × '+r+'² × '+h+' = '+kPi(r*r*h),'demi-boule : 2/3 × π × '+r+'³ = '+fr3(2*r**3),'V = '+ex+' '+volU(u)],
      steps:[stp('Cylindre',M('π × '+r+'² × '+h+' = '+kPi(r*r*h))),stp('Demi-boule',M('(1/2) × (4/3) × π × '+r+'³ = '+fr3(2*r**3))),stp('Volume total',M('V = '+ex)+' '+volU(u))],
      hints:['Volume = cylindre + demi-boule. La demi-boule est la moitié de 4/3 πr³.'],
      mistakes:[{v:pib(0,r*r*h),tag:'geo-decomp',msg:'Tu as oublié la demi-boule.',w:['V = '+kPi(r*r*h)]},{v:pib(0,(3*r*r*h+4*r**3)/3),tag:'geo-vol-formule',msg:'Tu as pris une boule entière : la pièce n\'a qu\'une demi-boule (2/3 πr³).',w:['demi-boule : '+fr3(4*r**3)]},{v:pib(0,r*r*h+2*r**3),tag:'geo-tiers',msg:'Le volume de la demi-boule est 2/3 πr³ (il manque le facteur 1/3).',w:['demi-boule : 2π × '+r+'³']},{v:pib(0,(3*r*r*h-2*r**3)/3),tag:'geo-decomp',msg:'La demi-boule s\'ajoute au cylindre.',w:['V = '+kPi(r*r*h)+' − '+fr3(2*r**3)]}]});
  }
  const R=rnd(4,8), r=rnd(1,R-2), h=rnd(3,10), ask=pick(['volume','aire']);
  const svg=cylSvg(R,h,[r,h,R-r],'Cylindre de rayon '+R+' et de hauteur '+h+' percé d\'un trou cylindrique de rayon '+r,{hole:r,H:260});
  const txt='Un tube est un cylindre plein de rayon «'+R+'» '+u+' et de hauteur «'+h+'» '+u+', percé de part en part par un trou cylindrique de rayon «'+r+'» '+u+' (même axe). ';
  if(ask==='volume'){
    const b=(R*R-r*r)*h;
    return mkGeo({svg,mode:'pi',val:pib(0,b),unit:u,pow:3,text:txt+'Calcule le <b>volume de matière</b>. Donne la <b>valeur exacte</b>.',ask:'le volume de matière (valeur exacte)',placeholder:'plein = ...\ntrou = ...\nV = ...',
      work:['plein : π × '+R+'² × '+h+' = '+kPi(R*R*h),'trou : π × '+r+'² × '+h+' = '+kPi(r*r*h),'V = '+kPi(R*R*h)+' − '+kPi(r*r*h)+' = '+kPi(b)+' '+volU(u)],
      steps:[stp('Cylindre plein',M('π × '+R+'² × '+h+' = '+kPi(R*R*h))),stp('Trou',M('π × '+r+'² × '+h+' = '+kPi(r*r*h))),stp('Matière',M('V = '+kPi(R*R*h)+' − '+kPi(r*r*h)+' = '+kPi(b))+' '+volU(u))],
      hints:['Volume de matière = cylindre plein − cylindre du trou (même hauteur).'],
      mistakes:[{v:pib(0,R*R*h),tag:'geo-decomp',msg:'Tu as oublié de retirer le trou.',w:['V = '+kPi(R*R*h)]},{v:pib(0,(R-r)**2*h),tag:'geo-vol-formule',msg:'On soustrait les aires des disques (R² − r²), pas les rayons avant de mettre au carré.',w:['V = π × ('+R+' − '+r+')² × '+h]},{v:pib(0,(R*R+r*r)*h),tag:'geo-decomp',msg:'Le trou est du vide : on retire son volume.',w:['V = '+kPi(R*R*h)+' + '+kPi(r*r*h)]},{v:pib(0,r*r*h),tag:'geo-decomp',msg:'Tu as calculé le volume du trou, pas celui de la matière.',w:['V = '+kPi(r*r*h)]}]});
  }
  const b=2*((R+r)*h+R*R-r*r);
  return mkGeo({svg,mode:'pi',val:pib(0,b),unit:u,pow:2,text:txt+'Calcule l\'<b>aire totale de la surface</b> du tube (surface extérieure, surface intérieure du trou et les deux couronnes du haut et du bas). Donne la <b>valeur exacte</b>.',ask:'l\'aire totale (valeur exacte)',placeholder:'extérieur = ...\nintérieur = ...\ncouronnes = ...\nA = ...',
    work:['extérieur : 2π × '+R+' × '+h+' = '+kPi(2*R*h),'intérieur : 2π × '+r+' × '+h+' = '+kPi(2*r*h),'deux couronnes : 2 × π × ('+R+'² − '+r+'²) = '+kPi(2*(R*R-r*r)),'A = '+kPi(b)+' '+u+'²'],
    steps:[stp('Surface extérieure',M('2π × '+R+' × '+h+' = '+kPi(2*R*h))),stp('Surface du trou',M('2π × '+r+' × '+h+' = '+kPi(2*r*h))),stp('Deux couronnes','Chaque couronne est un disque de rayon '+M(R)+' privé d\'un disque de rayon '+M(r)+' :',M('2 × π × ('+R+'² − '+r+'²) = '+kPi(2*(R*R-r*r)))),stp('Aire totale',M('A = '+kPi(b))+' '+u+'²')],
    hints:['Quatre morceaux : l\'extérieur, l\'intérieur du trou et deux couronnes (haut et bas).'],
    mistakes:[{v:pib(0,2*R*h+2*(R*R-r*r)),tag:'geo-decomp',msg:'Tu as oublié la surface intérieure du trou.',w:['A = '+kPi(2*R*h)+' + '+kPi(2*(R*R-r*r))]},{v:pib(0,2*(R+r)*h+2*R*R),tag:'geo-decomp',msg:'Les bases sont des couronnes (disque moins trou), pas des disques pleins.',w:['A = '+kPi(2*(R+r)*h)+' + '+kPi(2*R*R)]},{v:pib(0,2*(R+r)*h),tag:'geo-decomp',msg:'Il manque les deux couronnes (haut et bas).',w:['A = '+kPi(2*(R+r)*h)]},{v:pib(0,2*(R-r)*h+2*(R*R-r*r)),tag:'geo-decomp',msg:'La surface du trou s\'ajoute (c\'est de la surface en plus), elle ne se retire pas.',w:['A = '+kPi(2*(R-r)*h)+' + '+kPi(2*(R*R-r*r))]}]});
}
TOPICS['gs-1']={kind:'gsol',level:1,label:'Pavé et cube : volume et aire',gen:genPave};
TOPICS['gs-2']={kind:'gsol',level:2,label:'Contenances et unités (L, cm³)',gen:genContenance};
TOPICS['gs-3']={kind:'gsol',level:3,label:'Cylindre (valeur exacte)',gen:genCylindre};
TOPICS['gs-4']={kind:'gsol',level:4,label:'Cône et pyramide',gen:genConePyr};
TOPICS['gs-5']={kind:'gsol',level:5,label:'Boule et sphère',gen:genBoule};
TOPICS['gs-6']={kind:'gsol',level:6,label:'Pièces composées (silo, tube, dôme)',gen:genPieceS};
