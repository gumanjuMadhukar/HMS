@extends('layouts.app')

@section('title', 'Bookings & Reservations')
@section('page_title', 'Bookings & Stays')

@section('actions')
    <div x-data="{ open: false }">
        <button @click="open = true" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition">
            <i data-lucide="plus" class="w-4 h-4"></i>
            Create Reservation
        </button>

        <!-- New Booking Modal -->
        <div x-show="open" class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="open = false"></div>
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                        <h3 class="text-lg font-bold text-slate-900">New Booking / Check-In</h3>
                        <button @click="open = false" class="text-slate-400 hover:text-slate-600">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form action="{{ route('admin.bookings.store') }}" method="POST" class="mt-4 space-y-4">
                        @csrf
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Available Room</label>
                            <select name="room_id" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                @forelse($availableRooms as $r)
                                    <option value="{{ $r->id }}">Room {{ $r->room_number }} - {{ ucfirst($r->type) }} (${{ number_format($r->price_per_night, 0) }}/nt) [{{ $r->property->name ?? '' }}]</option>
                                @empty
                                    <option disabled>No available rooms currently</option>
                                @endforelse
                            </select>
                        </div>

                        <div class="space-y-3 pt-2 border-t border-slate-100">
                            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Guest Information</p>
                            <div>
                                <input type="text" name="guest_name" placeholder="Full Name" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <input type="text" name="guest_phone" placeholder="Phone Number" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                <input type="email" name="guest_email" placeholder="Email (optional)" class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Check-In Date</label>
                                <input type="date" name="check_in_date" value="{{ date('Y-m-d') }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Check-Out Date</label>
                                <input type="date" name="check_out_date" value="{{ date('Y-m-d', strtotime('+3 days')) }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Initial Deposit / Paid ($)</label>
                                <input type="number" step="0.01" name="paid_amount" placeholder="0.00" class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Payment Method</label>
                                <select name="payment_method" class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                    <option value="cash">Cash</option>
                                    <option value="card">Credit/Debit Card</option>
                                    <option value="online">Online / Transfer</option>
                                </select>
                            </div>
                        </div>

                        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button type="button" @click="open = false" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
                            <button type="submit" class="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm">Confirm Booking</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('content')
<div class="space-y-6">
    <!-- Filter Tabs -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-3">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Status:</span>
        <a href="{{ route('admin.bookings.index') }}" class="px-3 py-1.5 rounded-lg text-xs font-medium {{ !request('status') ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' }}">All</a>
        <a href="{{ route('admin.bookings.index', ['status' => 'checked_in']) }}" class="px-3 py-1.5 rounded-lg text-xs font-medium {{ request('status') == 'checked_in' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' }}">Checked In</a>
        <a href="{{ route('admin.bookings.index', ['status' => 'confirmed']) }}" class="px-3 py-1.5 rounded-lg text-xs font-medium {{ request('status') == 'confirmed' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100' }}">Confirmed (Upcoming)</a>
        <a href="{{ route('admin.bookings.index', ['status' => 'checked_out']) }}" class="px-3 py-1.5 rounded-lg text-xs font-medium {{ request('status') == 'checked_out' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200' }}">Checked Out</a>
    </div>

    <!-- Bookings Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="bg-slate-50/75 text-slate-600 text-xs uppercase font-semibold border-b border-slate-100">
                    <tr>
                        <th class="px-6 py-3.5">Code</th>
                        <th class="px-6 py-3.5">Guest</th>
                        <th class="px-6 py-3.5">Room</th>
                        <th class="px-6 py-3.5">Dates</th>
                        <th class="px-6 py-3.5">Total / Paid</th>
                        <th class="px-6 py-3.5">Status</th>
                        <th class="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($bookings as $booking)
                        <tr class="hover:bg-slate-50/50 transition">
                            <td class="px-6 py-4 font-mono font-medium text-xs text-slate-700">
                                {{ $booking->booking_code }}
                            </td>
                            <td class="px-6 py-4">
                                <div class="font-semibold text-slate-900">{{ $booking->guest->name }}</div>
                                <div class="text-xs text-slate-400">{{ $booking->guest->phone }}</div>
                            </td>
                            <td class="px-6 py-4 font-medium text-slate-800">
                                Room {{ $booking->room->room_number }}
                                <span class="block text-xs text-slate-400">{{ $booking->room->property->name ?? '' }}</span>
                            </td>
                            <td class="px-6 py-4 text-xs text-slate-600">
                                {{ $booking->check_in_date->format('M d') }} &rarr; {{ $booking->check_out_date->format('M d, Y') }}
                            </td>
                            <td class="px-6 py-4">
                                <div class="font-semibold text-slate-900">${{ number_format($booking->total_amount, 2) }}</div>
                                <div class="text-[11px] {{ $booking->balance_due > 0 ? 'text-amber-600 font-semibold' : 'text-emerald-600' }}">
                                    @if($booking->balance_due > 0)
                                        Due: ${{ number_format($booking->balance_due, 2) }}
                                    @else
                                        Paid in Full
                                    @endif
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                @if($booking->status == 'checked_in')
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Checked In</span>
                                @elseif($booking->status == 'confirmed')
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Confirmed</span>
                                @elseif($booking->status == 'checked_out')
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Checked Out</span>
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

                                    @if($booking->balance_due > 0)
                                        <div x-data="{ payModal: false }" class="inline-block">
                                            <button @click="payModal = true" class="px-2.5 py-1 rounded-md text-xs font-medium border border-blue-200 text-blue-700 hover:bg-blue-50 transition">
                                                + Pay
                                            </button>

                                            <!-- Payment Modal -->
                                            <div x-show="payModal" class="fixed inset-0 z-50 overflow-y-auto text-left" style="display: none;">
                                                <div class="fixed inset-0 bg-slate-900/60" @click="payModal = false"></div>
                                                <div class="flex items-center justify-center min-h-screen p-4">
                                                    <div class="relative bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border">
                                                        <h4 class="font-bold text-slate-900 text-base">Record Payment</h4>
                                                        <p class="text-xs text-slate-500 mb-3">Balance Due: ${{ number_format($booking->balance_due, 2) }}</p>

                                                        <form action="{{ route('admin.payments.store') }}" method="POST" class="space-y-3">
                                                            @csrf
                                                            <input type="hidden" name="booking_id" value="{{ $booking->id }}">
                                                            <div>
                                                                <label class="block text-xs font-semibold text-slate-700 mb-1">Amount ($)</label>
                                                                <input type="number" step="0.01" name="amount" value="{{ $booking->balance_due }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2">
                                                            </div>
                                                            <div>
                                                                <label class="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                                                                <select name="payment_method" class="w-full text-sm rounded-lg border border-slate-300 p-2">
                                                                    <option value="cash">Cash</option>
                                                                    <option value="card">Card</option>
                                                                    <option value="online">Online / Transfer</option>
                                                                </select>
                                                            </div>
                                                            <div class="flex justify-end gap-2 pt-3 border-t">
                                                                <button type="button" @click="payModal = false" class="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                                                                <button type="submit" class="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded">Record</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="px-6 py-8 text-center text-slate-400">
                                No bookings found.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($bookings->hasPages())
            <div class="p-4 border-t border-slate-100">
                {{ $bookings->links() }}
            </div>
        @endif
    </div>
</div>
@endsection
