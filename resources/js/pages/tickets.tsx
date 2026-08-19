import { Head } from '@inertiajs/react';
import { AlertCircle, Calendar, Ticket as TicketIcon } from 'lucide-react';
import type { ReactElement } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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

const statusStyles: Record<TicketStatus, { label: string; badge: ReactElement }> = {
    AVAILABLE: {
        label: 'AVAILABLE',
        badge: <Badge className="bg-royal">AVAILABLE</Badge>,
    },
    PENDING: {
        label: 'PENDING',
        badge: <Badge variant="outline">PENDING</Badge>,
    },
    SOLD: {
        label: 'SOLD',
        badge: <Badge className="border-blue-200 bg-blue-50 text-navy">SOLD</Badge>,
    },
    VOID: {
        label: 'VOID',
        badge: <Badge variant="secondary">VOID</Badge>,
    },
};

export default function Tickets({ tickets }: PageProps) {
    const { language } = useLanguage();
    const t = TRANSLATIONS[language];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.pageTitle} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6 animate-fade-in-up">
                    {/* Header Section */}
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] font-bold tracking-wide text-stone-600 uppercase">
                                <TicketIcon className="h-3.5 w-3.5 text-royal" />
                                {t.pageTitle}
                            </span>
                            <h1 className="mt-2 text-2xl font-bold text-stone-800">{t.pageTitle}</h1>
                            <p className="text-sm text-stone-500">{t.subtitle}</p>
                        </div>

                        <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                            <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                {t.ticketNumber}
                            </div>
                            <div className="mt-1 text-xl font-black text-stone-900">
                                {tickets.length}
                            </div>
                        </div>
                    </div>

                    {/* Tickets Card List */}
                    <div className="grid grid-cols-1 gap-4">
                        {tickets.length === 0 ? (
                            <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-50">
                                    <AlertCircle className="h-7 w-7 text-royal" />
                                </div>
                                <h3 className="text-xl font-bold text-stone-800">{t.empty.title}</h3>
                                <p className="mt-2 text-stone-500">{t.empty.desc}</p>
                            </div>
                        ) : (
                            tickets.map((ticket) => {
                                const meta = statusStyles[ticket.status] || statusStyles.VOID;
                                return (
                                    <Card
                                        key={ticket.id}
                                        className="overflow-hidden border-stone-200 shadow-sm"
                                    >
                                        <CardHeader className="space-y-1 bg-stone-50/60">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <CardTitle className="text-base text-stone-900">
                                                        <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                                                            {t.ticketNumber}{' '}
                                                        </span>
                                                        <span className="text-2xl font-black text-navy">
                                                            #{ticket.ticketNumber}
                                                        </span>
                                                    </CardTitle>
                                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                                        {meta.badge}
                                                        <Badge variant="secondary" className="text-[10px]">
                                                            {ticket.paymentId
                                                                ? t.purchased
                                                                : t.systemAssigned}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-3">
                                                <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                                                    <Calendar className="h-4 w-4 text-royal" />
                                                    {t.assignedDate}
                                                </div>
                                                <div className="text-sm font-black text-stone-900">
                                                    {new Date(ticket.reservedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}