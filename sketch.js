/* THIS IS PROBABLY THE WORST CODE I'VE EVER SEEN/WRITTEN, DONT LOOK BELOW IM SO SORRY */

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

if(h < 750) {
    h = 750;
}

// WAS 23 WHEN WORKING
var _y = 39;
// idk if this is needed but wtv
var hasLost = false;
var scalar = 1;
var _yoffset = 20;

var kayalMode = false;
// GRAVITY FROM SLIDER + SLIDER NUMBER
// var slider = document.getElementById("gravitySlider");
// var sliderText = document.getElementById("sliderValue");
// sliderText.innerHTML = slider.value;
var gravity = 1.5;
// POINTS - SELF EXPLANETORY
var points = 0;

// window height and width
// console.log("window width: " + w)
// console.log("window height: " + h)

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
                        ["persimmon", 30*scalar],
                        ["pear", 41*scalar],
                        ["peach", 50*scalar],
                        ["pineapple", 59*scalar],
                        ["melon", 70*scalar],
                        ["watermelon", 80*scalar]]);

const gameOverButton = document.getElementById("lossButton");
// create engine
var engine = Engine.create({
    // timing: {
    //     isFixed: true,
    // },
});
world = engine.world;

// GRAVITY CHROMBOOK    
engine.gravity.y = gravity;

// NORMAL
//engine.gravity.y = 0.3; 

// create renderer
var render = Render.create({
    element: document.getElementById("container"),
    engine: engine,
    options: {
        width: w,
        height: 750,
        wireframes: false,
        background:'#60585800',
        pixelRatio: window.devicePixelRatio,
        showCollisions: false,
        showIds: false,
        showStats: false,
        showDebug: false,
    }
});

Render.run(render);

//playBgMusic();
// create runner
var runner = Runner.create({
    fps:30,
    delta:1000/120,
    //isFixed: true,
});
engine.gravity.scale = 0.00018;
Runner.start(runner,engine);

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
const topOptions = {
    friction: 0.0,
    isStatic: true, 
    label: "limit",
    isSensor: false,
    collisionFilter: {
        'group': -1,
        'category': 2,
        'mask': 0,
    },
    render: { fillStyle: '#f5d582', visible: true, opacity: 1}
}
//
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

let pointer = makeContainer(w/2,305, 3, 520, pointerOptions)

let ground = makeContainer(w/2, 591*scalar, 331*scalar, 50*scalar, wallOptions);
var curFruit = makeFruit((w/2), _y, 0);
var curId = curFruit.id;

var hasFallenEnough = true;

//let ground = Bodies.rectangle(w/2, h*0.8, 330, 20, wallOptions);
// leftWall = Bodies.rectangle((w/2)-155*scalar, 265*scalar, 20*scalar, 489*scalar, wallOptions);
let leftWall = Bodies.rectangle((w/2)-181*scalar, 320*scalar, 50*scalar, 499*scalar, wallOptions);
let rightWall = Bodies.rectangle((w/2)+181*scalar, 320*scalar, 50*scalar, 499*scalar, wallOptions);
let fruitWait = makeContainer(w/2, 148*scalar, 320*scalar, 1, heightLimitOptions);
fruitWait.label = "wait";
let fruitLimit = makeContainer(w/2, 148*scalar, 320*scalar, 1, heightLimitOptions);

let topofbox = makeContainer(w/2, 163,310,8, topOptions)

var nextFruit = makeFruit(w/2+300, 130, Math.round((Math.random()*4)));
nextFruit.isStatic = true;

let nextFruitBubble = Bodies.circle(w/2+300, 120, 10*scalar, {
    isStatic: true,
    label: "bubble",
    collisionFilter: {
        'group': -1,
        'category': 2,
        'mask': 0,
    },
    render: {
        //fillStyle: '#d60007' 
        opacity:0.7,    
        sprite: {
            texture: 'img/nextFruitBubble.png',
            xScale: 0.17,
            yScale: 0.17,
        }
    }
});


