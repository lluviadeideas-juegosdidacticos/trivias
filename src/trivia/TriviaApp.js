import { HomeScreen } from "./HomeScreen.js";
import { GameScreen } from "./GameScreen.js";

export function TriviaApp(root) {
  let screen = "home";
  let questionNumber = null;

  function handleStart(number) {
    questionNumber = number;
    screen = "game";
    render();
  }

  function handleBack() {
    screen = "home";
    questionNumber = null;
    render();
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
        onBack: handleBack,
      });
    }
  }

  render();
}
