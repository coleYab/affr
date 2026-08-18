import { Head } from '@inertiajs/react';
import { Banknote, CheckCircle, Clock, FileText, XCircle } from 'lucide-react';
import type { ReactElement } from 'react';
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
        table: {
            date: 'Date',
            amount: 'Amount',
            status: 'Status',
            receipt: 'Receipt',
        },
        receipt: {
            view: 'View',
            missing: '—',
        },
        empty: {
            title: 'No payments yet',
            desc: 'Your approved payments will appear here.',
        },
    },
    am: {
        pageTitle: 'የእኔ ክፍያዎች',
        subtitle: 'የክፍያ ታሪክዎን ይመልከቱ',
        table: {
            date: 'ቀን',
            amount: 'መጠን',
            status: 'ሁኔታ',
            receipt: 'ደረሰኝ',
        },
        receipt: {
            view: 'አሳይ',
            missing: '—',
        },
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
            <div className="flex h-full flex-1 flex-col gap-4 bg-blue-50/40 p-4 sm:p-6">
                {/* Header Section */}
                <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-royal/20 bg-royal/5 px-3 py-1 text-[10px] font-bold tracking-wide text-royal uppercase">
                                <Banknote className="h-3.5 w-3.5" />
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
                                <FileText className="mr-2 h-4 w-4 text-royal" />
                                {t.pageTitle}
                            </h2>
                        </div>
                    </div>

                    {payments.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                                <Banknote className="h-7 w-7 text-royal/60" />
                            </div>
                            <div className="text-sm font-bold text-navy">{t.empty.title}</div>
                            <div className="mt-1 text-xs text-stone-500">{t.empty.desc}</div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-blue-50/50 text-left">
                                        <th className="px-5 py-4 text-xs font-bold tracking-wider text-stone-500 uppercase">
                                            {t.table.date}
                                        </th>
                                        <th className="px-5 py-4 text-xs font-bold tracking-wider text-stone-500 uppercase">
                                            {t.table.amount}
                                        </th>
                                        <th className="px-5 py-4 text-xs font-bold tracking-wider text-stone-500 uppercase">
                                            {t.table.status}
                                        </th>
                                        <th className="px-5 py-4 text-xs font-bold tracking-wider text-stone-500 uppercase">
                                            {t.table.receipt}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-50">
                                    {payments.map((payment) => {
                                        const meta = statusStyles[payment.status];
                                        return (
                                            <tr key={payment.id} className="transition-colors hover:bg-blue-50/30">
                                                <td className="px-5 py-4 text-sm text-stone-700">
                                                    <span className="font-mono text-xs text-stone-600">
                                                        {formatDateTime(payment.date)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-black text-navy">
                                                        {payment.amount.toLocaleString()} ETB
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${meta.className}`}
                                                    >
                                                        {meta.icon}
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    {payment.receiptUrl ? (
                                                        <a
                                                            href={payment.receiptUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="rounded-full bg-royal/5 px-3 py-1 text-xs font-bold text-royal transition-colors hover:bg-royal/10"
                                                        >
                                                            {t.receipt.view}
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-stone-400">
                                                            {t.receipt.missing}
                                                        </span>
                                                    )}
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
