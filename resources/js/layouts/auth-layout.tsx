import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTelegramAuth } from '@/hooks/use-telegram-auth';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    children,
    title,
    description,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    const { auth } = usePage().props;
    const { connect, isInTelegram, status } = useTelegramAuth();

    useEffect(() => {
        if (isInTelegram && !auth.user && status === 'idle') {
            connect();
        }
    }, [auth.user, connect, isInTelegram, status]);

    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}