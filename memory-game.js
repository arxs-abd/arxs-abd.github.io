// Memory Game JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameBoard = document.getElementById('game-board');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const movesCount = document.getElementById('moves-count');
    const timeElement = document.getElementById('time');
    const resultElement = document.getElementById('game-result');
    const resultTimeElement = document.getElementById('result-time');
    const resultMovesElement = document.getElementById('result-moves');
    const playAgainBtn = document.getElementById('play-again-btn');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const matchNotification = document.getElementById('match-notification');
    const highScoresList = document.getElementById('high-scores-list');
    const saveScoreBtn = document.getElementById('save-score-btn');
    const playerNameInput = document.getElementById('player-name');
    const highScoresPanel = document.getElementById('high-scores-panel');
    const showHighScoresBtn = document.getElementById('show-high-scores-btn');
    const closeHighScoresBtn = document.getElementById('close-high-scores-btn');
    const viewHighScoresBtn = document.getElementById('view-high-scores-btn');
    
    // Game variables
    let cards = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matchedPairs = 0;
    let totalPairs = 0;
    let timer = null;
    let seconds = 0;
    let minutes = 0;
    let isPlaying = false;
    let gridSize = 4; // Default grid size (4x4)
    let difficulty = 'easy'; // Default difficulty
    let currentScore = 0;
    
    // Card symbols - using simple shapes and letters that match the theme
    const symbols = [
        '♠', '♥', '♦', '♣', '★', '✿', '♫', '❄',
        '✓', '✗', '◆', '◇', '▲', '△', '●', '○',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'
    ];
    
    // Initialize the game
    function initGame() {
        clearBoard();
        resetGame();
        createCards();
        updateMovesText();
        updateTimeText();
    }
    
    // Clear the game board
    function clearBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    }
    
    // Reset game variables
    function resetGame() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        moves = 0;
        matchedPairs = 0;
        seconds = 0;
        minutes = 0;
        isPlaying = false;
        currentScore = 0;
        
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        
        updateMovesText();
        updateTimeText();
        
        resultElement.classList.remove('active');
        highScoresPanel.classList.remove('active');
    }
    
    // Create cards for the game
    function createCards() {
        totalPairs = Math.floor((gridSize * gridSize) / 2);
        const selectedSymbols = symbols.slice(0, totalPairs);
        
        // Create pairs of cards
        cards = [...selectedSymbols, ...selectedSymbols];
        
        // Shuffle the cards
        shuffleCards();
        
        // Create card elements
        cards.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.index = index;
            card.dataset.symbol = symbol;
            
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');
            cardFront.textContent = symbol;
            
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            
            card.addEventListener('click', flipCard);
            
            gameBoard.appendChild(card);
        });
    }
    
    // Shuffle cards using Fisher-Yates algorithm
    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }
    
    // Handle card flip
    function flipCard() {
        if (lockBoard) return;
        if (!isPlaying) {
            startGame();
        }
        
        const selectedCard = this;
        
        // Prevent clicking the same card
        if (selectedCard === firstCard) return;
        
        selectedCard.classList.add('flipped');
        
        if (!firstCard) {
            // First card selected
            firstCard = selectedCard;
            return;
        }
        
        // Second card selected
        secondCard = selectedCard;
        moves++;
        updateMovesText();
        
        checkForMatch();
    }
    
    // Check if the two flipped cards match
    function checkForMatch() {
        const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            
            // Show match notification
            showMatchNotification(firstCard.dataset.symbol);
            
            // Check if all pairs are matched
            if (matchedPairs === totalPairs) {
                endGame();
            }
        } else {
            unflipCards();
        }
    }
    
    // Show match notification
    function showMatchNotification(symbol) {
        // Update notification text with the matched symbol
        matchNotification.textContent = `Match Found: ${symbol}`;
        
        // Remove any existing animation class
        matchNotification.classList.remove('active');
        
        // Trigger reflow to restart animation
        void matchNotification.offsetWidth;
        
        // Add animation class
        matchNotification.classList.add('active');
        
        // Remove class after animation completes
        setTimeout(() => {
            matchNotification.classList.remove('active');
        }, 1500);
    }
    
    // Disable matched cards
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }
    
    // Unflip non-matching cards
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1000);
    }
    
    // Reset board after each turn
    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }
    
    // Start the game timer
    function startGame() {
        isPlaying = true;
        
        timer = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            updateTimeText();
        }, 1000);
    }
    
    // End the game
    function endGame() {
        clearInterval(timer);
        
        // Calculate score - lower moves and time is better
        const totalTime = minutes * 60 + seconds;
        // Base score is 10000, minus penalties for moves and time
        currentScore = Math.max(10000 - (moves * 50) - (totalTime * 10), 1000);
        
        // Apply difficulty multiplier
        if (difficulty === 'medium') {
            currentScore = Math.round(currentScore * 1.5);
        } else if (difficulty === 'hard') {
            currentScore = Math.round(currentScore * 2);
        }
        
        setTimeout(() => {
            resultTimeElement.textContent = timeElement.textContent;
            resultMovesElement.textContent = moves;
            document.getElementById('result-score').textContent = currentScore;
            resultElement.classList.add('active');
            
            // Show confetti
            startConfetti();
            setTimeout(stopConfetti, 5000);
        }, 500);
    }
    
    // Update moves text
    function updateMovesText() {
        movesCount.textContent = moves;
    }
    
    // Update time text
    function updateTimeText() {
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        timeElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
    }
    
    // High Score System
    function saveHighScore() {
        const playerName = playerNameInput.value.trim() || 'Anonymous';
        
        // Get existing high scores from local storage
        let highScores = JSON.parse(localStorage.getItem('memoryGameHighScores')) || [];
        
        // Add new score
        const newScore = {
            name: playerName,
            score: currentScore,
            moves: moves,
            time: `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`,
            difficulty: difficulty,
            date: new Date().toLocaleDateString()
        };
        
        highScores.push(newScore);
        
        // Sort by score (highest first)
        highScores.sort((a, b) => b.score - a.score);
        
        // Keep only top 10 scores
        highScores = highScores.slice(0, 10);
        
        // Save back to local storage
        localStorage.setItem('memoryGameHighScores', JSON.stringify(highScores));
        
        // Update high scores display
        displayHighScores();
        
        // Hide result panel and show high scores
        resultElement.classList.remove('active');
        highScoresPanel.classList.add('active');
    }
    
    // Display high scores
    function displayHighScores() {
        // Get high scores from local storage
        const highScores = JSON.parse(localStorage.getItem('memoryGameHighScores')) || [];
        
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
            <span class="score-moves">Moves</span>
            <span class="score-time">Time</span>
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
                <span class="score-moves">${score.moves}</span>
                <span class="score-time">${score.time}</span>
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
    function resizeCanvas() {
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
        resizeCanvas();
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
    window.addEventListener('resize', resizeCanvas);
    
    startBtn.addEventListener('click', () => {
        initGame();
        startGame();
    });
    
    restartBtn.addEventListener('click', () => {
        initGame();
    });
    
    playAgainBtn.addEventListener('click', () => {
        resultElement.classList.remove('active');
        initGame();
    });
    
    saveScoreBtn.addEventListener('click', () => {
        saveHighScore();
    });
    
    showHighScoresBtn.addEventListener('click', () => {
        displayHighScores();
        resultElement.classList.remove('active');
        highScoresPanel.classList.add('active');
    });
    
    closeHighScoresBtn.addEventListener('click', () => {
        highScoresPanel.classList.remove('active');
    });
    
    // New high scores button
    viewHighScoresBtn.addEventListener('click', () => {
        displayHighScores();
        highScoresPanel.classList.add('active');
    });
    
    // Difficulty buttons
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            difficultyBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Set grid size and difficulty
            gridSize = parseInt(btn.dataset.grid);
            difficulty = btn.dataset.difficulty;
            
            // Reinitialize game
            initGame();
        });
    });
    
    // Initialize the game on load
    initGame();
    displayHighScores();
});