/*class Box {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        let options = {
            friction: 0.3,
            restitution: 0.6
        }
        this.body = Bodies.circle(this.x, this.y, this.r, options);
        fill(color('rgb(227,0,9)'));
        Composite.add(world, this.body);
    }
    setColor(newColor){
        c = newColor;
    }

    show() {
        let pos = this.body.position;
        push();
        translate(pos.x, pos.y);
        strokeWeight(1);
        noStroke();
        circle(0, 0, this.r*2);
        pop();
    }
}
*/