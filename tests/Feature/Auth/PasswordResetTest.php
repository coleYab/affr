<?php

test('password reset routes are disabled', function () {
    $this->get('/forgot-password')->assertNotFound();
    $this->post('/forgot-password', ['email' => 'test@example.com'])->assertNotFound();
});
