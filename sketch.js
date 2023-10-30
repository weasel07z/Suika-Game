var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Events = Matter.Events,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Bodies = Matter.Bodies;

var w = window.innerWidth;
var h = window.innerHeight;

// idk if this is needed but wtv
var objExists = false;
//var curFruit = createCherry(0,0);

const fruitList = new Map([["cherry", 0],
                        ["strawberry", 1],
                        ["grape", 2],
                        ["dekopon", 3],
                        ["persimmon", 4],
                        ["pear", 5],
                        ["peach", 6],
                        ["pineapple", 7],
                        ["melon", 8],
                        ["watermelon", 9]]);


// create engine
var engine = Engine.create(),
    world = engine.world;

engine.gravity.y = 0.25;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: w,
        height: h,
        wireframes: false,
        background:'#fffec3',
        pixelRatio: window.devicePixelRatio,
        showCollisions: false
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(engine);

const wallOptions = {
    friction: 0.0,
    isStatic: true, 
    label: "wall",
    render: { fillStyle: '#333' }
}
let ground = makeContainer(w/2, h*0.8, 330, 20, wallOptions);
let curFruit = makeCherry(0, 0);
//let ground = Bodies.rectangle(w/2, h*0.8, 330, 20, wallOptions);
let leftWall = Bodies.rectangle((w/2)-155, (h*0.8)-185, 20, 389, wallOptions);
let rightWall = Bodies.rectangle((w/2)+155, (h*0.8)-185, 20, 389, wallOptions);
// scene code
Composite.add(world, [
    ground,
    leftWall,
    rightWall,
    curFruit,
    //shapes
]);

//const shapes = [];
//shapes.push(createCircle(0,0));
Events.on(engine, 'collisionStart', function(event) {
    event.pairs.forEach(pair => {
        if(pair.bodyA.label != "wall" && pair.bodyB.label != "wall"){
            if(pair.bodyA.label == pair.bodyB.label){
                //continue;
                //pair.bodyA.render.fillStyle ="blue";
                //pair.bodyB.render.fillStyle = "blue";
                console.log(fruitList.get(pair.bodyA.label))
                Composite.remove(world, pair.bodyA)
                Composite.remove(world, pair.bodyB)
                Composite.add(world, makeFruit((pair.bodyA.position.x + pair.bodyB.position.x)/2,
                                               (pair.bodyA.position.y + pair.bodyB.position.y)/2,
                                                fruitList.get(pair.bodyA.label)+1))
            }
        }
    });

    var pairs = event.pairs;

    // change object colours to show those starting a collision
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        if(pair.bodyA.label == "cherry" && pair.bodyB.label == "cherry"){
            //continue;
            //pair.bodyA.render.fillStyle ="blue";
            //pair.bodyB.render.fillStyle = "blue";
            
        }
        
    }
});
/*
Events.on(engine, 'collisionActive', function(event) {
    var pairs = event.pairs;

    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        if(pair.bodyA.label == "cherry" && pair.bodyB.label == "cherry"){
            //continue;
            pair.bodyA.render.fillStyle ="blue";
            pair.bodyB.render.fillStyle = "blue";
        }
        
    }
});
Events.on(engine, 'collisionEnd', function(event) {
    var pairs = event.pairs;

    // change object colours to show those ending a collision
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        if(pair.bodyA.label == "cherry" && pair.bodyB.label == "cherry"){
            //continue;
            pair.bodyA.render.fillStyle = "333";
            pair.bodyB.render.fillStyle = "333";
        }
        
    }
});
*/
//function combine(){

//}
document.addEventListener("keydown", function(e){
    if(e.key == "s"){
        render.options.showCollisions = !render.options.showCollisions;
    }
});

document.addEventListener("click", function(event){
    Body.setPosition(curFruit, {x:curFruit.position.x, y:curFruit.position.y+20})
    Body.setStatic(curFruit, false)
    //Body.setPosition(curFruit, {x:curFruit.position.x, y:curFruit.position.y+20})
    //objExists = false;
    if(event.pageX < (w/2)-135){
        //curFruit = createCherry((w/2)-135, (h*0.8)-420)
        curFruit = makeCherry((w/2)-135, (h*0.8)-420)
    } else if(event.pageX > (w/2)+135) {
        //curFruit = createCherry((w/2)+135, (h*0.8)-420)
        curFruit = makeCherry((w/2)+135, (h*0.8)-420)
    } else {
        //curFruit = createCherry(event.pageX, (h*0.8)-420)
        curFruit = makeCherry(event.pageX, (h*0.8)-420)
    }
    Composite.add(world, curFruit)
});


