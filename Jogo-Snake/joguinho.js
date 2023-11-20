document.addEventListener("DOMContentLoaded", () => {
  // Obter referência para o elemento canvas e seu contexto 2D
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  // Obter referências para o botão de reinício e o elemento de pontuação
  const restartButton = document.getElementById("restart-button");
  const scoreElement = document.getElementById("score");

  // Tamanho da grade para o jogo
  const gridSize = 20;

  // Inicializar a cobra com uma posição inicial
  let snake = [{ x: 5, y: 5 }];

  // Inicializar a posição inicial da comida
  let food = { x: 10, y: 10 };

  // Direção inicial da cobra
  let direction = "right";

  // Variável para verificar se o jogo acabou
  let isGameOver = false;

  // Variável para armazenar a pontuação
  let score = 0;

  function draw() {
    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar a cobra
    ctx.fillStyle = "green";
    for (let i = 0; i < snake.length; i++) {
      ctx.fillRect(
        snake[i].x * gridSize,
        snake[i].y * gridSize,
        gridSize,
        gridSize
      );
    }

    // Desenhar a comida
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  }

  function update() {
    if (isGameOver) {
      return;
    }

    // Atualizar a posição da cobra com base na direção
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

    // Verificar colisão com a parede
    if (
      head.x < 0 ||
      head.x >= canvas.width / gridSize ||
      head.y < 0 ||
      head.y >= canvas.height / gridSize
    ) {
      gameOver();
      return;
    }

    // Verificar colisão com a própria cobra
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameOver();
        return;
      }
    }

    // Verificar se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreElement.textContent = score;
      snake.unshift(food);
      generateFood();
    } else {
      // Remover o último segmento da cobra e adicionar a cabeça
      snake.pop();
      snake.unshift(head);
    }

    // Desenhar o estado atual do jogo
    draw();
  }

  // Função para gerar uma nova posição para a comida
  function generateFood() {
    food = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize)),
    };
  }

  // Função chamada quando o jogo termina
  function gameOver() {
    isGameOver = true;
    restartButton.style.display = "block"; // Exibe o botão de reinício
  }

  // Função para reiniciar o jogo
  function restartGame() {
    // Reinicializa a cobra com uma posição inicial
    snake = [{ x: 5, y: 5 }];

    // Define a direção inicial da cobra
    direction = "right";

    // Reseta a flag de fim de jogo
    isGameOver = false;

    // Zera a pontuação
    score = 0;

    // Atualiza o elemento de pontuação na tela
    scoreElement.textContent = score;

    // Esconde o botão de reinício
    restartButton.style.display = "none";

    // Gera uma nova posição para a comida
    generateFood();
  }

  // Adicionar ouvintes de eventos
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

  // Iniciar o jogo
  generateFood();
  setInterval(update, 180); // Atualizar o jogo a cada 100 milissegundos
});
