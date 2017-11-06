
require('../assets/index.html');
require('../assets/index.css');

const page = document.body.clientHeight;
const pageHeight = document.body.offsetHeight;

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

const map = () => {

    let snow = document.querySelectorAll('.snow');
    
    platforms = [];
    
    snow.forEach((snowEl) => {
        let bounds = snowEl.getClientRects();
        platforms.push({ left: bounds[0].left, width: bounds[0].width, top: bounds[0].top });
    });    
    
}

for (var i=0; i<2000; i++) {
    var x = Math.random() * snowCanvas.width;
    var y = Math.random() * snowCanvas.height;
    snowflakes.push({ x: x, y: y, vx: 4, vy: 1 + (Math.random()*2), s: 2 + (Math.random()*3) });
}

const draw = () => {
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
        f.x += Math.random()*f.vx - (f.vx/2);
        f.y += f.vy;
        if (f.y>pageHeight) {
            f.y = 0;
            f.x = Math.random()*snowCanvas.width;
        } else {
            platforms.forEach((platform) => {
                if ( (f.y > platform.top-3 && f.y < platform.top) && (f.x > platform.left && f.x < platform.left+platform.width) && Math.floor(Math.random()*2)%2==0 ) {
                    snowflakesStatic.push({ x: f.x, y: f.y, l: 3000, s: f.s });
                    f.y = 0;
                    f.x = Math.random()*snowCanvas.width;
                    f.vx = 2;
                    f.vy = 1 + (Math.random()*2);
                }
            });    
        }
    });
    requestAnimationFrame(draw);
}

map();
draw();

var myEfficientFn = debounce(function() {
	map();
}, 16);

window.addEventListener('resize', myEfficientFn);

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};