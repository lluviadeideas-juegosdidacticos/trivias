function setStatus(text) {
	const statusEl = document.getElementById("app-status");
	if (!statusEl) return;
	statusEl.textContent = text;
}

function setResultCode(code) {
	const codeEl = document.getElementById("result-code");
	if (!codeEl) return;
	codeEl.textContent = code;
}

function setResultText(id, text) {
	const el = document.getElementById(id);
	if (!el) return;

	if (!text) {
		el.textContent = "";
		el.hidden = true;
		return;
	}

	el.textContent = text;
	el.hidden = false;
}

function showTriviaSelector() {
	const selectorEl = document.getElementById("trivia-selector");
	if (!selectorEl) return;
	selectorEl.hidden = false;
}

function parseCsv(text) {
	const rows = [];
	let row = [];
	let field = "";
	let inQuotes = false;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];

		if (inQuotes) {
			if (char === '"') {
				if (text[i + 1] === '"') {
					field += '"';
					i++;
				} else {
					inQuotes = false;
				}
			} else {
				field += char;
			}
			continue;
		}

		if (char === '"') {
			inQuotes = true;
			continue;
		}

		if (char === ",") {
			row.push(field);
			field = "";
			continue;
		}

		if (char === "\n") {
			row.push(field);
			rows.push(row);
			row = [];
			field = "";
			continue;
		}

		if (char === "\r") {
			continue;
		}

		field += char;
	}

	if (field.length > 0 || row.length > 0) {
		row.push(field);
		rows.push(row);
	}

	const nonEmptyRows = rows.filter((r) => r.some((cell) => String(cell).trim().length > 0));
	if (nonEmptyRows.length === 0) {
		return { headers: [], records: [] };
	}

	const rawHeaders = nonEmptyRows[0];
	const headers = rawHeaders.map((h) => String(h).replace(/^\uFEFF/, "").trim());
	const records = [];

	for (let r = 1; r < nonEmptyRows.length; r++) {
		const values = nonEmptyRows[r];
		const record = {};
		for (let c = 0; c < headers.length; c++) {
			record[headers[c]] = values[c] ?? "";
		}
		records.push(record);
	}

	return { headers, records };
}

function normalizeHeader(header) {
	return String(header)
		.replace(/^\uFEFF/, "")
		.trim()
		.replace(/\s+/g, " ")
		.toUpperCase();
}

function normalizeManualCode(value) {
	return value.replace(/\D/g, "").slice(0, 3);
}

function isValidCode(value) {
	return /^[1-6]{3}$/.test(value);
}

function generateRollCode() {
	const roll = () => Math.floor(Math.random() * 6) + 1;
	return `${roll()}${roll()}${roll()}`;
}

const CSV_PATH = "./data/impacto-ambiental-v1-2.csv";
let triviaDb = null;
let pendingCode = null;
let currentCode = null;
let currentRecord = null;

async function loadTriviaDb() {
	const response = await fetch(CSV_PATH);
	if (!response.ok) {
		throw new Error(`CSV fetch failed (${response.status})`);
	}

	const text = await response.text();
	const { headers, records } = parseCsv(text);

	const headerMap = new Map();
	for (const header of headers) {
		headerMap.set(normalizeHeader(header), header);
	}

	const idHeader = headerMap.get("ID JUEGO");
	if (!idHeader) {
		throw new Error("Missing 'ID JUEGO' column");
	}

	const byIdJuego = new Map();
	for (const record of records) {
		const key = String(record[idHeader] ?? "").trim();
		if (!key || byIdJuego.has(key)) continue;
		byIdJuego.set(key, record);
	}

	triviaDb = {
		path: CSV_PATH,
		headers,
		idHeader,
		questionHeader: headerMap.get("PREGUNTA") ?? null,
		introHeader: headerMap.get("TEXTO INTRODUCTORIO") ?? null,
		outroHeader: headerMap.get("TEXTO FINAL") ?? null,
		byIdJuego,
	};

	console.info("CSV cargado:", triviaDb.path);
	console.info("Columnas detectadas:", triviaDb.headers);
}

