
import { Head } from '@inertiajs/react';
import {
    Bell,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    ExternalLink,
    Ticket,
    UserPlus,
    XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import AppLayout from '@/layouts/app-layout';
import { mynotifications } from '@/routes/user';
import type { BreadcrumbItem } from '@/types';
import type { AppNotification } from '@/types/app';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notifications',
        href: mynotifications().url,
    },
];

const TRANSLATIONS = {
    en: {
        pageTitle: 'Notifications',
        subtitle: 'System updates and your recent activities.',
        language: 'Language',
        systemNotifications: 'System notifications',
        recentActivities: 'Recent activities',
        filters: {
            all: 'All',
            unread: 'Unread',
            urgent: 'Urgent',
        },
        actions: {
            markAllRead: 'Mark all as read',
        },
        empty: {
            notifications: {
                title: 'No notifications',
                desc: "You're all caught up.",
            },
            activities: {
                title: 'No recent activity',
                desc: 'Your account activity will appear here.',
            },
        },
        activity: {
            subscribed: 'Subscribed',
            boughtTicket: 'Bought ticket',
            paymentSubmitted: 'Payment submitted',
            paymentApproved: 'Payment approved',
            paymentRejected: 'Payment rejected',
            system: 'System',
            view: 'View',
        },
    },
    am: {
        pageTitle: 'ማሳወቂያዎች',
        subtitle: 'የስርዓት ዝመናዎች እና የቅርብ ጊዜ እንቅስቃሴዎችዎ።',
        language: 'ቋንቋ',
        systemNotifications: 'የስርዓት ማሳወቂያዎች',
        recentActivities: 'የቅርብ ጊዜ እንቅስቃሴዎች',
        filters: {
            all: 'ሁሉም',
            unread: 'ያልተነበበ',
            urgent: 'አስቸኳይ',
        },
        actions: {
            markAllRead: 'ሁሉንም እንዳነበብኩ ቁጠር',
        },
        empty: {
            notifications: {
                title: 'ማሳወቂያ የለም',
                desc: 'ሁሉንም ተከታትለዋል።',
            },
            activities: {
                title: 'የቅርብ ጊዜ እንቅስቃሴ የለም',
                desc: 'የመለያዎ እንቅስቃሴ እዚህ ይታያል።',
            },
        },
        activity: {
            subscribed: 'ተመዝግቧል',
            boughtTicket: 'ቲኬት ገዝቷል',
            paymentSubmitted: 'ክፍያ ተልኳል',
            paymentApproved: 'ክፍያ ጸድቋል',
            paymentRejected: 'ክፍያ ተቀባይነት አላገኘም',
            system: 'ስርዓት',
            view: 'ይመልከቱ',
        },
    },
} as const;

type ActivityType =
    | 'JOINED'
    | 'SUBSCRIBED'
    | 'BOUGHT_TICKET'
    | 'PAYMENT_SUBMITTED'
    | 'PAYMENT_APPROVED'
    | 'PAYMENT_REJECTED';

type ActivityItem = {
    id: string;
    type: ActivityType;
    title: { en: string; am: string };
    desc: { en: string; am: string };
    time: string;
    link?: string;
    cycle?: number;
};

type ServerNotification = {
    id: number | string;
    title: { en: string; am: string };
    desc: { en: string; am: string };
    time: string | null;
    urgent: boolean;
    read?: boolean;
    link?: string | null;
};

type ActivitiesResponse = {
    data: ActivityItem[];
    next_cursor: string | null;
};

