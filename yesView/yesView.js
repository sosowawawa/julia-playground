// ===============================
// 🎈 yesView：ハート風船アニメーション（改良版）
// ===============================

// Canvas を動的に追加
const heartCanvas = document.createElement("canvas");
heartCanvas.id = "heartCanvas";
heartCanvas.style.position = "fixed";
heartCanvas.style.top = "0";
heartCanvas.style.left = "0";
heartCanvas.style.pointerEvents = "none";
heartCanvas.style.zIndex = "9999";
document.body.appendChild(heartCanvas);

const ctx = heartCanvas.getContext("2d");

// 画面サイズに合わせる
function resizeCanvas() {
  heartCanvas.width = window.innerWidth;
  heartCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ハートクラス
class Heart {
  constructor() {
    this.x = Math.random() * heartCanvas.width;
    this.y = heartCanvas.height + 50;
    this.size = 10 + Math.random() * 40;
    this.speed = 0.5 + Math.random() * 1.5;
    this.alpha = 0.6 + Math.random() * 0.4;
    this.swing = Math.random() * 2;
    this.angle = Math.random() * Math.PI * 2;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;

    const s = this.size;

    // 🎈 風船っぽい光沢グラデーション
    const grad = ctx.createRadialGradient(
      this.x - s * 0.3, this.y - s * 0.3, s * 0.1,
      this.x, this.y, s
    );
    grad.addColorStop(0, "#ff9ab3"); // ハイライト
    grad.addColorStop(1, "#ff6b8b"); // 赤みのあるピンク（ベース）

    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.bezierCurveTo(this.x - s, this.y - s, this.x - s, this.y + s, this.x, this.y + s);
    ctx.bezierCurveTo(this.x + s, this.y + s, this.x + s, this.y - s, this.x, this.y);
    ctx.fill();

    ctx.restore();
  }

  update() {
    this.y -= this.speed;
    this.angle += 0.02;
    this.x += Math.sin(this.angle) * this.swing;
    return this.y > -100;
  }
}

let hearts = [];

// 🎈 ハートの量を 2/3 に（3 → 2）
setInterval(() => {
  for (let i = 0; i < 1; i++) {
    hearts.push(new Heart());
  }
}, 100);

// アニメーションループ
function animateHearts() {
  ctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);

  hearts = hearts.filter(h => {
    const alive = h.update();
    h.draw();
    return alive;
  });

  requestAnimationFrame(animateHearts);
}
animateHearts();