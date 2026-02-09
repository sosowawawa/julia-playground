// ===============================
// 🎈 yesView：ハート風船アニメーション
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
    ctx.fillStyle = "pink";

    const s = this.size;
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

// ページを開いている間ずっと湧き続ける
setInterval(() => {
  for (let i = 0; i < 3; i++) {
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