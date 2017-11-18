import SnowWorker from './snow.worker.js';

const page = document.body.clientHeight;
const pageHeight = document.body.offsetHeight;

const snowflakesActive = 2000;
const snowflakesLifetime = 1000;

let snowflakesSAB = new SharedArrayBuffer(Uint16Array.BYTES_PER_ELEMENT * snowflakesActive * 3);
let snowflakesUInt16 = new Uint16Array(snowflakesSAB);

let snowflakes = [];
let snowWorker;

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

if (window.Worker) {
    snowWorker = new SnowWorker();
    snowWorker.postMessage(snowflakesSAB);
    snowWorker.postMessage({
        type: 'init',
        active: snowflakesActive,
        lifetime: snowflakesLifetime,
        width: snowCanvas.width,
        height: pageHeight
    });
} else {
    console.log("Snowfall requires webworkers because reasons.");
}

const screenMap = () => {
    let rooftops = document.querySelectorAll('.rooftop');
    let platforms = [];
    rooftops.forEach((rooftopEl) => {
        let bounds = rooftopEl.getClientRects();
        platforms.push({ left: bounds[0].left, width: bounds[0].width, top: bounds[0].top });
    });
    snowWorker.postMessage({
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

window.addEventListener('resize', screenMap);

screenMap();
drawSAB();