/* TESTING FRUIT SIZES AND SPRITE SCALING */
let b1 = Bodies.circle((w/2)+10, _y+120, 80*scalar, {
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
    topofbox,
    fruitLimit,
    nextFruitBubble,
    nextFruit,
    // TESTS BELOW
    //b1,
    //makeKayal((w/2)+10, _y+120, 10),
    //makeFruit((w/2)+10, _y+120, 10),

]);
Events.on(engine, 'collisionStart', function(event) {
    event.pairs.forEach(pair => {
        if(pair.bodyA.label != "wall" && pair.bodyB.label != "wall"){
            
            // if((pair.bodyA.label == "limit" || pair.bodyB.label == "limit")){
            //     if(pair.bodyA.id != curId && pair.bodyB.id != curId){
            //         //console.log("bodyA id: " + pair.bodyA.id);
            //         //console.log("bodyB id: " + pair.bodyB.id);
            //         if(pair.bodyA.id != 0 && pair.bodyB.speed == 0){
            //             gameOver();
            //         }
            //         //console.log("loss")
            //     }
                
            //     //Composite.add(world, pointer);   
            // }
            //
            if(((pair.bodyA.label == "wait" || pair.bodyB.label == "wait") && (pair.bodyA.id == curId || pair.bodyB.id == curId))){
                hasFallenEnough = true;
                pointer.render.visible = true;
                Composite.add(world, curFruit);
                Composite.add(world, nextFruit);            
            } else if(pair.bodyA.label == pair.bodyB.label && (pair.bodyA.isStatic != true && pair.bodyB.isStatic != true) && (hasLost === false)){
               // console.log(fruitList.get(pair.bodyA.label))
                Composite.remove(world, pair.bodyA);
                Composite.remove(world, pair.bodyB);
                if(kayalMode){
                    tempFruit = makeKayal((pair.bodyA.position.x + pair.bodyB.position.x)/2,(pair.bodyA.position.y + pair.bodyB.position.y)/2,fruitList.get(pair.bodyA.label)+1); 
                } else {
                    tempFruit = makeFruit((pair.bodyA.position.x + pair.bodyB.position.x)/2,(pair.bodyA.position.y + pair.bodyB.position.y)/2,fruitList.get(pair.bodyA.label)+1); 
                }
                // console.log("new position: " + (pair.bodyA.position.y + pair.bodyB.position.y)/2);
                // console.log("fruitLimit positon: " + fruitWait.position.y);
                if((pair.bodyA.position.y + pair.bodyB.position.y)/2 > fruitWait.position.y){
                    Composite.add(world, tempFruit);
                    Body.setStatic(tempFruit, false)
                    playMerge();
                    points+=pointList.get(pair.bodyA.label);
                    document.getElementById("totalPoints").innerHTML = points;
                } else { gameOver(); }
            }
        }
    });
});
document.addEventListener("keydown", function(e){
    if(e.target.tagName != "INPUT"){
        if(e.key == "s"){
            render.options.showCollisions = !render.options.showCollisions;
            //pointer.render.visibile = false;
        } else if(e.key == "k"){
            if(!hasLost){
                element = document.getElementById("titleName");
                kayalMode = !kayalMode;
                if(kayalMode){
                    element.innerHTML = "(real) Kayal Mode";
                } else {
                    element.innerHTML = "(real) Suika Game";
                }
            } 
        }
    }
    
});

