const yesBtn = document.getElementById("btn1");
const noBtn = document.getElementById("btn2");

yesBtn.style.position = "absolute";
noBtn.style.position = "absolute";

// 初期配置（ズレてもOK。動作には影響しない）
let yesX = window.innerWidth * 0.25;
let yesY = window.innerHeight * 0.55;

let noX = yesX + 300;
let noY = yesY;

yesBtn.style.left = yesX + "px";
yesBtn.style.top = yesY + "px";
noBtn.style.left = noX + "px";
noBtn.style.top = noY + "px";

// 2.5cm ≒ 100px
const triggerDist = 100;

// ★ 起動フラグ（最初は false）
let yesActive = false;
let noActive = false;

let mouseX = 0;
let mouseY = 0;

// マウス位置だけ更新
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  checkActivation();
});

// ★ 2.5cm以内に入ったら初めて起動
function checkActivation() {
  const yesRect = yesBtn.getBoundingClientRect();
  const yesCenterX = yesRect.left + yesRect.width / 2;
  const yesCenterY = yesRect.top + yesRect.height / 2;

  const noRect = noBtn.getBoundingClientRect();
  const noCenterX = noRect.left + noRect.width / 2;
  const noCenterY = noRect.top + noRect.height / 2;

  const distYes = Math.hypot(mouseX - yesCenterX, mouseY - yesCenterY);
  const distNo = Math.hypot(mouseX - noCenterX, mouseY - noCenterY);

  if (distYes < triggerDist) yesActive = true;
  if (distNo < triggerDist) noActive = true;
}

// 毎フレーム動かす
function animate() {
  if (yesActive) moveYes();
  if (noActive) moveNo();
  requestAnimationFrame(animate);
}
animate();

// ----------------------
// YES ボタンの動作
// ----------------------
function moveYes() {
  const rect = yesBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2 + 40; // 補正
  const centerY = rect.top + rect.height / 2;

  const dx = mouseX - centerX;
  const dy = mouseY - centerY;

  yesX += dx * 0.15;
  yesY += dy * 0.15;

  yesBtn.style.left = yesX + "px";
  yesBtn.style.top = yesY + "px";
}

// ----------------------
// NO ボタンの動作
// ----------------------
function moveNo() {
  const rect = noBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = centerX - mouseX;
  const dy = centerY - mouseY;
  const dist = Math.hypot(dx, dy);

  if (dist < triggerDist) {
    const speed = Math.min(120 / dist, 3);
    noX += dx * speed;
    noY += dy * speed;
  }

  noBtn.style.left = noX + "px";
  noBtn.style.top = noY + "px";
}
