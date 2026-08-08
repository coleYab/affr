import { Trophy, Car } from 'lucide-react';

export default function WinnerCelebrationModal({
    isOpen,
    onClose,
    ticketNumber,
    prizeName,
    congratsLabel,
    descriptionLabel,
    ticketLabel,
    claimLabel,
}: {
    isOpen: boolean;
    onClose: () => void;
    ticketNumber: number;
    prizeName: string;
    congratsLabel: string;
    descriptionLabel: string;
    ticketLabel: string;
    claimLabel: string;
}) {
    if (!isOpen) {
        return null;
    }

    const rando = 0.4;

    return (
        <div className="animate-fade-in-up fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
            {Array.from({ length: 50 }).map((_, i) => (
                <div
                    key={i}
                    className="animate-pulse-slow absolute h-2 w-2 rounded-full"
                    style={{
                        left: `${rando * 100}%`,
                        top: `-10px`,
                        backgroundColor: ['#fcd34d', '#34d399', '#f87171', '#60a5fa'][
                            Math.floor(rando * 4)
                        ],
                        animation: `fall ${2 + rando * 3}s linear infinite`,
                        animationDelay: `${rando * 5}s`,
                    }}
                />
            ))}
            <style>{`
             @keyframes fall {
               to { transform: translateY(100vh) rotate(720deg); }
             }
           `}</style>

            <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border-4 border-royal/50 bg-gradient-to-br from-blue-50 to-white p-8 text-center shadow-2xl">
                <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                <div className="relative z-20">
                    <div className="mx-auto mb-6 flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-blue-100 shadow-inner ring-4 ring-blue-200">
                        <Trophy className="h-12 w-12 text-royal" />
                    </div>

                    <h2 className="mb-2 text-4xl font-black tracking-wide text-royal uppercase">
                        {congratsLabel}
                    </h2>
                    <p className="mb-8 text-lg text-stone-600">{descriptionLabel}</p>

                    <div className="mb-8 rotate-1 transform rounded-2xl border border-stone-100 bg-white p-6 shadow-lg transition-transform duration-300 hover:rotate-0">
                        <div className="mb-4 flex items-center justify-between border-b border-stone-100 pb-4">
                            <span className="text-xs font-bold text-stone-400 uppercase">
                                {ticketLabel}
                            </span>
                            <span className="text-2xl font-black text-royal">#{ticketNumber}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Car className="mb-2 h-12 w-12 text-stone-800" />
                            <h3 className="text-xl font-bold text-stone-800">{prizeName}</h3>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full transform rounded-xl bg-royal py-4 font-bold text-white shadow-xl shadow-blue-200 transition-all hover:scale-105 hover:bg-royal active:scale-95"
                    >
                        {claimLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
