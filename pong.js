/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
*/

/* 
    Created on : 12.03.2020, 13:41:40
    Author     : F.Mohm
*/

//select canvas element
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

//control variable paused for ingame_break
let paused = false;

//create the user paddle
const user = {
	x : 0, 
	y : cvs.height/2 - 100/2,
	width : 10,
	height : 100,
	color : "WHITE",
	score : 0
};

// create the computer paddle
const com = {
	x : cvs.width - 10,
	y : cvs.height/2 - 100/2,
	width : 10,
	height : 100,
	color : "WHITE",
	score : 0
};

//create the net
const net = {
	x : cvs.width/2 - 2/2,
	y : 0,
	width : 2,
	height : 10,
	color : "WHITE"
};

//create the ball
const ball = {
	x : cvs.width/2,
	y : cvs.height/2,
	radius : 10,
	speed : 5,
	velocityX : 5, //velocity = speed + direction
	velocityY : 5,
	color: "WHITE" 
};

// !Drawing methods: beginning

//Draw Rectangle
function drawRect(x, y, w, h, col) {
	ctx.fillStyle = col;
	ctx.fillRect(x, y, w, h);
}

//Draw Circle
function drawCircle(x, y, r, col) {
	ctx.fillStyle = col;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI*2, false);
	ctx.closePath();
	ctx.fill();
}
//Draw Text
function drawText(text, x, y, col) {
	ctx.fillStyle = col;
	ctx.font = "45px fantasy";
	ctx.fillText(text, x, y);
}

function drawNet(){
	for(let i = 0; i <= cvs.height;i+=15) {
		drawRect(net.x, net.y + i, net.width, net.height, net.color);
	}
}

// !Drawing methods: ending
// !Ingame methods: begining



//defining the collision detections
function collision(b, p){
	p.top = p.y;
	p.bottom = p.y + p.height;
	p.left = p.x;
	p.right = p.x + p.width;

	b.top = b.y - b.radius;
	b.bottom = b.y + b.radius;
	b.left = b.x - b.radius;
	b.right = b.x + b.radius;

	return b.right > p.left &&
               b.top < p.bottom &&
               b.left < p.right &&
               b.bottom > p.top; 
}

//listening to the mouseEvents
cvs.addEventListener("mousemove", movePaddle);

//controlling the movement by ingame paddle
function movePaddle(evt){
    let rect = cvs.getBoundingClientRect();
    let computerlevel = 0.1;
    user.y = evt.clientY - rect.top - user.height/2;
    com.y += (ball.y - (com.y + com.height/2)) * computerlevel;
}

//listening to the keyDownEvent by Keyboard
window.addEventListener("keydown", function (e) {
    var key = e.keyCode;
    if(key === 80) { // toggle Key 'P'
       togglePause();
    }
});

//triggering the Pausewindow
function togglePause(){
    if (!paused) {
        loop = clearTimeout(loop);
        drawText("Pause", cvs.width/4*1.6, cvs.height/2, "WHITE");
        paused = true;
    }else if(paused){
        loop = setInterval(game, 1000 / fps);
        paused = false;
    }
}

//respawning the ball by the win
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

//updating the ingameProcess
function update(){
        if(ball.x - ball.radius < 0){
            com.score++;
            resetBall();
        }else if(ball.x + ball.radius > cvs.width){
            user.score++;
            resetBall();
        }
	ball.x += ball.velocityX; //X+
	ball.y += ball.velocityY; //Y+
	if(ball.y + ball.radius > cvs.height ||
                ball.y - ball.radius < 0){
		ball.velocityY = - ball.velocityY;
	}
	let player = (ball.x < cvs.width/2) ? user : com;
	if(collision(ball, player)) {
		let collidePoint = (ball.y - (player.y + player.height / 2));
		collidePoint = collidePoint / (player.height / 2);
		let angleRad = (Math.PI / 4) * collidePoint;
		let direction = (ball.x < cvs.width / 2) ? 1 : -1;
		ball.velocityX = direction * ball.speed * Math.cos(angleRad);
		ball.velocityY = direction * ball.speed * Math.cos(angleRad);
		ball.speed += 0.1;
	}
}
//      a for angle
//	ball.velocityX = ball.speed*cos(a);
//	ball.velocityY = ball.speed*cos(a);

//rendering the ingameProcess
function render(){
	drawRect(0, 0, cvs.width, cvs.height, "BLACK");
	drawText(user.score, cvs.width/4, cvs.height/5, "WHITE");
	drawText(com.score, 3*cvs.width/4, cvs.height/5, "WHITE");
	drawNet();
	drawRect(user.x, user.y, user.width, user.height, user.color);
	drawRect(com.x, com.y, com. width, com.height, com.color);
	drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

//mainFunction ingame
function game() {
        if(paused) return;
	update(); // Mouvements, Collision detection, Score Update, ...
	render();
}

//number of frames per second
const fps = 50;

//Call game(); 50 times every 1000ms = 1sec
let loop = setInterval(game, 1000 / fps);
