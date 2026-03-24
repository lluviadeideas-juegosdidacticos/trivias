import { questions } from "./data.js";

import { recordEvent } from "../../janus/observability/flight-recorder.js";
import * as events from "../../janus/observability/runtime-events.js";

export function GameScreen({ mount, questionNumber, onBack }) {
  const root = document.createElement('div');
  root.style.display = 'flex';
  root.style.flexDirection = 'column';
  root.style.alignItems = 'center';
  root.style.justifyContent = 'center';
  root.style.minHeight = '480px';

  const q = questions.find(q => q.id === questionNumber);
  console.log('GameScreen: typeof questionNumber', typeof questionNumber, questionNumber); // evidencia

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

  // Header: Pregunta N° X
  const headerDiv = document.createElement('div');
  headerDiv.textContent = `Pregunta N° ${questionNumber}`;
  headerDiv.style.fontSize = '1.08rem';
  headerDiv.style.fontWeight = '600';
  headerDiv.style.letterSpacing = '0.03em';
  headerDiv.style.color = '#1a73e8';
  headerDiv.style.margin = '0 0 16px 0';
  headerDiv.style.textAlign = 'center';
  root.appendChild(headerDiv);

  // Render intro text in a visually distinct box if present
  if (q.intro && q.intro.trim() !== '') {
    const introDiv = document.createElement('div');
    introDiv.className = 'game-intro-box';
    const introLabel = document.createElement('div');
    introLabel.className = 'game-intro-label';
    introLabel.textContent = 'Texto introductorio';
    const introText = document.createElement('div');
    introText.textContent = q.intro;
    introText.style.fontSize = '1rem';
    introText.style.color = '#444';
    introText.style.margin = '0';
    introText.style.lineHeight = '1.5';
    introDiv.appendChild(introLabel);
    introDiv.appendChild(introText);
    root.appendChild(introDiv);
  }

  // ...question number now rendered as header above

  const qDiv = document.createElement('div');
  qDiv.textContent = q.question;
  qDiv.style.fontSize = '1.45rem';
  qDiv.style.fontWeight = '800';
  qDiv.style.marginBottom = '1.5rem';
  qDiv.style.textAlign = 'center';
  qDiv.style.color = '#1a2a2a';
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
  // Remove default explDiv styling; will use a contained box for final text
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
      // Janus Observability: record USER_EVENT for answer
      try {
        recordEvent(events.USER_EVENT, {
          action: 'answer',
          questionId: q.id,
          selected: idx,
          correct: idx === q.answer,
          timestamp: Date.now(),
        });
      } catch (e) {}
      btn.style.background = idx === q.answer ? '#43a047' : '#e53935';
      btn.style.color = '#fff';
      feedbackDiv.textContent = idx === q.answer ? '¡Correcto!' : 'Incorrecto';
      feedbackDiv.style.color = idx === q.answer ? '#43a047' : '#e53935';
      // Render final/explanation text in a visually distinct box
      explDiv.innerHTML = '';
      if (q.explanation && q.explanation.trim() !== '') {
        const finalDiv = document.createElement('div');
        finalDiv.className = 'game-final-box';
        const finalLabel = document.createElement('div');
        finalLabel.className = 'game-final-label';
        finalLabel.textContent = 'Reflexión final';
        const finalText = document.createElement('div');
        finalText.textContent = q.explanation;
        finalText.style.fontSize = '1rem';
        finalText.style.color = '#444';
        finalText.style.margin = '0';
        finalText.style.lineHeight = '1.5';
        finalDiv.appendChild(finalLabel);
        finalDiv.appendChild(finalText);
        explDiv.appendChild(finalDiv);
      }
      nextBtn.style.display = 'block';
      // Janus Observability: record STATE_TRANSITION on result update
      try {
        recordEvent(events.STATE_TRANSITION, {
          questionId: q.id,
          selected: idx,
          correct: idx === q.answer,
          timestamp: Date.now(),
        });
      } catch (e) {}
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
  nextBtn.addEventListener('click', () => {
    // Janus Observability: record USER_EVENT for next
    try {
      recordEvent(events.USER_EVENT, {
        action: 'next',
        questionId: q.id,
        timestamp: Date.now(),
      });
    } catch (e) {}
    onBack();
  });
  root.appendChild(nextBtn);

  mount.appendChild(root);
}
