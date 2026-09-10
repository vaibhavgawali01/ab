import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('trackpulse_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'mr') {
      setLanguageState(lang);
      try {
        localStorage.setItem('trackpulse_lang', lang);
      } catch (e) {
        console.error('Could not save language to localStorage', e);
      }
    }
  };

  // Helper function to resolve nested keys like t('nav.manmadFocus')
  const t = (path, defaultVal = '') => {
    if (!path) return '';
    const keys = path.split('.');
    
    // Attempt lookup in active language
    let current = translations[language];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        current = null;
        break;
      }
    }

    if (current !== null && current !== undefined) {
      return current;
    }

    // Fallback to English
    if (language !== 'en') {
      let fallback = translations.en;
      for (const key of keys) {
        if (fallback && fallback[key] !== undefined) {
          fallback = fallback[key];
        } else {
          fallback = null;
          break;
        }
      }
      if (fallback !== null && fallback !== undefined) {
        return fallback;
      }
    }

    return defaultVal || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
