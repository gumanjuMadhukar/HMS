<?php

namespace Modules\Finder\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Property;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FinderController extends Controller
{
    /**
     * User Finder Explore & Search page
     */
    public function index(Request $request)
    {
        $query = Room::with('property')->where('status', 'available');

        // City filter
        if ($request->filled('city')) {
            $city = $request->city;
            $query->whereHas('property', function ($q) use ($city) {
                $q->where('city', 'ilike', "%{$city}%");
            });
        }

        // Property type (hostel, hotel, apartment)
        if ($request->filled('property_type')) {
            $type = $request->property_type;
            $query->whereHas('property', function ($q) use ($type) {
                $q->where('type', $type);
            });
        }

        // Room type (single, double, dorm, deluxe)
        if ($request->filled('room_type')) {
            $query->where('type', $request->room_type);
        }

        // Max price filter
        if ($request->filled('max_price')) {
            $query->where('price_per_night', '<=', $request->max_price);
        }

        $rooms = $query->latest()->paginate(12);

        $cities = Property::distinct()->pluck('city')->filter()->values();
        $properties = Property::where('status', 'active')->withCount('rooms')->get();

        return view('finder.index', compact('rooms', 'cities', 'properties'));
    }

    /**
     * Finder - View Single Room Detail
     */
    public function show(Room $room)
    {
        $room->load('property');
        $similarRooms = Room::where('property_id', $room->property_id)
            ->where('id', '!=', $room->id)
            ->where('status', 'available')
            ->take(3)
            ->get();

        return view('finder.show', compact('room', 'similarRooms'));
    }

    /**
     * Finder - My Bookings Dashboard (Protected for Finder/Tenant role)
     */
    public function myBookings(Request $request)
    {
        $user = $request->user();

        $bookings = Booking::where('user_id', $user->id)
            ->orWhereHas('guest', function ($q) use ($user) {
                $q->where('email', $user->email);
            })
            ->with(['room.property', 'payments'])
            ->latest()
            ->paginate(10);

        return view('finder.my_bookings', compact('bookings'));
    }
}

