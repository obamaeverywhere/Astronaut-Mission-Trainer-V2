import re
s=open('../outpost-v2.html').read()
css=re.search(r'<style>(.*)</style>',s,re.S).group(1)
js=re.search(r'<script>(.*)</script>',s.split('r128/three.min.js"></script>')[1],re.S).group(1)
def ix(k):
    assert js.count(k)==1,k; return js.index(k)
h,why,p1,nasa,sq,cmp_,cp,drawB,rng,lay,lg,b,V,end=[ix(k) for k in ["let S,cfg,site","const why=","// ===== PHASE 1","function nasa()","const SQ=[","let cmp=[];","const CP=[","function drawB()","function rng(a)","function layout()","function lg(","const b=(l,v","\nlet V=null;","\nbrief()"]]
data=js[:h]+js[p1:nasa]+js[sq:cmp_]+js[cp:drawB]
state=js[h:why]+"let LV=null;\n"
ui=js[why:p1]+js[nasa:sq]+js[cmp_:cp]+js[drawB:rng]+js[lay:lg]+js[b:V]
sim=js[rng:lay]+js[lg:b]
scene=js[V:end]
def rep(t,a,b2):
    assert t.count(a)==1,a; return t.replace(a,b2)
data=rep(data,"const $=s=>document.querySelector(s),A=$('#app'),DAYS=30,N=4;","const $=s=>document.querySelector(s),A=$('#app'),N=4;\nlet DAYS=30;")
ui=rep(ui,"left=140-price()","left=LV.budget-price()");ui=rep(ui,"of 140.${site.cost","of ${LV.budget}.${site.cost")
ui=rep(ui,'onclick="pick()">BEGIN MISSION','onclick="menu()">BEGIN MISSION')
ui=rep(ui,'onclick="brief()">Back','onclick="intro(LV.id)">Back')
ui=rep(ui,'<button onclick="pick()">Back</button> <button onclick="nasa()">🔬 NASA data</button> <button class="go"','<button onclick="back()">Back</button> <button onclick="nasa()">🔬 NASA data</button> <button class="go"')
ui=rep(ui,"function build(i){site=SITES[i];cfg={p:8,b:3,s:0,g:0,r:1,k:1,d:0,x:0};drawB()}","function build(i){site=SITES[i];cfg=Object.assign({p:8,b:3,s:0,g:0,r:1,k:1,d:0,x:0},LV.start||{});for(const k of 'pbgrxkd')if(!LV.eq.includes(k))cfg[k]=0;if(LV.sh.length<2)cfg.s=0;drawB()}")
ui=rep(ui,"const card=(r)=>{const[,k,ic,nm,mx,cs,d,im,sa,id]=r;return `","const card=(r)=>{const[,k,ic,nm,mx,cs,d,im,sa,id]=r;if(!LV.eq.includes(k))return `<div class=\"card\" style=\"opacity:.6\"><b>${ic} ${nm}</b><br><small>🔒 Unlocks in Mission ${unlockAt(k)}</small></div>`;return `")
ui=rep(ui,"<option value=1 ${c.s==1?'selected':''}>","<option value=1 ${c.s==1?'selected':''} ${LV.sh.includes(1)?'':'disabled'}>");ui=rep(ui,"<option value=2 ${c.s==2?'selected':''}>","<option value=2 ${c.s==2?'selected':''} ${LV.sh.includes(2)?'':'disabled'}>")
ui=rep(ui,"<small>Protects the crew from radiation.","<small>${LV.sh.length<2?'🔒 Unlocks in Mission 5. ':''}Protects the crew from radiation.")
ui=rep(ui,'<div class="card" style="padding:0;overflow:hidden"><div id="v3d"','<div class="card"><b>Objective:</b> ${LV.obj}<br><small>💡 ${LV.hint}</small></div><div class="card" style="padding:0;overflow:hidden"><div id="v3d"')
ui=rep(ui,"`Sol ${Math.floor(s.t/24)+1}/${DAYS}","`M${LV.id} · Sol ${Math.floor(s.t/24)+1}/${DAYS}")
ui=rep(ui,"const w=S.hp>0,","const w=S.hp>0&&(!LV.win||LV.win(S)),")
ui=rep(ui,"<p><b>${(LS[c]||['The crew did not survive.'])[0]}</b></p>","<p><b>${S.hp>0?'Objective not met: '+LV.winMsg:(LS[c]||['The crew did not survive.'])[0]}</b></p>")
ui=rep(ui,"${(LS[c]||['',''])[1]}","${S.hp>0?LV.lesson:(LS[c]||['',''])[1]}")
ui=rep(ui,"<small>Numbers are modeled;","${lvEnd(w)}<small>Numbers are modeled;")
ui=rep(ui,'<button class="go" onclick="drawB()">Try again, same site</button> <button onclick="pick()">Choose another site</button>',"${endBtns(w)}")
sim=rep(sim,"function start(){","function start(){DAYS=LV.sols;")
sim=rep(sim,"speed=1;layout();init3D();","S.food=LV.food||100;speed=1;layout();init3D();")
sim=rep(sim,"if(!s.storm&&r()<.0022){s.storm=1;s.stEnd=s.t+48+r()*96;lg('Dust storm building')}","const rS=r(),fs=LV.force.find(e=>e.type=='storm'&&e.t==s.t);if(!s.storm&&((LV.hz.storm&&rS<.0022)||fs)){s.storm=1;s.stEnd=s.t+(fs?fs.dur:48+r()*96);lg('Dust storm building')}")
sim=rep(sim,"if(!s.spe&&r()<.0012){s.spe=1;s.speEnd=s.t+18+r()*10;lg('Solar particle event: radiation rising')}","const rP=r(),fp=LV.force.find(e=>e.type=='spe'&&e.t==s.t);if(!s.spe&&((LV.hz.spe&&rP<.0012)||fp)){s.spe=1;s.speEnd=s.t+(fp?fp.dur:18+r()*10);lg('Solar particle event: radiation rising')}")
sim=rep(sim,"r()<.0005*(1+s.cover))brk(k);","r()<.0005*(1+s.cover)*(LV.hz.fail?1:0))brk(k);\nconst ff=LV.force.find(e=>e.type=='fail'&&e.t==s.t);if(ff&&!s.fail[ff.k])brk(ff.k);")
sim=rep(sim,"s.last={gen,used,irr,Ta,ppm,rate};","s.minBat=Math.min(s.minBat===undefined?1e9:s.minBat,s.bat);s.minTin=Math.min(s.minTin===undefined?99:s.minTin,s.tin);s.last={gen,used,irr,Ta,ppm,rate};")
W=lambda f,t:open(f,'w').write(t)
W('js/data.js',"// ===== DATA: sites, explanations, NASA data sources, equipment catalog =====\n"+data)
W('js/state.js',"// ===== GAME STATE (globals shared by all scripts) =====\n"+state)
W('js/levels.js',open('/tmp/levels.js').read())
W('js/ui.js',"// ===== UI: screens, NASA panel, design screen, dashboard, debrief =====\n"+ui)
W('js/sim.js',"// ===== SIMULATION: seeded RNG, one step per simulated hour =====\n"+sim)
W('js/scene3d.js',"// ===== 3D: three.js outpost view =====\n"+scene)
W('js/main.js',"// ===== START =====\nbrief();\n")
W('css/style.css',css.strip()+"\n")
order=['vendor/three.min.js','js/data.js','js/state.js','js/levels.js','js/ui.js','js/sim.js','js/scene3d.js','js/main.js']
W('index.html','<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><title>Outpost Zero – Mars Mission Trainer</title>\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<link rel="stylesheet" href="css/style.css"></head><body><main id="app"></main>\n'+''.join(f'<script src="{f}"></script>\n' for f in order)+'</body></html>\n')
W('.nojekyll','')
