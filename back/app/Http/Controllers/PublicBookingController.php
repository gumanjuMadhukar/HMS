<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Property;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PublicBookingController extends Controller
{
    public function index()
    {
        $properties = Property::with(['rooms' => function ($q) {
            $q->where('status', 'available');
        }])->where('status', 'active')->get();

        $featuredRooms = Room::with('property')
            ->where('status', 'available')
            ->take(6)
            ->get();

        return view('public.home', compact('properties', 'featuredRooms'));
    }

    public function rooms(Request $request)
    {
        $query = Room::with('property')->where('status', 'available');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('property_id')) {
            $query->where('property_id', $request->property_id);
        }

        $rooms = $query->paginate(9);
        $properties = Property::where('status', 'active')->get();

        return view('public.rooms', compact('rooms', 'properties'));
    }

    public function bookRoom(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'notes' => 'nullable|string',
        ]);

        $room = Room::findOrFail($validated['room_id']);

        $guest = Guest::firstOrCreate(
            ['phone' => $validated['phone']],
            [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]
        );

        $checkIn = Carbon::parse($validated['check_in_date']);
        $checkOut = Carbon::parse($validated['check_out_date']);
        $nights = max(1, $checkIn->diffInDays($checkOut));
        $totalAmount = $nights * (float)$room->price_per_night;

        $booking = Booking::create([
            'booking_code' => 'BK-' . strtoupper(Str::random(6)),
            'property_id' => $room->property_id,
            'room_id' => $room->id,
            'guest_id' => $guest->id,
            'check_in_date' => $validated['check_in_date'],
            'check_out_date' => $validated['check_out_date'],
            'total_amount' => $totalAmount,
            'paid_amount' => 0,
            'status' => 'confirmed',
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('public.booking.confirmed', $booking->booking_code);
    }

    public function confirmed($bookingCode)
    {
        $booking = Booking::with(['room.property', 'guest'])
            ->where('booking_code', $bookingCode)
            ->firstOrFail();

        return view('public.confirmed', compact('booking'));
    }
}
