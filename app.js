function setStatus(text) {
	const statusEl = document.getElementById("app-status");
	if (!statusEl) return;
	statusEl.textContent = text;
}

function janusLog(type, source, payload) {
	if (!window.Janus || typeof window.Janus.log !== "function") return;
	window.Janus.log(type, source, payload);
}

function setConsoleValue(id, value) {
	const el = document.getElementById(id);
	if (!el) return;
	const text = value == null || value === "" ? "—" : String(value);
	el.textContent = text;
	el.title = text;
}

function setBadgeState(layer, isActive) {
	const el = document.querySelector(`.badge[data-layer="${layer}"]`);
	if (!el) return;
	if (!isActive) el.setAttribute("data-state", "inactive");
	else el.removeAttribute("data-state");
}

function computeAuditStatus(report) {
	if (!report) return { label: "—", hasIssues: false, active: false };
	const issues = Array.isArray(report.issues) ? report.issues : [];
	const hasIssues = issues.some((i) => Number(i?.count ?? 0) > 0);
	return { label: hasIssues ? "con issues" : "ok", hasIssues, active: true };
}

function formatLastEvent(evt) {
	if (!evt) return "—";
	const type = String(evt.type ?? "").trim();
	const source = String(evt.source ?? "").trim();
	const stamp = String(evt.timestamp ?? "").trim();
	const left = [type, source].filter(Boolean).join(" · ");
	return stamp ? `${left} @ ${stamp}` : left || "(evento)";
}

function updateJanusConsole() {
	const janus = window.Janus;
	const build = janus?.getBuild ? janus.getBuild() : janus?.build;
	const session = janus?.getSessionId ? janus.getSessionId() : janus?.events?.[0]?.session_id;
	const total = janus?.count ? janus.count() : Array.isArray(janus?.events) ? janus.events.length : 0;
	const last = janus?.getLastEvent ? janus.getLastEvent() : null;

	setConsoleValue("janus-build", build ?? "—");
	setConsoleValue("janus-session", session ?? "—");
	setConsoleValue("janus-count", total);
	setConsoleValue("janus-last", formatLastEvent(last));
	setConsoleValue("janus-csv", triviaDb?.path ?? CSV_PATH);

	const auditStatus = computeAuditStatus(latestAuditReport);
	setConsoleValue("janus-audit", auditStatus.label);

	setBadgeState("product", true);
	setBadgeState("events", true);
	setBadgeState("audit", auditStatus.active);
	setBadgeState("export", Boolean(latestAuditReport));
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

function setFeedback(text, kind) {
	const el = document.getElementById("result-feedback");
	if (!el) return;
	const hintEl = document.getElementById("result-hint");

	el.classList.remove("feedback--ok", "feedback--bad");

	if (!text) {
		el.textContent = "";
		el.hidden = true;
		if (hintEl) {
			hintEl.textContent = "Elegí una respuesta para ver la devolución";
			hintEl.hidden = false;
		}
		return;
	}

	if (kind === "ok") el.classList.add("feedback--ok");
	if (kind === "bad") el.classList.add("feedback--bad");

	el.textContent = text;
	el.hidden = false;
	if (hintEl) hintEl.hidden = true;
}

function setCardHidden(id, hidden) {
	const el = document.getElementById(id);
	if (!el) return;
	el.hidden = Boolean(hidden);
}

function setAnswers(options) {
	const container = document.getElementById("result-answers");
	if (!container) return;

	container.innerHTML = "";

	if (!options || options.length === 0) {
		container.hidden = true;
		return;
	}

	for (const option of options) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "answer-option";
		button.dataset.choice = option.choice;
		button.disabled = Boolean(option.disabled);

		const meta = document.createElement("span");
		meta.className = "answer-meta";
		meta.textContent = option.choice;

		const text = document.createElement("span");
		text.className = "answer-text";
		text.textContent = option.text;

		button.appendChild(meta);
		button.appendChild(text);
		container.appendChild(button);
	}

	container.hidden = false;
}

