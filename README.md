# Outpost Zero: Mars Mission Trainer

A level-based systems-engineering game for the 2026 NASA Space Apps Challenge, *Build a Junior Astronaut Mission Trainer*.
You command a four-person Mars outpost. A live, hour-by-hour simulation couples sunlight, dust, power, heat, air, water, food and radiation. Six missions each teach one idea.

## Run it
- Quickest: double-click `index.html` (no build step, no server needed; scripts are plain classic scripts).
- Or serve the folder: `python3 -m http.server 8000` then open http://localhost:8000
- `vendor/three.min.js` (three.js r128, MIT license in `vendor/THREE_LICENSE.txt`) is included, so it works offline.

## Missions
| # | Name | Idea | Site | Sols | New equipment |
|---|------|------|------|------|---------------|
| 1 | First Light | Day/night power, batteries | Gale Crater | 5 | panels, batteries |
| 2 | The Dust Storm | Storage and load shedding | Gale Crater | 10 | (scheduled storm) |
| 3 | Water Is Life | Recycling vs ice mining | Arcadia Planitia | 20 | recycler, ice miner |
| 4 | Grow Your Own | Closed-loop food | Equatorial plain | 20 | greenhouse |
| 5 | Storm of Particles | Radiation and reliability | Gale Crater | 14 | shielding, spares, backup |
| 6 | Commander | Everything, random hazards | your choice | 30 | all |

Completing a mission unlocks the next (progress is saved in the browser's localStorage). The menu has "Unlock all" for teachers and demos.
There is no score or ranking: a mission is complete or not, plus optional engineering challenges.

## Project structure
```
index.html          loads everything in order
css/style.css       base styles
css/kid.css         kid-first theme (bigger type, big buttons)
js/data.js          sites, explanations, NASA data sources (REAL / DERIVED / MODELED / ABSTRACTION), equipment catalog
js/state.js         shared global state
js/levels.js        the missions (LEVELS array) and the menu / briefing / end-of-mission helpers
js/ui.js            NASA data panel, site comparison, original detailed dashboard (kept as the Engineer panel)
js/kid.js           the kid-first screens (override ui.js): title, mission map, intro, build screen, mission screen with Pip the guide, end screen
js/sim.js           seeded RNG and the hourly simulation (step)
js/scene3d.js       three.js outpost view
js/main.js          starts the game
vendor/             three.js
tools/test_levels.js   headless balance test:  node tools/test_levels.js
tools/bundle.py        builds one self-contained HTML file:  python3 tools/bundle.py
tools/split.py         one-time script used to split the original single-file prototype
```
**Adding a mission:** add an object to `LEVELS` in `js/levels.js` (site, sols, budget, equipment `eq`, hazards `hz`, scheduled hazards `force`, objective, optional `win` test, optional goals). No simulation code needs to change.
