import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/types/app';

interface LanguageSwitcherProps {
    className?: string;
    language?: Language;
    onLanguageChange?: (language: Language) => void;
}

export function LanguageSwitcher({
    className = '',
    language,
    onLanguageChange,
}: LanguageSwitcherProps) {
    const { language: hookLanguage, updateLanguage } = useLanguage();
    const current = language ?? hookLanguage;
    const change = onLanguageChange ?? updateLanguage;

    return (
        <div
            className={`inline-flex items-center gap-0.5 rounded-xl border border-blue-200 bg-white p-1 shadow-sm ${className}`}
        >
            <button
                type="button"
                onClick={() => change('en')}
                aria-pressed={current === 'en'}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold tracking-wide transition-all ${
                    current === 'en'
                        ? 'bg-royal text-white shadow-sm shadow-royal/25'
                        : 'text-stone-500 hover:text-royal'
                }`}
            >
                EN
            </button>
            <button
                type="button"
                onClick={() => change('am')}
                aria-pressed={current === 'am'}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold tracking-wide transition-all ${
                    current === 'am'
                        ? 'bg-royal text-white shadow-sm shadow-royal/25'
                        : 'text-stone-500 hover:text-royal'
                }`}
            >
                አማ
            </button>
        </div>
    );
}
