import { THREE, sphere, torus, createGroup, clearGroup } from './common.js';
export function create({ scene, station, interactionManager, onDetails }) {
  const group = createGroup(scene, -160);
  const planet = sphere(7.2, 0xc18776, 64, { roughness: 0.83, emissive: 0x2d121f, emissiveIntensity: 0.18 });
  planet.position.set(5, -0.1, -1); group.add(planet);
  for (let i = 0; i < 11; i++) {
    const latitude = -1.18 + i * 0.23;
    const band = new THREE.Mesh(new THREE.TorusGeometry(7.22 * Math.cos(latitude), 0.09 + (i % 3) * 0.06, 9, 120),
      new THREE.MeshStandardMaterial({ color: i % 2 ? 0xebba9e : 0x925d6e, transparent: true, opacity: 0.75, roughness: 0.9 }));
    band.position.set(0, Math.sin(latitude) * 7.2, 0);
    band.rotation.x = Math.PI / 2; planet.add(band);
  }
  const rings = new THREE.Group(); rings.position.copy(planet.position);
  for (let i = 0; i < 6; i++) rings.add(torus(8.9 + i * 0.67, 0.14 + i * 0.018, i % 2 ? 0xffcfaa : 0xa08ec6, [Math.PI / 2.7, 0.26, 0.2]));
  group.add(rings);
  const hotspot = sphere(0.47, 0xffe6b9, 20, { emissive: 0xffad65, emissiveIntensity: 2.2 });
  hotspot.position.set(-0.3, 2.9, 4); group.add(hotspot);
  let dragX = 0, dragY = 0;
  const unregister = [
    interactionManager.register(station.id, 'planetHotspot', hotspot, () => onDetails(station),
      hovered => hotspot.scale.setScalar(hovered ? 1.65 : 1)),
    interactionManager.register(station.id, 'gas_giant_surface', planet, () => onDetails(station),
      () => {}, { onDrag: ({ dx, dy }) => {
        dragX += dx * .006;
        dragY = THREE.MathUtils.clamp(dragY + dy * .004, -.55, .55);
      } }),
  ];
  return { group, planet, rings, hotspot, unregister, getDrag: () => ({ x: dragX, y: dragY }) };
}
export function update({ instance, elapsedTime, reduced }) {
  instance.planet.rotation.y = (reduced ? 0 : elapsedTime * 0.035) + instance.getDrag().x;
  instance.planet.rotation.x = instance.getDrag().y;
  instance.rings.rotation.y = reduced ? 0 : Math.sin(elapsedTime * 0.12) * 0.06;
  instance.hotspot.scale.setScalar(reduced ? 1 : 1 + 0.1 * Math.sin(elapsedTime * 3));
}
export function dispose({ instance }) { instance.unregister.forEach(fn => fn()); clearGroup(instance.group); }
