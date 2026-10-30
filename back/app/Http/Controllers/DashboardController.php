<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Room;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalRooms = Room::count();
        $occupiedRooms = Room::where('status', 'occupied')->count();
        $availableRooms = Room::where('status', 'available')->count();
        $maintenanceRooms = Room::where('status', 'maintenance')->count();

        $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100) : 0;

        $totalGuests = Guest::count();
        $activeBookings = Booking::whereIn('status', ['confirmed', 'checked_in'])->count();
        $totalRevenue = Payment::where('status', 'completed')->sum('amount');
        
        $pendingPayments = Booking::whereIn('status', ['confirmed', 'checked_in'])
            ->get()
            ->sum(fn($b) => $b->balance_due);

        $recentBookings = Booking::with(['room.property', 'guest'])
            ->latest()
            ->take(6)
            ->get();

        $rooms = Room::with('property')
            ->orderBy('room_number')
            ->get();

        return view('admin.dashboard', compact(
            'totalRooms',
            'occupiedRooms',
            'availableRooms',
            'maintenanceRooms',
            'occupancyRate',
            'totalGuests',
            'activeBookings',
            'totalRevenue',
            'pendingPayments',
            'recentBookings',
            'rooms'
        ));
    }
}
