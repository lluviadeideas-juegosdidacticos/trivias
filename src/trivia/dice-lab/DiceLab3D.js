// [JANUS DICE V2 MARKER]
console.log("[JANUS DICE V2 MARKER]");
// DiceLab3D.js
// Laboratorio 3D limpio, determinista, sin overlays ni numeración
import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';

export function DiceLab3D({ mount }) {
  // Escena
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf9fafb);

  // Cámara
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(320, 320);
  renderer.setPixelRatio(window.devicePixelRatio);
  mount.appendChild(renderer.domElement);

  // Luz básica
  const light = new THREE.DirectionalLight(0xffffff, 1.1);
  light.position.set(2, 4, 5);
  scene.add(light);

  // Dado 3D: 6 materiales numerados (canvas por cara)
  const diceSize = 2;
  // Cubo clásico estable
  const diceGeo = new THREE.BoxGeometry(diceSize, diceSize, diceSize);
  // BoxGeometry face order: 0 right, 1 left, 2 top, 3 bottom, 4 front, 5 back
  // We want: 1=front, 2=back, 3=right, 4=left, 5=top, 6=bottom
  const faceOrder = [4, 5, 0, 1, 2, 3];
  const diceMaterials = faceOrder.map(idx => {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 128, 128);
    ctx.font = 'bold 84px system-ui, sans-serif';
    ctx.fillStyle = '#000'; // negro puro
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((faceOrder.indexOf(idx) + 1).toString(), 64, 72);
    const tex = new THREE.CanvasTexture(canvas);
    return new THREE.MeshBasicMaterial({ map: tex });
  });
  const diceMesh = new THREE.Mesh(diceGeo, diceMaterials);
  scene.add(diceMesh);

  // Bordes mínimos: EdgesGeometry + LineSegments (negro, linewidth default)
  const edges = new THREE.EdgesGeometry(diceGeo);
  const edgeLines = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x000000 })
  );
  diceMesh.add(edgeLines);
  scene.add(diceMesh);

  // Estado determinista
  // Fuente de verdad
  let rolledValue = 1;
  let isAnimating = false; // bandera para bloquear clicks
  // Mapeo valor → orientación absoluta (canónica, oblicua)
  // Orientación canónica: cada valor deja su cara al frente
  // Shared idle tilt (copied from previous good faces)
  const idleTilt = { x: -0.35, y: 0.18 };

  // Canonical orientation: puts correct face forward, no tilt
  function canonicalOrientationFor(value) {
    switch (value) {
      case 1: // right
        return { x: 0, y: -Math.PI / 2 };
      case 2: // left
        return { x: 0, y: Math.PI / 2 };
      case 3: // bottom
        return { x: -Math.PI / 2, y: 0 };
      case 4: // top
        return { x: Math.PI / 2, y: 0 };
      case 5: // front
        return { x: 0, y: 0 };
      case 6: // back
        return { x: 0, y: Math.PI };
      default:
        return { x: 0, y: 0 };
    }
  }

  // Final orientation: canonical + shared idle tilt
  function orientationFor(value) {
    const base = canonicalOrientationFor(value);
    return {
      x: base.x + idleTilt.x,
      y: base.y + idleTilt.y
    };
  }
  // Renderizar cara
  function renderFace(value, phase = 'final') {
    const o = orientationFor(value);
    diceMesh.rotation.x = o.x;
    diceMesh.rotation.y = o.y;
    rolledValue = value;
    renderer.render(scene, camera);
    // Debug telemetry
    if (typeof window !== 'undefined') {
      if (!window.diceDebug) {
        window.diceDebug = {
          _state: null,
          _history: [],
          getState() { return this._state; },
          getHistory() { return this._history.slice(); },
          showFace: null, // will be set below
          getCurrentFaceRequest() { return this._state ? this._state.requestedFace : undefined; }
        };
      }
      const debugObj = {
        requestedFace: value,
        rotationX: diceMesh.rotation.x,
        rotationY: diceMesh.rotation.y,
        rotationZ: diceMesh.rotation.z,
        timestamp: Date.now(),
        phase,
        marker: "JANUS_DICE_V2"
      };
      window.diceDebug._state = debugObj;
      window.diceDebug._history.push({ ...debugObj });
      // Expose showFace(n) for manual debug
      window.diceDebug.showFace = function(n) {
        if (typeof n !== 'number' || n < 1 || n > 6) return;
        renderFace(n, 'manual');
      };
    }
  }
  // Animar giro hasta la orientación final
  function animateTo(value) {
    if (value === rolledValue || isAnimating) return;
    isAnimating = true;
    const from = { x: diceMesh.rotation.x, y: diceMesh.rotation.y };
    const to = orientationFor(value);
    // Vueltas aleatorias completas (mínimo 1, máximo 2.5) en ambos ejes
    const minTurns = 1, maxTurns = 2.5;
    const turnsX = minTurns + Math.random() * (maxTurns - minTurns);
    const turnsY = minTurns + Math.random() * (maxTurns - minTurns);
    const targetX = to.x + Math.PI * 2 * turnsX;
    const targetY = to.y + Math.PI * 2 * turnsY;
    const duration = 900;
    const start = performance.now();
    function animate(now) {
      const t = Math.min((now - start) / duration, 1);
      // Ease in-out
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      diceMesh.rotation.x = from.x + (targetX - from.x) * ease;
      diceMesh.rotation.y = from.y + (targetY - from.y) * ease;
      renderer.render(scene, camera);
      if (t < 1) requestAnimationFrame(animate);
      else {
        renderFace(value);
        isAnimating = false;
      }
    }
    requestAnimationFrame(animate);
  }

  // Interacción: click → valor 1–6, animación de giro
  renderer.domElement.style.cursor = 'pointer';
  renderer.domElement.addEventListener('pointerdown', () => {
    if (isAnimating) return;
    let v;
    do {
      v = Math.floor(Math.random() * 6) + 1;
    } while (v === rolledValue);
    animateTo(v);
  });

  // Inicial: cara 1 (oblicua)
  renderFace(1, 'initial');
}
