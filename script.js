const yesBtn = document.getElementById("btn1");
const noBtn = document.getElementById("btn2");

yesBtn.style.position = "absolute";
noBtn.style.position = "absolute";

let yesX, yesY, noX, noY;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

const triggerDist = 100; // 2.5cm
let yesActivated = false;

const yesCenterOffsetX = 40;
const yesCenterOffsetY = 0;

// ----------------------
// 初期配置（読み込み後に実行）
// ----------------------
window.onload = () => {
  const baseX = window.innerWidth * 0.25; // 左寄せ
  const baseY = window.innerHeight * 0.55;

  // YES
  yesX = baseX - yesBtn.offsetWidth / 2;
  yesY = baseY;

  // NO（YES から 300px 右）
  noX = baseX + 300 - noBtn.offsetWidth / 2;
  noY = baseY;

  yesBtn.style.left = yesX + "px";
  yesBtn.style.top = yesY + "px";
  noBtn.style.left = noX + "px";
  noBtn.style.top = noY + "px";
};

// ----------------------
// マウス位置更新
// ----------------------
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// ----------------------
// 毎フレーム更新
// ----------------------
function animate() {
  moveYes();
  moveNo();
  requestAnimationFrame(animate);
}
animate();

// ----------------------
// YES ボタン
// ----------------------
function moveYes() {
  const rect = yesBtn.getBoundingClientRect();

  const centerX = rect.width / 2 + yesCenterOffsetX;
  const centerY = rect.height / 2 + yesCenterOffsetY;

  const dx = mouseX - (yesX + centerX);
  const dy = mouseY - (yesY + centerY);
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < triggerDist) yesActivated = true;

  if (yesActivated) {
    const speed = 0.15;
    yesX += dx * speed;
    yesY += dy * speed;
  }

  yesBtn.style.left = yesX + "px";
  yesBtn.style.top = yesY + "px";
}

// ----------------------
// NO ボタン
// ----------------------
function moveNo() {
  const rect = noBtn.getBoundingClientRect();

  // rect 基準で中心を計算（誤判定ゼロ）
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = centerX - mouseX;
  const dy = centerY - mouseY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // 2.5cm以内で逃げる（逃げ距離短め）
  if (dist < triggerDist) {
    const speed = Math.min(120 / dist, 3);
    noX += dx * speed;
    noY += dy * speed;
  }

  const w = window.innerWidth;
  const h = window.innerHeight;
  const margin = 20;

  if (
    noX < margin ||
    noX > w - margin ||
    noY < margin ||
    noY > h - margin
  ) {
    const offset = 200;
    noX = mouseX < w / 2 ? mouseX + offset : mouseX - offset;
    noY = mouseY < h / 2 ? mouseY + offset : mouseY - offset;
  }

  noBtn.style.left = noX + "px";
  noBtn.style.top = noY + "px";
}
