document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const eatSound = document.getElementById("eat-sound");
  const restartButton = document.getElementById("restart-button");
  const scoreElement = document.getElementById("score");

  const gridSize = 20;
  let snake = [{ x: 5, y: 5 }];
  let food = { x: 10, y: 10 };
  let direction = "right";
  let isGameOver = false;
  let score = 0;

  // Carregar imagens
  const snakeImage = new Image();
  snakeImage.src = "snake.png"; // substitua "snake.png" pelo caminho da sua imagem de cobrinha

  const appleImage = new Image();
  appleImage.src = "apple.png"; // substitua "apple.png" pelo caminho da sua imagem de maçã

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar a cobrinha
    snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.drawImage(snakeImage, segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
      } else {
        ctx.fillStyle = "green";
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
      }
    });

    // Desenhar a maçã
    ctx.drawImage(appleImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  }

  function update() {
    if (isGameOver) {
      return;
    }

    const head = { ...snake[0] };
    switch (direction) {
      case "up":
        head.y -= 1;
        break;
      case "down":
        head.y += 1;
        break;
      case "left":
        head.x -= 1;
        break;
      case "right":
        head.x += 1;
        break;
    }

    if (
      head.x < 0 || head.x >= canvas.width / gridSize ||
      head.y < 0 || head.y >= canvas.height / gridSize
    ) {
      gameOver();
      return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      gameOver();
      return;
    }

    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreElement.textContent = score;
      eatSound.currentTime = 0;
      eatSound.play();
      snake.unshift(head);
      generateFood();
    } else {
      snake.pop();
      snake.unshift(head);
    }

    draw();
  }

  function generateFood() {
    food = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize)),
    };
  }

  function gameOver() {
    isGameOver = true;
    restartButton.style.display = "block";
  }

  function restartGame() {
    snake = [{ x: 5, y: 5 }];
    direction = "right";
    isGameOver = false;
    score = 0;
    scoreElement.textContent = score;
    restartButton.style.display = "none";
    generateFood();
  }

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  });

  restartButton.addEventListener("click", restartGame);

  generateFood();
  setInterval(update, 180);
});
