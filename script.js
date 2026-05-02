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
let enemyMmoveDown = false;

const keys = {};
document.addEventListener(`keydown`, (e) => (keys[e.key] = true));
document.addEventListener(`keyup`, (e) => (keys[e.key] = false));

function update() {
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

  const hitWall = alive.some((e) => e.x < 20 || e.x > 460);
  if (hitWall) {
    enemyDir *= -1; /*値を反転させている (例 8 × -1 = -8)*/
    enemyMmoveDown = true;
  }

  alive.forEach((e) => {
    e.x += enemyDir * 0.8;
    if (enemyMmoveDown) e.y += 12;
  });
  if (enemyMmoveDown) enemyMmoveDown = false;
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
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
