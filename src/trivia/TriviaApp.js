

import { useState } from "https://esm.sh/react@18.2.0";
import { HomeScreen } from "./HomeScreen.js";
import { GameScreen } from "./GameScreen.js";
import "./styles.css";

console.log("TRIVIA VERSION NEW");

// Controlador principal de estado
export function TriviaApp() {
  const [screen, setScreen] = useState("home");
  const [questionNumber, setQuestionNumber] = useState(null);

  function handleStart(number) {
    setQuestionNumber(number);
    setScreen("game");
  }

  return screen === "home"
    ? HomeScreen({ onStart: handleStart })
    : GameScreen({ questionNumber, onBack: () => setScreen("home") });
}
