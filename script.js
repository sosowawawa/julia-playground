const yesBtn = document.getElementById("btn1");
const noBtn = document.getElementById("btn2");

yesBtn.style.position = "absolute";
noBtn.style.position = "absolute";

// --- 初期配置（左右バランスを完全に揃える & 左寄せ） ---
// 基準点（ここを動かせば全体が左右に動く）
const baseX = window.innerWidth * 0.22; // ← 左寄せの強さ
const baseY = window.innerHeight * 0.55;

// YES の初期位置（基準点）
let yesX = baseX - yesBtn.offsetWidth / 2;
let yesY = baseY;

// NO の初期位置（YES から 300px 右へ）
let noX = baseX + 300 - noBtn.offsetWidth / 2;
let noY = baseY;

// 初期配置を反映
yesBtn.style.left = yesX + "px";
yesBtn.style.top = yesY + "px";
noBtn.style.left = noX + "px";
noBtn.style.top = noY + "px";

// --- 設定 ---
const triggerDist = 100; // 2.5cm
let yesActivated = false;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// YES の中心補正（1cm右へ）
const yesCenterOffsetX = 40;
const yesCenterOffsetY = 0;

// --- マウス位置だけ更新 ---
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// --- 毎フレーム動かす ---
function animate() {
  moveYes();
  moveNo();
  requestAnimationFrame(animate);
}
animate();

// --- YES ボタン ---
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

  yesBtn.style.left = `${yesX}px`;
  yesBtn.style.top = `${yesY}px`;
}

// --- NO ボタン ---
function moveNo() {
  const rect = noBtn.getBoundingClientRect();

  // rect.left/top を基準に中心を計算（ズレ防止）
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = centerX - mouseX;
  const dy = centerY - mouseY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // 2.5cm以内で逃げる（逃げ距離は短め）
  if (dist < triggerDist) {
    const speed = Math.min(120 / dist, 3);
    noX += dx * speed;
    noY += dy * speed;
  }

  const w = window.innerWidth;
  const h = window.innerHeight;
  const margin = 20;

  // 端に追い込まれたらワープ
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

  noBtn.style.left = `${noX}px`;
  noBtn.style.top = `${noY}px`;
}
