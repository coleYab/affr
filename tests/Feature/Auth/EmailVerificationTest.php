<?php

test('email verification routes are disabled', function () {
    $this->get('/email/verify')->assertNotFound();
});
