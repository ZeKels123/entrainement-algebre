'use strict';
/* ===== Trigonométrie du triangle rectangle ===== */
Object.assign(TAGS,{
  'geo-trig-rapport':{label:'Choix du rapport trigonométrique',tip:'SOH-CAH-TOA : sin α = opposé / hypoténuse ; cos α = adjacent / hypoténuse ; tan α = opposé / adjacent. « Opposé » et « adjacent » se définissent par rapport à l\'angle α : le côté opposé est en face de α, le côté adjacent touche α (sans être l\'hypoténuse).'},
  'geo-trig-mult':{label:'Multiplier ou diviser',tip:'On écrit d\'abord le rapport (par exemple sin α = opposé / hypoténuse). Si le côté cherché est en haut de la fraction, on multiplie le côté connu par le rapport ; s\'il est en bas, on divise.'},
  'geo-trig-inverse':{label:'Angle : fonction réciproque',tip:'Pour trouver un angle, on calcule d\'abord le rapport (par exemple sin α = opposé / hypoténuse), puis on utilise sin⁻¹, cos⁻¹ ou tan⁻¹ sur la calculatrice, réglée en degrés. Les deux angles aigus ont pour somme 90°.'},
  'geo-trig-exact':{label:'Valeurs exactes de 30°, 45°, 60°',tip:'sin 30° = 1/2 ; cos 30° = √3/2 ; sin 45° = cos 45° = √2/2 ; sin 60° = √3/2 ; cos 60° = 1/2 ; tan 30° = √3/3 ; tan 45° = 1 ; tan 60° = √3.'}
});
const D2R=Math.PI/180, R1d=x=>Math.round(x*10)/10;
const TR={sin:a=>Math.sin(a*D2R),cos:a=>Math.cos(a*D2R),tan:a=>Math.tan(a*D2R)};
/* triangle rectangle : angle droit en P (0,0), α en Q, côté opposé = PR (vertical) */
function trigSvg(o){
  const al=o.alpha, w=4, hh=Math.max(1.4,Math.min(7,w*Math.tan(al*D2R))), fl=o.flip?-1:1;
  const P=[0,0], Q=[fl*w,0], R=[0,hh];
  return figure([P,Q,R],f=>{
    const p=f(P), q=f(Q), r=f(R), ce=vmid(vmid(p,q),r); let out=g.poly([p,q,r])+g.right(p,r,q,11)+g.dot(p)+g.dot(q)+g.dot(r);
    const rad=26, u1=vunit(vsub(p,q)), u2=vunit(vsub(r,q)), a1=vadd(q,vmul(u1,rad)), a2=vadd(q,vmul(u2,rad)), am=vadd(q,vmul(vunit(vadd(u1,u2)),rad));
    out+='<path class="g-mark" d="M'+gf(a1[0])+' '+gf(a1[1])+arcM(a1,a2,am,rad)+'"/>';
    out+=g.text(vadd(q,vmul(vunit(vadd(u1,u2)),rad+((o.alphaLab||'α').length>1?27:17))),o.alphaLab||'α','g-u');
    const L=o.lab||{};
    if(L.adj!=null) out+=g.len(p,q,String(L.adj),ce,10,L.adj==='?'?'g-u':'');
    if(L.opp!=null) out+=g.len(p,r,String(L.opp),ce,10,L.opp==='?'?'g-u':'');
    if(L.hyp!=null) out+=g.len(q,r,String(L.hyp),ce,10,L.hyp==='?'?'g-u':'');
    return out;
  },o.alt||'Triangle rectangle',{H:230,pad:34});
}
const SIDE={hyp:'l\'hypoténuse',adj:'le côté adjacent à α',opp:'le côté opposé à α'};
const RAT={sin:'sin α = opposé / hypoténuse',cos:'cos α = adjacent / hypoténuse',tan:'tan α = opposé / adjacent'};

