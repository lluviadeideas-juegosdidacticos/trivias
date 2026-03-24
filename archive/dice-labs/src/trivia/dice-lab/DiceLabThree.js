// DiceLabThree.js
// Laboratorio de dado 3D con Three.js (aislado)
// No impacta la trivia principal

import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';

export function DiceLabThree({ mount }) {
  // Escena
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Cámara
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(0, 2.5, 5);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(320, 320);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  mount.appendChild(renderer.domElement);

  // Luz
  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.95);
  dir.position.set(3, 5, 4);
  scene.add(dir);

  // Piso
  const floorGeo = new THREE.CircleGeometry(1.2, 32);
  const floorMat = new THREE.MeshPhongMaterial({ color: 0xdddddd, transparent: true, opacity: 0.5 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.01;
  scene.add(floor);

  // Dado (cubo base blanco puro)
  const diceSize = 2;
  const diceGeo = new THREE.BoxGeometry(diceSize, diceSize, diceSize);
  const diceMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.0,
  });
  const diceMesh = new THREE.Mesh(diceGeo, diceMaterial);
  diceMesh.position.y = 0;
  scene.add(diceMesh);

  // Overlays de numeración (planes con textura transparente y diagnóstico)
  const overlaySize = 1.98; // un poco menor que el cubo
  const overlayDistance = diceSize / 2 + 0.01;
  const overlayData = [
    // +Z, -Z, +X, -X, +Y, -Y
    { normal: [0, 0, 1], value: 1, color: '#ff2222' }, // rojo
    { normal: [0, 0, -1], value: 6, color: '#22ff22' }, // verde
    { normal: [1, 0, 0], value: 3, color: '#2222ff' }, // azul
    { normal: [-1, 0, 0], value: 4, color: '#ffff22' }, // amarillo
    { normal: [0, 1, 0], value: 5, color: '#ff22ff' }, // magenta
    { normal: [0, -1, 0], value: 2, color: '#22ffff' }, // cian
  ];
  const overlayPlanes = [];
  overlayData.forEach(({ normal, value, color }, idx) => {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 128, 128);
    // Fondo diagnóstico por cara
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 128, 128);
    // Números negro puro, gruesos
    ctx.font = 'bold 84px system-ui, sans-serif';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(value.toString(), 64, 72);
    // Borde negro fuerte
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    ctx.strokeRect(4, 4, 120, 120);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: false,
      opacity: 1.0,
      color: 0xffffff,
      depthWrite: false,
      depthTest: true,
      side: THREE.FrontSide,
    });
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(overlaySize, overlaySize),
      mat
    );
    // Posicionar el overlay más cerca de la cara
    const closer = overlayDistance + 0.01;
    plane.position.set(
      normal[0] * closer,
      normal[1] * closer,
      normal[2] * closer
    );
    // Orientar el overlay
    if (normal[0] !== 0) plane.rotation.y = Math.PI / 2 * -normal[0];
    if (normal[1] !== 0) plane.rotation.x = Math.PI / 2 * normal[1];
    // (Z no necesita rotación extra)
    diceMesh.add(plane);
    // Guardar para diagnóstico
    overlayPlanes.push({
      idx,
      value,
      normal,
      position: { ...plane.position },
      rotation: { x: plane.rotation.x, y: plane.rotation.y, z: plane.rotation.z },
      material: {
        side: mat.side,
        depthWrite: mat.depthWrite,
        depthTest: mat.depthTest,
      },
    });
  });

  // Estado
  let currentValue = 1;
  let isAnimating = false;

  // Mapeo de caras a rotaciones canónicas (explícito y absoluto)
  function orientationFor(value) {
    switch (value) {
      case 1: // frente
        return { x: 0, y: 0 };
      case 2: // atrás
        return { x: 0, y: Math.PI };
      case 3: // derecha
        return { x: 0, y: -Math.PI / 2 };
      case 4: // izquierda
        return { x: 0, y: Math.PI / 2 };
      case 5: // arriba
        return { x: -Math.PI / 2, y: 0 };
      case 6: // abajo
        return { x: Math.PI / 2, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  }

  // Renderiza cara sin animación
  function renderFace(value) {
    const o = orientationFor(value);
    diceMesh.rotation.x = o.x;
    diceMesh.rotation.y = o.y;
    currentValue = value;
    isAnimating = false;
    renderer.render(scene, camera);
  }

  // Animar hasta una cara, combinando X+Y, nunca solo un eje
  function animateTo(value) {
    if (isAnimating || value < 1 || value > 6) return;
    isAnimating = true;
    const from = { x: diceMesh.rotation.x, y: diceMesh.rotation.y };
    const to = orientationFor(value);
    // Siempre al menos 2 vueltas en ambos ejes, y nunca solo uno
    const minTurns = 2;
    let xTarget = to.x + Math.PI * 2 * (minTurns + Math.floor(Math.random() * 2));
    let yTarget = to.y + Math.PI * 2 * (minTurns + Math.floor(Math.random() * 2));
    // Aleatorizar sentido de giro para naturalidad
    if (Math.random() < 0.5) xTarget *= -1;
    if (Math.random() < 0.5) yTarget *= -1;
    const duration = 1200;
    const start = performance.now();
    function animate(now) {
      const t = Math.min((now - start) / duration, 1);
      diceMesh.rotation.x = from.x + (xTarget - from.x) * t;
      diceMesh.rotation.y = from.y + (yTarget - from.y) * t;
      renderer.render(scene, camera);
      if (t < 1) requestAnimationFrame(animate);
      else {
        renderFace(value);
      }
    }
    requestAnimationFrame(animate);
  }

  // Función para tirar el dado
  function rollValue() {
    return Math.floor(Math.random() * 6) + 1;
  }

  // Trigger por click directo en el dado usando raycaster
  renderer.domElement.style.cursor = 'pointer';
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  function onPointerDown(event) {
    // Convertir a coordenadas normalizadas
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(diceMesh);
    if (intersects.length > 0 && !isAnimating) {
      const v = rollValue();
      animateTo(v);
    }
  }

  // --- Diagnóstico: Recorrido automático de caras y overlay HTML ---
  let diagIndex = 0;
  const diagOverlay = document.createElement('div');
  diagOverlay.style.position = 'absolute';
  diagOverlay.style.top = '12px';
  diagOverlay.style.left = '12px';
  diagOverlay.style.background = 'rgba(0,0,0,0.7)';
  diagOverlay.style.color = '#fff';
  diagOverlay.style.fontSize = '1.5em';
  diagOverlay.style.padding = '0.3em 0.8em';
  diagOverlay.style.borderRadius = '8px';
  diagOverlay.style.zIndex = '1000';
  diagOverlay.style.fontFamily = 'monospace';
  diagOverlay.textContent = 'Diagnóstico dado';
  mount.style.position = 'relative';
  mount.appendChild(diagOverlay);

  function showDiag(idx) {
    const face = idx + 1;
    renderFace(face);
    diagOverlay.textContent = `Cara objetivo: ${face}`;
    // Loggear overlays
    console.log(`\n--- Overlay config para cara ${face} ---`);
    overlayPlanes.forEach((o, i) => {
      console.log(`Overlay #${i+1} (valor: ${o.value})`);
      console.log('  normal:', o.normal);
      console.log('  position:', o.position);
      console.log('  rotation:', o.rotation);
      console.log('  material:', o.material);
    });
  }
  function diagLoop() {
    showDiag(diagIndex);
    diagIndex = (diagIndex + 1) % 6;
    setTimeout(diagLoop, 1500);
  }
  diagLoop();
  // --- Fin diagnóstico ---
}
