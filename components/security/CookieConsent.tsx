'use client';

/**
 * GDPR-Compliant Cookie Consent Banner
 */

import { useState, useEffect } from 'react';
import {
  getCookieConsent,
  setCookieConsent,
  shouldShowConsentBanner,
  clearNonEssentialCookies,
  DEFAULT_PREFERENCES,
  type CookiePreferences,
} from '@/lib/security/cookieConsent';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Check if banner should be shown
    if (shouldShowConsentBanner()) {
      setShowBanner(true);
    } else {
      const consent = getCookieConsent();
      if (consent) {
        setPreferences(consent.preferences);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setCookieConsent(allAccepted);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    setCookieConsent(DEFAULT_PREFERENCES);
    clearNonEssentialCookies();
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    setCookieConsent(preferences);
    clearNonEssentialCookies();
    setShowBanner(false);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled

    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-lg bg-[#1E293B] shadow-2xl border border-[#2563EB]/20">
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-2">
              Cookie Preferences
            </h3>
            <p className="text-sm text-[#64748B]">
              We use cookies to enhance your browsing experience, serve personalized
              content, and analyze our traffic. By clicking "Accept All", you consent
              to our use of cookies.
            </p>
          </div>

          {/* Details Section */}
          {showDetails && (
            <div className="mb-4 space-y-3">
              {/* Essential Cookies */}
              <div className="flex items-start justify-between p-3 rounded bg-[#0F172A]">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white mb-1">
                    Essential Cookies
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Required for the website to function properly. Cannot be disabled.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-5 h-5 rounded border-[#2563EB] bg-[#2563EB] cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-3 rounded bg-[#0F172A]">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white mb-1">
                    Analytics Cookies
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={() => handleTogglePreference('analytics')}
                    className="w-5 h-5 rounded border-[#2563EB] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-3 rounded bg-[#0F172A]">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white mb-1">
                    Marketing Cookies
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Used to deliver personalized advertisements relevant to you.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={() => handleTogglePreference('marketing')}
                    className="w-5 h-5 rounded border-[#2563EB] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </div>
              </div>

              {/* Preference Cookies */}
              <div className="flex items-start justify-between p-3 rounded bg-[#0F172A]">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white mb-1">
                    Preference Cookies
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Remember your preferences and settings for a better experience.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.preferences}
                    onChange={() => handleTogglePreference('preferences')}
                    className="w-5 h-5 rounded border-[#2563EB] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 text-sm font-medium text-[#2563EB] hover:text-[#37AFE1] transition-colors"
            >
              {showDetails ? 'Hide Details' : 'Customize'}
            </button>

            <div className="flex-1" />

            <button
              onClick={handleRejectAll}
              className="px-6 py-2 text-sm font-medium text-white bg-[#64748B] hover:bg-[#475569] rounded-lg transition-colors"
            >
              Reject All
            </button>

            {showDetails ? (
              <button
                onClick={handleSavePreferences}
                className="px-6 py-2 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#37AFE1] rounded-lg transition-colors"
              >
                Save Preferences
              </button>
            ) : (
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#37AFE1] rounded-lg transition-colors"
              >
                Accept All
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
