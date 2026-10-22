const MEASUREMENT_ID = 'G-F2JKMQ1ZLS';
const CONSENT_KEY = 'lluvia-analytics-consent';

let analyticsConsent = false;
let analyticsChoiceMade = false;
let analyticsLoaded = false;

function loadAnalytics() {
  if (!analyticsConsent || analyticsLoaded || typeof window === 'undefined') return;

  analyticsLoaded = true;
  window['ga-disable-' + MEASUREMENT_ID] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
  script.onerror = () => {
    analyticsLoaded = false;
  };
  document.head.appendChild(script);
}

export function initAnalytics() {
  try {
    const storedConsent = window.localStorage.getItem(CONSENT_KEY);
    analyticsConsent = storedConsent === 'granted';
    analyticsChoiceMade = storedConsent === 'granted' || storedConsent === 'denied';
  } catch {
    analyticsConsent = false;
  }
  loadAnalytics();
}

export function setAnalyticsConsent(granted) {
  analyticsConsent = Boolean(granted);
  analyticsChoiceMade = true;
  try {
    window.localStorage.setItem(CONSENT_KEY, analyticsConsent ? 'granted' : 'denied');
  } catch {}
  if (typeof window !== 'undefined') window['ga-disable-' + MEASUREMENT_ID] = !analyticsConsent;
  if (analyticsConsent) loadAnalytics();
}

export function trackQuestionPlayed(questionId) {
  const numericId = Number(questionId);
  if (!analyticsConsent || !Number.isSafeInteger(numericId) || numericId <= 0) return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', 'question_played', {
    question_id: String(numericId),
  });
}

export function createAnalyticsConsentControl({ showWhenSet = false } = {}) {
  if (analyticsChoiceMade && !showWhenSet) {
    const preferencesLink = document.createElement('a');
    preferencesLink.className = 'analytics-preferences-link';
    preferencesLink.href = './privacy.html';
    preferencesLink.textContent = 'Privacidad y preferencias';
    return preferencesLink;
  }

  const section = document.createElement('section');
  section.className = 'analytics-consent';
  section.setAttribute('aria-label', 'Preferencias de medición');

  const explanation = document.createElement('p');
  explanation.textContent = 'Medición opcional: Google Analytics cuenta las preguntas vistas si aceptás. Puede recibir datos técnicos del navegador y dispositivo y ubicación aproximada. No enviamos nombres ni respuestas.';
  section.appendChild(explanation);

  const status = document.createElement('p');
  status.className = 'analytics-consent-status';
  status.setAttribute('aria-live', 'polite');

  function updateStatus() {
    status.textContent = analyticsChoiceMade
      ? (analyticsConsent ? 'Medición activada.' : 'Medición desactivada.')
      : 'La medición está desactivada hasta que la aceptes.';
  }
  function saveChoice(granted) {
    setAnalyticsConsent(granted);
    updateStatus();
    if (!showWhenSet) section.replaceWith(createAnalyticsConsentControl());
  }
  updateStatus();
  section.appendChild(status);

  const actions = document.createElement('div');
  actions.className = 'analytics-consent-actions';

  const accept = document.createElement('button');
  accept.type = 'button';
  accept.textContent = 'Aceptar medición';
  accept.addEventListener('click', () => {
    saveChoice(true);
  });

  const reject = document.createElement('button');
  reject.type = 'button';
  reject.textContent = 'Rechazar';
  reject.addEventListener('click', () => {
    saveChoice(false);
  });

  actions.append(accept, reject);
  section.appendChild(actions);

  const policyLink = document.createElement('a');
  policyLink.href = './privacy.html';
  policyLink.textContent = showWhenSet ? 'Política de privacidad de Google' : 'Más información';
  section.appendChild(policyLink);

  return section;
}
