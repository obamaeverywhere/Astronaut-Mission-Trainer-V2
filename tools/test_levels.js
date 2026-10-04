// Headless balance/regression test. Usage: node tools/test_levels.js  (needs no browser; stubs the DOM)
const fs=require('fs');
const stub=`const el=()=>new Proxy(function(){},{get:(t,k)=>k=='value'?'1':k=='clientWidth'?640:k=='width'?900:k=='height'?150:k=='appendChild'?()=>{}:el(),set:()=>true,apply:()=>el()});
global.document={querySelector:()=>el(),querySelectorAll:()=>[],createElement:()=>el(),body:el(),documentElement:{}};global.window={};global.getComputedStyle=()=>({getPropertyValue:()=>''});global.setInterval=()=>0;global.clearInterval=()=>{};global.requestAnimationFrame=()=>0;global.cancelAnimationFrame=()=>{};\n`;
const src=['data','state','levels','ui','kid','sim','scene3d'].map(f=>fs.readFileSync(__dirname+'/../js/'+f+'.js','utf8')).join('\n');
const run=new Function(stub+src+`
for(let n=1;n<=6;n++){intro(n);build(LEVELS[n-1].sites[0]);drawB()}brief();menu();
const Z={p:0,b:0,s:0,g:0,r:0,k:0,d:0,x:0};
function play(n,c,sd,smart){LV=LEVELS[n-1];DAYS=LV.sols;site=SITES[LV.sites[0]];cfg=Object.assign({},Z,c);start();S.r=rng(sd);
 while(S.hp>0&&S.t<DAYS*24){const h=S.t%24;if(smart){if(h==12)cleanP();if(S.storm||S.bat<cfg.b*25*.3){S.set=11;S.gh=0}else{S.set=20;S.gh=cfg.g}S.ex=cfg.x;S.sh=S.spe?1:0;if(Object.values(S.fail).some(x=>x)&&!S.rep)repair()}step()}
 kr();advice();const ok=S.hp>0&&(!LV.win||LV.win(S));fin();return ok}
const R=[[1,'8 panels 3 batteries',{p:8,b:3},1,8],[1,'lazy 5 panels 1 battery',{p:5,b:1},0,0],[2,'8 panels 4 batteries + shed loads',{p:8,b:4},1,8],[2,'same, no load shedding',{p:8,b:4},0,0],[3,'recycler',{p:9,b:3,r:1},1,8],[3,'ice miner',{p:9,b:3,x:1},1,8],[3,'neither',{p:9,b:3},1,0],[4,'greenhouse',{p:10,b:3,g:1,r:1},1,8],[4,'no greenhouse',{p:10,b:3,r:1},1,0],[5,'shielding + spare part',{p:9,b:3,r:1,s:1,k:1},1,8],[5,'backup + shelter',{p:9,b:3,r:1,d:1},1,8],[5,'no protection',{p:9,b:3,r:1},1,0],[6,'balanced (random hazards)',{p:9,b:3,s:1,g:1,r:1,k:1,d:1},1,'most']];
const out=[];for(const [n,l,c,sm,ex] of R){let w=0;for(let sd=1;sd<=8;sd++)if(play(n,c,sd,sm))w++;out.push('M'+n+' '+l+': '+w+'/8'+(ex===8&&w<8||ex===0&&w>0?'   <-- UNEXPECTED':''))}
return out.join('\\n')`);
console.log(run());
