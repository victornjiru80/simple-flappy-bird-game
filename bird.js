

document.addEventListener('DOMContentLoaded', () => {
    const bird = document.getElementById('bird');
    const gameArea = document.getElementById('gameArea');
    const scoreDisplay = document.getElementById('score');
    const restartBtn = document.getElementById('restartBtn');
    let birdY = gameArea.clientHeight / 2;
    let birdVelocity = 0;
    const gravity = 0.6;
    let gameSpeed = 3;
    let score = 0;
    let gameInterval;
    let pipeInterval;

    // Function to start the game
    function startGame() {
        score = 0;
        scoreDisplay.textContent = 'Score: 0';
        birdY = gameArea.clientHeight / 2;
        birdVelocity = 0;
        bird.style.top = `${birdY}px`;
        createPipe();

        pipeInterval = setInterval(() => {
            createPipe();
        }, 2000);

        // Game loop
        gameInterval = setInterval(() => {
            birdVelocity += gravity;
            birdY += birdVelocity;
            bird.style.top = `${birdY}px`;

            // Check if bird hits the ground or ceiling
            if (birdY > gameArea.clientHeight - bird.clientHeight || birdY < 0) {
                endGame();
            }
        }, 20);
    }

    // Function to create a pipe
    function createPipe() {
        const pipeGap = 150;
        const pipeWidth = 60;
        const pipeTopHeight = Math.floor(Math.random() * (gameArea.clientHeight - pipeGap));

        // Create top pipe
        const pipeTop = document.createElement('div');
        pipeTop.classList.add('pipe');
        pipeTop.style.height = `${pipeTopHeight}px`;
        pipeTop.style.left = `${gameArea.clientWidth}px`;
        gameArea.appendChild(pipeTop);

        // Create bottom pipe
        const pipeBottom = document.createElement('div');
        pipeBottom.classList.add('pipe', 'bottom');
        pipeBottom.style.height = `${gameArea.clientHeight - pipeTopHeight - pipeGap}px`;
        pipeBottom.style.left = `${gameArea.clientWidth}px`;
        gameArea.appendChild(pipeBottom);

        // Move pipes
        const movePipe = setInterval(() => {
            const pipeLeft = parseInt(pipeTop.style.left);
            pipeTop.style.left = `${pipeLeft - gameSpeed}px`;
            pipeBottom.style.left = `${pipeLeft - gameSpeed}px`;

            // Remove pipes when off screen
            if (pipeLeft < -pipeWidth) {
                pipeTop.remove();
                pipeBottom.remove();
                clearInterval(movePipe);
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
            }

            // Check for collisions
            if (detectCollision(pipeTop) || detectCollision(pipeBottom)) {
                endGame();
            }
        }, 20);
    }

    // Function to detect collision
    function detectCollision(pipe) {
        const birdRect = bird.getBoundingClientRect();
        const pipeRect = pipe.getBoundingClientRect();

        return !(
            birdRect.top > pipeRect.bottom ||
            birdRect.bottom < pipeRect.top ||
            birdRect.right < pipeRect.left ||
            birdRect.left > pipeRect.right
        );
    }

    // Function to end the game
    function endGame() {
        clearInterval(gameInterval);
        clearInterval(pipeInterval);
        restartBtn.style.display = 'block'; // Show the restart button
    }

    // Function to restart the game
    window.restartGame = function() {
        const pipes = document.querySelectorAll('.pipe');
        pipes.forEach(pipe => pipe.remove());
        restartBtn.style.display = 'none'; // Hide the restart button
        startGame();
    }

    // Make the bird fly on click or touch
    document.addEventListener('click', () => {
        birdVelocity = -8;
    });

    document.addEventListener('touchstart', () => {
        birdVelocity = -8;
    });

    startGame();
});
