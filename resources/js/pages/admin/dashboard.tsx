import { Head, Link, usePage } from '@inertiajs/react';
import {
    Bell,
    DollarSign,
    ExternalLink,
    Ticket,
    Users,
    FileText,
    Clock,
    Play,
    Sparkles,
} from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ADMIN_TRANSLATIONS } from '@/constants';
import { useLanguage } from '@/hooks/use-language';
import AppLayout from '@/layouts/app-layout';
import { dashboard as adminDashboard } from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';
import type { PaymentRequest, AppSettings } from '@/types/app';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: adminDashboard().url,
    },
];

interface PageProps {
    paymentRequests: PaymentRequest[];
    claimedTickets: number;
    totalMembers: number;
    pendingVerifications: number;
    systemHealth: number;
    totalUsers: number;
    paymentsVerified: number;
    reservedTickets: number;
}

export default function Dashboard({
    paymentRequests,
    claimedTickets,
    totalMembers,
    pendingVerifications,
    systemHealth,
    totalUsers,
}: PageProps) {
    const { props } = usePage();
    const settings = props.settings as AppSettings;

    const { language } = useLanguage();
    const t = ADMIN_TRANSLATIONS[language];

    const currentPot = useMemo(() => {
        return Math.max(claimedTickets, 0) * 2000;
    }, [claimedTickets]);

    const pendingPayments = paymentRequests;

    const activityItems = useMemo(() => {
        return [
            {
                id: 'act_001',
                label: 'System healthy',
                value: `${systemHealth}%`,
                icon: Bell,
                className: 'border-blue-200 bg-blue-50 text-navy',
            },
            {
                id: 'act_002',
                label: 'New users registered',
                value: String(totalUsers),
                icon: Users,
                className: 'border-blue-200 bg-blue-50 text-blue-800',
            },
            {
                id: 'act_003',
                label: 'Tickets claimed',
                value: String(claimedTickets),
                icon: Ticket,
                className: 'border-blue-200 bg-blue-50 text-navy',
            },
            {
                id: 'act_004',
                label: 'Payments received',
                value: String(currentPot),
                icon: FileText,
                className: 'border-stone-200 bg-stone-50 text-stone-700',
            },
        ];
    }, [systemHealth, totalUsers, claimedTickets, currentPot]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-stone-900 via-stone-900 to-navy text-white shadow-xl">
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-royal/30 blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-royal/25 blur-3xl" />
                    </div>

                    <div className="relative p-6 md:p-10">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold tracking-wider uppercase">
                                <Sparkles className="h-4 w-4 text-blue-300" />
                                Admin Dashboard
                            </div>
                            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                                Monitor key metrics, cycle health, and review recent requests.
                            </h1>
                            <p className="mt-3 text-sm text-white/70 md:text-base">
                                Current cycle: {settings.cycle}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">

                    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-stone-500 uppercase">
                                {t.dashboard.totalPot}
                            </h3>
                            <DollarSign className="h-5 w-5 text-royal" />
                        </div>
                        <p className="text-2xl font-bold text-stone-800">
                            {currentPot.toLocaleString()} ETB
                        </p>
                        <p className="mt-1 text-xs text-stone-400">
                            Current cycle {settings.cycle}
                        </p>
                    </div>

                    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-stone-500 uppercase">
                                {t.dashboard.claimedTickets}
                            </h3>
                            <Ticket className="h-5 w-5 text-royal" />
                        </div>
                        <p className="text-2xl font-bold text-stone-800">
                            {claimedTickets}
                        </p>
                    </div>

                    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-stone-500 uppercase">
                                {t.dashboard.totalMembers}
                            </h3>
                            <Users className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold text-stone-800">
                            {totalMembers.toLocaleString()}
                        </p>
                    </div>

                    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-stone-500 uppercase">
                                {t.dashboard.pending}
                            </h3>
                            <FileText className="h-5 w-5 text-royal" />
                        </div>
                        <p className="text-2xl font-bold text-stone-800">
                            {pendingVerifications || paymentRequests.length}
                        </p>
                    </div>

                </div>

                {/* Activity + Quick Actions */}
                <div className="grid gap-4 lg:grid-cols-12">

                    {/* Quick Actions */}
                    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black text-stone-900">
                                Quick actions
                            </h2>
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black tracking-wider text-navy uppercase">
                                Active
                            </span>
                        </div>

                        <div className="mt-4 space-y-3">
                            <Button className="w-full rounded-2xl" variant="secondary" asChild>
                                <Link
                                    href={settings.isLive ? settings.liveStreamUrl : '#'}
                                    target={settings.isLive ? '_blank' : ''}
                                    rel="noreferrer"
                                    prefetch
                                >
                                    <Play className="mr-2 h-4 w-4" />
                                    Open livestream
                                    <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                                </Link>
                            </Button>

                            <Button className="w-full rounded-2xl" variant="secondary" asChild>
                                <Link
                                    href={'/admin/payments'}
                                    rel="noreferrer"
                                    prefetch
                                >
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Validate Payments
                                </Link>
                            </Button>

                            <div className="flex justify-center mx-auto rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                                <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-stone-500" />
                                <span className="font-bold">Next draw:</span>
                                <span className="ml-2 font-bold">
                                    {settings.daysRemaining} days
                                </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity */}
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm lg:col-span-8">
                        <div className="border-b border-stone-100 p-6">
                            <h2 className="text-sm font-black text-stone-900">
                                Recent admin activity
                            </h2>
                        </div>

                        <div className="grid gap-4 p-6 md:grid-cols-2">
                            {activityItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start justify-between gap-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${item.className}`}>
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                                {item.label}
                                            </div>
                                            <div className="mt-2 text-2xl font-black text-stone-900">
                                                {item.value}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-stone-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-sm font-black text-stone-900">
                            {t.dashboard.recentPay}
                        </h2>
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">
                            {t.dashboard.pending}: {pendingPayments.length}
                        </span>
                    </div>

                    {pendingPayments.length === 0 ? (
                        <div className="p-10 text-center text-sm font-bold text-stone-500">
                            {t.payments.noRequests}
                        </div>
                    ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead className="bg-stone-50 text-xs text-stone-500 uppercase">
                                        <tr>
                                            <th className="px-6 py-3">{t.dashboard.user}</th>
                                            <th className="px-6 py-3">{t.dashboard.amount}</th>
                                            <th className="px-6 py-3">{t.dashboard.date}</th>
                                            <th className="px-6 py-3">{t.dashboard.action}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {pendingPayments.slice(0, 4).map((req) => (
                                            <tr key={req.id} className="hover:bg-stone-50">
                                                <td className="px-6 py-4">
                                                    <div className="font-black text-stone-900">
                                                        {req.userName}
                                                    </div>
                                                    <div className="mt-1 text-xs text-stone-500">
                                                        {req.userPhone}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-black text-stone-900">
                                                    {req.amount.toLocaleString()} ETB
                                                </td>
                                                <td className="px-6 py-4 text-sm text-stone-600">
                                                    {(new Date()).toISOString().split('T').at(0)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Button
                                                        variant="secondary"
                                                        className="rounded-2xl"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={'/admin/payments'}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            {t.dashboard.review}
                                                            <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                </div>
            </div>
        </AppLayout>
    );
}
