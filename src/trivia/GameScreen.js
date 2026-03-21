import { questions } from "./data.js";

export function GameScreen({ mount, questionNumber, onBack }) {
  const root = document.createElement('div');
  root.style.display = 'flex';
  root.style.flexDirection = 'column';
  root.style.alignItems = 'center';
  root.style.justifyContent = 'center';
  root.style.minHeight = '480px';

  const q = questions.find(q => q.id === questionNumber);

  if (!q) {
    const nf = document.createElement('div');
    nf.textContent = 'Pregunta no disponible';
    nf.style.fontSize = '1.3rem';
    nf.style.marginBottom = '1.5rem';
    root.appendChild(nf);

    const retryBtn = document.createElement('button');
    retryBtn.textContent = 'Volver a tirar';
    retryBtn.style.fontSize = '1.1rem';
    retryBtn.style.padding = '0.6em 1.4em';
    retryBtn.style.borderRadius = '8px';
    retryBtn.style.background = '#1a73e8';
    retryBtn.style.color = '#fff';
    retryBtn.style.border = 'none';
    retryBtn.style.fontWeight = '600';
    retryBtn.style.cursor = 'pointer';
    retryBtn.addEventListener('click', onBack);
    root.appendChild(retryBtn);
    mount.appendChild(root);
    return;
  }

  const numDiv = document.createElement('div');
  numDiv.textContent = `Pregunta Nº ${questionNumber}`;
  numDiv.style.fontSize = '1.1rem';
  numDiv.style.color = '#1a73e8';
  numDiv.style.fontWeight = '600';
  numDiv.style.marginBottom = '8px';
  numDiv.style.textAlign = 'right';
  root.appendChild(numDiv);

  const qDiv = document.createElement('div');
  qDiv.textContent = q.question;
  qDiv.style.fontSize = '1.5rem';
  qDiv.style.fontWeight = '700';
  qDiv.style.marginBottom = '1.5rem';
  root.appendChild(qDiv);

  const optsDiv = document.createElement('div');
  optsDiv.style.display = 'flex';
  optsDiv.style.flexDirection = 'column';
  optsDiv.style.gap = '0.7em';
  optsDiv.style.marginBottom = '1.2rem';
  root.appendChild(optsDiv);

  let selected = null;
  let feedbackDiv = document.createElement('div');
  feedbackDiv.style.marginTop = '1em';
  feedbackDiv.style.fontWeight = '600';
  root.appendChild(feedbackDiv);

  let explDiv = document.createElement('div');
  explDiv.style.marginTop = '1em';
  explDiv.style.color = '#444';
  root.appendChild(explDiv);

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.style.fontSize = '1.1rem';
    btn.style.padding = '0.5em 1.2em';
    btn.style.borderRadius = '8px';
    btn.style.background = '#f5faff';
    btn.style.border = '2px solid #1a73e8';
    btn.style.color = '#1a73e8';
    btn.style.fontWeight = '600';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
      if (selected !== null) return;
      selected = idx;
      btn.style.background = idx === q.answer ? '#43a047' : '#e53935';
      btn.style.color = '#fff';
      feedbackDiv.textContent = idx === q.answer ? '¡Correcto!' : 'Incorrecto';
      feedbackDiv.style.color = idx === q.answer ? '#43a047' : '#e53935';
      explDiv.textContent = q.explanation;
      nextBtn.style.display = 'block';
    });
    optsDiv.appendChild(btn);
  });

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Siguiente';
  nextBtn.style.display = 'none';
  nextBtn.style.marginTop = '1.2em';
  nextBtn.style.fontSize = '1.1rem';
  nextBtn.style.padding = '0.6em 1.4em';
  nextBtn.style.borderRadius = '8px';
  nextBtn.style.background = '#1a73e8';
  nextBtn.style.color = '#fff';
  nextBtn.style.border = 'none';
  nextBtn.style.fontWeight = '600';
  nextBtn.style.cursor = 'pointer';
  nextBtn.addEventListener('click', onBack);
  root.appendChild(nextBtn);

  mount.appendChild(root);
}
