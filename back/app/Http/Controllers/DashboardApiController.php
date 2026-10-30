<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Room;
use Illuminate\Http\Request;

class DashboardApiController extends Controller
{
    public function stats(Request $request)
    {
        $totalHotels = Property::hotels()->count();
        $totalHostels = Property::hostels()->count();
        $totalApartments = Property::apartments()->count();

        $totalRooms = Room::count();
        $occupiedRooms = Room::where('status', 'occupied')->count();
        $availableRooms = Room::where('status', 'available')->count();
        $maintenanceRooms = Room::where('status', 'maintenance')->count();

        $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100) : 0;

        $totalGuests = Guest::count();
        $activeHotelBookings = Booking::where('booking_type', 'hotel')->whereIn('status', ['confirmed', 'checked_in'])->count();
        $activeHostelStudents = Booking::where('booking_type', 'hostel')->where('status', 'checked_in')->count();
        $activeApartmentLeases = Booking::where('booking_type', 'apartment')->whereIn('status', ['confirmed', 'checked_in'])->count();

        $totalRevenue = Payment::where('status', 'completed')->sum('amount');
        
        $pendingDue = Booking::whereIn('status', ['confirmed', 'checked_in'])
            ->get()
            ->sum(fn($b) => $b->balance_due);

        $recentBookings = Booking::with(['property', 'room', 'bed', 'guest'])
            ->latest()
            ->take(8)
            ->get();

        $rooms = Room::with('property')
            ->orderBy('room_number')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_hotels' => $totalHotels,
                'total_hostels' => $totalHostels,
                'total_apartments' => $totalApartments,
                'total_rooms' => $totalRooms,
                'occupied_rooms' => $occupiedRooms,
                'available_rooms' => $availableRooms,
                'maintenance_rooms' => $maintenanceRooms,
                'occupancy_rate' => $occupancyRate,
                'total_guests' => $totalGuests,
                'active_hotel_bookings' => $activeHotelBookings,
                'active_hostel_students' => $activeHostelStudents,
                'active_apartment_leases' => $activeApartmentLeases,
                'total_revenue' => $totalRevenue,
                'pending_due' => $pendingDue,
                'recent_bookings' => $recentBookings,
                'rooms' => $rooms,
            ]
        ]);
    }
}

