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

// WAS 23 WHEN WORKING
var _y = 43;
// idk if this is needed but wtv
var hasLost = false;
var scalar = 1.4;

var points = 0;


const fruitList = new Map([["cherry", 0],
                        ["strawberry", 1],
                        ["grape", 2],
                        ["dekopon", 3],
                        ["persimmon", 4],
                        ["apple", 5],
                        ["pear", 6],
                        ["peach", 7],
                        ["pineapple", 8],
                        ["melon", 9],
                        ["watermelon", 10]]);

const pointList = new Map([["cherry", 1],
                        ["strawberry", 3],
                        ["grape", 6],
                        ["dekopon", 10],
                        ["persimmon", 15],
                        ["apple", 21],
                        ["pear", 28],
                        ["peach", 36],
                        ["pineapple", 45],
                        ["melon", 55],
                        ["watermelon", 66]]);

const fruitRadius = new Map([["cherry", 11*scalar],
                        ["strawberry", 15*scalar],
                        ["grape", 20*scalar],
                        ["dekopon",22*scalar],
                        ["persimmon", 28*scalar],
                        ["pear", 41*scalar],
                        ["peach", 50*scalar],
                        ["pineapple", 59*scalar],
                        ["melon", 70*scalar],
                        ["watermelon", 82*scalar]]);

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
        height: 600*scalar,
        wireframes: false,
        background:'#60585800',
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
    friction: 0.2,
    isStatic: true, 
    label: "wall",
    render: { fillStyle: '#333', visible: false, opacity: 0.5 }
}
const heightLimitOptions = {
    friction: 0.0,
    isStatic: true, 
    label: "limit",
    isSensor: true,
    
    render: { fillStyle: '#333', visible: false, }
}
const pointerOptions = {
    friction: 0.0,
    isStatic: true, 
    label: "limit",
    isSensor: false,
    collisionFilter: {
        'group': -1,
        'category': 2,
        'mask': 0,
    },
    render: { fillStyle: '#FFFFFF', visible: true, opacity: 1}
}

let pointer = makeContainer(w/2,377, 3, 645, pointerOptions)

let ground = makeContainer(w/2, 510*scalar, 328*scalar, 20*scalar, wallOptions);
var curFruit = makeCherry((w/2), _y);
var curId = curFruit.id;

var hasFallenEnough = true;

//let ground = Bodies.rectangle(w/2, h*0.8, 330, 20, wallOptions);
let leftWall = Bodies.rectangle((w/2)-155*scalar, 325*scalar, 20*scalar, 389*scalar, wallOptions);
let rightWall = Bodies.rectangle((w/2)+155*scalar, 325*scalar, 20*scalar, 389*scalar, wallOptions);
let fruitWait = makeContainer(w/2, 125*scalar, 300*scalar, 1, heightLimitOptions);


let b1 = Bodies.circle((w/2)+10, _y+120, 20*scalar, {
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
    pointer,
    curFruit,
    fruitWait,
    
    //
    //b1,
    // DONE makeFruit((w/2)+100, _y+120, 0),
    // DONE makeFruit((w/2)+10, _y+120, 1),
    //makeFruit((w/2)+10, _y+120, 2),
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
                    //console.log("loss")
                }
                hasFallenEnough = true;
                //Composite.add(world, pointer);
                pointer.render.visible = true;
                Composite.add(world, curFruit);
                
            }
            
            if(pair.bodyA.label == pair.bodyB.label){
               // console.log(fruitList.get(pair.bodyA.label))
                Composite.remove(world, pair.bodyA);
                Composite.remove(world, pair.bodyB);
                Composite.add(world, makeFruit((pair.bodyA.position.x + pair.bodyB.position.x)/2,
                                               (pair.bodyA.position.y + pair.bodyB.position.y)/2,
                                                fruitList.get(pair.bodyA.label)+1));
                points+=pointList.get(pair.bodyA.label)+1;
                document.getElementById("totalPoints").innerHTML = points;
                console.log(points);
            }
        }
    });
});
document.addEventListener("keydown", function(e){
    if(e.key == "s"){
        render.options.showCollisions = !render.options.showCollisions;
        //pointer.render.visibile = false;
    }
});

