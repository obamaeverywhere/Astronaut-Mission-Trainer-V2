// ===== LEVELS: CAMPAIGN MISSIONS =====
// Each mission is a scenario for the SAME simulation (sim.js). It sets the site, length, budget, unlocked equipment,
// hazards (random, or scheduled in `force` so every player meets the lesson), and objectives. No score or ranking:
// a mission is complete or not, plus optional engineering challenges. hz = random hazards on/off; force = scheduled hazards (t in hours).
const LEVELS=[
{id:1,name:'First Light',tag:'Power basics',sites:[0],sols:5,budget:90,eq:['p','b'],sh:[0],hz:{storm:0,spe:0,fail:0},force:[],start:{p:5,b:1},
 story:'Your outpost has landed at Gale Crater. The sun is your only power source, and Mars has long, cold nights.',obj:'Survive 5 sols without letting the battery run empty.',
 learn:['Solar panels only work in daylight.','Batteries carry the outpost through the night.','Power made must cover power used.'],
 hint:'If the orange line is above the green line on the chart, your battery is draining. Try 8 panels and 3 batteries.',
 win:S=>S.minBat>.5,winMsg:'the battery ran empty and life support lost power.',lesson:'Generation alone is not enough. Batteries carry the outpost through the night.',
 goals:[['Spend 70 or less of the budget',S=>price()<=70]]},
{id:2,name:'The Dust Storm',tag:'Energy storage',sites:[0],sols:10,budget:100,eq:['p','b'],sh:[0],hz:{storm:0,spe:0,fail:0},force:[{type:'storm',t:48,dur:84}],start:{p:6,b:2},
 story:'Mission Control warns of a dust storm arriving on sol 3. Sunlight will drop sharply for about three and a half sols.',obj:'Survive 10 sols, including the storm, without letting the battery run empty.',
 learn:['Dust blocks sunlight and soils panels.','Stored energy matters as much as generation.','You can survive a storm by using less power.'],
 hint:'During the storm, lower the heater set point to about 11 °C. After it ends, press Clean panels. Try 8 panels and 4 batteries.',
 win:S=>S.minBat>.5,winMsg:'the battery ran empty during the storm and life support lost power.',lesson:'Storage and load shedding matter as much as generation. Cutting non-essential loads stretches the battery.',
 goals:[['Finish with crew health at 90 or more',S=>S.hp>=90],['Spend 85 or less of the budget',S=>price()<=85]]},
{id:3,name:'Water Is Life',tag:'Recycling and ice',sites:[1],sols:20,budget:110,eq:['p','b','r','x'],sh:[0],hz:{storm:0,spe:0,fail:0},force:[],start:{p:9,b:3},
 story:'Arcadia Planitia may sit on buried ice, but your tanks will not last 20 sols if water is only used once.',obj:'Survive 20 sols and finish with at least 20 kg of water.',
 learn:['Air, drinking water and electrolysis all use water.','A recycler saves water but uses power.','An ice miner makes water but uses more power.'],
 hint:'Two designs work here: a recycler (cheaper to run) or an ice miner (more water, more power). Which would you pick?',
 win:S=>S.h2o>=20,winMsg:'finish with at least 20 kg of water.',lesson:'Water is a closed loop. Recycling and ice mining both cost power.',
 goals:[['Never let the battery run empty',S=>S.minBat>.5],['Finish with 100 kg of water or more',S=>S.h2o>=100]]},
{id:4,name:'Grow Your Own',tag:'Closed-loop food',sites:[3],sols:20,budget:120,eq:['p','b','r','x','g'],sh:[0],hz:{storm:0,spe:0,fail:0},force:[],food:85,start:{p:10,b:3,r:1},
 story:'Resupply is late. Your stored food will run low, so the greenhouse has to make up the difference.',obj:'Survive 20 sols and finish with at least 12 crew-days of food.',
 learn:['Plants need light, power, water and warmth.','The greenhouse also adds a little oxygen.','Food independence costs energy.'],
 hint:'Keep the greenhouse lights on and the cabin above 10 °C. Check that power and water are enough to feed it.',
 win:S=>S.food>=12,winMsg:'finish with at least 12 crew-days of food.',lesson:'A greenhouse only works when power, light, water and warmth all hold up.',
 goals:[['Keep the cabin above 8 °C all mission',S=>S.minTin>8],['Never let the battery run empty',S=>S.minBat>.5]]},
{id:5,name:'Storm of Particles',tag:'Radiation and reliability',sites:[0],sols:14,budget:130,eq:['p','b','r','k','d'],sh:[0,1,2],hz:{storm:0,spe:0,fail:0},force:[{type:'spe',t:72,dur:20},{type:'fail',t:120,k:'scr'},{type:'spe',t:216,dur:20}],start:{p:9,b:3,r:1},
 story:'Two solar particle events and a scrubber failure are expected. Radiation is a risk, and so is a single point of failure.',obj:'Survive 14 sols and keep the radiation meter below 30.',
 learn:['Shielding or sheltering cuts radiation exposure.','Spare parts and backups protect against failures.','Protection costs budget, water or crew time.'],
 hint:'Two ways to stay safe: build shielding, or press Shelter crew during spikes. Keep a spare part or backup life support for the scrubber.',
 win:S=>S.dose<30,winMsg:'keep the radiation meter below 30.',lesson:'Radiation protection costs something: shielding, water, budget or crew time.',
 goals:[['Repair every failed system',S=>!Object.values(S.fail).some(x=>x)],['Finish with crew health 85 or more',S=>S.hp>=85]]},
{id:6,name:'Commander',tag:'Full mission',sites:[0,1,2,3],sols:30,budget:140,eq:['p','b','r','x','g','k','d'],sh:[0,1,2],hz:{storm:1,spe:1,fail:1},force:[],start:{},
 story:'No scripts. Pick a site, design the outpost, and keep four astronauts alive for a full mission.',obj:'Survive 30 sols.',
 learn:['Power, air, water, food, heat and radiation are connected.','There is no perfect landing site or design.','The same seed lets you compare designs fairly.'],
 hint:'Use what you learned: build for the worst storm, shield or shelter during spikes, and carry spares.',
 lesson:'',goals:[['Finish with crew health 95 or more',S=>S.hp>=95],['Keep the radiation meter below 40',S=>S.dose<40],['Spend 130 or less of the budget',S=>price()<=130]]}];
