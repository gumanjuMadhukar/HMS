<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HMS - Complete Hotel Booking & Hostel Management Platform</title>
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
                    <span class="font-bold text-slate-900 text-lg">HMS Platform</span>
                    <span class="hidden sm:inline-block text-xs text-blue-600 font-semibold ml-2 bg-blue-50 px-2 py-0.5 rounded-full">Global & Nepal (NPR / USD)</span>
                </div>
            </a>

            <div class="flex items-center gap-5 text-sm font-medium">
                <a href="{{ route('hotels.index') }}" class="text-blue-600 font-bold hover:text-blue-700">🏨 Hotels & Resorts</a>
                <a href="{{ route('hostels.index') }}" class="text-amber-600 font-bold hover:text-amber-700">🏢 Hostels & PGs</a>
                @auth
                    <a href="{{ route('dashboard') }}" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white shadow-sm hover:bg-slate-800">
                        My Portal &rarr;
                    </a>
                @else
                    <a href="{{ route('login') }}" class="text-slate-700 hover:text-slate-900">Sign In</a>
                    <a href="{{ route('register') }}" class="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition">Sign Up</a>
                @endauth
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-20 px-4 sm:px-6 relative overflow-hidden">
        <div class="max-w-5xl mx-auto text-center relative z-10">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Multi-Tenant Modular Architecture
            </span>
            <h1 class="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                Complete Hotel Booking & <br>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">Hostel Management System</span>
            </h1>
            <p class="text-slate-300 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
                Built for global operations starting in Nepal. Supporting hotel luxury stays, student hostel bed allocations, mess meal plans, dynamic RBAC, and Passport OAuth API.
            </p>

            <!-- Dual Core Choice Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-4xl mx-auto text-left">
                <!-- Hotel Booking Card -->
                <a href="{{ route('hotels.index') }}" class="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-3xl p-6 border border-white/15 transition group">
                    <div class="flex items-center justify-between mb-4">
                        <span class="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                            🏨
                        </span>
                        <span class="text-xs text-blue-300 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                            Explore Hotels &rarr;
                        </span>
                    </div>
                    <h3 class="text-xl font-bold text-white">Hotel Booking System</h3>
                    <p class="text-xs text-slate-300 mt-2">
                        Luxury resorts, boutique stays in Pokhara, Kathmandu & Chitwan. Nightly rates, suites, breakfast inclusions, and instant reservations.
                    </p>
                </a>

                <!-- Hostel Management Card -->
                <a href="{{ route('hostels.index') }}" class="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-3xl p-6 border border-white/15 transition group">
                    <div class="flex items-center justify-between mb-4">
                        <span class="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                            🏢
                        </span>
                        <span class="text-xs text-amber-300 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                            Explore Hostels &rarr;
                        </span>
                    </div>
                    <h3 class="text-xl font-bold text-white">Hostel Management (HMS)</h3>
                    <p class="text-xs text-slate-300 mt-2">
                        Boys & Girls university hostels. Dormitory beds, mess meal plans, student admissions, guardian verifications, and monthly fee collections.
                    </p>
                </a>
            </div>

            <div class="mt-8 flex items-center justify-center gap-4">
                <a href="{{ route('login') }}" class="px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-xl hover:bg-slate-100 transition">
                    Access Portal (Admin / Owner / Staff)
                </a>
            </div>
        </div>
    </section>

    <!-- Key Platform Highlights -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div class="text-center max-w-2xl mx-auto pb-12">
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900">Engineered for Global & Nepal Operations</h2>
            <p class="text-xs text-slate-500 mt-2">From boutique resorts in Pokhara to university student hostels in Kathmandu</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div class="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <i data-lucide="hotel" class="w-5 h-5"></i>
                </div>
                <h3 class="font-bold text-slate-900 text-base">Hotel Engine</h3>
                <p class="text-xs text-slate-500 mt-2">
                    Dynamic nightly pricing, room occupancy grids, check-in & check-out, tax invoices, and meal plan setups.
                </p>
            </div>

            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div class="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                    <i data-lucide="bed-single" class="w-5 h-5"></i>
                </div>
                <h3 class="font-bold text-slate-900 text-base">Hostel Bed Allocations</h3>
                <p class="text-xs text-slate-500 mt-2">
                    Granular bed tracking (Bed A, Bed B, Lower/Upper bunk), 4-time mess billing, and emergency guardian records.
                </p>
            </div>

            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div class="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                    <i data-lucide="shield-check" class="w-5 h-5"></i>
                </div>
                <h3 class="font-bold text-slate-900 text-base">Dynamic RBAC & API</h3>
                <p class="text-xs text-slate-500 mt-2">
                    Multiple user accounts (Super Admin, Hotelier, Warden, Staff, Guest), dynamic permission matrix, and Passport Bearer token auth.
                </p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>&copy; {{ date('Y') }} HMS Complete Platform. Local Domain: <code class="text-blue-400">hms.local:8081</code></p>
            <div class="flex items-center gap-4">
                <a href="{{ route('hotels.index') }}" class="hover:text-white">Hotels</a>
                <a href="{{ route('hostels.index') }}" class="hover:text-white">Hostels</a>
                <a href="{{ route('login') }}" class="hover:text-white">Sign In</a>
            </div>
        </div>
    </footer>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
