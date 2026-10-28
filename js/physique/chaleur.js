'use strict';
/* ===== Physique · Chaleur : transferts de chaleur (CHR 4 : conduction, convection, rayonnement) ===== */
/* Fiches d'après les pages C-24 et C-25 ; exercices originaux inspirés des pages C-28 et C-29, sans en reprendre les énoncés ; la page C-23 (début de la conduction)
   et la suite du rayonnement (documents utiles aux exercices 19 et 20) ne sont pas encore dans l'appli. */

/* ----- domaine « ph » du moteur, rattaché à la branche Physique ----- */
BRDOM.physique='ph'; DOMBR.ph='physique'; DOMBR.phd='physique'; DOMBR.phg='physique'; BRDOMS.physique=['ph','phd','phg'];
DKINDS.ph=['phcd','phcv','phmt'];
MODES.ph=[['phcd','Conduction'],['phcv','Convection'],['phmt','Modes de transfert'],['mix','Mélange'],['srs','À revoir'],['review','Chasse aux erreurs']];
DOM_TITLE.ph='Chaleur'; DOM_TITLE.phd='Dilatation'; DOM_TITLE.phg='Gaz parfaits';
DOM_KICK.ph='Physique · transferts de chaleur : conduction, convection, rayonnement';
DOM_KICK.phd='Physique · dilatation des solides et des liquides';
DOM_KICK.phg='Physique · gaz parfaits : pression, volume, température';
DOMSTORE.ph={mode:'mix',level:1}; DOMSTORE.phd={mode:'mix',level:1}; DOMSTORE.phg={mode:'mix',level:1};
DKINDS.phd=[]; DKINDS.phg=[];
MODES.phd=[['mix','Mélange'],['srs','À revoir'],['review','Chasse aux erreurs']];
MODES.phg=[['mix','Mélange'],['srs','À revoir'],['review','Chasse aux erreurs']];
Object.assign(KIND_LABEL,{phcd:'Conduction',phcv:'Convection',phmt:'Modes de transfert'});

Object.assign(TAGS,{
  'ph-dt':{label:'Différence de température',tip:'Δθ = θ₁ − θ₂ : la température la plus haute moins la plus basse. Avec une température négative, 20 − (−15) = 35 °C.'},
  'ph-unite-e':{label:'Épaisseur pas en mètres',tip:'Dans Q/Δt = S · λ · Δθ / e, l\'épaisseur e s\'exprime en mètres : 16 cm = 0,16 m. Si on demande un résultat en cm, reconvertis à la fin.'},
  'ph-formule':{label:'Formule mal appliquée',tip:'Conduction : Q/Δt = S · λ · Δθ / e (e au dénominateur). Convection : Q/Δt = S · α · Δθ. N\'oublie pas la surface S.'},
  'ph-duree':{label:'Durée ou énergie mal converties',tip:'Q = (Q/Δt) × Δt avec Δt en secondes : 1 min = 60 s, 1 h = 3600 s. Puis 1 kJ = 1000 J et 1 MJ = 1 000 000 J.'},
  'ph-mode':{label:'Mode de transfert confondu',tip:'Conduction : la chaleur passe dans la matière sans déplacement de matière. Convection : la matière (liquide, gaz) se déplace. Rayonnement : ondes électromagnétiques, même à travers le vide.'},
  'ph-conducteur':{label:'Conducteur ou isolant',tip:'Plus λ est grand, plus le matériau conduit la chaleur (métaux). Un λ petit caractérise un isolant (laine de verre, polystyrène, liège, air, vide).'},
  'ph-cours':{label:'Question de cours',tip:'Relis la fiche « Transferts de chaleur » : pour chaque situation, demande-toi si la matière se déplace, si deux corps se touchent ou si la chaleur arrive à distance.'}
});

/* conductivités thermiques λ en W·m⁻¹·°C⁻¹ (tableau du cours) */
const PH_LAMBDA=[['argent',418],['cuivre',389],['aluminium',202],['fer',63],['ciment',1.82],['brique rouge',0.83],['verre',0.8],['eau',0.578],['bois de sapin',0.15],['liège en graine',0.05],['polystyrène',0.04],['laine de verre',0.04],['air',0.025],['vide',0]];
const phL=n=>PH_LAMBDA.find(x=>x[0]===n)[1];
/* matériaux de paroi et épaisseurs plausibles (cm) */
const PH_PAROI=[['ciment',[15,20,25,30]],['brique rouge',[12,15,20,25]],['verre',[0.4,0.5,0.6,0.8]],['bois de sapin',[3,4,5,8,10,16]],['liège en graine',[2,3,4,5]],['polystyrène',[2,4,6,8,10]],['laine de verre',[4,5,8,10,12]]];
const PH_HINT='Écris tes calculs ligne par ligne, par exemple Q/Δt = 12 × 0,83 × 15 / 0,2 puis Q/Δt ≈ 747 W. Écris les nombres sans espace (14175000). L\'unité est facultative, mais elle doit être juste si tu l\'écris.';
const phR=(x,d)=>Math.round(x*Math.pow(10,d))/Math.pow(10,d);
const phS=n=>String(n).replace('-','−');

