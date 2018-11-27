!function(t){var e={};function n(a){if(e[a])return e[a].exports;var i=e[a]={i:a,l:!1,exports:{}};return t[a].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,a){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(a,i,function(e){return t[e]}.bind(null,i));return a},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/",n(n.s=0)}([function(t,e,n){t.exports=n(1)},function(t,e){let n,a,i;document.body.clientHeight;const o=document.body.offsetHeight,s=document.createElement("canvas");s.style.position="fixed",s.style.top="0",s.style.left="0",s.width=document.body.clientWidth,s.height=document.body.clientHeight,s.style["pointer-events"]="none",document.body.appendChild(s);const r=s.getContext("2d");r.fillStyle="white";const f=()=>{let t=[];document.querySelectorAll(".rooftop").forEach(e=>{let n=e.getClientRects();t.push({left:n[0].left,width:n[0].width,top:n[0].top})}),n.postMessage({type:"screenmap",platforms:t})},l=()=>{r.clearRect(0,0,s.width,s.height);for(var t=0;t<1500;t++)r.beginPath(),r.arc(i[3*t+0],i[3*t+1]-document.body.scrollTop,i[3*t+2],0,2*Math.PI,!1),r.fill();requestAnimationFrame(l)};if(window.Worker){let t=new Blob(["\n\n    let s = this;\n    let snowflakesUInt16;\n    let snowWorkerInstance = undefined;\n    \n    class snowWorkerWW {\n        constructor(data){\n            this.gravity = data.gravity || 9.4;\n            console.log(this.gravity);\n            this.wind = data.wind || 0;\n            this.active = data.active;\n            this.width = data.width;\n            this.height = data.height;\n            this.snowflakesLifetime = data.lifetime;\n            this.snowflakes = [];\n            this.platforms = [];\n            this.prevTimestamp = Date.now();\n            this.fps = 60;\n            this.frameInterval = 1000 / this.fps;\n            this.timefactor = 1;\n            for (var i=0; i<this.active; i++) {\n                var x = Math.floor(Math.random() * this.width);\n                var y = Math.floor(Math.random() * this.height);\n                var s = Math.floor(2 + (Math.random()*3));\n                this.snowflakes.push({ x: x, y: y, vx: 80, vy: 40 + (Math.random()*60), s: s });\n                snowflakesUInt16[(i*3)+0] = x;\n                snowflakesUInt16[(i*3)+1] = y;\n                snowflakesUInt16[(i*3)+2] = s;\n            }\n            this.update = this.update.bind(this);\n            this.update();\n        }\n        screenmap(platforms) {\n            this.platforms = platforms;\n            this.snowflakes.forEach((f,i) => {\n                if (f.l>0) {\n                    let keep = false;\n                    platforms.forEach((platform) => {\n                        if ( (f.x > platform.left && f.x < platform.left+platform.width) ) { keep = true; }\n                    });\n                    if (!keep) { f.l=0; }\n                }\n            });\n        }\n        update() {\n\n            let timestamp = Date.now();\n            let delta = timestamp - this.prevTimestamp;\n            let deltaDistance = 1000/delta;\n    \n            this.snowflakes.forEach((f, i) => {\n                if (f.l > 0) {\n                    if (f.l--===0) {\n                        f.y = 0;\n                        f.x = Math.random()*this.width;\n                        f.vx = 80;\n                        f.vy = 40 + (Math.random()*60);\n                    }\n                } else {\n                    f.x += (Math.random()*this.wind*(f.vx/deltaDistance) - ((f.vx/deltaDistance)/2)) * this.timefactor;\n                    f.y += (f.vy/deltaDistance) * (this.gravity / 9.4) * this.timefactor;\n                    if (f.y>this.height) {\n                        f.y = 0;\n                        f.x = Math.random()*this.width;\n                    } if (f.x<0) {\n                        f.x = this.width;\n                    } if (f.x>this.width) {\n                        f.x = 0;\n                    } else {\n                        this.platforms.forEach((platform) => {\n                            if ( (f.y > platform.top-3 && f.y < platform.top) && (f.x > platform.left && f.x < platform.left+platform.width) && Math.floor(Math.random()*2)%2==0 ) {\n                                f.l = this.snowflakesLifetime;\n                            }\n                        });\n                    }\n                }\n                snowflakesUInt16[(i*3)+0] = f.x;\n                snowflakesUInt16[(i*3)+1] = f.y;\n                snowflakesUInt16[(i*3)+2] = f.s;\n            });\n\n            if (!this.nonShared) {\n                s.postMessage({ snowflakes: this.snowflakes });\n            }\n\n            this.prevTimestamp = timestamp;\n\n            setTimeout(()=>{\n                this.update();\n            }, this.frameInterval)\n    \n        }\n    }\n    \n    s.addEventListener('message', (event) => {\n\n        if (event.data.type==='init') {\n            snowWorkerInstance = new snowWorkerWW(event.data);\n        } else if (event.data.type==='screenmap') {\n            if (!snowWorkerInstance) {\n                console.warn(\"No snowfall worker instance\");\n            } else {\n                snowWorkerInstance.screenmap(event.data.platforms);\n            }\n        } else {\n            if (event.data.length > 0) {\n                this.nonShared = true;\n                snowflakesUInt16 = event.data;\n            } else {\n                this.nonShared = false;\n                snowflakesUInt16 = new Uint16Array(event.data);\n            }\n        }\n    });\n    \n"],{type:"text/javascript"});n=new Worker(window.URL.createObjectURL(t)),window.SharedArrayBuffer?(console.log("Snowfall with shared buffer."),a=new SharedArrayBuffer(1500*Uint16Array.BYTES_PER_ELEMENT*3),i=new Uint16Array(a),n.postMessage(a),n.postMessage({type:"init",gravity:snowWorkerConfig.gravity,wind:snowWorkerConfig.wind,active:1500,lifetime:1e3,width:s.width,height:o}),l()):window.Uint16Array?(console.log("Snowfall without shared buffer."),i=new Uint16Array(1500*Uint16Array.BYTES_PER_ELEMENT*3),n.postMessage(i),n.postMessage({type:"init",gravity:snowWorkerConfig.gravity,wind:snowWorkerConfig.wind,active:1500,lifetime:1e3,width:s.width,height:o}),n.onmessage=(t=>{(t=>{r.clearRect(0,0,s.width,s.height);for(var e=0;e<1500;e++)r.beginPath(),r.arc(t.data.snowflakes[e].x,t.data.snowflakes[e].y-document.body.scrollTop,t.data.snowflakes[e].s,0,2*Math.PI,!1),r.fill()})(t)})):console.log("Snowfall requires SharedArrayBuffer."),window.addEventListener("resize",f),window.addEventListener("DOMContentLoaded",f)}else console.log("Snowfall requires webworkers because reasons.")}]);