'use strict';
/* ===== Correction de la géométrie ===== */
Object.assign(TAGS,{
  'geo-demi':{label:'Facteur ½ oublié ou en trop',tip:'Triangle : (base × hauteur) ÷ 2. Trapèze : (B + b) × h ÷ 2. Losange : (D × d) ÷ 2. Parallélogramme et rectangle : pas de division par 2.'},
  'geo-formule':{label:'Mauvaise formule',tip:'Une aire est un produit de longueurs (unité au carré). Une somme de longueurs donne un périmètre.'},
  'geo-perim-aire':{label:'Aire et périmètre confondus',tip:'Le périmètre est la longueur du contour (somme des côtés, en cm). L\'aire mesure la surface (produit de longueurs, en cm²).'},
  'geo-perim-cote':{label:'Côté oublié ou en trop dans le périmètre',tip:'Le périmètre est la longueur du contour : compte chaque côté du contour une fois, sans les segments intérieurs (diagonales, segment commun à deux figures).'},
  'geo-hauteur':{label:'Hauteur mal choisie',tip:'La hauteur est perpendiculaire à la base (segment en pointillés). Un côté oblique n\'est pas une hauteur.'},
  'geo-decomp':{label:'Figure mal découpée',tip:'Découpe la figure en figures simples : additionne les aires si on assemble, soustrais si on retire une partie. Vérifie chaque dimension utilisée.'},
  'geo-pyth-somme':{label:'Longueurs additionnées au lieu de carrés',tip:'Pythagore : a² + b² = c². On travaille avec les carrés des longueurs, puis on prend la racine carrée : c ≠ a + b.'},
  'geo-pyth-cote':{label:'Hypoténuse et côtés confondus',tip:'L\'hypoténuse est le côté opposé à l\'angle droit, et le plus long. On additionne les carrés pour la trouver, on les soustrait pour trouver un autre côté.'},
  'geo-racine':{label:'Racine carrée oubliée',tip:'Après avoir calculé un carré (c² = 25), il faut prendre la racine carrée pour obtenir la longueur (c = 5).'},
  'geo-reciproque':{label:'Réciproque mal appliquée',tip:'Pythagore : compare le carré du plus grand côté avec la somme des carrés des deux autres. Thalès : compare les rapports. Égalité : rectangle ou parallèles ; sinon non.'},
  'geo-thales-inverse':{label:'Rapport de Thalès inversé',tip:'Écris les rapports dans le même sens : AM/AB = AN/AC = MN/BC (petit sur grand). Le résultat doit rester plus petit (ou plus grand) comme sa figure.'},
  'geo-thales-additif':{label:'Raisonnement additif au lieu de proportionnel',tip:'Thalès met des rapports en égalité : on multiplie ou divise, on n\'ajoute et ne soustrait pas la même longueur.'},
  'geo-thales-segment':{label:'Segment partiel confondu avec le côté entier',tip:'AB = AM + MB est le côté entier. Le rapport de Thalès utilise AM/AB, pas AM/MB.'},
  'geo-angle-centre':{label:'Angle au centre et angle inscrit',tip:'L\'angle au centre mesure le double de l\'angle inscrit qui intercepte le même arc. Deux angles inscrits sur le même arc sont égaux.'},
  'geo-supp':{label:'Somme d\'angles mal utilisée',tip:'Triangle : 180°. Triangle rectangle : les deux angles aigus totalisent 90°. Quadrilatère inscrit : angles opposés 180°. Angle droit : 90°.'},
  'geo-rayon':{label:'Rayon et diamètre confondus',tip:'Le rayon est la moitié du diamètre : r = d ÷ 2. Les formules πr² et 2πr utilisent le rayon.'},
  'geo-aire-pi':{label:'Formules du disque confondues',tip:'Périmètre du cercle : 2πr (ou πd). Aire du disque : πr² (r au carré). Ce sont deux formules différentes.'},
  'geo-exact':{label:'Valeur exacte demandée',tip:'Garde π ou la racine carrée dans la réponse (par exemple 9π ou 5√2) : une valeur décimale est arrondie, donc approchée.'},
  'geo-arrondi':{label:'Arrondi',tip:'Arrondir au dixième : une décimale, en regardant le chiffre suivant (5 ou plus : on augmente). Écris le signe ≈ pour une valeur arrondie.'},
  'geo-unite':{label:'Unité incorrecte',tip:'Une longueur s\'exprime en cm, une aire en cm², un angle en degrés. Si tu écris l\'unité, elle doit correspondre à la grandeur.'},
  'geo-calcul':{label:'Erreur de calcul',tip:'Refais chaque opération séparément, ligne par ligne, puis contrôle avec une estimation de l\'ordre de grandeur.'},
  'geo-angle-somme':{label:'Somme des angles mal utilisée',tip:'Dans un triangle, la somme des angles vaut 180°. Deux angles opposés par le sommet sont égaux. Deux droites parallèles coupées par une sécante donnent des angles égaux (correspondants, alternes-internes) ou supplémentaires (somme 180°).'},
  'geo-unite-angle':{label:'Conversion d\'unités d\'angle',tip:'Un tour = 360° = 400 grades = 2π radians. Pour convertir : passe par la fraction de tour, puis multiplie par la nouvelle unité.'},
  'geo-litteral':{label:'Expression littérale à revoir',tip:'Écris le résultat sous la forme x = (expression avec la lettre donnée). Développe ou simplifie, puis vérifie avec une valeur numérique de ton choix.'},
  'geo-methode':{label:'Méthode à revoir',tip:'Identifie le théorème ou la formule, écris-la avec les noms des points, remplace par les valeurs, puis calcule.'}
});
const GU_POW=s=>s; 
const GU_PHYS={w:'W',kw:'kW',j:'J',kj:'kJ',mj:'MJ','°c':'°C',l:'L',ml:'mL',bar:'bar',mbar:'mbar',hpa:'hPa',pa:'Pa',k:'K',kwh:'kWh',wh:'Wh'};
function geoNorm(s){
  return String(s).replace(/[−–—]/g,'-').replace(/[×·⋅∙]/g,'*').replace(/÷/g,'/').replace(/²/g,'^2').replace(/³/g,'^3')
    .replace(/sqrt|racine|rac/gi,'√').replace(/(^|[^a-zA-Z])pi(?![a-zA-Z])/gi,'$1π').replace(/(\d)\s*[x]\s*(?=\d)/g,'$1*').replace(/(\d),(\d)/g,'$1.$2').replace(/[  ]/g,' ');
}
function geoUnit(seg){
  let s=geoNorm(seg).trim(), unit='', pow=0, deg=false;
  const dm=s.match(/^(.*?)\s*(?:°|degr[ée]s?|deg)\s*$/i); if(dm){ s=dm[1]; deg=true; }
  const um=s.match(/^(.*?[\d)π])\s*(mm|cm|dm|km|ml|m|kwh|wh|kw|w|kj|mj|j|°c|l|mbar|bar|hpa|pa|k)\s*(\^\s*([23]))?\s*$/i);
  if(um){ s=um[1]; unit=GU_PHYS[um[2].toLowerCase()]||um[2].toLowerCase(); pow=um[3]?+um[4]:1; }
  return {core:s.trim(),unit,pow,deg};
}
const isNumCore=c=>/^[0-9+\-*/^().π√\s]+$/.test(c)&&/[0-9π]/.test(c);
function geoEval(core){
  const t=[]; let i=0; const s=core;
  while(i<s.length){
    const c=s[i];
    if(/\s/.test(c)){ i++; continue; }
    if(/[0-9.]/.test(c)){ let j=i; while(j<s.length&&/[0-9.]/.test(s[j])) j++; const w=s.slice(i,j); if((w.match(/\./g)||[]).length>1||w==='.') throw new ParseError('Le nombre « '+w+' » est mal écrit.'); t.push({k:'n',v:parseFloat(w)}); i=j; continue; }
    if('+-*/^()π√'.includes(c)){ t.push({k:c}); i++; continue; }
    throw new ParseError('Caractère non reconnu : « '+c+' ».');
  }
  let p=0; const peek=()=>t[p]?t[p].k:null;
  const add=(x,y)=>({a:x.a+y.a,b:x.b+y.b}), neg=x=>({a:-x.a,b:-x.b});
  const mul=(x,y)=>{ if(x.b&&y.b) throw new ParseError('π × π n\'est pas utilisé ici : vérifie ton calcul.'); return {a:x.a*y.a,b:x.a*y.b+x.b*y.a}; };
  const div=(x,y)=>{ if(y.b) throw new ParseError('Pas de π au dénominateur ici.'); if(y.a===0) throw new ParseError('Division par zéro.'); return {a:x.a/y.a,b:x.b/y.a}; };
  function expr(){ let v=term(); while(peek()==='+'||peek()==='-'){ const o=t[p++].k; const r=term(); v=o==='+'?add(v,r):add(v,neg(r)); } return v; }
  function term(){ let v=unary(); for(;;){ const k=peek();
      if(k==='*'){ p++; v=mul(v,unary()); }
      else if(k==='/'){ p++; v=div(v,unary()); }
      else if(k==='π'||k==='√'||k==='('){ v=mul(v,unary()); }
      else if(k==='n'){ throw new ParseError('Il manque un signe d\'opération entre deux nombres.'); }
      else break; }
    return v; }
  function unary(){ if(peek()==='-'){ p++; return neg(unary()); } if(peek()==='+'){ p++; return unary(); } return power(); }
  function power(){ let b=atom(); if(peek()==='^'){ p++; let sg=1; if(peek()==='-'){ p++; sg=-1; } if(peek()!=='n') throw new ParseError('Après ^, écris un exposant entier.'); const e=sg*t[p++].v; if(!Number.isInteger(e)) throw new ParseError('Exposant entier attendu.'); if(b.b&&e!==1) throw new ParseError('π élevé à une puissance n\'est pas utilisé ici.'); if(e<0&&b.a===0) throw new ParseError('Division par zéro.'); b={a:Math.pow(b.a,e),b:e===1?b.b:0}; } return b; }
  function atom(){
    const k=peek();
    if(k==='n'){ return {a:t[p++].v,b:0}; }
    if(k==='π'){ p++; return {a:0,b:1}; }
    if(k==='√'){ p++; const x=(peek()==='(')?atom():((peek()==='n')?{a:t[p++].v,b:0}:null); if(!x) throw new ParseError('Écris ce qui est sous la racine, par exemple √25 ou √(9 + 16).'); if(x.b) throw new ParseError('Une racine de π n\'est pas utilisée ici.'); if(x.a<0) throw new ParseError('La racine carrée d\'un nombre négatif n\'existe pas.'); return {a:Math.sqrt(x.a),b:0}; }
    if(k==='('){ p++; const v=expr(); if(peek()!==')') throw new ParseError('Il manque une parenthèse fermante.'); p++; return v; }
    if(k===null) throw new ParseError('L\'expression est incomplète.');
    throw new ParseError('Écriture inattendue : « '+k+' ».');
  }
  const v=expr(); if(p<t.length) throw new ParseError(t[p].k===')'?'Parenthèse fermante en trop.':'Écriture inattendue dans l\'expression.');
  return v;
}
/* découpe une ligne en segments séparés par = ou ≈ */
function geoSegs(line){
  const parts=line.split(/(=|≈|≃)/), segs=[];
  for(let i=0;i<parts.length;i+=2){
    const raw=parts[i], sep=i>0?parts[i-1]:null, u=geoUnit(raw);
    const num=isNumCore(u.core);
    segs.push({raw:raw.trim(),sep,u,num,val:null});
  }
  return segs;
}
const gEqPair=(x,y,tol)=>Math.abs(x.a-y.a)<=(tol==null?1e-9*(1+Math.abs(x.a)+Math.abs(y.a)):tol)&&Math.abs(x.b-y.b)<=1e-9;
const gPv=v=>v.a+v.b*Math.PI;
const gN=x=>NF(Math.round(x*1e6)/1e6);
const gShow=v=>{ const bs=(Math.abs(v.b)===1?'':gN(Math.abs(v.b)))+'π'; if(!v.b) return gN(v.a); if(!v.a) return (v.b<0?'−':'')+bs; return gN(v.a)+(v.b<0?' − ':' + ')+bs; };
function decimalsOf(raw){ const m=String(raw).replace(',','.').match(/\.(\d+)/); return m?m[1].length:0; }