function setAuditHtml(html) {
	const el = document.getElementById("audit-content");
	if (!el) return;
	el.innerHTML = html;
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

function normalizeCorrectChoice(value) {
	const raw = String(value ?? "").trim().toUpperCase();
	if (raw === "A" || raw === "B" || raw === "C") return raw;
	if (raw === "1") return "A";
	if (raw === "2") return "B";
	if (raw === "3") return "C";
	return null;
}

const CSV_PATH = "./data/impacto-ambiental-v1-2.csv";
let triviaDb = null;
let pendingCode = null;
let pendingRandomQuestion = false;
let currentCode = null;
let currentRecord = null;
let latestAuditReport = null;

async function loadTriviaDb() {
	janusLog("app_loaded", "system", { csvPath: CSV_PATH });
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
		records,
		questionHeader: headerMap.get("PREGUNTA") ?? null,
		topicHeader: headerMap.get("TEMA") ?? null,
		subtopicHeader: headerMap.get("SUBTEMA") ?? null,
		answerAHeader: headerMap.get("RESPUESTAS A") ?? headerMap.get("RESPUESTA A") ?? null,
		answerBHeader: headerMap.get("RESPUESTA B") ?? null,
		answerCHeader: headerMap.get("RESPUESTA C") ?? null,
		correctHeader: headerMap.get("RESPUESTA CORRECTA") ?? null,
		introHeader: headerMap.get("TEXTO INTRODUCTORIO") ?? null,
		outroHeader: headerMap.get("TEXTO FINAL") ?? null,
		byIdJuego,
	};

	console.info("CSV cargado:", triviaDb.path);
	console.info("Columnas detectadas:", triviaDb.headers);

	runAudit();
	updateJanusConsole();
}

function getCell(record, header) {
	if (!header) return "";
	return String(record?.[header] ?? "").trim();
}

