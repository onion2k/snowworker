!function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/",t(t.s=0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(2),r=n.n(o);document.body.clientHeight;const i=document.body.offsetHeight;let s,c=new SharedArrayBuffer(1500*Uint16Array.BYTES_PER_ELEMENT*3),l=new Uint16Array(c);const a=document.createElement("canvas");a.style.position="fixed",a.style.top="0",a.style.left="0",a.width=document.body.clientWidth,a.height=document.body.clientHeight,a.style["pointer-events"]="none",document.body.appendChild(a);const u=a.getContext("2d");u.fillStyle="white",window.Worker?((s=new r.a).postMessage(c),s.postMessage({type:"init",active:1500,lifetime:1e3,width:a.width,height:i})):console.log("Snowfall requires webworkers because reasons.");const d=()=>{let e=[];document.querySelectorAll(".rooftop").forEach(t=>{let n=t.getClientRects();e.push({left:n[0].left,width:n[0].width,top:n[0].top})}),s.postMessage({type:"screenmap",platforms:e})},f=()=>{u.clearRect(0,0,a.width,a.height);for(var e=0;e<1500;e++)u.beginPath(),u.arc(l[3*e+0],l[3*e+1]-document.body.scrollTop,l[3*e+2],0,2*Math.PI,!1),u.fill();requestAnimationFrame(f)};window.addEventListener("resize",d),d(),f()},function(e,t,n){e.exports=function(){return new Worker(n.p+"snow.worker.js")}}]);