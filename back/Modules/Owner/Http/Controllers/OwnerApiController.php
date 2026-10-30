<?php

namespace Modules\Owner\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Property;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Modules\Hostel\Models\HostelBed;

class OwnerApiController extends Controller
{
    /**
     * Get owner's properties list
     */
    public function getProperties(Request $request)
    {
        $ownerId = $this->getApiUserId($request, 2);

        $properties = Property::where('owner_id', $ownerId)
            ->with(['rooms.beds'])
            ->withCount(['rooms', 'bookings'])
            ->get();

        // If no properties found for specific owner, return all active for demo
        if ($properties->isEmpty()) {
            $properties = Property::with(['rooms.beds'])->withCount(['rooms', 'bookings'])->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $properties,
        ]);
    }

    /**
     * Create a new Property (Hotel or Hostel)
     */
    public function storeProperty(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:hotel,hostel,apartment,home_rental',
            'property_type' => 'required|string',
            'gender_policy' => 'nullable|in:boys_only,girls_only,co_ed',
            'star_rating' => 'nullable|integer|min:1|max:5',
            'city' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email',
            'description' => 'required|string',
            'currency' => 'nullable|string|in:NPR,USD,EUR',
        ]);

        $ownerId = $this->getApiUserId($request, 2);

        $property = Property::create([
            'owner_id' => $ownerId,
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . rand(100, 999),
            'category' => $validated['category'],
            'property_type' => $validated['property_type'],
            'gender_policy' => $validated['gender_policy'] ?? 'co_ed',
            'star_rating' => $validated['star_rating'] ?? 3,
            'address' => $validated['address'],
            'city' => $validated['city'],
            'country' => 'Nepal',
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'description' => $validated['description'],
            'currency' => $validated['currency'] ?? 'NPR',
            'status' => 'active',
            'amenities' => ['wifi', 'hot_water', 'power_backup'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Property created successfully!',
            'data' => $property,
        ], 201);
    }

    /**
     * Add a Room to a Property
     */
    public function storeRoom(Request $request, Property $property)
    {
        $validated = $request->validate([
            'room_number' => 'required|string|max:50',
            'floor' => 'required|string|max:20',
            'type' => 'required|in:single,double,triple,dorm,deluxe,suite',
            'capacity' => 'required|integer|min:1',
            'price_per_night' => 'nullable|numeric|min:0',
            'price_per_month' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $room = Room::create([
            'property_id' => $property->id,
            'room_number' => $validated['room_number'],
            'floor' => $validated['floor'],
            'type' => $validated['type'],
            'capacity' => $validated['capacity'],
            'total_beds' => $validated['capacity'],
            'price_per_night' => $validated['price_per_night'] ?? 0,
            'price_per_month' => $validated['price_per_month'] ?? 0,
            'description' => $validated['description'] ?? "{$validated['type']} room on floor {$validated['floor']}",
            'status' => 'available',
        ]);

        // If it's a hostel room, automatically generate hostel beds
        if ($property->category === 'hostel') {
            for ($i = 1; $i <= $validated['capacity']; $i++) {
                HostelBed::create([
                    'room_id' => $room->id,
                    'bed_number' => "{$room->room_number}-B{$i}",
                    'tier' => 'standard',
                    'monthly_rate' => $validated['price_per_month'] ?: 12000,
                    'status' => 'available',
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Room and capacity initialized successfully!',
            'data' => $room->load('beds'),
        ], 201);
    }

    /**
     * Owner Analytics & Revenue
     */
    public function analytics(Request $request)
    {
        $ownerId = $this->getApiUserId($request, 2);

        $propertyIds = Property::where('owner_id', $ownerId)->pluck('id');
        if ($propertyIds->isEmpty()) {
            $propertyIds = Property::pluck('id');
        }

        $totalRooms = Room::whereIn('property_id', $propertyIds)->count();
        $occupiedRooms = Room::whereIn('property_id', $propertyIds)->where('status', 'occupied')->count();
        $totalBeds = HostelBed::whereHas('room', fn($q) => $q->whereIn('property_id', $propertyIds))->count();
        $occupiedBeds = HostelBed::whereHas('room', fn($q) => $q->whereIn('property_id', $propertyIds))->where('status', 'occupied')->count();

        $totalRevenue = Booking::whereIn('property_id', $propertyIds)->sum('paid_amount');
        $activeBookings = Booking::whereIn('property_id', $propertyIds)->whereIn('status', ['confirmed', 'checked_in'])->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_properties' => $propertyIds->count(),
                'total_rooms' => $totalRooms,
                'occupied_rooms' => $occupiedRooms,
                'room_occupancy_rate' => $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 1) : 0,
                'total_beds' => $totalBeds,
                'occupied_beds' => $occupiedBeds,
                'bed_occupancy_rate' => $totalBeds > 0 ? round(($occupiedBeds / $totalBeds) * 100, 1) : 0,
                'active_reservations' => $activeBookings,
                'total_revenue' => (float)$totalRevenue,
                'currency' => 'NPR',
            ],
        ]);
    }
}
