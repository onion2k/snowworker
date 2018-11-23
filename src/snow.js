const worker_fn = `

    let s = this;
    let snowflakesUInt16;
    let snowWorkerInstance = undefined;
    
    class snowWorkerWW {
        constructor(data){
            this.active = data.active;
            this.width = data.width;
            this.height = data.height;
            this.snowflakesLifetime = data.lifetime;
            this.snowflakes = [];
            this.platforms = [];
            this.prevTimestamp = Date.now();
            this.fps = 60;
            this.frameInterval = 1000 / this.fps;
            this.timefactor = 1;
            for (var i=0; i<this.active; i++) {
                var x = Math.floor(Math.random() * this.width);
                var y = Math.floor(Math.random() * this.height);
                var s = Math.floor(2 + (Math.random()*3));
                this.snowflakes.push({ x: x, y: y, vx: 80, vy: 40 + (Math.random()*60), s: s });
                snowflakesUInt16[(i*3)+0] = x;
                snowflakesUInt16[(i*3)+1] = y;
                snowflakesUInt16[(i*3)+2] = s;
            }
            // s.postMessage({ snowflakes: this.snowflakes, snowflakesStatic: this.snowflakesStatic });
            this.update();
        }
        screenmap(platforms) {
            this.platforms = platforms;
            this.snowflakes.forEach((f,i) => {
                if (f.l>0) {
                    let keep = false;
                    platforms.forEach((platform) => {
                        if ( (f.x > platform.left && f.x < platform.left+platform.width) ) { keep = true; }
                    });
                    if (!keep) { f.l=0; }
                }
            });
        }
        update() {

            let timestamp = Date.now();
            let delta = timestamp - this.prevTimestamp;
            let deltaDistance = 1000/delta;
    
            this.snowflakes.forEach((f, i) => {
                if (f.l > 0) {
                    if (f.l--===0) {
                        f.y = 0;
                        f.x = Math.random()*this.width;
                        f.vx = 80;
                        f.vy = 40 + (Math.random()*60);
                    }
                } else {
                    f.x += (Math.random()*(f.vx/deltaDistance) - ((f.vx/deltaDistance)/2)) * this.timefactor;
                    f.y += (f.vy/deltaDistance) * this.timefactor;
                    if (f.y>this.height) {
                        f.y = 0;
                        f.x = Math.random()*this.width;
                    } else {
                        this.platforms.forEach((platform) => {
                            if ( (f.y > platform.top-3 && f.y < platform.top) && (f.x > platform.left && f.x < platform.left+platform.width) && Math.floor(Math.random()*2)%2==0 ) {
                                f.l = this.snowflakesLifetime;
                            }
                        });
                    }
                }
                snowflakesUInt16[(i*3)+0] = f.x;
                snowflakesUInt16[(i*3)+1] = f.y;
                snowflakesUInt16[(i*3)+2] = f.s;
            });
            // s.postMessage({ snowflakes: this.snowflakes });
            this.prevTimestamp = timestamp;
    
            setTimeout(()=>{
                this.update();
            }, this.frameInterval);
    
        }
    }
    
    s.addEventListener('message', (event) => {
        if (event.data.type==='init') {
            snowWorkerInstance = new snowWorkerWW(event.data);
        } else if (event.data.type==='screenmap') {
            if (!snowWorkerInstance) {
                console.warn("No snowfall worker instance");
            } else {
                snowWorkerInstance.screenmap(event.data.platforms);
            }
        } else {
            snowflakesUInt16 = new Uint16Array(event.data);
        }
    });
    
`

var blob = new Blob([worker_fn], { type: "text/javascript" });
let SnowWorker = new Worker(window.URL.createObjectURL(blob));

const page = document.body.clientHeight;
const pageHeight = document.body.offsetHeight;

const snowflakesActive = 1500;
const snowflakesLifetime = 1000;

let snowflakesSAB = new SharedArrayBuffer(Uint16Array.BYTES_PER_ELEMENT * snowflakesActive * 3);
let snowflakesUInt16 = new Uint16Array(snowflakesSAB);

let snowflakes = [];

const snowCanvas = document.createElement('canvas');
snowCanvas.style.position = 'fixed';
snowCanvas.style.top = '0';
snowCanvas.style.left = '0';
snowCanvas.width = document.body.clientWidth;
snowCanvas.height = document.body.clientHeight;
snowCanvas.style['pointer-events'] = 'none';
document.body.appendChild(snowCanvas);

const ctx = snowCanvas.getContext('2d');
ctx.fillStyle = 'white';

const screenMap = () => {
    console.log("Mapping");
    let rooftops = document.querySelectorAll('.rooftop');
    let platforms = [];
    rooftops.forEach((rooftopEl) => {
        let bounds = rooftopEl.getClientRects();
        platforms.push({ left: bounds[0].left, width: bounds[0].width, top: bounds[0].top });
    });
    SnowWorker.postMessage({
        type: 'screenmap',
        platforms: platforms
    });
}


const drawSAB = () => {

    ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

    for (var i=0; i<snowflakesActive; i++) {

        ctx.beginPath();
        ctx.arc(snowflakesUInt16[(i*3)+0], snowflakesUInt16[(i*3)+1]-document.body.scrollTop, snowflakesUInt16[(i*3)+2], 0, 2 * Math.PI, false);
        ctx.fill();

    }
    
    requestAnimationFrame(drawSAB);
    
}

if (window.Worker) {
    SnowWorker.postMessage(snowflakesSAB);
    SnowWorker.postMessage({
        type: 'init',
        active: snowflakesActive,
        lifetime: snowflakesLifetime,
        width: snowCanvas.width,
        height: pageHeight
    });
    console.log(pageHeight, page);
} else {
    console.log("Snowfall requires webworkers because reasons.");
}

window.addEventListener('resize', screenMap);

screenMap();
drawSAB();
