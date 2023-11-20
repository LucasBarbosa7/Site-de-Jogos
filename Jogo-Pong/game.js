// Inicialização do canvas
const canvas = document.createElement('canvas');
canvas.width = 1300;
canvas.height = 530;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
document.title = 'Pong Game';

// Cores
const WHITE = 'white';
const BLACK = 'black';

// Configurações da bola
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 30,
  height: 30,
  speedX: 9 * (Math.random() > 0.5 ? 1 : -1),
  speedY: 9 * (Math.random() > 0.5 ? 1 : -1),
};

// Configurações das raquetes
const paddleA = {
  x: 50,
  y: canvas.height / 2 - 70,
  width: 10,
  height: 140,
  speed: 0,
};

// Raquete controlada pela "IA"
const paddleB = {
  x: canvas.width - 60,
  y: canvas.height / 2 - 70,
  width: 10,
  height: 140,
  speed: 6,
};

// Placar
let scoreA = 0;
let scoreB = 0;

// Fonte
const font = '36px sans-serif';

// Loop principal
const updateGameArea = () => {
  // Movimento da raquete controlada pelo jogador
  paddleA.y += paddleA.speed;
  if (paddleA.y < 0) paddleA.y = 0;
  if (paddleA.y + paddleA.height > canvas.height) paddleA.y = canvas.height - paddleA.height;

  
//----------------------------COMO QUE A "IA" FUNCIONA, COMO É FEITA ESSA SIMULAÇÃO------------
// Movimento da raquete controlada pela IA
if (ball.speedX > 0) {
  // Verifica se a bola está se movendo para a direita (em direção à raquete controlada pela IA)

  if (paddleB.y + paddleB.height / 2 < ball.y) {
    // Verifica se a posição vertical (y) da raquete B (controlada pela IA) mais a metade de sua altura
    // é menor que a posição vertical da bola. Isso significa que a bola está abaixo da posição central da raquete.

    paddleB.y += paddleB.speed;
    // Move a raquete para baixo incrementando sua posição vertical pela velocidade definida para a raquete B.
  } else {
    // Se a posição vertical da raquete B mais a metade de sua altura for maior que a posição vertical da bola,
    // significa que a bola está acima da posição central da raquete.

    paddleB.y -= paddleB.speed;
    // Move a raquete para cima decrementando sua posição vertical pela velocidade definida para a raquete B.
  }
}
//--------------------------------------------------------------------------------------------------

  // Movimento da bola
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Colisões da bola com as paredes
  if (ball.y <= 0 || ball.y + ball.height >= canvas.height) ball.speedY *= -1;

  // Colisões da bola com as raquetes
  if (
    (ball.x < paddleA.x + paddleA.width && ball.x + ball.width > paddleA.x && ball.y < paddleA.y + paddleA.height && ball.y + ball.height > paddleA.y) ||
    (ball.x < paddleB.x + paddleB.width && ball.x + ball.width > paddleB.x && ball.y < paddleB.y + paddleB.height && ball.y + ball.height > paddleB.y)
  ) {
    ball.speedX *= -1;
  }

  // Ponto para o jogador B
  if (ball.x <= 0) {
    scoreB++;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 9 * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = 9 * (Math.random() > 0.5 ? 1 : -1);
  }

  // Ponto para o jogador A
  if (ball.x + ball.width >= canvas.width) {
    scoreA++;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 9 * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = 9 * (Math.random() > 0.5 ? 1 : -1);
  }

  // Limpa a tela
  ctx.fillStyle = BLACK;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Desenha as raquetes e a bola
  ctx.fillStyle = WHITE;
  ctx.fillRect(paddleA.x, paddleA.y, paddleA.width, paddleA.height);
  ctx.fillRect(paddleB.x, paddleB.y, paddleB.width, paddleB.height);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.width / 2, 0, Math.PI * 2);
  ctx.fill();

  // Placar
  ctx.fillStyle = WHITE;
  ctx.font = font;
  ctx.fillText(scoreA + ' - ' + scoreB, canvas.width / 2 - 40, 40);
};

// Controle de quadros por segundo
const framesPerSecond = 60;
setInterval(updateGameArea, 1000 / framesPerSecond);

// Controles de teclado
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') paddleA.speed = -10;
  if (e.key === 'ArrowDown') paddleA.speed = 10;
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddleA.speed = 0;
});


