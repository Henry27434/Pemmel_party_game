// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// player

// Game state management
let gameState = 'menu'; // Can be: 'menu', 'playing', 'gameover'

var startButton = document.getElementById('startButton');
var menuContainer = document.getElementById('menuContainer');
var menuGif = document.getElementById('menuGif');
var gameOverContainer = document.getElementById('gameOverContainer');
var tryAgainButton = document.getElementById('tryAgainButton');

function resetGame() {
    // Clear all logs
    logs.length = 0;
    
    // Reset player
    player.lives = 5;
    player.y = 350;
    player.lane = 1;
    player.invincibleFrames = 0;
    player.color = 'blue';
    
    // Reset player 2
    player2.lives = 5;
    player2.y = 300;
    player2.lane = 0;
    player2.invincibleFrames = 0;
    player2.color = 'red';
    
    // Reset game variables
    player1Score = 0;
    speed = 2;
    logInterval = 0;
}

// Start button handler
startButton.addEventListener('click', function() {
    startButton.classList.add('hidden');
    menuGif.classList.add('falling');
    
    setTimeout(function() {
        menuContainer.classList.add('hidden');
        gameState = 'playing'; // Set game state
        gameLoop();
    }, 1500);
});

// Try Again button handler (NEW)
tryAgainButton.addEventListener('click', function() {
    // Hide game over screen
    gameOverContainer.classList.add('hidden');
    
    // Reset game state
    resetGame();
    
    // Start playing again
    gameState = 'playing';
    gameLoop();
});
var player1Score = 0;
var lives = 5;
var speed = 2;
const logs = []; // Will store all active logs
const player = {
    x: 100,
    y: 350,
    width: 100,
    height: 100,
    color: 'blue',
    lane: 1,
    invincibleFrames: 0,
    lives: lives
};

function drawPlayer(playerObj) {
    ctx.fillStyle = playerObj.color;
    ctx.fillRect(playerObj.x, playerObj.y, playerObj.width, playerObj.height);
}

drawPlayer(player);

// player 2
const player2 = {
    x: 300,
    y: 300,
    width: 100,
    height: 100,
    color: 'red',
    lane: 0,
    invincibleFrames: 0,
    lives: lives
};

drawPlayer(player2);  // Draws player 
var logInterval = 0; // Time in milliseconds between log spawns
//actual game

function drawLives() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Player 1 Lives: ' + player.lives, 10, 20);
    ctx.fillText('Player 2 Lives: ' + player2.lives, 10, 50);
}


function drawplayer1Score() {
    ctx.fillStyle = 'blue';
    ctx.font = '20px Arial';
    ctx.fillText('Player 1 Score: ' + player1Score, 10, 80);
}


function gameLoop() {
    // IMPORTANT: Only run if playing
    if (gameState !== 'playing') return;
    
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    moveLogs();
    drawLogs();
    drawPlayer(player);
    drawPlayer(player2);
    
    if (speed < 6.5) {
        speed += .001;
    }
    if (logInterval >= 500) {
        spawnLog();
        logInterval = 0;
    } else {
        logInterval += speed;
    }
    
    // Check collisions
    if (--player.invincibleFrames <= 0) {
        player.color = "blue";
        for (let i = 0; i < logs.length; i++) {
            if (checkCollision(player, logs[i])) {
                player.color = "red";
                player.lives--;
                player.invincibleFrames = 60;
                player1Score -= 1000;
                break;
            }
        }
    }
    
    player1Score += 1;
    drawplayer1Score();
    drawLives();
    
    // Check for game over (MODIFIED)
    if (player.lives <= 0) {
        gameState = 'gameover'; // Stop the game loop
        gameOverContainer.classList.remove('hidden'); // Show game over screen
        return; // Exit game loop
    }
    
    requestAnimationFrame(gameLoop);
}


function spawnLog() {
    const fromTop = Math.random() < 0.5; // Randomly choose top or bottom
    const log = {
        x: canvas.width,
        y: fromTop ? 200 : 400,  // What y values for top vs bottom lane?
        width: 25,
        height: 50,
        speed: speed,
        fromTop: fromTop,
        color: 'brown'
    };
    logs.push(log); // Add to the array
}

function drawLogs() {
    for (let i = 0; i < logs.length; i++) {
        ctx.fillStyle = logs[i].color;
        ctx.fillRect(logs[i].x, logs[i].y, logs[i].width, logs[i].height);
    }
}

function moveLogs() {
    for (let i = 0; i < logs.length; i++) {
        logs[i].x -= logs[i].speed;  // Move left (subtract speed from x)
    }
}

document.addEventListener('keydown', function(event) {
    console.log('Key pressed:', event.key);
    if (event.key === 'ArrowUp') {
        if (player.lane > 0) {
            player.lane--;
            player.y -= 200; // Move up one lane
        }       
    } else if (event.key === 'ArrowDown') {
        if (player.lane < 1) {
            player.lane++;
            player.y += 200; // Move down one lane
        }
    } //very good code for player 1 movement
});

function checkCollision(playerObj, log) {
    return (
        playerObj.x < log.x + log.width &&
        playerObj.x + playerObj.width > log.x &&
        playerObj.y < log.y + log.height &&
        playerObj.y + playerObj.height > log.y
    );
}

