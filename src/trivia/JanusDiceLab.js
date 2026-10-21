const STYLE_ID = 'janus-dice-lab-styles';

const FACE_ROTATIONS = Object.freeze({
  1: { x: 0, y: 0 },
  2: { x: 0, y: 180 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 90, y: 0 },
  6: { x: -90, y: 0 },
});

export function faceRotationFor(value) {
  const rotation = FACE_ROTATIONS[Number(value)];
  if (!rotation) throw new RangeError('El valor del dado debe estar entre 1 y 6.');
  return { x: rotation.x, y: rotation.y };
}

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = [
    '.janus-dice-lab { display: flex; justify-content: center; align-items: center; }',
    '.janus-dice-button { border: 0; padding: 8px; background: transparent; cursor: pointer; border-radius: 14px; }',
    '.janus-dice-button:focus-visible { outline: 3px solid #1a73e8; outline-offset: 3px; }',
    '.janus-dice-button:disabled { cursor: wait; }',
    '.janus-dice-stage { width: 132px; height: 132px; display: grid; place-items: center; perspective: 640px; }',
    '.janus-dice-cube { position: relative; width: 72px; height: 72px; transform-style: preserve-3d; transform: rotateX(0deg) rotateY(0deg); transition: transform 950ms cubic-bezier(.2,.8,.2,1); }',
    '.janus-dice-face { position: absolute; inset: 0; display: grid; place-items: center; border: 2px solid #1a73e8; border-radius: 8px; background: #fff; box-shadow: inset 0 0 0 4px #f5faff; color: #1a2a2a; font: 800 2rem system-ui, sans-serif; backface-visibility: hidden; }',
    '.janus-dice-face--front { transform: translateZ(36px); }',
    '.janus-dice-face--back { transform: rotateY(180deg) translateZ(36px); }',
    '.janus-dice-face--right { transform: rotateY(90deg) translateZ(36px); }',
    '.janus-dice-face--left { transform: rotateY(-90deg) translateZ(36px); }',
    '.janus-dice-face--top { transform: rotateX(90deg) translateZ(36px); }',
    '.janus-dice-face--bottom { transform: rotateX(-90deg) translateZ(36px); }',
    '.janus-dice-button:hover .janus-dice-cube { filter: drop-shadow(0 5px 7px rgba(0,0,0,.16)); }',
    '.janus-dice-live { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }',
    '@media (prefers-reduced-motion: reduce) { .janus-dice-cube { transition-duration: 1ms; } }',
  ].join('\n');

  const target = document.head || document.documentElement;
  if (target) target.appendChild(style);
}

export function JanusDiceLab({ mount, onResult } = {}) {
  if (!mount) return;
  ensureStyles();

  const root = document.createElement('div');
  root.className = 'janus-dice-lab';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'janus-dice-button';
  button.setAttribute('aria-label', 'Lanzar dado');
  button.title = 'Lanzar dado';

  const stage = document.createElement('span');
  stage.className = 'janus-dice-stage';
  stage.setAttribute('aria-hidden', 'true');

  const cube = document.createElement('span');
  cube.className = 'janus-dice-cube';
  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  faces.forEach((face, index) => {
    const faceEl = document.createElement('span');
    faceEl.className = 'janus-dice-face janus-dice-face--' + face;
    faceEl.textContent = String(index + 1);
    cube.appendChild(faceEl);
  });
  stage.appendChild(cube);
  button.appendChild(stage);

  const live = document.createElement('span');
  live.className = 'janus-dice-live';
  live.setAttribute('aria-live', 'polite');
  live.textContent = 'Tocá el dado para lanzarlo.';

  root.appendChild(button);
  root.appendChild(live);
  mount.appendChild(root);

  let rolling = false;
  let rollCount = 0;
  button.addEventListener('click', () => {
    if (rolling) return;
    rolling = true;
    button.disabled = true;
    rollCount += 1;

    const result = Math.floor(Math.random() * 6) + 1;
    const rotation = faceRotationFor(result);
    const turns = 2 + (rollCount % 2);
    cube.style.transform = 'rotateX(' + (rotation.x + 360 * turns) + 'deg) rotateY(' + (rotation.y + 360 * (turns + 1)) + 'deg)';
    live.textContent = 'El dado está girando.';

    window.setTimeout(() => {
      rolling = false;
      button.disabled = false;
      live.textContent = 'Salió ' + result + '. Tocá para volver a lanzar.';
      if (typeof onResult === 'function') onResult(result);
    }, 1000);
  });

  return { element: root };
}