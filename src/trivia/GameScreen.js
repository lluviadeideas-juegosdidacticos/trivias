import { useState } from "react";
import { questions } from "./data";

// Pantalla 2: GameScreen
export function GameScreen({ onBack }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const q = questions[current];
  const isAnswered = selected !== null;
  const isCorrect = isAnswered && selected === q.answer;

  function handleSelect(idx) {
    if (!isAnswered) {
      setSelected(idx);
      setShowFeedback(true);
    }
  }

  function handleNext() {
    setSelected(null);
    setShowFeedback(false);
    setCurrent((prev) => (prev + 1 < questions.length ? prev + 1 : 0));
  }

  return (
    <div className="trivia-app" role="main">
      <div className="trivia-question">{q.question}</div>
      <div className="trivia-options">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            className={
              "trivia-option" +
              (isAnswered && idx === selected
                ? isCorrect
                  ? " correct"
                  : " incorrect"
                : "") +
              (isAnswered && idx !== selected && idx === q.answer ? " correct" : "") +
              (isAnswered && idx === selected ? " selected" : "")
            }
            onClick={() => handleSelect(idx)}
            disabled={isAnswered}
            aria-pressed={isAnswered && idx === selected}
          >
            {opt}
          </button>
        ))}
      </div>
      <div
        className={
          "trivia-feedback" +
          (isAnswered ? (isCorrect ? " correct" : " incorrect") : "")
        }
        aria-live="polite"
      >
        {isAnswered
          ? isCorrect
            ? "¡Correcto!"
            : "Incorrecto."
          : ""}
      </div>
      {isAnswered && (
        <div className="trivia-explanation">{q.explanation}</div>
      )}
      <button className="trivia-btn" onClick={handleNext} disabled={!isAnswered}>
        Siguiente
      </button>
    </div>
  );
}
