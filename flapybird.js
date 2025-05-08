



"use strict";

const canvas = document.querySelector("#canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.backgroundImage = "url('flappybirdback.jpg')";
canvas.style.backgroundSize = "cover";

const context = canvas.getContext("2d");

// PLAYER CREATION

class Player {
    constructor() {
        this.x = 150;
        this.y = canvas.height / 2;
        this.width = 40;
        this.height = 40;
        this.gravity = 0.6;
        this.lift = -10;
        this.velocity = 0;
    }

    draw() {
        context.fillStyle = "yellow";
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }

        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
    }

    flap() {
        this.velocity = this.lift;
    }

    handleInput(key) {
        if (key == "Space" || key == "ArrowUp" || key === "KeyW") {
            this.flap();
        }
    }
}

// PIPE CREATION
class Pipe {
    constructor() {
        this.spacing = 250;
        this.top = Math.random() * (canvas.height / 2);
        this.bottom = canvas.height - (this.top + this.spacing);
        this.x = canvas.width;
        this.width = 70;
        this.speed = 4;
    }

    draw() {
        context.fillStyle = "green";
        context.fillRect(this.x, 0, this.width, this.top);
        context.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    }

    update() {
        this.x -= this.speed;
    }

    offscreen() {
        return this.x + this.width < 0;
    }

    hits(player) {
        if (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            (player.y < this.top || player.y + player.height > canvas.height - this.bottom)
        ) {
            return true;
        }   return false;
    }
}

let player = new Player();
let pipes = [];
let frameCount = 0;
let score = 0;

function drawScore() {
    context.fillStyle = "white";
    context.font = "30px Arial";
    context.fillText("Score: " + score, 20, 50);
}

let alertShown = false;

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    player.update();

    // Collision response: prevent player from going into pipes
    let collisionDetected = false;
    for (let i = pipes.length - 1; i >= 0; i--) {
        if (pipes[i].hits(player)) {
            collisionDetected = true;
            break;
        }
    }
    if (collisionDetected) {
        if (!alertShown) {
            alert("Game Over!");
            alertShown = true;
            window.location.reload();
        }
    }

    player.draw();

    // Add new pipe only if there are less than 2 pipes
    if (frameCount % 90 === 0 && pipes.length < 5) {
        pipes.push(new Pipe());
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        pipes[i].draw();

        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
            score++;
        }
    }

    drawScore();
    //GAME WILL NOT TO STOP
    frameCount++;
    requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", function (e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "ArrowUp") {
        player.handleInput(e.code);
    }
});

gameLoop();
