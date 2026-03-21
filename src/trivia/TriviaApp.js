
import { useState } from "react";
import { HomeScreen } from "./HomeScreen";
import { GameScreen } from "./GameScreen";
import "./styles.css";

// Controlador principal de estado
export function TriviaApp() {
  const [screen, setScreen] = useState("home");
  const [questionNumber, setQuestionNumber] = useState(null);

  function handleStart(number) {
    setQuestionNumber(number);
    setScreen("game");
  }

  return screen === "home" ? (
    <HomeScreen onStart={handleStart} />
  ) : (
    <GameScreen questionNumber={questionNumber} onBack={() => setScreen("home")} />
  );
}
