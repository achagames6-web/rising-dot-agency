/**
 * Security Utilities
 * Centralized exports for all security features
 */

// Sanitization
export {
  sanitizeHTML,
  sanitizeText,
  sanitizeURL,
  sanitizeEmail,
  sanitizePhone,
  sanitizeJSON,
} from './sanitization';

// Rate Limiting
export {
  checkRateLimit,
  rateLimitMiddleware,
  RateLimits,
  type RateLimitConfig,
  type RateLimitResult,
} from './rateLimit';

// Cookie Consent
export {
  getCookieConsent,
  setCookieConsent,
  hasConsent,
  shouldShowConsentBanner,
  clearNonEssentialCookies,
  DEFAULT_PREFERENCES,
  type CookiePreferences,
  type CookieConsentData,
} from './cookieConsent';

// Session Timeout
export {
  SessionTimeout,
  createSessionTimeout,
  type SessionTimeoutConfig,
} from './sessionTimeout';

// API Helpers
export {
  secureAPI,
  validateOrigin,
  getClientIP,
  logSecurityEvent,
  type SecureAPIOptions,
} from './apiHelpers';
