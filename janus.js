(function initJanus(global) {
	if (global.Janus) return;

	const BUILD = "build-4-j";
	const SESSION_STORAGE_KEY = "janus_session_id";

	function nowIso() {
		return new Date().toISOString();
	}

	function makeId() {
		if (global.crypto?.randomUUID) return global.crypto.randomUUID();
		return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
	}

	function getOrCreateSessionId() {
		try {
			const storage = global.sessionStorage;
			const existing = storage?.getItem(SESSION_STORAGE_KEY);
			if (existing) return existing;
			const created = makeId();
			storage?.setItem(SESSION_STORAGE_KEY, created);
			return created;
		} catch {
			return makeId();
		}
	}

	const sessionId = getOrCreateSessionId();

	function safePayload(payload) {
		if (payload && typeof payload === "object") return payload;
		if (payload == null) return {};
		return { value: payload };
	}

	function safeClonePayload(payload) {
		try {
			return JSON.parse(JSON.stringify(safePayload(payload)));
		} catch {
			return { note: "payload_not_serializable" };
		}
	}

	function updateDiagnostics() {
		const el = global.document?.getElementById("janus-count");
		if (!el) return;
		el.textContent = String(Janus.events.length);
	}

	const Janus = {
		events: [],

		log(type, source, payload) {
			const event = {
				id: makeId(),
				timestamp: nowIso(),
				type: String(type),
				source: String(source),
				session_id: sessionId,
				build: BUILD,
				payload: safeClonePayload(payload),
			};

			Janus.events.push(event);
			updateDiagnostics();
			console.log("[Janus]", event);
			return event;
		},

		getEvents() {
			return Janus.events.slice();
		},

		count() {
			return Janus.events.length;
		},
	};

	global.Janus = Janus;

	if (global.document) {
		if (global.document.readyState === "loading") {
			global.document.addEventListener("DOMContentLoaded", updateDiagnostics);
		} else {
			updateDiagnostics();
		}
	}
})(typeof window !== "undefined" ? window : globalThis);
