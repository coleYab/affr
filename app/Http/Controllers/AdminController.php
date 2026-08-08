<?php

namespace App\Http\Controllers;

use Inerita\Inertia;

class AdminController extends Controller
{
    public function dashoard()
    {
        return Inertia::render('app/settings', []);
    }
}
