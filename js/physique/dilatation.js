'use strict';
/* ===== Physique · Chaleur : la dilatation des solides (CHR 5) ===== */
/* Fiche d'après la page C-39 (résumé) ; exercices originaux inspirés des pages C-40 et C-41, sans en reprendre les énoncés.
   Le cours ne contient pas de tableau des coefficients α : les valeurs usuelles utilisées sont ajoutées par moi. */

DKINDS.ph.push('phdl','phdq');
MODES.ph.splice(MODES.ph.findIndex(m=>m[0]==='mix'),0,['phdl','Dilatation'],['phdq','Dilatation : questions']);
Object.assign(KIND_LABEL,{phdl:'Dilatation',phdq:'Dilatation : questions'});

Object.assign(TAGS,{
  'ph-dil-facteur':{label:'Facteur 2α ou 3α',tip:'Longueur : Δℓ = α · ℓ₁ · Δθ. Surface : ΔA = 2α · A₁ · Δθ. Volume : ΔV = 3α · V₁ · Δθ. α est toujours le coefficient de dilatation linéaire.'},
  'ph-dil-unite':{label:'Unité de la dilatation',tip:'La variation a la même unité que la grandeur de départ : ℓ₁ en m donne Δℓ en m. Convertis à la fin (1 m = 1000 mm), sur une ligne à part.'},
  'ph-dil-formule':{label:'Formule de la dilatation',tip:'ℓ₂ = ℓ₁ · (1 + α · Δθ) : la variation Δℓ = α · ℓ₁ · Δθ s\'ajoute à la longueur initiale. N\'oublie pas de multiplier par ℓ₁.'},
  'ph-dil-cours':{label:'Question sur la dilatation',tip:'Un corps chauffé grandit dans toutes ses dimensions (creux compris) ; refroidi, il se contracte. Chaque matériau a son propre coefficient α.'}
});

/* coefficients de dilatation linéaire usuels, en 10⁻⁶ °C⁻¹ (valeurs ajoutées, le cours n'en donne pas de tableau) */
const PH_ALPHA=[['acier',12],['cuivre',17],['aluminium',23],['laiton',19],['béton',12]];
const phA=n=>n+'·10⁻⁶ °C⁻¹';
const PH_DHINT='Écris tes calculs ligne par ligne, par exemple Δℓ = 17 * 10^-6 * 50 * 30 puis Δℓ = 0,0255 m. Une conversion (m → mm) se fait sur une nouvelle ligne : Δℓ = 25,5 mm. Écris 10^-6 pour 10⁻⁶.';
function phDil(o){ return Object.assign(phNum(o),{hintline:PH_DHINT}); }
function phTemps(){ const t1=rnd(-20,15), t2=t1+rnd(15,60); return Math.random()<0.25?[t2,t1]:[t1,t2]; }
const phDtD=(t1,t2)=>phS(t2)+' − '+(t1<0?'('+phS(t1)+')':t1)+' = '+phS(t2-t1);

