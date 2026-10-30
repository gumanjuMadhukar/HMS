@extends('layouts.app')

@section('title', 'Roles & Permissions (RBAC)')
@section('page_title', 'Dynamic RBAC & Access Control')

@section('actions')
    <div x-data="{ openRoleModal: false }">
        <button @click="openRoleModal = true" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition">
            <i data-lucide="shield-plus" class="w-4 h-4"></i>
            Create New Role
        </button>

        <!-- Create Role Modal -->
        <div x-show="openRoleModal" class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="openRoleModal = false"></div>
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border">
                    <div class="flex items-center justify-between pb-3 border-b">
                        <h3 class="font-bold text-slate-900">Define New Role</h3>
                        <button @click="openRoleModal = false" class="text-slate-400 hover:text-slate-600">&times;</button>
                    </div>

                    <form action="{{ route('admin.rbac.roles.store') }}" method="POST" class="mt-4 space-y-3">
                        @csrf
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Role Name</label>
                            <input type="text" name="name" placeholder="e.g. Front Desk Staff" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Role Slug (identifier)</label>
                            <input type="text" name="slug" placeholder="e.g. front_desk_staff" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Description</label>
                            <textarea name="description" rows="2" placeholder="Responsibilities of this role..." class="w-full text-sm rounded-lg border border-slate-300 p-2.5"></textarea>
                        </div>

                        <div class="flex justify-end gap-2 pt-3 border-t">
                            <button type="button" @click="openRoleModal = false" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button type="submit" class="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg shadow-sm">Save Role</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('content')
<div class="space-y-6" x-data="{ activeTab: 'matrix' }">
    <!-- Tabs Header -->
    <div class="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button @click="activeTab = 'matrix'" 
                :class="activeTab === 'matrix' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'"
                class="px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm">
            Permission Matrix by Role
        </button>
        <button @click="activeTab = 'users'" 
                :class="activeTab === 'users' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'"
                class="px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm">
            User Role Assignments ({{ $users->total() }})
        </button>
    </div>

    <!-- Tab 1: Dynamic Permission Matrix -->
    <div x-show="activeTab === 'matrix'" class="space-y-6">
        @foreach($roles as $role)
            <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <h3 class="text-base font-bold text-slate-900">{{ $role->name }}</h3>
                            <span class="px-2 py-0.5 rounded text-[11px] font-mono font-medium {{ $role->is_system ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700' }}">
                                {{ $role->slug }}
                            </span>
                            @if($role->is_system)
                                <span class="text-[11px] text-slate-400 font-medium">(System Protected)</span>
                            @endif
                        </div>
                        <p class="text-xs text-slate-500 mt-1">{{ $role->description ?? 'No description provided' }}</p>
                    </div>
                    <span class="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border">
                        {{ $role->permissions->count() }} Permissions Assigned
                    </span>
                </div>

                @if($role->slug === 'super_admin')
                    <div class="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-medium flex items-center gap-2">
                        <i data-lucide="shield-check" class="w-4 h-4 text-purple-600"></i>
                        Super Admin automatically inherits all current and future permissions across all modules.
                    </div>
                @else
                    <form action="{{ route('admin.rbac.roles.permissions', $role) }}" method="POST" class="mt-4">
                        @csrf
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            @foreach($permissionsByModule as $moduleName => $permissions)
                                <div class="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50">
                                    <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                        <i data-lucide="folder" class="w-3.5 h-3.5 text-blue-600"></i>
                                        {{ ucfirst($moduleName) }}
                                    </h4>
                                    <div class="space-y-2">
                                        @foreach($permissions as $perm)
                                            <label class="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900">
                                                <input type="checkbox" name="permissions[]" value="{{ $perm->id }}"
                                                       {{ $role->permissions->contains('id', $perm->id) ? 'checked' : '' }}
                                                       class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5">
                                                <div>
                                                    <span class="font-medium">{{ $perm->name }}</span>
                                                    <span class="block text-[10px] text-slate-400 font-mono">{{ $perm->slug }}</span>
                                                </div>
                                            </label>
                                        @endforeach
                                    </div>
                                </div>
                            @endforeach
                        </div>

                        <div class="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                            <button type="submit" class="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition">
                                Update {{ $role->name }} Permissions
                            </button>
                        </div>
                    </form>
                @endif
            </div>
        @endforeach
    </div>

    <!-- Tab 2: User Role Assignments -->
    <div x-show="activeTab === 'users'" class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden" style="display: none;">
        <table class="w-full text-left text-sm">
            <thead class="bg-slate-50/75 text-slate-600 text-xs uppercase font-semibold border-b border-slate-100">
                <tr>
                    <th class="px-6 py-3.5">User</th>
                    <th class="px-6 py-3.5">Email</th>
                    <th class="px-6 py-3.5">Assigned Roles</th>
                    <th class="px-6 py-3.5 text-right">Update Roles</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @foreach($users as $u)
                    <tr class="hover:bg-slate-50/50 transition">
                        <td class="px-6 py-4 font-semibold text-slate-900">
                            {{ $u->name }}
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-600">
                            {{ $u->email }}
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex flex-wrap gap-1.5">
                                @forelse($u->roles as $r)
                                    <span class="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                                        {{ $r->name }}
                                    </span>
                                @empty
                                    <span class="text-xs text-slate-400 italic">No roles assigned</span>
                                @endforelse
                            </div>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div x-data="{ editRoleModal: false }" class="inline-block">
                                <button @click="editRoleModal = true" class="px-3 py-1 rounded-md text-xs font-semibold border border-slate-200 hover:bg-slate-100 text-slate-700">
                                    Assign Roles
                                </button>

                                <div x-show="editRoleModal" class="fixed inset-0 z-50 overflow-y-auto text-left" style="display: none;">
                                    <div class="fixed inset-0 bg-slate-900/60" @click="editRoleModal = false"></div>
                                    <div class="flex items-center justify-center min-h-screen p-4">
                                        <div class="relative bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border">
                                            <h4 class="font-bold text-slate-900 text-base mb-1">Assign Roles for {{ $u->name }}</h4>
                                            <p class="text-xs text-slate-500 mb-4">{{ $u->email }}</p>

                                            <form action="{{ route('admin.rbac.users.roles', $u) }}" method="POST" class="space-y-3">
                                                @csrf
                                                @foreach($roles as $roleOption)
                                                    <label class="flex items-center gap-3 p-2 rounded-lg border hover:bg-slate-50 cursor-pointer">
                                                        <input type="checkbox" name="roles[]" value="{{ $roleOption->id }}"
                                                               {{ $u->roles->contains('id', $roleOption->id) ? 'checked' : '' }}
                                                               class="rounded border-slate-300 text-blue-600">
                                                        <div>
                                                            <div class="font-semibold text-xs text-slate-900">{{ $roleOption->name }}</div>
                                                            <div class="text-[11px] text-slate-400">{{ $roleOption->slug }}</div>
                                                        </div>
                                                    </label>
                                                @endforeach

                                                <div class="flex justify-end gap-2 pt-3 border-t">
                                                    <button type="button" @click="editRoleModal = false" class="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                                                    <button type="submit" class="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded">Save Roles</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        @if($users->hasPages())
            <div class="p-4 border-t border-slate-100">
                {{ $users->links() }}
            </div>
        @endif
    </div>
</div>
@endsection

