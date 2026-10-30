@extends('layouts.app')

@section('title', 'Tenants & Guests')
@section('page_title', 'Tenant & Guest Directory')

@section('actions')
    <div x-data="{ addGuestModal: false }">
        <button @click="addGuestModal = true" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition">
            <i data-lucide="user-plus" class="w-4 h-4"></i>
            Register Tenant
        </button>

        <!-- Add Guest Modal -->
        <div x-show="addGuestModal" class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="addGuestModal = false"></div>
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border">
                    <div class="flex items-center justify-between pb-3 border-b">
                        <h3 class="font-bold text-slate-900 text-base">Register Tenant Profile</h3>
                        <button @click="addGuestModal = false" class="text-slate-400 hover:text-slate-600">&times;</button>
                    </div>

                    <form action="{{ route('admin.guests.store') }}" method="POST" class="mt-4 space-y-3">
                        @csrf
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
                            <input type="text" name="name" placeholder="John Doe" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone Number</label>
                                <input type="text" name="phone" placeholder="+977-98..." required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Email</label>
                                <input type="email" name="email" placeholder="john@example.com" class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">ID Type</label>
                                <select name="id_type" class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                    <option value="national_id">Citizenship / National ID</option>
                                    <option value="passport">Passport</option>
                                    <option value="student_id">College / Student ID</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">ID Number</label>
                                <input type="text" name="id_number" placeholder="Document ID #" class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Emergency Contact</label>
                            <input type="text" name="emergency_contact" placeholder="Parent / Guardian contact" class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Permanent Address</label>
                            <textarea name="address" rows="2" placeholder="Home address..." class="w-full text-sm rounded-lg border border-slate-300 p-2.5"></textarea>
                        </div>

                        <div class="flex justify-end gap-2 pt-3 border-t">
                            <button type="button" @click="addGuestModal = false" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button type="submit" class="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">Save Tenant</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('content')
<div class="space-y-6">
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
            <form action="{{ route('admin.guests.index') }}" method="GET" class="max-w-md w-full">
                <div class="relative">
                    <input type="text" name="search" value="{{ request('search') }}" placeholder="Search by name, phone, or email..." class="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-4 py-2 focus:border-blue-500">
                    <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i>
                </div>
            </form>
        </div>

        <table class="w-full text-left text-sm">
            <thead class="bg-slate-50/75 text-slate-600 text-xs uppercase font-semibold border-b border-slate-100">
                <tr>
                    <th class="px-6 py-3.5">Name</th>
                    <th class="px-6 py-3.5">Contact</th>
                    <th class="px-6 py-3.5">Identity Document</th>
                    <th class="px-6 py-3.5">Emergency Contact</th>
                    <th class="px-6 py-3.5">Total Stays</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @forelse($guests as $guest)
                    <tr class="hover:bg-slate-50/50 transition">
                        <td class="px-6 py-4 font-bold text-slate-900">
                            {{ $guest->name }}
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-600">
                            <div class="font-medium text-slate-800">{{ $guest->phone }}</div>
                            <div class="text-[11px] text-slate-400">{{ $guest->email ?? 'No email' }}</div>
                        </td>
                        <td class="px-6 py-4 text-xs">
                            <span class="capitalize font-semibold text-slate-700">{{ str_replace('_', ' ', $guest->id_type ?? 'N/A') }}:</span>
                            <span class="font-mono text-slate-500 ml-1">{{ $guest->id_number ?? 'Not verified' }}</span>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-600">
                            {{ $guest->emergency_contact ?? 'N/A' }}
                        </td>
                        <td class="px-6 py-4 font-semibold text-blue-600 text-xs">
                            {{ $guest->bookings_count ?? $guest->bookings->count() }} Booking(s)
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-6 py-8 text-center text-slate-400">
                            No tenants registered yet.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        @if($guests->hasPages())
            <div class="p-4 border-t border-slate-100">
                {{ $guests->links() }}
            </div>
        @endif
    </div>
</div>
@endsection