function phWallSvg(t1,t2,eTxt,fluid){
  const L=[150,30],B=[150,150],R=[190,30],RB=[190,150];
  let o=g.poly([L,R,RB,B],'');
  if(fluid){ o=g.poly([[150,30],[160,30],[160,150],[150,150]],''); for(let i=0;i<14;i++) o+=g.dot([180+((i*37)%120),40+((i*53)%105)]); o+=g.text([95,92],t1,'g-t')+g.text([255,20],t2,'g-t'); }
  else o+=g.text([95,92],t1,'g-t')+g.text([245,92],t2,'g-t')+g.seg([150,165],[190,165],'g-thin')+g.text([170,180],eTxt,'g-u');
  return '<figure class="geofig"><svg class="geo-svg" viewBox="0 0 340 '+(fluid?165:190)+'" role="img" aria-label="'+(fluid?'Surface et fluide':'Paroi d\'épaisseur e')+'">'+o+'</svg><figcaption>Schéma non à l\'échelle.</figcaption></figure>';
}
/* exercice numérique : moteur de correction de la géométrie (égalités vérifiées ligne par ligne, arrondi, unité) */
function phNum(o){
  return Object.assign(mkGeo(Object.assign({mode:'round'},o)),{hintline:PH_HINT,placeholder:o.placeholder||'Q/Δt = 12 × 0,83 × 15 / 0,2\nQ/Δt ≈ 747 W',instr:o.instr||('Calcule '+o.ask)});
}
const phArr=d=>d===0?'arrondi à l\'unité':d===1?'arrondi au dixième':'arrondi au centième';

