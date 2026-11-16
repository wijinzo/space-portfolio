import { THREE, createGroup, sphere, torus, clearGroup } from './common.js';
const SATELLITES = [
  { key: 'satellite_frontend', label: '前端與介面', phase: 0.25, color: 0x6aa4ff },
  { key: 'satellite_creative', label: '創意與視覺', phase: 2.4, color: 0xf5b780 },
  { key: 'satellite_tools', label: '工具與技術', phase: 4.55, color: 0x86dfc8 },
];
export function create({ scene, station, interactionManager, onDetails }) {
  const group = createGroup(scene, -88);
  const earth = sphere(5.9, 0x3668bc, 64, { roughness: .89, emissive: 0x152a5f, emissiveIntensity: .2 }); earth.position.set(5.1, 0, -2); group.add(earth);
  const continents = new THREE.Group();
  for (let j = 0; j < 14; j++) {
    const patch = sphere(.8 + (j % 3) * .37, j % 2 ? 0x68b9a1 : 0x87a979, 12, { roughness: .95 });
    const angle = j * 2.4, vertical = (j % 7 - 3) * .36;
    patch.position.set(Math.cos(angle) * Math.cos(vertical) * 5.7, Math.sin(vertical) * 5.7, Math.sin(angle) * Math.cos(vertical) * 5.7);
    patch.scale.set(1.6, .35, .8); patch.lookAt(0, 0, 0); continents.add(patch);
  }
  earth.add(continents);
  const moon = sphere(1.35, 0xbcc2d3, 30, { roughness: 1 }); moon.position.set(-3.9, 3.4, -3); group.add(moon);
  const orbit = torus(8, .024, 0x8fc6ef, [.2, .4, .3]); orbit.position.copy(earth.position); orbit.material.opacity = .42; group.add(orbit);
  // 統一保存互動解除註冊函式，避免初始化時使用未宣告的變數。
  const unregister = [];
  const ripples = [];
  // 預先分配波紋幾何體，不在每次滑鼠移動或每一幀重新建立材質。
  for (let j = 0; j < 10; j++) {
    const mesh = new THREE.Mesh(new THREE.RingGeometry(.22, .26, 48), new THREE.MeshBasicMaterial({
      color: 0x9feaff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false,
      depthTest: false,
    }));
    mesh.visible = false;
    earth.add(mesh);
    ripples.push({ mesh, age: 99 });
  }
  let dragX = 0, dragY = 0, lastRipple = 0, rippleCursor = 0;
  const addRipple = (intersection, force = 1) => {
    if (!intersection?.point) return;
    const local = earth.worldToLocal(intersection.point.clone());
    const normal = local.normalize();
    const r = ripples[rippleCursor++ % ripples.length];
    r.age = 0; r.force = force;
    r.mesh.visible = true;
    r.mesh.position.copy(normal).multiplyScalar(5.94);
    r.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  };
  unregister.push(interactionManager.register(station.id, 'earth_ocean', earth, intersection => addRipple(intersection, 1),
    () => {}, {
      onPointerMove: intersection => {
        if (performance.now() - lastRipple < 100) return;
        lastRipple = performance.now();
        addRipple(intersection, .55);
      },
      onDrag: ({ dx, dy }) => {
        dragX += dx * .007;
        dragY = THREE.MathUtils.clamp(dragY + dy * .004, -.5, .5);
      },
    }));
  const satellites = [];
  SATELLITES.forEach((config, index) => {
    const satellite = new THREE.Group();
    const core = new THREE.Mesh(new THREE.BoxGeometry(.75, .65, .55), new THREE.MeshStandardMaterial({ color: 0xe4d6b1, metalness: .6, roughness: .3 })); satellite.add(core);
    const panels = [];
    for (const x of [-1, 1]) { const panel = new THREE.Mesh(new THREE.BoxGeometry(1.5, .68, .07), new THREE.MeshStandardMaterial({ color: config.color, metalness: .55, roughness: .34, emissive: config.color, emissiveIntensity: .24 })); panel.position.x = x * 1.15; satellite.add(panel); panels.push(panel); }
    const marker = sphere(.13, config.color, 14, { emissive: config.color, emissiveIntensity: 1 }); marker.position.y = .45; satellite.add(marker);
    const target = station.exploreTargets?.[index] || station;
    unregister.push(interactionManager.register(station.id, config.key, satellite, () => onDetails(target), hover => {
      satellite.scale.setScalar(hover ? 1.55 : 1);
      panels.forEach(panel => { panel.material.emissiveIntensity = hover ? 1.6 : .24; });
    }));
    group.add(satellite); satellites.push({ satellite, config });
  });
  return { group, earth, satellites, unregister, ripples, getDrag: () => ({ x: dragX, y: dragY }) };
}
export function update({ instance: i, elapsedTime, deltaTime, reduced, localProgress }) {
  i.earth.rotation.y = (reduced ? 0 : elapsedTime * .047) + i.getDrag().x;
  i.earth.rotation.x = i.getDrag().y;
  i.ripples.forEach(r => {
    if (r.age > 1.3) { r.mesh.visible = false; return; }
    r.age += deltaTime;
    const t = Math.min(1, r.age / 1.3);
    r.mesh.scale.setScalar(1 + t * 13);
    r.mesh.material.opacity = (1 - t) * .8 * r.force;
  });
  i.satellites.forEach(({ satellite, config }, j) => {
    const a = config.phase + (reduced ? 0 : elapsedTime * (.1 + .018 * j));
    const r = 8.3;
    satellite.position.set(5.1 + Math.cos(a) * r, Math.sin(a) * 3.25, -2 + Math.sin(a) * 2.15 + 2.4);
    satellite.rotation.y = Math.sin(a) * .22;
    satellite.rotation.z = Math.sin(a + localProgress) * .12;
  });
}
export function dispose({ instance }) { instance.unregister.forEach(fn => fn()); clearGroup(instance.group); }
