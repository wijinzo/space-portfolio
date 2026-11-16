import * as THREE from 'three';

const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const smooth = x => { const n = clamp(x); return n * n * (3 - 2 * n); };

/**
 * 電影式演出只讀取旅程進度，不自行累計移動距離。
 * 跳轉、重整與反向捲動都能得到一致的鏡頭和轉場狀態。
 */
export class CinematicDirector {
  constructor(scene, camera, stage) {
    this.stage = stage;
    this.camera = camera;
    this.scene = scene;
    this.content = document.querySelector('#content-area');
    this.status = document.querySelector('#flight-status');
    this.vignette = document.querySelector('#cinematic-vignette');
    this.flash = document.querySelector('#transition-flash');
    this.lastStation = -1;
    this.makeFlightStreaks();
  }
  makeFlightStreaks() {
    // 相機局部座標中的光跡，飛掠時形成有深度的速度感。
    const count = matchMedia('(pointer: coarse)').matches ? 65 : 125;
    const positions = new Float32Array(count * 6);
    const seed = index => { const n = Math.sin(index * 127.1 + 78.33) * 43758.5453; return n - Math.floor(n); };
    for (let i = 0; i < count; i++) {
      const theta = seed(i + 2) * Math.PI * 2;
      const radius = 4 + seed(i + 172) * 28;
      const x = Math.cos(theta) * radius, y = Math.sin(theta) * radius;
      const z = -14 - seed(i + 412) * 65;
      positions.set([x, y, z, x * 1.18, y * 1.18, z - 9 - seed(i + 211) * 15], i * 6);
    }
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.streaks = new THREE.LineSegments(this.geometry, new THREE.LineBasicMaterial({ color: 0xb1d8ff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.streaks.frustumCulled = false;
    this.camera.add(this.streaks);
  }
  update(state, { reduced = false, finaleBlend = 0 } = {}) {
    const t = state.localProgress;
    const moving = Math.pow(1 - smooth(Math.abs(t - .5) / .36), 1.3);
    // Approach/Departure 的電影式轉場比 Focus 明顯，留下清楚的閱讀區間。
    const flight = 1 - smooth((t - .16) / .18) + smooth((t - .69) / .22);
    const launch = state.index === 0 ? smooth((t - .1) / .65) : 0;
    const passage = state.index === 1 ? .65 * Math.sin(Math.PI * t) : 0;
    const speed = reduced ? 0 : clamp((flight * .45 + launch * .45 + passage) * (1 - finaleBlend));
    this.streaks.material.opacity = speed * .29;
    this.streaks.scale.z = 1 + speed * 1.5;
    this.streaks.visible = !reduced && finaleBlend < .9;
    // 過站的瞬間掠過一道柔和光暈；沒有遮滿畫面的白屏。
    const edge = t < .11 ? 1 - smooth(t / .11) : t > .89 ? smooth((t - .89) / .11) : 0;
    const flash = reduced ? 0 : edge * .19 * (1 - finaleBlend);
    this.flash.style.opacity = String(flash);
    this.vignette.style.opacity = String(reduced ? .08 : .24 + speed * .32);
    const opacity = reduced ? 1 : .62 + .38 * smooth(Math.min(t, 1 - t) / .2);
    this.content.style.opacity = String(opacity);
    this.content.style.setProperty('--cinematic-shift', `${reduced ? 0 : (0.5 - t) * 17}px`);
    const phase = t < .29 ? 'APPROACH' : t > .73 ? 'DEPARTURE' : 'EXPLORING';
    if (this.lastStation !== state.index || this.lastPhase !== phase) {
      this.status.textContent = `${String(state.index + 1).padStart(2, '0')} / ${phase}`;
      this.lastStation = state.index;
      this.lastPhase = phase;
    }
  }
  dispose() {
    this.camera.remove(this.streaks);
    this.geometry.dispose();
    this.streaks.material.dispose();
  }
}
