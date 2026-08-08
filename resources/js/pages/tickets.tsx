import { Head } from '@inertiajs/react';
import { CheckCircle, Clock, Ticket as TicketIcon, XCircle, AlertCircle } from 'lucide-react';
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
        table: {
            ticketNumber: 'Ticket #',
            status: 'Status',
            assignedDate: 'Assigned',
            assignedBy: 'Method',
        },
        empty: {
            title: 'No tickets found',
            desc: 'You don’t have any tickets assigned for this period.',
        },
    },
    am: {
        pageTitle: 'ቲኬቶች',
        subtitle: 'ቲኬቶችዎን ይመልከቱ',
        table: {
            ticketNumber: 'ቲኬት #',
            status: 'ሁኔታ',
            assignedDate: 'የተሰጠበት ቀን',
            assignedBy: 'መንገድ',
        },
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
        icon: <CheckCircle className="h-4 w-4" />,
    },
    PENDING: {
        label: 'PENDING',
        className: 'border-amber-200 bg-amber-50 text-amber-700',
        icon: <Clock className="h-4 w-4" />,
    },
    SOLD: {
        label: 'SOLD',
        className: 'border-blue-200 bg-blue-50 text-navy',
        icon: <TicketIcon className="h-4 w-4" />,
    },
    VOID: {
        label: 'VOID',
        className: 'border-stone-200 bg-stone-50 text-stone-600',
        icon: <XCircle className="h-4 w-4" />,
    },
};

export default function Tickets({ tickets }: PageProps) {
    const { language } = useLanguage();
    const t = TRANSLATIONS[language];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.pageTitle} />

            <div className="flex h-full flex-1 flex-col gap-4 bg-blue-50/40 p-4 sm:p-6">
                {/* Header Section */}
                <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-royal/20 bg-royal/5 px-3 py-1 text-[10px] font-bold tracking-wide text-royal uppercase">
                                <TicketIcon className="h-3.5 w-3.5" />
                                {t.pageTitle}
                            </span>
                            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-navy">{t.pageTitle}</h1>
                            <p className="mt-1 text-sm text-stone-500">{t.subtitle}</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                    <div className="border-b border-blue-50 p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center text-sm font-bold text-navy">
                                <TicketIcon className="mr-2 h-4 w-4 text-royal" />
                                {t.pageTitle}
                            </h2>
                        </div>
                    </div>

                    {tickets.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                                <AlertCircle className="h-7 w-7 text-royal/60" />
                            </div>
                            <div className="text-sm font-bold text-navy">{t.empty.title}</div>
                            <div className="mt-1 text-xs text-stone-500">{t.empty.desc}</div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-blue-50/50 text-left">
                                        <th className="px-6 py-4 text-xs font-bold tracking-wider text-stone-500 uppercase">{t.table.ticketNumber}</th>
                                        <th className="px-6 py-4 text-xs font-bold tracking-wider text-stone-500 uppercase">{t.table.status}</th>
                                        <th className="px-6 py-4 text-xs font-bold tracking-wider text-stone-500 uppercase">{t.table.assignedDate}</th>
                                        <th className="hidden px-6 py-4 text-xs font-bold tracking-wider text-stone-500 uppercase md:table-cell">{t.table.assignedBy}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-50">
                                    {tickets.map((ticket) => {
                                        const meta = statusStyles[ticket.status] || statusStyles.VOID;
                                        return (
                                            <tr key={ticket.id} className="transition-colors hover:bg-blue-50/30">
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-black text-navy">
                                                        #{ticket.ticketNumber}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${meta.className}`}>
                                                        {meta.icon}
                                                        {meta.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-xs text-stone-600">
                                                        {new Date(ticket.reservedAt).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td className="hidden px-6 py-4 md:table-cell">
                                                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-600 uppercase">
                                                        {ticket.paymentId ? 'PURCHASED' : 'SYSTEM ASSIGNED'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
