'use strict';
/* ===== Physique · Chaleur : la dilatation des liquides (CHR 6) ===== */
/* Fiche d'après la page C-46 (résumé) ; exercices originaux inspirés des pages C-47 et C-48, sans en reprendre les énoncés.
   Le cours ne contient pas de tableau des coefficients γ et α : les valeurs usuelles utilisées sont ajoutées par moi. */

DKINDS.ph.push('phli','phlq');
MODES.ph.splice(MODES.ph.findIndex(m=>m[0]==='mix'),0,['phli','Liquides'],['phlq','Liquides : questions']);
Object.assign(KIND_LABEL,{phli:'Dilatation des liquides',phlq:'Liquides : questions'});

Object.assign(TAGS,{
  'ph-liq-app':{label:'Dilatation apparente',tip:'Le récipient se dilate aussi : la dilatation apparente vaut ΔV app = (γ − 3α) · V₁ · Δθ, avec γ du liquide et α (linéaire) du récipient.'},
  'ph-liq-formule':{label:'Formule de la dilatation d\'un liquide',tip:'ΔV = γ · V₁ · Δθ et V₂ = V₁ · (1 + γ · Δθ) : γ est déjà un coefficient volumique, pas de facteur 3 devant lui.'},
  'ph-liq-cours':{label:'Question sur les liquides',tip:'Un liquide chauffé augmente de volume (sauf l\'eau entre 0 °C et 4 °C) ; sa masse ne change pas, sa masse volumique diminue. Le récipient se dilate aussi, mais moins.'}
});

/* coefficients usuels (ajoutés) : γ des liquides en 10⁻³ °C⁻¹, α des récipients en 10⁻⁶ °C⁻¹ */
const PH_GAMMA=[['alcool',1.1],['essence',0.95],['huile d\'olive',0.7],['glycérine',0.5],['mercure',0.18]];
const PH_CONT=[['verre',9],['acier',12],['aluminium',23]];
const phG=g=>NF(g)+'·10⁻³ °C⁻¹';
const phDe=n=>(/^[aeiouyhéè]/i.test(n)?'d\'':'de ')+n;
const PH_LHINT='Écris tes calculs ligne par ligne, par exemple ΔV = 0,95 * 10^-3 * 20 * 15 puis ΔV = 0,285 L. Une conversion (L → mL) se fait sur une nouvelle ligne : ΔV = 285 mL. Écris 10^-3 pour 10⁻³.';
function phLiq(o){ return Object.assign(phNum(o),{hintline:PH_LHINT}); }

