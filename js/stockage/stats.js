'use strict';
/* Statistiques par thème (clé localStorage STORE) */
const STORE='dev-fact-stats-v1';
let stats=loadStats();
function loadStats(){ try{ const s=JSON.parse(localStorage.getItem(STORE)); if(s&&s.topics) return s; }catch(e){} return {topics:{},errors:{},series:0}; }
function saveStats(){ try{ localStorage.setItem(STORE,JSON.stringify(stats)); }catch(e){} syncTouch('s'); }
const fr=n=>String(n).replace('.',',');
const scoreOf=r=>r.reduce((s,k)=>s+(k==='clean'?1:k==='helped'?0.5:0),0);
