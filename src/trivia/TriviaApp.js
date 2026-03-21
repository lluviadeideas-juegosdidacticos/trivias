// TriviaApp browser-native, sin React ni JSX
import { HomeScreen } from "./HomeScreen.js";
import { GameScreen } from "./GameScreen.js";
import "./styles.css";

export function TriviaApp(root) {
  let screen = "home";
  let questionNumber = null;

  function render() {
    root.innerHTML = "";
    if (screen === "home") {
      HomeScreen({
        mount: root,
        onStart: (number) => {
          questionNumber = number;
          screen = "game";
          render();
        },
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
  render();
}


// TriviaApp browser-native, sin React ni JSX
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
  render();
}
  render();
