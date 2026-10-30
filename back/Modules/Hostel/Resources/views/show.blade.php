<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $hostel->name }} - HMS Hostel Management</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="min-h-full font-sans antialiased text-slate-800 flex flex-col">
    <!-- Navbar -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="{{ route('hostels.index') }}" class="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm">
                &larr; Back to Hostels
            </a>
            <div class="font-bold text-slate-900">{{ $hostel->name }}</div>
            <a href="{{ route('home') }}" class="text-xs text-amber-600 font-semibold hover:underline">HMS Portal</a>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <!-- Hostel Profile Header -->
        <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                        {{ str_replace('_', ' ', $hostel->gender_policy) }}
                    </span>
                    <h1 class="text-3xl font-extrabold text-slate-900 mt-2">{{ $hostel->name }}</h1>
                    <p class="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                        <i data-lucide="map-pin" class="w-4 h-4 text-amber-500"></i>
                        {{ $hostel->address }}, {{ $hostel->city }}
                    </p>
                </div>
                <div class="text-right">
                    <span class="text-xs text-slate-400 font-medium block">Warden / Admission Desk</span>
                    <p class="font-bold text-slate-800 text-sm">{{ $hostel->phone ?? '+977-98XXXXXXXX' }}</p>
                    <p class="text-xs text-slate-500">{{ $hostel->email ?? 'warden@hostel.local' }}</p>
                </div>
            </div>

            <p class="text-sm text-slate-600 mt-6 leading-relaxed border-t border-slate-100 pt-6">
                {{ $hostel->description }}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-600">
                <div class="flex items-center gap-2">
                    <i data-lucide="utensils" class="w-4 h-4 text-amber-600"></i>
                    <span>Mess Meals: 4 Times Daily (Breakfast, Lunch, Snacks, Dinner)</span>
                </div>
                <div class="flex items-center gap-2">
                    <i data-lucide="clock" class="w-4 h-4 text-amber-600"></i>
                    <span>Gate Curfew: 09:00 PM (Strict Biometric Attendance)</span>
                </div>
                <div class="flex items-center gap-2">
                    <i data-lucide="shield-check" class="w-4 h-4 text-amber-600"></i>
                    <span>CCTV & Warden Resident Security</span>
                </div>
            </div>
        </div>

        <!-- Available Rooms & Bed Allocations -->
        <h2 class="text-2xl font-bold text-slate-900 mb-6">Available Rooms & Dorm Beds</h2>

        <div class="space-y-6">
            @forelse($hostel->rooms as $room)
                <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6" x-data="{ applyModal: false }">
                    <div class="flex-1">
                        <div class="flex items-center gap-3">
                            <h3 class="text-xl font-bold text-slate-900">Room {{ $room->room_number }} ({{ ucfirst($room->type) }})</h3>
                            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                                {{ $room->beds->where('status', 'available')->count() }} Bed(s) Vacant
                            </span>
                        </div>
                        <p class="text-xs text-slate-500 mt-1">Floor {{ $room->floor }} • Total Seater: {{ $room->capacity }} Person(s)</p>
                        <p class="text-xs text-slate-600 mt-2">{{ $room->description }}</p>

                        <!-- Bed Pills -->
                        <div class="flex items-center gap-2 mt-4">
                            <span class="text-xs font-bold text-slate-400 uppercase">Beds:</span>
                            @foreach($room->beds as $b)
                                <span class="px-2 py-0.5 rounded text-xs font-mono font-medium {{ $b->status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400 line-through' }}">
                                    {{ $b->bed_number }}
                                </span>
                            @endforeach
                        </div>
                    </div>

                    <div class="flex md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                        <div>
                            <span class="text-2xl font-bold text-slate-900">${{ number_format($room->price_per_month, 0) }}</span>
                            <span class="text-xs text-slate-400">/ month</span>
                        </div>

                        <button @click="applyModal = true" class="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition">
                            Apply for Admission
                        </button>

                        <!-- Admission Modal -->
                        <div x-show="applyModal" class="fixed inset-0 z-50 overflow-y-auto text-left" style="display: none;">
                            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="applyModal = false"></div>
                            <div class="flex items-center justify-center min-h-screen p-4">
                                <div class="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border">
                                    <div class="flex items-center justify-between pb-3 border-b">
                                        <div>
                                            <h4 class="font-bold text-slate-900 text-base">Hostel Admission Form</h4>
                                            <p class="text-xs text-slate-500">Room {{ $room->room_number }} - {{ $hostel->name }}</p>
                                        </div>
                                        <button @click="applyModal = false" class="text-slate-400 hover:text-slate-600">&times;</button>
                                    </div>

                                    <form action="{{ route('hostels.admission') }}" method="POST" class="mt-4 space-y-3">
                                        @csrf
                                        <input type="hidden" name="room_id" value="{{ $room->id }}">

                                        <div>
                                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Bed / Allocation</label>
                                            <select name="hostel_bed_id" class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                                @foreach($room->beds->where('status', 'available') as $b)
                                                    <option value="{{ $b->id }}">{{ $b->bed_number }} ({{ ucfirst($b->bed_type) }}) - ${{ number_format($b->monthly_rate, 0) }}/mo</option>
                                                @endforeach
                                            </select>
                                        </div>

                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Student / Tenant Name</label>
                                                <input type="text" name="name" value="{{ auth()->user()->name ?? '' }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Contact Phone</label>
                                                <input type="text" name="phone" placeholder="+977-98..." required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Email</label>
                                                <input type="email" name="email" value="{{ auth()->user()->email ?? '' }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">College / Organization</label>
                                                <input type="text" name="institution" placeholder="TU / Apex College" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Guardian Name</label>
                                                <input type="text" name="guardian_name" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Guardian Phone</label>
                                                <input type="text" name="guardian_phone" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-3 gap-3">
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">ID Document</label>
                                                <select name="id_type" class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                                    <option value="citizenship">Citizenship</option>
                                                    <option value="passport">Passport</option>
                                                    <option value="student_id">Student ID</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">ID Number</label>
                                                <input type="text" name="id_number" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                            <div>
                                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Admission Date</label>
                                                <input type="date" name="admission_date" value="{{ date('Y-m-d') }}" required class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                            </div>
                                        </div>

                                        <div>
                                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Mess / Meal Choice</label>
                                            <select name="meal_plan" class="w-full text-sm rounded-lg border border-slate-300 p-2.5">
                                                <option value="full_mess">Full Mess (4 Meals Daily - Breakfast, Lunch, Tea, Dinner)</option>
                                                <option value="breakfast_dinner">Breakfast & Dinner Only</option>
                                                <option value="no_meals">Room Only / Self Cooking</option>
                                            </select>
                                        </div>

                                        <div class="flex justify-end gap-2 pt-3 border-t">
                                            <button type="button" @click="applyModal = false" class="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                            <button type="submit" class="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-sm">Submit Admission</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            @empty
                <div class="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400">
                    No rooms listed for this hostel.
                </div>
            @endforelse
        </div>
    </main>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
