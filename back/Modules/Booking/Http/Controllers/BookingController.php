<?php

namespace Modules\Booking\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Booking / Admission confirmation receipt
     */
    public function confirmed(string $bookingCode)
    {
        $booking = Booking::where('booking_code', $bookingCode)
            ->with(['property', 'room', 'bed', 'guest', 'payments'])
            ->firstOrFail();

        return view('booking::confirmed', compact('booking'));
    }

    /**
     * User's Personal Bookings & Admissions
     */
    public function myBookings(Request $request)
    {
        $user = $request->user();

        $bookings = Booking::where('user_id', $user->id)
            ->orWhereHas('guest', function ($q) use ($user) {
                $q->where('email', $user->email);
            })
            ->with(['property', 'room', 'bed', 'payments'])
            ->latest()
            ->paginate(10);

        return view('finder.my_bookings', compact('bookings'));
    }
}
