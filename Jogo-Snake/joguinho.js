document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    const gridSize = 20;
    const foodColor = 'red';

    let snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
    ];

    let food = { x: 10, y: 10 };

    let direction = 'right';
    let score = 0;

    const restartButton = document.getElementById('restart-button');
    const gameOverElement = document.getElementById('game-over');

    // Função para desenhar a cobra
    function drawSnake() {
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = 'green';
            ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
        }
    }

    // Função para desenhar a comida
    function drawFood() {
        ctx.fillStyle = foodColor;
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    // Função para mover a cobra
    function moveSnake() {
        let newHead = { x: snake[0].x, y: snake[0].y };

        if (direction === 'right') newHead.x += 1;
        if (direction === 'left') newHead.x -= 1;
        if (direction === 'up') newHead.y -= 1;
        if (direction === 'down') newHead.y += 1;

        snake.unshift(newHead);

        if (newHead.x === food.x && newHead.y === food.y) {
            food = { x: Math.floor(Math.random() * canvas.width / gridSize), y: Math.floor(Math.random() * canvas.height / gridSize) };
            score += 10;
        } else {
            snake.pop();
        }
    }

    // Função para verificar colisões
    function checkCollision() {
        if (snake[0].x < 0 || snake[0].x >= canvas.width / gridSize || snake[0].y < 0 || snake[0].y >= canvas.height / gridSize) {
            gameOver();
        }

        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                gameOver();
            }
        }
    }

    // Função para lidar com o fim de jogo
    function gameOver() {
        clearInterval(game);
        gameOverElement.classList.remove('hidden');
        restartButton.style.display = 'block';
    }

    function restartGame() {
        snake = [
            { x: 5, y: 5 },
            { x: 4, y: 5 },
            { x: 3, y: 5 },
        ];
        food = { x: 10, y: 10 };
        direction = 'right';
        score = 0;
        restartButton.style.display = 'none';
        gameOverElement.classList.add('hidden');
        game = setInterval(updateGameArea, 100); // Iniciar um novo loop de jogo
    }

    // Ouvinte de eventos para o botão "Jogar novamente"
    restartButton.addEventListener('click', restartGame);

    // Função para atualizar a área de jogo
    function updateGameArea() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        moveSnake();
        drawSnake();
        drawFood();
        checkCollision();
        document.getElementById('score').textContent = 'Pontuação: ' + score;
    }

    // Função para alterar a direção da cobra
    function changeDirection(event) {
        if (event.key === 'ArrowRight' && direction !== 'left') direction = 'right';
        if (event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
        if (event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
        if (event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    }

    // Iniciar o jogo
    window.addEventListener('keydown', changeDirection);
    let game = setInterval(updateGameArea, 100);

    restartButton.addEventListener('click', restartGame);
});
