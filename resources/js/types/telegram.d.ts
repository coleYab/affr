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

type TelegramRequestContactSuccess = {
    response: string;
    responseUnsafe: {
        auth_date: string;
        contact: {
            first_name: string;
            last_name?: string;
            phone_number: string;
            user_id: number;
        };
        hash: string;
    };
    status: 'sent';
};

type TelegramRequestContactCancelled = {
    status: 'cancelled';
};

export type TelegramRequestContactResult =
    | TelegramRequestContactSuccess
    | TelegramRequestContactCancelled;

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
                requestContact: (
                    callback: (
                        shared: boolean,
                        info?: TelegramRequestContactResult,
                    ) => void,
                ) => void;
            };
        };
    }
}

export {};