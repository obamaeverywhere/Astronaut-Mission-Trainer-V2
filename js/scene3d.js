// ===== 3D: three.js outpost view =====

let V=null;
function init3D(){if(V){cancelAnimationFrame(V.raf);V=null}const el=$('#v3d');if(typeof THREE=='undefined'||!el){if(el)el.innerHTML='<p class="sub" style="padding:12px">3D view needs the three.js library (check your connection).</p>';return}
const T=THREE,w=el.clientWidth||640,h=300,rd=new T.WebGLRenderer({antialias:true});rd.setSize(w,h);rd.setPixelRatio(Math.min(2,devicePixelRatio||1));el.appendChild(rd.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(50,w/h,.1,500);sc.fog=new T.FogExp2(0xc0805a,.008);
const amb=new T.AmbientLight(0xffffff,.4),sun=new T.DirectionalLight(0xfff0dd,1),pl=new T.PointLight(0xff3060,0,70);pl.position.set(0,10,0);sc.add(amb,sun,pl);
const M=(c,o)=>new T.MeshLambertMaterial(Object.assign({color:c},o||{})),add=(m,x,y,z,p)=>{m.position.set(x,y,z);(p||sc).add(m);return m};
const gr=new T.Mesh(new T.PlaneGeometry(500,500),M(0x9a5a3a));gr.rotation.x=-Math.PI/2;sc.add(gr);
for(let i=0;i<45;i++){const r=1+Math.random()*(i%5?.7:1.6),m=add(new T.Mesh(new T.DodecahedronGeometry(r,0),M(0x6e4129)),(Math.random()-.5)*160,r*.3,(Math.random()-.5)*160);if(Math.abs(m.position.x)<22&&Math.abs(m.position.z)<22)m.position.x+=45}
add(new T.Mesh(new T.CylinderGeometry(3,3,3,24),M(0xe8e4dc)),0,1.5,0);add(new T.Mesh(new T.SphereGeometry(3,24,12,0,Math.PI*2,0,Math.PI/2),M(0xf2efe8)),0,3,0);
if(cfg.s==1)for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const b=add(new T.Mesh(new T.BoxGeometry(2,3.4,.6),M(0x4a90c0,{transparent:true,opacity:.6})),Math.cos(a)*4.3,1.7,Math.sin(a)*4.3);b.rotation.y=-a+Math.PI/2}
if(cfg.s==2){const t=add(new T.Mesh(new T.TorusGeometry(4.6,1.3,10,36),M(0x7a4a30)),0,1,0);t.rotation.x=Math.PI/2}
const pn=[];for(let i=0;i<cfg.p;i++){const m=add(new T.Mesh(new T.BoxGeometry(2.6,.1,1.8),M(0x1f3f7a)),-11+(i%5)*3.2,1.2,-9-Math.floor(i/5)*2.6);m.rotation.x=-.5;pn.push(m)}
const bt=[];for(let i=0;i<cfg.b;i++){add(new T.Mesh(new T.BoxGeometry(1.3,1.3,1.3),M(0xb8bcc4)),9+(i%3)*1.6,.65,-3+Math.floor(i/3)*1.6);bt.push(add(new T.Mesh(new T.BoxGeometry(1,1,1),M(0x8fd694,{emissive:0x2a6a30})),9+(i%3)*1.6,.1,-3+Math.floor(i/3)*1.6))}
let gl=null;if(cfg.g){const m=add(new T.Mesh(new T.CylinderGeometry(2,2,6,16,1,true,0,Math.PI),M(0x7fd08a,{transparent:true,opacity:.45,side:T.DoubleSide})),8,0,7);m.rotation.z=Math.PI/2;gl=new T.PointLight(0xff66cc,0,14);gl.position.set(8,2,7);sc.add(gl)}
let ex=null;if(cfg.x){ex=new T.Group();ex.position.set(-9,0,7);sc.add(ex);add(new T.Mesh(new T.BoxGeometry(2,1,2),M(0xd9b34a)),0,.5,0,ex);const a=add(new T.Mesh(new T.BoxGeometry(.3,3,.3),M(0x555555)),0,2.4,0,ex);ex.arm=a}
const crew=[];for(let i=0;i<N;i++)crew.push(add(new T.Mesh(new T.CylinderGeometry(.25,.25,1.1,8),M(0xff8a3d)),0,.55,0));
const bc=add(new T.Mesh(new T.SphereGeometry(.5,10,10),new T.MeshBasicMaterial({color:0xff2020})),0,8,0);
const sd=new T.Mesh(new T.SphereGeometry(5,12,12),new T.MeshBasicMaterial({color:0xfff4d0,fog:false}));sc.add(sd);
const P=600,pp=new Float32Array(P*3);for(let i=0;i<P*3;i++)pp[i]=(Math.random()-.5)*(i%3==1?24:90);
const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pp,3));const dm=new T.PointsMaterial({color:0xe0a878,size:.35,transparent:true,opacity:.3,depthWrite:false}),dust=new T.Points(pg,dm);dust.position.y=10;sc.add(dust);
let az=.6,el2=.45,drag=0,px=0,py=0;const cv=rd.domElement;cv.onpointerdown=e=>{drag=1;px=e.clientX;py=e.clientY};window.onpointerup=()=>drag=0;cv.onpointermove=e=>{if(!drag)return;az-=(e.clientX-px)*.008;el2=Math.max(.1,Math.min(1.3,el2+(e.clientY-py)*.006));px=e.clientX;py=e.clientY};
const night=new T.Color(0x0b0b1a),c1=new T.Color(0xc0805a),c2=new T.Color(0x6a4028),col=new T.Color(),dc=new T.Color(),cl=new T.Color(),c3=new T.Color(0x1f3f7a),c4=new T.Color(0x8a5a3a);
V={raf:0};function loop(t){V.raf=requestAnimationFrame(loop);const s=S;if(!s)return;t*=.001;const hr=s.t%24,ang=Math.PI*(hr-6)/12,day=Math.max(0,Math.sin(ang)),td=Math.exp(-(s.tau-.5)*.4);
sun.position.set(Math.cos(ang)*80,Math.sin(ang)*80+1,20);sun.intensity=.08+1.1*day*td;amb.intensity=.15+.4*day;sd.position.copy(sun.position).multiplyScalar(2.2);sd.visible=day>.05&&s.tau<2;
dc.copy(c1).lerp(c2,Math.min(1,(s.tau-.5)/3));col.copy(night).lerp(dc,Math.min(1,day*1.4));sc.background=col;sc.fog.color.copy(col);sc.fog.density=.005+s.tau*.0065;
cl.copy(c3).lerp(c4,Math.min(1,s.cover/.7));pn.forEach(m=>m.material.color.copy(cl));
const cp=cfg.b*25+20,ch=Math.max(.05,s.bat/cp);bt.forEach(m=>{m.scale.y=ch;m.position.y=.1+ch*.5;m.material.color.setHex(ch<.15?0xe8935f:0x8fd694)});
if(gl)gl.intensity=s.gh&&hr>=4&&hr<20?1.6:0;if(ex&&ex.arm)ex.arm.rotation.z=s.ex?Math.sin(t*3)*.5:0;
pl.intensity=s.spe?1.5+Math.sin(t*8):0;bc.visible=Object.values(s.fail).some(x=>x)&&Math.sin(t*6)>0;
crew.forEach((m,i)=>{m.visible=!s.sh;const a=t*.15+i*1.6,r=6+i*.5;m.position.set(Math.cos(a)*r,.55,Math.sin(a)*r)});
dm.opacity=Math.min(.7,.08+s.tau*.16);dm.size=.3+s.tau*.08;const a=pg.attributes.position;for(let i=0;i<P;i++){let x=a.array[i*3]+.02+s.tau*.05;if(x>45)x-=90;a.array[i*3]=x}a.needsUpdate=true;
if(!drag)az+=.0012;const r=34;cam.position.set(Math.sin(az)*Math.cos(el2)*r,Math.sin(el2)*r+2,Math.cos(az)*Math.cos(el2)*r);cam.lookAt(0,2,0);rd.render(sc,cam)}
V.raf=requestAnimationFrame(loop)}
