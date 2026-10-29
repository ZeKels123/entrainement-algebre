'use strict';
/* ===== Physique · exercices supplémentaires pour varier chaque niveau (même formules du cours, autres situations et autres inconnues) ===== */

/* ---------- Conduction ---------- */
/* niveau 1 : vitre simple, épaisseur en mm */
function genPhCdVitre(){
  const S=pick([1.2,1.5,2,2.4,3]), emm=pick([3,4,5,6]), em=emm/1000, lam=phL('verre'), t1=rnd(19,22), t2=rnd(-8,8), dt=t1-t2, F=S*lam*dt/em, d=0, r=phR(F,d), b={t1,t2,dt};
  const lamT=NF(lam), emT=NF(em);
  return phNum({svg:'',text:'La vitre simple d\'une fenêtre ('+'«λ = '+lamT+'» W·m⁻¹·°C⁻¹) a une surface de «'+NF(S)+'» m² et une épaisseur de «'+emm+'» mm. Il fait «'+t1+'» °C dans la pièce et «'+phS(t2)+'» °C dehors. Calcule le flux de chaleur «Q/Δt» qui la traverse par conduction, '+phArr(d)+'.',
    ask:'le flux de chaleur (en W)',val:F,d,unit:'W',placeholder:'e = 4 mm = 0,004 m\nQ/Δt = 1,5 × 0,8 × 20 / 0,004\nQ/Δt = 6000 W',
    steps:[stp('Épaisseur en mètres',M('e = '+emm+' mm = '+emT+' m')),stp('Écart',M('Δθ = '+phDtTxt(b))+' °C'),stp('Calcul',M('Q/Δt = '+NF(S)+' × '+lamT+' × '+dt+' / '+emT+' ≈ '+NF(r))+' W')],
    hints:['Q/Δt = S · λ · Δθ / e, avec e en mètres : '+emm+' mm = '+emT+' m.','Δθ = '+phDtTxt(b)+' °C.'],
    work:['Q/Δt = '+NF(S)+' × '+lamT+' × '+dt+' / '+emT,'Q/Δt ≈ '+NF(r)+' W'],
    mistakes:[{v:S*lam*dt/emm,x:NF(S)+' × '+lamT+' × '+dt+' / '+emm,tag:'ph-unite-e',msg:'L\'épaisseur doit être en mètres : '+emm+' mm = '+emT+' m, et non '+emm+'.'},
      {v:S*lam*dt/(emm/100),x:NF(S)+' × '+lamT+' × '+dt+' / '+NF(emm/100),tag:'ph-unite-e',msg:'Tu as converti les mm en cm. Il faut des mètres : 1 mm = 0,001 m.'},
      {v:S*lam*(t1+t2)/em,x:NF(S)+' × '+lamT+' × ('+t1+' + '+phN(t2)+') / '+emT,tag:'ph-dt',msg:'Δθ est une différence : '+phDtTxt(b)+' °C.'}]});
}
/* niveau 3 : un mur avec une porte (deux parois en parallèle) */
function genPhCdPorte(){
  const S1=pick([10,12,14,16,18]), S2=pick([1.8,2,2.2]), l1=phL('brique rouge'), l2=phL('bois de sapin'), e1=pick([20,25]), e2=pick([4,5]), t1=rnd(19,22), t2=rnd(-12,6), dt=t1-t2, b={t1,t2,dt};
  const F1=S1*l1*dt/(e1/100), F2=S2*l2*dt/(e2/100), F=F1+F2, d=0, r=phR(F,d);
  const a1=NF(S1)+' × '+NF(l1)+' × '+dt+' / '+NF(e1/100), a2=NF(S2)+' × '+NF(l2)+' × '+dt+' / '+NF(e2/100);
  return phNum({svg:'',text:'Un mur de brique rouge («λ = '+NF(l1)+'» W·m⁻¹·°C⁻¹, épaisseur «'+e1+'» cm) de «'+S1+'» m² comporte une porte en bois de sapin («λ = '+NF(l2)+'», épaisseur «'+e2+'» cm) de «'+NF(S2)+'» m². Il fait «'+t1+'» °C dedans et «'+phS(t2)+'» °C dehors. Calcule le flux de chaleur total «Q/Δt» qui traverse le mur et la porte, '+phArr(d)+'.',
    ask:'le flux de chaleur total (en W)',val:F,d,unit:'W',placeholder:'Q/Δt = 12 × 0,83 × 20 / 0,2 + 2 × 0,15 × 20 / 0,04\nQ/Δt ≈ 1146 W',
    steps:[stp('Mur',M('Q₁/Δt = '+a1+' ≈ '+NF(phR(F1,1)))+' W'),stp('Porte',M('Q₂/Δt = '+a2+' ≈ '+NF(phR(F2,1)))+' W'),stp('Total','Les deux parois laissent passer la chaleur en même temps : on additionne. '+M('Q/Δt ≈ '+NF(r))+' W')],
    hints:['Calcule le flux du mur et celui de la porte avec la même formule, chacun avec son λ, son e et sa surface.','Les flux s\'additionnent. Δθ = '+phDtTxt(b)+' °C.'],
    work:['Q/Δt = '+a1+' + '+a2,'Q/Δt ≈ '+NF(r)+' W'],
    mistakes:[{v:F1,x:a1,tag:'ph-formule',msg:'Tu as oublié la porte : elle laisse aussi passer de la chaleur.'},
      {v:(S1+S2)*l1*dt/(e1/100),x:'('+NF(S1)+' + '+NF(S2)+') × '+NF(l1)+' × '+dt+' / '+NF(e1/100),tag:'ph-formule',msg:'La porte n\'a ni le même λ ni la même épaisseur que le mur : calcule les deux flux séparément.'},
      {v:F2,x:a2,tag:'ph-formule',msg:'Tu n\'as compté que la porte : il faut y ajouter le flux du mur.'}]});
}
/* niveau 3 : surface nécessaire */
function genPhCdSurface(){
  const p=pick(PH_PAROI.filter(x=>x[0]!=='verre'&&x[0]!=='ciment')), mat=p[0], lam=phL(mat), e=pick(p[1]), em=e/100, t1=rnd(19,22), t2=rnd(-8,8), dt=t1-t2, S0=pick([6,8,10,12,15]), P=Math.round(S0*lam*dt/em), S=P*em/(lam*dt), d=1, r=phR(S,d), b={t1,t2,dt};
  return phNum({svg:'',text:'Une paroi en '+mat+' («λ = '+NF(lam)+'» W·m⁻¹·°C⁻¹) de «'+NF(e)+'» cm d\'épaisseur laisse passer un flux de chaleur de «'+P+'» W par conduction. Il fait «'+t1+'» °C d\'un côté et «'+phS(t2)+'» °C de l\'autre. Quelle est la surface de cette paroi ? Donne-la en m², '+phArr(d)+'.',
    ask:'la surface (en m²)',val:S,d,unit:'m',pow:2,placeholder:'S = 747 × 0,2 / (0,83 × 15)\nS ≈ 12 m²',
    steps:[stp('Isoler S',M('Q/Δt = S · λ · Δθ / e')+' donc '+M('S = (Q/Δt) · e / (λ · Δθ)')),stp('Calcul',M('S = '+P+' × '+NF(em)+' / ('+NF(lam)+' × '+dt+') ≈ '+NF(r))+' m²')],
    hints:['Isole S : S = (Q/Δt) · e / (λ · Δθ), avec e en mètres.','Δθ = '+phDtTxt(b)+' °C.'],
    work:['S = '+P+' × '+NF(em)+' / ('+NF(lam)+' × '+dt+')','S ≈ '+NF(r)+' m²'],
    mistakes:[{v:P*e/(lam*dt),x:P+' × '+NF(e)+' / ('+NF(lam)+' × '+dt+')',tag:'ph-unite-e',msg:'L\'épaisseur doit être en mètres : '+NF(e)+' cm = '+NF(em)+' m.'},
      {v:lam*dt/(P*em),x:NF(lam)+' × '+dt+' / ('+P+' × '+NF(em)+')',tag:'ph-formule',msg:'Tu as inversé la fraction : S = (Q/Δt) · e / (λ · Δθ).'},
      {v:P*em/lam,x:P+' × '+NF(em)+' / '+NF(lam),tag:'ph-formule',msg:'Il manque Δθ = '+phDtTxt(b)+' °C au dénominateur.'}]});
}
/* niveau 4 : énergie en kWh */
function genPhCdKwh(){
  const b=phCondBase(Math.random()<0.5,{mats:['brique rouge','ciment','bois de sapin'],S:[12,15,18,20,24,30]}), h=pick([12,24,48]), Q=b.F*h/1000, d=1, r=phR(Q,d), Fr=phR(b.F,1), fx=NF(b.S)+' × '+NF(b.lam)+' × '+b.dt+' / '+NF(b.em);
  return phNum({svg:'',text:'Un mur de '+b.mat+' («λ = '+NF(b.lam)+'» W·m⁻¹·°C⁻¹) de «'+NF(b.S)+'» m² et de «'+NF(b.e)+'» cm d\'épaisseur sépare une pièce chauffée à «'+b.t1+'» °C de l\'extérieur à «'+phS(b.t2)+'» °C. Quelle énergie «Q» traverse ce mur en «'+h+'» heures ? Donne-la en kWh, '+phArr(d)+'.',
    ask:'l\'énergie perdue (en kWh)',val:Q,d,unit:'kWh',placeholder:'Q/Δt = 12 × 0,83 × 15 / 0,2\nQ = 747 × 24 / 1000\nQ ≈ 17,9 kWh',
    steps:[stp('Flux',M('Q/Δt = '+fx+' ≈ '+NF(Fr))+' W'),stp('Énergie',M('Q = '+NF(Fr)+' × '+h+' = '+NF(phR(b.F*h,0)))+' Wh'),stp('En kWh',M('Q ≈ '+NF(r))+' kWh (1 kWh = 1000 Wh)')],
    hints:['Calcule le flux Q/Δt en W, puis multiplie par la durée en heures : tu obtiens des Wh.','1 kWh = 1000 Wh. Δθ = '+phDtTxt(b)+' °C.'],
    work:['Q/Δt = '+fx,'Q = '+NF(Fr)+' × '+h+' / 1000','Q ≈ '+NF(r)+' kWh'],
    mistakes:[{v:b.F*h,x:'('+fx+') × '+h,u:'Wh',tag:'ph-duree',msg:'Ce résultat est en Wh. Divise par 1000 pour avoir des kWh.'},
      {v:b.F*h*3600/1e6,x:'('+fx+') × '+(h*3600)+' / 1000000',u:'MJ',tag:'ph-duree',msg:'Ce résultat est en MJ. L\'énoncé demande des kWh : on multiplie la puissance en kW par les heures (1 kWh = 3,6 MJ).'},
      {v:b.F/1000,x:'('+fx+') / 1000',tag:'ph-duree',msg:'Tu as oublié de multiplier par la durée ('+h+' h).'}]});
}
/* niveau 5 : température de la face intérieure */
function genPhCdFace(){
  const p=pick(PH_PAROI.filter(x=>['brique rouge','bois de sapin','ciment','liège en graine'].indexOf(x[0])>=0)), mat=p[0], lam=phL(mat), e=pick(p[1]), em=e/100, S=pick([6,8,10,12,15]), t2=rnd(-10,6), dt0=rnd(8,18), P=Math.round(S*lam*dt0/em), dth=P*em/(S*lam), t1=t2+dth, d=1, r=phR(t1,d);
  return phNum({svg:phWallSvg('θ₁ = ?','θ₂ = '+phS(t2)+' °C','e = '+NF(e)+' cm'),text:'Une paroi en '+mat+' («λ = '+NF(lam)+'» W·m⁻¹·°C⁻¹) de «'+S+'» m² et de «'+NF(e)+'» cm d\'épaisseur laisse passer «'+P+'» W par conduction. Sa face extérieure est à «'+phS(t2)+'» °C. Quelle est la température «θ₁» de la face intérieure ? Donne-la en °C, '+phArr(d)+'.',
    ask:'la température de la face intérieure (en °C)',val:t1,d,unit:'°C',placeholder:'Δθ = 747 × 0,2 / (12 × 0,83)\nθ = -5 + 15 = 10 °C',
    steps:[stp('Isoler Δθ',M('Δθ = (Q/Δt) · e / (S · λ)')+' = '+M(P+' × '+NF(em)+' / ('+S+' × '+NF(lam)+') ≈ '+NF(phR(dth,2)))+' °C'),stp('Face chaude','La face intérieure est la plus chaude : '+M('θ₁ = θ₂ + Δθ = '+phS(t2)+' + '+NF(phR(dth,2))+' ≈ '+NF(r))+' °C')],
    hints:['Calcule d\'abord Δθ = (Q/Δt) · e / (S · λ), avec e en mètres.','Δθ = θ₁ − θ₂ : la face intérieure est plus chaude que la face extérieure, donc θ₁ = θ₂ + Δθ.'],
    work:['Δθ = '+P+' × '+NF(em)+' / ('+S+' × '+NF(lam)+')','θ ≈ '+NF(r)+' °C'],
    mistakes:[{v:dth,x:P+' × '+NF(em)+' / ('+S+' × '+NF(lam)+')',l:'Δθ',tag:'ph-dt',msg:'Tu as calculé l\'écart Δθ. Il reste à l\'ajouter à θ₂ pour obtenir θ₁.'},
      {v:t2-dth,x:phN(t2)+' - '+P+' × '+NF(em)+' / ('+S+' × '+NF(lam)+')',tag:'ph-dt',msg:'La face intérieure est plus chaude que la face extérieure : θ₁ = θ₂ + Δθ, pas θ₂ − Δθ.'},
      {v:t2+P*e/(S*lam),x:phN(t2)+' + '+P+' × '+NF(e)+' / ('+S+' × '+NF(lam)+')',tag:'ph-unite-e',msg:'L\'épaisseur doit être en mètres : '+NF(e)+' cm = '+NF(em)+' m.'}]});
}

