'use strict';
/* ===== Physique · Chaleur : la dilatation des gaz parfaits (CHR 7) ===== */
/* Fiche d'après les pages C-54 (Boyle-Mariotte, gaz parfaits) et C-58 (résumé) ; exercices originaux inspirés des pages
   C-55 à C-57, sans en reprendre les énoncés. Les pages précédentes du chapitre (Gay-Lussac et Charles en détail) ne sont pas encore reçues. */

DKINDS.phg.push('phgz','phgq');
MODES.phg.splice(MODES.phg.findIndex(m=>m[0]==='mix'),0,['phgz','Gaz parfaits'],['phgq','Gaz : questions']);
Object.assign(KIND_LABEL,{phgz:'Gaz parfaits',phgq:'Gaz : questions'});

Object.assign(TAGS,{
  'ph-gaz-kelvin':{label:'Température en kelvins',tip:'Dans les lois des gaz, T est la température absolue : T = θ + 273 (en K). Avec des °C, les rapports sont faux.'},
  'ph-gaz-loi':{label:'Loi des gaz mal appliquée',tip:'p · V / T = constante : à T constante p₁V₁ = p₂V₂ (Boyle-Mariotte) ; à p constante V₂ = V₁ · T₂/T₁ (Gay-Lussac) ; à V constant p₂ = p₁ · T₂/T₁ (Charles).'},
  'ph-gaz-cours':{label:'Question sur les gaz',tip:'Un gaz enfermé : comprimé, sa pression monte ; chauffé à volume constant, sa pression monte ; chauffé à pression constante, son volume augmente. T toujours en kelvins.'}
});

const PH_GHINT='Écris tes calculs ligne par ligne, par exemple T₁ = 15 + 273 = 288 puis V₂ = 2 * 330 / 288 ≈ 2,29 L. Les températures doivent être en kelvins (T = θ + 273).';
function phGaz(o){ return Object.assign(phNum(o),{hintline:PH_GHINT}); }
const phK=t=>t+273;

