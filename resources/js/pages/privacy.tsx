import { Head, Link } from '@inertiajs/react';
import Footer from '@/components/landing/footer';
import { TRANSLATIONS } from '@/constants';
import { useLanguage } from '@/hooks/use-language';
import { home } from '@/routes';

export default function Privacy() {
    const { language } = useLanguage();
    const common = TRANSLATIONS[language].common;
    const privacy = TRANSLATIONS[language].privacy_page;
    const footerT = TRANSLATIONS[language].footer;

    type PolicySection = {
        heading: string;
        content: string;
    };

    return (
        <>
            <Head title={footerT.privacy} />

            <div className="flex min-h-screen flex-col bg-white">
                {/* ===== HEADER ===== */}
                <header className="sticky top-0 z-50 w-full border-b border-blue-100/80 bg-white/90 shadow-sm shadow-navy/5 backdrop-blur-xl">
                    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                        <Link href="/" className="flex shrink-0 items-center">
                            <img
                                src="/logo-light.png"
                                alt="AfroEqub"
                                className="h-11 w-auto object-contain"
                            />
                        </Link>

                        <Link
                            href={home().url}
                            className="inline-flex items-center justify-center rounded-xl bg-royal px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-royal/25 transition-all hover:-translate-y-0.5 hover:bg-navy"
                            prefetch
                        >
                            {common.back}
                        </Link>
                    </nav>
                </header>

                <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <h1 className="text-4xl font-extrabold tracking-tight text-navy">
                            {footerT.privacy}
                        </h1>
                        <p className="mt-3 text-sm text-stone-500">{privacy.last_updated}</p>
                        <div className="mt-6 h-1 w-20 bg-gradient-to-r from-royal to-navy" />
                    </div>

                    <div className="space-y-10">
                        {(privacy.sections as PolicySection[]).map((section: PolicySection) => (
                            <section key={section.heading}>
                                <h2 className="flex items-center gap-3 text-xl font-bold text-navy">
                                    <span className="inline-block h-5 w-1.5 bg-gradient-to-b from-royal to-navy" />
                                    {section.heading}
                                </h2>
                                <div className="mt-3 space-y-3 text-sm leading-relaxed text-stone-600">
                                    {section.content
                                        .split('\n\n')
                                        .filter(Boolean)
                                        .map((paragraph: string) => (
                                            <p key={paragraph}>{paragraph}</p>
                                        ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </main>

                <Footer language={language} />
            </div>
        </>
    );
}
