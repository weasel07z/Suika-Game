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
var _y = 23;
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

const fruitRadius = new Map([["cherry", 10.5],
                        ["strawberry", 14],
                        ["grape", 19.5],
                        ["dekopon",22],
                        ["persimmon", 27.5],
                        ["pear", 40.5],
                        ["peach", 50],
                        ["pineapple", 56],
                        ["melon", 70],
                        ["watermelon", 81.5]]);

const mainContainer = document.getElementById("container");
const gameOverButton = document.getElementById("lossButton");
// create engine
var engine = Engine.create(),
    world = engine.world;

// GRAVITY CHROMBOOK    
// engine.gravity.y = 0.9;

// NORMAL
engine.gravity.y = 0.3; 

// create renderer
var render = Render.create({
    element: mainContainer,
    engine: engine,
    options: {
        width: w,
        height: 600,
        wireframes: false,
        background:'#ffff0',
        pixelRatio: window.devicePixelRatio,
        showCollisions: false,
        showIds: false,
        showStats: false,
        showDebug: false,
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
const heightLimitOptions = {
    friction: 0.0,
    isStatic: true, 
    label: "limit",
    isSensor: true,
    
    render: { fillStyle: '#333', visible: false, }
}

let ground = makeContainer(w/2, 470, 328, 20, wallOptions);
var curFruit = makeCherry((w/2)-135, _y);
var curId = curFruit.id;

var hasFallenEnough = true;

//let ground = Bodies.rectangle(w/2, h*0.8, 330, 20, wallOptions);
let leftWall = Bodies.rectangle((w/2)-155, 285, 20, 389, wallOptions);
let rightWall = Bodies.rectangle((w/2)+155, 285, 20, 389, wallOptions);
let fruitWait = makeContainer(w/2, 85, 320, 1, heightLimitOptions);

let b1 = Bodies.circle((w/2)+10, _y+120, 82, {
    friction: 0.3,
    isStatic: true,
    label: "pineapple",
    render: {
        fillStyle: '#000000' 
        
    }
});

// scene code
Composite.add(world, [
    ground,
    leftWall,
    rightWall,
    curFruit,
    fruitWait,
    //
    //b1,
    // DONE makeFruit((w/2)+100, _y+120, 0),
    // DONE makeFruit((w/2)+10, _y+120, 1),
    // DONE makeFruit((w/2)+100, _y+120, 2),
    // DONE makeFruit((w/2)+100, _y+120, 3),
    // DONE makeFruit((w/2)+100, _y+120, 4),
    // DONE makeFruit((w/2)+10, _y+120, 5),
    // DONE makeFruit((w/2)+10, _y+120, 6),
    // DONE makeFruit((w/2)+10, _y+120, 7),
    // DONE makeFruit((w/2)+10, _y+120, 8)
    // DONE makeFruit((w/2)+10, _y+120, 9)

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
    var max = 145-fruitRadius.get(curFruit.label);
    if(hasFallenEnough && !hasLost && event.target != gameOverButton){
        Body.setStatic(curFruit, false) 
        hasFallenEnough = false;
        curId = curFruit.id
        var rand = Math.round(4/(Math.random()*4+1))-1
        if(event.pageX < (w/2)-max){
            curFruit = makeFruit((w/2)-max, _y, rand)
            max = 145-fruitRadius.get(curFruit.label);
            Body.setPosition(curFruit, {x:(w/2)-max, y:curFruit.position.y})
            //curFruit = makeCherry((w/2)-135, (h*0.8)-420)
        } else if(event.pageX > (w/2)+max) {
            curFruit = makeFruit((w/2)+max, _y, rand)
            max = 145-fruitRadius.get(curFruit.label);
            Body.setPosition(curFruit, {x:(w/2)+max, y:curFruit.position.y})
            //curFruit = makeCherry((w/2)+135, (h*0.8)-420)
        } else {
            curFruit = makeFruit(event.pageX, _y, rand)
            //curFruit = makeCherry(event.pageX, (h*0.8)-420)
        }
        Body.setStatic(curFruit, true)
    }
});


document.addEventListener("mousemove", function(event){
    var max = 145-fruitRadius.get(curFruit.label);
    if(event.pageX < (w/2)-max){
        Body.setPosition(curFruit, {x:(w/2)-max, y:_y})
    } else if(event.pageX > (w/2)+max) {
        Body.setPosition(curFruit, {x:(w/2)+max, y:_y})
    } else {
        Body.setPosition(curFruit, {x:event.pageX, y:_y})
    }
    
});
function makeFruit(x,y, fruitType){
    switch(fruitType){
        case 0:
            return Bodies.circle(x, y, 11, {
                friction: 0.3,
                isStatic: false,
                mass: 1.1,
                label: "cherry",
                
                render: {
                    //fillStyle: '#d60007' 
                    sprite: {
                        texture: '/img/cherry.png',
                        xScale: 0.46,
                        yScale: 0.46,
                        xOffset: -0.015,
                        yOffset: 0.07
                    }
                }
                
            });
        case 1:
            return Bodies.circle(x, y, 15, {
                friction: 0.3,
                isStatic: false,
                label: "strawberry",
             
                render: {
                    //fillStyle: '#f04354'
                    //opacity: 0.5,
                    sprite: {
                        texture: '/img/strawberry.png',
                        xScale: 0.72,
                        yScale: 0.72,
                        xOffset: -0.04,
                        yOffset: 0.01
                    }
                }
            });
        case 2:
            return Bodies.circle(x, y, 20, {
                friction: 0.3,
                isStatic: false,
                label: "grape",
                
                render: {
                    //fillStyle: '#8152a3'
                    sprite: {
                        texture: '/img/grape.png',
                        xScale: 0.4,
                        yScale: 0.4,
                        xOffset: 0.07,
                        yOffset: 0.07
                    }
                }
            });
        case 3:
            return Bodies.circle(x, y, 22, {
                friction: 0.3,
                isStatic: false,
                label: "dekopon",
                
                render: {
                    //fillStyle: '#f5ad5f' 
                    sprite: {
                        texture: '/img/persimmon.png',
                        xScale: 0.44,
                        yScale: 0.43,
                        xOffset: 0.03,
                        yOffset: -0.01
                    }
                }
            });
        case 4:
                return Bodies.circle(x, y, 30, {
                    friction: 0.3,
                    isStatic: false,
                    label: "persimmon",
                    render: {
                        //fillStyle: '#f58916'
                        sprite: {
                            texture: '/img/orange.png',
                            xScale: 0.47,
                            yScale: 0.47
                        }
                    }
            });
        case 5:
            return Bodies.circle(x, y, 41, {
                friction: 0.3,
                isStatic: false,
                label: "pear",
                
                render: {
                    //fillStyle: '#ffed8a' 
                    //opacity: 0.5,
                    sprite: {
                        texture: '/img/yellow.png',
                        xScale: 0.65,
                        yScale: 0.65,
                        xOffset: 0.024,
                        yOffset: 0.0
                    }
                }
            });
        case 6:
            return Bodies.circle(x, y, 50, {
                friction: 0.3,
                isStatic: false,
                label: "peach",
               
                render: {
                    //fillStyle: '#edcad5' 
                    sprite: {
                        texture: '/img/Peach.png',
                        xScale: 1.02,
                        yScale: 1.02,
                    },
                }
            });
        case 7:
            return Bodies.circle(x, y, 59, {
                friction: 0.3,
                isStatic: false,
                label: "pineapple",
                render: {
                    //fillStyle: '#f7cd43'
                    //opacity: 0.5, 
                    sprite: {
                        texture: '/img/pinapple.png',
                        xScale: .68,
                        yScale: .68,
                        xOffset: 0,
                        yOffset: 0.1
                    },
                }
            });
        case 8:
            return Bodies.circle(x, y, 70, {
                friction: 0.3,
                isStatic: false,
                label: "melon",
                render: {
                    //fillStyle: '#b2f582'
                    sprite: {
                        texture: '/img/melon.png',
                        xScale: .65,
                        yScale: .65,
                        xOffset: 0,
                        yOffset: 0.115
                    }, 
                }
            });
        case 9:
            return Bodies.circle(x, y, 82, {
                friction: 0.3,
                isStatic: false,
                label: "watermelon",
                render: {
                    //fillStyle: '#369121' 
                    //opacity: 0.5,
                    sprite: {
                        texture: '/img/watermelon.png',
                        xScale: .65,
                        yScale: .65,
                        xOffset: 0,
                        yOffset: 0
                    },
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
            //fillStyle: '#d60007'     
            sprite: {
                texture: '/img/cherry.png',
                xScale: 0.46,
                yScale: 0.46,
                //xOffset: -0.015,
                //yOffset: 0.07
            }
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
    reset();
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
