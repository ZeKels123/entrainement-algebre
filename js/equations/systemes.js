'use strict';
/* ===== Systèmes d'équations linéaires (2 et 3 inconnues) et problèmes associés ===== */
const rAdd=(a,b)=>rat(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);
const rSub=(a,b)=>rAdd(a,[-b[0],b[1]]);
const rMul=(a,b)=>rat(a[0]*b[0],a[1]*b[1]);
const rDivide=(a,b)=>rat(a[0]*b[1],a[1]*b[0]);
const rIsZero=a=>a[0]===0;
const toR=row=>row.map(x=>Array.isArray(x)?x:rat(x));
function rref(rows,ncols){
  const m=rows.map(r=>toR(r).slice()); let r=0;
  for(let c=0;c<ncols&&r<m.length;c++){
    let p=-1; for(let i=r;i<m.length;i++) if(!rIsZero(m[i][c])){ p=i; break; }
    if(p<0) continue; [m[r],m[p]]=[m[p],m[r]];
    const pv=m[r][c]; m[r]=m[r].map(x=>rDivide(x,pv));
    for(let i=0;i<m.length;i++) if(i!==r&&!rIsZero(m[i][c])){ const f=m[i][c]; m[i]=m[i].map((x,j)=>rSub(x,rMul(f,m[r][j]))); }
    r++;
  }
  return {m,rank:r};
}
function solveLin(rows,n){
  const {m,rank}=rref(rows,n);
  for(let i=rank;i<m.length;i++) if(m[i].slice(0,n).every(rIsZero)&&!rIsZero(m[i][n])) return {type:'none'};
  if(rank<n) return {type:'all'};
  return {type:'unique',vals:m.slice(0,n).map(r=>r[n])};
}
const inSpan=(rows,row,n)=>rref(rows,n+1).rank===rref(rows.concat([row]),n+1).rank;
function linStr(row,vars){
  let s=''; vars.forEach((v,i)=>{ const c=row[i]; if(!c) return; const a=Math.abs(c), t=(a===1?'':a)+v; s+=s===''?(c<0?'-':'')+t:(c<0?' - ':' + ')+t; });
  return (s===''?'0':s)+' = '+row[vars.length];
}
const lcm=(a,b)=>a/gcd(a,b)*b;
const PAIRS=[['x','y'],['x','y'],['x','y'],['a','b'],['u','v'],['m','n']];
const TRIPLES=[['x','y','z'],['x','y','z'],['a','b','c']];
function sysBox(rows,vars,texts){
  return '<div class="sysbox">'+rows.map((r,i)=>'<div class="eqrow"><span class="eqn">('+(i+1)+')</span> '+M(texts&&texts[i]?texts[i]:linStr(r,vars))+'</div>').join('')+'</div>';
}
/* Résolution pas à pas par combinaisons (entiers) : order = colonnes à éliminer dans l'ordre */
function gaussLines(rows,vars,order){
  const n=vars.length, L=[]; let counter=rows.length;
  let cur=rows.map((r,i)=>({row:r.slice(),label:i+1}));
  const norm=r=>{ const g=r.reduce((a,x)=>gcd(a,x),0)||1; return r.map(x=>x/g); };
  const tri=[];
  for(let s=0;s<n-1;s++){
    const k=order[s]; let pi=-1,best=1e9;
    cur.forEach((e,i)=>{ if(e.row[k]!==0&&Math.abs(e.row[k])<best){ best=Math.abs(e.row[k]); pi=i; } });
    const piv=cur[pi]; tri.push({e:piv,k}); const nxt=[]; let first=true;
    cur.forEach((e,i)=>{
      if(i===pi) return; if(e.row[k]===0){ nxt.push(e); return; }
      const g=lcm(Math.abs(piv.row[k]),Math.abs(e.row[k])), mp=g/Math.abs(piv.row[k]), mr=g/Math.abs(e.row[k]), same=Math.sign(e.row[k])===Math.sign(piv.row[k]);
      const comb=norm(e.row.map((x,j)=>x*mr-(same?1:-1)*piv.row[j]*mp)); counter++;
      const desc=(mr===1?'':'')+'('+e.label+')'+(mr===1?'':' × '+mr)+(same?' − ':' + ')+'('+piv.label+')'+(mp===1?'':' × '+mp);
      L.push((first?'On élimine '+M(vars[k])+' : ':'')+desc+' donne ('+counter+') '+M(linStr(comb,vars)));
      first=false; nxt.push({row:comb,label:counter});
    });
    cur=nxt;
  }
  const lastCol=vars.findIndex((_,j)=>!order.slice(0,n-1).includes(j)), fin=cur[0];
  tri.push({e:fin,k:lastCol});
  const vals={}; const known=[];
  for(let s=tri.length-1;s>=0;s--){
    const {e,k}=tri[s]; let rhs=rat(e.row[n]);
    for(const j of known) rhs=rSub(rhs,rMul(rat(e.row[j]),vals[j]));
    const v=rDivide(rhs,rat(e.row[k])); vals[k]=v;
    L.push((known.length?'Dans ('+e.label+'), avec '+known.map(j=>M(vars[j]+' = '+rStr(vals[j]))).join(' et ')+' : ':'L\'équation ('+e.label+') ne contient plus qu\'une inconnue : ')+M(vars[k]+' = '+rStr(v)));
    known.push(k);
  }
  return {lines:L,vals:vars.map((_,j)=>vals[j])};
}
function verifLines(rows,vars,vals){
  return rows.map((r,i)=>{ const terms=vars.map((v,j)=>r[j]?paren(r[j])+' × '+paren(rStr(vals[j])):null).filter(Boolean).join(' + ');
    const tot=vars.reduce((a,_,j)=>rAdd(a,rMul(rat(r[j]),vals[j])),rat(0)); return '('+(i+1)+') : '+M(terms+' = '+rStr(tot)+(rEq(tot,rat(r[vars.length]))?'':' ≠ '+r[vars.length]))+' ✓'; });
}
function assignMistake(vars,vals,tag,msg,repl){       // repl : liste de rats pour toutes les variables
  return {tag,msg,assign:Object.fromEntries(vars.map((v,i)=>[v,repl[i]]))};
}
function mkSys(o){
  const vars=o.vars, n=vars.length, sol=solveLin(o.rows,n);
  const ex={kind:'solve',v:vars[0],vars:vars.slice(),expected:{},sys:{vars:vars.slice(),rows:o.rows.map(r=>r.slice()),type:sol.type,vals:sol.vals||null},
    statement:o.plain||o.rows.map(r=>linStr(r,vars)).join(' ; '),html:o.html||sysBox(o.rows,vars,o.texts),word:!!o.word,steps:o.steps||[],hints:o.hints||[],id:Math.random().toString(36).slice(2,9)};
  if(sol.type==='unique'){ ex.expectedStr=vars.map((v,i)=>v+' = '+rStr(sol.vals[i])).join(' ; '); ex.expectedHtml=vars.map((v,i)=>M(v+' = '+rStr(sol.vals[i]))).join(' ; '); }
  else { ex.expectedStr=sol.type==='none'?'aucune solution':'infinité de solutions'; ex.expectedHtml=sol.type==='none'?'aucune solution':'une infinité de solutions'; }
  ex.mistakes=(o.mistakes||[]).filter(m=>{
    if(m.row) return !inSpan(o.rows,m.row,n);
    if(m.assign&&sol.type==='unique') return vars.some((v,i)=>!rEq(m.assign[v],sol.vals[i]));
    return false; });
  ex.instr=o.instr; ex.hintline=o.hintline; ex.placeholder=o.placeholder;
  return ex;
}
const SYS_HINT='Écris une équation par ligne (ou sépare-les par « ; »). Chaque ligne doit être une conséquence du système. Termine par les valeurs des inconnues : x = 2 ; y = 3. Si le système est impossible écris « aucune solution », s\'il a une infinité de solutions écris « infinité de solutions ».';
function sysSteps(rows,vars,order,intro){
  const g=gaussLines(rows,vars,order);
  return [step(intro||'Choisis l\'inconnue à éliminer','On combine les équations pour faire disparaître une inconnue.'),step('Combine et résous',...g.lines),step('Vérifie dans le système de départ',...verifLines(rows,vars,g.vals))];
}
function detOK(rows,n){ return solveLin(rows,n).type==='unique'; }
function pickSol(n,lo,hi){ const v=[]; for(let i=0;i<n;i++) v.push(nz(lo,hi)); return v; }
const dot=(r,s)=>r.reduce((a,c,i)=>a+c*s[i],0);

