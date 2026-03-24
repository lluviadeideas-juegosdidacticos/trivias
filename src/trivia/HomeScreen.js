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
  const wheels = [];
  for (let i = 0; i < 3; i++) {
    const wheel = createWheelPicker(i);
    inputBox.appendChild(wheel.container);
    wheels.push(wheel);
  }
  root.appendChild(inputBox);

  // Wheel picker implementation
  function createWheelPicker(index) {
    const container = document.createElement('div');
    container.className = 'wheel-picker';
    const values = [1, 2, 3, 4, 5, 6];
    let selected = 1;
    let startY = null;
    let lastY = null;
    let isDragging = false;

    // Create value elements
    const valueEls = values.map((v, idx) => {
      const el = document.createElement('div');
      el.className = 'wheel-value';
      el.textContent = v;
      el.setAttribute('data-value', v);
      container.appendChild(el);
      return el;
    });

    // Reduce vertical space and recenter
    const ITEM_HEIGHT = 32;
    const VISIBLE_COUNT = 3;
    container.style.height = (ITEM_HEIGHT * VISIBLE_COUNT) + 'px';

    function getOffset(idx) {
      // Circular offset for wrap-around
      let offset = idx - (selected - 1);
      if (offset > 3) offset -= 6;
      if (offset < -3) offset += 6;
      return offset;
    }

    function updateVisual() {
      valueEls.forEach((el, idx) => {
        const offset = getOffset(idx);
        const offsetY = offset * ITEM_HEIGHT;
        el.style.transform = `translateY(${offsetY}px) scale(${offset === 0 ? 1.22 : 0.82})`;
        el.style.opacity = offset === 0 ? '1' : '0.45';
        el.style.zIndex = offset === 0 ? '2' : '1';
        el.classList.toggle('selected', offset === 0);
      });
    }

    function setSelected(val) {
      // Wrap around
      if (val < 1) val = 6;
      if (val > 6) val = 1;
      selected = val;
      updateVisual();
    }

    // Mouse/touch/scroll handlers
    function onDragStart(e) {
      isDragging = true;
      startY = e.touches ? e.touches[0].clientY : e.clientY;
      lastY = startY;
      document.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
      document.addEventListener('touchmove', onDragMove, { passive: false });
      document.addEventListener('touchend', onDragEnd);
    }
    function onDragMove(e) {
      if (!isDragging) return;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const dy = y - lastY;
      if (Math.abs(dy) > 8) {
        if (dy > 0) setSelected(selected - 1);
        if (dy < 0) setSelected(selected + 1);
        lastY = y;
      }
      e.preventDefault && e.preventDefault();
    }
    function onDragEnd() {
      isDragging = false;
      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('touchmove', onDragMove);
      document.removeEventListener('touchend', onDragEnd);
    }
    function onWheel(e) {
      if (e.deltaY > 0) setSelected(selected + 1);
      if (e.deltaY < 0) setSelected(selected - 1);
      e.preventDefault();
    }
    container.addEventListener('mousedown', onDragStart);
    container.addEventListener('touchstart', onDragStart, { passive: false });
    container.addEventListener('wheel', onWheel, { passive: false });

    setSelected(1);
    return {
      container,
      getValue: () => selected
    };
  }


  // Botón "Ver pregunta" solo navega
  const button = document.createElement('button');
  button.className = 'home-btn';
  button.textContent = 'Ver pregunta';
  button.onclick = () => {
    const values = wheels.map(w => w.getValue());
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
  // Powered by Janus Governance text
  const poweredBy = document.createElement('div');
  poweredBy.className = 'footer-powered-by';
  poweredBy.textContent = 'Powered by Janus Governance';
  footer.appendChild(poweredBy);
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
      gap: 0;
      min-height: 100vh;
      box-sizing: border-box;
      justify-content: flex-start;
      background: #f9fafb;
    }
    .home-logo {
      display: block;
      margin: 0 auto 12px auto;
      width: 260px;
      max-width: 95vw;
      filter: drop-shadow(0 4px 16px rgba(0,0,0,0.1));
    }
    .home-subtitle {
      text-align: center;
      font-size: 2rem;
      margin: 0 0 12px 0;
      color: #1a2a2a;
      font-weight: 700;
      letter-spacing: 0.01em;
    }
    .home-intro {
      text-align: center;
      color: #2a2a2a;
      font-size: 1.13rem;
      margin: 0 0 36px 0;
      line-height: 1.5;
      max-width: 480px;
    }
    .home-input-box {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 24px;
    }
    .wheel-picker {
      width: 48px;
      height: 114px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 1px 3px #0001;
      border: 1.5px solid #bbb;
      overflow: hidden;
      user-select: none;
      touch-action: pan-y;
      cursor: grab;
    }
    .wheel-value {
      width: 100%;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.18rem;
      color: #222;
      opacity: 0.45;
      transition: transform 0.13s cubic-bezier(.4,1.4,.6,1), opacity 0.13s, font-size 0.13s;
      pointer-events: none;
      font-weight: 500;
      position: absolute;
      left: 0;
      top: calc(50% - 19px);
      transform: translateY(0) scale(0.85);
      z-index: 1;
    }
    .wheel-value.selected {
      font-size: 1.45rem;
      color: #111;
      opacity: 1;
      font-weight: 700;
      z-index: 2;
      text-shadow: 0 2px 8px #0001;
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
      margin-top: 0;
      box-shadow: 0 2px 8px #0001;
      letter-spacing: 0.01em;
      display: block;
      width: 100%;
      max-width: 260px;
    }
    .home-btn:hover {
      background: #2e4a4a;
      box-shadow: 0 4px 16px #0002;
    }
    .home-footer {
      margin-top: auto;
      padding-top: 40px;
      text-align: center;
      width: 100%;
    }
    .footer-isologo.prominent {
      display: block;
      margin: 0 auto 14px auto;
      width: 170px;
      max-width: 45vw;
      opacity: 1;
      filter: none;
    }
    @media (min-width: 900px) {
      .footer-isologo.prominent {
        width: 180px;
      }
    }
    @media (max-width: 600px) {
      .footer-isologo.prominent {
        width: 130px;
      }
    }
    @media (max-width: 400px) {
      .footer-isologo.prominent {
        width: 110px;
      }
    }
    .footer-powered-by {
      font-size: 0.75rem;
      color: rgba(26,42,42,0.45);
      margin-top: 6px;
      letter-spacing: 0.04em;
    }
  `;
  document.head.appendChild(style);
}
