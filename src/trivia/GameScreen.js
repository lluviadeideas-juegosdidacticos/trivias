import { questions } from "./data.js";

export function GameScreen({ mount, questionNumber, onBack }) {
  let current = 0;
  let selected = null;
  let showFeedback = false;
  let showExplanation = false;

  let q = null;
  let showNumber = null;
  let progress = null;
  if (questionNumber) {
    q = questions.find((p) => p.id === questionNumber);
    showNumber = `Pregunta Nº ${questionNumber}`;
    progress = null;
  } else {
    q = questions[current];
    progress = `Pregunta ${current + 1} de ${questions.length}`;
  }

  const root = document.createElement('div');
  root.style.position = 'relative';
  root.style.minHeight = '480px';

  if (showNumber) {
    const numDiv = document.createElement('div');
    numDiv.textContent = showNumber;
    numDiv.style.fontSize = '1.1rem';
    numDiv.style.color = '#1a73e8';
    numDiv.style.fontWeight = '600';
    numDiv.style.marginBottom = '8px';
    numDiv.style.textAlign = 'right';
    root.appendChild(numDiv);
  }
  if (progress) {
    const progDiv = document.createElement('div');
    progDiv.textContent = progress;
    progDiv.style.fontWeight = '600';
    progDiv.style.marginBottom = '8px';
    root.appendChild(progDiv);
  }

  if (q) {
    const qDiv = document.createElement('div');
    qDiv.textContent = q.question;
    qDiv.style.fontSize = '1.5rem';
    qDiv.style.fontWeight = '700';
    qDiv.style.marginBottom = '1.5rem';
    root.appendChild(qDiv);
  } else {
    const nf = document.createElement('div');
    nf.textContent = 'Pregunta no encontrada.';
    root.appendChild(nf);
  }

  if (q) {
    const optsDiv = document.createElement('div');
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.style.margin = '0.5em 0';
      btn.style.display = 'block';
      btn.style.width = '100%';
      btn.style.fontSize = '1.1rem';
      btn.disabled = selected !== null;
      btn.addEventListener('click', () => {
        if (selected !== null) return;
        selected = idx;
        showFeedback = true;
        updateUI();
        setTimeout(() => {
          showExplanation = true;
          updateUI();
        }, 350);
      });
      optsDiv.appendChild(btn);
    });
    root.appendChild(optsDiv);
  }

  const feedbackDiv = document.createElement('div');
  root.appendChild(feedbackDiv);

  const explDiv = document.createElement('div');
  root.appendChild(explDiv);

  const nextBtn = document.createElement('button');
  nextBtn.textContent = questionNumber ? 'Volver' : 'Siguiente';
  nextBtn.style.marginTop = '1.2em';
  nextBtn.style.fontSize = '1.1rem';
  nextBtn.style.padding = '0.6em 1.4em';
  nextBtn.style.borderRadius = '8px';
  nextBtn.style.background = '#1a73e8';
  nextBtn.style.color = '#fff';
  nextBtn.style.border = 'none';
  nextBtn.style.fontWeight = '600';
  nextBtn.style.cursor = 'pointer';
  nextBtn.style.display = 'none';
  root.appendChild(nextBtn);

  function updateUI() {
    // Opciones
    if (q) {
      const btns = root.querySelectorAll('button');
      btns.forEach((btn, idx) => {
        btn.disabled = selected !== null;
        if (selected !== null) {
          if (idx === q.answer) btn.style.background = '#43a047';
          else if (idx === selected) btn.style.background = '#e53935';
          else btn.style.background = '';
          btn.style.color = '#fff';
        } else {
          btn.style.background = '';
          btn.style.color = '';
        }
      });
    }
    // Feedback
    feedbackDiv.textContent = '';
    if (showFeedback && selected !== null) {
      feedbackDiv.textContent = selected === q.answer ? '¡Correcto!' : 'Incorrecto';
      feedbackDiv.style.color = selected === q.answer ? '#43a047' : '#e53935';
      feedbackDiv.style.fontWeight = '600';
      feedbackDiv.style.marginTop = '1em';
    }
    // Explicación
    explDiv.textContent = '';
    if (showExplanation && selected !== null) {
      explDiv.textContent = q.explanation;
      explDiv.style.marginTop = '1em';
      explDiv.style.color = '#444';
    }
    // Siguiente/Volver
    nextBtn.style.display = showExplanation ? 'block' : 'none';
  }

  nextBtn.addEventListener('click', () => {
    if (questionNumber) {
      onBack();
    } else {
      current = (current + 1 < questions.length) ? current + 1 : 0;
      selected = null;
      showFeedback = false;
      showExplanation = false;
      // Re-render
      mount.innerHTML = '';
      GameScreen({ mount, questionNumber: null, onBack });
    }
  });

  updateUI();
  mount.appendChild(root);
}

import { questions } from "./data.js";

// Pantalla 2: GameScreen

export function GameScreen({ mount, questionNumber, onBack }) {
  let current = 0;
  let selected = null;
  let showFeedback = false;
  let showExplanation = false;

  let q = null;
  let showNumber = null;
  let progress = null;
  if (questionNumber) {
    q = questions.find((p) => p.id === questionNumber);
    showNumber = `Pregunta Nº ${questionNumber}`;
    progress = null;
  } else {
    q = questions[current];
    progress = `Pregunta ${current + 1} de ${questions.length}`;
  }

  const root = document.createElement('div');
  root.style.position = 'relative';
  root.style.minHeight = '480px';

  if (showNumber) {
      explDiv.style.color = '#444';
    }
    // Siguiente/Volver
    nextBtn.style.display = showExplanation ? 'block' : 'none';
  }

  nextBtn.addEventListener('click', () => {
    if (questionNumber) {
      onBack();
    } else {
      current = (current + 1 < questions.length) ? current + 1 : 0;
      selected = null;
      showFeedback = false;
      showExplanation = false;
      // Re-render
      mount.innerHTML = '';
      GameScreen({ mount, questionNumber: null, onBack });
    }
  });

  updateUI();
  mount.appendChild(root);
}
import { questions } from "./data.js";

// Pantalla 2: GameScreen

export function GameScreen({ mount, questionNumber, onBack }) {
  let current = 0;
  let selected = null;
  let showFeedback = false;