/* ----- conduction : Q/Δt = S · λ · Δθ / e ----- */
function phCondBase(neg){
  const p=pick(PH_PAROI), mat=p[0], lam=phL(mat), e=pick(p[1]), S=rnd(4,25);
  const t1=rnd(18,23), t2=neg?-rnd(2,18):rnd(2,12), dt=t1-t2, em=e/100;
  return {mat,lam,e,em,S,t1,t2,dt,F:S*lam*dt/em};
}
const phDtTxt=b=>b.t2<0?b.t1+' − ('+phS(b.t2)+') = '+b.dt:b.t1+' − '+b.t2+' = '+b.dt;
function genPhCd(neg){
  const b=phCondBase(neg), d=1, r=phR(b.F,d);
  const ctx=neg?pick(['Le mur d\'un refuge de montagne','La porte d\'une chambre froide vue de l\'extérieur','La paroi d\'un abri de jardin chauffé'])+' est en '+b.mat:pick(['Une cloison','La paroi d\'un four de potier','Le fond d\'une caisse isotherme'])+' est en '+b.mat;
  const svg=phWallSvg('θ₁ = '+b.t1+' °C','θ₂ = '+phS(b.t2)+' °C','e = '+NF(b.e)+' cm');
  return phNum({svg,text:ctx+' («λ = '+NF(b.lam)+'» W·m⁻¹·°C⁻¹). Sa surface vaut «S = '+b.S+'» m² et son épaisseur «e = '+NF(b.e)+'» cm. '+(neg?'La face chaude est à «'+b.t1+'» °C et la face froide à «'+b.t2+'» °C.':'Les températures de ses deux faces sont «θ₁ = '+b.t1+'» °C et «θ₂ = '+b.t2+'» °C.')+' Calcule le flux de chaleur «Q/Δt» qui traverse la paroi par conduction, '+phArr(d)+'.',
    ask:'le flux de chaleur (en W)',val:b.F,d,unit:'W',
    steps:[stp('Formule',M('Q/Δt = S · λ · Δθ / e')),stp('Données',M('e = '+NF(b.e)+' cm = '+NF(b.em)+' m')+' ; '+M('Δθ = '+phDtTxt(b))+' °C'),stp('Calcul',M('Q/Δt = '+b.S+' × '+NF(b.lam)+' × '+b.dt+' / '+NF(b.em)+' ≈ '+NF(r))+' W')],
    hints:['Formule de la conduction : Q/Δt = S · λ · Δθ / e, avec e en mètres ('+NF(b.e)+' cm = '+NF(b.em)+' m).','Δθ est l\'écart de température entre les deux faces : '+phDtTxt(b)+' °C.'],
    work:['Q/Δt = '+b.S+' × '+NF(b.lam)+' × '+b.dt+' / '+NF(b.em),'Q/Δt ≈ '+NF(r)+' W'],
    mistakes:[{v:b.S*b.lam*b.dt/b.e,tag:'ph-unite-e',msg:'Tu as laissé l\'épaisseur en cm. Dans la formule, e s\'exprime en mètres : '+NF(b.e)+' cm = '+NF(b.em)+' m.'},
      {v:b.S*b.lam*b.dt*b.em,tag:'ph-formule',msg:'L\'épaisseur se place au dénominateur : plus la paroi est épaisse, moins la chaleur passe.'},
      {v:b.lam*b.dt/b.em,tag:'ph-formule',msg:'Tu as oublié de multiplier par la surface S = '+b.S+' m².'},
      {v:b.S*b.lam*(b.t1+b.t2)/b.em,tag:'ph-dt',msg:'Δθ est une différence : '+phDtTxt(b)+' °C'+(neg?' (soustraire une température négative revient à ajouter).':'.')}],
    sanity:[{when:x=>x<0,msg:'Un flux de chaleur se compte positivement, du côté chaud vers le côté froid.',tag:'ph-dt'}]});
}
function genPhCdEnergie(){
  const b=phCondBase(Math.random()<0.5), h=pick([2,3,4,6,8,10,12]), Q=b.F*h*3600/1e6, d=1, r=phR(Q,d), Fr=phR(b.F,1);
  const svg=phWallSvg('θ₁ = '+b.t1+' °C','θ₂ = '+phS(b.t2)+' °C','e = '+NF(b.e)+' cm');
  return phNum({svg,text:'Une paroi en '+b.mat+' («λ = '+NF(b.lam)+'» W·m⁻¹·°C⁻¹) a une surface de «'+b.S+'» m² et une épaisseur de «'+NF(b.e)+'» cm. Il fait «'+b.t1+'» °C d\'un côté et «'+b.t2+'» °C de l\'autre. Calcule la chaleur «Q» qui traverse ce mur en «'+h+'» heures, en MJ, '+phArr(d)+'.',
    ask:'la chaleur transmise (en MJ)',val:Q,d,unit:'MJ',placeholder:'Q/Δt = 12 × 0,83 × 15 / 0,2\nQ = 747 × 3 × 3600\nQ ≈ 8,1 MJ',
    steps:[stp('Flux',M('Q/Δt = S · λ · Δθ / e = '+b.S+' × '+NF(b.lam)+' × '+b.dt+' / '+NF(b.em)+' ≈ '+NF(Fr))+' W'),stp('Durée',M('Δt = '+h+' × 3600 = '+(h*3600))+' s'),stp('Chaleur',M('Q = (Q/Δt) × Δt ≈ '+NF(phR(b.F*h*3600,0)))+' J ≈ '+NF(r)+' MJ')],
    hints:['Calcule d\'abord le flux Q/Δt (en W), puis multiplie par la durée en secondes.','1 h = 3600 s et 1 MJ = 1 000 000 J.'],
    work:['Q/Δt = '+b.S+' × '+NF(b.lam)+' × '+b.dt+' / '+NF(b.em),'Q = '+NF(Fr)+' × '+(h*3600),'Q ≈ '+NF(r)+' MJ'],
    mistakes:[{v:b.F*h/1e6,tag:'ph-duree',msg:'La durée doit être en secondes : '+h+' h = '+(h*3600)+' s.'},
      {v:b.F*h*3600/1e3,tag:'ph-duree',msg:'Ce résultat est en kJ. L\'énoncé demande des MJ : divise encore par 1000.'},
      {v:b.F*h*3600,tag:'ph-duree',msg:'Ce résultat est en joules. Convertis en MJ : 1 MJ = 1 000 000 J.'},
      {v:b.S*b.lam*b.dt/b.e*h*3600/1e6,tag:'ph-unite-e',msg:'L\'épaisseur doit être en mètres : '+NF(b.e)+' cm = '+NF(b.em)+' m.'}]});
}
function genPhCdEpaisseur(){
  const p=pick(PH_PAROI.filter(x=>x[0]!=='verre')), mat=p[0], lam=phL(mat), S=rnd(5,20), t1=rnd(18,22), t2=rnd(-10,8), dt=t1-t2;
  const Fmax=Math.round(S*lam*dt/(pick(p[1])/100)), em=S*lam*dt/Fmax, d=1, r=phR(em*100,d);
  const b={t1,t2,dt};
  return phNum({svg:phWallSvg('θ₁ = '+t1+' °C','θ₂ = '+phS(t2)+' °C','e = ?'),text:'On construit une paroi en '+mat+' («λ = '+NF(lam)+'» W·m⁻¹·°C⁻¹) de «'+S+'» m². Il fait «'+t1+'» °C d\'un côté et «'+t2+'» °C de l\'autre. Quelle épaisseur faut-il pour que le flux de chaleur par conduction soit de «'+Fmax+'» W ? Donne «e» en cm, '+phArr(d)+'.',
    ask:'l\'épaisseur (en cm)',val:em*100,d,unit:'cm',placeholder:'e = 12 × 0,83 × 15 / 747\ne = 0,2 m = 20 cm',
    steps:[stp('Isoler e',M('Q/Δt = S · λ · Δθ / e')+' donc '+M('e = S · λ · Δθ / (Q/Δt)')),stp('Calcul',M('e = '+S+' × '+NF(lam)+' × '+dt+' / '+Fmax+' ≈ '+NF(phR(em,4)))+' m'),stp('En cm',M('e ≈ '+NF(r))+' cm')],
    hints:['Isole e dans Q/Δt = S · λ · Δθ / e : e = S · λ · Δθ / (Q/Δt).','Le résultat sort en mètres : multiplie par 100 pour l\'avoir en cm. Δθ = '+phDtTxt(b)+' °C.'],
    work:['e = '+S+' × '+NF(lam)+' × '+dt+' / '+Fmax,'e ≈ '+NF(r)+' cm'],
    mistakes:[{v:em,tag:'ph-unite-e',msg:'Ce résultat est en mètres. Convertis en cm (× 100).'},
      {v:Fmax/(S*lam*dt)*100,tag:'ph-formule',msg:'Tu as inversé la fraction : e = S · λ · Δθ / (Q/Δt).'},
      {v:S*lam*(t1+t2)/Fmax*100,tag:'ph-dt',msg:'Δθ = '+phDtTxt(b)+' °C.'}]});
}
function genPhCdEquiv(){
  const ins=pick(['laine de verre','polystyrène','liège en graine']), other=pick(['bois de sapin','brique rouge','ciment']);
  const li=phL(ins), lo=phL(other), eo=pick(other==='bois de sapin'?[3,4,5,10]:other==='brique rouge'?[20,21,25,30]:[20,30,40]);
  const askIns=Math.random()<0.5, d=1;
  const given=askIns?[other,lo,eo]:[ins,li,pick([1,2,3,4])], want=askIns?[ins,li]:[other,lo];
  const val=given[2]*want[1]/given[1], r=phR(val,d);
  return phNum({svg:'',text:'Un artisan rénove une cabane : il veut remplacer un panneau de «'+NF(given[2])+'» cm de '+given[0]+' («λ = '+NF(given[1])+'») par un panneau de '+want[0]+' («λ = '+NF(want[1])+'», en W·m⁻¹·°C⁻¹), sans que les pertes de chaleur changent. Quelle épaisseur de '+want[0]+' doit-il prévoir ? Donne-la en cm, '+phArr(d)+'.',
    ask:'l\'épaisseur équivalente (en cm)',val,d,unit:'cm',placeholder:'e = 5 × 0,15 / 0,04\ne ≈ 18,8 cm',
    steps:[stp('Même flux',M('S · λ₁ · Δθ / e₁ = S · λ₂ · Δθ / e₂')+' donc '+M('λ₁ / e₁ = λ₂ / e₂')),stp('Calcul',M('e₂ = e₁ × λ₂ / λ₁ = '+NF(given[2])+' × '+NF(want[1])+' / '+NF(given[1])+' ≈ '+NF(r))+' cm')],
    hints:['Isoler autant veut dire laisser passer le même flux de chaleur (même S, même Δθ) : il faut donc le même rapport λ / e.','e₂ = e₁ × λ₂ / λ₁ : un matériau moins conducteur (λ plus petit) demande une épaisseur plus faible.'],
    work:['e = '+NF(given[2])+' × '+NF(want[1])+' / '+NF(given[1]),'e ≈ '+NF(r)+' cm'],
    mistakes:[{v:given[2]*given[1]/want[1],tag:'ph-formule',msg:'Rapport inversé : le matériau le plus isolant (λ le plus petit) doit être le moins épais. e₂ = e₁ × λ₂ / λ₁.'}]});
}

