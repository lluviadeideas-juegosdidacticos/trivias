// DiceLab.js
// Laboratorio de dado 3D aislado para desarrollo y pruebas visuales
// No impacta HomeScreen ni la trivia principal

// Dado 3D determinista, estable y reutilizable
export function DiceLab({ mount }) {
  // Estado interno
  let currentValue = 1;
  let isAnimating = false;

  // Mapeo de caras a transformaciones canónicas
  const faceTransforms = [
    'rotateX(0deg) rotateY(0deg) translateZ(50px)',    // 1
    'rotateX(-90deg) rotateY(0deg) translateZ(50px)',  // 2
    'rotateX(0deg) rotateY(90deg) translateZ(50px)',   // 3
    'rotateX(0deg) rotateY(-90deg) translateZ(50px)',  // 4
    'rotateX(90deg) rotateY(0deg) translateZ(50px)',   // 5
    'rotateX(0deg) rotateY(180deg) translateZ(50px)',  // 6
  ];

  // --- UI base ---
  const root = document.createElement('div');
  root.style.display = 'flex';
  root.style.flexDirection = 'column';
  root.style.alignItems = 'center';
  root.style.justifyContent = 'center';
  root.style.gap = '24px';
  root.style.minHeight = '100vh';

  const title = document.createElement('h2');
  title.textContent = 'Laboratorio de Dado 3D';
  root.appendChild(title);

  // Escena y plano de apoyo
  const scene = document.createElement('div');
  scene.className = 'dice-lab-scene';
  scene.style.position = 'relative';
  scene.style.width = '120px';
  scene.style.height = '120px';
  scene.style.display = 'flex';
  scene.style.alignItems = 'flex-end';
  scene.style.justifyContent = 'center';
  scene.style.perspective = '400px';

  // Piso/sombra
  const floor = document.createElement('div');
  floor.className = 'dice-lab-floor';
  floor.style.position = 'absolute';
  floor.style.left = '50%';
  floor.style.bottom = '18px';
  floor.style.transform = 'translateX(-50%)';
  floor.style.width = '70px';
  floor.style.height = '18px';
  floor.style.borderRadius = '50%';
  floor.style.background = 'radial-gradient(ellipse at center, #0002 60%, transparent 100%)';
  floor.style.zIndex = '0';
  scene.appendChild(floor);

  // Cubo
  const dice = document.createElement('div');
  dice.className = 'dice-lab';
  dice.style.position = 'absolute';
  dice.style.left = '50%';
  dice.style.bottom = '36px';
  dice.style.transform = 'translateX(-50%)';
  scene.appendChild(dice);

  scene.style.margin = '0 auto';
  scene.style.userSelect = 'none';
  scene.title = 'Lanzar dado';
  scene.style.cursor = 'pointer';
  root.appendChild(scene);

  // Caras
  for (let i = 0; i < 6; i++) {
    const f = document.createElement('div');
    f.className = 'dice-lab-face';
    // Cada cara se posiciona a Z=50px desde el centro del cubo
    f.style.transform = faceTransforms[i];
    f.textContent = (i + 1).toString();
    dice.appendChild(f);
  }

  // --- Funciones del dado ---

  // 1. roll(): devuelve un número aleatorio entre 1 y 6
  function roll() {
    return Math.floor(Math.random() * 6) + 1;
  }

  // 2. render(value): posiciona el cubo en la cara correcta, sin animación
  function render(value) {
    if (value < 1 || value > 6) return;
    dice.style.transition = 'none';
    // Siempre girar respecto al centro del cubo
    dice.style.transformOrigin = '50% 50% 50px';
    dice.style.transform = faceTransforms[value - 1];
    currentValue = value;
    isAnimating = false;
  }

  // 3. animateTo(value): anima desde el estado actual hasta la cara de value
  function animateTo(value) {
    if (isAnimating || value < 1 || value > 6) return;
    isAnimating = true;
    // Siempre terminar en posición canónica
    // Estrategia: sumar mínimo 2 vueltas completas al eje principal
    const from = currentValue;
    const to = value;
    const parse = t => {
      const x = parseInt(t.match(/rotateX\((-?\d+)deg\)/)[1], 10);
      const y = parseInt(t.match(/rotateY\((-?\d+)deg\)/)[1], 10);
      return { x, y };
    };
    const fromAngles = parse(faceTransforms[from - 1]);
    const toAngles = parse(faceTransforms[to - 1]);
    // Elegir eje principal (X o Y) según el movimiento
    const axis = Math.abs(toAngles.x - fromAngles.x) >= Math.abs(toAngles.y - fromAngles.y) ? 'x' : 'y';
    const minTurns = 2;
    let xFinal = toAngles.x;
    let yFinal = toAngles.y;
    if (axis === 'x') {
      xFinal += 360 * (minTurns + Math.floor(Math.random() * 2)); // 2-3 vueltas
    } else {
      yFinal += 360 * (minTurns + Math.floor(Math.random() * 2));
    }
    dice.style.transition = 'transform 1.1s cubic-bezier(.25,1.5,.5,1)';
    dice.style.transformOrigin = '50% 50% 50px';
    dice.style.transform = `rotateX(${xFinal}deg) rotateY(${yFinal}deg) translateZ(0)`;
    setTimeout(() => {
      render(to); // Snap canónico
    }, 1100);
  }

  // --- Interfaz de prueba ---
  const btnRoll = document.createElement('button');
  btnRoll.textContent = 'Tirar dado (roll)';
  btnRoll.onclick = () => {
    const v = roll();
    animateTo(v);
  };
  root.appendChild(btnRoll);

  const btnSet = document.createElement('button');
  btnSet.textContent = 'Mostrar cara 1 (render)';
  btnSet.onclick = () => render(1);
  root.appendChild(btnSet);

  // CSS
  const style = document.createElement('style');
  style.textContent = `
    .dice-lab-scene {
      width: 120px;
      height: 120px;
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      perspective: 400px;
      user-select: none;
    }
    .dice-lab-floor {
      pointer-events: none;
    }
    .dice-lab {
      width: 100px;
      height: 100px;
      position: absolute;
      left: 50%;
      bottom: 36px;
      transform: translateX(-50%);
      transform-style: preserve-3d;
      transition: transform 1.1s cubic-bezier(.25,1.5,.5,1);
      backface-visibility: hidden;
      transform-origin: 50% 50% 50px;
    }
    .dice-lab-face {
      position: absolute;
      width: 100px;
      height: 100px;
      background: #fff;
      border: 2px solid #1a2a2a;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: bold;
      color: #1a2a2a;
      box-shadow: 0 2px 8px #0002;
      backface-visibility: hidden;
    }
  `;
  document.head.appendChild(style);

  // Inicializar en cara 1
  render(1);
  mount.appendChild(root);
}
