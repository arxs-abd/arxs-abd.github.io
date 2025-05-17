// Snake Game JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const canvas = document.getElementById('snake-board');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const viewHighScoresBtn = document.getElementById('view-high-scores-btn');
    const gameOverModal = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    const resultMessageElement = document.getElementById('result-message');
    const playerNameInput = document.getElementById('player-name');
    const saveScoreBtn = document.getElementById('save-score-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const highScoresPanel = document.getElementById('high-scores-panel');
    const highScoresList = document.getElementById('high-scores-list');
    const closeHighScoresBtn = document.getElementById('close-high-scores-btn');
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    
    // Game variables
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let gameSpeed = 150; // milliseconds
    let gameInterval;
    let score = 0;
    let highScore = 0;
    let isPlaying = false;
    let isPaused = false;
    let gridSize = 20; // 20x20 grid
    let cellSize;
    let difficulty = 'easy';
    
    // Initialize the game
    function initGame() {
        // Set canvas size
        resizeCanvas();
        
        // Initialize snake
        snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        
        // Create initial food
        createFood();
        
        // Reset game state
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        isPlaying = false;
        isPaused = false;
        
        // Update score display
        updateScore();
        
        // Load high score from local storage
        loadHighScore();
        
        // Draw initial state
        draw();
        
        // Update button states
        startBtn.textContent = 'Start Game';
        pauseBtn.textContent = 'Pause';
        pauseBtn.disabled = true;
    }
    
    // Resize canvas to maintain aspect ratio
    function resizeCanvas() {
        const containerWidth = canvas.parentElement.clientWidth;
        canvas.width = Math.min(containerWidth, 500);
        canvas.height = canvas.width;
        cellSize = canvas.width / gridSize;
    }
    
    // Create food at random position
    function createFood() {
        // Generate random position that's not on the snake
        let position;
        do {
            position = {
                x: Math.floor(Math.random() * gridSize),
                y: Math.floor(Math.random() * gridSize)
            };
        } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
        
        food = position;
    }
    
    // Draw the game
    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background grid
        drawGrid();
        
        // Draw snake
        drawSnake();
        
        // Draw food
        drawFood();
    }
    
    // Draw background grid
    function drawGrid() {
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i <= gridSize; i++) {
            // Draw vertical lines
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvas.height);
            ctx.stroke();
            
            // Draw horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(canvas.width, i * cellSize);
            ctx.stroke();
        }
    }
    
    // Draw snake
    function drawSnake() {
        snake.forEach((segment, index) => {
            // Use primary color for head, secondary for body
            if (index === 0) {
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            } else {
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim();
            }
            
            // Draw rounded rectangle for each segment
            roundedRect(
                segment.x * cellSize + 1,
                segment.y * cellSize + 1,
                cellSize - 2,
                cellSize - 2,
                5
            );
            
            // Draw eyes on the head
            if (index === 0) {
                ctx.fillStyle = '#000';
                
                // Position eyes based on direction
                let eyeX1, eyeY1, eyeX2, eyeY2;
                const eyeSize = cellSize / 6;
                const eyeOffset = cellSize / 4;
                
                switch (direction) {
                    case 'up':
                        eyeX1 = segment.x * cellSize + eyeOffset;
                        eyeY1 = segment.y * cellSize + eyeOffset;
                        eyeX2 = segment.x * cellSize + cellSize - eyeOffset - eyeSize;
                        eyeY2 = segment.y * cellSize + eyeOffset;
                        break;
                    case 'down':
                        eyeX1 = segment.x * cellSize + eyeOffset;
                        eyeY1 = segment.y * cellSize + cellSize - eyeOffset - eyeSize;
                        eyeX2 = segment.x * cellSize + cellSize - eyeOffset - eyeSize;
                        eyeY2 = segment.y * cellSize + cellSize - eyeOffset - eyeSize;
                        break;
                    case 'left':
                        eyeX1 = segment.x * cellSize + eyeOffset;
                        eyeY1 = segment.y * cellSize + eyeOffset;
                        eyeX2 = segment.x * cellSize + eyeOffset;
                        eyeY2 = segment.y * cellSize + cellSize - eyeOffset - eyeSize;
                        break;
                    case 'right':
                        eyeX1 = segment.x * cellSize + cellSize - eyeOffset - eyeSize;
                        eyeY1 = segment.y * cellSize + eyeOffset;
                        eyeX2 = segment.x * cellSize + cellSize - eyeOffset - eyeSize;
                        eyeY2 = segment.y * cellSize + cellSize - eyeOffset - eyeSize;
                        break;
                }
                
                ctx.fillRect(eyeX1, eyeY1, eyeSize, eyeSize);
                ctx.fillRect(eyeX2, eyeY2, eyeSize, eyeSize);
            }
        });
    }
    
    // Draw food
    function drawFood() {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        
        // Draw apple-like shape
        ctx.beginPath();
        ctx.arc(
            food.x * cellSize + cellSize / 2,
            food.y * cellSize + cellSize / 2,
            cellSize / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw stem
        ctx.fillStyle = '#5a3921';
        ctx.fillRect(
            food.x * cellSize + cellSize / 2 - 1,
            food.y * cellSize + 2,
            2,
            cellSize / 4
        );
    }
    
    // Helper function to draw rounded rectangle
    function roundedRect(x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }
    
    // Update game state
    function update() {
        // Update direction
        direction = nextDirection;
        
        // Calculate new head position
        const head = {...snake[0]};
        
        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        
        // Check for collision with walls
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            gameOver();
            return;
        }
        
        // Check for collision with self
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }
        
        // Add new head
        snake.unshift(head);
        
        // Check if food is eaten
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score += 10;
            updateScore();
            
            // Create new food
            createFood();
        } else {
            // Remove tail if no food eaten
            snake.pop();
        }
        
        // Draw updated state
        draw();
    }
    
    // Update score display
    function updateScore() {
        scoreElement.textContent = score;
    }
    
    // Load high score from local storage
    function loadHighScore() {
        const savedHighScore = localStorage.getItem('snakeHighScore');
        if (savedHighScore) {
            highScore = parseInt(savedHighScore);
            highScoreElement.textContent = highScore;
        }
    }
    
    // Save high score to local storage
    function saveHighScore() {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            highScoreElement.textContent = highScore;
        }
    }
    
    // Game over
    function gameOver() {
        clearInterval(gameInterval);
        isPlaying = false;
        
        // Save high score
        saveHighScore();
        
        // Show game over modal
        finalScoreElement.textContent = score;
        
        // Set result message based on score
        if (score > highScore) {
            resultMessageElement.textContent = 'New High Score!';
            startConfetti();
            setTimeout(stopConfetti, 5000);
        } else if (score > 100) {
            resultMessageElement.textContent = 'Impressive!';
        } else if (score > 50) {
            resultMessageElement.textContent = 'Good job!';
        } else {
            resultMessageElement.textContent = 'Better luck next time!';
        }
        
        gameOverModal.classList.add('active');
        
        // Update button states
        startBtn.textContent = 'Start Game';
        pauseBtn.disabled = true;
    }
    
    // Start game
    function startGame() {
        if (!isPlaying) {
            isPlaying = true;
            isPaused = false;
            
            // Start game loop
            gameInterval = setInterval(update, gameSpeed);
            
            // Update button states
            startBtn.textContent = 'Restart';
            pauseBtn.disabled = false;
        } else {
            // Restart game
            clearInterval(gameInterval);
            initGame();
            isPlaying = true;
            
            // Start game loop
            gameInterval = setInterval(update, gameSpeed);
            
            // Update button states
            startBtn.textContent = 'Restart';
            pauseBtn.disabled = false;
        }
    }
    
    // Pause/resume game
    function togglePause() {
        if (!isPlaying) return;
        
        if (isPaused) {
            // Resume game
            gameInterval = setInterval(update, gameSpeed);
            isPaused = false;
            pauseBtn.textContent = 'Pause';
        } else {
            // Pause game
            clearInterval(gameInterval);
            isPaused = true;
            pauseBtn.textContent = 'Resume';
        }
    }
    
    // Handle keyboard input
    function handleKeydown(e) {
        if (!isPlaying || isPaused) return;
        
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    }
    
    // High Score System
    function saveScore() {
        const playerName = playerNameInput.value.trim() || 'Anonymous';
        
        // Get existing high scores from local storage
        let highScores = JSON.parse(localStorage.getItem('snakeGameHighScores')) || [];
        
        // Add new score
        const newScore = {
            name: playerName,
            score: score,
            difficulty: difficulty,
            date: new Date().toLocaleDateString()
        };
        
        highScores.push(newScore);
        
        // Sort by score (highest first)
        highScores.sort((a, b) => b.score - a.score);
        
        // Keep only top 10 scores
        highScores = highScores.slice(0, 10);
        
        // Save back to local storage
        localStorage.setItem('snakeGameHighScores', JSON.stringify(highScores));
        
        // Update high scores display
        displayHighScores();
        
        // Hide game over modal and show high scores
        gameOverModal.classList.remove('active');
        highScoresPanel.classList.add('active');
    }
    
    // Display high scores
    function displayHighScores() {
        // Get high scores from local storage
        const highScores = JSON.parse(localStorage.getItem('snakeGameHighScores')) || [];
        
        // Clear current list
        highScoresList.innerHTML = '';
        
        if (highScores.length === 0) {
            const noScoresItem = document.createElement('li');
            noScoresItem.textContent = 'No high scores yet. Be the first!';
            highScoresList.appendChild(noScoresItem);
            return;
        }
        
        // Create header row
        const headerRow = document.createElement('li');
        headerRow.classList.add('high-score-header');
        headerRow.innerHTML = `
            <span class="score-rank">#</span>
            <span class="score-name">Name</span>
            <span class="score-value">Score</span>
            <span class="score-difficulty">Difficulty</span>
        `;
        highScoresList.appendChild(headerRow);
        
        // Add each high score to the list
        highScores.forEach((score, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('high-score-item');
            
            // Add medal for top 3
            let rankDisplay = `${index + 1}`;
            if (index === 0) rankDisplay = '🥇';
            else if (index === 1) rankDisplay = '🥈';
            else if (index === 2) rankDisplay = '🥉';
            
            listItem.innerHTML = `
                <span class="score-rank">${rankDisplay}</span>
                <span class="score-name">${score.name}</span>
                <span class="score-value">${score.score}</span>
                <span class="score-difficulty">${score.difficulty}</span>
            `;
            
            highScoresList.appendChild(listItem);
        });
    }
    
    // Confetti Effect
    const confettiCanvas = document.getElementById('confetti-canvas');
    const confettiCtx = confettiCanvas.getContext('2d');
    const confettiPieces = [];
    let confettiAnimation;
    
    // Resize canvas
    function resizeConfettiCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    
    // Create confetti piece
    function createConfettiPiece() {
        const colors = [
            getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
            '#ffffff'
        ];
        
        return {
            x: Math.random() * confettiCanvas.width,
            y: -20,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 6.28,
            rotation: Math.random() * 0.2 - 0.1,
            rotationSpeed: Math.random() * 0.01 - 0.005
        };
    }
    
    // Draw confetti
    function drawConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        // Add new pieces
        if (confettiPieces.length < 200) {
            for (let i = 0; i < 5; i++) {
                confettiPieces.push(createConfettiPiece());
            }
        }
        
        // Update and draw pieces
        for (let i = 0; i < confettiPieces.length; i++) {
            const piece = confettiPieces[i];
            
            piece.y += piece.speed;
            piece.x += Math.sin(piece.angle) * 2;
            piece.angle += piece.rotation;
            piece.rotationSpeed += 0.0001;
            
            confettiCtx.save();
            confettiCtx.translate(piece.x, piece.y);
            confettiCtx.rotate(piece.angle);
            confettiCtx.fillStyle = piece.color;
            confettiCtx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
            confettiCtx.restore();
            
            // Remove pieces that are off screen
            if (piece.y > confettiCanvas.height) {
                confettiPieces.splice(i, 1);
                i--;
            }
        }
        
        confettiAnimation = requestAnimationFrame(drawConfetti);
    }
    
    // Start confetti
    function startConfetti() {
        resizeConfettiCanvas();
        confettiPieces.length = 0;
        confettiCanvas.style.display = 'block';
        drawConfetti();
    }
    
    // Stop confetti
    function stopConfetti() {
        cancelAnimationFrame(confettiAnimation);
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiCanvas.style.display = 'none';
    }
    
    // Event listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
        draw();
        resizeConfettiCanvas();
    });
    
    document.addEventListener('keydown', handleKeydown);
    
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    
    viewHighScoresBtn.addEventListener('click', () => {
        displayHighScores();
        highScoresPanel.classList.add('active');
    });
    
    saveScoreBtn.addEventListener('click', saveScore);
    
    playAgainBtn.addEventListener('click', () => {
        gameOverModal.classList.remove('active');
        initGame();
        startGame();
    });
    
    closeHighScoresBtn.addEventListener('click', () => {
        highScoresPanel.classList.remove('active');
    });
    
    // Mobile control buttons
    upBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (direction !== 'down') nextDirection = 'up';
    });
    
    downBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (direction !== 'up') nextDirection = 'down';
    });
    
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (direction !== 'right') nextDirection = 'left';
    });
    
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (direction !== 'left') nextDirection = 'right';
    });
    
    // Difficulty buttons
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            difficultyBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Set game speed and difficulty
            gameSpeed = parseInt(btn.dataset.speed);
            difficulty = btn.dataset.difficulty;
            
            // Update game interval if game is running
            if (isPlaying && !isPaused) {
                clearInterval(gameInterval);
                gameInterval = setInterval(update, gameSpeed);
            }
        });
    });
    
    // Initialize the game
    initGame();
});