<?php

use Illuminate\Support\Facades\Route;
use Modules\Booking\Http\Controllers\BookingController;

Route::prefix('booking')->name('booking.')->group(function () {
    Route::get('/confirmed/{bookingCode}', [BookingController::class, 'confirmed'])->name('confirmed');
    Route::middleware('auth')->get('/my-bookings', [BookingController::class, 'myBookings'])->name('my-bookings');
});
