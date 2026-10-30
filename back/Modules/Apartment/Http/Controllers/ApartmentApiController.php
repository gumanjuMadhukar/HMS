<?php

namespace Modules\Apartment\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\ApartmentLeaseMail;
use App\Models\Booking;
use App\Models\Guest;
use App\Models\Property;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ApartmentApiController extends Controller
{
    /**
     * List all Apartments & Home Rentals with Tiered Packages (Economy, Premium, Luxurious)
     */
    public function index(Request $request)
    {
        $query = Property::apartments()
            ->where('status', 'active')
            ->with(['rooms' => function ($q) {
                $q->where('status', 'available');
            }]);

        if ($request->filled('city')) {
            $query->where('city', 'ilike', "%{$request->city}%");
        }

        if ($request->filled('tier')) {
            // Tier package filter (economy, premium, luxury)
            $tier = strtolower($request->tier);
            if ($tier === 'economy') {
                $query->where('star_rating', '<=', 3);
            } elseif ($tier === 'premium') {
                $query->where('star_rating', 4);
            } elseif ($tier === 'luxury' || $tier === 'luxurious') {
                $query->where('star_rating', 5);
            }
        }

        if ($request->filled('property_type')) {
            $query->where('property_type', $request->property_type);
        }

        $apartments = $query->latest()->paginate(15);
        $cities = Property::apartments()->distinct()->pluck('city');

        return response()->json([
            'status' => 'success',
            'data' => $apartments,
            'cities' => $cities,
        ]);
    }

    /**
     * Get single apartment / home rental detail
     */
    public function show(string $slug)
    {
        $apartment = Property::apartments()
            ->where('slug', $slug)
            ->with(['rooms.beds'])
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $apartment,
        ]);
    }

    /**
     * Book / Lease an Apartment or Vacation Home
     */
    public function book(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'move_in_date' => 'required|date|after_or_equal:today',
            'lease_duration_months' => 'nullable|integer|min:1|max:36',
            'lease_duration_days' => 'nullable|integer|min:1|max:365',
            'adults' => 'required|integer|min:1',
            'children' => 'nullable|integer|min:0',
            'package_tier' => 'nullable|string|in:economy,premium,luxury',
            'notes' => 'nullable|string',
        ]);

        $room = Room::with('property')->findOrFail($validated['room_id']);

        $guest = Guest::firstOrCreate(
            ['phone' => $validated['phone']],
            [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'user_id' => $this->getApiUserId($request, 4),
            ]
        );

        $moveIn = Carbon::parse($validated['move_in_date']);
        
        // Calculate total amount based on months or days
        if (!empty($validated['lease_duration_months'])) {
            $months = (int) $validated['lease_duration_months'];
            $moveOut = (clone $moveIn)->addMonths($months);
            $monthlyRate = (float) $room->price_per_month ?: 25000;
            $totalAmount = $months * $monthlyRate;
        } else {
            $days = (int) ($validated['lease_duration_days'] ?? 3);
            $moveOut = (clone $moveIn)->addDays($days);
            $nightlyRate = (float) $room->price_per_night ?: 3500;
            $totalAmount = $days * $nightlyRate;
        }

        $booking = Booking::create([
            'booking_code' => 'APT-' . strtoupper(Str::random(6)),
            'booking_type' => 'apartment',
            'property_id' => $room->property_id,
            'room_id' => $room->id,
            'guest_id' => $guest->id,
            'user_id' => $this->getApiUserId($request, 4),
            'check_in_date' => $moveIn->toDateString(),
            'check_out_date' => $moveOut->toDateString(),
            'adults' => $validated['adults'],
            'children' => $validated['children'] ?? 0,
            'meal_plan' => 'self_kitchen',
            'total_amount' => $totalAmount,
            'paid_amount' => 0,
            'status' => 'confirmed',
            'notes' => $validated['notes'] ?? ("Package: " . ($validated['package_tier'] ?? 'Standard')),
        ]);

        // Send email confirmation
        try {
            Mail::to($guest->email)->send(new ApartmentLeaseMail($booking));
        } catch (\Throwable $e) {
            Log::warning("Could not dispatch apartment lease mail: " . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Apartment lease confirmed! Official lease summary dispatched to your inbox.',
            'data' => $booking->load(['property', 'room', 'guest']),
        ], 201);
    }
}
