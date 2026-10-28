'use strict';
/* ===== Correction : diagnostic des réponses ===== */
function numericTest(a,b,label){
  const vs=varsOfPoly(padd(a,b)); if(!vs.length) vs.push('x');
  for(const vals of [[2,3,5,7],[3,2,4,5],[1,4,2,3],[5,3,2,4]]){
    const env={}; vs.forEach((v,i)=>{ env[v]=vals[i]; });
    const va=evalPoly(a,env), vb=evalPoly(b,env);
    if(va!==vb){
      const at=vs.map(v=>M(v+' = '+env[v])).join(', ');
      return '<p class="test"><b>Test rapide</b> avec '+at+' : '+label+' vaut <b>'+va+'</b>, l\'énoncé vaut <b>'+vb+'</b>. Deux expressions égales donnent toujours le même nombre : elles ne sont donc pas égales.</p>';
    }
  }
  return '';
}
function termTable(user,exp){
  const keys=[...new Set([...Object.keys(user),...Object.keys(exp)])].sort(cmpKeys);
  const rows=keys.map(k=>{
    const ok=user[k]===exp[k];
    const name=k===''?'Terme constant':'Terme en '+M(monoStr(expsOf(k)));
    let note=ok?'correct':(user[k]===undefined?'absent de ta réponse':(exp[k]===undefined?'en trop':'à revoir'));
    return '<li class="'+(ok?'ok':'ko')+'"><span class="mk" aria-hidden="true">'+(ok?'✓':'✗')+'</span><span>'+name+' : '+note+'</span></li>';
  });
  return '<ul class="terms">'+rows.join('')+'</ul>';
}
function termTip(user,exp){
  const keys=[...new Set([...Object.keys(user),...Object.keys(exp)])];
  const bad=keys.filter(k=>user[k]!==exp[k]);
  if(!bad.length) return '';
  const top=Object.keys(exp).sort(cmpKeys)[0];
  if(bad.some(k=>user[k]===undefined)) return 'Il manque au moins un terme : compte les produits avant de réduire.';
  if(bad.length===1 && bad[0]==='') return 'Seul le terme constant est faux : refais le produit des nombres seuls en surveillant le signe.';
  if(bad.length===1 && bad[0]===top) return 'Seul le terme de plus haut degré est faux : refais le produit des termes de plus haut degré (les coefficients aussi se multiplient).';
  if(bad.length===1) return 'Seul un terme est faux : il regroupe plusieurs produits, recompte-les et additionne-les avec leurs signes.';
  return 'Plusieurs termes sont faux : reprends le développement pas à pas en écrivant chaque produit sur une ligne.';
}

function problemMsg(pr){
  const f=M(pr.factor);
  switch(pr.type){
    case 'content': return 'Dans '+f+', tous les termes sont divisibles par '+M(String(pr.g))+' : il reste un facteur commun à sortir de cette parenthèse.';
    case 'monome': return 'Dans '+f+', tous les termes contiennent '+M(pr.m)+' : il reste un facteur commun à sortir de cette parenthèse.';
    case 'diffsq': return f+' est une différence de deux carrés : elle se factorise encore avec '+M('a^2 - b^2 = (a - b)(a + b)')+'.';
    case 'square': return f+' est un carré parfait : elle se factorise encore avec '+M('a^2 ± 2ab + b^2 = (a ± b)^2')+'.';
    case 'trinome': return f+' se factorise encore : cherche deux nombres dont le produit et la somme conviennent.';
    case 'racine': return f+' peut encore être factorisée.';
    case 'notreduced': return 'Dans '+f+', réduis l\'écriture : cette parenthèse vaut '+M(pr.reduced)+'.';
  }
  return f+' peut encore être simplifiée.';
}

function checkAnswer(ex,input){
  let parsed;
  try{ parsed=parsePoly(input); }
  catch(e){ if(e instanceof ParseError) return {status:'syntax',title:'Écriture à corriger',html:'<p>'+esc(e.message)+'</p>',tag:null}; throw e; }
  const {ast,poly}=parsed, same=peq(poly,ex.expected);
  return ex.kind==='expand'?checkExpand(ex,ast,poly,same):checkFactor(ex,ast,poly,same);
}

function extraVarsMsg(ex,poly){
  const allowed=new Set(ex.vars), extra=varsOfPoly(poly).filter(v=>!allowed.has(v));
  return extra.length?'<p>Ta réponse contient la lettre '+extra.map(v=>M(v)).join(', ')+', qui n\'apparaît pas dans l\'énoncé.</p>':'';
}

function checkExpand(ex,ast,poly,same){
  if(same){
    if(!isDeveloped(ast)) return {status:'format',tag:'presentation',title:'Juste, mais pas développé',html:'<p>Ton expression est égale à l\'énoncé, mais il reste des parenthèses à supprimer. Écris le résultat sous forme d\'une somme de termes, sans parenthèses.</p>'};
    const dup=duplicateKeys(ast);
    if(dup.length) return {status:'format',tag:'presentation',title:'Juste, mais pas réduit',html:'<p>Regroupe les termes semblables : '+dup.map(k=>k===''?'les nombres seuls':'les termes en '+M(monoStr(expsOf(k)))).join(', ')+'.</p>'};
    return {status:'ok'};
  }
  let html='', tag='calcul', title='Ce n\'est pas encore ça';
  const cand=ex.mistakes.find(m=>peq(m.poly,poly));
  if(cand){ tag=cand.tag; title='Erreur repérée : '+TAGS[cand.tag].label; html+='<p>'+cand.msg+'</p>'; }
  else if(peq(poly,pneg(ex.expected))){ tag='signe'; title='Erreur repérée : '+TAGS.signe.label; html+='<p>Ton résultat est le bon au signe près : tous les termes ont le signe opposé. Regarde le signe du facteur placé devant la parenthèse, ou le signe de ton premier produit.</p>'; }
  html+=extraVarsMsg(ex,poly);
  if(!isDeveloped(ast)) html+='<p>Ton expression contient encore des parenthèses : je l\'ai développée pour la comparer à la bonne réponse.</p>';
  html+=termTable(poly,ex.expected);
  const tip=termTip(poly,ex.expected); if(tip) html+='<p class="tip">'+tip+'</p>';
  html+=numericTest(poly,ex.expected,'ton résultat');
  return {status:'wrong',tag,title,html};
}

