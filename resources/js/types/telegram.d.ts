export type TelegramWebAppUser = {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
};

export type TelegramInitDataUnsafe = {
    user?: TelegramWebAppUser;
    auth_date?: number;
    query_id?: string;
    start_param?: string;
    hash?: string;
};

declare global {
    interface Window {
        Telegram?: {
            WebApp?: {
                initData: string;
                initDataUnsafe: TelegramInitDataUnsafe;
                ready: () => void;
                expand: () => void;
                disableVerticalSwipes: () => void;
                setHeaderColor: (color: string) => void;
                setBackgroundColor: (color: string) => void;
                setBottomBarColor: (color: string) => void;
                openTelegramLink: (url: string) => void;
                openLink: (url: string) => void;
                close: () => void;
            };
        };
    }
}

export {};