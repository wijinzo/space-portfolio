/** 點擊空白宇宙產生螢幕座標星芒，不會改動 3D 鏡頭或旅程進度。 */
export class StarSparkles {
  constructor(layer) { this.layer = layer; this.count = 0; }
  burst(x, y) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (let i = 0; i < 7; i++) {
      if (this.count > 70) break;
      const star = document.createElement('span');
      star.className = 'click-star';
      star.textContent = i % 3 === 0 ? '✦' : '✧';
      const theta = i * Math.PI * 2 / 7;
      const radius = 24 + (i % 3) * 15;
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.setProperty('--dx', `${Math.cos(theta) * radius}px`);
      star.style.setProperty('--dy', `${Math.sin(theta) * radius}px`);
      star.style.setProperty('--delay', `${i * 35}ms`);
      star.addEventListener('animationend', () => { star.remove(); this.count--; }, { once: true });
      this.layer.append(star);
      this.count++;
    }
  }
}
