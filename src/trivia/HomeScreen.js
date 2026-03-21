// HomeScreen browser-native, sin React ni JSX
export function HomeScreen({ mount, onStart }) {
  let digits = [null, null, null];
  let currentIndex = 0;
  let rolling = false;

  const root = document.createElement('div');
  root.style.position = 'relative';
  root.style.minHeight = '480px';

  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.gap = '1.2rem';

  // Logo
  const logo = document.createElement('img');
  logo.src = './assets/logo_impactoambiental.gif';
  logo.alt = 'Impacto Ambiental';
  logo.style.width = '160px';
  logo.style.maxWidth = '80vw';
  logo.style.margin = '0 auto 8px';
  logo.style.display = 'block';
  container.appendChild(logo);

  // Título
  const title = document.createElement('h1');
  title.textContent = 'Impacto Ambiental';
  title.style.marginBottom = '0';
  title.style.marginTop = '0';
  title.style.fontSize = '2.1rem';
  container.appendChild(title);

  // Subtítulo
  const subtitle = document.createElement('div');
  subtitle.textContent = 'Guía de Cuestiones 2.0';
  subtitle.style.fontWeight = '600';
  container.appendChild(subtitle);

  // Instrucción
  const instr = document.createElement('div');
  instr.textContent = 'Tirá el dado 3 veces o tocá el dado para generar tu número de pregunta';
  instr.style.fontSize = '1.08rem';
  instr.style.color = '#444';
  instr.style.marginBottom = '8px';
  instr.style.textAlign = 'center';
  container.appendChild(instr);

  // Digits
  const digitsRow = document.createElement('div');
  digitsRow.style.display = 'flex';
  digitsRow.style.gap = '1.2rem';
  digitsRow.style.margin = '1.2rem 0';
  const digitBoxes = [0, 1, 2].map((i) => {
    const box = document.createElement('div');
    box.style.width = '54px';
    box.style.height = '64px';
    box.style.border = '2px solid #1a73e8';
    box.style.borderRadius = '10px';
    box.style.display = 'flex';
    box.style.alignItems = 'center';
    box.style.justifyContent = 'center';
    box.style.fontSize = '2.2rem';
    box.style.fontWeight = '700';
    box.style.background = '#f5f5f5';
    box.style.color = '#bbb';
    box.textContent = '—';
    digitsRow.appendChild(box);
    return box;
  });
  container.appendChild(digitsRow);

  // Tirar dado
  const rollBtn = document.createElement('button');
  rollBtn.textContent = 'Tirar dado';
  rollBtn.style.fontSize = '1.2rem';
  rollBtn.style.padding = '0.7em 1.6em';
  rollBtn.style.borderRadius = '8px';
  rollBtn.style.background = '#1a73e8';
  rollBtn.style.color = '#fff';
  rollBtn.style.border = 'none';
  rollBtn.style.fontWeight = '600';
  rollBtn.style.cursor = 'pointer';
  rollBtn.style.marginBottom = '12px';
  container.appendChild(rollBtn);

  // Jugar pregunta
  const playBtn = document.createElement('button');
  playBtn.textContent = 'Jugar pregunta';
  playBtn.style.fontSize = '1.1rem';
  playBtn.style.padding = '0.6em 1.4em';
  playBtn.style.borderRadius = '8px';
  playBtn.style.background = '#43a047';
  playBtn.style.color = '#fff';
  playBtn.style.border = 'none';
  playBtn.style.fontWeight = '600';
  playBtn.style.cursor = 'pointer';
  container.appendChild(playBtn);

  function updateDigitsUI() {
    digitBoxes.forEach((box, i) => {
      const d = digits[i];
      box.textContent = d !== null ? d : '—';
      box.style.background = d !== null ? '#e3f0fd' : '#f5f5f5';
      box.style.color = d !== null ? '#1a73e8' : '#bbb';
    });
    playBtn.disabled = digits.some((d) => d === null);
    rollBtn.disabled = currentIndex > 2 || rolling;
    rollBtn.textContent = currentIndex > 2 ? 'Listo' : rolling ? 'Tirando…' : 'Tirar dado';
  }

  rollBtn.addEventListener('click', () => {
    if (currentIndex > 2 || rolling) return;
    rolling = true;
    updateDigitsUI();
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      digits[currentIndex] = roll;
      currentIndex++;
      rolling = false;
      updateDigitsUI();
    }, 350);
  });

  playBtn.addEventListener('click', () => {
    const number = Number(digits.join(''));
    if (!isNaN(number) && digits.every((d) => d !== null)) {
      onStart(number);
    }
  });

  updateDigitsUI();
  root.appendChild(container);
