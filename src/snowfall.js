
const page = document.body.clientHeight;
const pageHeight = document.body.offsetHeight;

const snowflakesActive = 1000;
const snowflakesLifetime = 1000;

let timestamp;
let delta, deltaCorrection;
let prevTimestamp = Date.now();
let fps = 60;
let frameInterval = 1000 / fps;
let timefactor = 0.25;

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
const snowflakes = [];
const snowflakesStatic = [];

//vx and vy are velocity in pixels per second
for (var i=0; i<snowflakesActive; i++) {
    var x = Math.random() * snowCanvas.width;
    var y = Math.random() * pageHeight;
    snowflakes.push({ x: x, y: y, vx: 80, vy: 40 + (Math.random()*60), s: 2 + (Math.random()*3) });
}

const screenMap = () => {
    let rooftops = document.querySelectorAll('.rooftop');
    platforms = [];
    rooftops.forEach((rooftopEl) => {
        let bounds = rooftopEl.getClientRects();
        platforms.push({ left: bounds[0].left, width: bounds[0].width, top: bounds[0].top });
    });
    snowflakesStatic.forEach((f,i) => {
        let keep = false;
        platforms.forEach((platform) => {
            if ( (f.x > platform.left && f.x < platform.left+platform.width) ) {
                keep = true;
            }
        });    
        if (!keep) { delete snowflakesStatic[i]; }
    });
}

const draw = () => {

    requestAnimationFrame(draw);
    
    timestamp = Date.now();
    delta = timestamp - prevTimestamp;

    if (delta > frameInterval) {

        deltaDistance = 1000/delta;
        deltaCorrection = frameInterval/delta;
        
        ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
        ctx.fillStyle = 'white';
        snowflakesStatic.forEach((f, i) => {
            ctx.beginPath();
            ctx.arc(f.x, f.y-document.body.scrollTop, f.s, 0, 2 * Math.PI, false);
            ctx.fill();
            if (f.l--===0) {
                delete snowflakesStatic[i];
            }
        });

        snowflakes.forEach((f) => {
            ctx.beginPath();
            ctx.arc(f.x, f.y-document.body.scrollTop, f.s, 0, 2 * Math.PI, false);
            ctx.fill();
            f.x += (Math.random()*(f.vx/deltaDistance) - ((f.vx/deltaDistance)/2)) * timefactor * deltaCorrection;
            f.y += (f.vy/deltaDistance) * timefactor * deltaCorrection;
            if (f.y>pageHeight) {
                f.y = 0;
                f.x = Math.random()*snowCanvas.width;
            } else {
                platforms.forEach((platform) => {
                    if ( (f.y > platform.top-3 && f.y < platform.top) && (f.x > platform.left && f.x < platform.left+platform.width) && Math.floor(Math.random()*2)%2==0 ) {
                        snowflakesStatic.push({ x: f.x, y: f.y, l: snowflakesLifetime, s: f.s });
                        f.y = 0;
                        f.x = Math.random()*snowCanvas.width;
                        f.vx = 80;
                        f.vy = 40 + (Math.random()*60);
                    }
                });    
            }
        });

        prevTimestamp = timestamp;

    }

}

window.addEventListener('resize', screenMap);

screenMap();
draw();