function genPhDl1(){
  const m=pick(PH_ALPHA.slice(0,4)), a=m[1], obj=pick([['Un tuyau de chauffage en '+m[0],rnd(6,40)],['Une rambarde de balcon en '+m[0],rnd(4,15)],['La tige d\'un pendule en '+m[0],pick([1,1.5,2])],['Un câble de téléski en '+m[0],rnd(200,800)]]);
  let t=phTemps(); if(t[1]<t[0]) t=[t[1],t[0]];
  const L=obj[1], dt=t[1]-t[0], dl=a*1e-6*L*dt, d=2, mm=dl*1000;
  return phDil({svg:'',text:obj[0]+' mesure «'+NF(L)+'» m à «'+phS(t[0])+'» °C. Sa température passe à «'+phS(t[1])+'» °C. Calcule son allongement «Δℓ» en mm, '+phArr(d)+' («α» = '+phA(a)+').',
    ask:'l\'allongement (en mm)',val:mm,d,unit:'mm',placeholder:'Δℓ = 17 * 10^-6 * 50 * 30\nΔℓ = 0,0255 m\nΔℓ = 25,5 mm',
    steps:[stp('Formule',M('Δℓ = α · ℓ₁ · Δθ')),stp('Écart de température',M('Δθ = θ₂ − θ₁ = '+phDtD(t[0],t[1]))+' °C'),stp('Calcul',M('Δℓ = '+a+' · 10^-6 × '+L+' × '+dt+' = '+NF(phR(dl,6)))+' m ≈ '+NF(phR(mm,d))+' mm')],
    hints:['Δℓ = α · ℓ₁ · Δθ avec ℓ₁ en m : le résultat sort en m.','Δθ = θ₂ − θ₁ = '+phDtD(t[0],t[1])+' °C ; puis 1 m = 1000 mm.'],
    work:['Δℓ = '+a+' * 10^-6 * '+L+' * '+dt,'Δℓ = '+NF(phR(dl,6))+' m','Δℓ ≈ '+NF(phR(mm,d))+' mm'],
    mistakes:[{v:dl,x:a+' * 10^-6 * '+L+' * '+dt,u:'m',tag:'ph-dil-unite',msg:'Ce résultat est en mètres. L\'énoncé demande des mm : multiplie par 1000.'},
      {v:a*1e-6*L*(t[1]+t[0])*1000,x:a+' * 10^-6 * '+L+' * ('+phN(t[1])+' + '+phN(t[0])+') * 1000',tag:'ph-dt',msg:'Δθ = θ₂ − θ₁ = '+phDtD(t[0],t[1])+' °C.'},
      {v:a*1e-6*dt*1000,x:a+' * 10^-6 * '+dt+' * 1000',tag:'ph-dil-formule',msg:'Tu as oublié de multiplier par la longueur initiale ℓ₁ = '+L+' m.'}]});
}
function genPhDl2(){
  const m=pick(PH_ALPHA), a=m[1], L=pick([10,12,15,18,20,25,30,40]), t=phTemps(), dt=t[1]-t[0], L2=L*(1+a*1e-6*dt), d=3;
  const chauffe=dt>0, obj=m[0]==='béton'?'Une poutre en béton':'Une barre en '+m[0];
  return phDil({svg:'',text:obj+' mesure «'+L+'» m à «'+phS(t[0])+'» °C. On la '+(chauffe?'chauffe':'refroidit')+' jusqu\'à «'+phS(t[1])+'» °C. Calcule sa longueur finale «ℓ₂» en m, arrondie au millimètre, soit trois décimales («α» = '+phA(a)+').',
    ask:'la longueur finale (en m)',val:L2,d,unit:'m',placeholder:'ℓ₂ = 25 * (1 + 12 * 10^-6 * 40)\nℓ₂ = 25,012 m',
    steps:[stp('Formule',M('ℓ₂ = ℓ₁ · (1 + α · Δθ)')),stp('Écart',M('Δθ = '+phDtD(t[0],t[1]))+' °C'+(chauffe?'':' (négatif : la barre se contracte)')),stp('Calcul',M('ℓ₂ = '+L+' × (1 + '+a+' · 10^-6 × '+(dt<0?'('+phS(dt)+')':dt)+') ≈ '+NF(phR(L2,d)))+' m')],
    hints:['ℓ₂ = ℓ₁ · (1 + α · Δθ).','Δθ = θ₂ − θ₁ = '+phDtD(t[0],t[1])+' °C'+(chauffe?'.':' : il est négatif, la longueur diminue.')],
    work:['ℓ₂ = '+L+' * (1 + '+a+' * 10^-6 * '+(dt<0?'('+dt+')':dt)+')','ℓ₂ ≈ '+NF(phR(L2,d))+' m'],
    mistakes:[{v:L-(L2-L),x:L+' - '+L+' * '+a+' * 10^-6 * '+phN(dt),tag:'ph-dt',msg:chauffe?'La barre est chauffée : elle s\'allonge, ℓ₂ est plus grand que ℓ₁.':'La barre est refroidie : elle se contracte, ℓ₂ est plus petit que ℓ₁.'},
      {v:L+a*1e-6*dt,x:L+' + '+a+' * 10^-6 * '+phN(dt),tag:'ph-dil-formule',msg:'La variation vaut α · ℓ₁ · Δθ : il faut aussi multiplier par ℓ₁ = '+L+' m.'},
      {v:L2-L,x:L+' * '+a+' * 10^-6 * '+phN(dt),l:'Δℓ',tag:'ph-dil-formule',msg:'Tu as calculé la variation Δℓ. La longueur finale est ℓ₂ = ℓ₁ + Δℓ.'}]});
}
function genPhDl3(){
  const m=pick(['acier','aluminium','cuivre','laiton']), a=PH_ALPHA.find(x=>x[0]===m)[1], Lc=pick([30,40,50,60,80]), lc=pick([20,25,30,40]), A1=Lc*lc, t1=rnd(15,22), t2=t1+pick([80,100,150,200,250]), dt=t2-t1;
  const A2=A1*(1+2*a*1e-6*dt), d=2;
  return phDil({svg:'',text:'Une plaque en '+m+' de «'+Lc+'» cm sur «'+lc+'» cm est à «'+t1+'» °C. On la chauffe jusqu\'à «'+t2+'» °C. Calcule son aire finale «A₂» en cm², '+phArr(d)+' («α» = '+phA(a)+').',
    ask:'l\'aire finale (en cm²)',val:A2,d,unit:'cm',pow:2,placeholder:'A₁ = 50 * 40\nA₂ = 2000 * (1 + 2 * 23 * 10^-6 * 100)\nA₂ = 2009,2 cm²',
    steps:[stp('Aire initiale',M('A₁ = '+Lc+' × '+lc+' = '+A1)+' cm²'),stp('Formule',M('A₂ = A₁ · (1 + 2α · Δθ)')),stp('Calcul',M('A₂ = '+A1+' × (1 + 2 × '+a+' · 10^-6 × '+dt+') ≈ '+NF(phR(A2,d)))+' cm²')],
    hints:['Pour une surface, le coefficient est 2α : A₂ = A₁ · (1 + 2α · Δθ).','A₁ = '+Lc+' × '+lc+' = '+A1+' cm² et Δθ = '+t2+' − '+t1+' = '+dt+' °C.'],
    work:['A₂ = '+A1+' * (1 + 2 * '+a+' * 10^-6 * '+dt+')','A₂ ≈ '+NF(phR(A2,d))+' cm²'],
    mistakes:[{v:A1*(1+a*1e-6*dt),x:A1+' * (1 + '+a+' * 10^-6 * '+dt+')',tag:'ph-dil-facteur',msg:'Pour une surface, la dilatation vaut 2α · A₁ · Δθ (et non α · A₁ · Δθ).'},
      {v:A1*(1+3*a*1e-6*dt),x:A1+' * (1 + 3 * '+a+' * 10^-6 * '+dt+')',tag:'ph-dil-facteur',msg:'3α s\'utilise pour un volume. Pour une surface, c\'est 2α.'},
      {v:2*a*1e-6*A1*dt,x:'2 * '+a+' * 10^-6 * '+A1+' * '+dt,l:'ΔA',tag:'ph-dil-formule',msg:'Tu as calculé la variation ΔA. L\'aire finale est A₂ = A₁ + ΔA.'}]});
}
function genPhDl4(){
  const alu=Math.random()<0.5, a=alu?23:12, V1=alu?pick([2,5,10]):pick([200,500,1000]), t1=rnd(10,20), t2=t1+(alu?pick([60,80,100]):pick([30,40,50])), dt=t2-t1;
  const V2=V1*(1+3*a*1e-6*dt), d=alu?3:2, what=alu?'Une marmite en aluminium':'Une citerne en acier', u='L';
  return phDil({svg:'',text:what+' a une capacité de «'+V1+'» L à «'+t1+'» °C. Calcule sa capacité à «'+t2+'» °C, en L, '+(alu?'arrondie au millilitre (trois décimales)':phArr(d))+' («α» = '+phA(a)+').',
    ask:'la capacité (en L)',val:V2,d,unit:'L',placeholder:'V₂ = 500 * (1 + 3 * 12 * 10^-6 * 40)\nV₂ = 500,72 L',
    steps:[stp('Le creux se dilate','La capacité (le creux) se dilate comme si elle était pleine du même matériau.'),stp('Formule',M('V₂ = V₁ · (1 + 3α · Δθ)')),stp('Calcul',M('V₂ = '+V1+' × (1 + 3 × '+a+' · 10^-6 × '+dt+') ≈ '+NF(phR(V2,d)))+' L')],
    hints:['Pour un volume, le coefficient est 3α : V₂ = V₁ · (1 + 3α · Δθ).','Δθ = '+t2+' − '+t1+' = '+dt+' °C.'],
    work:['V₂ = '+V1+' * (1 + 3 * '+a+' * 10^-6 * '+dt+')','V₂ ≈ '+NF(phR(V2,d))+' L'],
    mistakes:[{v:V1*(1+a*1e-6*dt),x:V1+' * (1 + '+a+' * 10^-6 * '+dt+')',tag:'ph-dil-facteur',msg:'Pour un volume, la dilatation vaut 3α · V₁ · Δθ (et non α · V₁ · Δθ).'},
      {v:V1*(1+2*a*1e-6*dt),x:V1+' * (1 + 2 * '+a+' * 10^-6 * '+dt+')',tag:'ph-dil-facteur',msg:'2α s\'utilise pour une surface. Pour un volume, c\'est 3α.'},
      {v:V1,x:String(V1),tag:'ph-dil-cours',msg:'Le creux du récipient se dilate aussi : la capacité augmente un peu.'}]});
}
function genPhDl5(){
  const from=pick(['surface','volume']), q=from==='surface'?pick([0.2,0.4,0.6,0.8,1]):pick([0.3,0.6,0.9,1.2,1.5]), k=from==='surface'?2:3;
  const to=pick(from==='surface'?['longueur','volume']:['longueur','surface']), kt=to==='longueur'?1:to==='surface'?2:3, val=q/k*kt, d=2;
  const nom={longueur:'sa longueur',surface:'sa surface',volume:'son volume'}, sym={longueur:'Δℓ / ℓ₁',surface:'ΔA / A₁',volume:'ΔV / V₁'};
  return phDil({svg:'',text:'En chauffant une pièce métallique, on mesure que '+nom[from]+' a augmenté de «'+NF(q)+'» %. De combien de pour cent a augmenté '+nom[to]+' ? (Écris le nombre, sans le signe %.)',
    ask:'la variation relative (en %)',val,d,placeholder:'α · Δθ = 0,6 / 3\n'+sym[to]+' = 0,2',
    steps:[stp('Variations relatives',M('Δℓ / ℓ₁ = α · Δθ')+' ; '+M('ΔA / A₁ = 2α · Δθ')+' ; '+M('ΔV / V₁ = 3α · Δθ')),stp('Produit α · Δθ',M('α · Δθ = '+NF(q)+' / '+k+' = '+NF(phR(q/k,4)))+' %'),stp('Résultat',M(sym[to]+' = '+(kt===1?'':kt+' × ')+NF(phR(q/k,4))+' = '+NF(phR(val,d)))+' %')],
    hints:['Divise chaque formule par la grandeur initiale : '+sym[from]+' = '+k+'α · Δθ.','Trouve d\'abord α · Δθ = '+NF(q)+' / '+k+', puis multiplie par le facteur de '+nom[to]+' ('+kt+').'],
    work:['α * Δθ = '+NF(q)+' / '+k,sym[to]+' = '+NF(phR(val,d))],
    mistakes:[{v:q,x:NF(q),l:sym[to],tag:'ph-dil-facteur',msg:'Les variations relatives ne sont pas égales : longueur α · Δθ, surface 2α · Δθ, volume 3α · Δθ.'},
      {v:q*k*kt,x:NF(q)+' * '+k+' * '+kt,l:sym[to],tag:'ph-dil-facteur',msg:'Il faut d\'abord diviser par '+k+' pour obtenir α · Δθ, puis multiplier par '+kt+'.'},
      {v:q/k,x:NF(q)+' / '+k,l:sym[to],tag:'ph-dil-facteur',msg:'Tu as obtenu α · Δθ, c\'est-à-dire la variation de la longueur. Pour '+nom[to]+', multiplie par '+kt+'.'}]});
}

