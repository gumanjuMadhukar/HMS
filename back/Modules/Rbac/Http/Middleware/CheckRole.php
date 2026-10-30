<?php

namespace Modules\Rbac\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     * Usage: ->middleware('role:super_admin,owner')
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (! $request->user()) {
            return redirect()->route('login');
        }

        if (! $request->user()->hasRole($roles)) {
            abort(403, 'Unauthorized access: You do not possess the required role for this section.');
        }

        return $next($request);
    }
}