/* ---------- Convection ---------- */
/* niveau 2 : surface d'échange */
function genPhCvSurface(){
  const it=pick([['Un radiateur','l\'air de la pièce',pick([8,10,12]),rnd(55,70),rnd(18,22)],['Une plaque chauffante','l\'air de la cuisine',pick([8,10,12]),rnd(70,100),rnd(18,24)]]);
  const a=it[2], ts=it[3], tf=it[4], dt=ts-tf, S0=pick([0.5,1,1.5,2,2.5,3]), P=Math.round(S0*a*dt), S=P/(a*dt), d=2, r=phR(S,d);
  return phNum({svg:'',text:it[0]+' à «'+ts+'» °C cède «'+P+'» W par convection à '+it[1]+' à «'+tf+'» °C. Le coefficient de convection vaut «α = '+a+'» W·m⁻²·°C⁻¹. Quelle est sa surface ? Donne-la en m², '+phArr(d)+'.',
    ask:'la surface (en m²)',val:S,d,unit:'m',pow:2,placeholder:'Δθ = 60 - 20 = 40\nS = 1200 / (10 × 40)\nS = 3 m²',
    steps:[stp('Écart',M('Δθ = '+ts+' − '+tf+' = '+dt)+' °C'),stp('Isoler S',M('S = (Q/Δt) / (α · Δθ) = '+P+' / ('+a+' × '+dt+') ≈ '+NF(r))+' m²')],
    hints:['Isole S dans Q/Δt = S · α · Δθ : S = (Q/Δt) / (α · Δθ).','Δθ = '+ts+' − '+tf+' = '+dt+' °C.'],
    work:['S = '+P+' / ('+a+' × '+dt+')','S ≈ '+NF(r)+' m²'],
    mistakes:[{v:P/a,x:P+' / '+a,tag:'ph-formule',msg:'Il manque Δθ = '+dt+' °C au dénominateur.'},
      {v:P/dt,x:P+' / '+dt,tag:'ph-formule',msg:'Il manque le coefficient α = '+a+' au dénominateur.'},
      {v:P*a*dt,x:P+' × '+a+' × '+dt,tag:'ph-formule',msg:'Tu as multiplié au lieu de diviser : S = (Q/Δt) / (α · Δθ).'}]});
}
/* niveau 3 : chaleur échangée pendant une durée, en kJ */
function genPhCvDuree(){
  const it=pick([['Une plaque chauffante',pick([0.2,0.25,0.4,0.5]),rnd(70,100),rnd(18,24),pick([8,10,12]),'elle'],['Un radiateur',pick([1.5,2,2.5]),rnd(55,70),rnd(18,22),pick([8,10,12]),'il']]);
  const S=it[1], ts=it[2], tf=it[3], a=it[4], dt=ts-tf, min=pick([5,10,15,30]), F=S*a*dt, Q=F*min*60/1000, d=1, r=phR(Q,d), fx=NF(S)+' × '+a+' × '+dt;
  return phNum({svg:'',text:it[0]+' de «'+NF(S)+'» m² est à «'+ts+'» °C dans de l\'air à «'+tf+'» °C («α = '+a+'» W·m⁻²·°C⁻¹). Quelle chaleur «Q» cède-t-'+it[5]+' par convection en «'+min+'» minutes ? Donne-la en kJ, '+phArr(d)+'.',
    ask:'la chaleur cédée (en kJ)',val:Q,d,unit:'kJ',placeholder:'Q/Δt = 2 × 10 × 40\nQ = 800 × 600 / 1000\nQ = 480 kJ',
    steps:[stp('Flux',M('Q/Δt = '+fx+' = '+NF(phR(F,1)))+' W'),stp('Durée',M('Δt = '+min+' × 60 = '+(min*60))+' s'),stp('Chaleur',M('Q = '+NF(phR(F,1))+' × '+(min*60)+' / 1000 ≈ '+NF(r))+' kJ')],
    hints:['Flux : Q/Δt = S · α · Δθ. Puis Q = (Q/Δt) × Δt avec Δt en secondes.','1 kJ = 1000 J. Δθ = '+ts+' − '+tf+' = '+dt+' °C.'],
    work:['Q/Δt = '+fx,'Q = '+NF(phR(F,1))+' × '+(min*60)+' / 1000','Q ≈ '+NF(r)+' kJ'],
    mistakes:[{v:F*min/1000,x:'('+fx+') × '+min+' / 1000',tag:'ph-duree',msg:'La durée doit être en secondes : '+min+' min = '+(min*60)+' s.'},
      {v:F*min*60,x:'('+fx+') × '+(min*60),u:'J',tag:'ph-duree',msg:'Ce résultat est en joules. Convertis en kJ : divise par 1000.'},
      {v:F*min*60/1e6,x:'('+fx+') × '+(min*60)+' / 1000000',u:'MJ',tag:'ph-duree',msg:'Ce résultat est en MJ. L\'énoncé demande des kJ : 1 MJ = 1000 kJ.'}]});
}
/* niveau 4 : température de la surface */
function genPhCvSurfT(){
  const S=pick([0.2,0.25,0.3,0.4]), a=pick([8,10,12]), ta=rnd(18,24), dt0=rnd(30,50), P=Math.round(S*a*dt0), dth=P/(S*a), ts=ta+dth, d=1, r=phR(ts,d);
  return phNum({svg:'',text:'La porte vitrée d\'un four, d\'aire «'+NF(S)+'» m², perd «'+P+'» W par convection dans la cuisine, où l\'air est à «'+ta+'» °C. Le coefficient de convection vaut «α = '+a+'» W·m⁻²·°C⁻¹. Quelle est la température de la vitre ? Donne-la en °C, '+phArr(d)+'.',
    ask:'la température de la vitre (en °C)',val:ts,d,unit:'°C',placeholder:'Δθ = 100 / (0,25 × 10)\nθ = 21 + 40 = 61 °C',
    steps:[stp('Écart',M('Δθ = (Q/Δt) / (S · α) = '+P+' / ('+NF(S)+' × '+a+') ≈ '+NF(phR(dth,2)))+' °C'),stp('Température','La vitre est plus chaude que l\'air : '+M('θ = '+ta+' + '+NF(phR(dth,2))+' ≈ '+NF(r))+' °C')],
    hints:['Isole Δθ dans Q/Δt = S · α · Δθ : Δθ = (Q/Δt) / (S · α).','La vitre cède de la chaleur à l\'air : elle est plus chaude, donc θ vitre = θ air + Δθ.'],
    work:['Δθ = '+P+' / ('+NF(S)+' × '+a+')','θ ≈ '+NF(r)+' °C'],
    mistakes:[{v:dth,x:P+' / ('+NF(S)+' × '+a+')',l:'Δθ',tag:'ph-dt',msg:'Tu as calculé l\'écart Δθ. Il reste à l\'ajouter à la température de l\'air.'},
      {v:ta-dth,x:ta+' - '+P+' / ('+NF(S)+' × '+a+')',tag:'ph-dt',msg:'La vitre cède de la chaleur : elle est plus chaude que l\'air, donc θ = θ air + Δθ.'},
      {v:ta+P/a,x:ta+' + '+P+' / '+a,tag:'ph-formule',msg:'Tu as oublié la surface S = '+NF(S)+' m² au dénominateur.'}]});
}
/* niveau 5 : pièce avec mur et fenêtre, deux coefficients α */
function genPhCvPiece(){
  const S1=pick([20,25,30]), a1=pick([6,8]), S2=pick([2,3,4]), a2=pick([10,12,14]), ts=rnd(14,19), tf=-rnd(2,10), dt=ts-tf, F=S1*a1*dt+S2*a2*dt, d=0, r=phR(F,d), b={t1:ts,t2:tf,dt};
  const f1=S1+' × '+a1+' × '+dt, f2=S2+' × '+a2+' × '+dt;
  return phNum({svg:'',text:'À l\'extérieur d\'une maison, l\'air est à «'+phS(tf)+'» °C. Le mur ('+'«'+S1+'» m², «α = '+a1+'» W·m⁻²·°C⁻¹) et la fenêtre («'+S2+'» m², «α = '+a2+'») ont leur surface extérieure à «'+ts+'» °C. Calcule le flux de chaleur total «Q/Δt» cédé à l\'air par convection, '+phArr(d)+'.',
    ask:'le flux de chaleur total (en W)',val:F,d,unit:'W',placeholder:'Q/Δt = 20 × 6 × 20 + 3 × 12 × 20\nQ/Δt = 3120 W',
    steps:[stp('Écart',M('Δθ = '+phDtTxt(b))+' °C'),stp('Mur',M('Q₁/Δt = '+f1+' = '+(S1*a1*dt))+' W'),stp('Fenêtre',M('Q₂/Δt = '+f2+' = '+(S2*a2*dt))+' W'),stp('Total',M('Q/Δt = '+NF(r))+' W')],
    hints:['Calcule le flux du mur et celui de la fenêtre avec Q/Δt = S · α · Δθ (chacun son α), puis additionne.','Δθ = '+phDtTxt(b)+' °C.'],
    work:['Q/Δt = '+f1+' + '+f2,'Q/Δt = '+NF(r)+' W'],
    mistakes:[{v:S1*a1*dt,x:f1,tag:'ph-formule',msg:'Tu as oublié la fenêtre : elle échange aussi de la chaleur.'},
      {v:(S1+S2)*a1*dt,x:'('+S1+' + '+S2+') × '+a1+' × '+dt,tag:'ph-formule',msg:'La fenêtre a son propre coefficient α = '+a2+' : calcule les deux flux séparément.'},
      {v:S1*a1*(ts+tf)+S2*a2*(ts+tf),x:S1+' × '+a1+' × ('+ts+' + '+phN(tf)+') + '+S2+' × '+a2+' × ('+ts+' + '+phN(tf)+')',tag:'ph-dt',msg:'Δθ est une différence : '+phDtTxt(b)+' °C.'}]});
}

