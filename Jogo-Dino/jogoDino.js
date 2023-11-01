var onGame = true;
const player = document.getElementById("player");
const playerJump = document.getElementById("playerJump");
const obstaculo = document.querySelector(".obstaculo");
const score = document.querySelector(".score");
const highScore = document.querySelector(".highScore");
const cloud = document.querySelector(".cloud");
const modalReset = document.querySelector(".modalReset");

const scores = [];
var startScore = 0;

function setScore() {
    setScoreId = setInterval(() => {
        startScore += 1;
        console.log(onGame);
        atualizarSetScore();
        const obstaclePosition = obstaculo.getBoundingClientRect();
        console.log(obstaclePosition.left);
    }, 100);
}

function atualizarSetScore() {
    score.innerHTML = "PONTOS: " + startScore;
}

var isJumping = false;

const jump = () => {
    if (!isJumping) {
        isJumping = true;
        player.style.display = "none";
        playerJump.style.display = "block";
        setTimeout(() => {
            player.style.display = "block";
            playerJump.style.display = "none";
            isJumping = false;
        }, 1000);
    }
}

function verifyLose() {
    verifyLoseId = setInterval(() => {
        const obstaclePosition = obstaculo.getBoundingClientRect();
        const playerPosition = player.getBoundingClientRect();
        const cloudPosition = cloud.getBoundingClientRect();
        const obstaclePosition2 = obstaculo.offsetleft;



        if (obstaclePosition.left <= 60 && obstaclePosition.left > 1 && playerPosition.bottom >= 325) {
            onGame = false;
            obstaculo.style.left = `${obstaclePosition.left}px`;
            obstaculo.classList.remove("obstaculoAnimation");
            var teste01 = 394 - playerPosition.bottom;
            player.style.bottom = `${teste01}px`;
            player.style.display = "block";
            playerJump.style.display = "none";
            isJumping = false;
            cloud.style.animation = "none";
            cloud.style.left = `${cloudPosition.left}px`;
            setHighScore();
            clearInterval(setScoreId);
            clearInterval(verifyLoseId);
            modalReset.style.display = "flex";
        }
    }, 10);
}

const setHighScore = () => {
    scores.push(startScore);
    var bestScore = Math.max.apply(null, scores);
}

const restartGame = () => {
    onGame = true;
    modalReset.style.display = "none";
    startScore = 0;
    setScore();
    obstaculo.classList.add("obstaculoAnimation");
    obstaculo.style.left = "";
    player.style.bottom = "-5px";
    player.style.display = "block";
    playerJump.style.display = "none";
    isJumping = false;
    cloud.style.animation = "cloudAnimation 10s infinite linear";
    cloud.style.left = "";
    verifyLose();
}

const speed = () => {
    speedId = setInterval(() => {
        const obstaclePosition = obstaculo.getBoundingClientRect();
        if (startScore >= 30 && obstaclePosition.left <= -10) {
            document.getAnimations();
            clearInterval(speedId);
            obstaculo.classList.remove("obstaculoAnimation");
            obstaculo.classList.add("obstaculoAnimation2");
        }
    }, 10);
}

document.addEventListener("keydown", jump);
setScore();
verifyLose();
speed();