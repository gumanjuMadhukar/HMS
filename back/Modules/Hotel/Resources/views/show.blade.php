<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $hotel->name }} - HMS Hotel Booking</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="min-h-full font-sans antialiased text-slate-800 flex flex-col">
    <!-- Navbar -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="{{ route('hotels.index') }}" class="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm">
                &larr; Back to Hotels
            </a>
            <div class="font-bold text-slate-900">{{ $hotel->name }}</div>
            <a href="{{ route('home') }}" class="text-xs text-blue-600 font-semibold hover:underline">HMS Portal</a>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <!-- Hotel Header -->
        <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div class="flex items-center gap-2 text-amber-400 text-sm mb-1">
                        @for($i = 0; $i < $hotel->star_rating; $i++) ★ @endfor
                        <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {{ $hotel->property_type }}
                        </span>
                    </div>
                    <h1 class="text-3xl font-extrabold text-slate-900">{{ $hotel->name }}</h1>
                    <p class="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                        <i data-lucide="map-pin" class="w-4 h-4 text-blue-600"></i>
                        {{ $hotel->address }}, {{ $hotel->city }}, {{ $hotel->country }}
                    </p>
                </div>
                <div class="text-right">
                    <span class="text-xs text-slate-400 font-medium block">Front Desk Inquiries</span>
                    <p class="font-bold text-slate-800 text-sm">{{ $hotel->phone ?? '+977-1-4XXXXXX' }}</p>
                    <p class="text-xs text-slate-500">{{ $hotel->email ?? 'reception@hotel.local' }}</p>
                </div>
            </div>

            <p class="text-sm text-slate-600 mt-6 leading-relaxed border-t border-slate-100 pt-6">
                {{ $hotel->description }}
            </p>
        </div>

        <!-- Available Rooms for Booking -->
        <h2 class="text-2xl font-bold text-slate-900 mb-6">Select Your Room / Suite</h2>

        <div class="space-y-6">
            @forelse($hotel->rooms as $room)
                <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6" x-data="{ bookModal: false }">
                    <div class="flex-1">
                        <div class="flex items-center gap-3">
                            <h3 class="text-xl font-bold text-slate-900">Room {{ $room->room_number }} - {{ ucfirst($room->type) }}</h3>
                            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                                Instant Booking
                            </span>
                        </div>
                        <p class="text-xs text-slate-500 mt-1">Floor {{ $room->floor }} • Accommodates up to {{ $room->capacity }} Guests</p>
                        <p class="text-xs text-slate-600 mt-2">{{ $room->description }}</p>
                    </div>

                    <div class="flex md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                        <div>
                            <span class="text-2xl font-bold text-slate-900">${{ number_format($room->price_per_night, 0) }}</span>
                            <span class="text-xs text-slate-400">/ night</span>
                        </div>

                        <button @click="bookModal = true" class="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition">
                            Reserve Room
                        </button>

                        <!-- Booking Modal -->
                        <div x-show="bookModal" class="fixed inset-0 z-50 overflow-y-auto text-left" style="display: none;">
                            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="bookModal = false"></div>
                            <div class="flex items-center justify-center min-h-screen p-4">
                                <div class="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border">
                                    <div class="flex items-center justify-between pb-3 border-b">
                                        <div>
                                            <h4 class="font-bold text-slate-900 text-base">Book Room {{ $room->room_number }}</h4>
                                            <p class="text-xs text-slate-500">{{ $hotel->name }} (${{ number_format($room->price_per_night, 0) }}/night)</p>
                                        </div>
                                        <button @click="bookModal = false" class="text-slate-400 hover:text-slate-600">&times;</button>
                                    </div>

                                    <form action="{{ route('hotels.book') }}" method="POST" class="mt-4 space-y-3">
                                        @csrf
                                        <input type="hidden" name="room_id" value="{{ $room->id }}">

                                        <div>
                                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Primary Guest Full Name</label>
                                            <input type="text" name="name" value="{{ auth()->user()->name ?? '' }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                        </div>

                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Mobile / WhatsApp</label>
                                                <input type="text" name="phone" placeholder="+977-98..." required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Email</label>
                                                <input type="email" name="email" value="{{ auth()->user()->email ?? '' }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Check-In Date</label>
                                                <input type="date" name="check_in_date" value="{{ date('Y-m-d') }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Check-Out Date</label>
                                                <input type="date" name="check_out_date" value="{{ date('Y-m-d', strtotime('+2 days')) }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-3 gap-3">
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Adults</label>
                                                <input type="number" name="adults" value="1" min="1" max="{{ $room->capacity }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Children</label>
                                                <input type="number" name="children" value="0" min="0" class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Meal Plan</label>
                                                <select name="meal_plan" class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                                    <option value="ep">Room Only (EP)</option>
                                                    <option value="cp">Breakfast Included (CP)</option>
                                                    <option value="map">Breakfast & Dinner (MAP)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="flex justify-end gap-2 pt-3 border-t">
                                            <button type="button" @click="bookModal = false" class="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                            <button type="submit" class="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">Confirm Hotel Stay</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            @empty
                <div class="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400">
                    No vacant rooms right now in this hotel.
                </div>
            @endforelse
        </div>
    </main>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
