<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Telegram Bot Token
    |--------------------------------------------------------------------------
    |
    | The token of the Telegram bot that hosts the Mini App. It is used to
    | cryptographically validate the initData payload that Telegram sends
    | to the Mini App on every launch, following the official
    | "Validating data received via the Mini App" flow.
    |
    */

    'bot_token' => env('TELEGRAM_BOT_TOKEN'),

    /*
    |--------------------------------------------------------------------------
    | Telegram Bot Username
    |--------------------------------------------------------------------------
    |
    | The username of the Telegram bot (without the leading "@"). It is used
    | to build the deep link that opens the Mini App from a regular browser.
    |
    */

    'bot_username' => env('TELEGRAM_BOT_USERNAME', 'AfroEqubBot'),

    /*
    |--------------------------------------------------------------------------
    | Administrator Telegram IDs
    |--------------------------------------------------------------------------
    |
    | A comma separated list of Telegram user IDs that are granted the admin
    | role the first time they authenticate through the Mini App.
    |
    */

    'admin_ids' => array_filter(array_map(
        'trim',
        explode(',', (string) env('TELEGRAM_ADMIN_IDS'))
    )),

    /*
    |--------------------------------------------------------------------------
    | Maximum Authentication Age
    |--------------------------------------------------------------------------
    |
    | The maximum amount of time (in seconds) that a Telegram initData
    | authentication payload is considered valid. Telegram recommends
    | rejecting payloads older than 24 hours.
    |
    */

    'auth_max_age' => (int) env('TELEGRAM_AUTH_MAX_AGE', 86400),
];
