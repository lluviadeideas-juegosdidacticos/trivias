export function HomeScreen({ mount, onStart }) {
  const root = document.createElement('div');
  root.style.display = 'flex';
  root.style.flexDirection = 'column';
  root.style.alignItems = 'center';
  root.style.justifyContent = 'center';
  root.style.minHeight = '480px';

  // Logo
  const logo = document.createElement('div');
  logo.textContent = '🌱 Impacto Ambiental';
  logo.style.fontSize = '2.2rem';
  logo.style.fontWeight = 'bold';
  logo.style.marginBottom = '0.5rem';
  root.appendChild(logo);

  // Subtítulo
  const subtitle = document.createElement('h2');
  subtitle.textContent = 'Genera tu pregunta aleatoria';
  subtitle.style.marginBottom = '0.5rem';
  root.appendChild(subtitle);

  // Texto
  const text = document.createElement('div');
  text.textContent = 'Tira el dado tres veces para obtener un número de pregunta.';
  text.style.marginBottom = '1.2rem';
  root.appendChild(text);

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

  mount.appendChild(root);
}
