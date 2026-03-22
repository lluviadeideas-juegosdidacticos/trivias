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

  // Dado y celdas
  let rolls = [];
  const diceDiv = document.createElement('div');
  diceDiv.style.display = 'flex';
  diceDiv.style.gap = '1em';
  diceDiv.style.marginBottom = '1.2rem';
  root.appendChild(diceDiv);

  for (let i = 0; i < 3; i++) {
    const box = document.createElement('div');
    box.textContent = '-';
    box.style.width = '2.5em';
    box.style.height = '2.5em';
    box.style.border = '2px solid #1a73e8';
    box.style.borderRadius = '8px';
    box.style.display = 'flex';
    box.style.alignItems = 'center';
    box.style.justifyContent = 'center';
    box.style.fontSize = '1.5em';
    box.style.background = '#f5faff';
    diceDiv.appendChild(box);
    rolls.push(box);
  }

  let rollCount = 0;
  const rollBtn = document.createElement('button');
  rollBtn.textContent = 'Tirar dado';
  rollBtn.style.fontSize = '1.1rem';
  rollBtn.style.padding = '0.6em 1.4em';
  rollBtn.style.borderRadius = '8px';
  rollBtn.style.background = '#1a73e8';
  rollBtn.style.color = '#fff';
  rollBtn.style.border = 'none';
  rollBtn.style.fontWeight = '600';
  rollBtn.style.cursor = 'pointer';
  rollBtn.style.marginBottom = '1.2rem';
  root.appendChild(rollBtn);

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
  viewBtn.style.display = 'none';
  root.appendChild(viewBtn);

  rollBtn.addEventListener('click', () => {
    if (rollCount < 3) {
      const value = Math.floor(Math.random() * 6) + 1;
      rolls[rollCount].textContent = value;
      rollCount++;
      if (rollCount === 3) {
        rollBtn.disabled = true;
        viewBtn.style.display = 'block';
      }
    }
  });

  viewBtn.addEventListener('click', () => {
    if (rollCount === 3) {
      const generatedNumber = parseInt(rolls.map(b => b.textContent).join(''), 10);
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
