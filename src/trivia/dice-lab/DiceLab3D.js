// [JANUS DICE V2 MARKER]
console.log("[JANUS DICE V2 MARKER]");
// DiceLab3D.js
// Laboratorio 3D limpio, determinista, sin overlays ni numeración
import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';

export function DiceLab3D({ mount, onResult }) {
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

  // ── JANUS DIAGNOSTICS (TEMP) ──────────────────────────────────────────────
  const _R2D = (r) => (typeof r === 'number' && !isNaN(r)) ? (r * 180 / Math.PI).toFixed(2) + '°' : '⚠NaN';
  const _fmt = (v) => (typeof v === 'number' && !isNaN(v)) ? v.toFixed(4) : `⚠NaN(${v})`;


  function _logState(label) {
    const r = diceMesh.rotation;
    const p = diceMesh.position;
    const s = diceMesh.scale;
    const inScene = scene.children.includes(diceMesh);
    const _frustum = new THREE.Frustum();
    const _m4 = new THREE.Matrix4();
    camera.updateMatrixWorld();
    _m4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    _frustum.setFromProjectionMatrix(_m4);
    diceMesh.geometry.computeBoundingBox();
    const _bb = diceMesh.geometry.boundingBox.clone().applyMatrix4(diceMesh.matrixWorld);
    const inFrustum = _frustum.intersectsBox(_bb);
    const rotZBad = typeof r.z !== 'number' || isNaN(r.z);
    console.group('[JANUS DICE] ' + label);
    console.log('face/rolledValue :', rolledValue);
    console.log('rotation rad     : x=%f  y=%f  z=%s', r.x, r.y, rotZBad ? '⚠NaN' : r.z);
    console.log('rotation deg     : x=%s  y=%s  z=%s', _R2D(r.x), _R2D(r.y), _R2D(r.z));
    console.log('position         : x=%f  y=%f  z=%f', p.x, p.y, p.z);
    console.log('scale            : x=%f  y=%f  z=%f', s.x, s.y, s.z);
    console.log('visible          :', diceMesh.visible);
    console.log('inScene          :', inScene, '(children count:', scene.children.length, ')');
    console.log('inFrustum        :', inFrustum);
    console.log('camera.position  : x=%f  y=%f  z=%f', camera.position.x, camera.position.y, camera.position.z);
    if (rotZBad) console.error('[JANUS DICE] ⚠ rotation.z is NaN — mesh will disappear');
    console.groupEnd();
    // (debug overlay removed)
  }
  // ── END JANUS DIAGNOSTICS SETUP ───────────────────────────────────────────

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

  // Estado determinista
  // Fuente de verdad
  let rolledValue = 1;
  let isAnimating = false; // bandera para bloquear clicks
  // Mapeo valor → orientación absoluta (canónica, oblicua)
  // Orientación canónica: cada valor deja su cara al frente
  // Shared idle tilt (copied from previous good faces)
  const idleTilt = { x: -0.3316, y: 0 };

  // Canonical orientation: puts correct face forward, no tilt
  function canonicalOrientationFor(value) {
    switch (value) {
      case 1: // right
        return { x: 0, y: -Math.PI / 2 };
      case 2: // left
        return { x: 0, y: Math.PI / 2 };
      case 3: // top (was bottom, swap with 4)
        return { x: Math.PI / 2, y: 0 };
      case 4: // bottom (was top, swap with 3)
        return { x: -Math.PI / 2, y: 0 };
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
    _logState('renderFace:' + phase + ':face=' + value);
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
    // Tiny yaw jitter for realism (±0.04 rad)
    orientationFor._jitter = (Math.random() - 0.5) * 0.08;
    const from = { x: diceMesh.rotation.x, y: diceMesh.rotation.y, z: diceMesh.rotation.z };
    const to = orientationFor(value);
    // Vueltas aleatorias completas (mínimo 1, máximo 2.5) en ambos ejes
    const minTurns = 1, maxTurns = 2.5;
    const turnsX = minTurns + Math.random() * (maxTurns - minTurns);
    const turnsY = minTurns + Math.random() * (maxTurns - minTurns);
    const targetX = to.x + Math.PI * 2 * turnsX;
    const targetY = to.y + Math.PI * 2 * turnsY;
    const targetZ = 0; // no roll — orientationFor returns no z, was undefined → NaN
    // ── JANUS: log animation start and targetZ provenance ──
    console.group('[JANUS DICE] animateTo:start face=' + value);
    console.log('from             : x=%f  y=%f  z=%f', from.x, from.y, from.z);
    console.log('to (orientationFor):', to, '  to.z =', to.z, typeof to.z === 'undefined' ? '⚠ UNDEFINED — will NaN rotation.z' : '');
    console.log('targetX=%f  targetY=%f  targetZ=%s', targetX, targetY, targetZ === undefined ? '⚠undefined' : targetZ);
    console.groupEnd();
    // ──────────────────────────────────────────────────────
    const duration = 900;
    const start = performance.now();
    let _frameCount = 0;
    function animate(now) {
      const t = Math.min((now - start) / duration, 1);
      // Ease in-out
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      diceMesh.rotation.x = from.x + (targetX - from.x) * ease;
      diceMesh.rotation.y = from.y + (targetY - from.y) * ease;
      diceMesh.rotation.z = from.z + (targetZ - from.z) * ease;
      // ── JANUS: log first frame and NaN onset ──
      if (_frameCount === 0) {
        console.warn('[JANUS DICE] animate:frame=0  rotation.z =', diceMesh.rotation.z, isNaN(diceMesh.rotation.z) ? '⚠ NaN — DISAPPEAR ONSET' : 'ok');
        // (debug overlay removed)
      }
      _frameCount++;
      // ──────────────────────────────────────────
      renderer.render(scene, camera);
      if (t < 1) requestAnimationFrame(animate);
      else {
        // ── JANUS: log last animation frame before renderFace ──
        console.warn('[JANUS DICE] animate:last-frame  rotation.z =', diceMesh.rotation.z, isNaN(diceMesh.rotation.z) ? '⚠ NaN' : 'ok');
        _logState('animateTo:landing:face=' + value);
        // ──────────────────────────────────────────────────────
        renderFace(value);
        isAnimating = false;
        if (typeof onResult === 'function') onResult(value);
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
    // ── JANUS: log state at click, before animation starts ──
    _logState('click:before-roll:currentFace=' + rolledValue + ':nextFace=' + v);
    // ────────────────────────────────────────────────────────
    animateTo(v);
  });

  // Inicial: cara 1 (oblicua)
  renderFace(1, 'initial');
  // ── JANUS: log scene children count (double-add check) ──
  console.warn('[JANUS DICE] scene.children after init:', scene.children.length, '(expect 3: light + diceMesh×2 if double-add bug present)');
  _logState('init-complete');
  // ────────────────────────────────────────────────────────
}
