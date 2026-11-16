// 完全使用 Canvas 2D 建立蠟筆手繪星球，不使用 Three.js。
const clamp = v => Math.max(0, Math.min(1, v));
const random = seed => () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
export class HandDrawnPlanet {
  constructor(canvas, onDetails) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onDetails = onDetails;
    this.width = 0; this.height = 0; this.opacity = 0;
    this.paper = null; this.art = null;
    this.onResize = () => this.resize();
    this.onClick = e => {
      if (this.opacity < 0.85) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - this.width / 2) / this.scale;
      const y = (e.clientY - rect.top - this.height / 2) / this.scale;
      if ((x > -95 && x < 125 && y > -135 && y < 70) || (x * x / 285 ** 2 + (y - 12) ** 2 / 265 ** 2 < 1)) this.onDetails();
    };
    window.addEventListener('resize', this.onResize);
    canvas.addEventListener('click', this.onClick);
    this.resize();
  }
  resize() {
    this.width = this.canvas.clientWidth; this.height = this.canvas.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.round(this.width * dpr));
    this.canvas.height = Math.max(1, Math.round(this.height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.scale = Math.min(this.width / 760, this.height / 670, 1.15);
    this.prepareArtwork();
    this.render(0, true);
  }
  prepareArtwork() {
    const surface = document.createElement('canvas'); surface.width = 760; surface.height = 670;
    const ctx = surface.getContext('2d');
    ctx.translate(380, 335);
    const rand = random(314159);
    // 顆粒填色：以短筆觸堆疊，保留留白，避免平滑數位漸層。
    function scribbleEllipse(cx, cy, rx, ry, color, count, lw = 2.8) {
      ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineWidth = lw;
      for (let i = 0; i < count; i++) {
        const a = rand() * Math.PI * 2, r = Math.sqrt(rand());
        const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r;
        const length = 2 + rand() * 14;
        ctx.globalAlpha = 0.23 + rand() * 0.47;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.lineTo(x + length * 0.9, y - length * (0.2 + rand() * 0.3)); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    function wobbleEllipse(cx, cy, rx, ry, color, fill) {
      ctx.beginPath();
      for (let i = 0; i <= 96; i++) {
        const a = i / 96 * 2 * Math.PI;
        const n = 1 + 0.009 * Math.sin(a * 13) + 0.006 * Math.cos(a * 21);
        const x = cx + Math.cos(a) * rx * n, y = cy + Math.sin(a) * ry * n;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      ctx.lineWidth = 4.3; ctx.strokeStyle = color; ctx.stroke();
    }
    wobbleEllipse(0, 12, 277, 257, '#ad8265', '#e8b873');
    scribbleEllipse(0, 12, 270, 250, '#f9d59b', 9700, 4);
    scribbleEllipse(-90, 95, 130, 83, '#ef9a81', 1250);
    scribbleEllipse(119, 106, 102, 73, '#f5a986', 1150);
    wobbleEllipse(-95, 95, 111, 55, '#88a17d', '#98b58c');
    scribbleEllipse(-95, 94, 106, 50, '#699b76', 1600);
    wobbleEllipse(122, 103, 102, 50, '#7e9f7e', '#9ec091');
    scribbleEllipse(122, 101, 94, 46, '#75a47b', 1700);
    // 歪斜屋頂與簡單童趣小屋。
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = '#ffe5bd'; ctx.strokeStyle = '#80695f'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-36, -45); ctx.lineTo(76, -49); ctx.lineTo(77, 49); ctx.lineTo(-35, 43); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#dc806b';
    ctx.beginPath(); ctx.moveTo(-54, -45); ctx.lineTo(16, -116); ctx.lineTo(94, -43); ctx.closePath(); ctx.fill(); ctx.stroke();
    scribbleEllipse(18, -74, 42, 22, '#b85059', 370, 3);
    ctx.fillStyle = '#90b4a0'; ctx.fillRect(4, -12, 32, 60); ctx.strokeRect(4, -12, 32, 60);
    ctx.fillStyle = '#efc18c'; ctx.fillRect(48, -10, 17, 20); ctx.strokeRect(48, -10, 17, 20);
    // 太陽與星星的線條有輕微晃動和不規則感。
    const star = (x, y, r) => {
      ctx.strokeStyle = '#cc8e5a'; ctx.lineWidth = 4; ctx.beginPath();
      for (let j = 0; j < 10; j++) {
        const a = -Math.PI / 2 + j * Math.PI / 5;
        const rad = j % 2 ? r * 0.47 : r;
        const px = x + Math.cos(a) * rad, py = y + Math.sin(a) * rad;
        if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fillStyle = '#f5d37a'; ctx.fill(); ctx.stroke();
    };
    star(-225, -173, 32); star(213, -145, 25); star(220, 183, 17);
    for (let i = 0; i < 28; i++) {
      const a = rand() * Math.PI * 2, r = 285 + rand() * 45;
      const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.83;
      ctx.fillStyle = i % 2 ? '#c78e78' : '#cca66a';
      ctx.beginPath(); ctx.arc(x, y, 1 + rand() * 2.6, 0, Math.PI * 2); ctx.fill();
    }
    this.art = surface;
  }
  render(elapsedTime = 0, reduced = false) {
    const ctx = this.ctx, w = this.width, h = this.height;
    ctx.clearRect(0, 0, w, h);
    if (this.opacity <= 0) return;
    ctx.save(); ctx.translate(w / 2, h / 2);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-380, -335 + (reduced ? 0 : Math.sin(elapsedTime * 0.4) * 3));
    ctx.drawImage(this.art, 0, 0);
    ctx.restore();
  }
  setOpacity(value) { this.opacity = clamp(value); this.canvas.style.opacity = String(this.opacity); this.canvas.style.pointerEvents = this.opacity > 0.85 ? 'auto' : 'none'; }
  dispose() { window.removeEventListener('resize', this.onResize); this.canvas.removeEventListener('click', this.onClick); }
}