function checkFactor(ex,ast,poly,same){
  if(!same){
    let html='', tag='calcul', title='La factorisation est fausse';
    const cand=ex.mistakes.find(m=>peq(m.poly,poly));
    if(cand){ tag=cand.tag; title='Erreur repérée : '+TAGS[cand.tag].label; html+='<p>'+cand.msg+'</p>'; }
    else if(peq(poly,pneg(ex.expected))){ tag='signe'; title='Erreur repérée : '+TAGS.signe.label; html+='<p>Ta réponse est égale à l\'opposé de l\'énoncé : un signe est mal placé (souvent celui du facteur commun ou d\'une parenthèse).</p>'; }
    html+=extraVarsMsg(ex,poly);
    html+='<p>Une factorisation doit redonner l\'énoncé quand on la développe. En développant ta réponse, on obtient '+M(polyStr(poly))+' au lieu de '+M(polyStr(ex.expected))+'.</p>';
    html+=termTable(poly,ex.expected);
    html+=numericTest(poly,ex.expected,'ta réponse');
    return {status:'wrong',tag,title,html};
  }
  const an=analyzeFactored(ast);
  if(!an.ok){
    const literal=peq(poly,ex.expected)&&addTerms(ast).length===pterms(poly)&&isDeveloped(ast);
    return {status:'incomplete',tag:'pas-produit',title:'Ce n\'est pas encore une factorisation',
      html:'<p>'+(literal?'Tu as recopié l\'énoncé, ou une écriture équivalente : ':'Ton expression est égale à l\'énoncé, mais elle est encore une somme : ')+'une factorisation est un <b>produit</b> de facteurs, par exemple '+M('3(x + 2)')+' et non '+M('3x + 6')+'.</p>'};
  }
  const real=an.problems.filter(p=>p.type!=='notreduced'), red=an.problems.filter(p=>p.type==='notreduced');
  if(real.length) return {status:'incomplete',tag:'incomplet',title:'Juste, mais la factorisation n\'est pas terminée',html:'<ul class="plain">'+real.map(p=>'<li>'+problemMsg(p)+'</li>').join('')+'</ul><p class="tip">Vérifie chaque parenthèse : ne reste-t-il pas un facteur commun ou une identité remarquable ?</p>'};
  if(red.length) return {status:'format',tag:'presentation',title:'Juste, mais à simplifier',html:'<ul class="plain">'+red.map(p=>'<li>'+problemMsg(p)+'</li>').join('')+'</ul>'};
  return {status:'ok'};
}

/* ---------- Étapes intermédiaires : une ligne par étape (ou séparées par =) ---------- */
function splitSteps(input){ return input.split(/[\n=]/).map(s=>s.trim()).filter(Boolean); }
function stepsList(parsed,bad){
  return '<ul class="terms steps-check">'+parsed.map((p,i)=>{
    const cls=bad<0||i<bad?'ok':(i===bad?'ko':'skip');
    const mk=cls==='ok'?'✓':(cls==='ko'?'✗':'·');
    const note=cls==='ok'?'égale à l\'énoncé':(cls==='ko'?'pas égale à l\'énoncé':'non vérifiée');
    return '<li class="'+cls+'"><span class="mk" aria-hidden="true">'+mk+'</span><span>Étape '+(i+1)+' : '+M(astStr(p.ast))+' <small>('+note+')</small></span></li>';
  }).join('')+'</ul>';
}
function checkWork(ex,input){
  if(ex.kind==='solve') return checkSolveWork(ex,input);
  if(ex.kind==='geo') return checkGeoWork(ex,input);
  if(ex.kind==='txt') return checkTxt(ex,input);
  const lines=splitSteps(input);
  if(lines.length<=1) return checkAnswer(ex,lines[0]||input);
  const parsed=[];
  for(let i=0;i<lines.length;i++){
    try{ parsed.push(parsePoly(lines[i])); }
    catch(e){ if(e instanceof ParseError) return {status:'syntax',title:'Étape '+(i+1)+' : écriture à corriger',html:'<p>'+esc(e.message)+'</p>',tag:null}; throw e; }
  }
  const bad=parsed.findIndex(p=>!peq(p.poly,ex.expected));
  if(bad>=0){
    const r=checkAnswer(ex,lines[bad]);
    const from=bad===0?'l\'énoncé et l\'étape 1':'l\'étape '+bad+' et l\'étape '+(bad+1);
    return {status:'wrong',tag:r.tag||'calcul',title:'Étape '+(bad+1)+' : erreur de transformation',
      html:stepsList(parsed,bad)+'<p>Cette ligne n\'a pas la même valeur que l\'énoncé : l\'erreur se situe entre '+from+'.</p>'+r.html};
  }
  const fin=checkAnswer(ex,lines[lines.length-1]);
  if(fin.status==='ok') return {status:'ok',steps:lines.length};
  return {status:fin.status,tag:fin.tag,title:fin.title,html:stepsList(parsed,-1)+'<p>Tes étapes sont justes. Il reste un point sur la dernière ligne.</p>'+fin.html};
}