/* ----- convection : Q/Δt = S · α · Δθ ----- */
function genPhCv(neg){
  const it=pick([['Le toit plat d\'un garage','mur'],['La façade d\'un immeuble','mur'],['La porte métallique d\'un hangar','mur'],['La surface d\'un radiateur','radiateur'],['Un panneau chauffant','radiateur']]);
  const S=it[1]==='radiateur'?pick([1.5,2,2.5,3]):rnd(3,20), a=rnd(4,25);
  let ts,tf; if(it[1]==='radiateur'){ ts=rnd(45,70); tf=rnd(17,22); } else { ts=rnd(12,19); tf=neg?-rnd(2,15):rnd(2,10); }
  const dt=ts-tf, F=S*a*dt, d=1, r=phR(F,d), b={t1:ts,t2:tf,dt};
  return phNum({svg:phWallSvg('θ = '+ts+' °C','air : '+phS(tf)+' °C','',true),text:it[0]+' de «'+NF(S)+'» m² est à «'+ts+'» °C. L\'air qui la touche est à «'+tf+'» °C et le coefficient de convection vaut «α = '+a+'» W·m⁻²·°C⁻¹. Calcule le flux de chaleur «Q/Δt» échangé par convection, '+phArr(d)+'.',
    ask:'le flux de chaleur (en W)',val:F,d,unit:'W',placeholder:'Q/Δt = 15 × 5 × 24\nQ/Δt = 1800 W',
    steps:[stp('Formule',M('Q/Δt = S · α · Δθ')),stp('Écart',M('Δθ = '+phDtTxt(b))+' °C'),stp('Calcul',M('Q/Δt = '+NF(S)+' × '+a+' × '+dt+' = '+NF(r))+' W')],
    hints:['Formule de la convection : Q/Δt = S · α · Δθ.','Δθ = '+phDtTxt(b)+' °C.'],
    work:['Q/Δt = '+NF(S)+' × '+a+' × '+dt,'Q/Δt = '+NF(r)+' W'],
    mistakes:[{v:S*a*(ts+tf),tag:'ph-dt',msg:'Δθ est une différence : '+phDtTxt(b)+' °C'+(tf<0?' (soustraire une température négative revient à ajouter).':'.')},{v:a*dt,tag:'ph-formule',msg:'Tu as oublié la surface S = '+NF(S)+' m².'},{v:S*a,tag:'ph-formule',msg:'Il manque la différence de température Δθ.'}]});
}
function genPhCvAir(){
  const S=pick([2.4,2.8,3.2,3.6]), a=rnd(4,8), tp=rnd(35,45), ta0=rnd(8,18), P=Math.round(S*a*(tp-ta0)), x=P/(S*a), ta=tp-x, d=1, r=phR(ta,d);
  return phNum({svg:'',text:'Dans une cave, la paroi extérieure d\'un chauffe-eau mal isolé, d\'aire «'+NF(S)+'» m², est à «'+tp+'» °C. Elle perd «'+P+'» W par convection et le coefficient de convection vaut «α = '+a+'» W·m⁻²·°C⁻¹. Calcule la température de l\'air de la cave, '+phArr(d)+'.',
    ask:'la température de l\'air (en °C)',val:ta,d,unit:'°C',placeholder:'Δθ = 250 / (3 × 6)\nθ = 40 − 13,9 ≈ 26,1 °C',
    steps:[stp('Écart',M('Δθ = (Q/Δt) / (S · α) = '+P+' / ('+NF(S)+' × '+a+') ≈ '+NF(phR(x,2)))+' °C'),stp('Température de l\'air','La paroi est plus chaude que l\'air : '+M('θ = '+tp+' − '+NF(phR(x,2))+' ≈ '+NF(r))+' °C')],
    hints:['Isole Δθ dans Q/Δt = S · α · Δθ : Δθ = (Q/Δt) / (S · α).','Le chauffe-eau perd de la chaleur : l\'air est plus froid que sa paroi, donc θ air = θ paroi − Δθ.'],
    work:['Δθ = '+P+' / ('+NF(S)+' × '+a+')','θ ≈ '+NF(r)+' °C'],
    mistakes:[{v:tp+x,tag:'ph-dt',msg:'La paroi cède de la chaleur à l\'air : l\'air est plus froid que la paroi. Soustrais Δθ.'},{v:x,tag:'ph-dt',msg:'Tu as calculé l\'écart Δθ. Il reste à le retrancher de la température de la paroi.'}]});
}
function genPhCvAlpha(){
  const liq=Math.random()<0.4, S=liq?pick([0.5,0.8,1,1.2]):rnd(2,12), a0=liq?rnd(200,1500):rnd(5,40), ts=liq?rnd(40,80):rnd(25,60), tf=liq?rnd(10,30):rnd(5,20), dt=ts-tf;
  const P=Math.round(S*a0*dt), a=P/(S*dt), d=1, r=phR(a,d);
  return phNum({svg:'',text:'Une surface de «'+NF(S)+'» m² à «'+ts+'» °C cède «'+P+'» W par convection à '+(liq?'de l\'eau':'l\'air')+' à «'+tf+'» °C. Calcule le coefficient de convection «α» (en W·m⁻²·°C⁻¹), '+phArr(d)+'.',
    ask:'le coefficient de convection α',val:a,d,placeholder:'α = 1800 / (15 × 24)\nα = 5',
    steps:[stp('Isoler α',M('α = (Q/Δt) / (S · Δθ)')),stp('Calcul',M('α = '+P+' / ('+NF(S)+' × '+dt+') ≈ '+NF(r))),stp('Contrôle','Valeurs typiques : de 5 à 250 pour un gaz, de 200 à 5000 pour un liquide.')],
    hints:['Isole α dans Q/Δt = S · α · Δθ.','Δθ = '+ts+' − '+tf+' = '+dt+' °C.'],
    work:['α = '+P+' / ('+NF(S)+' × '+dt+')','α ≈ '+NF(r)],
    mistakes:[{v:P*S/dt,tag:'ph-formule',msg:'α = (Q/Δt) / (S · Δθ) : S est au dénominateur.'},{v:P/S,tag:'ph-dt',msg:'Il faut aussi diviser par Δθ = '+dt+' °C.'}]});
}

