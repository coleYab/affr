import { router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { auth } from '@/routes/telegram';

export type TelegramAuthStatus = 'idle' | 'connecting' | 'connected' | 'error';

export function useTelegramAuth() {
    const { auth: authProps } = usePage().props;
    const [status, setStatus] = useState<TelegramAuthStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const connectingRef = useRef(false);

    const isInTelegram =
        typeof window !== 'undefined' &&
        Boolean(window.Telegram?.WebApp?.initData);

    useEffect(() => {
        if (!isInTelegram) {
            return;
        }

        const webApp = window.Telegram?.WebApp;

        if (!webApp) {
            return;
        }

        webApp.ready();
        webApp.expand();
        webApp.disableVerticalSwipes?.();
    }, [isInTelegram]);

    const connect = useCallback(() => {
        if (
            !isInTelegram ||
            authProps.user ||
            connectingRef.current ||
            status === 'connecting'
        ) {
            return;
        }

        const initData = window.Telegram?.WebApp?.initData;

        if (!initData) {
            setStatus('error');
            setError('Telegram authentication data is unavailable.');

            return;
        }

        connectingRef.current = true;
        setStatus('connecting');
        setError(null);

        router.post(
            auth().url,
            { init_data: initData },
            {
                preserveScroll: true,
                onSuccess: () => {
                    connectingRef.current = false;
                    setStatus('connected');
                },
                onError: (errors) => {
                    connectingRef.current = false;
                    setStatus('error');
                    setError(
                        (errors as { init_data?: string }).init_data ??
                            'Telegram authentication failed. Please try again.',
                    );
                },
            },
        );
    }, [authProps.user, isInTelegram, status]);

    return {
        status,
        error,
        isInTelegram,
        isAuthenticating: status === 'connecting',
        connect,
    };
}