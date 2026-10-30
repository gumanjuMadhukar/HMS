<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HMS Finder - Discover Hostels, Rooms & Rental Spaces</title>
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
                    <span class="font-bold text-slate-900 text-lg">HMS Finder</span>
                    <span class="hidden sm:inline-block text-xs text-blue-600 font-semibold ml-2 bg-blue-50 px-2 py-0.5 rounded-full">Explore & Book</span>
                </div>
            </a>

            <div class="flex items-center gap-4 text-sm font-medium">
                <a href="{{ route('finder.index') }}" class="text-blue-600 font-semibold">Find Rooms</a>
                @auth
                    @if(auth()->user()->hasRole('super_admin'))
                        <a href="{{ route('admin.dashboard') }}" class="text-slate-600 hover:text-slate-900">Admin Panel</a>
                    @elseif(auth()->user()->hasRole('owner'))
                        <a href="{{ route('owner.dashboard') }}" class="text-slate-600 hover:text-slate-900">Owner Panel</a>
                    @endif
                    <a href="{{ route('finder.my-bookings') }}" class="text-slate-600 hover:text-slate-900">My Bookings</a>
                    <form action="{{ route('logout') }}" method="POST" class="inline">
                        @csrf
                        <button type="submit" class="text-xs text-rose-600 hover:underline">Logout</button>
                    </form>
                @else
                    <a href="{{ route('login') }}" class="text-slate-700 hover:text-slate-900">Log In</a>
                    <a href="{{ route('register') }}" class="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition">Sign Up</a>
                @endauth
            </div>
        </div>
    </header>

    <!-- Search Hero & Filters -->
    <div class="bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white py-12 px-4 sm:px-6">
        <div class="max-w-5xl mx-auto text-center">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
                Live Vacancies & Direct Booking
            </span>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Find Verified Hostels & Rental Rooms</h1>
            <p class="text-slate-300 text-sm mt-2 max-w-2xl mx-auto">Instant search across student hostels, working professionals' residences, and boutique hotels.</p>

            <!-- Search Form Card -->
            <form action="{{ route('finder.index') }}" method="GET" class="mt-8 bg-white text-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-100 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left">
                <!-- City -->
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">City / Location</label>
                    <select name="city" class="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-blue-500">
                        <option value="">All Locations</option>
                        @foreach($cities as $city)
                            <option value="{{ $city }}" {{ request('city') == $city ? 'selected' : '' }}>{{ $city }}</option>
                        @endforeach
                    </select>
                </div>

                <!-- Property Type -->
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">Property Type</label>
                    <select name="property_type" class="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-blue-500">
                        <option value="">All Property Types</option>
                        <option value="hostel" {{ request('property_type') == 'hostel' ? 'selected' : '' }}>Student Hostel</option>
                        <option value="hotel" {{ request('property_type') == 'hotel' ? 'selected' : '' }}>Hotel / Lodge</option>
                        <option value="apartment" {{ request('property_type') == 'apartment' ? 'selected' : '' }}>Apartment</option>
                        <option value="coliving" {{ request('property_type') == 'coliving' ? 'selected' : '' }}>Co-Living</option>
                    </select>
                </div>

                <!-- Room Type -->
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">Room Category</label>
                    <select name="room_type" class="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-blue-500">
                        <option value="">All Room Types</option>
                        <option value="single" {{ request('room_type') == 'single' ? 'selected' : '' }}>Single Room</option>
                        <option value="double" {{ request('room_type') == 'double' ? 'selected' : '' }}>Double Shared</option>
                        <option value="dorm" {{ request('room_type') == 'dorm' ? 'selected' : '' }}>Dormitory</option>
                        <option value="deluxe" {{ request('room_type') == 'deluxe' ? 'selected' : '' }}>Deluxe</option>
                    </select>
                </div>

                <!-- Submit Button -->
                <div class="flex items-end">
                    <button type="submit" class="w-full h-[38px] rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md">
                        <i data-lucide="search" class="w-4 h-4"></i>
                        Filter Rooms
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Main Results Section -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div class="flex items-center justify-between pb-6">
            <div>
                <h2 class="text-xl font-bold text-slate-900">Available Rooms & Accommodations</h2>
                <p class="text-xs text-slate-500">{{ $rooms->total() }} spaces ready for check-in</p>
            </div>
            @if(request()->hasAny(['city', 'property_type', 'room_type', 'max_price']))
                <a href="{{ route('finder.index') }}" class="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1">
                    <i data-lucide="x" class="w-3.5 h-3.5"></i> Clear Filters
                </a>
            @endif
        </div>

        <!-- Room Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @forelse($rooms as $room)
                <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition flex flex-col justify-between overflow-hidden group">
                    <div class="p-6">
                        <!-- Property Badges -->
                        <div class="flex items-center justify-between mb-3">
                            <span class="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider {{ $room->property->type === 'hostel' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800' }}">
                                {{ $room->property->type ?? 'Hostel' }}
                            </span>
                            <span class="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Available
                            </span>
                        </div>

                        <div class="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-blue-500"></i>
                            {{ $room->property->city ?? 'Central' }} • {{ $room->property->name ?? '' }}
                        </div>

                        <h3 class="font-bold text-lg text-slate-900 mt-1">
                            Room {{ $room->room_number }} - {{ ucfirst($room->type) }}
                        </h3>

                        <p class="text-xs text-slate-500 mt-2 line-clamp-2">
                            {{ $room->description ?? 'Comfortable, well-ventilated accommodation with essential facilities.' }}
                        </p>

                        <!-- Highlights -->
                        <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                            <span class="flex items-center gap-1"><i data-lucide="user" class="w-3.5 h-3.5 text-slate-400"></i> Capacity: {{ $room->capacity }}</span>
                            <span class="flex items-center gap-1"><i data-lucide="layers" class="w-3.5 h-3.5 text-slate-400"></i> Floor {{ $room->floor }}</span>
                            <span class="flex items-center gap-1"><i data-lucide="wifi" class="w-3.5 h-3.5 text-slate-400"></i> Wi-Fi</span>
                        </div>
                    </div>

                    <!-- Card Footer & Instant Booking Modal -->
                    <div class="bg-slate-50/75 p-5 border-t border-slate-100 flex items-center justify-between" x-data="{ bookModal: false }">
                        <div>
                            <span class="text-xs text-slate-400 block font-medium">Daily Rate</span>
                            <span class="text-xl font-bold text-slate-900">${{ number_format($room->price_per_night, 0) }}</span>
                            <span class="text-xs text-slate-500 font-normal">/ night</span>
                        </div>

                        <button @click="bookModal = true" class="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm">
                            Book Now
                        </button>

                        <!-- Booking Modal -->
                        <div x-show="bookModal" class="fixed inset-0 z-50 overflow-y-auto text-left" style="display: none;">
                            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="bookModal = false"></div>
                            <div class="flex items-center justify-center min-h-screen p-4">
                                <div class="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border">
                                    <div class="flex items-center justify-between pb-3 border-b">
                                        <div>
                                            <h4 class="font-bold text-slate-900 text-base">Reserve Room {{ $room->room_number }}</h4>
                                            <p class="text-xs text-slate-500">{{ $room->property->name ?? '' }} (${{ number_format($room->price_per_night, 0) }}/night)</p>
                                        </div>
                                        <button @click="bookModal = false" class="text-slate-400 hover:text-slate-600">&times;</button>
                                    </div>

                                    <form action="{{ route('public.book') }}" method="POST" class="mt-4 space-y-3">
                                        @csrf
                                        <input type="hidden" name="room_id" value="{{ $room->id }}">

                                        <div>
                                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Your Full Name</label>
                                            <input type="text" name="name" value="{{ auth()->user()->name ?? '' }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                        </div>

                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone</label>
                                                <input type="text" name="phone" placeholder="98XXXXXXXX" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Email</label>
                                                <input type="email" name="email" value="{{ auth()->user()->email ?? '' }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Check-In</label>
                                                <input type="date" name="check_in_date" value="{{ date('Y-m-d') }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Check-Out</label>
                                                <input type="date" name="check_out_date" value="{{ date('Y-m-d', strtotime('+3 days')) }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                        </div>

                                        <div>
                                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Special Notes / Requests</label>
                                            <textarea name="notes" rows="2" placeholder="Arrival time, luggage requests..." class="w-full text-sm rounded-lg border border-slate-300 p-2.5"></textarea>
                                        </div>

                                        <div class="flex justify-end gap-2 pt-3 border-t">
                                            <button type="button" @click="bookModal = false" class="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                            <button type="submit" class="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">Confirm Reservation</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-span-3 py-16 text-center bg-white rounded-3xl border border-slate-200">
                    <i data-lucide="search-x" class="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
                    <h3 class="font-bold text-slate-700">No matching rooms found</h3>
                    <p class="text-xs text-slate-400 mt-1">Try adjusting your filters or location search.</p>
                </div>
            @endforelse
        </div>

        @if($rooms->hasPages())
            <div class="mt-8">
                {{ $rooms->links() }}
            </div>
        @endif
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>&copy; {{ date('Y') }} HMS - Multi-tenant Hostel & Hotel SaaS System. Local Domain: <code class="text-blue-400">hms.local</code></p>
            <div class="flex items-center gap-4">
                <a href="{{ route('home') }}" class="hover:text-white">Home</a>
                <a href="{{ route('login') }}" class="hover:text-white">Admin / Owner Login</a>
                <a href="{{ route('finder.index') }}" class="hover:text-white">Room Finder</a>
            </div>
        </div>
    </footer>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>

