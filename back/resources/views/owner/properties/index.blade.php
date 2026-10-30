@extends('layouts.app')

@section('title', 'My Properties')
@section('page_title', 'Owner Properties')

@section('actions')
    <div x-data="{ addPropModal: false }">
        <button @click="addPropModal = true" class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition">
            <i data-lucide="plus" class="w-4 h-4"></i>
            Register New Property
        </button>

        <!-- Add Property Modal -->
        <div x-show="addPropModal" class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="addPropModal = false"></div>
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border">
                    <div class="flex items-center justify-between pb-3 border-b">
                        <h3 class="font-bold text-slate-900 text-base">Register Property</h3>
                        <button @click="addPropModal = false" class="text-slate-400 hover:text-slate-600">&times;</button>
                    </div>

                    <form action="{{ route('owner.properties.store') }}" method="POST" class="mt-4 space-y-3">
                        @csrf
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Property Name</label>
                            <input type="text" name="name" placeholder="e.g. Oxford Boys Hostel" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Property Type</label>
                                <select name="type" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                    <option value="hostel">Hostel (Student / Working)</option>
                                    <option value="hotel">Hotel / Lodge</option>
                                    <option value="apartment">Rental Apartment</option>
                                    <option value="coliving">Co-Living Space</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">City</label>
                                <input type="text" name="city" placeholder="e.g. Kathmandu, Pokhara" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Street Address</label>
                            <input type="text" name="address" placeholder="Full street address" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone</label>
                                <input type="text" name="phone" placeholder="Contact number" class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Email</label>
                                <input type="email" name="email" placeholder="property@example.com" class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Description & Amenities</label>
                            <textarea name="description" rows="2" placeholder="Describe highlights (e.g. 24/7 Wi-Fi, Hot water, Meals included)..." class="w-full text-sm rounded-lg border border-slate-300 p-2.5"></textarea>
                        </div>

                        <div class="flex justify-end gap-2 pt-3 border-t">
                            <button type="button" @click="addPropModal = false" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button type="submit" class="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm">Save Property</button>
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
        <table class="w-full text-left text-sm">
            <thead class="bg-slate-50/75 text-slate-600 text-xs uppercase font-semibold border-b border-slate-100">
                <tr>
                    <th class="px-6 py-3.5">Property Name</th>
                    <th class="px-6 py-3.5">Type</th>
                    <th class="px-6 py-3.5">Location</th>
                    <th class="px-6 py-3.5">Contact</th>
                    <th class="px-6 py-3.5">Total Rooms</th>
                    <th class="px-6 py-3.5 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @forelse($properties as $prop)
                    <tr class="hover:bg-slate-50/50 transition">
                        <td class="px-6 py-4 font-bold text-slate-900">
                            {{ $prop->name }}
                        </td>
                        <td class="px-6 py-4">
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider {{ $prop->type === 'hostel' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800' }}">
                                {{ $prop->type }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-600">
                            <div>{{ $prop->city }}</div>
                            <div class="text-[11px] text-slate-400">{{ $prop->address }}</div>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-600">
                            <div>{{ $prop->phone ?? 'N/A' }}</div>
                            <div class="text-[11px] text-slate-400">{{ $prop->email ?? 'N/A' }}</div>
                        </td>
                        <td class="px-6 py-4 font-semibold text-slate-800">
                            {{ $prop->rooms_count ?? $prop->rooms->count() }} Rooms
                        </td>
                        <td class="px-6 py-4 text-right">
                            <a href="{{ route('admin.rooms.index', ['property_id' => $prop->id]) }}" class="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white">
                                Manage Rooms
                            </a>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="px-6 py-8 text-center text-slate-400">
                            No properties found.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection

