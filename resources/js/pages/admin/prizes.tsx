import { Head, router, usePage } from '@inertiajs/react';
import {
    PartyPopper,
    Video,
    Eye,
    CheckCircle,
    Star,
    Plus,
    Trophy,
    Trash2,
    X,
} from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { ADMIN_TRANSLATIONS } from '@/constants';
import { useLanguage } from '@/hooks/use-language';
import AppLayout from '@/layouts/app-layout';
import { settings as appSettings } from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';
import type { AppSettings, Winner } from '@/types/app';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: appSettings().url,
    },
];

export default function Settings() {
    const { settings } = usePage().props;
    const DEFAULT_SETTINGS = settings as AppSettings;
    console.log(DEFAULT_SETTINGS);
    const { language } = useLanguage();
    const t = ADMIN_TRANSLATIONS[language];

    const demoTickets = useMemo(() => {
        return [
            {
                userId: 12,
                userName: 'Dawit Mekonnen',
                ticketNumber: 4512,
                cycle: 18,
                prizeName: 'iPhone 17 Pro',
            },
            {
                userId: 33,
                userName: 'Sara Tesfaye',
                ticketNumber: 8731,
                cycle: 18,
                prizeName: 'iPhone 17 Pro',
            },
            {
                userId: 51,
                userName: 'Solomon Ayele',
                ticketNumber: 2204,
                cycle: 17,
                prizeName: 'iPhone 17 Pro',
            },
        ];
    }, []);

    const [winnerAnnouncementMode, setWinnerAnnouncementMode] = useState(
        DEFAULT_SETTINGS.winnerAnnouncementMode,
    );
    const [recentWinners, setRecentWinners] = useState<Winner[]>(
        DEFAULT_SETTINGS.recentWinners || [],
    );

    const currentWinner = DEFAULT_SETTINGS.currentWinner;

    const [drawTicketSearch, setDrawTicketSearch] = useState('');
    const [ticketSearchError, setTicketSearchError] = useState<string | null>(null);
    const [foundWinningTicket, setFoundWinningTicket] = useState<(typeof demoTickets)[number] | null>(null);
    const [newPastWinner, setNewPastWinner] = useState<Partial<Winner>>({});
    const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
    const [editingWinnerId, setEditingWinnerId] = useState<Winner['id'] | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<Winner['id'] | null>(null);
    const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
    const [broadcastPlace, setBroadcastPlace] = useState<1 | 2 | 3>(1);

    const handleSearchWinningTicket = () => {
        const normalized = drawTicketSearch.trim();

        if (!normalized) {
            setTicketSearchError('Enter a ticket number.');
            setFoundWinningTicket(null);
            return;
        }

        const ticketNumber = Number(normalized);
        if (!Number.isFinite(ticketNumber)) {
            setTicketSearchError('Ticket must be a number.');
            setFoundWinningTicket(null);
            return;
        }

        const match = demoTickets.find((ticket) => ticket.ticketNumber === ticketNumber);

        if (!match) {
            setTicketSearchError('No matching ticket found in demo data.');
            setFoundWinningTicket(null);
            return;
        }

        setTicketSearchError(null);
        setFoundWinningTicket(match);
    };

    const handleBroadcastWinner = () => {
        if (!foundWinningTicket) {
            return;
        }

        setIsBroadcastModalOpen(true);
    };

    const applyBroadcastWinner = async () => {
        if (!foundWinningTicket) {
            return;
        }

        const token =
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') ?? '';

        const res = await fetch('/admin/winners/announce', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(token ? { 'X-CSRF-TOKEN': token } : {}),
            },
            body: JSON.stringify({
                ticketNumber: foundWinningTicket.ticketNumber,
                place: broadcastPlace,
            }),
        });

        if (!res.ok) {
            const payload = (await res.json().catch(() => null)) as
                | { message?: string }
                | null;
            setTicketSearchError(payload?.message ?? 'Failed to announce winner.');
            return;
        }

        setIsBroadcastModalOpen(false);
        setFoundWinningTicket(null);
        setDrawTicketSearch('');

        router.reload({ only: ['settings'] });
    };

    const handleSavePastWinner = async (e: FormEvent) => {
        e.preventDefault();
        if (!newPastWinner.name || !newPastWinner.prize) return;

        setRecentWinners((prev) => {
            const maxId = prev.reduce((acc, winner) => {
                const current = typeof winner.id === 'number' ? winner.id : Number(winner.id);
                return Number.isFinite(current) ? Math.max(acc, current) : acc;
            }, 0);

            const winnerPayload: Winner = {
                id: editingWinnerId ?? maxId + 1,
                name: String(newPastWinner.name ?? ''),
                nameAm: String(newPastWinner.nameAm ?? ''),
                prize: String(newPastWinner.prize ?? ''),
                prizeAm: String(newPastWinner.prizeAm ?? ''),
                cycle: String(newPastWinner.cycle ?? ''),
                cycleAm: String(newPastWinner.cycleAm ?? ''),
                location: String(newPastWinner.location ?? ''),
                locationAm: String(newPastWinner.locationAm ?? ''),
            };

            if (editingWinnerId) {
                return prev.map((winner) =>
                    winner.id === editingWinnerId ? winnerPayload : winner,
                );
            }

            return [winnerPayload, ...prev];
        });

        setIsWinnerModalOpen(false);
        setNewPastWinner({});
        setEditingWinnerId(null);
    };

    const handleDeletePastWinner = (id: number | string) => {
        setConfirmDeleteId(id);
    };

    const toggleWinnerAnnouncementMode = () => {
        setWinnerAnnouncementMode((prev) => !prev);
    };

    const startAddPastWinner = () => {
        setEditingWinnerId(null);
        setNewPastWinner({});
        setIsWinnerModalOpen(true);
    };

    const startEditPastWinner = (winner: Winner) => {
        setEditingWinnerId(winner.id);
        setNewPastWinner(winner);
        setIsWinnerModalOpen(true);
    };

    const applyDeletePastWinner = () => {
        if (confirmDeleteId === null) {
            return;
        }

        setRecentWinners((prev) => prev.filter((winner) => winner.id !== confirmDeleteId));
        setConfirmDeleteId(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Settings" />
            {/* Added overflow-x-hidden to prevent full page drift */}
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden rounded-xl p-2 sm:p-4">
                <div className="animate-fade-in-up mx-auto w-full max-w-5xl space-y-4 sm:space-y-8">
                    <h1 className="text-lg font-bold text-stone-800 sm:text-2xl">
                        {t.prizes.title}
                    </h1>

                    {/* HERO CARD: Reduced padding (p-3) and adjusted icon size */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-stone-900 to-stone-800 p-3 text-white shadow-xl sm:rounded-2xl sm:p-8">
                        {/* Background Icon: Smaller and tucked away on mobile */}
                        <div className="absolute -top-4 -right-4 p-4 opacity-10 sm:top-0 sm:right-0 sm:p-8">
                            <PartyPopper className="h-32 w-32 sm:h-64 sm:w-64" />
                        </div>
                        
                        <div className="relative z-10">
                            <h2 className="mb-2 flex items-center text-lg font-bold sm:mb-4 sm:text-2xl">
                                <Video className="mr-2 h-5 w-5 animate-pulse text-red-500 sm:mr-3 sm:h-6 sm:w-6" />{' '}
                                {t.prizes.liveAnnouncer}
                            </h2>
                            <p className="mb-4 max-w-2xl text-xs text-stone-400 sm:mb-8 sm:text-base">
                                {t.prizes.liveDesc}
                            </p>

                            <div className="max-w-xl rounded-lg border border-white/10 bg-white/10 p-3 backdrop-blur-md sm:rounded-xl sm:p-6">
                                {/* Mode Toggle */}
                                <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4 sm:mb-6 sm:pb-6">
                                    <div className="pr-2">
                                        <h3 className="flex items-center text-sm font-bold text-white sm:text-base">
                                            <Eye className="mr-2 h-4 w-4 shrink-0" />{' '}
                                            <span className="whitespace-normal">Display Winner</span>
                                        </h3>
                                        <p className="mt-1 text-[10px] leading-tight text-stone-400 sm:text-xs">
                                            Replaces prize cards with winner.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={toggleWinnerAnnouncementMode}
                                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors sm:w-12 ${winnerAnnouncementMode ? 'bg-royal' : 'bg-stone-600'}`}
                                    >
                                        <span
                                            className={`absolute top-1 left-1 block h-4 w-4 rounded-full bg-white transition-transform ${winnerAnnouncementMode ? 'translate-x-5 sm:translate-x-6' : ''}`}
                                        />
                                    </button>
                                </div>

                                <label className="mb-2 block text-xs font-bold text-stone-300 sm:text-sm">
                                    {t.prizes.winTicket}
                                </label>
                                <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:gap-4">
                                    <input
                                        type="number"
                                        value={drawTicketSearch}
                                        onChange={(e) => {
                                            setDrawTicketSearch(e.target.value);
                                            if (ticketSearchError) {
                                                setTicketSearchError(null);
                                            }
                                        }}
                                        placeholder="Ticket #"
                                        className="flex-1 rounded-lg border border-stone-600 bg-stone-900 px-3 py-2 font-mono text-base text-white outline-none focus:ring-2 focus:ring-royal sm:px-4 sm:py-3 sm:text-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSearchWinningTicket}
                                        className="rounded-lg bg-stone-700 px-4 py-2 text-sm font-bold transition-colors hover:bg-stone-600 active:bg-stone-800 sm:px-6 sm:py-3 sm:text-base"
                                    >
                                        {t.prizes.verify}
                                    </button>
                                </div>

                                {ticketSearchError && (
                                    <div className="mb-4 rounded-lg border border-red-500/30 bg-royal/30 p-3 text-xs text-red-100 sm:mb-6 sm:p-4 sm:text-sm">
                                        {ticketSearchError}
                                    </div>
                                )}

                                {foundWinningTicket && (
                                    <div className="animate-fade-in-down mb-4 rounded-lg border border-royal/50 bg-navy/50 p-3 sm:mb-6 sm:p-4">
                                        <div className="mb-2 flex items-center">
                                            <CheckCircle className="mr-2 h-4 w-4 text-royal sm:h-5 sm:w-5" />
                                            <span className="text-[10px] font-bold text-blue-200 uppercase sm:text-xs">
                                                Valid Ticket Found
                                            </span>
                                        </div>
                                        <h3 className="mb-1 text-lg font-bold text-white sm:text-xl">
                                            {foundWinningTicket.userName}
                                        </h3>
                                        <p className="text-xs text-stone-300 sm:text-sm">
                                            Ticket #
                                            {foundWinningTicket.ticketNumber} •
                                            Cycle {foundWinningTicket.cycle}
                                        </p>
                                    </div>
                                )}

                                {winnerAnnouncementMode && currentWinner && (
                                    <div className="animate-fade-in-down mb-4 rounded-lg border border-royal/30 bg-navy/30 p-3 sm:mb-6 sm:p-4">
                                        <div className="mb-2 flex items-center">
                                            <Trophy className="mr-2 h-4 w-4 text-blue-300 sm:h-5 sm:w-5" />
                                            <span className="text-[10px] font-bold text-blue-100 uppercase sm:text-xs">
                                                Live Winner Display
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold text-white sm:text-base">
                                            {currentWinner.userName}
                                        </p>
                                        <p className="text-xs text-stone-200 sm:text-sm">
                                            Ticket #{currentWinner.ticketNumber} • {currentWinner.prizeName}
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleBroadcastWinner}
                                    disabled={!foundWinningTicket}
                                    className="flex w-full transform items-center justify-center rounded-lg bg-gradient-to-r from-royal to-royal py-3 text-sm font-bold text-stone-900 shadow-lg transition-all hover:from-royal hover:to-royal active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl sm:py-4 sm:text-lg"
                                >
                                    <PartyPopper className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />{' '}
                                    {t.prizes.announce}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Hall of Fame */}
                    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
                        <div className="mb-4 flex flex-col justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="flex items-center text-base font-bold text-stone-800 sm:text-lg">
                                    <Star className="mr-2 h-4 w-4 text-royal sm:h-5 sm:w-5" />{' '}
                                    {t.prizes.hallOfFame}
                                </h2>
                                <p className="text-xs text-stone-500 sm:text-sm">
                                    {t.prizes.hallDesc}
                                </p>
                            </div>
                            <button
                                onClick={startAddPastWinner}
                                className="flex w-full items-center justify-center rounded-lg bg-stone-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-stone-700 sm:w-auto sm:py-2 sm:text-sm"
                            >
                                <Plus className="mr-2 h-4 w-4" />{' '}
                                {t.prizes.addWinner}
                            </button>
                        </div>

                        {/* TABLE: Hidden columns on mobile to fix overflow */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-stone-50 text-xs text-stone-500 uppercase">
                                    <tr>
                                        <th className="px-3 py-2 sm:px-6 sm:py-3">
                                            Name
                                        </th>
                                        <th className="px-3 py-2 sm:px-6 sm:py-3">
                                            Prize
                                        </th>
                                        {/* Hidden on mobile */}
                                        <th className="hidden px-6 py-3 sm:table-cell">
                                            Cycle
                                        </th>
                                        {/* Hidden on mobile */}
                                        <th className="hidden px-6 py-3 sm:table-cell">
                                            Location
                                        </th>
                                        <th className="px-3 py-2 text-right sm:px-6 sm:py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {recentWinners.map((winner) => (
                                        <tr
                                            key={winner.id}
                                            className="hover:bg-stone-50"
                                        >
                                            <td className="px-3 py-3 sm:px-6 sm:py-4">
                                                <p className="text-sm font-bold text-stone-800 sm:text-base">
                                                    {winner.name}
                                                </p>
                                                <p className="text-[10px] text-stone-400 sm:text-xs">
                                                    {winner.nameAm}
                                                </p>
                                            </td>
                                            <td className="px-3 py-3 sm:px-6 sm:py-4">
                                                <span className="flex items-center text-xs font-bold text-navy sm:text-sm">
                                                    <Trophy className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />{' '}
                                                    {winner.prize}
                                                </span>
                                            </td>
                                            {/* Hidden on mobile */}
                                            <td className="hidden px-6 py-4 sm:table-cell">
                                                <span className="rounded bg-stone-100 px-2 py-1 text-xs font-bold text-stone-600">
                                                    {winner.cycle}
                                                </span>
                                            </td>
                                            {/* Hidden on mobile */}
                                            <td className="hidden px-6 py-4 text-sm text-stone-500 sm:table-cell">
                                                {winner.location}
                                            </td>
                                            <td className="px-3 py-3 text-right sm:px-6 sm:py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => startEditPastWinner(winner)}
                                                        className="rounded-md border border-stone-200 bg-white px-2 py-1 text-[11px] font-bold text-stone-700 shadow-sm hover:bg-stone-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeletePastWinner(
                                                                winner.id,
                                                            )
                                                        }
                                                        className="p-1 text-stone-400 transition-colors hover:text-red-500 sm:p-2"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentWinners.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="py-8 text-center text-sm text-stone-400"
                                            >
                                                No history found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Winner Modal */}
                    {isWinnerModalOpen && (
                        <div
                            className="animate-fade-in-down fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
                            onClick={() => setIsWinnerModalOpen(false)}
                        >
                            <div
                                className="w-full max-w-lg overflow-hidden rounded-t-xl bg-white shadow-2xl sm:rounded-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between border-b border-stone-100 bg-blue-50 p-4 sm:p-5">
                                    <h3 className="flex items-center text-lg font-bold text-navy">
                                        <Trophy className="mr-2 h-5 w-5" />{' '}
                                        {t.prizes.addWinner}
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setIsWinnerModalOpen(false)
                                        }
                                        className="text-stone-400 hover:text-stone-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <form
                                    onSubmit={handleSavePastWinner}
                                    className="max-h-[80vh] space-y-4 overflow-y-auto p-4 pb-8 sm:max-h-none sm:p-6 sm:pb-6"
                                >
                                    <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                                        <div className="col-span-1">
                                            <label className="mb-1 block text-xs font-bold text-stone-700 sm:text-sm">
                                                Name (En)
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={newPastWinner.name || ''}
                                                onChange={(e) =>
                                                    setNewPastWinner({
                                                        ...newPastWinner,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-royal focus:ring-royal sm:px-4"
                                                placeholder="e.g. Dawit M."
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="mb-1 block text-xs font-bold text-stone-700 sm:text-sm">
                                                Name (Am)
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    newPastWinner.nameAm || ''
                                                }
                                                onChange={(e) =>
                                                    setNewPastWinner({
                                                        ...newPastWinner,
                                                        nameAm: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-royal focus:ring-royal sm:px-4"
                                                placeholder="e.g. ዳዊት መ."
                                            />
                                        </div>

                                        <div className="col-span-1">
                                            <label className="mb-1 block text-xs font-bold text-stone-700 sm:text-sm">
                                                Prize (En)
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={
                                                    newPastWinner.prize || ''
                                                }
                                                onChange={(e) =>
                                                    setNewPastWinner({
                                                        ...newPastWinner,
                                                        prize: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-royal focus:ring-royal sm:px-4"
                                                placeholder="iPhone 17 Pro"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="mb-1 block text-xs font-bold text-stone-700 sm:text-sm">
                                                Prize (Am)
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    newPastWinner.prizeAm || ''
                                                }
                                                onChange={(e) =>
                                                    setNewPastWinner({
                                                        ...newPastWinner,
                                                        prizeAm: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-royal focus:ring-royal sm:px-4"
                                                placeholder="ቶዮታ ቪትዝ"
                                            />
                                        </div>

                                        <div className="col-span-1">
                                            <label className="mb-1 block text-xs font-bold text-stone-700 sm:text-sm">
                                                Cycle (En)
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={
                                                    newPastWinner.cycle || ''
                                                }
                                                onChange={(e) =>
                                                    setNewPastWinner({
                                                        ...newPastWinner,
                                                        cycle: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-royal focus:ring-royal sm:px-4"
                                                placeholder="Jan 2024"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="mb-1 block text-xs font-bold text-stone-700 sm:text-sm">
                                                Cycle (Am)
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    newPastWinner.cycleAm || ''
                                                }
                                                onChange={(e) =>
                                                    setNewPastWinner({
                                                        ...newPastWinner,
                                                        cycleAm: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-royal focus:ring-royal sm:px-4"
                                                placeholder="ጥር 2016"
                                            />
                                        </div>

                                        <div className="col-span-1">
                                            <label className="mb-1 block text-xs font-bold text-stone-700 sm:text-sm">
                                                Location (En)
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    newPastWinner.location || ''
                                                }
                                                onChange={(e) =>
                                                    setNewPastWinner({
                                                        ...newPastWinner,
                                                        location:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-royal focus:ring-royal sm:px-4"
                                                placeholder="Addis Ababa"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="mb-1 block text-xs font-bold text-stone-700 sm:text-sm">
                                                Location (Am)
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    newPastWinner.locationAm ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setNewPastWinner({
                                                        ...newPastWinner,
                                                        locationAm:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-royal focus:ring-royal sm:px-4"
                                                placeholder="አዲስ አበባ"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full rounded-lg bg-navy py-3 text-sm font-bold text-white shadow hover:bg-navy sm:py-2 sm:text-base"
                                    >
                                        {editingWinnerId ? 'Update Winner' : 'Save Winner'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {confirmDeleteId !== null && (
                        <div
                            className="animate-fade-in-down fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
                            onClick={() => setConfirmDeleteId(null)}
                        >
                            <div
                                className="w-full max-w-lg overflow-hidden rounded-t-xl bg-white shadow-2xl sm:rounded-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between border-b border-stone-100 bg-red-50 p-4 sm:p-5">
                                    <h3 className="flex items-center text-lg font-bold text-red-800">
                                        <Trash2 className="mr-2 h-5 w-5" /> Delete winner
                                    </h3>
                                    <button
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="text-stone-400 hover:text-stone-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="space-y-4 p-4 sm:p-6">
                                    <p className="text-sm text-stone-700">
                                        This will remove the winner from the Hall of Fame demo list.
                                    </p>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                        <button
                                            onClick={() => setConfirmDeleteId(null)}
                                            className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={applyDeletePastWinner}
                                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-blue-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isBroadcastModalOpen && foundWinningTicket && (
                        <div
                            className="animate-fade-in-down fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
                            onClick={() => setIsBroadcastModalOpen(false)}
                        >
                            <div
                                className="w-full max-w-lg overflow-hidden rounded-t-xl bg-white shadow-2xl sm:rounded-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between border-b border-stone-100 bg-blue-50 p-4 sm:p-5">
                                    <h3 className="flex items-center text-lg font-bold text-navy">
                                        <PartyPopper className="mr-2 h-5 w-5" /> Announce winner
                                    </h3>
                                    <button
                                        onClick={() => setIsBroadcastModalOpen(false)}
                                        className="text-stone-400 hover:text-stone-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="space-y-4 p-4 sm:p-6">
                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                        <p className="text-sm font-bold text-stone-900">
                                            {foundWinningTicket.userName}
                                        </p>
                                        <p className="text-sm text-stone-700">
                                            Ticket #{foundWinningTicket.ticketNumber} • Cycle {foundWinningTicket.cycle}
                                        </p>
                                        <p className="text-sm text-stone-700">
                                            Prize: {foundWinningTicket.prizeName}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-bold tracking-wider text-stone-600 uppercase">
                                            Winner place
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setBroadcastPlace(1)}
                                                className={`rounded-lg px-3 py-2 text-sm font-bold shadow ${broadcastPlace === 1 ? 'bg-navy text-white' : 'bg-white text-stone-700'}`}
                                            >
                                                1st
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setBroadcastPlace(2)}
                                                className={`rounded-lg px-3 py-2 text-sm font-bold shadow ${broadcastPlace === 2 ? 'bg-navy text-white' : 'bg-white text-stone-700'}`}
                                            >
                                                2nd
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setBroadcastPlace(3)}
                                                className={`rounded-lg px-3 py-2 text-sm font-bold shadow ${broadcastPlace === 3 ? 'bg-navy text-white' : 'bg-white text-stone-700'}`}
                                            >
                                                3rd
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                        <button
                                            onClick={() => setIsBroadcastModalOpen(false)}
                                            className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={applyBroadcastWinner}
                                            className="rounded-lg bg-royal px-4 py-2 text-sm font-bold text-stone-900 shadow hover:bg-royal"
                                        >
                                            Confirm broadcast
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}