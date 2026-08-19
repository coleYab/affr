import { Head } from '@inertiajs/react';
import { CheckCircle, Clock, Ticket as TicketIcon, XCircle, AlertCircle, Calendar } from 'lucide-react';
import type { ReactElement } from 'react';
import { useLanguage } from '@/hooks/use-language';
import AppLayout from '@/layouts/app-layout';
import { mytickets } from '@/routes/user';
import type { BreadcrumbItem } from '@/types';

// 1. Unified Status Types to match your backend/props
type TicketStatus = 'AVAILABLE' | 'PENDING' | 'SOLD' | 'VOID';

interface Ticket {
    id: number;
    ticketNumber: string | number;
    status: TicketStatus;
    reservedAt: string; // Dates usually come as strings over the wire in Inertia
    paymentId?: number | null;
}

interface PageProps {
    tickets: Ticket[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tickets',
        href: mytickets().url,
    },
];

const TRANSLATIONS = {
    en: {
        pageTitle: 'Tickets',
        subtitle: 'View your tickets',
        ticketNumber: 'Ticket #',
        status: 'Status',
        assignedDate: 'Assigned',
        assignedBy: 'Method',
        purchased: 'PURCHASED',
        systemAssigned: 'SYSTEM ASSIGNED',
        empty: {
            title: 'No tickets found',
            desc: 'You don’t have any tickets assigned for this period.',
        },
    },
    am: {
        pageTitle: 'ቲኬቶች',
        subtitle: 'ቲኬቶችዎን ይመልከቱ',
        ticketNumber: 'ቲኬት #',
        status: 'ሁኔታ',
        assignedDate: 'የተሰጠበት ቀን',
        assignedBy: 'መንገድ',
        purchased: 'የተገዛ',
        systemAssigned: 'በስርዓት የተመደበ',
        empty: {
            title: 'ምንም ቲኬት የለም',
            desc: 'ምንም አይነት ቲኬት አልተገኘም::',
        },
    },
} as const;

const statusStyles: Record<TicketStatus, { label: string; className: string; icon: ReactElement }> = {
    AVAILABLE: {
        label: 'AVAILABLE',
        className: 'border-royal/20 bg-royal/5 text-royal',
        icon: <CheckCircle className="h-3.5 w-3.5" />,
    },
    PENDING: {
        label: 'PENDING',
        className: 'border-amber-200 bg-amber-50 text-amber-700',
        icon: <Clock className="h-3.5 w-3.5" />,
    },
    SOLD: {
        label: 'SOLD',
        className: 'border-blue-200 bg-blue-50 text-navy',
        icon: <TicketIcon className="h-3.5 w-3.5" />,
    },
    VOID: {
        label: 'VOID',
        className: 'border-stone-200 bg-stone-50 text-stone-600',
        icon: <XCircle className="h-3.5 w-3.5" />,
    },
};

export default function Tickets({ tickets }: PageProps) {
    const { language } = useLanguage();
    const t = TRANSLATIONS[language];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.pageTitle} />

            <div className="flex h-full flex-1 flex-col gap-3 bg-blue-50/40 p-3 sm:p-4">
                {/* Header Section */}
                <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-royal/20 bg-royal/5 px-3 py-1 text-[10px] font-bold tracking-wide text-royal uppercase">
                                <TicketIcon className="h-3.5 w-3.5" />
                                {t.pageTitle}
                            </span>
                            <h1 className="mt-2 text-xl font-extrabold tracking-tight text-navy sm:text-2xl">{t.pageTitle}</h1>
                            <p className="mt-0.5 text-sm text-stone-500">{t.subtitle}</p>
                        </div>
                        <div className="rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-2 text-center">
                            <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                {t.ticketNumber}
                            </div>
                            <div className="text-lg font-black text-royal">
                                {tickets.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tickets Card List */}
                <div className="flex-1 space-y-3 pb-2">
                    {tickets.length === 0 ? (
                        <div className="rounded-2xl border border-blue-100 bg-white p-12 text-center shadow-sm">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                                <AlertCircle className="h-7 w-7 text-royal/60" />
                            </div>
                            <div className="text-sm font-bold text-navy">{t.empty.title}</div>
                            <div className="mt-1 text-xs text-stone-500">{t.empty.desc}</div>
                        </div>
                    ) : (
                        tickets.map((ticket) => {
                            const meta = statusStyles[ticket.status] || statusStyles.VOID;
                            return (
                                <div
                                    key={ticket.id}
                                    className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-blue-50/80 px-4 py-2.5">
                                        <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                                            {t.ticketNumber}
                                        </span>
                                        <span className="text-xl font-black text-navy">
                                            #{ticket.ticketNumber}
                                        </span>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${meta.className}`}
                                            >
                                                {meta.icon}
                                                {meta.label}
                                            </span>
                                            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-600 uppercase">
                                                {ticket.paymentId
                                                    ? t.purchased
                                                    : t.systemAssigned}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5 text-royal/70" />
                                                {new Date(ticket.reservedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </AppLayout>
    );
}