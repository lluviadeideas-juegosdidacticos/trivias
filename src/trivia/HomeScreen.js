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
  help.style.marginBottom = '1.1rem';
  help.style.textAlign = 'center';
  root.appendChild(help);

  // Dado digital animado
  const diceBlock = document.createElement('div');
  diceBlock.style.display = 'flex';
  diceBlock.style.flexDirection = 'column';
  diceBlock.style.alignItems = 'center';
  diceBlock.style.marginBottom = '1.2rem';

  // Dado visual
  const diceFace = document.createElement('div');
  diceFace.style.width = '3.2em';
  diceFace.style.height = '3.2em';
  diceFace.style.background = 'linear-gradient(145deg, #e3f0fa 60%, #b3d6f7 100%)';
  diceFace.style.border = '2.5px solid #1a73e8';
  diceFace.style.borderRadius = '0.7em';
  diceFace.style.boxShadow = '0 2px 10px #b3d6f7, 0 1px 0 #fff inset';
  diceFace.style.display = 'flex';
  diceFace.style.alignItems = 'center';
  diceFace.style.justifyContent = 'center';
  diceFace.style.fontSize = '2.1em';
  diceFace.style.fontWeight = 'bold';
  diceFace.style.color = '#1a73e8';
  diceFace.style.transition = 'transform 0.35s cubic-bezier(.4,2,.6,1), box-shadow 0.2s';
  diceFace.textContent = '🎲';
  diceBlock.appendChild(diceFace);

  // Botón tirar dado
  const diceBtn = document.createElement('button');
  diceBtn.textContent = 'Tirar dado';
  diceBtn.style.fontSize = '1.1rem';
  diceBtn.style.padding = '0.6em 1.4em';
  diceBtn.style.borderRadius = '8px';
  diceBtn.style.background = '#1a73e8';
  diceBtn.style.color = '#fff';
  diceBtn.style.border = 'none';
  diceBtn.style.fontWeight = '600';
  diceBtn.style.cursor = 'pointer';
  diceBtn.style.marginTop = '0.7em';
  diceBlock.appendChild(diceBtn);
  root.appendChild(diceBlock);

  // Animación y lógica de dado
  diceBtn.addEventListener('click', () => {
    // Buscar la siguiente casilla vacía
    const nextIdx = rollInputs.findIndex(inp => !inp.value);
    if (nextIdx === -1) return;
    // Animación 3D simple
    diceFace.style.transform = 'rotateY(360deg) scale(1.12)';
    diceFace.style.boxShadow = '0 4px 18px #b3d6f7, 0 1px 0 #fff inset';
    setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1;
      diceFace.textContent = value;
      diceFace.style.transform = 'rotateY(0deg) scale(1)';
      diceFace.style.boxShadow = '0 2px 10px #b3d6f7, 0 1px 0 #fff inset';
      rollInputs[nextIdx].value = value;
      updateViewBtn();
    }, 350);
  });

  // Si el usuario edita manualmente, restaurar dado visual
  rollInputs.forEach(inp => {
    inp.addEventListener('focus', () => {
      diceFace.textContent = '🎲';
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
  viewBtn.style.marginTop = '0.5em';
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

  // Pie de página: logo Lluvia de Ideas con opacidad reducida
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
  lluviaLogo.style.opacity = '0.28';
  footer.appendChild(lluviaLogo);
  root.appendChild(footer);

  mount.appendChild(root);
}
