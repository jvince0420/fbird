// ----------------------------VARIABLES---------------------------------------------- //
//board **********
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let isNightMode = false;
let BgImg;

//bird position and size  **********
let birdWidth = 38;
let birdHeight = 36;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes **********
let pipeArray = [];
let pipeWidth = 60;
let pipeHeight = 508;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// game start
let gameStarted = false;

//game physics  **********
let velocityX = -2; //pipes moving to left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4 //bird gravity going down


//obstacles
let gameOver = false;


//score
let score = 0;

//points
let points = 0;

// Skills
let shieldActive = false;
let extraLifeActive = false;
let slowMotionActive = false;

let skillActivationText = '';
let insufficientPoints = ''

// Points required to use power-ups
let pointsForShield = 5;
let pointsForExtraLife = 10;
let pointsForSlowMotion = 15;



// ----------------------------VARIABLES---------------------------------------------- //


// ----------------------------SETTINGS FOR THE GAME------------------------- //
function update() { 
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height)

    if (gameStarted) {
        skills();
    }

    //bird fucntions
    velocityY += gravity
    // bird.y += velocityY; - This code while just set to infity of whether it goes up or down
    bird.y = Math.max(bird.y + velocityY, 0) //apply gravity to current bird.y, this limits the bird.y to go up
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }


    //pipes functions
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            points += 0.5;
            pipe.passed = true;
        }
 
        
        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }


    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }


    // points
    context.fillStyle = "white"; //color of the text
    context.font = "20px sans-serif"; //font of the score
    context.fillText("Points: " + points, 270, 30);


    // score
    context.fillStyle = "white"; //color of the text
    context.font = "45px sans-serif"; //font of the score
    context.fillText(score, 10, 45); // x and y position of the score

    // Draw skill activation text
    drawSkillActivationText();
    drawSkillInsufficientText();


    //Game Over Text
    if (gameOver) {
        context.font = "45px sans-serif"; //font of the score
        context.fillText("Game Over", 70, 320)
    }


}
// ----------------------------SETTINGS FOR THE GAME------------------------- //



// -------------------------------- FUNCTIONS ------------------------------- //
// Background Day and Night

function toggleMode() {
    isNightMode = !isNightMode;
    updateBackground();
}

function updateBackground() {
    const board = document.getElementById("board");
    const body = document.body;
    if (isNightMode) {
        board.style.backgroundImage = "url('img/GdnytBG.jpg')";
    } else {
        board.style.backgroundImage = "url('img/flappybirdbg.png')";
    }
}


// Pipes posiition
function placePipes() {

    //Pipes height 
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = boardHeight/5

    // Top pipe placement **********
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe); //add a new pipe to the Array

    // Bottom pipe placement **********
    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe);
}

// controls for the bird to fly
function moveBird(e) {
    if (e.code == "Space" || e.type == 'click'){
        //jump
        velocityY = -6;


        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
            skillActivationText = ''
            shieldActive = false;
            extraLifeActive = false;
            slowMotionActive = false;
        }
    }
}



function detectCollision(a, b) {
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

//POWER UPS FUNCTIONS

function skills(event) {
    if (event.code == "KeyQ") {
        activateShield();
    } else if (event.code === "KeyW") {
        activateExtraLife();
    } else if (event.code === "KeyE") {
        activateSlowMotion();
    }
}

// Skills Activation And Insufficient points TEXT
//sheld
function drawSkillActivationText() {
    context.fillStyle = "white";
    context.font = "20px sans-serif";
    context.fillText(skillActivationText, 70, 320); // Adjust position as needed
}

function drawSkillInsufficientText() {
    context.fillStyle = "white";
    context.font = "20px sans-serif";
    context.fillText(insufficientPoints, 70, 320); // Adjust position as needed
}

//layf


//slowmo


function activateShield() {
    if (points >= pointsForShield) {
        shieldActive = true;
        points -= pointsForShield;
        skillActivationText = "Shield Activated"; // Set the text
        setTimeout(function() {
            skillActivationText = ''; // Clear the text after 500 milliseconds
        }, 1000);
        setTimeout(deActivateShield, 5000);
    } else{
        insufficientPoints = "Insufficient Points"; // Set the text
        setTimeout(function() {
            insufficientPoints = ''; // Clear the text after 500 milliseconds
        }, 1000);
    }
}

function deActivateShield(){
    shieldActive = false;
}

function activateExtraLife() {
    if (points >= pointsForExtraLife) {
        extraLifeActive = true;
        points -= pointsForExtraLife;
        skillActivationText = "Extra Life Activated"; // Set the text
        setTimeout(function() {
            skillActivationText = ''; // Clear the text after 500 milliseconds
        }, 1000);
    } else{
        insufficientPoints = "Insufficient Points"; // Set the text
        setTimeout(function() {
            insufficientPoints = ''; // Clear the text after 500 milliseconds
        }, 1000);
    }
}


function activateSlowMotion() {
    if (points >= pointsForSlowMotion) {
        slowMotionActive = true;
        points -= pointsForSlowMotion;
        skillActivationText = "Slow Motion Activated"; // Set the text
        setTimeout(function() {
            skillActivationText = ''; // Clear the text after 500 milliseconds
        }, 1000);
    } else{
        insufficientPoints = "Insufficient Points"; // Set the text
        setTimeout(function() {
            insufficientPoints = ''; // Clear the text after 500 milliseconds
        }, 1000);
    }
}


// ------------------ ***** FUNCTIONS ***** ------------------ //


// ----------------------------SETTING THE CANVAS FOR IMAGES------------------------- //
//For the page to load it displays all this
window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); //used for drawing on the board **********

    //draw bird canvas**********
    //context.fillStyle = "yellow";
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //Flappy Bird
    birdImg = new Image();
    birdImg.src = "img/fetberd.png";
    birdImg.onload = function() {
        context.drawImage(birdImg,bird.x, bird.y, bird.width, bird.height);
    } 

    //PIPE TOP  **********
    topPipeImg = new Image();
    topPipeImg.src = "./img/Tpipe.png"

    //PIPE BOTTOm **********
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./img/Bpipe.png"

    requestAnimationFrame(update);
    setInterval(placePipes, 2000); //every 2 seconds for the pipe to appear
    document.addEventListener("keydown", moveBird); //for the bird to move
    document.addEventListener("x", moveBird);
    document.addEventListener("keydown", skills)

}
// ----------------------------SETTING THE CANVAS FOR IMAGES------------------------- //
