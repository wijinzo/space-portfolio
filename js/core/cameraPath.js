import * as THREE from 'three';
import { CAMERA_CONFIG } from '../config.js';
const clamp = t => Math.min(1, Math.max(0, t));
const smooth = t => { const x = clamp(t); return x * x * (3 - 2 * x); };
const vec = obj => new THREE.Vector3(obj.x, obj.y, obj.z);

/** 只有此模組決定全域鏡頭的路徑、視差、運鏡與傾斜。 */
export class CameraPath {
  constructor(camera, stations) {
    this.camera = camera;
    this.nodes = stations.map(s => s.camera || stations[stations.length - 2].camera)
      .map(c => ({ position: vec(c.position), target: vec(c.target) }));
    this.pointer = new THREE.Vector2();
    this.parallax = new THREE.Vector2();
    this.current = this.nodes[0].position.clone();
    this.look = this.nodes[0].target.clone();
    this.tmpPosition = new THREE.Vector3();
    this.tmpTarget = new THREE.Vector3();
    this.offset = new THREE.Vector3();
    this.defaultFov = camera.fov;
    this.bank = 0;
  }
  setPointer(x, y) { this.pointer.set(clamp(x / 2 + .5) * 2 - 1, clamp(y / 2 + .5) * 2 - 1); }
  update(state, deltaTime, reduced = false) {
    const { index, localProgress: t } = state;
    const prev = this.nodes[Math.max(0, index - 1)];
    const curr = this.nodes[index];
    const next = this.nodes[Math.min(index + 1, this.nodes.length - 1)];
    const centerPrev = prev.position.clone().lerp(curr.position, .5);
    const centerNext = curr.position.clone().lerp(next.position, .5);
    const targetPrev = prev.target.clone().lerp(curr.target, .5);
    const targetNext = curr.target.clone().lerp(next.target, .5);
    // 保留進站、停靠、離站三階段；中間 35% 進度專心閱讀。
    if (t < .325) {
      const k = smooth(t / .325);
      this.tmpPosition.copy(centerPrev).lerp(curr.position, k);
      this.tmpTarget.copy(targetPrev).lerp(curr.target, k);
    } else if (t > .675) {
      const k = smooth((t - .675) / .325);
      this.tmpPosition.copy(curr.position).lerp(centerNext, k);
      this.tmpTarget.copy(curr.target).lerp(targetNext, k);
    } else {
      this.tmpPosition.copy(curr.position);
      this.tmpTarget.copy(curr.target);
    }
    // 曲線掠過、俯衝與傾斜：各站幅度不同，但在站點邊界歸零，避免鏡頭跳動。
    const envelope = Math.pow(Math.sin(Math.PI * t), 2);
    const direction = index % 2 ? -1 : 1;
    const sweep = reduced ? 0 : envelope;
    this.offset.set(direction * sweep * (index === 1 ? 2.5 : 1.15),
      sweep * (index === 0 ? 1.3 : index === 1 ? -1.5 : .48),
      -sweep * (index === 1 ? 3.2 : 1.5));
    this.tmpPosition.add(this.offset);
    this.tmpTarget.addScaledVector(this.offset, .45);
    const k = reduced ? 1 : 1 - Math.exp(-10 * Math.min(deltaTime, .1));
    this.current.lerp(this.tmpPosition, k);
    this.look.lerp(this.tmpTarget, k);
    const pointerK = 1 - Math.pow(1 - CAMERA_CONFIG.parallaxSmoothing, Math.min(deltaTime * 60, 7));
    this.parallax.lerp(reduced ? new THREE.Vector2() : this.pointer, pointerK);
    const amount = reduced ? 0 : CAMERA_CONFIG.parallaxStrength;
    this.camera.position.copy(this.current).add(new THREE.Vector3(this.parallax.x * amount * 2, this.parallax.y * amount, 0));
    this.camera.lookAt(this.look.x + this.parallax.x * amount, this.look.y + this.parallax.y * amount, this.look.z);
    const bank = reduced ? 0 : (direction * Math.sin(Math.PI * t) * .033 + this.parallax.x * .012);
    this.bank += (bank - this.bank) * k;
    this.camera.rotateZ(this.bank);
    const zoom = reduced ? 0 : Math.sin(Math.PI * t) * (index === 1 ? 5 : 2.4);
    const nextFov = this.defaultFov + zoom;
    this.camera.fov += (nextFov - this.camera.fov) * k;
    this.camera.updateProjectionMatrix();
  }
  snap(state) { this.update(state, 1000, true); }
}
