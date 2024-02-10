/*class Wall {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        let options = {
            friction: 0.0,
            restitution: 0.6,
            isStatic: true,
            fillStyle: '#333'
        }
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
    }
    getShape(){
        return this.body;
    }
    /*
    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        stroke(1)
        noStroke();
        fill(color('rgba(246,216,132,1)'));
        rect(0, 0, this.w, this.h);
        pop();
    }
    hide() {
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        stroke(1)
        noStroke();
        fill(color('rgba(246,216,132,0)'));
        rect(0, 0, this.w, this.h);
        pop();
    }
}
    */
