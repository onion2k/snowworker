
let s = self;

class snowWorkerWW {
    constructor(data){

        this.active = data.active;
        this.width = data.width;
        this.height = data.height;
        this.snowflakes = [];
        this.snowflakesStatic = [];

        this.prevTimestamp = Date.now();
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;

        this.timefactor = 1;
        
        for (var i=0; i<this.active; i++) {
            var x = Math.random() * this.width;
            var y = Math.random() * this.height;
            this.snowflakes.push({ x: x, y: y, vx: 80, vy: 40 + (Math.random()*60), s: 2 + (Math.random()*3) });
        }
        
        s.postMessage({ snowflakes: this.snowflakes });
        this.update();

    }
    screenmap() {
        // snowflakesStatic.forEach((f,i) => {
        //     let keep = false;
        //     platforms.forEach((platform) => {
        //         if ( (f.x > platform.left && f.x < platform.left+platform.width) ) {
        //             keep = true;
        //         }
        //     });    
        //     if (!keep) { delete snowflakesStatic[i]; }
        // });
    }
    update() {

        let timestamp = Date.now();
        let delta = timestamp - this.prevTimestamp;

        let deltaDistance = 1000/delta;
        let deltaCorrection = this.frameInterval/delta;

        this.snowflakes.forEach((f) => {
            f.x += (Math.random()*(f.vx/deltaDistance) - ((f.vx/deltaDistance)/2)) * this.timefactor * deltaCorrection;
            f.y += (f.vy/deltaDistance) * this.timefactor * deltaCorrection;
            if (f.y>this.height) {
                f.y = 0;
                f.x = Math.random()*this.width;
            } else {
                // platforms.forEach((platform) => {
                //     if ( (f.y > platform.top-3 && f.y < platform.top) && (f.x > platform.left && f.x < platform.left+platform.width) && Math.floor(Math.random()*2)%2==0 ) {
                //         this.snowflakesStatic.push({ x: f.x, y: f.y, l: snowflakesLifetime, s: f.s });
                //         f.y = 0;
                //         f.x = Math.random()*snowCanvas.width;
                //         f.vx = 80;
                //         f.vy = 40 + (Math.random()*60);
                //     }
                // });
            }
        });

        //merge snowflakes with static
        s.postMessage({ snowflakes: this.snowflakes });

        this.prevTimestamp = timestamp;
        
        setTimeout(()=>{
            this.update();
        }, this.frameInterval);

    }
}

s.addEventListener('message', (event) => {

    if (event.data.type==='init') {
        let snowWorkerInstance = new snowWorkerWW(event.data);
    }

});
