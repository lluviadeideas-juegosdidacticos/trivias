
import { useState } from "react";
import { questions } from "./data";

// Pantalla 2: GameScreen



export function GameScreen({ questionNumber }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Si se pasa questionNumber, buscar pregunta por id exacto
  let q = null;
  let showNumber = null;
  let progress = null;
  if (questionNumber) {
    q = questions.find((p) => p.id === questionNumber);
    showNumber = `Pregunta Nº ${questionNumber}`;
    progress = null;
    if (!q) {
      console.error("Question ID not found:", questionNumber);
    }
  } else {
    q = questions[current];
    progress = `Pregunta ${current + 1} de ${questions.length}`;
  }

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
    if (questionNumber) {
      // Si se entró por dado, volver a home al terminar
      window.location.reload(); // simple reset UX
    } else {
      setCurrent((prev) => (prev + 1 < questions.length ? prev + 1 : 0));
    }
  }

  return (
    <div className="trivia-app" role="main">
      {showNumber && (
        <div className="trivia-question-number" style={{ fontSize: '1.1rem', color: '#1a73e8', fontWeight: 600, marginBottom: 8, textAlign: 'right' }}>{showNumber}</div>
      )}
      {progress && <div className="trivia-progress" aria-label="Progreso">{progress}</div>}
      {q ? (
        <div className="trivia-question" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{q.question}</div>
      ) : (
        <div className="trivia-question" style={{ fontSize: '1.2rem', color: '#c62828', fontWeight: 600, margin: '2rem 0' }}>Pregunta no disponible</div>
      )}
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