function genPhLi1(){
  const c=pick([['Le réservoir d\'une tondeuse','essence',[2,3,4]],['Une bonbonne','glycérine',[5,10,20]],['Une friteuse','huile d\'olive',[3,4,5]],['Un bidon de laboratoire','alcool',[1,2,5]]]);
  const g=PH_GAMMA.find(x=>x[0]===c[1])[1], V1=pick(c[2]), t1=rnd(10,20), t2=c[1]==='huile d\'olive'?t1+rnd(60,140):t1+rnd(10,30), dt=t2-t1;
  const dV=g*1e-3*V1*dt, d=1, mL=dV*1000;
  return phLiq({svg:'',text:c[0]+' contient «'+V1+'» L '+phDe(c[1])+' à «'+t1+'» °C. La température monte à «'+t2+'» °C. De combien de mL le volume du liquide augmente-t-il ? Donne le résultat '+phArr(d)+' («γ» = '+phG(g)+' ; on ne tient pas compte du récipient).',
    ask:'l\'augmentation de volume (en mL)',val:mL,d,unit:'mL',placeholder:'ΔV = 0,95 * 10^-3 * 3 * 20\nΔV = 0,057 L\nΔV = 57 mL',
    steps:[stp('Formule',M('ΔV = γ · V₁ · Δθ')),stp('Calcul',M('ΔV = '+NF(g)+' · 10^-3 × '+V1+' × '+dt+' = '+NF(phR(dV,5)))+' L'),stp('En mL',M('ΔV ≈ '+NF(phR(mL,d)))+' mL')],
    hints:['ΔV = γ · V₁ · Δθ avec V₁ en L : le résultat sort en L.','Δθ = '+t2+' − '+t1+' = '+dt+' °C ; 1 L = 1000 mL.'],
    work:['ΔV = '+NF(g)+' * 10^-3 * '+V1+' * '+dt,'ΔV = '+NF(phR(dV,5))+' L','ΔV ≈ '+NF(phR(mL,d))+' mL'],
    mistakes:[{v:dV,x:NF(g)+' * 10^-3 * '+V1+' * '+dt,u:'L',tag:'ph-dil-unite',msg:'Ce résultat est en litres. L\'énoncé demande des mL : multiplie par 1000.'},
      {v:3*mL,x:'3 * '+NF(g)+' * 10^-3 * '+V1+' * '+dt+' * 1000',tag:'ph-liq-formule',msg:'γ est déjà un coefficient de dilatation volumique : pas de facteur 3 (le 3α concerne les solides).'},
      {v:g*1e-3*dt*1000,x:NF(g)+' * 10^-3 * '+dt+' * 1000',tag:'ph-dil-formule',msg:'Il faut aussi multiplier par le volume initial V₁ = '+V1+' L.'}]});
}
function genPhLi2(){
  const l=pick(PH_GAMMA.slice(0,4)), g=l[1], V1=pick([20,50,100,200,500]), t1=rnd(15,30), cool=Math.random()<0.5, t2=cool?t1-rnd(15,30):t1+rnd(10,25), dt=t2-t1;
  const V2=V1*(1+g*1e-3*dt), d=2;
  return phLiq({svg:'',text:'Une cuve de stockage contient «'+V1+'» L '+phDe(l[0])+' à «'+t1+'» °C. '+(cool?'La nuit, sa température descend à «':'Au soleil, sa température monte à «')+phS(t2)+'» °C. Quel est alors le volume du liquide, en L, '+phArr(d)+' ? («γ» = '+phG(g)+' ; on ne tient pas compte de la cuve.)',
    ask:'le volume final (en L)',val:V2,d,unit:'L',placeholder:'V₂ = 100 * (1 + 1,1 * 10^-3 * 20)\nV₂ = 102,2 L',
    steps:[stp('Formule',M('V₂ = V₁ · (1 + γ · Δθ)')),stp('Écart',M('Δθ = '+phDtD(t1,t2))+' °C'+(cool?' (négatif : le liquide se contracte)':'')),stp('Calcul',M('V₂ = '+V1+' × (1 + '+NF(g)+' · 10^-3 × '+(dt<0?'('+phS(dt)+')':dt)+') ≈ '+NF(phR(V2,d)))+' L')],
    hints:['V₂ = V₁ · (1 + γ · Δθ).','Δθ = θ₂ − θ₁ = '+phDtD(t1,t2)+' °C'+(cool?' : il est négatif, le volume diminue.':'.')],
    work:['V₂ = '+V1+' * (1 + '+NF(g)+' * 10^-3 * '+(dt<0?'('+dt+')':dt)+')','V₂ ≈ '+NF(phR(V2,d))+' L'],
    mistakes:[{v:V1-(V2-V1),x:V1+' - '+V1+' * '+NF(g)+' * 10^-3 * '+phN(dt),tag:'ph-dt',msg:cool?'Le liquide refroidit : il se contracte, son volume diminue.':'Le liquide chauffe : il se dilate, son volume augmente.'},
      {v:V2-V1,x:V1+' * '+NF(g)+' * 10^-3 * '+phN(dt),l:'ΔV',tag:'ph-dil-formule',msg:'Tu as calculé la variation ΔV. Le volume final est V₂ = V₁ + ΔV.'},
      {v:V1*(1+3*g*1e-3*dt),x:V1+' * (1 + 3 * '+NF(g)+' * 10^-3 * '+phN(dt)+')',tag:'ph-liq-formule',msg:'γ est déjà volumique : V₂ = V₁ · (1 + γ · Δθ), sans facteur 3.'}]});
}
function phApp(){
  const l=pick(PH_GAMMA), c=pick(PH_CONT.filter(x=>!(l[0]==='mercure'&&x[0]==='aluminium'))), g=l[1]*1e-3, a=c[1]*1e-6;
  return {l,c,g,a,k:g-3*a};
}
function genPhLi3(){
  const p=phApp(), V1=pick([0.5,1,2,5]), t1=rnd(10,20), t2=t1+rnd(30,70), dt=t2-t1, dV=p.k*V1*dt, d=1, mL=dV*1000;
  return phLiq({svg:'',text:'Un récipient en '+p.c[0]+' («α» = '+p.c[1]+'·10⁻⁶ °C⁻¹) est gradué à «'+t1+'» °C. Il contient «'+NF(V1)+'» L '+phDe(p.l[0])+' («γ» = '+phG(p.l[1])+'). On chauffe l\'ensemble à «'+t2+'» °C. De combien de mL le niveau lu sur les graduations augmente-t-il ? Donne le résultat '+phArr(d)+'.',
    ask:'la dilatation apparente (en mL)',val:mL,d,unit:'mL',placeholder:'ΔV app = (1,1 * 10^-3 - 3 * 9 * 10^-6) * 2 * 40\nΔV app = 0,08584 L\nΔV app ≈ 85,8 mL',
    steps:[stp('Le récipient se dilate aussi','On lit la dilatation apparente : '+M('ΔV app = (γ − 3α) · V₁ · Δθ')),stp('Coefficient apparent',M('γ − 3α = '+NF(p.l[1])+' · 10^-3 − 3 × '+p.c[1]+' · 10^-6 = '+NF(phR(p.k*1e3,4))+' · 10^-3')+' °C⁻¹'),stp('Calcul',M('ΔV app = '+NF(phR(p.k*1e3,4))+' · 10^-3 × '+NF(V1)+' × '+dt+' ≈ '+NF(phR(mL,d)))+' mL')],
    hints:['Les graduations se dilatent avec le récipient : utilise ΔV app = (γ − 3α) · V₁ · Δθ.','Attention aux puissances : γ est en 10⁻³, α en 10⁻⁶. Puis 1 L = 1000 mL.'],
    work:['ΔV = ('+NF(p.l[1])+' * 10^-3 - 3 * '+p.c[1]+' * 10^-6) * '+NF(V1)+' * '+dt,'ΔV ≈ '+NF(phR(mL,d))+' mL'],
    mistakes:[{v:p.g*V1*dt*1000,x:NF(p.l[1])+' * 10^-3 * '+NF(V1)+' * '+dt+' * 1000',tag:'ph-liq-app',msg:'Tu as calculé la dilatation réelle du liquide. Le récipient se dilate aussi : retire 3α (dilatation apparente).'},
      {v:(p.g-p.a)*V1*dt*1000,x:'('+NF(p.l[1])+' * 10^-3 - '+p.c[1]+' * 10^-6) * '+NF(V1)+' * '+dt+' * 1000',tag:'ph-liq-app',msg:'Le récipient se dilate en volume : c\'est 3α qu\'il faut retirer, pas α.'},
      {v:(p.g+3*p.a)*V1*dt*1000,x:'('+NF(p.l[1])+' * 10^-3 + 3 * '+p.c[1]+' * 10^-6) * '+NF(V1)+' * '+dt+' * 1000',tag:'ph-liq-app',msg:'La dilatation du récipient se retranche : (γ − 3α), pas (γ + 3α).'},
      {v:dV,x:'('+NF(p.l[1])+' * 10^-3 - 3 * '+p.c[1]+' * 10^-6) * '+NF(V1)+' * '+dt,u:'L',tag:'ph-dil-unite',msg:'Ce résultat est en litres : multiplie par 1000 pour l\'avoir en mL.'}]});
}
function genPhLi4(){
  const p=phApp(), V1=pick([1,2,4,5,10]), t1=rnd(12,22), free=pick([10,20,25,40,50]), dt=free/1000/(p.k*V1), t2=t1+dt, d=1;
  return phLiq({svg:'',text:'Un récipient en '+p.c[0]+' («α» = '+p.c[1]+'·10⁻⁶ °C⁻¹) contient «'+V1+'» L '+phDe(p.l[0])+' («γ» = '+phG(p.l[1])+') à «'+t1+'» °C. Il reste «'+free+'» mL de place libre sous le bord. À partir de quelle température le liquide déborde-t-il ? Donne-la en °C, '+phArr(d)+'.',
    ask:'la température de débordement (en °C)',val:t2,d,unit:'°C',placeholder:'Δθ = 0,025 / ((0,95 * 10^-3 - 3 * 12 * 10^-6) * 2)\nθ₂ = 18 + 13,7 = 31,7 °C',
    steps:[stp('Condition','Le liquide déborde quand sa dilatation apparente atteint la place libre : '+M('ΔV app = '+free+' mL = '+NF(free/1000)+' L')),stp('Isoler Δθ',M('Δθ = ΔV app / ((γ − 3α) · V₁) = '+NF(free/1000)+' / ('+NF(phR(p.k*1e3,4))+' · 10^-3 × '+V1+') ≈ '+NF(phR(dt,2)))+' °C'),stp('Température',M('θ₂ = '+t1+' + '+NF(phR(dt,2))+' ≈ '+NF(phR(t2,d)))+' °C')],
    hints:['Le récipient se dilate aussi : c\'est la dilatation apparente (γ − 3α) · V₁ · Δθ qui doit valoir la place libre.','Convertis la place libre en L ('+free+' mL = '+NF(free/1000)+' L), isole Δθ, puis ajoute-le à '+t1+' °C.'],
    work:['Δθ = '+NF(free/1000)+' / (('+NF(p.l[1])+' * 10^-3 - 3 * '+p.c[1]+' * 10^-6) * '+V1+')','θ ≈ '+NF(phR(t2,d))+' °C'],
    mistakes:[{v:dt,x:NF(free/1000)+' / (('+NF(p.l[1])+' * 10^-3 - 3 * '+p.c[1]+' * 10^-6) * '+V1+')',l:'Δθ',u:'°C',tag:'ph-dt',msg:'Tu as calculé l\'échauffement Δθ. La température cherchée est θ₂ = θ₁ + Δθ.'},
      {v:t1+free/1000/(p.g*V1),x:t1+' + '+NF(free/1000)+' / ('+NF(p.l[1])+' * 10^-3 * '+V1+')',tag:'ph-liq-app',msg:'Le récipient se dilate aussi et repousse le débordement : utilise (γ − 3α), pas γ seul.'},
      {v:t1+free/(p.k*V1),x:t1+' + '+free+' / (('+NF(p.l[1])+' * 10^-3 - 3 * '+p.c[1]+' * 10^-6) * '+V1+')',tag:'ph-dil-unite',msg:'La place libre doit être en litres comme V₁ : '+free+' mL = '+NF(free/1000)+' L.'}]});
}
function genPhLi5(){
  const l=pick([['alcool',1.1],['mercure',0.18]]), V=l[0]==='mercure'?pick([150,200,250,300]):pick([100,150,200]), s=pick([0.05,0.08,0.1,0.2]), dt=pick([1,5,10,20]), h=l[1]*1e-3*V*dt/s, d=1;
  return phLiq({svg:'',text:'Le réservoir d\'un thermomètre contient «'+V+'» mm³ '+phDe(l[0])+' («γ» = '+phG(l[1])+'). Le tube a une section intérieure de «'+NF(s)+'» mm². De combien de mm la colonne monte-t-elle quand la température augmente de «'+dt+'» °C ? Donne le résultat '+phArr(d)+' (on néglige la dilatation du verre).',
    ask:'la montée de la colonne (en mm)',val:h,d,unit:'mm',placeholder:'ΔV = 1,1 * 10^-3 * 200 * 10\nh = 2,2 / 0,1 = 22 mm',
    steps:[stp('Volume dilaté',M('ΔV = γ · V₁ · Δθ = '+NF(l[1])+' · 10^-3 × '+V+' × '+dt+' = '+NF(phR(l[1]*1e-3*V*dt,4)))+' mm³'),stp('Hauteur dans le tube','Le volume supplémentaire remplit le tube : '+M('h = ΔV / s = '+NF(phR(l[1]*1e-3*V*dt,4))+' / '+NF(s)+' ≈ '+NF(phR(h,d)))+' mm')],
    hints:['Calcule d\'abord le volume ajouté ΔV = γ · V₁ · Δθ (en mm³).','Ce volume forme une colonne de section s : sa hauteur vaut h = ΔV / s.'],
    work:['ΔV = '+NF(l[1])+' * 10^-3 * '+V+' * '+dt,'h = '+NF(phR(l[1]*1e-3*V*dt,4))+' / '+NF(s),'h ≈ '+NF(phR(h,d))+' mm'],
    mistakes:[{v:l[1]*1e-3*V*dt,x:NF(l[1])+' * 10^-3 * '+V+' * '+dt,l:'ΔV',u:'',tag:'ph-liq-formule',msg:'Tu as calculé le volume ajouté (en mm³). Divise-le par la section du tube pour obtenir la hauteur.'},
      {v:l[1]*1e-3*V*dt*s,x:NF(l[1])+' * 10^-3 * '+V+' * '+dt+' * '+NF(s),l:'h',tag:'ph-liq-formule',msg:'La hauteur vaut ΔV / s : il faut diviser par la section, pas multiplier.'}]});
}

const PH_LVF=[
  ['L\'eau qu\'on chauffe de 0 °C à 4 °C diminue de volume.','vrai','C\'est l\'exception citée dans le cours (réarrangement moléculaire) : entre 0 °C et 4 °C, l\'eau se contracte quand on la chauffe.'],
  ['Pour un liquide, on utilise directement un coefficient de dilatation volumique γ.','vrai','Un liquide n\'a pas de forme propre : on ne s\'intéresse qu\'à son volume, ΔV = γ · V₁ · Δθ.'],
  ['La dilatation lue sur un récipient gradué est plus grande que la dilatation réelle du liquide.','faux','Le récipient se dilate aussi : la dilatation apparente (γ − 3α) est plus petite que la dilatation réelle (γ).'],
  ['Si le récipient se dilatait exactement autant que le liquide (γ = 3α), le niveau lu ne changerait pas.','vrai','ΔV app = (γ − 3α) · V₁ · Δθ vaut alors zéro.'],
  ['Quand de l\'huile chauffe dans une casserole, sa masse volumique diminue.','vrai','Sa masse reste la même mais son volume augmente : la masse volumique (masse / volume) diminue.'],
  ['Un liquide refroidi de 20 °C à 5 °C voit son volume augmenter.','faux','Hors de l\'exception de l\'eau entre 0 °C et 4 °C, un liquide refroidi se contracte : Δθ négatif, ΔV négatif.']
];
const PH_LQ=[
  ['On remplit une casserole d\'huile jusqu\'au bord, puis on la chauffe. Que se passe-t-il ?',['elle déborde','le niveau baisse'],'elle déborde','L\'huile se dilate bien plus que la casserole : son volume dépasse la capacité du récipient.'],
  ['Pourquoi le tube d\'un thermomètre à liquide est-il très fin ?',['pour que la colonne monte davantage','pour économiser le verre'],'pour que la colonne monte davantage','Le petit volume ajouté par la dilatation forme une colonne d\'autant plus haute que le tube est fin (h = ΔV / s).'],
  ['En hiver, un étang commence-t-il à geler en surface ou au fond ?',['en surface','au fond'],'en surface','L\'eau la plus dense (vers 4 °C) reste au fond ; l\'eau plus froide, moins dense, reste en surface et gèle la première.'],
  ['Un bidon d\'essence plein à ras bord est laissé au soleil. Le risque principal est-il un débordement ou une évaporation complète ?',['débordement','évaporation complète'],'débordement','L\'essence a un γ élevé : en se réchauffant, elle augmente de volume et peut déborder ou faire gonfler le bidon.'],
  ['Pour un même échauffement, quel liquide se dilate le plus : l\'alcool (γ = 1,1·10⁻³ °C⁻¹) ou le mercure (γ = 0,18·10⁻³ °C⁻¹) ?',['alcool','mercure'],'alcool','Le coefficient γ de l\'alcool est environ six fois plus grand que celui du mercure.']
];
function genPhLq(){
  if(Math.random()<0.5){ const q=pick(PH_LVF), ch=['vrai','faux'];
    return phTxt({choices:ch,tag:'ph-liq-cours',statement:q[0],answers:[q[1]],instr:'Vrai ou faux ?',hint:'Pense à ce que deviennent le volume, la masse et la masse volumique d\'un liquide chauffé, et au récipient qui se dilate aussi.',
      solution:'<b>'+q[1]+'</b>. '+q[2],mist:phMist(ch,q[1],()=>q[2]),fallback:{tag:'ph-liq-cours',title:'Réponds vrai ou faux',html:'<p>Écris <b>vrai</b> ou <b>faux</b>.</p>'}}); }
  const q=pick(PH_LQ);
  return phTxt({choices:q[1],tag:'ph-liq-cours',statement:q[0],answers:[q[2]],instr:'Choisis la bonne réponse',hint:'Un liquide chauffé augmente de volume, plus que son récipient ; sa masse ne change pas.',
    solution:'<b>'+q[2]+'</b>. '+q[3],mist:phMist(q[1],q[2],()=>q[3]),fallback:{tag:'ph-liq-cours',title:'Choisis l\'une des réponses proposées',html:'<p>Utilise les touches de réponse.</p>'}});
}

