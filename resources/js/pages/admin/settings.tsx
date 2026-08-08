import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Bell,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Monitor,
    RefreshCw,
    Save,
    Settings2,
    Sparkles,
    Ticket,
    Trophy,
    Users,
    Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/hooks/use-language';
import AppLayout from '@/layouts/app-layout';
import { settings as appSettingsRoute } from '@/routes/admin';
import { update as updateSettings } from '@/routes/admin/settings';
import type { BreadcrumbItem } from '@/types';
import type { AppSettings } from '@/types/app';

interface PageProps {
    settings: AppSettings;
    status?: string;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: appSettingsRoute().url,
    },
];

const TRANSLATIONS = {
    en: {
        pageTitle: 'Settings',
        subtitle: 'Configure system settings and manage application behavior.',
        language: 'Language',
        unsavedChanges: 'You have unsaved changes',
        sections: {
            cycle: 'Cycle Configuration',
            prize: 'Prize Configuration',
            livestream: 'Livestream Settings',
            features: 'Feature Toggles',
        },
        fields: {
            cycle: 'Current Cycle',
            daysRemaining: 'Days Until Draw',
            drawDate: 'Draw Date',
            prizeName: 'Prize Name',
            prizeValue: 'Prize Value',
            prizeImage: 'Prize Image URL',
            liveStreamUrl: 'Livestream URL',
            isLive: 'Livestream Active',
            registrationEnabled: 'Registration Enabled',
            ticketSelectionEnabled: 'Ticket Selection Enabled',
            winnerAnnouncementMode: 'Winner Announcement Mode',
        },
        hints: {
            cycle: 'The current active cycle number.',
            daysRemaining: 'Number of days remaining until the draw.',
            drawDate: 'Scheduled date for the draw.',
            prizeName: 'Name of the prize for this cycle.',
            prizeValue: 'Monetary value of the prize.',
            prizeImage: 'URL to the main prize image.',
            liveStreamUrl: 'URL for the livestream broadcast.',
            isLive: 'Whether the livestream is currently active.',
            registrationEnabled: 'Allow new users to register.',
            ticketSelectionEnabled: 'Allow users to select their ticket numbers.',
            winnerAnnouncementMode: 'Display winner announcement card instead of prize card.',
        },
        actions: {
            saveChanges: 'Save Changes',
            discardChanges: 'Discard Changes',
        },
        status: {
            saved: 'Settings saved',
        },
    },
    am: {
        pageTitle: 'ቅንጅቶች',
        subtitle: 'የስርዓቱን ቅንጅቶች ያዋቅሩ እና የመተግበሪያውን ባህሪ ያስተዳድሩ።',
        language: 'ቋንቋ',
        unsavedChanges: 'ያልተቀመጡ ገበታዎች አሉዎት',
        sections: {
            cycle: 'የዙር ውቅር',
            prize: 'የሽልማት ውቅር',
            livestream: 'የላይቭ ስትሪም ቅንጅቶች',
            features: 'የባህሪ ማብራት/ማጥፋት',
        },
        fields: {
            cycle: 'የአሁኑ ዙር',
            daysRemaining: 'እስከ መርጫ ያሉ ቀናት',
            drawDate: 'የመርጫ ቀን',
            prizeName: 'የሽልማት ስም',
            prizeValue: 'የሽልማት ዋጋ',
            prizeImage: 'የሽልማት ፎቶ URL',
            liveStreamUrl: 'የላይቭ ስትሪም URL',
            isLive: 'ላይቭ ስትሪም ንቁ',
            registrationEnabled: 'ምዝገባ ንቁ',
            ticketSelectionEnabled: 'የቲኬት ምርጫ ንቁ',
            winnerAnnouncementMode: 'የአሸናፊ ማስታወቂያ ሁነታ',
        },
        hints: {
            cycle: 'የአሁኑ ንቁ የዙር ቁጥር።',
            daysRemaining: 'እስከ መርጫው ድረስ የቀሩ ቀናት።',
            drawDate: 'መርጫው የተያዘበት ቀን።',
            prizeName: 'ለዚህ ዙር የተመረጠው ሽልማት ስም።',
            prizeValue: 'የሽልማቱ ገንዘባዊ ዋጋ።',
            prizeImage: 'ዋናው የሽልማት ፎቶ URL።',
            liveStreamUrl: 'የላይቭ ስትሪም መስተላለፊያ URL።',
            isLive: 'ላይቭ ስትሪሙ አሁን ንቁ ነው።',
            registrationEnabled: 'አዲስ ተጠቃሚዎች እንዲመዘገቡ ይፍቀዱ።',
            ticketSelectionEnabled: 'ተጠቃሚዎች የቲኬት ቁጥራቸውን እንዲመርጡ ይፍቀዱ።',
            winnerAnnouncementMode: 'የአሸናፊ ማስታወቂያ ካርድ ይሳዩ።',
        },
        actions: {
            saveChanges: 'ለውጦችን አስቀምጥ',
            discardChanges: 'ለውጦችን አቋርጥ',
        },
        status: {
            saved: 'ቅንጅቶች ተቀምጠዋል',
        },
    },
} as const;