/* ---------- Dilatation des solides ---------- */
/* niveau 2 : jeu entre deux rails, écart de température tiré de deux extrêmes */
function genPhDlRail(){
  const a=12, L=pick([12,18,24,30]), tmin=-rnd(10,20), tmax=rnd(40,60), dt=tmax-tmin, dl=a*1e-6*L*dt, d=1, mm=dl*1000;
  return phDil({svg:'',text:'Des rails d\'acier de «'+L+'» m sont posés sur une voie où la température varie de «'+phS(tmin)+'» °C en hiver à «'+tmax+'» °C en été. Quel jeu minimal faut-il laisser entre deux rails pour qu\'ils puissent s\'allonger librement ? Donne-le en mm, '+phArr(d)+' («α» = '+phA(a)+').',
    ask:'le jeu (en mm)',val:mm,d,unit:'mm',placeholder:'Δθ = 50 - (-15) = 65\nΔℓ = 12 * 10^-6 * 24 * 65\nΔℓ = 18,7 mm',
    steps:[stp('Écart extrême',M('Δθ = '+tmax+' − ('+phS(tmin)+') = '+dt)+' °C'),stp('Calcul',M('Δℓ = '+a+' · 10^-6 × '+L+' × '+dt+' = '+NF(phR(dl,6)))+' m ≈ '+NF(phR(mm,d))+' mm')],
    hints:['Le rail s\'allonge entre la température la plus basse et la plus haute : Δθ = θ max − θ min.','Δℓ = α · ℓ₁ · Δθ en m ; puis 1 m = 1000 mm.'],
    work:['Δℓ = '+a+' * 10^-6 * '+L+' * '+dt,'Δℓ = '+NF(phR(dl,6))+' m','Δℓ ≈ '+NF(phR(mm,d))+' mm'],
    mistakes:[{v:dl,x:a+' * 10^-6 * '+L+' * '+dt,u:'m',tag:'ph-dil-unite',msg:'Ce résultat est en mètres. L\'énoncé demande des mm : multiplie par 1000.'},
      {v:a*1e-6*L*tmax*1000,x:a+' * 10^-6 * '+L+' * '+tmax+' * 1000',tag:'ph-dt',msg:'Il faut l\'écart entre l\'hiver et l\'été : Δθ = '+tmax+' − ('+phS(tmin)+') = '+dt+' °C.'},
      {v:a*1e-6*L*(tmax+tmin)*1000,x:a+' * 10^-6 * '+L+' * ('+tmax+' + '+phN(tmin)+') * 1000',tag:'ph-dt',msg:'Δθ est une différence : '+tmax+' − ('+phS(tmin)+') = '+dt+' °C.'}]});
}
/* niveau 3 : diamètre d'un trou */
function genPhDlTrou(){
  const m=pick(PH_ALPHA.slice(0,4)), a=m[1], D=pick([20,30,40,50]), t1=rnd(15,22), t2=t1+pick([200,250,300,400]), dt=t2-t1, D2=D*(1+a*1e-6*dt), d=3;
  return phDil({svg:'',text:'On perce un trou de «'+D+'» mm de diamètre dans une plaque '+phDe(m[0])+' à «'+t1+'» °C. On chauffe la plaque jusqu\'à «'+t2+'» °C. Quel est alors le diamètre du trou ? Donne-le en mm, arrondi au millième (α = '+phA(a)+').',
    ask:'le diamètre du trou (en mm)',val:D2,d,unit:'mm',placeholder:'Δθ = 320 - 20 = 300\nd₂ = 30 * (1 + 12 * 10^-6 * 300)\nd₂ = 30,108 mm',
    steps:[stp('Idée','Un trou se dilate comme la matière qui l\'entourerait : son diamètre augmente avec la température.'),stp('Écart',M('Δθ = '+t2+' − '+t1+' = '+dt)+' °C'),stp('Calcul',M('d₂ = d₁ · (1 + α · Δθ) = '+D+' × (1 + '+a+' · 10^-6 × '+dt+') ≈ '+NF(phR(D2,d)))+' mm')],
    hints:['Le diamètre est une longueur : d₂ = d₁ · (1 + α · Δθ). Le trou grandit, il ne rétrécit pas.','Δθ = '+t2+' − '+t1+' = '+dt+' °C.'],
    work:['d₂ = '+D+' * (1 + '+a+' * 10^-6 * '+dt+')','d₂ ≈ '+NF(phR(D2,d))+' mm'],
    mistakes:[{v:D*(1-a*1e-6*dt),x:D+' * (1 - '+a+' * 10^-6 * '+dt+')',tag:'ph-dil-cours',msg:'Le trou ne se referme pas quand on chauffe : il se dilate comme la plaque, son diamètre augmente.'},
      {v:D*a*1e-6*dt,x:D+' * '+a+' * 10^-6 * '+dt,l:'Δd',tag:'ph-dil-formule',msg:'Tu as calculé la variation Δd. Le diamètre final est d₂ = d₁ + Δd.'},
      {v:D*(1+2*a*1e-6*dt),x:D+' * (1 + 2 * '+a+' * 10^-6 * '+dt+')',tag:'ph-dil-facteur',msg:'Le diamètre est une longueur : c\'est α (et non 2α, qui vaut pour une surface).'}]});
}
/* niveau 4 : température atteinte à partir d'un allongement */
function genPhDlTemp(){
  const m=pick(PH_ALPHA.slice(0,4)), a=m[1], L=pick([20,30,40,50,60]), t1=rnd(-10,10), dth=pick([20,25,30,35,40]), mm=Math.round(a*1e-6*L*dth*1000), dt=mm/1000/(a*1e-6*L), t2=t1+dt, d=1, r=phR(t2,d);
  return phDil({svg:'',text:'Une poutre de '+m[0]+' de «'+L+'» m est posée à «'+phS(t1)+'» °C. Elle s\'allonge de «'+mm+'» mm. Quelle est sa température finale ? Donne-la en °C, '+phArr(d)+' (α = '+phA(a)+').',
    ask:'la température finale (en °C)',val:t2,d,unit:'°C',placeholder:'Δθ = 14 / 1000 / (17 * 10^-6 * 40)\nθ₂ = 0 + 20,6 = 20,6 °C',
    steps:[stp('Isoler Δθ',M('Δℓ = α · ℓ₁ · Δθ')+' donc '+M('Δθ = Δℓ / (α · ℓ₁)')),stp('Calcul',M('Δθ = '+mm+' / 1000 / ('+a+' · 10^-6 × '+L+') ≈ '+NF(phR(dt,2)))+' °C'),stp('Température finale',M('θ₂ = θ₁ + Δθ ≈ '+NF(r))+' °C')],
    hints:['Δθ = Δℓ / (α · ℓ₁), avec Δℓ en m ('+mm+' mm = '+NF(mm/1000)+' m).','Puis θ₂ = θ₁ + Δθ.'],
    work:['Δθ = '+mm+' / 1000 / ('+a+' * 10^-6 * '+L+')','θ ≈ '+NF(r)+' °C'],
    mistakes:[{v:dt,x:mm+' / 1000 / ('+a+' * 10^-6 * '+L+')',l:'Δθ',tag:'ph-dt',msg:'Tu as calculé l\'écart Δθ. La température finale est θ₂ = θ₁ + Δθ.'},
      {v:t1+mm/(a*1e-6*L),x:phN(t1)+' + '+mm+' / ('+a+' * 10^-6 * '+L+')',tag:'ph-dil-unite',msg:'Δℓ doit être en mètres : '+mm+' mm = '+NF(mm/1000)+' m.'},
      {v:t1+a*1e-6*L/(mm/1000),x:phN(t1)+' + '+a+' * 10^-6 * '+L+' / '+NF(mm/1000),tag:'ph-dil-formule',msg:'Tu as inversé la fraction : Δθ = Δℓ / (α · ℓ₁).'}]});
}
/* niveau 5 : coefficient α inconnu */
function genPhDlAlpha(){
  const a=pick([12,17,19,23]), L=pick([2,4,5,10]), dt=pick([50,100]), mm=Math.round(a*L*dt)/1000, d=1, val=mm/1000/(L*dt)*1e6;
  return phDil({svg:'',text:'Une barre métallique de «'+L+'» m s\'allonge de «'+NF(mm)+'» mm quand sa température augmente de «'+dt+'» °C. Calcule son coefficient de dilatation linéaire «α», en 10⁻⁶ °C⁻¹ (écris seulement le nombre), '+phArr(d)+'.',
    ask:'le coefficient α (en 10⁻⁶ °C⁻¹)',val,d,placeholder:'α = 4,6 * 1000 / (2 * 100)\nα = 23',
    steps:[stp('Isoler α',M('Δℓ = α · ℓ₁ · Δθ')+' donc '+M('α = Δℓ / (ℓ₁ · Δθ)')),stp('Calcul',M('α = '+NF(mm)+' / 1000 / ('+L+' × '+dt+') = '+NF(phR(val,1))+' · 10^-6')+' °C⁻¹')],
    hints:['α = Δℓ / (ℓ₁ · Δθ), avec Δℓ en m.','Un millimètre sur un mètre fait 10⁻³ : pour avoir α en 10⁻⁶ °C⁻¹, multiplie Δℓ (en mm) par 1000 et divise par ℓ₁ · Δθ.'],
    work:['α = '+NF(mm)+' * 1000 / ('+L+' * '+dt+')','α = '+NF(phR(val,1))],
    mistakes:[{v:mm/(L*dt),x:NF(mm)+' / ('+L+' * '+dt+')',tag:'ph-dil-unite',msg:'Δℓ doit être en mètres, et le résultat s\'exprime en 10⁻⁶ °C⁻¹ : multiplie Δℓ (en mm) par 1000 avant de diviser.'},
      {v:mm*1000/L,x:NF(mm)+' * 1000 / '+L,tag:'ph-dil-formule',msg:'Il manque Δθ = '+dt+' °C au dénominateur.'},
      {v:mm*1000*L/dt,x:NF(mm)+' * 1000 * '+L+' / '+dt,tag:'ph-dil-formule',msg:'α = Δℓ / (ℓ₁ · Δθ) : la longueur ℓ₁ est au dénominateur.'}]});
}

