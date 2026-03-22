export function HomeScreen({ mount, onStart }) {
  const root = document.createElement('div');
  root.style.display = 'flex';
  root.style.flexDirection = 'column';
  root.style.alignItems = 'center';
  root.style.justifyContent = 'center';
  root.style.minHeight = '480px';


  // Logo Impacto Ambiental (encabezado)
  const logoImg = document.createElement('img');
  // Preferir gif si existe, fallback a logo.svg
  logoImg.src = './assets/logo_impactoambiental.gif';
  logoImg.alt = 'Impacto Ambiental';
  logoImg.style.width = '220px';
  logoImg.style.maxWidth = '90vw';
  logoImg.style.height = 'auto';
  logoImg.style.objectFit = 'contain';
  logoImg.style.marginBottom = '0.7rem';
  // fallback si no carga el gif
  logoImg.onerror = function() {
    logoImg.src = './assets/logo.svg';
    logoImg.alt = 'Impacto Ambiental (SVG)';
    logoImg.style.width = '120px';
  };
  root.appendChild(logoImg);

  // Subtítulo
  const subtitle = document.createElement('h2');
  subtitle.textContent = 'Guía de Cuestiones 2.0';
  subtitle.style.marginBottom = '0.5rem';
  root.appendChild(subtitle);

  // Texto introductorio exacto
  const intro = document.createElement('div');
  intro.textContent = 'Bienvenidos a la plataforma de trivias de Impacto Ambiental, nuestro libro juego.\nPuedes tirar el dado tres veces para generar un número de pregunta.\nLuego podrás acceder a la consigna correspondiente.';
  intro.style.fontSize = '1.08rem';
  intro.style.color = '#444';
  intro.style.marginBottom = '1.2rem';
  intro.style.textAlign = 'center';
  intro.style.whiteSpace = 'pre-line';
  root.appendChild(intro);


  // Casillas editables (inputs) y dado digital
  let rollInputs = [];
  const diceDiv = document.createElement('div');
  diceDiv.style.display = 'flex';
  diceDiv.style.gap = '1em';
  diceDiv.style.marginBottom = '0.7rem';
  root.appendChild(diceDiv);

  for (let i = 0; i < 3; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.inputMode = 'numeric';
    input.pattern = '[1-6]';
    input.style.width = '2.5em';
    input.style.height = '2.5em';
    input.style.border = '2px solid #1a73e8';
    input.style.borderRadius = '8px';
    input.style.display = 'flex';
    input.style.alignItems = 'center';
    input.style.justifyContent = 'center';
    input.style.fontSize = '1.5em';
    input.style.background = '#f5faff';
    input.style.textAlign = 'center';
    input.style.caretColor = '#1a73e8';
    input.style.outline = 'none';
    input.autocomplete = 'off';
    input.value = '';
    // Validar solo 1-6
    input.addEventListener('input', (e) => {
      let v = input.value;
      if (!/^[1-6]?$/.test(v)) {
        input.value = '';
      }
      updateViewBtn();
    });
    diceDiv.appendChild(input);
    rollInputs.push(input);
  }

  // Ayuda
  const help = document.createElement('div');
  help.textContent = 'Puedes escribir el número manualmente si tiras un dado real, o usar el dado digital.';
  help.style.fontSize = '0.98rem';
  help.style.color = '#666';
  help.style.marginBottom = '1.7rem';
  help.style.textAlign = 'center';
  root.appendChild(help);


  // Dado digital animado (cubo 3D refinado)
  const diceBlock = document.createElement('div');
  diceBlock.style.display = 'flex';
  diceBlock.style.flexDirection = 'column';
  diceBlock.style.alignItems = 'center';
  diceBlock.style.marginBottom = '2.1rem';

  // Cubo 3D refinado
  const scene = document.createElement('div');
  scene.style.width = '2.3em';
  scene.style.height = '2.3em';
  scene.style.perspective = '900px';
  scene.style.margin = '0.1em 0 1.2em 0';
  scene.style.display = 'flex';
  scene.style.alignItems = 'center';
  scene.style.justifyContent = 'center';

  const cube = document.createElement('div');
  cube.style.width = '100%';
  cube.style.height = '100%';
  cube.style.position = 'relative';
  cube.style.transformStyle = 'preserve-3d';
  cube.style.transition = 'transform 1.45s cubic-bezier(.4,1.4,.6,1)';
  cube.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(-0.35em)';
  cube.style.cursor = 'pointer';

  // Feedback hover/active
  cube.addEventListener('mouseenter', () => {
    cube.style.boxShadow = '0 0 0 3px #b3d6f7';
  });
  cube.addEventListener('mouseleave', () => {
    cube.style.boxShadow = '';
  });
  cube.addEventListener('mousedown', () => {
    cube.style.filter = 'brightness(0.96)';
  });
  cube.addEventListener('mouseup', () => {
    cube.style.filter = '';
  });

  // Caras del cubo (mapping: 1-front, 2-back, 3-right, 4-left, 5-top, 6-bottom)
  // Todas las caras orientadas hacia afuera, sin espejar, y visibles
  const faces = [
    {name: 'front',  num: 1, transform: 'rotateY(0deg) translateZ(1.15em)'},
    {name: 'back',   num: 2, transform: 'rotateY(180deg) translateZ(1.15em)'},
    {name: 'right',  num: 3, transform: 'rotateY(90deg) translateZ(1.15em)'},
    {name: 'left',   num: 4, transform: 'rotateY(-90deg) translateZ(1.15em)'},
    {name: 'top',    num: 5, transform: 'rotateX(90deg) translateZ(1.15em)'},
    {name: 'bottom', num: 6, transform: 'rotateX(-90deg) translateZ(1.15em)'}
  ];
  faces.forEach(face => {
    const f = document.createElement('div');
    f.className = 'dice-face-' + face.name;
    f.textContent = face.num;
    f.style.position = 'absolute';
    f.style.width = '2.3em';
    f.style.height = '2.3em';
    f.style.display = 'flex';
    f.style.alignItems = 'center';
    f.style.justifyContent = 'center';
    f.style.fontSize = '1.4em';
    f.style.fontWeight = 'bold';
    f.style.color = '#1a73e8';
    f.style.background = 'linear-gradient(145deg, #e3f0fa 60%, #b3d6f7 100%)';
    f.style.border = '2px solid #1a73e8';
    f.style.borderRadius = '0.5em';
    f.style.boxShadow = '0 2px 8px #b3d6f7, 0 1px 0 #fff inset';
    f.style.transform = face.transform;
    f.style.userSelect = 'none';
    f.style.backfaceVisibility = 'hidden';
    cube.appendChild(f);
  });
  scene.appendChild(cube);
  diceBlock.appendChild(scene);

  // El cubo es el trigger de tirada
  root.appendChild(diceBlock);



  // Mapping valor → rotación cubo
  const cubeRotations = {
    1: 'rotateX(0deg) rotateY(0deg)',      // front
    2: 'rotateX(0deg) rotateY(180deg)',   // back
    3: 'rotateX(0deg) rotateY(-90deg)',   // right
    4: 'rotateX(0deg) rotateY(90deg)',    // left
    5: 'rotateX(-90deg) rotateY(0deg)',   // top
    6: 'rotateX(90deg) rotateY(0deg)'     // bottom
  };

  // Estado de rotación acumulada y bloqueo de animación
  let lastX = 0, lastY = 0;
  let animating = false;
  function rollDice() {
    if (animating) return;
    const nextIdx = rollInputs.findIndex(inp => !inp.value);
    if (nextIdx === -1) return;
    animating = true;
    const value = Math.floor(Math.random() * 6) + 1;
    // Elegir vueltas aleatorias previas
    const extraTurnsX = Math.floor(Math.random() * 3) + 2; // 2-4 vueltas
    const extraTurnsY = Math.floor(Math.random() * 3) + 2; // 2-4 vueltas
    // Mapping final
    let finalX = 0, finalY = 0;
    switch (value) {
      case 1: finalX = 0; finalY = 0; break;
      case 2: finalX = 0; finalY = 180; break;
      case 3: finalX = 0; finalY = -90; break;
      case 4: finalX = 0; finalY = 90; break;
      case 5: finalX = -90; finalY = 0; break;
      case 6: finalX = 90; finalY = 0; break;
    }
    // Normalizar para evitar acumulación corrupta
    lastX = (lastX % 360) + 360 * extraTurnsX + finalX;
    lastY = (lastY % 360) + 360 * extraTurnsY + finalY;
    cube.style.transition = 'transform 1.45s cubic-bezier(.4,1.4,.6,1)';
    cube.style.transform = `rotateX(${lastX}deg) rotateY(${lastY}deg) translateZ(-0.35em)`;
    setTimeout(() => {
      rollInputs[nextIdx].value = value;
      updateViewBtn();
      animating = false;
    }, 1450);
  }
  // Solo click/pointerup, nunca mousedown
  cube.addEventListener('click', rollDice);
  cube.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'touch') return;
    rollDice();
  });

  // Si el usuario edita manualmente, restaurar cubo a cara 1
  rollInputs.forEach(inp => {
    inp.addEventListener('focus', () => {
      lastX = 0; lastY = 0;
      cube.style.transition = 'transform 0.5s cubic-bezier(.4,1.4,.6,1)';
      cube.style.transform = cubeRotations[1] + ' translateZ(-0.35em)';
    });
  });

  // ...el bloque de dado digital reemplaza el botón anterior...

  // Botón para ver pregunta
  const viewBtn = document.createElement('button');
  viewBtn.textContent = 'Ver pregunta';
  viewBtn.style.fontSize = '1.1rem';
  viewBtn.style.padding = '0.6em 1.4em';
  viewBtn.style.borderRadius = '8px';
  viewBtn.style.background = '#43a047';
  viewBtn.style.color = '#fff';
  viewBtn.style.border = 'none';
  viewBtn.style.fontWeight = '600';
  viewBtn.style.cursor = 'pointer';
  viewBtn.style.marginTop = '1.2em';
  viewBtn.disabled = true;
  root.appendChild(viewBtn);


  // Habilitar botón solo si las 3 casillas tienen valores válidos
  function updateViewBtn() {
    const valid = rollInputs.every(inp => /^[1-6]$/.test(inp.value));
    viewBtn.disabled = !valid;
  }
  rollInputs.forEach(inp => inp.addEventListener('input', updateViewBtn));

  viewBtn.addEventListener('click', () => {
    const valid = rollInputs.every(inp => /^[1-6]$/.test(inp.value));
    if (valid) {
      const generatedNumber = parseInt(rollInputs.map(b => b.value).join(''), 10);
      onStart(generatedNumber);
    }
  });

  // Pie de página: logo Lluvia de Ideas sin transparencia
  const footer = document.createElement('div');
  footer.style.width = '100%';
  footer.style.display = 'flex';
  footer.style.justifyContent = 'center';
  footer.style.marginTop = '2.5rem';
  const lluviaLogo = document.createElement('img');
  lluviaLogo.src = './assets/isologo_negro.svg';
  lluviaLogo.alt = 'Lluvia de Ideas';
  lluviaLogo.style.height = '38px';
  lluviaLogo.style.maxWidth = '180px';
  lluviaLogo.style.objectFit = 'contain';
  lluviaLogo.style.opacity = '1';
  lluviaLogo.style.filter = '';
  footer.appendChild(lluviaLogo);
  root.appendChild(footer);

  mount.appendChild(root);
}