/* ----- modes de transfert, conducteurs et isolants (réponse à choisir) ----- */
const PH_MODES=['conduction','convection','rayonnement'];
const phMist=(ch,ans,why)=>ch.filter(c=>enNorm2(c)!==enNorm2(ans)).map(c=>[c,why(c)]);
const PH_SIT=[
  ['La chaleur du Soleil nous parvient à travers le vide.','rayonnement','Il n\'y a pas de matière entre le Soleil et la Terre : seul le rayonnement traverse le vide.'],
  ['Dans une casserole d\'eau sur le feu, les pâtes montent au milieu et redescendent le long des bords.','convection','L\'eau chauffée au fond se dilate, devient moins dense et monte en entraînant les pâtes : ce sont des courants de convection.'],
  ['La fumée d\'un feu de camp s\'élève au-dessus des flammes.','convection','L\'air chauffé par le feu monte et emporte la fumée : la matière se déplace, c\'est de la convection.'],
  ['Au-dessus d\'un convecteur électrique, les rideaux ondulent légèrement.','convection','L\'air chauffé par l\'appareil monte et met les rideaux en mouvement : c\'est un courant de convection.'],
  ['L\'après-midi, au bord de la mer, l\'air chaud monte au-dessus de la plage et un vent frais arrive du large.','convection','L\'air chauffé au-dessus du sable monte et l\'air plus frais de la mer prend sa place : un courant de convection se forme.'],
  ['Une lampe chauffante réchauffe des poussins sans les toucher, même à travers l\'air immobile.','rayonnement','La lampe envoie de l\'énergie à distance, sans contact ni déplacement de matière : c\'est du rayonnement.'],
  ['Une voiture garée en plein soleil : le tableau de bord devient brûlant.','rayonnement','L\'énergie du Soleil arrive sur le tableau de bord par rayonnement, à travers le vide puis les vitres.'],
  ['En montagne, au soleil, on a chaud au visage alors que l\'air est glacial.','rayonnement','Le visage reçoit directement le rayonnement du Soleil, sans passer par l\'air froid.'],
  ['Une couverture de survie dorée renvoie vers le corps une partie de la chaleur qu\'il émet.','rayonnement','La surface brillante réfléchit le rayonnement thermique émis par le corps.'],
  ['La poignée d\'une poêle en fer chauffe alors que seul le fond est sur la plaque.','conduction','La chaleur avance de proche en proche dans le métal, sans déplacement de matière : c\'est la conduction.'],
  ['Une cuillère en argent plongée dans un chocolat chaud devient vite brûlante jusqu\'au bout.','conduction','L\'argent conduit très bien la chaleur (λ = 418) : la chaleur remonte le long de la cuillère par conduction.'],
  ['Un matin d\'hiver, une rampe d\'escalier en métal paraît plus froide que la rampe en bois voisine.','conduction','Au contact, le métal (λ grand) enlève la chaleur de la main bien plus vite que le bois (λ petit) : c\'est la conduction.'],
  ['On pose les pieds sur une bouillotte : ils se réchauffent.','conduction','Les pieds touchent la bouillotte : la chaleur passe par contact, par conduction.']
];
const PH_COND=[['argent','conducteur'],['cuivre','conducteur'],['aluminium','conducteur'],['fer','conducteur'],['bois de sapin','isolant'],['liège en graine','isolant'],['polystyrène','isolant'],['laine de verre','isolant'],['air','isolant']];
const PH_QCM=[
  ['Une glacière (boîte isolante) produit-elle du froid, ou ralentit-elle seulement le réchauffement des boissons ?',['elle produit du froid','elle ralentit'],'elle ralentit','Une glacière ne fournit ni froid ni chaleur : ses parois isolantes (λ petit) limitent le passage de la chaleur de l\'extérieur vers l\'intérieur.'],
  ['Un double vitrage emprisonne une lame d\'air entre deux vitres. Cet air joue-t-il le rôle de conducteur ou d\'isolant ?',['conducteur','isolant'],'isolant','L\'air immobile a un λ très petit (0,025) : c\'est un isolant, qui limite les pertes par conduction.'],
  ['Dans une pièce chauffée, où l\'air est-il le plus chaud : près du plafond ou près du sol ?',['plafond','sol'],'plafond','L\'air chaud, moins dense, monte : il s\'accumule près du plafond (courants de convection).'],
  ['Le rayonnement thermique a-t-il besoin de matière pour se propager ?',['oui','non'],'non','Le rayonnement (ondes électromagnétiques) traverse le vide : c\'est ainsi que la chaleur du Soleil nous parvient.'],
  ['Dans la convection, la matière se déplace-t-elle ?',['oui','non'],'oui','La convection est un transfert de chaleur grâce au déplacement de la matière, dans les fluides.'],
  ['Dans quels milieux la convection a-t-elle lieu : solides ou fluides ?',['solides','fluides'],'fluides','La convection n\'a lieu que dans les matières qui peuvent s\'écouler : liquides et gaz (les fluides).'],
  ['Si λ est grand, le matériau est-il un bon conducteur ou un isolant ?',['conducteur','isolant'],'conducteur','λ grand : l\'énergie transmise est grande, le matériau est bon conducteur de chaleur.'],
  ['Pour isoler une maison, choisit-on un matériau à λ grand ou à λ petit ?',['grand','petit'],'petit','Un λ petit laisse passer peu de chaleur : c\'est un isolant thermique.'],
  ['Deux parois séparées par du vide : quels transferts ne peuvent pas traverser le vide ?',['conduction et convection','rayonnement'],'conduction et convection','Sans matière, ni conduction ni convection ne sont possibles. Le rayonnement, lui, traverse le vide.'],
  ['On double l\'épaisseur d\'une paroi (même matériau, mêmes températures). Le flux de chaleur double-t-il ou est-il divisé par deux ?',['il double','divisé par deux'],'divisé par deux','Dans Q/Δt = S · λ · Δθ / e, l\'épaisseur est au dénominateur : deux fois plus épais, deux fois moins de chaleur.']
];
function phTxt(o){
  const ex=mkTxt(Object.assign({lang:'fr',hintline:'Choisis ta réponse avec les touches (ou écris-la). Les accents et les majuscules ne comptent pas.',placeholder:'ta réponse'},o));
  ex.steps=[stp('Analyser la situation',o.hint),stp('Conclure',o.solution)];
  return ex;
}
function genPhMode(){
  const s=pick(PH_SIT);
  return phTxt({choices:PH_MODES,tag:'ph-mode',statement:s[0],answers:[s[1]],instr:'Quel est le mode de transfert de chaleur ?',
    hint:'La matière se déplace-t-elle (convection) ? Les corps se touchent-ils (conduction) ? La chaleur arrive-t-elle à distance, même à travers le vide (rayonnement) ?',
    solution:'<b>'+s[1]+'</b>. '+s[2],mist:phMist(PH_MODES,s[1],c=>'Ce n\'est pas de la '+c+'. '+s[2]),
    fallback:{tag:'ph-mode',title:'Réponds par un mode de transfert',html:'<p>Écris <b>conduction</b>, <b>convection</b> ou <b>rayonnement</b>.</p>'}});
}
function genPhCond(){
  if(Math.random()<0.5){
    const m=pick(PH_COND), ch=['conducteur','isolant'];
    return phTxt({choices:ch,tag:'ph-conducteur',statement:'Le matériau « '+m[0]+' » a une conductivité thermique λ = '+NF(phL(m[0]))+' W·m⁻¹·°C⁻¹. Est-ce un bon conducteur de chaleur ou un isolant ?',answers:m[1]==='conducteur'?['conducteur','bon conducteur']:['isolant','isolant thermique'],instr:'Bon conducteur ou isolant ?',
      hint:'Compare λ aux valeurs du tableau : les métaux ont un λ de plusieurs dizaines ou centaines, les isolants un λ inférieur à 0,2.',
      solution:'<b>'+m[1]+'</b> : λ = '+NF(phL(m[0]))+(m[1]==='conducteur'?' est grand, l\'énergie transmise est grande.':' est petit, peu de chaleur passe.'),
      mist:phMist(ch,m[1],c=>'λ = '+NF(phL(m[0]))+' est '+(m[1]==='conducteur'?'grand : ce n\'est pas un isolant.':'petit : ce n\'est pas un bon conducteur.')),
      fallback:{tag:'ph-conducteur',title:'Réponds conducteur ou isolant',html:'<p>Écris <b>conducteur</b> ou <b>isolant</b>.</p>'}});
  }
  let a,b; do{ a=pick(PH_LAMBDA.filter(x=>x[1]>0)); b=pick(PH_LAMBDA.filter(x=>x[1]>0)); }while(a[1]===b[1]||a[0]===b[0]);
  const best=a[1]>b[1]?a:b, worst=best===a?b:a, ch=[a[0],b[0]];
  return phTxt({choices:ch,tag:'ph-conducteur',statement:'Lequel de ces deux matériaux conduit le mieux la chaleur : '+a[0]+' (λ = '+NF(a[1])+') ou '+b[0]+' (λ = '+NF(b[1])+') ?',answers:[best[0]],instr:'Quel matériau conduit le mieux la chaleur ?',
    hint:'Plus λ est grand, plus le matériau conduit la chaleur.',
    solution:'<b>'+best[0]+'</b> : λ = '+NF(best[1])+' est plus grand que '+NF(worst[1])+' ('+worst[0]+').',
    mist:[[worst[0],'λ = '+NF(worst[1])+' est le plus petit des deux : c\'est le moins conducteur (le plus isolant).']],
    fallback:{tag:'ph-conducteur',title:'Choisis l\'un des deux matériaux',html:'<p>Écris le nom de l\'un des deux matériaux proposés.</p>'}});
}
function genPhQcm(){
  const q=pick(PH_QCM);
  return phTxt({choices:q[1],tag:'ph-cours',statement:q[0],answers:[q[2]],instr:'Réponds à la question',
    hint:'Demande-toi si la matière se déplace, si deux corps se touchent, ou si la chaleur arrive à distance.',solution:'<b>'+q[2]+'</b>. '+q[3],
    mist:phMist(q[1],q[2],()=>q[3]),fallback:{tag:'ph-cours',title:'Choisis l\'une des réponses proposées',html:'<p>Utilise les touches de réponse.</p>'}});
}

