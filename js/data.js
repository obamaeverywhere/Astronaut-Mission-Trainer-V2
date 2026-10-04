// ===== DATA: sites, explanations, NASA data sources, equipment catalog =====

const $=s=>document.querySelector(s),A=$('#app'),N=4;
let DAYS=30;
const SITES=[
{n:'Gale Crater',sun:.95,ice:0,rad:.9,tm:-55,cost:1,t:'Real radiation data exists here (Curiosity RAD). Little buried ice.'},
{n:'Arcadia Planitia',sun:.65,ice:1,rad:1,tm:-68,cost:1,t:'Mid-latitude plain flagged ice-rich by NASA SWIM. Weaker, colder.'},
{n:'Deuteronilus Mensae',sun:.7,ice:1,rad:1,tm:-66,cost:1.15,t:'Glacier-like terrain flagged by SWIM. Rough ground raises costs.'},
{n:'Equatorial plain (placeholder)',sun:1,ice:0,rad:1.1,tm:-52,cost:1,t:'Most sunlight, no ice. Stand-in until official data arrives.'}];
const WHY={
dust:['Mars dust blocks sunlight. Big storms can last weeks, and dust also settles on panels.','Dust opacity (tau) is about 0.5 on a clear day and can exceed 3 in big storms, cutting sunlight at the surface a lot. Here sunlight = exp(-0.4·(tau−0.5)); a derived model, not a forecast.','Two effects: atmospheric attenuation (tau) and panel soiling (accumulates ∝ tau, reset by cleaning). Storms also shrink the day-night temperature swing. All coefficients are abstractions.'],
power:['Panels make power only in daylight. Batteries cover the night and storms.','Every system draws power in a fixed priority. When supply runs short, lower-priority systems shut down first, then life support.','Supply = panels × peak × irradiance × (1−soiling). Demand = sum of loads. Battery bounded by capacity, 92% charge efficiency. Priority: life support, CO2 scrubber, oxygen maker, heater, recycler, ice miner, greenhouse.'],
air:['People breathe in oxygen and out CO2. Machines fix the air, and they need power.','The scrubber removes CO2; electrolysis splits water into oxygen. Plants help too, but only if they have light and warmth.','Crew rates use approximate NASA life-support values (about 0.84 kg O2 and 1 kg CO2 per person per day); verify against NASA BVAD before citing. Cabin CO2 is tracked as ppm, an abstraction.'],
rad:['Mars has little air or magnetic shield, so radiation reaches the ground. Walls and shelters help.','Curiosity\'s RAD measured about 0.64 mSv/day on the surface and saw spikes during solar particle events. Water or soil on top absorbs part of it.','Base rate uses the Gale RAD value (REAL, other sites modeled). Solar particle events are random and scaled up as gameplay. The meter limit is an abstraction, not a medical dose limit.'],
water:['Water is for drinking, air, and plants. Recycle it or find more.','The recycler gets most water back but needs power and can break. Ice maps (NASA SWIM) show where mining may pay off.','Net water = tank − crew use×(1−recycle efficiency) − electrolysis − plant use + ice income. Recycle efficiency 85% is a modeled value.']};
const SF=[1,.55,.35],INS=[1,.85,.6];
// ===== PHASE 1: BRIEFING, SITE SELECTION, NASA DATA, DESIGN SCREEN =====
// Provenance. type: REAL (published observation), DERIVED (calculated from real data), MODELED (engineering relationship built for the game), ABSTRACTION (gameplay simplification). url:null means the authoritative link still has to be verified before it is shown as a source.
const DATA_SOURCES={
 radiation:{label:'Curiosity RAD surface radiation',org:'NASA / MSL',type:'REAL',used:'Base radiation rate (about 0.64 mSv/day, measured at Gale Crater; about 1.84 mSv/day during cruise).',note:'Other sites use a modeled factor. The meter and its limit of 60 are ABSTRACTION, not a medical dose limit.',url:null},
 ice:{label:'SWIM buried water-ice mapping',org:'NASA / USGS',type:'REAL',used:'Which sites count as ice-rich (Arcadia Planitia, Deuteronilus Mensae).',note:'Only a qualitative likelihood is used. Water income rate is MODELED.',url:null},
 sun:{label:'Sunlight by site',org:'Game model',type:'DERIVED',used:'Site sunlight % is derived from latitude, not measured at the surface.',note:'Needs verification against NASA surface data.',url:null},
 dust:{label:'Dust opacity and storms',org:'Game model',type:'MODELED',used:'Clear sky about 0.5, storms about 3.5; sunlight = exp(-0.4 x (tau - 0.5)); panel soiling accumulates with tau.',note:'Storm timing is random. Coefficients need checking against NASA dust opacity records.',url:null},
 life:{label:'Crew oxygen, CO2, water and food use',org:'Approximate NASA life-support values',type:'DERIVED',used:'About 0.84 kg O2 and 1 kg CO2 per person per day.',note:'Not yet verified against the NASA life-support baseline document; treat as approximate.',url:null},
 temp:{label:'Site temperatures',org:'Game model',type:'ABSTRACTION',used:'Mean site temperature and day-night swing.',note:'Should be replaced with sourced surface temperature data (for example from Curiosity REMS).',url:null},
 game:{label:'Costs, failure rates, panel and battery sizes, greenhouse yield',org:'Game design',type:'ABSTRACTION',used:'All budget numbers, equipment performance and failure probabilities.',note:'Chosen for playability, not taken from any mission.',url:null}};