/* ----- gr-1 : écrire sin, cos, tan comme fractions ----- */
function genTrig1(){
  const [a,b,c]=pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29]]), flip=Math.random()<0.5, opp=Math.random()<0.5?a:b, adj=opp===a?b:a, f=pick(['sin','cos','tan']);
  const num={sin:opp,cos:adj,tan:opp}[f], den={sin:c,cos:c,tan:adj}[f], val=num/den, nm={sin:'opposé',cos:'adjacent',tan:'opposé'}[f], dn={sin:'hypoténuse',cos:'hypoténuse',tan:'adjacent'}[f];
  const wrong=[]; const add=(n,d,tag,msg,w)=>{ if(Math.abs(n/d-val)>1e-9) wrong.push({v:n/d,tag,msg,w}); };
  add(den,num,'geo-trig-rapport','Tu as écrit la fraction à l\'envers : '+f+' α = '+nm+' / '+dn+'.',[f+' α = '+den+'/'+num]);
  const alts={sin:[[adj,c,'cos'],[opp,adj,'tan']],cos:[[opp,c,'sin'],[opp,adj,'tan']],tan:[[opp,c,'sin'],[adj,c,'cos']]}[f];
  alts.forEach(x=>add(x[0],x[1],'geo-trig-rapport','Ce rapport est celui du '+(x[2]==='sin'?'sinus':x[2]==='cos'?'cosinus':'tangente')+'. Pour '+(f==='sin'?'le sinus':f==='cos'?'le cosinus':'la tangente')+' : '+RAT[f]+'.',[f+' α = '+x[0]+'/'+x[1]]));
  add(adj,opp,'geo-trig-rapport','Opposé et adjacent sont par rapport à l\'angle α : le côté opposé est en face de α ('+opp+').',[f+' α = '+adj+'/'+opp]);
  return mkGeo({svg:trigSvg({alpha:35,flip,lab:{opp,adj,hyp:c},alt:'Triangle rectangle de côtés '+opp+', '+adj+' et '+c}),mode:'num',exact:num+'/'+den,val,unit:'',pow:1,
    text:'Dans ce triangle rectangle, les côtés mesurent «'+opp+'», «'+adj+'» et «'+c+'». Donne <b>'+f+' α</b> sous forme de <b>fraction</b>.',ask:f+' α (fraction)',placeholder:f+' α = '+nm+' / '+dn+'\n'+f+' α = '+num+'/'+den,
    work:[RAT[f],f+' α = '+num+'/'+den],
    steps:[stp('Repérer les côtés','Le côté en face de α est l\'<b>opposé</b> : '+M(opp)+'. Le côté qui touche α sans être l\'hypoténuse est l\'<b>adjacent</b> : '+M(adj)+'. L\'<b>hypoténuse</b> (en face de l\'angle droit) : '+M(c)+'.'),stp('Rapport',M(RAT[f])+' donc '+M(f+' α = '+num+'/'+den))],
    hints:['SOH-CAH-TOA : sin = Opposé/Hypoténuse, cos = Adjacent/Hypoténuse, tan = Opposé/Adjacent.'],
    mistakes:wrong});
}

