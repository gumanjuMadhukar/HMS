<?php

namespace Modules\Booking\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['property', 'room', 'bed', 'guest', 'payments']);

        if ($request->filled('type')) {
            $query->where('booking_type', $request->type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $bookings = $query->latest()->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $bookings,
        ]);
    }

    public function show(string $code)
    {
        $booking = Booking::where('booking_code', $code)
            ->with(['property', 'room', 'bed', 'guest', 'payments'])
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $booking,
        ]);
    }

    public function checkIn(Booking $booking)
    {
        $booking->update(['status' => 'checked_in']);
        $booking->room->update(['status' => 'occupied']);
        if ($booking->bed) {
            $booking->bed->update(['status' => 'occupied']);
        }

        return response()->json([
            'status' => 'success',
            'message' => "Checked in guest {$booking->guest->name} to Room {$booking->room->room_number}",
            'data' => $booking->fresh(['property', 'room', 'bed', 'guest']),
        ]);
    }

    public function checkOut(Booking $booking)
    {
        $booking->update(['status' => 'checked_out']);
        $booking->room->update(['status' => 'available']);
        if ($booking->bed) {
            $booking->bed->update(['status' => 'available']);
        }

        return response()->json([
            'status' => 'success',
            'message' => "Checked out guest {$booking->guest->name}. Room is now available.",
            'data' => $booking->fresh(['property', 'room', 'bed', 'guest']),
        ]);
    }

    public function cancel(Booking $booking)
    {
        $booking->update(['status' => 'cancelled']);
        $booking->room->update(['status' => 'available']);
        if ($booking->bed) {
            $booking->bed->update(['status' => 'available']);
        }

        return response()->json([
            'status' => 'success',
            'message' => "Booking {$booking->booking_code} cancelled.",
            'data' => $booking->fresh(),
        ]);
    }
}

