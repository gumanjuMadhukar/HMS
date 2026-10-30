@extends('layouts.app')

@section('title', 'My Bookings')
@section('page_title', 'Tenant / Finder Bookings')

@section('actions')
    <a href="{{ route('finder.index') }}" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition">
        <i data-lucide="search" class="w-4 h-4"></i>
        Find More Rooms
    </a>
@endsection

@section('content')
<div class="space-y-6">
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="p-6 pb-4 border-b border-slate-100">
            <h3 class="text-base font-bold text-slate-900">My Stay Reservations</h3>
            <p class="text-xs text-slate-500">Track check-in status, invoices, and stay records</p>
        </div>

        <table class="w-full text-left text-sm">
            <thead class="bg-slate-50/75 text-slate-600 text-xs uppercase font-semibold border-b border-slate-100">
                <tr>
                    <th class="px-6 py-3.5">Booking Code</th>
                    <th class="px-6 py-3.5">Property & Room</th>
                    <th class="px-6 py-3.5">Dates</th>
                    <th class="px-6 py-3.5">Total Amount</th>
                    <th class="px-6 py-3.5">Paid</th>
                    <th class="px-6 py-3.5">Status</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @forelse($bookings as $booking)
                    <tr class="hover:bg-slate-50/50 transition">
                        <td class="px-6 py-4 font-mono font-bold text-xs text-blue-600">
                            {{ $booking->booking_code }}
                        </td>
                        <td class="px-6 py-4">
                            <span class="font-bold text-slate-900">Room {{ $booking->room->room_number }} ({{ ucfirst($booking->room->type) }})</span>
                            <span class="block text-xs text-slate-400">{{ $booking->room->property->name ?? '' }} - {{ $booking->room->property->city ?? '' }}</span>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-600">
                            {{ $booking->check_in_date->format('M d, Y') }} &rarr; {{ $booking->check_out_date->format('M d, Y') }}
                        </td>
                        <td class="px-6 py-4 font-semibold text-slate-900">
                            ${{ number_format($booking->total_amount, 2) }}
                        </td>
                        <td class="px-6 py-4">
                            <span class="font-semibold {{ $booking->balance_due > 0 ? 'text-amber-600' : 'text-emerald-600' }}">
                                ${{ number_format($booking->paid_amount, 2) }}
                            </span>
                            @if($booking->balance_due > 0)
                                <span class="block text-[11px] text-rose-500 font-medium">Due: ${{ number_format($booking->balance_due, 2) }}</span>
                            @endif
                        </td>
                        <td class="px-6 py-4">
                            @if($booking->status == 'checked_in')
                                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Checked In</span>
                            @elseif($booking->status == 'confirmed')
                                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Confirmed (Upcoming)</span>
                            @elseif($booking->status == 'checked_out')
                                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Checked Out</span>
                            @else
                                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Cancelled</span>
                            @endif
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="px-6 py-12 text-center text-slate-400">
                            You have no active or previous bookings. <a href="{{ route('finder.index') }}" class="text-blue-600 font-semibold underline">Find a room now</a>.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        @if($bookings->hasPages())
            <div class="p-4 border-t border-slate-100">
                {{ $bookings->links() }}
            </div>
        @endif
    </div>
</div>
@endsection

