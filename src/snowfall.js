
require('../assets/index.html');
require('../assets/index.css');

const page = document.body.clientHeight;

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

const map = () => {

    let snow = document.querySelectorAll('.snow');
    
    platforms = [];
    
    snow.forEach((snowEl) => {
        let bounds = snowEl.getClientRects();
        platforms.push({ left: bounds[0].left, width: bounds[0].width, top: bounds[0].top });
    });    

    // draw();
    
}

const draw = () => {
    ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    platforms.forEach((platform) => {
        ctx.fillRect(platform.left, platform.top-10-document.body.scrollTop, platform.width, 10);
    });
    requestAnimationFrame(draw);
}

map();
draw();

var myEfficientFn = debounce(function() {
	map();
}, 16);

window.addEventListener('resize', myEfficientFn);
// window.addEventListener('scroll', draw);

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