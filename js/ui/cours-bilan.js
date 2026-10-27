'use strict';
/* ===== Interface : cours, bilan, démarrage ===== */
function ovTable(rows){ return '<div class="card"><h3>Vue d\'ensemble</h3><div class="tbl"><table class="ov"><thead><tr><th>Ce que tu cherches</th><th>Idée clé</th><th>Mode</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('')+'</tbody></table></div></div>'; }
function courseHTML(d){
  if(DOMBR[d]) return '<div class="course">'+(brData(DOMBR[d]).fiches||[]).filter(x=>!x.d||x.d===d).map(x=>'<h2>'+esc(x.t)+'</h2>'+x.html).join('')+'</div>';
  if(d==='geo'){ const ovg=ovTable([['Longueur du contour, surface','Périmètre = somme des côtés ; aire = formule de la figure','Triangles · Quadrilatères'],['Un côté d\'un triangle rectangle',M('a² + b² = c²'),'Pythagore'],['Une longueur avec deux droites parallèles','Rapports égaux (produit en croix)','Thalès'],['Un angle dans un cercle',M('∠ au centre = 2 × ∠ inscrit'),'Cercles'],['Une figure faite de plusieurs formes','Découper, additionner ou soustraire','Figures composées'],['Convertir ou calculer un angle','360° = 400 grades = 2π rad ; somme 180° ; parallèles','Angles et unités'],['Un problème de synthèse (Héron, équation, tangente, secteur d\'anneau)','Combiner plusieurs théorèmes','Niveau 6 de chaque mode']]); return '<div class="course">'+ovg+courseGeo()+'</div>'; }
  const full=courseFull(), inner=full.slice('<div class="course">'.length,full.length-'</div>'.length);
  const secs=inner.split('<h2>').filter(Boolean).map(s=>'<h2>'+s);
  const title=s=>s.slice(4,s.indexOf('</h2>'));
  const ALG=['Développer','Factoriser','Vérifier son résultat'];
  const pick=secs.filter(s=>ALG.includes(title(s))===(d==='alg'));
  const M_=M;
  const ov=d==='alg'
    ? ovTable([
        ['Enlever des parenthèses','Distribuer chaque terme, puis regrouper','Onglet Entraînement · Développer'],
        ['Écrire un produit','Facteur commun, identité remarquable, trinôme, groupement','Onglet Entraînement · Factoriser'],
        ['Contrôler ta réponse','Remplacer la lettre par un nombre, développer à l\'envers','Fiche « Vérifier son résultat »']])
    : ovTable([
        ['Une équation, une inconnue','Isoler l\'inconnue en faisant la même opération des deux côtés','1 inconnue'],
        ['Deux ou trois équations, deux ou trois inconnues','Éliminer une inconnue (substitution ou addition), puis remonter','2 et 3 inconnues'],
        ['Une équation avec '+M_('x^2'),'Produit nul, ou discriminant '+M_('Δ')+' et formule, ou relations de Viète','Second degré'],
        ['Un énoncé à traduire','Choisir les inconnues, écrire une équation par information, résoudre, vérifier dans l\'énoncé','Problèmes']]);
  const chk=d==='eq'?'<h2>Vérifier une solution</h2><div class="card"><h3>Remplacer dans l\'énoncé</h3><ul class="plain"><li><b>Une équation</b> : remplace l\'inconnue par la valeur trouvée dans l\'équation de départ. Les deux membres doivent être égaux.</li><li><b>Un système</b> : remplace dans <b>toutes</b> les équations de départ.</li><li><b>Second degré</b> : contrôle avec Viète, '+M('S = -b/a')+' et '+M('P = c/a')+'.</li><li><b>Un problème</b> : la valeur doit avoir un sens dans l\'énoncé (pas de longueur négative, nombre de personnes entier).</li></ul></div>':'';
  return '<div class="course">'+ov+pick.join('')+chk+'</div>';
}
function courseFull(){
  const F=s=>'<div class="formula">'+M(s)+'</div>';
  const ex=h=>'<p class="example"><span class="lbl">Exemple</span>'+h+'</p>';
  const trapH=(a,b,c)=>'<tr><td>'+a+'</td><td>'+b+'</td><td>'+c+'</td></tr>';
  const trap=(a,b,c)=>'<tr><td>'+M(a)+'</td><td>'+M(b)+'</td><td>'+c+'</td></tr>';
  return '<div class="course">'
  +'<h2>Développer</h2>'
  +'<div class="card"><h3>Distribution simple</h3><p>Le facteur placé devant une parenthèse multiplie <b>chaque</b> terme de la parenthèse.</p>'+F('k(a + b) = ka + kb')
    +ex(M('3(2x - 5) = 3 × 2x + 3 × (-5) = 6x - 15'))+'<p>Si le facteur est négatif, chaque terme change de signe : '+M('-2(x - 4) = -2x + 8')+'.</p></div>'
  +'<div class="card"><h3>Double distribution</h3><p>Chaque terme de la première parenthèse multiplie chaque terme de la seconde : quatre produits, puis on regroupe les termes semblables.</p>'+F('(a + b)(c + d) = ac + ad + bc + bd')
    +ex(M('(x + 3)(2x - 5) = 2x^2 - 5x + 6x - 15 = 2x^2 + x - 15'))+'</div>'
  +'<div class="card"><h3>Identités remarquables</h3>'+F('(a + b)^2 = a^2 + 2ab + b^2')+F('(a - b)^2 = a^2 - 2ab + b^2')+F('(a + b)(a - b) = a^2 - b^2')
    +ex(M('(2x - 3)^2 = (2x)^2 - 2 × 2x × 3 + 3^2 = 4x^2 - 12x + 9'))
    +'<p>Le nombre est lui aussi élevé au carré : '+M('(3x)^2 = 9x^2')+' et non '+M('3x^2')+'. Le double produit '+M('2ab')+' ne disparaît que dans le produit conjugué.</p></div>'
  +'<div class="card"><h3>Signe moins devant une parenthèse</h3><p>Le signe − change le signe de tous les termes de la parenthèse.</p>'+F('A - (B + C) = A - B - C')
    +ex(M('(x^2 + 3x) - (x^2 - 2x) = x^2 + 3x - x^2 + 2x = 5x'))+'</div>'
  +'<div class="card"><h3>Cube d\'un binôme</h3>'+F('(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3')+ex(M('(x + 2)^3 = x^3 + 6x^2 + 12x + 8'))+'</div>'
  +'<h2>Factoriser</h2>'
  +'<div class="card"><h3>Ordre à suivre</h3><ol class="check"><li>Cherche un facteur commun et sors-le en premier.</li>'
    +'<li>Compte les termes. Deux termes : différence de deux carrés ? Trois termes : carré parfait, sinon produit et somme. Quatre termes : groupement.</li>'
    +'<li>Vérifie en développant : tu dois retrouver l\'expression de départ.</li>'
    +'<li>Regarde chaque parenthèse : peut-elle encore être factorisée ? Si oui, la factorisation n\'est pas terminée.</li></ol></div>'
  +'<div class="card"><h3>Facteur commun</h3><p>On cherche le PGCD des coefficients et les lettres présentes dans tous les termes (avec le plus petit exposant), puis on divise chaque terme.</p>'
    +ex(M('12x^2 + 18x = 6x(2x + 3)'))+'<p>Le PGCD de 12 et 18 vaut 6 et la lettre '+M('x')+' est commune. Si le premier terme est négatif, on peut choisir un facteur commun négatif.</p></div>'
  +'<div class="card"><h3>Identités remarquables à l\'envers</h3>'+F('a^2 + 2ab + b^2 = (a + b)^2')+F('a^2 - 2ab + b^2 = (a - b)^2')+F('a^2 - b^2 = (a - b)(a + b)')
    +ex(M('9x^2 - 16 = (3x)^2 - 4^2 = (3x - 4)(3x + 4)'))
    +ex(M('4x^2 + 12x + 9 = (2x + 3)^2'))+'<p>Vérification du double produit : '+M('2 × 2x × 3 = 12x')+'.</p></div>'
  +'<div class="card"><h3>Trinôme avec a = 1</h3>'+F('x^2 + bx + c = (x + r)(x + s)')+'<p>où '+M('r × s = c')+' et '+M('r + s = b')+'. Si '+M('c')+' est positif, '+M('r')+' et '+M('s')+' ont le signe de '+M('b')+'. S\'il est négatif, ils ont des signes opposés.</p>'
    +ex(M('x^2 + 5x + 6 = (x + 2)(x + 3)')+' car '+M('2 × 3 = 6')+' et '+M('2 + 3 = 5')+'.')+'</div>'
  +'<div class="card"><h3>Trinôme avec a différent de 1</h3><ol class="check"><li>Calcule '+M('a × c')+'.</li><li>Trouve deux nombres de produit '+M('a × c')+' et de somme '+M('b')+'.</li><li>Sépare le terme du milieu en deux termes avec ces nombres.</li><li>Factorise par groupement.</li></ol>'
    +ex(M('2x^2 + 7x + 3')+' : '+M('a × c = 6')+', les nombres 1 et 6 conviennent.')
    +'<div class="formula">'+M('2x^2 + x + 6x + 3 = x(2x + 1) + 3(2x + 1) = (2x + 1)(x + 3)')+'</div></div>'
  +'<div class="card"><h3>Groupement et binôme commun</h3><p>Avec quatre termes, on les regroupe deux par deux pour faire apparaître la même parenthèse dans chaque groupe.</p>'
    +ex(M('x^3 + 2x^2 + 3x + 6 = x^2(x + 2) + 3(x + 2) = (x + 2)(x^2 + 3)'))+'</div>'
  +'<h2>Équations à une inconnue</h2>'
  +'<div class="card"><h3>Équation du premier degré</h3><p>On isole l\'inconnue en faisant la même opération dans les deux membres. Un terme qui passe de l\'autre côté du signe = change de signe.</p>'
    +ex(M('3x + 5 = 11')+' → '+M('3x = 11 - 5')+' → '+M('3x = 6')+' → '+M('x = 2'))
    +'<p>Vérification : pour '+M('x = 2')+', '+M('3 × 2 + 5 = 11')+'. Les deux membres sont égaux.</p></div>'
  +'<div class="card"><h3>Inconnue des deux côtés et parenthèses</h3><ol class="check"><li>Développe les parenthèses.</li><li>Regroupe les termes en '+M('x')+' d\'un côté et les nombres de l\'autre.</li><li>Divise par le coefficient de '+M('x')+'.</li></ol>'
    +ex(M('2(x + 3) = 5x - 3')+' → '+M('2x + 6 = 5x - 3')+' → '+M('9 = 3x')+' → '+M('x = 3'))
    +'<p>Si les termes en '+M('x')+' disparaissent : une égalité fausse (par exemple '+M('0 = 4')+') signifie <b>aucune solution</b>, une égalité toujours vraie ('+M('0 = 0')+') signifie <b>tous les réels</b>.</p></div>'
  +'<div class="card"><h3>Règle du produit nul</h3><p>Un produit est nul si et seulement si l\'un de ses facteurs est nul.</p>'+F('A × B = 0 ⇔ A = 0 ou B = 0')
    +ex(M('(x - 3)(2x + 1) = 0')+' donne '+M('x - 3 = 0')+' ou '+M('2x + 1 = 0')+', donc '+M('x = 3')+' ou '+M('x = -1/2'))
    +'<p>La règle ne s\'applique que si le produit vaut <b>0</b>. Pour '+M('(x - 3)(x + 2) = 5')+', on ne peut pas écrire '+M('x - 3 = 5')+'.</p></div>'
  +'<div class="card"><h3>Second degré par factorisation</h3><ol class="check"><li>Ramène tout dans le membre de gauche pour obtenir « ... = 0 ».</li><li>Factorise (facteur commun, différence de deux carrés, trinôme).</li><li>Applique le produit nul : une équation par facteur.</li></ol>'
    +ex(M('x^2 - 9 = 0')+' → '+M('(x - 3)(x + 3) = 0')+' → '+M('x = 3')+' ou '+M('x = -3'))
    +ex(M('x^2 = 3x')+' → '+M('x^2 - 3x = 0')+' → '+M('x(x - 3) = 0')+' → '+M('x = 0')+' ou '+M('x = 3'))
    +'<p>Ne divise jamais par '+M('x')+' : tu perdrais la solution '+M('x = 0')+'.</p></div>'
  +'<div class="card"><h3>Pièges fréquents</h3><div class="tbl"><table class="trap"><thead><tr><th>Erreur fréquente</th><th>Correct</th><th>Pourquoi</th></tr></thead><tbody>'
    +trapH(M('x - 3 = 0')+' donne '+M('x = -3'),M('x - 3 = 0')+' donne '+M('x = 3'),'On ajoute 3 aux deux membres')
    +trapH(M('x^2 = 9')+' donne '+M('x = 3'),M('x^2 = 9')+' donne '+M('x = 3')+' ou '+M('x = -3'),M('(-3)^2 = 9')+' aussi')
    +trapH(M('x^2 = 3x')+' donne '+M('x = 3'),M('x = 0')+' ou '+M('x = 3'),'Diviser par '+M('x')+' fait perdre '+M('x = 0'))
    +trapH(M('(x - 1)(x - 2) = 6')+' donne '+M('x = 7')+' ou '+M('x = 8'),'Ramener d\'abord à 0 dans un membre','Le produit nul exige un produit égal à 0')
    +'</tbody></table></div></div>'
  +'<h2>Systèmes à 2 et 3 inconnues</h2>'
  +'<div class="card"><h3>Ce qu\'est un système</h3><p>Un système est un ensemble d\'équations qui doivent être vraies <b>en même temps</b>. Il faut autant d\'équations que d\'inconnues : deux pour deux inconnues, trois pour trois. La solution est l\'ensemble des valeurs qui vérifient <b>toutes</b> les équations.</p>'
    +'<p>L\'idée est toujours la même : se ramener à <b>une seule équation à une inconnue</b> (on « élimine » les autres), la résoudre, puis remonter pour trouver le reste.</p></div>'
  +'<div class="card"><h3>Méthode 1 : la substitution</h3><p>On isole une inconnue dans une équation, puis on la remplace dans l\'autre. Elle est pratique quand une équation a déjà une inconnue seule, ou avec un coefficient 1.</p>'
    +'<div class="formula">'+M('y = 2x - 1')+'<br>'+M('3x + y = 14')+'</div>'
    +ex('On remplace '+M('y')+' dans la 2e équation : '+M('3x + (2x - 1) = 14')+' → '+M('5x = 15')+' → '+M('x = 3')+'. Puis '+M('y = 2 × 3 - 1 = 5')+'.')
    +'<p>Mets des <b>parenthèses</b> autour de l\'expression remplacée : '+M('3x + 2x - 1')+' est juste ici, mais '+M('4 - (x + 1)')+' ne s\'écrit pas '+M('4 - x + 1')+'.</p></div>'
  +'<div class="card"><h3>Méthode 2 : l\'addition (combinaison)</h3><p>On additionne ou on soustrait deux équations, membre à membre, pour faire disparaître une inconnue. Elle disparaît quand ses coefficients sont <b>opposés</b> (on additionne) ou <b>égaux</b> (on soustrait).</p>'
    +'<div class="formula">'+M('x + y = 12')+'<br>'+M('3x - y = 4')+'</div>'
    +ex('(1) + (2) : '+M('4x = 16')+' → '+M('x = 4')+'. Dans (1) : '+M('4 + y = 12')+' → '+M('y = 8')+'.')
    +'<p>Attention en soustrayant : '+M('(3x + 2y) - (x - 5y)')+' donne '+M('2x + 7y')+' (le signe − change le signe de <b>tous</b> les termes de la 2e équation).</p></div>'
  +'<div class="card"><h3>Quand les coefficients ne sont pas égaux</h3><p>On multiplie une équation (ou les deux) par un nombre, en multipliant <b>chaque terme des deux membres</b>, pour rendre les coefficients d\'une inconnue égaux ou opposés.</p>'
    +'<div class="formula">'+M('2x + 3y = 12')+'<br>'+M('5x - 2y = 11')+'</div>'
    +ex('(1) × 2 : '+M('4x + 6y = 24')+' ; (2) × 3 : '+M('15x - 6y = 33')+'. On additionne : '+M('19x = 57')+' → '+M('x = 3')+'. Puis '+M('2 × 3 + 3y = 12')+' → '+M('y = 2')+'.')
    +'<p>Oublier de multiplier le membre de droite est l\'erreur la plus fréquente.</p></div>'
  +'<div class="card"><h3>Cas particuliers</h3><p>Si, en éliminant, <b>toutes</b> les inconnues disparaissent :</p><ul class="plain">'
    +'<li>on obtient une égalité fausse (par exemple '+M('0 = 5')+') : <b>aucune solution</b> ;</li>'
    +'<li>on obtient une égalité toujours vraie ('+M('0 = 0')+') : <b>une infinité de solutions</b>.</li></ul>'
    +ex(M('x + y = 3')+' et '+M('2x + 2y = 8')+' : (2) − 2 × (1) donne '+M('0 = 2')+', donc aucune solution. Avec '+M('2x + 2y = 6')+', on obtient '+M('0 = 0')+' : infinité de solutions.')+'</div>'
  +'<div class="card"><h3>Trois inconnues</h3><p>On élimine <b>la même inconnue</b> deux fois, pour obtenir un système de deux équations à deux inconnues, puis on continue comme avant.</p>'
    +'<div class="formula">'+M('x + y + z = 6')+'<br>'+M('2x - y + z = 3')+'<br>'+M('x + 2y - z = 2')+'</div>'
    +'<ol class="check"><li>Élimine '+M('z')+' avec (1) + (3) : '+M('2x + 3y = 8')+' (A).</li><li>Élimine '+M('z')+' avec (2) + (3) : '+M('3x + y = 5')+' (B).</li><li>Résous (A) et (B) : dans (B) '+M('y = 5 - 3x')+', puis '+M('2x + 15 - 9x = 8')+' donne '+M('x = 1')+' et '+M('y = 2')+'.</li><li>Remonte dans (1) : '+M('z = 6 - 1 - 2 = 3')+'.</li></ol></div>'
  +'<div class="card"><h3>Vérifier un système</h3><p>Remplace les valeurs trouvées dans <b>toutes</b> les équations de départ, y compris celle que tu n\'as pas utilisée en dernier. Une valeur peut vérifier une équation sans vérifier l\'autre.</p>'
    +ex('Pour '+M('x = 3')+' et '+M('y = 2')+' : '+M('2 × 3 + 3 × 2 = 12')+' et '+M('5 × 3 - 2 × 2 = 11')+'. Les deux équations sont vérifiées.')+'</div>'
  +'<div class="card"><h3>Quelle méthode choisir ?</h3><ol class="check"><li>Une inconnue est déjà isolée ou a le coefficient 1 : substitution.</li><li>Les coefficients d\'une inconnue sont égaux ou opposés : addition ou soustraction.</li><li>Sinon : multiplie pour les rendre égaux ou opposés (le plus petit multiple commun garde des nombres simples).</li></ol></div>'
  +'<h2>Équation du second degré : discriminant et formule</h2>'
  +'<div class="card"><h3>Forme générale et coefficients</h3><p>Toute équation du second degré se met sous la forme :</p>'+F('ax^2 + bx + c = 0')
    +'<p>Ramène tout dans le membre de gauche, puis lis <b>a</b> (devant '+M('x^2')+'), <b>b</b> (devant '+M('x')+') et <b>c</b> (le nombre seul), avec leur signe. Un terme absent a pour coefficient 0.</p>'
    +ex(M('3x^2 = 2x + 5')+' devient '+M('3x^2 - 2x - 5 = 0')+' : '+M('a = 3')+', '+M('b = -2')+', '+M('c = -5')+'.')+'</div>'
  +'<div class="card"><h3>Le discriminant</h3>'+F('Δ = b^2 - 4ac')
    +'<table class="trap"><thead><tr><th>Signe de Δ</th><th>Nombre de solutions</th><th>Solutions</th></tr></thead><tbody>'
    +trapH(M('Δ > 0'),'Deux',M('x = (-b - √Δ)/(2a)')+' et '+M('x = (-b + √Δ)/(2a)'))
    +trapH(M('Δ = 0'),'Une (double)',M('x = -b/(2a)'))
    +trapH(M('Δ < 0'),'Aucune solution réelle','Une racine carrée n\'est pas définie pour un nombre négatif')
    +'</tbody></table>'
    +ex(M('2x^2 - 5x + 3 = 0')+' : '+M('Δ = (-5)^2 - 4 × 2 × 3 = 25 - 24 = 1')+', puis '+M('x = (5 ± 1)/4')+' donne '+M('x = 1')+' ou '+M('x = 3/2')+'.')
    +'<p><b>Piège n°1</b> : '+M('b^2')+' est toujours positif. Écris '+M('(-5)^2 = 25')+' et jamais '+M('-5^2')+' (qui vaut '+M('-25')+'). <b>Piège n°2</b> : si '+M('a × c')+' est négatif, alors '+M('-4ac')+' est positif.</p></div>'
  +'<div class="card"><h3>Solutions avec une racine carrée</h3><p>Si '+M('Δ')+' n\'est pas un carré parfait, les solutions sont irrationnelles : on les écrit sous forme exacte. Une valeur décimale arrondie n\'est pas une réponse exacte.</p>'
    +ex(M('x^2 + 2x - 7 = 0')+' : '+M('Δ = 4 + 28 = 32')+' et '+M('√32 = √16 × √2 = 4√2')+'. Donc '+M('x = (-2 ± 4√2)/2 = -1 ± 2√2')+'.')
    +'<p>Pour simplifier '+M('√n')+' : cherche le plus grand carré parfait qui divise '+M('n')+' (4, 9, 16, 25, 36...). Puis simplifie la fraction en divisant <b>tous</b> les termes du numérateur et le dénominateur.</p></div>'
  +'<div class="card"><h3>Les relations de Viète</h3><p>Pour '+M('ax^2 + bx + c = 0')+' avec deux solutions '+M('x₁')+' et '+M('x₂')+' :</p>'+F('S = x₁ + x₂ = -b/a')+F('P = x₁ × x₂ = c/a')
    +ex(M('2x^2 - 5x + 3 = 0')+' : '+M('S = 5/2')+' et '+M('P = 3/2')+'. On retrouve bien '+M('1 + 3/2 = 5/2')+' et '+M('1 × 3/2 = 3/2')+'.')
    +'<p>Elles servent à <b>vérifier</b> des solutions sans refaire le calcul, et à répondre <b>sans résoudre</b>.</p></div>'
  +'<div class="card"><h3>Applications de Viète</h3><ul class="plain"><li><b>Autre solution</b> : si une solution est connue, l\'autre vaut '+M('S - x₁')+' (ou '+M('P / x₁')+').</li>'
    +'<li><b>Deux nombres de somme S et de produit P</b> : ce sont les solutions de '+M('x^2 - Sx + P = 0')+'.</li>'
    +'<li><b>Écrire une équation</b> de solutions données : '+M('x^2 - Sx + P = 0')+' (attention aux signes).</li>'
    +'<li><b>Expressions symétriques</b> :</li></ul>'
    +'<div class="tbl"><table class="trap"><thead><tr><th>Expression</th><th>Avec S et P</th></tr></thead><tbody>'
    +trapH(M('x₁^2 + x₂^2'),M('S^2 - 2P'))+trapH(M('1/x₁ + 1/x₂'),M('S/P'))+trapH(M('(x₁ - 1)(x₂ - 1)'),M('P - S + 1'))+trapH(M('(x₁ - x₂)^2'),M('S^2 - 4P'))
    +'</tbody></table></div></div>'
  +'<div class="card"><h3>Quelle méthode choisir ?</h3><ol class="check"><li>Le membre de gauche est déjà un produit égal à 0 : règle du produit nul.</li><li>Pas de terme constant ('+M('ax^2 + bx = 0')+') : facteur commun '+M('x')+'.</li><li>Pas de terme en '+M('x')+' ('+M('ax^2 + c = 0')+') : différence de deux carrés ou '+M('x^2 = n')+'.</li><li>Sinon, ou si tu hésites : discriminant et formule, qui marche toujours.</li></ol></div>'
  +'<h2>Mettre un problème en équation</h2>'
  +'<div class="card"><h3>Méthode en quatre temps</h3><ol class="check"><li><b>Inconnue</b> : repère ce qu\'on cherche et donne-lui une lettre (avec son unité).</li><li><b>Traduction</b> : exprime chaque information avec cette lettre. Cherche la phrase qui dit que deux quantités sont égales : elle donne le signe =.</li><li><b>Résolution</b> : résous l\'équation, ligne par ligne.</li><li><b>Vérification et réponse</b> : remplace dans l\'énoncé, élimine les solutions qui n\'ont pas de sens (longueur négative...), puis réponds par une phrase.</li></ol></div>'
  +'<div class="card"><h3>Traduire les mots</h3><div class="tbl"><table class="trap"><thead><tr><th>Dans l\'énoncé</th><th>En écriture</th><th>Remarque</th></tr></thead><tbody>'
    +trapH('« a de plus que '+M('x')+' »',M('x + a'),'Ce qu\'on ajoute')
    +trapH('« le double de '+M('x')+' »',M('2x'),'Multiplication, pas addition')
    +trapH('« le double de la somme de '+M('x')+' et de 3 »',M('2(x + 3)'),'Parenthèses obligatoires')
    +trapH('« trois entiers consécutifs »',M('n')+', '+M('n + 1')+', '+M('n + 2'),'Écart de 1 à chaque fois')
    +trapH('« le périmètre d\'un rectangle »',M('2(l + L)'),'Le double de la somme des côtés')
    +trapH('« l\'aire d\'un rectangle »',M('l × L'),'Un produit')
    +'</tbody></table></div></div>'
  +'<div class="card"><h3>Exemple complet</h3><p>« Léa achète des stylos à 4 CHF pièce et un cahier à 3 CHF. Elle paie 27 CHF. Combien de stylos ? »</p>'
    +ex('Inconnue : '+M('n')+' = nombre de stylos. Équation : '+M('4n + 3 = 27')+' → '+M('4n = 24')+' → '+M('n = 6')+'. Vérification : '+M('4 × 6 + 3 = 27')+'. Léa achète 6 stylos.')
    +'<p>Avec un problème du second degré, l\'équation a souvent deux solutions : garde celle qui a un sens (une longueur ne peut pas être négative).</p></div>'
  +'<div class="card"><h3>Problèmes à 2 ou 3 inconnues</h3><p>Quand l\'énoncé donne <b>deux informations indépendantes</b> sur deux quantités inconnues (un total et un prix, deux âges, un périmètre et une différence), pose <b>deux inconnues</b> et <b>deux équations</b>. Pour trois quantités, prends trois inconnues et trois équations.</p>'
    +ex('« 5 billets de cinéma coûtent 45 CHF : adultes à 12 CHF, enfants à 7 CHF. » Inconnues : '+M('x')+' adultes, '+M('y')+' enfants. Équations : '+M('x + y = 5')+' (nombre) et '+M('12x + 7y = 45')+' (prix). Avec '+M('y = 5 - x')+' : '+M('12x + 35 - 7x = 45')+' → '+M('x = 2')+' et '+M('y = 3')+'.')
    +'<p>Écris une équation par information, en donnant à chaque inconnue son unité. Contrôle la réponse dans <b>l\'énoncé</b> (nombres entiers, positifs), pas seulement dans tes équations.</p></div>'
  +'<h2>Vérifier son résultat</h2>'
  +'<div class="card"><h3>Test avec un nombre</h3><p>Remplace la lettre par un nombre simple (1, 2 ou 3) dans l\'énoncé et dans ta réponse. Si les deux valeurs diffèrent, il y a une erreur. Si elles sont égales, ce n\'est pas une preuve : essaie un second nombre. Pour une factorisation, développe aussi ton résultat : tu dois retrouver l\'énoncé.</p>'
    +'<div class="tbl"><table class="trap"><thead><tr><th>Erreur fréquente</th><th>Correct</th><th>Test avec un nombre</th></tr></thead><tbody>'
    +trap('(x + 3)^2 = x^2 + 9','(x + 3)^2 = x^2 + 6x + 9','Pour '+M('x = 1')+' : 16 contre 10')
    +trap('(3x)^2 = 3x^2','(3x)^2 = 9x^2','Pour '+M('x = 2')+' : 36 contre 12')
    +trap('-(x - 3) = -x - 3','-(x - 3) = -x + 3','Pour '+M('x = 1')+' : 2 contre −4')
    +trap('(x - 3)^2 = x^2 - 9','(x - 3)^2 = x^2 - 6x + 9','Pour '+M('x = 1')+' : 4 contre −8')
    +trap('(x + 2)(x + 3) = x^2 + 6','(x + 2)(x + 3) = x^2 + 5x + 6','Pour '+M('x = 1')+' : 12 contre 7')
    +trap('3x + 6 = 3(x + 6)','3x + 6 = 3(x + 2)','Pour '+M('x = 1')+' : 9 contre 21')
    +'</tbody></table></div></div>'
  +'</div>';
}

function noteErr(tag,topic){
  const o=(stats.errTopics=stats.errTopics||{})[tag]||(stats.errTopics[tag]={}); o[topic]=(o[topic]||0)+1;
  (stats.errLast=stats.errLast||{})[tag]=dayStr(0);
}
function errSheetHTML(){
  const all=Object.entries(stats.errors||{}).filter(([t])=>TAGS[t]&&tagDom(t)===(DOMBR[S.domain]?S.domain:'math')).sort((a,b)=>b[1]-a[1]);
  if(!all.length) return '<div class="card"><h3>Fiche d\'erreurs</h3><p class="empty">Aucune erreur enregistrée.</p></div>';
  const row=([t,n])=>{
    const tp=Object.entries((stats.errTopics||{})[t]||{}).sort((a,b)=>b[1]-a[1]).filter(([id])=>TOPICS[id]);
    const last=(stats.errLast||{})[t];
    return '<li class="errrow"><span class="n">'+n+'</span><span><b>'+esc(TAGS[t].label)+'</b>'+(last?' <small>· dernière fois le '+esc(last)+'</small>':'')+'</span><span class="tip">'+esc(TAGS[t].tip)+'</span>'
      +(tp.length?'<span class="errtp">Rencontrée dans : '+tp.slice(0,3).map(([id,c])=>esc(TOPICS[id].label)+' ('+c+')').join(', ')+'</span><span class="actions"><button type="button" class="btn" data-act="errtrain" data-tag="'+esc(t)+'">S\'entraîner sur cette erreur</button></span>':'<span class="errtp">Entraînement ciblé disponible dès la prochaine fois que cette erreur arrive.</span>')+'</li>';
  };
  return '<div class="card"><h3>Fiche d\'erreurs <span class="cnt">'+all.length+' types</span></h3><p class="note">Triée de la plus fréquente à la plus rare. Le bouton lance une série avec les exercices où tu as fait cette erreur.</p><ul class="errs">'+all.slice(0,6).map(row).join('')+'</ul>'
    +(all.length>6?'<details class="rules"><summary>Voir les '+(all.length-6)+' autres</summary><ul class="errs">'+all.slice(6).map(row).join('')+'</ul></details>':'')+'</div>';
}
function errTrain(tag){
  const o=(stats.errTopics||{})[tag]||{}; let ids=Object.keys(o).filter(id=>TOPICS[id]).sort((a,b)=>o[b]-o[a]); if(!ids.length) return;
  const dom=domainOf(TOPICS[ids[0]].kind); ids=ids.filter(id=>domainOf(TOPICS[id].kind)===dom);
  setDomain(dom,'train'); S.mode='mix'; S.only=null; S.pool=[...ids,...ids]; renderSetup(); newSeries();
}
const THEME_RANKS=[[0,'Débutant'],[60,'Apprenti'],[200,'Studieux'],[500,'Confirmé'],[1000,'Expert'],[2000,'Maître']];
function themePoints(kind){
  let p=0; Object.keys(TOPICS).forEach(id=>{ const T=TOPICS[id], s=stats.topics[id]; if(T.kind===kind&&s) p+=(s.clean*1+s.helped*0.5+s.shown*0.1)*xpBase(T.level); });
  return Math.round(p);
}
function themeRank(p){ let i=0; THEME_RANKS.forEach((r,k)=>{ if(p>=r[0]) i=k; }); const n=THEME_RANKS[i+1]; return {i,name:THEME_RANKS[i][1],min:THEME_RANKS[i][0],next:n?n[0]:null,nextName:n?n[1]:null}; }
function themeRanksHTML(){
  const doms=DOMBR[S.domain]?BRDOMS[DOMBR[S.domain]].map(d=>[d,DOM_TITLE[d]]):[['alg','Développer & factoriser'],['eq','Équations'],['geo','Géométrie']];
  return '<div class="card"><h3>Rangs par thème</h3><p class="note">Points de maîtrise = exercices réussis sans aide (pleins points), avec aide (moitié) ou solution vue (peu), pondérés par le niveau.</p>'
    +doms.map(([d,t])=>'<h4 class="shop-h">'+esc(t)+'</h4><div class="bars">'+DKINDS[d].map(k=>{
      const p=themePoints(k), r=themeRank(p), pc=r.next?Math.min(100,Math.round(100*(p-r.min)/(r.next-r.min))):100;
      return '<div class="bar-row"><div class="name">'+esc(KIND_LABEL[k])+'<small>'+p+' pts'+(r.next?' · prochain : '+esc(r.nextName)+' à '+r.next:' · rang maximal')+'</small></div>'
        +'<div class="track" role="img" aria-label="'+pc+' % vers le rang suivant"><span class="clean" style="width:'+pc+'%"></span></div><div class="cnt">'+esc(r.name)+'</div></div>'; }).join('')+'</div>').join('')+'</div>';
}
function mathTot(){ const t={n:0,clean:0,helped:0,shown:0}; Object.keys(TOPICS).forEach(id=>{ const s=stats.topics[id]; if(s&&!DOMBR[domainOf(TOPICS[id].kind)]){ t.n+=s.n; t.clean+=s.clean; t.helped+=s.helped; t.shown+=s.shown; } }); return t; }
function branchTableHTML(){
  const rows=BRANCHES.map(b=>{
    let n,c; if(b.id==='math'){ const t=mathTot(); n=t.n; c=t.clean; } else { const e=brStat(b); n=e.n; c=e.clean; }
    const x=brXp(b.id), r=rankOf(x);
    return '<tr><td>'+esc(b.name)+'</td><td>'+esc(r.name)+'</td><td>'+x+' XP</td><td>'+n+'</td><td>'+(n?Math.round(100*c/n)+' %':'–')+'</td></tr>';
  }).join('');
  return '<div class="card"><h3>Bilan par branche</h3><p class="empty">Le rang global additionne l\'XP de toutes les branches. Chaque branche a son propre rang.</p><div class="tbl"><table class="trap"><thead><tr><th>Branche</th><th>Rang</th><th>XP</th><th>Exercices</th><th>Sans aide</th></tr></thead><tbody>'+rows+'</tbody></table></div></div>';
}
function renderStatsGlobal(){
  let h='<div class="course">'+gameProfileHTML().replace('<details class="rules">',dqCardHTML()+'<details class="rules">')+branchTableHTML();
  h+='<div class="card"><h3>Données</h3><p class="empty">Les résultats sont stockés dans ce navigateur. La synchronisation du compte se trouve dans le classement.</p></div></div>';
  $('view-stats').innerHTML=h;
}
function renderStats(){
  if(!(typeof BR!=='undefined'&&(BR.id==='math'||BRDOM[BR.id]))) return renderStatsGlobal();
  const EN_=!!DOMBR[S.domain], BID=DOMBR[S.domain]||'math', BN=brData(BID).name;
  const ids=Object.keys(TOPICS).filter(id=>EN_?DOMBR[domainOf(TOPICS[id].kind)]===BID:!DOMBR[domainOf(TOPICS[id].kind)]), tot={n:0,clean:0,helped:0,shown:0};
  ids.forEach(id=>{ const s=stats.topics[id]; if(s){ tot.n+=s.n; tot.clean+=s.clean; tot.helped+=s.helped; tot.shown+=s.shown; } });
  const errs=Object.entries(stats.errors||{}).filter(([t])=>TAGS[t]&&(EN_?DOMBR[tagDom(t)]===BID:tagDom(t)==='math')).sort((a,b)=>b[1]-a[1]).slice(0,8);
  let h='<div class="course"><div class="card"><h3>Bilan '+BN+'</h3><div class="kpis"><div class="kpi"><span class="lbl">Rang '+BN+'</span><b>'+esc(rankOf(brXp(BID)).name)+'</b></div><div class="kpi"><span class="lbl">XP '+BN+'</span><b>'+brXp(BID)+'</b></div></div><p class="empty">Le bilan global, avec le rang total et les badges, est sur la page d\'accueil.</p></div>'+srsCardHTML();
  h+='<div class="kpis"><div class="kpi"><span class="lbl">Exercices terminés</span><b>'+tot.n+'</b></div>'
    +'<div class="kpi"><span class="lbl">Réussis sans aide</span><b>'+(tot.n?Math.round(100*tot.clean/tot.n)+' %':'–')+'</b></div>'
    +'<div class="kpi"><span class="lbl">Séries terminées</span><b>'+(stats.series||0)+'</b></div></div>';
  if(tot.n) h+=levelAdviceCard();
  if(!tot.n){
    h+='<div class="card"><h3>Pas encore de résultats</h3><p class="empty">Après ta première série, cette page montre ta réussite par thème et tes erreurs les plus fréquentes, avec le rappel de règle correspondant.</p></div>';
  } else {
    h+=themeRanksHTML();
    h+='<div class="card"><h3>Réussite par thème</h3><div class="legend"><span><i style="background:var(--ok)"></i>Sans aide</span><span><i style="background:var(--warn)"></i>Avec aide</span><span><i style="background:var(--bad)"></i>Solution vue</span></div><div class="bars">'
      +ids.map(id=>{ const s=stats.topics[id]||{n:0,clean:0,helped:0,shown:0}, T=TOPICS[id], pc=k=>s.n?(100*s[k]/s.n):0;
        return '<div class="bar-row"><div class="name">'+esc(T.label)+'<small>'+KIND_LABEL[T.kind]+' · niveau '+T.level+'</small></div>'
          +'<div class="track" role="img" aria-label="'+s.clean+' sans aide, '+s.helped+' avec aide, '+s.shown+' solutions vues">'+(s.n?'<span class="clean" style="width:'+pc('clean')+'%"></span><span class="helped" style="width:'+pc('helped')+'%"></span><span class="shown" style="width:'+pc('shown')+'%"></span>':'')+'</div>'
          +'<div class="cnt">'+(s.n||'–')+'</div></div>'; }).join('')+'</div></div>';
    h+=errSheetHTML();
  }
  h+='<div class="card"><h3>Données</h3><p class="empty">Les résultats sont stockés uniquement dans ce navigateur.</p><div class="actions" id="reset-zone"><button type="button" class="btn" data-act="reset">Effacer mes résultats</button></div></div></div>';
  $('view-stats').innerHTML=h;
}

function levelAdvice(kind){
  const MX=Math.max.apply(null,Object.keys(TOPICS).map(id=>TOPICS[id]).filter(T=>T.kind===kind).map(T=>T.level));
  for(let L=1;L<=MX;L++){
    let n=0,clean=0;
    Object.keys(TOPICS).forEach(id=>{ const T=TOPICS[id], st=stats.topics[id]; if(T.kind===kind&&T.level===L&&st){ n+=st.n; clean+=st.clean; } });
    if(n<5) return 'niveau '+L+' : '+(n?n+' exercice'+(n>1?'s':'')+' terminé'+(n>1?'s':'')+', il en faut au moins 5 pour juger.':'pas encore travaillé.');
    if(clean/n<0.7) return 'niveau '+L+' : '+Math.round(100*clean/n)+' % réussis sans aide, à consolider (objectif : 70 %).';
  }
  return 'les '+MX+' niveaux sont validés.';
}
function levelAdviceCard(){
  const K=DOMBR[S.domain]?BRDOMS[DOMBR[S.domain]].reduce((a,d)=>a.concat(DKINDS[d]),[]).map(k=>[k,KIND_LABEL[k]]):[['expand','Développer'],['factor','Factoriser'],['solve','Équations à une inconnue'],['system','Systèmes'],['problem','Problèmes'],['quad','Second degré'],['gtri','Triangles'],['gquad','Quadrilatères'],['gpyth','Pythagore'],['gthal','Thalès'],['gcirc','Cercles'],['gcomp','Figures composées'],['gang','Angles et unités'],['gsol','Solides et volumes'],['gtrig','Trigonométrie']];
  return '<div class="card"><h3>Où continuer</h3><ul class="plain" style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px">'+K.map(k=>'<li><b>'+k[1]+'</b> : '+levelAdvice(k[0])+'</li>').join('')+'</ul><p class="note">Un niveau est validé à partir de 5 exercices terminés dont 70 % réussis sans aide.</p></div>';
}
