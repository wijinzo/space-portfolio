import { THREE, createGroup, sphere, glow, clearGroup } from './common.js';
const clamp = v => Math.max(0, Math.min(1, v));
const ease = t => { const x = clamp(t); return x * x * (3 - 2 * x); };
export function create({ scene, interactionManager, station, onDetails, onRocketLaunch }) {
  const group = createGroup(scene, -16);
  const rocket = new THREE.Group(); rocket.position.set(5, 0, 0); rocket.rotation.z = -0.22;
  const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.88, 5.6, 32), new THREE.MeshStandardMaterial({ color: 0xe9ecfa, metalness: 0.55, roughness: 0.26 })); rocket.add(hull);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.64, 1.85, 32), new THREE.MeshStandardMaterial({ color: 0xff7655, metalness: 0.3 })); nose.position.y = 3.72; rocket.add(nose);
  const window = sphere(0.39, 0x153559, 24, { metalness: 0.6, roughness: 0.13, emissive: 0x214b8d, emissiveIntensity: 0.75 }); window.position.set(0, 1.6, 0.58); rocket.add(window);
  for (const x of [-1, 1]) { const fin = new THREE.Mesh(new THREE.BoxGeometry(1, 1.85, 0.22), new THREE.MeshStandardMaterial({ color: 0xf26453, metalness: 0.35 })); fin.position.set(x * 0.87, -2, 0); fin.rotation.z = x * 0.25; rocket.add(fin); }
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.63, 3.4, 25), new THREE.MeshBasicMaterial({ color: 0xffaa53, transparent: true, opacity: 0.82 })); flame.rotation.z = Math.PI; flame.position.y = -4.35; rocket.add(flame);
  const flameGlow = glow(0xff6b3d, 2.2, 0.16); flameGlow.position.y = -3.3; rocket.add(flameGlow);
  const light = new THREE.PointLight(0xff8a49, 0, 17); light.position.set(0, -4.1, 0); rocket.add(light);
  group.add(rocket);
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 6.4, 1.1, 64), new THREE.MeshStandardMaterial({ color: 0x24283a, metalness: 0.6, roughness: 0.5 })); platform.position.set(5, -6.2, 0); group.add(platform);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.08, 8, 80), new THREE.MeshBasicMaterial({ color: 0xff8c62 })); ring.rotation.x = Math.PI / 2; ring.position.set(5, -5.6, 0); group.add(ring);
  const particles = []; const exhaust = new THREE.Group(); group.add(exhaust);
  for (let i = 0; i < 28; i++) { const puff = sphere(0.3 + (i % 4) * 0.15, i % 3 ? 0x8d93a4 : 0xe7bca8, 9, { transparent: true, opacity: .24, depthWrite: false }); exhaust.add(puff); particles.push(puff); }
  // 尾焰優先於火箭本體被射線偵測；真正點到尾焰才觸發失控事件。
  const unregisterTail = interactionManager.register(station.id, 'rocket_tail', [flame, flameGlow], () => {
    if (flightStart !== null) return;
    flightStart = performance.now() / 1000;
    onRocketLaunch?.();
  }, hover => { flame.material.color.setHex(hover ? 0xfff2a2 : 0xffaa53); });
  const unregister = interactionManager.register(station.id, 'rocket', [hull, nose, window], () => onDetails(station), hover => {
    window.material.emissiveIntensity = hover ? 2 : .75;
  });
  let flightStart = null;
  return { group, rocket, flame, flameGlow, light, platform, ring, particles,
    unregister: () => { unregister(); unregisterTail(); }, getFlightStart: () => flightStart,
    resetFlight: () => { flightStart = null; } };
}
export function update({ instance: i, localProgress: t, elapsedTime, reduced }) {
  // 由捲動位置直接決定升空高度，因此往返捲動與重新整理都可還原。
  const ignition = ease(t / .27); const lift = ease((t - .18) / .76);
  const flightAge = i.getFlightStart() === null ? -1 : performance.now() / 1000 - i.getFlightStart();
  const chaos = flightAge < 0 ? 0 : Math.min(1, flightAge / .32);
  i.rocket.position.x = 5 + (chaos ? Math.sin(flightAge * 18) * chaos * 2.3 + flightAge * 4 : 0);
  i.rocket.position.y = lift * 15 + (reduced ? 0 : Math.sin(elapsedTime * 2.4) * .07 * ignition)
    + (chaos ? Math.sin(flightAge * 12) * 1.3 + flightAge * 6 : 0);
  i.rocket.position.z = -lift * 5;
  i.rocket.rotation.z = -.22 + lift * .19 + (chaos ? Math.sin(flightAge * 22) * .5 + flightAge * 1.5 : 0);
  i.flame.scale.setScalar(.6 + ignition * .48);
  i.flame.scale.y = .32 + ignition * (reduced ? 1.25 : 1.25 + Math.sin(elapsedTime * 23) * .13);
  i.flame.material.opacity = .12 + Math.max(ignition, chaos) * .8;
  i.flameGlow.material.opacity = .02 + ignition * .28;
  i.light.intensity = Math.max(ignition, chaos) * 26;
  i.platform.position.y = -6.2 - lift * 2;
  i.ring.position.y = -5.6 - lift * 2;
  i.particles.forEach((p, j) => {
    const fraction = (j * .173 + lift * 2.6) % 1;
    const angle = j * 2.399;
    p.position.set(5 + Math.cos(angle) * (.9 + fraction * 4), -5.5 - fraction * 5, Math.sin(angle) * (.9 + fraction * 3));
    p.scale.setScalar(.35 + fraction * 2.3);
    p.material.opacity = ignition * (1 - fraction) * .28;
  });
}
export function dispose({ instance }) { instance.unregister(); clearGroup(instance.group); }