/* ----- questions (vrai ou faux, n° 1 ; situations des exercices) ----- */
const PH_VF=[
  ['Quand on refroidit une barre de métal, sa longueur diminue.','vrai','Refroidie, la barre se contracte : Δθ est négatif, donc Δℓ aussi.'],
  ['Un trou percé dans une plaque de métal rétrécit quand on chauffe la plaque.','faux','Le trou s\'agrandit : un creux se dilate comme s\'il était rempli du même matériau.'],
  ['Une barre en aluminium et une barre en acier de même longueur, chauffées de la même façon, s\'allongent de la même quantité.','faux','Les deux matériaux n\'ont pas le même coefficient α : l\'aluminium (23·10⁻⁶ °C⁻¹) s\'allonge environ deux fois plus que l\'acier (12·10⁻⁶ °C⁻¹).'],
  ['Pour le même échauffement, une barre deux fois plus longue s\'allonge deux fois plus.','vrai','Δℓ = α · ℓ₁ · Δθ est proportionnel à la longueur initiale ℓ₁.'],
  ['Si l\'écart de température double, l\'allongement double aussi.','vrai','Δℓ = α · ℓ₁ · Δθ est proportionnel à Δθ.'],
  ['Pour calculer la dilatation d\'un volume, on utilise le coefficient 3α.','vrai','ΔV = 3α · V₁ · Δθ (2α pour une surface, α pour une longueur).'],
  ['Dans la formule de la dilatation de surface, α est un coefficient de dilatation surfacique propre à la plaque.','faux','α reste le coefficient de dilatation linéaire du matériau ; c\'est le facteur 2 qui tient compte des deux dimensions.'],
  ['Les relations de la dilatation de surface et de volume sont exactes.','faux','Elles sont obtenues par approximation, mais l\'erreur est inférieure à 1 %.']
];
const PH_DQ=[
  ['Autrefois, on laissait un petit espace entre deux rails de chemin de fer. Pourquoi ?',['laisser de la place à la dilatation','économiser du métal'],'laisser de la place à la dilatation','En été, les rails s\'allongent : sans espace, ils se pousseraient et se déformeraient.'],
  ['Le couvercle métallique d\'un bocal en verre est coincé. On le passe sous l\'eau chaude : le métal se dilate-t-il plus ou moins que le verre ?',['plus','moins'],'plus','Le métal a un coefficient α plus grand que le verre : le couvercle s\'agrandit davantage et se dévisse plus facilement.'],
  ['Entre deux pylônes, une ligne électrique pend-elle davantage en été ou en hiver ?',['ete','hiver'],'ete','En été, le câble s\'allonge par dilatation : il pend davantage.'],
  ['Pour enfiler une bague métallique serrée sur un axe, faut-il chauffer ou refroidir la bague avant ?',['la chauffer','la refroidir'],'la chauffer','Chauffée, la bague se dilate et son trou s\'agrandit ; en refroidissant, elle serre fortement l\'axe.'],
  ['Un bilame laiton-acier chauffé se courbe. Le laiton (α = 19·10⁻⁶ °C⁻¹) se trouve-t-il à l\'extérieur ou à l\'intérieur de la courbure ?',['exterieur','interieur'],'exterieur','Le laiton s\'allonge plus que l\'acier (α plus grand) : la lame la plus longue se place à l\'extérieur de la courbure.'],
  ['Sur un long trottoir en béton, on coupe des rainures à intervalles réguliers. À quoi servent-elles ?',['éviter les fissures dues à la dilatation','faire couler l\'eau'],'éviter les fissures dues à la dilatation','Le béton se dilate et se contracte avec la température : les rainures lui laissent la place de bouger sans se fissurer au hasard.']
];
function genPhDq(){
  if(Math.random()<0.55){ const q=pick(PH_VF), ch=['vrai','faux'];
    return phTxt({choices:ch,tag:'ph-dil-cours',statement:q[0],answers:[q[1]],instr:'Vrai ou faux ?',hint:'Pense à ce qui arrive à toutes les dimensions d\'un corps qu\'on chauffe, et au coefficient α propre à chaque matériau.',
      solution:'<b>'+q[1]+'</b>. '+q[2],mist:phMist(ch,q[1],()=>q[2]),fallback:{tag:'ph-dil-cours',title:'Réponds vrai ou faux',html:'<p>Écris <b>vrai</b> ou <b>faux</b>.</p>'}}); }
  const q=pick(PH_DQ);
  return phTxt({choices:q[1],tag:'ph-dil-cours',statement:q[0],answers:[q[2]],instr:'Choisis la bonne réponse',hint:'Un corps chauffé grandit, un corps refroidi se contracte ; chaque matériau a son propre coefficient α.',
    solution:'<b>'+q[2]+'</b>. '+q[3],mist:phMist(q[1],q[2],()=>q[3]),fallback:{tag:'ph-dil-cours',title:'Choisis l\'une des réponses proposées',html:'<p>Utilise les touches de réponse.</p>'}});
}

