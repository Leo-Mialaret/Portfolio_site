// Client-side translation system
let currentLang = 'fr';
let translations = {};

// Initialize translations
async function initTranslations() {
    try {
        const response = await fetch('/translations.json');
        translations = await response.json();
        
        // Check for saved language preference
        const savedLang = localStorage.getItem('lang');
        if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
            currentLang = savedLang;
        }
        
        // Apply translations
        translatePage();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Parse translation value (format: "French | English")
function parseTranslation(value) {
    if (!value || typeof value !== 'string') return value;
    const parts = value.split(' | ');
    return parts.length === 2 ? (currentLang === 'fr' ? parts[0] : parts[1]) : value;
}

// Get translation by key path (e.g., "home.title")
function t(keyPath) {
    const keys = keyPath.split('.');
    let value = translations;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return keyPath;
        }
    }
    
    return parseTranslation(value) || keyPath;
}

// Apply translations to all elements with data-i18n attribute
function translatePage() {
    document.documentElement.lang = currentLang;
    localStorage.setItem('lang', currentLang);
    
    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        
        if (element.hasAttribute('data-i18n-html')) {
            element.innerHTML = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
    
    // Translate title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        element.title = t(key);
    });
    
    // Update lang toggle button text
    updateLangToggle();
    
    // Dispatch event for custom handling
    window.dispatchEvent(new CustomEvent('lang:changed', { detail: { lang: currentLang } }));
}

// Update language toggle button
function updateLangToggle() {
    const toggle = document.querySelector('[data-lang-toggle]');
    if (toggle) {
        const nextLang = currentLang === 'fr' ? 'en' : 'fr';
        toggle.textContent = nextLang.toUpperCase();
        toggle.setAttribute('aria-label', t(`lang.switch_to_${nextLang}`));
    }
}

// Set language
function setLang(lang) {
    if (lang === 'fr' || lang === 'en') {
        currentLang = lang;
        translatePage();
    }
}

// Get current language
function getLang() {
    return currentLang;
}

// Toggle between languages
function toggleLang() {
    setLang(currentLang === 'fr' ? 'en' : 'fr');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranslations);
} else {
    initTranslations();
}

// Export functions for global use
window.i18n = { t, setLang, getLang, toggleLang, translatePage };
