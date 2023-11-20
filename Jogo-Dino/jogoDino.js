// Variáveis globais
var onGame = true;  // Flag para verificar se o jogo está em andamento
const player = document.getElementById("player");  // Elemento do jogador
const playerJump = document.getElementById("playerJump");  // Elemento de salto do jogador
const obstaculo = document.querySelector(".obstaculo");  // Elemento do obstáculo
const score = document.querySelector(".score");  // Elemento de pontuação
const highScore = document.querySelector(".highScore");  // Elemento de pontuação mais alta
const cloud = document.querySelector(".cloud");  // Elemento da nuvem
const modalReset = document.querySelector(".modalReset");  // Elemento do modal de reinício

// Array para armazenar pontuações
const scores = [];
var startScore = 0;

// Função para atualizar a pontuação exibida
function atualizarSetScore() {
    score.innerHTML = "PONTOS: " + startScore;
}

// Função para configurar e iniciar a contagem de pontuação
function setScore() {
    setScoreId = setInterval(() => {
        startScore += 1;
        console.log(onGame);
        atualizarSetScore();
        const obstaclePosition = obstaculo.getBoundingClientRect();
        console.log(obstaclePosition.left);
    }, 100);
}

// Variável para controlar se o jogador está pulando
var isJumping = false;

// Função de salto do jogador
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

// Função para verificar se o jogador perdeu o jogo
function verifyLose() {
    verifyLoseId = setInterval(() => {
        const obstaclePosition = obstaculo.getBoundingClientRect();
        const playerPosition = player.getBoundingClientRect();
        const cloudPosition = cloud.getBoundingClientRect();
        const obstaclePosition2 = obstaculo.offsetleft;

        if (obstaclePosition.left <= 60 && obstaclePosition.left > 1 && playerPosition.bottom >= 325) {
            // Se o jogador colidir com o obstáculo
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
            modalReset.style.display = "flex";  // Exibe o modal de reinício
        }
    }, 10);
}

// Função para definir a pontuação mais alta
const setHighScore = () => {
    scores.push(startScore);
    var bestScore = Math.max.apply(null, scores);
}

// Função para reiniciar o jogo
const restartGame = () => {
    onGame = true;
    modalReset.style.display = "none";  // Oculta o modal de reinício
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

// Função para aumentar a velocidade do obstáculo após atingir uma pontuação específica
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

// Evento de tecla para acionar a função de salto
document.addEventListener("keydown", jump);

// Inicialização do jogo
setScore();
verifyLose();
speed();
