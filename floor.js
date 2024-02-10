/*class Floor {
    constructor(x, y, w, h, a) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        let options = {
            friction: 0.0,
            restitution: 0.6,
            isStatic: true,
            angle: a
        }
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
        Composite.add(world, this.body);
    }
    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(windowWidth/2, height*0.75);
        rotate(angle);
        rectMode(CENTER);
        stroke(1)
        noStroke();
        fill(color('rgba(0,0,0, 1)'));
        rect(0, 0, this.w, this.h);
        pop();
    }
}*/