const yesBtn = document.getElementById("btn1");
const noBtn = document.getElementById("btn2");

// ボタンを絶対配置に変更
yesBtn.style.position = "absolute";
noBtn.style.position = "absolute";

// 初期位置を中央付近に
yesBtn.style.left = "50%";
yesBtn.style.top = "60%";
noBtn.style.left = "50%";
noBtn.style.top = "60%";

let yesX = window.innerWidth / 2;
let yesY = window.innerHeight * 0.6;

let noX = window.innerWidth / 2 + 150;
let noY = window.innerHeight * 0.6;

document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  moveYes(mouseX, mouseY);
  moveNo(mouseX, mouseY);
});

function moveYes(mouseX, mouseY) {
  const dx = mouseX - yesX;
  const dy = mouseY - yesY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 5) {
    const speed = 0.08;
    yesX += dx * speed;
    yesY += dy * speed;
  }

  yesBtn.style.left = `${yesX}px`;
  yesBtn.style.top = `${yesY}px`;
}

function moveNo(mouseX, mouseY) {
  const dx = noX - mouseX;
  const dy = noY - mouseY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const minDist = 150;

  if (dist < minDist) {
    const speed = Math.min(200 / dist, 5);
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
    const offset = 200;
    noX = mouseX < w / 2 ? mouseX + offset : mouseX - offset;
    noY = mouseY < h / 2 ? mouseY + offset : mouseY - offset;
  }

  noBtn.style.left = `${noX}px`;
  noBtn.style.top = `${noY}px`;
}
