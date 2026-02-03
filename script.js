const yesBtn = document.getElementById("btn1");
const noBtn = document.getElementById("btn2");

yesBtn.style.position = "absolute";
noBtn.style.position = "absolute";

// --- 初期配置（左右バランスを完全に揃える） ---
const baseX = window.innerWidth * 0.30; // ← 全体を左寄せに
const baseY = window.innerHeight * 0.55;

let yesX = baseX - yesBtn.offsetWidth / 2;
let yesY = baseY;

let noX = baseX + 250 - noBtn.offsetWidth / 2; // ← YES から 250px 右へ
let noY = baseY;

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
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const dx = (noX + centerX) - mouseX;
  const dy = (noY + centerY) - mouseY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < triggerDist) {
    const speed = Math.min(200 / dist, 6);
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
    const offset = 250;
    noX = mouseX < w / 2 ? mouseX + offset : mouseX - offset;
    noY = mouseY < h / 2 ? mouseY + offset : mouseY - offset;
  }

  noBtn.style.left = `${noX}px`;
  noBtn.style.top = `${noY}px`;
}
