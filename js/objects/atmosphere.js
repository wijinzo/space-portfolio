import { THREE, createGroup, sphere, clearGroup } from './common.js';
export function create({ scene }) {
  const group = createGroup(scene, -52);
  const planet = sphere(9.6, 0x3560a0, 64, { emissive: 0x16426d, emissiveIntensity: .23 }); planet.position.set(6.5, -6, -4); group.add(planet);
  const halo = sphere(10.2, 0x88baff, 56, { transparent: true, opacity: .13, depthWrite: false, side: THREE.BackSide }); halo.position.copy(planet.position); group.add(halo);
  const clouds = new THREE.Group(); const cloudPieces = [];
  for (let i = 0; i < 42; i++) {
    const cloud = sphere(.65 + (i % 4) * .34, i % 3 ? 0xd3e6ff : 0xf8e1d1, 12, { transparent: true, opacity: .38, depthWrite: false });
    const angle = i * 2.399, layer = i % 3;
    const base = new THREE.Vector3(Math.sin(angle) * (5.5 + (i % 4) * 1.6), Math.cos(angle * 1.3) * 4.3 - .3, -2 + layer * 5);
    cloud.position.copy(base); cloud.scale.set(1.8, .38, .8); clouds.add(cloud); cloudPieces.push({ cloud, base, layer });
  }
  group.add(clouds);
  const streaks = new THREE.Group(); group.add(streaks);
  for (let j = 0; j < 45; j++) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(.008, .035, 1.2 + (j % 5) * .44, 4), new THREE.MeshBasicMaterial({ color: 0xc1e4ff, transparent: true, opacity: .18, depthWrite: false }));
    m.position.set(Math.sin(j * 17.53) * 15, Math.cos(j * 7.33) * 9, 2 + (j % 5)); m.rotation.z = .24; streaks.add(m);
  }
  return { group, clouds, cloudPieces, planet, streaks };
}
export function update({ instance: i, localProgress: t, elapsedTime, reduced }) {
  const travel = reduced ? 0 : t;
  // 不使用累加位移，捲動回頭時所有雲層能回到原位。
  i.cloudPieces.forEach(({ cloud, base, layer }, j) => {
    const rate = [2.4, 4.4, 6.3][layer];
    cloud.position.set(base.x + travel * rate * (j % 2 ? 1 : -1), base.y - travel * (layer + 1) * 1.6, base.z + travel * rate * 2);
  });
  i.streaks.children.forEach((s, j) => { s.material.opacity = Math.sin(t * Math.PI) * (.1 + (j % 3) * .05); s.scale.y = .5 + t * 2; });
  i.clouds.rotation.z = reduced ? 0 : Math.sin(elapsedTime * .13) * .015;
  i.planet.rotation.y = reduced ? 0 : elapsedTime * .008;
}
export function dispose({ instance }) { clearGroup(instance.group); }