/* ----- gr-2 : calculer une longueur ----- */
function genTrig2(){
  const al=pick([20,25,30,35,40,50,55,60,65,70]), flip=Math.random()<0.5, u=uP();
  const combos=[['hyp','opp','sin','mul'],['hyp','adj','cos','mul'],['adj','hyp','cos','div'],['adj','opp','tan','mul'],['opp','hyp','sin','div'],['opp','adj','tan','div']];
  const [K,T,fn,op]=pick(combos), kv=rnd(5,30), val=op==='mul'?kv*TR[fn](al):kv/TR[fn](al), ans=R1d(val);
  const lab={}; lab[K]=kv; lab[T]='?';
  const svg=trigSvg({alpha:al,alphaLab:al+'°',flip,lab,alt:'Triangle rectangle avec un angle de '+al+'°'});
  const wrong=[]; ['sin','cos','tan'].forEach(f2=>['mul','div'].forEach(o2=>{ const v=o2==='mul'?kv*TR[f2](al):kv/TR[f2](al); if(R1d(v)!==ans&&!wrong.some(w=>R1d(w.v)===R1d(v))){ const sameFn=f2===fn; wrong.push({v,tag:sameFn?'geo-trig-mult':'geo-trig-rapport',msg:sameFn?'Le bon rapport est '+fn+' α, mais le côté cherché est '+(op==='mul'?'en haut':'en bas')+' de la fraction : il faut '+(op==='mul'?'multiplier':'diviser')+'.':'Tu as utilisé '+f2+' α. Ici le côté connu est '+SIDE[K]+' et le côté cherché '+SIDE[T]+' : c\'est le '+(fn==='sin'?'sinus':fn==='cos'?'cosinus':'la tangente')+'.',w:['côté = '+kv+(o2==='mul'?' × ':' / ')+f2+' '+al+'° = '+NF(R1d(v))]}); } }));
  const fnm=fn+' '+al+'°', rel=RAT[fn].replace('α',al+'°');
  return mkGeo({svg,mode:'round',d:1,val,unit:u,pow:1,
    text:'Dans ce triangle rectangle, l\'angle α mesure «'+al+'°» et '+SIDE[K]+' mesure «'+kv+'» '+u+'. Calcule '+SIDE[T]+', arrondi au <b>dixième</b> (calculatrice en degrés).',ask:'la longueur (arrondie au dixième)',placeholder:'sin 35° = côté / 12\ncôté = 12 × sin 35° ≈ 6,9 cm',
    work:[RAT[fn],op==='mul'?'côté = '+kv+' × '+fn+' '+al+'° = '+NF(ans)+' '+u:'côté = '+kv+' / '+fn+' '+al+'° = '+NF(ans)+' '+u],
    steps:[stp('Choisir le rapport','Côté connu : '+SIDE[K]+' ; côté cherché : '+SIDE[T]+'. Le rapport qui relie '+(K==='hyp'||T==='hyp'?(K==='opp'||T==='opp'?'opposé et hypoténuse':'adjacent et hypoténuse'):'opposé et adjacent')+' est le '+(fn==='sin'?'sinus':fn==='cos'?'cosinus':'la tangente')+' : '+M(RAT[fn])+'.'),stp('Isoler le côté',op==='mul'?'Le côté cherché est en haut de la fraction : on multiplie.':'Le côté cherché est en bas de la fraction : on divise.',M(op==='mul'?'côté = '+kv+' × '+fn+' '+al+'° ≈ '+NF(ans):'côté = '+kv+' / '+fn+' '+al+'° ≈ '+NF(ans))+' '+u)],
    hints:['SOH-CAH-TOA : choisis le rapport qui contient le côté connu et le côté cherché.','Écris le rapport avec les valeurs, puis isole le côté cherché.'],
    mistakes:wrong.slice(0,6)});
}

/* ----- gr-3 : calculer un angle ----- */
function genTrig3(){
  const flip=Math.random()<0.5, kind=pick(['sin','cos','tan']);
  let o,a,h;
  for(let i=0;i<50;i++){ o=rnd(3,18); a=rnd(3,18); h=Math.round(Math.hypot(o,a)*10)/10; if(kind==='tan'||(kind==='sin'&&h>o)||(kind==='cos'&&h>a)) break; }
  let lab, val, rat, num, den;
  if(kind==='tan'){ lab={opp:o,adj:a,hyp:null}; val=Math.atan(o/a)/D2R; num=o; den=a; }
  else { const hy=Math.max(o,a)+rnd(1,5); if(kind==='sin'){ lab={opp:o,hyp:hy}; val=Math.asin(o/hy)/D2R; num=o; den=hy; } else { lab={adj:a,hyp:hy}; val=Math.acos(a/hy)/D2R; num=a; den=hy; } }
  lab.__=0; delete lab.__;
  const ans=R1d(val), svg=trigSvg({alpha:Math.max(20,Math.min(65,val)),alphaLab:'α',flip,lab,alt:'Triangle rectangle'});
  const fnm={sin:'sin⁻¹',cos:'cos⁻¹',tan:'tan⁻¹'}[kind], names={sin:['opposé','hypoténuse'],cos:['adjacent','hypoténuse'],tan:['opposé','adjacent']}[kind];
  const wrong=[]; const add=(v,tag,msg,w)=>{ if(R1d(v)!==ans&&isFinite(v)&&v>0&&v<90&&!wrong.some(x=>R1d(x.v)===R1d(v))) wrong.push({v,tag,msg,w}); };
  add(90-val,'geo-trig-inverse','Tu as trouvé l\'autre angle aigu : α = '+NF(ans)+'°, et son complément vaut 90° − α.',['autre angle = 90° − '+NF(ans)+'° = '+NF(R1d(90-val))+'°']);
  if(kind==='tan') add(Math.atan(a/o)/D2R,'geo-trig-rapport','Tu as inversé la fraction : tan α = opposé / adjacent.',['tan α = '+a+'/'+o]);
  else { const x=(kind==='sin'?Math.atan(o/Math.sqrt(Math.max(1,den*den-o*o))):Math.atan(Math.sqrt(Math.max(1,den*den-a*a))/a))/D2R; }
  const oo=kind==='sin'?o:a; const alt1=kind==='sin'?Math.acos(num/den)/D2R:Math.asin(num/den)/D2R; add(alt1,'geo-trig-rapport','Tu as utilisé '+(kind==='sin'?'cos⁻¹':'sin⁻¹')+' : ici le rapport est '+RAT[kind]+', donc '+fnm+'.',[(kind==='sin'?'cos⁻¹':'sin⁻¹')+'('+num+'/'+den+')']);
  add(Math.atan(num/den)/D2R*(kind==='tan'?0:1),'geo-trig-rapport','Tu as utilisé tan⁻¹ : le rapport à utiliser est '+RAT[kind]+'.',['tan⁻¹('+num+'/'+den+')']);
  add(val*D2R,'geo-trig-inverse','Ta calculatrice était en radians : passe-la en degrés.',['α ≈ '+NF(Math.round(val*D2R*10)/10)]);
  return mkGeo({svg,mode:'round',d:1,val,unit:'°',pow:1,
    text:'Dans ce triangle rectangle, '+(kind==='tan'?'le côté opposé à α mesure «'+o+'» et le côté adjacent «'+a+'»':kind==='sin'?'le côté opposé à α mesure «'+o+'» et l\'hypoténuse «'+lab.hyp+'»':'le côté adjacent à α mesure «'+a+'» et l\'hypoténuse «'+lab.hyp+'»')+'. Calcule l\'angle α, arrondi au <b>dixième de degré</b>.',ask:'l\'angle α (arrondi au dixième)',placeholder:'sin α = 5/9\nα = sin⁻¹(5/9) ≈ 33,7°',
    work:[RAT[kind].replace('hypoténuse',names[1]).split('=')[0].trim()+' = '+num+'/'+den,'α = '+fnm+'('+num+'/'+den+') ≈ '+NF(ans)+'°'],
    steps:[stp('Choisir le rapport','On connaît le côté '+names[0]+' et le côté '+names[1]+' : '+M(RAT[kind])+'.'),stp('Fonction réciproque',M(kind+' α = '+num+'/'+den)+' donc '+M('α = '+fnm+'('+num+'/'+den+') ≈ '+NF(ans)+'°')+'.')],
    hints:['Écris le rapport, puis utilise la touche '+fnm+' de la calculatrice (mode degrés).'],
    mistakes:wrong.slice(0,5)});
}

