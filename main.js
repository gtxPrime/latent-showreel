gsap.registerPlugin(ScrollTrigger);
const W=window.WORKS,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const mobile=()=>innerWidth<=900,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const ytid=u=>{const m=u.match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{11})/);return m?m[1]:''};
const lenis=new Lenis({lerp:.085});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);lenis.stop();

/* ---------- ACTS + layout ---------- */
const stories=W.filter(w=>w.cat!=='Ads'),ads=W.filter(w=>w.cat==='Ads');
const ACTS=[
 {k:'Act I',t:'Stories',d:'Films, episodes, animation',items:stories,c1:'#f25749',c2:'#6b4cff'},
 {k:'Act II',t:'Brands',d:'Ads that move',items:ads.slice(0,12),c1:'#ffb347',c2:'#d4358c'},
 {k:'Act III',t:'Worlds',d:'Blender x AI, product, spectacle',items:ads.slice(12),c1:'#34e0c3',c2:'#2f6bff'}
];
const tun=$('#tunnel'),frames=[],acts=[];
let z=0,idx=0;const START=900,GAP=470,ACTGAP=620;
z=START;
const sc=()=>mobile()?.55:1;
ACTS.forEach((a,ai)=>{
 const el=document.createElement('div');el.className='act';el.innerHTML=`<small>${a.k}</small><h2>${a.t}</h2><p>${a.d}</p>`;tun.appendChild(el);
 gsap.set(el,{x:0,y:0,z:-z});acts.push({el,z,a,ai});z+=ACTGAP;
 a.items.forEach((w,i)=>{
  idx++;const f=document.createElement('div');f.className='fr';
  f.innerHTML=`<div class="fimg"><img src="${w.img}" alt="${w.title}" loading="eager" decoding="async"><span class="rec">REC ${String(w.n).padStart(2,'0')}</span><div class="ftag"><b>${w.title}</b><span>${w.cat}</span></div></div>`;
  tun.appendChild(f);
  const ang=idx*2.399963;const rx=(mobile()?.0:0);
  f._ang=ang;f._z=z;f._w=w;f._a=a;f._i=idx;f._ai=ai;frames.push(f);z+=GAP});
 z+=ACTGAP*.4;
});
const END=z+300;
const rnd=(n=>{let a=n;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}})(35);
frames.forEach(f=>{f._r=[rnd(),rnd(),rnd(),rnd(),rnd(),rnd()]});
function layout(){frames.forEach((f,i)=>{
 const vw=innerWidth,vh=innerHeight,m=mobile(),r=f._r;
 const side=r[0]<.5?-1:1;
 const xm=m?vw*.16:vw*.26, ym=m?vh*.24:vh*.26;
 const x=side*xm*(.15+.95*r[1])*(m?.9:1.05);
 const y=(r[2]*2-1)*ym;
 const s=.82+r[3]*.5;
 gsap.set(f,{x,y,z:-f._z,scale:s,rotationY:-side*(4+r[4]*(m?12:24)),rotationX:(r[5]*2-1)*(m?5:9),rotationZ:(r[4]*2-1)*(m?4:7),transformPerspective:0});
});
 acts.forEach(a=>gsap.set(a.el,{z:-a.z}))}
layout();ScrollTrigger.addEventListener('refreshInit',layout);

