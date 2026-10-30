<?php

namespace Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PassportAuthController extends Controller
{
    /**
     * API Register endpoint (OAuth / Bearer Token)
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'nullable|string|in:finder,owner',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Default role: finder (or owner if requested)
        $roleSlug = $validated['role'] ?? 'finder';
        $user->assignRole($roleSlug);

        // Generate API Token
        $token = hash('sha256', $plainTextToken = Str::random(40));
        DB::table('api_tokens')->insert([
            'user_id' => $user->id,
            'name' => 'HMS Mobile/Web API',
            'token' => $token,
            'abilities' => json_encode(['*']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully',
            'token_type' => 'Bearer',
            'access_token' => $plainTextToken,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('slug'),
            ],
        ], 201);
    }

    /**
     * API Login endpoint (OAuth / Bearer Token)
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email or password',
            ], 401);
        }

        // Generate Bearer Token
        $token = hash('sha256', $plainTextToken = Str::random(40));
        DB::table('api_tokens')->insert([
            'user_id' => $user->id,
            'name' => 'HMS Mobile/Web API',
            'token' => $token,
            'abilities' => json_encode(['*']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Authentication successful',
            'token_type' => 'Bearer',
            'access_token' => $plainTextToken,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('slug'),
            ],
        ]);
    }

    /**
     * Authenticated User Profile
     */
    public function profile(Request $request)
    {
        $bearer = $request->bearerToken();
        if (! $bearer) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $hashed = hash('sha256', $bearer);
        $tokenRecord = DB::table('api_tokens')->where('token', $hashed)->first();

        if (! $tokenRecord) {
            return response()->json(['message' => 'Invalid or expired token'], 401);
        }

        $user = User::with(['roles.permissions'])->find($tokenRecord->user_id);

        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->map(fn($r) => [
                    'name' => $r->name,
                    'slug' => $r->slug,
                    'permissions' => $r->permissions->pluck('slug'),
                ]),
            ],
        ]);
    }

    /**
     * API Logout endpoint
     */
    public function logout(Request $request)
    {
        $bearer = $request->bearerToken();
        if ($bearer) {
            $hashed = hash('sha256', $bearer);
            DB::table('api_tokens')->where('token', $hashed)->delete();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Token revoked successfully',
        ]);
    }
}

