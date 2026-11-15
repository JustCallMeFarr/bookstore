<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // POST /api/messages  (publik): form Contact Me
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:100',
            'email'   => 'required|email|max:150',
            'subject' => 'nullable|string|max:150',
            'message' => 'required|string|max:2000',
        ]);

        Message::create($data);

        return response()->json(['message' => 'Pesan terkirim. Terima kasih!'], 201);
    }

    // GET /api/admin/messages
    public function index()
    {
        return Message::orderByDesc('created_at')->get();
    }

    // PUT /api/admin/messages/{message}/read
    public function markRead(Message $message)
    {
        $message->update(['is_read' => true]);

        return $message;
    }
}
