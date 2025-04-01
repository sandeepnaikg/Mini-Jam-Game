const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const BASE_PLAYER_SPEED = 6;
const JUMP_FORCE = -25;
const GRAVITY = 2.1;
const BULLET_SPEED = 10;

let playerHealth = 100;
let level = 1;
let monstersKilled = 0;
let gameOver = false;
let bullets = [];
let monsters = [];
let maxBullets = 8;
let bulletReloading = false;
let reloadTime = 180;
let bulletsFired = 0;
let batchReloading = false;

const BATCH_SIZE = 5;
const NORMAL_RELOAD_TIME = 200;
const BATCH_RELOAD_TIME = 1250;

let keys = {};


const player = {
    x: 300,
    y: canvas.height * 0.76 - 110, 
    width: 110,
    height: 110,
    velocityY: 0,
    jumping: false,
    facing: "right",
    image: new Image(),
};

// Load assets
player.image.src = "Assets/player 1.png"; // Player image
const monsterImage = new Image();
monsterImage.src = "Assets/blue-monster.png"; // Monster image

// Constants for monster 
const MONSTER_STOP_Y = canvas.height * 0.76 - 60; // Y position where monsters stop falling

function spawnMonster() {
    const spawnX = Math.random() * (canvas.width - 50); // Spawn randomly on X-axis

    const monster = {
        x: spawnX,
        y: 0, 
        width: 50,
        height: 50,
        speed: 2.8, 
        attacking: false, 
    };

    monsters.push(monster);
}

function shootBullet() {
    if (bulletReloading || batchReloading || bullets.length >= maxBullets) return;

    const bullet = {
        x: player.facing === "right" ? player.x + player.width : player.x,
        y: player.y + player.height / 2 - 5,
        width: 20,
        height: 10,
        direction: player.facing === "right" ? 1 : -1,
    };

    bullets.push(bullet);
    bulletsFired++;

    if (bulletsFired % BATCH_SIZE === 0) {
        batchReloading = true;
        setTimeout(() => {
            batchReloading = false;
        }, BATCH_RELOAD_TIME);
    } else {
        bulletReloading = true;
        setTimeout(() => {
            bulletReloading = false;
        }, NORMAL_RELOAD_TIME);
    }
}

function reloadBullets() {
    if (bullets.length < maxBullets) {
        const bulletsToReload = maxBullets - bullets.length;
        for (let i = 0; i < bulletsToReload; i++) {
            shootBullet();  
        }
    }
}

function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.x += bullet.direction * BULLET_SPEED;

        // Remove bullets that go off-screen
        if (bullet.x < 0 || bullet.x > canvas.width) {
            bullets.splice(index, 1);
        }

        // Check collision with monsters
        monsters.forEach((monster, monsterIndex) => {
            if (
                bullet.x < monster.x + monster.width &&
                bullet.x + bullet.width > monster.x &&
                bullet.y < monster.y + monster.height &&
                bullet.y + bullet.height > monster.y
            ) {
                bullets.splice(index, 1); // Remove bullet
                monsters.splice(monsterIndex, 1); // Remove monster
                monstersKilled++;
            }
        });
    });
}

function updateMonsters() {
    monsters.forEach((monster, index) => {
        if (!monster.attacking) {
            monster.y += monster.speed;
            if (monster.y >= MONSTER_STOP_Y) {
                monster.attacking = true;
            }
        }

        if (monster.attacking) {
            if (monster.x < player.x) {
                monster.x += monster.speed;
            } else if (monster.x > player.x) {
                monster.x -= monster.speed;
            }
        }

        // Check collision with the player
        if (
            player.x < monster.x + monster.width &&
            player.x + player.width > monster.x &&
            player.y < monster.y + monster.height &&
            player.y + player.height > monster.y
        ) {
            monsters.splice(index, 1);
            playerHealth -= 5;
            if (playerHealth <= 0) gameOver = true;
        }

        if (monster.x < -monster.width || monster.x > canvas.width + monster.width || monster.y > canvas.height) {
            monsters.splice(index, 1);
        }
    });
}

function drawPlayer() {
    ctx.save();
    if (player.facing === "left") {
        ctx.scale(-1, 1);
        ctx.drawImage(player.image, -player.x - player.width, player.y, player.width, player.height);
    } else {
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    }
    ctx.restore();
}

function drawBullets() {
    bullets.forEach((bullet) => {
        ctx.fillStyle = "red";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawMonsters() {
    monsters.forEach((monster) => {
        ctx.drawImage(monsterImage, monster.x, monster.y, monster.width, monster.height);
    });
}

// Redirect to the win page after killing 100 monsters
function checkWin() {
    if (monstersKilled >= 100) {
        window.location.href = '/win'; // Redirect to the win page
    }
}

function gameloop() {
    if (gameOver) {
        alert("Game Over! Try Again.");
        document.location.reload();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() * 100 < 1.5) spawnMonster();
    updateBullets();
    updateMonsters();

    if (player.jumping) {
        player.velocityY += GRAVITY;
    }
    player.y += player.velocityY;

    if (player.y > canvas.height * 0.76 - 110) {
        player.y = canvas.height * 0.76 - 110;
        player.velocityY = 0;
        player.jumping = false;
    }

    let movementSpeed = BASE_PLAYER_SPEED;

    if (player.jumping) {
        movementSpeed *= 2;
    }

    if (keys["ArrowLeft"] || keys["a"]) {
        if (player.x > 40) { 
            player.x -= movementSpeed;
            player.facing = "left";
        }
    }

    if (keys["ArrowRight"] || keys["d"]) {
        if (player.x < canvas.width - player.width - 100) { 
            player.x += movementSpeed;
            player.facing = "right";
        }
    }

    if ((keys["ArrowUp"] || keys["w"]) && !player.jumping) {
        player.velocityY = JUMP_FORCE;
        player.jumping = true;
    }

    drawPlayer();
    drawBullets();
    drawMonsters();

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Health: ${playerHealth}`, 20, 30);
    ctx.fillText(`Monsters Killed: ${monstersKilled}`, 20, 60);

    checkWin(); 

    requestAnimationFrame(gameloop);
}


document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === " " || e.key === "z") shootBullet();
    if (e.key === "r" || e.key === "R") reloadBullets(); 
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

const backgroundImage = new Image();
backgroundImage.src = 'Assets/bg3.png';
backgroundImage.onload = () => {
    
     document.body.style.backgroundImage = `url(${backgroundImage.src})`;
     document.body.style.backgroundSize = "cover";  
     document.body.style.backgroundPosition = "center"; 
     document.body.style.backgroundRepeat = "no-repeat";  
 
     document.body.style.height = "100vh";
     document.body.style.margin = "0";  

    gameloop();
};