/* ----- gr-4 : valeurs exactes (30°, 45°, 60°) ----- */
function genTrig4(){
  const al=pick([30,45,60]), flip=Math.random()<0.5, u=uP(), k=rnd(2,9), H=2*k, T=pick(['opp','adj']);
  const ex={30:{opp:[k,0],adj:[0,k]},45:{opp:[0,k],adj:[0,k]},60:{opp:[0,k],adj:[k,0]}}[al][T];  // [entier, coefficient de racine]
  const rt=al===45?2:3, intg=ex[0]>0, valn=intg?ex[0]:ex[1]*Math.sqrt(rt), exs=intg?String(ex[0]):kRt(ex[1],rt);
  const fn=T==='opp'?'sin':'cos', exv={'sin30':'1/2','cos30':'√3/2','sin45':'√2/2','cos45':'√2/2','sin60':'√3/2','cos60':'1/2'}[fn+al];
  const mkv=(v)=>v;
  const wrong=[]; const add=(v,tag,msg,w)=>{ if(Math.abs(v-valn)>1e-6&&!wrong.some(x=>Math.abs(x.v-v)<1e-6)) wrong.push({v,tag,msg,w}); };
  const other={30:{sin:k,cos:k*Math.sqrt(3)},45:{sin:k*Math.sqrt(2),cos:k*Math.sqrt(2)},60:{sin:k*Math.sqrt(3),cos:k}}[al];
  add(fn==='sin'?other.cos:other.sin,'geo-trig-exact','Tu as pris la valeur de '+(fn==='sin'?'cos':'sin')+' '+al+'° : ici c\'est '+fn+' '+al+'° = '+exv+'.',[fn+' '+al+'° = '+(fn==='sin'?'cos':'sin')+' '+al+'°']);
  add(H*(rt===2?Math.SQRT1_2:0.5)*(al===45?1:0)+ (al===45?0:H*Math.sqrt(3)),'geo-trig-exact','Valeur exacte à revoir : '+fn+' '+al+'° = '+exv+'.',['côté = '+H+' × √3']);
  add(H,'geo-trig-rapport','Le côté cherché est plus petit que l\'hypoténuse ('+H+') : il vaut '+H+' × '+fn+' '+al+'°.',['côté = '+H]);
  add(H/Math.sqrt(2),'geo-trig-exact','Ici '+fn+' '+al+'° = '+exv+'.',['côté = '+H+' / √2']);
  add(valn*2,'geo-trig-exact','Tu as oublié de diviser par 2 : '+fn+' '+al+'° = '+exv+'.',['côté = '+H+' × '+(al===30?'√3':'1')]);
  const lab={hyp:H}; lab[T]='?';
  return mkGeo({svg:trigSvg({alpha:al,alphaLab:al+'°',flip,lab,alt:'Triangle rectangle avec un angle de '+al+'°'}),mode:intg?'num':'sqrt',exact:exs,val:valn,unit:u,pow:1,
    text:'Dans ce triangle rectangle, l\'angle α mesure «'+al+'°» et l\'hypoténuse mesure «'+H+'» '+u+'. Calcule '+SIDE[T]+'. Donne la <b>valeur exacte</b> (sans calculatrice).',ask:'la valeur exacte du côté',placeholder:fn+' '+al+'° = '+exv+'\ncôté = '+H+' × '+exv,
    work:[RAT[fn],fn+' '+al+'° = '+exv,'côté = '+H+' × '+exv+' = '+exs+' '+u],
    steps:[stp('Rapport',M(RAT[fn])+', donc '+M('côté = '+H+' × '+fn+' '+al+'°')+'.'),stp('Valeur exacte',M(fn+' '+al+'° = '+exv)+' (à connaître).',M('côté = '+H+' × '+exv+' = '+exs)+' '+u)],
    hints:['Valeurs à connaître : sin 30° = 1/2, cos 30° = √3/2, sin 45° = cos 45° = √2/2, sin 60° = √3/2, cos 60° = 1/2.'],
    mistakes:wrong.slice(0,5)});
}

