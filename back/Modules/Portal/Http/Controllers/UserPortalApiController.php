<?php

namespace Modules\Portal\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserPortalApiController extends Controller
{
    /**
     * Get user's active & past bookings (Hotel & Hostel)
     */
    public function myBookings(Request $request)
    {
        $userId = $this->getApiUserId($request, 4);

        $bookings = Booking::where(function ($q) use ($userId, $request) {
                $q->where('user_id', $userId);
                if ($request->filled('email')) {
                    $q->orWhereHas('guest', fn($g) => $g->where('email', $request->email));
                }
            })
            ->with(['property', 'room', 'bed', 'guest', 'payments'])
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $bookings,
        ]);
    }

    /**
     * Pay a booking invoice / bill via simulated Gateway (eSewa, Khalti, Stripe, Cash)
     */
    public function payBooking(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'gateway' => 'required|string|in:esewa,khalti,card,cash',
            'amount' => 'required|numeric|min:1',
        ]);

        $payment = Payment::create([
            'booking_id' => $booking->id,
            'invoice_number' => 'INV-' . strtoupper(Str::random(8)),
            'gateway' => $validated['gateway'],
            'transaction_reference' => 'TXN-' . strtoupper($validated['gateway']) . '-' . rand(100000, 999999),
            'amount' => $validated['amount'],
            'currency' => $booking->property->currency ?? 'NPR',
            'status' => 'completed',
            'paid_at' => now(),
        ]);

        $newPaidTotal = $booking->paid_amount + $validated['amount'];
        $booking->update([
            'paid_amount' => $newPaidTotal,
            'status' => $booking->status === 'pending' ? 'confirmed' : $booking->status,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Payment of NPR {$validated['amount']} recorded via " . strtoupper($validated['gateway']) . "!",
            'data' => [
                'payment' => $payment,
                'booking' => $booking->fresh(['property', 'room', 'bed', 'payments']),
            ],
        ]);
    }

    /**
     * Request booking cancellation
     */
    public function cancelBooking(Booking $booking)
    {
        $booking->update(['status' => 'cancelled']);

        if ($booking->room) {
            $booking->room->update(['status' => 'available']);
        }
        if ($booking->bed) {
            $booking->bed->update(['status' => 'available']);
        }

        return response()->json([
            'status' => 'success',
            'message' => "Booking {$booking->booking_code} cancelled successfully.",
            'data' => $booking,
        ]);
    }
}
