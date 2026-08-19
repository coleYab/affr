import { Head } from '@inertiajs/react';
import { TelegramConnectButton } from '@/components/telegram-connect-button';
import { TRANSLATIONS } from '@/constants';
import { useLanguage } from '@/hooks/use-language';
import AuthLayout from '@/layouts/auth-layout';

type Props = {
    status?: string;
};

export default function Login({ status }: Props) {
    const { language } = useLanguage();
    const t = TRANSLATIONS[language].login;

    return (
        <AuthLayout
            title={t.auth_layout_title_login}
            description={t.auth_layout_description_login}
        >
            <Head title={t.head_login} />

            <TelegramConnectButton className="py-3.5" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}