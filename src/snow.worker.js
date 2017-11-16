
console.log('Snow worker');

let s = self;
let snowflakes = [];

function init(data){

    console.log(data);

    let active = data.active;
    let width = data.width;
    let height = data.height;
    
    for (var i=0; i<active; i++) {
        var x = Math.random() * width;
        var y = Math.random() * height;
        snowflakes.push({ x: x, y: y, vx: 80, vy: 40 + (Math.random()*60), s: 2 + (Math.random()*3) });
    }

    console.log(snowflakes)

    s.postMessage({ snowflakes: snowflakes });
    
}

// Post data to parent thread
s.postMessage({ snowflakes: 'hello' });

s.addEventListener('message', (event) => {

    if (event.data.type==='init') {

        init(event.data);

    }

});
