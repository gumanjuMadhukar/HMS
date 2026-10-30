<?php

namespace Modules\Rbac\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Modules\Rbac\Models\Permission;
use Modules\Rbac\Models\Role;

class RbacApiController extends Controller
{
    public function matrix()
    {
        $roles = Role::with(['permissions', 'users'])->get();
        $permissions = Permission::all()->groupBy('module');
        $users = User::with('roles')->latest()->paginate(25);

        return response()->json([
            'status' => 'success',
            'roles' => $roles,
            'permissions_by_module' => $permissions,
            'users' => $users,
        ]);
    }

    public function storeRole(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|unique:roles,slug',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'slug' => strtolower(str_replace(' ', '_', $validated['slug'])),
            'description' => $validated['description'] ?? null,
            'is_system' => false,
        ]);

        if (!empty($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return response()->json([
            'status' => 'success',
            'message' => "Role '{$role->name}' created successfully!",
            'data' => $role->load('permissions'),
        ], 201);
    }

    public function syncRolePermissions(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->permissions()->sync($validated['permissions'] ?? []);

        return response()->json([
            'status' => 'success',
            'message' => "Permissions updated for role '{$role->name}'!",
            'data' => $role->load('permissions'),
        ]);
    }

    public function syncUserRoles(Request $request, User $user)
    {
        $validated = $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user->roles()->sync($validated['roles']);

        return response()->json([
            'status' => 'success',
            'message' => "Roles updated for user {$user->name}!",
            'data' => $user->load('roles'),
        ]);
    }
}

