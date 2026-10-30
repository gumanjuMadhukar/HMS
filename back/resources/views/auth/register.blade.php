<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-900">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - HMS Portal</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="h-full flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
        <div class="text-center pb-6 border-b border-slate-100">
            <div class="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg shadow-blue-500/30">
                H
            </div>
            <h2 class="text-2xl font-bold text-slate-900 mt-3">Create Your Account</h2>
            <p class="text-xs text-slate-500 mt-1">Join as a Room Finder or Property Owner</p>
        </div>

        @if($errors->any())
            <div class="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {{ $errors->first() }}
            </div>
        @endif

        <form action="{{ route('register') }}" method="POST" class="mt-5 space-y-4">
            @csrf
            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
                <input type="text" name="name" value="{{ old('name') }}" required placeholder="John Doe" class="w-full text-sm rounded-xl border border-slate-300 p-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
                <input type="email" name="email" value="{{ old('email') }}" required placeholder="john@example.com" class="w-full text-sm rounded-xl border border-slate-300 p-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Password</label>
                <input type="password" name="password" required placeholder="Min 8 characters" class="w-full text-sm rounded-xl border border-slate-300 p-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Confirm Password</label>
                <input type="password" name="password_confirmation" required placeholder="Repeat password" class="w-full text-sm rounded-xl border border-slate-300 p-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition">
                Create Account
            </button>
        </form>

        <p class="text-center text-xs text-slate-500 mt-6">
            Already have an account? <a href="{{ route('login') }}" class="text-blue-600 font-bold hover:underline">Log In</a>
        </p>
    </div>
</body>
</html>