function runAudit() {
	if (!triviaDb) return;

	const records = Array.isArray(triviaDb.records) ? triviaDb.records : [];
	const totalRecords = records.length;

	const idCounts = new Map();
	const missingIdCodes = [];
	for (const record of records) {
		const id = getCell(record, triviaDb.idHeader);
		if (!id) {
			missingIdCodes.push("(sin ID JUEGO)");
			continue;
		}
		idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
	}
	const uniqueCodes = idCounts.size;
	const duplicateCodes = Array.from(idCounts.entries())
		.filter(([, count]) => count > 1)
		.map(([id, count]) => ({ id, count }))
		.sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));

	const questionHeader = triviaDb.questionHeader;
	const topicHeader = triviaDb.topicHeader;
	const subtopicHeader = triviaDb.subtopicHeader;
	const correctHeader = triviaDb.correctHeader;

	const missingQuestion = [];
	const missingCorrect = [];
	const missingTopic = [];
	const missingSubtopic = [];
	const invalidCorrectValue = [];
	const correctOptionMissingText = [];
	const correctDistinctRaw = new Set();

	for (const record of records) {
		const code = getCell(record, triviaDb.idHeader) || "(sin ID JUEGO)";

		const question = getCell(record, questionHeader);
		if (!question) missingQuestion.push(code);

		const topic = getCell(record, topicHeader);
		if (!topic) missingTopic.push(code);

		const subtopic = getCell(record, subtopicHeader);
		if (!subtopic) missingSubtopic.push(code);

		const correctRaw = getCell(record, correctHeader);
		if (!correctRaw) {
			missingCorrect.push(code);
			continue;
		}

		correctDistinctRaw.add(String(correctRaw).trim());

		const correct = normalizeCorrectChoice(correctRaw);
		if (!correct) {
			invalidCorrectValue.push(`${code}: ${correctRaw}`);
			continue;
		}

		if (correct === "A" && !getCell(record, triviaDb.answerAHeader)) correctOptionMissingText.push(`${code}: A`);
		if (correct === "B" && !getCell(record, triviaDb.answerBHeader)) correctOptionMissingText.push(`${code}: B`);
		if (correct === "C" && !getCell(record, triviaDb.answerCHeader)) correctOptionMissingText.push(`${code}: C`);
	}

	const metrics = {
		totalRecords,
		uniqueCodes,
		duplicateCodesCount: duplicateCodes.length,
		missingQuestionCount: missingQuestion.length,
		missingCorrectCount: missingCorrect.length,
		missingTopicCount: missingTopic.length,
		missingSubtopicCount: missingSubtopic.length,
		invalidCorrectValueCount: invalidCorrectValue.length,
		correctOptionMissingTextCount: correctOptionMissingText.length,
		correctDistinctValuesCount: correctDistinctRaw.size,
	};

	janusLog("audit_run", "audit", {
		csvPath: triviaDb.path,
		metrics,
	});

	const issues = [
		{ key: "duplicate_codes", count: metrics.duplicateCodesCount, sample: duplicateCodes.slice(0, 10) },
		{ key: "missing_question", count: metrics.missingQuestionCount, sample: missingQuestion.slice(0, 10) },
		{ key: "missing_correct", count: metrics.missingCorrectCount, sample: missingCorrect.slice(0, 10) },
		{ key: "missing_topic", count: metrics.missingTopicCount, sample: missingTopic.slice(0, 10) },
		{ key: "missing_subtopic", count: metrics.missingSubtopicCount, sample: missingSubtopic.slice(0, 10) },
		{
			key: "invalid_correct_value",
			count: metrics.invalidCorrectValueCount,
			sample: invalidCorrectValue.slice(0, 10),
		},
		{
			key: "correct_option_missing_text",
			count: metrics.correctOptionMissingTextCount,
			sample: correctOptionMissingText.slice(0, 10),
		},
	];

	latestAuditReport = {
		generated_at: new Date().toISOString(),
		csv: {
			path: triviaDb.path,
			name: triviaDb.path.split("/").pop() || triviaDb.path,
		},
		build: window.Janus?.build ?? "unknown",
		metrics,
		issues,
		samples: {
			duplicate_codes: duplicateCodes.slice(0, 20),
			invalid_correct_value: invalidCorrectValue.slice(0, 30),
			correct_option_missing_text: correctOptionMissingText.slice(0, 30),
			correct_distinct_values: Array.from(correctDistinctRaw)
				.sort((a, b) => a.localeCompare(b, "es"))
				.slice(0, 40),
		},
	};

	for (const issue of issues) {
		if (issue.count > 0) {
			janusLog("audit_issue_detected", "audit", {
				issue: issue.key,
				count: issue.count,
				sample: issue.sample,
			});
		}
	}

	const duplicateText =
		duplicateCodes.length === 0
			? "(sin duplicados)"
			: duplicateCodes
					.slice(0, 20)
					.map((d) => `${d.id} (x${d.count})`)
					.join("\n") + (duplicateCodes.length > 20 ? `\n… (+${duplicateCodes.length - 20})` : "");

	const invalidCorrectText =
		invalidCorrectValue.length === 0
			? "(sin valores inválidos)"
			: invalidCorrectValue.slice(0, 30).join("\n") +
						(invalidCorrectValue.length > 30 ? `\n… (+${invalidCorrectValue.length - 30})` : "");

	const optionMissingText =
		correctOptionMissingText.length === 0
			? "(sin casos)"
			: correctOptionMissingText.slice(0, 30).join("\n") +
						(correctOptionMissingText.length > 30
							? `\n… (+${correctOptionMissingText.length - 30})`
							: "");

	const correctValuesText =
		correctDistinctRaw.size === 0
			? "(sin datos)"
			: Array.from(correctDistinctRaw)
					.sort((a, b) => a.localeCompare(b, "es"))
					.slice(0, 40)
					.join("\n") + (correctDistinctRaw.size > 40 ? `\n… (+${correctDistinctRaw.size - 40})` : "");

	setAuditHtml(`
		<div class="audit-grid">
			<div class="audit-metric"><span class="audit-key">Total de registros</span><span class="audit-value">${metrics.totalRecords}</span></div>
			<div class="audit-metric"><span class="audit-key">Códigos únicos (ID JUEGO)</span><span class="audit-value">${metrics.uniqueCodes}</span></div>
			<div class="audit-metric"><span class="audit-key">Códigos duplicados</span><span class="audit-value">${metrics.duplicateCodesCount}</span></div>
			<div class="audit-metric"><span class="audit-key">Registros sin pregunta</span><span class="audit-value">${metrics.missingQuestionCount}</span></div>
			<div class="audit-metric"><span class="audit-key">Registros sin respuesta correcta</span><span class="audit-value">${metrics.missingCorrectCount}</span></div>
			<div class="audit-metric"><span class="audit-key">Registros sin tema</span><span class="audit-value">${metrics.missingTopicCount}</span></div>
			<div class="audit-metric"><span class="audit-key">Registros sin subtema</span><span class="audit-value">${metrics.missingSubtopicCount}</span></div>
			<div class="audit-metric"><span class="audit-key">Respuesta correcta inválida (no A/B/C)</span><span class="audit-value">${metrics.invalidCorrectValueCount}</span></div>
			<div class="audit-metric"><span class="audit-key">Correcta sin texto en su opción</span><span class="audit-value">${metrics.correctOptionMissingTextCount}</span></div>
			<div class="audit-metric"><span class="audit-key">Valores distintos en RESPUESTA CORRECTA</span><span class="audit-value">${metrics.correctDistinctValuesCount}</span></div>
		</div>

		<div class="audit-list">
			<p class="audit-list-title">Duplicados ID JUEGO (muestra)</p>
			<pre class="audit-mono">${duplicateText}</pre>
		</div>
		<div class="audit-list">
			<p class="audit-list-title">RESPUESTA CORRECTA inválida (muestra)</p>
			<pre class="audit-mono">${invalidCorrectText}</pre>
		</div>
		<div class="audit-list">
			<p class="audit-list-title">Correcta que referencia opción sin texto (muestra)</p>
			<pre class="audit-mono">${optionMissingText}</pre>
		</div>
		<div class="audit-list">
			<p class="audit-list-title">Valores detectados en RESPUESTA CORRECTA</p>
			<pre class="audit-mono">${correctValuesText}</pre>
		</div>
	`);

	const exportButton = document.getElementById("audit-export");
	if (exportButton) exportButton.disabled = false;
	updateJanusConsole();
}