/* ----- gr-5 : problèmes concrets ----- */
function genTrig5(){
  const t=pick(['mat','rampe','pointe','echelle','pente']), u=uP();
  const tri=(lab,al,alphaLab,alt)=>trigSvg({alpha:al,alphaLab,flip:Math.random()<0.5,lab,alt});
  if(t==='mat'){
    const d=rnd(15,60), al=pick([25,30,35,40,45,50,55]), v=d*TR.tan(al), ans=R1d(v), u2=pick(['m','m']);
    return mkGeo({svg:tri({adj:d,opp:'?'},al,al+'°','Pylône vu sous un angle de '+al+'°'),mode:'round',d:1,val:v,unit:u2,pow:1,
      text:'Depuis un point situé à «'+d+'» m du pied d\'un pylône (sur un sol horizontal), on voit son sommet sous un angle de «'+al+'°» au-dessus de l\'horizontale. On néglige la hauteur de l\'observateur. Quelle est la <b>hauteur</b> du pylône, arrondie au dixième ?',ask:'la hauteur (arrondie au dixième)',placeholder:'tan 40° = hauteur / 30\nhauteur = ...',
      work:['tan '+al+'° = h / '+d,'h = '+d+' × tan '+al+'° ≈ '+NF(ans)+' m'],
      steps:[stp('Rapport','On connaît le côté adjacent à l\'angle ('+d+' m) et on cherche le côté opposé : c\'est la tangente.',M('tan '+al+'° = h / '+d)),stp('Calcul',M('h = '+d+' × tan '+al+'° ≈ '+NF(ans))+' m')],
      hints:['Côté adjacent connu, côté opposé cherché : tangente.'],
      mistakes:[{v:d/TR.tan(al),tag:'geo-trig-mult',msg:'Le côté cherché (opposé) est en haut de tan α = opposé / adjacent : on multiplie.',w:['h = '+d+' / tan '+al+'°']},{v:d*TR.sin(al),tag:'geo-trig-rapport',msg:'Le sinus relie l\'opposé et l\'hypoténuse, que tu ne connais pas ici.',w:['h = '+d+' × sin '+al+'°']},{v:d*TR.cos(al),tag:'geo-trig-rapport',msg:'Le cosinus relie l\'adjacent et l\'hypoténuse : ce n\'est pas le bon rapport.',w:['h = '+d+' × cos '+al+'°']}].filter(m=>R1d(m.v)!==ans)});
  }
  if(t==='rampe'){
    const L=rnd(4,20), al=pick([5,8,10,12,15,20]), v=L*TR.sin(al), ans=R1d(v);
    return mkGeo({svg:tri({hyp:L,opp:'?'},al,al+'°','Rampe de '+L+' m inclinée de '+al+'°'),mode:'round',d:1,val:v,unit:'m',pow:1,
      text:'Une rampe de «'+L+'» m de long fait un angle de «'+al+'°» avec l\'horizontale. De combien de mètres s\'élève-t-elle (dénivelé), arrondi au dixième ?',ask:'le dénivelé (arrondi au dixième)',placeholder:'sin '+al+'° = h / '+L+'\nh = ...',
      work:['sin '+al+'° = h / '+L,'h = '+L+' × sin '+al+'° ≈ '+NF(ans)+' m'],
      steps:[stp('Rapport','La rampe est l\'hypoténuse ('+L+' m), le dénivelé est le côté opposé à l\'angle : c\'est le sinus.',M('sin '+al+'° = h / '+L)),stp('Calcul',M('h = '+L+' × sin '+al+'° ≈ '+NF(ans))+' m')],
      hints:['Hypoténuse connue, côté opposé cherché : sinus.'],
      mistakes:[{v:L*TR.cos(al),tag:'geo-trig-rapport',msg:'Le dénivelé est le côté opposé à l\'angle (vertical) : c\'est le sinus, pas le cosinus.',w:['h = '+L+' × cos '+al+'°']},{v:L/TR.sin(al),tag:'geo-trig-mult',msg:'Le côté cherché (opposé) est en haut de la fraction : on multiplie.',w:['h = '+L+' / sin '+al+'°']},{v:L*TR.tan(al),tag:'geo-trig-rapport',msg:'La tangente relie opposé et adjacent. Ici on connaît l\'hypoténuse.',w:['h = '+L+' × tan '+al+'°']}].filter(m=>R1d(m.v)!==ans)});
  }
  if(t==='pointe'){
    const D=pick([6,8,10,12,16,20]), h=rnd(10,40), v=Math.atan((D/2)/h)/D2R, ans=R1d(v);
    const wr=[{v:2*v,tag:'geo-trig-inverse',msg:'Tu as calculé l\'angle total au sommet. La question demande le demi-angle (côté opposé = rayon).',w:['2α ≈ '+NF(R1d(2*v))+'°']},{v:Math.atan(D/h)/D2R,tag:'geo-trig-rapport',msg:'Le côté opposé au demi-angle est le rayon ('+D/2+'), pas le diamètre ('+D+').',w:['tan α = '+D+' / '+h]},{v:Math.atan(h/(D/2))/D2R,tag:'geo-trig-rapport',msg:'tan α = opposé / adjacent = '+D/2+' / '+h+' (la fraction était à l\'envers).',w:['tan α = '+h+' / '+D/2]}].filter(m=>R1d(m.v)!==ans&&m.v<90);
    return mkGeo({svg:tri({opp:NF(D/2),adj:h,hyp:null},Math.max(20,Math.min(65,v)),'α','Pointe conique'),mode:'round',d:1,val:v,unit:'°',pow:1,
      text:'Une pointe d\'outil conique a un diamètre de «'+D+'» mm à la base et une longueur (hauteur) de «'+h+'» mm. Le triangle ci-contre est une demi-coupe de la pointe : α est le <b>demi-angle au sommet</b>. Calcule α, arrondi au dixième de degré.',ask:'le demi-angle α (arrondi au dixième)',placeholder:'tan α = ... / ...\nα = tan⁻¹(...) ≈ ...°',
      work:['rayon = '+D+' / 2 = '+NF(D/2),'tan α = '+NF(D/2)+' / '+h,'α = tan⁻¹('+NF(D/2)+'/'+h+') ≈ '+NF(ans)+'°'],
      steps:[stp('Demi-coupe','Le côté opposé à α est le <b>rayon</b> '+M(D+' / 2 = '+NF(D/2))+' mm ; le côté adjacent est la hauteur '+M(h)+' mm.'),stp('Angle',M('tan α = '+NF(D/2)+' / '+h)+', donc '+M('α = tan⁻¹('+NF(D/2)+'/'+h+') ≈ '+NF(ans)+'°'))],
      hints:['Passe du diamètre au rayon : le côté opposé est un rayon.'],mistakes:wr});
  }
  if(t==='echelle'){
    const L=rnd(3,8), pied=Math.round(L*pick([0.25,0.3,0.35,0.4])*10)/10, v=Math.acos(pied/L)/D2R, ans=R1d(v);
    return mkGeo({svg:tri({hyp:L,adj:NF(pied)},Math.max(20,Math.min(75,v)),'α','Échelle appuyée contre un mur'),mode:'round',d:1,val:v,unit:'°',pow:1,
      text:'Une échelle de «'+L+'» m est appuyée contre un mur vertical, son pied étant à «'+NF(pied)+'» m du mur. Quel angle α fait-elle avec le sol ? (arrondi au dixième de degré)',ask:'l\'angle α (arrondi au dixième)',placeholder:'cos α = ... / ...\nα = ...',
      work:['cos α = '+NF(pied)+' / '+L,'α = cos⁻¹('+NF(pied)+'/'+L+') ≈ '+NF(ans)+'°'],
      steps:[stp('Rapport','L\'échelle est l\'hypoténuse ('+L+' m), la distance au mur est le côté adjacent à α ('+NF(pied)+' m) : cosinus.',M('cos α = '+NF(pied)+' / '+L)),stp('Angle',M('α = cos⁻¹('+NF(pied)+'/'+L+') ≈ '+NF(ans)+'°'))],
      hints:['Adjacent et hypoténuse connus : cosinus.'],
      mistakes:[{v:90-v,tag:'geo-trig-inverse',msg:'Tu as trouvé l\'angle avec le mur. L\'angle α est celui avec le sol.',w:['90° − '+NF(ans)+'° = '+NF(R1d(90-v))+'°']},{v:Math.asin(pied/L)/D2R,tag:'geo-trig-rapport',msg:'Le sinus relie opposé et hypoténuse. Ici, la distance au mur est le côté adjacent : cosinus.',w:['α = sin⁻¹('+NF(pied)+'/'+L+')']}].filter(m=>R1d(m.v)!==ans)});
  }
  const pc=pick([5,6,8,10,12,15]), v=Math.atan(pc/100)/D2R, ans=R1d(v);
  return mkGeo({svg:tri({opp:pc,adj:100,hyp:null},Math.max(20,Math.min(60,v*3)),'α','Pente de '+pc+' %'),mode:'round',d:1,val:v,unit:'°',pow:1,
    text:'Une route a une pente de «'+pc+' %» : elle monte de «'+pc+'» m pour «100» m parcourus horizontalement. Quel angle α fait-elle avec l\'horizontale ? (arrondi au dixième de degré)',ask:'l\'angle α (arrondi au dixième)',placeholder:'tan α = ... / ...\nα = ...',
    work:['tan α = '+pc+' / 100 = '+NF(pc/100),'α = tan⁻¹('+NF(pc/100)+') ≈ '+NF(ans)+'°'],
    steps:[stp('Rapport','Le dénivelé est le côté opposé ('+pc+' m), la distance horizontale est le côté adjacent (100 m) : tangente.',M('tan α = '+pc+' / 100 = '+NF(pc/100))),stp('Angle',M('α = tan⁻¹('+NF(pc/100)+') ≈ '+NF(ans)+'°'))],
    hints:['Une pente de p % signifie tan α = p / 100.'],
    mistakes:[{v:pc,tag:'geo-trig-inverse',msg:'Une pente de '+pc+' % ne correspond pas à '+pc+'° : il faut passer par tan α = '+NF(pc/100)+' puis tan⁻¹.',w:['α = '+pc+'°']},{v:Math.asin(pc/100)/D2R,tag:'geo-trig-rapport',msg:'Les 100 m sont mesurés à l\'horizontale (côté adjacent, pas l\'hypoténuse) : tangente.',w:['α = sin⁻¹('+NF(pc/100)+')']}].filter(m=>R1d(m.v)!==ans)});
}

