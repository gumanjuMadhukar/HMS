<?php

namespace Modules\Hostel\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Guest;
use App\Models\Property;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Modules\Hostel\Models\HostelBed;

class HostelController extends Controller
{
    /**
     * Public Hostel Catalog & Search (Boys, Girls, Working Professionals)
     */
    public function index(Request $request)
    {
        $query = Property::hostels()->where('status', 'active')->with(['rooms.beds' => function ($q) {
            $q->where('status', 'available');
        }]);

        if ($request->filled('city')) {
            $city = $request->city;
            $query->where('city', 'ilike', "%{$city}%");
        }

        if ($request->filled('gender_policy')) {
            $query->where('gender_policy', $request->gender_policy);
        }

        $hostels = $query->paginate(9);
        $cities = Property::hostels()->distinct()->pluck('city')->filter()->values();

        return view('hostel::index', compact('hostels', 'cities'));
    }

    /**
     * Single Hostel Detail with Bed Vacancies
     */
    public function show(string $slug)
    {
        $hostel = Property::hostels()
            ->where('slug', $slug)
            ->with(['rooms.beds'])
            ->firstOrFail();

        return view('hostel::show', compact('hostel'));
    }

    /**
     * Submit Hostel Admission Application
     */
    public function applyAdmission(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'hostel_bed_id' => 'nullable|exists:hostel_beds,id',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'email' => 'required|email|max:255',
            'institution' => 'required|string|max:255', // College or Company
            'guardian_name' => 'required|string|max:255',
            'guardian_phone' => 'required|string|max:50',
            'emergency_contact' => 'nullable|string|max:50',
            'blood_group' => 'nullable|string|max:10',
            'id_type' => 'required|string|in:citizenship,passport,student_id',
            'id_number' => 'required|string|max:100',
            'admission_date' => 'required|date',
            'meal_plan' => 'required|string|in:full_mess,breakfast_dinner,no_meals',
            'notes' => 'nullable|string',
        ]);

        $room = Room::with('property')->findOrFail($validated['room_id']);

        $guest = Guest::updateOrCreate(
            ['phone' => $validated['phone']],
            [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'institution' => $validated['institution'],
                'guardian_name' => $validated['guardian_name'],
                'guardian_phone' => $validated['guardian_phone'],
                'emergency_contact' => $validated['emergency_contact'] ?? null,
                'blood_group' => $validated['blood_group'] ?? null,
                'id_type' => $validated['id_type'],
                'id_number' => $validated['id_number'],
                'user_id' => auth()->id(),
            ]
        );

        $bed = null;
        if (!empty($validated['hostel_bed_id'])) {
            $bed = HostelBed::find($validated['hostel_bed_id']);
        }

        $monthlyRate = $bed ? $bed->monthly_rate : $room->price_per_month;

        $booking = Booking::create([
            'booking_code' => 'HST-' . strtoupper(Str::random(6)),
            'booking_type' => 'hostel',
            'property_id' => $room->property_id,
            'room_id' => $room->id,
            'hostel_bed_id' => $bed ? $bed->id : null,
            'guest_id' => $guest->id,
            'user_id' => auth()->id(),
            'check_in_date' => $validated['admission_date'],
            'check_out_date' => Carbon::parse($validated['admission_date'])->addMonths(1), // First month fee cycle
            'meal_plan' => $validated['meal_plan'],
            'total_amount' => $monthlyRate,
            'paid_amount' => 0,
            'status' => 'confirmed',
            'notes' => $validated['notes'] ?? null,
        ]);

        if ($bed) {
            $bed->update(['status' => 'reserved']);
        }

        return redirect()->route('booking.confirmed', $booking->booking_code);
    }
}
