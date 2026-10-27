'use strict';
/* ===== Branches de maturité : barre des branches et modules (fiches et exercices) ===== */
/* Le contenu de chaque branche (fiches et exercices) se renseigne ici ; les thèmes viennent des devoirs du planificateur Notion. */
const BRANCHES=[
  {id:'math',name:'Maths',sub:'Algèbre, équations et géométrie',themes:[]},
  {id:'physique',name:'Physique',themes:['Chaleur','Dilatation','Gaz parfaits'],fiches:[]},
  {id:'chimie',name:'Chimie',themes:['Test de chimie'],fiches:[]},
  {id:'economie',name:'Économie',themes:['Économie d\'échelle'],fiches:[]},
  {id:'histoire',name:'Histoire',themes:['Institutions politiques et Jura'],fiches:[]},
  {id:'francais',name:'Français',themes:['Sémantique','Littérature','Répétitions'],fiches:[]},
  {id:'allemand',name:'Allemand',themes:['Vocabulaire (unité 1)','Exposé sur une ville allemande'],fiches:[]},
  {id:'anglais',name:'Anglais',themes:['Test d\'anglais'],fiches:[]}
];
const BR={id:'home',tab:'cours',qx:null,xs:null};
const BRSTORE='maturite-branches-v1';
let brProg=(()=>{ try{ const p=JSON.parse(localStorage.getItem(BRSTORE)); if(p&&typeof p==='object') return p; }catch(e){} return {}; })();
function brSave(){ try{ localStorage.setItem(BRSTORE,JSON.stringify(brProg)); }catch(e){} }
const brData=id=>BRANCHES.find(b=>b.id===id);
const brXp=id=>{ if(id==='math'){ let o=0; BRANCHES.forEach(b=>{ if(b.id!=='math') o+=(brProg[b.id]&&brProg[b.id].xp)||0; }); return Math.max(0,G.xp-o); } return (brProg[id]&&brProg[id].xp)||0; };
function brAward(id,n){
  if(!(n>0)) return;
  const b=brData(id), p=brProg[id]||(brProg[id]={}), r0=rankOf(brXp(id)).i;
  p.xp=(p.xp||0)+n; brSave(); addXp(n); saveGame(); renderBar();
  const r1=rankOf(brXp(id));
  if(r1.i>r0) toast('Nouveau rang en '+b.name+' : '+r1.name,'rank');
}
function brAttr(n){
  if(!(n>0)||typeof BR==='undefined'||!BRDOM[BR.id]||DOMBR[S.domain]!==BR.id) return;
  const id=BR.id, r0=rankOf(brXp(id)).i, p=brProg[id]||(brProg[id]={});
  p.xp=(p.xp||0)+n; brSave();
  const r1=rankOf(brXp(id));
  if(r1.i>r0) toast('Nouveau rang en '+brData(id).name+' : '+r1.name,'rank');
}
const brRankLine=id=>{ const r=rankOf(brXp(id)), x=brXp(id); return r.name+' · '+x+(r.next?' / '+r.next:'')+' XP'; };
const brBest=id=>{ const p=brProg[id]||(brProg[id]={}); return p; };

