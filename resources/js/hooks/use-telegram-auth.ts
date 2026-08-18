import { router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { auth, phone } from '@/routes/telegram';
import type { TelegramRequestContactResult } from '@/types/telegram';

export type TelegramAuthStatus = 'idle' | 'connecting' | 'connected' | 'error';

export type TelegramPhoneStatus =
    | 'idle'
    | 'requesting'
    | 'shared'
    | 'cancelled'
    | 'error';

export function useTelegramAuth() {
    const { auth: authProps } = usePage().props;
    const [status, setStatus] = useState<TelegramAuthStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [phoneStatus, setPhoneStatus] = useState<TelegramPhoneStatus>('idle');
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const connectingRef = useRef(false);
    const requestingPhoneRef = useRef(false);

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

    const requestPhone = useCallback(() => {
        if (
            !isInTelegram ||
            !authProps.user ||
            requestingPhoneRef.current ||
            phoneStatus === 'requesting'
        ) {
            return;
        }

        const requestContact = window.Telegram?.WebApp?.requestContact;

        if (!requestContact) {
            setPhoneStatus('error');
            setPhoneError('Phone sharing is not available in this Telegram client.');

            return;
        }

        requestingPhoneRef.current = true;
        setPhoneStatus('requesting');
        setPhoneError(null);

        requestContact((shared, info?: TelegramRequestContactResult) => {
            if (!shared || info?.status !== 'sent') {
                requestingPhoneRef.current = false;
                setPhoneStatus('cancelled');

                return;
            }

            router.post(
                phone().url,
                { init_data: info.response },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        requestingPhoneRef.current = false;
                        setPhoneStatus('shared');
                    },
                    onError: (errors) => {
                        requestingPhoneRef.current = false;
                        setPhoneStatus('error');
                        setPhoneError(
                            (errors as { phone?: string }).phone ??
                                (errors as { init_data?: string }).init_data ??
                                'Could not save your phone number. Please try again.',
                        );
                    },
                },
            );
        });
    }, [authProps.user, isInTelegram, phoneStatus]);

    return {
        status,
        error,
        phoneStatus,
        phoneError,
        isInTelegram,
        isAuthenticating: status === 'connecting',
        connect,
        requestPhone,
    };
}