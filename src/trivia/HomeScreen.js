export function HomeScreen({ mount, onStart }) {
  // Contenedor principal
  const root = document.createElement('div');
  root.className = 'home-root';

  // Logo principal
  const logo = document.createElement('img');
  logo.src = './assets/logo_impactoambiental.gif';
  logo.alt = 'Impacto Ambiental';
  logo.className = 'home-logo';
  root.appendChild(logo);

  // Título
  const subtitle = document.createElement('h2');
  subtitle.className = 'home-subtitle';
  subtitle.textContent = 'Guía de Cuestiones 2.0';
  root.appendChild(subtitle);

  // Texto introductorio
  const intro = document.createElement('div');
  intro.className = 'home-intro';
  intro.innerHTML = `
    <p>Bienvenido a la Guía de Cuestiones 2.0.<br>
    Selecciona tus casillas, lanza el dado y explora preguntas para reflexionar sobre el impacto ambiental.</p>
  `;
  root.appendChild(intro);

  // Celdas de entrada
  const inputBox = document.createElement('div');
  inputBox.className = 'home-input-box';
  const inputs = [];
  for (let i = 0; i < 3; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.max = '6';
    input.value = (i + 1).toString();
    input.className = 'home-input';
    input.setAttribute('aria-label', `Casilla ${i + 1}`);
    inputBox.appendChild(input);
    inputs.push(input);
  }
  root.appendChild(inputBox);

  // Dado 3D
  const diceContainer = document.createElement('div');
  diceContainer.className = 'dice-container';
  const dice = document.createElement('div');
  dice.className = 'dice';
  diceContainer.appendChild(dice);
  root.appendChild(diceContainer);

  // Caras del dado (single-axis, X)
  const faces = [
    { num: 1, transform: 'rotateX(0deg) translateZ(50px)' },
    { num: 2, transform: 'rotateX(-90deg) translateZ(50px)' },
    { num: 3, transform: 'rotateX(-180deg) translateZ(50px)' },
    { num: 4, transform: 'rotateX(90deg) translateZ(50px)' },
    { num: 5, transform: 'rotateX(270deg) translateZ(50px)' },
    { num: 6, transform: 'rotateX(90deg) rotateZ(180deg) translateZ(50px)' },
  ];
  faces.forEach(face => {
    const f = document.createElement('div');
    f.className = 'dice-face';
    f.style.transform = face.transform;
    f.textContent = face.num;
    dice.appendChild(f);
  });

  // Estado del dado
  let currentValue = 1;
  let animating = false;

  function rollDice(toValue) {
    if (animating || toValue < 1 || toValue > 6) return;
    animating = true;
    const from = currentValue;
    const to = toValue;
    let base = (from - 1) * 90;
    let diff = ((to - from + 6) % 6);
    let target = base - diff * 90;
    // If rolling the same value, force a quick reset to a different face, then animate to the target
    if (from === to) {
      // Pick a temporary face (always different)
      const temp = (from % 6) + 1;
      const tempBase = (from - 1) * 90;
      const tempDiff = ((temp - from + 6) % 6);
      const tempTarget = tempBase - tempDiff * 90;
      dice.style.transition = 'none';
      dice.style.transform = `rotateX(${tempTarget}deg)`;
      // Force reflow
      void dice.offsetWidth;
      setTimeout(() => {
        dice.style.transition = 'transform 0.7s cubic-bezier(.25,1.5,.5,1)';
        dice.style.transform = `rotateX(${base}deg)`;
        setTimeout(() => {
          dice.style.transform = `rotateX(${target}deg)`;
          setTimeout(() => {
            currentValue = to;
            animating = false;
          }, 700);
        }, 20);
      }, 20);
    } else {
      dice.style.transition = 'transform 0.7s cubic-bezier(.25,1.5,.5,1)';
      dice.style.transform = `rotateX(${target}deg)`;
      setTimeout(() => {
        currentValue = to;
        animating = false;
      }, 700);
    }
  }

  // Interacción: click en el dado genera valor aleatorio, anima y carga casilla
  diceContainer.style.cursor = 'pointer';
  diceContainer.title = 'Lanzar dado';
  diceContainer.onclick = () => {
    const rolledValue = Math.floor(Math.random() * 6) + 1;
    rollDice(rolledValue);
    // Cargar en la siguiente casilla vacía (de izquierda a derecha)
    for (let i = 0; i < inputs.length; i++) {
      if (!inputs[i].value || isNaN(parseInt(inputs[i].value, 10)) || inputs[i].value === '' || inputs[i].value === '0') {
        inputs[i].value = rolledValue;
        break;
      }
    }
  };

  // Botón "Ver pregunta" solo navega
  const button = document.createElement('button');
  button.className = 'home-btn';
  button.textContent = 'Ver pregunta';
  button.onclick = () => {
    const values = inputs.map(input => {
      let v = parseInt(input.value, 10);
      if (isNaN(v) || v < 1) v = 1;
      if (v > 6) v = 6;
      input.value = v;
      return v;
    });
    const generatedNumber = Number(values.join(''));
    if (typeof onStart === 'function') {
      onStart(generatedNumber);
    }
  };
  root.appendChild(button);

  // Footer con isologo
  const footer = document.createElement('footer');
  footer.className = 'home-footer';
  const isologo = document.createElement('img');
  isologo.src = './assets/isologo_negro.svg';
  isologo.alt = 'Isologo';
  isologo.className = 'footer-isologo prominent';
  footer.appendChild(isologo);
  root.appendChild(footer);

  // Montar en el DOM
  mount.appendChild(root);

  // CSS mínimo (puede moverse a styles.css)
  const style = document.createElement('style');
  style.textContent = `
    .home-root {
      font-family: system-ui, sans-serif;
      width: 100%;
      max-width: 720px;
      margin: 0 auto;
      padding: 32px 16px 16px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 22px;
      min-height: 100vh;
      box-sizing: border-box;
      justify-content: center;
    }
    .home-logo {
      display: block;
      margin: 0 auto;
      width: 180px;
      max-width: 90vw;
    }
    .home-subtitle { text-align: center; font-size: 1.5rem; margin: 0; color: #1a2a2a; }
    .home-intro { text-align: center; color: #2a2a2a; font-size: 1.05rem; margin: 0; }
    .home-input-box { display: flex; gap: 8px; justify-content: center; }
    .home-input { width: 36px; font-size: 1.1rem; text-align: center; border: 1px solid #bbb; border-radius: 6px; padding: 4px; }
    .dice-container { perspective: 400px; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
    .dice { width: 100px; height: 100px; position: relative; transform-style: preserve-3d; transition: transform 0.7s cubic-bezier(.25,1.5,.5,1); }
    .dice-face { position: absolute; width: 100px; height: 100px; background: #fff; border: 2px solid #1a2a2a; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: bold; color: #1a2a2a; box-shadow: 0 2px 8px #0002; }
    .home-btn { background: #1a2a2a; color: #fff; border: none; border-radius: 8px; padding: 10px 22px; font-size: 1.1rem; cursor: pointer; transition: background 0.2s; margin-top: 0; }
    .home-btn:hover { background: #2e4a4a; }
    .home-footer { margin-top: 28px; text-align: center; width: 100%; }
    .footer-isologo.prominent { display: block; margin: 0 auto; width: 110px; max-width: 60vw; opacity: 1; filter: none; }
  `;
  document.head.appendChild(style);
}