/* ---------- starfield ---------- */
const cv=$('#stars'),cx=cv.getContext('2d');let SW,SH,stars=[],vel=0;
const NSTAR=mobile()?110:220;
function sizeStars(){SW=cv.width=innerWidth*Math.min(devicePixelRatio,1.5);SH=cv.height=innerHeight*Math.min(devicePixelRatio,1.5)}
sizeStars();addEventListener('resize',sizeStars);
for(let i=0;i<NSTAR;i++)stars.push({x:(Math.random()-.5)*2,y:(Math.random()-.5)*2,z:Math.random()});
let cprev=0,cnow=0;
function drawStars(){cx.fillStyle='rgba(5,5,7,.55)';cx.fillRect(0,0,SW,SH);
 const sp=.0009+vel*.0016,f=Math.max(SW,SH)*.5;
 for(const s of stars){const pz=s.z;s.z-=sp*(1+(s.x*s.x+s.y*s.y));if(s.z<=.02){s.x=(Math.random()-.5)*2;s.y=(Math.random()-.5)*2;s.z=1;continue}
  const px=SW/2+s.x/pz*f*.35,py=SH/2+s.y/pz*f*.35,nx=SW/2+s.x/s.z*f*.35,ny=SH/2+s.y/s.z*f*.35;
  const a=Math.min(1,(1-s.z)*1.3);cx.strokeStyle=`rgba(255,255,255,${a})`;cx.lineWidth=Math.max(.6,(1-s.z)*2.2*(SW>900?1:.7));cx.beginPath();cx.moveTo(px,py);cx.lineTo(nx,ny);cx.stroke()}
}
gsap.ticker.add(()=>{vel+=((Math.abs(cnow-cprev)/40)-vel)*.12;cprev=cnow;drawStars()});

/* ---------- loader: diffusion denoise ---------- */
const dn=$('#dn'),dx=dn.getContext('2d',{willReadFrequently:true}),DW=dn.width,DH=dn.height;
const prompts=['cinematic frame, ai film, 35mm, volumetric light','frame by frame, story through ai, high detail','palash sharma, ai filmmaker, showreel'];
$('#ptext').textContent=prompts[0];
const srcImg=new Image();srcImg.src=W[4].img;
const off=document.createElement('canvas'),ox=off.getContext('2d',{willReadFrequently:true});
function denoise(p){ // p 0..1
 const k=Math.pow(p,2.2),tw=Math.max(4,Math.round(DW*(.025+.975*k))),th=Math.max(3,Math.round(tw*DH/DW));
 off.width=tw;off.height=th;ox.drawImage(srcImg,0,0,tw,th);
 const id=ox.getImageData(0,0,tw,th),d=id.data,n=Math.pow(1-p,1.4)*255*1.6,mix=Math.pow(1-p,2.2);
 for(let i=0;i<d.length;i+=4){const r=(Math.random()-.5)*n;d[i]=d[i]*(1-mix)+Math.random()*255*mix+r;d[i+1]=d[i+1]*(1-mix)+Math.random()*255*mix+r;d[i+2]=d[i+2]*(1-mix)+Math.random()*255*mix+r}
 ox.putImageData(id,0,0);dx.imageSmoothingEnabled=false;dx.drawImage(off,0,0,tw,th,0,0,DW,DH)}
const urls=[...new Set(W.map(w=>w.img))].slice(0,40);let loaded=0;
urls.forEach(u=>{const im=new Image();im.onload=im.onerror=()=>loaded++;im.src=u});
const L={p:0};let lastStep=-1,tStart=performance.now();
const loaderTick=()=>{const t=(performance.now()-tStart)/1000;
 const target=Math.min(t/3.4,1)*.97+((loaded/urls.length)>=1&&t>3.4?.03:0);
 const lp=Math.min(target,.25+.75*(loaded/urls.length));L.p+=(lp-L.p)*.2;
 const step=Math.round(L.p*50);if(step!==lastStep&&srcImg.complete){lastStep=step;denoise(L.p);$('#step').textContent=String(step).padStart(2,'0');$('#pct').textContent=Math.round(L.p*100)+'%';$('#pbar').style.width=L.p*100+'%';
  if(step===18)$('#ptext').textContent=prompts[1];if(step===36)$('#ptext').textContent=prompts[2]}
 if(L.p>.985&&loaded>=urls.length&&t>3.4){gsap.ticker.remove(loaderTick);finishLoader()}};