function formatTime(value: Date): string {
    try {
        return value.toLocaleString(undefined, {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return String(value);
    }
}

type PageProps = {
    notifications?: ServerNotification[];
};

function getCsrfToken(): string {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

export default function Notifications({ notifications }: PageProps) {
    const { language } = useLanguage();
    const t = TRANSLATIONS[language];

    const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'URGENT'>('ALL');
    const [items, setItems] = useState<AppNotification[]>(() => {
        const serverItems = notifications ?? [];

        return serverItems.map((n) => ({
            id: n.id,
            title: n.title,
            desc: n.desc,
            time: n.time ? new Date(n.time) : new Date(),
            urgent: n.urgent,
            read: n.read ?? false,
        }));
    });

    const filteredNotifications = useMemo(() => {
        if (filter === 'UNREAD') {
            return items.filter((n) => !n.read);
        }

        if (filter === 'URGENT') {
            return items.filter((n) => n.urgent);
        }

        return items;
    }, [filter, items]);

    const unreadCount = useMemo(() => {
        return items.filter((n) => !n.read).length;
    }, [items]);

    const markAllAsRead = async (): Promise<void> => {
        setItems((prev) => prev.map((n) => ({ ...n, read: true })));

        const token = getCsrfToken();
        await fetch('/notifications/read-all', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                ...(token ? { 'X-CSRF-TOKEN': token } : {}),
            },
        }).catch(() => null);
    };

    const markOneAsRead = async (notificationId: string | number): Promise<void> => {
        setItems((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
        );

        const token = getCsrfToken();
        await fetch(`/notifications/${encodeURIComponent(String(notificationId))}/read`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                ...(token ? { 'X-CSRF-TOKEN': token } : {}),
            },
        }).catch(() => null);
    };

    const activitiesContainerRef = useRef<HTMLDivElement | null>(null);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [activitiesNextCursor, setActivitiesNextCursor] = useState<string | null>(null);
    const [activitiesLoading, setActivitiesLoading] = useState<boolean>(false);
    const [activitiesBootstrapped, setActivitiesBootstrapped] = useState<boolean>(false);

    const loadActivities = async (options?: { cursor?: string | null }): Promise<void> => {
        if (activitiesLoading) {
            return;
        }

        setActivitiesLoading(true);

        try {
            const params = new URLSearchParams();
            params.set('limit', '10');

            const cursor = options?.cursor;
            if (cursor) {
                params.set('cursor', cursor);
            }

            const response = await fetch(`/recent-activities?${params.toString()}`, {
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                return;
            }

            const payload = (await response.json()) as ActivitiesResponse;

            setActivities((prev) => {
                const seen = new Set(prev.map((item) => item.id));
                const incoming = payload.data.filter((item) => !seen.has(item.id));
                return [...prev, ...incoming];
            });
            setActivitiesNextCursor(payload.next_cursor);
            setActivitiesBootstrapped(true);
        } finally {
            setActivitiesLoading(false);
        }
    };

    useEffect(() => {
        void loadActivities({ cursor: null });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const maybeLoadMoreActivities = (): void => {
        const container = activitiesContainerRef.current;
        if (!container) {
            return;
        }

        if (!activitiesNextCursor || activitiesLoading) {
            return;
        }

        const remaining = container.scrollHeight - container.scrollTop - container.clientHeight;
        if (remaining <= 40) {
            void loadActivities({ cursor: activitiesNextCursor });
        }
    };

    const activityMeta: Partial<
        Record<
            ActivityType,
            {
                icon: typeof Bell;
                className: string;
            }
        >
    > = {
        JOINED: {
            icon: UserPlus,
            className: 'border-blue-200 bg-blue-50 text-navy',
        },
        SUBSCRIBED: {
            icon: UserPlus,
            className: 'border-blue-200 bg-blue-50 text-navy',
        },
        BOUGHT_TICKET: {
            icon: Ticket,
            className: 'border-blue-200 bg-blue-50 text-navy',
        },
        PAYMENT_SUBMITTED: {
            icon: CreditCard,
            className: 'border-blue-200 bg-blue-50 text-blue-800',
        },
        PAYMENT_APPROVED: {
            icon: CheckCircle,
            className: 'border-blue-200 bg-blue-50 text-navy',
        },
        PAYMENT_REJECTED: {
            icon: XCircle,
            className: 'border-red-200 bg-red-50 text-red-800',
        },
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.pageTitle} />
            <div className="flex h-full flex-1 flex-col gap-4 bg-blue-50/40 overflow-x-auto rounded-xl p-4 sm:p-6">
                <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-royal/20 bg-royal/5 px-3 py-1 text-[10px] font-bold tracking-wide text-royal uppercase">
                                <Bell className="h-3.5 w-3.5" />
                                {t.pageTitle}
                            </span>
                            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-navy md:text-3xl">
                                {t.subtitle}
                            </h1>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 px-5 py-4">
                                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-stone-500 uppercase">
                                    <Bell className="h-4 w-4 text-royal" />
                                    {t.filters.unread}
                                </div>
                                <div className="mt-2 text-2xl font-black text-navy">
                                    {unreadCount}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-amber-100 bg-amber-50/40 px-5 py-4">
                                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-stone-500 uppercase">
                                    <Bell className="h-4 w-4 text-amber-600" />
                                    {t.filters.urgent}
                                </div>
                                <div className="mt-2 text-2xl font-black text-amber-600">
                                    {items.filter((n) => n.urgent).length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-12">
                    <div className="rounded-2xl border border-blue-100 bg-white shadow-sm lg:col-span-7">
                        <div className="border-b border-blue-50 p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="flex items-center text-sm font-black text-navy">
                                    <Bell className="mr-2 h-4 w-4 text-royal" />
                                    {t.systemNotifications}
                                </h2>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50/50 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setFilter('ALL')}
                                            className={`rounded-xl px-3 py-2 text-xs font-bold ${
                                                filter === 'ALL'
                                                    ? 'bg-white text-navy shadow-sm'
                                                    : 'text-stone-600 hover:text-navy'
                                            }`}
                                        >
                                            {t.filters.all}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFilter('UNREAD')}
                                            className={`rounded-xl px-3 py-2 text-xs font-bold ${
                                                filter === 'UNREAD'
                                                    ? 'bg-white text-navy shadow-sm'
                                                    : 'text-stone-600 hover:text-navy'
                                            }`}
                                        >
                                            {t.filters.unread}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFilter('URGENT')}
                                            className={`rounded-xl px-3 py-2 text-xs font-bold ${
                                                filter === 'URGENT'
                                                    ? 'bg-white text-navy shadow-sm'
                                                    : 'text-stone-600 hover:text-navy'
                                            }`}
                                        >
                                            {t.filters.urgent}
                                        </button>
                                    </div>

                                    <Button
                                        variant="secondary"
                                        className="rounded-2xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100"
                                        onClick={markAllAsRead}
                                        disabled={items.length === 0 || unreadCount === 0}
                                    >
                                        {t.actions.markAllRead}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="max-h-[520px] overflow-y-auto">
                            {filteredNotifications.length === 0 ? (
                                <div className="p-10 text-center">
                                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                                        <Bell className="h-7 w-7 text-royal/60" />
                                    </div>
                                    <div className="text-sm font-black text-navy">
                                        {t.empty.notifications.title}
                                    </div>
                                    <div className="mt-1 text-xs text-stone-500">
                                        {t.empty.notifications.desc}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {filteredNotifications
                                        .slice()
                                        .sort((a, b) => (a.time < b.time ? 1 : -1))
                                        .map((note) => (
                                            <button
                                                type="button"
                                                key={note.id}
                                                onClick={() => void markOneAsRead(note.id)}
                                                className={`w-full border-b border-blue-50 p-5 text-left transition-colors hover:bg-blue-50/40 ${
                                                    note.urgent ? 'bg-amber-50/40' : ''
                                                } ${!note.read ? 'bg-blue-50/30' : ''}`}
                                            >
                                                <div className="mb-2 flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            {!note.read ? (
                                                                <span className="h-2 w-2 shrink-0 rounded-full bg-royal" />
                                                            ) : null}
                                                            <h3
                                                                className={`truncate text-sm font-black ${
                                                                    note.urgent
                                                                        ? 'text-navy'
                                                                        : 'text-navy'
                                                                }`}
                                                            >
                                                                {language === 'en'
                                                                    ? note.title.en
                                                                    : note.title.am}
                                                            </h3>
                                                        </div>
                                                        <p className="mt-1 text-xs leading-relaxed text-stone-600">
                                                            {language === 'en'
                                                                ? note.desc.en
                                                                : note.desc.am}
                                                        </p>
                                                    </div>

                                                    <div className="shrink-0 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                                                        <span className="inline-flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {formatTime(note.time)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {note.urgent ? (
                                                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black tracking-wider text-amber-700 uppercase">
                                                            {t.filters.urgent}
                                                        </span>
                                                    ) : (
                                                        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-black tracking-wider text-stone-500 uppercase">
                                                            {t.activity.system}
                                                        </span>
                                                    )}
                                                    {!note.read ? (
                                                        <span className="rounded-full border border-royal/20 bg-royal/5 px-3 py-1 text-[10px] font-black tracking-wider text-royal uppercase">
                                                            {t.filters.unread}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-white shadow-sm lg:col-span-5">
                        <div className="border-b border-blue-50 p-5">
                            <h2 className="flex items-center text-sm font-black text-navy">
                                <Calendar className="mr-2 h-4 w-4 text-royal" />
                                {t.recentActivities}
                            </h2>
                        </div>

                        {activities.length === 0 && activitiesBootstrapped ? (
                            <div className="p-10 text-center">
                                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                                    <Calendar className="h-7 w-7 text-royal/60" />
                                </div>
                                <div className="text-sm font-black text-navy">
                                    {t.empty.activities.title}
                                </div>
                                <div className="mt-1 text-xs text-stone-500">
                                    {t.empty.activities.desc}
                                </div>
                            </div>
                        ) : (
                            <div
                                ref={activitiesContainerRef}
                                onScroll={maybeLoadMoreActivities}
                                className="max-h-[520px] overflow-y-auto p-5"
                            >
                                <div className="space-y-4">
                                    {activities.map((act) => {
                                        const meta =
                                            activityMeta[act.type] ??
                                            ({
                                                icon: Calendar,
                                                className:
                                                    'border-blue-100 bg-blue-50 text-royal',
                                            } satisfies {
                                                icon: typeof Bell;
                                                className: string;
                                            });
                                        const Icon = meta.icon;

                                        return (
                                            <div
                                                key={act.id}
                                                className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                                            >
                                                <div className="p-5">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-start gap-3">
                                                            <div
                                                                className={`flex h-11 w-11 items-center justify-center rounded-xl border ${meta.className}`}
                                                            >
                                                                <Icon className="h-5 w-5" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-sm font-black text-navy">
                                                                    {language === 'en'
                                                                        ? act.title.en
                                                                        : act.title.am}
                                                                </div>
                                                                <div className="mt-1 text-xs text-stone-600">
                                                                    {language === 'en'
                                                                        ? act.desc.en
                                                                        : act.desc.am}
                                                                </div>

                                                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black tracking-wider text-stone-500 uppercase">
                                                                    <Clock className="h-3 w-3" />
                                                                    {formatTime(new Date(act.time))}
                                                                </span>
                                                            </div>
                                                            </div>
                                                        </div>

                                                        {act.link ? (
                                                            <a
                                                                href={act.link}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-black text-royal transition-colors hover:bg-blue-100"
                                                            >
                                                                {t.activity.view}
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {activitiesLoading ? (
                                    <div className="py-4 text-center text-xs font-bold text-stone-500">
                                        Loading...
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
