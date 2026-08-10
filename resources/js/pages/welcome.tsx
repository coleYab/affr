import { Head, Link, router, usePage, useRemember } from '@inertiajs/react';
import {
    ArrowRight,
    Bot,
    CheckCircle,
    ChevronRight,
    Lock,
    MessageCircle,
    PartyPopper,
    Search,
    Send,
    Sparkles,
    Trophy,
    X,
    XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Features from '@/components/landing/features';
import Footer from '@/components/landing/footer';
import { LanguageSwitcher } from '@/components/language-switcher';
import { PRIZE_IMAGES, TRANSLATIONS } from '@/constants';
import { dashboard, login, register } from '@/routes';
import type { AppSettings, Language } from '@/types/app';

type TicketBoardItem = { number: number; taken: boolean };

type TicketBoardPayload = {
    data: TicketBoardItem[];
    prevCursor?: string | null;
    nextCursor: string | null;
};

type TicketBoardPage = {
    props: {
        ticketBoard: TicketBoardPayload;
    };
};

const PUBLIC_TICKET_BOARD_URL = '/ticket-board';
const PUBLIC_CHECK_AVAILABILITY_URL = '/tickets/public-check-availability';

export default function Welcome() {
    const { auth } = usePage().props;
    const [language, setLanguage] = useState<Language>(() => {
        const stored = localStorage.getItem('language');
        return stored === 'am' ? 'am' : 'en';
    });

    const updateLanguage = (nextLanguage: Language): void => {
        setLanguage(nextLanguage);
        localStorage.setItem('language', nextLanguage);
        document.cookie = `language=${nextLanguage};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
    };

    const pageSettings = usePage().props.settings as AppSettings;
    const page = usePage();
    const appUrl = (page.props as { appUrl?: string }).appUrl;
    const settings: AppSettings = {
        ...pageSettings,
        prizeImages: PRIZE_IMAGES,
    };
    const displayImages =
        settings.prizeImages && settings.prizeImages.length > 0
            ? settings.prizeImages
            : PRIZE_IMAGES;
    const t = TRANSLATIONS[language];

    const seoTitle = 'AfroEqub - Win the iPhone 17 Pro. Secure Your Future.';
    const seoDescription = t.hero.desc;
    const canonicalUrl = (() => {
        if (typeof window !== 'undefined') {
            return new URL(page.url, window.location.origin).toString();
        }

        if (appUrl) {
            return new URL(page.url, appUrl).toString();
        }

        return page.url;
    })();
    const ogImage = settings.prizeImage || displayImages[0] || '/apple-touch-icon.png';

    const initialTicketBoard = usePage().props.ticketBoard as
        | TicketBoardPayload
        | undefined;

    const [tickets, setTickets] = useRemember<TicketBoardItem[]>(
        initialTicketBoard?.data ?? [],
        'welcome.ticketBoard.tickets',
    );
    const [prevCursor, setPrevCursor] = useRemember<string | null>(
        initialTicketBoard?.prevCursor ?? null,
        'welcome.ticketBoard.prevCursor',
    );
    const [nextCursor, setNextCursor] = useRemember<string | null>(
        initialTicketBoard?.nextCursor ?? null,
        'welcome.ticketBoard.nextCursor',
    );
    const [hasLoadedTicketsOnce, setHasLoadedTicketsOnce] = useRemember(
        !!initialTicketBoard,
        'welcome.ticketBoard.hasLoadedTicketsOnce',
    );
    const [isLoadingTickets, setIsLoadingTickets] = useState(false);
    const [isLoadingPrevTickets, setIsLoadingPrevTickets] = useState(false);

    const [luckySearch, setLuckySearch] = useRemember(
        '',
        'welcome.ticketBoard.luckySearch',
    );
    const [luckyStatus, setLuckyStatus] = useRemember<
        'IDLE' | 'AVAILABLE' | 'TAKEN'
    >('IDLE', 'welcome.ticketBoard.luckyStatus');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<
        { role: 'bot' | 'user'; text: string }[]
    >([
        {
            role: 'bot',
            text: language === 'en'
                ? 'Hello! I am your AfroEqub assistant. How can I help you today?'
                : 'ሰላም! እኔ የአፍሮ እቁብ ረዳትዎ ነኝ። ዛሬ እንዴት ልረዳዎት እችላለሁ?',
        },
    ]);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const sendChatMessage = () => {
        const message = chatInput.trim();

        if (!message) {
            return;
        }

        setChatMessages((prev) => [...prev, { role: 'user', text: message }]);
        setChatInput('');
        setTimeout(() => {
            setChatMessages((prev) => [
                ...prev,
                {
                    role: 'bot',
                    text: language === 'en'
                        ? 'Thank you for your message! Our team will get back to you shortly. For immediate assistance, please contact our support team.'
                        : 'ለመልእክትዎ እናመሰግናለን! ቡድናችን በቅርቡ ይመልስልዎታል። ለፈጣን እገዛ የድጋፍ ቡድናችንን ያግኙ።',
                },
            ]);
        }, 800);
    };

    const [confetti] = useState(() =>
        Array.from({ length: 30 }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
        })),
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [displayImages.length]);

    const loadInitialTickets = () => {
        if (hasLoadedTicketsOnce || isLoadingTickets) {
            return;
        }

        setIsLoadingTickets(true);

        router.get(
            PUBLIC_TICKET_BOARD_URL,
            { perPage: 120, startAt: 1 },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['ticketBoard'],
                onSuccess: (page) => {
                    const payload = (page as unknown as TicketBoardPage).props
                        .ticketBoard;
                    setTickets(payload.data);
                    setPrevCursor(payload.prevCursor ?? null);
                    setNextCursor(payload.nextCursor);
                    setHasLoadedTicketsOnce(true);
                },
                onFinish: () => {
                    setIsLoadingTickets(false);
                },
            },
        );
    };

    useEffect(() => {
        if (!hasLoadedTicketsOnce) {
            return;
        }

        const scrollContainer = document.querySelector(
            '[data-ticket-board-scroll-container="true"]',
        );

        if (!(scrollContainer instanceof HTMLElement)) {
            return;
        }

        const loadNext = () => {
            if (isLoadingTickets || !nextCursor) {
                return;
            }

            setIsLoadingTickets(true);

            router.get(
                PUBLIC_TICKET_BOARD_URL,
                { cursor: nextCursor, perPage: 60 },
                {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['ticketBoard'],
                    onSuccess: (page) => {
                        const payload = (page as unknown as TicketBoardPage)
                            .props.ticketBoard;

                        setTickets((prev) => {
                            const existing = new Set(prev.map((t) => t.number));
                            const merged = [...prev];
                            for (const item of payload.data) {
                                if (!existing.has(item.number)) {
                                    merged.push(item);
                                }
                            }
                            return merged;
                        });

                        setPrevCursor((current) => current ?? (payload.prevCursor ?? null));
                        setNextCursor(payload.nextCursor);
                    },
                    onFinish: () => {
                        setIsLoadingTickets(false);
                    },
                },
            );
        };

        const loadPrev = () => {
            if (isLoadingPrevTickets || !prevCursor) {
                return;
            }

            const beforeHeight = scrollContainer.scrollHeight;
            const beforeTop = scrollContainer.scrollTop;

            setIsLoadingPrevTickets(true);

            router.get(
                PUBLIC_TICKET_BOARD_URL,
                { cursor: prevCursor, perPage: 60 },
                {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['ticketBoard'],
                    onSuccess: (page) => {
                        const payload = (page as unknown as TicketBoardPage)
                            .props.ticketBoard;

                        setTickets((prev) => {
                            const existing = new Set(prev.map((t) => t.number));
                            const toPrepend: TicketBoardItem[] = [];
                            for (const item of payload.data) {
                                if (!existing.has(item.number)) {
                                    toPrepend.push(item);
                                }
                            }
                            return [...toPrepend, ...prev];
                        });

                        setPrevCursor(payload.prevCursor ?? null);
                        setNextCursor((current) => current ?? payload.nextCursor);

                        requestAnimationFrame(() => {
                            const afterHeight = scrollContainer.scrollHeight;
                            scrollContainer.scrollTop = beforeTop + (afterHeight - beforeHeight);
                        });
                    },
                    onFinish: () => {
                        setIsLoadingPrevTickets(false);
                    },
                },
            );
        };

        const onScroll = () => {
            const remainingBottom =
                scrollContainer.scrollHeight -
                scrollContainer.scrollTop -
                scrollContainer.clientHeight;

            if (remainingBottom <= 80) {
                loadNext();
            }

            if (scrollContainer.scrollTop <= 80) {
                loadPrev();
            }
        };

        scrollContainer.addEventListener('scroll', onScroll, {
            passive: true,
        });

        return () => {
            scrollContainer.removeEventListener('scroll', onScroll);
        };
    }, [
        hasLoadedTicketsOnce,
        isLoadingPrevTickets,
        isLoadingTickets,
        nextCursor,
        prevCursor,
        setNextCursor,
        setPrevCursor,
        setTickets,
    ]);

    useEffect(() => {
        if (!settings.ticketSelectionEnabled) {
            setLuckyStatus('IDLE');
            return;
        }

        if (!luckySearch) {
            setLuckyStatus('IDLE');
            return;
        }

        const value = Number(luckySearch);
        if (!Number.isInteger(value) || value <= 0) {
            setLuckyStatus('IDLE');
            return;
        }

        const ticket = tickets.find((t) => t.number === value);
        if (ticket) {
            setLuckyStatus(ticket.taken ? 'TAKEN' : 'AVAILABLE');
            return;
        }

        let cancelled = false;
        const controller = new AbortController();

        fetch(`${PUBLIC_CHECK_AVAILABILITY_URL}?number=${encodeURIComponent(value)}`, {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error('Request failed');
                }
                return (await res.json()) as { exists: boolean; taken: boolean | null };
            })
            .then((payload) => {
                if (cancelled) {
                    return;
                }
                if (!payload.exists) {
                    setLuckyStatus('IDLE');
                    return;
                }
                setLuckyStatus(payload.taken ? 'TAKEN' : 'AVAILABLE');
            })
            .catch(() => {
                if (cancelled) {
                    return;
                }
                setLuckyStatus('IDLE');
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [luckySearch, setLuckyStatus, settings.ticketSelectionEnabled, tickets]);

    return (
        <>
            <Head title="Welcome">
                <meta name="description" content={seoDescription} />
                <link rel="canonical" href={canonicalUrl} />
                <meta name="robots" content="index, follow" />

                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="AfroEqub" />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={ogImage} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
                <meta name="twitter:image" content={ogImage} />
                <meta name="twitter:url" content={canonicalUrl} />

                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col bg-white text-[#1b1b18]">
                {/* ===== HEADER ===== */}
                <header className="sticky top-0 z-50 w-full border-b border-blue-100/80 bg-white/90 shadow-sm shadow-navy/5 backdrop-blur-xl">
                    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                        <Link href="/" className="flex shrink-0 items-center">
                            <img
                                src="/logo-light.png"
                                alt="AfroEqub"
                                className="h-11 w-auto object-contain transition-transform duration-300 hover:scale-105"
                            />
                        </Link>

                        <div className="flex items-center space-x-3 sm:space-x-5">
                            {auth.user ? (
                                <Link
                                    href={dashboard().url}
                                    className="inline-flex items-center justify-center rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-royal"
                                    prefetch
                                >
                                    {t.nav.dashboard}
                                </Link>
                            ) : (
                                <>
                                    <div className="hidden items-center space-x-7 lg:flex">
                                        <a
                                            href="#features"
                                            className="text-sm font-semibold text-stone-600 transition-colors hover:text-royal"
                                        >
                                            {t.nav.how}
                                        </a>
                                        <a
                                            href="#tickets"
                                            className="text-sm font-semibold text-stone-600 transition-colors hover:text-royal"
                                        >
                                            {language === 'en' ? 'Lucky Numbers' : 'እድለኛ ቁጥሮች'}
                                        </a>
                                    </div>

                                    <LanguageSwitcher
                                        language={language}
                                        onLanguageChange={updateLanguage}
                                        className="hidden sm:inline-flex"
                                    />

                                    <Link
                                        href={login().url}
                                        className="hidden items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:text-royal sm:inline-flex"
                                        prefetch
                                    >
                                        {t.nav.login}
                                    </Link>
                                    <Link
                                        href={register().url}
                                        className="inline-flex items-center justify-center rounded-xl bg-royal px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-royal/25 transition-all hover:-translate-y-0.5 hover:bg-navy"
                                        prefetch
                                    >
                                        {t.nav.register}
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* ===== CHATBOT ===== */}
                {isChatOpen && (
                    <div className="fixed bottom-24 right-6 z-[60] flex w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl shadow-navy/25 animate-fade-in-up">
                        <div className="flex items-center justify-between bg-gradient-to-r from-royal to-navy px-5 py-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">
                                        {language === 'en' ? 'AfroEqub Assistant' : 'የአፍሮ እቁብ ረዳት'}
                                    </p>
                                    <p className="flex items-center gap-1.5 text-[11px] text-white/80">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        {language === 'en' ? 'Online' : 'በመስመር ላይ'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                                aria-label="Close chat"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div
                            ref={chatContainerRef}
                            className="flex max-h-72 flex-col space-y-3 overflow-y-auto px-4 py-4"
                        >
                            {chatMessages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                            msg.role === 'user'
                                                ? 'rounded-br-sm bg-royal text-white'
                                                : 'rounded-bl-sm bg-blue-50 text-stone-700'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center space-x-2 border-t border-blue-100 px-4 py-3">
                            <input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        sendChatMessage();
                                    }
                                }}
                                placeholder={language === 'en' ? 'Type your message...' : 'መልእክትዎን ይጻፉ...'}
                                className="flex-1 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:border-royal focus:ring-2 focus:ring-royal/20"
                            />
                            <button
                                onClick={sendChatMessage}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal text-white shadow-md shadow-royal/25 transition-all hover:bg-navy"
                                aria-label="Send message"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* ===== FLOATING CHATBOT BUTTON ===== */}
                <button
                    onClick={() => setIsChatOpen((prev) => !prev)}
                    className="group fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-royal to-navy text-white shadow-xl shadow-navy/30 transition-all hover:-translate-y-1 hover:shadow-2xl"
                    aria-label="Open chat"
                >
                    {isChatOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <>
                            <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:-rotate-12" />
                            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-royal opacity-60" />
                                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                            </span>
                        </>
                    )}
                </button>

                <main className="flex w-full flex-col">
                    {/* ===== HERO ===== */}
                    <section id="home" className="relative overflow-hidden">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-white" />
                            <div className="absolute -top-32 right-0 h-[30rem] w-[30rem] rounded-full bg-royal/10 blur-3xl" />
                            <div className="absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(40,117,247,0.08),transparent_50%)]" />
                        </div>

                        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
                            <div className="space-y-7 text-center lg:text-left">
                                <h1 className="animate-fade-in-up text-4xl leading-tight font-extrabold tracking-tight text-navy sm:text-5xl lg:text-6xl">
                                    {t.hero.title1} <br />
                                    <span className="bg-gradient-to-r from-royal to-navy bg-clip-text text-transparent">
                                        {t.hero.title2}
                                    </span>
                                </h1>

                                <p className="animate-fade-in-up mx-auto max-w-xl text-lg leading-relaxed text-stone-600 delay-[100ms] lg:mx-0">
                                    {t.hero.desc}
                                </p>

                                <div className="animate-fade-in-up flex flex-col items-center justify-center gap-4 pt-2 delay-[200ms] sm:flex-row lg:justify-start">
                                    <Link
                                        href="/register"
                                        prefetch
                                        className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-royal px-8 py-4 text-base font-bold text-white shadow-xl shadow-royal/25 transition-all hover:-translate-y-1 hover:bg-navy sm:w-auto"
                                    >
                                        {t.hero.cta}
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>

                            {/* Prize / Winner Card */}
                            <div className="animate-fade-in-up relative delay-[300ms]">
                                <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-r from-royal/25 via-blue-100 to-navy/25 blur-2xl" />
                                <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-2xl shadow-navy/10">
                                    {settings.winnerAnnouncementMode &&
                                    settings.currentWinner ? (
                                        /* --- WINNER ANNOUNCEMENT CARD --- */
                                        <div className="group relative isolate flex h-[28rem] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-royal to-navy p-6 text-center md:h-[480px] md:p-8">
                                            <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                            {confetti.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute h-3 w-3 animate-pulse rounded-full bg-white"
                                                    style={{
                                                        left: item.left,
                                                        top: item.top,
                                                        animationDelay: item.animationDelay,
                                                    }}
                                                />
                                            ))}

                                            <div className="relative z-20 w-full">
                                                <div className="mb-4 inline-flex animate-bounce items-center justify-center rounded-full bg-white p-3 shadow-2xl md:mb-6 md:p-4">
                                                    <PartyPopper className="h-8 w-8 text-royal md:h-12 md:w-12" />
                                                </div>
                                                <h2 className="mb-2 text-3xl font-black tracking-widest text-white uppercase drop-shadow-lg sm:text-4xl md:text-5xl">
                                                    {language === 'en'
                                                        ? 'Winner!'
                                                        : 'አሸናፊ!'}
                                                </h2>

                                                <div className="mx-auto w-full max-w-sm transform rounded-2xl border border-white/30 bg-white/10 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:scale-105 md:p-6">
                                                    <div className="mb-1 text-sm font-medium tracking-widest text-blue-200 uppercase md:mb-2 md:text-lg">
                                                        Winning Ticket
                                                    </div>
                                                    <div className="mb-3 text-5xl font-black tracking-tighter text-white drop-shadow-md sm:text-6xl md:mb-4 md:text-7xl">
                                                        #
                                                        {
                                                            settings
                                                                .currentWinner
                                                                .ticketNumber
                                                        }
                                                    </div>
                                                    <div className="truncate text-xl font-bold text-blue-50 md:text-3xl">
                                                        {
                                                            settings
                                                                .currentWinner
                                                                .userName
                                                        }
                                                    </div>
                                                    <div className="mt-3 border-t border-white/20 pt-3 md:mt-4 md:pt-4">
                                                        <div className="inline-block rounded-lg bg-black/30 px-3 py-1.5 text-xs font-bold text-white shadow-inner md:px-4 md:py-2 md:text-sm">
                                                            Prize:{' '}
                                                            {
                                                                settings
                                                                    .currentWinner
                                                                    .prizeName
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* --- STANDARD PRIZE CAROUSEL --- */
                                        <div className="group relative isolate overflow-hidden">
                                            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-blue-50">
                                                <div className="absolute inset-0 bg-gradient-to-br from-royal/10 via-transparent to-navy/10 transition-colors group-hover:from-royal/15" />

                                                {displayImages.map(
                                                    (img, index) => (
                                                        <img
                                                            key={index}
                                                            src={img}
                                                            alt={`${settings.prizeName} view ${index + 1}`}
                                                            className={`absolute inset-0 z-0 h-full w-full object-contain transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                                        />
                                                    ),
                                                )}

                                                {/* Gift ribbon wrapping the full image */}
                                                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                                                    <img
                                                        src="https://i.postimg.cc/hvkdcQC4/rebbon-final.png"
                                                        alt="Ribbon"
                                                        className="h-full w-full object-contain drop-shadow-2xl"
                                                    />
                                                </div>
                                            </div>                                            <div className="flex items-end justify-between gap-4 p-6">
                                                <div>
                                                    <h3 className="text-2xl font-extrabold text-navy">
                                                        {settings.prizeName}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ===== LUCKY NUMBER CHECKER ===== */}
                    <section
                        id="tickets"
                        className="relative bg-blue-50/50 py-20"
                    >
                        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto mb-10 max-w-2xl text-center">
                                <span className="inline-flex items-center gap-2 rounded-full border border-royal/20 bg-white px-4 py-1.5 text-xs font-bold tracking-wide text-royal uppercase">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    {language === 'en'
                                        ? 'Find Your Number'
                                        : 'ቁጥርዎን ያግኙ'}
                                </span>
                                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
                                    {language === 'en'
                                        ? 'Check Your Lucky Number'
                                        : 'እድለኛ ቁጥርዎን ይፈትሹ'}
                                </h2>
                                <p className="mt-3 text-stone-600">
                                    {language === 'en'
                                        ? 'See which numbers are still available, then register to claim yours.'
                                        : 'ክፍት የሆኑትን ቁጥሮች ይመልከቱ፣ ከዚያ የእርስዎን ለመያዝ ይመዝገቡ።'}
                                </p>
                            </div>

                            <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white p-6 shadow-xl shadow-navy/5 md:p-8">
                                <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
                                    <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold">
                                        <span className="h-3 w-3 rounded-full bg-royal" />
                                        <span className="text-navy">{t.stats.lucky}</span>
                                        <span className="mx-1 h-3 w-px bg-blue-200" />
                                        <span className="h-3 w-3 rounded-full bg-stone-300" />
                                        <span className="text-stone-500">{t.stats.taken}</span>
                                    </div>
                                    {!settings.ticketSelectionEnabled && (
                                        <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-bold text-navy">
                                            {language === 'en'
                                                ? 'TICKET SELECTION PAUSED'
                                                : 'የቲኬት ምርጫ ለጊዜው ተቋርጧል'}
                                        </span>
                                    )}
                                </div>

                                <div className="relative mb-6">
                                    <input
                                        type="number"
                                        disabled={
                                            !settings.ticketSelectionEnabled
                                        }
                                        value={luckySearch}
                                        onChange={(e) =>
                                            setLuckySearch(e.target.value)
                                        }
                                        onFocus={() => loadInitialTickets()}
                                        placeholder={
                                            !settings.ticketSelectionEnabled
                                                ? language === 'en'
                                                    ? 'Selection Closed'
                                                    : 'ምርጫ ተዘግቷል'
                                                : language === 'en'
                                                  ? 'Enter lucky number (e.g. 104)'
                                                  : 'እድለኛ ቁጥር ያስገቡ (ለምሳሌ 104)'
                                        }
                                        className={`w-full rounded-xl border-2 py-4 pr-12 pl-5 text-lg transition-all outline-none ${
                                            !settings.ticketSelectionEnabled
                                                ? 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400'
                                                : luckyStatus ===
                                                    'AVAILABLE'
                                                  ? 'border-royal bg-blue-50/30 ring-4 ring-royal/10'
                                                  : luckyStatus === 'TAKEN'
                                                    ? 'border-red-300 bg-red-50/30 ring-4 ring-red-200'
                                                    : 'border-stone-200 focus:border-royal focus:ring-4 focus:ring-royal/10'
                                        }`}
                                    />
                                    <div className="absolute top-1/2 right-4 -translate-y-1/2">
                                        {!settings.ticketSelectionEnabled && (
                                            <Lock className="h-6 w-6 text-stone-400" />
                                        )}
                                        {settings.ticketSelectionEnabled &&
                                            luckyStatus === 'AVAILABLE' && (
                                                <CheckCircle className="h-8 w-8 animate-bounce text-royal" />
                                            )}
                                        {settings.ticketSelectionEnabled &&
                                            luckyStatus === 'TAKEN' && (
                                                <XCircle className="h-8 w-8 text-red-500" />
                                            )}
                                        {settings.ticketSelectionEnabled &&
                                            luckyStatus === 'IDLE' && (
                                                <Search className="h-6 w-6 text-stone-300" />
                                            )}
                                    </div>
                                </div>

                                {luckyStatus === 'AVAILABLE' &&
                                    settings.ticketSelectionEnabled && (
                                        <div className="animate-fade-in-down mb-6">
                                            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-royal/20 bg-royal/5 p-4 sm:flex-row sm:items-center">
                                                <div className="flex items-center">
                                                    <CheckCircle className="mr-3 h-6 w-6 text-royal" />
                                                    <div>
                                                        <p className="text-lg font-bold text-navy">
                                                            #{luckySearch}{' '}
                                                            {language === 'en'
                                                                ? 'is Available!'
                                                                : 'ክፍት ነው!'}
                                                        </p>
                                                        <p className="text-sm text-royal">
                                                            {language === 'en'
                                                                ? 'Register now to secure this number.'
                                                                : 'ይህንን ቁጥር ለመያዝ አሁኑኑ ይመዝገቡ።'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={register().url}
                                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-royal px-5 py-2.5 font-bold text-white shadow-lg shadow-royal/25 transition-all hover:-translate-y-0.5 hover:bg-navy"
                                                    prefetch
                                                >
                                                    {t.hero.cta}
                                                    <ChevronRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                {luckyStatus === 'TAKEN' &&
                                    settings.ticketSelectionEnabled && (
                                        <div className="animate-fade-in-down mb-6">
                                            <div className="flex items-center rounded-2xl border border-red-100 bg-red-50 p-4">
                                                <XCircle className="mr-3 h-6 w-6 text-red-500" />
                                                <p className="font-bold text-red-700">
                                                    #{luckySearch}{' '}
                                                    {language === 'en'
                                                        ? 'is already taken.'
                                                        : 'ተይዟል።'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                <div className="relative">
                                    <div className="mb-3 flex items-center justify-between">
                                        <h4 className="text-xs font-bold tracking-wider text-stone-400 uppercase">
                                            {language === 'en'
                                                ? 'Live Availability Board'
                                                : 'የእጣ ቁጥሮች ሰሌዳ'}
                                        </h4>
                                    </div>
                                    <div
                                        data-ticket-board-scroll-container="true"
                                        className={`custom-scrollbar relative grid max-h-[400px] grid-cols-5 gap-2 overflow-y-auto rounded-2xl border border-blue-100 bg-blue-50/40 p-4 sm:grid-cols-8 md:grid-cols-12 ${!settings.ticketSelectionEnabled ? 'pointer-events-none opacity-60 grayscale' : ''}`}
                                    >
                                        {!hasLoadedTicketsOnce ? (
                                            <div className="col-span-full flex flex-col items-center justify-center py-8">
                                                <button
                                                    type="button"
                                                    onClick={() => loadInitialTickets()}
                                                    disabled={!settings.ticketSelectionEnabled || isLoadingTickets}
                                                    className="rounded-xl bg-royal px-5 py-2.5 text-sm font-bold text-white shadow transition-all hover:-translate-y-0.5 hover:bg-navy disabled:cursor-not-allowed disabled:bg-stone-300"
                                                >
                                                    {language === 'en'
                                                        ? 'Show available tickets'
                                                        : 'ክፍት ቲኬቶችን አሳይ'}
                                                </button>
                                            </div>
                                        ) : (
                                            tickets.map((ticket) => (
                                                <button
                                                    key={ticket.number}
                                                    type="button"
                                                    disabled={
                                                        ticket.taken ||
                                                        !settings.ticketSelectionEnabled
                                                    }
                                                    onClick={() => {
                                                        if (!settings.ticketSelectionEnabled) {
                                                            return;
                                                        }

                                                        setLuckySearch(String(ticket.number));
                                                        setLuckyStatus(ticket.taken ? 'TAKEN' : 'AVAILABLE');
                                                    }}
                                                    className={`flex aspect-square items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 md:text-base ${
                                                        ticket.taken
                                                            ? 'cursor-not-allowed border border-stone-200 bg-stone-200 text-stone-400'
                                                            : 'border border-blue-200 bg-white text-royal shadow-sm hover:z-10 hover:scale-110 hover:border-royal hover:bg-royal hover:text-white hover:shadow-md'
                                                    } ${luckySearch === String(ticket.number) ? 'z-20 scale-110 ring-4 ring-royal' : ''}`}
                                                >
                                                    {ticket.number}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                    {!settings.ticketSelectionEnabled && (
                                        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
                                            <div className="flex items-center rounded-full bg-navy/90 px-6 py-3 font-bold text-white shadow-2xl backdrop-blur-sm">
                                                <Lock className="mr-2 h-5 w-5" />
                                                {language === 'en'
                                                    ? 'Selection Currently Closed'
                                                    : 'ምርጫ ለጊዜው ተዘግቷል'}
                                            </div>
                                        </div>
                                    )}
                                    <p className="mt-3 text-center text-xs text-stone-400">
                                        {language === 'en'
                                            ? 'Click on any available (blue) number to select it.'
                                            : 'ክፍት የሆነውን (ሰማያዊ) ቁጥር በመጫን ይምረጡ።'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Features language={language} />

                    {/* ===== CTA ===== */}
                    <section
                        id="waitlist-section"
                        className="relative overflow-hidden py-24"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-royal via-navy to-navy" />
                        <div className="pointer-events-none absolute inset-0 opacity-20">
                            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
                            <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-blue-300 blur-3xl" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_55%)]" />
                        </div>

                        <div className="relative mx-auto max-w-3xl px-4 text-center">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wide text-blue-100 uppercase backdrop-blur">
                                <Sparkles className="h-3.5 w-3.5" />
                                {language === 'en' ? 'Join Now' : 'አሁኑኑ ይቀላቀሉ'}
                            </span>
                            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
                                {t.cta_section.heading}
                            </h2>
                            {t.cta_section.desc && (
                                <p className="mx-auto mt-5 max-w-xl text-lg text-blue-100/90">
                                    {t.cta_section.desc}
                                </p>
                            )}
                        </div>
                    </section>

                    <Footer language={language} />
                </main>
            </div>
        </>
    );
}
