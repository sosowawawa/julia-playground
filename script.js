const yesBtn = document.getElementById("btn1");
const noBtn = document.getElementById("btn2");

let yesX = 0, yesY = 0;
let noX = 0, noY = 0;

yesBtn.style.position = "relative";
noBtn.style.position = "relative";

document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  moveYes(mouseX, mouseY);
  moveNo(mouseX, mouseY);
});

function moveYes(mouseX, mouseY) {
  const rect = yesBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const dx = mouseX - cx;
  const dy = mouseY - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 5) return;

  const speed = 0.08;
  yesX += dx * speed;
  yesY += dy * speed;

  yesBtn.style.transform = `translate(${yesX}px, ${yesY}px)`;
}

function moveNo(mouseX, mouseY) {
  const rect = noBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const dx = cx - mouseX;
  const dy = cy - mouseY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // 一定距離を保つ（距離が近いほど強く逃げる）
  const minDist = 150;
  if (dist < minDist) {
    const speed = Math.min(200 / dist, 5);
    noX += dx * speed;
    noY += dy * speed;
  }

  // 画面端に追い込まれたらワープ
  const margin = 20;
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  const btnLeft = rect.left + noX;
  const btnTop = rect.top + noY;

  const nearLeft = btnLeft < margin;
  const nearRight = btnLeft + rect.width > screenW - margin;
  const nearTop = btnTop < margin;
  const nearBottom = btnTop + rect.height > screenH - margin;

  if (nearLeft || nearRight || nearTop || nearBottom) {
    //
