const yesBtn = document.getElementById("btn1");
const noBtn = document.getElementById("btn2");

yesBtn.style.position = "absolute";
noBtn.style.position = "absolute";

// --- 初期位置（左寄せ & 間隔広め） ---
let yesX = window.innerWidth * 0.35 - yesBtn.offsetWidth / 2;
let yesY = window.innerHeight * 0.55;

let noX = window.innerWidth * 0.35 - noBtn.offsetWidth / 2 + 250; // ← 間隔を広げた
let noY = window.innerHeight * 0.55;

yesBtn.style.left = yesX + "px";
yesBtn.style.top = yesY + "px";
noBtn.style.left = noX + "px";
noBtn.style.top = noY + "px";

// --- 設定 ---
const triggerDist = 100; // 2.5cm ≒ 100px
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

  // 2.5cm以内で起動
  if (dist < triggerDist) yesActivated = true;

  // 起動後はずっと追跡
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

  // 2.5cm以内で逃げる
  if (dist < triggerDist) {
    const speed = Math.min(200 / dist, 6);
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
    const offset = 250;
    noX = mouseX < w / 2 ? mouseX + offset : mouseX - offset;
    noY = mouseY < h / 2 ? mouseY + offset : mouseY - offset;
  }

  noBtn.style.left = `${noX}px`;
  noBtn.style.top = `${noY}px`;
}
