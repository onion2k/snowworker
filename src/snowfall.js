import SnowWorker from './snow.worker.js';

const page = document.body.clientHeight;
const pageHeight = document.body.offsetHeight;

const snowflakesActive = 1000;
const snowflakesLifetime = 1000;

let timestamp;
let delta, deltaDistance, deltaCorrection;
let prevTimestamp = Date.now();
let fps = 60;
let frameInterval = 1000 / fps;
let timefactor = 1.0;

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

let platforms = [];

if (window.Worker) {

    const snowWorker = new SnowWorker();

    snowWorker.onmessage = function(e) {
        draw(e.data.snowflakes);
    }

    snowWorker.postMessage({
        type: 'init',
        active: snowflakesActive,
        width: snowCanvas.width,
        height: pageHeight
    });

} else {

    console.log("Snowfall requires webworkers because reasons.");

}

const screenMap = () => {
    let rooftops = document.querySelectorAll('.rooftop');
    platforms = [];
    rooftops.forEach((rooftopEl) => {
        let bounds = rooftopEl.getClientRects();
        platforms.push({ left: bounds[0].left, width: bounds[0].width, top: bounds[0].top });
    });
}

const draw = (snowflakes) => {

    ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

    snowflakes.forEach((f) => {
        ctx.beginPath();
        ctx.arc(f.x, f.y-document.body.scrollTop, f.s, 0, 2 * Math.PI, false);
        ctx.fill();
    });

    prevTimestamp = timestamp;

}

window.addEventListener('resize', screenMap);

screenMap();
