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
                <h1 class="text-2xl font-black text-slate-900">PAYMENT RECEIPT</h1>
                <p class="text-xs text-slate-400 font-mono mt-1">Invoice: {{ $payment->invoice_number }}</p>
            </div>
            <div class="text-right">
                <h3 class="font-bold text-slate-900 text-base">{{ $payment->booking->room->property->name ?? 'HMS Property' }}</h3>
                <p class="text-xs text-slate-500 mt-0.5">{{ $payment->booking->room->property->address ?? '' }}</p>
                <p class="text-xs text-slate-400">{{ $payment->booking->room->property->city ?? '' }}</p>
            </div>
        </div>

        <!-- Meta -->
        <div class="grid grid-cols-2 gap-6 py-6 text-xs border-b border-slate-100">
            <div>
                <span class="text-slate-400 font-semibold uppercase tracking-wider block mb-1">Billed To</span>
                <p class="font-bold text-slate-900 text-sm">{{ $payment->booking->guest->name ?? 'Guest' }}</p>
                <p class="text-slate-500 mt-0.5">Phone: {{ $payment->booking->guest->phone ?? 'N/A' }}</p>
                <p class="text-slate-500">Email: {{ $payment->booking->guest->email ?? 'N/A' }}</p>
            </div>
            <div class="text-right">
                <span class="text-slate-400 font-semibold uppercase tracking-wider block mb-1">Payment Info</span>
                <p class="font-bold text-slate-900 text-sm">${{ number_format($payment->amount, 2) }} (Paid)</p>
                <p class="text-slate-500 mt-0.5 capitalize">Method: {{ $payment->payment_method }}</p>
                <p class="text-slate-400">Date: {{ $payment->payment_date ? $payment->payment_date->format('M d, Y h:i A') : 'N/A' }}</p>
            </div>
        </div>

        <!-- Item Breakdown -->
        <table class="w-full text-left text-xs my-6">
            <thead>
                <tr class="border-b border-slate-200 text-slate-400 uppercase font-bold tracking-wider">
                    <th class="py-2">Description</th>
                    <th class="py-2">Stay Dates</th>
                    <th class="py-2 text-right">Amount</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                <tr>
                    <td class="py-3 font-semibold text-slate-900">
                        Room {{ $payment->booking->room->room_number }} ({{ ucfirst($payment->booking->room->type) }})
                        <span class="block text-[11px] font-normal text-slate-400">Booking Code: {{ $payment->booking->booking_code }}</span>
                    </td>
                    <td class="py-3 text-slate-600">
                        {{ $payment->booking->check_in_date->format('M d') }} - {{ $payment->booking->check_out_date->format('M d, Y') }}
                    </td>
                    <td class="py-3 text-right font-bold text-slate-900">
                        ${{ number_format($payment->amount, 2) }}
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Total Paid Banner -->
        <div class="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between text-emerald-900">
            <span class="font-bold text-xs uppercase tracking-wider">Amount Paid</span>
            <span class="text-2xl font-black">${{ number_format($payment->amount, 2) }}</span>
        </div>

        <p class="text-center text-[11px] text-slate-400 mt-8">
            Thank you for staying with us! For inquiries, contact management.
        </p>
    </div>
</body>
</html>

