<?php

namespace Modules\Owner\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Room;
use Illuminate\Http\Request;

class OwnerDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Properties owned by this user (or all if super_admin)
        $propertyQuery = $user->hasRole('super_admin') 
            ? Property::query() 
            : Property::where('owner_id', $user->id);

        $myProperties = $propertyQuery->get();
        $propertyIds = $myProperties->pluck('id');

        $totalRooms = Room::whereIn('property_id', $propertyIds)->count();
        $occupiedRooms = Room::whereIn('property_id', $propertyIds)->where('status', 'occupied')->count();
        $availableRooms = Room::whereIn('property_id', $propertyIds)->where('status', 'available')->count();
        $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100) : 0;

        $bookings = Booking::whereIn('property_id', $propertyIds)
            ->with(['room', 'guest'])
            ->latest()
            ->take(8)
            ->get();

        $activeStays = Booking::whereIn('property_id', $propertyIds)
            ->where('status', 'checked_in')
            ->count();

        $bookingIds = Booking::whereIn('property_id', $propertyIds)->pluck('id');
        $totalEarnings = Payment::whereIn('booking_id', $bookingIds)->where('status', 'completed')->sum('amount');

        return view('owner.dashboard', compact(
            'myProperties',
            'totalRooms',
            'occupiedRooms',
            'availableRooms',
            'occupancyRate',
            'bookings',
            'activeStays',
            'totalEarnings'
        ));
    }
}

