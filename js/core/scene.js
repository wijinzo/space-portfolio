import * as THREE from 'three';
import { COLORS } from '../config.js';
export function createScene(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.space);
  scene.fog = new THREE.FogExp2(COLORS.space, 0.009);
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 650);
  scene.add(camera);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  scene.add(new THREE.AmbientLight(0xa0b7ff, 1.4));
  const sun = new THREE.DirectionalLight(0xffdbb6, 2.7); sun.position.set(9, 12, 16); scene.add(sun);
  const rim = new THREE.PointLight(0x749dff, 100, 75); rim.position.set(-14, 5, -85); scene.add(rim);
  const stars = makeStars(); scene.add(stars);
  function resize() {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.5 : 2));
  }
  window.addEventListener('resize', resize);
  return { scene, camera, renderer, resize, dispose() {
    window.removeEventListener('resize', resize);
    stars.geometry.dispose(); stars.material.dispose();
    renderer.dispose();
  } };
}
function makeStars() {
  let seed = 5319;
  const rand = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
  const positions = [];
  for (let i = 0; i < 2200; i++) {
    const a = rand() * Math.PI * 2, r = 30 + rand() * 135;
    positions.push(Math.cos(a) * r, Math.sin(a) * r, 35 - rand() * 315);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xdfe7ff, size: 0.26, transparent: true, opacity: 0.85, sizeAttenuation: true }));
}