export default function Settings() {
    const { settings, status } = usePage<PageProps>().props;
    const { language } = useLanguage();
    const t = TRANSLATIONS[language];

    // Modern Inertia: useForm handles state, processing, errors, and dirty checking
    const { data, setData, put, processing, reset, errors, isDirty } = useForm({
        cycle: settings.cycle,
        daysRemaining: settings.daysRemaining,
        drawDate: settings.drawDate,
        prizeName: settings.prizeName,
        prizeValue: settings.prizeValue,
        prizeImage: settings.prizeImage ?? '',
        liveStreamUrl: settings.liveStreamUrl ?? '',
        isLive: settings.isLive,
        registrationEnabled: settings.registrationEnabled,
        ticketSelectionEnabled: settings.ticketSelectionEnabled,
        winnerAnnouncementMode: settings.winnerAnnouncementMode,
    });

    const handleSave = (e: React.FormEvent): void => {
        e.preventDefault();
        put(updateSettings().url, {
            preserveScroll: true,
            // You can add onSuccess hooks here if needed
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.pageTitle} />
            <form onSubmit={handleSave} className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                
                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-stone-900 via-stone-900 to-navy text-white shadow-xl">
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-royal/30 blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-royal/25 blur-3xl" />
                    </div>

                    <div className="relative p-6 md:p-10">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold tracking-wider uppercase">
                                    <Settings2 className="h-4 w-4 text-blue-300" />
                                    {t.pageTitle}
                                </div>
                                <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                                    {t.subtitle}
                                </h1>
                                {isDirty && (
                                    <p className="mt-3 flex items-center gap-2 text-sm text-blue-300">
                                        <Bell className="h-4 w-4" />
                                        {t.unsavedChanges}
                                    </p>
                                )}
                                {status && !isDirty && (
                                    <p className="mt-3 flex items-center gap-2 text-sm text-blue-300">
                                        <CheckCircle className="h-4 w-4" />
                                        {status}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="rounded-2xl"
                                        onClick={() => reset()}
                                        disabled={!isDirty}
                                    >
                                        {t.actions.discardChanges}
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="rounded-2xl bg-royal text-stone-900 hover:bg-royal"
                                        disabled={!isDirty || processing}
                                    >
                                        {processing ? (
                                            <>
                                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                {t.actions.saveChanges}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                {t.actions.saveChanges}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Grid */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Cycle Configuration */}
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-stone-100 p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
                                <RefreshCw className="h-5 w-5 text-stone-600" />
                            </div>
                            <h2 className="text-sm font-black text-stone-900">{t.sections.cycle}</h2>
                        </div>
                        <div className="p-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                        {t.fields.cycle}
                                    </Label>
                                    <Input
                                        type="number"
                                        value={data.cycle}
                                        onChange={(e) => setData('cycle', parseInt(e.target.value) || 0)}
                                        className={errors.cycle ? 'border-red-500' : 'rounded-xl'}
                                    />
                                    {errors.cycle && <p className="text-xs text-red-500">{errors.cycle}</p>}
                                    <p className="text-xs text-stone-400">{t.hints.cycle}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                        {t.fields.daysRemaining}
                                    </Label>
                                    <Input
                                        type="number"
                                        value={data.daysRemaining}
                                        onChange={(e) => setData('daysRemaining', parseInt(e.target.value) || 0)}
                                        className={errors.daysRemaining ? 'border-red-500' : 'rounded-xl'}
                                    />
                                    {errors.daysRemaining && <p className="text-xs text-red-500">{errors.daysRemaining}</p>}
                                    <p className="text-xs text-stone-400">{t.hints.daysRemaining}</p>
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                        {t.fields.drawDate}
                                    </Label>
                                    <Input
                                        type="date"
                                        value={data.drawDate}
                                        onChange={(e) => setData('drawDate', e.target.value)}
                                        className={errors.drawDate ? 'border-red-500' : 'rounded-xl'}
                                    />
                                    {errors.drawDate && <p className="text-xs text-red-500">{errors.drawDate}</p>}
                                    <p className="text-xs text-stone-400">{t.hints.drawDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prize Configuration */}
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-stone-100 p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
                                <Trophy className="h-5 w-5 text-stone-600" />
                            </div>
                            <h2 className="text-sm font-black text-stone-900">{t.sections.prize}</h2>
                        </div>
                        <div className="p-5">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold tracking-wider text-stone-500 uppercase">{t.fields.prizeName}</Label>
                                    <Input
                                        type="text"
                                        value={data.prizeName}
                                        onChange={(e) => setData('prizeName', e.target.value)}
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold tracking-wider text-stone-500 uppercase">{t.fields.prizeValue}</Label>
                                    <Input
                                        type="text"
                                        value={data.prizeValue}
                                        onChange={(e) => setData('prizeValue', e.target.value)}
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold tracking-wider text-stone-500 uppercase">{t.fields.prizeImage}</Label>
                                    <Input
                                        type="url"
                                        value={data.prizeImage}
                                        onChange={(e) => setData('prizeImage', e.target.value)}
                                        className="rounded-xl"
                                    />
                                </div>
                                {data.prizeImage && (
                                    <div className="mt-2 overflow-hidden rounded-xl border border-stone-200">
                                        <img
                                            src={data.prizeImage}
                                            alt={data.prizeName}
                                            className="h-40 w-full object-cover"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Livestream Settings */}
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-stone-100 p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
                                <Video className="h-5 w-5 text-stone-600" />
                            </div>
                            <h2 className="text-sm font-black text-stone-900">{t.sections.livestream}</h2>
                        </div>
                        <div className="p-5">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold tracking-wider text-stone-500 uppercase">{t.fields.liveStreamUrl}</Label>
                                    <Input
                                        type="url"
                                        value={data.liveStreamUrl}
                                        onChange={(e) => setData('liveStreamUrl', e.target.value)}
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <Monitor className="h-5 w-5 text-stone-600" />
                                        <div>
                                            <div className="text-sm font-bold text-stone-900">{t.fields.isLive}</div>
                                            <div className="text-xs text-stone-500">{t.hints.isLive}</div>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={data.isLive}
                                        onCheckedChange={(checked) => setData('isLive', checked)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Toggles */}
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-stone-100 p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
                                <Sparkles className="h-5 w-5 text-stone-600" />
                            </div>
                            <h2 className="text-sm font-black text-stone-900">{t.sections.features}</h2>
                        </div>
                        <div className="p-5 space-y-3">
                            <ToggleItem 
                                icon={<Users className="h-5 w-5" />}
                                title={t.fields.registrationEnabled}
                                hint={t.hints.registrationEnabled}
                                checked={data.registrationEnabled}
                                onChange={(val) => setData('registrationEnabled', val)}
                            />
                            <ToggleItem 
                                icon={<Ticket className="h-5 w-5" />}
                                title={t.fields.ticketSelectionEnabled}
                                hint={t.hints.ticketSelectionEnabled}
                                checked={data.ticketSelectionEnabled}
                                onChange={(val) => setData('ticketSelectionEnabled', val)}
                            />
                            <ToggleItem 
                                icon={<Trophy className="h-5 w-5" />}
                                title={t.fields.winnerAnnouncementMode}
                                hint={t.hints.winnerAnnouncementMode}
                                checked={data.winnerAnnouncementMode}
                                onChange={(val) => setData('winnerAnnouncementMode', val)}
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Stats Footer */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard icon={<DollarSign className="h-4 w-4 text-royal" />} label={t.fields.prizeValue} value={data.prizeValue} />
                    <StatCard icon={<RefreshCw className="h-4 w-4 text-blue-500" />} label={t.fields.cycle} value={`#${data.cycle}`} />
                    <StatCard icon={<Clock className="h-4 w-4 text-royal" />} label={t.fields.daysRemaining} value={data.daysRemaining} />
                    <StatCard icon={<Calendar className="h-4 w-4 text-purple-500" />} label={t.fields.drawDate} value={data.drawDate} />
                </div>
            </form>
        </AppLayout>
    );
}

/** * Local Sub-components for cleaner JSX 
 */

const ToggleItem = ({ icon, title, hint, checked, onChange }: { icon: React.ReactNode, title: string, hint: string, checked: boolean, onChange: (val: boolean) => void }) => (
    <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-4">
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                {icon}
            </div>
            <div>
                <div className="text-sm font-bold text-stone-900">{title}</div>
                <div className="text-xs text-stone-500">{hint}</div>
            </div>
        </div>
        <Switch checked={checked} onCheckedChange={onChange} />
    </div>
);

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-stone-500 uppercase">
            {icon}
            {label}
        </div>
        <div className="mt-2 text-lg font-black text-stone-900">{value}</div>
    </div>
);