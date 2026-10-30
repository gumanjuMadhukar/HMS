@extends('layouts.app')

@section('title', 'Rooms & Beds')
@section('page_title', 'Room Management')

@section('actions')
    <div x-data="{ open: false }">
        <button @click="open = true" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition">
            <i data-lucide="plus" class="w-4 h-4"></i>
            Add New Room
        </button>

        <!-- Add Room Modal -->
        <div x-show="open" class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="open = false"></div>
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                        <h3 class="text-lg font-bold text-slate-900">Add New Room</h3>
                        <button @click="open = false" class="text-slate-400 hover:text-slate-600">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form action="{{ route('admin.rooms.store') }}" method="POST" class="mt-4 space-y-4">
                        @csrf
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Property</label>
                            <select name="property_id" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                @foreach($properties as $property)
                                    <option value="{{ $property->id }}">{{ $property->name }} ({{ $property->city }})</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Room Number</label>
                                <input type="text" name="room_number" placeholder="e.g. 101, B-12" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Floor</label>
                                <input type="text" name="floor" placeholder="1, 2, G" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Room Type</label>
                                <select name="type" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                    <option value="single">Single Bed</option>
                                    <option value="double">Double Shared</option>
                                    <option value="dorm">Dormitory (4-6 Beds)</option>
                                    <option value="deluxe">Deluxe Room</option>
                                    <option value="suite">Executive Suite</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Capacity</label>
                                <input type="number" name="capacity" value="1" min="1" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Price / Night ($)</label>
                                <input type="number" step="0.01" name="price_per_night" placeholder="45.00" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Price / Month ($)</label>
                                <input type="number" step="0.01" name="price_per_month" placeholder="600.00" class="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Initial Status</label>
                            <select name="status" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                <option value="available">Available</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="reserved">Reserved</option>
                            </select>
                        </div>

                        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button type="button" @click="open = false" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
                            <button type="submit" class="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm">Save Room</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('content')
<div class="space-y-6">
    <!-- Filter Bar -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-3">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Filter By:</span>
        <a href="{{ route('admin.rooms.index') }}" class="px-3 py-1.5 rounded-lg text-xs font-medium {{ !request('status') ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' }}">All Rooms</a>
        <a href="{{ route('admin.rooms.index', ['status' => 'available']) }}" class="px-3 py-1.5 rounded-lg text-xs font-medium {{ request('status') == 'available' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' }}">Available</a>
        <a href="{{ route('admin.rooms.index', ['status' => 'occupied']) }}" class="px-3 py-1.5 rounded-lg text-xs font-medium {{ request('status') == 'occupied' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100' }}">Occupied</a>
        <a href="{{ route('admin.rooms.index', ['status' => 'maintenance']) }}" class="px-3 py-1.5 rounded-lg text-xs font-medium {{ request('status') == 'maintenance' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100' }}">Maintenance</a>
    </div>

    <!-- Rooms Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="bg-slate-50/75 text-slate-600 text-xs uppercase font-semibold border-b border-slate-100">
                    <tr>
                        <th class="px-6 py-3.5">Room</th>
                        <th class="px-6 py-3.5">Property</th>
                        <th class="px-6 py-3.5">Type & Capacity</th>
                        <th class="px-6 py-3.5">Rates</th>
                        <th class="px-6 py-3.5">Status</th>
                        <th class="px-6 py-3.5 text-right">Change Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($rooms as $room)
                        <tr class="hover:bg-slate-50/50 transition">
                            <td class="px-6 py-4">
                                <div class="font-bold text-slate-900 text-base">Room {{ $room->room_number }}</div>
                                <div class="text-xs text-slate-400">Floor {{ $room->floor }}</div>
                            </td>
                            <td class="px-6 py-4 font-medium text-slate-700">
                                {{ $room->property->name ?? 'Main Property' }}
                            </td>
                            <td class="px-6 py-4">
                                <span class="capitalize font-semibold text-slate-800">{{ $room->type }}</span>
                                <span class="text-xs text-slate-400 block">{{ $room->capacity }} Person(s)</span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="font-semibold text-slate-900">${{ number_format($room->price_per_night, 2) }} <span class="text-xs text-slate-400 font-normal">/ night</span></div>
                                @if($room->price_per_month)
                                    <div class="text-xs text-slate-500">${{ number_format($room->price_per_month, 2) }} / month</div>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                @if($room->status == 'available')
                                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Available
                                    </span>
                                @elseif($room->status == 'occupied')
                                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Occupied
                                    </span>
                                @elseif($room->status == 'maintenance')
                                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Maintenance
                                    </span>
                                @else
                                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                        <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Reserved
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="inline-flex items-center gap-1">
                                    <form action="{{ route('admin.rooms.status', $room) }}" method="POST">
                                        @csrf
                                        @method('PATCH')
                                        <input type="hidden" name="status" value="{{ $room->status == 'available' ? 'maintenance' : 'available' }}">
                                        <button type="submit" class="px-2.5 py-1 text-xs font-medium rounded border border-slate-200 hover:bg-slate-100 text-slate-600 transition">
                                            {{ $room->status == 'available' ? 'Mark Maintenance' : 'Mark Available' }}
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-8 text-center text-slate-400">
                                No rooms found. Click "Add New Room" to get started.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($rooms->hasPages())
            <div class="p-4 border-t border-slate-100">
                {{ $rooms->links() }}
            </div>
        @endif
    </div>
</div>
@endsection