PHT('ph-li1',1,'phli','Augmentation de volume d\'un liquide',genPhLi1);
PHT('ph-li2',2,'phli','Volume final (chauffage ou refroidissement)',genPhLi2);
PHT('ph-li3',3,'phli','Dilatation apparente dans un récipient gradué',genPhLi3);
PHT('ph-li4',4,'phli','Température de débordement',genPhLi4);
PHT('ph-li5',5,'phli','Colonne d\'un thermomètre',genPhLi5);
PHT('ph-lq1',1,'phlq','Vrai ou faux et situations',genPhLq);

PH_FORM.push(['Dilatation des liquides',[['Dilatation réelle',M('ΔV = γ · V₁ · Δθ')+' ; '+M('V₂ = V₁ · (1 + γ · Δθ)')],['Dilatation apparente',M('ΔV app = (γ − 3α) · V₁ · Δθ')],['γ, α','γ : coefficient volumique du liquide ; α : coefficient linéaire du récipient'],['Exception','L\'eau entre 0 °C et 4 °C se contracte quand on la chauffe']]]);
brData('physique').fiches.push(
{d:'ph',t:'Chaleur · La dilatation des liquides (résumé)',html:
'<p>À part les rares cas de réarrangement moléculaire (comme pour l\'eau entre 0 °C et 4 °C), l\'augmentation de température d\'un liquide s\'accompagne d\'une augmentation de son volume :</p>'
+'<p>'+M('ΔV = V₂ − V₁ = γ · V₁ · (θ₂ − θ₁) = γ · V₁ · Δθ')+'<br>'+M('V₂ = V₁ + γ · V₁ · Δθ = V₁ · (1 + γ · Δθ)')+'</p>'
+'<p>V₁ : volume initial [m³] ; V₂ : volume final [m³] ; ΔV : variation de volume [m³] ; θ₁, θ₂ : températures initiale et finale [°C] ou [K] ; Δθ = θ₂ − θ₁ ; γ : <b>coefficient de dilatation volumique</b> du liquide [°C⁻¹] ou [K⁻¹].</p>'
+'<h3>Dilatation apparente</h3><p>Généralement, un liquide est contenu dans un récipient qui se dilate lui-même ; on peut en tenir compte si l\'on connaît le coefficient de dilatation linéaire α de la matière du récipient. On calcule alors la <b>dilatation apparente</b> du liquide dans le récipient, particulièrement utile pour les liquides contenus dans des récipients gradués :</p>'
+'<p>'+M('ΔV app = (γ − 3α) · V₁ · (θ₂ − θ₁)')+'<br>'+M('V₂ app = V₁ · (1 + (γ − 3α) · Δθ)')+'</p>'
+'<p>γ : coefficient de dilatation volumique du liquide ; α : coefficient de dilatation linéaire du récipient [°C⁻¹] ou [K⁻¹].</p>'},
{d:'ph',t:'Liquides : coefficients utilisés (CHR 6)',html:
'<p>Ton cours ne donne pas de tableau des coefficients. Les exercices de l\'appli utilisent ces valeurs usuelles (ajoutées par moi, à vérifier dans ton cours) :</p>'
+'<table class="ov"><thead><tr><th>Liquide</th><th>γ en 10⁻³ °C⁻¹</th></tr></thead><tbody>'+PH_GAMMA.map(x=>'<tr><td>'+x[0]+'</td><td>'+NF(x[1])+'</td></tr>').join('')+'</tbody></table>'
+'<table class="ov"><thead><tr><th>Récipient</th><th>α en 10⁻⁶ °C⁻¹</th></tr></thead><tbody>'+PH_CONT.map(x=>'<tr><td>'+x[0]+'</td><td>'+x[1]+'</td></tr>').join('')+'</tbody></table>'
+'<p>Les exercices sont <b>originaux</b> : mêmes notions que ta feuille (dilatation réelle et apparente, débordement, thermomètres, vrai ou faux), avec d\'autres situations et des valeurs tirées au hasard.</p>'}
);
