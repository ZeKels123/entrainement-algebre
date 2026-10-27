'use strict';
/* ===== Objets pour apprendre : consommables utilisables pendant un exercice ===== */
const STUDY=[
  ['ex','Exemple corrigé','Un exercice du même thème avec d\'autres nombres, entièrement résolu. Compte comme une aide.',20],
  ['trap','Piège du thème','Les erreurs les plus courantes sur ce thème, avec la règle à retenir. Compte comme une aide.',15],
  ['chk','Vérification libre','Dit si ta réponse finale est juste, sans compter d\'essai ni d\'erreur.',20],
  ['tab','Aide-mémoire de tables','Carrés, cubes, racines, π et valeurs trigonométriques usuelles. 5 consultations.',25],
  ['perso','Rappel perso','La règle de ton erreur la plus fréquente, d\'après ta fiche d\'erreurs.',10]
];
STUDY.forEach(s=>{ PRICES['st-'+s[0]]=s[3]; });
const stG=()=>G.st||(G.st={ex:0,trap:0,chk:0,tab:0,perso:0});
function studyGrant(v){ const k=v.slice(3); stG()[k]=(stG()[k]||0)+(k==='tab'?5:1); }
function studyAllowed(){ return !!S.ex&&S.status==='open'&&!running()&&!S.boss&&!S.ex.copy; }
function renderStudy(){
  const row=$('study'), out=$('study-out'); if(!row) return;
  const own=STUDY.filter(s=>(stG()[s[0]]||0)>0);
  if(!studyAllowed()||!own.length){ row.hidden=true; row.innerHTML=''; return; }
  row.innerHTML='<span class="lbl">Outils d\'étude</span>'+own.map(s=>'<button type="button" class="btn" data-st="'+s[0]+'">'+esc(s[1])+' <span class="cnt">×'+stG()[s[0]]+'</span></button>').join('');
  row.hidden=false;
}
function studyOut(html){ const o=$('study-out'); o.innerHTML=html+'<div class="actions"><button type="button" class="btn" data-st="close">Fermer</button></div>'; o.hidden=false; }
function studyMsg(t){ studyOut('<p>'+t+'</p>'); }
function studyTables(){
  const sq=Array.from({length:25},(_,i)=>'<td>'+(i+1)+'² = '+(i+1)*(i+1)+'</td>'), rows=[];
  for(let i=0;i<sq.length;i+=5) rows.push('<tr>'+sq.slice(i,i+5).join('')+'</tr>');
  return '<span class="lbl">Aide-mémoire</span><div class="tbl"><table class="trap"><caption>Carrés</caption><tbody>'+rows.join('')+'</tbody></table></div>'
    +'<p>Cubes : '+Array.from({length:10},(_,i)=>(i+1)+'³ = '+Math.pow(i+1,3)).join(' · ')+'</p>'
    +'<p>Racines : '+M('\\sqrt{2} \\approx 1{,}414')+' · '+M('\\sqrt{3} \\approx 1{,}732')+' · '+M('\\sqrt{5} \\approx 2{,}236')+' · '+M('\\sqrt{6} \\approx 2{,}449')+' · '+M('\\sqrt{7} \\approx 2{,}646')+' · '+M('\\sqrt{8} \\approx 2{,}828')+' · '+M('\\sqrt{10} \\approx 3{,}162')+'</p>'
    +'<p>'+M('\\pi \\approx 3{,}1416')+' · '+M('2\\pi \\approx 6{,}283')+' · '+M('\\pi^2 \\approx 9{,}870')+'</p>'
    +'<div class="tbl"><table class="trap"><caption>Valeurs exactes (angles en degrés)</caption><thead><tr><th>Angle</th><th>sin</th><th>cos</th><th>tan</th></tr></thead><tbody>'
    +'<tr><td>30°</td><td>'+M('\\frac{1}{2}')+'</td><td>'+M('\\frac{\\sqrt{3}}{2}')+'</td><td>'+M('\\frac{\\sqrt{3}}{3}')+'</td></tr>'
    +'<tr><td>45°</td><td>'+M('\\frac{\\sqrt{2}}{2}')+'</td><td>'+M('\\frac{\\sqrt{2}}{2}')+'</td><td>1</td></tr>'
    +'<tr><td>60°</td><td>'+M('\\frac{\\sqrt{3}}{2}')+'</td><td>'+M('\\frac{1}{2}')+'</td><td>'+M('\\sqrt{3}')+'</td></tr></tbody></table></div>';
}
function studyUse(k){
  const st=stG();
  if(k==='ex'){
    const d=domainOf(TOPICS[S.ex.topic].kind), tw=newExercise('mix',S.ex.level,[S.ex.statement],[S.ex.topic],d);
    studyOut('<span class="lbl">Exemple corrigé : même thème, autres nombres</span><div class="study-st">'+((tw.word||tw.sys||tw.geo)&&tw.html?tw.html:'<p>'+M(tw.statement)+'</p>')+'</div>'+solutionHTML(tw));
    S.hints=Math.max(S.hints,1); betCancel('exemple consulté'); st.ex--; return true;
  }
  if(k==='trap'){
    const cnt={}; for(let i=0;i<30;i++){ let tw; try{ tw=newExercise('mix',S.ex.level,null,[S.ex.topic],domainOf(TOPICS[S.ex.topic].kind)); }catch(e){ break; } (tw.mistakes||[]).forEach(m=>{ if(m.tag&&TAGS[m.tag]) cnt[m.tag]=(cnt[m.tag]||0)+1; }); }
    const mine=(stats.errTopics||{});
    Object.keys(mine).forEach(t=>{ if(TAGS[t]&&mine[t][S.ex.topic]) cnt[t]=(cnt[t]||0)+100*mine[t][S.ex.topic]; });
    const top=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]).slice(0,3);
    if(!top.length){ studyMsg('Aucun piège recensé pour ce thème. Ton objet n\'est pas consommé.'); return false; }
    studyOut('<span class="lbl">Pièges à éviter sur ce thème</span><ul class="errs">'+top.map(t=>'<li><span class="n">!</span><span><b>'+esc(TAGS[t].label)+'</b></span><span class="tip">'+esc(TAGS[t].tip)+'</span></li>').join('')+'</ul>');
    S.hints=Math.max(S.hints,1); betCancel('piège consulté'); st.trap--; return true;
  }
  if(k==='chk'){
    const v=$('answer').value.trim(); if(!v){ studyMsg('Écris d\'abord ta réponse dans le champ, puis relance la vérification. Ton objet n\'est pas consommé.'); return false; }
    let res; try{ res=checkWork(S.ex,v); }catch(e){ res={status:'syntax'}; }
    studyOut(res.status==='ok'?'<p><b>Ta réponse finale est juste.</b> Clique sur « Vérifier » pour la valider.</p>':'<p><b>Ce n\'est pas encore ça.</b> Relis chaque étape, ou utilise « Vérifier l\'étape » pour trouver la ligne fautive.</p>');
    st.chk--; return true;
  }
  if(k==='tab'){ studyOut(studyTables()); st.tab--; return true; }
  if(k==='perso'){
    const e=Object.entries(stats.errors||{}).filter(([t])=>TAGS[t]).sort((a,b)=>b[1]-a[1])[0];
    if(!e){ studyMsg('Aucune erreur enregistrée pour l\'instant. Ton objet n\'est pas consommé.'); return false; }
    studyOut('<span class="lbl">Ton erreur la plus fréquente ('+e[1]+' fois)</span><p><b>'+esc(TAGS[e[0]].label)+'</b></p><p>'+esc(TAGS[e[0]].tip)+'</p>'); st.perso--; return true;
  }
  return false;
}
function studyClick(e){
  const b=e.target.closest('button[data-st]'); if(!b) return; const k=b.dataset.st;
  if(k==='close'){ $('study-out').hidden=true; return; }
  if(!studyAllowed()||(stG()[k]||0)<1) return;
  const used=studyUse(k); if(used){ saveGame(); renderStudy(); funRender(); }
}
