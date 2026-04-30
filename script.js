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
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