/* Boyle-Mariotte : température constante */
function genPhGz1(){
  const c=pick([
    ['L\'air enfermé dans une pompe à vélo dont on bouche la sortie','mL',[120,150,200,250],'on enfonce le piston jusqu\'à un volume de'],
    ['Le gaz d\'un vérin pneumatique fermé','L',[1.2,1.5,2,3],'le piston le comprime jusqu\'à un volume de'],
    ['L\'air d\'un sac étanche emporté au fond d\'une piscine','L',[4,5,6,8],'l\'eau le comprime jusqu\'à un volume de']]);
  const V1=pick(c[2]), p1=pick([1,1.01,0.98,1.2]), f=pick([1.25,1.5,2,2.5,3]), V2=phR(V1/f,c[1]==='mL'?0:2), p2=p1*V1/V2, d=2;
  return phGaz({svg:'',text:c[0]+' occupe «'+NF(V1)+'» '+c[1]+' à la pression de «'+NF(p1)+'» bar. Sans changer sa température, '+c[3]+' «'+NF(V2)+'» '+c[1]+'. Quelle est sa nouvelle pression, en bar, '+phArr(d)+' ?',
    ask:'la nouvelle pression (en bar)',val:p2,d,unit:'bar',placeholder:'p₂ = 1 * 200 / 80\np₂ = 2,5 bar',
    steps:[stp('Loi de Boyle-Mariotte','Température constante : '+M('p₁ · V₁ = p₂ · V₂')),stp('Calcul',M('p₂ = p₁ · V₁ / V₂ = '+NF(p1)+' × '+NF(V1)+' / '+NF(V2)+' ≈ '+NF(phR(p2,d)))+' bar')],
    hints:['À température constante, p · V reste constant : p₁ · V₁ = p₂ · V₂.','Le volume diminue, donc la pression augmente : p₂ = p₁ · V₁ / V₂.'],
    work:['p₂ = '+NF(p1)+' * '+NF(V1)+' / '+NF(V2),'p₂ ≈ '+NF(phR(p2,d))+' bar'],
    mistakes:[{v:p1*V2/V1,tag:'ph-gaz-loi',msg:'Pression et volume sont inversement proportionnels : si le volume diminue, la pression augmente. p₂ = p₁ · V₁ / V₂.'}]});
}
/* Gay-Lussac : pression constante */
function genPhGz2(){
  const c=pick([['Un ballon de baudruche','L',[2,3,4,5],'on le place au congélateur, à'],['L\'air d\'un sac plastique bien fermé','L',[1,1.5,2],'on le laisse au soleil ; l\'air atteint'],['L\'air contenu dans un cylindre fermé par un piston libre','mL',[200,300,500],'on chauffe le cylindre jusqu\'à']]);
  const V1=pick(c[2]), t1=rnd(15,25), t2=c[3].indexOf('congélateur')>=0?-rnd(15,22):rnd(40,90), T1=phK(t1), T2=phK(t2), V2=V1*T2/T1, d=c[1]==='mL'?1:2;
  return phGaz({svg:'',text:c[0]+' occupe «'+NF(V1)+'» '+c[1]+' à «'+t1+'» °C. La pression reste la même, et '+c[3]+' «'+phS(t2)+'» °C. Quel est son nouveau volume, en '+c[1]+', '+phArr(d)+' ?',
    ask:'le nouveau volume (en '+c[1]+')',val:V2,d,unit:c[1],placeholder:'T₁ = 20 + 273 = 293\nT₂ = 60 + 273 = 333\nV₂ = 3 * 333 / 293 ≈ 3,41 L',
    steps:[stp('Températures absolues',M('T₁ = '+t1+' + 273 = '+T1)+' K ; '+M('T₂ = '+phS(t2)+' + 273 = '+T2)+' K'),stp('Loi de Gay-Lussac','Pression constante : '+M('V₂ / T₂ = V₁ / T₁')),stp('Calcul',M('V₂ = '+NF(V1)+' × '+T2+' / '+T1+' ≈ '+NF(phR(V2,d)))+' '+c[1])],
    hints:['À pression constante, le volume est proportionnel à la température absolue : V₂ = V₁ · T₂ / T₁.','Convertis d\'abord : T = θ + 273.'],
    work:['T₁ = '+t1+' + 273 = '+T1,'T₂ = '+t2+' + 273 = '+T2,'V₂ = '+NF(V1)+' * '+T2+' / '+T1,'V₂ ≈ '+NF(phR(V2,d))+' '+c[1]],
    mistakes:[{v:V1*t2/t1,tag:'ph-gaz-kelvin',msg:'Tu as utilisé les températures en °C. Dans les lois des gaz, T est en kelvins : T = θ + 273.'},{v:V1*T1/T2,tag:'ph-gaz-loi',msg:'Rapport inversé : un gaz qui '+(t2>t1?'chauffe':'refroidit')+' à pression constante voit son volume '+(t2>t1?'augmenter':'diminuer')+'.'}]});
}
/* Charles : volume constant */
function genPhGz3(){
  const c=pick([['L\'air des pneus d\'une voiture','est à une pression absolue de',[3,3.2,3.4,3.5],'Après un long trajet sur autoroute, l\'air des pneus atteint'],['Une bombe aérosol','contient un gaz à la pression de',[3,4,5,6],'Oubliée près d\'un radiateur, elle atteint'],['Un bocal en verre fermé','contient de l\'air à la pression de',[1,1.01],'On le plonge dans de l\'eau bouillante ; l\'air atteint']]);
  const p1=pick(c[2]), t1=rnd(5,20), t2=c[0].indexOf('bocal')>=0?100:rnd(40,70), T1=phK(t1), T2=phK(t2), p2=p1*T2/T1, d=2;
  return phGaz({svg:'',text:c[0]+' '+c[1]+' «'+NF(p1)+'» bar à «'+t1+'» °C. '+c[3]+' «'+t2+'» °C, sans que son volume change. Quelle est sa nouvelle pression, en bar, '+phArr(d)+' ?',
    ask:'la nouvelle pression (en bar)',val:p2,d,unit:'bar',placeholder:'T₁ = 10 + 273 = 283\nT₂ = 50 + 273 = 323\np₂ = 2,2 * 323 / 283 ≈ 2,51 bar',
    steps:[stp('Températures absolues',M('T₁ = '+t1+' + 273 = '+T1)+' K ; '+M('T₂ = '+t2+' + 273 = '+T2)+' K'),stp('Loi de Charles','Volume constant : '+M('p₂ / T₂ = p₁ / T₁')),stp('Calcul',M('p₂ = '+NF(p1)+' × '+T2+' / '+T1+' ≈ '+NF(phR(p2,d)))+' bar')],
    hints:['À volume constant, la pression est proportionnelle à la température absolue : p₂ = p₁ · T₂ / T₁.','T = θ + 273 : '+T1+' K et '+T2+' K.'],
    work:['p₂ = '+NF(p1)+' * '+T2+' / '+T1,'p₂ ≈ '+NF(phR(p2,d))+' bar'],
    mistakes:[{v:p1*t2/t1,tag:'ph-gaz-kelvin',msg:'Avec des °C, le rapport est faux : passe en kelvins (T = θ + 273).'},{v:p1*T1/T2,tag:'ph-gaz-loi',msg:'Rapport inversé : un gaz chauffé à volume constant voit sa pression augmenter.'}]});
}
/* loi des gaz parfaits : trois grandeurs changent */
function genPhGz4(){
  const c=pick([['Un sachet de chips fermé','mL',[300,400,500],'On l\'emporte en montagne'],['Un ballon de fête','L',[3,4,5],'On le sort dehors un soir d\'hiver'],['Une bouée gonflée','L',[8,10,12],'On l\'emporte au bord d\'un lac d\'altitude']]);
  const V1=pick(c[2]), p1=pick([960,980,1000,1010]), t1=rnd(18,25), p2=pick([700,750,800,850]), t2=c[0].indexOf('fête')>=0?-rnd(2,10):rnd(0,12);
  const T1=phK(t1), T2=phK(t2), V2=V1*p1*T2/(p2*T1), d=c[1]==='mL'?0:2;
  return phGaz({svg:'',text:c[0]+' contient «'+NF(V1)+'» '+c[1]+' d\'air à «'+p1+'» hPa et «'+t1+'» °C. '+c[3]+', où l\'air est à «'+p2+'» hPa et «'+phS(t2)+'» °C. En supposant que l\'enveloppe suit librement le gaz, quel est son nouveau volume, en '+c[1]+', '+phArr(d)+' ?',
    ask:'le nouveau volume (en '+c[1]+')',val:V2,d,unit:c[1],placeholder:'V₂ = 400 * 1000 * 278 / (800 * 293)\nV₂ ≈ 474 mL',
    steps:[stp('Loi des gaz parfaits',M('p₁ · V₁ / T₁ = p₂ · V₂ / T₂')),stp('Températures absolues',M('T₁ = '+T1)+' K ; '+M('T₂ = '+T2)+' K'),stp('Calcul',M('V₂ = V₁ · (p₁ / p₂) · (T₂ / T₁) = '+NF(V1)+' × '+p1+' × '+T2+' / ('+p2+' × '+T1+') ≈ '+NF(phR(V2,d)))+' '+c[1])],
    hints:['p · V / T reste constant : V₂ = V₁ · (p₁ / p₂) · (T₂ / T₁).','Pressions dans la même unité (hPa), températures en kelvins (T = θ + 273).'],
    work:['V₂ = '+NF(V1)+' * '+p1+' * '+T2+' / ('+p2+' * '+T1+')','V₂ ≈ '+NF(phR(V2,d))+' '+c[1]],
    mistakes:[{v:V1*p1*t2/(p2*t1),tag:'ph-gaz-kelvin',msg:'Les températures doivent être en kelvins : T = θ + 273.'},
      {v:V1*p2*T2/(p1*T1),tag:'ph-gaz-loi',msg:'Rapport des pressions inversé : quand la pression extérieure baisse, le volume augmente. V₂ = V₁ · p₁ / p₂ · T₂ / T₁.'},
      {v:V1*p1/p2,tag:'ph-gaz-loi',msg:'Tu as oublié l\'effet de la température (T₂ / T₁).'}]});
}
/* réserve de gaz comprimé (température constante) */
function genPhGz5(){
  const c=pick([['Une bouteille d\'hélium pour ballons de fête',[10,20,50],[150,200]],['La bouteille d\'un pistolet à peinture',[5,10],[8,10,12]],['La réserve d\'air d\'un compresseur d\'atelier',[24,50,100],[8,10]]]);
  const V1=pick(c[1]), p1=pick(c[2]), pa=pick([0.95,1,1.02]), V2=p1*V1/pa, d=0;
  return phGaz({svg:'',text:c[0]+' a une capacité de «'+V1+'» L ; le gaz y est à «'+p1+'» bar. Quel volume ce gaz occuperait-il à la pression ambiante de «'+NF(pa)+'» bar, à la même température ? Donne-le en L, '+phArr(d)+'.',
    ask:'le volume à la pression ambiante (en L)',val:V2,d,unit:'L',placeholder:'V₂ = 200 * 10 / 1\nV₂ = 2000 L',
    steps:[stp('Boyle-Mariotte','Même température : '+M('p₁ · V₁ = p₂ · V₂')),stp('Calcul',M('V₂ = '+p1+' × '+V1+' / '+NF(pa)+' ≈ '+NF(phR(V2,d)))+' L')],
    hints:['La quantité de gaz ne change pas ; à température constante, p · V reste constant.','Une pression divisée par '+NF(phR(p1/pa,1))+' donne un volume multiplié par autant.'],
    work:['V₂ = '+p1+' * '+V1+' / '+NF(pa),'V₂ ≈ '+NF(phR(V2,d))+' L'],
    mistakes:[{v:V1*pa/p1,tag:'ph-gaz-loi',msg:'Détendu, le gaz occupe un volume bien plus grand : V₂ = p₁ · V₁ / p₂.'},{v:p1*V1,tag:'ph-gaz-loi',msg:'Il faut encore diviser par la pression ambiante p₂ = '+NF(pa)+' bar.'}]});
}

