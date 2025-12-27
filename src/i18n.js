/**
 * i18n Configuration
 * 
 * Internationalization setup using i18next for multi-language support.
 * Supports: English (en), Spanish (es), Portuguese (pt), German (de), Dutch (nl)
 * 
 * Features:
 * - Browser language detection
 * - Fallback to English
 * - Namespace support for organized translations
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation resources
import enTranslation from './locales/en/translation.json'
import esTranslation from './locales/es/translation.json'
import ptTranslation from './locales/pt/translation.json'
import deTranslation from './locales/de/translation.json'
import nlTranslation from './locales/nl/translation.json'

// Supported languages configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', nativeName: 'Português' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' }
]

// Language codes array for validation
export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(lang => lang.code)

// Translation resources
const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
  pt: { translation: ptTranslation },
  de: { translation: deTranslation },
  nl: { translation: nlTranslation }
}

// Initialize i18next
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback to English
    
    // Language detection options
    detection: {
      // Order of detection methods
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      // Look for language in URL path first (e.g., /es/dashboard)
      lookupFromPathIndex: 0,
      // Cache user language in localStorage
      caches: ['localStorage'],
      // Exclude cache from detection during initial load
      excludeCacheFor: ['cimode']
    },
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    // Debug mode (disable in production)
    debug: false,
    
    // React specific options
    react: {
      useSuspense: true
    }
  })

export default i18n













