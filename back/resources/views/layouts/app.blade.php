<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Dashboard') - HMS</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Alpine.js -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#eff6ff',
                            100: '#dbeafe',
                            500: '#3b82f6',
                            600: '#2563eb',
                            700: '#1d4ed8',
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="h-full font-sans antialiased text-slate-800" x-data="{ sidebarOpen: false }">
    <div class="min-h-full flex flex-col lg:flex-row">
        <!-- Sidebar Navigation -->
        <aside class="w-full lg:w-64 bg-slate-900 text-slate-200 flex-shrink-0 flex flex-col justify-between p-4 shadow-xl">
            <div>
                <!-- Brand Header -->
                <div class="flex items-center justify-between pb-6 border-b border-slate-800">
                    <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
                            H
                        </div>
                        <div>
                            <span class="font-bold text-white text-lg tracking-wide">HMS Portal</span>
                            <span class="block text-xs text-blue-400 font-medium">Hostel & Hotel SaaS</span>
                        </div>
                    </a>
                </div>

                <!-- Navigation Links -->
                <nav class="mt-6 space-y-1.5 text-sm font-medium">
                    @if(auth()->user()->hasRole('super_admin'))
                        <a href="{{ route('admin.dashboard') }}" 
                           class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition {{ request()->routeIs('admin.dashboard') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                            <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
                            Admin Overview
                        </a>
                        <a href="{{ route('admin.rooms.index') }}" 
                           class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition {{ request()->routeIs('admin.rooms.*') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                            <i data-lucide="bed-double" class="w-5 h-5"></i>
                            Rooms & Beds
                        </a>
                        <a href="{{ route('admin.bookings.index') }}" 
                           class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition {{ request()->routeIs('admin.bookings.*') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                            <i data-lucide="calendar-check" class="w-5 h-5"></i>
                            Bookings & Stays
                        </a>
                        <a href="{{ route('admin.guests.index') }}" 
                           class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition {{ request()->routeIs('admin.guests.*') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                            <i data-lucide="users" class="w-5 h-5"></i>
                            Tenants & Guests
                        </a>
                        <a href="{{ route('admin.payments.index') }}" 
                           class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition {{ request()->routeIs('admin.payments.*') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                            <i data-lucide="credit-card" class="w-5 h-5"></i>
                            Billing & Payments
                        </a>
                        <a href="{{ route('admin.rbac.index') }}" 
                           class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition {{ request()->routeIs('admin.rbac.*') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                            <i data-lucide="shield-check" class="w-5 h-5"></i>
                            Dynamic RBAC Matrix
                        </a>
                    @endif

                    @if(auth()->user()->hasRole('owner'))
                        <div class="pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">Owner Panel</div>
                        <a href="{{ route('owner.dashboard') }}" 
                           class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition {{ request()->routeIs('owner.dashboard') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                            <i data-lucide="gauge" class="w-5 h-5"></i>
                            Owner Dashboard
                        </a>
                        <a href="{{ route('owner.properties.index') }}" 
                           class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition {{ request()->routeIs('owner.properties.*') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                            <i data-lucide="building-2" class="w-5 h-5"></i>
                            My Properties
                        </a>
                    @endif

                    @if(auth()->user()->hasRole('finder'))
                        <div class="pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">Tenant & Finder</div>
                        <a href="{{ route('finder.my-bookings') }}" 
                           class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition {{ request()->routeIs('finder.my-bookings') ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                            <i data-lucide="bookmark-check" class="w-5 h-5"></i>
                            My Reservations
                        </a>
                    @endif

                    <div class="pt-3 border-t border-slate-800 space-y-1">
                        <a href="{{ route('finder.index') }}" target="_blank"
                           class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition">
                            <i data-lucide="compass" class="w-4 h-4 text-blue-400"></i>
                            User Finder Portal
                        </a>
                        <a href="{{ route('home') }}" target="_blank"
                           class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition">
                            <i data-lucide="globe" class="w-4 h-4 text-emerald-400"></i>
                            Public Landing
                        </a>
                    </div>
                </nav>
            </div>

            <!-- User Info & Logout -->
            <div class="pt-6 border-t border-slate-800">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-white">
                            {{ substr(auth()->user()->name ?? 'Admin', 0, 1) }}
                        </div>
                        <div class="overflow-hidden">
                            <p class="text-xs font-semibold text-white truncate">{{ auth()->user()->name ?? 'Administrator' }}</p>
                            <p class="text-[11px] text-slate-400 truncate">{{ auth()->user()->email ?? 'admin@hms.local' }}</p>
                        </div>
                    </div>
                    <form action="{{ route('logout') }}" method="POST">
                        @csrf
                        <button type="submit" title="Logout" class="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition">
                            <i data-lucide="log-out" class="w-4 h-4"></i>
                        </button>
                    </form>
                </div>
            </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-h-screen overflow-x-hidden">
            <!-- Top Navbar -->
            <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <div class="flex items-center gap-4">
                    <h1 class="text-xl font-bold text-slate-800">@yield('page_title', 'Dashboard')</h1>
                </div>

                <div class="flex items-center gap-3">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Online (hms.local)
                    </span>
                    @yield('actions')
                </div>
            </header>

            <!-- Flash Messages -->
            @if(session('success'))
                <div class="mx-6 mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-sm">
                    <div class="flex items-center gap-2">
                        <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-600"></i>
                        <span>{{ session('success') }}</span>
                    </div>
                </div>
            @endif

            @if($errors->any())
                <div class="mx-6 mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 shadow-sm">
                    <div class="font-medium mb-1">Please fix the following issues:</div>
                    <ul class="list-disc list-inside text-sm">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <!-- Page Body -->
            <main class="flex-1 p-6">
                @yield('content')
            </main>
        </div>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
