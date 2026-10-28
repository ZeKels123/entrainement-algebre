'use strict';
/* ===== Dessin sur la figure : crayon, ligne (accrochée aux sommets), gomme ===== */
const DRAW_COL=[['#d9480f','Rouge'],['#1971c2','Bleu'],['#2f9e44','Vert']];
const DRAW_CFG={tool:'',col:0};
function attachDraw(){
  document.querySelectorAll('#statement .geofig').forEach(fig=>{
    const svg=fig.querySelector('svg'); if(!svg||fig.querySelector('.drawbar')) return;
    const NS='http://www.w3.org/2000/svg', strokes=[];
    const layer=document.createElementNS(NS,'g'); layer.setAttribute('class','draw-layer'); svg.appendChild(layer);
    const bar=document.createElement('div'); bar.className='drawbar'; bar.setAttribute('role','toolbar'); bar.setAttribute('aria-label','Outils de dessin sur la figure');
    bar.innerHTML='<span class="dlbl">Dessiner</span>'
      +'<button type="button" data-t="pen" aria-pressed="false" title="Crayon : trait libre">Crayon</button>'
      +'<button type="button" data-t="line" aria-pressed="false" title="Ligne droite, accrochée aux sommets de la figure">Ligne</button>'
      +'<button type="button" data-t="erase" aria-pressed="false" title="Gomme : touche un trait pour le supprimer">Gomme</button>'
      +DRAW_COL.map((c,i)=>'<button type="button" class="dcol" data-c="'+i+'" aria-pressed="false" aria-label="'+c[1]+'" title="'+c[1]+'" style="--dc:'+c[0]+'"></button>').join('')
      +'<button type="button" data-a="undo" title="Annuler le dernier trait">Annuler</button><button type="button" data-a="clear" title="Tout effacer">Effacer</button>';
    fig.appendChild(bar);
    const sync=()=>{ bar.querySelectorAll('[data-t]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===DRAW_CFG.tool))); bar.querySelectorAll('[data-c]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.c===DRAW_CFG.col))); svg.classList.toggle('drawing',!!DRAW_CFG.tool); };
    const el=s=>{ const p=document.createElementNS(NS,'path'); p.setAttribute('class','draw-s'); p.setAttribute('stroke',s.c); p.setAttribute('d',s.pts.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' ')+(s.pts.length===1?' l0.1 0':'')); layer.appendChild(p); s.el=p; };
    const pt=e=>{ const r=svg.getBoundingClientRect(), vb=svg.viewBox&&svg.viewBox.baseVal; if(!vb||!r.width) return [e.clientX,e.clientY]; const sc=Math.min(r.width/vb.width,r.height/vb.height), ox=(r.width-vb.width*sc)/2, oy=(r.height-vb.height*sc)/2; return [(e.clientX-r.left-ox)/sc+vb.x,(e.clientY-r.top-oy)/sc+vb.y]; };
    const verts=()=>[...svg.querySelectorAll('.g-d')].map(c=>[+c.getAttribute('cx'),+c.getAttribute('cy')]);
    const snap=q=>{ let b=null,bd=13; verts().forEach(v=>{ const d=Math.hypot(v[0]-q[0],v[1]-q[1]); if(d<bd){ bd=d; b=v; } }); return b?[b[0],b[1]]:q; };
    const dseg=(p,a,b)=>{ const dx=b[0]-a[0], dy=b[1]-a[1], l=dx*dx+dy*dy, t=l?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/l)):0; return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy); };
    const eraseAt=q=>{ for(let i=strokes.length-1;i>=0;i--){ const s=strokes[i], P=s.pts; let d=1e9; if(P.length===1) d=Math.hypot(P[0][0]-q[0],P[0][1]-q[1]); for(let k=1;k<P.length;k++) d=Math.min(d,dseg(q,P[k-1],P[k])); if(d<10){ s.el.remove(); strokes.splice(i,1); return; } } };
    let cur=null;
    svg.addEventListener('pointerdown',e=>{
      if(!DRAW_CFG.tool||(e.button!=null&&e.button>0)) return; e.preventDefault();
      try{ svg.setPointerCapture(e.pointerId); }catch(x){}
      let q=pt(e);
      if(DRAW_CFG.tool==='erase'){ cur={erase:true}; eraseAt(q); return; }
      if(DRAW_CFG.tool==='line') q=snap(q);
      cur={t:DRAW_CFG.tool,c:DRAW_COL[DRAW_CFG.col][0],pts:[q]}; if(cur.t==='line') cur.pts.push(q.slice()); el(cur);
    });
    svg.addEventListener('pointermove',e=>{
      if(!cur) return; const q=pt(e);
      if(cur.erase){ eraseAt(q); return; }
      if(cur.t==='pen') cur.pts.push(q); else cur.pts[1]=snap(q);
      cur.el.setAttribute('d',cur.pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' '));
    });
    const end=()=>{ if(!cur) return; if(!cur.erase){ if(cur.t==='line'&&Math.hypot(cur.pts[0][0]-cur.pts[1][0],cur.pts[0][1]-cur.pts[1][1])<3) cur.el.remove(); else strokes.push(cur); } cur=null; };
    svg.addEventListener('pointerup',end); svg.addEventListener('pointercancel',end);
    bar.addEventListener('click',e=>{
      const b=e.target.closest('button'); if(!b) return;
      if(b.dataset.t) DRAW_CFG.tool=DRAW_CFG.tool===b.dataset.t?'':b.dataset.t;
      else if(b.dataset.c){ DRAW_CFG.col=+b.dataset.c; if(!DRAW_CFG.tool||DRAW_CFG.tool==='erase') DRAW_CFG.tool='pen'; }
      else if(b.dataset.a==='undo'){ const s=strokes.pop(); if(s) s.el.remove(); }
      else if(b.dataset.a==='clear'){ strokes.splice(0).forEach(s=>s.el.remove()); }
      document.querySelectorAll('#statement .geofig').forEach(f=>f.__sync&&f.__sync());
    });
    fig.__sync=sync; sync();
  });
}
