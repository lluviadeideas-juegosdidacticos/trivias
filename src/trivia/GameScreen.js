
import { useState } from "react";
import { questions } from "./data";

// Pantalla 2: GameScreen

export function GameScreen() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const q = questions[current];
  const isAnswered = selected !== null;
  const isCorrect = isAnswered && selected === q.answer;

  // Progreso
  const progress = `Pregunta ${current + 1} de ${questions.length}`;

  function handleSelect(idx) {
    if (!isAnswered) {
      setSelected(idx);
      setShowFeedback(true);
      setTimeout(() => setShowExplanation(true), 350);
    }
  }

  function handleNext() {
    setSelected(null);
    setShowFeedback(false);
    setShowExplanation(false);
    setCurrent((prev) => (prev + 1 < questions.length ? prev + 1 : 0));
  }

  return (
    <div className="trivia-app" role="main">
      <div className="trivia-progress" aria-label="Progreso">{progress}</div>
      <div className="trivia-question" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{q.question}</div>
      <div className="trivia-options">
        {q.options.map((opt, idx) => {
          let btnClass = "trivia-option";
          if (isAnswered) {
            if (idx === selected) {
              btnClass += idx === q.answer ? " correct selected" : " incorrect selected";
            } else if (idx === q.answer) {
              btnClass += " correct";
            } else {
              btnClass += " disabled";
            }
          }
          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              aria-pressed={isAnswered && idx === selected}
              tabIndex={isAnswered ? -1 : 0}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Estado 2: feedback + explicación + siguiente */}
      {isAnswered && (
        <>
          <div
            className={
              "trivia-feedback" +
              (isCorrect ? " correct" : " incorrect")
            }
            aria-live="polite"
            style={{ fontWeight: 600, fontSize: '1.1rem' }}
          >
            {isCorrect ? "¡Correcto!" : "Incorrecto."}
          </div>
          {showExplanation && (
            <div className="trivia-explanation">{q.explanation}</div>
          )}
          {showExplanation && (
            <button className="trivia-btn" onClick={handleNext}>
              Siguiente
            </button>
          )}
        </>
      )}
    </div>
  );
}
