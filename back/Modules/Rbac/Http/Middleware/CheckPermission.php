<?php

namespace Modules\Rbac\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     * Usage: ->middleware('permission:manage_rooms')
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (! $request->user()) {
            return redirect()->route('login');
        }

        if (! $request->user()->hasPermission($permission)) {
            abort(403, 'Unauthorized access: You lack the permission [' . $permission . '] required for this action.');
        }

        return $next($request);
    }
}

