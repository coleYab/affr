import { useCallback, useSyncExternalStore } from 'react';
import type { Language } from '@/types/app';

export type UseLanguageReturn = {
    readonly language: Language;
    readonly updateLanguage: (language: Language) => void;
};

const listeners = new Set<() => void>();
let currentLanguage: Language = 'am';

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredLanguage = (): Language => {
    if (typeof window === 'undefined') {
        return 'am';
    }

    const stored = localStorage.getItem('language');

    if (stored === 'en' || stored === 'am') {
        return stored;
    }

    return 'am';
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => {
    listeners.forEach((listener) => listener());
};

export function initializeLanguage(): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (!localStorage.getItem('language')) {
        localStorage.setItem('language', 'am');
        setCookie('language', 'am');
    }

    currentLanguage = getStoredLanguage();
    setCookie('language', currentLanguage);
}

export function useLanguage(): UseLanguageReturn {
    const language: Language = useSyncExternalStore(
        subscribe,
        () => currentLanguage,
        () => 'am',
    );

    const updateLanguage = useCallback((nextLanguage: Language): void => {
        currentLanguage = nextLanguage;

        localStorage.setItem('language', nextLanguage);
        setCookie('language', nextLanguage);

        notify();
    }, []);

    return { language, updateLanguage } as const;
}
