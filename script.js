const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let startGame = false;
let endGame = false;
let player = {};
let blocks = [];
let score;
let scoreControll;
let beginScore = false;
const betweenBlocksDistance = 250;
const bg = new Image();
const bird = new Image();
const topBlock = new Image();
const bottomBlock = new Image();
bg.src = "./flappybirdbg.png";
bird.src = "./flappybird.png";
bottomBlock.src = "./bottompipe.png";
topBlock.src = "./toppipe.png";

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function handelInteract() {
    if (player.dy >= -3 && startGame) {
        player.dy = -4.2;
    }
    if (!startGame && endGame) {
        endGame = false;
        init();
    }
    beginScore = true;
    if (beginScore && !startGame) {
        scoreControll = setInterval(() => {
            score++;
        }, 1000);
    }
    startGame = true;
}

window.addEventListener("keydown", handelInteract);
window.addEventListener("touchstart", handelInteract);

function getRandomBlock() {
    return Math.random() * 241 - 120;
}

class Player {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y - h / 2;
        this.w = w;
        this.h = h;
        this.dy = 3;
    }
    draw() {
        c.drawImage(bird, this.x, this.y, this.w, this.h);
        this.move();
    }
    move() {
        if (this.dy < 3) {
            this.dy += 0.1;
        }
        this.y += this.dy;
        if (this.y <= 0) {
            this.dy = 1;
        }
    }
}

class Block {
    static last = 0;
    constructor(x, w, player) {
        this.random = getRandomBlock();
        this.x = x;
        this.w = w;
        this.height = canvas.height / 2 - 100; // The  Opening Bettween UpBlock And DownBlock
        this.bottomBlockY = canvas.height - this.height + this.random;
        this.topBlockY = 0;
        this.topBlockHeight = this.height + this.random;
        this.bottomBlockHeight = this.height - this.random;
        this.blockSpeed = -2;
        this.player = player;
    }
    draw() {
        c.fillStyle = "#000";
        // c.fillRect(this.x, this.topBlockY, this.w, this.topBlockHeight);
        c.drawImage(
            topBlock,
            this.x,
            this.topBlockY,
            this.w,
            this.topBlockHeight
        );
        // c.fillRect(this.x, this.bottomBlockY, this.w, this.bottomBlockHeight);
        c.drawImage(
            bottomBlock,
            this.x,
            this.bottomBlockY,
            this.w,
            this.bottomBlockHeight
        );
        this.gameOver();
        this.move();
    }
    move() {
        this.x += this.blockSpeed;
        // When Block Go Away From Screen Use It Again With New Opeing Position
        if (this.x + this.w <= 0) {
            this.x = Block.last - canvas.width / 2 + betweenBlocksDistance;
            this.random = getRandomBlock();
        }
    }
    gameOver() {
        if (
            player.y >= canvas.height - player.h ||
            (player.x + player.w >= this.x &&
                player.x < this.x + this.w &&
                (player.y + player.h >= this.bottomBlockY ||
                    player.y <= this.topBlockHeight))
        ) {
            endGame = true;
        }
    }
}

function init() {
    player = undefined;
    blocks = [];
    score = 0;
    player = new Player(100, canvas.height / 2, 34, 24);
    for (let i = 0; i < 10; i++) {
        blocks.push(
            new Block(
                Math.ceil(canvas.width / 2 + i * betweenBlocksDistance + 300),
                70,
                player
            )
        );
        Block.last = Math.ceil(canvas.width / 2 + i * betweenBlocksDistance);
    }
}
init();

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < canvas.width / 360; i++) {
        c.drawImage(bg, i * 360, 0, 360, innerHeight);
    }
    if (endGame) {
        startGame = false;
        c.font = "30px arial";
        c.textAlign = "center";
        c.fillStyle = "red";
        c.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        c.fillText(
            `your score is ${score}`,
            canvas.width / 2,
            canvas.height / 2 + 40
        );
        clearInterval(scoreControll);
        beginScore = false;
    } else {
        if (startGame) {
            c.fillStyle = "black";
            player.draw();
            blocks.forEach((e) => {
                e.draw();
            });
            c.fillStyle = "green";
            c.fillText(score, 30, 40);
        } else {
            c.font = "30px arial";
            c.textAlign = "center";
            c.fillText("Press To Start", canvas.width / 2, canvas.height / 2);
        }
    }
}
animate();