gsap.ticker.add(loaderTick);
const still=location.hash==='#static';
// hero name scramble
const NAME='PALASH SHARMA';const hn=$('#hname');
hn.innerHTML=NAME.split(' ').map(w=>`<span class="w">${[...w].map(c=>`<span class="ch">${c}</span>`).join('')}</span>`).join('<br>');
function scramble(){const chs=$$('#hname .ch'),G='ABCDEFGHJKLMNPQRSTUVWXYZ#%&*+<>';chs.forEach((c,i)=>{const final=c.textContent;let n=0;const t0=18+i*3;const iv=setInterval(()=>{n++;c.textContent=n>t0?final:G[(Math.random()*G.length)|0];if(n>t0)clearInterval(iv)},34)})}
function finishLoader(){
 $('#ptext').textContent='render complete.';
 const tl=gsap.timeline();
 tl.to('.pre-frame',{scale:1.08,duration:.5,ease:'power2.in'})
  .to('#flash',{opacity:1,duration:.12},'-=.05')
  .set('#pre',{display:'none'})
  .to('#flash',{opacity:0,duration:.9,ease:'power2.out'})
  .add(()=>{document.body.classList.remove('locked');scramble();ready=true},'-=.9')
  .from('.hero>*:not(h1)',{y:30,opacity:0,duration:.9,stagger:.12,ease:'power3.out'},'-=.5')
  .from('#hname .ch',{yPercent:60,opacity:0,duration:.8,stagger:.03,ease:'power3.out'},'-=1.2')
  .add(()=>{$$('.hud,#prog-bar,.tc').forEach(e=>e.classList.remove('off'));lenis.start();ScrollTrigger.refresh()},'-=.2');
}
let ready=false;
if(still){$('#pre').style.display='none';document.body.classList.remove('locked');ready=true;$$('.hud,#prog-bar,.tc').forEach(e=>e.classList.remove('off'));lenis.start();gsap.ticker.remove(loaderTick)}

/* ---------- flight ---------- */
const dist=()=>innerHeight*(mobile()?20:26);
const col=gsap.utils.interpolate;
const state={near:null};
function setColors(p){ // act colour crossfade
 const prog=p*ACTS.length;const i=Math.min(ACTS.length-1,Math.floor(prog)),t=prog-i,a=ACTS[i],b=ACTS[Math.min(i+1,ACTS.length-1)];
 const t2=gsap.utils.clamp(0,1,(t-.6)/.4);
 document.documentElement.style.setProperty('--c1',col(a.c1,b.c1,t2));document.documentElement.style.setProperty('--c2',col(a.c2,b.c2,t2));document.documentElement.style.setProperty('--acc',col(a.c1,b.c1,t2));
}
const mx=gsap.quickTo('.room','rotationY',{duration:.8}),my=gsap.quickTo('.room','rotationX',{duration:.8});
if(matchMedia('(hover:hover)').matches)addEventListener('mousemove',e=>{mx((e.clientX/innerWidth-.5)*7);my(-(e.clientY/innerHeight-.5)*5)});
const hero=$('#hero');
ScrollTrigger.create({trigger:'#flight',start:'top top',end:()=>'+='+dist(),pin:true,scrub:true,invalidateOnRefresh:true,anticipatePin:1,
 onUpdate:self=>{
  const p=self.progress,c=p*END;cnow=c;gsap.set(tun,{z:c});
  gsap.set('#prog-bar i',{scaleX:p});
  // hero recedes
  const hp=gsap.utils.clamp(0,1,p/.03);hero.style.opacity=1-hp;hero.style.transform=`scale(${1+hp*1.4})`;hero.style.pointerEvents=hp>.5?'none':'';
  tun.style.opacity=gsap.utils.clamp(0,1,(p-.004)/.02);
  setColors(p);
  const v=Math.min(1,vel*3);
  let near=null,nd=1e9;
  for(const f of frames){const d=f._z-c;
   if(d>3400||d<-80){if(f._v!==0){f.style.visibility='hidden';f._v=0}continue}
   if(f._v!==1){f.style.visibility='visible';f._v=1}
   let o=d>2300?(3400-d)/1100:1;if(d<260)o=Math.max(0,d/260);
   o=Math.round(o*50)/50;if(f._o!==o){f._o=o;f.style.opacity=o}
   const lit=d>180&&d<900;if(lit!==f._l){f._l=lit;f.classList.toggle('lit',lit)}
   if(d>0&&d<nd){nd=d;near=f}
   if(d<1800&&!mobile()){f.firstChild.style.setProperty('--ca',v>.15?`${-v*7}px 0 0 #ff2a55aa,${v*7}px 0 0 #2ad4ffaa`:'0 0 0 transparent')}}
  for(const a of acts){const d=a.z-c;const o=d>2600?0:d>1800?(2600-d)/800:d<200?Math.max(0,d/200):1;if(a._o!==o){a._o=Math.round(o*40)/40;a.el.style.opacity=a._o;a.el.style.visibility=o<=0?'hidden':'visible'}}
  if(near!==state.near){state.near=near;if(near){$('#passing').textContent=near._w.title+' - '+near._w.sub;$('#actlbl').textContent=near._a.k+' - '+near._a.t}}
  if(!near){$('#passing').textContent='Final cut';$('#actlbl').textContent='End'}
  if(p<.015){$('#passing').textContent='AI filmmaker';$('#actlbl').textContent='Prologue'}
  const fr=near?near._i:frames.length;$('#frv').textContent=String(fr).padStart(3,'0');
  const sec=p*96,fm=Math.floor(sec*24)%24;$('#tcv').textContent=`00:${String(Math.floor(sec/60)).padStart(2,'0')}:${String(Math.floor(sec%60)).padStart(2,'0')}:${String(fm).padStart(2,'0')}`;
  $('#final').classList.toggle('off',p<.965);
 }});
