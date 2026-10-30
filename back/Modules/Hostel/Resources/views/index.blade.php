<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hostels & PG Residences - HMS Hostel Management</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="min-h-full font-sans antialiased text-slate-800 flex flex-col">
    <!-- Navbar -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="{{ route('home') }}" class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    H
                </div>
                <div>
                    <span class="font-bold text-slate-900 text-lg">HMS Hostels</span>
                    <span class="hidden sm:inline-block text-xs text-amber-600 font-semibold ml-2 bg-amber-50 px-2 py-0.5 rounded-full">Students & Professionals</span>
                </div>
            </a>

            <div class="flex items-center gap-5 text-sm font-medium">
                <a href="{{ route('hotels.index') }}" class="text-slate-600 hover:text-slate-900">Hotels</a>
                <a href="{{ route('hostels.index') }}" class="text-amber-600 font-bold">Hostels & PGs</a>
                @auth
                    <a href="{{ route('dashboard') }}" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white shadow-sm hover:bg-slate-800">
                        My Portal
                    </a>
                @else
                    <a href="{{ route('login') }}" class="text-slate-700 hover:text-slate-900">Sign In</a>
                    <a href="{{ route('register') }}" class="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-white shadow-sm hover:bg-amber-600">Sign Up</a>
                @endauth
            </div>
        </div>
    </header>

    <!-- Hero Search -->
    <div class="bg-gradient-to-r from-slate-950 via-amber-950 to-slate-900 text-white py-12 px-4 sm:px-6">
        <div class="max-w-5xl mx-auto text-center">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-3">
                Hostel Admissions & Bed Vacancies
            </span>
            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight">Find Hostels & Paying Guest (PG) Rooms</h1>
            <p class="text-slate-300 text-sm mt-2">Verified hostels with hygienic meals, 24/7 Wi-Fi, study atmosphere, and strict security.</p>

            <form action="{{ route('hostels.index') }}" method="GET" class="mt-8 bg-white text-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-100 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">City / Hub</label>
                    <select name="city" class="w-full text-xs rounded-lg border border-slate-300 p-2.5">
                        <option value="">All Locations</option>
                        @foreach($cities as $city)
                            <option value="{{ $city }}" {{ request('city') == $city ? 'selected' : '' }}>{{ $city }}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">Gender Accommodation</label>
                    <select name="gender_policy" class="w-full text-xs rounded-lg border border-slate-300 p-2.5">
                        <option value="">All Hostels</option>
                        <option value="boys_only" {{ request('gender_policy') == 'boys_only' ? 'selected' : '' }}>👨 Boys Hostel Only</option>
                        <option value="girls_only" {{ request('gender_policy') == 'girls_only' ? 'selected' : '' }}>👩 Girls Hostel Only</option>
                        <option value="co_ed" {{ request('gender_policy') == 'co_ed' ? 'selected' : '' }}>🏢 Co-Living Residence</option>
                    </select>
                </div>

                <div class="flex items-end">
                    <button type="submit" class="w-full h-[38px] rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md">
                        <i data-lucide="search" class="w-4 h-4"></i>
                        Filter Hostels
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Hostel Results Grid -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @forelse($hostels as $hostel)
                <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition flex flex-col justify-between overflow-hidden">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-2">
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider {{ $hostel->gender_policy === 'boys_only' ? 'bg-blue-100 text-blue-800' : ($hostel->gender_policy === 'girls_only' ? 'bg-pink-100 text-pink-800' : 'bg-purple-100 text-purple-800') }}">
                                {{ str_replace('_', ' ', $hostel->gender_policy) }}
                            </span>
                            <span class="text-xs font-medium text-slate-500">
                                {{ $hostel->city }}
                            </span>
                        </div>

                        <h3 class="font-bold text-xl text-slate-900 mt-1">{{ $hostel->name }}</h3>
                        <p class="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-500"></i>
                            {{ $hostel->address }}
                        </p>

                        <p class="text-xs text-slate-600 mt-3 line-clamp-2">{{ $hostel->description }}</p>

                        <!-- Highlights -->
                        <div class="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-slate-600">
                            @foreach(($hostel->amenities ?? ['wifi', 'meals', 'hot_water', 'laundry']) as $amenity)
                                <span class="bg-amber-50/70 text-amber-900 px-2 py-0.5 rounded border border-amber-100 font-medium text-[10px]">
                                    ✓ {{ str_replace('_', ' ', $amenity) }}
                                </span>
                            @endforeach
                        </div>
                    </div>

                    <div class="bg-slate-50 p-5 border-t border-slate-100 flex items-center justify-between">
                        <div>
                            <span class="text-xs text-slate-400 font-medium block">Monthly Rent</span>
                            @php
                                $minRent = $hostel->rooms->min('price_per_month') ?? 180;
                            @endphp
                            <span class="text-xl font-bold text-slate-900">${{ number_format($minRent, 0) }}</span>
                            <span class="text-xs text-slate-500 font-normal">/ month</span>
                        </div>
                        <a href="{{ route('hostels.show', $hostel->slug) }}" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition">
                            Check Beds &rarr;
                        </a>
                    </div>
                </div>
            @empty
                <div class="col-span-3 py-16 text-center bg-white rounded-3xl border border-slate-200">
                    <h3 class="font-bold text-slate-700">No hostels match the criteria</h3>
                    <p class="text-xs text-slate-400 mt-1">Try resetting the gender or location filter.</p>
                </div>
            @endforelse
        </div>

        @if($hostels->hasPages())
            <div class="mt-8">
                {{ $hostels->links() }}
            </div>
        @endif
    </main>

    <footer class="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            &copy; {{ date('Y') }} HMS Hostel Management System. Tested on <code class="text-amber-400">hms.local:8081</code>
        </div>
    </footer>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
