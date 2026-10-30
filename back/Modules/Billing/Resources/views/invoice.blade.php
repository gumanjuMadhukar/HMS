<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-100">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt #{{ $payment->invoice_number }} - HMS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            .no-print { display: none !important; }
            body { background: white !important; }
            .print-shadow-none { box-shadow: none !important; border: none !important; }
        }
    </style>
</head>
<body class="p-4 sm:p-10 font-sans antialiased text-slate-800">
    <div class="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 print-shadow-none">
        <!-- Print Toolbar -->
        <div class="no-print flex justify-end gap-3 pb-6 border-b border-slate-100 mb-6">
            <button onclick="window.print()" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition">
                🖨️ Print Receipt
            </button>
            <button onclick="window.close()" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition">
                Close
            </button>
        </div>

        <!-- Header -->
        <div class="flex justify-between items-start pb-8 border-b border-slate-100">
            <div>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 mb-2 inline-block">
                    {{ ucfirst($payment->booking->booking_type) }} Settlement
                </span>
                <h1 class="text-2xl font-black text-slate-900">TAX INVOICE / RECEIPT</h1>
                <p class="text-xs text-slate-400 font-mono mt-1">Invoice: {{ $payment->invoice_number }}</p>
            </div>
            <div class="text-right">
                <h3 class="font-bold text-slate-900 text-base">{{ $payment->booking->property->name ?? 'HMS Property' }}</h3>
                <p class="text-xs text-slate-500 mt-0.5">{{ $payment->booking->property->address ?? '' }}</p>
                <p class="text-xs text-slate-400">{{ $payment->booking->property->city ?? '' }}, {{ $payment->booking->property->country ?? 'Nepal' }}</p>
            </div>
        </div>

        <!-- Meta -->
        <div class="grid grid-cols-2 gap-6 py-6 text-xs border-b border-slate-100">
            <div>
                <span class="text-slate-400 font-semibold uppercase tracking-wider block mb-1">Customer / Student</span>
                <p class="font-bold text-slate-900 text-sm">{{ $payment->booking->guest->name ?? 'Guest' }}</p>
                <p class="text-slate-500 mt-0.5">Phone: {{ $payment->booking->guest->phone ?? 'N/A' }}</p>
                @if($payment->booking->guest->institution)
                    <p class="text-slate-500">Org: {{ $payment->booking->guest->institution }}</p>
                @endif
            </div>
            <div class="text-right">
                <span class="text-slate-400 font-semibold uppercase tracking-wider block mb-1">Payment Confirmation</span>
                <p class="font-bold text-slate-900 text-sm">{{ $payment->currency }} {{ number_format($payment->amount, 2) }}</p>
                <p class="text-slate-500 mt-0.5 capitalize font-medium">Method: {{ $payment->payment_method }}</p>
                @if($payment->transaction_id)
                    <p class="text-slate-400 font-mono">Txn: {{ $payment->transaction_id }}</p>
                @endif
                <p class="text-slate-400">Date: {{ $payment->payment_date ? $payment->payment_date->format('M d, Y h:i A') : 'N/A' }}</p>
            </div>
        </div>

        <!-- Breakdown -->
        <table class="w-full text-left text-xs my-6">
            <thead>
                <tr class="border-b border-slate-200 text-slate-400 uppercase font-bold tracking-wider">
                    <th class="py-2">Particulars</th>
                    <th class="py-2">Duration / Period</th>
                    <th class="py-2 text-right">Amount</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                <tr>
                    <td class="py-3 font-semibold text-slate-900">
                        Room {{ $payment->booking->room->room_number }} 
                        @if($payment->booking->bed) ({{ $payment->booking->bed->bed_number }}) @endif
                        <span class="block text-[11px] font-normal text-slate-400">
                            Booking Ref: {{ $payment->booking->booking_code }} ({{ ucfirst($payment->booking->booking_type) }})
                        </span>
                    </td>
                    <td class="py-3 text-slate-600">
                        {{ $payment->booking->check_in_date->format('M d, Y') }} 
                        @if($payment->booking->check_out_date)
                            &rarr; {{ $payment->booking->check_out_date->format('M d, Y') }}
                        @endif
                    </td>
                    <td class="py-3 text-right font-bold text-slate-900">
                        {{ $payment->currency }} {{ number_format($payment->amount, 2) }}
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Amount Banner -->
        <div class="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 flex items-center justify-between text-emerald-900">
            <div>
                <span class="font-bold text-xs uppercase tracking-wider block">Total Received</span>
                <span class="text-xs text-emerald-700">Status: Verified & Cleared</span>
            </div>
            <span class="text-3xl font-black">{{ $payment->currency }} {{ number_format($payment->amount, 2) }}</span>
        </div>

        <p class="text-center text-[11px] text-slate-400 mt-8">
            Thank you for your business! This is an electronically generated receipt from HMS.
        </p>
    </div>
</body>
</html>