document.addEventListener("mousedown", function(event){
    // dont drop fruit if using slider (probably another way to do this but im lazy)
    //console.log(fruitList.get(nextFruit.label))
    if(event.target.tagName != "INPUT") {
        var max = 145*scalar-fruitRadius.get(curFruit.label);
        if(hasFallenEnough && !hasLost && event.target != gameOverButton){
            Body.setStatic(curFruit, false) 
            playDrop();
            hasFallenEnough = false;
            curId = curFruit.id;
            //Composite.remove(world, pointer);
            pointer.render.visible = false;
    
            //var rand = Math.round(4/(Math.random()*4+1))-1
            var rand = Math.round((Math.random()*4));
            
            //var rand = 4;
            if(event.pageX < (w/2)-max){
                if(kayalMode){curFruit = makeKayal((w/2)-max, _y, fruitList.get(nextFruit.label))}
                else{curFruit = makeFruit((w/2)-max, _y, fruitList.get(nextFruit.label));}
                
                max = 145*scalar-fruitRadius.get(curFruit.label);
                Body.setPosition(curFruit, {x:(w/2)-max, y:curFruit.position.y});
                Body.setPosition(pointer, {x:(w/2)-max, y:305});
            } else if(event.pageX > (w/2)+max) {
                if(kayalMode){curFruit = makeKayal((w/2)+max, _y, fruitList.get(nextFruit.label))}
                else{curFruit = makeFruit((w/2)+max, _y, fruitList.get(nextFruit.label))}
                
                max = 145*scalar-fruitRadius.get(curFruit.label);
                Body.setPosition(curFruit, {x:(w/2)+max, y:curFruit.position.y});
                Body.setPosition(pointer, {x:(w/2)+max, y:305});
            } else {
                if(kayalMode){curFruit = makeKayal(event.pageX, _y, fruitList.get(nextFruit.label));}
                else{curFruit = makeFruit(event.pageX, _y, fruitList.get(nextFruit.label));}
                
            }
            Composite.remove(world, nextFruit)
            if(kayalMode){nextFruit = makeKayal(w/2+350, 130, rand);}
            else{nextFruit = makeFruit(w/2+300, 130, rand);}
              
            //Composite.add(world, nextFruit)
            nextFruit.isStatic = true;
            Composite.add(world,topofbox)
            //Body.setStatic(curFruit, true)
        }
    }    
});


document.addEventListener("mousemove", function(event){
    var max = 145*scalar-fruitRadius.get(curFruit.label);
    
    if(event.pageX < (w/2)-max){
        Body.setPosition(curFruit, {x:(w/2)-max, y:_y})
        Body.setPosition(pointer, {x:(w/2)-max, y:305})
    } else if(event.pageX > (w/2)+max) {
        Body.setPosition(curFruit, {x:(w/2)+max, y:_y})
        Body.setPosition(pointer, {x:(w/2)+max, y:305})
    } else {
        Body.setPosition(curFruit, {x:event.pageX, y:_y})
        Body.setPosition(pointer, {x:event.pageX, y:305})
    }
});
function makeFruit(x,y, fruitType){
    switch(fruitType){
        case 0:
            return Bodies.circle(x, y, 11*scalar, {
                friction: 0.3,
                isStatic: true,
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
                isStatic: true,
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
                isStatic: true,
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
                isStatic: true,
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
                    isStatic: true,
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
                isStatic: true,
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
                isStatic: true,
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
                isStatic: true,
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
                isStatic: true,
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
                isStatic: true,
                label: "melon",
                render: {
                    //fillStyle: '#b2f582'
                    //opacity:0.5,
                    sprite: {
                        texture: 'img/melon.png',
                        xScale: .65*scalar,
                        yScale: .65*scalar,
                        xOffset: 0*scalar,
                        yOffset: 0.088*scalar
                    }, 
                }
            });
        case 10:
            return Bodies.circle(x, y, 80*scalar, {
                friction: 0.3,
                isStatic: true,
                label: "watermelon",
                render: {
                    //fillStyle: '#369121' 
                    //opacity: 0.5,
                    sprite: {
                        texture: 'img/watermelon.png',
                        xScale: .625*scalar,
                        yScale: .625*scalar,
                        xOffset: .005*scalar,
                        yOffset: .004*scalar
                    },
                }
            });
    }
}

function gameOver(){
    document.getElementById("Lcontainer").style.visibility = "visible";
    document.getElementById("submitForm").style.visibility = "visible";
    document.getElementById("submitText").style.visibility = "visible";
    hasLost = true;
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
        fruitLimit,
        nextFruit,
        nextFruitBubble,
    ]);
    var ele = document.getElementById("Lcontainer");
    if(ele.style.visibility == "visible"){
        ele.style.visibility = "hidden";
        document.getElementById("submitForm").style.visibility = "hidden";
        document.getElementById("submitText").style.visibility = "hidden";
        document.getElementById("scoreSubmit").style.visibility = "hidden";
        hasLost = false;
    } else {
        ele.style.visibility = "visible";
        document.getElementById("submitForm").style.visibility = "visible";
        document.getElementById("submitText").style.visibility = "visible";
        hasLost = true;
    }
    document.getElementById("totalPoints").innerHTML = 0;
    points = 0;
    hasFallenEnough = true;
}
function makeContainer(x,y,h,w, opt){
    return Bodies.rectangle(x, y, h, w, opt);
}

