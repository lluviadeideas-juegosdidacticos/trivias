function setStatus(text) {
	const statusEl = document.getElementById("app-status");
	if (!statusEl) return;
	statusEl.textContent = text;
}

window.addEventListener("DOMContentLoaded", () => {
	setStatus("Build 0 listo");

	const startButton = document.getElementById("start-button");
	if (!startButton) return;

	startButton.addEventListener("click", () => {
		setStatus("Próximo paso: selector de trivia");
	});
});
