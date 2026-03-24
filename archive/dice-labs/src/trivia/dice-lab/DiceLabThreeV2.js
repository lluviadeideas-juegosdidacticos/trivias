// DiceLabThreeV2.js
// Laboratorio mínimo, limpio y determinista de dado 3D con Three.js
// No depende de ningún otro archivo del lab

import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';

export function DiceLabThreeV2({ mount }) {
  // Escena
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Cámara
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(320, 320);
  renderer.setPixelRatio(window.devicePixelRatio);
  mount.appendChild(renderer.domElement);

  // Luz simple
  const light = new THREE.DirectionalLight(0xffffff, 1.1);
  light.position.set(2, 4, 5);
  scene.add(light);

  // Cubo simple (dado base)
  const diceSize = 2;
  const diceGeo = new THREE.BoxGeometry(diceSize, diceSize, diceSize);
  const diceMat = new THREE.MeshPhongMaterial({ color: 0x2196f3 });
  const diceMesh = new THREE.Mesh(diceGeo, diceMat);
  scene.add(diceMesh);

  // Estado inicial determinista
  diceMesh.rotation.set(0, 0, 0);
  renderer.render(scene, camera);

  // Rotar el cubo al hacer click
  renderer.domElement.style.cursor = 'pointer';
  renderer.domElement.addEventListener('pointerdown', () => {
    diceMesh.rotation.x += Math.PI / 2;
    diceMesh.rotation.y += Math.PI / 2;
    renderer.render(scene, camera);
  });
}
