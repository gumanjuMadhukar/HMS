<?php

namespace Modules\Billing\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BillingController extends Controller
{
    public function index()
    {
        $payments = Payment::with('booking.guest', 'booking.room.property')
            ->latest('payment_date')
            ->paginate(15);

        return view('billing::index', compact('payments'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string|in:cash,esewa,khalti,card,bank_transfer',
            'transaction_id' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);

        $payment = Payment::create([
            'booking_id' => $booking->id,
            'invoice_number' => 'INV-' . strtoupper(Str::random(8)),
            'amount' => $validated['amount'],
            'currency' => $booking->property->currency ?? 'NPR',
            'payment_method' => $validated['payment_method'],
            'transaction_id' => $validated['transaction_id'] ?? null,
            'payment_date' => now(),
            'status' => 'completed',
            'notes' => $validated['notes'] ?? null,
        ]);

        $booking->increment('paid_amount', $validated['amount']);

        return back()->with('success', "Payment of {$payment->currency} {$payment->amount} recorded! Invoice #{$payment->invoice_number}");
    }

    public function invoice(Payment $payment)
    {
        $payment->load('booking.guest', 'booking.room.property', 'booking.bed');
        return view('billing::invoice', compact('payment'));
    }
}