const PHT=(id,level,kind,label,gen)=>{ TOPICS[id]={kind,level,label,gen}; };
PHT('ph-cd1',1,'phcd','Flux de chaleur à travers une paroi',()=>genPhCd(false));
PHT('ph-cd2',2,'phcd','Paroi entre intérieur et extérieur (températures négatives)',()=>genPhCd(true));
PHT('ph-cd3',3,'phcd','Chaleur transmise pendant une durée',genPhCdEnergie);
PHT('ph-cd4',4,'phcd','Épaisseur nécessaire',genPhCdEpaisseur);
PHT('ph-cd5',5,'phcd','Épaisseurs qui isolent autant',genPhCdEquiv);
PHT('ph-cv1',1,'phcv','Flux de chaleur par convection',()=>genPhCv(false));
PHT('ph-cv2',2,'phcv','Convection avec une température négative',()=>genPhCv(true));
PHT('ph-cv3',3,'phcv','Température de l\'air',genPhCvAir);
PHT('ph-cv4',4,'phcv','Coefficient de convection',genPhCvAlpha);
PHT('ph-mt1',1,'phmt','Reconnaître le mode de transfert',genPhMode);
PHT('ph-mt2',2,'phmt','Conducteur ou isolant',genPhCond);
PHT('ph-mt3',3,'phmt','Questions sur les transferts de chaleur',genPhQcm);