function downloadJson(filename, data) {
	const json = JSON.stringify(data, null, 2);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.rel = "noopener";
	// Safari: needs element in DOM
	document.body.appendChild(a);
	a.click();
	a.remove();

	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function getTopics() {
	if (!triviaDb?.records || !triviaDb.topicHeader) return [];
	const set = new Set();
	for (const record of triviaDb.records) {
		const value = String(record[triviaDb.topicHeader] ?? "").trim();
		if (value) set.add(value);
	}
	return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}

function getSubtopicsForTopic(topic) {
	if (!triviaDb?.records || !triviaDb.topicHeader || !triviaDb.subtopicHeader) return [];
	const set = new Set();
	for (const record of triviaDb.records) {
		const recordTopic = String(record[triviaDb.topicHeader] ?? "").trim();
		if (recordTopic !== topic) continue;
		const value = String(record[triviaDb.subtopicHeader] ?? "").trim();
		set.add(value);
	}
	return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}

function getRandomRecordByTopicSubtopic(topic, subtopic) {
	if (!triviaDb?.records || !triviaDb.topicHeader || !triviaDb.subtopicHeader) return null;
	const pool = [];
	for (const record of triviaDb.records) {
		const recordTopic = String(record[triviaDb.topicHeader] ?? "").trim();
		if (recordTopic !== topic) continue;
		const recordSubtopic = String(record[triviaDb.subtopicHeader] ?? "").trim();
		if (recordSubtopic !== subtopic) continue;
		pool.push(record);
	}
	if (pool.length === 0) return null;
	return pool[Math.floor(Math.random() * pool.length)];
}

function setSelectOptions(selectEl, options, placeholder) {
	if (!selectEl) return;
	selectEl.innerHTML = "";

	const first = document.createElement("option");
	first.value = "";
	first.textContent = placeholder;
	first.selected = true;
	selectEl.appendChild(first);

	for (const opt of options) {
		const optionEl = document.createElement("option");
		optionEl.value = opt;
		optionEl.textContent = opt || "(Sin subtema)";
		selectEl.appendChild(optionEl);
	}
}

function renderRecordForCode(code, record) {
	currentCode = code;
	currentRecord = record;
	setResultCode(code);
	setFeedback("", "");
	setCardHidden("outro-card", true);
	setResultText("result-outro", "");

	if (!triviaDb?.questionHeader) {
		setResultText("result-question", "Campo de pregunta no disponible en esta base.");
	} else {
		const question = String(record[triviaDb.questionHeader] ?? "").trim();
		setResultText("result-question", question || "Pregunta no disponible para este código.");
	}

	const options = [
		{
			choice: "A",
			text: triviaDb?.answerAHeader
				? String(record[triviaDb.answerAHeader] ?? "").trim()
				: "",
		},
		{
			choice: "B",
			text: triviaDb?.answerBHeader
				? String(record[triviaDb.answerBHeader] ?? "").trim()
				: "",
		},
		{
			choice: "C",
			text: triviaDb?.answerCHeader
				? String(record[triviaDb.answerCHeader] ?? "").trim()
				: "",
		},
	].map((o) => ({
		...o,
		disabled: !o.text,
		text: o.text || `Opción ${o.choice} no disponible.`,
	}));

	setAnswers(options);

	if (triviaDb?.introHeader) {
		const intro = String(record[triviaDb.introHeader] ?? "").trim();
		if (intro) {
			setCardHidden("intro-card", false);
			setResultText("result-intro", intro);
		} else {
			setCardHidden("intro-card", true);
			setResultText("result-intro", "");
		}
	} else {
		setCardHidden("intro-card", true);
		setResultText("result-intro", "");
	}

	// TEXTO FINAL: se muestra automáticamente al responder.
	setResultText("result-outro", "");
}

function revealOutroForCurrentRecord() {
	if (!triviaDb?.outroHeader || !currentRecord) {
		setCardHidden("outro-card", true);
		setResultText("result-outro", "");
		return;
	}
	const outro = String(currentRecord[triviaDb.outroHeader] ?? "").trim();
	if (!outro) {
		setCardHidden("outro-card", true);
		setResultText("result-outro", "");
		return;
	}
	setCardHidden("outro-card", false);
	setResultText("result-outro", outro);
}

function renderNotFound(code) {
	currentCode = code;
	currentRecord = null;
	setResultCode(code);
	setCardHidden("intro-card", true);
	setCardHidden("outro-card", true);
	setResultText("result-intro", "");
	setResultText("result-outro", "");
	setResultText("result-question", `No se encontró pregunta para el código ${code}`);
	setAnswers([]);
	setFeedback("", "");
	setStatus(`No se encontró pregunta para el código ${code}`);
	janusLog("question_not_found", "lookup", { code });
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

	if (currentCode !== code) {
		setFeedback("", "");
	}

	janusLog("question_found", "lookup", { code });

	renderRecordForCode(code, record);
}

function serveRandomQuestion() {
	if (!triviaDb?.byIdJuego) {
		pendingRandomQuestion = true;
		setStatus("Cargando base…");
		return;
	}

	const entries = Array.from(triviaDb.byIdJuego.entries()).filter(([code]) => isValidCode(code));
	if (entries.length === 0) {
		setStatus("No hay preguntas disponibles para servir.");
		janusLog("random_question_unavailable", "engine", { reason: "empty_pool" });
		return;
	}

	const [code] = entries[Math.floor(Math.random() * entries.length)];
	setStatus(`Pregunta aleatoria servida: ${code}`);
	janusLog("random_question_served", "engine", { code, origin: "cta" });

	const manualCodeInput = document.getElementById("manual-code");
	if (manualCodeInput) manualCodeInput.value = code;

	lookupAndRender(code);
}

window.addEventListener("DOMContentLoaded", () => {
	setStatus("Listo para explorar.");
	setResultCode("—");
	setCardHidden("intro-card", true);
	setCardHidden("outro-card", true);
	setResultText("result-intro", "");
	setResultText("result-question", "");
	setResultText("result-outro", "");
	setAnswers([]);
	setFeedback("", "");
	updateJanusConsole();
	window.Janus?.onEvent?.(() => updateJanusConsole());

	const tryQuestionButton = document.getElementById("try-question");
	tryQuestionButton?.addEventListener("click", () => {
		janusLog("cta_try_question", "ui", { action: "random_question" });
		serveRandomQuestion();
	});

	loadTriviaDb()
		.then(() => {
			const topicSelect = document.getElementById("topic-select");
			const subtopicSelect = document.getElementById("subtopic-select");
			if (topicSelect && subtopicSelect) {
				const topics = getTopics();
				setSelectOptions(topicSelect, topics, "Seleccioná un tema");
				topicSelect.disabled = topics.length === 0;
				subtopicSelect.disabled = true;
			}

			if (pendingCode) {
				const code = pendingCode;
				pendingCode = null;
				lookupAndRender(code);
			}

			if (pendingRandomQuestion) {
				pendingRandomQuestion = false;
				serveRandomQuestion();
			}
		})
		.catch((error) => {
			console.error(error);
			setStatus("No se pudo cargar la base CSV local.");
			updateJanusConsole();
		});

	document.getElementById("audit-export")?.addEventListener("click", () => {
		if (!latestAuditReport) return;
		downloadJson("audit-impacto-ambiental-v1-2.json", latestAuditReport);
		janusLog("audit_exported", "audit", {
			csv: latestAuditReport.csv,
			build: latestAuditReport.build,
			metrics: latestAuditReport.metrics,
		});
		updateJanusConsole();
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
				janusLog("code_entered", "ui", { code: normalized });
				lookupAndRender(normalized);
			} else if (normalized.length === 0) {
				setResultCode("—");
				setCardHidden("intro-card", true);
				setCardHidden("outro-card", true);
				setResultText("result-intro", "");
				setResultText("result-question", "");
				setResultText("result-outro", "");
				setAnswers([]);
				setFeedback("", "");
				currentCode = null;
				currentRecord = null;
			}
		});
	}

	const rollButton = document.getElementById("roll-button");
	if (rollButton) {
		rollButton.addEventListener("click", () => {
			const code = generateRollCode();
			setStatus(`Código generado: ${code}`);
			janusLog("dice_generated", "ui", { code });
			lookupAndRender(code);
		});
	}

	const topicSelect = document.getElementById("topic-select");
	const subtopicSelect = document.getElementById("subtopic-select");

	if (topicSelect && subtopicSelect) {
		topicSelect.addEventListener("change", () => {
			const topic = String(topicSelect.value ?? "");
			janusLog("topic_selected", "ui", { topic });

			if (!topic) {
				setSelectOptions(subtopicSelect, [], "Seleccioná un tema primero");
				subtopicSelect.disabled = true;
				return;
			}

			const subtopics = getSubtopicsForTopic(topic);
			setSelectOptions(subtopicSelect, subtopics, "Seleccioná un subtema");
			subtopicSelect.disabled = subtopics.length === 0;
		});

		subtopicSelect.addEventListener("change", () => {
			const topic = String(topicSelect.value ?? "");
			const subtopic = String(subtopicSelect.value ?? "");
			janusLog("subtopic_selected", "ui", { topic, subtopic });

			if (!topic || subtopicSelect.disabled || subtopic === "") return;

			const record = getRandomRecordByTopicSubtopic(topic, subtopic);
			if (!record) {
				setStatus("No se encontró una pregunta para ese tema/subtema.");
				return;
			}

			const code = String(record[triviaDb.idHeader] ?? "").trim();
			setStatus(`Pregunta aleatoria servida: ${code}`);
			janusLog("random_question_served", "engine", { topic, subtopic, code });
			renderRecordForCode(code, record);
		});
	}

	const rerender = () => {
		if (!currentCode || !currentRecord) return;
		renderRecordForCode(currentCode, currentRecord);
	};

	document.getElementById("result-answers")?.addEventListener("click", (event) => {
		const button = event.target.closest("button[data-choice]");
		if (!button) return;
		if (!currentRecord || !triviaDb) return;

		const choice = String(button.dataset.choice ?? "").toUpperCase();
		janusLog("answer_selected", "ui", { code: currentCode, choice });

		if (!triviaDb.correctHeader) {
			setFeedback("No se puede validar: campo RESPUESTA CORRECTA no disponible en esta base.", "bad");
			setStatus("No se pudo validar la respuesta.");
			revealOutroForCurrentRecord();
			return;
		}

		const correct = String(currentRecord[triviaDb.correctHeader] ?? "").trim().toUpperCase();
		const correctChoice = normalizeCorrectChoice(correct);
		if (!correctChoice) {
			setFeedback("No se pudo validar: valor de respuesta correcta inválido.", "bad");
			setStatus("No se pudo validar la respuesta.");
			revealOutroForCurrentRecord();
			return;
		}

		if (choice === correctChoice) {
			janusLog("answer_correct", "validation", { code: currentCode, choice, correct: correctChoice });
			setFeedback("Respuesta correcta", "ok");
			setStatus("Respuesta correcta");
			revealOutroForCurrentRecord();
			return;
		}

		janusLog("answer_incorrect", "validation", { code: currentCode, choice, correct: correctChoice });
		setFeedback(`Respuesta incorrecta. La correcta era: ${correctChoice}`, "bad");
		setStatus(`Respuesta incorrecta. La correcta era: ${correctChoice}`);
		revealOutroForCurrentRecord();
	});
});