const unlockAt=k=>(LEVELS.find(l=>l.eq.includes(k))||{id:'?'}).id;
function loadProg(){try{return JSON.parse(localStorage.getItem('ozProg')||'[]')}catch(e){return[]}}
function saveProg(id){try{const d=loadProg();if(!d.includes(id)){d.push(id);localStorage.setItem('ozProg',JSON.stringify(d))}}catch(e){}}
function resetProg(){try{localStorage.removeItem('ozProg')}catch(e){}menu()}
function unlockAll(){try{localStorage.setItem('ozProg',JSON.stringify([1,2,3,4,5]))}catch(e){}menu()}
function menu(){const d=loadProg();A.innerHTML=`<h1>Missions</h1><p class="sub">Each mission teaches one idea using the same simulation. Complete a mission to unlock the next.</p><div class="grid">${LEVELS.map(l=>{const open=l.id==1||d.includes(l.id-1),done=d.includes(l.id);return `<div class="card"><b>Mission ${l.id}: ${l.name}</b><br><small>${l.tag} · ${l.sols} sols</small><p>${done?'✔ Complete':open?'▶ Ready':'🔒 Locked'}</p><button class="${open?'go':''}" ${open?'':'disabled'} onclick="intro(${l.id})">${done?'Replay':'Start'}</button></div>`}).join('')}</div><p><button onclick="nasa()">🔬 NASA data</button> <button onclick="unlockAll()">Unlock all (teacher/demo)</button> <button onclick="resetProg()">Reset progress</button> <button onclick="brief()">Title</button></p>`}
function hzTxt(){const h=[],f=t=>LV.force.some(e=>e.type==t);if(LV.hz.storm||f('storm'))h.push('dust storm'+(LV.hz.storm?'s (random)':''));if(LV.hz.spe||f('spe'))h.push('radiation spikes');if(LV.hz.fail||f('fail'))h.push('equipment failures');return h.length?h.join(', '):'none'}
function intro(n){LV=LEVELS[n-1];DAYS=LV.sols;const nm=Object.fromEntries(CP.map(r=>[r[1],r[3]]));A.innerHTML=`<h1>Mission ${LV.id}: ${LV.name}</h1><p>${LV.story}</p><div class="card"><b>Objective:</b> ${LV.obj}</div><div class="grid" style="margin-top:10px"><div class="card"><b>You will learn</b><ul>${LV.learn.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="card"><b>Mission rules</b><br>📅 ${LV.sols} sols · 📦 Budget ${LV.budget}<br>🔧 ${LV.eq.map(k=>nm[k]).join(', ')}${LV.sh.length>1?', shielding':''}<br>⚠️ Hazards: ${hzTxt()}</div></div><div class="card" style="margin-top:10px"><b>💡 Hint:</b> ${LV.hint}</div><p><button onclick="menu()">Back</button> <button class="go" onclick="${LV.sites.length>1?'pick()':'build('+LV.sites[0]+')'}">Design the outpost</button></p>`}
function back(){LV.sites.length>1?pick():intro(LV.id)}
function endBtns(w){if(w)saveProg(LV.id);const n=LV.id;return `${w&&n<LEVELS.length?`<button class="go" onclick="intro(${n+1})">Next mission</button> `:''}<button class="${w?'':'go'}" onclick="drawB()">Redesign, same weather</button> <button onclick="menu()">Missions</button>`}
function lvEnd(w){return `<p><b>Engineering challenges (optional)</b></p><ul>${LV.goals.map(x=>`<li>${x[1](S)?'✔':'✖'} ${x[0]}</li>`).join('')}</ul>${w?`<p><b>You learned:</b> ${LV.learn.join(' ')}</p>`:''}`}
