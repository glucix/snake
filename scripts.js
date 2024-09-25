const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const canvasSize = 500;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [{ x: 160, y: 160 }];
let snakeLength = 1;
let food = { x: 0, y: 0 };
let dx = gridSize;
let dy = 0;
let score = 0;
let highscore = localStorage.getItem('highscore') || 0;
let changingDirection = false;
let speed = 100; // Startowa prędkość
let gameOver = false; // Zmienna do obsługi ekranu końcowego

const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const finalHighscore = document.getElementById('finalHighscore');

document.getElementById('highscore').textContent = highscore;

// Tworzenie obiektu obrazu dla jedzenia
const foodImage = new Image();
foodImage.src = 'zdjecia/banan.png'; // Ścieżka do obrazu jedzenia

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('keydown', changeDirection);
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        gameOverScreen.classList.add('active');
        finalScore.textContent = score;
        finalHighscore.textContent = highscore;
        return;
    }

    // Rysowanie węża
    ctx.fillStyle = 'lime';
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });

    // Rysowanie jedzenia jako obrazu
    ctx.drawImage(foodImage, food.x, food.y, gridSize, gridSize);

    // Wyświetlanie wyniku
    document.getElementById('score').textContent = score;
}

function update() {
    if (gameOver) return; // Nie aktualizuj, jeśli gra się skończyła

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x === food.x && head.y === food.y) {
        snakeLength++;
        score++;
        food = randomFoodPosition();
        
        // Zwiększanie prędkości, gdy wynik rośnie
        speed = Math.max(50, 100 - score * 2); // Minimalna prędkość to 50ms

        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore);
            document.getElementById('highscore').textContent = highscore;
        }
    } else {
        snake.pop();
    }

    snake.unshift(head);

    // Sprawdzanie kolizji
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || snake.some((part, index) => index !== 0 && part.x === head.x && part.y === head.y)) {
        gameOver = true; // Gra zakończona
    }
}

function randomFoodPosition() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x, y };
}

function changeDirection(event) {
    if (changingDirection) return;

    changingDirection = true;
    const keyPressed = event.code;

    if (keyPressed === 'KeyW' && dy === 0) {
        dx = 0;
        dy = -gridSize;
    } else if (keyPressed === 'KeyS' && dy === 0) {
        dx = 0;
        dy = gridSize;
    } else if (keyPressed === 'KeyA' && dx === 0) {
        dx = -gridSize;
        dy = 0;
    } else if (keyPressed === 'KeyD' && dx === 0) {
        dx = gridSize;
        dy = 0;
    } else if (keyPressed === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = gridSize;
    } else if (keyPressed === 'ArrowLeft' && dx === 0) {
        dx = -gridSize;
        dy = 0;
    } else if (keyPressed === 'ArrowRight' && dx === 0) {
        dx = gridSize;
        dy = 0;
    } else if (keyPressed === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -gridSize;
    }
    
    // Restart gry po naciśnięciu "R" na ekranie końcowym
    if (gameOver && keyPressed === 'KeyR') {
        restartGame();
    }
}

function handleTouchStart(event) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleTouchMove(event) {
    if (changingDirection) return;

    const touch = event.touches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Ruch poziomy
        if (deltaX > 0 && dx === 0) {
            dx = gridSize;
            dy = 0;
        } else if (deltaX < 0 && dx === 0) {
            dx = -gridSize;
            dy = 0;
        }
    } else {
        // Ruch pionowy
        if (deltaY > 0 && dy === 0) {
            dx = 0;
            dy = gridSize;
        } else if (deltaY < 0 && dy === 0) {
            dx = 0;
            dy = -gridSize;
        }
    }

    changingDirection = true;
}

function restartGame() {
    snake = [{ x: 160, y: 160 }];
    snakeLength = 1;
    score = 0;
    dx = gridSize;
    dy = 0;
    speed = 100; // Reset prędkości
    food = randomFoodPosition();
    gameOver = false; // Reset flagi końca gry
    gameOverScreen.classList.remove('active'); // Ukrywa ekran końcowy
}

function main() {
    changingDirection = false;
    update();
    draw();
    setTimeout(main, speed); // Dynamicznie dostosowane opóźnienie
}

food = randomFoodPosition();
main();