$('#enter').addEventListener('click',()=>lenis.scrollTo(innerHeight*(mobile()?1.1:1.4)));
$('#toContact').addEventListener('click',()=>lenis.scrollTo('#contact'));
$('#down').addEventListener('click',()=>lenis.scrollTo('#contact'));
$('#home').addEventListener('click',e=>{e.preventDefault();lenis.scrollTo(0)});
gsap.from('.credits>*',{y:50,opacity:0,duration:.9,stagger:.08,ease:'power3.out',scrollTrigger:{trigger:'#contact',start:'top 70%'}});

/* ---------- click on frames (projected hit-test) ---------- */
function frameAt(x,y){let best=null,bw=0;for(const f of frames){if(f._v!==1||(f._o??1)<.4)continue;const r=f.getBoundingClientRect();if(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom&&r.width>bw){bw=r.width;best=f}}return best}
$('#flight').addEventListener('click',e=>{if(e.target.closest('a,button'))return;const f=frameAt(e.clientX,e.clientY);if(f)openPlayer(f._w,f)});
let hov=null,hmx=-1,hmy=-1;
function setHover(f){if(f===hov)return;if(hov){hov.classList.remove('hov');const i=hov.firstChild;i.style.removeProperty('--rx');i.style.removeProperty('--ry')}hov=f;document.body.classList.toggle('hovering',!!f);if(f)f.classList.add('hov');$('#flight').style.cursor=f?'pointer':''}
function hoverCheck(){if(hmx<0||mobile())return;const f=frameAt(hmx,hmy);setHover(f);if(f){const r=f.getBoundingClientRect(),px=(hmx-r.left)/r.width-.5,py=(hmy-r.top)/r.height-.5,i=f.firstChild;i.style.setProperty('--rx',(-py*14).toFixed(1)+'deg');i.style.setProperty('--ry',(px*18).toFixed(1)+'deg');i.style.setProperty('--gx',(px+.5)*100+'%');i.style.setProperty('--gy',(py+.5)*100+'%')}}
$('#flight').addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;hmx=e.clientX;hmy=e.clientY;hoverCheck()});
$('#flight').addEventListener('pointerleave',()=>{hmx=-1;setHover(null)});
gsap.ticker.add(()=>{if(hov||hmx>=0)hoverCheck()});

