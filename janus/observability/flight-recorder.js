// Minimal in-memory event recorder for Janus observability
const _events = [];

export function recordEvent(type, payload = {}) {
  _events.push({
    type,
    payload,
    timestamp: Date.now(),
  });
}

export function getEvents() {
  return _events.slice();
}

export function clearEvents() {
  _events.length = 0;
}