document.addEventListener("submit", function(e){
    e.preventDefault();
}, false);

window.addEventListener('resize', function(event) {
    //document.getElementById("resized").style.display = "block";
    w = window.innerWidth;
    h = window.innerHeight;
    if(h < 700) {
        h = 700
    }
    render.options.width = w;
    //render.options.height = window.innerHeigh;
    render.canvas.width = w;
    //render.canvas.height = window.innerHeight;
    Body.setPosition(leftWall, {x:(w/2)-181*scalar, y:leftWall.position.y});
    Body.setPosition(rightWall, {x:(w/2)+181*scalar, y:rightWall.position.y});
    Body.setPosition(fruitWait, {x:w/2, y:fruitWait.position.y});
    Body.setPosition(ground, {x:w/2, y:ground.position.y});
    Body.setPosition(topofbox, {x:w/2, y:topofbox.position.y});
    Body.setPosition(fruitLimit, {x:w/2,y:fruitLimit.position.y});
    Body.setPosition(nextFruitBubble, {x:w/2+300, y:nextFruitBubble.position.y});
    Body.setPosition(nextFruit, {x:w/2+300, y:nextFruit.position.y});
});

// slider.oninput = function(){
//     gravity = this.value;
//     sliderText.textContent = this.value;
//     engine.gravity.y = gravity;
//     console.log(percent)
// }
function playDrop() {
    var audio1 = document.getElementById("drop");
    audio1.play();
}
function playMerge() {
    var audio2 = document.getElementById("merge");
    audio2.play();
}
// function playBgMusic() {
//     var audio3 = document.getElementById("bgmusic");
//     audio3.play();
// }
/* Gravity Slider for html
<p class="sliderText">Gravity</p>
      <div class="center">
        <input type="range" min="0" max="2" value="1" step="0.1" class="slider" id="gravitySlider">
        <span id="sliderValue">1</span>
      </div> 
      
      <audio  controls loop id="bgmusic" src="img/bgmusic.mp3"></audio>
      */

