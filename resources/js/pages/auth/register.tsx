import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { TRANSLATIONS } from '@/constants';
import { useLanguage } from '@/hooks/use-language';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const { language } = useLanguage();
    const t = TRANSLATIONS[language].login;

    const [acceptedTerms, setAcceptedTerms] = useState(false);

    return (
        <AuthLayout
            title={t.auth_layout_title_register}
            description={t.auth_layout_description_register}
        >
            <Head title={t.head_register} />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t.label_name}</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder={t.placeholder_name}
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">{t.label_phone}</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    required
                                    tabIndex={2}
                                    autoComplete="tel"
                                    name="phoneNumber"
                                    placeholder={t.placeholder_phone}
                                />
                                <InputError message={errors.phoneNumber} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">{t.label_password}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder={t.placeholder_password}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">{t.label_confirm_password}</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder={t.placeholder_confirm_password}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="grid gap-2">
                                <input type="hidden" name="terms" value={acceptedTerms ? '1' : '0'} />
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="terms"
                                        checked={acceptedTerms}
                                        onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                                        tabIndex={5}
                                    />
                                    <Label htmlFor="terms" className="text-sm">
                                        {t.terms_agree}{' '}
                                        <TextLink href="/terms" tabIndex={-1}>
                                            {t.terms_link}
                                        </TextLink>
                                    </Label>
                                </div>
                                <InputError message={errors.terms} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={6}
                                data-test="register-user-button"
                                disabled={processing || !acceptedTerms}
                            >
                                {processing && <Spinner />}
                                {t.btn_register_action}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            {t.login_prompt}{' '}
                            <TextLink href={login()} tabIndex={7}>
                                {t.btn_login_action}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
