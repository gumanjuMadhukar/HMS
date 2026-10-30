@extends('layouts.app')

@section('title', 'Billing & Ledger')
@section('page_title', 'Billing & Transactions')

@section('content')
<div class="space-y-6">
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
                <h3 class="text-base font-bold text-slate-900">Hotel Stays & Hostel Monthly Collections</h3>
                <p class="text-xs text-slate-500">Real-time payment logs with eSewa, Khalti, Card, and Cash</p>
            </div>
        </div>

        <table class="w-full text-left text-sm">
            <thead class="bg-slate-50/75 text-slate-600 text-xs uppercase font-semibold border-b border-slate-100">
                <tr>
                    <th class="px-6 py-3.5">Invoice #</th>
                    <th class="px-6 py-3.5">Customer / Student</th>
                    <th class="px-6 py-3.5">Property & Type</th>
                    <th class="px-6 py-3.5">Amount</th>
                    <th class="px-6 py-3.5">Method</th>
                    <th class="px-6 py-3.5">Date</th>
                    <th class="px-6 py-3.5 text-right">Receipt</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @forelse($payments as $payment)
                    <tr class="hover:bg-slate-50/50 transition">
                        <td class="px-6 py-4 font-mono font-bold text-xs text-slate-900">
                            {{ $payment->invoice_number }}
                        </td>
                        <td class="px-6 py-4">
                            <span class="font-semibold text-slate-800">{{ $payment->booking->guest->name ?? 'Guest' }}</span>
                            <span class="block text-xs text-slate-400">{{ $payment->booking->guest->phone ?? '' }}</span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="font-medium text-slate-800">{{ $payment->booking->property->name ?? '' }}</span>
                            <span class="block text-xs uppercase font-semibold text-blue-600">{{ $payment->booking->booking_type }}</span>
                        </td>
                        <td class="px-6 py-4 font-bold text-emerald-600">
                            {{ $payment->currency }} {{ number_format($payment->amount, 2) }}
                        </td>
                        <td class="px-6 py-4 capitalize text-xs">
                            <span class="px-2.5 py-1 rounded-full font-bold uppercase text-[10px] {{ in_array($payment->payment_method, ['esewa', 'khalti']) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700' }}">
                                {{ $payment->payment_method }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-500">
                            {{ $payment->payment_date ? $payment->payment_date->format('M d, Y h:i A') : 'N/A' }}
                        </td>
                        <td class="px-6 py-4 text-right">
                            <a href="{{ route('admin.billing.invoice', $payment) }}" target="_blank" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs">
                                View Receipt
                            </a>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="px-6 py-8 text-center text-slate-400">
                            No billing records found.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        @if($payments->hasPages())
            <div class="p-4 border-t border-slate-100">
                {{ $payments->links() }}
            </div>
        @endif
    </div>
</div>
@endsection
