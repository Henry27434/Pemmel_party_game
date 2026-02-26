// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// player
var startButton = document.getElementById('startButton');
startButton.addEventListener('click', function() {
    startButton.style.display = 'none'; // Hide the button after starting the game
    gameLoop(); // Start the game loop
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
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    moveLogs();  // Move the logs
    
    drawLogs();
    drawPlayer(player);
    drawPlayer(player2);
    if (speed < 6.5) {
        speed += .001;
    }
    if (logInterval >= 500) {
        spawnLog();
        logInterval = 0; // Reset the interval
    } else {
        logInterval += speed; // Approximate time for one frame at 60fps
    }
    
    // Check for collisions with logs
    if (--player.invincibleFrames <= 0) {
        player.color = "blue";
        for (let i = 0; i < logs.length; i++) {
            if (checkCollision(player, logs[i])) {
                player.color = "red";
                player.lives--;
                player.invincibleFrames = 60; // 1 seconds of invincibility at 60fps
                player1Score -= 1000;
                break;
            }
        }
    }
    player1Score += 1; // Increment score for surviving
    drawplayer1Score();
    drawLives();
    if (player.lives <= 0) {
        alert('Player 1 loses!');
        document.location.reload();
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