const brCount=b=>({f:(b.fiches||[]).length});
/* statistiques d'une branche, calculées à partir des thèmes du moteur (maths : alg, eq, geo ; anglais : ang) */
function brStat(b){
  const t={n:0,clean:0,helped:0,shown:0}; if(b.id!=='math'&&!BRDOM[b.id]) return t;
  Object.keys(TOPICS).forEach(id=>{ const dm=domainOf(TOPICS[id].kind), s=stats.topics[id]; if(s&&(BRDOM[b.id]?DOMBR[dm]===b.id:!DOMBR[dm])){ t.n+=s.n; t.clean+=s.clean; t.helped+=s.helped; t.shown+=s.shown; } });
  return t;
}
const brEngine=id=>id==='math'||id==='anglais';
function brHome(){
  const card=b=>{
    let sub, prog='';
    if(b.id==='math'){ sub=b.sub; }
    else{
      const n=brCount(b), e=brStat(b);
      sub=b.themes.length?b.themes.join(' · '):'';
      prog=BRDOM[b.id]?(e.n?e.n+' exercice'+(e.n>1?'s':'')+' · '+Math.round(100*e.clean/e.n)+' % sans aide':'exercices à faire'):(n.f?n.f+' fiche'+(n.f>1?'s':''):'Contenu à venir');
    }
    return '<button type="button" class="hcard" data-br="'+b.id+'"><span class="hname">'+esc(b.name)+'</span><span class="hrank">Rang : '+esc(brRankLine(b.id))+'</span>'+(sub?'<span class="hsub">'+esc(sub)+'</span>':'')+(prog?'<span class="hprog">'+esc(prog)+'</span>':'')+'</button>';
  };
  $('view-home').innerHTML='<h2 class="hsec">Outils</h2><div class="hgrid"><button type="button" class="hcard" data-br="bilan"><span class="hname">Bilan global</span><span class="hsub">Rang global, badges et bilan par branche</span></button><button type="button" class="hcard" data-br="shop"><span class="hname">Boutique</span><span class="hsub">Dépense les pièces gagnées</span></button><button type="button" class="hcard" data-br="lb"><span class="hname">Classement</span><span class="hsub">Classement et compte de synchronisation</span></button></div>'
    +'<h2 class="hsec">Branches</h2><div class="hgrid">'+BRANCHES.map(card).join('')+'</div>';
}
function brTabs(){
  const b=brData(BR.id), n=brCount(b);
  const t=[['cours','Cours',n.f],['exos','Exercices',0],['bilan','Bilan',0]];
  $('brtabs').innerHTML=t.map(x=>'<button type="button" class="tab" role="tab" data-bt="'+x[0]+'" aria-selected="'+(BR.tab===x[0])+'">'+x[1]+(x[2]?' ('+x[2]+')':'')+'</button>').join('');
}
function setBranch(id){
  if(running()&&id!=='math'&&id!==BR.id){ toast('Examen en cours : rends la copie ou abandonne-le avant de changer de branche.'); return; }
  if(running()&&id==='home'){ toast('Examen en cours : rends la copie ou abandonne-le avant de quitter.'); return; }
  const home=id==='home', tool=id==='shop'||id==='lb'||id==='bilan', b=(home||tool)?null:brData(id); if(!home&&!tool&&!b) return;
  BR.id=id; BR.tab='cours'; BR.xs=null;
  const eng=!!BRDOM[id], math=id==='math'||eng, app=document.querySelector('.app');
  app.classList.toggle('nomath',!math);
  app.classList.toggle('nogame',false);
  app.dataset.br=id; renderBar();
  $('homebtn').hidden=home;
  $('brtabs').hidden=home||math||tool;
  $('view-home').hidden=!home;
  $('view-branch').hidden=home||math||tool;
  ['train','course','formulas','exam','stats','shop','lb'].forEach(k=>{ if(!math) $('view-'+k).hidden=true; });
  if(tool){
    $('subnav').hidden=true; $('view-'+(id==='bilan'?'stats':id)).hidden=false;
    $('brand-kicker').textContent='Maturité'; $('brand-title').textContent=id==='shop'?'Boutique':id==='lb'?'Classement':'Bilan global';
    if(id==='shop') renderShop(); else if(id==='lb') renderLb(); else renderStats();
  } else if(home){
    $('subnav').hidden=true;
    $('brand-kicker').textContent='Maturité'; $('brand-title').textContent='Mes branches';
    brHome();
  } else if(math){
    const want=eng?(DOMBR[S.domain]===id?S.domain:BRDOM[id]):(DOMBR[S.domain]?(BR.lastMath||'alg'):S.domain);
    if(want!==S.domain){ if(eng&&!DOMBR[S.domain]) BR.lastMath=S.domain; setDomain(want,S.view||'train'); }
    else { $('brand-title').innerHTML=DOM_TITLE[S.domain]; $('brand-kicker').textContent=DOM_KICK[S.domain]; setTab(S.view||'train'); }
  } else {
    $('subnav').hidden=true;
    $('brand-kicker').textContent='Maturité · branche'; $('brand-title').textContent=b.name;
    brTabs(); brRender();
  }
  window.scrollTo(0,0);
}
function brEmpty(b,what){
  return '<div class="card brempty"><p><b>Pas encore de '+what+' pour '+esc(b.name)+'.</b></p><p>Envoie-moi tes cours de '+esc(b.name)+' (photos ou PDF) : je les transformerai en fiches et en exercices corrigés, uniquement à partir de ce que tu m\'envoies.</p></div>';
}
function brRender(){
  const b=brData(BR.id), v=$('view-branch'), e=brStat(b);
  let h='<div class="panel brstats"><div><span class="lbl">Rang de la branche</span><b>'+esc(brRankLine(b.id))+'</b></div><div><span class="lbl">Exercices</span><b>'+e.n+'</b></div>'+'</div>';
  h+='<div class="brbody">'+(BR.tab==='cours'?brCours(b):BR.tab==='exos'?brEmpty(b,'exercice')+brThemes(b):'<div class="card brempty"><p>Le bilan de '+esc(b.name)+' apparaîtra ici dès les premiers exercices.</p></div>')+'</div>';
  v.innerHTML=h; brTabs();
}
function brThemes(b){
  if(!b.themes||!b.themes.length) return '';
  return '<div class="card"><p class="lbl">Thèmes repérés dans tes devoirs (Notion)</p><p class="chips">'+b.themes.map(t=>'<span class="chip">'+esc(t)+'</span>').join('')+'</p></div>';
}
function brCours(b){
  const f=b.fiches||[];
  if(!f.length) return brEmpty(b,'fiche de cours')+brThemes(b);
  return f.map(x=>'<article class="card brfiche"><h3>'+esc(x.t)+'</h3><div class="brhtml">'+x.html+'</div></article>').join('');
}
(function brSetup(){
  const go=e=>{ const t=e.target.closest('[data-br]'); if(t) setBranch(t.dataset.br); };
  $('view-home').addEventListener('click',go);
  $('homebtn').addEventListener('click',()=>setBranch('home'));
  $('brtabs').addEventListener('click',e=>{ const t=e.target.closest('[data-bt]'); if(t){ BR.tab=t.dataset.bt; brRender(); } });
})();