PHT('ph-dl1',1,'phdl','Allongement d\'un fil ou d\'une tige',genPhDl1);
PHT('ph-dl2',2,'phdl','Longueur finale (chauffage ou refroidissement)',genPhDl2);
PHT('ph-dl3',3,'phdl','Dilatation d\'une surface',genPhDl3);
PHT('ph-dl4',4,'phdl','Dilatation d\'un volume (capacité)',genPhDl4);
PHT('ph-dl5',5,'phdl','Variations relatives',genPhDl5);
PHT('ph-dq1',1,'phdq','Vrai ou faux et situations',genPhDq);

/* ----- fiche de cours ----- */
PH_FORM.push(['Dilatation des solides',[['Longueur',M('Δℓ = α · ℓ₁ · Δθ')+' ; '+M('ℓ₂ = ℓ₁ · (1 + α · Δθ)')],['Surface',M('ΔA = 2α · A₁ · Δθ')+' ; '+M('A₂ = A₁ · (1 + 2α · Δθ)')],['Volume',M('ΔV = 3α · V₁ · Δθ')+' ; '+M('V₂ = V₁ · (1 + 3α · Δθ)')],['α','Coefficient de dilatation linéaire, en °C⁻¹ ou K⁻¹']]]);
brData('physique').fiches.push(
{d:'ph',t:'Chaleur · La dilatation des solides (résumé)',html:
'<p>À part les rares cas de réarrangement moléculaire, l\'augmentation de température d\'un corps s\'accompagne d\'une augmentation de taille. Selon les cas, on s\'intéresse à une de ses dimensions (<b>dilatation linéaire</b>), à sa surface (<b>dilatation de surface</b>) ou à son volume (<b>dilatation volumique</b>).</p>'
+'<h3>Dilatation linéaire</h3><p>'+M('Δℓ = ℓ₂ − ℓ₁ = α · ℓ₁ · (θ₂ − θ₁) = α · ℓ₁ · Δθ')+'<br>'+M('ℓ₂ = ℓ₁ + α · ℓ₁ · Δθ = ℓ₁ · (1 + α · Δθ)')+'</p>'
+'<p>ℓ₁ : longueur initiale [m] ; ℓ₂ : longueur finale [m] ; Δℓ : variation de longueur [m].</p>'
+'<h3>Dilatation de surface</h3><p>'+M('ΔA = A₂ − A₁ = 2α · A₁ · Δθ')+'<br>'+M('A₂ = A₁ + 2α · A₁ · Δθ = A₁ · (1 + 2α · Δθ)')+'</p>'
+'<p>A₁ : surface initiale [m²] ; A₂ : surface finale [m²] ; ΔA : variation de surface [m²].</p>'
+'<h3>Dilatation volumique</h3><p>'+M('ΔV = V₂ − V₁ = 3α · V₁ · Δθ')+'<br>'+M('V₂ = V₁ + 3α · V₁ · Δθ = V₁ · (1 + 3α · Δθ)')+'</p>'
+'<p>V₁ : volume initial [m³] ; V₂ : volume final [m³] ; ΔV : variation de volume [m³].</p>'
+'<p>Dans les trois cas : θ₁ température initiale et θ₂ température finale [°C] ou [K] ; Δθ = θ₂ − θ₁ ; α <b>coefficient de dilatation linéaire</b> [°C⁻¹] ou [K⁻¹].</p>'
+'<p><b>Remarque</b> : les relations pour la dilatation de surface et la dilatation volumique sont obtenues par approximation ; l\'erreur est cependant inférieure à 1 %.</p>'},
{d:'ph',t:'Dilatation : coefficients utilisés (CHR 5)',html:
'<p>Ton cours ne donne pas encore de tableau des coefficients α. Les exercices de l\'appli utilisent ces valeurs usuelles (ajoutées par moi, à vérifier dans ton cours) :</p>'
+'<table class="ov"><thead><tr><th>Matériau</th><th>α en 10⁻⁶ °C⁻¹</th></tr></thead><tbody>'+PH_ALPHA.map(x=>'<tr><td>'+x[0]+'</td><td>'+x[1]+'</td></tr>').join('')+'</tbody></table>'
+'<p>Les exercices de l\'appli sont <b>originaux</b> : mêmes notions que ta feuille (allongement, surface, volume, variations relatives, vrai ou faux, situations de la vie courante), avec d\'autres situations et des valeurs tirées au hasard.</p>'}
);