/* ----- fiche de formules ----- */
/* chaque sous-thème ajoute ses tableaux : [titre, [[gauche, droite], …]] */
const PH_FORM=[
  ['Conduction',[['Flux de chaleur',M('Q/Δt = S · λ · Δθ / e')],['Unités','Q en J, Δt en s, S en m², λ en W·m⁻¹·°C⁻¹, e en m, Δθ en °C ; Q/Δt en W'],['λ grand / λ petit','Bon conducteur (métaux) / isolant thermique']]],
  ['Convection',[['Flux de chaleur',M('Q/Δt = S · α · Δθ')],['α typique','Gaz : 5 à 250 W·m⁻²·°C⁻¹ ; liquide : 200 à 5000 W·m⁻²·°C⁻¹']]],
  ['Énergie et conversions',[['Chaleur transmise',M('Q = (Q/Δt) × Δt')],['Durées','1 min = 60 s ; 1 h = 3600 s'],['Énergie','1 kJ = 1000 J ; 1 MJ = 1 000 000 J'],['Épaisseur','1 cm = 0,01 m']]],
  ['Conductivité thermique λ (W·m⁻¹·°C⁻¹)',PH_LAMBDA.map(x=>[x[0],NF(x[1])])]
];
/* thème (onglet) de chaque tableau de formules : « ph » (Chaleur) par défaut */
const PH_FDOM={'Dilatation des solides':'phd','Dilatation des liquides':'phd','Gaz parfaits':'phg'};
function phFormulas(T,d){ return PH_FORM.filter(f=>(PH_FDOM[f[0]]||'ph')===(d||'ph')).map(f=>T(f[0],f[1])).join(''); }

