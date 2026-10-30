@extends('layouts.app')

@section('title', 'Admin Dashboard')
@section('page_title', 'HMS Overview & Analytics')

@section('actions')
    <a href="{{ route('admin.bookings.index') }}" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition">
        <i data-lucide="plus" class="w-4 h-4"></i>
        New Booking
    </a>
@endsection

@section('content')
<div class="space-y-6">
    <!-- KPI Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Total Rooms -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Rooms</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ $totalRooms }}</h3>
                <div class="flex items-center gap-2 mt-2 text-xs">
                    <span class="text-emerald-600 font-semibold">{{ $availableRooms }} Available</span>
                    <span class="text-slate-300">•</span>
                    <span class="text-amber-600 font-semibold">{{ $occupiedRooms }} Occupied</span>
                </div>
            </div>
            <div class="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <i data-lucide="bed" class="w-6 h-6"></i>
            </div>
        </div>

        <!-- Occupancy Rate -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Occupancy Rate</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ $occupancyRate }}%</h3>
                <div class="w-32 bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: {{ $occupancyRate }}%"></div>
                </div>
            </div>
            <div class="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i data-lucide="pie-chart" class="w-6 h-6"></i>
            </div>
        </div>

        <!-- Active Guests -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Bookings</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ $activeBookings }}</h3>
                <p class="text-xs text-slate-500 mt-2">{{ $totalGuests }} Total Registered Guests</p>
            </div>
            <div class="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <i data-lucide="user-check" class="w-6 h-6"></i>
            </div>
        </div>

        <!-- Total Revenue -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
                <h3 class="text-2xl font-bold text-emerald-600 mt-1">${{ number_format($totalRevenue, 2) }}</h3>
                <p class="text-xs text-amber-600 font-medium mt-2">${{ number_format($pendingPayments, 2) }} Pending Due</p>
            </div>
            <div class="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i data-lucide="dollar-sign" class="w-6 h-6"></i>
            </div>
        </div>
    </div>

    <!-- Live Room Grid Status -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
                <h2 class="text-base font-bold text-slate-900">Live Room Status Grid</h2>
                <p class="text-xs text-slate-500">Visual overview of all property rooms</p>
            </div>
            <div class="flex items-center gap-3 text-xs font-medium">
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Occupied</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Maintenance</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Reserved</span>
            </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
            @foreach($rooms as $room)
                @php
                    $badgeColors = [
                        'available' => 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:border-emerald-300',
                        'occupied' => 'bg-rose-50 border-rose-200 text-rose-800 hover:border-rose-300',
                        'maintenance' => 'bg-amber-50 border-amber-200 text-amber-800 hover:border-amber-300',
                        'reserved' => 'bg-blue-50 border-blue-200 text-blue-800 hover:border-blue-300',
                    ];
                    $dotColors = [
                        'available' => 'bg-emerald-500',
                        'occupied' => 'bg-rose-500',
                        'maintenance' => 'bg-amber-500',
                        'reserved' => 'bg-blue-500',
                    ];
                @endphp
                <div class="rounded-xl border p-3.5 transition {{ $badgeColors[$room->status] ?? 'bg-slate-50 border-slate-200' }}">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-sm">#{{ $room->room_number }}</span>
                        <span class="w-2 h-2 rounded-full {{ $dotColors[$room->status] ?? 'bg-slate-400' }}"></span>
                    </div>
                    <p class="text-[11px] capitalize mt-1 font-medium opacity-80">{{ $room->type }}</p>
                    <div class="flex items-center justify-between mt-2 pt-2 border-t border-black/5 text-[11px]">
                        <span>${{ number_format($room->price_per_night, 0) }}/nt</span>
                        <span class="capitalize font-semibold">{{ $room->status }}</span>
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    <!-- Recent Bookings Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
                <h2 class="text-base font-bold text-slate-900">Recent Stays & Bookings</h2>
                <p class="text-xs text-slate-500">Real-time check-in/out and reservation activity</p>
            </div>
            <a href="{{ route('admin.bookings.index') }}" class="text-xs font-semibold text-blue-600 hover:text-blue-700">View All Bookings &rarr;</a>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="bg-slate-50/75 text-slate-600 text-xs uppercase font-semibold border-b border-slate-100">
                    <tr>
                        <th class="px-6 py-3.5">Booking ID</th>
                        <th class="px-6 py-3.5">Guest</th>
                        <th class="px-6 py-3.5">Room</th>
                        <th class="px-6 py-3.5">Stay Dates</th>
                        <th class="px-6 py-3.5">Amount</th>
                        <th class="px-6 py-3.5">Status</th>
                        <th class="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($recentBookings as $booking)
                        <tr class="hover:bg-slate-50/50 transition">
                            <td class="px-6 py-4 font-mono font-medium text-xs text-slate-700">
                                {{ $booking->booking_code }}
                            </td>
                            <td class="px-6 py-4">
                                <div class="font-semibold text-slate-800">{{ $booking->guest->name }}</div>
                                <div class="text-xs text-slate-400">{{ $booking->guest->phone }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="font-medium text-slate-800">Room {{ $booking->room->room_number }}</span>
                                <span class="block text-xs text-slate-400">{{ $booking->property->name ?? '' }}</span>
                            </td>
                            <td class="px-6 py-4 text-xs text-slate-600">
                                {{ $booking->check_in_date->format('M d, Y') }} &rarr; {{ $booking->check_out_date->format('M d, Y') }}
                            </td>
                            <td class="px-6 py-4">
                                <div class="font-semibold text-slate-800">${{ number_format($booking->total_amount, 2) }}</div>
                                <div class="text-[11px] {{ $booking->balance_due > 0 ? 'text-amber-600' : 'text-emerald-600' }}">
                                    Paid: ${{ number_format($booking->paid_amount, 2) }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                @if($booking->status == 'checked_in')
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Checked In</span>
                                @elseif($booking->status == 'confirmed')
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Confirmed</span>
                                @elseif($booking->status == 'checked_out')
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">Checked Out</span>
                                @else
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Cancelled</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    @if($booking->status == 'confirmed')
                                        <form action="{{ route('admin.bookings.check-in', $booking) }}" method="POST">
                                            @csrf
                                            <button type="submit" class="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm">
                                                Check In
                                            </button>
                                        </form>
                                    @elseif($booking->status == 'checked_in')
                                        <form action="{{ route('admin.bookings.check-out', $booking) }}" method="POST">
                                            @csrf
                                            <button type="submit" class="px-3 py-1 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white transition shadow-sm">
                                                Check Out
                                            </button>
                                        </form>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="px-6 py-8 text-center text-slate-400">
                                No bookings recorded yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
