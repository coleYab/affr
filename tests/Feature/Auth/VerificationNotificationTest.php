<?php

use Illuminate\Support\Facades\Notification;

test('verification notification route is disabled', function () {
    Notification::fake();

    $this->post('/email/verification-notification')->assertNotFound();

    Notification::assertNothingSent();
});