/* ---------- expressions littérales (mode fn) ---------- */
function fnEval(str,names,env){
  const src=geoNorm(str).replace(/°/g,'');
  const t=[]; let i=0;
  while(i<src.length){
    const c=src[i];
    if(/\s/.test(c)){ i++; continue; }
    if(/[0-9.]/.test(c)){ let j=i; while(j<src.length&&/[0-9.]/.test(src[j])) j++; const w=src.slice(i,j); if((w.match(/\./g)||[]).length>1||w==='.') throw new ParseError('Le nombre « '+w+' » est mal écrit.'); t.push({k:'n',v:parseFloat(w)}); i=j; continue; }
    if('+-*/^()π√'.includes(c)){ t.push({k:c}); i++; continue; }
    if(/[A-Za-zΑ-Ωα-ω]/.test(c)){ if(!names.includes(c)) throw new ParseError('La lettre « '+c+' » n\'est pas dans cet exercice : utilise '+names.join(', ')+'.'); t.push({k:'v',v:c}); i++; continue; }
    throw new ParseError('Caractère non reconnu : « '+c+' ».');
  }
  if(!t.length) throw new ParseError('Écris ton expression.');
  let p=0; const peek=()=>t[p]?t[p].k:null;
  const starts=k=>k==='n'||k==='v'||k==='π'||k==='√'||k==='(';
  function expr(){ let v=term(); while(peek()==='+'||peek()==='-'){ const o=t[p++].k; const r=term(); v=o==='+'?v+r:v-r; } return v; }
  function term(){ let v=unary(); for(;;){ const k=peek(); if(k==='*'){ p++; v*=unary(); } else if(k==='/'){ p++; v/=unary(); } else if(starts(k)){ v*=power(); } else break; } return v; }
  function unary(){ if(peek()==='-'){ p++; return -unary(); } if(peek()==='+'){ p++; return unary(); } return power(); }
  function power(){ let b=atom(); if(peek()==='^'){ p++; let sg=1; if(peek()==='-'){ p++; sg=-1; } if(peek()!=='n') throw new ParseError('Après ^, écris un exposant entier.'); b=Math.pow(b,sg*t[p++].v); } return b; }
  function atom(){
    const k=peek();
    if(k==='n') return t[p++].v;
    if(k==='v') return env[t[p++].v];
    if(k==='π'){ p++; return Math.PI; }
    if(k==='√'){ p++; const k2=peek(); let x; if(k2==='(') x=atom(); else if(k2==='n') x=t[p++].v; else if(k2==='v') x=env[t[p++].v]; else throw new ParseError('Écris ce qui est sous la racine, par exemple √3 ou √(2n + 1).'); if(x<0) throw new ParseError('La racine carrée d\'un nombre négatif n\'existe pas ici.'); return Math.sqrt(x); }
    if(k==='('){ p++; const v=expr(); if(peek()!==')') throw new ParseError('Il manque une parenthèse fermante.'); p++; return v; }
    if(k===null) throw new ParseError('L\'expression est incomplète.');
    throw new ParseError('Écriture inattendue : « '+k+' ».');
  }
  const v=expr(); if(p<t.length) throw new ParseError(t[p].k===')'?'Parenthèse fermante en trop.':'Écriture inattendue dans l\'expression.');
  return v;
}
const FN_PTS=[[0.7,1.9,2.3],[3.1,2.3,0.9],[5.3,7.1,4.4],[9.6,1.3,6.2]];
function fnEnv(names,k){ const e={}; names.forEach((n,i)=>{ e[n]=FN_PTS[k][i%3]; }); return e; }
function fnSame(a,b,names){ for(let k=0;k<FN_PTS.length;k++){ const e=fnEnv(names,k); let x,y; try{ x=fnEval(a,names,e); y=fnEval(b,names,e); }catch(err){ return false; } if(!isFinite(x)||!isFinite(y)||Math.abs(x-y)>1e-7*(1+Math.abs(x)+Math.abs(y))) return false; } return true; }
function checkFn(ex,lines){
  const G=ex.geo, F=G.fn, names=F.vars;
  const syn=(msg)=>({status:'syntax',title:'Écriture à corriger',html:'<p>'+esc(msg)+'</p>',tag:null});
  const last=lines[lines.length-1];
  const parts=last.split(/=|≈|≃/).map(z=>z.trim());
  if(parts.length>=2 && parts[parts.length-2] && parts[0]!==F.lhs && parts.length===2) return syn('Ta réponse finale doit avoir la forme « '+F.lhs+' = … » (le membre de gauche est '+F.lhs+').');
  const rhs=parts[parts.length-1];
  if(!rhs) return syn('Termine par « '+F.lhs+' = » suivi de l\'expression.');
  try{ fnEval(rhs,names,fnEnv(names,0)); }catch(e){ if(e instanceof ParseError) return syn(e.message); throw e; }
  const ref=F.exact;
  if(fnSame(rhs,ref,names)) return {status:'ok',steps:lines.length};
  const cand=ex.mistakes.find(m=>m.s!==undefined&&fnSame(rhs,m.s,names));
  if(cand) return {status:'wrong',tag:cand.tag,title:'Ce résultat vient d\'une erreur classique',html:'<p>'+cand.msg+'</p>'};
  if(/[0-9]+[.,][0-9]+/.test(rhs)&&/[√π]/.test(ref)) return {status:'wrong',tag:'geo-exact',title:'Valeur exacte demandée',html:'<p>Garde les racines et π sous forme exacte au lieu de valeurs décimales arrondies.</p>'};
  return {status:'wrong',tag:'geo-litteral',title:'Ce n\'est pas l\'expression attendue',html:'<p>Teste ta formule avec une valeur simple (par exemple '+names[0]+' = 2) et compare avec la situation de la figure. Reprends le raisonnement étape par étape ; un indice est disponible.</p>'};
}
function parseChoice(line){
  const s=String(line).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z' ]/g,' ');
  if(/\b(non|faux|pas rectangle|n'est pas|ne sont pas|pas paralleles?|ne l'est pas)\b/.test(s)) return 'non';
  if(/\b(oui|vrai|est rectangle|sont paralleles?|rectangle|paralleles?)\b/.test(s)) return 'oui';
  return null;
}
function checkGeoWork(ex,input){
  const G=ex.geo, lines=input.split('\n').map(s=>s.trim()).filter(Boolean);
  const syn=(msg,extra)=>({status:'syntax',title:'Écriture à corriger',html:'<p>'+esc(msg)+'</p>'+(extra||''),tag:null});
  if(!lines.length) return syn('Écris ta réponse dans la zone de saisie.');
  if(G.mode==='fn') return checkFn(ex,lines);
  const parsed=[];
  for(let li=0;li<lines.length;li++){
    const segs=geoSegs(lines[li]);
    try{ segs.forEach(sg=>{ if(sg.num) sg.val=geoEval(sg.u.core); }); }
    catch(e){ if(e instanceof ParseError) return syn((lines.length>1?'Ligne '+(li+1)+' : ':'')+e.message); throw e; }
    parsed.push(segs);
  }
  /* cohérence des égalités de chaque ligne */
  for(let li=0;li<parsed.length;li++){
    const sg=parsed[li];
    for(let i=1;i<sg.length;i++){
      const a=sg[i-1], b=sg[i]; if(!a.num||!b.num) continue;
      const approx=b.sep!=='=';
      const dec=decimalsOf(b.raw), tol=0.5*Math.pow(10,-dec)+1e-9;
      const ok=approx?Math.abs(gPv(a.val)-gPv(b.val))<=Math.max(tol,1e-9):gEqPair(a.val,b.val);
      if(!ok){
        const close=Math.abs(gPv(a.val)-gPv(b.val))<=0.02*Math.max(1,Math.abs(gPv(a.val)));
        const where=lines.length>1?'la ligne <b>'+(li+1)+'</b>':'ta ligne';
        const detail='<ul class="terms"><li class="ok"><span class="mk" aria-hidden="true">·</span><span>'+M(a.u.core)+' vaut <b>'+gShow(a.val)+(approx?'':'')+'</b></span></li><li class="ko"><span class="mk" aria-hidden="true">✗</span><span>'+M(b.u.core)+' vaut <b>'+gShow(b.val)+'</b></span></li></ul>';
        if(!approx&&close&&(Math.abs(a.val.b)>0||Math.abs(b.val.b)>0||dec>0||/√/.test(a.u.core+b.u.core))){
          return {status:'wrong',tag:'geo-arrondi',title:'Égalité exacte ou valeur approchée ?',html:'<p>Dans '+where+', les deux membres sont proches mais pas égaux : l\'un est une valeur arrondie. Écris le signe <b>≈</b> à la place de <b>=</b> quand tu arrondis.</p>'+detail};
        }
        return {status:'wrong',tag:'geo-calcul',title:(lines.length>1?'Ligne '+(li+1)+' : ':'')+'l\'égalité est fausse',html:'<p>Dans '+where+', les deux membres ne sont pas égaux. Refais ce calcul.</p>'+detail};
      }
    }
  }
  /* réponse finale */
  const last=lines[lines.length-1];
  if(G.mode==='choice'){
    const c=parseChoice(last);
    if(!c) return syn('Termine par ta conclusion : oui ou non.');
    if(c===G.choice) return {status:'ok',steps:lines.length};
    return {status:'wrong',tag:'geo-reciproque',title:'Ce n\'est pas la bonne conclusion',html:'<p>Refais la comparaison avec précision : calcule les deux quantités à comparer, puis conclus <b>uniquement</b> si elles sont exactement égales. Utilise un indice si tu bloques.</p>'};
  }
  const lsegs=parsed[parsed.length-1], fin=lsegs[lsegs.length-1];
  if(!fin.num) return syn('Termine par une ligne dont la dernière valeur est le résultat demandé (un nombre), par exemple A = 17,5.');
  const u=fin.val, usr=fin.u;
  /* unité */
  const okUnit=(()=>{
    if(G.unit==='°'){ return !usr.unit; }
    if(usr.deg) return false;
    if(!usr.unit) return true;
    return usr.unit===G.unit&&usr.pow===(G.pow===2||G.pow===3?G.pow:1);
  })();
  const SUP=p=>p===3?'³':(p===2?'²':''), NOUN=p=>p===3?'volume':(p===2?'aire':'longueur');
  const unitMsg=()=>{ if(G.unit==='°') return 'Un angle se mesure en degrés (°), pas en '+usr.unit+'.'; if(usr.deg) return 'Cette grandeur est un'+(G.pow===2?'e':'')+' '+NOUN(G.pow)+' en '+G.unit+SUP(G.pow)+', pas un angle.'; if(usr.unit!==G.unit) return 'L\'énoncé est en '+G.unit+' : ton résultat doit être en '+G.unit+SUP(G.pow)+', pas en '+usr.unit+SUP(usr.pow)+'.'; return G.pow>=2?'Un'+(G.pow===2?'e':'')+' <b>'+NOUN(G.pow)+'</b> s\'exprime en '+G.unit+SUP(G.pow)+(G.pow===2?' (unité au carré)':' (unité au cube)')+', pas en '+G.unit+SUP(usr.pow)+'.':'Une <b>longueur</b> s\'exprime en '+G.unit+', pas en '+G.unit+SUP(usr.pow)+'.'; };
  const val=G.val, vnum=gPv(val);
  let good=false, near=null;
  if(G.mode==='num'){ good=Math.abs(u.b)<1e-9&&Math.abs(u.a-val.a)<=1e-6*Math.max(1,Math.abs(val.a)); }
  else if(G.mode==='pi'){ good=Math.abs(u.a-val.a)<=1e-6*Math.max(1,Math.abs(val.a))&&Math.abs(u.b-val.b)<=1e-6*Math.max(1,Math.abs(val.b)); if(!good&&Math.abs(u.b)<1e-9&&Math.abs(u.a-vnum)<=0.01*Math.max(1,Math.abs(vnum))) near='exact'; }
  else if(G.mode==='sqrt'){ good=Math.abs(u.b)<1e-9&&Math.abs(u.a-vnum)<=1e-8*Math.max(1,vnum); if(!good&&Math.abs(u.b)<1e-9&&Math.abs(u.a-vnum)<=0.02*Math.max(1,vnum)) near='exact'; }
  else if(G.mode==='round'){ const r=Math.round(vnum*Math.pow(10,G.d))/Math.pow(10,G.d);
    good=Math.abs(u.b)<1e-9&&Math.abs(u.a-r)<1e-9;
    if(!good&&Math.abs(u.b)<1e-9){ const dd=decimalsOf(fin.raw);
      if(Math.abs(u.a-vnum)<=1e-6*Math.max(1,vnum)&&dd<=G.d+1) near='unrounded';
      else if(dd>G.d&&Math.abs(u.a-Math.round(vnum*Math.pow(10,dd))/Math.pow(10,dd))<1e-9) near='toofine';
      else if(Math.abs(u.a-vnum)<=Math.pow(10,-G.d)) near='badround'; } }
  const stepsN=lines.length;
  if(good){
    if(!okUnit) return {status:'wrong',tag:'geo-unite',title:'Bonne valeur, unité à corriger',html:'<p>'+unitMsg()+'</p>'};
    return {status:'ok',steps:stepsN};
  }
  if(near==='exact') return {status:'wrong',tag:'geo-exact',title:'Valeur exacte demandée',html:'<p>Ta valeur est proche, mais l\'énoncé demande la <b>valeur exacte</b> : garde '+(G.mode==='pi'?'π':'la racine carrée')+' dans ta réponse au lieu d\'un nombre décimal arrondi.</p>'};
  if(near==='unrounded') return {status:'wrong',tag:'geo-arrondi',title:'Il faut arrondir',html:'<p>Ton calcul est juste, mais la valeur n\'est pas arrondie comme demandé : arrondis au '+(G.d===1?'dixième (une décimale)':G.d===2?'centième (deux décimales)':'rang demandé')+' et écris le signe ≈.</p>'};
  if(near==='toofine') return {status:'wrong',tag:'geo-arrondi',title:'Mauvais rang d\'arrondi',html:'<p>Tu as gardé trop de décimales : l\'énoncé demande un arrondi au '+(G.d===1?'dixième (une décimale)':G.d===2?'centième (deux décimales)':'rang indiqué')+'.</p>'};
  if(near==='badround') return {status:'wrong',tag:'geo-arrondi',title:'Vérifie ton arrondi',html:'<p>Ta valeur est très proche du résultat, mais l\'arrondi n\'est pas correct : regarde le chiffre qui suit le rang demandé (5 ou plus : on arrondit au-dessus, sinon on garde).</p>'};
  /* mistakes connues */
  const tolFor=m=>G.mode==='round'?0.5*Math.pow(10,-G.d)+1e-9:1e-6*Math.max(1,Math.abs(m.a));
  const cand=ex.mistakes.find(m=>gEqPair(u,m.v,tolFor(m.v))||(G.mode==='round'&&Math.abs(u.b)<1e-9&&m.v.b===0&&Math.abs(u.a-Math.round(m.v.a*Math.pow(10,G.d))/Math.pow(10,G.d))<1e-9));
  if(cand) return {status:'wrong',tag:cand.tag,title:'Ce résultat vient d\'une erreur classique',html:'<p>'+cand.msg+'</p>'};
  const sn=(G.sanity||[]).find(s=>{ try{ return s.when(u.a); }catch(e){ return false; } });
  if(sn) return {status:'wrong',tag:sn.tag||'geo-methode',title:'Ce résultat est impossible',html:'<p>'+sn.msg+'</p>'};
  if(G.mode==='num'&&Math.abs(u.b)>1e-9) return {status:'wrong',tag:'geo-aire-pi',title:'π ne devrait pas apparaître',html:'<p>Dans cet exercice, aucune formule de cercle n\'intervient : le résultat est un nombre sans π.</p>'};
  if((G.mode==='pi')&&Math.abs(u.b)<1e-9) return {status:'wrong',tag:'geo-exact',title:'π manque dans ta réponse',html:'<p>Cette figure contient un arc ou un disque : le résultat exact contient π (par exemple 8 + 3π). Reprends les formules du disque.</p>'};
  const big=u.a>vnum*1.5?'Ton résultat est nettement trop grand : vérifie que tu n\'ajoutes pas une figure en trop ou que tu n\'oublies pas une division par 2.':(u.a<vnum/1.5?'Ton résultat est nettement trop petit : vérifie qu\'il ne manque pas une partie de la figure ou un côté.':'Ton résultat est proche de la bonne valeur : vérifie tes calculs (signes, produit, division).');
  return {status:'wrong',tag:'geo-methode',title:'Ce n\'est pas la valeur attendue',html:'<p>'+big+'</p><p>Reprends la formule ou le théorème avec les noms des points, remplace par les valeurs, puis calcule ligne par ligne.</p>'};
}
function previewGeo(line){
  const parts=line.split(/(=|≈|≃)/); let out='';
  for(let i=0;i<parts.length;i++){
    if(i%2===1){ out+=' '+parts[i]+' '; continue; }
    const u=geoUnit(parts[i]);
    if(isNumCore(u.core)) geoEval(u.core);
    const shown=parts[i].trim();
    if(!shown) continue;
    const core=u.core.replace(/√/g,'√').replace(/\^2/g,'²').replace(/\^3/g,'³');
    const uni=u.deg?'°':(u.unit?' '+u.unit+(u.pow===2?'²':u.pow===3?'³':''):'');
    out+=M(isNumCore(u.core)?u.core.replace(/\s+/g,' '):shown.replace(/\s+/g,' '))+(isNumCore(u.core)||u.unit||u.deg?esc(uni):'');
  }
  return out;
}
