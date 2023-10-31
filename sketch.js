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
var _y = (h*0.8)-445;
// idk if this is needed but wtv
var hasLost = false;

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

engine.gravity.y = 0.35;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: w,
        height: h,
        wireframes: false,
        background:'#f3edb0',
        pixelRatio: window.devicePixelRatio,
        showCollisions: false,
        showIds: true
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
const heightLimitOptions = {
    friction: 0.0,
    isStatic: true, 
    label: "limit",
    isSensor: true,
    
    render: { fillStyle: '#333', visible: false, }
}

let ground = makeContainer(w/2, h*0.8, 330, 20, wallOptions);
var curFruit = makeCherry((w/2)-135, _y);
var curId = curFruit.id;

var hasFallenEnough = true;

//let ground = Bodies.rectangle(w/2, h*0.8, 330, 20, wallOptions);
let leftWall = Bodies.rectangle((w/2)-155, (h*0.8)-185, 20, 389, wallOptions);
let rightWall = Bodies.rectangle((w/2)+155, (h*0.8)-185, 20, 389, wallOptions);
let fruitWait = makeContainer(w/2, (h*0.8)-390, 330, 1, heightLimitOptions);
// scene code
Composite.add(world, [
    ground,
    leftWall,
    rightWall,
    curFruit,
    fruitWait,
]);

Events.on(engine, 'collisionStart', function(event) {
    event.pairs.forEach(pair => {
        if(pair.bodyA.label != "wall" && pair.bodyB.label != "wall"){
            if((pair.bodyA.label == "limit" || pair.bodyB.label == "limit")){
                if(pair.bodyA.id != curId && pair.bodyB.id != curId){
                    gameOver()
                    console.log("loss")
                }
                hasFallenEnough = true;
                Composite.add(world, curFruit)
            }
            
            if(pair.bodyA.label == pair.bodyB.label){
               // console.log(fruitList.get(pair.bodyA.label))
                Composite.remove(world, pair.bodyA)
                Composite.remove(world, pair.bodyB)
                Composite.add(world, makeFruit((pair.bodyA.position.x + pair.bodyB.position.x)/2,
                                               (pair.bodyA.position.y + pair.bodyB.position.y)/2,
                                                fruitList.get(pair.bodyA.label)+1))
            }
        }
    });
});
document.addEventListener("keydown", function(e){
    if(e.key == "s"){
        render.options.showCollisions = !render.options.showCollisions;
    }
});

document.addEventListener("click", function(event){
    if(hasFallenEnough && !hasLost){
        Body.setPosition(curFruit, {x:curFruit.position.x, y:curFruit.position.y})
        Body.setStatic(curFruit, false) 
        hasFallenEnough = false;
        curId = curFruit.id
        var rand = Math.round(4/(Math.random()*4+1))-1
        if(event.pageX < (w/2)-135){
            curFruit = makeFruit((w/2)-134.5, _y, rand)
            //curFruit = makeCherry((w/2)-135, (h*0.8)-420)
        } else if(event.pageX > (w/2)+134.5) {
            curFruit = makeFruit((w/2)+134.5, _y, rand)
            //curFruit = makeCherry((w/2)+135, (h*0.8)-420)
        } else {
            curFruit = makeFruit(event.pageX, _y, rand)
            //curFruit = makeCherry(event.pageX, (h*0.8)-420)
        }
        Body.setStatic(curFruit, true)
    }
});


document.addEventListener("mousemove", function(event){
    if(event.pageX < (w/2)-134.5){
        Body.setPosition(curFruit, {x:(w/2)-134.5, y:_y})
    } else if(event.pageX > (w/2)+134.5) {
        Body.setPosition(curFruit, {x:(w/2)+134.5, y:_y})
    } else {
        Body.setPosition(curFruit, {x:event.pageX, y:_y})
    }
    
});
function makeFruit(x,y, fruitType){
    switch(fruitType){
        case 0:
            return Bodies.circle(x, y, 10.5, {
                friction: 0.3,
                isStatic: false,
                mass: 1.1,
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
        friction: 0.9,
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
function gameOver(){
    var ele = document.getElementById("Lcontainer");
    if(ele.style.visibility == "visible"){
        ele.style.visibility = "hidden";
        hasLost = false;
    } else {
        ele.style.visibility = "visible";
        hasLost = true;
    }
    
}
function reset(){
    Composite.clear(world);
    Composite.add(world, [
        ground,
        leftWall,
        rightWall,
        curFruit,
        fruitWait,
    ]);
}
function makeContainer(x,y,h,w, opt){
    return Bodies.rectangle(x, y, h, w, opt);
}