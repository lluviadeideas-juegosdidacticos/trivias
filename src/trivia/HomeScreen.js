import { recordEvent } from "../../janus/observability/flight-recorder.js";
import { USER_EVENT } from "../../janus/observability/runtime-events.js";

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
    // Janus Observability: record USER_EVENT for start
    try {
      recordEvent(USER_EVENT, {
        action: 'start',
        generatedNumber,
        timestamp: Date.now(),
      });
    } catch (e) {}
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
      padding: 40px 16px 24px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
      min-height: 100vh;
      box-sizing: border-box;
      justify-content: flex-start;
      background: #f9fafb;
    }
    .home-logo {
      display: block;
      margin: 0 auto 8px auto;
      width: 200px;
      max-width: 95vw;
      filter: drop-shadow(0 2px 8px #0001);
    }
    .home-subtitle {
      text-align: center;
      font-size: 1.7rem;
      margin: 0 0 4px 0;
      color: #1a2a2a;
      font-weight: 600;
      letter-spacing: 0.01em;
    }
    .home-intro {
      text-align: center;
      color: #2a2a2a;
      font-size: 1.13rem;
      margin: 0 0 8px 0;
      line-height: 1.5;
      max-width: 480px;
    }
    .home-input-box {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 0;
    }
    .home-input {
      width: 44px;
      font-size: 1.18rem;
      text-align: center;
      border: 1.5px solid #bbb;
      border-radius: 8px;
      padding: 6px;
      background: #fff;
      box-shadow: 0 1px 3px #0001;
    }
    .home-btn {
      background: #1a2a2a;
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 13px 32px;
      font-size: 1.18rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
      margin-top: 8px;
      box-shadow: 0 2px 8px #0001;
      letter-spacing: 0.01em;
      display: block;
    }
    .home-btn:hover {
      background: #2e4a4a;
      box-shadow: 0 4px 16px #0002;
    }
    .home-footer {
      margin-top: 36px;
      text-align: center;
      width: 100%;
    }
    .footer-isologo.prominent {
      display: block;
      margin: 0 auto;
      width: 120px;
      max-width: 60vw;
      opacity: 1;
      filter: none;
    }
  `;
  document.head.appendChild(style);
}
