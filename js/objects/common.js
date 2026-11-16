import * as THREE from 'three';
export { THREE };
export function sphere(radius, color, segments = 40, materialOptions = {}) {
  return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, Math.max(20, Math.round(segments * 0.7))),
    new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.08, ...materialOptions }));
}
export function torus(radius, tube, color, rotation = [0.45, 0.1, 0]) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 12, 100), new THREE.MeshStandardMaterial({ color, roughness: 0.7, side: THREE.DoubleSide, transparent: true, opacity: 0.85 }));
  mesh.rotation.set(...rotation); return mesh;
}
export function glow(color, radius = 1.3, opacity = 0.25) {
  const mesh = sphere(radius, color, 28, { emissive: color, emissiveIntensity: 0.6, transparent: true, opacity, depthWrite: false });
  return mesh;
}
export function clearGroup(group) {
  group.traverse(obj => { if (obj.geometry) obj.geometry.dispose(); if (obj.material) {
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    mats.forEach(m => m.dispose());
  } });
  group.parent?.remove(group);
}
export function createGroup(scene, z) { const group = new THREE.Group(); group.position.z = z; scene.add(group); return group; }
