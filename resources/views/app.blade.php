<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        @php
            $baseUrl = rtrim(config('app.url'), '/');
            $path = $page['url'] ?? '/';
            $canonicalUrl = str_starts_with($path, 'http') ? $path : $baseUrl . $path;
            $component = $page['component'] ?? '';
            $settings = data_get($page, 'props.settings');

            $seoTitle = match ($component) {
                'welcome' => 'AfroEqub - Drive Your Dream. Secure Your Future.',
                'terms' => 'Terms & Conditions - AfroEqub',
                'privacy' => 'Privacy Policy - AfroEqub',
                default => config('app.name', 'Laravel'),
            };

            $seoDescription = match ($component) {
                'welcome' => "Experience the future of saving with Ethiopia's premier digital Equb. Contribute monthly and participate in transparent draws to win exciting prizes.",
                'terms' => 'Read the Terms & Conditions for using AfroEqub.',
                'privacy' => 'Read the Privacy Policy for AfroEqub.',
                default => "AfroEqub - Ethiopia's digital Equb platform.",
            };

            $ogImage = data_get($settings, 'prizeImage')
                ?: data_get($settings, 'prizeImages.0')
                ?: '/apple-touch-icon.png';

            if (! str_starts_with((string) $ogImage, 'http')) {
                $ogImage = $baseUrl . '/' . ltrim((string) $ogImage, '/');
            }
        @endphp

        <meta name="description" content="{{ $seoDescription }}">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="{{ $canonicalUrl }}">

        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ config('app.name', 'Laravel') }}">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:url" content="{{ $canonicalUrl }}">
        <meta property="og:image" content="{{ $ogImage }}">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $ogImage }}">
        <meta name="twitter:url" content="{{ $canonicalUrl }}">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.ico" type="image/x-icon">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        {{-- Telegram Mini App SDK (initializes window.Telegram.WebApp inside Telegram) --}}
        <script src="https://telegram.org/js/telegram-web-app.js"></script>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