/* ---------- Dilatation des liquides ---------- */
/* niveau 1 : variation relative en % */
function genPhLiPct(){
  const l=pick(PH_GAMMA.slice(0,4)), g=l[1], dt=pick([10,20,30,40,50]), val=g*1e-3*dt*100, d=2;
  return phLiq({svg:'',text:'Un liquide ('+l[0]+', «γ = '+NF(g)+'·10⁻³ °C⁻¹») est chauffé de «'+dt+'» °C. De combien de pour cent son volume augmente-t-il ? Donne le nombre, sans le signe %, '+phArr(d)+' (on ne tient pas compte du récipient).',
    ask:'l\'augmentation relative du volume (en %)',val,d,placeholder:'ΔV / V₁ = 0,95 * 10^-3 * 20 * 100\nΔV / V₁ = 1,9',
    steps:[stp('Formule',M('ΔV = γ · V₁ · Δθ')+' donc '+M('ΔV / V₁ = γ · Δθ')),stp('Calcul',M('ΔV / V₁ = '+NF(g)+' · 10^-3 × '+dt+' = '+NF(phR(g*1e-3*dt,4)))+', soit '+M(NF(phR(val,d)))+' %')],
    hints:['ΔV / V₁ = γ · Δθ : le volume de départ s\'élimine.','Pour passer en %, multiplie par 100.'],
    work:['ΔV / V₁ = '+NF(g)+' * 10^-3 * '+dt+' * 100','ΔV / V₁ = '+NF(phR(val,d))],
    mistakes:[{v:g*1e-3*dt,x:NF(g)+' * 10^-3 * '+dt,tag:'ph-dil-unite',msg:'Ce résultat est une fraction. Multiplie par 100 pour l\'avoir en %.'},
      {v:3*g*1e-3*dt*100,x:'3 * '+NF(g)+' * 10^-3 * '+dt+' * 100',tag:'ph-liq-formule',msg:'γ est déjà un coefficient volumique : pas de facteur 3 (le 3α concerne les solides).'},
      {v:g*1e-3*dt*10,x:NF(g)+' * 10^-3 * '+dt+' * 10',tag:'ph-dil-unite',msg:'Pour avoir des pourcents, on multiplie par 100 (pas par 10).'}]});
}
/* niveau 3 : volume initial */
function genPhLiV1(){
  const l=pick(PH_GAMMA.slice(0,4)), g=l[1], V1=pick([2,5,10,20,50]), dt=pick([10,15,20,30]), mL=Math.round(g*V1*dt), val=mL/(g*dt), d=1;
  if(mL<1) return genPhLiV1();
  return phLiq({svg:'',text:'Un réservoir contient du liquide ('+l[0]+', «γ = '+NF(g)+'·10⁻³ °C⁻¹»). En chauffant de «'+dt+'» °C, son volume augmente de «'+mL+'» mL. Quel était son volume initial ? Donne-le en L, '+phArr(d)+' (on ne tient pas compte du récipient).',
    ask:'le volume initial (en L)',val,d,unit:'L',placeholder:'V₁ = 380 / 1000 / (0,95 * 10^-3 * 20)\nV₁ = 20 L',
    steps:[stp('Isoler V₁',M('ΔV = γ · V₁ · Δθ')+' donc '+M('V₁ = ΔV / (γ · Δθ)')),stp('Calcul',M('V₁ = '+mL+' / 1000 / ('+NF(g)+' · 10^-3 × '+dt+') ≈ '+NF(phR(val,d)))+' L')],
    hints:['V₁ = ΔV / (γ · Δθ), avec ΔV en litres : '+mL+' mL = '+NF(mL/1000)+' L.','Le résultat sort alors en litres.'],
    work:['V₁ = '+mL+' / 1000 / ('+NF(g)+' * 10^-3 * '+dt+')','V₁ ≈ '+NF(phR(val,d))+' L'],
    mistakes:[{v:val*1000,x:mL+' / ('+NF(g)+' * 10^-3 * '+dt+')',tag:'ph-dil-unite',msg:'ΔV doit être en litres comme V₁ : '+mL+' mL = '+NF(mL/1000)+' L.'},
      {v:g*1e-3*dt/(mL/1000),x:NF(g)+' * 10^-3 * '+dt+' / '+NF(mL/1000),tag:'ph-dil-formule',msg:'Tu as inversé la fraction : V₁ = ΔV / (γ · Δθ).'},
      {v:mL/1000/(g*1e-3),x:mL+' / 1000 / ('+NF(g)+' * 10^-3)',tag:'ph-dil-formule',msg:'Il manque Δθ = '+dt+' °C au dénominateur.'}]});
}
/* niveau 3 : réservoir plein qui déborde */
function genPhLiPlein(){
  const p=phApp(), V1=pick([30,40,50,60]), t1=rnd(10,18), dt=pick([10,15,20,25]), dV=p.k*V1*dt, d=1, mL=dV*1000, r=phR(mL,d);
  const li=NF(p.l[1])+' * 10^-3', ct=p.c[1]+' * 10^-6', fx='('+li+' - 3 * '+ct+') * '+V1+' * '+dt;
  return phLiq({svg:'',text:(p.c[0]==='verre'?'Une dame-jeanne':'Le réservoir d\'un bateau')+', en '+p.c[0]+' («α = '+p.c[1]+'·10⁻⁶ °C⁻¹»), est rempli à ras bord avec «'+V1+'» L de liquide : '+p.l[0]+' («γ = '+NF(p.l[1])+'·10⁻³ °C⁻¹»). Au soleil, la température monte de «'+dt+'» °C. Quel volume déborde ? Donne-le en mL, '+phArr(d)+'.',
    ask:'le volume qui déborde (en mL)',val:mL,d,unit:'mL',placeholder:'ΔV = (1,1 * 10^-3 - 3 * 12 * 10^-6) * 50 * 15\nΔV = 0,798 L\nΔV = 798 mL',
    steps:[stp('Le réservoir se dilate aussi','Le liquide déborde de la différence entre sa dilatation et celle du réservoir : '+M('ΔV = (γ − 3α) · V₁ · Δθ')),stp('Calcul',M('ΔV = ('+NF(p.l[1])+' · 10^-3 − 3 × '+p.c[1]+' · 10^-6) × '+V1+' × '+dt+' ≈ '+NF(phR(dV,5)))+' L ≈ '+NF(r)+' mL')],
    hints:['Le volume qui déborde est la dilatation apparente : (γ − 3α) · V₁ · Δθ.','Le résultat sort en litres : 1 L = 1000 mL.'],
    work:['ΔV = '+fx,'ΔV ≈ '+NF(r)+' mL'],
    mistakes:[{v:p.g*V1*dt*1000,x:li+' * '+V1+' * '+dt+' * 1000',tag:'ph-liq-app',msg:'Le réservoir se dilate aussi : retire la dilatation du réservoir (3α).'},
      {v:(p.g+3*p.a)*V1*dt*1000,x:'('+li+' + 3 * '+ct+') * '+V1+' * '+dt+' * 1000',tag:'ph-liq-app',msg:'La dilatation du réservoir se retranche : (γ − 3α), pas (γ + 3α).'},
      {v:dV,x:fx,u:'L',tag:'ph-dil-unite',msg:'Ce résultat est en litres : multiplie par 1000 pour l\'avoir en mL.'}]});
}
/* niveau 4 : coefficient γ inconnu */
function genPhLiGamma(){
  const l=pick(PH_GAMMA.slice(0,4)), g=l[1], V1=pick([5,10,20]), dt=pick([10,20,25]), mL=Math.round(g*V1*dt), val=mL/(V1*dt), d=2;
  return phLiq({svg:'',text:'On chauffe de «'+dt+'» °C un échantillon de «'+V1+'» L d\'un liquide inconnu : son volume augmente de «'+mL+'» mL. Calcule son coefficient de dilatation volumique «γ», en 10⁻³ °C⁻¹ (écris seulement le nombre), '+phArr(d)+' (on ne tient pas compte du récipient).',
    ask:'le coefficient γ (en 10⁻³ °C⁻¹)',val,d,placeholder:'γ = 190 / (10 * 20)\nγ = 0,95',
    steps:[stp('Isoler γ',M('ΔV = γ · V₁ · Δθ')+' donc '+M('γ = ΔV / (V₁ · Δθ)')),stp('Calcul',M('γ = '+mL+' / ('+V1+' × '+dt+') ≈ '+NF(phR(val,d))+' · 10^-3')+' °C⁻¹ (car des mL divisés par des L donnent des 10⁻³)')],
    hints:['γ = ΔV / (V₁ · Δθ). Des mL divisés par des L font des 10⁻³ : le résultat est directement en 10⁻³ °C⁻¹.','Δθ = '+dt+' °C.'],
    work:['γ = '+mL+' / ('+V1+' * '+dt+')','γ ≈ '+NF(phR(val,d))],
    mistakes:[{v:mL/1000/(V1*dt),x:mL+' / 1000 / ('+V1+' * '+dt+')',tag:'ph-dil-unite',msg:'Le résultat s\'exprime en 10⁻³ °C⁻¹ : ne divise pas ΔV par 1000, sinon il sort en °C⁻¹ (0,00095 au lieu de 0,95).'},
      {v:mL/V1,x:mL+' / '+V1,tag:'ph-dil-formule',msg:'Il manque Δθ = '+dt+' °C au dénominateur.'},
      {v:mL*V1/dt,x:mL+' * '+V1+' / '+dt,tag:'ph-dil-formule',msg:'γ = ΔV / (V₁ · Δθ) : V₁ est au dénominateur.'}]});
}

