<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function index(Request $request)
    {
        $query = Guest::withCount('bookings');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('phone', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        $guests = $query->latest()->paginate(15);

        return view('admin.guests.index', compact('guests'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50|unique:guests,phone',
            'email' => 'nullable|email|max:255',
            'id_type' => 'nullable|string|in:passport,national_id,student_id',
            'id_number' => 'nullable|string|max:100',
            'emergency_contact' => 'nullable|string|max:100',
            'address' => 'nullable|string',
        ]);

        Guest::create($validated);

        return redirect()->route('admin.guests.index')->with('success', 'Tenant/Guest added successfully!');
    }
}
