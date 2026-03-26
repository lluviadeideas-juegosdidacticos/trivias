(function initJanus(global) {
	if (global.Janus) return;

	const BUILD = "build-4-j";
	const SESSION_STORAGE_KEY = "janus_session_id";
	const listeners = [];

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

	function notify(event) {
		for (const fn of listeners) {
			try {
				fn(event);
			} catch (err) {
				console.warn("[Janus] listener error", err);
			}
		}
	}

	const Janus = {
		build: BUILD,
		debug: true,
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
			Janus.debug = false; // Security: disable debug in production
			if (Janus.debug) console.log("[Janus]", event);
			notify(event);
			return event;
		},

		onEvent(fn) {
			if (typeof fn !== "function") return () => {};
			listeners.push(fn);
			return () => {
				const idx = listeners.indexOf(fn);
				if (idx >= 0) listeners.splice(idx, 1);
			};
		},
		getLastEvent() {
			return Janus.events.length ? Janus.events[Janus.events.length - 1] : null;
		},
		getSessionId() {
			return sessionId;
		},
		getBuild() {
			return BUILD;
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