/* ---------- quick scan ---------- */
const cats=['All','Films','Ads','Animation'];
$('#filters').innerHTML=cats.map((c,i)=>`<button class="chip${i?'':' on'}" data-c="${c}">${c}</button>`).join('');
function drawGrid(c){const g=$('#pgrid'),list=W.filter(w=>c==='All'||w.cat===c);
 g.innerHTML=list.map(w=>`<button class="pcard" data-n="${w.n}"><div class="im"><img src="${w.img}" alt="${w.title}"></div><span class="no">${String(w.n).padStart(2,'0')}</span><h3>${w.title}<small>${w.cat}</small></h3></button>`).join('');
 const k=list.length,cols=mobile()?4:(k>28?7:k>20?6:k>12?5:4);g.style.gridTemplateColumns=`repeat(${cols},1fr)`;
 gsap.from('#pgrid .pcard',{scale:.8,opacity:0,duration:.5,stagger:{each:.012,from:'center'},ease:'power2.out',clearProps:'all'})}
$('#filters').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;$$('.chip').forEach(x=>x.classList.toggle('on',x===b));drawGrid(b.dataset.c)});
$('#pgrid').addEventListener('click',e=>{const c=e.target.closest('.pcard');if(c)openPlayer(W[c.dataset.n-1],c)});
function openProg(){drawGrid('All');const o=$('#programme');o.classList.add('open');o.setAttribute('aria-hidden','false');gsap.to(o,{opacity:1,duration:.4});lenis.stop()}
function closeProg(){const o=$('#programme');gsap.to(o,{opacity:0,duration:.3,onComplete:()=>{o.classList.remove('open');o.setAttribute('aria-hidden','true');lenis.start()}})}
$('#prog').addEventListener('click',openProg);$('#prog2').addEventListener('click',openProg);$('#closeProg').addEventListener('click',closeProg);

/* ---------- player ---------- */
let flying=null;
function openPlayer(w,el){
 const p=$('#player'),f=$('#pframe');
 $('#ptitle').textContent=w.title;$('#psub').textContent=w.sub;$('#pyt').href=w.url;
 f.innerHTML='';f.style.backgroundImage=`url(${w.img})`;
 p.classList.add('open');p.setAttribute('aria-hidden','false');lenis.stop();
 gsap.set('#pframe',{opacity:0});gsap.set('.pmeta',{opacity:0,y:20});gsap.to(p,{opacity:1,duration:.5});
 requestAnimationFrame(()=>{
  const a=el.getBoundingClientRect(),b=f.getBoundingClientRect();
  const fly=document.createElement('div');fly.style.cssText=`position:fixed;z-index:99;left:0;top:0;background:url(${w.img}) center/cover;border:2px solid var(--acc);box-shadow:0 0 90px color-mix(in srgb,var(--acc) 60%,transparent);pointer-events:none;border-radius:6px`;
  document.body.appendChild(fly);flying=fly;
  gsap.set(fly,{x:a.left,y:a.top,width:a.width,height:a.height});
  gsap.to(fly,{x:b.left,y:b.top,width:b.width,height:b.height,duration:reduce?.01:.9,ease:'expo.inOut',onComplete:()=>{
   gsap.set('#pframe',{opacity:1});fly.remove();flying=null;
   const id=ytid(w.url);if(id)f.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="${w.title}"></iframe>`;
   gsap.to('.pmeta',{opacity:1,y:0,duration:.5})}});
 });
}
function closePlayer(){const p=$('#player');if(flying){flying.remove();flying=null}
 gsap.to(p,{opacity:0,duration:.35,onComplete:()=>{p.classList.remove('open');p.setAttribute('aria-hidden','true');$('#pframe').innerHTML='';if(!$('#programme').classList.contains('open'))lenis.start()}})}
$('#closePlayer').addEventListener('click',closePlayer);
$('#player').addEventListener('click',e=>{if(e.target.id==='player')closePlayer()});
addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#player').classList.contains('open'))closePlayer();else if($('#programme').classList.contains('open'))closeProg()}});
addEventListener('load',()=>ScrollTrigger.refresh());
