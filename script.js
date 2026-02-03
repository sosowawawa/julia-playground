const yesBtn = document.getElementById("btn1");
const noBtn = document.getElementById("btn2");

let yesX = 0, yesY = 0;
let noX = 0, noY = 0;

// ボタンの初期位置を中央に固定（CSSの中央配置を基準にする）
yesBtn.style.position = "relative";
noBtn.style.position = "relative";

document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  // YESボタンの中心へ向かう
  moveYesButton(mouseX, mouseY);

  // NOボタンは逃げる
  moveNoButton(mouseX, mouseY);
});

function moveYesButton(mouseX, mouseY) {
  const rect = yesBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // カーソルへのベクトル
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  // 距離が小さくなったら止める
  if (distance < 5) return;

  // 速度調整（近づく）
  const speed = 0.08;
  yesX += dx * speed;
  yesY += dy * speed;

  yesBtn.style.transform = `translate(${yesX}px, ${yesY}px)`;
}

function moveNoButton(mouseX, mouseY) {
  const rect = noBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // カーソルから逃げるベクトル
  const dx = centerX - mouseX;
  const dy = centerY - mouseY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  // カーソルが近いほど強く逃げる
  const speed = Math.min(150 / distance, 4);

  noX += dx * speed;
  noY += dy * speed;

  noBtn.style.transform = `translate(${noX}px, ${noY}px)`;
}