/* ---- Niveau 1 : substitution ---- */
function genSys1(){
  const vars=pick(PAIRS), [X,Y]=vars, sol=pickSol(2,-6,6), swap=Math.random()<0.4;
  for(let i=0;i<300;i++){
    const m=pick([1,2,3,4,-1,-2,-3]), p=nz(-4,4), q=nz(-4,4), k=(swap?sol[0]-m*sol[1]:sol[1]-m*sol[0]);
    const iso=swap?0:1, oth=swap?1:0;                 // eq1 : vars[iso] = m*vars[oth] + k
    const row1=[0,0,k]; row1[iso]=1; row1[oth]=-m;
    const row2=[p,q,p*sol[0]+q*sol[1]]; if(p+ (iso===1? q*m : 0)===0&&iso===1) continue;
    const rows=[row1,row2]; if(!detOK(rows,2)||Math.abs(k)>15||(p===0)) continue;
    const t1=vars[iso]+' = '+cf(m,vars[oth])+(k===0?'':sg(k));
    const sub=cf(m,vars[oth])+(k===0?'':sg(k)), t2=linStr(row2,vars);
    // substitution : eq2 avec vars[iso] remplacé
    const c1=row2[iso], c2=row2[oth], coef=c2+c1*m, cst=c1*k, rhs=row2[2]-cst;
    const stepsArr=[step('Repère l\'équation où une inconnue est isolée',M(t1)+' : on peut remplacer '+M(vars[iso])+' par '+M(sub)+'.'),
      step('Substitue dans l\'autre équation',M(linStr(row2,vars).replace(new RegExp(vars[iso]),'('+sub+')')),'On met des parenthèses autour de l\'expression remplacée.'),
      step('Développe et résous',M(cf(c1,'('+sub+')').replace(/^1\(/,'(')+(c2>=0?' + ':' - ')+cf(Math.abs(c2),vars[oth])+' = '+row2[2]),M(cf(coef,vars[oth])+' = '+rhs),M(vars[oth]+' = '+rStr(rat(rhs,coef)))),
      step('Calcule l\'autre inconnue','Dans '+M(t1)+' : '+M(vars[iso]+' = '+cf(m,'('+sol[oth]+')').replace(/^1\(/,'(')+(k===0?'':sg(k))+' = '+sol[iso])),
      step('Vérifie dans les deux équations',...verifLines(rows,vars,sol.map(x=>rat(x))))];
    const wrongX=rat(row2[2]-cst+0,c2+c1*m), mist=[];
    // oubli des parenthèses : c1*m*oth + k au lieu de c1*(m*oth+k)  → (c1*m + c2) oth + k = rhs2
    const oNP=rat(row2[2]-k,coef), iNP=rAdd(rMul(rat(m),oNP),rat(k));
    mist.push(assignMistake(vars,sol,'sys-subst','Quand tu remplaces '+M(vars[iso])+' par '+M(sub)+', mets l\'expression entre <b>parenthèses</b> : le coefficient '+M(String(c1))+' multiplie <b>tous</b> ses termes, y compris '+M(String(k))+'.',iso===1?[oNP,iNP].map((x,j)=>x):[iNP,oNP]));
    const a1=rat(sol[oth]), bad=rSub(rMul(rat(m),a1),rat(k));
    mist.push(assignMistake(vars,sol,'sys-signe','Pour calculer '+M(vars[iso])+', remplace '+M(vars[oth])+' dans '+M(t1)+' en gardant le signe de '+M(String(k))+'.',iso===1?[rat(sol[0]),bad].slice(0,2).map((x,j)=>j===0?rat(sol[oth]):x):[bad,rat(sol[oth])]));
    mist.push(assignMistake(vars,sol,'sys-oubli','Ne mélange pas les inconnues : la première valeur trouvée correspond à '+M(vars[oth])+', l\'autre à '+M(vars[iso])+'.',[rat(sol[1]),rat(sol[0])]));
    return mkSys({vars,rows,texts:[t1,t2],steps:stepsArr,mistakes:mist,
      hints:['Une équation donne déjà '+M(vars[iso])+' en fonction de '+M(vars[oth])+' : remplace '+M(vars[iso])+' par cette expression dans l\'autre équation.','Tu obtiens une équation à une seule inconnue ('+M(vars[oth])+') : résous-la, puis retrouve l\'autre inconnue.'],
      instr:'Résous le système',hintline:SYS_HINT,placeholder:X+' = 2 ; '+Y+' = 3'});
  }
  return genSys1();
}
/* ---- Niveau 2 : addition / soustraction ---- */
function mistakeElim(rows,vars,sol,elimCol,m1,m2,opts){
  // recalcule avec une erreur : rhs non multiplié, ou mauvais signe sur le second membre
  const [r1,r2]=rows, other=1-elimCol;
  const n1=r1.map((x,j)=>j===2&&opts.noMult?x:x*m1), n2=r2.map((x,j)=>x*m2);
  const same=Math.sign(n1[elimCol])===Math.sign(n2[elimCol]);
  const co=n1[other]-(same?1:-1)*n2[other], rhs=(n1[2]-(same?1:-1)*n2[2])+(opts.signRhs?2*(same?1:-1)*n2[2]:0);
  if(co===0) return null; const ov=rat(rhs,co); const back=rDivide(rSub(rat(r1[2]),rMul(rat(r1[other]),ov)),rat(r1[elimCol]));
  const res=[]; res[elimCol]=back; res[other]=ov; return res;
}
function genSysElim(level){
  const vars=pick(PAIRS);
  for(let i=0;i<400;i++){
    const sol=pickSol(2,-6,6), ec=rnd(0,1), oc=1-ec;
    let r1=[nz(-5,5),nz(-5,5)], r2;
    let m1=1,m2=1;
    if(level===2){ r2=[nz(-5,5),nz(-5,5)]; r2[ec]=pick([1,-1])*Math.abs(r1[ec]); }
    else { r2=[nz(-5,5),nz(-5,5)]; if(Math.abs(r1[ec])===Math.abs(r2[ec])) continue; const L=lcm(Math.abs(r1[ec]),Math.abs(r2[ec])); m1=L/Math.abs(r1[ec]); m2=L/Math.abs(r2[ec]); if(L>12) continue; }
    r1.push(dot(r1,sol)); r2.push(dot(r2,sol)); const rows=[r1,r2];
    if(level===2&&(!detOK(rows,2)||(r1[0]===r2[0]&&r1[1]===r2[1]))) continue;
    if(level===3){
      const r=Math.random();
      if(r<0.1){ const k=pick([2,3,-2]); r2=[r1[0]*k,r1[1]*k,r1[2]*k+pick([1,2,3,-2])]; rows[1]=r2; if(rows.some(x=>x.slice(0,2).every(c=>c===0))) continue; return finalizeSys(vars,[r1,r2],null,'none'); }
      if(r<0.2){ const k=pick([2,3,-2,-1]); r2=[r1[0]*k,r1[1]*k,r1[2]*k]; rows[1]=r2; return finalizeSys(vars,[r1,r2],null,'all'); }
      if(!detOK(rows,2)) continue;
    }
    return finalizeSys(vars,rows,{sol,ec,oc,m1,m2},'unique');
  }
  return genSysElim(level);
}
function finalizeSys(vars,rows,info,type){
  const n=2;
  if(type!=='unique'){
    const [r1,r2]=rows, k=r2[0]/r1[0];
    const steps=[step('Repère un multiple','Les coefficients de '+M(vars[0])+' et '+M(vars[1])+' de (2) sont '+M(String(k))+' fois ceux de (1).'),
      step('Élimine une inconnue','On calcule (2) − '+M(String(k))+' × (1) :',M('0'+vars[0]+' + 0'+vars[1]+' = '+(r2[2]-k*r1[2]))),
      step('Conclus',type==='none'?'On obtient l\'égalité fausse '+M('0 = '+(r2[2]-k*r1[2]))+' : le système n\'a aucune solution.':'On obtient '+M('0 = 0')+' : les deux équations sont équivalentes, le système a une infinité de solutions.')];
    return mkSys({vars,rows,steps,hints:['Regarde si une équation est un multiple de l\'autre : que se passe-t-il quand tu élimines une inconnue ?','Si tu obtiens '+M('0 = 0')+', il y a une infinité de solutions ; si tu obtiens une égalité fausse comme '+M('0 = 5')+', il n\'y en a aucune.'],
      mistakes:[],instr:'Résous le système',hintline:SYS_HINT,placeholder:'aucune solution'});
  }
  const {sol,ec,oc,m1,m2}=info, [r1,r2]=rows;
  const g=gaussLines(rows,vars,[ec]);
  const steps=[step('Choisis l\'inconnue à éliminer','Les coefficients de '+M(vars[ec])+' permettent d\'éliminer '+M(vars[ec])+(m1>1||m2>1?' après multiplication des équations.':' directement par addition ou soustraction.')),
    step('Combine et résous',...g.lines),step('Vérifie dans le système de départ',...verifLines(rows,vars,g.vals))];
  const mist=[];
  const w1=mistakeElim(rows,vars,sol,ec,m1,m2,{signRhs:true}); if(w1) mist.push(assignMistake(vars,sol,'sys-signe','Quand tu additionnes ou soustrais deux équations, applique la même opération <b>aux deux membres</b> : attention au signe du second membre.',w1));
  if(m1>1||m2>1){ const w2=mistakeElim(rows,vars,sol,ec,m1,m2,{noMult:true}); if(w2) mist.push(assignMistake(vars,sol,'sys-mult','Quand tu multiplies une équation par un nombre, multiplie <b>chaque terme</b> des deux membres, y compris le second membre.',w2)); }
  mist.push(assignMistake(vars,sol,'sys-oubli','Vérifie l\'ordre : la première valeur est celle de '+M(vars[0])+', la seconde celle de '+M(vars[1])+'.',[rat(sol[1]),rat(sol[0])]));
  mist.push(assignMistake(vars,sol,'sys-signe','Le résultat est proche : vérifie le signe de la valeur trouvée en remplaçant dans les deux équations.',[rat(-sol[0]),rat(sol[1])]));
  return mkSys({vars,rows,steps,mistakes:mist,
    hints:['Pour éliminer '+M(vars[ec])+', il faut des coefficients opposés (on additionne) ou égaux (on soustrait)'+(m1>1||m2>1?' : multiplie d\'abord une ou deux équations.':'.'),'Après élimination tu obtiens une équation à une inconnue. Résous-la, puis remplace dans une équation de départ pour trouver l\'autre inconnue.'],
    instr:'Résous le système',hintline:SYS_HINT,placeholder:vars[0]+' = 2 ; '+vars[1]+' = 3'});
}
const genSys2=()=>genSysElim(2), genSys3=()=>genSysElim(3);

/* ---- Niveaux 4 et 5 : trois inconnues ---- */
function genSys4(){
  const vars=pick(TRIPLES);
  for(let i=0;i<300;i++){
    const sol=pickSol(3,-5,6), k=pick([2,3,-2,1,-1]), s1=pick([1,-1]);
    const rows=[[1,1,1],[s1,-s1,0],[0,1,k]].map(r=>r.slice());
    if(Math.random()<0.5){ rows[1]=[1,-1,0]; } 
    rows[0].push(dot(rows[0],sol)); rows[1].push(dot(rows[1],sol)); rows[2].push(dot(rows[2],sol));
    if(!detOK(rows,3)) continue;
    const order=[2,1];             // on élimine z puis y ? on choisit l'ordre le plus simple
    const g=gaussLines(rows,vars,[0,1]);
    const steps=[step('Repère la structure','L\'équation (2) ne contient que '+M(vars[0])+' et '+M(vars[1])+', l\'équation (3) que '+M(vars[1])+' et '+M(vars[2])+'.'),
      step('Élimine successivement les inconnues',...g.lines),step('Vérifie dans les trois équations',...verifLines(rows,vars,g.vals))];
    const mist=[assignMistake(vars,sol,'sys-oubli','Vérifie tes valeurs dans <b>les trois</b> équations : une seule ne suffit pas.',[rat(sol[0]),rat(sol[2]),rat(sol[1])]),
      assignMistake(vars,sol,'sys-signe','Attention aux signes quand tu remplaces une inconnue déjà trouvée.',[rat(-sol[0]),rat(sol[1]),rat(sol[2])]),
      assignMistake(vars,sol,'sys-signe','Attention aux signes quand tu remplaces une inconnue déjà trouvée.',[rat(sol[0]),rat(sol[1]),rat(-sol[2])])];
    return mkSys({vars,rows,steps,mistakes:mist,
      hints:['Une équation ne contient que deux inconnues : combine-la avec une autre pour n\'avoir plus qu\'une seule inconnue.','Élimine la même inconnue dans deux couples d\'équations : tu obtiens un système de deux équations à deux inconnues.','Résous ce petit système, puis remonte dans les équations pour trouver la dernière inconnue.'],
      instr:'Résous le système à 3 inconnues',hintline:SYS_HINT,placeholder:vars[0]+' + '+vars[1]+' = 4\n'+vars[0]+' = 3 ; '+vars[1]+' = 1 ; '+vars[2]+' = 2'});
  }
  return genSys4();
}
function genSys5(){
  const vars=pick(TRIPLES);
  for(let i=0;i<500;i++){
    const sol=pickSol(3,-5,5), rows=[];
    for(let r=0;r<3;r++){ const row=[rnd(-3,3),rnd(-3,3),rnd(-3,3)]; if(row.filter(x=>x!==0).length<2) { r--; continue; } row.push(dot(row,sol)); rows.push(row); }
    if(!detOK(rows,3)||rows.some(r=>Math.abs(r[3])>40)) continue;
    const g=gaussLines(rows,vars,[0,1]);
    if(g.lines.some(l=>l.length>400)) continue;
    const steps=[step('Choisis un ordre d\'élimination','On élimine '+M(vars[0])+' avec deux couples d\'équations, puis '+M(vars[1])+'.'),
      step('Élimine et résous',...g.lines),step('Vérifie dans les trois équations',...verifLines(rows,vars,g.vals))];
    const mist=[assignMistake(vars,sol,'sys-signe','Attention aux signes : vérifie chaque valeur dans les trois équations.',[rat(sol[0]),rat(sol[1]),rat(-sol[2])]),
      assignMistake(vars,sol,'sys-signe','Attention aux signes : vérifie chaque valeur dans les trois équations.',[rat(sol[0]),rat(-sol[1]),rat(sol[2])]),
      assignMistake(vars,sol,'sys-oubli','Vérifie l\'ordre des inconnues dans ta réponse.',[rat(sol[1]),rat(sol[0]),rat(sol[2])])];
    return mkSys({vars,rows,steps,mistakes:mist,
      hints:['Élimine la même inconnue (par exemple '+M(vars[0])+') entre les équations (1) et (2), puis entre (1) et (3).','Tu obtiens deux équations à deux inconnues : élimine encore une inconnue pour en trouver une seule, puis remonte.'],
      instr:'Résous le système à 3 inconnues',hintline:SYS_HINT,placeholder:vars[0]+' = 1 ; '+vars[1]+' = 2 ; '+vars[2]+' = 3'});
  }
  return genSys5();
}
TOPICS['sy-1']={kind:'system',level:1,label:'Substitution (2 inconnues)',gen:genSys1};
TOPICS['sy-2']={kind:'system',level:2,label:'Addition ou soustraction',gen:genSys2};
TOPICS['sy-3']={kind:'system',level:3,label:'Élimination avec multiplication',gen:genSys3};
TOPICS['sy-4']={kind:'system',level:4,label:'Trois inconnues guidées',gen:genSys4};
TOPICS['sy-5']={kind:'system',level:5,label:'Trois inconnues',gen:genSys5};

/* ---- Problèmes à 2 et 3 inconnues ---- */
function sysProblem(o){
  const tx=TX(o.text), vars=o.vars, n=vars.length, sol=solveLin(o.rows,n);
  if(sol.type!=='unique'||!sol.vals.every(v=>v[1]===1&&v[0]>=o.min)) return null;
  const g=gaussLines(o.rows,vars,vars.map((_,i)=>i).slice(0,n-1));
  const steps=[step('Choisis les inconnues',...o.unk),step('Traduis chaque information par une équation',...o.model),step('Résous le système',...g.lines),step('Vérifie et conclus',...verifLines(o.rows,vars,g.vals),o.sentence(g.vals.map(v=>v[0])))];
  const ex=mkSys({vars,rows:o.rows,texts:o.texts,steps,mistakes:(o.wrong||[]).map(w=>({tag:'sys-modele',msg:w[0],row:w[1]})),
    hints:['Repère les '+n+' quantités inconnues et donne-leur une lettre (c\'est déjà fait dans l\'énoncé).','Chaque phrase de l\'énoncé qui donne une information numérique fournit une équation : il t\'en faut '+n+'.','Pose le système (une équation par ligne), puis résous-le par substitution ou élimination.'],
    instr:'Pose le système, puis résous-le',hintline:'Écris d\'abord les '+n+' équations qui traduisent l\'énoncé (une par ligne), puis les étapes de résolution, et termine par les valeurs : '+vars.map((v,i)=>v+' = …').join(' ; ')+'.',placeholder:o.rows.map(r=>linStr(r,vars)).join('\n')+'\n'+vars.map(v=>v+' = …').join(' ; ')});
  ex.word=true; ex.html='<div>'+tx.html+'</div>'; ex.statement=tx.plain; ex.problem2=true;
  return ex;
}
function pbAchats2(){
  for(let i=0;i<200;i++){
    const p=rnd(1,6), q=rnd(2,9), a1=rnd(1,4), b1=rnd(1,4), a2=rnd(1,4), b2=rnd(1,4); if(a1*b2===a2*b1) continue;
    const c1=a1*p+b1*q, c2=a2*p+b2*q, items=pick([['stylo','stylos','cahier','cahiers'],['vis','vis','écrou','écrous'],['règle','règles','équerre','équerres']]);
    const pl=(n,s,pp)=>n+' '+(n>1?pp:s);
    const ex=sysProblem({vars:['x','y'],min:1,rows:[[a1,b1,c1],[a2,b2,c2]],
      text:'Pour '+c1+' CHF, on achète '+pl(a1,items[0],items[1])+' et '+pl(b1,items[2],items[3])+'. Pour '+c2+' CHF, on achète '+pl(a2,items[0],items[1])+' et '+pl(b2,items[2],items[3])+'. On note «x» le prix d\'un '+items[0]+' et «y» le prix d\'un '+items[2]+' (en CHF). Quels sont ces prix ?',
      unk:[M('x')+' est le prix d\'un '+items[0]+', '+M('y')+' celui d\'un '+items[2]+'.'],
      model:['Premier achat : '+M(cf(a1,'x')+' + '+cf(b1,'y')+' = '+c1),'Deuxième achat : '+M(cf(a2,'x')+' + '+cf(b2,'y')+' = '+c2)],
      wrong:[['Les prix doivent multiplier les <b>quantités</b> : '+M('x')+' est le prix d\'un '+items[0]+', il est multiplié par le nombre de '+items[1]+' achetés.',[b1,a1,c1]]],
      sentence:v=>'Un '+items[0]+' coûte <b>'+v[0]+'</b> CHF et un '+items[2]+' coûte <b>'+v[1]+'</b> CHF.'});
    if(ex) return ex;
  }
}
function pbPieces2(){
  for(let i=0;i<200;i++){
    const [c1,c2]=pick([[2,5],[1,2],[2,10],[5,10],[1,5]]), x0=rnd(3,20), y0=rnd(3,20), N=x0+y0, T=c1*x0+c2*y0;
    const ex=sysProblem({vars:['x','y'],min:1,rows:[[1,1,N],[c1,c2,T]],
      text:'Une caisse contient '+N+' pièces, les unes de '+c1+' CHF, les autres de '+c2+' CHF, pour un total de '+T+' CHF. On note «x» le nombre de pièces de '+c1+' CHF et «y» le nombre de pièces de '+c2+' CHF. Combien y a-t-il de pièces de chaque sorte ?',
      unk:[M('x')+' est le nombre de pièces de '+c1+' CHF, '+M('y')+' celui des pièces de '+c2+' CHF.'],
      model:['Nombre de pièces : '+M('x + y = '+N),'Valeur totale : '+M(cf(c1,'x')+' + '+cf(c2,'y')+' = '+T)],
      wrong:[['Le total en CHF s\'obtient en multipliant chaque <b>nombre de pièces</b> par sa valeur.',[c2,c1,T]],['La première équation compte les pièces (pas les CHF) : '+M('x + y')+' égale le nombre total de pièces.',[1,1,T]]],
      sentence:v=>'Il y a <b>'+v[0]+'</b> pièces de '+c1+' CHF et <b>'+v[1]+'</b> pièces de '+c2+' CHF.'});
    if(ex) return ex;
  }
}
function pbAges2(){
  for(let i=0;i<300;i++){
    const y0=rnd(8,20), k=rnd(2,6), m=pick([2,3,4]), x0=k+m*(y0-k); if(x0<20||x0>60||y0-k<=0) continue; const S=x0+y0, nm=pick(['un père','une mère']);
    const ex=sysProblem({vars:['x','y'],min:1,rows:[[1,1,S],[1,-m,k-m*k]],
      text:'La somme des âges d\'"'+nm+'" et de son enfant est '+S+' ans. Il y a '+k+' ans, l\'âge du parent était '+m+' fois celui de l\'enfant. On note «x» l\'âge actuel du parent et «y» celui de l\'enfant. Quels sont ces âges ?'.replace('"','').replace('"',''),
      unk:[M('x')+' est l\'âge actuel du parent, '+M('y')+' celui de l\'enfant.'],
      model:['Somme des âges : '+M('x + y = '+S),'Il y a '+k+' ans : '+M('x - '+k)+' et '+M('y - '+k),'Le parent avait '+m+' fois l\'âge : '+M('x - '+k+' = '+m+'(y - '+k+')')],
      wrong:[['Il y a '+k+' ans, il faut retrancher '+k+' aux <b>deux</b> âges : '+M('x - '+k)+' et '+M('y - '+k)+'.',[1,-m,0]]],
      sentence:v=>'Le parent a <b>'+v[0]+'</b> ans et l\'enfant <b>'+v[1]+'</b> ans.'});
    if(ex) return ex;
  }
}
function pbRect2(){
  for(let i=0;i<200;i++){
    const l=rnd(6,25), w=rnd(2,l-1), P=2*(l+w), d=l-w;
    const ex=sysProblem({vars:['x','y'],min:1,rows:[[2,2,P],[1,-1,d]],texts:null,
      text:'Un rectangle a un périmètre de '+P+' cm. Sa longueur dépasse sa largeur de '+d+' cm. On note «x» la longueur et «y» la largeur (en cm). Quelles sont les dimensions de ce rectangle ?',
      unk:[M('x')+' est la longueur, '+M('y')+' la largeur (en cm).'],
      model:['Périmètre : '+M('2(x + y) = '+P)+', soit '+M('2x + 2y = '+P),'La longueur dépasse la largeur de '+d+' : '+M('x - y = '+d)],
      wrong:[['Le périmètre est <b>deux fois</b> la somme longueur + largeur : '+M('2(x + y)')+'.',[1,1,P]],['« Dépasse de '+d+' » se traduit par une différence : longueur − largeur = '+d+'.',[1,1,d]]],
      sentence:v=>'La longueur est de <b>'+v[0]+'</b> cm et la largeur de <b>'+v[1]+'</b> cm.'});
    if(ex) return ex;
  }
}
function pbMasses2(){
  for(let i=0;i<200;i++){
    const A=rnd(2,15), B=rnd(2,15), a1=rnd(1,5), b1=rnd(1,5), a2=rnd(1,5), b2=rnd(1,5); if(a1*b2===a2*b1||A===B) continue;
    const c1=a1*A+b1*B, c2=a2*A+b2*B;
    const ex=sysProblem({vars:['x','y'],min:1,rows:[[a1,b1,c1],[a2,b2,c2]],
      text:'Un atelier utilise deux types de vis, A et B. Un sachet de '+a1+' vis A et '+b1+' vis B pèse '+c1+' g ; un sachet de '+a2+' vis A et '+b2+' vis B pèse '+c2+' g. On note «x» la masse d\'une vis A et «y» celle d\'une vis B (en g). Quelles sont ces masses ?',
      unk:[M('x')+' est la masse d\'une vis A, '+M('y')+' celle d\'une vis B (en g).'],
      model:['Premier sachet : '+M(cf(a1,'x')+' + '+cf(b1,'y')+' = '+c1),'Deuxième sachet : '+M(cf(a2,'x')+' + '+cf(b2,'y')+' = '+c2)],
      wrong:[['Chaque masse se multiplie par le <b>nombre de vis</b> de ce type dans le sachet.',[b1,a1,c1]]],
      sentence:v=>'Une vis A pèse <b>'+v[0]+'</b> g et une vis B pèse <b>'+v[1]+'</b> g.'});
    if(ex) return ex;
  }
}
function pbAchats3(){
  for(let i=0;i<300;i++){
    const P=[rnd(1,6),rnd(1,6),rnd(2,9)], rows=[];
    for(let r=0;r<3;r++){ const row=[rnd(1,3),rnd(0,3),rnd(0,3)]; if(row.filter(x=>x>0).length<2){ r--; continue; } row.push(dot(row,P)); rows.push(row); }
    const nm=['un stylo','un cahier','une gomme'], nmp=['stylos','cahiers','gommes'];
    const desc=row=>[0,1,2].filter(j=>row[j]>0).map(j=>row[j]+' '+(row[j]>1?nmp[j]:nm[j].split(' ')[1])).join(', ').replace(/, ([^,]*)$/,' et $1');
    const ex=sysProblem({vars:['x','y','z'],min:1,rows,
      text:'Trois achats sont réalisés : '+rows.map((r,i)=>'l\'achat '+(i+1)+' ('+desc(r)+') coûte '+r[3]+' CHF').join(' ; ')+'. On note «x» le prix d\'un stylo, «y» celui d\'un cahier et «z» celui d\'une gomme (en CHF). Quels sont ces trois prix ?',
      unk:[M('x')+' : prix d\'un stylo ; '+M('y')+' : prix d\'un cahier ; '+M('z')+' : prix d\'une gomme.'],
      model:rows.map((r,i)=>'Achat '+(i+1)+' : '+M(linStr(r,['x','y','z']))),
      wrong:[['Chaque prix se multiplie par la quantité achetée de cet article dans <b>cet</b> achat.',[rows[0][1],rows[0][0],rows[0][2],rows[0][3]]]],
      sentence:v=>'Un stylo coûte <b>'+v[0]+'</b> CHF, un cahier <b>'+v[1]+'</b> CHF et une gomme <b>'+v[2]+'</b> CHF.'});
    if(ex) return ex;
  }
}
function pbNombres3(){
  for(let i=0;i<300;i++){
    const y0=rnd(2,12), d=rnd(1,9), x0=y0+d, z0=2*y0, S=x0+y0+z0;
    const ex=sysProblem({vars:['x','y','z'],min:1,rows:[[1,1,1,S],[1,-1,0,d],[0,-2,1,0]],
      text:'La somme de trois nombres «x», «y» et «z» est '+S+'. Le premier dépasse le deuxième de '+d+'. Le troisième est le double du deuxième. Quels sont ces trois nombres ?',
      unk:[M('x')+', '+M('y')+' et '+M('z')+' sont les trois nombres.'],
      model:['La somme : '+M('x + y + z = '+S),'Le premier dépasse le deuxième de '+d+' : '+M('x - y = '+d),'Le troisième est le double du deuxième : '+M('z = 2y')+', soit '+M('-2y + z = 0')],
      wrong:[['« Le double du deuxième » se traduit par '+M('z = 2y')+' (le troisième est égal à deux fois le deuxième).',[0,2,-1,0]],['« Dépasse de '+d+' » : premier − deuxième = '+d+'.',[1,-1,0,-d]]],
      sentence:v=>'Les trois nombres sont <b>'+v[0]+'</b>, <b>'+v[1]+'</b> et <b>'+v[2]+'</b>.'});
    if(ex) return ex;
  }
}
function pbAngles3(){
  for(let i=0;i<300;i++){
    const B=rnd(20,50), k=rnd(5,30), A=B+k, C=180-A-B; if(C<=10) continue; const m=C-2*B;
    const ex=sysProblem({vars:['x','y','z'],min:1,rows:[[1,1,1,180],[1,-1,0,k],[0,-2,1,m]],
      text:'Dans un triangle, on note «x», «y» et «z» les mesures de ses angles (en degrés). Le premier angle mesure '+k+'° de plus que le deuxième. Le troisième angle mesure '+(m>=0?m+'° de plus que le double':(-m)+'° de moins que le double')+' du deuxième. Quelles sont les mesures des trois angles ?',
      unk:[M('x')+', '+M('y')+' et '+M('z')+' sont les mesures des angles (en degrés).'],
      model:['La somme des angles d\'un triangle vaut 180° : '+M('x + y + z = 180'),'Premier angle : '+M('x = y + '+k)+', soit '+M('x - y = '+k),'Troisième angle : '+M('z = 2y '+(m>=0?'+ ':'- ')+Math.abs(m))+', soit '+M('-2y + z = '+m)],
      wrong:[['La somme des angles d\'un triangle vaut <b>180°</b>.',[1,1,1,360]]],
      sentence:v=>'Les angles mesurent <b>'+v[0]+'°</b>, <b>'+v[1]+'°</b> et <b>'+v[2]+'°</b>.'});
    if(ex) return ex;
  }
}
const pickG=list=>()=>pick(list)();
TOPICS['pb-6']={kind:'problem',level:6,label:'Problèmes à 2 inconnues',gen:pickG([pbAchats2,pbPieces2,pbAges2,pbRect2,pbMasses2])};
TOPICS['pb-7']={kind:'problem',level:7,label:'Problèmes à 3 inconnues',gen:pickG([pbAchats3,pbNombres3,pbAngles3])};
