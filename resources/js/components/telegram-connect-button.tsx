import { usePage } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useTelegramAuth } from '@/hooks/use-telegram-auth';
import { cn } from '@/lib/utils';

export function TelegramIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={cn('size-5', className)}
            aria-hidden="true"
        >
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
    );
}

const TELEGRAM_START_PARAM = 'afroequb';

export function TelegramConnectButton({
    className,
    wrapperClassName,
    children,
    ...props
}: {
    className?: string;
    wrapperClassName?: string;
    children?: React.ReactNode;
} & Omit<ComponentProps<'button'>, 'className' | 'children'>) {
    const { isInTelegram, isAuthenticating, connect, status, error } =
        useTelegramAuth();
    const page = usePage();
    const botUsername = (page.props as { telegram?: { botUsername?: string } })
        .telegram?.botUsername;

    const deepLink = `https://t.me/${encodeURIComponent(botUsername ?? 'AfroEqubBot')}?startapp=${TELEGRAM_START_PARAM}`;

    return (
        <div className={cn('flex flex-col gap-2', wrapperClassName ?? 'w-full')}>
            {isInTelegram ? (
                <button
                    type="button"
                    onClick={connect}
                    disabled={isAuthenticating}
                    className={cn(
                        'group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-sky-500/25 transition-all hover:-translate-y-0.5 hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70',
                        className,
                    )}
                    {...props}
                >
                    {isAuthenticating ? <Spinner /> : <TelegramIcon />}
                    {children ??
                        (isAuthenticating
                            ? 'Connecting to Telegram...'
                            : status === 'error'
                              ? 'Try again'
                              : 'Continue with Telegram')}
                </button>
            ) : (
                <a
                    href={deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        'group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-sky-500/25 transition-all hover:-translate-y-0.5 hover:bg-sky-600',
                        className,
                    )}
                >
                    <TelegramIcon />
                    {children ?? 'Open in Telegram'}
                </a>
            )}

            {isInTelegram && status === 'error' && error && (
                <p className="text-center text-xs font-medium text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}