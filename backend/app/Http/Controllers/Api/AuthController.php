<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // POST /api/register
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|max:150|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        // role selalu "user": admin tidak bisa dibuat lewat registrasi publik
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'], // di-hash otomatis oleh cast "hashed" di model User
            'role'     => 'user',
        ]);

        return response()->json([
            'user'  => $user,
            'token' => $user->createToken('bookstore')->plainTextToken,
        ], 201);
    }

    // POST /api/login
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Email atau password salah.'], 422);
        }

        return response()->json([
            'user'  => $user,
            'token' => $user->createToken('bookstore')->plainTextToken,
        ]);
    }

    // POST /api/logout (butuh token)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Berhasil logout.']);
    }

    // GET /api/me (butuh token)
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
