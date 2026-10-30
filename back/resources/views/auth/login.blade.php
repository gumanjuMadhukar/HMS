<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-900">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - HMS Portal</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="h-full flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-100" x-data="{ email: '', password: '' }">
        <div class="text-center pb-6 border-b border-slate-100">
            <div class="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg shadow-blue-500/30">
                H
            </div>
            <h2 class="text-2xl font-bold text-slate-900 mt-3">Welcome to HMS</h2>
            <p class="text-xs text-slate-500 mt-1">Multi-Tenant Hostel, Hotel & Rental SaaS</p>
        </div>

        <!-- 1-Click Demo Fill Pills -->
        <div class="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Quick Demo Accounts</span>
            <div class="grid grid-cols-3 gap-2 text-[11px]">
                <button type="button" @click="email = 'admin@hms.local'; password = 'password123'" class="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold text-center transition">
                    👑 Admin
                </button>
                <button type="button" @click="email = 'owner@hms.local'; password = 'password123'" class="p-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-semibold text-center transition">
                    🏢 Owner
                </button>
                <button type="button" @click="email = 'finder@hms.local'; password = 'password123'" class="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold text-center transition">
                    🔍 Finder
                </button>
            </div>
        </div>

        @if($errors->any())
            <div class="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {{ $errors->first() }}
            </div>
        @endif

        <form action="{{ route('login') }}" method="POST" class="mt-5 space-y-4">
            @csrf
            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
                <input type="email" name="email" x-model="email" required placeholder="admin@hms.local" class="w-full text-sm rounded-xl border border-slate-300 p-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Password</label>
                <input type="password" name="password" x-model="password" required placeholder="••••••••" class="w-full text-sm rounded-xl border border-slate-300 p-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
            </div>

            <div class="flex items-center justify-between text-xs">
                <label class="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input type="checkbox" name="remember" class="rounded border-slate-300 text-blue-600">
                    Remember Me
                </label>
                <a href="{{ route('home') }}" class="text-blue-600 hover:underline">Back to Public Portal</a>
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition">
                Sign In to Portal
            </button>
        </form>

        <p class="text-center text-xs text-slate-500 mt-6">
            Don't have an account? <a href="{{ route('register') }}" class="text-blue-600 font-bold hover:underline">Sign Up</a>
        </p>
    </div>
</body>
</html>