// slider.oninput = function(){
//     gravity = this.value;
//     sliderText.textContent = this.value;
//     engine.gravity.y = gravity;
//     //console.log(percent);
// }
// document.getElementById('gravitySlider').addEventListener('mouseup', function(e) {
//     console.log(document.getElementById('gravitySlider').value)
//     sliderText.innerHTML = document.getElementById('gravitySlider').value;
//     engine.gravity.y = document.getElementById('gravitySlider').value;
// })
function makeKayal(x,y, fruitType){
    switch(fruitType){
        case 0:
            return Bodies.circle(x, y, 11*scalar, {
                friction: 0.3,
                isStatic: true,
                mass: 1.1,
                label: "cherry",
                
                render: {
                    //fillStyle: '#d60007' 
                    //opacity:0.5,
                    sprite: {
                        texture: 'img/cherryK.png',
                        xScale: 0.045*scalar,
                        yScale: 0.045*scalar,
                        xOffset: 0.0*scalar,
                        yOffset: 0.0*scalar
                    }
                }
                
            });
        case 1:
            return Bodies.circle(x, y, 15*scalar, {
                friction: 0.3,
                isStatic: true,
                label: "strawberry",
             
                render: {
                    //fillStyle: '#f04354'
                    //opacity: 0.5,
                    sprite: {
                        texture: 'img/strawberryK.png',
                        xScale: 0.06*scalar,
                        yScale: 0.06*scalar,
                        xOffset: 0.0*scalar,
                        yOffset: 0.0*scalar
                    }
                }
            });
        case 2:
            return Bodies.circle(x, y, 20*scalar, {
                friction: 0.3,
                isStatic: true,
                label: "grape",
                
                render: {
                    //fillStyle: '#8152a3'
                    //opacity: 0.5,
                    sprite: {
                        texture: 'img/grapeK.png',
                        xScale: 0.082*scalar,
                        yScale: 0.08*scalar,
                        xOffset: 0.0*scalar,
                        yOffset: 0.0*scalar
                    }
                }
            });
        case 3:
            return Bodies.circle(x, y, 22*scalar, {
                friction: 0.3,
                isStatic: true,
                label: "dekopon",
                
                render: {
                    //fillStyle: '#f5ad5f'
                    //opacity:0.5, 
                    sprite: {
                        texture: 'img/persimmonK.png',
                        xScale: 0.095*scalar,
                        yScale: 0.078*scalar,
                        xOffset: 0.0*scalar,
                        yOffset: -0.0*scalar
                    }
                }
            });
        case 4:
                return Bodies.circle(x, y, 30*scalar, {
                    friction: 0.3,
                    isStatic: true,
                    label: "persimmon",
                    render: {
                        //fillStyle: '#f58916'
                        //opacity:0.5,
                        sprite: {
                            texture: 'img/orangeK.png',
                            xScale: 0.13*scalar,
                            yScale: 0.1*scalar
                        }
                    }
            });
        case 5:
            return Bodies.circle(x, y, 35*scalar, {
                friction: 0.3,
                isStatic: true,
                label: "apple",
                
                render: {
                    //fillStyle: '#ffed8a' 
                    //opacity: 0.5,
                    sprite: {
                        texture: 'img/appleK.png',
                        xScale: 0.15*scalar,
                        yScale: 0.12*scalar,
                        xOffset: 0.00*scalar,
                        yOffset: 0.0*scalar
                    }
                }
            });
        case 6:
            return Bodies.circle(x, y, 41*scalar, {
                friction: 0.3,
                isStatic: true,
                label: "pear",
                
                render: {
                    //fillStyle: '#ffed8a' 
                    //opacity: 0.5,
                    sprite: {
                        texture: 'img/yellowK.png',
                        xScale: 0.18*scalar,
                        yScale: 0.16*scalar,
                        xOffset: 0.0*scalar,
                        yOffset: 0.0*scalar
                    }
                }
            });
        case 7:
            return Bodies.circle(x, y, 50*scalar, {
                friction: 0.3,
                isStatic: true,
                label: "peach",
               
                render: {
                    //fillStyle: '#edcad5' 
                    //opacity:0.5,
                    sprite: {
                        texture: 'img/PeachK.png',
                        xScale: .19*scalar,
                        yScale: .19*scalar,
                    },
                }
            });
        case 8:
            return Bodies.circle(x, y, 59*scalar, {
                friction: 0.3,
                isStatic: true,
                label: "pineapple",
                render: {
                    //fillStyle: '#f7cd43'
                    //opacity: 0.5, 
                    sprite: {
                        texture: 'img/pinappleK.png',
                        xScale: .21*scalar,
                        yScale: .21*scalar,
                        xOffset: -.05*scalar,
                        yOffset: 0*scalar
                    },
                }
            });
        case 9:
            return Bodies.circle(x, y, 70*scalar, {
                friction: 0.3,
                isStatic: true,
                label: "melon",
                render: {
                    //fillStyle: '#b2f582'
                    //opacity:0.5,
                    sprite: {
                        texture: 'img/melonK.png',
                        xScale: .27*scalar,
                        yScale: .27*scalar,
                        xOffset: 0*scalar,
                        yOffset: -0.02*scalar
                    }, 
                }
            });
        case 10:
            return Bodies.circle(x, y, 80*scalar, {
                friction: 0.3,
                isStatic: true,
                label: "watermelon",
                render: {
                    //fillStyle: '#369121' 
                    //opacity: 0.5,
                    sprite: {
                        texture: 'img/watermelonK.png',
                        xScale: .48*scalar,
                        yScale: .35*scalar,
                        xOffset: 0*scalar,
                        yOffset: 0*scalar
                    },
                }
            });
    }
}