import { usePage } from '@inertiajs/react';
import { Phone } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useTelegramAuth } from '@/hooks/use-telegram-auth';
import { cn } from '@/lib/utils';

export function TelegramPhoneRequest({
    className,
    compact = false,
}: {
    className?: string;
    compact?: boolean;
}) {
    const { auth } = usePage().props;
    const { isInTelegram, requestPhone, phoneStatus, phoneError } =
        useTelegramAuth();

    if (!isInTelegram || auth.user?.phoneNumber) {
        return null;
    }

    const isRequesting = phoneStatus === 'requesting';

    return (
        <div
            className={cn(
                'animate-fade-in-down mb-8 rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm',
                className,
            )}
        >
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/25">
                        <Phone className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-navy sm:text-base">
                            Add your phone number
                        </h3>
                        <p className="mt-0.5 text-xs text-stone-600 sm:text-sm">
                            We need your phone number to verify your account
                            and send you Equb updates. It takes one tap.
                        </p>
                        {phoneError && (
                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                {phoneError}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={requestPhone}
                    disabled={isRequesting}
                    className={cn(
                        'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:-translate-y-0.5 hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70',
                        compact && 'px-4 py-2 text-xs',
                    )}
                >
                    {isRequesting ? <Spinner /> : <Phone className="h-4 w-4" />}
                    {isRequesting ? 'Requesting...' : 'Share phone number'}
                </button>
            </div>
        </div>
    );
}