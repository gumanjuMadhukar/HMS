<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotels & Resorts - HMS Hotel Booking</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="min-h-full font-sans antialiased text-slate-800 flex flex-col">
    <!-- Navbar -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="{{ route('home') }}" class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    H
                </div>
                <div>
                    <span class="font-bold text-slate-900 text-lg">HMS Hotels</span>
                    <span class="hidden sm:inline-block text-xs text-blue-600 font-semibold ml-2 bg-blue-50 px-2 py-0.5 rounded-full">Global & Nepal</span>
                </div>
            </a>

            <div class="flex items-center gap-5 text-sm font-medium">
                <a href="{{ route('hotels.index') }}" class="text-blue-600 font-bold">Hotels</a>
                <a href="{{ route('hostels.index') }}" class="text-slate-600 hover:text-slate-900">Hostels & PGs</a>
                @auth
                    <a href="{{ route('dashboard') }}" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white shadow-sm hover:bg-slate-800">
                        My Portal
                    </a>
                @else
                    <a href="{{ route('login') }}" class="text-slate-700 hover:text-slate-900">Sign In</a>
                    <a href="{{ route('register') }}" class="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-sm">Sign Up</a>
                @endauth
            </div>
        </div>
    </header>

    <!-- Hero Filter Bar -->
    <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white py-12 px-4 sm:px-6">
        <div class="max-w-5xl mx-auto text-center">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
                Verified Hotels & Luxury Resorts
            </span>
            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight">Book Your Hotel Stay</h1>
            <p class="text-slate-300 text-sm mt-2">Explore top rated boutique hotels, business suites, and mountain lodges.</p>

            <form action="{{ route('hotels.index') }}" method="GET" class="mt-8 bg-white text-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-100 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">Destination City</label>
                    <select name="city" class="w-full text-xs rounded-lg border border-slate-300 p-2.5">
                        <option value="">All Destinations</option>
                        @foreach($cities as $city)
                            <option value="{{ $city }}" {{ request('city') == $city ? 'selected' : '' }}>{{ $city }}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">Star Category</label>
                    <select name="star_rating" class="w-full text-xs rounded-lg border border-slate-300 p-2.5">
                        <option value="">All Ratings</option>
                        <option value="5" {{ request('star_rating') == '5' ? 'selected' : '' }}>⭐⭐⭐⭐⭐ 5 Star Luxury</option>
                        <option value="4" {{ request('star_rating') == '4' ? 'selected' : '' }}>⭐⭐⭐⭐ 4 Star Premium</option>
                        <option value="3" {{ request('star_rating') == '3' ? 'selected' : '' }}>⭐⭐⭐ 3 Star Comfort</option>
                    </select>
                </div>

                <div class="flex items-end">
                    <button type="submit" class="w-full h-[38px] rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md">
                        <i data-lucide="search" class="w-4 h-4"></i>
                        Find Hotels
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Hotel Results -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @forelse($hotels as $hotel)
                <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition flex flex-col justify-between overflow-hidden">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex text-amber-400 text-xs">
                                @for($i = 0; $i < $hotel->star_rating; $i++)
                                    ★
                                @endfor
                            </div>
                            <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                {{ $hotel->city }}, {{ $hotel->country }}
                            </span>
                        </div>

                        <h3 class="font-bold text-xl text-slate-900 mt-1">{{ $hotel->name }}</h3>
                        <p class="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-blue-500"></i>
                            {{ $hotel->address }}
                        </p>

                        <p class="text-xs text-slate-600 mt-3 line-clamp-2">{{ $hotel->description }}</p>

                        <!-- Amenities -->
                        <div class="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-slate-600">
                            @foreach(($hotel->amenities ?? ['wifi', 'ac', 'breakfast']) as $amenity)
                                <span class="bg-slate-50 px-2 py-1 rounded-md border border-slate-100 uppercase tracking-wider font-medium text-[10px]">
                                    {{ str_replace('_', ' ', $amenity) }}
                                </span>
                            @endforeach
                        </div>
                    </div>

                    <div class="bg-slate-50 p-5 border-t border-slate-100 flex items-center justify-between">
                        <div>
                            <span class="text-xs text-slate-400 font-medium block">Starting from</span>
                            @php
                                $minPrice = $hotel->rooms->min('price_per_night') ?? 45;
                            @endphp
                            <span class="text-xl font-bold text-slate-900">${{ number_format($minPrice, 0) }}</span>
                            <span class="text-xs text-slate-500 font-normal">/ night</span>
                        </div>
                        <a href="{{ route('hotels.show', $hotel->slug) }}" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition">
                            View Rooms &rarr;
                        </a>
                    </div>
                </div>
            @empty
                <div class="col-span-3 py-16 text-center bg-white rounded-3xl border border-slate-200">
                    <h3 class="font-bold text-slate-700">No hotels found matching criteria</h3>
                    <p class="text-xs text-slate-400 mt-1">Try changing location or star rating filters.</p>
                </div>
            @endforelse
        </div>

        @if($hotels->hasPages())
            <div class="mt-8">
                {{ $hotels->links() }}
            </div>
        @endif
    </main>

    <footer class="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            &copy; {{ date('Y') }} HMS Hotel Booking Module. Tested on <code class="text-blue-400">hms.local:8081</code>
        </div>
    </footer>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
