!function(t){function e(n){if(o[n])return o[n].exports;var a=o[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var o={};e.m=t,e.c=o,e.d=function(t,o,n){e.o(t,o)||Object.defineProperty(t,o,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var o=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(o,"a",o),o},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s=0)}([function(t,e,o){t.exports=o(1)},function(t,e){document.body.clientHeight;const o=document.body.offsetHeight;let n,a,r,l=Date.now();const i=document.createElement("canvas");i.style.position="fixed",i.style.top="0",i.style.left="0",i.width=document.body.clientWidth,i.height=document.body.clientHeight,i.style["pointer-events"]="none",document.body.appendChild(i);const d=i.getContext("2d");d.fillStyle="white";let c=[];const h=[],s=[];for(var f=0;f<1e3;f++){var u=Math.random()*i.width,y=Math.random()*o;h.push({x:u,y:y,vx:80,vy:40+60*Math.random(),s:2+3*Math.random()})}const p=()=>{let t=document.querySelectorAll(".rooftop");c=[],t.forEach(t=>{let e=t.getClientRects();c.push({left:e[0].left,width:e[0].width,top:e[0].top})}),s.forEach((t,e)=>{let o=!1;c.forEach(e=>{t.x>e.left&&t.x<e.left+e.width&&(o=!0)}),o||delete s[e]})},x=()=>{requestAnimationFrame(x),n=Date.now(),(a=n-l)>1e3/60&&(deltaDistance=1e3/a,r=1e3/60/a,d.clearRect(0,0,i.width,i.height),d.fillStyle="white",s.forEach((t,e)=>{d.beginPath(),d.arc(t.x,t.y-document.body.scrollTop,t.s,0,2*Math.PI,!1),d.fill(),0==t.l--&&delete s[e]}),h.forEach(t=>{d.beginPath(),d.arc(t.x,t.y-document.body.scrollTop,t.s,0,2*Math.PI,!1),d.fill(),t.x+=.25*(Math.random()*(t.vx/deltaDistance)-t.vx/deltaDistance/2)*r,t.y+=t.vy/deltaDistance*.25*r,t.y>o?(t.y=0,t.x=Math.random()*i.width):c.forEach(e=>{t.y>e.top-3&&t.y<e.top&&t.x>e.left&&t.x<e.left+e.width&&Math.floor(2*Math.random())%2==0&&(s.push({x:t.x,y:t.y,l:1e3,s:t.s}),t.y=0,t.x=Math.random()*i.width,t.vx=80,t.vy=40+60*Math.random())})}),l=n)};window.addEventListener("resize",p),p(),x()}]);