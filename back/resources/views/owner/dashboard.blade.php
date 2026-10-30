@extends('layouts.app')

@section('title', 'Owner Portal')
@section('page_title', 'Property Owner Dashboard')

@section('actions')
    <a href="{{ route('owner.properties.index') }}" class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition">
        <i data-lucide="building" class="w-4 h-4"></i>
        My Properties ({{ $myProperties->count() }})
    </a>
@endsection

@section('content')
<div class="space-y-6">
    <!-- Owner Greeting -->
    <div class="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-2">
                <i data-lucide="crown" class="w-3.5 h-3.5"></i> Property Owner Panel
            </span>
            <h2 class="text-2xl font-bold">Welcome back, {{ auth()->user()->name }}!</h2>
            <p class="text-xs text-indigo-200 mt-1">Manage your student hostels, hotels, room vacancies, and guest collections.</p>
        </div>
        <div class="flex items-center gap-3">
            <a href="{{ route('owner.properties.index') }}" class="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-indigo-950 hover:bg-indigo-50 transition shadow">
                + Add Property
            </a>
            <a href="{{ route('finder.index') }}" target="_blank" class="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-800 text-white hover:bg-indigo-700 transition">
                View on Finder &rarr;
            </a>
        </div>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
                <p class="text-xs font-semibold text-slate-500 uppercase">My Properties</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ $myProperties->count() }}</h3>
                <p class="text-xs text-slate-400 mt-1">Across {{ $myProperties->pluck('city')->unique()->count() }} City/Cities</p>
            </div>
            <div class="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <i data-lucide="building-2" class="w-6 h-6"></i>
            </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
                <p class="text-xs font-semibold text-slate-500 uppercase">Rooms & Capacity</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ $totalRooms }}</h3>
                <div class="flex items-center gap-2 mt-1 text-xs">
                    <span class="text-emerald-600 font-semibold">{{ $availableRooms }} Vacant</span>
                    <span class="text-slate-300">•</span>
                    <span class="text-rose-600 font-semibold">{{ $occupiedRooms }} Occupied</span>
                </div>
            </div>
            <div class="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <i data-lucide="bed-double" class="w-6 h-6"></i>
            </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
                <p class="text-xs font-semibold text-slate-500 uppercase">Occupancy</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ $occupancyRate }}%</h3>
                <div class="w-28 bg-slate-100 rounded-full h-1.5 mt-2">
                    <div class="bg-indigo-600 h-1.5 rounded-full" style="width: {{ $occupancyRate }}%"></div>
                </div>
            </div>
            <div class="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i data-lucide="activity" class="w-6 h-6"></i>
            </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
                <p class="text-xs font-semibold text-slate-500 uppercase">Total Collections</p>
                <h3 class="text-2xl font-bold text-emerald-600 mt-1">${{ number_format($totalEarnings, 2) }}</h3>
                <p class="text-xs text-slate-400 mt-1">{{ $activeStays }} Currently Checked-In</p>
            </div>
            <div class="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i data-lucide="badge-dollar-sign" class="w-6 h-6"></i>
            </div>
        </div>
    </div>

    <!-- My Properties Quick List -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
                <h3 class="text-base font-bold text-slate-900">Registered Properties</h3>
                <p class="text-xs text-slate-500">Your managed facilities</p>
            </div>
            <a href="{{ route('owner.properties.index') }}" class="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Manage Properties &rarr;</a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            @forelse($myProperties as $prop)
                <div class="border border-slate-200 rounded-2xl p-4 hover:border-indigo-300 transition hover:shadow-sm">
                    <div class="flex items-center justify-between">
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider {{ $prop->type === 'hostel' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800' }}">
                            {{ $prop->type }}
                        </span>
                        <span class="text-xs font-medium text-slate-400">{{ $prop->city }}</span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-base mt-2">{{ $prop->name }}</h4>
                    <p class="text-xs text-slate-500 mt-1">{{ $prop->address }}</p>
                    <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                        <span>{{ $prop->rooms->count() }} Rooms Registered</span>
                        <a href="{{ route('admin.rooms.index', ['property_id' => $prop->id]) }}" class="font-semibold text-indigo-600 hover:text-indigo-700">View Rooms &rarr;</a>
                    </div>
                </div>
            @empty
                <div class="col-span-3 py-8 text-center text-slate-400">
                    You haven't added any properties yet. Click "+ Add Property" to get started.
                </div>
            @endforelse
        </div>
    </div>
</div>
@endsection