document.addEventListener("click", function(event){
    var max = 145*scalar-fruitRadius.get(curFruit.label);
    if(hasFallenEnough && !hasLost && event.target != gameOverButton){
        Body.setStatic(curFruit, false) 
        hasFallenEnough = false;
        curId = curFruit.id;
        //Composite.remove(world, pointer);
        pointer.render.visible = false;

        //var rand = Math.round(4/(Math.random()*4+1))-1
        var rand = Math.round((Math.random()*4));
        //var rand = 4
        if(event.pageX < (w/2)-max){
            curFruit = makeFruit((w/2)-max, _y, rand)
            max = 145*scalar-fruitRadius.get(curFruit.label);
            Body.setPosition(curFruit, {x:(w/2)-max, y:curFruit.position.y});
            Body.setPosition(pointer, {x:(w/2)-max, y:380});
        } else if(event.pageX > (w/2)+max) {
            curFruit = makeFruit((w/2)+max, _y, rand)
            max = 145*scalar-fruitRadius.get(curFruit.label);
            Body.setPosition(curFruit, {x:(w/2)+max, y:curFruit.position.y});
            Body.setPosition(pointer, {x:(w/2)+max, y:377});
        } else {
            curFruit = makeFruit(event.pageX, _y, rand);
        }
        
        Body.setStatic(curFruit, true)
    }
});


