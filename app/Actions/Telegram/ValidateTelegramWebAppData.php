<?php

namespace App\Actions\Telegram;

/**
 * Validates the initData payload that Telegram injects into Mini Apps,
 * following the official "Validating data received via the Mini App" flow.
 *
 * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
class ValidateTelegramWebAppData
{
    /**
     * Validate the initData payload and return the parsed user data.
     *
     * @return array<string, mixed>|null The parsed payload or null when invalid.
     */
    public function validate(string $initData): ?array
    {
        $params = $this->parse($initData);

        if (empty($params['hash']) || empty($params['user']) || empty($params['auth_date'])) {
            return null;
        }

        if (! $this->signatureIsValid($params)) {
            return null;
        }

        if (now()->timestamp - (int) $params['auth_date'] > (int) config('telegram.auth_max_age')) {
            return null;
        }

        return $params;
    }

    /**
     * Parse the URL-encoded initData string into an associative array.
     *
     * @return array<string, string>
     */
    private function parse(string $initData): array
    {
        $params = [];

        foreach (explode('&', $initData) as $pair) {
            if (! str_contains($pair, '=')) {
                continue;
            }

            [$key, $value] = explode('=', $pair, 2);

            $params[urldecode($key)] = urldecode($value);
        }

        return $params;
    }

    /**
     * Rebuild the data check string and compare it with the provided hash.
     *
     * @param  array<string, string>  $params
     */
    private function signatureIsValid(array $params): bool
    {
        $botToken = (string) config('telegram.bot_token');

        if ($botToken === '') {
            return false;
        }

        $dataCheckString = collect($params)
            ->reject(fn (string $value, string $key) => $key === 'hash')
            ->sortKeys()
            ->map(fn (string $value, string $key) => "{$key}={$value}")
            ->values()
            ->implode("\n");

        $secretKey = hash_hmac('sha256', $botToken, 'WebAppData', true);

        $hash = bin2hex(hash_hmac('sha256', $dataCheckString, $secretKey, true));

        return hash_equals($hash, $params['hash']);
    }
}