const TYPE_TXT={REAL:'Real observation or finding from NASA data',DERIVED:'Calculated from real data',MODELED:'Engineering relationship created for the simulation',ABSTRACTION:'Simplification made for gameplay'};
const TYPE_COL={REAL:'R',DERIVED:'D',MODELED:'D',ABSTRACTION:'A'};
const SQ=[
{so:'High',ic:'Low potential',ra:'Lower',te:'Cold',tr:'Moderate (crater floor)',tx:'Good sunlight and slightly less radiation, but almost no accessible ice, so water must be recycled carefully.',ch:'Water supply'},
{so:'Moderate',ic:'High potential',ra:'Moderate',te:'Very cold',tr:'Easy (flat plain)',tx:'Potential access to water ice, but less useful sunlight than an equatorial site and a colder habitat to heat.',ch:'Power and heating'},
{so:'Moderate',ic:'High potential',ra:'Moderate',te:'Very cold',tr:'Difficult (costs 15% more)',tx:'Ice-rich ground, but rough terrain makes everything cost more and sunlight is limited.',ch:'Budget and power'},
{so:'High',ic:'Low potential',ra:'Higher',te:'Cold',tr:'Easy',tx:'The most sunlight, but no accessible ice and somewhat higher radiation. A placeholder until official data arrives.',ch:'Water and radiation'}];
const CP=[['POWER','p','☀️','Solar array',14,5,'Produces power during daylight.','More generation','More cargo mass, more surface for dust to settle on, uses budget','Power is only useful if you can store it for night and storms.'],
['ENERGY STORAGE','b','🔋','Batteries',6,8,'Stores spare energy for nights and storms.','Night and storm resilience','Higher construction cost','Generation and storage are different jobs.'],
['FOOD AND WATER','g','🌱','Greenhouse',1,18,'Grows food, adds a little oxygen and absorbs a little CO2.','Food independence','Needs 2 kW for lights, plus water and a warm cabin','Closed loops trade independence for energy.'],
['FOOD AND WATER','r','💧','Water recycler',1,14,'Recovers most of the crew\'s used water.','Saves water','Uses power and can break','Recycling trades power for water.'],
['FOOD AND WATER','x','⛏️','Ice miner',1,14,'Extracts water from buried ice. Only works on ice sites.','Water supply on ice sites','Uses 1.5 kW; wasted on dry sites','Resources only help where they exist.'],
['RELIABILITY','k','🔧','Spare parts',4,4,'Each part repairs one broken system.','Recovery from failures','Budget you could spend elsewhere','You can only fix what you brought spares for.'],
['RELIABILITY','d','🛟','Backup life support',1,12,'Takes over once if the CO2 scrubber or oxygen maker fails.','One failure is not an emergency','Budget spent on something that may never be used','Spacecraft engineers often trade efficiency for reliability.']];