function renderRecordForCode(code, record) {
	currentCode = code;
	currentRecord = record;
	setResultCode(code);

	const showIntro = Boolean(document.getElementById("show-intro")?.checked);
	const showOutro = Boolean(document.getElementById("show-outro")?.checked);

	if (!triviaDb?.questionHeader) {
		setResultText("result-question", "Campo de pregunta no disponible en esta base.");
	} else {
		const question = String(record[triviaDb.questionHeader] ?? "").trim();
		setResultText("result-question", question || "Pregunta no disponible para este código.");
	}

	if (showIntro) {
		if (!triviaDb?.introHeader) {
			setResultText("result-intro", "Campo introductorio no disponible en esta base.");
		} else {
			const intro = String(record[triviaDb.introHeader] ?? "").trim();
			setResultText("result-intro", intro || "Introducción no disponible para este código.");
		}
	} else {
		setResultText("result-intro", "");
	}

	if (showOutro) {
		if (!triviaDb?.outroHeader) {
			setResultText("result-outro", "Campo final no disponible en esta base.");
		} else {
			const outro = String(record[triviaDb.outroHeader] ?? "").trim();
			setResultText("result-outro", outro || "Texto final no disponible para este código.");
		}
	} else {
		setResultText("result-outro", "");
	}
}

function renderNotFound(code) {
	currentCode = code;
	currentRecord = null;
	setResultCode(code);
	setResultText("result-intro", "");
	setResultText("result-outro", "");
	setResultText("result-question", `No se encontró pregunta para el código ${code}`);
	setStatus(`No se encontró pregunta para el código ${code}`);
}

function lookupAndRender(code) {
	if (!triviaDb) {
		pendingCode = code;
		return;
	}

	const record = triviaDb.byIdJuego.get(code);
	if (!record) {
		renderNotFound(code);
		return;
	}

	renderRecordForCode(code, record);
}

window.addEventListener("DOMContentLoaded", () => {
	setStatus("Build 0 listo");
	setResultCode("—");
	setResultText("result-intro", "");
	setResultText("result-question", "");
	setResultText("result-outro", "");

	loadTriviaDb()
		.then(() => {
			if (pendingCode) {
				const code = pendingCode;
				pendingCode = null;
				lookupAndRender(code);
			}
		})
		.catch((error) => {
			console.error(error);
			setStatus("No se pudo cargar la base CSV local.");
		});

	const startButton = document.getElementById("start-button");
	if (!startButton) return;

	startButton.addEventListener("click", () => {
		showTriviaSelector();
	});

	const manualCodeInput = document.getElementById("manual-code");
	if (manualCodeInput) {
		manualCodeInput.addEventListener("input", () => {
			const normalized = normalizeManualCode(manualCodeInput.value);
			if (manualCodeInput.value !== normalized) {
				manualCodeInput.value = normalized;
			}

			if (isValidCode(normalized)) {
				setStatus(`Código listo para buscar: ${normalized}`);
				lookupAndRender(normalized);
			} else if (normalized.length === 0) {
				setResultCode("—");
				setResultText("result-intro", "");
				setResultText("result-question", "");
				setResultText("result-outro", "");
				currentCode = null;
				currentRecord = null;
			}
		});
	}

	const rollButton = document.getElementById("roll-button");
	if (rollButton) {
		rollButton.addEventListener("click", () => {
			showTriviaSelector();
			const code = generateRollCode();
			setStatus(`Código generado: ${code}`);
			lookupAndRender(code);
		});
	}

	const rerender = () => {
		if (!currentCode || !currentRecord) return;
		renderRecordForCode(currentCode, currentRecord);
	};

	document.getElementById("show-intro")?.addEventListener("change", rerender);
	document.getElementById("show-outro")?.addEventListener("change", rerender);
});