/* ---------- Gaz parfaits ---------- */
/* niveau 1 : kelvins et °C */
function genPhGzKelvin(){
  const toK=Math.random()<0.5, c=pick([['la température d\'un congélateur',-18],['la température de l\'eau qui bout',100],['la température d\'une pièce',20],['la température de la glace fondante',0],['la température d\'un pneu après un trajet',45],['la température de l\'azote liquide',-196]]);
  const th=c[1];
  if(toK){ const T=th+273;
    return phGaz({svg:'',text:'Les lois des gaz utilisent des kelvins. Exprime '+c[0]+', «'+phS(th)+'» °C, en kelvins (T = θ + 273).',ask:'la température (en K)',val:T,d:0,unit:'K',placeholder:'T = -18 + 273 = 255 K',
      steps:[stp('Conversion',M('T = θ + 273 = '+phS(th)+' + 273 = '+T)+' K')],hints:['T (K) = θ (°C) + 273.','Un degré celsius et un kelvin ont la même taille : seul le zéro change.'],
      work:['T = '+th+' + 273','T = '+T+' K'],
      mistakes:[{v:th-273,x:th+' - 273',tag:'ph-gaz-kelvin',msg:'On ajoute 273 pour passer des °C aux kelvins : T = θ + 273.'},{v:273-th,x:'273 - '+phN(th),tag:'ph-gaz-kelvin',msg:'T = θ + 273 : on ajoute la température en °C, on ne la soustrait pas de 273.'}]}); }
  const T=th+273;
  return phGaz({svg:'',text:'Un thermomètre de laboratoire indique «'+T+'» K pour '+c[0]+'. Exprime cette température en °C (θ = T − 273).',ask:'la température (en °C)',val:th,d:0,unit:'°C',placeholder:'θ = 255 - 273 = -18 °C',
    steps:[stp('Conversion',M('θ = T − 273 = '+T+' − 273 = '+phS(th))+' °C')],hints:['θ (°C) = T (K) − 273.','Un degré celsius et un kelvin ont la même taille : seul le zéro change.'],
    work:['θ = '+T+' - 273','θ = '+th+' °C'],
    mistakes:[{v:T+273,x:T+' + 273',tag:'ph-gaz-kelvin',msg:'Pour passer des kelvins aux °C, on retranche 273 : θ = T − 273.'},{v:273-T,x:'273 - '+T,tag:'ph-gaz-kelvin',msg:'θ = T − 273 : on retranche 273 de T, pas l\'inverse.'}]});
}
/* niveau 2 : volume initial (Boyle-Mariotte) */
function genPhGzV1(){
  const c=pick([['L\'air d\'une pompe à vélo','mL',[40,60,80],'comprimé à'],['Le gaz d\'un vérin','L',[0.5,0.8,1],'comprimé à'],['L\'air d\'une seringue bouchée','mL',[10,15,20],'comprimé à']]);
  const V2=pick(c[2]), p2=pick([3,4,5,6]), p1=pick([1.2,1.5,2]), V1=p2*V2/p1, d=c[1]==='mL'?0:2;
  return phGaz({svg:'',text:c[0]+' est '+c[3]+' «'+NF(V2)+'» '+c[1]+', sous une pression de «'+NF(p2)+'» bar. Sa pression de départ était de «'+NF(p1)+'» bar, à la même température. Quel était son volume initial, en '+c[1]+', '+phArr(d)+' ?',
    ask:'le volume initial (en '+c[1]+')',val:V1,d,unit:c[1],placeholder:'V₁ = 3 * 60 / 1\nV₁ = 180 mL',
    steps:[stp('Loi de Boyle-Mariotte','Température constante : '+M('p₁ · V₁ = p₂ · V₂')+' donc '+M('V₁ = p₂ · V₂ / p₁')),stp('Calcul',M('V₁ = '+NF(p2)+' × '+NF(V2)+' / '+NF(p1)+' ≈ '+NF(phR(V1,d)))+' '+c[1])],
    hints:['À température constante, p₁ · V₁ = p₂ · V₂ : isole V₁.','La pression a augmenté : le volume de départ était plus grand.'],
    work:['V₁ = '+NF(p2)+' * '+NF(V2)+' / '+NF(p1),'V₁ ≈ '+NF(phR(V1,d))+' '+c[1]],
    mistakes:[{v:p1*V2/p2,x:NF(p1)+' * '+NF(V2)+' / '+NF(p2),tag:'ph-gaz-loi',msg:'Rapport inversé : le gaz a été comprimé, son volume de départ était plus grand. V₁ = p₂ · V₂ / p₁.'},
      {v:p2*V2,x:NF(p2)+' * '+NF(V2),tag:'ph-gaz-loi',msg:'Il faut encore diviser par la pression de départ p₁ = '+NF(p1)+' bar.'}]});
}
/* niveau 3 : température finale en °C (Charles) */
function genPhGzTemp(){
  const c=pick([['Les pneus d\'une voiture sont gonflés à',[2.2,2.4,2.5]],['Un autocuiseur fermé contient de l\'air à',[1,1.2]],['Une bombe aérosol contient un gaz à',[3,4,5]]]);
  const p1=pick(c[1]), t1=rnd(10,22), f=pick([1.1,1.15,1.2,1.25]), p2=Math.round(p1*f*100)/100, T1=phK(t1), T2=T1*p2/p1, t2=T2-273, d=1, r=phR(t2,d);
  return phGaz({svg:'',text:c[0]+' «'+NF(p1)+'» bar à «'+t1+'» °C. Le volume ne change pas. Après chauffage, la pression atteint «'+NF(p2)+'» bar. Quelle est alors la température du gaz ? Donne-la en °C, '+phArr(d)+'.',
    ask:'la température finale (en °C)',val:t2,d,unit:'°C',placeholder:'T₁ = 15 + 273 = 288\nT₂ = 288 * 2,7 / 2,4 = 324\nθ₂ = 324 - 273 = 51 °C',
    steps:[stp('Kelvins',M('T₁ = '+t1+' + 273 = '+T1)+' K'),stp('Loi de Charles','Volume constant : '+M('p₂ / T₂ = p₁ / T₁')+' donc '+M('T₂ = T₁ · p₂ / p₁ = '+T1+' × '+NF(p2)+' / '+NF(p1)+' ≈ '+NF(phR(T2,1)))+' K'),stp('Retour en °C',M('θ₂ = T₂ − 273 ≈ '+NF(r))+' °C')],
    hints:['À volume constant, p / T est constant : T₂ = T₁ · p₂ / p₁ (T en kelvins).','Le résultat est en kelvins : retranche 273 pour revenir en °C.'],
    work:['T₁ = '+t1+' + 273 = '+T1,'T₂ = '+T1+' * '+NF(p2)+' / '+NF(p1),'θ ≈ '+NF(r)+' °C'],
    mistakes:[{v:T2,x:T1+' * '+NF(p2)+' / '+NF(p1),u:'K',tag:'ph-gaz-kelvin',msg:'Ce résultat est en kelvins. L\'énoncé demande des °C : retranche 273.'},
      {v:t1*p2/p1,x:t1+' * '+NF(p2)+' / '+NF(p1),tag:'ph-gaz-kelvin',msg:'Avec des °C, le rapport est faux : passe en kelvins (T = θ + 273).'},
      {v:T1*p1/p2-273,x:T1+' * '+NF(p1)+' / '+NF(p2)+' - 273',tag:'ph-gaz-loi',msg:'Rapport inversé : si la pression a augmenté à volume constant, la température a augmenté.'}]});
}
/* niveau 4 : pression relative et pression absolue (pneu) */
function genPhGzPneu(){
  const pa=1.01, pr=pick([2,2.2,2.4,2.5]), t1=rnd(5,18), t2=t1+pick([25,30,35,40]), T1=phK(t1), T2=phK(t2), P1=pr+pa, P2=P1*T2/T1, p2r=P2-pa, d=2, r=phR(p2r,d);
  const sp=NF(pa), sP1=NF(phR(P1,2));
  return phGaz({svg:'',text:'Un manomètre indique «'+NF(pr)+'» bar pour un pneu à froid, à «'+t1+'» °C : c\'est la pression relative, c\'est-à-dire en plus de la pression atmosphérique de «'+sp+'» bar. Après un long trajet, l\'air du pneu atteint «'+t2+'» °C (volume constant). Quelle pression relative le manomètre indique-t-il ? Donne-la en bar, '+phArr(d)+'.',
    ask:'la pression relative finale (en bar)',val:p2r,d,unit:'bar',placeholder:'p₁ = 2,2 + 1,01 = 3,21\nT₁ = 10 + 273 = 283\nT₂ = 45 + 273 = 318\np = 3,21 * 318 / 283 - 1,01\np ≈ 2,6 bar',
    steps:[stp('Pression absolue',M('p₁ = '+NF(pr)+' + '+sp+' = '+sP1)+' bar : la loi des gaz s\'applique à la pression absolue.'),stp('Kelvins',M('T₁ = '+T1+' K')+' ; '+M('T₂ = '+T2+' K')),stp('Loi de Charles',M('p₂ = p₁ · T₂ / T₁ = '+sP1+' × '+T2+' / '+T1+' ≈ '+NF(phR(P2,2)))+' bar'),stp('Pression relative',M('p = p₂ − '+sp+' ≈ '+NF(r))+' bar')],
    hints:['Un manomètre donne la pression relative. Pour la loi des gaz, passe d\'abord en pression absolue : p absolue = p relative + '+sp+' bar.','Utilise les kelvins, puis retranche '+sp+' bar pour revenir à la pression relative.'],
    work:['p₁ = '+NF(pr)+' + '+sp+' = '+sP1,'T₁ = '+t1+' + 273 = '+T1,'T₂ = '+t2+' + 273 = '+T2,'p = '+sP1+' * '+T2+' / '+T1+' - '+sp,'p ≈ '+NF(r)+' bar'],
    mistakes:[{v:pr*T2/T1,x:NF(pr)+' * '+T2+' / '+T1,tag:'ph-gaz-loi',msg:'La loi des gaz s\'applique à la pression absolue (relative + '+sp+' bar), pas à la pression relative.'},
      {v:P2,x:sP1+' * '+T2+' / '+T1,tag:'ph-gaz-loi',msg:'Tu as trouvé la pression absolue. Le manomètre indique la pression relative : retranche '+sp+' bar.'},
      {v:P1*t2/t1-pa,x:sP1+' * '+t2+' / '+t1+' - '+sp,tag:'ph-gaz-kelvin',msg:'Avec des °C, le rapport est faux : passe en kelvins (T = θ + 273).'}]});
}
/* niveau 5 : nombre de coups de pompe */
function genPhGzPompe(){
  const V=pick([1.5,2,3]), Vp=pick([0.25,0.5]), p2=pick([3,4,5,6]), n=(p2-1)*V/Vp;
  if(Math.abs(n-Math.round(n))>1e-9) return genPhGzPompe();
  return phGaz({svg:'',text:'Un pneu de «'+NF(V)+'» L contient de l\'air à la pression atmosphérique (1 bar). On le gonfle avec une pompe qui refoule «'+NF(Vp)+'» L d\'air pris à 1 bar à chaque coup, jusqu\'à une pression de «'+p2+'» bar. Combien de coups de pompe faut-il, si la température reste constante ?',
    ask:'le nombre de coups de pompe',val:n,d:0,placeholder:'n = (4 - 1) * 2 / 0,5\nn = 12',
    steps:[stp('Idée','À température constante, la quantité d\'air est proportionnelle à p · V. Il faut ajouter la différence de pression : '+M('Δp = '+p2+' − 1 = '+(p2-1))+' bar.'),stp('Calcul','Chaque coup apporte '+M('1 × '+NF(Vp))+' bar·L ; il en faut '+M(NF(p2-1)+' × '+NF(V))+' bar·L : '+M('n = '+NF(p2-1)+' × '+NF(V)+' / '+NF(Vp)+' = '+NF(n)))],
    hints:['L\'air déjà présent (1 bar) compte : il ne faut ajouter que la surpression (p₂ − 1) × V.','Chaque coup de pompe apporte p · V pompe = 1 × V pompe.'],
    work:['n = ('+p2+' - 1) * '+NF(V)+' / '+NF(Vp),'n = '+NF(n)],
    mistakes:[{v:p2*V/Vp,x:p2+' * '+NF(V)+' / '+NF(Vp),tag:'ph-gaz-loi',msg:'Le pneu contient déjà de l\'air à 1 bar : il ne faut ajouter que la surpression ('+p2+' − 1) bar.'},
      {v:(p2-1)*Vp/V,x:'('+p2+' - 1) * '+NF(Vp)+' / '+NF(V),tag:'ph-gaz-loi',msg:'Tu as inversé les volumes : n = (p₂ − 1) · V pneu / V pompe.'},
      {v:(p2-1)*V*Vp,x:'('+p2+' - 1) * '+NF(V)+' * '+NF(Vp),tag:'ph-gaz-loi',msg:'Il faut diviser par le volume pompé à chaque coup, pas le multiplier.'}]});
}