document.addEventListener("mousemove", function(event){
    if(event.pageX < (w/2)-135){
        Body.setPosition(curFruit, {x:(w/2)-135, y:(h*0.8)-420})
    } else if(event.pageX > (w/2)+135) {
        Body.setPosition(curFruit, {x:(w/2)+135, y:(h*0.8)-420})
    } else {
        Body.setPosition(curFruit, {x:event.pageX, y:(h*0.8)-420})
    }
    
});
/*
const createCherry = function(x, y) {
    return Bodies.circle(x, y, 10, {
        friction: 0.3,
        isStatic: true,
        label: "cherry",
        render: {
            fillStyle: '333' 
        }
    });
}*/
function makeFruit(x,y, fruitType){
    switch(fruitType){
        case 0:
            return Bodies.circle(x, y, 10.5, {
                friction: 0.3,
                isStatic: false,
                label: "cherry",
                render: {
                    fillStyle: '#d60007' 
                }
            });
        case 1:
            return Bodies.circle(x, y, 14, {
                friction: 0.3,
                isStatic: false,
                label: "strawberry",
                render: {
                    fillStyle: '#f04354' 
                }
            });
        case 2:
            return Bodies.circle(x, y, 19.5, {
                friction: 0.3,
                isStatic: false,
                label: "grape",
                render: {
                    fillStyle: '#8152a3' 
                }
            });
        case 3:
            return Bodies.circle(x, y, 22, {
                friction: 0.3,
                isStatic: false,
                label: "dekopon",
                render: {
                    fillStyle: '#f5ad5f' 
                }
            });
        case 4:
                return Bodies.circle(x, y, 27.5, {
                    friction: 0.3,
                    isStatic: false,
                    label: "persimmon",
                    render: {
                        fillStyle: '#f58916' 
                    }
            });
        case 5:
            return Bodies.circle(x, y, 40.5, {
                friction: 0.3,
                isStatic: false,
                label: "pear",
                render: {
                    fillStyle: '#ffed8a' 
                }
            });
        case 6:
            return Bodies.circle(x, y, 50, {
                friction: 0.3,
                isStatic: false,
                label: "peach",
                render: {
                    fillStyle: '#edcad5' 
                }
            });
        case 7:
            return Bodies.circle(x, y, 56, {
                friction: 0.3,
                isStatic: false,
                label: "pineapple",
                render: {
                    fillStyle: '#f7cd43' 
                }
            });
        case 8:
            return Bodies.circle(x, y, 70, {
                friction: 0.3,
                isStatic: false,
                label: "melon",
                render: {
                    fillStyle: '#b2f582' 
                }
            });
        case 9:
            return Bodies.circle(x, y, 81.5, {
                friction: 0.3,
                isStatic: false,
                label: "watermelon",
                render: {
                    fillStyle: '#369121' 
                }
            });
    }
}

function makeCherry(x, y) {
    return Bodies.circle(x, y, 10, {
        friction: 0.3,
        isStatic: true,
        label: "cherry",
        render: {
            fillStyle: '#d60007' 
        }
    });
}

 /* 
var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
});
render.mouse = mouse;
*/

function makeContainer(x,y,h,w, opt){
    return Bodies.rectangle(x, y, h, w, opt);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/*
function setup() {
    createCanvas(windowWidth, windowHeight);
    // create an engine
    engine = Engine.create();
    world = engine.world;
    // Container creations
    ground = new Wall(windowWidth/2, height*0.75, 296, 20, 0);
    Lwall = new Wall((windowWidth/2)-144, (height*0.75)-161, 330, 8, PI/2);
    Rwall = new Wall((windowWidth/2)+144, (height*0.75)-161, 330, 8, PI/2);
    // add rigid body
    Composite.add(world, [ground,Lwall,Rwall]);
}

function mousePressed() {
    if(mouseX > (windowWidth/2)-136 && mouseX < (windowWidth/2)+144 && mouseY < height*0.75){
        fruits.push(new Box(mouseX, (height*0.75)-358, 10, 10));
    }
}

function draw() {
    background(1000);
    Engine.update(engine);
    for (let i = 0; i < fruits.length; i++) {
        fruits[i].show();
    }
    Lwall.show();
    Rwall.show();
    ground.show();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
*/

