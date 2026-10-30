<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

abstract class Controller
{
    /**
     * Resolve the authenticated API user from Bearer token or fallback
     */
    protected function getApiUser(Request $request): ?User
    {
        $bearer = $request->bearerToken();
        if ($bearer) {
            $hashed = hash('sha256', $bearer);
            $tokenRecord = DB::table('api_tokens')->where('token', $hashed)->first();
            if ($tokenRecord) {
                return User::with(['roles.permissions'])->find($tokenRecord->user_id);
            }
        }

        if ($request->filled('user_id')) {
            return User::find($request->user_id);
        }

        return auth()->user();
    }

    /**
     * Resolve the user ID
     */
    protected function getApiUserId(Request $request, int $default = 1): int
    {
        $user = $this->getApiUser($request);
        return $user ? $user->id : (int) $request->query('user_id', $default);
    }
}
