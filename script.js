function moveNo() {
  const rect = noBtn.getBoundingClientRect();

  // rect.left/top を基準に中心を計算（ズレ防止）
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = centerX - mouseX;
  const dy = centerY - mouseY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // 2.5cm以内で逃げる（逃げ距離を短く調整）
  if (dist < triggerDist) {
    const speed = Math.min(120 / dist, 3); // ← 逃げる距離を短くした
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
    const offset = 200; // ← ワープ距離も少し短く
    noX = mouseX < w / 2 ? mouseX + offset : mouseX - offset;
    noY = mouseY < h / 2 ? mouseY + offset : mouseY - offset;
  }

  noBtn.style.left = `${noX}px`;
  noBtn.style.top = `${noY}px`;
}
