import { TriviaApp } from './TriviaApp.js';

function showStartupError() {
  const mount = document.getElementById('app');
  if (!mount) return;

  const message = document.createElement('p');
  message.setAttribute('role', 'alert');
  message.textContent = 'No se pudo iniciar la trivia. Recargá la página para volver a intentarlo.';
  mount.replaceChildren(message);
}

window.addEventListener('error', showStartupError);
window.addEventListener('unhandledrejection', showStartupError);

try {
  TriviaApp({ mount: document.getElementById('app') });
} catch {
  showStartupError();
}