document.addEventListener("mousemove", function(event){
    var max = 145*scalar-fruitRadius.get(curFruit.label);
    
    if(event.pageX < (w/2)-max){
        Body.setPosition(curFruit, {x:(w/2)-max, y:_y})
        Body.setPosition(pointer, {x:(w/2)-max, y:377})
    } else if(event.pageX > (w/2)+max) {
        Body.setPosition(curFruit, {x:(w/2)+max, y:_y})
        Body.setPosition(pointer, {x:(w/2)+max, y:377})
    } else {
        Body.setPosition(curFruit, {x:event.pageX, y:_y})
        Body.setPosition(pointer, {x:event.pageX, y:377})
    }
    
});
function makeFruit(x,y, fruitType){
    switch(fruitType){
        case 0:
            return Bodies.circle(x, y, 11*scalar, {
                friction: 0.3,
                isStatic: false,
                mass: 1.1,
                label: "cherry",
                
                render: {
                    //fillStyle: '#d60007' 
                    sprite: {
                        texture: 'img/cherry.png',
                        xScale: 0.46*scalar,
                        yScale: 0.46*scalar,
                        xOffset: -0.015*scalar,
                        yOffset: 0.07*scalar
                    }
                }
                
            });
        case 1:
            return Bodies.circle(x, y, 15*scalar, {
                friction: 0.3,
                isStatic: false,
                label: "strawberry",
             
                render: {
                    //fillStyle: '#f04354'
                    //opacity: 0.5,
                    sprite: {
                        texture: 'img/strawberry.png',
                        xScale: 0.72*scalar,
                        yScale: 0.72*scalar,
                        xOffset: -0.04*scalar,
                        yOffset: 0.01*scalar
                    }
                }
            });
        case 2:
            return Bodies.circle(x, y, 20*scalar, {
                friction: 0.3,
                isStatic: false,
                label: "grape",
                
                render: {
                    //fillStyle: '#8152a3'
                    //opacity: 0.5,
                    sprite: {
                        texture: 'img/grape.png',
                        xScale: 0.45*scalar,
                        yScale: 0.45*scalar,
                        xOffset: 0.05*scalar,
                        yOffset: 0.05*scalar
                    }
                }
            });
        case 3:
            return Bodies.circle(x, y, 22*scalar, {
                friction: 0.3,
                isStatic: false,
                label: "dekopon",
                
                render: {
                    //fillStyle: '#f5ad5f' 
                    sprite: {
                        texture: 'img/persimmon.png',
                        xScale: 0.44*scalar,
                        yScale: 0.43*scalar,
                        xOffset: 0.03*scalar,
                        yOffset: -0.01*scalar
                    }
                }
            });
        case 4:
                return Bodies.circle(x, y, 30*scalar, {
                    friction: 0.3,
                    isStatic: false,
                    label: "persimmon",
                    render: {
                        //fillStyle: '#f58916'
                        sprite: {
                            texture: 'img/orange.png',
                            xScale: 0.47*scalar,
                            yScale: 0.47*scalar
                        }
                    }
            });
        case 5:
            return Bodies.circle(x, y, 35*scalar, {
                friction: 0.3,
                isStatic: false,
                label: "apple",
                
                render: {
                    //fillStyle: '#ffed8a' 
                    //opacity: 0.5,
                    sprite: {
                        texture: 'img/apple.png',
                        xScale: 0.42*scalar,
                        yScale: 0.42*scalar,
                        xOffset: -0.005*scalar,
                        yOffset: 0.02*scalar
                    }
                }
            });
        case 6:
            return Bodies.circle(x, y, 41*scalar, {
                friction: 0.3,
                isStatic: false,
                label: "pear",
                
                render: {
                    //fillStyle: '#ffed8a' 
                    //opacity: 0.5,
                    sprite: {
                        texture: 'img/yellow.png',
                        xScale: 0.65*scalar,
                        yScale: 0.65*scalar,
                        xOffset: 0.024*scalar,
                        yOffset: 0.0*scalar
                    }
                }
            });
        case 7:
            return Bodies.circle(x, y, 50*scalar, {
                friction: 0.3,
                isStatic: false,
                label: "peach",
               
                render: {
                    //fillStyle: '#edcad5' 
                    sprite: {
                        texture: 'img/Peach.png',
                        xScale: 1.02*scalar,
                        yScale: 1.02*scalar,
                    },
                }
            });
        case 8:
            return Bodies.circle(x, y, 59*scalar, {
                friction: 0.3,
                isStatic: false,
                label: "pineapple",
                render: {
                    //fillStyle: '#f7cd43'
                    //opacity: 0.5, 
                    sprite: {
                        texture: 'img/pinapple.png',
                        xScale: .68*scalar,
                        yScale: .68*scalar,
                        xOffset: 0*scalar,
                        yOffset: 0.08*scalar
                    },
                }
            });
        case 9:
            return Bodies.circle(x, y, 70*scalar, {
                friction: 0.3,
                isStatic: false,
                label: "melon",
                render: {
                    //fillStyle: '#b2f582'
                    sprite: {
                        texture: 'img/melon.png',
                        xScale: .65*scalar,
                        yScale: .65*scalar,
                        xOffset: 0*scalar,
                        yOffset: 0.115*scalar
                    }, 
                }
            });
        case 10:
            return Bodies.circle(x, y, 82*scalar, {
                friction: 0.3,
                isStatic: false,
                label: "watermelon",
                render: {
                    //fillStyle: '#369121' 
                    //opacity: 0.5,
                    sprite: {
                        texture: 'img/watermelon.png',
                        xScale: .65*scalar,
                        yScale: .65*scalar,
                        xOffset: 0*scalar,
                        yOffset: 0*scalar
                    },
                }
            });
    }
}

function makeCherry(x, y) {
    return Bodies.circle(x, y, 10*scalar, {
        friction: 0.9,
        isStatic: true,
        label: "cherry",
        render: {
            //fillStyle: '#d60007'     
            sprite: {
                texture: 'img/cherry.png',
                xScale: 0.46*scalar,
                yScale: 0.46*scalar,
                xOffset: -0.015*scalar,
                yOffset: 0.07*scalar
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
    ele.style.visibility = "visible";
    hasLost = true;
    //if(ele.style.visibility == "visible"){
    //    ele.style.visibility = "hidden";
    //    hasLost = false;
    //} else {
        
        
   // }
    //reset();
}
function reset(){
    Composite.clear(world);
    Composite.add(world, [
        ground,
        leftWall,
        rightWall,
        pointer,
        curFruit,
        fruitWait,
    ]);
    var ele = document.getElementById("Lcontainer");
    if(ele.style.visibility == "visible"){
        ele.style.visibility = "hidden";
        hasLost = false;
    } else {
        ele.style.visibility = "visible";
        hasLost = true;
    }
    document.getElementById("totalPoints").innerHTML = 0;
    points = 0;
}
function makeContainer(x,y,h,w, opt){
    return Bodies.rectangle(x, y, h, w, opt);
}