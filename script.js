const yesBtn = document.getElementById("btn1");
const noBtn = document.getElementById("btn2");

yesBtn.style.position = "absolute";
noBtn.style.position = "absolute";

yesBtn.addEventListener('click', () => {

  window.open("event_20260214.ics", "_blank");

  setTimeout(() => {
    window.location.href = "./yesView/yesView.html";
  }, 500);

});

// --------------------------------------
// 初期配置（画面下半分・横三等分）
// --------------------------------------
let yesX, yesY, noX, noY;
let yesInitialX, yesInitialY;
let noInitialX, noInitialY; // NOボタン初期位置保存用
let lastYesMoveTime = Date.now();
let lastNoMoveTime = Date.now(); // NOボタンが最後に動いた時刻
let isMouseOut = false;
let lastMouseOutTime = null;

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
  yesInitialX = yesX;
  yesInitialY = yesY;
　noInitialX = noX;
　noInitialY = noY;

  yesBtn.style.left = yesX + "px";
  yesBtn.style.top = yesY + "px";

  noBtn.style.left = noX + "px";
  noBtn.style.top = noY + "px";
}

setInitialPositions();
window.addEventListener('resize', setInitialPositions);

// ダイアログはindex.htmlに埋め込まれているため、準備完了
let dialogLoaded = true;
async function ensureDialogInDOM() {
  // ダイアログHTMLはすでにDOMに存在しているため、何もしない
  return;
}

// No ボタンをクリックしたときにダイアログを開く処理
noBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    await ensureDialogInDOM();
    const result = await window.showWarningDialog({ 
      title: 'Alert', 
      message: 'If you make this choice, I infect your PC with a virus.', 
      yesText: 'Yes', 
      noText: 'No' 
    });
  } catch (err) {
    console.error('dialog error', err);
  }
});

// イベントで GIF 差し替えを受け取る（ダイアログ側からの通知をハンドル）
window.addEventListener('warning-dialog-close', (ev) => {
  const newGif = ev?.detail?.newGifUrl;
  if (newGif) {
    const topGif = document.getElementById('topGif');
    if (topGif) topGif.src = newGif;
  }
});

// No ボタンクリック時のイベントをハンドル
window.addEventListener('warning-dialog-no', (ev) => {
  // ダイアログは再利用可能
});

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

// マウスがウィンドウ外に出た/戻った時間を管理
window.addEventListener('mouseout', (e) => {
  // 関連ターゲットがnullならウィンドウ外
  if (!e.relatedTarget && !e.toElement)
  {
    isMouseOut = true;
    lastMouseOutTime = Date.now();
  }
});
window.addEventListener('mousemove', (e) => {
  if (!e.relatedTarget && !e.fromElement)
  {
    isMouseOut = false;
    lastMouseOutTime = null;
  }
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
  // NOボタンが5秒以上動いていなければ元の位置にゆっくり戻す
  if (Date.now() - lastNoMoveTime > 5000) {
    // ゆっくり戻す (0.1倍ずつ戻る)
    noX += (noInitialX - noX) * 0.1;
    noY += (noInitialY - noY) * 0.1;
    noBtn.style.left = noX + "px";
    noBtn.style.top = noY + "px";
  
    if (Math.abs(noX - noInitialX) < 1 && Math.abs(noY - noInitialY) < 1) {
      noX = noInitialX;
      noY = noInitialY;
      lastNoMoveTime = Date.now();
    }
  }

  if (isMouseOut && lastMouseOutTime && Date.now() - lastMouseOutTime > 5000){
    yesActive = false;
    yesX += (yesInitialX - yesX) * 0.1;
    yesY += (yesInitialY - yesY) * 0.1;
    yesBtn.style.left = yesX + "px";
    yesBtn.style.top = yesY + "px";
    if (Math.abs(yesX - yesInitialX) < 1 && Math.abs(yesY - yesInitialY) < 1){
      yesX = yesInitialX;
      yesY = yesInitialY;
      lastMouseOutTime = Date.now();
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

  lastYesMoveTime = Date.now();
}

// --------------------------------------
// NO ボタン：起動後は4.5cm逃げる（段階的に移動）
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

    let targetCenterX = mouseX + dx * ratio;
    let targetCenterY = mouseY + dy * ratio;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // 端に追いやられたらカーソルの反対側4.5cmにワープ
    if (
      targetCenterX < 0 ||
      targetCenterX > w ||
      targetCenterY < 0 ||
      targetCenterY > h
    ) {
      const oppositeRatio = -noEscapeDist / dist;
      targetCenterX = mouseX + dx * oppositeRatio;
      targetCenterY = mouseY + dy * oppositeRatio;
    }

    // ターゲット位置を計算
    let targetX = targetCenterX - rect.width / 2;
    let targetY = targetCenterY - rect.height / 2;

    // 段階的に移動（0.05の係数でより遅く移動）
    noX += (targetX - noX) * 0.05;
    noY += (targetY - noY) * 0.05;

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