const PH_GVF=[
  ['À température constante, si on divise par deux le volume d\'un gaz, sa pression double.','vrai','Boyle-Mariotte : p · V = constante, la pression et le volume sont inversement proportionnels.'],
  ['La loi de Gay-Lussac décrit un gaz chauffé à volume constant.','faux','Gay-Lussac : pression constante (le volume varie). À volume constant, c\'est la loi de Charles (la pression varie).'],
  ['Dans les lois des gaz, la température doit être exprimée en kelvins.','vrai','On utilise la température absolue T = θ + 273, en K.'],
  ['0 °C correspond à environ 273 K.','vrai','T₀ = 1/γ = 273 K.'],
  ['Les gaz réels suivent exactement la loi des gaz parfaits.','faux','Dans un gaz parfait, on néglige les interactions entre molécules et leur volume ; les gaz réels s\'en écartent un peu.'],
  ['Un gaz réel se comporte d\'autant plus comme un gaz parfait que sa pression est faible et sa température élevée.','vrai','C\'est ce qu\'indique le cours : les gaz réels s\'approchent de la loi des gaz parfaits à basse pression et haute température.'],
  ['La constante de Boyle-Mariotte (p · V) s\'exprime en joules.','vrai','Pa · m³ = N/m² · m³ = N · m = J : c\'est une énergie.'],
  ['À pression constante, si la température absolue double, le volume du gaz double.','vrai','Gay-Lussac : V = V₀ · T / T₀, le volume est proportionnel à la température absolue.']
];
const PH_GQ=[
  ['Pourquoi ne faut-il jamais jeter une bombe aérosol, même vide, dans le feu ?',['la pression du gaz augmente','le gaz se refroidit'],'la pression du gaz augmente','Le gaz restant est enfermé à volume constant : chauffé, sa pression augmente (loi de Charles) et la bombe peut éclater.'],
  ['On contrôle la pression des pneus à froid. Après un long trajet, la pression mesurée est-elle plus haute ou plus basse ?',['plus haute','plus basse'],'plus haute','L\'air des pneus s\'est réchauffé à volume presque constant : sa pression a augmenté.'],
  ['Un ballon sorti du congélateur regonfle peu à peu. Pourquoi ?',['le gaz se réchauffe et se dilate','de l\'air entre dans le ballon'],'le gaz se réchauffe et se dilate','À pression à peu près constante, le volume du gaz augmente avec sa température (Gay-Lussac).'],
  ['En montagne, un sachet de chips fermé gonfle. Quelle en est la cause principale ?',['la pression extérieure diminue','le sachet se réchauffe'],'la pression extérieure diminue','La pression de l\'air diminue avec l\'altitude : le gaz du sachet se détend et occupe plus de volume (Boyle-Mariotte).'],
  ['On bouche la sortie d\'une pompe à vélo et on enfonce le piston. La pression de l\'air enfermé augmente-t-elle ou diminue-t-elle ?',['augmente','diminue'],'augmente','Le volume diminue à température à peu près constante : p · V restant constant, la pression augmente.']
];
function genPhGq(){
  if(Math.random()<0.5){ const q=pick(PH_GVF), ch=['vrai','faux'];
    return phTxt({choices:ch,tag:'ph-gaz-cours',statement:q[0],answers:[q[1]],instr:'Vrai ou faux ?',hint:'Repère ce qui reste constant (T, p ou V) pour savoir quelle loi s\'applique, et pense aux kelvins.',
      solution:'<b>'+q[1]+'</b>. '+q[2],mist:phMist(ch,q[1],()=>q[2]),fallback:{tag:'ph-gaz-cours',title:'Réponds vrai ou faux',html:'<p>Écris <b>vrai</b> ou <b>faux</b>.</p>'}}); }
  const q=pick(PH_GQ);
  return phTxt({choices:q[1],tag:'ph-gaz-cours',statement:q[0],answers:[q[2]],instr:'Choisis la bonne réponse',hint:'Repère ce qui reste constant : la température (Boyle-Mariotte), la pression (Gay-Lussac) ou le volume (Charles).',
    solution:'<b>'+q[2]+'</b>. '+q[3],mist:phMist(q[1],q[2],()=>q[3]),fallback:{tag:'ph-gaz-cours',title:'Choisis l\'une des réponses proposées',html:'<p>Utilise les touches de réponse.</p>'}});
}

