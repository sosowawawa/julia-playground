const yesBtn = document.getElementById("btn1");
const noBtn = document.getElementById("btn2");

yesBtn.style.position = "absolute";
noBtn.style.position = "absolute";

// -----------------------------
// 初期配置（画面下半分・横三等分）
// -----------------------------
function setInitialPositions() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const y = h * 0.55; // 下半分

  // 横三等分
  const yesPosX = w * (1 / 3);
  const noPosX = w * (2 / 3);

  yesX = yesPosX - yesBtn.offsetWidth / 2;
  yesY = y;

  noX = noPosX - noBtn.offsetWidth / 2;
  noY = y;

  yesBtn.style.left = yesX + "px";
  yesBtn.style.top = yesY + "px";

  noBtn.style.left = noX + "px";
  noBtn.style.top = noY + "px";
}

let yesX, yesY, noX, noY;
setInitialPositions();

// -----------------------------
// 設定
// -----------------------------
const triggerDist = 100; // 2.5cm
const noEscapeDist = 120; // 3cm逃げる

let yesActive = false;
let noActive = false;

let mouseX = 0;
let mouseY = 0;

// YES の中心補正（1cm右）
const yesOffsetX = 40;
const yesOffsetY = 0;

// -----------------------------
// マウス位置更新
// -----------------------------
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  checkActivation();
});

// -----------------------------
// 2.5cm以内に入ったら初めて機能付与
// -----------------------------
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

// -----------------------------
// 毎フレーム更新
// -----------------------------
function animate() {
  if (yesActive) moveYes();
  if (noActive) moveNo();
  requestAnimationFrame(animate);
}
animate();

// -----------------------------
// YES ボタン：起動後は永続追跡
// -----------------------------
function moveYes() {
  const rect = yesBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2 + yesOffsetX;
  const centerY = rect.top + rect.height / 2 + yesOffsetY;

  const dx = mouseX - centerX;
  const dy = mouseY - centerY;

  yesX += dx * 0.15;
  yesY += dy * 0.15;

  keepInsideScreen("yes");

  yesBtn.style.left = yesX + "px";
  yesBtn.style.top = yesY + "px";
}

// -----------------------------
// NO ボタン：起動後は3cm逃げる
// -----------------------------
function moveNo() {
  const rect = noBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = centerX - mouseX;
  const dy = centerY - mouseY;
  const dist = Math.hypot(dx, dy);

  if (dist < triggerDist) {
    const ratio = noEscapeDist / dist;
    noX += dx * ratio;
    noY += dy * ratio;
  }

  keepInsideScreen("no");

  noBtn.style.left = noX + "px";
  noBtn.style.top = noY + "px";
}

// -----------------------------
// 画面外に出ないようにする & 端ならワープ
// -----------------------------
function keepInsideScreen(type) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  let x = type === "yes" ? yesX : noX;
  let y = type === "yes" ? yesY : noY;

  const btn = type === "yes" ? yesBtn : noBtn;
  const rect = btn.getBoundingClientRect();

  const margin = 10;

  // 画面外に出そうならワープ（NOのみ）
  if (type === "no") {
    if (rect.left < margin) x = w - rect.width - 50;
    if (rect.right > w - margin) x = 50;
    if (rect.top < margin) y = h - rect.height - 50;
    if (rect.bottom > h - margin) y = 50;
  }

  // YES は画面内に押し戻すだけ
  if (type === "yes") {
    if (rect.left < margin) x = margin;
    if (rect.right > w - margin) x = w - rect.width - margin;
    if (rect.top < margin) y = margin;
    if (rect.bottom > h - margin) y = h - rect.height - margin;
  }

  if (type === "yes") {
    yesX = x;
    yesY = y;
  } else {
    noX = x;
    noY = y;
  }
}
