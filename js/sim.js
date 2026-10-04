// ===== SIMULATION: seeded RNG, one step per simulated hour =====
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function start(){DAYS=LV.sols;seed=+($('#seed')||{value:1}).value||1;S={r:rng(seed),t:0,tau:.5,cover:0,storm:0,stEnd:0,spe:0,speEnd:0,tin:20,set:20,bat:cfg.b*25*.7+10,o2:60,co2:.2,h2o:300-(cfg.s==1?100:0),food:100,hp:100,dose:0,parts:cfg.k,fail:{},red:cfg.d,rep:null,gh:cfg.g,ex:cfg.x,sh:0,hist:[],log:[],fl:{},dmg:{},clean:-99,ph:{}};S.food=LV.food||100;speed=1;layout();init3D();clearInterval(timer);timer=setInterval(frame,100)}
function lg(m){S.log.unshift(`Sol ${Math.floor(S.t/24)+1} ${String(S.t%24).padStart(2,'0')}:00 — ${m}`);S.rec=(S.rec||[]);S.rec.push([S.t,m])}
function fl(k,c,m){if(c&&!S.fl[k])lg(m);S.fl[k]=c}
function cleanP(){if(S.t-S.clean<24){return}S.clean=S.t;S.cover=0;lg('Panels cleaned')}
function repair(){const k=Object.keys(S.fail).find(x=>S.fail[x]);if(!k||S.rep)return;if(S.parts<1){lg('No spare parts left')}else{S.parts--;S.rep={k,u:S.t+6};lg('Repairing '+k)}}
function brk(k){if(S.red&&(k=='scr'||k=='oga')){S.red=0;lg('Backup took over from failed '+k)}else{S.fail[k]=1;lg(k+' failed')}}
function step(){const s=S,r=s.r,h=s.t%24,st=SITES.indexOf(site)<0?site:site;
const rS=r(),fs=LV.force.find(e=>e.type=='storm'&&e.t==s.t);if(!s.storm&&((LV.hz.storm&&rS<.0022)||fs)){s.storm=1;s.stEnd=s.t+(fs?fs.dur:48+r()*96);lg('Dust storm building')}
if(s.storm&&s.t>s.stEnd){s.storm=0;lg('Storm is fading')}
s.tau=Math.max(.2,s.tau+((s.storm?3.5:.5)-s.tau)*(s.storm?.03:.004)+(r()-.5)*.01);s.cover=Math.min(.7,s.cover+.00035*s.tau);
const rP=r(),fp=LV.force.find(e=>e.type=='spe'&&e.t==s.t);if(!s.spe&&((LV.hz.spe&&rP<.0012)||fp)){s.spe=1;s.speEnd=s.t+(fp?fp.dur:18+r()*10);lg('Solar particle event: radiation rising')}
if(s.spe&&s.t>s.speEnd){s.spe=0;lg('Particle event over')}
if(s.rep&&s.t>=s.rep.u){s.fail[s.rep.k]=0;lg(s.rep.k+' repaired');s.rep=null}
for(const k of['scr','oga','rec','heat'])if(!s.fail[k]&&r()<.0005*(1+s.cover)*(LV.hz.fail?1:0))brk(k);
const ff=LV.force.find(e=>e.type=='fail'&&e.t==s.t);if(ff&&!s.fail[ff.k])brk(ff.k);
const T=Math.min(1,Math.exp(-(s.tau-.5)*.4)),irr=site.sun*(h>=6&&h<18?Math.sin(Math.PI*(h-6)/12):0)*T,gen=cfg.p*4*irr*(1-s.cover*.8);
const Ta=site.tm+40*(.6+.4*T)*Math.sin(2*Math.PI*(h-9.5)/24),U=.022*INS[cfg.s];
const oN=s.o2<80&&!s.fail.oga,gl=s.gh&&!s.sh&&h>=4&&h<20;
const heat=Math.min(4,Math.max(0,U*(s.set-Ta)+1.5*(s.set-s.tin)));
const L=[['life',1],['scr',s.fail.scr?0:.6],['oga',oN?1:0],['heat',s.fail.heat?0:heat],['rec',cfg.r&&!s.fail.rec?.5:0],['ex',s.ex?1.5:0],['gh',gl?2:0]];
let av=gen+Math.min(s.bat,8),used=0,g={};for(const[k,d]of L){const f=d>0?Math.min(1,Math.max(0,(av-used)/d)):0;g[k]=f;used+=d*f}
const net=gen-used;s.bat=net>=0?Math.min(cfg.b*25+20,s.bat+net*.92):Math.max(0,s.bat+net);
const lf=g.life>=.99?1:0,hu=used-L[3][1]*g.heat;s.tin+=(L[3][1]*g.heat+.12*hu-U*(s.tin-Ta))/2;
const o2m=oN?.2*g.oga*lf:0,sc=Math.min(s.co2,.25*g.scr*lf),pl=gl?g.gh*lf:0;
s.o2=Math.max(0,s.o2+o2m-.14+.002*pl);s.h2o-=o2m*1.125;s.co2=Math.max(0,s.co2+.168-sc-.003*pl);
const rc=.85*g.rec*lf;s.h2o+=-.58*(1-rc)-(.025*pl)+(s.ex?.5*site.ice*3*g.ex:0);
s.food=Math.max(0,s.food-.1667+(pl&&s.tin>10&&s.h2o>0?.035:0));
const ppm=s.co2/.36*1000,rate=.64*site.rad/24*SF[cfg.s]*(s.spe?40:1)*(s.spe&&s.sh?.25:1);s.dose+=rate;
const d=(k,v)=>{s.dmg[k]=(s.dmg[k]||0)+v;s.hp-=v},bad=s.o2<=0?d('o2',8):0;
if(ppm>15000)d('co2',2);else if(ppm>5000)d('co2',.1);if(s.tin<5)d('cold',.5);if(s.tin>35)d('heat',.3);if(s.food<=0)d('food',.1);if(s.h2o<=0)d('water',.4);if(rate>.4)d('rad',(rate-.4)*.5);if(s.dose>60)d('rad',.3);
if(s.hp<100&&!bad&&ppm<5000&&s.tin>8&&s.food>0&&s.h2o>0&&rate<.4)s.hp=Math.min(100,s.hp+.05);
fl('bo',g.life<.99,'BLACKOUT: life support lost power');fl('lowb',s.bat<cfg.b*25*.1,'Battery nearly empty');fl('co2',ppm>5000,'CO2 above 5000 ppm');fl('o2',s.o2<15,'Oxygen reserve low');fl('cold',s.tin<8,'Habitat is too cold');fl('h2o',s.h2o<40,'Water reserve low');fl('fd',s.food<20,'Food reserve low');
s.minBat=Math.min(s.minBat===undefined?1e9:s.minBat,s.bat);s.minTin=Math.min(s.minTin===undefined?99:s.minTin,s.tin);s.last={gen,used,irr,Ta,ppm,rate};s.hist.push([gen,used,s.bat/(cfg.b*25+20),s.tau]);if(s.hist.length>96)s.hist.shift();s.t++}
function frame(){if(!S||S.end)return;const n=[0,.5,2,10][speed];S.ph.a=(S.ph.a||0)+n;while(S.ph.a>=1&&!S.end){S.ph.a--;step();if(S.hp<=0||S.t>=DAYS*24){fin();return}}render()}