PHT('ph-cd6',1,'phcd','Vitre simple (épaisseur en mm)',genPhCdVitre);
PHT('ph-cd7',3,'phcd','Mur avec une porte',genPhCdPorte);
PHT('ph-cd8',3,'phcd','Surface d\'une paroi',genPhCdSurface);
PHT('ph-cd9',4,'phcd','Énergie perdue en kWh',genPhCdKwh);
PHT('ph-cd10',5,'phcd','Température de la face intérieure',genPhCdFace);
PHT('ph-cv5',2,'phcv','Surface d\'échange',genPhCvSurface);
PHT('ph-cv6',3,'phcv','Chaleur cédée pendant une durée (kJ)',genPhCvDuree);
PHT('ph-cv7',4,'phcv','Température d\'une vitre',genPhCvSurfT);
PHT('ph-cv8',5,'phcv','Mur et fenêtre avec deux coefficients',genPhCvPiece);
PHT('ph-dl6',2,'phdl','Jeu entre deux rails',genPhDlRail);
PHT('ph-dl7',3,'phdl','Diamètre d\'un trou',genPhDlTrou);
PHT('ph-dl8',4,'phdl','Température atteinte',genPhDlTemp);
PHT('ph-dl9',5,'phdl','Coefficient α inconnu',genPhDlAlpha);
PHT('ph-li6',1,'phli','Augmentation relative du volume (%)',genPhLiPct);
PHT('ph-li7',3,'phli','Volume initial',genPhLiV1);
PHT('ph-li8',3,'phli','Réservoir rempli à ras bord',genPhLiPlein);
PHT('ph-li9',4,'phli','Coefficient γ inconnu',genPhLiGamma);
PHT('ph-gz6',1,'phgz','Kelvins et degrés Celsius',genPhGzKelvin);
PHT('ph-gz7',2,'phgz','Volume initial (Boyle-Mariotte)',genPhGzV1);
PHT('ph-gz8',3,'phgz','Température finale en °C',genPhGzTemp);
PHT('ph-gz9',4,'phgz','Pression relative d\'un pneu',genPhGzPneu);
PHT('ph-gz10',5,'phgz','Nombre de coups de pompe',genPhGzPompe);
