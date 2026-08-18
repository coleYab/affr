export type User = {
    id: number;
    name: string;
    email: string;
    phoneNumber: string | null;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    is_admin: boolean | number | string;
    has_password: boolean;
    telegram_id: number | null;
    telegram_username: string | null;
    telegram_photo_url: string | null;
    language_code: string | null;
    last_seen_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
