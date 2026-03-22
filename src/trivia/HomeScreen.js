export function HomeScreen(mount) {
  // Contenedor principal
  const root = document.createElement('div');
  root.className = 'home-root';

  // Logo principal
  const logo = document.createElement('img');
  logo.src = '/assets/logo_impactoambiental.gif';
  logo.alt = 'Impacto Ambiental';
  logo.className = 'home-logo';
  root.appendChild(logo);

  // Subtítulo
  const subtitle = document.createElement('h2');
  subtitle.className = 'home-subtitle';
  subtitle.textContent = 'Guía de Cuestiones 2.0';
  root.appendChild(subtitle);

  // Contenedor de controles
  const controls = document.createElement('div');
  controls.className = 'home-controls';

  // Inputs 1–6
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
  controls.appendChild(inputBox);

  // Dado 3D single-axis
  const diceContainer = document.createElement('div');
  diceContainer.className = 'dice-container';
  const dice = document.createElement('div');
  dice.className = 'dice';
  diceContainer.appendChild(dice);
  controls.appendChild(diceContainer);

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
    const diff = ((to - from + 6) % 6);
    const base = (from - 1) * 90;
    const target = base - diff * 90;
    dice.style.transition = 'transform 0.7s cubic-bezier(.25,1.5,.5,1)';
    dice.style.transform = `rotateX(${target}deg)`;
    setTimeout(() => {
      currentValue = to;
      animating = false;
    }, 700);
  }

  // Botón "Ver pregunta"
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
    rollDice(values[0]);
    // Aquí se puede agregar lógica para mostrar la pregunta
  };
  controls.appendChild(button);

  root.appendChild(controls);

  // Texto introductorio final
  const intro = document.createElement('div');
  intro.className = 'home-intro';
  intro.innerHTML = `
    <p>Bienvenido a la Guía de Cuestiones 2.0.<br>
    Selecciona tus casillas, lanza el dado y explora preguntas para reflexionar sobre el impacto ambiental.</p>
  `;
  root.appendChild(intro);

  // Footer con isologo
  const footer = document.createElement('footer');
  footer.className = 'home-footer';
  const isologo = document.createElement('img');
  isologo.src = '/assets/isologo_negro.svg';
  isologo.alt = 'Isologo';
  isologo.className = 'footer-isologo';
  footer.appendChild(isologo);
  root.appendChild(footer);

  // Montar en el DOM
  mount.appendChild(root);

  // CSS mínimo (puede moverse a styles.css)
  const style = document.createElement('style');
  style.textContent = `
    .home-root { font-family: system-ui, sans-serif; max-width: 420px; margin: 0 auto; padding: 24px 8px 0 8px; background: #fff; border-radius: 18px; box-shadow: 0 2px 16px #0001; }
    .home-logo { display: block; margin: 0 auto 12px auto; width: 120px; }
    .home-subtitle { text-align: center; font-size: 1.3rem; margin: 0 0 18px 0; color: #1a2a2a; }
    .home-controls { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; gap: 12px; }
    .home-input-box { display: flex; gap: 8px; }
    .home-input { width: 36px; font-size: 1.1rem; text-align: center; border: 1px solid #bbb; border-radius: 6px; padding: 4px; }
    .dice-container { perspective: 400px; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; }
    .dice { width: 100px; height: 100px; position: relative; transform-style: preserve-3d; transition: transform 0.7s cubic-bezier(.25,1.5,.5,1); }
    .dice-face { position: absolute; width: 100px; height: 100px; background: #fff; border: 2px solid #1a2a2a; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: bold; color: #1a2a2a; box-shadow: 0 2px 8px #0002; }
    .home-btn { background: #1a2a2a; color: #fff; border: none; border-radius: 8px; padding: 10px 22px; font-size: 1.1rem; cursor: pointer; transition: background 0.2s; }
    .home-btn:hover { background: #2e4a4a; }
    .home-intro { margin: 18px 0 0 0; text-align: center; color: #2a2a2a; font-size: 1.05rem; }
    .home-footer { margin-top: 28px; text-align: center; }
    .footer-isologo { width: 80px; opacity: 1; filter: none; }
  `;
  document.head.appendChild(style);
}
