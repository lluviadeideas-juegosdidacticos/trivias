import { useState } from "react";
import { HomeScreen } from "./HomeScreen";
import { GameScreen } from "./GameScreen";
import "./styles.css";

// Controlador principal de estado
export function TriviaApp() {
  const [screen, setScreen] = useState("home");

  return screen === "home" ? (
    <HomeScreen onStart={() => setScreen("game")} />
  ) : (
    <GameScreen onBack={() => setScreen("home")} />
  );
}
