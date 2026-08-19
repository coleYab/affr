import { Head } from '@inertiajs/react';
import { Banknote, CalendarDays, CheckCircle, Clock, Eye, XCircle } from 'lucide-react';
import type { ReactElement } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/use-language';
import AppLayout from '@/layouts/app-layout';
import { formatDateTime } from '@/lib/utils';
import { mypayments } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import type { PaymentRequest } from '@/types/app';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'MyPayments',
        href: mypayments().url,
    },
];

const TRANSLATIONS = {
    en: {
        pageTitle: 'My Payments',
        subtitle: 'Review your payment history',
        date: 'Date',
        amount: 'Amount',
        status: 'Status',
        receipt: 'Receipt',
        receiptDialogTitle: 'Payment receipt',
        receiptDialogClose: 'Close',
        empty: {
            title: 'No payments yet',
            desc: 'Your approved payments will appear here.',
        },
    },
    am: {
        pageTitle: 'የእኔ ክፍያዎች',
        subtitle: 'የክፍያ ታሪክዎን ይመልከቱ',
        date: 'ቀን',
        amount: 'መጠን',
        status: 'ሁኔታ',
        receipt: 'ደረሰኝ',
        receiptDialogTitle: 'የክፍያ ደረሰኝ',
        receiptDialogClose: 'ዝጋ',
        empty: {
            title: 'ምንም ክፍያ የለም',
            desc: 'የጸደቁ ክፍያዎችዎ እዚህ ይታያሉ።',
        },
    },
} as const;

const statusStyles: Record<PaymentRequest['status'], { className: string; icon: ReactElement }> = {
    APPROVED: {
        className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        icon: <CheckCircle className="h-4 w-4" />,
    },
    PENDING: {
        className: 'border-amber-200 bg-amber-50 text-amber-700',
        icon: <Clock className="h-4 w-4" />,
    },
    REJECTED: {
        className: 'border-red-200 bg-red-50 text-red-700',
        icon: <XCircle className="h-4 w-4" />,
    },
};

interface PageProps {
    payments: PaymentRequest[]
}

export default function MyPayments({ payments } : PageProps) {
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
                                <Banknote className="h-3.5 w-3.5" />
                                {t.pageTitle}
                            </span>
                            <h1 className="mt-2 text-xl font-extrabold tracking-tight text-navy sm:text-2xl">{t.pageTitle}</h1>
                            <p className="mt-0.5 text-sm text-stone-500">{t.subtitle}</p>
                        </div>
                        <div className="rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-2 text-center">
                            <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                {t.amount}
                            </div>
                            <div className="text-lg font-black text-royal">
                                {payments.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payments Card List */}
                <div className="flex-1 space-y-3 pb-2">
                    {payments.length === 0 ? (
                        <div className="rounded-2xl border border-blue-100 bg-white p-12 text-center shadow-sm">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                                <Banknote className="h-7 w-7 text-royal/60" />
                            </div>
                            <div className="text-sm font-bold text-navy">{t.empty.title}</div>
                            <div className="mt-1 text-xs text-stone-500">{t.empty.desc}</div>
                        </div>
                    ) : (
                        payments.map((payment) => {
                            const meta = statusStyles[payment.status];
                            return (
                                <div
                                    key={payment.id}
                                    className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500">
                                            <CalendarDays className="h-4 w-4 text-royal/70" />
                                            {formatDateTime(payment.date)}
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${meta.className}`}>
                                            {meta.icon}
                                            {payment.status}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between gap-3">
                                        <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-base font-black text-navy">
                                            {payment.amount.toLocaleString()} ETB
                                        </span>

                                        {payment.receiptUrl ? (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-1.5 rounded-full bg-royal/5 px-4 py-2 text-xs font-bold text-royal transition-colors hover:bg-royal/10"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        {t.receipt}
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-lg p-4 sm:p-6">
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            {t.receiptDialogTitle}
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="mt-2 overflow-hidden rounded-xl border border-blue-100 bg-blue-50/40 p-2">
                                                        <img
                                                            src={payment.receiptUrl}
                                                            alt={t.receiptDialogTitle}
                                                            className="mx-auto max-h-[70vh] w-auto rounded-lg object-contain"
                                                        />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <span className="text-xs text-stone-400">
                                                —
                                            </span>
                                        )}
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