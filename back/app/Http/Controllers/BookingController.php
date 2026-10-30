<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['room.property', 'guest', 'payments']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $bookings = $query->latest()->paginate(15);
        $availableRooms = Room::where('status', 'available')->with('property')->get();
        $guests = Guest::orderBy('name')->get();

        return view('admin.bookings.index', compact('bookings', 'availableRooms', 'guests'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'nullable|email|max:255',
            'guest_phone' => 'required|string|max:50',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'paid_amount' => 'nullable|numeric|min:0',
            'payment_method' => 'nullable|string|in:cash,card,online,bank_transfer',
            'notes' => 'nullable|string',
        ]);

        // Find or create guest
        $guest = Guest::firstOrCreate(
            ['phone' => $validated['guest_phone']],
            [
                'name' => $validated['guest_name'],
                'email' => $validated['guest_email'] ?? null,
            ]
        );

        $room = Room::findOrFail($validated['room_id']);

        // Calculate nights and price
        $checkIn = Carbon::parse($validated['check_in_date']);
        $checkOut = Carbon::parse($validated['check_out_date']);
        $nights = max(1, $checkIn->diffInDays($checkOut));
        $totalAmount = $nights * (float)$room->price_per_night;

        $paidAmount = (float)($validated['paid_amount'] ?? 0);

        $booking = Booking::create([
            'booking_code' => 'BK-' . strtoupper(Str::random(6)),
            'property_id' => $room->property_id,
            'room_id' => $room->id,
            'guest_id' => $guest->id,
            'check_in_date' => $validated['check_in_date'],
            'check_out_date' => $validated['check_out_date'],
            'total_amount' => $totalAmount,
            'paid_amount' => $paidAmount,
            'status' => 'confirmed',
            'notes' => $validated['notes'] ?? null,
        ]);

        // Mark room as occupied if check-in is today
        if ($checkIn->isToday()) {
            $room->update(['status' => 'occupied']);
            $booking->update(['status' => 'checked_in']);
        }

        // Record initial payment if provided
        if ($paidAmount > 0) {
            Payment::create([
                'booking_id' => $booking->id,
                'invoice_number' => 'INV-' . strtoupper(Str::random(8)),
                'amount' => $paidAmount,
                'payment_method' => $validated['payment_method'] ?? 'cash',
                'payment_date' => now(),
                'status' => 'completed',
            ]);
        }

        return redirect()->route('admin.bookings.index')->with('success', "Booking {$booking->booking_code} created successfully!");
    }

    public function checkIn(Booking $booking)
    {
        $booking->update(['status' => 'checked_in']);
        $booking->room->update(['status' => 'occupied']);

        return back()->with('success', "Guest checked in to Room {$booking->room->room_number}!");
    }

    public function checkOut(Booking $booking)
    {
        $booking->update(['status' => 'checked_out']);
        $booking->room->update(['status' => 'available']);

        return back()->with('success', "Guest checked out. Room {$booking->room->room_number} is now available!");
    }

    public function cancel(Booking $booking)
    {
        $booking->update(['status' => 'cancelled']);
        $booking->room->update(['status' => 'available']);

        return back()->with('success', "Booking {$booking->booking_code} was cancelled.");
    }
}
