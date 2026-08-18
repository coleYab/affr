import { usePage } from '@inertiajs/react';
import { Phone } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useTelegramAuth } from '@/hooks/use-telegram-auth';
import { cn } from '@/lib/utils';

export function TelegramPhoneRequest({
    className,
    size = 'md',
}: {
    className?: string;
    size?: 'md' | 'lg';
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
                'animate-fade-in-down rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm',
                size === 'lg' && 'animate-fade-in-up p-8 sm:p-10',
                className,
            )}
        >
            <div
                className={cn(
                    'flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center',
                    size === 'lg' && 'flex-col items-center gap-6 text-center sm:flex-col sm:text-center',
                )}
            >
                <div
                    className={cn(
                        'flex items-start gap-3',
                        size === 'lg' && 'flex-col items-center',
                    )}
                >
                    <div
                        className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/25',
                            size === 'lg' && 'h-14 w-14 rounded-2xl',
                        )}
                    >
                        <Phone className={cn('h-5 w-5', size === 'lg' && 'h-7 w-7')} />
                    </div>
                    <div>
                        <h3
                            className={cn(
                                'text-sm font-bold text-navy sm:text-base',
                                size === 'lg' && 'text-lg font-extrabold sm:text-xl',
                            )}
                        >
                            Add your phone number
                        </h3>
                        <p
                            className={cn(
                                'mt-0.5 text-xs text-stone-600 sm:text-sm',
                                size === 'lg' && 'mx-auto mt-2 max-w-md text-sm sm:text-base',
                            )}
                        >
                            We need your phone number to verify your account and
                            send you Equb updates. It takes one tap.
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
                        size === 'lg' && 'px-8 py-4 text-base',
                    )}
                >
                    {isRequesting ? <Spinner /> : <Phone className="h-4 w-4" />}
                    {isRequesting ? 'Requesting...' : 'Share phone number'}
                </button>
            </div>
        </div>
    );
}