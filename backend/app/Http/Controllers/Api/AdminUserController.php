<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class AdminUserController extends Controller
{
    // GET /api/admin/users: daftar user terdaftar
    public function index()
    {
        return User::where('role', 'user')->orderByDesc('created_at')->get();
    }
}
