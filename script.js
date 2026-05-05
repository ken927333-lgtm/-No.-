const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// プレイヤーの状態（位置とサイズ）
const player = {
  x: 240, // 横位置（中央）
  y: 320, // 縦位置（下の方）
  w: 32, // 幅
  h: 20, // 高さ
  speed: 4,
};

const bullets = [];
let shootCooldown = 0;

const enemies = [];
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 8; col++) {
    enemies.push({
      x: 60 + col * 48,
      y: 40 + row * 36,
      w: 28,
      h: 20,
      alive: true,
    });
  }
}

let enemyDir = 1;
let enemyMoveDown = false;

let score = 0;
let lives = 3;
let gameStart = `playing`;

const scoreEl = document.getElementById("scoreVal");
const livesEl = document.getElementById("livesVal");

const keys = {};
document.addEventListener(`keydown`, (e) => (keys[e.key] = true));
document.addEventListener(`keyup`, (e) => (keys[e.key] = false));

function update() {
  if (gameStart !== "playing") return;

  if (keys[`ArrowLeft`]) player.x -= player.speed;
  if (keys[`ArrowRight`]) player.x += player.speed;

  player.x = Math.max(player.w / 2, player.x);
  player.x = Math.min(480 - player.w / 2, player.x);

  if (keys[` `] && shootCooldown <= 0) {
    bullets.push({
      x: player.x,
      y: player.y - player.h / 2,
      speed: 7,
    });
    shootCooldown = 12;
  }
  if (shootCooldown > 0) shootCooldown--;

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }

  const alive = enemies.filter((e) => e.alive);

  if (alive.length === 0) {
    gameStart = `clear`;
    return;
  }

  const hitWall = alive.some((e) => e.x < 20 || e.x > 460);
  if (hitWall) {
    enemyDir *= -1; /*値を反転させている (例 8 × -1 = -8)*/
    enemyMoveDown = true;
  }

  alive.forEach((e) => {
    e.x += enemyDir * 0.8;
    if (enemyMoveDown) e.y += 12;
  });
  if (enemyMoveDown) enemyMoveDown = false;

  if (alive.some((e) => e.y > 300)) {
    gameStart = `over`;
    return;
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      const b = bullets[i];
      const e = enemies[j];

      if (!e.alive)
        continue; /*returnとは異なり処理を一回だけとばす。returnは関数ごと止めて外へ出す*/

      const dx = Math.abs(b.x - e.x);
      const dy = Math.abs(b.y - e.y);

      if (dx < 14 && dy < 14) {
        e.alive = false;
        bullets.splice(i, 1);

        score += 10;
        scoreEl.textContent = score;
        break; /*消えた球をループで触り続けないようにするため*/
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, 480, 360);

  ctx.fillStyle = `#4af`;
  ctx.beginPath();
  ctx.moveTo(player.x, player.y - player.h / 2);
  ctx.lineTo(player.x + player.w / 2, player.y + player.h / 2);
  ctx.lineTo(player.x - player.w / 2, player.y + player.h / 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ff0";
  for (const b of bullets) {
    ctx.fillRect(b.x - 2, b.y - 8, 4, 10);
  }

  enemies.forEach((e) => {
    if (!e.alive) return;
    ctx.fillStyle = `#f55`;
    ctx.beginPath();
    ctx.arc(e.x, e.y, 12, 0, Math.PI * 2);
    ctx.fill();
  });

  if (gameStart === `over` || gameStart === `clear`) {
    ctx.fillStyle = `rgba(0, 0, 0, 0.6)`;
    ctx.fillRect(0, 0, 480, 360);

    ctx.textAlign = "center";
    ctx.fillStyle = gameStart === `clear` ? `#5f5` : `#f55`;
    ctx.fillText(gameStart === `clear` ? `クリア` : `ゲームオーバー`, 240, 160);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
