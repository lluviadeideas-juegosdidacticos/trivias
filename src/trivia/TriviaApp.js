import { recordEvent } from "../../janus/observability/flight-recorder.js";
import * as events from "../../janus/observability/runtime-events.js";

import { HomeScreen } from "./HomeScreen.js";
import { GameScreen } from "./GameScreen.js";


export function TriviaApp({ mount }) {
  // Janus Observability: record COMPONENT_MOUNT on app init
  recordEvent(events.COMPONENT_MOUNT, { component: "TriviaApp", timestamp: Date.now() });

  let screen = "home";
  let questionNumber = null;

  function handleStart(number) {
    const normalizedNumber = Number(number);
    questionNumber = normalizedNumber;
    screen = "game";
    render();
  }

  function handleBack() {
    screen = "home";
    questionNumber = null;
    render();
  }

  function render() {
    mount.innerHTML = "";
    if (screen === "home") {
      HomeScreen({
        mount: mount,
        onStart: handleStart,
      });
    } else {
      GameScreen({
        mount: mount,
        questionNumber,
        onBack: handleBack,
      });
    }
  }

  // Minimal error boundary for JS_ERROR
  try {
    render();
  } catch (error) {
    try {
      recordEvent(events.JS_ERROR, {
        message: error?.message,
        stack: error?.stack,
        context: 'TriviaApp',
      });
    } catch (e) {}
    throw error;
  }
}
