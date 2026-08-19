import { Head } from '@inertiajs/react';
import { Banknote, CalendarDays, Eye } from 'lucide-react';
import type { ReactElement } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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

const statusStyles: Record<PaymentRequest['status'], { badge: ReactElement }> = {
    APPROVED: {
        badge: <Badge className="bg-royal">APPROVED</Badge>,
    },
    PENDING: {
        badge: <Badge variant="outline">PENDING</Badge>,
    },
    REJECTED: {
        badge: <Badge variant="destructive">REJECTED</Badge>,
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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6 animate-fade-in-up">
                    {/* Header Section */}
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] font-bold tracking-wide text-stone-600 uppercase">
                                <Banknote className="h-3.5 w-3.5 text-royal" />
                                {t.pageTitle}
                            </span>
                            <h1 className="mt-2 text-2xl font-bold text-stone-800">{t.pageTitle}</h1>
                            <p className="text-sm text-stone-500">{t.subtitle}</p>
                        </div>

                        <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                            <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                {t.amount}
                            </div>
                            <div className="mt-1 text-xl font-black text-stone-900">
                                {payments.length}
                            </div>
                        </div>
                    </div>

                    {/* Payments Card List */}
                    <div className="grid grid-cols-1 gap-4">
                        {payments.length === 0 ? (
                            <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-50">
                                    <Banknote className="h-7 w-7 text-royal" />
                                </div>
                                <h3 className="text-xl font-bold text-stone-800">{t.empty.title}</h3>
                                <p className="mt-2 text-stone-500">{t.empty.desc}</p>
                            </div>
                        ) : (
                            payments.map((payment) => {
                                const meta = statusStyles[payment.status];
                                return (
                                    <Card
                                        key={payment.id}
                                        className="overflow-hidden border-stone-200 shadow-sm"
                                    >
                                        <CardHeader className="space-y-1 bg-stone-50/60">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <CardTitle className="text-base text-stone-900">
                                                        {new Date(payment.date).toLocaleDateString()}
                                                    </CardTitle>
                                                    <div className="mt-1 flex items-center gap-2 text-xs text-stone-400">
                                                        <CalendarDays className="h-3.5 w-3.5 text-royal/70" />
                                                        {formatDateTime(payment.date)}
                                                    </div>
                                                </div>
                                                {meta.badge}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                                    {t.amount}
                                                </div>
                                                <div className="text-sm font-black text-navy">
                                                    {payment.amount.toLocaleString()} ETB
                                                </div>
                                            </div>
                                        </CardContent>
                                        <div className="border-t bg-white p-2">
                                            {payment.receiptUrl ? (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full rounded-xl"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            {t.receipt}
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-lg p-4 sm:p-6">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                {t.receiptDialogTitle}
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <div className="mt-2 overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-2">
                                                            <img
                                                                src={payment.receiptUrl}
                                                                alt={t.receiptDialogTitle}
                                                                className="mx-auto max-h-[70vh] w-auto rounded-lg object-contain"
                                                            />
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            ) : null}
                                        </div>
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