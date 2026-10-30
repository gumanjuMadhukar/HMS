<?php

namespace Modules\Hotel\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\BookingConfirmationMail;
use App\Models\Booking;
use App\Models\Guest;
use App\Models\Property;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class HotelApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::hotels()->where('status', 'active')->with(['rooms' => function ($q) {
            $q->where('status', 'available');
        }]);

        if ($request->filled('city')) {
            $query->where('city', 'ilike', "%{$request->city}%");
        }

        if ($request->filled('star_rating')) {
            $query->where('star_rating', '>=', $request->star_rating);
        }

        $hotels = $query->latest()->paginate(12);
        $cities = Property::hotels()->distinct()->pluck('city')->filter()->values();

        return response()->json([
            'status' => 'success',
            'data' => $hotels,
            'cities' => $cities,
        ]);
    }

    public function show(string $slug)
    {
        $hotel = Property::hotels()
            ->where('slug', $slug)
            ->with(['rooms' => function ($q) {
                $q->where('status', 'available');
            }])
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $hotel,
        ]);
    }

    public function book(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'adults' => 'required|integer|min:1',
            'children' => 'nullable|integer|min:0',
            'meal_plan' => 'nullable|string|in:ep,cp,map',
            'notes' => 'nullable|string',
        ]);

        $room = Room::with('property')->findOrFail($validated['room_id']);

        $guest = Guest::firstOrCreate(
            ['phone' => $validated['phone']],
            [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'user_id' => auth('api')->id() ?? auth()->id(),
            ]
        );

        $checkIn = Carbon::parse($validated['check_in_date']);
        $checkOut = Carbon::parse($validated['check_out_date']);
        $nights = max(1, $checkIn->diffInDays($checkOut));
        $totalAmount = $nights * (float)$room->price_per_night;

        $booking = Booking::create([
            'booking_code' => 'HTL-' . strtoupper(Str::random(6)),
            'booking_type' => 'hotel',
            'property_id' => $room->property_id,
            'room_id' => $room->id,
            'guest_id' => $guest->id,
            'user_id' => auth('api')->id() ?? auth()->id(),
            'check_in_date' => $validated['check_in_date'],
            'check_out_date' => $validated['check_out_date'],
            'adults' => $validated['adults'],
            'children' => $validated['children'] ?? 0,
            'meal_plan' => $validated['meal_plan'] ?? 'ep',
            'total_amount' => $totalAmount,
            'paid_amount' => 0,
            'status' => 'confirmed',
            'notes' => $validated['notes'] ?? null,
        ]);

        // Send email confirmation to guest (viewable in Mailpit)
        try {
            Mail::to($guest->email)->send(new BookingConfirmationMail($booking));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Could not dispatch booking mail: " . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Hotel booking confirmed successfully! A confirmation email has been dispatched.',
            'data' => $booking->load(['property', 'room', 'guest']),
        ], 201);
    }
}

