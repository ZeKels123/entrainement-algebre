'use strict';
/* Exercices « texte » (réponse écrite, sans calcul) : normalisation, correspondance branches → domaines, mkTxt / checkTxt. Partagé par l'anglais et le français. */
const enPick=a=>a[Math.floor(Math.random()*a.length)];
const enNorm=s=>String(s).replace(/[’‘`´]/g,"'").replace(/\s+/g,' ').trim().toLowerCase().replace(/[.?!\s]+$/,'');
/* branches → domaines du moteur : chaque branche de langue ou de texte a son domaine (onglet) */
const BRDOM={anglais:'ang',francais:'fr'}, DOMBR={ang:'anglais',fr:'francais',ff:'francais',fs:'francais'}, BRDOMS={anglais:['ang'],francais:['fr','ff','fs']};
const tagDom=t=>/^en-/.test(t)?'ang':/^fr-/.test(t)?'fr':'math';
const enNorm2=s=>enNorm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function mkTxt(g){
  const lang=g.lang||'en', stmt=g.statement, ans=g.answers;
  const ms=g.mist.map(m=>({s:enNorm2(m[0]),msg:m[1],tag:g.tag||enTag(m[1])}));
  const html='<div class="geo"><p class="geotxt" lang="'+lang+'">'+esc(stmt).replace(/\n/g,'<br>').replace(/_{3,}/g,'<span class="en-gap">…………</span>')+'</p></div>';
  return {kind:'txt',txt:true,expected:{},vars:[],v:null,geo:{mode:'txt',answers:ans.map(enNorm2),stmt:stmt,choices:g.choices||null},choices:g.choices||null,
    statement:stmt, html, expectedStr:ans[0], expectedHtml:'<span lang="'+lang+'">'+esc(ans[0])+'</span>',
    steps:[stp('Repérer le temps et le sujet',g.hint),stp('Appliquer la règle et écrire la réponse',g.solution)],
    hints:[g.hint], mistakes:ms, instr:g.instr, hintline:g.hintline||'Écris ta réponse en anglais dans la zone de saisie (une seule ligne). Les majuscules, la ponctuation finale et les formes contractées (don\'t / do not) sont acceptées.',
    fallback:g.fallback||null, keys:g.keys||null, placeholder:g.placeholder||'ta réponse en anglais', work:null, id:Math.random().toString(36).slice(2,9)};
}
function checkTxt(ex,input){
  const lines=input.split('\n').map(s=>s.trim()).filter(Boolean);
  if(!lines.length) return {status:'syntax',title:'Écriture à corriger',html:'<p>Écris ta réponse dans la zone de saisie.</p>',tag:null};
  const n=enNorm2(lines[lines.length-1]), A=ex.geo.answers, CH=ex.geo.choices;
  if(A.indexOf(n)>=0) return {status:'ok',steps:lines.length};
  if(CH){ const words=n.split(/[^a-z]+/), f=CH.map(enNorm2).filter(c=>words.indexOf(c)>=0);
    if(f.length===1){ if(A.indexOf(f[0])>=0) return {status:'ok',steps:lines.length}; const mm=ex.mistakes.find(x=>x.s===f[0]); if(mm) return {status:'wrong',tag:mm.tag,title:'Pas tout à fait',html:'<p>'+esc(mm.msg)+'</p>'}; } }
  if(/___/.test(ex.geo.stmt)){
    const fill=A.map(a=>enNorm2(ex.geo.stmt.replace(/___\s*(\([^)]*\))?/,a)));
    if(fill.indexOf(n)>=0) return {status:'ok',steps:lines.length};
  }
  const m=ex.mistakes.find(x=>x.s===n);
  if(m) return {status:'wrong',tag:m.tag,title:'Pas tout à fait',html:'<p>'+esc(m.msg)+'</p>'};
  if(ex.fallback) return {status:'wrong',tag:ex.fallback.tag,title:ex.fallback.title,html:ex.fallback.html};
  return {status:'wrong',tag:'en-forme',title:'Ce n\'est pas la forme attendue',html:'<p>Relis la consigne, repère le temps (habitude ou action en cours), puis vérifie l\'auxiliaire, la terminaison et l\'orthographe. Utilise un indice si tu bloques.</p>'};
}
