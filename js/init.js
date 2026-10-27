'use strict';
/* Démarrage : branchement des événements puis init() — chargé en dernier */
function init(){
  $('view-course').innerHTML=courseHTML(S.domain);
  document.querySelectorAll('.tab, .stab').forEach(b=>{
    const go=()=>{ if(b.dataset.domain) setDomain(b.dataset.domain,S.view); else setTab(b.dataset.tab); };
    b.addEventListener('click',go);
    b.addEventListener('keydown',e=>{
      const grp=[...b.parentNode.querySelectorAll('button')], i=grp.indexOf(b);
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){ const nb=grp[(i+(e.key==='ArrowRight'?1:grp.length-1))%grp.length]; nb.click(); nb.focus(); e.preventDefault(); }
    });
  });
  $('seg-mode').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; S.mode=b.dataset.v; S.pool=null; renderSetup(); newSeries(); });
  $('seg-level').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; if(b.disabled) return; S.level=+b.dataset.v; S.pool=null; renderSetup(); newSeries(); });
  $('sel-topic').addEventListener('change',e=>{ S.only=e.target.value; S.pool=null; renderSetup(); newSeries(); });
  $('form').addEventListener('submit',e=>{ e.preventDefault(); onCheck(); });
  $('answer').addEventListener('input',updatePreview);
  $('answer').addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); onCheck(); } });
  $('btn-hint').addEventListener('click',onHint);
  $('btn-step').addEventListener('click',onStep);
  $('view-train').addEventListener('click',studyClick); $('view-exam').addEventListener('click',examClick); $('view-exam').addEventListener('change',examChange); $('exam-bar').addEventListener('click',examBarClick); $('feedback').addEventListener('click',examFbClick);
  $('view-formulas').addEventListener('click',e=>{ if(e.target.closest('[data-f="print"]')){ try{ window.print(); }catch(x){} } });
  $('btn-solution').addEventListener('click',onSolution);
  $('btn-next').addEventListener('click',onNext);
  $('summary').addEventListener('click',e=>{
    const b=e.target.closest('button[data-act]'); if(!b) return;
    if(b.dataset.act==='again') newSeries();
    else if(b.dataset.act==='weak'){ const w=[...new Set(S.log.filter(l=>l.kind!=='clean').map(l=>l.topic))]; S.pool=[...w,...w]; renderSetup(); newSeries(); }
    else if(b.dataset.act==='copy') copySummary();
    else if(b.dataset.act==='up'){ S.level=Math.min(maxLevel(),S.level+1); S.pool=null; renderSetup(); newSeries(); }
    else if(b.dataset.act==='course') setTab('course');
    else if(b.dataset.act==='chest') chestOpen(b);
  });
  $('view-stats').addEventListener('click',e=>{
    const b=e.target.closest('button[data-act]'); if(!b) return;
    if(b.dataset.act==='reset'){
      $('reset-zone').innerHTML='<span style="align-self:center">Effacer tous les résultats et les erreurs enregistrés ?</span><button type="button" class="btn primary" data-act="reset-yes">Oui, effacer</button><button type="button" class="btn" data-act="reset-no">Annuler</button>';
    } else if(b.dataset.act==='reset-yes'){ stats={topics:{},errors:{},series:0}; saveStats(); renderStats(); }
    else if(b.dataset.act==='reset-no') renderStats();
    else if(b.dataset.act==='gotoshop') setTab('shop');
    else if(b.dataset.act==='errtrain') errTrain(b.dataset.tag);
  });
  gameInit(); funInit(); lbInit(); syncInit();
  renderSetup(); setTab('train'); newSeries(); setBranch('home');
}
init();
