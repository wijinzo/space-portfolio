import { THREE, sphere, torus, createGroup, clearGroup } from './common.js';
export function create({ scene, station, interactionManager, onDetails }) {
  const group = createGroup(scene, -196);
  const saturn = sphere(5.4, 0xbaa7ac, 54, { metalness: 0.12, roughness: 0.88 });
  saturn.position.set(5.5, -1, -3); group.add(saturn);
  const rings = new THREE.Group(); rings.position.copy(saturn.position);
  for (let i = 0; i < 10; i++) rings.add(torus(6.4 + i * 0.32, 0.095, i % 3 ? 0xbb9ba3 : 0xf4d4a9, [Math.PI / 2.7, 0.12, 0.15]));
  group.add(rings);
  const nodes = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const node = sphere(0.14 + (i % 2) * 0.13, i % 2 ? 0x81c8ed : 0xffbe98, 16, { emissive: i % 2 ? 0x81c8ed : 0xffbe98, emissiveIntensity: 1.8 });
    node.position.set(-8 + (i % 3) * 3.7, 3.3 - Math.floor(i / 3) * 6, 1 + i * 0.3); nodes.add(node);
  }
  group.add(nodes);
  const marker = nodes.children[1];
  const unregister = interactionManager.register(station.id, 'milestone', nodes.children, () => onDetails(station), hovered => { nodes.scale.setScalar(hovered ? 1.07 : 1); });
  return { group, saturn, rings, nodes, marker, unregister };
}
export function update({ instance, elapsedTime, reduced }) {
  instance.saturn.rotation.y = reduced ? 0 : elapsedTime * 0.027;
  instance.rings.rotation.y = reduced ? 0 : elapsedTime * 0.014;
  instance.nodes.children.forEach((node, i) => { node.material.emissiveIntensity = reduced ? 1.8 : 1.45 + 0.6 * Math.sin(elapsedTime * 1.6 + i); });
}
export function dispose({ instance }) { instance.unregister(); clearGroup(instance.group); }
