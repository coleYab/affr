import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    Plus,
    Search,
    Ticket,
    Trash2,
    UserX,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    usersStore,
    usersTicketsStore,
} from '@/actions/App/Http/Controllers/AppSettingsController';
import InputError from '@/components/input-error';
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
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ADMIN_TRANSLATIONS } from '@/constants';
import { useLanguage } from '@/hooks/use-language';
import AppLayout from '@/layouts/app-layout';
import { settings as appSettings } from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';
import type { AdminUser as User } from '@/types/app';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: appSettings().url,
    },
];

type UserRow = User & {
    banned: boolean;
};

interface PageProps {
    users: UserRow[];
    status?: string;
    [key: string]: unknown;
}

export default function Users({ users }: PageProps) {
    const { status } = usePage<PageProps>().props;
    const { language } = useLanguage();
    const t = ADMIN_TRANSLATIONS[language];

    const [tab, setTab] = useState<'ALL' | 'VERIFIED' | 'PENDING' | 'BANNED'>(
        'ALL',
    );
    const [searchTerm, setSearchTerm] = useState('');

    const [userDialogOpen, setUserDialogOpen] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
        transform,
    } = useForm({
        name: '',
        phone: '',
        status: 'PENDING' as UserRow['status'],
        joinedDate: new Date().toISOString().slice(0, 10),
        ticketNumbersInput: '',
        ticketNumbers: [] as number[],
    });

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmType, setConfirmType] = useState<'DELETE' | 'BAN' | 'UNBAN'>(
        'BAN',
    );
    const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

    const [ticketsDialogOpen, setTicketsDialogOpen] = useState(false);
    const [ticketsTargetUser, setTicketsTargetUser] = useState<UserRow | null>(
        null,
    );

    const ticketsForm = useForm({
        ticketNumbersInput: '',
        ticketNumbers: [] as number[],
    });

    const openAddTickets = (user: UserRow) => {
        ticketsForm.clearErrors();
        ticketsForm.reset();
        setTicketsTargetUser(user);
        setTicketsDialogOpen(true);
    };

    const parseTicketNumbers = (input: string): number[] =>
        String(input ?? '')
            .split(/[\s,]+/)
            .map((value) => value.trim())
            .filter(Boolean)
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value) && value > 0);

    const saveTickets = (e: React.FormEvent) => {
        e.preventDefault();

        if (!ticketsTargetUser) {
            return;
        }

        const ticketNumbers = parseTicketNumbers(
            ticketsForm.data.ticketNumbersInput,
        );

        if (ticketNumbers.length === 0) {
            return;
        }

        ticketsForm.transform((formData) => ({
            ...formData,
            ticketNumbers,
        }));

        ticketsForm.post(
            usersTicketsStore.url({ user: Number(ticketsTargetUser.id) }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setTicketsDialogOpen(false);
                    setTicketsTargetUser(null);
                },
                onFinish: () => {
                    ticketsForm.transform((formData) => formData);
                },
            },
        );
    };

    const filteredUsers = useMemo(() => {
        const normalized = searchTerm.trim().toLowerCase();

        return users
            .filter((u) => {
                if (tab === 'ALL') {
                    return true;
                }

                if (tab === 'BANNED') {
                    return u.banned;
                }

                return u.status === tab;
            })
            .filter((u) => {
                if (!normalized) {
                    return true;
                }

                return (
                    u.name.toLowerCase().includes(normalized) ||
                    u.phone.toLowerCase().includes(normalized) ||
                    String(u.id ?? '')
                        .toLowerCase()
                        .includes(normalized)
                );
            })
            .sort((a, b) => {
                const aDate = new Date(a.joinedDate ?? 0).getTime();
                const bDate = new Date(b.joinedDate ?? 0).getTime();
                return bDate - aDate;
            });
    }, [users, tab, searchTerm]);

    const stats = useMemo(() => {
        return {
            total: users.length,
            verified: users.filter((u) => u.status === 'VERIFIED' && !u.banned)
                .length,
            pending: users.filter((u) => u.status === 'PENDING' && !u.banned)
                .length,
            banned: users.filter((u) => u.banned).length,
        };
    }, [users]);

    const openAddUser = () => {
        clearErrors();
        reset();
        setData({
            name: '',
            phone: '',
            status: 'PENDING',
            joinedDate: new Date().toISOString().slice(0, 10),
        });
        setUserDialogOpen(true);
    };

    const saveUser = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.name || !data.phone) {
            return;
        }

        const ticketNumbers = String(data.ticketNumbersInput ?? '')
            .split(/[\s,]+/)
            .map((value) => value.trim())
            .filter(Boolean)
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value) && value > 0);

        transform((formData) => ({
            ...formData,
            ticketNumbers,
        }));

        post(usersStore.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setUserDialogOpen(false);
            },
            onFinish: () => {
                transform((formData) => formData);
            },
        });
    };

    const openConfirm = (type: 'DELETE' | 'BAN' | 'UNBAN', user: UserRow) => {
        setConfirmType(type);
        setSelectedUser(user);
        setConfirmOpen(true);
    };

    const applyConfirmAction = () => {
        if (!selectedUser) {
            return;
        }

        if (confirmType === 'DELETE') {
            router.delete(`/admin/users/${selectedUser.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setConfirmOpen(false);
                    setSelectedUser(null);
                },
            });
            return;
        }

        setConfirmOpen(false);
        setSelectedUser(null);
    };

    const statusBadge = (user: UserRow) => {
        if (user.banned) {
            return <Badge variant="destructive">BANNED</Badge>;
        }

        if (user.status === 'VERIFIED') {
            return <Badge className="bg-royal">VERIFIED</Badge>;
        }

        return <Badge variant="outline">PENDING</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="animate-fade-in-up space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-stone-800">
                                {t.users.title}
                            </h1>
                            {status ? (
                                <p className="text-sm text-royal">{status}</p>
                            ) : (
                                <p className="text-sm text-stone-500">
                                    Manage users and send them password setup
                                    emails.
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-3">
                            <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                                <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                    Total
                                </div>
                                <div className="mt-1 text-xl font-black text-stone-900">
                                    {stats.total}
                                </div>
                            </div>
                            <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                                <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                    Verified
                                </div>
                                <div className="mt-1 text-xl font-black text-stone-900">
                                    {stats.verified}
                                </div>
                            </div>
                            <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                                <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                    Pending
                                </div>
                                <div className="mt-1 text-xl font-black text-stone-900">
                                    {stats.pending}
                                </div>
                            </div>
                            <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                                <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                    Banned
                                </div>
                                <div className="mt-1 text-xl font-black text-stone-900">
                                    {stats.banned}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Tabs
                            value={tab}
                            onValueChange={(value) =>
                                setTab(value as typeof tab)
                            }
                            className="w-full space-y-3"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <TabsList className="h-11 w-full justify-start rounded-xl border border-stone-200 bg-white p-1 sm:w-auto">
                                    <TabsTrigger
                                        value="ALL"
                                        className="rounded-lg"
                                    >
                                        All
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="VERIFIED"
                                        className="rounded-lg"
                                    >
                                        {t.users.verified}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="PENDING"
                                        className="rounded-lg"
                                    >
                                        {t.users.verified}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="BANNED"
                                        className="rounded-lg"
                                    >
                                        Banned
                                    </TabsTrigger>
                                </TabsList>

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                                    <div className="relative w-full sm:w-80">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                                        <Input
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            placeholder={t.users.search}
                                            className="h-11 rounded-xl border-stone-200 bg-white pl-9"
                                        />
                                    </div>

                                    <Button
                                        className="h-11 rounded-xl"
                                        onClick={openAddUser}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t.users.addNew}
                                    </Button>
                                </div>
                            </div>

                            <TabsContent value={tab} className="space-y-4">
                                {filteredUsers.length === 0 ? (
                                    <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-sm">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-50">
                                            <Search className="h-7 w-7 text-stone-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-stone-900">
                                            No users found
                                        </h3>
                                        <p className="mt-2 text-sm text-stone-500">
                                            Try adjusting your search or
                                            filters.
                                        </p>
                                        <Button
                                            variant="secondary"
                                            className="mt-4 rounded-xl"
                                            onClick={() => setSearchTerm('')}
                                        >
                                            Clear search
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
                                            <Table>
                                                <TableHeader className="bg-stone-50">
                                                    <TableRow>
                                                        <TableHead className="px-4 py-3">
                                                            {t.dashboard.user}
                                                        </TableHead>
                                                        <TableHead className="px-4 py-3">
                                                            {t.users.phone}
                                                        </TableHead>
                                                        <TableHead className="px-4 py-3">
                                                            {t.users.status}
                                                        </TableHead>
                                                        <TableHead className="px-4 py-3">
                                                            {t.users.contrib}
                                                        </TableHead>
                                                        <TableHead className="px-4 py-3">
                                                            {t.users.ticket}
                                                        </TableHead>
                                                        <TableHead className="px-4 py-3 text-right">
                                                            {t.users.actions}
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredUsers.map(
                                                        (user) => (
                                                            <TableRow
                                                                key={String(
                                                                    user.id,
                                                                )}
                                                            >
                                                                <TableCell className="px-4 py-3">
                                                                    <div className="font-semibold text-stone-900">
                                                                        {
                                                                            user.name
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs text-stone-400">
                                                                        Joined:{' '}
                                                                        {user.joinedDate ??
                                                                            'N/A'}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 font-mono text-sm text-stone-600">
                                                                    {user.phone}
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3">
                                                                    <div className="flex items-center gap-2">
                                                                        {statusBadge(
                                                                            user,
                                                                        )}
                                                                        {!user.banned ? (
                                                                            user.status ===
                                                                            'VERIFIED' ? (
                                                                                <CheckCircle className="h-4 w-4 text-royal" />
                                                                            ) : (
                                                                                <Clock className="h-4 w-4 text-royal" />
                                                                            )
                                                                        ) : (
                                                                            <UserX className="h-4 w-4 text-red-500" />
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 font-bold text-stone-700">
                                                                    {user.contribution.toLocaleString()}{' '}
                                                                    ETB
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3">
                                                                    {user.prizeNumber?.toString() ? (
                                                                        <span className="inline-flex rounded-lg border border-stone-200 bg-stone-50 px-2 py-1 text-xs font-bold text-stone-700">
                                                                            #
                                                                            {user.prizeNumber
                                                                                .toString()
                                                                                .slice(
                                                                                    0,
                                                                                    10,
                                                                                )}{' '}
                                                                            {user.prizeNumber.toString()
                                                                                .length >=
                                                                            10
                                                                                ? '...'
                                                                                : ''}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-xs text-stone-400">
                                                                            -
                                                                        </span>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-right">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <Button
                                                                            variant="secondary"
                                                                            className="rounded-xl"
                                                                            onClick={() =>
                                                                                openAddTickets(
                                                                                    user,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Ticket className="mr-2 h-4 w-4" />
                                                                            Add
                                                                            Tickets
                                                                        </Button>

                                                                        <Button
                                                                            variant="destructive"
                                                                            className="rounded-xl"
                                                                            onClick={() =>
                                                                                openConfirm(
                                                                                    'DELETE',
                                                                                    user,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Delete
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )}
                                                </TableBody>
                                            </Table>

                                            <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50 px-6 py-3 text-xs font-medium text-stone-500">
                                                <span>
                                                    {t.users.showing}{' '}
                                                    {filteredUsers.length} users
                                                </span>
                                                <span>
                                                    {t.users.total}:{' '}
                                                    {users.length}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:hidden">
                                            {filteredUsers.map((user) => (
                                                <Card
                                                    key={String(user.id)}
                                                    className="overflow-hidden border-stone-200 shadow-sm"
                                                >
                                                    <CardHeader className="space-y-1 bg-stone-50/60">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <CardTitle className="text-base text-stone-900">
                                                                    {user.name}
                                                                </CardTitle>
                                                                <CardDescription className="text-xs">
                                                                    {user.phone}
                                                                </CardDescription>
                                                                <div className="mt-1 text-[11px] text-stone-400">
                                                                    Joined:{' '}
                                                                    {user.joinedDate ??
                                                                        'N/A'}
                                                                </div>
                                                            </div>
                                                            {statusBadge(user)}
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="space-y-3 p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                                                Contribution
                                                            </div>
                                                            <div className="text-sm font-black text-stone-900">
                                                                {user.contribution.toLocaleString()}{' '}
                                                                ETB
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                                                Ticket
                                                            </div>
                                                            <div className="text-sm font-black text-stone-900">
                                                                {user.prizeNumber
                                                                    ? `#${user.prizeNumber}`
                                                                    : '-'}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="flex flex-col gap-2 border-t bg-white p-4">
                                                        <Button
                                                            variant="secondary"
                                                            className="w-full rounded-xl"
                                                            onClick={() =>
                                                                openAddTickets(
                                                                    user,
                                                                )
                                                            }
                                                        >
                                                            <Ticket className="mr-2 h-4 w-4" />
                                                            Add Tickets
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            className="w-full rounded-xl"
                                                            onClick={() =>
                                                                openConfirm(
                                                                    'DELETE',
                                                                    user,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete user
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>

                    <Dialog
                        open={userDialogOpen}
                        onOpenChange={(open) =>
                            !open && setUserDialogOpen(false)
                        }
                    >
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>{t.users.addNew}</DialogTitle>
                                <DialogDescription>
                                    Create a new user.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={saveUser} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="user-name">
                                            Full name
                                        </Label>
                                        <Input
                                            id="user-name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="rounded-xl"
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="user-phone">
                                            {t.users.phone}
                                        </Label>
                                        <Input
                                            id="user-phone"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            className="rounded-xl"
                                            required
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="user-status">
                                            {t.users.status}
                                        </Label>
                                        <select
                                            id="user-status"
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    'status',
                                                    e.target
                                                        .value as UserRow['status'],
                                                )
                                            }
                                            className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm font-medium shadow-sm outline-none focus:border-royal focus:ring-4 focus:ring-royal/10"
                                        >
                                            <option value="PENDING">
                                                {t.users.pending}
                                            </option>
                                            <option value="VERIFIED">
                                                {t.users.verified}
                                            </option>
                                        </select>
                                        <InputError message={errors.status} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="user-joined">
                                            Joined date
                                        </Label>
                                        <Input
                                            id="user-joined"
                                            type="date"
                                            value={data.joinedDate}
                                            onChange={(e) =>
                                                setData(
                                                    'joinedDate',
                                                    e.target.value,
                                                )
                                            }
                                            className="rounded-xl"
                                        />
                                        <InputError
                                            message={errors.joinedDate}
                                        />
                                    </div>

                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="user-ticket-numbers">
                                            Ticket numbers
                                        </Label>
                                        <Textarea
                                            id="user-ticket-numbers"
                                            value={data.ticketNumbersInput}
                                            onChange={(e) =>
                                                setData(
                                                    'ticketNumbersInput',
                                                    e.target.value,
                                                )
                                            }
                                            className="rounded-xl"
                                            placeholder="e.g. 12, 45, 78 (comma or new line separated)"
                                        />
                                        <InputError
                                            message={errors.ticketNumbers}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="rounded-xl"
                                        onClick={() => setUserDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="rounded-xl bg-royal text-white hover:bg-royal"
                                    >
                                        {processing ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={ticketsDialogOpen}
                        onOpenChange={(open) =>
                            !open && setTicketsDialogOpen(false)
                        }
                    >
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add Tickets</DialogTitle>
                                <DialogDescription>
                                    {ticketsTargetUser
                                        ? `Assign ticket numbers to ${ticketsTargetUser.name} (${ticketsTargetUser.phone}).`
                                        : ''}
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={saveTickets} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="assign-ticket-numbers">
                                        Ticket numbers
                                    </Label>
                                    <Textarea
                                        id="assign-ticket-numbers"
                                        value={
                                            ticketsForm.data.ticketNumbersInput
                                        }
                                        onChange={(e) =>
                                            ticketsForm.setData(
                                                'ticketNumbersInput',
                                                e.target.value,
                                            )
                                        }
                                        className="rounded-xl"
                                        placeholder="e.g. 12, 45, 78 (comma or new line separated)"
                                        required
                                    />
                                    <InputError
                                        message={
                                            ticketsForm.errors.ticketNumbers
                                        }
                                    />
                                    <p className="text-xs text-stone-500">
                                        Tickets are assigned as SOLD to this
                                        user. Only AVAILABLE tickets can be
                                        added.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="rounded-xl"
                                        onClick={() =>
                                            setTicketsDialogOpen(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={ticketsForm.processing}
                                        className="rounded-xl bg-royal text-white hover:bg-royal"
                                    >
                                        {ticketsForm.processing
                                            ? 'Saving...'
                                            : 'Add Tickets'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={confirmOpen}
                        onOpenChange={(open) => !open && setConfirmOpen(false)}
                    >
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>
                                    {confirmType === 'DELETE'
                                        ? 'Delete user'
                                        : confirmType === 'BAN'
                                          ? 'Ban user'
                                          : 'Unban user'}
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedUser
                                        ? `${selectedUser.name} (${selectedUser.phone})`
                                        : ''}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
                                {confirmType === 'DELETE'
                                    ? 'This will remove the user from the database.'
                                    : confirmType === 'BAN'
                                      ? 'Banned users are marked as BANNED and can be filtered. (Demo only)'
                                      : 'This will remove the banned flag from the user. (Demo only)'}
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="rounded-xl"
                                    onClick={() => {
                                        setConfirmOpen(false);
                                        setSelectedUser(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    variant={
                                        confirmType === 'UNBAN'
                                            ? 'default'
                                            : 'destructive'
                                    }
                                    className={
                                        confirmType === 'UNBAN'
                                            ? 'rounded-xl'
                                            : 'rounded-xl'
                                    }
                                    onClick={applyConfirmAction}
                                    disabled={!selectedUser}
                                >
                                    {confirmType === 'DELETE'
                                        ? 'Delete'
                                        : confirmType === 'BAN'
                                          ? 'Ban'
                                          : 'Unban'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AppLayout>
    );
}
