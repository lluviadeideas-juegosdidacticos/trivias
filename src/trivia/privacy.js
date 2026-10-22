import { createAnalyticsConsentControl, initAnalytics } from './analytics.js';

initAnalytics();

const preferences = document.getElementById('analytics-preferences');
if (preferences) {
  preferences.appendChild(createAnalyticsConsentControl({ showWhenSet: true }));
}