/* ----- gr-6 : deux visées (hauteur d'une tour) ----- */
function genTrig6(){
  const al=pick([20,25,30,35]), be=pick([45,50,55,60]), d=rnd(10,60), u='m';
  const ta=TR.tan(al), tb=TR.tan(be), x=d*ta/(tb-ta), h=x*tb, ans=R1d(h);
  const svg=figure([[-0.3,0],[x+d+1,h+0.3]],f=>{
    const F=f([0,0]), T=f([0,h]), B=f([x,0]), A=f([x+d,0]), ce=f([(x+d)/2,h/3]); let out=g.seg(F,A,'g-l')+g.seg(F,T,'g-l')+g.seg(T,B,'g-l')+g.seg(T,A,'g-l')+g.right(F,T,B,10)+g.dot(A)+g.dot(B)+g.dot(T)+g.dot(F);
    const arc=(P,lab)=>{ const r=24, u1=[-1,0], u2=vunit(vsub(T,P)), a1=vadd(P,vmul(u1,r)), a2=vadd(P,vmul(u2,r)), bs=vunit(vadd(u1,u2)), am=vadd(P,vmul(bs,r)); return '<path class="g-mark" d="M'+gf(a1[0])+' '+gf(a1[1])+arcM(a1,a2,am,r)+'"/>'+g.text(vadd(P,vmul(bs,r+22)),lab,'g-u'); };
    out+=arc(B,be+'°')+arc(A,al+'°');
    out+=g.dim(B,A,String(d),ce,18)+g.text(vadd(vmid(F,T),[-12,0]),'h','g-u','end');
    return out;
  },'Tour vue de deux points alignés avec son pied',{H:240,pad:36});
  const wr=[{v:d*tb,tag:'geo-decomp',msg:'La distance d n\'est pas la distance au pied de la tour : x (inconnu) est la distance entre B et le pied.',w:['h = '+d+' × tan '+be+'°']},{v:d*ta,tag:'geo-decomp',msg:'La distance entre A et le pied est x + d, pas d.',w:['h = '+d+' × tan '+al+'°']},{v:d*(tb-ta),tag:'geo-decomp',msg:'Il faut résoudre un système : h = x tan β et h = (x + d) tan α.',w:['h = '+d+' × (tan '+be+'° − tan '+al+'°)']},{v:d/(tb-ta),tag:'geo-decomp',msg:'x = d tan α / (tan β − tan α), puis h = x tan β.',w:['h = '+d+' / (tan '+be+'° − tan '+al+'°)']}].filter(m=>R1d(m.v)!==ans);
  return mkGeo({svg,mode:'round',d:1,val:h,unit:u,pow:1,
    text:'Une tour est vue depuis deux points A et B alignés avec son pied, sur un sol horizontal. Depuis A, le sommet est vu sous un angle de «'+al+'°» et depuis B, plus proche de la tour, sous un angle de «'+be+'°». On a «AB = '+d+'» m. Calcule la <b>hauteur</b> h de la tour, arrondie au dixième de mètre.',ask:'la hauteur h (arrondie au dixième)',placeholder:'x = distance de B au pied\nh = x × tan β\nh = (x + d) × tan α',
    work:['h = x × tan '+be+'°','h = (x + '+d+') × tan '+al+'°','x tan '+be+'° = (x + '+d+') tan '+al+'°','x = '+d+' × tan '+al+'° / (tan '+be+'° − tan '+al+'°) ≈ '+NF(R1d(x)),'h = x × tan '+be+'° ≈ '+NF(ans)+' m'],
    steps:[stp('Deux triangles rectangles','Notons x la distance de B au pied de la tour. Dans les deux triangles rectangles (côté opposé h, côté adjacent connu en fonction de x) :',M('h = x × tan '+be+'°')+' et '+M('h = (x + '+d+') × tan '+al+'°')),stp('Équation en x',M('x tan '+be+'° = (x + '+d+') tan '+al+'°')+', donc '+M('x (tan '+be+'° − tan '+al+'°) = '+d+' tan '+al+'°')+', '+M('x ≈ '+NF(R1d(x)))+' m.'),stp('Hauteur',M('h = x × tan '+be+'° ≈ '+NF(ans))+' m')],
    hints:['Pose x = distance de B au pied de la tour. Écris tan β et tan α avec h et x.','Égale les deux expressions de h pour trouver x, puis calcule h.'],
    mistakes:wr});
}
TOPICS['gr-1']={kind:'gtrig',level:1,label:'Sinus, cosinus, tangente (fractions)',gen:genTrig1};
TOPICS['gr-2']={kind:'gtrig',level:2,label:'Calculer une longueur',gen:genTrig2};
TOPICS['gr-3']={kind:'gtrig',level:3,label:'Calculer un angle',gen:genTrig3};
TOPICS['gr-4']={kind:'gtrig',level:4,label:'Valeurs exactes (30°, 45°, 60°)',gen:genTrig4};
TOPICS['gr-5']={kind:'gtrig',level:5,label:'Problèmes (pente, pointe, échelle)',gen:genTrig5};
TOPICS['gr-6']={kind:'gtrig',level:6,label:'Hauteur par deux visées',gen:genTrig6};
