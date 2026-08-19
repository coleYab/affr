import { Head } from '@inertiajs/react';
import { TelegramConnectButton } from '@/components/telegram-connect-button';
import { TRANSLATIONS } from '@/constants';
import { useLanguage } from '@/hooks/use-language';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const { language } = useLanguage();
    const t = TRANSLATIONS[language].login;

    return (
        <AuthLayout
            title={t.auth_layout_title_register}
            description={t.auth_layout_description_register}
        >
            <Head title={t.head_register} />

            <TelegramConnectButton className="py-3.5" />
        </AuthLayout>
    );
}