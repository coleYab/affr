
import { Head, router } from '@inertiajs/react';
import {
    CheckCircle,
    FileImage,
    Search,
    Ticket,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import PaymentsController from '@/actions/App/Http/Controllers/PaymentsController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ADMIN_TRANSLATIONS } from '@/constants';
import { useLanguage } from '@/hooks/use-language';
import AppLayout from '@/layouts/app-layout';
import { payments as adminPayments } from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';
import type { PaymentRequest } from '@/types/app';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: adminPayments().url,
    },
];

interface PageProps {
    paymentRequest: PaymentRequest[];
}

export default function Payments({ paymentRequest }: PageProps) {
    const { language } = useLanguage();
    const t = ADMIN_TRANSLATIONS[language];

    const [requests, setRequests] =
        useState<PaymentRequest[]>(paymentRequest);

    const [selectedReceipt, setSelectedReceipt] =
        useState<PaymentRequest | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [tab, setTab] =
        useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

    const [decisionOpen, setDecisionOpen] = useState(false);
    const [decisionType, setDecisionType] =
        useState<'APPROVE' | 'REJECT'>('APPROVE');
    const [decisionRequest, setDecisionRequest] =
        useState<PaymentRequest | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const stats = useMemo(() => {
        return {
            pending: requests.filter((r) => r.status === 'PENDING').length,
            approved: requests.filter((r) => r.status === 'APPROVED').length,
            rejected: requests.filter((r) => r.status === 'REJECTED').length,
        };
    }, [requests]);

    const filteredRequests = useMemo(() => {
        const normalized = searchTerm.trim().toLowerCase();

        return requests
            .filter((r) => r.status === tab)
            .filter((r) => {
                if (!normalized) return true;

                return (
                    r.userName.toLowerCase().includes(normalized) ||
                    r.userPhone.toLowerCase().includes(normalized) ||
                    r.id.toLowerCase().includes(normalized)
                );
            })
            .sort(
                (a, b) =>
                    new Date(b.date).getTime() -
                    new Date(a.date).getTime()
            );
    }, [requests, searchTerm, tab]);

    const openDecision = (
        type: 'APPROVE' | 'REJECT',
        req: PaymentRequest
    ) => {
        setDecisionType(type);
        setDecisionRequest(req);
        setDecisionOpen(true);
        setRejectReason('');
    };

    const applyDecision = () => {
        if (!decisionRequest) return;

        const updateUrl = PaymentsController.updateStatus({
            id: decisionRequest.id,
        }).url;

        router.put(
            updateUrl,
            {
                status:
                    decisionType === 'APPROVE'
                        ? 'APPROVED'
                        : 'REJECTED',
                rejectReason:
                    decisionType === 'REJECT'
                        ? rejectReason
                        : null,
            },
            {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    setRequests((prev) =>
                        prev.map((r) =>
                            r.id === decisionRequest.id
                                ? {
                                      ...r,
                                      status:
                                          decisionType ===
                                          'APPROVE'
                                              ? 'APPROVED'
                                              : 'REJECTED',
                                  }
                                : r
                        )
                    );

                    toast.success(
                        decisionType === 'APPROVE'
                            ? 'Payment approved successfully'
                            : 'Payment rejected successfully'
                    );

                    setDecisionOpen(false);
                    setDecisionRequest(null);
                },
                onError: () => {
                    toast.error(
                        'Something went wrong. Please try again.'
                    );
                },
            }
        );
    };

    const statusBadge = (status: PaymentRequest['status']) => {
        if (status === 'APPROVED')
            return (
                <Badge className="bg-royal">
                    APPROVED
                </Badge>
            );

        if (status === 'REJECTED')
            return (
                <Badge variant="destructive">
                    REJECTED
                </Badge>
            );

        return (
            <Badge variant="outline">PENDING</Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6 animate-fade-in-up">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-stone-800">{t.payments.title}</h1>
                            <p className="text-sm text-stone-500">
                                Review receipts and verify payment requests. This page is running in demo mode.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-3">
                            <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                                <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">Pending</div>
                                <div className="mt-1 text-xl font-black text-stone-900">{stats.pending}</div>
                            </div>
                            <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                                <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">Approved</div>
                                <div className="mt-1 text-xl font-black text-stone-900">{stats.approved}</div>
                            </div>
                            <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                                <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">Rejected</div>
                                <div className="mt-1 text-xl font-black text-stone-900">{stats.rejected}</div>
                            </div>
                        </div>
                    </div>

                    <Tabs value={tab} onValueChange={(value) => setTab(value as typeof tab)} className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <TabsList className="h-11 w-full justify-start rounded-xl border border-stone-200 bg-white p-1 sm:w-auto">
                                <TabsTrigger value="PENDING" className="rounded-lg">
                                    Pending
                                </TabsTrigger>
                                <TabsTrigger value="APPROVED" className="rounded-lg">
                                    Approved
                                </TabsTrigger>
                                <TabsTrigger value="REJECTED" className="rounded-lg">
                                    Rejected
                                </TabsTrigger>
                            </TabsList>

                            <div className="relative w-full sm:max-w-md">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name, phone, or ID..."
                                    className="h-11 rounded-xl border-stone-200 bg-white pl-9"
                                />
                            </div>
                        </div>

                        <TabsContent value={tab} className="space-y-4">
                            {filteredRequests.length === 0 ? (
                                <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-sm">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-50">
                                        <CheckCircle className="h-7 w-7 text-royal" />
                                    </div>
                                    <h3 className="text-xl font-bold text-stone-800">{t.payments.allCaughtUp}</h3>
                                    <p className="mt-2 text-stone-500">{t.payments.noRequests}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-4">
                                        {filteredRequests.map((req) => (
                                            <Card key={req.id} className="overflow-hidden border-stone-200 shadow-sm">
                                                <CardHeader className="space-y-1 bg-stone-50/60">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <CardTitle className="text-base text-stone-900">{req.userName}</CardTitle>
                                                            <CardDescription className="text-xs">{req.userPhone}</CardDescription>
                                                            <div className="mt-1 text-[11px] text-stone-400">{req.id}</div>
                                                        </div>
                                                        {statusBadge(req.status)}
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-xs font-bold tracking-wider text-stone-500 uppercase">Amount</div>
                                                        <div className="text-sm font-black text-navy">{req.amount.toLocaleString()} ETB</div>
                                                    </div>
                                                    {req.requestedTicket ? (
                                                        <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-3">
                                                            <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                                                                <Ticket className="h-4 w-4 text-royal" />
                                                                Requested ticket
                                                            </div>
                                                            <div className="text-sm font-black text-stone-900">#{req.requestedTicket}</div>
                                                        </div>
                                                    ) : null}
                                                </CardContent>
                                                <CardFooter className="flex flex-col gap-2 border-t bg-white p-2">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full rounded-xl"
                                                        onClick={() => setSelectedReceipt(req)}
                                                    >
                                                        <FileImage className="mr-2 h-4 w-4" />
                                                        View receipt
                                                    </Button>

                                                    {req.status === 'PENDING' ? (
                                                        <div className="grid w-full grid-cols-2 gap-2">
                                                            <Button
                                                                variant="destructive"
                                                                className="w-full rounded-xl"
                                                                onClick={() => openDecision('REJECT', req)}
                                                            >
                                                                {t.payments.reject}
                                                            </Button>
                                                            <Button
                                                                className="w-full rounded-xl bg-royal text-white hover:bg-royal"
                                                                onClick={() => openDecision('APPROVE', req)}
                                                            >
                                                                {t.payments.approve}
                                                            </Button>
                                                        </div>
                                                    ) : null}
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            )}
                        </TabsContent>
                    </Tabs>

                    <Dialog open={selectedReceipt !== null} onOpenChange={(open) => !open && setSelectedReceipt(null)}>
                        <DialogContent className="sm:max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Receipt preview</DialogTitle>
                                <DialogDescription>
                                    {selectedReceipt ? `${selectedReceipt.userName} • ${selectedReceipt.id}` : ''}
                                </DialogDescription>
                            </DialogHeader>
                            {selectedReceipt ? (
                                <div className="space-y-4">
                                    <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                                        <img
                                            src={selectedReceipt.receiptUrl}
                                            alt="Receipt"
                                            className="h-auto w-full object-contain"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="text-sm text-stone-600">
                                            Amount: <span className="font-bold text-stone-900">{selectedReceipt.amount.toLocaleString()} ETB</span>
                                        </div>
                                        <div className="text-sm text-stone-600">
                                            Submitted By: <span className="font-bold text-stone-900">{selectedReceipt.userName}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </DialogContent>
                    </Dialog>

                    <Dialog open={decisionOpen} onOpenChange={(open) => !open && setDecisionOpen(false)}>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>
                                    {decisionType === 'APPROVE' ? 'Approve payment' : 'Reject payment'}
                                </DialogTitle>
                                <DialogDescription>
                                    {decisionRequest
                                        ? `For ${decisionRequest.userName} (${decisionRequest.userPhone}) — ${decisionRequest.amount.toLocaleString()} ETB`
                                        : ''}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                <Button
                                    variant="secondary"
                                    className="rounded-xl"
                                    onClick={() => {
                                        setDecisionOpen(false);
                                        setDecisionRequest(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant={decisionType === 'APPROVE' ? 'default' : 'destructive'}
                                    className={
                                        decisionType === 'APPROVE'
                                            ? 'rounded-xl bg-royal text-white hover:bg-royal'
                                            : 'rounded-xl'
                                    }
                                    onClick={applyDecision}
                                    disabled={!decisionRequest}
                                >
                                    {decisionType === 'APPROVE' ? (
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                    ) : (
                                        <XCircle className="mr-2 h-4 w-4" />
                                    )}
                                    {decisionType === 'APPROVE' ? 'Approve' : 'Reject'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

            </div>

            {/* Decision Dialog */}
            <Dialog
                open={decisionOpen}
                onOpenChange={(open) =>
                    !open && setDecisionOpen(false)
                }
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {decisionType === 'APPROVE'
                                ? 'Approve payment'
                                : 'Reject payment'}
                        </DialogTitle>
                        <DialogDescription>
                            {decisionRequest
                                ? `For ${decisionRequest.userName} (${decisionRequest.userPhone}) — ${decisionRequest.amount.toLocaleString()} ETB`
                                : ''}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                            variant="secondary"
                            onClick={() =>
                                setDecisionOpen(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={applyDecision}
                            disabled={
                                !decisionRequest || processing
                            }
                            variant={
                                decisionType === 'APPROVE'
                                    ? 'default'
                                    : 'destructive'
                            }
                        >
                            {decisionType === 'APPROVE' ? (
                                <CheckCircle className="mr-2 h-4 w-4" />
                            ) : (
                                <XCircle className="mr-2 h-4 w-4" />
                            )}
                            {processing
                                ? 'Processing...'
                                : decisionType ===
                                  'APPROVE'
                                ? 'Approve'
                                : 'Reject'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

