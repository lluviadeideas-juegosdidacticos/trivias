

import { HomeScreen } from "./HomeScreen.js";
import { GameScreen } from "./GameScreen.js";
import "./styles.css";

console.log("TRIVIA VERSION NEW");

// Controlador principal de estado
export function TriviaApp(root) {
  let screen = "home";
  let questionNumber = null;

  function handleStart(number) {
    questionNumber = number;
    screen = "game";
  }

  function render() {
    root.innerHTML = "";
    if (screen === "home") {
      HomeScreen({
        mount: root,
        onStart: handleStart,
      });
    } else {
      GameScreen({
        mount: root,
        questionNumber,
        onBack: () => {
          screen = "home";
          questionNumber = null;
          render();
        },
      });
    }
  }
}
  render();