/* ----- fiches de cours ----- */
Object.assign(brData('physique'),{fiches:[
{d:'ph',t:'Chaleur · Transferts de chaleur : la conduction',html:
'<p>La page qui ouvre ce chapitre (C-23) ne m\'est pas parvenue : cette fiche commence à la page C-24.</p>'
+'<p>La chaleur Q transmise pendant une durée Δt au travers d\'une surface S dépend :</p><ul><li>de la <b>différence de température</b> Δθ = θ₁ − θ₂ ;</li><li>de l\'<b>épaisseur</b> de la paroi e ;</li><li>de la <b>conductivité thermique</b> du matériau λ (lambda).</li></ul>'
+'<p>'+M('Q/Δt = S · λ · Δθ / e')+'</p>'
+'<table class="ov"><tbody><tr><td>Q</td><td>chaleur transmise</td><td>J</td></tr><tr><td>Δt</td><td>durée</td><td>s</td></tr><tr><td>S</td><td>surface</td><td>m²</td></tr><tr><td>λ</td><td>conductivité thermique</td><td>W·m⁻¹·°C⁻¹</td></tr><tr><td>e</td><td>épaisseur</td><td>m</td></tr><tr><td>Δθ</td><td>différence de température</td><td>°C</td></tr></tbody></table>'
+'<p>La quantité Q/Δt s\'appelle aussi <b>flux de chaleur</b> (exprimé en watts).</p>'
+'<p>λ est un nombre qui caractérise chaque matériau. Si λ est grand, l\'énergie transmise est grande : le matériau est <b>bon conducteur</b> de chaleur. S\'il est petit, on parle d\'<b>isolant thermique</b>.</p>'},
{d:'ph',t:'Tableau de conductivité thermique',html:
'<table class="ov"><thead><tr><th>Matériau</th><th>λ en W·m⁻¹·°C⁻¹</th></tr></thead><tbody>'+PH_LAMBDA.map(x=>'<tr><td>'+x[0]+'</td><td>'+NF(x[1])+'</td></tr>').join('')+'</tbody></table>'},
{d:'ph',t:'La convection',html:
'<p>Le transfert de chaleur a lieu grâce au <b>déplacement de la matière</b>, dans les matières fluides (liquides, gaz). Les particules (atomes ou molécules), en bougeant, transportent avec elles la chaleur. Ces mouvements sont appelés <b>courants de convection</b> : la matière chaude se déplace pour céder de l\'énergie thermique à la matière froide.</p>'
+'<p><b>Convection dans l\'eau</b> (expérience) : la partie du liquide proche de la flamme chauffe en premier. L\'augmentation de température crée localement une <b>dilatation</b> du liquide, donc une diminution de sa masse volumique. La poussée d\'Archimède provoque alors un mouvement ascensionnel appelé <b>courant de convection</b> (pour mieux observer les courants, déposer du permanganate de potassium au fond du bécher).</p>'
+'<p><b>Convection dans l\'air</b> (expérience) : une spirale de papier fixée environ 10 cm au-dessus d\'une bougie allumée se met à tourner, poussée par l\'air chaud qui monte. Application : les planeurs, parapentes et ailes delta prennent de l\'altitude grâce aux courants de convection d\'air chaud, appelés <b>courants ascendants</b>.</p>'
+'<p>La chaleur transmise pendant une durée Δt d\'une surface à un fluide dépend de l\'aire S de la surface, d\'un coefficient de convection α et de la différence de température entre la surface et le fluide :</p>'
+'<p>'+M('Q/Δt = S · α · Δθ')+'</p>'
+'<table class="ov"><tbody><tr><td>α</td><td>coefficient de convection</td><td>W·m⁻²·°C⁻¹</td></tr><tr><td>S</td><td>aire de la surface</td><td>m²</td></tr><tr><td>Δθ</td><td>différence de température</td><td>°C</td></tr></tbody></table>'
+'<p>Valeurs typiques : pour un gaz, α = 5 à 250 W·m⁻²·°C⁻¹ ; pour un liquide, α = 200 à 5000 W·m⁻²·°C⁻¹.</p>'},
{d:'ph',t:'Le rayonnement thermique',html:
'<p>Tous les corps émettent un rayonnement (ondes électromagnétiques). L\'énergie rayonnée par la source dépend de sa température.</p>'
+'<p>La chaleur du Soleil nous parvient par rayonnement à travers le vide : la matière chaude reste immobile mais transmet de la chaleur à la matière froide à travers le vide, sous forme de rayonnement thermique.</p>'
+'<p>La suite du cours sur le rayonnement (pages après C-25) ne m\'est pas encore parvenue.</p>'},
{d:'ph',t:'À propos des exercices (CHR 4)',html:
'<p>Les exercices de l\'appli sont <b>originaux</b> : ils travaillent les mêmes notions que ta feuille d\'exercices (conduction, convection, modes de transfert, isolants), avec d\'autres situations et des valeurs tirées au hasard, sans reprendre ses énoncés.</p>'
+'<p>Pas encore dans l\'appli : le rayonnement chiffré (longueur d\'onde, flux rayonné), qui demande la suite du cours.</p>'}
]});
