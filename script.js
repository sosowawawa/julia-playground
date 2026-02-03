const yesBtn = document.getElementById("btn1");
const noBtn = document.getElementById("btn2");

yesBtn.style.position = "absolute";
noBtn.style.position = "absolute";

// 初期位置
let yesX = window.innerWidth / 2;
let yesY = window.innerHeight * 0.6;

let noX = window.innerWidth / 2 + 150;
let noY = window.innerHeight * 0.6;

yesBtn.style.left = yesX + "px";
yesBtn.style.top = yesY + "px";
noBtn.style.left = noX + "px";
noBtn.style.top = noY + "px";

// 2cm ≒ 80px
const triggerDist = 80;

// YES の中心補正（1cm右へ）
const yesCenterOffsetX = 40; // ← ここがズレ修正の本体
const yesCenterOffsetY = 0;

document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  moveYes(mouseX, mouseY);
  moveNo(mouseX, mouseY);
});

function moveYes(mouseX, mouseY) {
  const rect = yesBtn.getBoundingClientRect();

  // ボタン中心 + 補正
  const centerX = rect.width / 2 + yesCenterOffsetX;
  const centerY = rect.height / 2 + yesCenterOffsetY;

  const dx = mouseX - (yesX + centerX);
  const dy = mouseY - (yesY + centerY);
  const dist = Math.sqrt(dx * dx + dy * dy);

  // 2cm以内で吸引開始
  if (dist < triggerDist) {
    const speed = 0.15;
    yesX += dx * speed;
    yesY += dy * speed;
  }

  yesBtn.style.left = `${yesX}px`;
  yesBtn.style.top = `${yesY}px`;
}

function moveNo(mouseX, mouseY) {
  const rect = noBtn.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const dx = (noX + centerX) - mouseX;
  const dy = (noY + centerY) - mouseY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // 2cm以内で逃げる
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
