<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('booking.guest', 'booking.room')
            ->latest('payment_date')
            ->paginate(15);

        return view('admin.payments.index', compact('payments'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string|in:cash,card,online,bank_transfer',
            'transaction_id' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);

        $payment = Payment::create([
            'booking_id' => $booking->id,
            'invoice_number' => 'INV-' . strtoupper(Str::random(8)),
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'],
            'transaction_id' => $validated['transaction_id'] ?? null,
            'payment_date' => now(),
            'status' => 'completed',
            'notes' => $validated['notes'] ?? null,
        ]);

        // Update booking paid amount
        $booking->increment('paid_amount', $validated['amount']);

        return back()->with('success', "Payment of \${$payment->amount} recorded (Invoice: {$payment->invoice_number})");
    }

    public function invoice(Payment $payment)
    {
        $payment->load('booking.guest', 'booking.room.property');
        return view('admin.payments.invoice', compact('payment'));
    }
}
