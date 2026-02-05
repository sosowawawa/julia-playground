const yesBtn = document.getElementById("btn1");
const noBtn = document.getElementById("btn2");

yesBtn.style.position = "absolute";
noBtn.style.position = "absolute";

// --------------------------------------
// 初期配置（画面下半分・横三等分）
// --------------------------------------
let yesX, yesY, noX, noY;
let noInitialX, noInitialY; // NOボタン初期位置保存用
let lastMoveTime = Date.now(); // NOボタンが最後に動いた時刻

function setInitialPositions() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const y = h * 0.6; // 下半分

  const yesPosX = w * (1 / 3);
  const noPosX = w * (2 / 3);

  yesX = yesPosX - yesBtn.offsetWidth / 2;
  yesY = y;

  noX = noPosX - noBtn.offsetWidth / 2;
  noY = y;

  // NOボタン初期位置を保存
　noInitialX = noX;
　noInitialY = noY;

  yesBtn.style.left = yesX + "px";
  yesBtn.style.top = yesY + "px";

  noBtn.style.left = noX + "px";
  noBtn.style.top = noY + "px";
}

setInitialPositions();
window.addEventListener("resize", setInitialPositions);

// --------------------------------------
// 設定
// --------------------------------------
const triggerDist = 100; // 2.5cm
const noEscapeDist = 170; // 4.5cm

let yesActive = false;
let noActive = false;

let mouseX = 0;
let mouseY = 0;

// YES の中心補正（1cm右）
const yesOffsetX = 40;
const yesOffsetY = 0;

// --------------------------------------
// マウス位置更新
// --------------------------------------
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  checkActivation();
});

// --------------------------------------
// 2.5cm以内に入ったら初めて機能付与
// --------------------------------------
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

// --------------------------------------
// 毎フレーム更新
// --------------------------------------
function animate() {
  if (yesActive) moveYes();
  if (noActive) moveNo();
  // NOボタンが動かないまま動いていなければ元の位置にゆっくり戻す
if (Date.now() - lastMoveTime > 5000) {
  // ゆっくり戻す (0.1倍ずつ戻る)
  noX += (noInitialX - noX) * 0.1;
  noY += (noInitialY - noY) * 0.1;
  noBtn.style.left = noX + "px";
  noBtn.style.top = noY + "px";
  
  // (ほぼ初期位置に戻ったら時刻リセット)
  if (Math.abs(noX - noInitialX) < 1 && Math.abs(noY - noInitialY) < 1) {
    noX = noInitialX;
    noY = noInitialY;
    lastMoveTime = Date.now();
  }
}

  requestAnimationFrame(animate);
}
animate();

// --------------------------------------
// YES ボタン：起動後は永続追跡
// --------------------------------------
function moveYes() {
  const rect = yesBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2 + yesOffsetX;
  const centerY = rect.top + rect.height / 2 + yesOffsetY;

  const dx = mouseX - centerX;
  const dy = mouseY - centerY;

  yesX += dx * 0.15;
  yesY += dy * 0.15;

  keepInside("yes");

  yesBtn.style.left = yesX + "px";
  yesBtn.style.top = yesY + "px";
}

// --------------------------------------
// NO ボタン：起動後は4.5cm逃げる（瞬間移動でOK）
// --------------------------------------
function moveNo() {
  const rect = noBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = centerX - mouseX;
  const dy = centerY - mouseY;
  const dist = Math.hypot(dx, dy);

  // カーソルから4.5cmの位置に移動
  if (dist < triggerDist) {
    const ratio = noEscapeDist / dist;

    let newCenterX = mouseX + dx * ratio;
    let newCenterY = mouseY + dy * ratio;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // 端に追いやられたらカーソルの反対側4.5cmにワープ
    if (
      newCenterX < 0 ||
      newCenterX > w ||
      newCenterY < 0 ||
      newCenterY > h
    ) {
      const oppositeRatio = -noEscapeDist / dist;
      newCenterX = mouseX + dx * oppositeRatio;
      newCenterY = mouseY + dy * oppositeRatio;
    }

    noX = newCenterX - rect.width / 2;
    noY = newCenterY - rect.height / 2;

    keepInside("no");

    noBtn.style.left = noX + "px";
    noBtn.style.top = noY + "px";

    lastNoMoveTime = Date.now();
  }
}

// --------------------------------------
// 画面外に出ないように調整
// --------------------------------------
function keepInside(type) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const btn = type === "yes" ? yesBtn : noBtn;
  const rect = btn.getBoundingClientRect();

  let x = type === "yes" ? yesX : noX;
  let y = type === "yes" ? yesY : noY;

  if (x < 0) x = 0;
  if (x + rect.width > w) x = w - rect.width;
  if (y < 0) y = 0;
  if (y + rect.height > h) y = h - rect.height;

  if (type === "yes") {
    yesX = x;
    yesY = y;
  } else {
    noX = x;
    noY = y;
  }
}
