let direction = 'ArrowRight';
let snake = [{ top: 200, left: 200 }];
let apple = null;
let updatingSnake = false; // Флаг обновления змейки


function gameLoop() {
    var speedSlider = document.getElementById("speed-slider");
    var gameSpeed = parseInt(speedSlider.value);
    var delay = 5000 / gameSpeed;
    
    if (checkForSelfCollision()) {
        restartGame();
        return alert('Game Over');
    }

    if (updatingSnake) {
        return; // Если обновление уже идет, прерываем выполнение
    }

    updatingSnake = true; // Устанавливаем флаг перед началом обновления

    setTimeout(function onTick() {
        clearBoard();
        updateSnake();
        drawSnake();
        drawApple();
        updatingSnake = false; // Сбрасываем флаг после обновления
        gameLoop();
    }, delay);
}

function clearBoard() {
    const gameBoard = document.getElementById('game-board');
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }
}

function drawSnake() {
    snake.forEach(function (dot) {
        const snakeElement = document.createElement('div');
        snakeElement.style.top = `${dot.top}px`;
        snakeElement.style.left = `${dot.left}px`;
        snakeElement.style.border = '2px solid #f0fff0'
        snakeElement.classList.add('dot');
        document.getElementById('game-board').appendChild(snakeElement);
    });
}

function updateSnake() {
    const head = Object.assign({}, snake[0]); 

    switch (direction) {
        case 'ArrowUp':
            head.top -= 20;
            break;
        case 'ArrowDown':
            head.top += 20;
            break;
        case 'ArrowLeft':
            head.left -= 20;
            break;
        case 'ArrowRight':
            head.left += 20;
            break;
    }

    // Обновление границ
    if (head.top < 0) {
        head.top = 380;
    }
    if (head.top > 380) {
        head.top = 0;
    }
    if (head.left < 0) {
        head.left = 380;
    }
    if (head.left > 380) {
        head.left = 0;
    }

    snake.unshift(head);

    if (apple && snake[0].left === apple.left && snake[0].top === apple.top) {
        apple = null; 
    } else {
        snake.pop(); 
    }
}

function checkForSelfCollision() {
    const head = snake[0];
    return snake.slice(1).some(dot => dot.left === head.left && dot.top === head.top);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function isInsideSnake(x, y) {
    return snake.some(dot => dot.left === x && dot.top === y);
}

function drawApple() {
    if (!apple) {
        let newApple;
        do {
            newApple = { top: random(0, 19) * 20, left: random(0, 19) * 20 };
        } while (isInsideSnake(newApple.left, newApple.top));

        apple = newApple;
    }
    const appleElement = document.createElement('div');
    appleElement.style.top = `${apple.top}px`;
    appleElement.style.left = `${apple.left}px`;
    appleElement.classList.add('apple');
    document.getElementById('game-board').appendChild(appleElement);
}

window.addEventListener('keydown', handleKeyDown);

function handleKeyDown(e) {
    const opposite = {
        ArrowUp: 'ArrowDown',
        ArrowDown: 'ArrowUp',
        ArrowLeft: 'ArrowRight',
        ArrowRight: 'ArrowLeft',
    };

    if (e.key !== opposite[direction]) {
        direction = e.key;
    }
}

function restartGame() {
    location.reload(); // Перезагружаем текущую страницу
}

gameLoop();
