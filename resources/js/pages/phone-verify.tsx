import { Form, Head, usePage } from '@inertiajs/react';
import { ShieldCheck, Smartphone } from 'lucide-react';
import PhoneVerificationController from '@/actions/App/Http/Controllers/PhoneVerificationController';
import AppLogo from '@/components/app-logo';
import InputError from '@/components/input-error';
import { TelegramPhoneRequest } from '@/components/telegram-phone-request';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTelegramAuth } from '@/hooks/use-telegram-auth';

export default function PhoneVerify() {
    const { auth } = usePage().props;
    const { isInTelegram, phoneStatus } = useTelegramAuth();

    const alreadyVerified = Boolean(auth.user?.phoneNumber);

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-b from-sky-50 via-white to-white p-6 md:p-10">
            <Head title="Verify phone number" />
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <AppLogo />

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-extrabold tracking-tight text-navy">
                                Verify your phone number
                            </h1>
                            <p className="text-center text-sm text-stone-500">
                                You must attach a phone number to your account
                                before you can continue.
                            </p>
                        </div>
                    </div>

                    {alreadyVerified ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/25">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-bold text-emerald-800">
                                Your phone number is verified.
                            </p>
                            <p className="mt-1 text-xs text-emerald-700">
                                You can now use the app.
                            </p>
                        </div>
                    ) : isInTelegram && phoneStatus !== 'error' ? (
                        <TelegramPhoneRequest size="lg" />
                    ) : (
                        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
                            <Form
                                {...PhoneVerificationController.store.form()}
                                className="space-y-4"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <div className="flex items-center gap-2">
                                                <Smartphone className="h-4 w-4 text-royal" />
                                                <Label htmlFor="phoneNumber">
                                                    Phone number
                                                </Label>
                                            </div>
                                            <Input
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                type="tel"
                                                placeholder="+251912345678"
                                                required
                                                autoFocus
                                            />
                                            <InputError
                                                message={errors.phoneNumber}
                                            />
                                        </div>

                                        <Button
                                            className="w-full"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? 'Saving...'
                                                : 'Save and continue'}
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </div>
                    )}

                    {isInTelegram ? (
                        <p className="text-center text-xs text-stone-400">
                            Your number is shared privately with this app only.
                        </p>
                    ) : (
                        <p className="text-center text-xs text-stone-400">
                            Tip: open this app from Telegram to share your
                            number with one tap.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}