PHT('ph-gz1',1,'phgz','Boyle-Mariotte (température constante)',genPhGz1);
PHT('ph-gz2',2,'phgz','Gay-Lussac (pression constante)',genPhGz2);
PHT('ph-gz3',3,'phgz','Charles (volume constant)',genPhGz3);
PHT('ph-gz4',4,'phgz','Loi des gaz parfaits',genPhGz4);
PHT('ph-gz5',5,'phgz','Réserve de gaz comprimé',genPhGz5);
PHT('ph-gq1',1,'phgq','Vrai ou faux et situations',genPhGq);

PH_FORM.push(['Gaz parfaits',[['Température absolue',M('T = θ + 273')+' (en K)'],['Boyle-Mariotte (T constante)',M('p₁ · V₁ = p₂ · V₂')],['Gay-Lussac (p constante)',M('V = V₀ · T / T₀')+' ; '+M('V₂ / T₂ = V₁ / T₁')],['Charles (V constant)',M('p = p₀ · T / T₀')+' ; '+M('p₂ / T₂ = p₁ / T₁')],['Loi des gaz parfaits',M('p · V / T = constante')]]]);
brData('physique').fiches.push(
{d:'phg',t:'Chaleur · La dilatation des gaz parfaits (résumé)',html:
'<p>La dilatation d\'un gaz à <b>pression constante</b> s\'exprime par la <b>loi de Gay-Lussac</b> :</p><p>'+M('V = V₀ · (1 + γ · θ) = V₀ · T / T₀')+'</p>'
+'<p>V : volume du gaz à la température θ [m³] ; V₀ : volume du gaz à 0 °C [m³] ; γ : coefficient de dilatation (γ = 1/273 °C⁻¹) ; θ : température [°C] ; T : température absolue [K] ; T₀ = 1/γ = 273 K.</p>'
+'<p>L\'augmentation de pression d\'un gaz, à <b>volume constant</b>, s\'exprime par la <b>loi de Charles</b> :</p><p>'+M('p = p₀ · (1 + γ · θ) = p₀ · T / T₀')+'</p>'
+'<p>p : pression du gaz à la température θ [Pa] ; p₀ : pression du gaz à 0 °C [Pa].</p>'
+'<p>À <b>température constante</b>, la pression et le volume d\'un gaz parfait sont liés par la <b>loi de Boyle-Mariotte</b> : '+M('p · V = constante')+'.</p>'
+'<p>Les gaz parfaits satisfont donc à la <b>loi des gaz parfaits</b> : '+M('p · V / T = constante')+' (p : pression absolue [Pa] ; V : volume [m³] ; T : température absolue [K]).</p>'},
{d:'phg',t:'Boyle-Mariotte et gaz parfaits (pages C-54)',html:
'<p>Un gaz étant compressible, il est possible de modifier son volume. Si sa température ne change pas, sa pression varie. Expérimentalement, on constate que '+M('p₁ · V₁ = p₂ · V₂')+'.</p>'
+'<p><b>Lorsqu\'on comprime un gaz à température constante, sa pression et son volume sont inversement proportionnels</b> : '+M('p · V = constante')+'. C\'est la loi de Boyle-Mariotte ; l\'unité de la constante est le N · m, c\'est-à-dire le J : il s\'agit donc d\'une énergie.</p>'
+'<p>Les trois lois sont résumées dans une loi plus générale, qui décrit la transformation d\'un gaz de masse constante : '+M('p · V / T = constante')+' (unité de la constante : J · K⁻¹). C\'est la loi des gaz parfaits.</p>'
+'<p>Dans un gaz parfait, on néglige les interactions entre les molécules ainsi que leur volume. Il n\'en est pas de même dans les gaz réels qui, en conséquence, ne suivent pas exactement la loi des gaz parfaits. Ils s\'en approchent d\'autant plus que leur pression est faible et leur température élevée.</p>'
+'<p><b>Note historique</b> : la relation de Boyle-Mariotte a été établie en 1662 par Robert Boyle (Irlande, 1627-1691) et, de façon indépendante, en 1679, par l\'abbé Edme Mariotte (France, 1620-1684).</p>'
+'<p>Les pages précédentes du chapitre (sections 1 à 4) ne me sont pas encore parvenues. Les exercices de l\'appli sont <b>originaux</b> : mêmes lois que ta feuille, avec d\'autres situations et des valeurs tirées au hasard.</p>'}
);
