import { useState, useCallback, useEffect } from 'react';
import { dictionary } from './dictionary';

export function useI18n() {
    const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'uz');

    useEffect(() => {
        localStorage.setItem('lang', lang);
    }, [lang]);

    const t = useCallback((key) => {
        return dictionary[lang][key] || key;
    }, [lang]);

    return { t, lang, setLang };
}
