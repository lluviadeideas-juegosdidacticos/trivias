
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
