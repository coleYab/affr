<?php

test('home page includes seo and social meta tags', function () {
    $response = $this->get(route('home'));

    $response
        ->assertOk()
        ->assertSee('<meta name="description"', false)
        ->assertSee('<meta property="og:title"', false)
        ->assertSee('<meta property="og:description"', false)
        ->assertSee('<meta property="og:image"', false)
        ->assertSee('<meta property="og:url"', false)
        ->assertSee('<meta name="twitter:card"', false)
        ->assertSee('<link rel="canonical"', false);
});
