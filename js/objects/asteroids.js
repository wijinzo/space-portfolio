import { THREE, createGroup, clearGroup } from './common.js';
export function create({ scene, station, interactionManager, onDetails }) {
  const group = createGroup(scene, -124);
  const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x8d8294, flatShading: true, roughness: 0.96, metalness: 0.09 });
  const highlight = new THREE.MeshStandardMaterial({ color: 0xffb076, roughness: 0.66, metalness: 0.18, emissive: 0x64311e, emissiveIntensity: 0.36, flatShading: true });
  const geom = new THREE.IcosahedronGeometry(1, 1);
  const instanced = new THREE.InstancedMesh(geom, rockMaterial, 125);
  const dummy = new THREE.Object3D(); let seed = 1200;
  const rand = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 125; i++) {
    const angle = rand() * Math.PI * 2; const radius = 5.5 + rand() * 14;
    dummy.position.set(Math.cos(angle) * radius + 3, Math.sin(angle) * radius * 0.56, (rand() - 0.5) * 13);
    dummy.rotation.set(rand() * 4, rand() * 4, rand() * 4);
    const s = 0.19 + rand() * 0.75; dummy.scale.set(s, s * (0.6 + rand()), s);
    dummy.updateMatrix(); instanced.setMatrixAt(i, dummy.matrix);
  }
  group.add(instanced);
  const featured = new THREE.Mesh(new THREE.IcosahedronGeometry(2.8, 2), highlight);
  featured.position.set(5.5, 0, 3); featured.scale.set(1.3, 0.85, 1); group.add(featured);
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(4.25, 0.024, 8, 70), new THREE.MeshBasicMaterial({ color: 0xffb076, transparent: true, opacity: 0.6 }));
  orbit.rotation.set(0.7, 0.4, 0); orbit.position.copy(featured.position); group.add(orbit);
  const unregister = interactionManager.register(station.id, 'featuredAsteroid', featured, () => onDetails(station), hovered => { featured.material.emissiveIntensity = hovered ? 1.2 : 0.36; });
  return { group, featured, instanced, orbit, unregister };
}
export function update({ instance, elapsedTime, reduced }) {
  instance.featured.rotation.set(0.14, reduced ? 0.2 : elapsedTime * 0.12, 0.1);
  instance.orbit.rotation.z = reduced ? 0 : elapsedTime * 0.05;
}
export function dispose({ instance }) { instance.unregister(); clearGroup(instance.group); }
