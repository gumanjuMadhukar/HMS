<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmed - {{ $booking->booking_code }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="min-h-full font-sans antialiased text-slate-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 text-center">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <i data-lucide="check" class="w-8 h-8"></i>
        </div>

        <span class="text-xs font-bold uppercase tracking-widest text-emerald-600">
            {{ $booking->booking_type === 'hotel' ? 'Hotel Reservation Confirmed' : 'Hostel Admission Submitted' }}
        </span>
        <h2 class="text-2xl font-bold text-slate-900 mt-1">Thank You, {{ $booking->guest->name }}!</h2>
        <p class="text-xs text-slate-500 mt-1">Your code has been issued. Management will verify upon arrival.</p>

        <!-- Booking Details Card -->
        <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200 mt-6 text-left space-y-2.5 text-xs">
            <div class="flex justify-between items-center pb-2 border-b border-slate-200">
                <span class="text-slate-500 font-medium">Reference Code</span>
                <span class="font-mono font-bold text-blue-600 text-sm">{{ $booking->booking_code }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-500 font-medium">Facility</span>
                <span class="font-semibold text-slate-900">{{ $booking->property->name ?? '' }} ({{ ucfirst($booking->booking_type) }})</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-500 font-medium">Room & Accommodation</span>
                <span class="font-semibold text-slate-900">
                    Room {{ $booking->room->room_number }} 
                    @if($booking->bed) ({{ $booking->bed->bed_number }}) @endif
                </span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-500 font-medium">Effective Date</span>
                <span class="font-semibold text-slate-900">{{ $booking->check_in_date->format('M d, Y') }}</span>
            </div>
            @if($booking->check_out_date)
                <div class="flex justify-between">
                    <span class="text-slate-500 font-medium">{{ $booking->booking_type === 'hotel' ? 'Check-Out' : 'Month Cycle Ends' }}</span>
                    <span class="font-semibold text-slate-900">{{ $booking->check_out_date->format('M d, Y') }}</span>
                </div>
            @endif
            @if($booking->meal_plan)
                <div class="flex justify-between">
                    <span class="text-slate-500 font-medium">Meal Plan</span>
                    <span class="font-semibold uppercase text-slate-700">{{ str_replace('_', ' ', $booking->meal_plan) }}</span>
                </div>
            @endif
            <div class="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900 text-sm">
                <span>{{ $booking->booking_type === 'hotel' ? 'Total Amount' : '1st Month Rent' }}</span>
                <span class="text-emerald-600">${{ number_format($booking->total_amount, 2) }}</span>
            </div>
        </div>

        <div class="mt-6 flex flex-col gap-2">
            <a href="{{ route('home') }}" class="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition">
                Return to HMS Homepage
            </a>
            @auth
                <a href="{{ route('dashboard') }}" class="text-xs text-blue-600 font-semibold hover:underline py-1">
                    Go to My Portal &rarr;
                </a>
            @endauth
        </div>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
