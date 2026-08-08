import { ArrowRight, Check, Lock, Ticket, X } from 'lucide-react';

type TicketBoardItem = { number: number; taken: boolean };

export default function TicketSelectionModal({
    isOpen,
    tickets,
    selectedTicket,
    onSelectTicket,
    onClose,
    onConfirm,
    formatTicket,
    title,
    subtitle,
    instruction,
    myTicketLabel,
    confirmLabel,
}: {
    isOpen: boolean;
    tickets: TicketBoardItem[];
    selectedTicket: number | null;
    onSelectTicket: (ticketNumber: number) => void;
    onClose: () => void;
    onConfirm: () => void;
    formatTicket: (num: number) => string;
    title: string;
    subtitle: string;
    instruction: string;
    myTicketLabel: string;
    confirmLabel: string;
}) {
    if (!isOpen) {
        return null;
    }

    const availableCount = tickets.filter((ticket) => !ticket.taken).length;
    const takenCount = tickets.length - availableCount;

    return (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
            <div className="animate-fade-in-up w-full max-w-2xl border border-blue-100 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 border-b border-blue-100 bg-blue-50/60 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-royal text-white shadow-md shadow-royal/25">
                            <Ticket className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-navy">{title}</h3>
                            <p className="text-xs text-stone-500">{subtitle}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center border border-blue-100 bg-white text-stone-400 transition-colors hover:border-royal hover:text-royal"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Availability legend */}
                <div className="flex flex-wrap items-center gap-4 border-b border-blue-100 px-6 py-3 text-xs font-bold text-stone-500">
                    <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 border border-blue-200 bg-white" />
                        Available: {availableCount}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 bg-stone-200" />
                        Taken: {takenCount}
                    </span>
                    {selectedTicket !== null && (
                        <span className="ml-auto flex items-center gap-1.5 text-royal">
                            <span className="h-3 w-3 bg-royal" />
                            Selected: #{formatTicket(selectedTicket)}
                        </span>
                    )}
                </div>

                {/* Number grid */}
                <div className="max-h-80 overflow-y-auto px-6 py-5">
                    <p className="mb-3 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                        {instruction}
                    </p>
                    {tickets.length === 0 ? (
                        <div className="py-12 text-center text-sm text-stone-400">
                            No numbers available right now.
                        </div>
                    ) : (
                        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
                            {tickets.map((ticket) => {
                                const isSelected = selectedTicket === ticket.number;

                                return (
                                    <button
                                        key={ticket.number}
                                        type="button"
                                        disabled={ticket.taken}
                                        onClick={() => onSelectTicket(ticket.number)}
                                        aria-pressed={isSelected}
                                        className={`relative flex aspect-square items-center justify-center text-sm font-black transition-all ${
                                            ticket.taken
                                                ? 'cursor-not-allowed bg-stone-100 text-stone-300'
                                                : isSelected
                                                  ? 'bg-royal text-white shadow-md shadow-royal/30'
                                                  : 'border border-blue-100 bg-white text-navy hover:border-royal hover:bg-royal/5 hover:text-royal active:scale-95'
                                        }`}
                                    >
                                        {ticket.taken ? (
                                            <Lock className="h-3.5 w-3.5" />
                                        ) : (
                                            formatTicket(ticket.number)
                                        )}
                                        {isSelected && (
                                            <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center bg-white text-royal">
                                                <Check className="h-2.5 w-2.5" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 border-t border-blue-100 bg-blue-50/40 px-6 py-4">
                    <div>
                        <p className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                            {myTicketLabel}
                        </p>
                        <p className="text-2xl font-black text-navy">
                            {selectedTicket !== null
                                ? `#${formatTicket(selectedTicket)}`
                                : '—'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={selectedTicket === null}
                        className="flex items-center gap-2 bg-royal px-8 py-3 text-sm font-bold text-white shadow-md shadow-royal/25 transition-all hover:bg-navy active:scale-95 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none"
                    >
                        {confirmLabel}
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
